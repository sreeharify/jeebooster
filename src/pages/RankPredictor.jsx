import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { COURSE_DATA } from '../data/courseData'

const SELF_ASSESSMENT = {
  physics: [
    { q: 'I can solve basic problems on Kinematics and Laws of Motion.', level: 'Basic' },
    { q: 'I am comfortable with Rotational Mechanics and Thermodynamics.', level: 'Intermediate' },
    { q: 'I can solve complex problems involving Electromagnetism and Optics.', level: 'Advanced' },
    { q: 'I have a strong grasp of Modern Physics and Nuclear Physics.', level: 'Expert' },
  ],
  chemistry: [
    { q: 'I understand Periodic Table trends and Chemical Bonding.', level: 'Basic' },
    { q: 'I can solve problems on Stoichiometry and Chemical Equilibrium.', level: 'Intermediate' },
    { q: 'I am comfortable with Organic Reactions and Coordination Compounds.', level: 'Advanced' },
    { q: 'I have mastered Physical Chemistry and Spectroscopy.', level: 'Expert' },
  ],
  mathematics: [
    { q: 'I can solve basic Algebra and Trigonometry problems.', level: 'Basic' },
    { q: 'I am comfortable with Coordinate Geometry and Calculus basics.', level: 'Intermediate' },
    { q: 'I can solve complex Integral Calculus and Vector Algebra.', level: 'Advanced' },
    { q: 'I have a strong command over Probability and Complex Numbers.', level: 'Expert' },
  ],
}

const SUBJECTS = ['physics', 'chemistry', 'mathematics']
const SUBJECT_ICONS = { physics: '⚛️', chemistry: '🧪', mathematics: '📐' }

export default function RankPredictor() {
  const { profile } = useAuth()
  const [step, setStep] = useState('intro') // intro | assess | results
  const [currentSub, setCurrentSub] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [scores, setScores] = useState({ physics: 0, chemistry: 0, mathematics: 0 })

  const completed = profile?.completed_lessons || []

  function handleAnswer(val) {
    const sub = SUBJECTS[currentSub]
    const questions = SELF_ASSESSMENT[sub]

    if (currentQ + 1 < questions.length) {
      setCurrentQ(q => q + 1)
      setScores(prev => ({ ...prev, [sub]: prev[sub] + val }))
    } else {
      const finalScores = { ...scores, [sub]: scores[sub] + val }
      setScores(finalScores)
      if (currentSub + 1 < SUBJECTS.length) {
        setCurrentSub(s => s + 1)
        setCurrentQ(0)
      } else {
        setStep('results')
      }
    }
  }

  // Very mock AIR prediction logic
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const predictedAIR = Math.max(1, Math.round(1000000 * Math.exp(-0.1 * totalScore)))

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Rank Predictor 📊</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">Predict your JEE All India Rank (AIR)</p>

          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-white mb-5 shadow-lg">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="font-display text-2xl mb-2">Confidence Assessment</h3>
            <p className="text-lime-100 font-semibold text-sm">
              Answer the following questions about your preparation level in Physics, Chemistry, and Mathematics to get a predicted AIR.
            </p>
          </div>

          <button onClick={() => setStep('assess')} className="btn-primary w-full mb-3">
            Start Prediction 🚀
          </button>
        </div>
      </div>
    )
  }

  if (step === 'assess') {
    const sub = SUBJECTS[currentSub]
    const questions = SELF_ASSESSMENT[sub]
    const q = questions[currentQ]
    const progress = ((currentSub * questions.length + currentQ) / (SUBJECTS.length * questions.length)) * 100

    return (
      <div className="min-h-screen bg-lime-50 flex flex-col pb-6 pt-16">
        <Navbar />
        <div className="bg-white border-b-2 border-lime-200 px-4 py-3 sticky top-16 z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-green-800 text-sm">{SUBJECT_ICONS[sub]} {sub.toUpperCase()}</span>
            <span className="text-xs font-bold text-green-500">Q{currentQ + 1}/{questions.length}</span>
          </div>
          <div className="h-2.5 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{SUBJECT_ICONS[sub]}</div>
            <h3 className="font-display text-xl text-green-800">Assessing your {sub} prep...</h3>
          </div>

          <div className="card mb-6 text-center">
            <p className="font-bold text-green-900 text-lg leading-relaxed">{q.q}</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Not Confident', value: 1, color: 'border-red-200' },
              { label: 'Somewhat Confident', value: 2, color: 'border-orange-200' },
              { label: 'Very Confident', value: 3, color: 'border-lime-300' },
              { label: 'Maverick', value: 4, color: 'border-green-300' },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full p-4 rounded-2xl border-2 bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${opt.color}`}
              >
                <div className="font-bold text-green-800">{opt.label}</div>
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
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="font-display text-3xl text-green-800">Predicted JEE AIR</h2>
          </div>

          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-center text-white mb-5 shadow-lg">
            <div className="font-display text-6xl mb-1">#{predictedAIR.toLocaleString()}</div>
            <div className="font-bold text-lime-100 text-lg">Predicted All India Rank</div>
            <div className="text-white/70 text-sm mt-1">Keep studying to improve your rank!</div>
          </div>

          <div className="card mb-4">
            <h3 className="font-bold text-green-800 mb-4">Subject-wise Confidence</h3>
            {SUBJECTS.map(sub => (
              <div key={sub} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-green-800 text-sm">{SUBJECT_ICONS[sub]} {sub.toUpperCase()}</span>
                  <span className="text-lime-600 font-bold">{scores[sub]} / 16</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-400 rounded-full" style={{ width: `${(scores[sub] / 16) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('intro')} className="btn-secondary flex-1">
              Retake
            </button>
            <button onClick={() => window.history.back()} className="btn-primary flex-1">
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }
}
