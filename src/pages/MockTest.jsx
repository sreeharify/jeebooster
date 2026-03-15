import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import { useProgress } from '../contexts/ProgressContext'
import { Clock, Play, ChevronRight, RotateCcw } from 'lucide-react'

const MOCK_TESTS = [
  {
    id: 'mt1',
    title: 'Mini Test — Grammar Focus',
    duration: 10,
    questions: [
      { id: 1, type: 'mcq', question: 'Choose the correct sentence:', options: ['The data shows a significant increase.', 'The data show a significant increase.', 'The datas shows a significant increase.', 'The data is shows a significant increase.'], correct: 'The data shows a significant increase.', explanation: '"Data" in academic writing is often treated as singular.' },
      { id: 2, type: 'mcq', question: 'Which sentence uses the passive voice correctly?', options: ['The report wrote by the team.', 'The report was written by the team.', 'The report were written by the team.', 'The report is wrote by the team.'], correct: 'The report was written by the team.', explanation: 'Passive: was/were + past participle.' },
      { id: 3, type: 'mcq', question: 'Choose the correct relative clause:', options: ['The scientist who discovered penicillin was Fleming.', 'The scientist which discovered penicillin was Fleming.', 'The scientist whom discovered penicillin was Fleming.', 'The scientist what discovered penicillin was Fleming.'], correct: 'The scientist who discovered penicillin was Fleming.', explanation: '"Who" is used for people as the subject of a relative clause.' },
      { id: 4, type: 'mcq', question: 'Select the correct conditional sentence:', options: ['If temperatures rises, ice caps would melt.', 'If temperatures rise, ice caps will melt.', 'If temperatures will rise, ice caps melt.', 'If temperatures rises, ice caps melts.'], correct: 'If temperatures rise, ice caps will melt.', explanation: 'First conditional: If + present simple, will + infinitive.' },
      { id: 5, type: 'mcq', question: 'Which is an example of INVERSION for emphasis?', options: ['I have never seen such results.', 'Never have I seen such results.', 'Such results I have never seen.', 'Such never I have seen results.'], correct: 'Never have I seen such results.', explanation: 'Negative adverbs at the start trigger subject-auxiliary inversion.' },
    ]
  },
  {
    id: 'mt2',
    title: 'Mini Test — Vocabulary',
    duration: 8,
    questions: [
      { id: 1, type: 'mcq', question: '"The policy aims to _____ the effects of climate change." Choose the best academic verb:', options: ['stop', 'mitigate', 'end', 'kill'], correct: 'mitigate', explanation: '"Mitigate" means to lessen severity — perfect for academic writing.' },
      { id: 2, type: 'mcq', question: 'What does "ubiquitous" mean?', options: ['Rare and unusual', 'Present everywhere', 'Very expensive', 'Difficult to understand'], correct: 'Present everywhere', explanation: '"Ubiquitous" describes something found everywhere.' },
      { id: 3, type: 'mcq', question: 'Choose the best word: "Researchers _____ that the results indicate a strong correlation."', options: ['said', 'talked', 'contend', 'spoke'], correct: 'contend', explanation: '"Contend" is a formal academic reporting verb.' },
      { id: 4, type: 'mcq', question: 'Which word means "to make worse"?', options: ['alleviate', 'mitigate', 'exacerbate', 'diminish'], correct: 'exacerbate', explanation: '"Exacerbate" means to make a problem or situation worse.' },
      { id: 5, type: 'mcq', question: 'Select the correct collocation:', options: ['make a research', 'do a research', 'conduct research', 'perform a research'], correct: 'conduct research', explanation: '"Conduct research" is the correct academic collocation.' },
    ]
  },
  {
    id: 'mt3',
    title: 'Full Reading Test',
    duration: 20,
    questions: [
      {
        id: 1, type: 'passage_mcq',
        passage: 'Artificial intelligence (AI) is rapidly transforming numerous industries. In healthcare, AI algorithms can analyse medical images with accuracy comparable to experienced radiologists. In finance, machine learning models detect fraudulent transactions in real time. However, critics argue that over-reliance on AI could lead to job displacement and ethical concerns around algorithmic bias.',
        question: 'What concern is mentioned about AI?',
        options: ['AI is too slow', 'Potential job displacement and algorithmic bias', 'AI costs too much', 'AI is not accurate enough'],
        correct: 'Potential job displacement and algorithmic bias',
        explanation: 'The passage mentions "job displacement and ethical concerns around algorithmic bias".'
      },
      {
        id: 2, type: 'true_false_ng',
        passage: 'Remote work has fundamentally transformed workplace culture. While many employees report increased productivity and better work-life balance, organisations face challenges in maintaining team cohesion and company culture. The shift has also accelerated digital transformation across sectors.',
        statement: 'All employees working remotely are more productive.',
        correctAnswer: 'False',
        options: ['True', 'False', 'Not Given'],
        explanation: 'The passage says "many employees report increased productivity" — not all.'
      },
      {
        id: 3, type: 'passage_mcq',
        passage: 'The concept of the circular economy represents a fundamental shift from the traditional linear economic model. Rather than the "take-make-dispose" approach, the circular economy emphasises keeping materials in use for as long as possible. This is achieved through strategies such as reuse, repair, remanufacturing, and recycling.',
        question: 'The circular economy differs from the linear model mainly in that it:',
        options: ['Is more expensive', 'Focuses on keeping materials in use longer', 'Only uses recycling', 'Produces more waste'],
        correct: 'Focuses on keeping materials in use longer',
        explanation: 'The passage directly states it emphasises "keeping materials in use for as long as possible".'
      },
      {
        id: 4, type: 'passage_mcq',
        passage: 'Urbanisation is accelerating at an unprecedented pace. By 2050, it is estimated that nearly 70% of the world\'s population will live in urban areas. This rapid shift presents both opportunities and challenges for city planners, including issues related to housing, infrastructure, transportation, and environmental sustainability.',
        question: 'According to the passage, what percentage of people will live in urban areas by 2050?',
        options: ['50%', '60%', '70%', '80%'],
        correct: '70%',
        explanation: 'The passage states "nearly 70% of the world\'s population will live in urban areas".'
      },
      {
        id: 5, type: 'true_false_ng',
        passage: 'Biodiversity loss is occurring at an alarming rate. Scientists estimate that current extinction rates are between 100 and 1,000 times higher than natural background rates. Habitat destruction, pollution, and climate change are among the primary drivers of this crisis.',
        statement: 'Climate change is the only cause of biodiversity loss.',
        correctAnswer: 'False',
        options: ['True', 'False', 'Not Given'],
        explanation: 'The passage mentions multiple causes: habitat destruction, pollution, AND climate change.'
      },
    ]
  }
]

export default function MockTest() {
  const [selected, setSelected] = useState(null)
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)
  const { awardXP, completeLesson } = useProgress()

  function startTest(test) {
    setSelected(test)
    setStarted(true)
    setAnswers({})
    setSubmitted(false)
    setTimeLeft(test.duration * 60)
  }

  useEffect(() => {
    if (started && timeLeft > 0 && !submitted) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && started && !submitted) {
      handleSubmit()
    }
    return () => clearTimeout(timerRef.current)
  }, [started, timeLeft, submitted])

  async function handleSubmit() {
    setSubmitted(true)
    clearTimeout(timerRef.current)
    const correct = selected.questions.filter((q, i) => {
      const ans = answers[i]
      return ans === q.correct || ans === q.correctAnswer
    }).length
    const score = Math.round((correct / selected.questions.length) * 100)
    await awardXP(score >= 80 ? 80 : score >= 60 ? 50 : 30, 'Mock test completed')
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timeWarning = timeLeft < 120 && timeLeft > 0

  if (!started) {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Mock Tests 🏅</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">Test yourself under exam conditions!</p>

          <div className="space-y-4">
            {MOCK_TESTS.map(test => (
              <div key={test.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">{test.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {test.duration} min
                      </span>
                      <span className="text-xs font-bold text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">
                        {test.questions.length} questions
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl">📋</span>
                </div>
                <button onClick={() => startTest(test)} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Start Test
                </button>
              </div>
            ))}
          </div>

          <div className="card mt-4 bg-gradient-to-br from-green-50 to-lime-50">
            <h3 className="font-display text-xl text-green-800 mb-3">📌 Test Tips</h3>
            {['Read questions before the passage', 'Manage your time — don\'t spend too long on one question', 'For True/False/Not Given: "Not Given" means it\'s simply not mentioned', 'Underline keywords in questions to guide your reading', 'Always attempt every question — no penalty for wrong answers'].map((tip, i) => (
              <div key={i} className="flex gap-2 mb-2 last:mb-0">
                <span className="text-lime-500 font-bold shrink-0">✓</span>
                <span className="text-sm font-semibold text-green-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    const correct = selected.questions.filter((q, i) => answers[i] === q.correct || answers[i] === q.correctAnswer).length
    const score = Math.round((correct / selected.questions.length) * 100)
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="text-center mb-6">
            <div className="text-7xl mb-3">{score >= 80 ? '🏆' : score >= 60 ? '🎯' : '💪'}</div>
            <h2 className="font-display text-3xl text-green-800">{score >= 80 ? 'Excellent!' : score >= 60 ? 'Good effort!' : 'Keep practising!'}</h2>
            <p className="text-green-500 font-semibold mt-1">{correct}/{selected.questions.length} correct • {score}%</p>
          </div>

          <div className="space-y-4 mb-6">
            {selected.questions.map((q, i) => {
              const userAns = answers[i]
              const isCorrect = userAns === q.correct || userAns === q.correctAnswer
              return (
                <div key={i} className={`card border-2 ${isCorrect ? 'border-lime-300' : 'border-red-200'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-lg shrink-0 ${isCorrect ? '' : ''}`}>{isCorrect ? '✅' : '❌'}</span>
                    <p className="font-semibold text-green-900 text-sm">{q.question || q.statement}</p>
                  </div>
                  {!isCorrect && (
                    <>
                      <div className="text-xs font-bold text-red-600 mb-1">Your answer: {userAns || 'Not answered'}</div>
                      <div className="text-xs font-bold text-lime-600 mb-1">Correct: {q.correct || q.correctAnswer}</div>
                    </>
                  )}
                  <div className="text-xs text-gray-500 font-semibold bg-gray-50 rounded-xl p-2 mt-2">💡 {q.explanation}</div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStarted(false); setSelected(null) }} className="btn-secondary flex-1">
              <RotateCcw className="w-4 h-4 inline mr-1" /> All Tests
            </button>
            <button onClick={() => startTest(selected)} className="btn-primary flex-1">Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lime-50 pb-24">
      {/* Timer Header */}
      <div className={`sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b-2 ${timeWarning ? 'bg-red-50 border-red-300' : 'bg-white border-lime-200'}`}>
        <div>
          <h3 className="font-bold text-green-800 text-sm">{selected.title}</h3>
          <p className="text-xs text-green-500">{Object.keys(answers).length}/{selected.questions.length} answered</p>
        </div>
        <div className={`flex items-center gap-2 font-display text-2xl ${timeWarning ? 'text-red-600' : 'text-green-700'}`}>
          <Clock className="w-5 h-5" />
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {selected.questions.map((q, i) => (
          <div key={i} className="card">
            <div className="text-xs font-bold text-lime-600 mb-2">Question {i + 1}</div>

            {(q.type === 'passage_mcq' || q.type === 'true_false_ng') && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-3 text-xs text-blue-900 font-semibold leading-relaxed">
                {q.passage}
              </div>
            )}

            <p className="font-bold text-green-900 mb-3 text-sm">{q.question || q.statement}</p>

            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                  className={`w-full p-3 rounded-xl text-left text-sm font-semibold border-2 transition-all
                    ${answers[i] === opt ? 'bg-lime-200 border-lime-400 text-green-900' : 'bg-white border-gray-200 hover:border-lime-200 text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} className="btn-primary w-full flex items-center justify-center gap-2 mb-8">
          Submit Test <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
