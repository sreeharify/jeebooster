import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import { COURSE_DATA } from '../data/courseData'
import { Lock, CheckCircle, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const LESSON_TYPE_ICONS = {
  info: '📖', quiz: '❓', vocab: '📝', match: '🔗', fill: '✏️',
  listen: '🎧', listen_fill: '🎧', reading: '👁️', writing: '✍️',
  speaking: '🗣️', grammar: '⚡', test: '📋', mock: '🏅', interactive: '🎮',
}

export default function Learn() {
  const { profile } = useAuth()
  const completed = profile?.completed_lessons || []
  const [expanded, setExpanded] = useState({ 1: true })

  function isLessonUnlocked(sectionIdx, unitIdx, lessonIdx, allSections) {
    if (sectionIdx === 0 && unitIdx === 0 && lessonIdx === 0) return true
    // Unlock if previous lesson in same unit is done
    if (lessonIdx > 0) {
      const prevId = allSections[sectionIdx].units[unitIdx].lessons[lessonIdx - 1].id
      return completed.includes(prevId)
    }
    // First lesson of unit: previous unit must have at least 60% done
    if (unitIdx > 0) {
      const prevUnit = allSections[sectionIdx].units[unitIdx - 1]
      const prevDone = prevUnit.lessons.filter(l => completed.includes(l.id)).length
      return prevDone >= Math.ceil(prevUnit.lessons.length * 0.6)
    }
    // First lesson of first unit of section: prev section must be 50% done
    if (sectionIdx > 0) {
      const prevSection = allSections[sectionIdx - 1]
      const total = prevSection.units.reduce((s, u) => s + u.lessons.length, 0)
      const done = prevSection.units.reduce((s, u) => s + u.lessons.filter(l => completed.includes(l.id)).length, 0)
      return done >= Math.ceil(total * 0.5)
    }
    return false
  }

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h2 className="font-display text-3xl text-green-800 mb-1">Learn 📚</h2>
        <p className="text-green-500 font-semibold text-sm mb-5">Your journey to Band 9 starts here!</p>

        <div className="space-y-4">
          {COURSE_DATA.map((section, sIdx) => {
            const totalLessons = section.units.reduce((s, u) => s + u.lessons.length, 0)
            const doneLessons = section.units.reduce((s, u) => s + u.lessons.filter(l => completed.includes(l.id)).length, 0)
            const pct = Math.round((doneLessons / totalLessons) * 100)
            const isOpen = !!expanded[section.id]

            return (
              <div key={section.id} className="card overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                  className="w-full"
                >
                  <div className={`bg-gradient-to-r ${section.color} rounded-2xl p-4 flex items-center gap-3`}>
                    <span className="text-4xl">{section.icon}</span>
                    <div className="flex-1 text-left">
                      <h3 className="font-display text-xl text-white">{section.title}</h3>
                      <p className="text-white/80 text-xs font-semibold">{section.description}</p>
                      <div className="mt-2 h-2 bg-white/30 rounded-full">
                        <div className="h-full bg-white rounded-full progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-white/90 text-xs font-bold mt-1">{doneLessons}/{totalLessons} lessons • {pct}%</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-white/70" /> : <ChevronDown className="w-5 h-5 text-white/70" />}
                  </div>
                </button>

                {/* Units */}
                {isOpen && (
                  <div className="mt-4 space-y-4">
                    {section.units.map((unit, uIdx) => {
                      const unitDone = unit.lessons.filter(l => completed.includes(l.id)).length
                      return (
                        <div key={unit.id}>
                          <div className="flex items-center gap-2 mb-2 px-1">
                            <span className="text-xl">{unit.icon}</span>
                            <h4 className="font-bold text-green-800">{unit.title}</h4>
                            <span className="ml-auto text-xs font-bold text-green-500">{unitDone}/{unit.lessons.length}</span>
                          </div>

                          <div className="space-y-2">
                            {unit.lessons.map((lesson, lIdx) => {
                              const isDone = completed.includes(lesson.id)
                              const isUnlocked = isDone || isLessonUnlocked(sIdx, uIdx, lIdx, COURSE_DATA)
                              const typeIcon = LESSON_TYPE_ICONS[lesson.type] || '📖'

                              return (
                                <div key={lesson.id} className="relative">
                                  {lIdx < unit.lessons.length - 1 && (
                                    <div className="absolute left-6 top-full w-0.5 h-2 bg-lime-300 z-0" />
                                  )}
                                  {isUnlocked ? (
                                    <Link
                                      to={`/lesson/${lesson.id}`}
                                      className={`relative z-10 flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                                        ${isDone
                                          ? 'bg-lime-50 border-lime-300 hover:border-lime-400'
                                          : 'bg-white border-gray-200 hover:border-lime-300 hover:bg-lime-50'
                                        }`}
                                    >
                                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0
                                        ${isDone ? 'bg-lime-400' : 'bg-lime-100'}`}>
                                        {isDone ? '✅' : typeIcon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-green-800 text-sm leading-tight">{lesson.title}</div>
                                        <div className="text-xs text-green-500 font-semibold capitalize mt-0.5">{lesson.type}</div>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <span className="text-xs font-bold text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">+{lesson.xp}xp</span>
                                        {isDone && <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />}
                                      </div>
                                    </Link>
                                  ) : (
                                    <div className="relative z-10 flex items-center gap-3 p-3 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-60">
                                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gray-200 shrink-0">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-500 text-sm">{lesson.title}</div>
                                        <div className="text-xs text-gray-400 font-semibold">Complete previous lessons</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
