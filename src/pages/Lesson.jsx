import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { X, Zap, ChevronRight, BookOpen, Lightbulb, RotateCcw } from 'lucide-react'
import { COURSE_DATA } from '../data/courseData'
import { getSlides } from '../data/lessonLoader'
import Confetti from 'react-confetti'

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function findLesson(id) {
  for (const s of COURSE_DATA)
    for (const sub of s.subjects)
      for (const ch of sub.chapters) {
        const l = ch.lessons.find(l => l.id === id)
        if (l) return { lesson: l, chapter: ch, subject: sub, section: s }
      }
  return null
}

function levelLabel(l) {
  if (!l || l <= 1) return { label: 'Level 1 — Foundation', color: 'bg-blue-400', emoji: '🌱' }
  if (l === 2)      return { label: 'Level 2 — Intermediate', color: 'bg-indigo-500', emoji: '⚡' }
  if (l === 3)      return { label: 'Level 3 — Advanced',   color: 'bg-purple-600',  emoji: '🔥' }
  return               { label: 'Level 4 — Expert',     color: 'bg-red-600',     emoji: '🚀' }
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

// Safety guard — logs console error if duplicate word/meaning found in match_pairs data
function validatePairs(pairs, context) {
  const words    = pairs.map(p => p.word)
  const meanings = pairs.map(p => p.meaning)
  const dupWord    = words.find((w, i) => words.indexOf(w) !== i)
  const dupMeaning = meanings.find((m, i) => meanings.indexOf(m) !== i)
  if (dupWord)    console.error(`[MatchPairs] Duplicate word "${dupWord}" in: ${context}`)
  if (dupMeaning) console.error(`[MatchPairs] Duplicate meaning "${dupMeaning}" in: ${context}`)
}

// Build the full slide list for a lesson: prepend the intro card
function buildAllSlides(lesson) {
  const TYPE_ICON = {
    physics:'⚛️', chemistry:'🧪', math:'📐', quiz:'❓', fill:'✏️',
    info:'📖', match:'🔗', interactive:'🎮', test:'📋', mock:'🏅'
  }
  const WHAT = {
    physics: 'Master core concepts of Physics for JEE.',
    chemistry: 'Build a strong foundation in Organic, Inorganic, and Physical Chemistry.',
    math: 'Solve complex problems in Calculus, Algebra, and Geometry.',
    quiz: 'Test your understanding of the latest concepts.',
    info: 'Learn strategical tips for JEE Main and Advanced.',
    match: 'Match concepts with their definitions or formulas.',
    fill: 'Complete the steps in a derivation or formula.',
    interactive: 'Build your personalised JEE study plan.',
    test: 'Unit test covering everything you learned.',
    mock: 'Full subject-wise mock test practice.',
  }
  const TIPS = {
    physics: '💡 Focus on conceptual clarity before jumping to numericals.',
    chemistry: '💡 Regularly revise reactions and periodic table trends.',
    math: '💡 Practice makes perfect in Calculus and Algebra!',
    quiz: '💡 Read ALL options before choosing — eliminate obviously wrong ones first.',
    info: '💡 Strategy is just as important as knowledge in JEE.',
    match: '💡 Link formulas with their respective physical quantities.',
    fill: '💡 Think about the logical flow of the derivation.',
    test: '💡 Treat this like the real exam — timed and focused.',
    mock: '💡 Full concentration! Mimic real exam conditions.',
  }

  const icon = TYPE_ICON[lesson.type] || '📚'
  const what = WHAT[lesson.type] || `Build skills for: ${lesson.title}`
  const tip  = TIPS[lesson.type]  || '💡 Read carefully and trust your instincts!'

  const intro = { kind: 'intro', title: lesson.title, icon, what, tip }
  const content = getSlides(lesson.id)

  return [intro, ...content]
}

// ─────────────────────────────────────────────────────────────
//  SLIDE COMPONENTS
// ─────────────────────────────────────────────────────────────

function IntroSlide({ slide, onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 text-center max-w-lg mx-auto w-full">
      <div className="text-7xl mb-4">{slide.icon}</div>
      <h2 className="font-display text-3xl text-green-800 mb-2">{slide.title}</h2>
      <p className="text-green-500 font-semibold text-sm mb-6 max-w-xs leading-relaxed">{slide.what}</p>
      <div className="card w-full mb-5 text-left bg-lime-50 border-lime-200">
        <p className="font-semibold text-green-800 text-sm">{slide.tip}</p>
      </div>
      <div className="w-full space-y-2 mb-6">
        {['Starts at Level 1 — beginner-friendly','Builds to Level 4 step by step',
          'Every mistake explained clearly','Variety of question types'].map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <span className="text-lime-500">✓</span>{t}
          </div>
        ))}
      </div>
      <button onClick={onStart} className="btn-primary w-full py-4 text-lg">Let's Go! 🚀</button>
    </div>
  )
}

function ExplainerSlide({ slide, onNext }) {
  const { label, color } = levelLabel(slide.level || slide.band)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      {(slide.level || slide.band) > 0 && (
        <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      )}
      <div className="flex items-start gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
        <h3 className="font-display text-2xl text-green-900 leading-snug">{slide.title}</h3>
      </div>
      {slide.sections?.map((sec, i) => (
        <div key={i} className="mb-4">
          {sec.heading && (
            <div className="font-bold text-green-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-1 h-4 bg-lime-400 rounded-full inline-block" />
              {sec.heading}
            </div>
          )}
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-base text-gray-800 font-medium whitespace-pre-line leading-relaxed">{sec.body}</p>
          </div>
        </div>
      ))}
      {slide.body && !slide.sections && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-base text-gray-800 font-medium whitespace-pre-line leading-relaxed">{slide.body}</p>
        </div>
      )}
      {slide.highlight && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-4 flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-base font-bold text-yellow-800">{slide.highlight}</p>
        </div>
      )}
      {slide.example && (
        <div className="space-y-2 mb-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="text-xs font-bold text-red-500 mb-2">❌ Common Mistake</div>
            <p className="text-base text-red-800 font-medium">{slide.example.wrong}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4">
            <div className="text-xs font-bold text-green-600 mb-2">✅ Correct Approach</div>
            <p className="text-base text-green-900 font-medium">{slide.example.right}</p>
          </div>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-2 shrink-0">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function MiniExplainerSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-green-100 text-green-700 rounded-2xl px-3 py-1.5 text-sm font-bold self-start mb-3 flex items-center gap-1">
        <Lightbulb className="w-4 h-4" /> Quick Note
      </div>
      <h3 className="font-display text-2xl text-green-900 mb-3 leading-snug">{slide.title}</h3>
      <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-4 shadow-sm flex-1">
        <p className="text-base text-gray-800 font-medium whitespace-pre-line leading-relaxed">{slide.body}</p>
      </div>
      {slide.quick && (
        <div className="space-y-2 mb-4">
          {slide.quick.map((q, i) => (
            <div key={i} className="flex items-start gap-3 bg-lime-50 border border-lime-200 rounded-2xl px-4 py-3">
              <span className="text-xl shrink-0 mt-0.5">{q.icon}</span>
              <span className="text-base font-semibold text-green-900">{q.label}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        Continue <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

// ─── NEW SLIDE COMPONENTS ────────────────────────────────────────

function VisualSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      <div className="bg-blue-100 text-blue-700 rounded-2xl px-3 py-1.5 text-sm font-bold self-start mb-3">📊 Visual</div>
      <h3 className="font-display text-2xl text-green-900 mb-3 leading-snug">{slide.title}</h3>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-4">
        <div dangerouslySetInnerHTML={{ __html: slide.html }} />
      </div>
      {slide.caption && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-4">
          <p className="text-sm font-semibold text-blue-800 text-center">{slide.caption}</p>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 shrink-0">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

const FORMULA_COLORS = {
  green:  { card: 'from-green-500 to-emerald-600',  badge: 'bg-green-100 text-green-800' },
  blue:   { card: 'from-blue-500 to-indigo-600',    badge: 'bg-blue-100 text-blue-800' },
  orange: { card: 'from-orange-500 to-amber-600',   badge: 'bg-orange-100 text-orange-800' },
  purple: { card: 'from-purple-500 to-violet-600',  badge: 'bg-purple-100 text-purple-800' },
  red:    { card: 'from-red-500 to-rose-600',       badge: 'bg-red-100 text-red-800' },
}

function FormulaCardSlide({ slide, onNext }) {
  const [showDerivation, setShowDerivation] = useState(false)
  const theme = FORMULA_COLORS[slide.color] || FORMULA_COLORS.green
  const { label, color } = levelLabel(slide.level)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      {slide.level && <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>}
      <h3 className="font-display text-2xl text-green-900 mb-4">{slide.title}</h3>
      {/* Big formula card */}
      <div className={`bg-gradient-to-br ${theme.card} rounded-3xl p-6 mb-5 flex items-center justify-center shadow-lg`}>
        <span className="font-display text-4xl text-white tracking-wide text-center">{slide.formula}</span>
      </div>
      {/* Symbol breakdown */}
      {slide.parts && (
        <div className="space-y-2 mb-4">
          {slide.parts.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <span className={`font-display text-lg font-bold px-3 py-1 rounded-xl ${theme.badge}`}>{p.symbol}</span>
              <span className="text-base text-gray-700 font-medium">{p.meaning}</span>
            </div>
          ))}
        </div>
      )}
      {slide.note && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-4 py-3 mb-3 flex gap-2">
          <span className="text-lg">⚠️</span>
          <p className="text-sm font-semibold text-yellow-800">{slide.note}</p>
        </div>
      )}
      {slide.derived_from && (
        <>
          <button onClick={() => setShowDerivation(s => !s)} className="text-sm font-bold text-lime-600 mb-2 text-left">
            {showDerivation ? '▲ Hide' : '▼ Show'} derivation
          </button>
          {showDerivation && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-3">
              <p className="text-sm text-gray-700 font-medium whitespace-pre-line">{slide.derived_from}</p>
            </div>
          )}
        </>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 shrink-0">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function TapRevealSlide({ slide, onNext }) {
  const [revealed, setRevealed] = useState([])
  const [done, setDone] = useState(false)
  function revealItem(i) {
    if (revealed.includes(i)) return
    const next = [...revealed, i]
    setRevealed(next)
    if (next.length === slide.items.length) setDone(true)
  }
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      <div className="bg-teal-100 text-teal-700 rounded-2xl px-3 py-1.5 text-sm font-bold self-start mb-3">👆 Tap to Reveal</div>
      <h3 className="font-display text-2xl text-green-900 mb-1">{slide.title}</h3>
      <p className="text-sm text-green-500 font-semibold mb-4">{slide.instruction}</p>
      <div className="space-y-3 flex-1">
        {slide.items.map((item, i) => (
          <button key={i} onClick={() => revealItem(i)}
            className={`w-full rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
              revealed.includes(i)
                ? 'border-teal-300 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-teal-300 active:scale-98'
            }`}>
            <div className="flex items-center">
              <div className="px-4 py-3 font-bold text-base text-gray-800 flex-1">{item.front}</div>
              {revealed.includes(i)
                ? <div className="px-4 py-3 border-l-2 border-teal-200 font-bold text-base text-teal-700 flex-1">{item.back}</div>
                : <div className="px-4 py-3 border-l-2 border-dashed border-gray-200 text-gray-400 text-sm font-semibold flex-1">Tap →</div>
              }
            </div>
          </button>
        ))}
      </div>
      {done && (
        <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-4 shrink-0">
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      )}
      {!done && (
        <p className="text-center text-gray-400 text-sm font-semibold mt-4">
          {revealed.length}/{slide.items.length} revealed
        </p>
      )}
    </div>
  )
}

function WorkedExampleSlide({ slide, onNext }) {
  const [stepIdx, setStepIdx] = useState(0)
  const { label, color } = levelLabel(slide.level)
  const steps = slide.steps || []
  const allDone = stepIdx >= steps.length
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        {slide.level && <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold`}>{label}</div>}
        <div className="bg-orange-100 text-orange-700 rounded-2xl px-3 py-1.5 text-sm font-bold">🧮 Worked Example</div>
      </div>
      <h3 className="font-display text-2xl text-green-900 mb-3">{slide.title}</h3>
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-4">
        <div className="text-xs font-bold text-orange-600 mb-1">📋 Problem</div>
        <p className="text-base font-semibold text-orange-900">{slide.problem}</p>
      </div>
      {/* Steps shown so far */}
      <div className="space-y-3 flex-1">
        {steps.slice(0, stepIdx).map((s, i) => (
          <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-lime-400 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <span className="font-bold text-green-800 text-base">{s.step}</span>
            </div>
            <p className="text-base text-gray-700 font-medium whitespace-pre-line pl-9">{s.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 shrink-0">
        {!allDone ? (
          <button onClick={() => setStepIdx(i => i + 1)}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {stepIdx === 0 ? 'Start Solution' : `Step ${stepIdx + 1} →`} <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
            🎉 Got it! <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {stepIdx > 0 && !allDone && (
          <p className="text-center text-xs text-gray-400 font-semibold mt-2">Step {stepIdx}/{steps.length}</p>
        )}
      </div>
    </div>
  )
}

function CommonMistakeSlide({ slide, onNext }) {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      <div className="bg-red-100 text-red-700 rounded-2xl px-3 py-1.5 text-sm font-bold self-start mb-3">⚠️ Common Mistakes</div>
      <h3 className="font-display text-2xl text-green-900 mb-4">{slide.title}</h3>
      <div className="space-y-3 flex-1">
        {(slide.mistakes || []).map((m, i) => (
          <div key={i} className="bg-white border-2 border-red-100 rounded-2xl overflow-hidden shadow-sm">
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left px-4 py-4 flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">❌</span>
              <span className="font-semibold text-base text-gray-800 flex-1">{m.mistake}</span>
              <span className="text-gray-400 font-bold ml-2">{expanded === i ? '▲' : '▼'}</span>
            </button>
            {expanded === i && (
              <div className="bg-green-50 border-t-2 border-green-100 px-4 py-4 flex gap-3">
                <span className="text-xl shrink-0">✅</span>
                <p className="text-base text-green-900 font-medium">{m.fix}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-4 shrink-0">
        Understood! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function FlashcardSlide({ slide, onNext }) {
  const [flipped, setFlipped]       = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { label, color } = levelLabel(slide.band)
  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-2`}>{label}</div>
      <p className="text-xs font-bold text-green-500 text-center mb-2 uppercase tracking-wide">Tap card to flip</p>
      <div onClick={() => setFlipped(f => !f)} className="cursor-pointer mb-3" style={{ perspective: '1000px', height: '190px' }}>
        <div className="relative w-full h-full transition-all duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl flex flex-col items-center justify-center shadow-lg p-5"
            style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-white/60 text-xs font-bold mb-2 uppercase tracking-widest">{slide.partOfSpeech || 'word'}</div>
            <div className="font-display text-4xl text-white mb-2">{slide.word}</div>
            <div className="text-white/70 text-sm font-semibold">Tap to reveal →</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 rounded-3xl flex flex-col items-center justify-center shadow-lg p-5"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="text-lime-300 text-xs font-bold mb-1 uppercase tracking-widest">Meaning</div>
            <div className="font-display text-xl text-white text-center mb-2">{slide.meaning}</div>
            <div className="text-white/70 text-xs font-semibold text-center italic">"{slide.example}"</div>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-2.5 mb-2">
        <div className="text-xs font-bold text-orange-600 mb-0.5">⚠️ Don't confuse with:</div>
        <p className="text-xs text-orange-800 font-semibold">{slide.wrong}</p>
      </div>
      <button onClick={() => setShowDetails(s => !s)} className="text-xs font-bold text-lime-600 mb-2 text-left">
        {showDetails ? '▲ Hide' : '▼ Show'} collocations & word family
      </button>
      {showDetails && (
        <div className="space-y-2 mb-2">
          {slide.collocations && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
              <div className="text-xs font-bold text-blue-600 mb-1">Common collocations:</div>
              <div className="flex flex-wrap gap-1">
                {slide.collocations.map((c, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          )}
          {slide.family && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5">
              <div className="text-xs font-bold text-purple-600 mb-1">Word family:</div>
              {slide.family.map((f, i) => <div key={i} className="text-xs text-purple-800 font-semibold">{f}</div>)}
            </div>
          )}
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full">Next →</button>
    </div>
  )
}

function PassageSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-blue-100 text-blue-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-2">📖 Reading Passage</div>
      <div className="text-xs font-bold text-green-600 mb-2">{slide.label}</div>
      <div className="card bg-blue-50 border-2 border-blue-200 flex-1 mb-3 overflow-y-auto">
        {slide.text.split('\n\n').map((p, i) => (
          <p key={i} className="text-sm text-blue-900 font-semibold leading-relaxed mb-3 last:mb-0">
            <span className="font-bold text-blue-500 mr-1">({String.fromCharCode(65 + i)})</span>{p}
          </p>
        ))}
      </div>
      {slide.tip && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-3">
          <p className="text-xs font-bold text-yellow-700">{slide.tip}</p>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        Start Questions <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function MCQSlide({ slide, checked, selected, setSelected }) {
  const { label, color } = levelLabel(slide.band)
  const isCorrect = checked && selected === slide.correct
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      <h3 className="font-display text-xl text-green-900 mb-4 leading-snug">{slide.question}</h3>
      <div className="space-y-3 flex-1">
        {slide.options.map((opt, i) => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
          if (checked) {
            if (opt === slide.correct)    cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
            else if (opt === selected)    cls = 'bg-red-100 border-2 border-red-400 text-red-900'
            else                          cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-50'
          } else if (opt === selected)    cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
          return (
            <button key={i} onClick={() => !checked && setSelected(opt)}
              className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
              <span className="text-xs font-bold opacity-50 mr-2">{['A','B','C','D'][i]}.</span>
              {opt}
              {checked && opt === slide.correct && <span className="ml-2">✅</span>}
              {checked && opt === selected && opt !== slide.correct && <span className="ml-2">❌</span>}
            </button>
          )
        })}
      </div>
      {!checked && slide.hint && <p className="text-xs font-semibold text-lime-600 mt-3 text-center">💡 {slide.hint}</p>}
      {checked && (
        <div className={`mt-4 p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : '📖 Explanation:'}</div>
          <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function FillBlankSlide({ slide, checked, answers, setAnswers }) {
  const blanks = slide.blanks || []
  // Shuffle distractor order once per mount per blank
  const shuffledOptionsRef = useRef(
    blanks.map(b => shuffle([b.correct, ...b.distractors]))
  )
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-purple-100 text-purple-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">✏️ Fill in the Blank</div>
      <div className="card bg-purple-50 border-2 border-purple-200 mb-4">
        <p className="text-base font-bold text-green-900 leading-relaxed">
          {slide.sentence.split('_______').map((part, i) => (
            <span key={i}>
              {part}
              {i < blanks.length && (
                <span className={`inline-block min-w-[100px] text-center font-bold rounded-xl px-2 py-0.5 mx-1 border-2 text-sm transition-all ${
                  checked
                    ? answers[i] === blanks[i].correct
                      ? 'bg-lime-200 border-lime-400 text-green-900'
                      : 'bg-red-100 border-red-400 text-red-900'
                    : answers[i]
                      ? 'bg-lime-100 border-lime-300 text-green-800'
                      : 'bg-white border-dashed border-gray-400 text-gray-400'
                }`}>
                  {answers[i] || '???'}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
      {blanks.map((blank, i) => (
        <div key={i} className="mb-3">
          {blanks.length > 1 && <div className="text-xs font-bold text-gray-500 mb-1">Blank {i + 1}:</div>}
          <div className="grid grid-cols-2 gap-2">
            {shuffledOptionsRef.current[i].map((opt, j) => {
              let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              if (checked) {
                if (opt === blank.correct)  cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
                else if (answers[i] === opt) cls = 'bg-red-100 border-2 border-red-400 text-red-900'
                else                         cls = 'bg-gray-50 border-2 border-gray-200 opacity-50'
              } else if (answers[i] === opt) cls = 'bg-purple-100 border-2 border-purple-400 text-purple-900'
              return (
                <button key={j} onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: opt }))}
                  className={`p-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {checked && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 mt-2">
          <div className="font-bold text-sm mb-1">📖 Explanation:</div>
          <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
      {!checked && slide.hint && <p className="text-xs font-semibold text-lime-600 mt-3 text-center">💡 {slide.hint}</p>}
    </div>
  )
}

function MatchPairsSlide({ slide, checked, setChecked, onWrong }) {
  const pairs = slide.pairs || []
  useEffect(() => { validatePairs(pairs, slide.instruction) }, [])

  const [selectedLeft,  setSelectedLeft]  = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matchedLeft,   setMatchedLeft]   = useState([])  // indices
  const [wrong,         setWrong]         = useState([])

  const shuffledRight = useRef(
    shuffle(pairs.map((p, i) => ({ meaning: p.meaning, originalIndex: i })))
  ).current

  const allDone = matchedLeft.length === pairs.length
  useEffect(() => { if (allDone && !checked) setChecked(true) }, [allDone])

  function handleLeft(i)  {
    if (checked || matchedLeft.includes(i)) return
    setSelectedLeft(i === selectedLeft ? null : i)
    if (selectedRight !== null) tryMatch(i, selectedRight)
  }
  function handleRight(i) {
    if (checked || matchedLeft.includes(shuffledRight[i].originalIndex)) return
    setSelectedRight(i === selectedRight ? null : i)
    if (selectedLeft !== null) tryMatch(selectedLeft, i)
  }
  function tryMatch(li, ri) {
    if (shuffledRight[ri].originalIndex === li) {
      setMatchedLeft(m => [...m, li])
    } else {
      setWrong([li, ri])
      onWrong?.()
      setTimeout(() => setWrong([]), 700)
    }
    setSelectedLeft(null); setSelectedRight(null)
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-teal-100 text-teal-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">🔗 Match the Pairs</div>
      <p className="font-display text-lg text-green-800 mb-1">{slide.instruction}</p>
      <p className="text-xs text-green-500 font-semibold mb-4">Tap a word on the left, then tap its match on the right</p>
      <div className="flex gap-3 flex-1">
        <div className="flex-1 space-y-2">
          {pairs.map((p, i) => {
            const isDone = matchedLeft.includes(i)
            const isSel  = selectedLeft === i
            const isWrong = wrong[0] === i
            return (
              <button key={i} onClick={() => handleLeft(i)} disabled={isDone}
                className={`w-full p-3 rounded-2xl font-bold text-sm text-left transition-all border-2 ${
                  isDone   ? 'bg-lime-100 border-lime-400 text-green-800 opacity-70' :
                  isWrong  ? 'bg-red-100 border-red-400' :
                  isSel    ? 'bg-teal-200 border-teal-500 text-teal-900 scale-[0.97]' :
                             'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'}`}>
                {isDone && '✅ '}{p.word}
              </button>
            )
          })}
        </div>
        <div className="flex-1 space-y-2">
          {shuffledRight.map((item, i) => {
            const isDone = matchedLeft.includes(item.originalIndex)
            const isSel  = selectedRight === i
            const isWrong = wrong[1] === i
            return (
              <button key={i} onClick={() => handleRight(i)} disabled={isDone}
                className={`w-full p-3 rounded-2xl font-semibold text-xs text-left transition-all border-2 ${
                  isDone   ? 'bg-lime-100 border-lime-400 text-green-800 opacity-70' :
                  isWrong  ? 'bg-red-100 border-red-400' :
                  isSel    ? 'bg-teal-200 border-teal-500 text-teal-900 scale-[0.97]' :
                             'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'}`}>
                {isDone && '✅ '}{item.meaning}
              </button>
            )
          })}
        </div>
      </div>
      {allDone && (
        <div className="mt-3 bg-lime-50 border-2 border-lime-400 rounded-2xl p-3">
          <div className="font-bold text-sm mb-1">🎉 All matched!</div>
          <p className="text-xs font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
      {!allDone && (
        <div className="mt-3 text-xs text-gray-400 font-semibold text-center">
          {matchedLeft.length} / {pairs.length} matched
        </div>
      )}
    </div>
  )
}

function ReorderSentenceSlide({ slide, checked, answer, setAnswer }) {
  const isOrdering = !!slide.isOrdering
  const words = slide.words || []
  const [placed,    setPlaced]    = useState([])
  const [remaining, setRemaining] = useState(() => words.map((w, i) => ({ w, id: i })))

  const sep = isOrdering ? '|' : ' '

  function place(item) {
    if (checked) return
    const np = [...placed, item]
    setPlaced(np)
    setRemaining(r => r.filter(x => x.id !== item.id))
    setAnswer(np.map(x => x.w).join(sep))
  }
  function unplace(item) {
    if (checked) return
    const np = placed.filter(x => x.id !== item.id)
    setPlaced(np)
    setRemaining(r => [...r, item].sort((a, b) => a.id - b.id))
    setAnswer(np.map(x => x.w).join(sep))
  }
  function reset() {
    setPlaced([]); setRemaining(words.map((w, i) => ({ w, id: i }))); setAnswer('')
  }

  const isCorrect = checked && answer.trim() === (slide.correct || '').trim()

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-indigo-100 text-indigo-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">
        🔀 {isOrdering ? 'Put in Order' : 'Build the Sentence'}
      </div>
      <p className="font-display text-lg text-green-900 mb-4">{slide.instruction}</p>
      <div className={`min-h-[70px] border-2 border-dashed rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-start transition-all ${
        placed.length > 0 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'
      }`}>
        {placed.length === 0
          ? <p className="text-gray-400 text-sm font-semibold m-auto">Tap words below to build your answer</p>
          : placed.map(item => (
            <button key={item.id} onClick={() => unplace(item)}
              className="bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm hover:bg-indigo-600 active:scale-95 transition-all">
              {item.w} ✕
            </button>
          ))
        }
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {remaining.map(item => (
          <button key={item.id} onClick={() => place(item)}
            className="bg-white border-2 border-indigo-300 text-indigo-800 font-bold px-3 py-1.5 rounded-xl text-sm hover:bg-indigo-50 active:scale-95 transition-all">
            {item.w}
          </button>
        ))}
      </div>
      {!checked && placed.length > 0 && (
        <button onClick={reset} className="text-xs font-bold text-gray-400 hover:text-gray-600 mb-2">↺ Reset</button>
      )}
      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : '📖 Correct answer:'}</div>
          {!isCorrect && (
            <p className="font-bold text-green-800 text-sm mb-2">
              {isOrdering ? slide.correct.replace(/\|/g, ' → ') : slide.correct}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function TFNGSlide({ slide, checked, selected, setSelected }) {
  const { label, color } = levelLabel(slide.band)
  const isCorrect = checked && selected === slide.answer
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      {slide.passage && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-3 max-h-36 overflow-y-auto">
          <div className="text-xs font-bold text-blue-500 mb-1">📖 Passage</div>
          <p className="text-xs text-blue-900 font-semibold leading-relaxed">{slide.passage}</p>
        </div>
      )}
      <div className="card bg-lime-50 border-2 border-lime-200 mb-4">
        <div className="text-xs font-bold text-lime-600 mb-1">Statement</div>
        <p className="font-bold text-green-900">{slide.statement}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['True', 'False', 'Not Given'].map(opt => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-lime-300'
          if (checked) {
            if (opt === slide.answer)    cls = 'bg-lime-400 border-2 border-lime-600 text-green-900 font-bold'
            else if (opt === selected)   cls = 'bg-red-200 border-2 border-red-400'
            else                         cls = 'bg-gray-100 opacity-50 border-2 border-gray-200'
          } else if (opt === selected)   cls = 'bg-lime-200 border-2 border-lime-400'
          return (
            <button key={opt} onClick={() => !checked && setSelected(opt)}
              className={`py-4 rounded-2xl font-bold text-sm transition-all ${cls}`}>
              {opt === 'Not Given' ? 'N·G' : opt}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : `📖 Correct: ${slide.answer}`}</div>
          <p className="text-sm font-semibold text-gray-700">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function ErrorCorrectionSlide({ slide, checked, selected, setSelected }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-red-100 text-red-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">✏️ Error Correction</div>
      <h3 className="font-display text-xl text-green-900 mb-1">{slide.title}</h3>
      <p className="text-sm text-green-500 font-semibold mb-4">{slide.instruction}</p>
      <div className="space-y-3 flex-1">
        {(slide.sentences || []).map((s, i) => {
          let cls = 'bg-white border-2 border-gray-200 hover:border-red-200'
          if (checked) {
            if (!s.correct) cls = 'bg-red-50 border-2 border-red-400'
            else            cls = 'bg-gray-50 border-2 border-gray-200 opacity-50'
          } else if (selected === i) cls = 'bg-red-100 border-2 border-red-400'
          return (
            <div key={i}>
              <button onClick={() => !checked && setSelected(i)}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                <span className="opacity-40 mr-2">{i + 1}.</span>{s.text}
                {checked && !s.correct && <span className="ml-2 text-red-600 font-bold">← ERROR</span>}
              </button>
              {checked && !s.correct && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mt-1">
                  <p className="text-xs font-bold text-blue-600 mb-0.5">📖 Why it's wrong + how to fix it:</p>
                  <p className="text-sm text-blue-900 font-semibold whitespace-pre-line">{s.explanation || s.expl}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN LESSON PAGE
// ─────────────────────────────────────────────────────────────
export default function Lesson() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()
  const { completeLesson } = useProgress()

  const [started,       setStarted]       = useState(false)
  const [slideIdx,      setSlideIdx]      = useState(0)
  const [selected,      setSelected]      = useState(null)
  const [fillAnswers,   setFillAnswers]   = useState({})
  const [reorderAns,    setReorderAns]    = useState('')
  const [checked,       setChecked]       = useState(false)
  const [finished,      setFinished]      = useState(false)
  const [matchChecked,  setMatchChecked]  = useState(false)
  const [matchHadWrong, setMatchHadWrong] = useState(false)
  // Unified answer log: { correct: bool, slide }
  const [answers, setAnswers] = useState([])

  const correct     = answers.filter(a => a.correct).length
  const total       = answers.length
  const wrongSlides = answers.filter(a => !a.correct).map(a => a.slide)

  const found = findLesson(lessonId)
  if (!found) return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50 p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-display text-xl text-green-700 mb-4">Lesson not found</p>
        <button onClick={() => navigate('/learn')} className="btn-primary">← Back to Learn</button>
      </div>
    </div>
  )

  const { lesson }  = found
  const allSlides   = buildAllSlides(lesson)
  const slide       = allSlides[slideIdx]
  const progress    = started ? (slideIdx / Math.max(allSlides.length - 1, 1)) * 100 : 0

  const QUESTION_KINDS = ['mcq', 'tfng_single', 'error_correction', 'fill_blank', 'reorder_sentence']
  const isQuestion  = QUESTION_KINDS.includes(slide?.kind)
  const isMatch     = slide?.kind === 'match_pairs'
  const isAutoNext  = ['explainer', 'mini_explainer', 'flashcard', 'passage', 'intro',
                       'visual', 'formula_card', 'tap_reveal', 'worked_example', 'common_mistake'].includes(slide?.kind)

  function handleCheck() {
    let isOk = false
    if (slide.kind === 'mcq')              isOk = selected === slide.correct
    if (slide.kind === 'tfng_single')      isOk = selected === slide.answer
    if (slide.kind === 'error_correction') isOk = (slide.sentences || [])[selected]?.correct === false
    if (slide.kind === 'fill_blank')       isOk = (slide.blanks || []).every((b, i) => fillAnswers[i] === b.correct)
    if (slide.kind === 'reorder_sentence') isOk = reorderAns.trim() === (slide.correct || '').trim()
    setChecked(true)
    setAnswers(prev => [...prev, { correct: isOk, slide }])
  }

  async function advance() {
    const next = slideIdx + 1
    if (next >= allSlides.length) {
      // Record match_pairs result if it was the last slide
      const finalAnswers = isMatch
        ? [...answers, { correct: !matchHadWrong, slide }]
        : [...answers]
      const c     = finalAnswers.filter(a => a.correct).length
      const t     = finalAnswers.length
      const score = t > 0 ? Math.round((c / t) * 100) : 80
      setAnswers(finalAnswers)
      // Only mark as complete (unlocks next lesson) if score >= 60%
      if (score >= 60) {
        await completeLesson(lessonId, score)
      }
      setFinished(true)
    } else {
      setSlideIdx(next)
      setSelected(null); setChecked(false)
      setFillAnswers({}); setReorderAns('')
      setMatchChecked(false); setMatchHadWrong(false)
    }
  }

  const canCheck = (() => {
    if (isMatch) return matchChecked
    if (!isQuestion) return false
    if (slide?.kind === 'mcq' || slide?.kind === 'tfng_single') return selected !== null
    if (slide?.kind === 'error_correction') return selected !== null
    if (slide?.kind === 'fill_blank') return (slide.blanks || []).every((_, i) => fillAnswers[i] !== undefined)
    if (slide?.kind === 'reorder_sentence') return reorderAns.length > 0
    return false
  })()

  // ── Finished screen ──
  const MIN_PASS = 60  // minimum score to mark lesson as complete

  if (finished) {
    const score  = total > 0 ? Math.round((correct / total) * 100) : 80
    const passed = score >= MIN_PASS
    const xp     = passed ? Math.round((score / 100) * (lesson.xp || 20)) + 10 : 0
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
        {passed && score >= 70 && <Confetti recycle={false} numberOfPieces={200} colors={['#bbff33','#84d600','#22c55e','#a3f007']} />}
        <div className="max-w-sm w-full text-center">
          <div className="text-7xl mb-4">{score === 100 ? '🌟' : score >= 70 ? '🎉' : passed ? '👍' : '💪'}</div>
          <h2 className="font-display text-3xl text-green-800 mb-1">
            {score === 100 ? 'Perfect!' : score >= 70 ? 'Well done!' : passed ? 'Lesson passed!' : 'Not quite!'}
          </h2>
          <p className={`font-semibold mb-5 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
            {passed
              ? score >= 70 ? 'Great progress toward JEE success!' : 'Passed! Keep practising to improve.'
              : `You need ${MIN_PASS}% to pass. You got ${score}%. Review the explanations and retry.`}
          </p>
          {!passed && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4 mb-4 text-left">
              <div className="font-bold text-orange-800 text-sm mb-1">📖 Why you need 60% to proceed:</div>
              <p className="text-xs text-orange-700 font-semibold">
                Passing each lesson ensures you understand the concept before building on it.
                Review the explanations below, then retry the lesson.
              </p>
            </div>
          )}
          <div className="card mb-4">
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div><div className="font-display text-3xl text-lime-600">{score}%</div><div className="text-xs font-bold text-gray-500">Score</div></div>
              <div><div className="font-display text-3xl text-green-600">+{xp}</div><div className="text-xs font-bold text-gray-500">XP</div></div>
              <div><div className="font-display text-3xl text-yellow-500">{correct}/{total}</div><div className="text-xs font-bold text-gray-500">Correct</div></div>
            </div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(s => (
                <span key={s} className={`text-3xl ${score >= s * 33 ? '' : 'grayscale opacity-30'}`}>⭐</span>
              ))}
            </div>
          </div>
          {wrongSlides.length > 0 && (
            <div className="card mb-4 text-left bg-blue-50 border-2 border-blue-200">
              <div className="font-bold text-blue-800 mb-2 text-sm">📖 Mistakes to review:</div>
              {wrongSlides.map((ws, i) => (
                <div key={i} className="mb-3 last:mb-0 p-3 bg-white rounded-xl">
                  <div className="text-xs font-bold text-gray-500 mb-1 truncate">
                    {ws.question || ws.statement || ws.sentence || ws.title}
                  </div>
                  <div className="text-xs text-green-700 font-semibold whitespace-pre-line line-clamp-3">
                    {ws.explanation || (ws.sentences?.find(s => !s.correct)?.explanation) || (ws.sentences?.find(s => !s.correct)?.expl) || ''}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => navigate('/learn')} className="btn-secondary flex-1">← Learn</button>
            {passed ? (
              <button onClick={() => navigate('/learn')} className="btn-primary flex-1">
                Continue →
              </button>
            ) : (
              <button onClick={() => {
                setSlideIdx(0); setStarted(false); setAnswers([])
                setFinished(false); setMatchChecked(false); setMatchHadWrong(false)
              }} className="btn-primary flex-1 bg-orange-400 hover:bg-orange-500">
                <RotateCcw className="w-4 h-4 inline mr-1" />Retry Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Intro screen ──
  if (!started) return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <span className="font-bold text-green-800 flex-1 truncate">{lesson.title}</span>
      </div>
      <IntroSlide slide={allSlides[0]} onStart={() => { setStarted(true); setSlideIdx(1) }} />
    </div>
  )

  // ── Active lesson ──
  return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-lime-600" />
          <span className="font-bold text-lime-700 text-sm">{slideIdx}/{allSlides.length - 1}</span>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {slide?.kind === 'explainer'        && <ExplainerSlide       slide={slide} onNext={advance} />}
        {slide?.kind === 'mini_explainer'   && <MiniExplainerSlide   slide={slide} onNext={advance} />}
        {slide?.kind === 'flashcard'        && <FlashcardSlide       slide={slide} onNext={advance} />}
        {slide?.kind === 'passage'          && <PassageSlide         slide={slide} onNext={advance} />}
        {slide?.kind === 'visual'           && <VisualSlide          slide={slide} onNext={advance} />}
        {slide?.kind === 'formula_card'     && <FormulaCardSlide     slide={slide} onNext={advance} />}
        {slide?.kind === 'tap_reveal'       && <TapRevealSlide       slide={slide} onNext={advance} />}
        {slide?.kind === 'worked_example'   && <WorkedExampleSlide   slide={slide} onNext={advance} />}
        {slide?.kind === 'common_mistake'   && <CommonMistakeSlide   slide={slide} onNext={advance} />}
        {slide?.kind === 'mcq'              && <MCQSlide             slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
        {slide?.kind === 'fill_blank'       && <FillBlankSlide       slide={slide} checked={checked} answers={fillAnswers} setAnswers={setFillAnswers} />}
        {slide?.kind === 'match_pairs'      && <MatchPairsSlide      slide={slide} checked={matchChecked} setChecked={setMatchChecked} onWrong={() => setMatchHadWrong(true)} />}
        {slide?.kind === 'reorder_sentence' && <ReorderSentenceSlide slide={slide} checked={checked} answer={reorderAns} setAnswer={setReorderAns} />}
        {slide?.kind === 'tfng_single'      && <TFNGSlide            slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
        {slide?.kind === 'error_correction' && <ErrorCorrectionSlide slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
      </div>

      {/* Bottom action bar */}
      {!isAutoNext && (
        <div className="sticky bottom-0 bg-white border-t-2 border-lime-200 p-4 max-w-lg mx-auto w-full">
          {isMatch ? (
            matchChecked ? (
              <button onClick={() => {
                setAnswers(prev => [...prev, { correct: !matchHadWrong, slide }])
                advance()
              }} className="btn-primary w-full flex items-center justify-center gap-2">
                {slideIdx + 1 >= allSlides.length ? '🎉 Finish!' : 'Continue'} <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="text-center text-sm font-semibold text-green-500">Match all pairs to continue</div>
            )
          ) : !checked ? (
            <button onClick={handleCheck} disabled={!canCheck}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
              Check Answer
            </button>
          ) : (
            <button onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
              {slideIdx + 1 >= allSlides.length ? '🎉 Finish Lesson!' : 'Continue'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
