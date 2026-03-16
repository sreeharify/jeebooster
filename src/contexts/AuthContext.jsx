import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const COLS = 'id,username,email,google_avatar,xp,xp_today,level,streak,daily_goal,last_activity,completed_lessons,achievements,created_at'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth]', event, session?.user?.email ?? 'no user')

        const u = session?.user ?? null
        setUser(u)

        if (!u) {
          setProfile(null)
          setLoading(false)   // ← always clear loading immediately
          return
        }

        // Clear loading RIGHT NOW — don't wait for the DB query
        // The profile will arrive shortly and update the UI
        setLoading(false)

        // Load profile in background — non-blocking
        loadOrCreateProfile(u)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadOrCreateProfile(u) {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select(COLS)
        .eq('id', u.id)
        .maybeSingle()

      if (fetchErr) {
        console.error('[Auth] profile fetch error:', fetchErr.message)
        setProfile(buildFallback(u))
        return
      }

      if (existing) {
        setProfile(existing)
        return
      }

      // New user — insert
      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .insert(buildNewRow(u))
        .select(COLS)
        .single()

      if (insertErr) {
        console.error('[Auth] insert error:', insertErr.message)
        setProfile(buildFallback(u))
      } else {
        setProfile(created)
      }
    } catch (err) {
      console.error('[Auth] loadOrCreateProfile threw:', err)
      setProfile(buildFallback(u))
    }
  }

  function buildNewRow(u) {
    return {
      id:                u.id,
      email:             u.email,
      username:          u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Learner',
      google_avatar:     u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      xp: 0, xp_today: 0, streak: 0, level: 1,
      daily_goal: 100, completed_lessons: [], achievements: [],
      last_activity: new Date().toISOString(),
    }
  }

  function buildFallback(u) {
    return {
      id:            u.id,
      email:         u.email,
      username:      u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Learner',
      google_avatar: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      xp: 0, xp_today: 0, streak: 0, level: 1,
      daily_goal: 100, completed_lessons: [], achievements: [],
    }
  }

  async function fetchProfile() {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles').select(COLS).eq('id', user.id).maybeSingle()
    if (error) console.error('[Auth] fetchProfile error:', error.message)
    if (data)  setProfile(data)
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'not authenticated' }
    const safe = Object.fromEntries(
      Object.entries(updates).filter(([k]) => !['gems','hearts','avatar'].includes(k))
    )
    const { data, error } = await supabase
      .from('profiles')
      .update(safe)
      .eq('id', user.id)
      .select(COLS)
      .single()
    if (error) console.error('[Auth] updateProfile error:', error.message)
    else if (data) setProfile(data)
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
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, updateProfile, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
