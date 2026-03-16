import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useProgress } from '../contexts/ProgressContext'
import { Clock, ChevronRight, RotateCcw, Volume2, VolumeX, Play } from 'lucide-react'
import { LISTENING_SETS, READING_SETS, WRITING_SETS, SPEAKING_SETS } from '../data/mockTestData'
import Confetti from 'react-confetti'
import SpeakingEvaluator from '../components/SpeakingEvaluator'

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function toBand(pct) {
  if (pct >= 97) return 9.0; if (pct >= 93) return 8.5; if (pct >= 87) return 8.0
  if (pct >= 80) return 7.5; if (pct >= 72) return 7.0; if (pct >= 60) return 6.5
  if (pct >= 50) return 6.0; if (pct >= 40) return 5.5; return 5.0
}

function bandColor(b) {
  if (b >= 8) return 'text-lime-600'; if (b >= 7) return 'text-green-600'
  if (b >= 6.5) return 'text-yellow-600'; return 'text-orange-500'
}

// ──────────────────────────────────────────────────────────────
//  CHROME TTS AUDIO PLAYER
//  Plays the transcript aloud. User can answer questions while
//  it plays. Cannot be paused — tap Play again to replay.
// ──────────────────────────────────────────────────────────────
function AudioPlayer({ transcript, context, onPlayed }) {
  const [state, setState] = useState('idle') // idle | playing
  const utterRef = useRef(null)
  const waveBarsRef = useRef([...Array(8)].map(() => Math.round(8 + Math.random() * 14)))

  useEffect(() => {
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel() }
  }, [])

  function play() {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(transcript)
    utter.rate  = 0.88
    utter.pitch = 1.0

    // Prefer a natural English voice
    const voices = window.speechSynthesis.getVoices()
    const preferred =
      voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('en-GB')) ||
      voices.find(v => v.lang.startsWith('en-US')) ||
      voices.find(v => v.lang.startsWith('en')) || null
    if (preferred) utter.voice = preferred

    utter.onstart = () => setState('playing')
    utter.onend   = () => { setState('idle'); onPlayed?.() }
    utter.onerror = () => setState('idle')

    utterRef.current = utter
    window.speechSynthesis.speak(utter)
    setState('playing')
  }

  return (
    <div className={`rounded-2xl border-2 p-4 transition-all ${
      state === 'playing' ? 'bg-blue-50 border-blue-400' : 'bg-white border-blue-200'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          state === 'playing' ? 'bg-blue-500' : 'bg-blue-100'
        }`}>
          <Volume2 className={`w-5 h-5 ${state === 'playing' ? 'text-white' : 'text-blue-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-green-800 text-sm truncate">{context}</p>
          <p className="text-xs text-blue-600 font-semibold">
            {state === 'playing'
              ? '🔊 Playing — answer questions as you listen'
              : '▶ Press Play to hear the audio'}
          </p>
        </div>
        <button
          onClick={play}
          disabled={state === 'playing'}
          className={`shrink-0 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${
            state === 'playing'
              ? 'bg-blue-200 text-blue-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          }`}
        >
          <Play className="w-4 h-4" />
          {state === 'playing' ? 'Playing…' : 'Play'}
        </button>
      </div>

      {/* Waveform animation while playing */}
      {state === 'playing' && (
        <div className="flex items-end gap-1 mt-3 h-6">
          {waveBarsRef.current.map((h, i) => (
            <div key={i} className="flex-1 bg-blue-400 rounded-full animate-bounce"
              style={{ height: `${h}px`, animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }} />
          ))}
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-gray-400 font-semibold mt-2">
        {state === 'playing'
          ? '💡 Select answers while listening. Submit when all answered.'
          : '💡 Read all questions first, then press Play.'}
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  SECTION INTRO
// ──────────────────────────────────────────────────────────────
function SectionIntro({ section, onStart, onSkip }) {
  const meta = {
    listening: { icon:'🎧', color:'from-blue-400 to-blue-600',   time:'~30 min', q:'10 questions',
      tip:'You will hear each recording ONCE only. Read the questions before pressing Play.' },
    reading:   { icon:'👁️', color:'from-purple-400 to-purple-600', time:'~20 min', q:'13 questions',
      tip:'Skim the passage in 60 seconds first — get the structure, then answer questions.' },
    writing:   { icon:'✍️', color:'from-yellow-400 to-orange-500', time:'~20 min', q:'2 tasks',
      tip:'Plan each task before writing. Task 1: 150+ words. Task 2: 250+ words.' },
    speaking:  { icon:'🗣️', color:'from-pink-400 to-rose-500',   time:'~15 min', q:'3 parts',
      tip:'Use the PREL formula: Point → Reason → Example → Link. Extend every answer.' },
  }
  const m = meta[section]
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center max-w-lg mx-auto w-full">
      <div className={`w-20 h-20 bg-gradient-to-br ${m.color} rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-lg`}>
        {m.icon}
      </div>
      <h2 className="font-display text-3xl text-green-800 capitalize mb-1">{section}</h2>
      <p className="text-green-500 font-semibold text-sm mb-5">IELTSdua Mock Test</p>
      <div className="card w-full mb-5 text-left space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-lime-600 shrink-0" />
          <span className="font-bold text-green-800 text-sm">Suggested time: {m.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lime-600 font-bold shrink-0">✓</span>
          <span className="font-bold text-green-800 text-sm">{m.q}</span>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3">
          <p className="text-xs font-bold text-yellow-700">💡 {m.tip}</p>
        </div>
      </div>
      <button onClick={onStart} className="btn-primary w-full mb-3">
        Start {section.charAt(0).toUpperCase() + section.slice(1)} →
      </button>
      <button onClick={onSkip} className="text-sm font-bold text-gray-400 hover:text-gray-600 py-2">
        Skip this section
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  LISTENING TEST  — live answering while audio plays
// ──────────────────────────────────────────────────────────────
function ListeningTest({ set, onComplete }) {
  // Show all questions for the CURRENT SECTION simultaneously
  // User answers as audio plays — just like the real IELTS test
  const [secIdx,   setSecIdx]   = useState(0)
  const [answers,  setAnswers]  = useState({})   // { qId: selectedOption }
  const [revealed, setRevealed] = useState({})   // { qId: true } after submit
  const [submitted, setSubmitted] = useState(false)

  const sec    = set.sections[secIdx]
  const isLast = secIdx === set.sections.length - 1
  const allQs  = set.sections.flatMap(s => s.questions)
  const total  = allQs.length
  const answered = sec.questions.filter(q => answers[q.id]).length

  function handleSelect(qId, opt) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: opt }))
  }

  function handleSubmitSection() {
    // Reveal all answers for this section
    const newRevealed = {}
    sec.questions.forEach(q => { newRevealed[q.id] = true })
    setRevealed(prev => ({ ...prev, ...newRevealed }))
    setSubmitted(true)
  }

  function handleNextSection() {
    if (isLast) {
      const correct = allQs.filter(q => answers[q.id] === q.correct).length
      onComplete(correct, total, answers)
    } else {
      setSecIdx(i => i + 1)
      setSubmitted(false)
    }
  }

  const doneCount = secIdx * (set.sections[0]?.questions?.length || 5)
  const progress  = (doneCount / total) * 100

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Progress */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2 shrink-0">
        <div className="flex justify-between text-xs font-bold text-green-600 mb-1">
          <span>🎧 {sec.label}</span>
          <span>Section {secIdx + 1} / {set.sections.length}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full progress-fill"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Scrollable — audio + all questions for this section */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Audio player — stays visible throughout the section */}
        <AudioPlayer
          key={secIdx}
          transcript={sec.transcript}
          context={sec.context}
          onPlayed={() => {}}
        />

        {/* Instructions */}
        {!submitted && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-3">
            <p className="text-xs font-bold text-blue-700">
              📋 Answer all {sec.questions.length} questions as you listen.
              Select an answer for each question, then tap <strong>Submit Section</strong> when done.
            </p>
          </div>
        )}

        {/* All questions for this section — shown simultaneously */}
        {sec.questions.map((q, qi) => {
          const sel  = answers[q.id]
          const done = !!revealed[q.id]
          return (
            <div key={q.id} className={`card border-2 transition-all ${
              done
                ? sel === q.correct ? 'border-lime-300 bg-lime-50' : 'border-red-200 bg-red-50'
                : sel ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 rounded-xl px-2.5 py-1 text-xs font-bold shrink-0">
                  Q{doneCount + qi + 1}
                </span>
                {done && (
                  <span className={`text-xs font-bold ${sel === q.correct ? 'text-lime-600' : 'text-red-500'}`}>
                    {sel === q.correct ? '✅ Correct' : `❌ Answer: ${q.correct}`}
                  </span>
                )}
              </div>
              <p className="font-semibold text-green-900 text-sm mb-3">{q.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, i) => {
                  let cls = 'border-2 border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  if (done) {
                    if (opt === q.correct)  cls = 'border-2 border-lime-500 bg-lime-100'
                    else if (opt === sel)   cls = 'border-2 border-red-400 bg-red-100'
                    else                    cls = 'border-2 border-gray-100 bg-gray-50 opacity-40'
                  } else if (opt === sel)   cls = 'border-2 border-blue-400 bg-blue-100 font-bold'
                  return (
                    <button key={i} onClick={() => handleSelect(q.id, opt)}
                      disabled={done || submitted}
                      className={`w-full p-3 rounded-xl text-left text-sm font-semibold transition-all ${cls}`}>
                      <span className="opacity-50 mr-2 text-xs font-bold">{['A','B','C','D'][i]}.</span>{opt}
                    </button>
                  )
                })}
              </div>
              {done && q.explanation && (
                <p className="text-xs text-gray-500 font-semibold mt-2 pt-2 border-t border-gray-200">
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}

        {/* Submit / Next button INSIDE scroll — always reachable */}
        <div className="bg-white border-2 border-blue-200 rounded-2xl px-4 py-4 sticky bottom-0 shadow-lg">
          {!submitted ? (
            <>
              <button
                onClick={handleSubmitSection}
                disabled={answered < sec.questions.length}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                style={{background: answered === sec.questions.length ? undefined : undefined}}>
                {answered < sec.questions.length
                  ? `Answer all questions (${answered}/${sec.questions.length} answered)`
                  : '✓ Submit Section Answers'}
              </button>
              {answered < sec.questions.length && (
                <p className="text-center text-xs text-blue-500 font-semibold mt-1">
                  {sec.questions.length - answered} question{sec.questions.length - answered !== 1 ? 's' : ''} remaining
                </p>
              )}
            </>
          ) : (
            <button onClick={handleNextSection}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {isLast ? '✅ Finish Listening' : `Next Section →`}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  READING TEST  — complete rewrite
// ──────────────────────────────────────────────────────────────
function ReadingTest({ set, onComplete }) {
  const allQs = set.passages.flatMap(p => p.questions.map(q => ({ ...q, _passage: p })))
  const total  = allQs.length

  const [qIdx,     setQIdx]     = useState(0)
  const [answers,  setAnswers]  = useState({})
  const [checked,  setChecked]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [showPass, setShowPass] = useState(true)

  const q       = allQs[qIdx]
  const passage = q?._passage
  const isFirst = qIdx === 0 || allQs[qIdx - 1]?._passage?.title !== passage?.title
  const isLast  = qIdx === total - 1
  const progress = (qIdx / total) * 100

  // Reset passage visibility when changing passages
  useEffect(() => { if (isFirst) setShowPass(true) }, [qIdx])

  function handleCheck() {
    if (!selected) return
    setChecked(true)
    setAnswers(prev => ({ ...prev, [q.id]: selected }))
  }

  function handleNext() {
    if (isLast) {
      const final = { ...answers, [q.id]: selected }
      const correct = allQs.filter(item => {
        const a = final[item.id]
        if (item.type === 'mcq' || item.type === 'heading') return a === item.correct
        if (item.type === 'tfng') return a === item.answer
        return false
      }).length
      onComplete(correct, total, final)
    } else {
      setQIdx(i => i + 1)
      setSelected(null)
      setChecked(false)
    }
  }

  const tfOpts = ['True', 'False', 'Not Given']

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2 shrink-0">
        <div className="flex justify-between text-xs font-bold text-green-600 mb-1">
          <span>👁️ {passage?.title}</span>
          <span>Q{qIdx + 1} / {total}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full progress-fill"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Passage — collapsible */}
        {passage && (
          <div className="card bg-purple-50 border-2 border-purple-200">
            <button onClick={() => setShowPass(t => !t)}
              className="w-full flex items-center justify-between text-sm font-bold text-purple-700">
              <span>📖 {passage.title}</span>
              <span className="text-xs bg-purple-100 px-2 py-0.5 rounded-full">
                {showPass ? '▲ Hide' : '▼ Show'} passage
              </span>
            </button>
            {showPass && (
              <div className="mt-3 text-xs text-purple-900 font-semibold leading-relaxed border-t border-purple-200 pt-3 space-y-2">
                {passage.text.split('\n\n').map((para, i) => (
                  <p key={i}>
                    <span className="font-bold text-purple-400 mr-1">({String.fromCharCode(65 + i)})</span>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question */}
        {q && (
          <div>
            <div className="bg-purple-100 text-purple-700 rounded-2xl px-3 py-1 text-xs font-bold inline-block mb-3">
              {q.type === 'tfng' ? 'True / False / Not Given'
                : q.type === 'heading' ? 'Matching Headings'
                : 'Multiple Choice'}
            </div>

            {q.type === 'tfng' && (
              <>
                <p className="font-bold text-green-900 mb-4 leading-snug">{q.statement}</p>
                <div className="grid grid-cols-3 gap-2">
                  {tfOpts.map(opt => {
                    let cls = 'bg-white border-2 border-gray-200 hover:border-purple-300'
                    if (checked) {
                      if (opt === q.answer)    cls = 'bg-lime-100 border-2 border-lime-500 text-green-900 font-bold'
                      else if (opt === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-800'
                      else                       cls = 'bg-gray-50 border-2 border-gray-200 opacity-40'
                    } else if (opt === selected) cls = 'bg-purple-100 border-2 border-purple-400 text-purple-900'
                    return (
                      <button key={opt} onClick={() => !checked && setSelected(opt)}
                        className={`py-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
                        {opt === 'Not Given' ? 'N/G' : opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {(q.type === 'mcq' || q.type === 'heading') && (
              <>
                <h3 className="font-display text-lg text-green-900 mb-4 leading-snug">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    let cls = 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    if (checked) {
                      if (opt === q.correct)    cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
                      else if (opt === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-800'
                      else                       cls = 'bg-gray-50 border-2 border-gray-200 opacity-40'
                    } else if (opt === selected) cls = 'bg-purple-100 border-2 border-purple-400'
                    return (
                      <button key={i} onClick={() => !checked && setSelected(opt)}
                        className={`w-full p-3 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                        <span className="opacity-40 mr-2">{['A','B','C','D'][i]}.</span>{opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {checked && (
              <div className={`mt-3 p-4 rounded-2xl border-2 ${
                selected === (q.correct ?? q.answer) ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'
              }`}>
                <p className="font-bold text-sm">
                  {selected === (q.correct ?? q.answer) ? '✅ Correct!' : `❌ Answer: ${q.correct ?? q.answer}`}
                </p>
                {q.explanation && <p className="text-xs text-gray-600 font-semibold mt-1">{q.explanation}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reading action bar — sticky inside scroll so always reachable */}
        <div className="bg-white border-2 border-purple-200 rounded-2xl px-4 py-4 sticky bottom-0 shadow-lg">
          {!checked
            ? <button onClick={handleCheck} disabled={!selected}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
                Check Answer
              </button>
            : <button onClick={handleNext}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {isLast ? '✅ Finish Reading' : 'Next Question'} <ChevronRight className="w-5 h-5" />
              </button>
          }
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  WRITING TEST
// ──────────────────────────────────────────────────────────────
function WritingTest({ set, onComplete }) {
  const [taskIdx, setTaskIdx] = useState(0)
  const [texts,   setTexts]   = useState({ 0: '', 1: '' })
  const task      = set.tasks[taskIdx]
  const wordCount = (texts[taskIdx] || '').trim().split(/\s+/).filter(Boolean).length
  const isEnough  = wordCount >= task.minWords
  const isLast    = taskIdx === set.tasks.length - 1

  function handleNext() {
    if (!isLast) { setTaskIdx(1) } else { onComplete(texts) }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2 shrink-0">
        <div className="flex justify-between text-xs font-bold text-green-600">
          <span>✍️ {task.type}</span>
          <span>Task {taskIdx + 1} / {set.tasks.length}</span>
        </div>
        <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full progress-fill"
            style={{ width: `${(taskIdx / set.tasks.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
          <div className="text-xs font-bold text-green-600 mb-1">📖 Band 8+ Model Paragraph</div>
          <p className="text-xs text-green-800 font-semibold italic leading-relaxed">{task.modelParagraph}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800 text-sm">Your Response</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${
              isEnough ? 'bg-lime-100 border-lime-400 text-lime-700' : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}>
              {wordCount} / {task.minWords}+ words
            </span>
          </div>
          <textarea
            id={`writing-task-${taskIdx}`}
            name={`writing-task-${taskIdx}`}
            value={texts[taskIdx]}
            onChange={e => setTexts(prev => ({ ...prev, [taskIdx]: e.target.value }))}
            className="w-full h-52 input-field resize-none text-sm leading-relaxed"
            placeholder={`Write your ${task.type} response here…\n\nMinimum ${task.minWords} words required.`}
          />
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full progress-fill ${isEnough ? 'bg-lime-400' : 'bg-orange-400'}`}
              style={{ width: `${Math.min(100, (wordCount / task.minWords) * 100)}%` }} />
          </div>
        </div>

        {/* Submit button INSIDE scroll area — always reachable by scrolling down */}
        <div className="bg-white border-2 border-lime-200 rounded-2xl px-4 py-4 sticky bottom-0 shadow-lg">
          <button onClick={handleNext} disabled={!isEnough}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
            {isLast ? '✅ Finish Writing' : 'Next Task →'}
          </button>
          {!isEnough && (
            <p className="text-center text-xs text-orange-500 font-semibold mt-2">
              ✏️ {task.minWords - wordCount} more words needed to continue
            </p>
          )}
        </div>

        {/* Spacer so sticky button doesn't overlap last content */}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  SPEAKING TEST
// ──────────────────────────────────────────────────────────────
function SpeakingTest({ set, onComplete }) {
  const [part, setPart]           = useState(1)
  const [prepTime, setPrepTime]   = useState(null)
  const [speakTime, setSpeakTime] = useState(null)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  function startPrep() {
    clearInterval(timerRef.current)
    setPrepTime(60)
    setTimerActive(true)
    timerRef.current = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setSpeakTime(120)
          startSpeakTimer()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function startSpeakTimer() {
    timerRef.current = setInterval(() => {
      setSpeakTime(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimerActive(false); return 0 }
        return t - 1
      })
    }, 1000)
  }

  function resetTimer() {
    clearInterval(timerRef.current)
    setPrepTime(null); setSpeakTime(null); setTimerActive(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-2 shrink-0 flex items-center justify-between">
        <span className="text-xs font-bold text-green-600">🗣️ Speaking — Part {part}</span>
        <div className="flex gap-1">
          {[1,2,3].map(p => (
            <div key={p} className={`h-2 rounded-full transition-all ${part >= p ? 'bg-pink-400 w-6' : 'bg-gray-200 w-4'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-6">
        {part === 1 && (
          <>
            <div className="text-center">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-display text-2xl text-green-800">Part 1 — Interview</h3>
              <p className="text-sm text-green-500 font-semibold">Topic: {set.part1.topic}</p>
            </div>
            <div className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-3 text-xs font-bold text-lime-700">
              💡 Practise answering these out loud. Give 2–4 sentence answers using P-R-E-L.
            </div>
            {set.part1.questions.map((item, i) => (
              <div key={i} className="card bg-pink-50 border-2 border-pink-200">
                <p className="font-bold text-green-900 mb-2 text-sm">Q{i+1}: {item.q}</p>
                <div className="bg-white rounded-xl p-3 border border-pink-200">
                  <p className="text-xs font-bold text-pink-600 mb-1">🎯 Band 9 tip</p>
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
            <div className="text-center">
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

            <div className="grid grid-cols-2 gap-3">
              <div className={`card text-center ${prepTime !== null && prepTime > 0 ? 'border-yellow-400 bg-yellow-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">PREP TIME</div>
                <div className={`font-display text-4xl ${prepTime !== null && prepTime > 0 ? 'text-yellow-600' : 'text-green-700'}`}>
                  {prepTime !== null ? `${prepTime}s` : '60s'}
                </div>
                {prepTime === 0 && <div className="text-xs text-lime-600 font-bold mt-1">Now speak!</div>}
              </div>
              <div className={`card text-center ${speakTime !== null && speakTime > 0 ? 'border-lime-400 bg-lime-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">SPEAK TIME</div>
                <div className={`font-display text-4xl ${speakTime !== null && speakTime > 0 ? 'text-lime-600' : 'text-green-700'}`}>
                  {speakTime !== null ? `${Math.floor(speakTime/60)}:${String(speakTime%60).padStart(2,'0')}` : '2:00'}
                </div>
              </div>
            </div>

            {!timerActive && prepTime === null && (
              <button onClick={startPrep} className="btn-primary w-full">▶ Start Timer (1 min prep)</button>
            )}
            {(timerActive || prepTime !== null) && (
              <button onClick={resetTimer} className="btn-secondary w-full">↺ Reset Timer</button>
            )}

            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
              <p className="text-xs font-bold text-green-600 mb-1">📖 Model opening</p>
              <p className="text-xs text-green-800 font-semibold italic">{set.part2.modelOpening}</p>
            </div>
            <button onClick={() => { setPart(3); resetTimer() }} className="btn-primary w-full">
              Move to Part 3 →
            </button>
          </>
        )}

        {part === 3 && (
          <>
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-display text-2xl text-green-800">Part 3 — Discussion</h3>
              <p className="text-sm text-green-500 font-semibold">Theme: {set.part3.theme}</p>
            </div>
            <div className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-3 text-xs font-bold text-lime-700">
              💡 Part 3 requires analytical, abstract discussion. Aim for 4–6 sentence answers.
            </div>
            {set.part3.questions.map((item, i) => (
              <div key={i} className="card bg-rose-50 border-2 border-rose-200">
                <p className="font-bold text-green-900 mb-2 text-sm">Q{i+1}: {item.q}</p>
                <div className="bg-white rounded-xl p-3 border border-rose-200">
                  <p className="text-xs font-bold text-rose-600 mb-1">🎯 Band 9 tip</p>
                  <p className="text-xs text-green-700 font-semibold">{item.bandTip}</p>
                </div>
              </div>
            ))}
            {/* AI Speaking Evaluator for Part 3 */}
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4">
              <h3 className="font-bold text-pink-800 mb-2 text-sm">🤖 Optional: AI Feedback</h3>
              <p className="text-xs text-pink-700 font-semibold mb-3">
                Record your answer to a Part 3 question for AI examiner feedback before finishing.
              </p>
              <SpeakingEvaluator
                question={set.part3.questions[0]?.q || 'Discuss the topic from your cue card in more depth.'}
                part={3}
              />
            </div>

            <button onClick={() => onComplete()} className="btn-primary w-full mt-2">
              ✅ Finish Speaking
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  RESULTS SCREEN
// ──────────────────────────────────────────────────────────────
function ResultsScreen({ results, onRetake, onHome }) {
  const SECTIONS = ['listening','reading','writing','speaking']
  const scored = SECTIONS.filter(s => results[s] !== null && results[s]?.band)
  const avg    = scored.length > 0 ? scored.reduce((sum, s) => sum + results[s].band, 0) / scored.length : 0
  const overall = Math.round(avg * 2) / 2

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full">
      {overall >= 7 && <Confetti recycle={false} numberOfPieces={180} colors={['#bbff33','#84d600','#22c55e']} />}

      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{overall >= 8 ? '🏆' : overall >= 7 ? '🎉' : overall >= 6 ? '👍' : '💪'}</div>
        <h2 className="font-display text-3xl text-green-800">Test Complete!</h2>
        <p className="text-green-500 font-semibold text-sm mt-1">Here's your performance breakdown</p>
      </div>

      <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-center text-white mb-5 shadow-lg">
        <div className="text-xs font-bold text-lime-200 mb-1 uppercase tracking-wide">Overall Estimated Band</div>
        <div className="font-display text-8xl mb-1">{overall || '—'}</div>
        <div className="text-lime-100 font-semibold text-sm">
          {overall >= 8.5 ? 'Expert — Outstanding! 🌟' : overall >= 7.5 ? 'Very Good — Keep it up! 🌿'
            : overall >= 6.5 ? 'Competent — Solid foundation 👍' : 'Keep practising! 💪'}
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-bold text-green-800 mb-4">Section Breakdown</h3>
        <div className="space-y-4">
          {SECTIONS.map(sec => {
            const r = results[sec]
            const icons = { listening:'🎧', reading:'👁️', writing:'✍️', speaking:'🗣️' }
            return (
              <div key={sec} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{icons[sec]}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-green-800 text-sm capitalize">{sec}</span>
                    {r === null
                      ? <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Skipped</span>
                      : r.band
                        ? <span className={`font-display text-xl font-bold ${bandColor(r.band)}`}>Band {r.band}</span>
                        : <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Submitted ✓</span>
                    }
                  </div>
                  {r?.correct !== undefined && r?.total > 0 && (
                    <>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
                          style={{ width: `${(r.correct / r.total) * 100}%` }} />
                      </div>
                      <p className="text-xs font-semibold text-gray-400 mt-0.5">
                        {r.correct}/{r.total} correct ({Math.round((r.correct/r.total)*100)}%)
                      </p>
                    </>
                  )}
                  {r !== null && r?.correct === undefined && (
                    <p className="text-xs text-gray-400 font-semibold">Self-assessed — review your response</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card bg-gradient-to-br from-lime-50 to-green-50 mb-5">
        <h3 className="font-bold text-green-800 mb-3">📈 Focus Areas</h3>
        {SECTIONS.filter(s => results[s] !== null).map(sec => {
          const tips = {
            listening: 'Listen for specific details: numbers, names, dates. Predict answer types from questions.',
            reading:   'For T/F/NG: "Not Given" means absent from text — not the same as False.',
            writing:   'Always answer ALL parts of the question. Missing a sub-question drops Task Achievement.',
            speaking:  'Extend answers using P-R-E-L. Part 3 needs analytical, abstract discussion.',
          }
          return (
            <div key={sec} className="flex gap-3 mb-2 last:mb-0">
              <div className="w-5 h-5 bg-lime-400 rounded-full flex items-center justify-center text-xs font-bold text-green-900 shrink-0 mt-0.5">→</div>
              <div>
                <span className="font-bold text-green-800 text-sm capitalize">{sec}: </span>
                <span className="text-xs text-green-600 font-semibold">{tips[sec]}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 pb-4">
        <button onClick={onHome}   className="btn-secondary flex-1">← Home</button>
        <button onClick={onRetake} className="btn-primary flex-1">
          <RotateCcw className="w-4 h-4 inline mr-1" />Retake
        </button>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  MAIN PAGE
// ──────────────────────────────────────────────────────────────
const SECTIONS = ['listening','reading','writing','speaking']

export default function MockTest() {
  const navigate    = useNavigate()
  const { awardXP } = useProgress()

  const [phase,   setPhase]   = useState('home')
  const [secIdx,  setSecIdx]  = useState(0)
  const [results, setResults] = useState({ listening:null, reading:null, writing:null, speaking:null })

  const [sets] = useState({
    listening: pickRandom(LISTENING_SETS),
    reading:   pickRandom(READING_SETS),
    writing:   pickRandom(WRITING_SETS),
    speaking:  pickRandom(SPEAKING_SETS),
  })

  const currentSec = SECTIONS[secIdx]

  function advanceSection() {
    const next = secIdx + 1
    if (next < SECTIONS.length) { setSecIdx(next); setPhase('intro') }
    else { setPhase('results') }
  }

  function handleSkip()  { setResults(prev => ({ ...prev, [currentSec]: null })); advanceSection() }
  function handleStart() { setPhase('test') }

  async function handleListeningDone(correct, total, answers) {
    const band = toBand((correct/total)*100)
    setResults(prev => ({ ...prev, listening: { correct, total, band, answers } }))
    await awardXP(Math.round((correct/total)*80), 'Listening test')
    advanceSection()
  }

  async function handleReadingDone(correct, total, answers) {
    const band = toBand((correct/total)*100)
    setResults(prev => ({ ...prev, reading: { correct, total, band, answers } }))
    await awardXP(Math.round((correct/total)*80), 'Reading test')
    advanceSection()
  }

  async function handleWritingDone(texts) {
    setResults(prev => ({ ...prev, writing: { texts } }))
    await awardXP(60, 'Writing test')
    advanceSection()
  }

  async function handleSpeakingDone() {
    setResults(prev => ({ ...prev, speaking: {} }))
    await awardXP(60, 'Speaking test')
    setPhase('results')
  }

  function retake() {
    setResults({ listening:null, reading:null, writing:null, speaking:null })
    setSecIdx(0); setPhase('home')
    // Force new random sets by reloading
    window.location.reload()
  }

  // ── HOME ──
  if (phase === 'home') {
    const cards = [
      { key:'listening', icon:'🎧', label:'Listening', color:'bg-blue-50 border-blue-200',   time:'~30 min', qs:'10 questions' },
      { key:'reading',   icon:'👁️', label:'Reading',   color:'bg-purple-50 border-purple-200', time:'~20 min', qs:'13 questions' },
      { key:'writing',   icon:'✍️', label:'Writing',   color:'bg-yellow-50 border-yellow-200', time:'~20 min', qs:'2 tasks' },
      { key:'speaking',  icon:'🗣️', label:'Speaking',  color:'bg-pink-50 border-pink-200',   time:'~15 min', qs:'3 parts' },
    ]
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Mock Tests 🏅</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">
            Full IELTS practice — 2 question sets per section, randomly picked each time
          </p>

          <button onClick={() => { setSecIdx(0); setPhase('intro') }}
            className="w-full bg-gradient-to-r from-lime-400 to-green-600 text-white font-display text-xl py-5 rounded-3xl shadow-lg mb-5 hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98]">
            🚀 Start Full Mock Test
            <div className="text-sm font-body font-semibold text-lime-100 mt-1">All 4 sections · ~85 minutes</div>
          </button>

          <h3 className="font-display text-xl text-green-800 mb-3">Practise one section</h3>
          <div className="space-y-3">
            {cards.map((c, i) => (
              <button key={c.key} onClick={() => { setSecIdx(i); setPhase('intro') }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${c.color} hover:shadow-md transition-all hover:-translate-y-0.5 text-left`}>
                <div className="text-4xl">{c.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-green-800">{c.label}</div>
                  <div className="text-xs text-green-500 font-semibold">{c.qs} · {c.time}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-green-400" />
              </button>
            ))}
          </div>

          <div className="card mt-5 bg-gradient-to-br from-green-50 to-lime-50">
            <h3 className="font-bold text-green-800 mb-2">ℹ️ About These Tests</h3>
            <div className="space-y-1.5 text-xs font-semibold text-green-700">
              <p>• 🎧 Listening: audio via Chrome TTS — plays once, cannot be paused (exam conditions)</p>
              <p>• 👁️ Reading: full passages with T/F/NG, MCQ, and heading-match</p>
              <p>• ✍️ Writing: Task 1 + Task 2 with band criteria and model paragraphs</p>
              <p>• 🗣️ Speaking: cue cards, Part 2 timer, Band 9 strategy tips</p>
              <p>• Questions are randomly picked from 2 different sets each time</p>
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
        <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setPhase('home')} className="p-2 rounded-xl hover:bg-lime-100 font-bold text-gray-500">✕</button>
          <div className="flex gap-1 flex-1 justify-center">
            {SECTIONS.map((s, i) => (
              <div key={s} className={`h-2 rounded-full transition-all ${
                i === secIdx ? 'w-8 bg-lime-500' : i < secIdx ? 'w-5 bg-lime-300' : 'w-4 bg-gray-200'
              }`} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 capitalize">{currentSec}</span>
        </div>
        <SectionIntro section={currentSec} onStart={handleStart} onSkip={handleSkip} />
      </div>
    )
  }

  // ── ACTIVE TEST ──
  if (phase === 'test') {
    // Use fixed positioning for each test so they aren't affected by the Navbar layout
    // Each test component handles its own scroll + sticky action bar
    return (
      <div className="fixed inset-0 bg-lime-50 flex flex-col" style={{top:'64px', bottom:'64px'}}>
        <Navbar />
        {currentSec === 'listening' && <ListeningTest set={sets.listening} onComplete={handleListeningDone} />}
        {currentSec === 'reading'   && <ReadingTest   set={sets.reading}   onComplete={handleReadingDone}   />}
        {currentSec === 'writing'   && <WritingTest   set={sets.writing}   onComplete={handleWritingDone}   />}
        {currentSec === 'speaking'  && <SpeakingTest  set={sets.speaking}  onComplete={handleSpeakingDone}  />}
      </div>
    )
  }

  // ── RESULTS ──
  if (phase === 'results') {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pt-16">
        <Navbar />
        <ResultsScreen results={results} onRetake={retake} onHome={() => navigate('/')} />
      </div>
    )
  }
}
