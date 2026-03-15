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

  /** Safe profile update — fetches fresh copy first to avoid stale state */
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
    const newXP    = (profile.xp    || 0) + amount
    const newToday = (profile.xp_today || 0) + amount
    const newLevel = Math.floor(newXP / 500) + 1
    await safeUpdate({ xp: newXP, xp_today: newToday, level: newLevel })
    addNotification(`+${amount} XP — ${reason}!`, 'xp')
  }

  async function completeLesson(lessonId, score) {
    if (!user || !profile) return

    // Re-fetch fresh profile to avoid stale completed_lessons array
    const { data: fresh } = await supabase
      .from('profiles').select('completed_lessons').eq('id', user.id).single()

    const already = fresh?.completed_lessons || []
    const updated = already.includes(lessonId) ? already : [...already, lessonId]

    await supabase
      .from('profiles')
      .update({ completed_lessons: updated })
      .eq('id', user.id)

    // Record attempt
    await supabase.from('lesson_attempts').insert({
      user_id:      user.id,
      lesson_id:    lessonId,
      score,
      completed_at: new Date().toISOString(),
    })

    const xpEarned = Math.round((score / 100) * 30) + 10
    await awardXP(xpEarned, 'Lesson complete')
    await updateStreak()
    await fetchProfile()
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

  async function spendGems(amount) {
    if (!user || (profile?.gems || 0) < amount) return false
    await safeUpdate({ gems: (profile.gems || 0) - amount })
    return true
  }

  async function loseHeart() {
    if (!user || !profile) return
    const hearts = Math.max(0, (profile.hearts || 5) - 1)
    await safeUpdate({ hearts })
  }

  async function restoreHearts() {
    if (!user) return
    await safeUpdate({ hearts: 5 })
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
      updateStreak, spendGems, loseHeart,
      restoreHearts, unlockAchievement, addNotification,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
