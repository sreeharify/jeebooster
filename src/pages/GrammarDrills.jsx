import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useProgress } from '../contexts/ProgressContext'
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react'

const GRAMMAR_SECTIONS = [
  {
    id: 'complex',
    title: 'Complex Sentences',
    icon: '🔗',
    color: 'from-blue-400 to-blue-600',
    explanation: `Complex sentences have one **main clause** and one or more **subordinate clauses**, joined by subordinating conjunctions. They show sophisticated thinking and are essential for Band 7+.

**Common subordinating conjunctions:**
• Cause: because, since, as, given that
• Contrast: although, even though, whereas, while
• Condition: if, unless, provided that, as long as
• Time: when, after, before, once, until
• Purpose: so that, in order that`,
    examples: [
      { label: 'Cause', sentence: 'Since pollution levels have increased dramatically, many cities have introduced strict emission controls.' },
      { label: 'Contrast', sentence: 'Although technology has transformed communication, face-to-face interaction remains irreplaceable.' },
      { label: 'Condition', sentence: 'Unless governments invest in renewable energy, climate targets will not be met.' },
    ],
    drills: [
      { prompt: 'Combine using "although": "Technology is useful. It creates problems."', options: ['Although technology is useful, it creates problems.', 'Technology although is useful creates problems.', 'Although, technology is useful it creates problems.', 'Technology creates problems, although is useful.'], correct: 0 },
      { prompt: 'Which sentence correctly uses a subordinating conjunction?', options: ['Since the government invested in education, literacy rates have risen.', 'Since the government, literacy rates have risen invested in education.', 'Literacy rates have risen since, the government invested in education.', 'The government since invested, literacy rates have risen.'], correct: 0 },
      { prompt: 'Which shows CONTRAST correctly?', options: ['Whereas some argue for stricter laws, others believe self-regulation is more effective.', 'Whereas some argue for stricter laws others believe self-regulation is more effective.', 'Some argue for stricter laws, whereas others believe self-regulation is more effective — both are wrong.', 'Others whereas believe self-regulation, some argue for stricter laws.'], correct: 0 },
      { prompt: 'Complete: "_____ the economy grows, inequality also tends to increase."', options: ['Unless', 'Even though', 'As', 'Despite'], correct: 2 },
      { prompt: 'Choose the INCORRECT sentence:', options: ['Because she studied hard, she passed.', 'She passed because she studied hard.', 'Because she studied hard she passed.', 'She studied hard. Because of this, she passed.'], correct: 2 },
    ]
  },
  {
    id: 'passive',
    title: 'Passive Voice',
    icon: '🔄',
    color: 'from-green-400 to-green-600',
    explanation: `The **passive voice** is common in academic writing because it:
• Focuses on the action/result rather than the agent
• Sounds more objective and formal
• Is useful when the agent is unknown or unimportant

**Structure:** Object + be (conjugated) + past participle (+ by + agent)

**Tense examples:**
• Present: The data *is analysed* by researchers.
• Past: The report *was published* in 2023.
• Perfect: The results *have been reviewed*.
• Future: The findings *will be presented* next month.`,
    examples: [
      { label: 'Present passive', sentence: 'Carbon emissions are produced primarily by the burning of fossil fuels.' },
      { label: 'Past passive', sentence: 'The experiment was conducted under controlled laboratory conditions.' },
      { label: 'Perfect passive', sentence: 'Significant progress has been made in the field of renewable energy.' },
    ],
    drills: [
      { prompt: 'Convert to passive: "Scientists discovered a new species."', options: ['A new species was discovered by scientists.', 'A new species discovered by scientists.', 'A new species has discovered by scientists.', 'Scientists were discovered by a new species.'], correct: 0 },
      { prompt: 'Which passive sentence is grammatically correct?', options: ['The policy was introduced by the government last year.', 'The policy was introduce by the government last year.', 'The policy were introduced by the government last year.', 'The policy was introducing by the government last year.'], correct: 0 },
      { prompt: 'Choose the correct PRESENT PERFECT passive:', options: ['Research has been conducted extensively.', 'Research have been conducted extensively.', 'Research was been conducted extensively.', 'Research has conducted extensively.'], correct: 0 },
      { prompt: 'Which sentence is BETTER in academic writing?', options: ['We found that the results were significant.', 'The results were found to be significant.', 'Both are equally good.', 'Neither is academic.'], correct: 1 },
      { prompt: 'Choose the correct future passive:', options: ['The data will be analysed next week.', 'The data will analysed next week.', 'The data will be analyse next week.', 'The data will being analysed next week.'], correct: 0 },
    ]
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    explanation: `Conditionals express hypothetical situations and their consequences. Using all types fluently is a marker of **high grammatical range**.

**The four types:**
| Type | Structure | Use |
|------|-----------|-----|
| Zero | If + present, present | Always true facts |
| First | If + present, will + inf | Real future possibility |
| Second | If + past, would + inf | Hypothetical present/future |
| Third | If + past perfect, would have + past participle | Hypothetical past |

**Mixed conditionals** (very advanced):
• If I *had studied* harder (past), I *would be* a doctor now (present).`,
    examples: [
      { label: '1st conditional', sentence: 'If governments implement stricter environmental policies, carbon emissions will decrease significantly.' },
      { label: '2nd conditional', sentence: 'If everyone adopted a plant-based diet, greenhouse gas emissions would be dramatically reduced.' },
      { label: '3rd conditional', sentence: 'If renewable technology had been prioritised earlier, the current climate crisis would not have developed so rapidly.' },
    ],
    drills: [
      { prompt: 'Which is a SECOND conditional?', options: ['If unemployment rises, crime rates would increase.', 'If unemployment rises, crime rates will increase.', 'If unemployment rises, crime rates increase.', 'If unemployment had risen, crime rates would have increased.'], correct: 0 },
      { prompt: 'Complete (3rd conditional): "If the government _____ invested more in education, the outcome _____ been different."', options: ['had / would have', 'would have / has', 'has / would have', 'had / would'], correct: 0 },
      { prompt: 'Which expresses a REAL future possibility?', options: ['If pollution is not reduced, sea levels will rise.', 'If pollution was not reduced, sea levels would rise.', 'If pollution had not been reduced, sea levels would have risen.', 'If pollution reduces, sea levels rise.'], correct: 0 },
      { prompt: 'Identify the MIXED conditional:', options: ['If he had taken the job, he would be living abroad now.', 'If he takes the job, he will live abroad.', 'If he took the job, he would live abroad.', 'If he had taken the job, he would have lived abroad.'], correct: 0 },
      { prompt: 'Which is grammatically INCORRECT?', options: ['Unless we act now, it will be too late.', 'If we would act now, it will be too late.', 'Provided that action is taken, the problem can be solved.', 'Were the government to act, the situation would improve.'], correct: 1 },
    ]
  },
  {
    id: 'relative',
    title: 'Relative Clauses',
    icon: '🧩',
    color: 'from-purple-400 to-purple-600',
    explanation: `Relative clauses add information about a noun. They are crucial for writing complex, information-dense sentences.

**Types:**
• **Defining** (no commas): identifies WHICH one → "The country *that invested most in renewables* saw the greatest benefit."
• **Non-defining** (commas): adds extra info → "Solar energy, *which is increasingly affordable*, offers a sustainable solution."

**Pronouns:**
• **who/whom** → people
• **which** → things (non-defining)
• **that** → people or things (defining only)
• **whose** → possession
• **where** → places
• **when** → times`,
    examples: [
      { label: 'Defining', sentence: 'Students who develop strong academic writing skills are better prepared for university.' },
      { label: 'Non-defining', sentence: 'The Industrial Revolution, which began in Britain in the 18th century, transformed global economies.' },
      { label: 'Whose', sentence: 'Researchers whose work focuses on climate change have highlighted the urgent need for action.' },
    ],
    drills: [
      { prompt: 'Choose the correct relative pronoun: "The study, _____ was published last year, challenges previous assumptions."', options: ['which', 'that', 'who', 'whose'], correct: 0 },
      { prompt: 'Which sentence uses a NON-DEFINING relative clause correctly?', options: ['Climate change, which affects all nations, requires global cooperation.', 'Climate change which affects all nations requires global cooperation.', 'Climate change, that affects all nations, requires global cooperation.', 'Climate change affecting all nations, which requires global cooperation.'], correct: 0 },
      { prompt: 'Select the correct sentence:', options: ['The scientist whose research won the award gave a lecture.', 'The scientist who research won the award gave a lecture.', 'The scientist which research won the award gave a lecture.', 'The scientist whom research won the award gave a lecture.'], correct: 0 },
      { prompt: '"The city _____ I grew up has changed enormously." Choose the correct word:', options: ['where', 'which', 'that', 'in that'], correct: 0 },
      { prompt: 'Which sentence is DEFINING (restrictive)?', options: ['People who exercise regularly tend to live longer.', 'My brother, who exercises regularly, lives in London.', 'Exercise, which is important, should be done daily.', 'The gym, where I exercise, closes at 10pm.'], correct: 0 },
    ]
  },
  {
    id: 'inversion',
    title: 'Inversion & Emphasis',
    icon: '🏆',
    color: 'from-lime-400 to-green-600',
    explanation: `**Inversion** places the auxiliary verb before the subject for emphasis. It is a marker of **C2/Band 9** grammatical range.

**Common inversion triggers:**
• Negative adverbs: Never, Rarely, Seldom, Hardly, No sooner, Not only
• Only expressions: Only then, Only when, Only by
• So/Such...that
• Formal conditionals: Were, Had, Should

**Structure after negative adverb:**
Negative adverb + auxiliary + subject + main verb

**Examples:**
• Never **have I seen** such dedication.
• Rarely **does one encounter** writing of this quality.
• Not only **did she pass**, but she also achieved the highest score.
• Were the government **to invest** more, outcomes would improve.`,
    examples: [
      { label: 'Never', sentence: 'Never before has global cooperation on environmental issues been so urgently required.' },
      { label: 'Not only', sentence: 'Not only does urbanisation strain infrastructure, but it also exacerbates social inequality.' },
      { label: 'Formal conditional', sentence: 'Were governments to prioritise education, many social problems could be significantly reduced.' },
    ],
    drills: [
      { prompt: 'Which uses inversion CORRECTLY?', options: ['Never have I witnessed such extraordinary progress.', 'Never I have witnessed such extraordinary progress.', 'Never I witnessed such extraordinary progress.', 'I never have witnessed such extraordinary progress.'], correct: 0 },
      { prompt: 'Complete: "Not only _____ the policy failed, _____ it made the situation worse."', options: ['did / but', 'has / but', 'did / and', 'Both A and B are correct'], correct: 3 },
      { prompt: 'Which is a correct FORMAL CONDITIONAL inversion?', options: ['Were he to study harder, he would pass.', 'If he were to study harder, he would pass.', 'Was he to study harder, he would pass.', 'He were to study harder, he would pass.'], correct: 0 },
      { prompt: 'Choose the correct "Rarely" inversion:', options: ['Rarely does such an opportunity arise.', 'Rarely such an opportunity arises.', 'Rarely an opportunity such as this arises.', 'Rarely arising is such an opportunity.'], correct: 0 },
      { prompt: '"_____ had the meeting ended _____ problems began to emerge."', options: ['No sooner / than', 'Hardly / when', 'Both A and B are correct', 'Neither is correct'], correct: 2 },
    ]
  },
]

export default function GrammarDrills() {
  const [activeSection, setActiveSection] = useState(null)
  const [drillMode, setDrillMode] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const { awardXP } = useProgress()

  const section = GRAMMAR_SECTIONS.find(s => s.id === activeSection)

  function startDrill(sectionId) {
    setActiveSection(sectionId)
    setDrillMode(true)
    setCurrentQ(0)
    setSelected(null)
    setChecked(false)
    setScore(0)
    setFinished(false)
  }

  function handleCheck() {
    if (selected === null) return
    setChecked(true)
    if (selected === section.drills[currentQ].correct) setScore(s => s + 1)
  }

  async function handleNext() {
    if (currentQ + 1 >= section.drills.length) {
      const pct = Math.round(((score + (selected === section.drills[currentQ].correct ? 1 : 0)) / section.drills.length) * 100)
      await awardXP(pct >= 80 ? 30 : 15, `${section.title} drill`)
      setFinished(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setChecked(false)
    }
  }

  // Section overview
  if (!activeSection) {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Grammar Drills ⚡</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">Master the grammar structures that earn Band 9</p>

          <div className="space-y-3">
            {GRAMMAR_SECTIONS.map(s => (
              <div key={s.id} className="card-hover" onClick={() => setActiveSection(s.id)}>
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-3xl shadow`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-800">{s.title}</h3>
                    <p className="text-xs text-green-500 font-semibold">{s.drills.length} practice questions</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-lime-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 bg-gradient-to-br from-lime-50 to-green-50">
            <h3 className="font-display text-xl text-green-800 mb-3">🎯 Why Grammar Matters for Band 9</h3>
            <p className="text-sm text-green-700 font-semibold leading-relaxed">
              Grammatical Range & Accuracy (GRA) accounts for 25% of your Writing and Speaking scores. Band 9 requires "a full range of structures used naturally and appropriately with very rare minor errors." The structures above are exactly what distinguish Band 7 from Band 9.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Detail view (explanation + examples)
  if (!drillMode && !finished) {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <button onClick={() => setActiveSection(null)} className="flex items-center gap-2 text-green-600 font-bold mb-4 hover:text-green-800">
            ← Back
          </button>

          <div className={`bg-gradient-to-br ${section.color} rounded-3xl p-5 text-white mb-4 shadow-lg`}>
            <div className="text-4xl mb-2">{section.icon}</div>
            <h2 className="font-display text-2xl">{section.title}</h2>
          </div>

          {/* Explanation */}
          <div className="card mb-4">
            <h3 className="font-bold text-green-800 mb-3">📖 Explanation</h3>
            <div className="text-sm text-green-800 font-semibold leading-relaxed whitespace-pre-line">
              {section.explanation}
            </div>
          </div>

          {/* Examples */}
          <div className="card mb-4">
            <h3 className="font-bold text-green-800 mb-3">✨ Band 9 Examples</h3>
            <div className="space-y-3">
              {section.examples.map((ex, i) => (
                <div key={i} className="bg-lime-50 border-l-4 border-lime-500 rounded-r-2xl p-3">
                  <div className="text-xs font-bold text-lime-600 mb-1 uppercase">{ex.label}</div>
                  <p className="text-sm font-semibold text-green-900 italic">"{ex.sentence}"</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => startDrill(section.id)} className="btn-primary w-full">
            🎯 Start Practice Drill ({section.drills.length} questions)
          </button>
        </div>
      </div>
    )
  }

  // Finished screen
  if (finished) {
    const finalScore = score
    const pct = Math.round((finalScore / section.drills.length) * 100)
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4 pt-16">
        <Navbar />
        <div className="max-w-sm w-full text-center">
          <div className="text-7xl mb-4">{pct === 100 ? '🌟' : pct >= 60 ? '🎉' : '💪'}</div>
          <h2 className="font-display text-3xl text-green-800 mb-2">{pct === 100 ? 'Perfect!' : pct >= 60 ? 'Good work!' : 'Keep practising!'}</h2>

          <div className="card mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-display text-3xl text-lime-600">{finalScore}/{section.drills.length}</div>
                <div className="text-xs font-bold text-gray-500">Correct</div>
              </div>
              <div>
                <div className="font-display text-3xl text-green-600">{pct}%</div>
                <div className="text-xs font-bold text-gray-500">Score</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setActiveSection(null)} className="btn-secondary flex-1">← All Topics</button>
            <button onClick={() => startDrill(section.id)} className="btn-primary flex-1">
              <RotateCcw className="w-4 h-4 inline mr-1" /> Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Drill mode
  const drill = section.drills[currentQ]
  const progress = (currentQ / section.drills.length) * 100

  return (
    <div className="min-h-screen bg-lime-50 flex flex-col pb-6">
      {/* Header */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => { setDrillMode(false) }} className="text-green-600 font-bold text-sm">✕</button>
        <div className="flex-1">
          <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-sm font-bold text-green-600">{currentQ + 1}/{section.drills.length}</span>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 flex flex-col">
        <div className="mb-1">
          <span className="text-xs font-bold text-lime-600 bg-lime-100 px-3 py-1 rounded-full uppercase tracking-wide">{section.title}</span>
        </div>

        <h3 className="font-display text-xl text-green-900 mb-5 leading-snug">{drill.prompt}</h3>

        <div className="space-y-3 flex-1">
          {drill.options.map((opt, i) => {
            let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
            if (checked) {
              if (i === drill.correct) cls = 'bg-lime-100 border-2 border-lime-400 text-green-800'
              else if (i === selected) cls = 'bg-red-100 border-2 border-red-400 text-red-800'
            } else if (i === selected) {
              cls = 'bg-lime-200 border-2 border-lime-400 text-green-800'
            }
            return (
              <button key={i} onClick={() => !checked && setSelected(i)}
                className={`w-full p-4 rounded-2xl text-left font-semibold transition-all text-sm ${cls}`}>
                <span className="text-xs font-bold opacity-50 mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                {opt}
              </button>
            )
          })}
        </div>

        {checked && (
          <div className={`mt-4 p-4 rounded-2xl border-2 ${selected === drill.correct ? 'bg-lime-50 border-lime-300' : 'bg-red-50 border-red-200'}`}>
            <p className="font-bold text-sm">
              {selected === drill.correct ? '🎉 Correct!' : `❌ The correct answer is: ${drill.options[drill.correct]}`}
            </p>
          </div>
        )}
      </div>

      <div className="px-4">
        {!checked ? (
          <button onClick={handleCheck} disabled={selected === null}
            className="btn-primary w-full disabled:opacity-40">
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            {currentQ + 1 >= section.drills.length ? '🎉 See Results' : 'Continue'} <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
