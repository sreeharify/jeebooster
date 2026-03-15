import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { X, Heart, Zap, ChevronRight } from 'lucide-react'
import { COURSE_DATA, VOCAB_BANK, GRAMMAR_LESSONS } from '../data/courseData'
import Confetti from 'react-confetti'

// Find lesson in course data
function findLesson(id) {
  for (const section of COURSE_DATA) {
    for (const unit of section.units) {
      const lesson = unit.lessons.find(l => l.id === id)
      if (lesson) return { lesson, unit, section }
    }
  }
  return null
}

// Generate exercises based on lesson type
function generateExercises(lesson) {
  const type = lesson.type

  if (type === 'vocab') {
    const words = VOCAB_BANK.slice(0, 5)
    return words.map((w, i) => ({
      id: i,
      type: 'multiple_choice',
      question: `What does "${w.word}" mean?`,
      options: shuffleOptions(w.meaning, VOCAB_BANK.filter(x => x.word !== w.word).slice(0, 3).map(x => x.meaning)),
      correct: w.meaning,
      hint: `Example: ${w.example}`,
      word: w.word,
    }))
  }

  if (type === 'grammar') {
    return [
      {
        id: 0, type: 'multiple_choice',
        question: 'Which sentence uses a complex sentence correctly?',
        options: [
          'Although the population is growing, resources remain limited.',
          'The population is growing. Resources are limited.',
          'Because. The population grows.',
          'Population growing resources limited.',
        ],
        correct: 'Although the population is growing, resources remain limited.',
        hint: 'Complex sentences join independent and dependent clauses.',
      },
      {
        id: 1, type: 'fill_blank',
        question: 'Complete: "_____ technology advances, new jobs are created."',
        options: ['As', 'But', 'So', 'Yet'],
        correct: 'As',
        hint: '"As" introduces a time/cause clause.',
      },
      {
        id: 2, type: 'multiple_choice',
        question: 'Which sentence correctly uses the passive voice?',
        options: [
          'The experiment was conducted by researchers.',
          'Researchers was conducting the experiment.',
          'The experiment conducting was by researchers.',
          'Was the experiment researchers conducted.',
        ],
        correct: 'The experiment was conducted by researchers.',
        hint: 'Passive: Object + was/were + past participle.',
      },
      {
        id: 3, type: 'reorder',
        question: 'Put the words in the correct order:',
        words: ['has', 'The', 'significantly', 'changed', 'economy'],
        correct: 'The economy has changed significantly',
        hint: 'Subject + auxiliary + verb + adverb',
      },
      {
        id: 4, type: 'fill_blank',
        question: 'Choose the correct relative pronoun: "The researcher _____ study I read made an interesting point."',
        options: ['whose', 'who', 'which', 'that'],
        correct: 'whose',
        hint: '"Whose" shows possession.',
      },
    ]
  }

  if (type === 'reading') {
    return [
      {
        id: 0, type: 'reading_passage',
        passage: `Climate change represents one of the most significant challenges facing humanity in the 21st century. Scientists have reached a consensus that global temperatures are rising at an unprecedented rate, primarily due to the emission of greenhouse gases from human activities such as burning fossil fuels and deforestation. The consequences of this warming are far-reaching, including rising sea levels, more frequent extreme weather events, and disruptions to ecosystems worldwide.`,
        question: 'According to the passage, what is the PRIMARY cause of rising global temperatures?',
        options: [
          'Natural climate cycles',
          'Human activities such as burning fossil fuels',
          'Rising sea levels',
          'Changes in solar activity',
        ],
        correct: 'Human activities such as burning fossil fuels',
        hint: 'Look for the cause mentioned after "primarily due to".',
      },
      {
        id: 1, type: 'true_false',
        passage: `Remote work has fundamentally transformed the modern workplace. Studies suggest that employees who work from home report higher levels of job satisfaction and productivity. However, some researchers argue that the lack of face-to-face interaction can lead to feelings of isolation and reduced team cohesion.`,
        statements: [
          { text: 'Employees working from home are always more productive.', answer: 'False' },
          { text: 'Some researchers believe remote work can cause isolation.', answer: 'True' },
          { text: 'The passage discusses the impact of remote work on the workplace.', answer: 'True' },
        ],
        hint: 'Read carefully — "suggest" and "argue" indicate varying degrees of certainty.',
      },
      {
        id: 2, type: 'multiple_choice',
        passage: `The term "circular economy" refers to an economic model designed to eliminate waste and keep resources in use for as long as possible. Unlike the traditional linear economy — which follows a "take, make, dispose" pattern — the circular economy focuses on reusing, repairing, refurbishing, and recycling materials. This approach has the potential to significantly reduce environmental impact.`,
        question: 'Which of the following BEST describes the circular economy?',
        options: [
          'An economy based on taking, making, and disposing',
          'A model focused on keeping resources in use and eliminating waste',
          'A system that only focuses on recycling materials',
          'An economic model that ignores environmental concerns',
        ],
        correct: 'A model focused on keeping resources in use and eliminating waste',
        hint: 'The definition is given directly after "refers to".',
      },
    ]
  }

  if (type === 'quiz') {
    return [
      {
        id: 0, type: 'multiple_choice',
        question: 'How many sections does the IELTS Listening test have?',
        options: ['2', '3', '4', '5'],
        correct: '4',
        hint: 'The listening test has 4 sections with increasing difficulty.',
      },
      {
        id: 1, type: 'multiple_choice',
        question: 'How long is the IELTS Academic Reading test?',
        options: ['45 minutes', '60 minutes', '75 minutes', '90 minutes'],
        correct: '60 minutes',
        hint: 'You have 1 hour to read 3 passages and answer 40 questions.',
      },
      {
        id: 2, type: 'multiple_choice',
        question: 'What is the minimum word count for IELTS Writing Task 2?',
        options: ['150 words', '200 words', '250 words', '300 words'],
        correct: '250 words',
        hint: 'Task 2 requires at least 250 words and is worth more marks.',
      },
      {
        id: 3, type: 'multiple_choice',
        question: 'In IELTS Speaking Part 2, how long do you have to prepare?',
        options: ['30 seconds', '1 minute', '2 minutes', '3 minutes'],
        correct: '1 minute',
        hint: 'You get 1 minute to prepare before speaking for 1-2 minutes.',
      },
      {
        id: 4, type: 'multiple_choice',
        question: 'What does "True/False/Not Given" test in IELTS Reading?',
        options: [
          'Your vocabulary knowledge',
          'Whether information matches, contradicts, or is absent from the text',
          'Your ability to summarize the passage',
          'Whether you can find specific numbers',
        ],
        correct: 'Whether information matches, contradicts, or is absent from the text',
        hint: '"Not Given" means the information is neither confirmed nor denied.',
      },
    ]
  }

  // Default exercises for other types
  return [
    {
      id: 0, type: 'multiple_choice',
      question: 'Which of the following is a key strategy for achieving Band 9 in IELTS?',
      options: [
        'Memorizing template answers',
        'Developing natural, flexible language use',
        'Using only simple vocabulary',
        'Avoiding complex sentence structures',
      ],
      correct: 'Developing natural, flexible language use',
      hint: 'Band 9 requires natural, spontaneous language — not memorized phrases.',
    },
    {
      id: 1, type: 'fill_blank',
      question: 'Choose the best academic word: "The study _____ a significant correlation between diet and health."',
      options: ['showed', 'demonstrated', 'said', 'told'],
      correct: 'demonstrated',
      hint: '"Demonstrated" is more formal and academic than "showed".',
    },
    {
      id: 2, type: 'multiple_choice',
      question: 'What does "Lexical Resource" assess in IELTS Writing?',
      options: [
        'How many words you write',
        'The range and accuracy of vocabulary used',
        'Your handwriting quality',
        'How quickly you write',
      ],
      correct: 'The range and accuracy of vocabulary used',
      hint: 'Lexical Resource is one of the 4 marking criteria in IELTS Writing.',
    },
    {
      id: 3, type: 'multiple_choice',
      question: 'Which cohesive device shows CONTRAST?',
      options: ['Furthermore', 'However', 'Therefore', 'Moreover'],
      correct: 'However',
      hint: '"However" introduces a contrasting idea.',
    },
    {
      id: 4, type: 'fill_blank',
      question: 'Choose the correct hedging language: "The results _____ suggest a link between the two variables."',
      options: ['definitely', 'absolutely', 'would seem to', 'never'],
      correct: 'would seem to',
      hint: 'Hedging language softens claims in academic writing.',
    },
  ]
}

function shuffleOptions(correct, others) {
  const all = [correct, ...others]
  return all.sort(() => Math.random() - 0.5)
}

export default function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { completeLesson, loseHeart } = useProgress()
  const { profile } = useAuth()
  const [exercises, setExercises] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [finished, setFinished] = useState(false)
  const [tfAnswers, setTfAnswers] = useState({})
  const [reorderInput, setReorderInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [hearts, setHearts] = useState(profile?.hearts || 5)

  const found = findLesson(lessonId)

  useEffect(() => {
    if (found) {
      setExercises(generateExercises(found.lesson))
    }
  }, [lessonId])

  if (!found) return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-display text-xl text-green-700">Lesson not found!</p>
        <button onClick={() => navigate('/learn')} className="btn-primary mt-4">Back to Learn</button>
      </div>
    </div>
  )

  const { lesson } = found
  const ex = exercises[current]
  const progress = exercises.length > 0 ? ((current) / exercises.length) * 100 : 0

  function handleSelect(option) {
    if (checked) return
    setSelected(option)
  }

  function handleCheck() {
    if (!ex) return
    if (ex.type === 'true_false') {
      const allAnswered = ex.statements.every((_, i) => tfAnswers[i])
      if (!allAnswered) return
      const allCorrect = ex.statements.every((s, i) => tfAnswers[i] === s.answer)
      if (allCorrect) setCorrect(c => c + 1)
      else { setWrong(w => w + 1); setHearts(h => Math.max(0, h - 1)); loseHeart() }
      setChecked(true)
      return
    }
    if (!selected) return
    const isCorrect = selected === ex.correct
    if (isCorrect) setCorrect(c => c + 1)
    else { setWrong(w => w + 1); setHearts(h => Math.max(0, h - 1)); loseHeart() }
    setChecked(true)
    setShowHint(false)
  }

  async function handleNext() {
    if (current + 1 >= exercises.length) {
      const score = Math.round((correct / exercises.length) * 100)
      await completeLesson(lessonId, score)
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setChecked(false)
      setTfAnswers({})
      setShowHint(false)
      setReorderInput('')
    }
  }

  if (finished) {
    const score = Math.round((correct / exercises.length) * 100)
    const xpEarned = Math.round((score / 100) * lesson.xp) + 10
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
        {score >= 70 && <Confetti recycle={false} numberOfPieces={200} colors={['#bbff33', '#84d600', '#22c55e', '#a3f007']} />}
        <div className="max-w-sm w-full text-center">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {score === 100 ? '🌟' : score >= 70 ? '🎉' : '💪'}
          </div>
          <h2 className="font-display text-3xl text-green-800 mb-2">
            {score === 100 ? 'Perfect!' : score >= 70 ? 'Great job!' : 'Keep going!'}
          </h2>
          <p className="text-green-500 font-semibold mb-6">
            {score === 100 ? "You're a superstar! 🌟" : score >= 70 ? "You're doing great!" : "Practice makes perfect!"}
          </p>

          <div className="card mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-display text-lime-600">{score}%</div>
                <div className="text-xs font-bold text-gray-500">Score</div>
              </div>
              <div>
                <div className="text-3xl font-display text-green-600">+{xpEarned}</div>
                <div className="text-xs font-bold text-gray-500">XP Earned</div>
              </div>
              <div>
                <div className="text-3xl font-display text-yellow-500">{correct}/{exercises.length}</div>
                <div className="text-xs font-bold text-gray-500">Correct</div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map(s => (
                <span key={s} className={`text-3xl transition-all ${score >= s * 33 ? 'scale-110' : 'grayscale opacity-30'}`}>⭐</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/learn')} className="btn-secondary flex-1">Back to Learn</button>
            <button onClick={() => { setCurrent(0); setCorrect(0); setWrong(0); setFinished(false); setSelected(null); setChecked(false) }}
              className="btn-primary flex-1">Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
          <span className="font-bold text-red-500">{hearts}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-lime-600" />
          <span className="font-bold text-lime-700 text-sm">{current + 1}/{exercises.length}</span>
        </div>
      </div>

      {/* Exercise */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        {!ex ? (
          <div className="text-center py-10">
            <div className="text-4xl animate-spin-slow mb-4">🌿</div>
            <p className="font-display text-xl text-green-600">Loading exercises...</p>
          </div>
        ) : (
          <>
            <div className="mb-1">
              <span className="text-xs font-bold text-lime-600 bg-lime-100 px-3 py-1 rounded-full uppercase tracking-wide">
                {lesson.title}
              </span>
            </div>

            {/* Reading Passage */}
            {(ex.type === 'reading_passage' || ex.type === 'true_false') && ex.passage && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4 text-sm text-green-900 font-semibold leading-relaxed">
                <div className="text-xs font-bold text-green-600 mb-2 uppercase">📖 Read carefully</div>
                {ex.passage}
              </div>
            )}

            <h3 className="font-display text-xl text-green-900 mb-5 leading-snug">{ex.question}</h3>

            {/* Multiple Choice */}
            {(ex.type === 'multiple_choice' || ex.type === 'fill_blank' || ex.type === 'reading_passage') && (
              <div className="space-y-3 flex-1">
                {ex.options.map((opt, i) => {
                  let cls = 'neutral-answer'
                  if (checked) {
                    if (opt === ex.correct) cls = 'correct-answer'
                    else if (opt === selected) cls = 'wrong-answer'
                  } else if (opt === selected) {
                    cls = 'selected-answer'
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className={`w-full p-4 rounded-2xl text-left font-semibold transition-all duration-200 ${cls} ${!checked ? 'hover:scale-[1.01] active:scale-[0.99]' : ''}`}
                    >
                      <span className="text-xs font-bold opacity-60 mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            )}

            {/* True/False/Not Given */}
            {ex.type === 'true_false' && (
              <div className="space-y-4 flex-1">
                {ex.statements.map((stmt, i) => (
                  <div key={i} className={`p-3 rounded-2xl border-2 ${checked ? (tfAnswers[i] === stmt.answer ? 'correct-answer' : 'wrong-answer') : 'bg-white border-gray-200'}`}>
                    <p className="font-semibold text-sm mb-2">{stmt.text}</p>
                    <div className="flex gap-2">
                      {['True', 'False', 'Not Given'].map(ans => (
                        <button
                          key={ans}
                          disabled={checked}
                          onClick={() => setTfAnswers(prev => ({ ...prev, [i]: ans }))}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border-2
                            ${tfAnswers[i] === ans
                              ? checked ? (ans === stmt.answer ? 'bg-lime-400 border-lime-500 text-green-900' : 'bg-red-400 border-red-500 text-white') : 'bg-lime-200 border-lime-400 text-green-800'
                              : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-lime-50'
                            }`}
                        >
                          {ans === 'Not Given' ? 'NG' : ans}
                        </button>
                      ))}
                    </div>
                    {checked && tfAnswers[i] !== stmt.answer && (
                      <p className="text-xs text-green-700 font-bold mt-1">✅ Correct: {stmt.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Hint */}
            {!checked && (
              <button onClick={() => setShowHint(!showHint)} className="text-xs font-bold text-lime-600 mt-3 text-left hover:text-lime-800">
                💡 {showHint ? 'Hide hint' : 'Show hint'}
              </button>
            )}
            {showHint && ex.hint && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mt-2 text-sm text-yellow-800 font-semibold">
                💡 {ex.hint}
              </div>
            )}

            {/* Feedback */}
            {checked && (
              <div className={`mt-4 p-4 rounded-2xl border-2 ${selected === ex.correct || (ex.type === 'true_false' && ex.statements.every((s, i) => tfAnswers[i] === s.answer)) ? 'bg-lime-50 border-lime-300' : 'bg-red-50 border-red-300'}`}>
                <p className="font-bold text-sm">
                  {(selected === ex.correct || (ex.type === 'true_false' && ex.statements.every((s, i) => tfAnswers[i] === s.answer)))
                    ? '🎉 Correct! Well done!'
                    : `❌ Correct answer: ${ex.correct || 'See above'}`}
                </p>
                {ex.hint && <p className="text-xs font-semibold text-gray-600 mt-1">{ex.hint}</p>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom action */}
      <div className="sticky bottom-0 bg-white border-t-2 border-lime-200 p-4">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!selected && ex?.type !== 'true_false'}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            {current + 1 >= exercises.length ? '🎉 Finish Lesson' : 'Continue'} <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
