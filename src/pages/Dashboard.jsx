import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import XPBar from '../components/XPBar'
import { COURSE_DATA } from '../data/courseData'
import { ChevronRight, Target, Zap } from 'lucide-react'

const PRACTICE_CARDS = [
  { path: '/reading',        emoji: '👁️',  label: 'Reading',      sub: 'Passages & questions',  color: 'bg-blue-50   border-blue-200' },
  { path: '/writing',        emoji: '✍️',  label: 'Writing',      sub: 'Task 1 & Task 2',       color: 'bg-yellow-50 border-yellow-200' },
  { path: '/speaking',       emoji: '🗣️',  label: 'Speaking',     sub: 'Parts 1, 2 & 3',        color: 'bg-pink-50   border-pink-200' },
  { path: '/vocabulary',     emoji: '📖',  label: 'Vocabulary',   sub: 'Flashcards & quizzes',  color: 'bg-purple-50 border-purple-200' },
  { path: '/grammar',        emoji: '⚡',  label: 'Grammar',      sub: 'Drills & explanations', color: 'bg-orange-50 border-orange-200' },
  { path: '/mock-test',      emoji: '📋',  label: 'Mock Tests',   sub: 'Timed practice',        color: 'bg-red-50    border-red-200' },
  { path: '/band-estimator', emoji: '📊',  label: 'Band Estimator', sub: 'Check your level',   color: 'bg-teal-50   border-teal-200' },
  { path: '/achievements',   emoji: '🏆',  label: 'Achievements', sub: 'Unlock rewards',        color: 'bg-amber-50  border-amber-200' },
]

export default function Dashboard() {
  const { profile } = useAuth()
  const completedLessons = profile?.completed_lessons || []
  const totalLessons = COURSE_DATA.reduce((sum, sec) => sum + sec.units.reduce((s, u) => s + u.lessons.length, 0), 0)
  const progressPct = Math.round((completedLessons.length / totalLessons) * 100)
  const xpToday = profile?.xp_today || 0
  const dailyGoal = profile?.daily_goal || 100

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-5">

        {/* Welcome hero */}
        <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl opacity-10 select-none pointer-events-none">🌿</div>
          <h2 className="font-display text-2xl mb-0.5">
            Hi, {profile?.username || 'Learner'}! 👋
          </h2>
          <p className="font-semibold text-lime-100 text-sm mb-3">Ready to crush your IELTS goals today?</p>
          <XPBar />
        </div>

        {/* Daily Goal */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-lime-600" />
              <span className="font-bold text-green-800">Daily Goal</span>
            </div>
            <span className="text-sm font-bold text-green-500">{Math.min(xpToday, dailyGoal)} / {dailyGoal} XP</span>
          </div>
          <div className="h-5 bg-lime-100 rounded-full overflow-hidden border-2 border-lime-200">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
              style={{ width: `${Math.min(100, (xpToday / dailyGoal) * 100)}%` }}
            />
          </div>
          {xpToday >= dailyGoal && (
            <p className="text-center text-lime-600 font-bold text-sm mt-2">🎊 Daily goal complete!</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-display text-xl text-orange-500">{profile?.streak || 0}</div>
            <div className="text-xs font-bold text-gray-500">Streak</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-display text-xl text-lime-600">{profile?.xp || 0}</div>
            <div className="text-xs font-bold text-gray-500">Total XP</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl mb-1">📚</div>
            <div className="font-display text-xl text-green-600">{completedLessons.length}</div>
            <div className="text-xs font-bold text-gray-500">Lessons</div>
          </div>
        </div>

        {/* Continue Learning CTA */}
        <Link to="/learn" className="block bg-gradient-to-r from-green-500 to-lime-500 rounded-3xl p-4 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">▶️</span>
            <div className="flex-1">
              <div className="font-display text-xl">Continue Learning</div>
              <div className="text-lime-100 text-sm font-semibold">
                {completedLessons.length > 0 ? `${completedLessons.length} lessons complete · ${progressPct}% done` : 'Start your Band 9 journey!'}
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/70" />
          </div>
        </Link>

        {/* Practice areas */}
        <div>
          <h3 className="font-display text-xl text-green-800 mb-3">Practice Areas</h3>
          <div className="grid grid-cols-2 gap-3">
            {PRACTICE_CARDS.map(({ path, emoji, label, sub, color }) => (
              <Link
                key={path}
                to={path}
                className={`rounded-2xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color}`}
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-bold text-green-900 text-sm">{label}</div>
                <div className="text-xs text-green-600 font-semibold mt-0.5">{sub}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Course overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xl text-green-800">Course Progress</h3>
            <Link to="/learn" className="text-xs font-bold text-lime-600 hover:text-lime-800">View all →</Link>
          </div>
          <div className="h-4 bg-lime-100 rounded-full overflow-hidden border-2 border-lime-200 mb-3">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {COURSE_DATA.map(section => {
              const total = section.units.reduce((s, u) => s + u.lessons.length, 0)
              const done = section.units.reduce((s, u) => s + u.lessons.filter(l => completedLessons.includes(l.id)).length, 0)
              const pct = Math.round((done / total) * 100)
              return (
                <div key={section.id} className="flex items-center gap-2 text-sm">
                  <span>{section.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold text-green-700">
                      <span>{section.title.split(' ')[0]}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-lime-100 rounded-full mt-0.5">
                      <div className="h-full bg-lime-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Band score guide */}
        <div className="card bg-gradient-to-br from-green-50 to-lime-50">
          <h3 className="font-display text-xl text-green-800 mb-3">🎯 Band Score Guide</h3>
          {[
            { band: '9', label: 'Expert',     color: 'bg-lime-400',   pct: 100 },
            { band: '8', label: 'Very Good',  color: 'bg-green-400',  pct: 87 },
            { band: '7', label: 'Good',       color: 'bg-yellow-400', pct: 73 },
            { band: '6', label: 'Competent',  color: 'bg-orange-400', pct: 60 },
            { band: '5', label: 'Modest',     color: 'bg-red-400',    pct: 47 },
          ].map(({ band, label, color, pct }) => (
            <div key={band} className="flex items-center gap-3 mb-2">
              <div className={`${color} text-white font-display text-lg w-9 h-9 rounded-xl flex items-center justify-center shadow shrink-0`}>{band}</div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold text-green-700 mb-0.5">
                  <span>{label}</span><span>{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          ))}
          <Link to="/band-estimator" className="block mt-3 text-center text-sm font-bold text-lime-600 hover:text-lime-800">
            → Estimate your current band
          </Link>
        </div>

      </div>
    </div>
  )
}
