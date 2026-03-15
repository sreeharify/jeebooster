import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { X, Zap, ChevronRight, BookOpen, Lightbulb, RotateCcw, AlertCircle } from 'lucide-react'
import { COURSE_DATA } from '../data/courseData'
import Confetti from 'react-confetti'

// ─── helpers ────────────────────────────────────────────────
function findLesson(id) {
  for (const section of COURSE_DATA)
    for (const unit of section.units) {
      const lesson = unit.lessons.find(l => l.id === id)
      if (lesson) return { lesson, unit, section }
    }
  return null
}

function bandLabel(b) {
  if (b <= 6) return { label: 'Band 6 — Beginner',      color: 'bg-orange-400', emoji: '🌱' }
  if (b === 7) return { label: 'Band 7 — Intermediate', color: 'bg-yellow-400', emoji: '🌿' }
  if (b === 8) return { label: 'Band 8 — Advanced',     color: 'bg-green-500',  emoji: '🌳' }
  return              { label: 'Band 9 — Expert',        color: 'bg-lime-500',   emoji: '🏆' }
}

function getTypeIcon(type) {
  return { vocab:'📝',grammar:'⚡',reading:'👁️',quiz:'❓',fill:'✏️',
           writing:'✍️',speaking:'🗣️',test:'📋',mock:'🏅',
           listen:'🎧',info:'📖',match:'🔗',interactive:'🎮' }[type] || '📚'
}

function getWhatYouLearn(lesson) {
  return {
    vocab:   'Learn key academic words used in IELTS Band 7–9 answers.',
    grammar: 'Practise a grammar structure that examiners reward at Band 7+.',
    reading: 'Build strategies for reading passages quickly and accurately.',
    quiz:    'Test your IELTS knowledge with multiple-choice questions.',
    writing: 'Explore writing techniques and sentence structures.',
    speaking:'Practise speaking strategies for Parts 1, 2 and 3.',
    test:    'Mini test covering key exam skills.',
  }[lesson.type] || `Build skills for ${lesson.title}.`
}

function getQuickTip(type) {
  return {
    vocab:   '💡 Learn words in context — always read the example sentence!',
    grammar: '💡 Try to use the new structure in your own sentence after each question.',
    reading: '💡 Skim the passage first (30 sec) to get the big picture before answering.',
    quiz:    '💡 Read ALL options before choosing — the best answer is always there.',
    writing: '💡 Quality over quantity. One well-developed idea beats three vague ones.',
    speaking:'💡 Extend every answer: point → reason → example.',
    test:    '💡 Don\'t spend too long on one question. Move on and come back.',
  }[type] || '💡 Take your time and read carefully before answering.'
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

// ─── Build slides ────────────────────────────────────────────
function buildSlides(lesson) {
  const slides = []
  slides.push({
    kind: 'intro',
    title: lesson.title,
    icon: getTypeIcon(lesson.type),
    what: getWhatYouLearn(lesson),
    tip:  getQuickTip(lesson.type),
  })
  slides.push(...getContent(lesson))
  return slides
}

function getContent(lesson) {
  const type   = lesson.type
  const slides = []

  // ── VOCAB ────────────────────────────────────────────────────
  if (type === 'vocab') {
    slides.push({
      kind: 'explainer', band: 6,
      title: '📚 Why Vocabulary Matters',
      body: `Vocabulary (Lexical Resource) is worth 25% of your Writing and Speaking scores.\n\nBand 6 → uses common words correctly\nBand 7 → uses some less common words\nBand 8–9 → uses sophisticated vocabulary naturally\n\nThe goal is NOT to memorise word lists. It's to understand words deeply enough to use them confidently in any sentence.`,
      highlight: 'Always learn a word with its example sentence — context is everything.',
    })

    const words = [
      { word:'mitigate',     meaning:'to reduce the severity of something',    example:'Governments must mitigate the effects of climate change.',            band:6, wrong:'to make something worse' },
      { word:'ubiquitous',   meaning:'present or found everywhere',            example:'Smartphones have become ubiquitous in modern society.',                band:7, wrong:'very rare and unusual' },
      { word:'exacerbate',   meaning:'to make a problem worse',                example:'Poverty can exacerbate health issues.',                                band:7, wrong:'to solve a problem gradually' },
      { word:'proliferate',  meaning:'to increase rapidly in number',          example:'Fast food chains have proliferated across the country.',               band:8, wrong:'to decrease steadily' },
      { word:'substantiate', meaning:'to provide evidence to support a claim', example:'The researcher substantiated her theory with new data.',               band:9, wrong:'to question or challenge' },
    ]

    words.forEach(w => {
      slides.push({ kind: 'flashcard', ...w })
      const distractors = words.filter(x => x.word !== w.word).slice(0, 3).map(x => x.meaning)
      slides.push({
        kind: 'mcq', band: w.band,
        question: `What does "${w.word}" mean?`,
        options: shuffle([w.meaning, ...distractors]),
        correct: w.meaning,
        explanation: `✅ "${w.word}" = "${w.meaning}"\n\nExample: "${w.example}"`,
        hint: 'Think about the example sentence on the card you just saw.',
      })
    })

    slides.push({
      kind: 'error_correction', band: 7,
      title: 'Spot the Vocabulary Error',
      instruction: 'Which sentence uses a word INCORRECTLY?',
      sentences: [
        { text: 'The new policy will mitigate the risks of flooding.',     correct: true  },
        { text: 'Stress can exacerbate your health in a positive way.',    correct: false, explanation: '"Exacerbate" means to make something WORSE — it cannot collocate with "in a positive way". Correct: "Stress can exacerbate health problems."' },
        { text: 'Mobile technology has become ubiquitous worldwide.',      correct: true  },
      ],
    })
  }

  // ── GRAMMAR ─────────────────────────────────────────────────
  if (type === 'grammar') {
    slides.push({
      kind: 'explainer', band: 6,
      title: '⚡ Grammar Range = More Marks',
      body: `Grammatical Range & Accuracy = 25% of Writing and Speaking.\n\nBand 6 → uses basic structures, noticeable errors\nBand 7 → uses complex sentences, minor errors\nBand 8 → wide range of structures, rare errors\nBand 9 → full range, near-perfect accuracy\n\nYou don't need to be perfect. You need VARIETY.`,
      highlight: 'Examiners reward you for ATTEMPTING complex structures, even with minor errors.',
    })
    slides.push({
      kind: 'explainer', band: 6,
      title: '🔗 Complex Sentences',
      body: `A complex sentence = main clause + subordinate clause.\n\nSimple (Band 5–6):\n"Technology is useful. It creates problems."\n\nComplex (Band 7–8):\n"Although technology is incredibly useful, it simultaneously creates new social challenges."\n\nKey connectors:\n• Contrast: although, whereas, even though, while\n• Cause: because, since, as, given that\n• Condition: if, unless, provided that\n• Time: when, after, before, once`,
      highlight: 'Start sentences with a subordinating conjunction to instantly create complexity.',
      example: {
        wrong: 'Technology is good. It helps people. Problems exist too.',
        right: 'Although technology significantly improves quality of life, it simultaneously introduces new social challenges.',
      },
    })
    ;[
      { band:6, question:'Choose the correct complex sentence:', options:['Technology is useful. Many problems exist.','Although technology is useful, it creates problems.','Technology useful although problems.','Although. Technology useful.'], correct:'Although technology is useful, it creates problems.', explanation:'After "Although + clause", add a comma then the main clause. Both parts need a subject and verb.' },
      { band:6, question:'Which word shows a CAUSE relationship?', options:['although','whereas','because','unless'], correct:'because', explanation:'"Because" introduces a reason/cause.\n"Although/whereas" = contrast.\n"Unless" = condition.\n\nExample: "Because pollution is rising, health problems are increasing."' },
      { band:7, question:'Which is grammatically correct?', options:['The economy grows. Inequality increases.','As the economy grows, inequality tends to increase.','The economy grows, as inequality increases.','As, the economy grows inequality increases.'], correct:'As the economy grows, inequality tends to increase.', explanation:'"As" shows a simultaneous relationship. Comma after the subordinate clause when it comes first.' },
      { band:7, question:'Which uses PASSIVE VOICE correctly?', options:['The report wrote by researchers.','The report was written by researchers.','The report were written by researchers.','The report has wrote by researchers.'], correct:'The report was written by researchers.', explanation:'Passive voice = was/were + past participle.\n"Written" is the past participle of "write".\n\nPassive is common in academic writing — it sounds more objective.' },
      { band:8, question:'Which is a FORMAL conditional inversion (Band 8+)?', options:['If the government invested more, outcomes would improve.','Were the government to invest more, outcomes would improve.','The government investing more would improve outcomes.','Unless the government invests, outcomes won\'t improve.'], correct:'Were the government to invest more, outcomes would improve.', explanation:'"Were the government to invest..." is an inverted conditional — omitting "if" and inverting subject/auxiliary. This signals very high grammatical range to examiners.' },
    ].forEach(q => slides.push({ kind:'mcq', ...q, hint:'Re-read the explainer card if you\'re unsure.' }))

    slides.push({
      kind: 'error_correction', band: 7,
      title: 'Fix the Grammar Error',
      instruction: 'Which sentence contains a grammar mistake?',
      sentences: [
        { text:'Although the economy is growing, unemployment remains high.',     correct:true  },
        { text:'Despite of the challenges, the project succeeded.',               correct:false, explanation:'"Despite" never takes "of". Use "Despite the challenges..." OR "In spite of the challenges..." This is one of the most common Band 6 errors.' },
        { text:'Provided that action is taken, the problem can be solved.',       correct:true  },
      ],
    })
  }

  // ── READING ──────────────────────────────────────────────────
  if (type === 'reading') {
    slides.push({
      kind:'explainer', band:6,
      title:'👁️ Reading Strategies',
      body:`40 questions in 60 minutes = 90 seconds per question!\n\nThe 4-step method:\n1. SKIM the whole passage (60 sec) — first + last sentence of each paragraph\n2. READ the questions carefully — underline keywords\n3. SCAN the passage for those keywords\n4. CHECK your answer fits grammatically`,
      highlight:'The answer is ALWAYS in the text. You are NOT tested on outside knowledge.',
    })
    slides.push({
      kind:'explainer', band:6,
      title:'✅ True / False / Not Given',
      body:`This is the most misunderstood question type!\n\nTRUE → The passage clearly says this\nFALSE → The passage CONTRADICTS this\nNOT GIVEN → The information isn't mentioned at all\n\nCommon trap: Students choose FALSE when the answer is NOT GIVEN.\n\nKey question to ask yourself:\n"Does the text SAY the opposite, or does it just not mention it?"`,
      highlight:'"Not Given" ≠ "False". False = text disagrees. Not Given = topic is absent.',
      example:{
        wrong:'Text: "Many cities have improved air quality." Statement: "All cities have improved." → Students pick NOT GIVEN.',
        right:'Correct answer is FALSE — "many" directly contradicts "all".',
      },
    })

    const passage = `Urban farming — the practice of growing food within cities — has gained significant attention as a response to food security concerns. Advocates argue that it reduces transportation costs and carbon emissions associated with food distribution. However, critics point out that urban land is expensive and limited, making large-scale food production impractical in most cities. Some studies suggest that rooftop gardens and vertical farms could supplement, but not replace, conventional agriculture.`

    slides.push({ kind:'passage', band:6, text:passage, label:'📖 Read this passage carefully', tip:'💡 Tip: Read it twice — once for the big picture, once slowly for details.' })

    ;[
      { band:6, type:'tfng', statement:'Urban farming is gaining attention as a solution to food security.', answer:'True',      explanation:'"Has gained significant attention as a response to food security concerns" — clearly TRUE.' },
      { band:6, type:'tfng', statement:'All experts agree that urban farming is practical.',                  answer:'False',     explanation:'"Critics point out that urban land is expensive" — this CONTRADICTS the idea all experts agree. FALSE.' },
      { band:7, type:'tfng', statement:'Urban farms use less water than conventional farms.',                 answer:'Not Given', explanation:'Water usage is NEVER mentioned in the passage. This is NOT GIVEN — don\'t confuse with False!' },
      { band:7, type:'mcq',  question:'What do advocates say is a benefit of urban farming?', options:['It is cheaper than conventional farming.','It reduces transportation costs and carbon emissions.','It can completely replace conventional agriculture.','It only works on rooftops.'], correct:'It reduces transportation costs and carbon emissions.', explanation:'Directly stated: "reduces transportation costs and carbon emissions associated with food distribution."' },
      { band:7, type:'mcq',  question:'What do studies suggest about rooftop gardens and vertical farms?', options:['They will replace conventional agriculture.','They can supplement but not replace conventional agriculture.','They are too expensive to be useful.','They work best in rural areas.'], correct:'They can supplement but not replace conventional agriculture.', explanation:'"Supplement, but not replace" is a direct quote from the passage. Always look for these key qualifying words.' },
    ].forEach(q => {
      if (q.type === 'tfng') slides.push({ kind:'tfng_single', band:q.band, statement:q.statement, answer:q.answer, explanation:q.explanation, passage })
      else slides.push({ kind:'mcq', band:q.band, question:q.question, options:q.options, correct:q.correct, explanation:q.explanation, hint:'The answer is in the passage above.' })
    })

    slides.push({
      kind:'error_correction', band:7,
      title:'T / F / NG — Spot the Wrong Label',
      instruction:'Which sentence has the WRONG answer label for the passage above?',
      sentences:[
        { text:'"Urban farming has gained attention" → TRUE',                                           correct:true  },
        { text:'"Urban farming produces more food per acre" → FALSE',                                  correct:false, explanation:'This should be NOT GIVEN — the passage never mentions food production per acre. FALSE would require the text to contradict it.' },
        { text:'"Critics say urban land is expensive and limited" → TRUE',                             correct:true  },
      ],
    })
  }

  // ── QUIZ ─────────────────────────────────────────────────────
  if (type === 'quiz') {
    slides.push({
      kind:'explainer', band:6,
      title:'📋 IELTS Format — Know Your Exam!',
      body:`The IELTS test has 4 parts:\n\n🎧 Listening — 30 min + 10 min to transfer answers\n   40 questions across 4 sections\n\n👁️ Reading — 60 min\n   40 questions across 3 passages\n\n✍️ Writing — 60 min\n   Task 1: min 150 words (graph/letter)\n   Task 2: min 250 words (essay)\n\n🗣️ Speaking — 11–14 min with an examiner\n   3 parts: introduction, cue card, discussion`,
      highlight:'Academic and General Training differ in Reading and Writing Task 1. Make sure you\'re preparing for the right version!',
    })
    ;[
      { band:6, q:'How many sections does the IELTS Listening test have?', options:['2','3','4','5'], correct:'4', explanation:'Sections 1 & 2 = everyday situations (monologue/dialogue).\nSections 3 & 4 = educational/academic context.\nDifficulty increases with each section.' },
      { band:6, q:'What is the minimum word count for Writing Task 2?', options:['150','200','250','300'], correct:'250', explanation:'Task 2 requires AT LEAST 250 words. Task 1 requires at least 150 words. Writing fewer than required loses marks for Task Achievement immediately.' },
      { band:6, q:'How long is the IELTS Speaking test overall?', options:['5–7 min','8–10 min','11–14 min','20 min'], correct:'11–14 min', explanation:'Part 1 (4–5 min) + Part 2 (3–4 min) + Part 3 (4–5 min) = 11–14 minutes total. You speak with a trained examiner, not a machine.' },
      { band:7, q:'What are the 4 criteria used to mark IELTS Speaking?', options:['Grammar, Vocabulary, Listening, Fluency','Fluency & Coherence, Lexical Resource, Grammar, Pronunciation','Content, Style, Accuracy, Speed','Topic Knowledge, Confidence, Clarity, Tone'], correct:'Fluency & Coherence, Lexical Resource, Grammar, Pronunciation', explanation:'Each criterion = 25% of the Speaking score.\nFluency & Coherence = how smoothly you speak and organise ideas.\nLexical Resource = vocabulary range and accuracy.\nGrammar = range and accuracy of structures.\nPronunciation = clarity (NOT accent).' },
      { band:7, q:'What does "Not Given" mean in IELTS Reading?', options:['The statement is wrong','The passage contradicts the statement','The information is simply not in the passage','The question has no answer'], correct:'The information is simply not in the passage', explanation:'"Not Given" means the passage doesn\'t address the statement — neither confirming nor contradicting it.\n\nFalse = text contradicts.\nNot Given = topic is absent.' },
    ].forEach(q => slides.push({ kind:'mcq', band:q.band, question:q.q, options:q.options, correct:q.correct, explanation:q.explanation, hint:'Think about the official IELTS exam format.' }))
  }

  // ── WRITING ──────────────────────────────────────────────────
  if (type === 'writing') {
    slides.push({
      kind:'explainer', band:6,
      title:'✍️ The 4 Writing Criteria',
      body:`Your Writing score is based on 4 criteria (25% each):\n\n🎯 Task Achievement\nDid you fully answer the question?\n\n🔗 Coherence & Cohesion\nIs it logically organised with clear linking?\n\n📚 Lexical Resource\nDo you use a range of vocabulary accurately?\n\n⚡ Grammatical Range & Accuracy\nDo you use varied, accurate grammar?`,
      highlight:'Band 6 mistake: writing off-topic or ignoring part of the question. Always re-read the prompt before writing.',
    })
    slides.push({
      kind:'explainer', band:7,
      title:'🔗 Cohesive Devices',
      body:`These words and phrases link your ideas and earn Coherence marks.\n\nAdding: Furthermore, Moreover, In addition, Not only that but also\nContrast: However, Nevertheless, On the other hand, Despite this\nCause/Effect: Consequently, As a result, Therefore, This leads to\nExample: For instance, For example, To illustrate, A prime example is\nConclusion: In conclusion, To summarise, Overall`,
      highlight:'Don\'t overuse them. Starting every sentence with "Furthermore" looks unnatural. Vary your linking.',
      example:{
        wrong:'Furthermore, technology is useful. Furthermore, it helps students. Furthermore, it saves time.',
        right:'Technology is particularly useful in education. Not only does it help students access information, but it also saves considerable time.',
      },
    })
    ;[
      { band:6, question:'Which linking word shows CONTRAST?', options:['Furthermore','However','Therefore','Moreover'], correct:'However', explanation:'"However" introduces a contrasting idea.\n"Furthermore" and "Moreover" = adding more information.\n"Therefore" = showing a result or conclusion.\n\nExample: "Technology saves time. However, it can also be a distraction."' },
      { band:6, question:'What is the minimum word count for Task 1?', options:['100','150','200','250'], correct:'150', explanation:'Task 1 = minimum 150 words (describe a graph, chart, process, or letter).\nTask 2 = minimum 250 words (essay).\nAlways count before submitting!' },
      { band:7, question:'Which Task 2 introduction is Band 8+?', options:['This essay will discuss technology.','Technology is a very important topic today.','While technological advancement has transformed modern life, its social implications remain deeply contested.','I think technology is good but also bad.'], correct:'While technological advancement has transformed modern life, its social implications remain deeply contested.', explanation:'The Band 8+ intro uses:\n• A complex sentence with "while"\n• Sophisticated vocabulary ("contested", "implications")\n• Clear setup for the essay direction\n\nAvoid: "This essay will discuss..." — it\'s mechanical and scores Band 6 at best.' },
      { band:7, question:'Which sentence uses a linking word INCORRECTLY?', options:['Furthermore, technology saves time.','However, not everyone has access to technology.','Despite of the benefits, technology has drawbacks.','Consequently, productivity has increased.'], correct:'Despite of the benefits, technology has drawbacks.', explanation:'"Despite" NEVER takes "of"!\n\nCorrect forms:\n✅ Despite the benefits, technology...\n✅ In spite of the benefits, technology...\n\nThis is one of the most penalised errors at Band 6–7.' },
    ].forEach(q => slides.push({ kind:'mcq', ...q, hint:'Think about what each linking word means and how it connects ideas.' }))

    slides.push({
      kind:'error_correction', band:7,
      title:'Fix the Writing Error',
      instruction:'Which sentence contains a writing error?',
      sentences:[
        { text:'Technology has transformed the way people communicate.',            correct:true  },
        { text:'Despite of the many advantages, technology creates problems.',      correct:false, explanation:'Never say "Despite of". Use:\n✅ "Despite the many advantages..."\n✅ "In spite of the many advantages..."\n\nThis error immediately signals Band 6 to an examiner.' },
        { text:'Consequently, governments must invest in digital infrastructure.',   correct:true  },
      ],
    })
  }

  // ── DEFAULT fallback ─────────────────────────────────────────
  if (slides.length <= 1) {
    slides.push({
      kind:'explainer', band:6,
      title:`📖 About: ${lesson.title}`,
      body:`This lesson will test your knowledge of key IELTS concepts.\n\nRead each question carefully. If you get it wrong, the explanation will show you exactly what you need to know.\n\nYou need to score at least 60% to pass this lesson and unlock the next one.`,
      highlight:'There are no penalties for guessing in IELTS. Always attempt every question!',
    })
    ;[
      { band:6, question:'Which of the following is a key strategy for IELTS success?', options:['Memorising template answers','Developing natural, flexible language','Using only simple vocabulary','Avoiding complex grammar'], correct:'Developing natural, flexible language', explanation:'Examiners are trained to spot memorised answers. Natural, flexible language is what earns Band 8–9.' },
      { band:7, question:'What does "Lexical Resource" mean in IELTS marking?', options:['How many words you write','Range and accuracy of vocabulary','Handwriting quality','How fast you write'], correct:'Range and accuracy of vocabulary', explanation:'Lexical Resource = 25% of Writing and Speaking.\nIt\'s about HOW you use vocabulary — range, collocation accuracy, and flexibility.' },
      { band:7, question:'"The results _____ suggest a strong correlation." Best fit?', options:['definitely','absolutely','would appear to','certainly'], correct:'would appear to', explanation:'"Would appear to" is hedging language — it softens a claim in academic writing.\n\nBand 8+ writers hedge naturally: "it seems that", "there is evidence to suggest", "would appear to indicate".' },
    ].forEach(q => slides.push({ kind:'mcq', band:q.band, question:q.question, options:q.options, correct:q.correct, explanation:q.explanation, hint:'Think carefully — more than one option may seem correct!' }))
  }

  return slides
}

// ─── Slide components ────────────────────────────────────────
function IntroSlide({ slide, onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center max-w-lg mx-auto w-full">
      <div className="text-7xl mb-4 animate-pop">{slide.icon}</div>
      <h2 className="font-display text-3xl text-green-800 mb-2">{slide.title}</h2>
      <p className="text-green-500 font-semibold text-sm mb-6 max-w-xs">{slide.what}</p>
      <div className="card w-full mb-5 bg-lime-50 border-2 border-lime-300 text-left">
        <p className="font-semibold text-green-800 text-sm">{slide.tip}</p>
      </div>
      <div className="w-full space-y-2 mb-6 text-left">
        {['Starts at Band 6 level — beginner-friendly','Builds progressively to Band 9','Mistakes explained clearly every time','Need 60% to pass and unlock the next lesson'].map(t => (
          <div key={t} className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <span className="text-lime-500 font-bold">✓</span> {t}
          </div>
        ))}
      </div>
      <button onClick={onStart} className="btn-primary w-full text-lg py-4">Let's Go! 🚀</button>
    </div>
  )
}

function ExplainerSlide({ slide, onNext }) {
  const { label, color, emoji } = bandLabel(slide.band || 6)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 overflow-y-auto max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3 flex items-center gap-1`}>
        {emoji} {label}
      </div>
      <div className="flex items-start gap-3 mb-3">
        <BookOpen className="w-6 h-6 text-lime-600 shrink-0 mt-0.5" />
        <h3 className="font-display text-xl text-green-800 leading-snug">{slide.title}</h3>
      </div>
      <div className="card bg-lime-50 border-2 border-lime-200 mb-3">
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
            <div className="text-xs font-bold text-red-500 mb-1">❌ Avoid (Band 5–6)</div>
            <p className="text-sm text-red-800 font-semibold italic">{slide.example.wrong}</p>
          </div>
          <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3">
            <div className="text-xs font-bold text-lime-600 mb-1">✅ Better (Band 8+)</div>
            <p className="text-sm text-green-800 font-semibold italic">{slide.example.right}</p>
          </div>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function FlashcardSlide({ slide, onNext }) {
  const [flipped, setFlipped] = useState(false)
  const { label, color } = bandLabel(slide.band || 7)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-2`}>{label}</div>
      <p className="text-xs font-bold text-green-500 text-center mb-3 uppercase tracking-wide">Vocabulary Card — tap to reveal</p>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div onClick={() => setFlipped(f => !f)} className="w-full cursor-pointer" style={{ perspective:'1000px', height:'220px' }}>
          <div className="relative w-full h-full transition-all duration-500" style={{ transformStyle:'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl flex flex-col items-center justify-center shadow-lg p-6" style={{ backfaceVisibility:'hidden' }}>
              <div className="text-white/60 text-xs font-bold mb-2 uppercase tracking-widest">Word</div>
              <div className="font-display text-5xl text-white mb-2">{slide.word}</div>
              <div className="text-white/70 text-sm font-semibold">Tap to see meaning →</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 rounded-3xl flex flex-col items-center justify-center shadow-lg p-6" style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
              <div className="text-lime-300 text-xs font-bold mb-2 uppercase tracking-widest">Meaning</div>
              <div className="font-display text-2xl text-white text-center mb-2">{slide.meaning}</div>
              <div className="text-white/70 text-xs font-semibold text-center italic mb-2">"{slide.example}"</div>
              <div className="px-3 py-1 rounded-full text-xs font-bold text-white bg-white/20">Band {slide.band}+ word</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-3 mt-3 mb-4">
        <div className="text-xs font-bold text-orange-600 mb-1">⚠️ Don't confuse with:</div>
        <p className="text-sm text-orange-800 font-semibold">"{slide.wrong}"</p>
      </div>
      <button onClick={onNext} className="btn-primary w-full">Next →</button>
    </div>
  )
}

function PassageSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-blue-100 text-blue-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-2">📖 Reading Passage</div>
      <div className="text-xs font-bold text-green-600 mb-2">{slide.label}</div>
      <div className="card bg-blue-50 border-2 border-blue-200 flex-1 mb-3 overflow-y-auto">
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

function MCQSlide({ slide, checked, selected, setSelected }) {
  const { label, color } = bandLabel(slide.band || 6)
  const isCorrect = checked && selected === slide.correct
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      <h3 className="font-display text-xl text-green-900 mb-4 leading-snug">{slide.question}</h3>
      <div className="space-y-3 flex-1">
        {slide.options.map((opt, i) => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
          if (checked) {
            if (opt === slide.correct)                   cls = 'bg-lime-100 border-2 border-lime-500 text-green-900'
            else if (opt === selected)                   cls = 'bg-red-100 border-2 border-red-400 text-red-900'
            else                                         cls = 'bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-60'
          } else if (opt === selected)                   cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
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
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : '📖 Here\'s what you need to know:'}</div>
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
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      {slide.passage && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-3 text-xs text-blue-900 font-semibold leading-relaxed max-h-28 overflow-y-auto">
          <div className="text-xs font-bold text-blue-500 mb-1">📖 Passage (scroll if needed)</div>
          {slide.passage}
        </div>
      )}
      <div className="card bg-lime-50 border-2 border-lime-200 mb-4">
        <div className="text-xs font-bold text-lime-600 mb-1">Statement</div>
        <p className="font-bold text-green-900 text-sm">{slide.statement}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['True','False','Not Given'].map(opt => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300'
          if (checked) {
            if (opt === slide.answer)  cls = 'bg-lime-400 border-2 border-lime-600 text-green-900 font-bold'
            else if (opt === selected) cls = 'bg-red-200 border-2 border-red-400 text-red-900'
            else                       cls = 'bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-50'
          } else if (opt === selected) cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
          return (
            <button key={opt} onClick={() => !checked && setSelected(opt)}
              className={`py-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
              {opt === 'Not Given' ? 'N/G' : opt}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : `📖 Correct answer: ${slide.answer}`}</div>
          <p className="text-sm font-semibold text-gray-700">{slide.explanation}</p>
        </div>
      )}
    </div>
  )
}

function ErrorCorrectionSlide({ slide, checked, selected, setSelected }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-red-100 text-red-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">✏️ Error Correction</div>
      <h3 className="font-display text-xl text-green-900 mb-1">{slide.title}</h3>
      <p className="text-sm text-green-500 font-semibold mb-4">{slide.instruction}</p>
      <div className="space-y-3 flex-1">
        {slide.sentences.map((s, i) => {
          const isSel   = selected === i
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-200'
          if (checked) {
            if (!s.correct)              cls = 'bg-red-50 border-2 border-red-400'
            else if (isSel && s.correct) cls = 'bg-gray-50 border-2 border-gray-200 opacity-60'
            else                         cls = 'bg-gray-50 border-2 border-gray-200 opacity-60'
          } else if (isSel)              cls = 'bg-lime-200 border-2 border-lime-400 text-green-900'
          return (
            <div key={i}>
              <button onClick={() => !checked && setSelected(i)}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                <span className="opacity-50 mr-2">{i + 1}.</span>
                {s.text}
                {checked && !s.correct && <span className="ml-2 text-red-500 font-bold"> ← ERROR</span>}
              </button>
              {checked && !s.correct && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mt-1">
                  <p className="text-xs font-bold text-blue-600 mb-0.5">📖 Why it's wrong + how to fix it:</p>
                  <p className="text-sm text-blue-900 font-semibold whitespace-pre-line">{s.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── FAILED SCREEN ───────────────────────────────────────────
function FailedScreen({ score, correct, total, wrongSlides, onRetry, onBack }) {
  return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-4">😔</div>
        <h2 className="font-display text-3xl text-red-600 mb-2">Not Quite!</h2>
        <p className="text-gray-600 font-semibold mb-2">You scored <strong>{score}%</strong></p>
        <p className="text-gray-500 font-semibold text-sm mb-6">You need <strong>60%</strong> to pass this lesson. Review the explanations below and try again!</p>

        <div className="card mb-5 bg-red-50 border-2 border-red-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="font-display text-3xl text-red-500">{score}%</div>
              <div className="text-xs font-bold text-gray-500">Your Score</div>
            </div>
            <div>
              <div className="font-display text-3xl text-red-400">{correct}/{total}</div>
              <div className="text-xs font-bold text-gray-500">Correct</div>
            </div>
          </div>
          <div className="mt-3 bg-red-100 rounded-xl p-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-600">
              <AlertCircle className="w-4 h-4" />
              Need 60% to unlock the next lesson
            </div>
          </div>
        </div>

        {wrongSlides.length > 0 && (
          <div className="card mb-5 text-left bg-blue-50 border-2 border-blue-200">
            <div className="font-bold text-blue-800 mb-3 text-sm">📖 Study these before retrying:</div>
            {wrongSlides.map((ws, i) => (
              <div key={i} className="mb-3 last:mb-0 p-3 bg-white rounded-xl border border-blue-100">
                <div className="text-xs font-bold text-gray-500 mb-1">❌ You got this wrong:</div>
                <div className="text-xs font-semibold text-gray-700 mb-2">{ws.question || ws.statement || ws.title}</div>
                <div className="text-xs font-semibold text-green-700 whitespace-pre-line bg-lime-50 rounded-lg p-2">{ws.explanation || (ws.sentences?.find(s => !s.correct)?.explanation)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-secondary flex-1">← Back</button>
          <button onClick={onRetry} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PASSED SCREEN ───────────────────────────────────────────
function PassedScreen({ score, correct, total, xp, wrongSlides, onRetry, onBack }) {
  return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
      {score >= 70 && <Confetti recycle={false} numberOfPieces={200} colors={['#bbff33','#84d600','#22c55e','#a3f007']} />}
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-4 animate-bounce-slow">
          {score === 100 ? '🌟' : score >= 80 ? '🎉' : '✅'}
        </div>
        <h2 className="font-display text-3xl text-green-800 mb-1">
          {score === 100 ? 'Perfect!' : score >= 80 ? 'Excellent!' : 'Lesson Passed!'}
        </h2>
        <p className="text-green-500 font-semibold mb-5">
          {score === 100 ? 'Flawless! You\'re on the Band 9 path! 🏆' : score >= 80 ? 'Great work — next lesson unlocked!' : 'You passed! Next lesson is now unlocked.'}
        </p>

        <div className="card mb-5">
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
            {[33, 66, 100].map((threshold, i) => (
              <span key={i} className={`text-3xl ${score >= threshold ? '' : 'grayscale opacity-30'}`}>⭐</span>
            ))}
          </div>
        </div>

        {wrongSlides.length > 0 && (
          <div className="card mb-5 text-left bg-blue-50 border-2 border-blue-200">
            <div className="font-bold text-blue-800 mb-2 text-sm">📖 Review your mistakes:</div>
            {wrongSlides.map((ws, i) => (
              <div key={i} className="mb-2 last:mb-0 p-2 bg-white rounded-xl">
                <div className="text-xs font-bold text-gray-500 mb-1">{ws.question || ws.statement || ws.title}</div>
                <div className="text-xs font-semibold text-green-700 whitespace-pre-line">{ws.explanation || (ws.sentences?.find(s => !s.correct)?.explanation)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-secondary flex-1">← Learn</button>
          <button onClick={onRetry} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Lesson() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()
  const { completeLesson } = useProgress()

  const [started,     setStarted]     = useState(false)
  const [slideIdx,    setSlideIdx]    = useState(0)
  const [selected,    setSelected]    = useState(null)
  const [checked,     setChecked]     = useState(false)
  const [correct,     setCorrect]     = useState(0)
  const [total,       setTotal]       = useState(0)
  const [result,      setResult]      = useState(null)  // null | 'passed' | 'failed'
  const [wrongSlides, setWrongSlides] = useState([])

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

  const { lesson }  = found
  const allSlides   = buildSlides(lesson)
  const slide       = allSlides[slideIdx]
  const progress    = started ? (slideIdx / Math.max(allSlides.length - 1, 1)) * 100 : 0
  const PASS_MARK   = 60

  function resetLesson() {
    setStarted(false)
    setSlideIdx(0)
    setSelected(null)
    setChecked(false)
    setCorrect(0)
    setTotal(0)
    setResult(null)
    setWrongSlides([])
  }

  async function advance() {
    if (slideIdx + 1 >= allSlides.length) {
      const score   = total > 0 ? Math.round((correct / total) * 100) : 0
      const passed  = await completeLesson(lessonId, score)
      setResult(passed ? 'passed' : 'failed')
    } else {
      setSlideIdx(i => i + 1)
      setSelected(null)
      setChecked(false)
    }
  }

  function handleCheck() {
    if (slide.kind === 'mcq') {
      if (!selected) return
      const ok = selected === slide.correct
      setChecked(true)
      setTotal(t => t + 1)
      if (ok) setCorrect(c => c + 1)
      else    setWrongSlides(prev => [...prev, slide])
    }
    if (slide.kind === 'tfng_single') {
      if (!selected) return
      const ok = selected === slide.answer
      setChecked(true)
      setTotal(t => t + 1)
      if (ok) setCorrect(c => c + 1)
      else    setWrongSlides(prev => [...prev, slide])
    }
    if (slide.kind === 'error_correction') {
      if (selected === null) return
      // Correct = user picked the sentence that IS wrong
      const ok = slide.sentences[selected]?.correct === false
      setChecked(true)
      setTotal(t => t + 1)
      if (ok) setCorrect(c => c + 1)
      else    setWrongSlides(prev => [...prev, slide])
    }
  }

  const isQuestionSlide = ['mcq','tfng_single','error_correction'].includes(slide?.kind)
  const canCheck =
    slide?.kind === 'mcq'             ? !!selected :
    slide?.kind === 'tfng_single'     ? !!selected :
    slide?.kind === 'error_correction'? selected !== null :
    false

  // ── Result screens ──
  const finalScore = total > 0 ? Math.round((correct / total) * 100) : 0
  const finalXP    = Math.round((finalScore / 100) * (lesson.xp || 20)) + 10

  if (result === 'failed') return (
    <FailedScreen
      score={finalScore} correct={correct} total={total}
      wrongSlides={wrongSlides}
      onRetry={resetLesson}
      onBack={() => navigate('/learn')}
    />
  )

  if (result === 'passed') return (
    <PassedScreen
      score={finalScore} correct={correct} total={total} xp={finalXP}
      wrongSlides={wrongSlides}
      onRetry={resetLesson}
      onBack={() => navigate('/learn')}
    />
  )

  // ── Intro (pre-start) ──
  if (!started) return (
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

  // ── Main lesson ──
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
        <div className="flex items-center gap-1 bg-lime-50 rounded-full px-2.5 py-1 shrink-0">
          <Zap className="w-3.5 h-3.5 text-lime-600" />
          <span className="font-bold text-lime-700 text-sm">{slideIdx}/{allSlides.length - 1}</span>
        </div>
        {total > 0 && (
          <div className="font-bold text-xs text-green-600 bg-green-50 rounded-full px-2.5 py-1 shrink-0">
            {correct}/{total} ✓
          </div>
        )}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {slide?.kind === 'explainer'       && <ExplainerSlide       slide={slide} onNext={advance} />}
        {slide?.kind === 'flashcard'       && <FlashcardSlide       slide={slide} onNext={advance} />}
        {slide?.kind === 'passage'         && <PassageSlide         slide={slide} onNext={advance} />}
        {slide?.kind === 'mcq'             && <MCQSlide             slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
        {slide?.kind === 'tfng_single'     && <TFNGSlide            slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
        {slide?.kind === 'error_correction'&& <ErrorCorrectionSlide slide={slide} checked={checked} selected={selected} setSelected={setSelected} />}
      </div>

      {/* Bottom button — only for question slides */}
      {isQuestionSlide && (
        <div className="sticky bottom-0 bg-white border-t-2 border-lime-200 p-4 max-w-lg mx-auto w-full">
          {!checked ? (
            <button onClick={handleCheck} disabled={!canCheck}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
              Check Answer
            </button>
          ) : (
            <button onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
              {slideIdx + 1 >= allSlides.length ? '🎉 See Results' : 'Continue'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
