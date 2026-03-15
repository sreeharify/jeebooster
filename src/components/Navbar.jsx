import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, BookOpen, Trophy, ClipboardList, Flame, Zap, Heart } from 'lucide-react'

function GoogleAvatar({ profile, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'
  const src = profile?.google_avatar

  if (src) {
    return (
      <img
        src={src}
        alt={profile?.username || 'Me'}
        referrerPolicy="no-referrer"
        className={`${sz} rounded-full object-cover border-2 border-lime-300`}
      />
    )
  }
  // Fallback: coloured circle with initial
  const initial = (profile?.username || 'U')[0].toUpperCase()
  return (
    <div className={`${sz} rounded-full bg-lime-400 border-2 border-lime-500 flex items-center justify-center font-bold text-green-900`}>
      {initial}
    </div>
  )
}

export default function Navbar() {
  const { profile } = useAuth()
  const location    = useLocation()

  const navItems = [
    { path: '/',            icon: Home,          label: 'Home'  },
    { path: '/learn',       icon: BookOpen,      label: 'Learn' },
    { path: '/mock-test',   icon: ClipboardList, label: 'Test'  },
    { path: '/leaderboard', icon: Trophy,        label: 'Ranks' },
    { path: '/profile',     icon: null,          label: 'Me', isAvatar: true },
  ]

  return (
    <>
      {/* ── Top stats bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-lime-200 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-2xl">🌿</span>
            <span className="font-display text-green-700 text-xl">IELTS Master</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-orange-50 rounded-full px-2.5 py-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-bold text-orange-600 text-sm">{profile?.streak || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-lime-50 rounded-full px-2.5 py-1">
              <Zap className="w-3.5 h-3.5 text-lime-600" />
              <span className="font-bold text-lime-700 text-sm">{profile?.xp || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-cyan-50 rounded-full px-2.5 py-1">
              <span className="text-sm">💎</span>
              <span className="font-bold text-cyan-700 text-sm">{profile?.gems || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-red-50 rounded-full px-2.5 py-1">
              <Heart className="w-3.5 h-3.5 text-red-500" fill="currentColor" />
              <span className="font-bold text-red-600 text-sm">{profile?.hearts || 5}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-lime-200 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(({ path, icon: Icon, label, isAvatar }) => {
            const active = location.pathname === path ||
              (path === '/profile' && location.pathname === '/profile')
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-0.5 group">
                <div className={`p-1.5 rounded-2xl transition-all duration-200 ${active ? 'bg-lime-400' : 'hover:bg-lime-100'}`}>
                  {isAvatar
                    ? <GoogleAvatar profile={profile} size="sm" />
                    : <Icon className={`w-5 h-5 ${active ? 'text-green-800' : 'text-gray-500 group-hover:text-green-600'}`} />
                  }
                </div>
                <span className={`text-xs font-bold ${active ? 'text-green-700' : 'text-gray-500'}`}>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export { GoogleAvatar }
