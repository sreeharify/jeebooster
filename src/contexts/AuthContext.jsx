import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) initProfile(session.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) await initProfile(u)
      else    setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  /** Try to load profile; if missing, create it. Never overwrite existing rows. */
  async function initProfile(u) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .maybeSingle()

    if (existing) {
      setProfile(existing)
      return
    }

    // First-ever sign-in → create row
    const displayName =
      u.user_metadata?.full_name ||
      u.user_metadata?.name      ||
      u.email?.split('@')[0]     ||
      'Learner'

    const googleAvatar =
      u.user_metadata?.avatar_url ||
      u.user_metadata?.picture    ||
      null

    const { data: created, error } = await supabase
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

    if (error) console.error('Profile creation error:', error.message)
    else        setProfile(created)
  }

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles').select('*').eq('id', userId).maybeSingle()
    if (data) setProfile(data)
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'not authenticated' }
    const { data, error } = await supabase
      .from('profiles').update(updates).eq('id', user.id).select().single()
    if (!error) setProfile(data)
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInWithGoogle, signOut,
      updateProfile,
      fetchProfile: () => fetchProfile(user?.id),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
