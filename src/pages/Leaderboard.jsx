import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, Zap, Flame } from 'lucide-react'

const TABS = ['XP', 'Streak', 'Lessons']

export default function Leaderboard() {
  const [tab, setTab] = useState('XP')
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchLeaders()
  }, [tab])

  async function fetchLeaders() {
    setLoading(true)
    const col = tab === 'XP' ? 'xp' : tab === 'Streak' ? 'streak' : 'xp'
    const { data } = await supabase
      .from('profiles')
      .select('id, username, xp, streak, level, avatar, completed_lessons')
      .order(col, { ascending: false })
      .limit(20)
    setLeaders(data || [])
    setLoading(false)
  }

  const sorted = leaders.slice().sort((a, b) => {
    if (tab === 'XP') return b.xp - a.xp
    if (tab === 'Streak') return b.streak - a.streak
    return (b.completed_lessons?.length || 0) - (a.completed_lessons?.length || 0)
  })

  const myRank = sorted.findIndex(l => l.id === user?.id) + 1

  const MEDALS = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-green-800">Leaderboard 🏆</h2>
          {myRank > 0 && (
            <div className="bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full text-sm">
              You: #{myRank}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border-2 border-lime-200 mb-4">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-lime-400 text-green-900 shadow' : 'text-green-600 hover:bg-lime-50'}`}
            >
              {t === 'XP' ? '⚡ XP' : t === 'Streak' ? '🔥 Streak' : '📚 Lessons'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {sorted.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {[sorted[1], sorted[0], sorted[2]].map((p, i) => {
              const positions = [2, 1, 3]
              const heights = ['h-24', 'h-32', 'h-20']
              const pos = positions[i]
              return (
                <div key={p?.id} className="flex flex-col items-center flex-1">
                  <div className="text-3xl mb-1">{p?.google_avatar ? <img src={p.google_avatar} className="w-8 h-8 rounded-full object-cover" alt="" /> : (p?.avatar || "🦁")}</div>
                  <div className="text-xs font-bold text-green-700 mb-1 truncate max-w-[80px] text-center">{p?.username}</div>
                  <div className={`${heights[i]} bg-gradient-to-t ${pos === 1 ? 'from-yellow-400 to-yellow-300' : pos === 2 ? 'from-gray-400 to-gray-300' : 'from-orange-400 to-orange-300'} rounded-t-2xl w-full flex flex-col items-center justify-start pt-2`}>
                    <div className="text-xl">{MEDALS[pos - 1]}</div>
                    <div className="text-xs font-bold text-white">{tab === 'XP' ? p?.xp : tab === 'Streak' ? p?.streak : p?.completed_lessons?.length || 0}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full List */}
        {loading ? (
          <div className="text-center py-10">
            <div className="text-4xl animate-bounce-slow mb-2">🌿</div>
            <p className="font-semibold text-green-500">Loading rankings...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((p, i) => {
              const isMe = p.id === user?.id
              const value = tab === 'XP' ? `${p.xp} XP` : tab === 'Streak' ? `${p.streak} days` : `${p.completed_lessons?.length || 0} lessons`
              return (
                <div key={p.id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all
                  ${isMe ? 'border-lime-400 bg-lime-50' : 'border-gray-100 bg-white'}`}>
                  <div className={`w-8 text-center font-display text-lg ${i < 3 ? '' : 'text-gray-400'}`}>
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </div>
                  <div className="text-2xl">{p.avatar || '🦁'}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${isMe ? 'text-lime-700' : 'text-green-800'}`}>
                      {p.username} {isMe && '(You)'}
                    </div>
                    <div className="text-xs text-green-500 font-semibold">Level {p.level || 1}</div>
                  </div>
                  <div className={`font-bold text-sm ${isMe ? 'text-lime-600' : 'text-green-600'}`}>{value}</div>
                </div>
              )
            })}
          </div>
        )}

        {sorted.length === 0 && !loading && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🏆</div>
            <p className="font-display text-xl text-green-700">No data yet!</p>
            <p className="text-green-500 font-semibold">Be the first to earn XP</p>
          </div>
        )}
      </div>
    </div>
  )
}
