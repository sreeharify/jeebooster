import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { X, Heart, Zap, ChevronRight, BookOpen, Lightbulb, RotateCcw } from 'lucide-react'
import { COURSE_DATA } from '../data/courseData'
import Confetti from 'react-confetti'

// ─── Find lesson in course tree ─────────────────────────────
function findLesson(id) {
  for (const section of COURSE_DATA) {
    for (const unit of section.units) {
      const lesson = unit.lessons.find(l => l.id === id)
      if (lesson) return { lesson, unit, section }
    }
  }
  return null
}

// ─── Band level helper ───────────────────────────────────────
function bandLabel(b) {
  if (b <= 6) return { label: 'Band 6 — Beginner', color: 'bg-orange-400', emoji: '🌱' }
  if (b === 7) return { label: 'Band 7 — Intermediate', color: 'bg-yellow-400', emoji: '🌿' }
  if (b === 8) return { label: 'Band 8 — Advanced', color: 'bg-green-500', emoji: '🌳' }
  return { label: 'Band 9 — Expert', color: 'bg-lime-500', emoji: '🏆' }
}

// ─── All lesson content ──────────────────────────────────────
function buildSlides(lesson) {
  const type = lesson.type
  const slides = []

  // ── INTRO CARD (always first) ──
  slides.push({
    kind: 'intro',
    title: lesson.title,
    icon: getTypeIcon(type),
    what: getWhatYouLearn(lesson),
    tip: getQuickTip(type),
  })

  // ── EXPLAINER CARDS then EXERCISES ──
  const content = getContent(lesson)
  slides.push(...content)

  return slides
}

function getTypeIcon(type) {
  const m = { vocab:'📝', grammar:'⚡', reading:'👁️', quiz:'❓', fill:'✏️',
               writing:'✍️', speaking:'🗣️', test:'📋', mock:'🏅',
               listen:'🎧', info:'📖', match:'🔗', interactive:'🎮' }
  return m[type] || '📚'
}

function getWhatYouLearn(lesson) {
  const m = {
    vocab:    'Learn key academic words used in IELTS Band 7–9 answers.',
    grammar:  'Practise a grammar structure that examiners reward at Band 7+.',
    reading:  'Build strategies for reading passages quickly and accurately.',
    quiz:     'Test your IELTS knowledge with multiple-choice questions.',
    fill:     'Fill in the blanks to practise collocations and word choice.',
    writing:  'Explore writing techniques and sentence structures.',
    speaking: 'Practise speaking strategies for Part 1, 2, and 3.',
    test:     'Mini test covering key exam skills.',
    mock:     'Full-length timed practice test.',
    listen:   'Sharpen your listening with audio-style questions.',
    grammar:  'Master a grammar structure for Band 8–9.',
  }
  return m[lesson.type] || `Build skills for ${lesson.title}.`
}

function getQuickTip(type) {
  const m = {
    vocab:   '💡 Learn words in context — always read the example sentence!',
    grammar: '💡 Try to use the new structure in your own sentence after each question.',
    reading: '💡 Skim the passage first (30 sec) to get the big picture before answering.',
    quiz:    '💡 Read ALL options before choosing — the best answer is always there.',
    writing: '💡 Quality over quantity. One well-developed idea beats three vague ones.',
    speaking:'💡 Extend every answer: point → reason → example.',
    test:    '💡 Don\'t spend too long on one question. Move on and come back.',
  }
  return m[type] || '💡 Take your time and read carefully before answering.'
}

// ─── Generate slides per lesson type ────────────────────────
function getContent(lesson) {
  const type = lesson.type
  const slides = []

  if (type === 'vocab') {
    // Explainer
    slides.push({
      kind: 'explainer',
      band: 6,
      title: '📚 Why Vocabulary Matters',
      body: `In IELTS, using a wide range of vocabulary is worth 25% of your Writing and Speaking score (called "Lexical Resource"). \n\nBand 6 uses everyday words correctly.\nBand 7 uses some less common words.\nBand 8–9 uses sophisticated vocabulary naturally — not memorised, but genuinely flexible.`,
      highlight: 'The goal is NOT to memorise long lists. It\'s to understand words deeply enough to use them naturally.',
    })

    // Word cards (Band 6 → 9 progression)
    const words = [
      { word: 'mitigate', meaning: 'to reduce the severity of something', example: 'Governments must mitigate the effects of climate change.', band: 6, wrongMeaning: 'to make something worse' },
      { word: 'ubiquitous', meaning: 'present or found everywhere', example: 'Smartphones have become ubiquitous in modern society.', band: 7, wrongMeaning: 'very rare and unusual' },
      { word: 'exacerbate', meaning: 'to make a problem worse', example: 'Poverty can exacerbate health issues.', band: 7, wrongMeaning: 'to solve a problem gradually' },
      { word: 'proliferate', meaning: 'to increase rapidly in number', example: 'Fast food chains have proliferated across the country.', band: 8, wrongMeaning: 'to decrease steadily' },
      { word: 'substantiate', meaning: 'to provide evidence to support a claim', example: 'The researcher substantiated her theory with new data.', band: 9, wrongMeaning: 'to question or challenge' },
    ]

    words.forEach(w => {
      // Flashcard
      slides.push({ kind: 'flashcard', ...w })
      // MCQ
      const distractors = words.filter(x => x.word !== w.word).slice(0, 3).map(x => x.meaning)
      const options = shuffle([w.meaning, ...distractors])
      slides.push({
        kind: 'mcq',
        band: w.band,
        question: `What does "${w.word}" mean?`,
        options,
        correct: w.meaning,
        explanation: `✅ "${w.word}" means "${w.meaning}". \n\nExample: "${w.example}"`,
        hint: `Think about the example sentence to help you guess.`,
      })
    })

    // Correction exercise
    slides.push({
      kind: 'error_correction',
      band: 7,
      title: 'Spot the Mistake!',
      instruction: 'One word is used incorrectly. Which sentence has a vocabulary error?',
      sentences: [
        { text: 'The new policy will mitigate the risks of flooding.', correct: true },
        { text: 'Stress can exacerbate your health in a positive way.', correct: false, explanation: '"Exacerbate" means to make WORSE — it cannot be used with "in a positive way".' },
        { text: 'Mobile technology has become ubiquitous worldwide.', correct: true },
      ],
    })
  }

  // ─── GRAMMAR ────────────────────────────────────────────────
  if (type === 'grammar') {
    slides.push({
      kind: 'explainer',
      band: 6,
      title: '⚡ Grammar for Band 9',
      body: `IELTS examiners look for "Grammatical Range and Accuracy" — worth 25% of your score.\n\nBand 6: Uses basic sentence structures, some errors.\nBand 7: Uses complex sentences, minor errors.\nBand 8: Wide range of structures, rare errors.\nBand 9: Full range, near-perfect accuracy.`,
      highlight: 'You don\'t need perfect grammar. You need RANGE — show you can use different structures.',
    })

    slides.push({
      kind: 'explainer',
      band: 6,
      title: '🔗 Complex Sentences',
      body: `A complex sentence has a MAIN clause + a SUBORDINATE clause.\n\nSimple: "Technology is useful."\nComplex: "Although technology has many benefits, it also creates new challenges."\n\nCommon connectors:\n• Contrast: although, whereas, even though\n• Cause: because, since, as\n• Condition: if, unless, provided that\n• Time: when, after, before, once`,
      highlight: 'Band 6 uses simple sentences. Band 8+ uses complex sentences naturally throughout.',
      example: { wrong: 'Technology is good. It helps people. It creates problems too.', right: 'Although technology significantly improves quality of life, it simultaneously introduces new social challenges.' },
    })

    const grammarQs = [
      { band: 6, question: 'Choose the correct complex sentence:', options: ['Technology is useful. Many problems exist.', 'Although technology is useful, it creates problems.', 'Technology useful although problems.', 'Although. Technology is useful.'], correct: 'Although technology is useful, it creates problems.', explanation: '"Although" joins two contrasting ideas in one sentence. After "although + clause", add a comma then the main clause.' },
      { band: 6, question: 'Which word shows CAUSE?', options: ['although', 'whereas', 'because', 'unless'], correct: 'because', explanation: '"Because" introduces a reason/cause. "Although" and "whereas" show contrast. "Unless" is a condition.' },
      { band: 7, question: 'Choose the grammatically correct sentence:', options: ['The economy grows. Inequality increases.', 'As the economy grows, inequality tends to increase.', 'The economy grows, as inequality increases.', 'As, the economy grows inequality increases.'], correct: 'As the economy grows, inequality tends to increase.', explanation: '"As" here shows a simultaneous relationship. Comma after the subordinate clause when it comes first.' },
      { band: 7, question: 'Complete: "_____ the government invested more, outcomes would improve."', options: ['Although', 'Were', 'Because', 'Despite'], correct: 'Were', explanation: '"Were the government to invest more" is a formal conditional inversion — a Band 8+ structure!' },
      { band: 8, question: 'Which uses passive voice correctly?', options: ['The report wrote by researchers.', 'The report was written by researchers.', 'The report were written by researchers.', 'The report has wrote by researchers.'], correct: 'The report was written by researchers.', explanation: 'Passive voice = was/were + past participle. "Written" is the past participle of "write".' },
      {
        kind: 'error_correction',
        band: 7,
        title: 'Fix the Grammar Error',
        instruction: 'Which sentence contains a grammatical error?',
        sentences: [
          { text: 'Although the economy is growing, unemployment remains high.', correct: true },
          { text: 'Despite of the challenges, the project succeeded.', correct: false, explanation: '"Despite" does NOT take "of". Correct: "Despite the challenges..." OR "In spite of the challenges..."' },
          { text: 'Provided that action is taken, the problem can be solved.', correct: true },
        ],
      },
    ]
    grammarQs.forEach(q => {
      if (q.kind === 'error_correction') slides.push(q)
      else slides.push({ kind: 'mcq', ...q, hint: 'Read all options carefully. Think about grammar rules.' })
    })
  }

  // ─── READING ────────────────────────────────────────────────
  if (type === 'reading') {
    slides.push({
      kind: 'explainer',
      band: 6,
      title: '👁️ Reading Strategies',
      body: `The IELTS Reading test has 40 questions in 60 minutes — that's 90 seconds per question!\n\nKey strategies:\n1. SKIM the passage first (60 sec) — read first/last sentences of each paragraph\n2. READ the questions before scanning for answers\n3. SCAN for keywords — don't re-read the whole passage\n4. PARAPHRASE — questions rarely use the exact words from the text`,
      highlight: 'The answer is ALWAYS in the text. You are testing comprehension, not outside knowledge.',
    })

    slides.push({
      kind: 'explainer',
      band: 6,
      title: '✅ True / False / Not Given',
      body: `This is the trickiest question type!\n\nTRUE: The passage clearly says this.\nFALSE: The passage clearly CONTRADICTS this.\nNOT GIVEN: The passage doesn't mention this at all.\n\nCommon mistake: Choosing "False" when it's actually "Not Given".`,
      highlight: '"Not Given" ≠ "False". False means the text DISAGREES. Not Given means it\'s simply not there.',
      example: {
        wrong: 'Text says "many researchers agree". Statement says "all researchers agree" → people pick FALSE because it\'s an exaggeration.',
        right: 'It should be FALSE because the text (many) contradicts the statement (all).',
      },
    })

    const passage = `Urban farming — the practice of growing food within cities — has gained significant attention as a response to food security concerns. Advocates argue that it reduces transportation costs and carbon emissions associated with food distribution. However, critics point out that urban land is expensive and limited, making large-scale food production impractical in most cities. Some studies suggest that rooftop gardens and vertical farms could supplement, but not replace, conventional agriculture.`

    slides.push({
      kind: 'passage',
      band: 6,
      text: passage,
      label: '📖 Read this passage (take your time!)',
      tip: 'Tip: Read the first and last sentence of each paragraph first to get the main idea.',
    })

    ;[
      { band: 6, question: 'Urban farming is gaining attention.', type: 'tfng', answer: 'True', explanation: 'The passage says it "has gained significant attention" — True.' },
      { band: 6, question: 'All experts agree urban farming is practical.', type: 'tfng', answer: 'False', explanation: '"Critics point out that urban land is expensive" — this contradicts the idea that it\'s practical. False.' },
      { band: 7, question: 'Urban farming uses less water than conventional farming.', type: 'tfng', answer: 'Not Given', explanation: 'Water usage is never mentioned in the passage. Not Given!' },
      { band: 7, question: 'What do advocates say is one benefit of urban farming?', type: 'mcq', options: ['It is cheaper than conventional farming.', 'It reduces transportation costs and carbon emissions.', 'It can completely replace conventional agriculture.', 'It only works on rooftops.'], correct: 'It reduces transportation costs and carbon emissions.', explanation: 'Directly stated: "reduces transportation costs and carbon emissions associated with food distribution".' },
      { band: 7, question: 'According to the passage, what do "some studies suggest"?', type: 'mcq', options: ['Urban farming will replace conventional agriculture.', 'Urban farms can supplement but not replace conventional agriculture.', 'Rooftop gardens are more expensive than vertical farms.', 'Urban land is cheap in most cities.'], correct: 'Urban farms can supplement but not replace conventional agriculture.', explanation: 'Key word: "supplement, but not replace" — this is directly in the text.' },
    ].forEach(q => {
      if (q.type === 'tfng') slides.push({ kind: 'tfng_single', band: q.band, statement: q.question, answer: q.answer, explanation: q.explanation, passage })
      else slides.push({ kind: 'mcq', band: q.band, question: q.question, options: q.options, correct: q.correct, explanation: q.explanation, hint: 'Look for the answer in the passage above.' })
    })

    slides.push({
      kind: 'error_correction',
      band: 7,
      title: '🔍 True, False or Not Given?',
      instruction: 'For the passage above, which answer label is INCORRECTLY applied?',
      sentences: [
        { text: '"Urban farming is gaining attention" → TRUE', correct: true },
        { text: '"Urban farming produces more food per acre than conventional farming" → FALSE', correct: false, explanation: 'This should be NOT GIVEN — the passage never compares food production per acre. "False" would require the text to contradict it.' },
        { text: '"Critics say urban land is expensive" → TRUE', correct: true },
      ],
    })
  }

  // ─── QUIZ (IELTS knowledge) ─────────────────────────────────
  if (type === 'quiz') {
    slides.push({
      kind: 'explainer',
      band: 6,
      title: '📋 Know Your Exam!',
      body: `Understanding the IELTS format helps you avoid surprises on test day.\n\nThe test has 4 parts:\n🎧 Listening — 30 min + 10 min transfer (40 questions)\n👁️ Reading — 60 min (40 questions, 3 passages)\n✍️ Writing — 60 min (Task 1: 150 words, Task 2: 250 words)\n🗣️ Speaking — 11–14 min (3 parts)`,
      highlight: 'Academic and General Training are different in Reading and Writing Task 1. Check which you\'re taking!',
    })

    ;[
      { band: 6, q: 'How many sections does the IELTS Listening test have?', options: ['2', '3', '4', '5'], correct: '4', explanation: 'Sections 1–2 are about everyday situations. Sections 3–4 are academic/educational.' },
      { band: 6, q: 'What is the minimum word count for Writing Task 2?', options: ['150', '200', '250', '300'], correct: '250', explanation: 'Task 2 must be at least 250 words. Writing under this loses marks for Task Achievement.' },
      { band: 6, q: 'How long is the IELTS Speaking test overall?', options: ['5–7 minutes', '8–10 minutes', '11–14 minutes', '20 minutes'], correct: '11–14 minutes', explanation: 'Part 1 (4–5 min) + Part 2 (3–4 min) + Part 3 (4–5 min) = 11–14 minutes total.' },
      { band: 7, q: 'In Speaking, what does the examiner assess?', options: ['Grammar only', 'Pronunciation only', 'Fluency, Lexis, Grammar, and Pronunciation equally', 'Content and topic knowledge'], correct: 'Fluency, Lexis, Grammar, and Pronunciation equally', explanation: 'All 4 criteria are equally weighted at 25% each. Fluency = Fluency & Coherence. Lexis = Lexical Resource.' },
      { band: 7, q: 'What does "Not Given" mean in IELTS Reading?', options: ['The statement is wrong', 'The passage contradicts the statement', 'The information is not in the passage', 'The question is invalid'], correct: 'The information is not in the passage', explanation: '"Not Given" ≠ False. It means the passage simply doesn\'t address the statement at all.' },
    ].forEach(q => slides.push({ kind: 'mcq', band: q.band, question: q.q, options: q.options, correct: q.correct, explanation: q.explanation, hint: 'Think about the official IELTS exam format.' }))
  }

  // ─── WRITING ────────────────────────────────────────────────
  if (type === 'writing') {
    slides.push({
      kind: 'explainer',
      band: 6,
      title: '✍️ The 4 Writing Criteria',
      body: `Your IELTS Writing score is based on 4 criteria (25% each):\n\n🎯 Task Achievement — did you fully answer the question?\n🔗 Coherence & Cohesion — is it logically organised with good linking?\n📚 Lexical Resource — do you use a range of vocabulary accurately?\n⚡ Grammatical Range — do you use varied, accurate grammar structures?`,
      highlight: 'A common Band 6 mistake is writing too little or going off-topic. Always check you\'ve answered ALL parts of the question.',
    })

    slides.push({
      kind: 'explainer',
      band: 7,
      title: '🔗 Cohesive Devices',
      body: `Cohesive devices link your ideas and earn marks for Coherence & Cohesion.\n\nAdding ideas: Furthermore, Moreover, In addition, Not only that but\nContrast: However, Nevertheless, On the other hand, Despite this\nCause/Effect: Consequently, As a result, Therefore, This leads to\nExample: For instance, For example, To illustrate, A prime example`,
      highlight: 'Don\'t overuse them! Using "Furthermore" at the start of every sentence looks unnatural. Vary your linking.',
      example: { wrong: 'Furthermore, technology is useful. Furthermore, it helps students. Furthermore, it saves time.', right: 'Technology is particularly useful in education. Not only does it help students access information, but it also saves considerable time.' },
    })

    ;[
      { band: 6, question: 'Which cohesive device shows CONTRAST?', options: ['Furthermore', 'However', 'Therefore', 'Moreover'], correct: 'However', explanation: '"However" introduces a contrasting or opposing idea. The others (Furthermore, Moreover) add more information, and Therefore shows a result.' },
      { band: 6, question: 'What is the minimum word count for Task 1?', options: ['100', '150', '200', '250'], correct: '150', explanation: 'Task 1 requires at least 150 words. Task 2 requires at least 250 words.' },
      { band: 7, question: 'Which Task 2 introduction is Band 8+?', options: ['This essay will discuss technology.', 'Technology is a very important topic in today\'s world.', 'While technological advancement has transformed modern life in many ways, its social implications remain deeply contested.', 'I think technology is good but also bad.'], correct: 'While technological advancement has transformed modern life in many ways, its social implications remain deeply contested.', explanation: 'The Band 8+ intro: uses a complex sentence with "while", sophisticated vocabulary ("contested", "implications"), and sets up the essay\'s direction.' },
      { band: 7, question: 'Which sentence uses a linking word INCORRECTLY?', options: ['Furthermore, technology saves time.', 'However, not everyone has access to technology.', 'Despite of the benefits, technology has drawbacks.', 'Consequently, productivity has increased.'], correct: 'Despite of the benefits, technology has drawbacks.', explanation: '"Despite" does NOT take "of". Correct forms: "Despite the benefits..." OR "In spite of the benefits..."' },
    ].forEach(q => slides.push({ kind: 'mcq', band: q.band, question: q.question, options: q.options, correct: q.correct, explanation: q.explanation, hint: 'Think about what each linking word means.' }))

    slides.push({
      kind: 'error_correction',
      band: 7,
      title: '✏️ Fix the Writing Error',
      instruction: 'Find the sentence with a writing/grammar error:',
      sentences: [
        { text: 'Technology has transformed the way people communicate.', correct: true },
        { text: 'Despite of the many advantages, technology creates problems.', correct: false, explanation: 'Never say "Despite of". Use "Despite the many advantages" or "In spite of the many advantages".' },
        { text: 'Consequently, governments must invest in digital infrastructure.', correct: true },
      ],
    })
  }

  // ─── DEFAULT fallback ────────────────────────────────────────
  if (slides.length <= 1) {
    slides.push({
      kind: 'explainer', band: 6,
      title: `📖 About This Lesson`,
      body: `This lesson covers: "${lesson.title}"\n\nIELTS tests 4 skills: Listening, Reading, Writing, and Speaking. Each skill is equally important for achieving your target band score.\n\nIn this lesson you'll practise through questions — read each one carefully before answering.`,
      highlight: 'There are no penalties for wrong answers in IELTS. Always attempt every question!',
    })
    ;[
      { band: 6, question: 'Which of the following is a key strategy for IELTS success?', options: ['Memorising template answers', 'Developing natural, flexible language', 'Using only simple vocabulary', 'Avoiding complex grammar'], correct: 'Developing natural, flexible language', explanation: 'Examiners can spot memorised answers. Natural, flexible language use is what earns Band 8–9.' },
      { band: 7, question: 'What does "Lexical Resource" mean in IELTS marking?', options: ['How many words you write', 'Range and accuracy of vocabulary', 'Handwriting quality', 'How fast you write'], correct: 'Range and accuracy of vocabulary', explanation: 'Lexical Resource = 25% of your Writing and Speaking score. It\'s about HOW you use vocabulary, not just quantity.' },
      { band: 7, question: '"The results _____ suggest a strong correlation." Which word fits best?', options: ['definitely', 'absolutely', 'would appear to', 'certainly'], correct: 'would appear to', explanation: '"Would appear to" is hedging language — softening a claim in academic writing. Band 8+ uses this naturally.' },
    ].forEach(q => slides.push({ kind: 'mcq', band: q.band, question: q.question, options: q.options, correct: q.correct, explanation: q.explanation, hint: 'Think carefully — more than one option might seem plausible!' }))
  }

  return slides
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

// ─── SLIDE RENDERERS ─────────────────────────────────────────

function IntroSlide({ slide, onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center">
      <div className="text-7xl mb-4 animate-pop">{slide.icon}</div>
      <h2 className="font-display text-3xl text-green-800 mb-2">{slide.title}</h2>
      <p className="text-green-500 font-semibold text-sm mb-6 max-w-xs">{slide.what}</p>

      <div className="card w-full mb-6 bg-lime-50 border-2 border-lime-300 text-left">
        <p className="font-semibold text-green-800 text-sm">{slide.tip}</p>
      </div>

      <div className="w-full space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
          <span className="text-lime-500">✓</span> Starts at Band 6 level
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
          <span className="text-lime-500">✓</span> Builds up to Band 9
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
          <span className="text-lime-500">✓</span> Mistakes are explained clearly
        </div>
      </div>

      <button onClick={onStart} className="btn-primary w-full text-lg py-4">
        Let's Go! 🚀
      </button>
    </div>
  )
}

function ExplainerSlide({ slide, onNext }) {
  const { label, color, emoji } = bandLabel(slide.band || 6)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 overflow-y-auto">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3 flex items-center gap-1`}>
        {emoji} {label}
      </div>

      <div className="flex items-start gap-3 mb-4">
        <BookOpen className="w-6 h-6 text-lime-600 shrink-0 mt-0.5" />
        <h3 className="font-display text-xl text-green-800 leading-snug">{slide.title}</h3>
      </div>

      <div className="card bg-lime-50 border-2 border-lime-200 mb-3 flex-1">
        <p className="text-sm text-green-800 font-semibold whitespace-pre-line leading-relaxed">{slide.body}</p>
      </div>

      {slide.highlight && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-3 mb-3 flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-yellow-800">{slide.highlight}</p>
        </div>
      )}

      {slide.example && (
        <div className="space-y-2 mb-3">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-red-500 mb-1">❌ Avoid</div>
            <p className="text-sm text-red-800 font-semibold italic">{slide.example.wrong}</p>
          </div>
          <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3">
            <div className="text-xs font-bold text-lime-600 mb-1">✅ Better (Band 8+)</div>
            <p className="text-sm text-green-800 font-semibold italic">{slide.example.right}</p>
          </div>
        </div>
      )}

      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function FlashcardSlide({ slide, onNext }) {
  const [flipped, setFlipped] = useState(false)
  const { label, color } = bandLabel(slide.band || 7)
  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      <p className="text-xs font-bold text-green-500 text-center mb-3 uppercase tracking-wide">📝 Vocabulary Card — tap to reveal</p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          onClick={() => setFlipped(f => !f)}
          className="w-full cursor-pointer"
          style={{ perspective: '1000px', height: '240px' }}
        >
          <div className="relative w-full h-full transition-all duration-500"
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}>
            {/* Front */}
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl flex flex-col items-center justify-center shadow-lg p-6"
              style={{ backfaceVisibility: 'hidden' }}>
              <div className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest">Word</div>
              <div className="font-display text-5xl text-white mb-3">{slide.word}</div>
              <div className="text-white/70 text-sm font-semibold">Tap to reveal meaning</div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 rounded-3xl flex flex-col items-center justify-center shadow-lg p-6"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="text-lime-300 text-xs font-bold mb-2 uppercase tracking-widest">Meaning</div>
              <div className="font-display text-2xl text-white text-center mb-3">{slide.meaning}</div>
              <div className="text-white/70 text-xs font-semibold text-center italic mb-3">"{slide.example}"</div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-white/20`}>Band {slide.band}+ word</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 mt-3 mb-4">
        <div className="text-xs font-bold text-orange-600 mb-1">⚠️ Common mistake</div>
        <p className="text-sm text-orange-800 font-semibold">
          Don't confuse with: "{slide.wrongMeaning}"
        </p>
      </div>

      <button onClick={onNext} className="btn-primary w-full">
        Next →
      </button>
    </div>
  )
}

function MCQSlide({ slide, onCorrect, onWrong, onNext, checked, selected, setSelected }) {
  const { label, color } = bandLabel(slide.band || 6)
  const isCorrect = checked && selected === slide.correct

  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      <h3 className="font-display text-xl text-green-900 mb-4 leading-snug">{slide.question}</h3>

      <div className="space-y-3 flex-1">
        {slide.options.map((opt, i) => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
          if (checked) {
            if (opt === slide.correct)    cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
            else if (opt === selected)    cls = 'bg-red-100 border-2 border-red-400 text-red-900'
            else                          cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-60'
          } else if (opt === selected) {
            cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
          }
          return (
            <button key={i} onClick={() => !checked && setSelected(opt)}
              className={`w-full p-4 rounded-2xl text-left font-semibold transition-all text-sm ${cls} ${!checked ? 'active:scale-[0.98]' : ''}`}>
              <span className="text-xs font-bold opacity-50 mr-2">{['A','B','C','D'][i]}.</span>
              {opt}
              {checked && opt === slide.correct && <span className="ml-2">✅</span>}
              {checked && opt === selected && opt !== slide.correct && <span className="ml-2">❌</span>}
            </button>
          )
        })}
      </div>

      {!checked && slide.hint && (
        <p className="text-xs font-semibold text-lime-600 mt-3 text-center">💡 {slide.hint}</p>
      )}

      {checked && (
        <div className={`mt-4 p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">
            {isCorrect ? '🎉 Correct! Well done!' : '📖 Here\'s what you need to know:'}
          </div>
          <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function TFNGSlide({ slide, checked, selected, setSelected }) {
  const { label, color } = bandLabel(slide.band || 6)
  const isCorrect = checked && selected === slide.answer
  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>

      {slide.passage && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-4 text-xs text-blue-900 font-semibold leading-relaxed max-h-32 overflow-y-auto">
          <div className="text-xs font-bold text-blue-500 mb-1">📖 Passage</div>
          {slide.passage}
        </div>
      )}

      <div className="card bg-lime-50 border-2 border-lime-200 mb-4">
        <div className="text-xs font-bold text-lime-600 mb-1">Statement</div>
        <p className="font-bold text-green-900">{slide.statement}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {['True', 'False', 'Not Given'].map(opt => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300'
          if (checked) {
            if (opt === slide.answer)   cls = 'bg-lime-400 border-2 border-lime-600 text-green-900 font-bold'
            else if (opt === selected)  cls = 'bg-red-200 border-2 border-red-400 text-red-900'
            else                        cls = 'bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-50'
          } else if (opt === selected) cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
          return (
            <button key={opt} onClick={() => !checked && setSelected(opt)}
              className={`py-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
              {opt === 'Not Given' ? 'N / G' : opt}
            </button>
          )
        })}
      </div>

      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : `📖 Answer: ${slide.answer}`}</div>
          <p className="text-sm font-semibold text-gray-700">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function ErrorCorrectionSlide({ slide, checked, selected, setSelected }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      <div className="bg-red-100 text-red-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">
        ✏️ Error Correction
      </div>
      <h3 className="font-display text-xl text-green-900 mb-1">{slide.title}</h3>
      <p className="text-sm text-green-500 font-semibold mb-4">{slide.instruction}</p>

      <div className="space-y-3 flex-1">
        {slide.sentences.map((s, i) => {
          const isSelected = selected === i
          const isCorrect  = s.correct
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-200'
          if (checked) {
            if (!isCorrect)           cls = 'bg-red-50 border-2 border-red-400'
            else if (isSelected && isCorrect) cls = 'bg-lime-50 border-2 border-lime-400'
            else                      cls = 'bg-gray-50 border-2 border-gray-200 opacity-60'
          } else if (isSelected)     cls = 'bg-lime-200 border-2 border-lime-400'

          return (
            <div key={i}>
              <button onClick={() => !checked && setSelected(i)}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                <span className="opacity-50 mr-2">{i + 1}.</span>
                {s.text}
                {checked && !isCorrect && <span className="ml-2 text-red-500">❌</span>}
                {checked && isCorrect && isSelected && <span className="ml-2">✅</span>}
              </button>
              {checked && !isCorrect && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mt-1">
                  <p className="text-xs font-bold text-blue-600 mb-0.5">📖 Explanation</p>
                  <p className="text-sm text-blue-900 font-semibold">{s.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PassageSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      <div className="bg-blue-100 text-blue-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">
        📖 Reading Passage
      </div>
      <div className="text-xs font-bold text-green-600 mb-2">{slide.label}</div>
      <div className="card bg-blue-50 border-2 border-blue-200 flex-1 mb-3">
        <p className="text-sm text-blue-900 font-semibold leading-relaxed">{slide.text}</p>
      </div>
      {slide.tip && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-3">
          <p className="text-xs font-bold text-yellow-700">{slide.tip}</p>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        Ready — Start Questions <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

// ─── MAIN LESSON PAGE ────────────────────────────────────────
export default function Lesson() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()
  const { completeLesson, loseHeart } = useProgress()
  const { profile }  = useAuth()

  const [started,  setStarted]  = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked,  setChecked]  = useState(false)
  const [correct,  setCorrect]  = useState(0)
  const [total,    setTotal]    = useState(0)
  const [hearts,   setHearts]   = useState(profile?.hearts ?? 5)
  const [finished, setFinished] = useState(false)
  const [wrongSlides, setWrongSlides] = useState([]) // for retry

  const found = findLesson(lessonId)
  if (!found) return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50">
      <div className="text-center p-8">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-display text-xl text-green-700 mb-4">Lesson not found</p>
        <button onClick={() => navigate('/learn')} className="btn-primary">← Back</button>
      </div>
    </div>
  )

  const { lesson } = found
  const allSlides  = buildSlides(lesson)
  const slide      = allSlides[slideIdx]

  const questionSlides = allSlides.filter(s => ['mcq','tfng_single','error_correction'].includes(s.kind))
  const progress = started ? (slideIdx / (allSlides.length - 1)) * 100 : 0

  // ── Navigate forward ──
  async function advance() {
    if (slideIdx + 1 >= allSlides.length) {
      const score = total > 0 ? Math.round((correct / total) * 100) : 80
      await completeLesson(lessonId, score)
      setFinished(true)
    } else {
      setSlideIdx(i => i + 1)
      setSelected(null)
      setChecked(false)
    }
  }

  // ── Check answer ──
  function handleCheck() {
    if (slide.kind === 'mcq') {
      if (!selected) return
      const isOk = selected === slide.correct
      setChecked(true)
      setTotal(t => t + 1)
      if (isOk) setCorrect(c => c + 1)
      else { setHearts(h => Math.max(0, h - 1)); loseHeart(); setWrongSlides(prev => [...prev, slide]) }
    }
    if (slide.kind === 'tfng_single') {
      if (!selected) return
      const isOk = selected === slide.answer
      setChecked(true)
      setTotal(t => t + 1)
      if (isOk) setCorrect(c => c + 1)
      else { setHearts(h => Math.max(0, h - 1)); loseHeart(); setWrongSlides(prev => [...prev, slide]) }
    }
    if (slide.kind === 'error_correction') {
      if (selected === null) return
      const isOk = !slide.sentences[selected]?.correct // picking the wrong sentence is correct
      setChecked(true)
      setTotal(t => t + 1)
      if (isOk) setCorrect(c => c + 1)
      else { setHearts(h => Math.max(0, h - 1)); loseHeart() }
    }
  }

  // ── Needs check button? ──
  const needsCheck = ['mcq','tfng_single','error_correction'].includes(slide?.kind)
  const canCheck   = slide?.kind === 'mcq' ? !!selected
                   : slide?.kind === 'tfng_single' ? !!selected
                   : slide?.kind === 'error_correction' ? selected !== null
                   : false

  // ── Finished screen ──
  if (finished) {
    const score = total > 0 ? Math.round((correct / total) * 100) : 80
    const xp    = Math.round((score / 100) * (lesson.xp || 20)) + 10
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
        {score >= 70 && <Confetti recycle={false} numberOfPieces={200} colors={['#bbff33','#84d600','#22c55e','#a3f007']} />}
        <div className="max-w-sm w-full text-center">
          <div className="text-7xl mb-4 animate-bounce-slow">
            {score === 100 ? '🌟' : score >= 70 ? '🎉' : '💪'}
          </div>
          <h2 className="font-display text-3xl text-green-800 mb-1">
            {score === 100 ? 'Perfect!' : score >= 70 ? 'Well done!' : 'Keep going!'}
          </h2>
          <p className="text-green-500 font-semibold mb-5">
            {score >= 70 ? 'Great progress toward Band 9!' : 'Review the explanations and try again!'}
          </p>

          <div className="card mb-4">
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div>
                <div className="font-display text-3xl text-lime-600">{score}%</div>
                <div className="text-xs font-bold text-gray-500">Score</div>
              </div>
              <div>
                <div className="font-display text-3xl text-green-600">+{xp}</div>
                <div className="text-xs font-bold text-gray-500">XP Earned</div>
              </div>
              <div>
                <div className="font-display text-3xl text-yellow-500">{correct}/{total}</div>
                <div className="text-xs font-bold text-gray-500">Correct</div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              {[1,2,3].map(s => (
                <span key={s} className={`text-3xl ${score >= s * 33 ? '' : 'grayscale opacity-30'}`}>⭐</span>
              ))}
            </div>
          </div>

          {wrongSlides.length > 0 && (
            <div className="card mb-4 text-left bg-blue-50 border-2 border-blue-200">
              <div className="font-bold text-blue-800 mb-2 text-sm">📖 Review your mistakes:</div>
              {wrongSlides.map((ws, i) => (
                <div key={i} className="mb-3 last:mb-0 p-2 bg-white rounded-xl">
                  <div className="text-xs font-bold text-gray-500 mb-1">Q: {ws.question || ws.statement}</div>
                  <div className="text-xs font-semibold text-green-700 whitespace-pre-line">{ws.explanation}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => navigate('/learn')} className="btn-secondary flex-1">← Learn</button>
            <button onClick={() => { setSlideIdx(0); setStarted(false); setCorrect(0); setTotal(0); setFinished(false); setWrongSlides([]) }}
              className="btn-primary flex-1">
              <RotateCcw className="w-4 h-4 inline mr-1" /> Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Pre-start ──
  if (!started) {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col">
        <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <span className="font-bold text-green-800 flex-1 truncate">{lesson.title}</span>
        </div>
        <IntroSlide slide={allSlides[0]} onStart={() => { setStarted(true); setSlideIdx(1) }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
          <span className="font-bold text-red-500 text-sm">{hearts}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Zap className="w-4 h-4 text-lime-600" />
          <span className="font-bold text-lime-700 text-sm">{slideIdx}/{allSlides.length - 1}</span>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full overflow-y-auto">
        {slide?.kind === 'explainer' && (
          <ExplainerSlide slide={slide} onNext={advance} />
        )}
        {slide?.kind === 'flashcard' && (
          <FlashcardSlide slide={slide} onNext={advance} />
        )}
        {slide?.kind === 'passage' && (
          <PassageSlide slide={slide} onNext={advance} />
        )}
        {slide?.kind === 'mcq' && (
          <MCQSlide
            slide={slide}
            checked={checked} selected={selected} setSelected={setSelected}
            onCorrect={() => setCorrect(c => c + 1)}
            onWrong={() => { loseHeart(); setHearts(h => Math.max(0, h - 1)) }}
            onNext={advance}
          />
        )}
        {slide?.kind === 'tfng_single' && (
          <TFNGSlide slide={slide} checked={checked} selected={selected} setSelected={setSelected} />
        )}
        {slide?.kind === 'error_correction' && (
          <ErrorCorrectionSlide slide={slide} checked={checked} selected={selected} setSelected={setSelected} />
        )}
      </div>

      {/* Bottom action */}
      {slide && !['explainer','flashcard','passage','intro'].includes(slide.kind) && (
        <div className="sticky bottom-0 bg-white border-t-2 border-lime-200 p-4 max-w-lg mx-auto w-full">
          {!checked ? (
            <button onClick={handleCheck} disabled={!canCheck}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
              Check Answer
            </button>
          ) : (
            <button onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
              {slideIdx + 1 >= allSlides.length ? '🎉 Finish!' : 'Continue'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
