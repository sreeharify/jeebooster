import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import { COURSE_DATA } from '../data/courseData'
import { Lock, CheckCircle, Star, ChevronDown, ChevronUp, BookOpen, Atom, Beaker, Ruler } from 'lucide-react'
import { useState } from 'react'

const SUBJECT_ICONS = {
  Physics: <Atom className="w-5 h-5" />,
  Chemistry: <Beaker className="w-5 h-5" />,
  Mathematics: <Ruler className="w-5 h-5" />,
  'Preparation Strategy': <BookOpen className="w-5 h-5" />,
  'Mock Test Zone': <CheckCircle className="w-5 h-5" />,
}

const LESSON_TYPE_ICONS = {
  info: '📖', quiz: '❓', mock: '🏅', interactive: '🎮',
}

export default function Learn() {
  const { profile } = useAuth()
  const completed = profile?.completed_lessons || []
  const [expandedSections, setExpandedSections] = useState({})
  const [expandedChapters, setExpandedChapters] = useState({})

  function toggleChapter(chapterId) {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }))
  }

  function isLessonUnlocked(chapter, lessonIdx) {
    if (lessonIdx === 0) return true // Any chapter can be started anytime
    const prevId = chapter.lessons[lessonIdx - 1].id
    return completed.includes(prevId)
  }

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16 font-sans">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-8">
          <h2 className="font-display text-4xl text-green-900 mb-1 drop-shadow-sm">Roadmap 🚀</h2>
          <p className="text-green-600 font-bold text-sm">Master the JEE Syllabus step-by-step.</p>
        </div>

        <div className="space-y-6">
          {COURSE_DATA.map((section) => {
            const isSectionOpen = expandedSections[section.id]
            const totalLessons = section.subjects.reduce((s, sub) => s + sub.chapters.reduce((c, ch) => c + ch.lessons.length, 0), 0)
            const doneLessons = section.subjects.reduce((s, sub) => s + sub.chapters.reduce((c, ch) => c + ch.lessons.filter(l => completed.includes(l.id)).length, 0), 0)
            const pct = Math.round((doneLessons / totalLessons) * 100)

            return (
              <div key={section.id} className="relative">
                {/* Section Button - 3D Look */}
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                  className={`w-full relative transition-all duration-200 active:translate-y-1 active:shadow-none
                    bg-white border-4 border-green-800 rounded-3xl p-5 text-left mb-2
                    shadow-[0_8px_0_0_#166534] ${isSectionOpen ? 'translate-y-1 shadow-[0_4px_0_0_#166534]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-3xl text-white shadow-inner`}>
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-green-900 leading-tight">{section.title}</h3>
                      <p className="text-green-600/70 text-xs font-bold uppercase tracking-wider">{doneLessons}/{totalLessons} LESSONS DONE</p>
                    </div>
                    {isSectionOpen ? <ChevronUp className="text-green-800 w-6 h-6" /> : <ChevronDown className="text-green-800 w-6 h-6" />}
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div className="mt-4 h-3 bg-lime-100 rounded-full border-2 border-green-800 overflow-hidden">
                    <div className="h-full bg-lime-400 progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </button>

                {/* Subjects & Chapters */}
                {isSectionOpen && (
                  <div className="pt-4 pb-2 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {section.subjects.map((subject) => (
                      <div key={subject.id} className="space-y-4">
                        {/* Subject Header */}
                        <div className="flex items-center gap-2 px-2">
                          <div className="p-2 bg-green-100 rounded-lg text-green-700">
                            {SUBJECT_ICONS[subject.title] || <BookOpen className="w-5 h-5" />}
                          </div>
                          <h4 className="font-display text-xl text-green-800">{subject.title}</h4>
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-green-200 to-transparent ml-2" />
                        </div>

                        {/* Chapters */}
                        <div className="space-y-3">
                          {subject.chapters.map((chapter) => {
                            const isChapterExpanded = !!expandedChapters[chapter.id]
                            const chapterDone = chapter.lessons.filter(l => completed.includes(l.id)).length
                            const isChapterComplete = chapterDone === chapter.lessons.length

                            return (
                              <div key={chapter.id} className="bg-white rounded-2xl border-2 border-green-800/20 overflow-hidden shadow-sm">
                                <button
                                  onClick={() => toggleChapter(chapter.id)}
                                  className="w-full p-4 flex items-center justify-between hover:bg-lime-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                                      ${isChapterComplete ? 'bg-lime-400 text-white' : 'bg-lime-100 text-lime-700'}`}>
                                      {isChapterComplete ? '✓' : chapterDone}
                                    </div>
                                    <span className={`font-bold text-sm ${isChapterComplete ? 'text-green-800' : 'text-gray-700'}`}>
                                      {chapter.title}
                                    </span>
                                  </div>
                                  {isChapterExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </button>

                                {isChapterExpanded && (
                                  <div className="p-3 bg-gray-50/50 border-t border-green-800/10 space-y-2">
                                    {chapter.lessons.map((lesson, lIdx) => {
                                      const isDone = completed.includes(lesson.id)
                                      const isUnlocked = isDone || isLessonUnlocked(chapter, lIdx)
                                      const typeIcon = LESSON_TYPE_ICONS[lesson.type] || '📖'

                                      return (
                                        <div key={lesson.id}>
                                          {isUnlocked ? (
                                            <Link
                                              to={`/lesson/${lesson.id}`}
                                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                                                ${isDone 
                                                  ? 'bg-lime-50 border-lime-300 shadow-[0_4px_0_0_#bef264] active:shadow-none active:translate-y-1' 
                                                  : 'bg-white border-green-800/10 shadow-[0_4px_0_0_#f1f5f9] hover:border-lime-400 active:shadow-none active:translate-y-1'
                                                }`}
                                            >
                                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                                                ${isDone ? 'bg-lime-400 text-white' : 'bg-lime-100 text-lime-600'}`}>
                                                {isDone ? '✅' : typeIcon}
                                              </div>
                                              <div className="flex-1">
                                                <div className="font-bold text-green-900 text-sm leading-tight">{lesson.title}</div>
                                                <div className="text-[10px] text-green-500 font-bold uppercase tracking-tight mt-0.5">{lesson.type} • +{lesson.xp}XP</div>
                                              </div>
                                            </Link>
                                          ) : (
                                            <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 opacity-60">
                                              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 shrink-0 text-gray-400">
                                                <Lock className="w-4 h-4" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="font-bold text-gray-400 text-sm">{lesson.title}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Locked</div>
                                              </div>
                                            </div>
                                          )}
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
                    ))}
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
