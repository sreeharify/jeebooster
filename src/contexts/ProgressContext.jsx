import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { user, profile, fetchProfile } = useAuth()
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, msg, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000)
  }, [])

  async function safeUpdate(updates) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) console.error('safeUpdate error:', error.message)
    await fetchProfile()
  }

  async function awardXP(amount, reason) {
    if (!user || !profile) return
    const newXP    = (profile.xp || 0) + amount
    const newToday = (profile.xp_today || 0) + amount
    const newLevel = Math.floor(newXP / 500) + 1
    await safeUpdate({ xp: newXP, xp_today: newToday, level: newLevel })
    addNotification(`+${amount} XP — ${reason}!`, 'xp')
  }

  // Only marks lesson complete if score >= 60%
  async function completeLesson(lessonId, score) {
    if (!user || !profile) return

    const passed = score >= 60

    // Record the attempt regardless
    await supabase.from('lesson_attempts').insert({
      user_id:      user.id,
      lesson_id:    lessonId,
      score,
      completed_at: new Date().toISOString(),
    })

    if (passed) {
      // Fetch fresh completed_lessons before updating to avoid stale overwrites
      const { data: fresh } = await supabase
        .from('profiles')
        .select('completed_lessons')
        .eq('id', user.id)
        .single()

      const already  = fresh?.completed_lessons || []
      const updated  = already.includes(lessonId) ? already : [...already, lessonId]

      await supabase
        .from('profiles')
        .update({ completed_lessons: updated })
        .eq('id', user.id)

      const xpEarned = Math.round((score / 100) * 30) + 10
      await awardXP(xpEarned, 'Lesson complete')
      await updateStreak()
    }

    await fetchProfile()
    return passed
  }

  async function updateStreak() {
    if (!user || !profile) return
    const today     = new Date().toDateString()
    const last      = profile.last_activity ? new Date(profile.last_activity).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (last === today) return
    const newStreak = last === yesterday ? (profile.streak || 0) + 1 : 1
    await safeUpdate({ streak: newStreak, last_activity: new Date().toISOString() })
    if (newStreak % 7 === 0) addNotification(`🔥 ${newStreak} day streak! Amazing!`, 'streak')
  }

  async function unlockAchievement(achievementId) {
    if (!user || !profile) return
    const list = profile.achievements || []
    if (list.includes(achievementId)) return
    await safeUpdate({ achievements: [...list, achievementId] })
    addNotification('🏆 Achievement unlocked!', 'achievement')
  }

  return (
    <ProgressContext.Provider value={{
      notifications, awardXP, completeLesson,
      updateStreak, unlockAchievement, addNotification,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
