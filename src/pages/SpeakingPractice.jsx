import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import SpeakingEvaluator from '../components/SpeakingEvaluator'
import { useProgress } from '../contexts/ProgressContext'
import { Mic, MicOff, Play, RotateCcw, ChevronDown, ChevronUp, Clock } from 'lucide-react'

const PART1_TOPICS = [
  {
    category: 'Hometown',
    questions: [
      'Where are you from?',
      'What do you like most about your hometown?',
      'Has your hometown changed much over the years?',
      'Would you like to continue living there in the future?',
    ]
  },
  {
    category: 'Work & Study',
    questions: [
      'Are you a student or do you work?',
      'What do you enjoy most about your studies/job?',
      'What are your plans for the future?',
      'Do you think your studies will be useful in the future?',
    ]
  },
  {
    category: 'Free Time',
    questions: [
      'What do you do in your free time?',
      'Do you prefer indoor or outdoor activities? Why?',
      'Has the way you spend your free time changed recently?',
      'Do you think it\'s important to have hobbies?',
    ]
  },
]

const PART2_CARDS = [
  {
    topic: 'Describe a book you have read',
    points: ['What it was about', 'When you read it', 'Why you chose to read it', 'And explain why it was important to you'],
    modelAnswer: `I'd like to talk about "The Alchemist" by Paulo Coelho, which I read about three years ago during my university holidays. I came across it after a friend enthusiastically recommended it, saying it had changed his perspective on life. The novel follows a young shepherd named Santiago who embarks on a journey to find treasure, though ultimately discovers that the real treasure lies within himself. What made this book particularly significant to me was its central message about pursuing your dreams regardless of obstacles. At the time, I was struggling with choosing my career path, and the book's philosophy — that the universe conspires to help those who follow their personal legend — gave me a great deal of confidence. The writing style is beautifully simple yet profoundly meaningful, and I found myself highlighting numerous passages. I've actually re-read it twice since then, which is rare for me. I would say it's a book that truly stays with you.`
  },
  {
    topic: 'Describe a memorable journey you have taken',
    points: ['Where you went', 'How you travelled', 'Who you went with', 'And explain why it was memorable'],
    modelAnswer: `I'd like to describe a train journey I took through the mountains about two years ago with my family. We travelled from our city to a remote hill station, a journey that took approximately eight hours by train. What made it particularly memorable was the breathtaking scenery — lush green valleys, cascading waterfalls, and mist-covered peaks that seemed to change with every bend in the track. We had booked window seats specifically for the views, and I remember all of us falling completely silent as the train wound its way through a particularly dramatic gorge. Beyond the scenery, it was one of the few occasions when our entire family had disconnected from technology and simply talked for hours. We shared stories, played cards, and had long conversations that I realised we rarely had in our busy daily lives. The journey itself became more meaningful than the destination, and I think of it fondly whenever life gets overwhelming.`
  },
  {
    topic: 'Describe a skill you would like to learn',
    points: ['What the skill is', 'Why you want to learn it', 'How you would learn it', 'And explain how it would benefit you'],
    modelAnswer: `The skill I'd most like to acquire is the ability to play the piano. I've been fascinated by piano music for as long as I can remember, particularly classical composers like Chopin and Debussy, whose pieces seem to convey emotions that words simply cannot express. My interest was reignited recently when I attended a live recital and was genuinely moved by the performance. In terms of how I'd learn, I would start with a qualified teacher for proper technique, as I understand that developing bad habits early is very difficult to correct later. I'd supplement this with online resources and daily practice of at least thirty minutes. The benefits would be substantial — research suggests that learning an instrument improves cognitive function, memory, and concentration. Beyond the practical benefits, I think there's something deeply satisfying about being able to create music, to take a series of notes and transform them into something that can move people emotionally. It would also give me a productive creative outlet during stressful periods.`
  },
]

const PART3_DISCUSSIONS = [
  {
    theme: 'Technology & Society',
    questions: [
      { q: 'How has technology changed the way people communicate?', band9tip: 'Discuss both improvements (speed, reach) and downsides (reduced depth, digital divide).' },
      { q: 'Do you think children today are too dependent on technology?', band9tip: 'Use hedging: "There\'s a strong case to be made that..." and acknowledge counterarguments.' },
      { q: 'How might technology change education in the future?', band9tip: 'Speculate using: "It seems plausible that...", "One can reasonably anticipate..."' },
    ]
  },
  {
    theme: 'Environment',
    questions: [
      { q: 'Who do you think is more responsible for protecting the environment — individuals or governments?', band9tip: 'Use "While... I would argue that..." to present a nuanced position.' },
      { q: 'Do you think economic development and environmental protection can coexist?', band9tip: 'Reference specific examples and use discourse markers: "Take, for instance..."' },
    ]
  },
  {
    theme: 'Education',
    questions: [
      { q: 'What qualities make a good teacher?', band9tip: 'Go beyond listing — analyse WHY each quality matters and give a concrete illustration.' },
      { q: 'Should university education be free for all students?', band9tip: 'Discuss multiple perspectives before giving your own view with clear reasoning.' },
    ]
  },
]

const BAND9_SPEAKING_TIPS = [
  { tip: 'Use discourse markers naturally', example: '"That\'s an interesting question... Well, I\'d say that..."', icon: '💬' },
  { tip: 'Extend answers in Part 1', example: 'Never give one-word answers. Add a reason and example.', icon: '📢' },
  { tip: 'Self-correct confidently', example: '"I mean... what I\'m trying to say is..."', icon: '✏️' },
  { tip: 'Use a range of tenses', example: 'Mix present, past, and hypothetical structures.', icon: '⏰' },
  { tip: 'Paraphrase the question', example: '"So you\'re asking about... I think that..."', icon: '🔄' },
  { tip: 'Show lexical range', example: 'Replace simple words: "good" → "beneficial/advantageous/rewarding"', icon: '📚' },
]

const USEFUL_PHRASES = {
  'Starting your answer': [
    "That's a really interesting question...",
    "Well, to be honest...",
    "Off the top of my head, I'd say...",
    "I've never really thought about that before, but...",
  ],
  'Giving opinions': [
    "From my perspective...",
    "As far as I'm concerned...",
    "I'm firmly of the opinion that...",
    "I tend to think that...",
  ],
  'Adding information': [
    "Not only that, but also...",
    "What's more,...",
    "On top of that,...",
    "In addition to this,...",
  ],
  'Speculating': [
    "I would imagine that...",
    "It seems reasonable to suggest that...",
    "There's a strong possibility that...",
    "It strikes me that...",
  ],
  'Hesitating (naturally)': [
    "Let me think about that for a moment...",
    "How can I put this...",
    "It's on the tip of my tongue...",
    "That's a thought-provoking question...",
  ],
}

export default function SpeakingPractice() {
  const [activeTab, setActiveTab] = useState('Part 1')
  const [recording, setRecording] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [currentTopic, setCurrentTopic] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [prepTime, setPrepTime] = useState(null)
  const [speakTime, setSpeakTime] = useState(null)
  const [prepRunning, setPrepRunning] = useState(false)
  const [speakRunning, setSpeakRunning] = useState(false)
  const [expandedPhrase, setExpandedPhrase] = useState(null)
  const [expandedPart3, setExpandedPart3] = useState(0)
  const timerRef = useRef(null)
  const { awardXP } = useProgress()
  const [evalPart, setEvalPart] = useState(1)
  const [evalQ, setEvalQ] = useState('Do you prefer mornings or evenings? Why?')

  const TABS = ['Part 1', 'Part 2', 'Part 3', 'AI Evaluate', 'Phrases', 'Tips']

  function startPrepTimer() {
    setPrepTime(60)
    setPrepRunning(true)
    timerRef.current = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPrepRunning(false)
          startSpeakTimer()
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function startSpeakTimer() {
    setSpeakTime(120)
    setSpeakRunning(true)
    timerRef.current = setInterval(() => {
      setSpeakTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setSpeakRunning(false)
          awardXP(20, 'Speaking practice')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function resetPart2() {
    clearInterval(timerRef.current)
    setPrepTime(null)
    setSpeakTime(null)
    setPrepRunning(false)
    setSpeakRunning(false)
    setShowAnswer(false)
  }

  const card = PART2_CARDS[currentTopic]

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h2 className="font-display text-3xl text-green-800 mb-1">Speaking Practice 🗣️</h2>
        <p className="text-green-500 font-semibold text-sm mb-4">Practise all 3 parts of the IELTS Speaking test</p>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${activeTab === t ? 'bg-lime-400 text-green-900 shadow' : 'bg-white text-green-600 border-2 border-lime-100 hover:border-lime-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── PART 1 ── */}
        {activeTab === 'Part 1' && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-blue-50 to-lime-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">ℹ️</span>
                <h3 className="font-bold text-green-800">About Part 1</h3>
              </div>
              <p className="text-sm text-green-700 font-semibold">4–5 minutes. The examiner asks familiar questions about yourself, your home, work, studies, and everyday topics. Aim for 2–3 sentence answers.</p>
            </div>

            {PART1_TOPICS.map((topic, ti) => (
              <div key={ti} className="card">
                <h3 className="font-display text-lg text-green-800 mb-3">📌 {topic.category}</h3>
                <div className="space-y-3">
                  {topic.questions.map((q, qi) => (
                    <div key={qi} className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-4">
                      <p className="font-bold text-green-900 text-sm mb-2">❓ {q}</p>
                      <div className="bg-white rounded-xl p-3 border border-lime-200">
                        <p className="text-xs font-bold text-lime-600 mb-1">💡 Band 9 strategy:</p>
                        <p className="text-xs text-green-700 font-semibold">
                          {qi === 0 ? 'Start with a direct answer, then add detail: location + what makes it special.' :
                           qi === 1 ? 'Name 1–2 specific things. Use because/since to explain. Add a personal example.' :
                           qi === 2 ? 'Compare past vs present using: "used to", "whereas now", "in contrast".' :
                           'Give a clear position + reason + brief expansion. Show you\'ve thought about it.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PART 2 ── */}
        {activeTab === 'Part 2' && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-purple-50 to-lime-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⏱️</span>
                <h3 className="font-bold text-green-800">About Part 2</h3>
              </div>
              <p className="text-sm text-green-700 font-semibold">You get a cue card with a topic. You have 1 minute to prepare, then speak for 1–2 minutes without interruption.</p>
            </div>

            {/* Topic Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PART2_CARDS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentTopic(i); resetPart2() }}
                  className={`shrink-0 px-3 py-2 rounded-xl font-bold text-xs transition-all border-2
                    ${currentTopic === i ? 'bg-lime-400 border-lime-500 text-green-900' : 'bg-white border-lime-200 text-green-600'}`}
                >
                  Topic {i + 1}
                </button>
              ))}
            </div>

            {/* Cue Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-5 text-white shadow-lg">
              <div className="text-xs font-bold text-lime-300 mb-2 uppercase tracking-widest">📋 Cue Card</div>
              <h3 className="font-display text-xl mb-4">{card.topic}</h3>
              <p className="text-lime-200 text-xs font-bold mb-2">You should say:</p>
              {card.points.map((p, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-lime-400 font-bold text-sm shrink-0">•</span>
                  <span className="text-sm font-semibold text-white/90">{p}</span>
                </div>
              ))}
            </div>

            {/* Timers */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`card text-center ${prepRunning ? 'border-yellow-400 bg-yellow-50' : prepTime === 0 ? 'border-lime-400 bg-lime-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">PREP TIME</div>
                <div className={`font-display text-4xl ${prepRunning ? 'text-yellow-600' : 'text-green-700'}`}>
                  {prepTime !== null ? `${prepTime}s` : '60s'}
                </div>
                {prepTime === 0 && <div className="text-xs text-lime-600 font-bold">Now speak!</div>}
              </div>
              <div className={`card text-center ${speakRunning ? 'border-lime-400 bg-lime-50' : speakTime === 0 ? 'border-green-400 bg-green-50' : ''}`}>
                <div className="text-xs font-bold text-gray-500 mb-1">SPEAK TIME</div>
                <div className={`font-display text-4xl ${speakRunning ? 'text-lime-600' : 'text-green-700'}`}>
                  {speakTime !== null ? `${Math.floor(speakTime / 60)}:${String(speakTime % 60).padStart(2, '0')}` : '2:00'}
                </div>
                {speakTime === 0 && <div className="text-xs text-green-600 font-bold">Done! +20 XP 🎉</div>}
              </div>
            </div>

            <div className="flex gap-3">
              {!prepRunning && !speakRunning && (
                <button
                  onClick={startPrepTimer}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" /> Start (1 min prep)
                </button>
              )}
              <button onClick={resetPart2} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            {/* Model Answer */}
            <div className="card">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-bold text-green-800">📖 Band 9 Model Answer</span>
                {showAnswer ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
              </button>
              {showAnswer && (
                <div className="mt-3 bg-lime-50 rounded-2xl p-4">
                  <p className="text-sm text-green-800 font-semibold leading-relaxed">{card.modelAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PART 3 ── */}
        {activeTab === 'Part 3' && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-orange-50 to-lime-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-green-800">About Part 3</h3>
              </div>
              <p className="text-sm text-green-700 font-semibold">4–5 minutes. Abstract discussion questions linked to the Part 2 topic. You need to analyse, speculate, and argue — this is where Band 7+ is decided.</p>
            </div>

            {PART3_DISCUSSIONS.map((section, si) => (
              <div key={si} className="card">
                <button
                  onClick={() => setExpandedPart3(expandedPart3 === si ? -1 : si)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="font-display text-lg text-green-800">{section.theme}</h3>
                  {expandedPart3 === si ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
                </button>

                {expandedPart3 === si && (
                  <div className="mt-3 space-y-3">
                    {section.questions.map((item, qi) => (
                      <div key={qi} className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-4">
                        <p className="font-bold text-green-900 text-sm mb-2">❓ {item.q}</p>
                        <div className="bg-white rounded-xl p-3 border border-lime-200">
                          <p className="text-xs font-bold text-lime-600 mb-1">🎯 Band 9 tip:</p>
                          <p className="text-xs text-green-700 font-semibold">{item.band9tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── AI EVALUATE ── */}
        {activeTab === 'AI Evaluate' && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-br from-pink-50 to-rose-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-green-800">AI Speaking Evaluator</h3>
              </div>
              <p className="text-sm text-green-700 font-semibold">
                Speak your answer using Chrome's speech recognition, then get AI examiner feedback on your vocabulary, grammar, fluency, and pronunciation.
              </p>
            </div>

            {/* Part selector */}
            <div className="flex gap-2">
              {[1,2,3].map(p => (
                <button key={p} onClick={() => setEvalPart(p)}
                  className={`flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all border-2 ${evalPart === p ? 'bg-pink-400 border-pink-500 text-white' : 'bg-white border-pink-200 text-pink-600 hover:border-pink-300'}`}>
                  Part {p}
                </button>
              ))}
            </div>

            {/* Question selector */}
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2">Select a question to answer:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {evalPart === 1 && PART1_TOPICS.flatMap(t => t.questions).slice(0,8).map((q, i) => (
                  <button key={i} onClick={() => setEvalQ(q)}
                    className={`w-full text-left p-3 rounded-xl text-sm font-semibold border-2 transition-all ${evalQ === q ? 'bg-pink-50 border-pink-400 text-pink-900' : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'}`}>
                    {q}
                  </button>
                ))}
                {evalPart === 2 && PART2_CARDS.map((card, i) => (
                  <button key={i} onClick={() => setEvalQ(card.topic)}
                    className={`w-full text-left p-3 rounded-xl text-sm font-semibold border-2 transition-all ${evalQ === card.topic ? 'bg-pink-50 border-pink-400 text-pink-900' : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'}`}>
                    {card.topic}
                  </button>
                ))}
                {evalPart === 3 && [
                  'Do you think social media has changed the way people form relationships?',
                  'Should governments invest more in public transport?',
                  'How has technology changed the way people work?',
                  'Do you think environmental problems will get better or worse in the future?',
                  'Is it important for young people to learn a second language?',
                ].map((q, i) => (
                  <button key={i} onClick={() => setEvalQ(q)}
                    className={`w-full text-left p-3 rounded-xl text-sm font-semibold border-2 transition-all ${evalQ === q ? 'bg-pink-50 border-pink-400 text-pink-900' : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'}`}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {evalQ && (
              <SpeakingEvaluator
                key={evalQ}
                question={evalQ}
                part={evalPart}
                cueCard={evalPart === 2 ? evalQ : null}
              />
            )}
          </div>
        )}

        {/* ── PHRASES ── */}}
        {activeTab === 'Phrases' && (
          <div className="space-y-3">
            <div className="card bg-gradient-to-br from-green-50 to-lime-50">
              <p className="text-sm font-semibold text-green-700">These phrases help you sound natural and fluent. Practise them until they feel automatic — don't memorise them rigidly, use them flexibly.</p>
            </div>
            {Object.entries(USEFUL_PHRASES).map(([cat, phrases]) => (
              <div key={cat} className="card">
                <button
                  onClick={() => setExpandedPhrase(expandedPhrase === cat ? null : cat)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="font-bold text-green-800">{cat}</h3>
                  {expandedPhrase === cat ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
                </button>
                {expandedPhrase === cat && (
                  <div className="mt-3 space-y-2">
                    {phrases.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-lime-50 rounded-xl p-3">
                        <span className="text-lg">💬</span>
                        <span className="text-sm font-semibold text-green-800 italic">"{p}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TIPS ── */}
        {activeTab === 'Tips' && (
          <div className="space-y-3">
            {BAND9_SPEAKING_TIPS.map((item, i) => (
              <div key={i} className="card flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-green-800">{item.tip}</div>
                  <div className="text-sm text-green-500 font-semibold mt-0.5">{item.example}</div>
                </div>
              </div>
            ))}

            {/* Pronunciation section */}
            <div className="card bg-gradient-to-br from-green-50 to-lime-50">
              <h3 className="font-display text-xl text-green-800 mb-3">🎙️ Pronunciation Tips</h3>
              {[
                { title: 'Word stress', detail: 'Stress content words (nouns, verbs, adjectives): "The PRICE of FOOD has RISEN significantly."' },
                { title: 'Connected speech', detail: 'Link words: "a lot of" → "a lotta", "I am going to" → "I\'m gonna" (in natural speech).' },
                { title: 'Intonation', detail: 'Rise on lists until the last item: "I like reading↑, cooking↑, and travel↓."' },
                { title: 'Pace & pausing', detail: 'Speak at a natural pace. Brief pauses between ideas show control, not hesitation.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 mb-3 last:mb-0">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                  <div>
                    <div className="font-bold text-green-800 text-sm">{item.title}</div>
                    <div className="text-xs text-green-600 font-semibold mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Common mistakes */}
            <div className="card">
              <h3 className="font-display text-xl text-green-800 mb-3">⚠️ Common Mistakes</h3>
              {[
                { mistake: 'Memorising full answers', fix: 'Sounds unnatural. Learn language patterns, not scripts.' },
                { mistake: 'Answering too briefly in Part 1', fix: 'Always expand: answer + reason + example.' },
                { mistake: 'Using basic vocabulary throughout', fix: 'Aim to use 2–3 sophisticated words per answer.' },
                { mistake: 'Stopping after one sentence in Part 3', fix: 'Develop ideas: state → explain → example → conclusion.' },
                { mistake: 'Silences mid-answer', fix: 'Use fillers: "That\'s interesting... let me think..." rather than silence.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 mb-3 last:mb-0">
                  <div className="text-red-400 font-bold text-lg shrink-0">✗</div>
                  <div>
                    <div className="font-bold text-red-700 text-sm">{item.mistake}</div>
                    <div className="text-xs text-green-600 font-semibold mt-0.5 flex items-start gap-1">
                      <span className="text-lime-500">✓</span> {item.fix}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
