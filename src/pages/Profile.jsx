import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import XPBar from '../components/XPBar'
import { COURSE_DATA, ACHIEVEMENTS } from '../data/courseData'
import { LogOut, Edit2, Check, X } from 'lucide-react'

function GooglePFP({ profile, size = 'lg' }) {
  const sz = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12'
  const src = profile?.google_avatar

  if (src) {
    return (
      <img
        src={src}
        alt={profile?.username || 'Profile'}
        referrerPolicy="no-referrer"
        className={`${sz} rounded-3xl object-cover border-2 border-white/40 shadow-md shrink-0`}
      />
    )
  }
  const initial = (profile?.username || 'U')[0].toUpperCase()
  return (
    <div className={`${sz} rounded-3xl bg-white/20 border-2 border-white/30 flex items-center justify-center font-display text-3xl text-white shrink-0`}>
      {initial}
    </div>
  )
}

export default function Profile() {
  const { profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [saveError, setSaveError] = useState('')

  // Sync name field whenever profile loads/changes
  useEffect(() => {
    if (profile?.username) setNewName(profile.username)
  }, [profile?.username])

  const completed    = profile?.completed_lessons || []
  const achievements = profile?.achievements || []

  async function handleSave() {
    if (!newName.trim()) return
    setSaving(true)
    setSaveError('')
    const { error } = await updateProfile({ username: newName.trim() })
    setSaving(false)
    if (error) {
      setSaveError(error.message || 'Could not save. Try again.')
    } else {
      setEditing(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const STATS = [
    { label: 'Level',    value: profile?.level  || 1, icon: '⭐' },
    { label: 'Total XP', value: profile?.xp     || 0, icon: '⚡' },
    { label: 'Streak',   value: profile?.streak || 0, icon: '🔥' },
    { label: 'Lessons',  value: completed.length,     icon: '📚' },
    { label: 'Awards',   value: achievements.length,  icon: '🏆' },
    { label: 'Level',    value: profile?.level  || 1, icon: '🎯' },
  ]

  // Unique stats (remove duplicate level)
  const STATS_CLEAN = [
    { label: 'Level',    value: profile?.level  || 1,  icon: '⭐' },
    { label: 'Total XP', value: profile?.xp     || 0,  icon: '⚡' },
    { label: 'Streak',   value: profile?.streak || 0,  icon: '🔥' },
    { label: 'Lessons',  value: completed.length,      icon: '📚' },
    { label: 'Awards',   value: achievements.length,   icon: '🏆' },
    { label: 'Daily XP', value: profile?.daily_goal || 100, icon: '🎯' },
  ]

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Hero card ── */}
        <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl opacity-10 pointer-events-none select-none">🚀</div>

          <div className="flex items-start gap-4">
            <GooglePFP profile={profile} size="lg" />

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="mb-1">
                  <input id="display-name" name="display-name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                    className="bg-white/20 text-white placeholder-white/50 rounded-xl px-3 py-2 font-bold text-lg w-full outline-none border-2 border-white/50 focus:border-white"
                    placeholder="Your display name"
                    autoFocus
                  />
                  {saveError && (
                    <p className="text-red-200 text-xs font-semibold mt-1">{saveError}</p>
                  )}
                </div>
              ) : (
                <h2 className="font-display text-2xl truncate">{profile?.username || 'Learner'}</h2>
              )}
              <p className="text-lime-100 text-sm font-semibold truncate">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  Level {profile?.level || 1}
                </span>
                <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  🔥 {profile?.streak || 0} day streak
                </span>
              </div>
            </div>

            <button
              onClick={() => { setEditing(e => !e); setSaveError('') }}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors shrink-0"
            >
              {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>

          {editing && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !newName.trim()}
                className="flex-1 bg-white text-green-700 font-bold py-2.5 px-4 rounded-xl hover:bg-lime-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Name'}
              </button>
              <button
                onClick={() => { setEditing(false); setNewName(profile?.username || ''); setSaveError('') }}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          <XPBar className="mt-4" />
        </div>

        {/* ── Stats ── */}
        <div>
          <h3 className="font-display text-xl text-green-800 mb-3">Your Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            {STATS_CLEAN.map(s => (
              <div key={s.label} className="card text-center py-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display text-2xl text-green-700">{s.value}</div>
                <div className="text-xs font-bold text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Course Progress ── */}
        <div className="card">
          <h3 className="font-display text-xl text-green-800 mb-3">Course Progress</h3>
          <div className="space-y-3">
            {COURSE_DATA.map(sec => {
              const total = sec.units.reduce((s, u) => s + u.lessons.length, 0)
              const done  = sec.units.reduce((s, u) => s + u.lessons.filter(l => completed.includes(l.id)).length, 0)
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={sec.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{sec.icon}</span>
                    <span className="font-bold text-green-800 text-sm flex-1">{sec.title}</span>
                    <span className="text-xs font-bold text-lime-600">{done}/{total}</span>
                  </div>
                  <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${sec.color} rounded-full progress-fill`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="card">
          <h3 className="font-display text-xl text-green-800 mb-3">
            🏆 Achievements ({achievements.length}/{ACHIEVEMENTS.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.slice(0, 6).map(ach => {
              const unlocked = achievements.includes(ach.id)
              return (
                <div key={ach.id} className={`p-3 rounded-2xl border-2 ${unlocked ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className={`font-bold text-sm ${unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>{ach.title}</div>
                  <div className="text-xs text-gray-500 font-semibold">{ach.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Daily Goal ── */}
        <div className="card">
          <h3 className="font-display text-xl text-green-800 mb-3">🎯 Daily Goal</h3>
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map(goal => (
              <button
                key={goal}
                onClick={() => updateProfile({ daily_goal: goal })}
                className={`p-3 rounded-2xl border-2 font-bold text-center transition-all
                  ${profile?.daily_goal === goal
                    ? 'border-lime-400 bg-lime-50 text-lime-700'
                    : 'border-gray-200 text-gray-600 hover:border-lime-200'}`}
              >
                <div className="text-lg">{goal === 50 ? '🌱' : goal === 100 ? '⚡' : '🔥'}</div>
                <div className="text-sm">{goal} XP</div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSignOut} className="btn-danger w-full flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  )
}
