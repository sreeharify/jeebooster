import { useState } from 'react'
import Navbar from '../components/Navbar'
import { VOCAB_BANK } from '../data/courseData'
import { useProgress } from '../contexts/ProgressContext'
import { RotateCcw, Volume2, CheckCircle, XCircle } from 'lucide-react'

const MODES = ['Flashcards', 'Quiz', 'Match']

export default function Vocabulary() {
  const [mode, setMode] = useState('Flashcards')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [quizSelected, setQuizSelected] = useState(null)
  const [quizChecked, setQuizChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [matchPairs, setMatchPairs] = useState(null)
  const [matchSelected, setMatchSelected] = useState([])
  const [matchDone, setMatchDone] = useState([])
  const { awardXP } = useProgress()

  const word = VOCAB_BANK[cardIdx]

  function nextCard() {
    setFlipped(false)
    setTimeout(() => setCardIdx(i => (i + 1) % VOCAB_BANK.length), 150)
  }
  function prevCard() {
    setFlipped(false)
    setTimeout(() => setCardIdx(i => (i - 1 + VOCAB_BANK.length) % VOCAB_BANK.length), 150)
  }

  // Quiz mode
  const quizWord = VOCAB_BANK[cardIdx]
  const quizOptions = [quizWord.meaning, ...VOCAB_BANK.filter(w => w.word !== quizWord.word).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.meaning)].sort(() => Math.random() - 0.5)

  function handleQuizSelect(opt) {
    if (quizChecked) return
    setQuizSelected(opt)
    setQuizChecked(true)
    if (opt === quizWord.meaning) {
      setScore(s => s + 1)
      awardXP(5, 'Vocab correct')
    }
    setTimeout(() => {
      setQuizSelected(null)
      setQuizChecked(false)
      setCardIdx(i => (i + 1) % VOCAB_BANK.length)
    }, 1500)
  }

  // Match mode
  function initMatch() {
    const words = VOCAB_BANK.slice(0, 5)
    const pairs = [
      ...words.map((w, i) => ({ id: `w${i}`, text: w.word, pairId: i, type: 'word' })),
      ...words.map((w, i) => ({ id: `m${i}`, text: w.meaning, pairId: i, type: 'meaning' })),
    ].sort(() => Math.random() - 0.5)
    setMatchPairs(pairs)
    setMatchSelected([])
    setMatchDone([])
  }

  function handleMatchSelect(item) {
    if (matchDone.includes(item.pairId)) return
    if (matchSelected.find(s => s.id === item.id)) {
      setMatchSelected(prev => prev.filter(s => s.id !== item.id))
      return
    }
    const newSelected = [...matchSelected, item]
    if (newSelected.length === 2) {
      if (newSelected[0].pairId === newSelected[1].pairId && newSelected[0].type !== newSelected[1].type) {
        setMatchDone(prev => [...prev, newSelected[0].pairId])
        awardXP(10, 'Match found')
        setMatchSelected([])
      } else {
        setTimeout(() => setMatchSelected([]), 800)
      }
    } else {
      setMatchSelected(newSelected)
    }
  }

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-3xl text-green-800">Vocabulary 📖</h2>
          <div className="bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full text-sm">
            {VOCAB_BANK.length} words
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border-2 border-lime-200">
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); if (m === 'Match') initMatch() }}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${mode === m ? 'bg-lime-400 text-green-900 shadow' : 'text-green-600 hover:bg-lime-50'}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Flashcards */}
        {mode === 'Flashcards' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-green-500">{cardIdx + 1} / {VOCAB_BANK.length}</span>
              <span className="text-xs bg-green-100 text-green-600 font-bold px-3 py-1 rounded-full">{word.category}</span>
            </div>

            {/* Card */}
            <div
              onClick={() => setFlipped(!flipped)}
              className={`relative w-full cursor-pointer transition-all duration-500`}
              style={{ perspective: '1000px', height: '260px' }}
            >
              <div className={`relative w-full h-full transition-transform duration-500`}
                style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-500 rounded-3xl flex flex-col items-center justify-center p-6 shadow-lg"
                  style={{ backfaceVisibility: 'hidden' }}>
                  <div className="text-white/70 text-xs font-bold mb-3 uppercase tracking-widest">WORD</div>
                  <div className="font-display text-5xl text-white mb-4">{word.word}</div>
                  <div className="text-white/80 text-sm font-semibold">Tap to reveal meaning</div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl flex flex-col items-center justify-center p-6 shadow-lg"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className="text-white/70 text-xs font-bold mb-3 uppercase tracking-widest">MEANING</div>
                  <div className="font-display text-2xl text-white text-center mb-3">{word.meaning}</div>
                  <div className="text-white/80 text-xs font-semibold text-center italic">"{word.example}"</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={prevCard} className="btn-secondary flex-1">← Previous</button>
              <button onClick={() => { awardXP(2, 'Vocab reviewed'); nextCard() }} className="btn-primary flex-1">Next →</button>
            </div>

            <div className="text-center mt-3 text-xs font-semibold text-green-400">Tap card to flip • +2 XP per card</div>
          </div>
        )}

        {/* Quiz mode */}
        {mode === 'Quiz' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-green-500">Score: <span className="text-lime-600">{score}</span></span>
              <span className="text-xs bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full">{cardIdx + 1}/{VOCAB_BANK.length}</span>
            </div>

            <div className="card text-center mb-5">
              <div className="text-xs text-green-500 font-bold mb-2 uppercase tracking-wide">What does this word mean?</div>
              <div className="font-display text-4xl text-green-800">{quizWord.word}</div>
            </div>

            <div className="space-y-3">
              {quizOptions.map((opt, i) => {
                let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
                if (quizChecked) {
                  if (opt === quizWord.meaning) cls = 'bg-lime-100 border-2 border-lime-400 text-green-800'
                  else if (opt === quizSelected) cls = 'bg-red-100 border-2 border-red-400 text-red-800'
                } else if (opt === quizSelected) {
                  cls = 'bg-lime-200 border-2 border-lime-400 text-green-800'
                }
                return (
                  <button key={i} onClick={() => handleQuizSelect(opt)}
                    className={`w-full p-4 rounded-2xl text-left font-semibold transition-all ${cls}`}>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Match mode */}
        {mode === 'Match' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-green-500">Match word to meaning!</span>
              <span className="text-xs bg-lime-100 text-lime-700 font-bold px-3 py-1 rounded-full">
                {matchDone.length}/5 matched
              </span>
            </div>

            {matchDone.length === 5 && (
              <div className="bg-lime-100 border-2 border-lime-400 rounded-2xl p-4 text-center mb-4">
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-bold text-green-800">All matched! +50 XP</div>
                <button onClick={initMatch} className="btn-primary mt-3">Play Again</button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {matchPairs?.map(item => {
                const isDone = matchDone.includes(item.pairId)
                const isSelected = matchSelected.find(s => s.id === item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect(item)}
                    disabled={isDone}
                    className={`p-3 rounded-2xl border-2 text-sm font-semibold text-center transition-all min-h-[70px] flex items-center justify-center
                      ${isDone ? 'bg-lime-100 border-lime-300 text-green-700 opacity-50'
                        : isSelected ? 'bg-lime-300 border-lime-500 text-green-900 scale-95'
                        : 'bg-white border-gray-200 hover:border-lime-300 hover:bg-lime-50 text-gray-700'}`}
                  >
                    {item.text}
                  </button>
                )
              })}
            </div>

            {!matchPairs && (
              <button onClick={initMatch} className="btn-primary w-full">Start Matching!</button>
            )}
          </div>
        )}

        {/* Word list */}
        <div className="mt-6">
          <h3 className="font-display text-xl text-green-800 mb-3">Full Word Bank 📚</h3>
          <div className="space-y-2">
            {VOCAB_BANK.map((w, i) => (
              <div key={i} className="card py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime-400 rounded-xl flex items-center justify-center text-xs font-bold text-green-900 shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-green-800">{w.word}</div>
                    <div className="text-sm text-green-500 font-semibold">{w.meaning}</div>
                    <div className="text-xs text-gray-400 mt-0.5 italic truncate">{w.example}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
