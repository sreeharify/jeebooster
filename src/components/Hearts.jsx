import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'

export default function Hearts({ size = 'md' }) {
  const { profile } = useAuth()
  const { restoreHearts, spendGems } = useProgress()
  const hearts = profile?.hearts || 0
  const maxHearts = 5

  const handleRestore = async () => {
    if (profile?.gems >= 50) {
      const ok = await spendGems(50)
      if (ok) await restoreHearts()
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <Heart
          key={i}
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} transition-all duration-200 ${i < hearts ? 'text-red-500' : 'text-gray-200'}`}
          fill={i < hearts ? 'currentColor' : 'none'}
        />
      ))}
      {hearts < maxHearts && (
        <button
          onClick={handleRestore}
          className="ml-2 text-xs bg-cyan-100 text-cyan-700 font-bold px-2 py-0.5 rounded-full border border-cyan-300 hover:bg-cyan-200 transition-colors"
        >
          💎50
        </button>
      )}
    </div>
  )
}
