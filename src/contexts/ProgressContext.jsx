import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const { user, profile, fetchProfile } = useAuth()
  const [sessionXP, setSessionXP] = useState(0)
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, msg, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000)
  }, [])

  async function awardXP(amount, reason) {
    if (!user) return
    const newXP = (profile?.xp || 0) + amount
    const newLevel = Math.floor(newXP / 500) + 1
    setSessionXP(prev => prev + amount)
    await supabase.from('profiles').update({ xp: newXP, level: newLevel }).eq('id', user.id)
    await fetchProfile()
    addNotification(`+${amount} XP — ${reason}! 🎉`, 'xp')
  }

  async function completeLesson(lessonId, score) {
    if (!user) return
    const completed = profile?.completed_lessons || []
    if (!completed.includes(lessonId)) {
      const updated = [...completed, lessonId]
      await supabase.from('profiles').update({ completed_lessons: updated }).eq('id', user.id)
    }
    await supabase.from('lesson_attempts').insert({
      user_id: user.id,
      lesson_id: lessonId,
      score,
      completed_at: new Date().toISOString(),
    })
    const xpEarned = Math.round((score / 100) * 30) + 10
    await awardXP(xpEarned, 'Lesson complete')
    await fetchProfile()
    await updateStreak()
  }

  async function updateStreak() {
    if (!user || !profile) return
    const today = new Date().toDateString()
    const last = profile.last_activity ? new Date(profile.last_activity).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let newStreak = profile.streak || 0
    if (last === today) return
    if (last === yesterday) newStreak += 1
    else if (last !== today) newStreak = 1
    await supabase.from('profiles').update({
      streak: newStreak,
      last_activity: new Date().toISOString(),
    }).eq('id', user.id)
    if (newStreak % 7 === 0) addNotification(`🔥 ${newStreak} day streak! Amazing!`, 'streak')
  }

  async function spendGems(amount) {
    if (!user || (profile?.gems || 0) < amount) return false
    await supabase.from('profiles').update({ gems: (profile.gems || 0) - amount }).eq('id', user.id)
    await fetchProfile()
    return true
  }

  async function loseHeart() {
    if (!user) return
    const hearts = Math.max(0, (profile?.hearts || 5) - 1)
    await supabase.from('profiles').update({ hearts }).eq('id', user.id)
    await fetchProfile()
  }

  async function restoreHearts() {
    if (!user) return
    await supabase.from('profiles').update({ hearts: 5 }).eq('id', user.id)
    await fetchProfile()
  }

  async function unlockAchievement(achievementId) {
    if (!user || !profile) return
    const achievements = profile.achievements || []
    if (achievements.includes(achievementId)) return
    const updated = [...achievements, achievementId]
    await supabase.from('profiles').update({ achievements: updated }).eq('id', user.id)
    await fetchProfile()
    addNotification(`🏆 Achievement unlocked!`, 'achievement')
  }

  return (
    <ProgressContext.Provider value={{
      sessionXP, notifications, awardXP, completeLesson,
      updateStreak, spendGems, loseHeart, restoreHearts,
      unlockAchievement, addNotification
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
