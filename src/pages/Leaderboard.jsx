import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { RotateCcw } from 'lucide-react'

const TABS    = ['XP', 'Streak', 'Lessons']
const MEDALS  = ['🥇', '🥈', '🥉']

function LeaderAvatar({ player, size = 'md' }) {
  const sz  = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-sm' : 'w-10 h-10 text-sm'
  const src = player?.google_avatar
  if (src) {
    return (
      <img src={src} alt={player?.username || '?'} referrerPolicy="no-referrer"
        className={`${sz} rounded-full object-cover border-2 border-lime-200 shrink-0`} />
    )
  }
  const initial = (player?.username || '?')[0].toUpperCase()
  return (
    <div className={`${sz} rounded-full bg-lime-400 border-2 border-lime-500 flex items-center justify-center font-bold text-green-900 shrink-0`}>
      {initial}
    </div>
  )
}

export default function Leaderboard() {
  const [tab,     setTab]     = useState('XP')
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const { user }              = useAuth()

  useEffect(() => { load() }, [tab])

  async function load() {
    setLoading(true)
    setError('')

    // Map tab to column for ORDER BY
    const orderCol = tab === 'XP' ? 'xp' : tab === 'Streak' ? 'streak' : 'xp'

    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, username, xp, streak, level, google_avatar, completed_lessons')
      .order(orderCol, { ascending: false })
      .limit(50)

    if (err) {
      console.error('Leaderboard fetch error:', err.message, err.details)
      setError(err.message)
      setLeaders([])
    } else {
      // For "Lessons" tab, sort client-side by array length
      const sorted = tab === 'Lessons'
        ? [...(data || [])].sort((a, b) => (b.completed_lessons?.length || 0) - (a.completed_lessons?.length || 0))
        : (data || [])
      setLeaders(sorted)
    }
    setLoading(false)
  }

  function getValue(p) {
    if (tab === 'XP')     return `${p.xp || 0} XP`
    if (tab === 'Streak') return `${p.streak || 0} days`
    return `${p.completed_lessons?.length || 0} lessons`
  }

  const myRank = leaders.findIndex(l => l.id === user?.id) + 1

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-green-800">Leaderboard 🏆</h2>
          <div className="flex items-center gap-2">
            {myRank > 0 && (
              <span className="bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full text-sm">
                You: #{myRank}
              </span>
            )}
            <button onClick={load} className="p-2 rounded-xl hover:bg-lime-100 transition-colors">
              <RotateCcw className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border-2 border-lime-200 mb-5">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all
                ${tab === t ? 'bg-lime-400 text-green-900 shadow' : 'text-green-600 hover:bg-lime-50'}`}>
              {t === 'XP' ? '⚡ XP' : t === 'Streak' ? '🔥 Streak' : '📚 Lessons'}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="card bg-red-50 border-2 border-red-200 mb-4 text-center">
            <p className="text-red-700 font-semibold text-sm mb-2">⚠️ Could not load rankings</p>
            <p className="text-red-500 text-xs font-semibold mb-3">{error}</p>
            <button onClick={load} className="btn-secondary text-sm py-2">Try Again</button>
          </div>
        )}

        {/* Podium — only show when 3+ players */}
        {!loading && !error && leaders.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {[leaders[1], leaders[0], leaders[2]].map((p, i) => {
              const ranks    = [2, 1, 3]
              const heights  = ['h-24', 'h-32', 'h-20']
              const colors   = ['bg-gray-300', 'bg-yellow-300', 'bg-orange-300']
              const rank     = ranks[i]
              return (
                <div key={p?.id || i} className="flex flex-col items-center flex-1">
                  <LeaderAvatar player={p} size="lg" />
                  <div className="text-xs font-bold text-green-700 mt-1 mb-1 truncate max-w-[70px] text-center">
                    {p?.username}
                  </div>
                  <div className={`${heights[i]} ${colors[i]} rounded-t-2xl w-full flex flex-col items-center justify-start pt-2`}>
                    <div className="text-xl">{MEDALS[rank - 1]}</div>
                    <div className="text-xs font-bold text-gray-700 mt-1">{getValue(p)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-4xl animate-bounce-slow mb-3">🚀</div>
            <p className="font-semibold text-green-500">Loading rankings…</p>
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <div className="space-y-2">
            {leaders.map((p, i) => {
              const isMe = p.id === user?.id
              return (
                <div key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${isMe ? 'border-lime-400 bg-lime-50' : 'border-gray-100 bg-white'}`}>
                  <div className="w-7 text-center shrink-0">
                    {i < 3
                      ? <span className="text-lg">{MEDALS[i]}</span>
                      : <span className="text-gray-400 text-sm font-bold">#{i + 1}</span>
                    }
                  </div>
                  <LeaderAvatar player={p} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm truncate ${isMe ? 'text-lime-700' : 'text-green-800'}`}>
                      {p.username || 'Learner'} {isMe && <span className="text-xs opacity-60">(You)</span>}
                    </div>
                    <div className="text-xs text-green-500 font-semibold">Level {p.level || 1}</div>
                  </div>
                  <div className={`font-bold text-sm shrink-0 ${isMe ? 'text-lime-600' : 'text-green-600'}`}>
                    {getValue(p)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && leaders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🏆</div>
            <p className="font-display text-xl text-green-700">No data yet</p>
            <p className="text-green-500 font-semibold text-sm mt-1">Complete lessons to appear here!</p>
          </div>
        )}
      </div>
    </div>
  )
}
