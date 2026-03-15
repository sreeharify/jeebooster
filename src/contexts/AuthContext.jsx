import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Exact columns in the DB — must match what edit.sql created
const COLS = 'id,username,email,google_avatar,xp,xp_today,level,streak,daily_goal,last_activity,completed_lessons,achievements,created_at'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ── Single source of truth: onAuthStateChange ──────────────
    // This fires for EVERY auth event including:
    //   INITIAL_SESSION  — on page load / refresh (from localStorage)
    //   SIGNED_IN        — after Google OAuth redirect completes
    //   TOKEN_REFRESHED  — when access token silently refreshes
    //   SIGNED_OUT       — after sign out
    //
    // We do NOT use getSession() separately — it races with this
    // listener and causes the "timeout fired" bug on Cloudflare.

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth]', event, session?.user?.email ?? 'no user')

        const u = session?.user ?? null
        setUser(u)

        if (u) {
          await loadOrCreateProfile(u)
        } else {
          setProfile(null)
        }

        // Always clear loading after the first event, whatever it is
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Profile loader ──────────────────────────────────────────
  async function loadOrCreateProfile(u) {
    // Fetch existing row
    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select(COLS)
      .eq('id', u.id)
      .maybeSingle()

    if (fetchErr) {
      console.error('[Auth] profile fetch error:', fetchErr.message)
      // Use Google metadata as fallback so UI is not blank
      setProfile(buildFallback(u))
      return
    }

    if (existing) {
      setProfile(existing)
      return
    }

    // No row — create one (new user)
    const { data: created, error: insertErr } = await supabase
      .from('profiles')
      .insert(buildNewRow(u))
      .select(COLS)
      .single()

    if (insertErr) {
      console.error('[Auth] profile insert error:', insertErr.message)
      setProfile(buildFallback(u))
    } else {
      setProfile(created)
    }
  }

  function buildNewRow(u) {
    return {
      id:                u.id,
      email:             u.email,
      username:          u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Learner',
      google_avatar:     u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      xp:                0,
      xp_today:          0,
      streak:            0,
      level:             1,
      daily_goal:        100,
      completed_lessons: [],
      achievements:      [],
      last_activity:     new Date().toISOString(),
    }
  }

  function buildFallback(u) {
    return {
      id:                u.id,
      email:             u.email,
      username:          u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Learner',
      google_avatar:     u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      xp: 0, xp_today: 0, streak: 0, level: 1,
      daily_goal: 100, completed_lessons: [], achievements: [],
    }
  }

  // ── Public methods ──────────────────────────────────────────
  async function fetchProfile() {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles').select(COLS).eq('id', user.id).maybeSingle()
    if (error) console.error('[Auth] fetchProfile error:', error.message)
    if (data)  setProfile(data)
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'not authenticated' }

    // Strip any columns that were removed from the schema
    const safe = Object.fromEntries(
      Object.entries(updates).filter(([k]) =>
        !['gems','hearts','avatar'].includes(k)
      )
    )

    const { data, error } = await supabase
      .from('profiles')
      .update(safe)
      .eq('id', user.id)
      .select(COLS)
      .single()

    if (error) {
      console.error('[Auth] updateProfile error:', error.message, error.details)
    } else if (data) {
      setProfile(data)
    }
    return { data: data ?? null, error: error ?? null }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) throw error
  }

  async function signOut() {
    setProfile(null)
    setUser(null)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInWithGoogle, signOut,
      updateProfile, fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
