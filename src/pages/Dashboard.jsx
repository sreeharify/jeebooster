import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import XPBar from '../components/XPBar'
import { COURSE_DATA } from '../data/courseData'
import { ChevronRight, Target, Zap, Flame } from 'lucide-react'

const PRACTICE_CARDS = [
  { path:'/learn',          emoji:'📚', label:'Start Learning', sub:'Subject-wise topics',  color:'bg-lime-50   border-lime-200'   },
  { path:'/mock-test',      emoji:'📋', label:'Mock Tests',    sub:'Timed JEE practice',   color:'bg-red-50    border-red-200'    },
  { path:'/leaderboard',    emoji:'🏆', label:'Leaderboard',   sub:'Check your rank',      color:'bg-amber-50  border-amber-200'  },
  { path:'/rank-predictor', emoji:'📊', label:'Rank Predictor',sub:'Predict your AIR',     color:'bg-teal-50   border-teal-200'   },
]

export default function Dashboard() {
  const { profile } = useAuth()
  const completed   = profile?.completed_lessons || []
  
  // Calculate total lessons across all levels
  const total = COURSE_DATA.reduce((sum, sec) => 
    sum + sec.subjects.reduce((s, sub) => 
      s + sub.chapters.reduce((c, ch) => c + ch.lessons.length, 0), 0), 0)
      
  const pct         = Math.round((completed.length / total) * 100)
  const xpToday     = profile?.xp_today  || 0
  const dailyGoal   = profile?.daily_goal || 100

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-5">

        {/* Hero */}
        <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-9xl opacity-10 select-none pointer-events-none">🚀</div>
          <h2 className="font-display text-2xl mb-0.5">Hi, {profile?.username || 'Learner'}! 👋</h2>
          <p className="font-semibold text-lime-100 text-sm mb-3">Ready to level up today?</p>
          <XPBar />
        </div>

        {/* Stats */}
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
            <div className="font-display text-xl text-green-600">{completed.length}</div>
            <div className="text-xs font-bold text-gray-500">Lessons</div>
          </div>
        </div>

        {/* Daily goal */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-lime-600" />
              <span className="font-bold text-green-800">Daily Goal</span>
            </div>
            <span className="text-sm font-bold text-green-500">{Math.min(xpToday, dailyGoal)} / {dailyGoal} XP</span>
          </div>
          <div className="h-5 bg-lime-100 rounded-full overflow-hidden border-2 border-lime-200">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
              style={{ width: `${Math.min(100, (xpToday / dailyGoal) * 100)}%` }} />
          </div>
          {xpToday >= dailyGoal && (
            <p className="text-center text-lime-600 font-bold text-sm mt-2">🎊 Daily goal smashed!</p>
          )}
        </div>

        {/* Continue CTA */}
        <Link to="/learn" className="block bg-gradient-to-r from-green-500 to-lime-500 rounded-3xl p-4 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">▶️</span>
            <div className="flex-1">
              <div className="font-display text-xl">Continue Learning</div>
              <div className="text-lime-100 text-sm font-semibold">
                {completed.length > 0 ? `${completed.length}/${total} subtopics done` : 'Start your JEE Success journey!'}
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
              <Link key={path} to={path}
                className={`rounded-2xl border-2 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${color}`}>
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
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {COURSE_DATA.map(section => {
              const secTotal = section.subjects.reduce((s, sub) => s + sub.chapters.reduce((c, ch) => c + ch.lessons.length, 0), 0)
              const secDone = section.subjects.reduce((s, sub) => s + sub.chapters.reduce((c, ch) => c + ch.lessons.filter(l => completed.includes(l.id)).length, 0), 0)
              const secPct = Math.round((secDone / secTotal) * 100)
              
              return (
                <div key={section.id} className="flex items-center gap-2 text-sm">
                  <span>{section.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold text-green-700 uppercase tracking-tight">
                      <span>{section.title.split(' ')[0]} {section.title.split(' ')[1]}</span>
                      <span>{secPct}%</span>
                    </div>
                    <div className="h-1.5 bg-lime-100 rounded-full mt-0.5 border border-lime-200">
                      <div className="h-full bg-lime-400 rounded-full" style={{ width:`${secPct}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Score guide */}
        <div className="card bg-gradient-to-br from-green-50 to-lime-50">
          <h3 className="font-display text-xl text-green-800 mb-3">🎯 JEE Performance Guide</h3>
          {[
            {label:'IIT Bombay Ready',  desc:'Percentile: 99.9+', color:'bg-lime-400',   pct:100},
            {label:'Top NITs Focus',    desc:'Percentile: 99.0+', color:'bg-green-400',  pct:85},
            {label:'Qualification Prep', desc:'Percentile: 95.0+', color:'bg-yellow-400', pct:70},
            {label:'Work Harder',       desc:'Percentile: 85.0+', color:'bg-orange-400', pct:50},
            {label:'Foundation Stage',   desc:'Percentile: < 80', color:'bg-red-400',    pct:30},
          ].map(({ label, desc, color, pct }) => (
            <div key={label} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className={`${color} w-2 h-10 rounded-full shadow-sm shrink-0`} />
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold text-green-800">
                  <span>{label}</span>
                  <span className="text-green-500">{pct}% Concepts</span>
                </div>
                <div className="text-[10px] font-semibold text-green-600/70 mb-1">{desc}</div>
                <div className="h-1.5 bg-white rounded-full border border-green-100"><div className={`h-full ${color} rounded-full`} style={{ width:`${pct}%` }} /></div>
              </div>
            </div>
          ))}
          <Link to="/rank-predictor" className="block mt-4 text-center text-sm font-bold text-white bg-green-600 py-3 rounded-2xl shadow-md hover:bg-green-700 transition-colors">
            Calculate your Percentile →
          </Link>
        </div>
      </div>
    </div>
  )
}
