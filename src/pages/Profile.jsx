import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import XPBar from '../components/XPBar'
import Hearts from '../components/Hearts'
import { COURSE_DATA, ACHIEVEMENTS } from '../data/courseData'
import { LogOut, Edit2, Check, X } from 'lucide-react'

const AVATAR_OPTIONS = ['🦁', '🐯', '🦊', '🐺', '🐻', '🦅', '🦋', '🐬', '🦄', '🌟']

export default function Profile() {
  const { profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(profile?.username || '')
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || '🦁')
  const [saving, setSaving] = useState(false)

  const completed    = profile?.completed_lessons || []
  const achievements = profile?.achievements || []

  async function handleSave() {
    setSaving(true)
    await updateProfile({ username: newName, avatar: selectedAvatar })
    setEditing(false)
    setSaving(false)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const STATS = [
    { label: 'Level',        value: profile?.level  || 1, icon: '⭐' },
    { label: 'Total XP',     value: profile?.xp     || 0, icon: '⚡' },
    { label: 'Day Streak',   value: profile?.streak || 0, icon: '🔥' },
    { label: 'Gems',         value: profile?.gems   || 0, icon: '💎' },
    { label: 'Lessons Done', value: completed.length,     icon: '📚' },
    { label: 'Achievements', value: achievements.length,  icon: '🏆' },
  ]

  /* Avatar display: prefer google_avatar photo, fall back to emoji */
  const avatarEl = profile?.google_avatar && !editing
    ? <img src={profile.google_avatar} alt="avatar" className="w-20 h-20 rounded-3xl object-cover" />
    : <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-5xl">
        {editing ? selectedAvatar : (profile?.avatar || '🦁')}
      </div>

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Profile hero */}
        <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-5 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl opacity-10 pointer-events-none select-none">🌿</div>
          <div className="flex items-center gap-4">
            {avatarEl}
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="bg-white/20 text-white placeholder-white/50 rounded-xl px-3 py-1.5 font-bold text-lg w-full outline-none border-2 border-white/40"
                />
              ) : (
                <h2 className="font-display text-2xl truncate">{profile?.username || 'Learner'}</h2>
              )}
              <p className="text-lime-100 text-sm font-semibold truncate">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="bg-white/20 rounded-full px-3 py-0.5 text-xs font-bold">
                  Level {profile?.level || 1}
                </div>
                <div className="bg-white/20 rounded-full px-3 py-0.5 text-xs font-bold">
                  🔥 {profile?.streak || 0} day streak
                </div>
                <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </div>
              </div>
            </div>
            <button
              onClick={() => editing ? setEditing(false) : setEditing(true)}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors shrink-0"
            >
              {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Emoji avatar picker (only shown in edit mode) */}
          {editing && (
            <div className="mt-4">
              <p className="text-white/80 text-xs font-bold mb-2">Choose an emoji avatar:</p>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_OPTIONS.map(av => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`text-2xl p-1.5 rounded-xl transition-all ${selectedAvatar === av ? 'bg-white/40 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <p className="text-white/60 text-xs mt-2">Emoji avatar is used when Google photo is unavailable</p>
              <button onClick={handleSave} disabled={saving}
                className="mt-3 bg-white text-green-700 font-bold py-2 px-5 rounded-xl hover:bg-lime-50 transition-colors flex items-center gap-2">
                <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          <XPBar className="mt-4" />
        </div>

        {/* Hearts */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-800">Hearts ❤️</h3>
              <p className="text-xs text-green-500 font-semibold">Refills over time or use 💎50 gems</p>
            </div>
            <Hearts size="md" />
          </div>
        </div>

        {/* Stats grid */}
        <div>
          <h3 className="font-display text-xl text-green-800 mb-3">Your Stats</h3>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="card text-center py-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display text-2xl text-green-700">{s.value}</div>
                <div className="text-xs font-bold text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Course progress */}
        <div className="card">
          <h3 className="font-display text-xl text-green-800 mb-3">Course Progress</h3>
          <div className="space-y-3">
            {COURSE_DATA.map(section => {
              const total = section.units.reduce((s, u) => s + u.lessons.length, 0)
              const done  = section.units.reduce((s, u) => s + u.lessons.filter(l => completed.includes(l.id)).length, 0)
              const pct   = Math.round((done / total) * 100)
              return (
                <div key={section.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{section.icon}</span>
                    <span className="font-bold text-green-800 text-sm flex-1">{section.title}</span>
                    <span className="text-xs font-bold text-lime-600">{done}/{total}</span>
                  </div>
                  <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${section.color} rounded-full progress-fill`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="card">
          <h3 className="font-display text-xl text-green-800 mb-3">🏆 Achievements ({achievements.length}/{ACHIEVEMENTS.length})</h3>
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

        {/* Daily Goal */}
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
                <div className="text-lg">{goal === 50 ? '🌱' : goal === 100 ? '🌿' : '🌳'}</div>
                <div className="text-sm">{goal} XP</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} className="btn-danger w-full flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  )
}
