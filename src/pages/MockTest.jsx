import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { distributeXP } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { PHYSICS_SETS, CHEMISTRY_SETS, MATH_SETS } from '../data/mockTestData'
import { ChevronRight, RotateCcw, Clock, Target, AlertCircle } from 'lucide-react'
import Confetti from 'react-confetti'

function pickRandom(arr) { if(!arr || arr.length === 0) return null; return arr[Math.floor(Math.random() * arr.length)] }

export default function MockTest() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  
  const [phase, setPhase] = useState('home') // home | intro | test | results
  const [currentSubject, setCurrentSubject] = useState('physics')
  const [results, setResults] = useState({ physics: null, chemistry: null, mathematics: null })
  
  const [sets] = useState({
    physics: pickRandom(PHYSICS_SETS),
    chemistry: pickRandom(CHEMISTRY_SETS),
    mathematics: pickRandom(MATH_SETS),
  })

  // ── START TEST ──
  function handleStart(sub) {
    setCurrentSubject(sub)
    setPhase('test')
  }

  // ── FINISH SECTION ──
  function handleSectionDone(score, total, correct, wrong) {
    setResults(prev => ({ 
      ...prev, 
      [currentSubject]: { score, total, correct, wrong } 
    }))
    setPhase('results')
  }

  // ── HOME ──
  if (phase === 'home') {
    const subjects = [
      { id: 'physics', label: 'Physics', icon: '⚛️', color: 'bg-blue-50 border-blue-200 text-blue-600', sets: sets.physics },
      { id: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'bg-purple-50 border-purple-200 text-purple-600', sets: sets.chemistry },
      { id: 'mathematics', label: 'Mathematics', icon: '📐', color: 'bg-red-50 border-red-200 text-red-600', sets: sets.mathematics },
    ]

    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">JEE Mock Tests 🚀</h2>
          <p className="text-green-500 font-semibold text-sm mb-6">Master the JEE Main/Advanced format</p>

          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-white mb-6 shadow-lg">
            <h3 className="font-display text-xl mb-2">Practice Mode</h3>
            <p className="text-lime-100 text-sm font-semibold">
              Select a subject to take a timed mock test. Each correct answer gives +4 marks, while incorrect ones deduct 1 mark.
            </p>
          </div>

          <div className="space-y-4">
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => handleStart(s.id)}
                disabled={!s.sets}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 bg-white hover:shadow-md transition-all hover:-translate-y-1 text-left ${!s.sets ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="text-4xl">{s.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-green-800 text-lg">{s.label}</div>
                  <div className="text-xs text-green-500 font-bold uppercase tracking-wide">
                    {s.sets ? `${s.sets.questions.length} Questions` : 'Coming Soon'}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-green-300" />
              </button>
            ))}
          </div>

          <div className="mt-8 p-5 bg-white rounded-2xl border-2 border-lime-100 italic text-sm text-green-700">
            "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will." — Vince Lombardi
          </div>
        </div>
      </div>
    )
  }

  // ── TEST ──
  if (phase === 'test') {
    const set = sets[currentSubject]
    return <TestRunner set={set} subject={currentSubject} onComplete={handleSectionDone} onQuit={() => setPhase('home')} />
  }

  // ── RESULTS ──
  if (phase === 'results') {
    const res = results[currentSubject]
    const totalPossible = res.total * 4
    const percentage = Math.max(0, (res.score / totalPossible) * 100)
    
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        {percentage >= 70 && <Confetti recycle={false} numberOfPieces={200} />}
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">🏅</div>
            <h2 className="font-display text-3xl text-green-800">Section Results</h2>
            <p className="text-green-500 font-bold uppercase tracking-widest text-xs mt-1">{currentSubject}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-center text-white mb-6 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">🚀</div>
             <div className="relative z-10">
                <div className="text-xs font-bold text-lime-300 mb-1 uppercase">Your Score</div>
                <div className="font-display text-7xl mb-1">{res.score}<span className="text-2xl text-lime-400">/{totalPossible}</span></div>
                <div className="h-2 w-32 bg-white/20 rounded-full mx-auto overflow-hidden mt-3">
                    <div className="h-full bg-lime-400" style={{ width: `${percentage}%` }} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card text-center py-4">
              <div className="text-2xl mb-1">✅</div>
              <div className="font-bold text-green-800">{res.correct} Correct</div>
              <div className="text-xs text-green-400 font-bold">+{res.correct * 4} Marks</div>
            </div>
            <div className="card text-center py-4">
              <div className="text-2xl mb-1">❌</div>
              <div className="font-bold text-red-600">{res.wrong} Wrong</div>
              <div className="text-xs text-red-400 font-bold">-{res.wrong} Marks</div>
            </div>
          </div>

          <button onClick={() => setPhase('home')} className="btn-primary w-full py-4 text-lg">
            Back to Mock Tests
          </button>
        </div>
      </div>
    )
  }
}

function TestRunner({ set, subject, onComplete, onQuit }) {
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(set.questions.length * 90) // 90sec per question average
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  function handleSubmit() {
    let score = 0
    let correct = 0
    let wrong = 0
    set.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        score += 4
        correct++
      } else if (answers[q.id]) {
        score -= 1
        wrong++
      }
    })
    onComplete(score, set.questions.length, correct, wrong)
  }

  const q = set.questions[qIdx]
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
       <div className="bg-green-800 text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg">JeeBooster Mock Test</span>
            <span className="hidden sm:inline text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">{subject}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold ${timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-lime-400'}`}>
            <Clock className="w-4 h-4" />
            {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <button onClick={onQuit} className="text-sm font-bold text-white/60 hover:text-white">Quit</button>
       </div>

       <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-lg mx-auto">
             <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Question {qIdx + 1} of {set.questions.length}</span>
                <div className="flex gap-1">
                   {set.questions.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === qIdx ? 'bg-green-600 scale-125' : answers[_.id] ? 'bg-green-200' : 'bg-gray-200'}`} />
                   ))}
                </div>
             </div>

             <div className="mb-8">
                <h3 className="text-xl font-bold text-green-900 leading-relaxed">{q.question}</h3>
             </div>

             <div className="space-y-3">
                {q.options.map(opt => (
                   <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-semibold transition-all flex items-center justify-between ${
                      answers[q.id] === opt ? 'border-green-500 bg-green-50 text-green-900' : 'border-gray-100 hover:border-green-200'
                    }`}
                   >
                     <span>{opt}</span>
                     {answers[q.id] === opt && <Target className="w-5 h-5 text-green-600" />}
                   </button>
                ))}
             </div>
          </div>
       </div>

       <div className="bg-gray-50 p-4 border-t-2 border-gray-100">
          <div className="max-w-lg mx-auto flex gap-3">
             <button
              onClick={() => setQIdx(i => Math.max(0, i-1))}
              disabled={qIdx === 0}
              className="px-6 py-3 border-2 border-gray-200 text-gray-400 font-bold rounded-2xl disabled:opacity-30"
             >
                Back
             </button>
             {qIdx + 1 < set.questions.length ? (
               <button
                onClick={() => setQIdx(i => i+1)}
                className="flex-1 btn-primary py-3"
               >
                  Next Question
               </button>
             ) : (
               <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white font-display text-lg rounded-2xl py-3 hover:bg-green-700 shadow-lg"
               >
                  Submit Test
               </button>
             )}
          </div>
       </div>
    </div>
  )
}
