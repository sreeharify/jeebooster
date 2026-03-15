import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Columns that actually exist in the DB (no gems, no hearts, no avatar)
const PROFILE_COLS = 'id,username,email,google_avatar,xp,xp_today,level,streak,daily_goal,last_activity,completed_lessons,achievements,created_at'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialised = useRef(false)

  useEffect(() => {
    // Hard safety net — never stuck longer than 10s
    const safetyTimer = setTimeout(() => {
      console.warn('Auth safety timeout fired')
      setLoading(false)
    }, 10000)

    async function bootstrap() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) console.error('getSession error:', error.message)

        const u = session?.user ?? null
        setUser(u)
        if (u) await initProfile(u)
      } catch (err) {
        console.error('Bootstrap error:', err)
      } finally {
        clearTimeout(safetyTimer)
        setLoading(false)
        initialised.current = true
      }
    }

    bootstrap()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip INITIAL_SESSION — bootstrap handles it
        if (event === 'INITIAL_SESSION') return

        const u = session?.user ?? null
        setUser(u)
        if (u) await initProfile(u)
        else    setProfile(null)
      }
    )

    return () => { clearTimeout(safetyTimer); subscription.unsubscribe() }
  }, [])

  async function initProfile(u) {
    // 1. Try to load existing row
    const { data: existing, error: fetchErr } = await supabase
      .from('profiles')
      .select(PROFILE_COLS)
      .eq('id', u.id)
      .maybeSingle()

    if (fetchErr) {
      console.error('initProfile fetch error:', fetchErr.message, fetchErr.details)
    }

    if (existing) {
      setProfile(existing)
      return
    }

    // 2. No row yet — insert one
    const displayName =
      u.user_metadata?.full_name ||
      u.user_metadata?.name      ||
      u.email?.split('@')[0]     ||
      'Learner'

    const googleAvatar =
      u.user_metadata?.avatar_url ||
      u.user_metadata?.picture    ||
      null

    const { data: created, error: insertErr } = await supabase
      .from('profiles')
      .insert({
        id:                u.id,
        email:             u.email,
        username:          displayName,
        google_avatar:     googleAvatar,
        xp:                0,
        xp_today:          0,
        streak:            0,
        level:             1,
        daily_goal:        100,
        completed_lessons: [],
        achievements:      [],
        last_activity:     new Date().toISOString(),
      })
      .select(PROFILE_COLS)
      .single()

    if (insertErr) {
      console.error('initProfile insert error:', insertErr.message, insertErr.details)
      // Still give the app something to work with
      setProfile({
        id: u.id,
        username: displayName,
        google_avatar: googleAvatar,
        email: u.email,
        xp: 0, xp_today: 0, streak: 0, level: 1,
        daily_goal: 100, completed_lessons: [], achievements: [],
      })
    } else {
      setProfile(created)
    }
  }

  async function fetchProfile() {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLS)
      .eq('id', user.id)
      .maybeSingle()
    if (error) console.error('fetchProfile error:', error.message)
    if (data)  setProfile(data)
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'not authenticated' }

    // Remove any fields that don't exist in the DB schema
    const safe = { ...updates }
    delete safe.gems
    delete safe.hearts
    delete safe.avatar

    const { data, error } = await supabase
      .from('profiles')
      .update(safe)
      .eq('id', user.id)
      .select(PROFILE_COLS)
      .single()

    if (error) {
      console.error('updateProfile error:', error.message, error.details)
    } else if (data) {
      setProfile(data)
    }
    return { data, error }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
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
