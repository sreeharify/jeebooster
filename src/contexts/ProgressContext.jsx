import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ProgressContext = createContext(null)

const COLS = 'id,username,email,google_avatar,xp,xp_today,level,streak,daily_goal,last_activity,completed_lessons,achievements,created_at'

// ─────────────────────────────────────────────────────────────
//  TIMEZONE-AWARE DATE HELPERS
// ─────────────────────────────────────────────────────────────

// Returns the user's local calendar date as a string: "2025-03-16"
// Uses the browser's timezone automatically via Intl
function localDateStr(isoString) {
  const date = isoString ? new Date(isoString) : new Date()
  return date.toLocaleDateString('en-CA') // 'en-CA' gives YYYY-MM-DD in any locale
}

function todayStr() {
  return new Date().toLocaleDateString('en-CA')
}

export function ProgressProvider({ children }) {
  const { user, profile, fetchProfile } = useAuth()
  const [notifications, setNotifications] = useState([])

  // ── Check if xp_today needs resetting whenever the profile loads ──
  useEffect(() => {
    if (!user || !profile) return

    // last_activity is the last time we stored activity (lesson complete, etc.)
    // If it was a different calendar day in the user's timezone, reset xp_today
    const lastDay = profile.last_activity ? localDateStr(profile.last_activity) : null

    if (lastDay && lastDay !== todayStr() && (profile.xp_today || 0) > 0) {
      console.log(`[Progress] New day detected (${lastDay} → ${todayStr()}), resetting xp_today`)
      supabase
        .from('profiles')
        .update({ xp_today: 0 })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) console.error('[Progress] reset xp_today error:', error.message)
          else fetchProfile()
        })
    }
  }, [profile?.id, profile?.last_activity])
  // Only re-run when user or their last_activity changes, not on every render

  const addNotification = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, msg, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }, [])

  async function dbUpdate(updates) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) console.error('[Progress] dbUpdate error:', error.message)
    await fetchProfile()
  }

  async function awardXP(amount, reason) {
    if (!user || !profile) return

    // Read fresh from DB to avoid stale closure values racing
    const { data: fresh } = await supabase
      .from('profiles')
      .select('xp, xp_today, level')
      .eq('id', user.id)
      .single()

    if (!fresh) return

    const newXP    = (fresh.xp      || 0) + amount
    const newToday = (fresh.xp_today || 0) + amount
    const newLevel = Math.floor(newXP / 500) + 1
    const levelUp  = newLevel > (fresh.level || 1)

    await dbUpdate({ xp: newXP, xp_today: newToday, level: newLevel })

    addNotification(`+${amount} XP — ${reason}!`, 'xp')
    if (levelUp) {
      addNotification(`🎉 Level up! You're now Level ${newLevel}!`, 'achievement')
    }
  }

  async function completeLesson(lessonId, score) {
    if (!user) return

    // Fetch fresh completed_lessons to avoid overwriting with stale array
    const { data: fresh } = await supabase
      .from('profiles')
      .select('completed_lessons')
      .eq('id', user.id)
      .single()

    const existing = fresh?.completed_lessons || []
    const updated  = existing.includes(lessonId) ? existing : [...existing, lessonId]

    await supabase.from('profiles')
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

    // Check achievements
    await checkAchievements(updated, score)
  }

  async function updateStreak() {
    if (!user || !profile) return

    const today     = todayStr()
    const yesterday = localDateStr(new Date(Date.now() - 86400000).toISOString())
    const lastDay   = profile.last_activity ? localDateStr(profile.last_activity) : null

    // Already logged activity today — don't touch streak
    if (lastDay === today) return

    const newStreak = lastDay === yesterday ? (profile.streak || 0) + 1 : 1

    await dbUpdate({
      streak:        newStreak,
      last_activity: new Date().toISOString(),
    })

    if (newStreak === 3)  addNotification('🔥 3-day streak!', 'streak')
    if (newStreak === 7)  addNotification('🔥 7-day streak! Week warrior!', 'streak')
    if (newStreak === 30) addNotification('🔥 30-day streak! Unstoppable!', 'streak')
  }

  async function checkAchievements(completedLessons, score) {
    if (!user || !profile) return
    const existing = profile.achievements || []
    const toUnlock = []

    if (!existing.includes('first_lesson') && completedLessons.length >= 1)
      toUnlock.push('first_lesson')
    if (!existing.includes('perfect_lesson') && score === 100)
      toUnlock.push('perfect_lesson')
    if (!existing.includes('xp_500') && (profile.xp || 0) >= 500)
      toUnlock.push('xp_500')
    if (!existing.includes('xp_2000') && (profile.xp || 0) >= 2000)
      toUnlock.push('xp_2000')
    if (!existing.includes('streak_3') && (profile.streak || 0) >= 3)
      toUnlock.push('streak_3')
    if (!existing.includes('streak_7') && (profile.streak || 0) >= 7)
      toUnlock.push('streak_7')

    if (toUnlock.length === 0) return

    const updated = [...new Set([...existing, ...toUnlock])]
    await dbUpdate({ achievements: updated })

    toUnlock.forEach(id => {
      addNotification(`🏆 Achievement unlocked: ${id.replace(/_/g,' ')}!`, 'achievement')
    })
  }

  async function unlockAchievement(achievementId) {
    if (!user || !profile) return
    const list = profile.achievements || []
    if (list.includes(achievementId)) return
    await dbUpdate({ achievements: [...list, achievementId] })
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
