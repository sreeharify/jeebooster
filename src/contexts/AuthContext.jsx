import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialised = useRef(false)

  useEffect(() => {
    // Safety net: never stay on loading screen longer than 8 seconds
    const safetyTimer = setTimeout(() => setLoading(false), 8000)

    async function bootstrap() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const u = session?.user ?? null
        setUser(u)

        if (u) {
          await initProfile(u)
        }
      } catch (err) {
        console.error('Auth bootstrap error:', err)
      } finally {
        clearTimeout(safetyTimer)
        setLoading(false)
        initialised.current = true
      }
    }

    bootstrap()

    // Listen for auth changes AFTER initial load (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip the INITIAL_SESSION event — bootstrap() already handled it
        if (!initialised.current && event === 'INITIAL_SESSION') return

        const u = session?.user ?? null
        setUser(u)

        if (u) {
          await initProfile(u)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [])

  async function initProfile(u) {
    try {
      // Try to load existing profile
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle()

      if (fetchErr) {
        console.error('Profile fetch error:', fetchErr.message)
        // Still set a minimal profile so app doesn't break
        setProfile({ id: u.id, username: u.user_metadata?.full_name || 'Learner', google_avatar: u.user_metadata?.avatar_url || null })
        return
      }

      if (existing) {
        setProfile(existing)
        return
      }

      // New user — create profile row
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
          gems:              50,
          hearts:            5,
          level:             1,
          daily_goal:        100,
          completed_lessons: [],
          achievements:      [],
          last_activity:     new Date().toISOString(),
        })
        .select()
        .single()

      if (insertErr) {
        console.error('Profile insert error:', insertErr.message)
        // Fallback: set minimal profile from Google data
        setProfile({
          id: u.id,
          username: displayName,
          google_avatar: googleAvatar,
          email: u.email,
          xp: 0, streak: 0, gems: 50, hearts: 5, level: 1,
          completed_lessons: [], achievements: [], daily_goal: 100,
        })
      } else {
        setProfile(created)
      }
    } catch (err) {
      console.error('initProfile unexpected error:', err)
      setProfile({
        id: u.id,
        username: u.user_metadata?.full_name || 'Learner',
        google_avatar: u.user_metadata?.avatar_url || null,
      })
    }
  }

  async function fetchProfile(userId) {
    if (!userId) return
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (data) setProfile(data)
    } catch (err) {
      console.error('fetchProfile error:', err)
    }
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

  async function updateProfile(updates) {
    if (!user) return { error: 'not authenticated' }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      if (!error && data) setProfile(data)
      return { data, error }
    } catch (err) {
      console.error('updateProfile error:', err)
      return { error: err }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signInWithGoogle,
      signOut,
      updateProfile,
      fetchProfile: () => fetchProfile(user?.id),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
