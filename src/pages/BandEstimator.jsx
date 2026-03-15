import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { COURSE_DATA } from '../data/courseData'

const SELF_ASSESSMENT = {
  listening: [
    { q: 'I can understand main ideas in everyday conversations.', band: 5 },
    { q: 'I can follow academic lectures with some difficulty.', band: 6 },
    { q: 'I can understand most of an academic lecture without difficulty.', band: 7 },
    { q: 'I can understand implicit meaning, tone, and attitude of speakers.', band: 8 },
    { q: 'I understand everything including accents, speed variations, and inference.', band: 9 },
  ],
  reading: [
    { q: 'I can find specific information when I know what to look for.', band: 5 },
    { q: 'I can identify main ideas and supporting details.', band: 6 },
    { q: 'I can understand complex arguments and implied meanings.', band: 7 },
    { q: 'I can recognise writer\'s purpose, attitude, and text organisation.', band: 8 },
    { q: 'I read complex texts with ease and full comprehension.', band: 9 },
  ],
  writing: [
    { q: 'I can write basic paragraphs with a clear topic sentence.', band: 5 },
    { q: 'I can structure an essay with introduction, body, and conclusion.', band: 6 },
    { q: 'I write coherent essays with well-developed arguments.', band: 7 },
    { q: 'I use a wide vocabulary range with only minor errors.', band: 8 },
    { q: 'My writing is sophisticated, precise, and virtually error-free.', band: 9 },
  ],
  speaking: [
    { q: 'I can communicate basic needs and answer simple questions.', band: 5 },
    { q: 'I can discuss familiar topics with some hesitation.', band: 6 },
    { q: 'I speak with reasonable fluency and use complex language.', band: 7 },
    { q: 'I speak fluently with only occasional minor hesitations.', band: 8 },
    { q: 'I speak with complete fluency, precision, and naturalness.', band: 9 },
  ],
}

const SKILLS = ['listening', 'reading', 'writing', 'speaking']
const SKILL_ICONS = { listening: '🎧', reading: '👁️', writing: '✍️', speaking: '🗣️' }

function BandGauge({ band }) {
  const pct = ((band - 1) / 8) * 100
  const color = band >= 8 ? 'from-lime-400 to-green-500' : band >= 7 ? 'from-yellow-400 to-lime-400' : band >= 6 ? 'from-orange-400 to-yellow-400' : 'from-red-400 to-orange-400'
  return (
    <div>
      <div className="h-5 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 mb-1">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full progress-fill`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs font-bold text-gray-400">
        <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span>
      </div>
    </div>
  )
}

export default function BandEstimator() {
  const { profile } = useAuth()
  const [scores, setScores] = useState({ listening: 0, reading: 0, writing: 0, speaking: 0 })
  const [step, setStep] = useState('intro') // intro | assess | results
  const [currentSkill, setCurrentSkill] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [skillScores, setSkillScores] = useState({})

  const completed = profile?.completed_lessons || []
  const totalLessons = COURSE_DATA.reduce((s, sec) => s + sec.units.reduce((u, unit) => u + unit.lessons.length, 0), 0)

  function handleAnswer(band) {
    const skill = SKILLS[currentSkill]
    const questions = SELF_ASSESSMENT[skill]

    // Move forward
    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1)
    } else {
      // Calculate band for this skill (highest confirmed band)
      const newSkillScores = { ...skillScores, [skill]: band }
      setSkillScores(newSkillScores)
      if (currentSkill + 1 < SKILLS.length) {
        setCurrentSkill(s => s + 1)
        setCurrentQ(0)
      } else {
        // Calculate overall
        const avg = Object.values(newSkillScores).reduce((a, b) => a + b, 0) / 4
        setScores(newSkillScores)
        setStep('results')
      }
    }
  }

  const overallBand = scores && Object.values(scores).length === 4
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(1)
    : null

  const roundedBand = overallBand ? Math.round(overallBand * 2) / 2 : null

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Band Estimator 🎯</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">Get an honest estimate of your current IELTS band</p>

          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-white mb-5 shadow-lg">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="font-display text-2xl mb-2">Self-Assessment Quiz</h3>
            <p className="text-lime-100 font-semibold text-sm">
              Answer honestly about your current English level across all 4 skills. This gives you a baseline to track your progress.
            </p>
          </div>

          <div className="card mb-4">
            <h3 className="font-bold text-green-800 mb-3">📈 Your Progress So Far</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-lime-50 rounded-2xl">
                <div className="font-display text-2xl text-lime-600">{completed.length}</div>
                <div className="text-xs font-bold text-gray-500">Lessons done</div>
              </div>
              <div className="text-center p-3 bg-lime-50 rounded-2xl">
                <div className="font-display text-2xl text-green-600">{profile?.xp || 0}</div>
                <div className="text-xs font-bold text-gray-500">Total XP</div>
              </div>
            </div>
          </div>

          <button onClick={() => setStep('assess')} className="btn-primary w-full mb-3">
            Start Self-Assessment 🚀
          </button>

          <div className="card bg-gradient-to-br from-green-50 to-lime-50">
            <h3 className="font-bold text-green-800 mb-3">📋 IELTS Band Descriptors</h3>
            {[
              { b: '9', label: 'Expert User', desc: 'Full operational command. Appropriate, accurate and fluent.' },
              { b: '8', label: 'Very Good User', desc: 'Fully operational command with only occasional unsystematic inaccuracies.' },
              { b: '7', label: 'Good User', desc: 'Operational command despite occasional inaccuracies and misunderstandings.' },
              { b: '6', label: 'Competent User', desc: 'Generally effective command despite inaccuracies.' },
              { b: '5', label: 'Modest User', desc: 'Partial command; able to handle overall meaning in most situations.' },
            ].map(({ b, label, desc }) => (
              <div key={b} className="flex gap-3 mb-2 last:mb-0">
                <div className="w-8 h-8 bg-lime-400 rounded-xl flex items-center justify-center font-display text-lg text-green-900 shrink-0">{b}</div>
                <div>
                  <div className="font-bold text-green-800 text-sm">{label}</div>
                  <div className="text-xs text-green-500 font-semibold">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'assess') {
    const skill = SKILLS[currentSkill]
    const questions = SELF_ASSESSMENT[skill]
    const q = questions[currentQ]
    const progress = ((currentSkill * questions.length + currentQ) / (SKILLS.length * questions.length)) * 100

    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pb-6 pt-16">
        <Navbar />
        <div className="bg-white border-b-2 border-lime-200 px-4 py-3 sticky top-16 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800 text-sm">{SKILL_ICONS[skill]} {skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
            <span className="text-xs font-bold text-green-500">Q{currentQ + 1}/{questions.length}</span>
          </div>
          <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{SKILL_ICONS[skill]}</div>
            <h3 className="font-display text-xl text-green-800">How well does this describe you?</h3>
          </div>

          <div className="card mb-6 text-center">
            <p className="font-bold text-green-900 text-lg leading-relaxed">"{q.q}"</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Not yet', sub: "I can't do this yet", value: Math.max(1, q.band - 2), color: 'border-red-200 hover:border-red-300' },
              { label: 'Somewhat', sub: 'I struggle with this', value: Math.max(1, q.band - 1), color: 'border-orange-200 hover:border-orange-300' },
              { label: 'Mostly yes', sub: 'I can do this with effort', value: q.band, color: 'border-lime-300 hover:border-lime-400' },
              { label: 'Definitely', sub: 'This is easy for me', value: Math.min(9, q.band + 1), color: 'border-green-300 hover:border-green-400' },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full p-4 rounded-2xl border-2 bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${opt.color}`}
              >
                <div className="font-bold text-green-800">{opt.label}</div>
                <div className="text-xs text-green-500 font-semibold">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">📊</div>
            <h2 className="font-display text-3xl text-green-800">Your Estimated Band</h2>
          </div>

          {/* Big band score */}
          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-center text-white mb-5 shadow-lg">
            <div className="font-display text-8xl mb-1">{roundedBand}</div>
            <div className="font-bold text-lime-100 text-lg">Overall Band Score (estimated)</div>
            <div className="text-white/70 text-sm mt-1">Based on your self-assessment</div>
          </div>

          {/* Per-skill breakdown */}
          <div className="card mb-4">
            <h3 className="font-bold text-green-800 mb-4">Skill Breakdown</h3>
            {SKILLS.map(skill => (
              <div key={skill} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-green-800 text-sm">{SKILL_ICONS[skill]} {skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                  <span className="font-display text-xl text-lime-600">{scores[skill] || 5}</span>
                </div>
                <BandGauge band={scores[skill] || 5} />
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="card mb-4 bg-gradient-to-br from-green-50 to-lime-50">
            <h3 className="font-bold text-green-800 mb-3">🎯 Your Personalised Plan</h3>
            {SKILLS.map(skill => {
              const band = scores[skill] || 5
              const gap = 9 - band
              const priority = gap >= 3 ? '🔴 High priority' : gap >= 2 ? '🟡 Focus here' : '🟢 Maintain'
              const tips = {
                listening: band < 7 ? 'Practise with authentic content: BBC podcasts, TED talks. Focus on predicting answers.' : 'Focus on Section 3 & 4. Practise inferring meaning and attitude.',
                reading: band < 7 ? 'Practise T/F/NG and MCQ. Build vocabulary from context. Time yourself strictly.' : 'Work on heading matching and identifying writer\'s purpose. Read academic articles daily.',
                writing: band < 7 ? 'Master paragraph structure and linking words. Practise Task 2 essay plans daily.' : 'Focus on lexical sophistication and grammatical range. Aim for C2 vocabulary.',
                speaking: band < 7 ? 'Record yourself and listen back. Practise extending answers with Part 3-style questions.' : 'Work on abstract discussion and sophisticated vocabulary. Reduce hesitations.',
              }
              return (
                <div key={skill} className="mb-3 last:mb-0 border-b border-lime-200 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-green-800 text-sm">{SKILL_ICONS[skill]} {skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
                    <span className="text-xs font-bold">{priority}</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold">{tips[skill]}</p>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setStep('intro'); setCurrentSkill(0); setCurrentQ(0); setSkillScores({}) }} className="btn-secondary flex-1">
              Retake
            </button>
            <button onClick={() => window.history.back()} className="btn-primary flex-1">
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    )
  }
}
