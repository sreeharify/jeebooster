import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useProgress } from '../contexts/ProgressContext'
import { Clock, ChevronRight, RotateCcw, CheckCircle, XCircle, BookOpen, Mic, PenTool, Headphones } from 'lucide-react'
import { LISTENING_SETS, READING_SETS, WRITING_SETS, SPEAKING_SETS } from '../data/mockTestData'
import Confetti from 'react-confetti'

// ── Randomly pick one set from an array ──
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── Convert raw score to IELTS band ──
function toBand(pct) {
  if (pct >= 97) return 9.0
  if (pct >= 93) return 8.5
  if (pct >= 87) return 8.0
  if (pct >= 80) return 7.5
  if (pct >= 72) return 7.0
  if (pct >= 60) return 6.5
  if (pct >= 50) return 6.0
  if (pct >= 40) return 5.5
  return 5.0
}

function bandColor(b) {
  if (b >= 8)   return 'text-lime-600'
  if (b >= 7)   return 'text-green-600'
  if (b >= 6.5) return 'text-yellow-600'
  return 'text-orange-500'
}

// ────────────────────────────────────────────────────────────
//  SECTION INTRO CARD
// ────────────────────────────────────────────────────────────
function SectionIntro({ section, onStart, onSkip }) {
  const meta = {
    listening: { icon: '🎧', color: 'from-blue-400 to-blue-600',   time: '30 min', q: '10 questions', tip: 'Read the questions BEFORE reading the transcript. Focus on numbers, names, and specific details.' },
    reading:   { icon: '👁️', color: 'from-purple-400 to-purple-600', time: '20 min', q: '13 questions', tip: 'Skim the passage first (60 sec), then read questions, then scan for answers.' },
    writing:   { icon: '✍️', color: 'from-yellow-400 to-orange-500', time: '20 min', q: '2 tasks',     tip: 'Task 1: overview first, then details. Task 2: plan your paragraphs before writing.' },
    speaking:  { icon: '🗣️', color: 'from-pink-400 to-rose-500',    time: '15 min', q: '3 parts',     tip: 'Extend every answer. Never give one-word replies. Use the cue card preparation time wisely.' },
  }
  const m = meta[section]
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className={`w-24 h-24 bg-gradient-to-br ${m.color} rounded-3xl flex items-center justify-center text-5xl mb-5 shadow-lg animate-pop`}>
        {m.icon}
      </div>
      <h2 className="font-display text-3xl text-green-800 capitalize mb-1">{section}</h2>
      <p className="text-green-500 font-semibold text-sm mb-6">IELTS Academic — Mock Section</p>

      <div className="card w-full mb-5 text-left space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-lime-600" />
          <span className="font-bold text-green-800 text-sm">Suggested time: {m.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-lime-600" />
          <span className="font-bold text-green-800 text-sm">{m.q}</span>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3">
          <p className="text-xs font-bold text-yellow-700">💡 Tip: {m.tip}</p>
        </div>
      </div>

      <button onClick={onStart} className="btn-primary w-full mb-3">
        Start {section.charAt(0).toUpperCase() + section.slice(1)} →
      </button>
      <button onClick={onSkip} className="btn-secondary w-full text-sm">
        Skip this section
      </button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  LISTENING TEST
// ────────────────────────────────────────────────────────────
function ListeningTest({ set, onComplete }) {
  const allQs = set.sections.flatMap(s => s.questions)
  const [secIdx, setSecIdx]   = useState(0)
  const [qIdx,   setQIdx]     = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showTranscript, setShowTranscript] = useState(true)

  const sec = set.sections[secIdx]
  const q   = sec?.questions[qIdx]

  function handleCheck() {
    if (!selected) return
    setChecked(true)
    setAnswers(prev => ({ ...prev, [q.id]: selected }))
  }

  function handleNext() {
    const nextQ = qIdx + 1
    if (nextQ < sec.questions.length) {
      setQIdx(nextQ); setSelected(null); setChecked(false)
    } else {
      const nextSec = secIdx + 1
      if (nextSec < set.sections.length) {
        setSecIdx(nextSec); setQIdx(0); setSelected(null); setChecked(false); setShowTranscript(true)
      } else {
        // Done
        const correct = allQs.filter(q => answers[q.id] === q.correct || (q.id === allQs[allQs.length-1].id && selected === q.correct)).length
        const finalAnswers = { ...answers, [q.id]: selected }
        const finalCorrect = allQs.filter(q => finalAnswers[q.id] === q.correct).length
        onComplete(finalCorrect, allQs.length, finalAnswers)
      }
    }
  }

  const isLast = secIdx === set.sections.length - 1 && qIdx === sec.questions.length - 1
  const progress = ((secIdx * 5 + qIdx) / allQs.length) * 100

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2">
        <div className="flex justify-between text-xs font-bold text-green-600 mb-1">
          <span>🎧 {sec.label}</span>
          <span>Q{secIdx * 5 + qIdx + 1}/{allQs.length}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Transcript toggle */}
        <div className="card bg-blue-50 border-2 border-blue-200">
          <button onClick={() => setShowTranscript(t => !t)}
            className="w-full flex items-center justify-between text-sm font-bold text-blue-700">
            <span>📄 {sec.context}</span>
            <span className="text-xs">{showTranscript ? '▲ Hide' : '▼ Show'} transcript</span>
          </button>
          {showTranscript && (
            <div className="mt-3 text-xs text-blue-900 font-semibold leading-relaxed whitespace-pre-line border-t border-blue-200 pt-3">
              {sec.transcript}
            </div>
          )}
        </div>

        {/* Question */}
        {q && (
          <div>
            <div className="bg-blue-100 text-blue-700 rounded-2xl px-3 py-1 text-xs font-bold self-start inline-block mb-3">
              Question {secIdx * 5 + qIdx + 1}
            </div>
            <h3 className="font-display text-xl text-green-900 mb-4">{q.question}</h3>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                if (checked) {
                  if (opt === q.correct)   cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
                  else if (opt === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-900'
                  else cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-50'
                } else if (opt === selected) cls = 'bg-blue-100 border-2 border-blue-400 text-blue-900'
                return (
                  <button key={i} onClick={() => !checked && setSelected(opt)}
                    className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                    <span className="opacity-50 mr-2">{['A','B','C','D'][i]}.</span>{opt}
                  </button>
                )
              })}
            </div>
            {checked && (
              <div className={`mt-3 p-4 rounded-2xl border-2 ${selected === q.correct ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
                <p className="font-bold text-sm">{selected === q.correct ? '✅ Correct!' : `❌ Correct: ${q.correct}`}</p>
                <p className="text-xs text-gray-600 font-semibold mt-1">{q.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        {!checked
          ? <button onClick={handleCheck} disabled={!selected} className="btn-primary w-full disabled:opacity-40">Check Answer</button>
          : <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLast ? '✅ Finish Listening' : 'Next'} <ChevronRight className="w-5 h-5" />
            </button>
        }
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  READING TEST
// ────────────────────────────────────────────────────────────
function ReadingTest({ set, onComplete }) {
  const allQs = set.passages.flatMap(p => p.questions)
  const [pIdx,    setPIdx]    = useState(0)
  const [qIdx,    setQIdx]    = useState(0)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showPassage, setShowPassage] = useState(true)

  const passage = set.passages[pIdx]
  const q       = passage?.questions[qIdx]
  const progress = ((pIdx * passage?.questions.length + qIdx) / allQs.length) * 100

  function handleCheck() {
    if (!selected) return
    setChecked(true)
    setAnswers(prev => ({ ...prev, [q.id]: selected }))
  }

  function handleNext() {
    const nextQ = qIdx + 1
    if (nextQ < passage.questions.length) {
      setQIdx(nextQ); setSelected(null); setChecked(false)
    } else {
      const nextP = pIdx + 1
      if (nextP < set.passages.length) {
        setPIdx(nextP); setQIdx(0); setSelected(null); setChecked(false); setShowPassage(true)
      } else {
        const finalAnswers = { ...answers, [q.id]: selected }
        const finalCorrect = allQs.filter(q => {
          const a = finalAnswers[q.id]
          if (q.type === 'mcq' || q.type === 'heading') return a === q.correct
          if (q.type === 'tfng') return a === q.answer
          return false
        }).length
        onComplete(finalCorrect, allQs.length, finalAnswers)
      }
    }
  }

  const isLast = pIdx === set.passages.length - 1 && qIdx === passage.questions.length - 1
  const tfngOpts = ['True', 'False', 'Not Given']

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2">
        <div className="flex justify-between text-xs font-bold text-green-600 mb-1">
          <span>👁️ Passage {pIdx + 1}: {passage.title}</span>
          <span>Q{allQs.indexOf(q) + 1}/{allQs.length}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Passage */}
        <div className="card bg-purple-50 border-2 border-purple-200">
          <button onClick={() => setShowPassage(t => !t)}
            className="w-full flex items-center justify-between text-sm font-bold text-purple-700">
            <span>📖 {passage.title}</span>
            <span className="text-xs">{showPassage ? '▲ Hide' : '▼ Show'} passage</span>
          </button>
          {showPassage && (
            <div className="mt-3 text-xs text-purple-900 font-semibold leading-relaxed border-t border-purple-200 pt-3 space-y-2">
              {passage.text.split('\n\n').map((para, i) => (
                <p key={i}><span className="font-bold text-purple-500">({String.fromCharCode(65+i)})</span> {para}</p>
              ))}
            </div>
          )}
        </div>

        {/* Question */}
        {q && (
          <div>
            <div className="bg-purple-100 text-purple-700 rounded-2xl px-3 py-1 text-xs font-bold inline-block mb-3">
              {q.type === 'tfng' ? 'True / False / Not Given' : q.type === 'heading' ? 'Matching Headings' : 'Multiple Choice'}
            </div>

            {q.type === 'tfng' && (
              <>
                <p className="font-bold text-green-900 mb-3">{q.statement}</p>
                <div className="grid grid-cols-3 gap-2">
                  {tfngOpts.map(opt => {
                    let cls = 'bg-white border-2 border-gray-200 hover:border-purple-300'
                    if (checked) {
                      if (opt === q.answer) cls = 'bg-lime-100 border-2 border-lime-500 text-green-900 font-bold'
                      else if (opt === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-900'
                      else cls = 'bg-gray-50 border-2 border-gray-200 opacity-50'
                    } else if (opt === selected) cls = 'bg-purple-100 border-2 border-purple-400 text-purple-900'
                    return (
                      <button key={opt} onClick={() => !checked && setSelected(opt)}
                        className={`py-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
                        {opt === 'Not Given' ? 'N / G' : opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {(q.type === 'mcq' || q.type === 'heading') && (
              <>
                <h3 className="font-display text-lg text-green-900 mb-4">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    let cls = 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    if (checked) {
                      if (opt === q.correct) cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
                      else if (opt === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-900'
                      else cls = 'bg-gray-50 border-2 border-gray-200 opacity-50'
                    } else if (opt === selected) cls = 'bg-purple-100 border-2 border-purple-400'
                    return (
                      <button key={i} onClick={() => !checked && setSelected(opt)}
                        className={`w-full p-3 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                        <span className="opacity-50 mr-2">{['A','B','C','D'][i]}.</span>{opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {checked && (
              <div className={`mt-3 p-4 rounded-2xl border-2 ${selected === (q.correct || q.answer) ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
                <p className="font-bold text-sm">{selected === (q.correct || q.answer) ? '✅ Correct!' : `❌ Answer: ${q.correct || q.answer}`}</p>
                <p className="text-xs text-gray-600 font-semibold mt-1">{q.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        {!checked
          ? <button onClick={handleCheck} disabled={!selected} className="btn-primary w-full disabled:opacity-40">Check Answer</button>
          : <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              {isLast ? '✅ Finish Reading' : 'Next'} <ChevronRight className="w-5 h-5" />
            </button>
        }
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  WRITING TEST
// ────────────────────────────────────────────────────────────
function WritingTest({ set, onComplete }) {
  const [taskIdx, setTaskIdx] = useState(0)
  const [texts,   setTexts]   = useState({ 0: '', 1: '' })
  const task = set.tasks[taskIdx]
  const wordCount = (texts[taskIdx] || '').trim().split(/\s+/).filter(Boolean).length
  const isEnough  = wordCount >= task.minWords

  function handleNext() {
    if (taskIdx + 1 < set.tasks.length) { setTaskIdx(1) }
    else { onComplete(texts) }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2">
        <div className="flex justify-between text-xs font-bold text-green-600">
          <span>✍️ {task.type}</span>
          <span>Task {taskIdx + 1}/{set.tasks.length}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full progress-fill"
            style={{ width: `${((taskIdx) / set.tasks.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Prompt */}
        <div className="card bg-yellow-50 border-2 border-yellow-200">
          <div className="text-xs font-bold text-yellow-600 mb-2">📋 Task Prompt</div>
          <p className="text-sm font-semibold text-yellow-900 leading-relaxed">{task.prompt}</p>
          {task.data && (
            <div className="mt-3 bg-white rounded-xl p-3 border border-yellow-200">
              <div className="text-xs font-bold text-gray-500 mb-1">{task.data.description}</div>
              {task.data.points.map((pt, i) => (
                <div key={i} className="text-xs font-semibold text-gray-700 flex items-start gap-2 mb-1">
                  <span className="text-yellow-500 shrink-0">•</span>{pt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Band Guide */}
        <div className="card">
          <div className="text-xs font-bold text-green-700 mb-2">🎯 Band Criteria</div>
          <div className="space-y-1.5">
            {task.bandGuide.map(bg => (
              <div key={bg.band} className="flex gap-2 text-xs">
                <span className={`font-bold shrink-0 w-12 ${bg.band >= 8 ? 'text-lime-600' : bg.band >= 7 ? 'text-green-600' : 'text-orange-500'}`}>
                  Band {bg.band}
                </span>
                <span className="text-gray-600 font-semibold">{bg.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model para */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-green-600 mb-2">📖 Band 8+ Model Paragraph</div>
          <p className="text-xs text-green-800 font-semibold italic leading-relaxed">{task.modelParagraph}</p>
        </div>

        {/* Text area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800 text-sm">Your Response</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${isEnough ? 'bg-lime-100 border-lime-400 text-lime-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
              {wordCount} / {task.minWords}+ words
            </span>
          </div>
          <textarea
            value={texts[taskIdx]}
            onChange={e => setTexts(prev => ({ ...prev, [taskIdx]: e.target.value }))}
            className="w-full h-56 input-field resize-none leading-relaxed text-sm"
            placeholder={`Write your ${task.type} response here...\n\nMinimum ${task.minWords} words required.`}
          />
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full progress-fill ${isEnough ? 'bg-lime-400' : 'bg-orange-400'}`}
              style={{ width: `${Math.min(100, (wordCount / task.minWords) * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button onClick={handleNext} disabled={!isEnough}
          className="btn-primary w-full disabled:opacity-40">
          {taskIdx + 1 < set.tasks.length ? 'Next Task →' : '✅ Finish Writing'}
        </button>
        {!isEnough && <p className="text-center text-xs text-orange-500 font-semibold mt-2">{task.minWords - wordCount} more words needed</p>}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  SPEAKING TEST
// ────────────────────────────────────────────────────────────
function SpeakingTest({ set, onComplete }) {
  const [part,      setPart]      = useState(1)
  const [qIdx,      setQIdx]      = useState(0)
  const [prepTime,  setPrepTime]  = useState(null)
  const [speakTime, setSpeakTime] = useState(null)
  const [timerRun,  setTimerRun]  = useState(false)
  const timerRef = useRef(null)

  function startPrep() {
    setPrepTime(60); setTimerRun(true)
    timerRef.current = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerRun(false); setSpeakTime(120); startSpeak(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function startSpeak() {
    setTimerRun(true)
    timerRef.current = setInterval(() => {
      setSpeakTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerRun(false); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function resetTimer() {
    clearInterval(timerRef.current)
    setPrepTime(null); setSpeakTime(null); setTimerRun(false)
  }

  const p1Qs   = set.part1.questions
  const p3Qs   = set.part3.questions

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-bold text-green-600">🗣️ Speaking — Part {part}</span>
        <div className="flex gap-1">
          {[1,2,3].map(p => (
            <div key={p} className={`w-6 h-2.5 rounded-full ${part >= p ? 'bg-pink-400' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {part === 1 && (
          <>
            <div className="text-center mb-2">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-display text-2xl text-green-800">Part 1 — Interview</h3>
              <p className="text-sm text-green-500 font-semibold">Topic: {set.part1.topic}</p>
            </div>
            {p1Qs.map((item, i) => (
              <div key={i} className="card bg-pink-50 border-2 border-pink-200">
                <div className="font-bold text-green-900 mb-2">Q{i+1}: {item.q}</div>
                <div className="bg-white rounded-xl p-3 border border-pink-200">
                  <div className="text-xs font-bold text-pink-600 mb-1">🎯 Band 9 strategy</div>
                  <p className="text-xs text-green-700 font-semibold">{item.bandTip}</p>
                </div>
              </div>
            ))}
            <button onClick={() => { setPart(2); resetTimer() }} className="btn-primary w-full">
              Move to Part 2 →
            </button>
          </>
        )}

        {part === 2 && (
          <>
            <div className="text-center mb-2">
              <div className="text-3xl mb-2">🎤</div>
              <h3 className="font-display text-2xl text-green-800">Part 2 — Long Turn</h3>
            </div>

            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-5 text-white shadow-lg">
              <div className="text-xs font-bold text-lime-300 mb-2 uppercase tracking-widest">📋 Cue Card</div>
              <h3 className="font-display text-xl mb-4">{set.part2.topic}</h3>
              <p className="text-lime-200 text-xs font-bold mb-2">You should say:</p>
              {set.part2.cuePoints.map((cp, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-lime-400 shrink-0">•</span>
                  <span className="text-sm font-semibold text-white/90">{cp}</span>
                </div>
              ))}
            </div>

            {/* Timers */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`card text-center ${prepTime !== null && prepTime > 0 ? 'border-yellow-400 bg-yellow-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">PREP TIME</div>
                <div className={`font-display text-4xl ${prepTime !== null && prepTime > 0 ? 'text-yellow-600' : 'text-green-700'}`}>
                  {prepTime !== null ? `${prepTime}s` : '60s'}
                </div>
              </div>
              <div className={`card text-center ${speakTime !== null && speakTime > 0 ? 'border-lime-400 bg-lime-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">SPEAK TIME</div>
                <div className={`font-display text-4xl ${speakTime !== null && speakTime > 0 ? 'text-lime-600' : 'text-green-700'}`}>
                  {speakTime !== null ? `${Math.floor(speakTime/60)}:${String(speakTime%60).padStart(2,'0')}` : '2:00'}
                </div>
              </div>
            </div>

            {!timerRun && prepTime === null && (
              <button onClick={startPrep} className="btn-primary w-full">▶ Start (1 min prep)</button>
            )}
            {(timerRun || prepTime !== null) && (
              <button onClick={resetTimer} className="btn-secondary w-full">↺ Reset Timer</button>
            )}

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
              <div className="text-xs font-bold text-green-600 mb-1">📖 Model opening</div>
              <p className="text-xs text-green-800 font-semibold italic">{set.part2.modelOpening}</p>
            </div>

            <button onClick={() => { setPart(3); resetTimer() }} className="btn-primary w-full">
              Move to Part 3 →
            </button>
          </>
        )}

        {part === 3 && (
          <>
            <div className="text-center mb-2">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-display text-2xl text-green-800">Part 3 — Discussion</h3>
              <p className="text-sm text-green-500 font-semibold">Theme: {set.part3.theme}</p>
            </div>
            {p3Qs.map((item, i) => (
              <div key={i} className="card bg-rose-50 border-2 border-rose-200">
                <div className="font-bold text-green-900 mb-2">Q{i+1}: {item.q}</div>
                <div className="bg-white rounded-xl p-3 border border-rose-200">
                  <div className="text-xs font-bold text-rose-600 mb-1">🎯 Band 9 strategy</div>
                  <p className="text-xs text-green-700 font-semibold">{item.bandTip}</p>
                </div>
              </div>
            ))}
            <button onClick={() => onComplete()} className="btn-primary w-full">
              ✅ Finish Speaking
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  RESULTS SCREEN
// ────────────────────────────────────────────────────────────
function ResultsScreen({ results, onRetake, onHome }) {
  const sections = ['listening', 'reading', 'writing', 'speaking']
  const scored   = sections.filter(s => results[s] !== null)
  const avg      = scored.length > 0
    ? scored.reduce((sum, s) => sum + (results[s]?.band || 0), 0) / scored.length
    : 0
  const overall  = Math.round(avg * 2) / 2

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {overall >= 7 && <Confetti recycle={false} numberOfPieces={180} colors={['#bbff33','#84d600','#22c55e']} />}

      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{overall >= 8 ? '🏆' : overall >= 7 ? '🎉' : overall >= 6 ? '👍' : '💪'}</div>
        <h2 className="font-display text-3xl text-green-800">Mock Test Complete!</h2>
        <p className="text-green-500 font-semibold text-sm mt-1">Here's how you did</p>
      </div>

      {/* Overall band */}
      <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-center text-white mb-5 shadow-lg">
        <div className="text-sm font-bold text-lime-200 mb-1 uppercase tracking-wide">Overall Estimated Band</div>
        <div className={`font-display text-8xl mb-1`}>{overall || '—'}</div>
        <div className="text-lime-100 font-semibold">
          {overall >= 8.5 ? 'Expert — Outstanding! 🌟' : overall >= 7.5 ? 'Very Good — Keep it up! 🌿' : overall >= 6.5 ? 'Competent — Solid foundation 👍' : 'Keep practising — you\'re improving! 💪'}
        </div>
      </div>

      {/* Per-section breakdown */}
      <div className="card mb-4">
        <h3 className="font-bold text-green-800 mb-4">Section Breakdown</h3>
        <div className="space-y-3">
          {sections.map(sec => {
            const r = results[sec]
            const icons = { listening: '🎧', reading: '👁️', writing: '✍️', speaking: '🗣️' }
            return (
              <div key={sec} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{icons[sec]}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-green-800 text-sm capitalize">{sec}</span>
                    {r === null
                      ? <span className="text-xs font-bold text-gray-400">Skipped</span>
                      : r.band
                        ? <span className={`font-display text-xl font-bold ${bandColor(r.band)}`}>Band {r.band}</span>
                        : <span className="text-xs font-bold text-green-500">Submitted ✓</span>
                    }
                  </div>
                  {r !== null && r.correct !== undefined && (
                    <>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
                          style={{ width: `${(r.correct / r.total) * 100}%` }} />
                      </div>
                      <div className="text-xs font-semibold text-gray-400 mt-0.5">{r.correct}/{r.total} correct ({Math.round((r.correct/r.total)*100)}%)</div>
                    </>
                  )}
                  {r !== null && r.correct === undefined && (
                    <div className="text-xs text-gray-400 font-semibold">Self-assessed task</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips based on weakest section */}
      <div className="card bg-gradient-to-br from-lime-50 to-green-50 mb-5">
        <h3 className="font-bold text-green-800 mb-3">📈 Your Focus Areas</h3>
        {sections
          .filter(s => results[s] !== null && results[s]?.band)
          .sort((a, b) => (results[a]?.band || 9) - (results[b]?.band || 9))
          .slice(0, 2)
          .map(sec => (
            <div key={sec} className="flex gap-3 mb-3 last:mb-0">
              <div className="w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center text-xs font-bold text-green-900 shrink-0">!</div>
              <div>
                <div className="font-bold text-green-800 text-sm capitalize">{sec}</div>
                <div className="text-xs text-green-600 font-semibold">
                  {sec === 'listening' && 'Practise reading the transcript and predicting answers before each section.'}
                  {sec === 'reading'   && 'Work on True/False/Not Given — the most commonly lost marks in Reading.'}
                  {sec === 'writing'   && 'Focus on Task Achievement: always answer ALL parts of the question.'}
                  {sec === 'speaking'  && 'Extend your answers in Part 1 using: point → reason → example.'}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="flex gap-3">
        <button onClick={onHome} className="btn-secondary flex-1">← Home</button>
        <button onClick={onRetake} className="btn-primary flex-1">Retake Test</button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  MAIN MOCK TEST PAGE
// ────────────────────────────────────────────────────────────
const SECTIONS = ['listening', 'reading', 'writing', 'speaking']

export default function MockTest() {
  const navigate = useNavigate()
  const { awardXP } = useProgress()

  const [phase,   setPhase]   = useState('home')   // home | intro | test | results
  const [secIdx,  setSecIdx]  = useState(0)
  const [results, setResults] = useState({ listening: null, reading: null, writing: null, speaking: null })

  // Pick random sets once
  const [sets] = useState({
    listening: pickRandom(LISTENING_SETS),
    reading:   pickRandom(READING_SETS),
    writing:   pickRandom(WRITING_SETS),
    speaking:  pickRandom(SPEAKING_SETS),
  })

  const currentSec = SECTIONS[secIdx]

  function startTest()  { setPhase('intro') }
  function goToSec(i)   { setSecIdx(i); setPhase('intro') }

  function handleSectionStart() { setPhase('test') }

  function handleSectionSkip() {
    setResults(prev => ({ ...prev, [currentSec]: null }))
    advanceSection()
  }

  function advanceSection() {
    const next = secIdx + 1
    if (next < SECTIONS.length) { setSecIdx(next); setPhase('intro') }
    else { setPhase('results') }
  }

  async function handleListeningComplete(correct, total, answers) {
    const pct = (correct / total) * 100
    const band = toBand(pct)
    setResults(prev => ({ ...prev, listening: { correct, total, band, answers } }))
    await awardXP(Math.round(pct * 0.8), 'Listening mock test')
    advanceSection()
  }

  async function handleReadingComplete(correct, total, answers) {
    const pct = (correct / total) * 100
    const band = toBand(pct)
    setResults(prev => ({ ...prev, reading: { correct, total, band, answers } }))
    await awardXP(Math.round(pct * 0.8), 'Reading mock test')
    advanceSection()
  }

  async function handleWritingComplete(texts) {
    setResults(prev => ({ ...prev, writing: { texts, band: null } }))
    await awardXP(60, 'Writing mock test')
    advanceSection()
  }

  async function handleSpeakingComplete() {
    setResults(prev => ({ ...prev, speaking: { band: null } }))
    await awardXP(60, 'Speaking mock test')
    setPhase('results')
  }

  function retakeTest() {
    setResults({ listening: null, reading: null, writing: null, speaking: null })
    setSecIdx(0); setPhase('home')
  }

  // ── HOME ──
  if (phase === 'home') {
    const sectionMeta = [
      { key: 'listening', icon: '🎧', label: 'Listening', color: 'bg-blue-100 border-blue-300',   time: '30 min', qs: '10' },
      { key: 'reading',   icon: '👁️', label: 'Reading',   color: 'bg-purple-100 border-purple-300', time: '20 min', qs: '13' },
      { key: 'writing',   icon: '✍️', label: 'Writing',   color: 'bg-yellow-100 border-yellow-300', time: '20 min', qs: '2 tasks' },
      { key: 'speaking',  icon: '🗣️', label: 'Speaking',  color: 'bg-pink-100 border-pink-300',   time: '15 min', qs: '3 parts' },
    ]
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Mock Tests 🏅</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">
            Full IELTS practice — questions randomly selected from 2 sets per section.
          </p>

          {/* Full test button */}
          <button onClick={startTest}
            className="w-full bg-gradient-to-r from-lime-400 to-green-600 text-white font-display text-xl py-5 rounded-3xl shadow-lg mb-5 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            🚀 Start Full Mock Test
            <div className="text-sm font-body font-semibold text-lime-100 mt-1">All 4 sections · ~85 min</div>
          </button>

          {/* Individual sections */}
          <h3 className="font-display text-xl text-green-800 mb-3">Or practise one section</h3>
          <div className="space-y-3">
            {sectionMeta.map((s, i) => (
              <button key={s.key} onClick={() => { setSecIdx(i); setPhase('intro') }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${s.color} hover:shadow-md transition-all hover:-translate-y-0.5 text-left`}>
                <div className="text-4xl">{s.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-green-800">{s.label}</div>
                  <div className="text-xs text-green-500 font-semibold">{s.qs} questions · {s.time}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-green-500" />
              </button>
            ))}
          </div>

          <div className="card mt-5 bg-gradient-to-br from-green-50 to-lime-50">
            <h3 className="font-bold text-green-800 mb-3">ℹ️ About These Tests</h3>
            <div className="space-y-2 text-xs font-semibold text-green-700">
              <p>• Questions are randomly selected from 2 different sets each time</p>
              <p>• Listening & Reading are auto-scored with band estimates</p>
              <p>• Writing prompts include model paragraphs and band criteria</p>
              <p>• Speaking includes cue cards, timers, and Band 9 strategies</p>
              <p>• Estimated band scores follow official IELTS conversion tables</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pt-16">
        <Navbar />
        <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setPhase('home')} className="p-2 rounded-xl hover:bg-lime-100">
            <span className="text-gray-500 font-bold">✕</span>
          </button>
          <div className="flex gap-1 flex-1 justify-center">
            {SECTIONS.map((s, i) => (
              <div key={s} className={`h-2 rounded-full transition-all ${i === secIdx ? 'w-8 bg-lime-500' : i < secIdx ? 'w-4 bg-lime-300' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <SectionIntro section={currentSec} onStart={handleSectionStart} onSkip={handleSectionSkip} />
      </div>
    )
  }

  // ── ACTIVE TEST ──
  if (phase === 'test') {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pt-16">
        <Navbar />
        {currentSec === 'listening' && <ListeningTest set={sets.listening} onComplete={handleListeningComplete} />}
        {currentSec === 'reading'   && <ReadingTest   set={sets.reading}   onComplete={handleReadingComplete}   />}
        {currentSec === 'writing'   && <WritingTest   set={sets.writing}   onComplete={handleWritingComplete}   />}
        {currentSec === 'speaking'  && <SpeakingTest  set={sets.speaking}  onComplete={handleSpeakingComplete}  />}
      </div>
    )
  }

  // ── RESULTS ──
  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto w-full flex flex-col flex-1">
          <ResultsScreen results={results} onRetake={retakeTest} onHome={() => navigate('/')} />
        </div>
      </div>
    )
  }
}
