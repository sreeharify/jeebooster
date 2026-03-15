import { useState } from 'react'
import Navbar from '../components/Navbar'
import { WRITING_TEMPLATES } from '../data/courseData'
import { useProgress } from '../contexts/ProgressContext'
import { Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

const ESSAY_TOPICS = [
  { id: 1, type: 'opinion', title: 'Technology in Education', prompt: 'Some people believe that technology has made education more accessible and effective. Others argue it has created new problems. To what extent do you agree or disagree?' },
  { id: 2, type: 'discussion', title: 'Urban vs Rural Life', prompt: 'Some people prefer to live in cities, while others prefer rural areas. Discuss both views and give your own opinion.' },
  { id: 3, type: 'problem_solution', title: 'Climate Change', prompt: 'Climate change is the most pressing issue of our time. What problems does it cause, and what solutions can individuals and governments implement?' },
  { id: 4, type: 'adv_disadv', title: 'Globalisation', prompt: 'Globalisation has brought many benefits but also significant challenges. Discuss the advantages and disadvantages of globalisation.' },
  { id: 5, type: 'opinion', title: 'Social Media', prompt: 'Social media has fundamentally changed the way people communicate and share information. Do the benefits outweigh the drawbacks?' },
]

const TASK1_TOPICS = [
  { id: 1, title: 'Bar Chart — Energy Sources', prompt: 'The bar chart shows the percentage of electricity generated from different energy sources in four countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.' },
  { id: 2, title: 'Line Graph — Internet Users', prompt: 'The line graph illustrates the number of internet users (in millions) in five regions between 2000 and 2020. Summarise the information by selecting and reporting the main features.' },
  { id: 3, title: 'Process Diagram — Water Treatment', prompt: 'The diagram below shows the process by which water is purified and supplied to homes. Summarise the information by selecting and reporting the main features.' },
]

const BAND_CRITERIA = [
  { name: 'Task Achievement', desc: 'Addresses all parts of the task, presents a clear position, ideas are relevant and developed', icon: '🎯' },
  { name: 'Coherence & Cohesion', desc: 'Information is logically organised, paragraphing is clear, cohesive devices are used effectively', icon: '🔗' },
  { name: 'Lexical Resource', desc: 'Wide range of vocabulary used flexibly, accurate word choice and collocation', icon: '📚' },
  { name: 'Grammatical Range & Accuracy', desc: 'Wide range of structures used accurately, only rare errors', icon: '⚡' },
]

const USEFUL_PHRASES = {
  introduction: ['It is widely acknowledged that...', 'In recent years, there has been considerable debate about...', 'The question of whether... is one that merits careful consideration.'],
  opinion: ['I firmly believe that...', 'It is my contention that...', 'From my perspective...'],
  adding: ['Furthermore,', 'Moreover,', 'In addition,', 'Not only that, but also...'],
  contrasting: ['However,', 'Nevertheless,', 'On the other hand,', 'Despite this,', 'Conversely,'],
  cause: ['As a result,', 'Consequently,', 'This leads to...', 'Due to this,'],
  example: ['For instance,', 'For example,', 'To illustrate this point,', 'A prime example of this is...'],
  conclusion: ['In conclusion,', 'To summarise,', 'Taking everything into consideration,', 'In light of the above,'],
}

export default function WritingPractice() {
  const [tab, setTab] = useState('Task 2')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [essayText, setEssayText] = useState('')
  const [showTemplate, setShowTemplate] = useState(false)
  const [showPhrases, setShowPhrases] = useState(false)
  const [showCriteria, setShowCriteria] = useState(true)
  const [copied, setCopied] = useState(null)
  const { awardXP } = useProgress()

  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length
  const minWords = tab === 'Task 2' ? 250 : 150
  const isLongEnough = wordCount >= minWords

  function copyPhrase(phrase) {
    navigator.clipboard.writeText(phrase)
    setCopied(phrase)
    setTimeout(() => setCopied(null), 1500)
  }

  async function handleSubmit() {
    if (isLongEnough) {
      await awardXP(40, 'Writing submitted')
    }
  }

  const topics = tab === 'Task 2' ? ESSAY_TOPICS : TASK1_TOPICS
  const template = tab === 'Task 2' ? WRITING_TEMPLATES.opinion_essay : WRITING_TEMPLATES.task1_graph

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <h2 className="font-display text-3xl text-green-800">Writing Practice ✍️</h2>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border-2 border-lime-200">
          {['Task 1', 'Task 2'].map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedTopic(null); setEssayText('') }}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${tab === t ? 'bg-lime-400 text-green-900 shadow' : 'text-green-600 hover:bg-lime-50'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Band Criteria */}
        <div className="card">
          <button onClick={() => setShowCriteria(!showCriteria)} className="w-full flex items-center justify-between">
            <h3 className="font-display text-lg text-green-800">📊 Band 9 Criteria</h3>
            {showCriteria ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
          </button>
          {showCriteria && (
            <div className="mt-3 space-y-2">
              {BAND_CRITERIA.map(c => (
                <div key={c.name} className="flex gap-3 p-2 bg-lime-50 rounded-xl">
                  <span className="text-xl shrink-0">{c.icon}</span>
                  <div>
                    <div className="font-bold text-green-800 text-sm">{c.name}</div>
                    <div className="text-xs text-green-500 font-semibold">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topic Selection */}
        <div>
          <h3 className="font-display text-xl text-green-800 mb-3">Choose a Topic</h3>
          <div className="space-y-2">
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selectedTopic?.id === t.id ? 'border-lime-400 bg-lime-50' : 'border-gray-200 bg-white hover:border-lime-200'}`}
              >
                <div className="font-bold text-green-800 text-sm">{t.title}</div>
                <div className="text-xs text-green-500 font-semibold mt-0.5 capitalize">{t.type?.replace('_', '-')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Writing Area */}
        {selectedTopic && (
          <>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="text-xs font-bold text-blue-600 mb-1 uppercase">📋 Task Prompt</div>
              <p className="text-sm text-blue-900 font-semibold leading-relaxed">{selectedTopic.prompt}</p>
            </div>

            {/* Template */}
            <div className="card">
              <button onClick={() => setShowTemplate(!showTemplate)} className="w-full flex items-center justify-between">
                <h3 className="font-display text-lg text-green-800">📝 Essay Template</h3>
                {showTemplate ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
              </button>
              {showTemplate && (
                <div className="mt-3 space-y-3">
                  {template.structure.map((part, i) => (
                    <div key={i} className="bg-green-50 rounded-xl p-3">
                      <div className="font-bold text-green-700 text-xs mb-1 uppercase">{part.part}</div>
                      <p className="text-sm text-green-800 italic">{part.template}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Useful Phrases */}
            <div className="card">
              <button onClick={() => setShowPhrases(!showPhrases)} className="w-full flex items-center justify-between">
                <h3 className="font-display text-lg text-green-800">💬 Useful Phrases</h3>
                {showPhrases ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
              </button>
              {showPhrases && (
                <div className="mt-3 space-y-3">
                  {Object.entries(USEFUL_PHRASES).map(([cat, phrases]) => (
                    <div key={cat}>
                      <div className="text-xs font-bold text-green-600 uppercase mb-1">{cat}</div>
                      <div className="flex flex-wrap gap-2">
                        {phrases.map(phrase => (
                          <button key={phrase} onClick={() => copyPhrase(phrase)}
                            className={`text-xs px-3 py-1.5 rounded-xl border-2 font-semibold transition-all flex items-center gap-1
                              ${copied === phrase ? 'bg-lime-200 border-lime-400 text-green-800' : 'bg-white border-gray-200 text-gray-700 hover:border-lime-300'}`}>
                            {copied === phrase ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {phrase}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Text Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg text-green-800">Your Response</h3>
                <div className={`text-sm font-bold px-3 py-1 rounded-full border-2 ${isLongEnough ? 'bg-lime-100 border-lime-400 text-lime-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                  {wordCount} / {minWords}+ words
                </div>
              </div>
              <textarea
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                className="w-full h-64 input-field resize-none leading-relaxed"
                placeholder={`Start writing your ${tab} response here... 

Remember to:
${tab === 'Task 2' ? '• Write at least 250 words\n• Have a clear introduction\n• Include 2-3 body paragraphs\n• Write a conclusion' : '• Write at least 150 words\n• Include an overview\n• Describe key trends\n• Make comparisons'}`}
              />
            </div>

            {/* Word count bar */}
            <div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className={`h-full rounded-full progress-fill ${isLongEnough ? 'bg-lime-400' : 'bg-orange-400'}`}
                  style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }} />
              </div>
              {!isLongEnough && (
                <p className="text-xs text-orange-500 font-semibold mt-1">
                  ✏️ {minWords - wordCount} more words needed
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isLongEnough}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLongEnough ? '📤 Submit for Review (+40 XP)' : `📝 Keep writing (${minWords - wordCount} words left)`}
            </button>
          </>
        )}

        {/* Band 9 Writing Tips */}
        <div className="card bg-gradient-to-br from-green-50 to-lime-50">
          <h3 className="font-display text-xl text-green-800 mb-3">🌟 Band 9 Writing Tips</h3>
          {[
            { tip: 'Answer ALL parts of the question', detail: 'Read the prompt carefully — missing part of the question drops your Task Achievement score.' },
            { tip: 'Vary your vocabulary', detail: 'Avoid repeating the same words. Use synonyms and paraphrases throughout.' },
            { tip: 'Use complex sentences', detail: 'Mix sentence types — simple, compound, and complex — to show grammatical range.' },
            { tip: 'Paragraph clearly', detail: 'Each paragraph should have one main idea with supporting examples.' },
            { tip: 'Avoid memorized phrases', detail: 'Examiners can identify overused templates. Be natural and genuine.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 mb-3 last:mb-0">
              <div className="w-6 h-6 bg-lime-400 text-green-900 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
              <div>
                <div className="font-bold text-green-800 text-sm">{item.tip}</div>
                <div className="text-xs text-green-500 font-semibold">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
