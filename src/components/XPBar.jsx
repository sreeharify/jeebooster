import { useAuth } from '../contexts/AuthContext'

export default function XPBar({ className = '' }) {
  const { profile } = useAuth()
  const xp = profile?.xp || 0
  const level = profile?.level || 1
  const xpForThisLevel = (level - 1) * 500
  const xpForNextLevel = level * 500
  const progress = ((xp - xpForThisLevel) / 500) * 100

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-green-700 text-sm">Level {level}</span>
        <span className="text-xs text-green-500 font-semibold">{xp} / {xpForNextLevel} XP</span>
      </div>
      <div className="h-4 bg-lime-100 rounded-full overflow-hidden border-2 border-lime-200">
        <div
          className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  )
}
