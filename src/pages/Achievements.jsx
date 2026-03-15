import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { ACHIEVEMENTS } from '../data/courseData'
import { Lock } from 'lucide-react'

export default function Achievements() {
  const { profile } = useAuth()
  const unlocked = profile?.achievements || []

  const unlockedAchs = ACHIEVEMENTS.filter(a => unlocked.includes(a.id))
  const lockedAchs = ACHIEVEMENTS.filter(a => !unlocked.includes(a.id))

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-green-800">Achievements 🏆</h2>
          <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm">
            {unlockedAchs.length}/{ACHIEVEMENTS.length}
          </div>
        </div>

        {/* Progress */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800">Collection Progress</span>
            <span className="text-sm font-bold text-lime-600">{Math.round((unlockedAchs.length / ACHIEVEMENTS.length) * 100)}%</span>
          </div>
          <div className="h-4 bg-lime-100 rounded-full overflow-hidden border-2 border-lime-200">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-lime-400 rounded-full progress-fill"
              style={{ width: `${(unlockedAchs.length / ACHIEVEMENTS.length) * 100}%` }} />
          </div>
        </div>

        {/* Unlocked */}
        {unlockedAchs.length > 0 && (
          <>
            <h3 className="font-display text-xl text-green-800 mb-3">✨ Unlocked</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {unlockedAchs.map(ach => (
                <div key={ach.id} className="bg-gradient-to-br from-yellow-50 to-lime-50 border-2 border-yellow-300 rounded-2xl p-4 text-center">
                  <div className="text-4xl mb-2">{ach.icon}</div>
                  <div className="font-bold text-yellow-800 text-sm">{ach.title}</div>
                  <div className="text-xs text-yellow-600 font-semibold mt-0.5">{ach.desc}</div>
                  <div className="mt-2 text-xs font-bold text-lime-600 bg-lime-100 rounded-full px-2 py-0.5 inline-block">+{ach.xp} XP</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Locked */}
        <h3 className="font-display text-xl text-green-800 mb-3">🔒 Locked</h3>
        <div className="grid grid-cols-2 gap-3">
          {lockedAchs.map(ach => (
            <div key={ach.id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-center opacity-60">
              <div className="text-4xl mb-2 grayscale">{ach.icon}</div>
              <div className="font-bold text-gray-600 text-sm">{ach.title}</div>
              <div className="text-xs text-gray-400 font-semibold mt-0.5">{ach.desc}</div>
              <div className="mt-2 text-xs font-bold text-gray-400 bg-gray-200 rounded-full px-2 py-0.5 inline-block flex items-center gap-1 justify-center">
                <Lock className="w-3 h-3" /> +{ach.xp} XP
              </div>
            </div>
          ))}
        </div>

        {unlockedAchs.length === 0 && (
          <div className="text-center py-10">
            <div className="text-6xl mb-3">🎯</div>
            <p className="font-display text-xl text-green-700">Start earning achievements!</p>
            <p className="text-green-500 font-semibold text-sm mt-1">Complete lessons to unlock them</p>
          </div>
        )}
      </div>
    </div>
  )
}
