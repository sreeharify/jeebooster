import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { useAuth } from '../contexts/AuthContext'
import { X, Zap, ChevronRight, BookOpen, Lightbulb, RotateCcw } from 'lucide-react'
import { COURSE_DATA } from '../data/courseData'
import Confetti from 'react-confetti'

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function findLesson(id) {
  for (const s of COURSE_DATA) for (const u of s.units) {
    const l = u.lessons.find(l => l.id === id)
    if (l) return { lesson: l, unit: u, section: s }
  }
  return null
}
function bandLabel(b) {
  if (b <= 6) return { label:'Band 6 — Foundation', color:'bg-orange-400', text:'text-orange-700', bg:'bg-orange-50', emoji:'🌱' }
  if (b === 7) return { label:'Band 7 — Developing', color:'bg-yellow-400', text:'text-yellow-700', bg:'bg-yellow-50', emoji:'🌿' }
  if (b === 8) return { label:'Band 8 — Advanced', color:'bg-green-500', text:'text-green-700', bg:'bg-green-50', emoji:'🌳' }
  return { label:'Band 9 — Expert', color:'bg-lime-500', text:'text-lime-700', bg:'bg-lime-50', emoji:'🏆' }
}
const TYPE_ICON = { vocab:'📝',grammar:'⚡',reading:'👁️',quiz:'❓',fill:'✏️',writing:'✍️',speaking:'🗣️',test:'📋',mock:'🏅',listen:'🎧',info:'📖',match:'🔗',interactive:'🎮' }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

// ─────────────────────────────────────────────────────────────
//  LESSON CONTENT FACTORY
// ─────────────────────────────────────────────────────────────
function buildSlides(lesson) {
  const slides = [{ kind:'intro', title:lesson.title, icon:TYPE_ICON[lesson.type]||'📚',
    what: getWhatYouLearn(lesson), tip: getQuickTip(lesson.type) }]
  slides.push(...getContent(lesson))
  return slides
}

function getWhatYouLearn(l) {
  return { vocab:'Master academic vocabulary for Band 7–9 answers.',
    grammar:'Practise grammar structures examiners reward at Band 7+.',
    reading:'Build strategies to read passages fast and accurately.',
    quiz:'Test your IELTS exam knowledge.',
    writing:'Learn techniques that push your writing to Band 8+.',
    speaking:'Build fluency and natural response skills.',
  }[l.type] || `Develop skills for: ${l.title}`
}
function getQuickTip(t) {
  return { vocab:'💡 Always read the example sentence — context makes words stick!',
    grammar:'💡 After each question, make your own sentence with the new structure.',
    reading:'💡 Skim first (30 sec), then read questions, then scan — never read everything first.',
    quiz:'💡 Read ALL options before choosing — eliminate obviously wrong ones first.',
    writing:'💡 One fully-developed idea beats three shallow ones every time.',
    speaking:'💡 Point → Reason → Example. Always extend your answers.',
  }[t] || '💡 Read carefully and trust your instincts!'
}

// ─────────────────────────────────────────────────────────────
//  CONTENT PER LESSON TYPE
// ─────────────────────────────────────────────────────────────
function getContent(lesson) {
  const t = lesson.type

  if (t === 'vocab') return buildVocabLesson()
  if (t === 'grammar') return buildGrammarLesson(lesson)
  if (t === 'reading') return buildReadingLesson()
  if (t === 'quiz') return buildQuizLesson()
  if (t === 'writing') return buildWritingLesson()
  if (t === 'speaking') return buildSpeakingLesson()
  return buildDefaultLesson(lesson)
}

// ══════════════════════════════════════════════════════════════
//  VOCABULARY LESSON
// ══════════════════════════════════════════════════════════════
function buildVocabLesson() {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'📚 What is Lexical Resource?',
    sections:[
      { heading:'Why it matters', body:'Lexical Resource is one of four equally-weighted criteria in IELTS Writing and Speaking (25% each). It measures not just WHAT words you know, but HOW flexibly and accurately you use them.' },
      { heading:'The band difference', body:'Band 6 uses common words correctly but repetitively.\nBand 7 uses some less common vocabulary with occasional errors.\nBand 8 uses a wide range with only minor inaccuracies.\nBand 9 uses vocabulary with full flexibility and precise meaning.' },
    ],
    highlight:'The examiner is NOT counting rare words. They\'re looking for natural, confident use of a wide range.',
    example:{ wrong:'The problem is very bad. It is a bad problem that causes bad things.',
              right:'The issue is increasingly severe, exacerbating existing social inequalities and undermining long-term economic stability.' }
  })

  // Word 1: mitigate
  slides.push({ kind:'flashcard', band:6, word:'mitigate',
    meaning:'to reduce the severity or seriousness of something',
    example:'Governments must take action to mitigate the effects of climate change.',
    partOfSpeech:'verb', wrong:'to make something worse (that\'s "exacerbate")',
    collocations:['mitigate the effects', 'mitigate the impact', 'mitigate risk', 'mitigate damage'],
    family:['mitigation (n)', 'mitigating (adj) — mitigating circumstances'],
  })
  slides.push({ kind:'mini_explainer', band:6,
    title:'💡 Remember: mitigate vs exacerbate',
    body:'These two are often confused and frequently appear in IELTS.\n\n✅ mitigate = make LESS severe → "reduce, lessen, ease"\n❌ exacerbate = make MORE severe → "worsen, aggravate, intensify"\n\nThey are antonyms — opposite meanings.',
    quick:[{ label:'mitigate the damage', icon:'✅' },{ label:'exacerbate the damage', icon:'❌' }]
  })
  slides.push({ kind:'mcq', band:6,
    question:'Which sentence uses "mitigate" correctly?',
    options:['The new law will mitigate the crime rate significantly.','The drought mitigated the water shortage.','Urban trees can mitigate the effects of air pollution.','Stress can mitigate health problems.'],
    correct:'Urban trees can mitigate the effects of air pollution.',
    explanation:'✅ Trees REDUCE air pollution — that fits "mitigate" perfectly.\n\n❌ "The new law will mitigate the crime rate" — you mitigate effects/impacts, not rates directly. Better: "reduce the crime rate"\n❌ "The drought mitigated the water shortage" — a drought CAUSES a shortage, not reduces it\n❌ "Stress can mitigate health problems" — stress WORSENS health; use "exacerbate"',
    hint:'Mitigate always makes something LESS bad, not more bad.'
  })

  // Word 2: exacerbate
  slides.push({ kind:'flashcard', band:7, word:'exacerbate',
    meaning:'to make a problem or bad situation worse',
    example:'Poor housing conditions can exacerbate mental health issues.',
    partOfSpeech:'verb', wrong:'to solve or improve something',
    collocations:['exacerbate the problem', 'exacerbate tensions', 'exacerbate inequality', 'exacerbate symptoms'],
    family:['exacerbation (n)'],
  })
  slides.push({ kind:'fill_blank', band:7,
    sentence:'Social media can _______ feelings of loneliness among teenagers.',
    blanks:[{ correct:'exacerbate', distractors:['mitigate','alleviate','reduce'] }],
    explanation:'Social media makes loneliness WORSE for many teenagers — "exacerbate" is the only word that means "worsen".\n\n"Mitigate" and "alleviate" both mean to reduce/lessen. "Reduce" is too simple for Band 7+.',
    hint:'Social media makes loneliness better or worse?'
  })

  // Word 3: ubiquitous
  slides.push({ kind:'flashcard', band:7, word:'ubiquitous',
    meaning:'present, appearing, or found everywhere',
    example:'Smartphones have become ubiquitous in modern society.',
    partOfSpeech:'adjective', wrong:'very rare or hard to find',
    collocations:['become ubiquitous', 'ubiquitous presence', 'increasingly ubiquitous', 'ubiquitous in modern life'],
    family:['ubiquity (n) — "the ubiquity of social media"'],
  })
  slides.push({ kind:'reorder_sentence', band:7,
    instruction:'Arrange the words to make a correct sentence:',
    words:['become', 'Technology', 'in', 'ubiquitous', 'has', 'the', 'workplace', 'modern'],
    correct:'Technology has become ubiquitous in the modern workplace.',
    explanation:'The correct structure is: Subject (Technology) + auxiliary (has) + verb (become) + adjective (ubiquitous) + prepositional phrase (in the modern workplace).\n\nNote the article "the" before "modern workplace" — we say "the modern workplace" as a concept.',
    hint:'Start with "Technology has..."'
  })

  // Word 4: proliferate
  slides.push({ kind:'flashcard', band:8, word:'proliferate',
    meaning:'to increase rapidly in numbers or amount',
    example:'Fast food chains have proliferated across developing nations.',
    partOfSpeech:'verb', wrong:'to decrease or disappear',
    collocations:['proliferate rapidly', 'continue to proliferate', 'proliferate across', 'proliferate in urban areas'],
    family:['proliferation (n) — "the proliferation of social media platforms"', 'proliferating (adj)'],
  })
  slides.push({ kind:'match_pairs', band:8,
    instruction:'Match each word to its correct meaning:',
    pairs:[
      { word:'mitigate',     meaning:'reduce the severity of' },
      { word:'exacerbate',   meaning:'make a problem worse' },
      { word:'ubiquitous',   meaning:'found everywhere' },
      { word:'proliferate',  meaning:'increase rapidly in number' },
    ],
    explanation:'These four words form a powerful vocabulary cluster. Knowing them all helps you discuss problems and changes at Band 8 level.'
  })

  // Word 5: substantiate
  slides.push({ kind:'flashcard', band:9, word:'substantiate',
    meaning:'to provide evidence to support or prove something',
    example:'The researcher substantiated her claims with longitudinal data.',
    partOfSpeech:'verb', wrong:'to question or doubt something',
    collocations:['substantiate a claim', 'substantiate an argument', 'substantiate with evidence', 'well-substantiated'],
    family:['substantiation (n)', 'substantiated (adj)', 'unsubstantiated (adj) — "unsubstantiated claims"'],
  })
  slides.push({ kind:'error_correction', band:9,
    title:'✏️ Spot the Vocabulary Error',
    instruction:'One sentence uses a word incorrectly. Which one?',
    sentences:[
      { text:'The study substantiated the link between diet and longevity.', correct:true },
      { text:'Deforestation has substantiated the problem of climate change.', correct:false,
        explanation:'"Substantiate" means to PROVE or SUPPORT with evidence — it doesn\'t mean to worsen or cause something.\n\n✅ Correct: "Deforestation has exacerbated the problem of climate change."\n\nThis is a common Band 6 error — using sophisticated words without understanding their precise meaning.' },
      { text:'She failed to substantiate her argument with concrete examples.', correct:true },
    ]
  })

  slides.push({ kind:'explainer', band:8,
    title:'🔑 Using These Words in IELTS Writing',
    sections:[
      { heading:'In introductions', body:'Avoid: "There are many problems with technology."\nBetter: "While technological advancements have proliferated across all sectors, they have simultaneously exacerbated pre-existing social inequalities."' },
      { heading:'In body paragraphs', body:'Avoid: "The government should do something about pollution."\nBetter: "Governments must implement comprehensive strategies to mitigate the environmental impact of industrial expansion — a claim well-substantiated by recent climate research."' },
    ],
    highlight:'One sophisticated word used correctly is worth more than five simple words. Quality always beats quantity.',
  })

  slides.push({ kind:'mcq', band:8,
    question:'Which sentence demonstrates the BEST lexical resource for Band 8?',
    options:[
      'Technology is a very important thing in our lives nowadays.',
      'The proliferation of digital devices has fundamentally transformed how we communicate.',
      'There are more and more technologies that people use a lot.',
      'Technology has become very, very common in modern daily life.',
    ],
    correct:'The proliferation of digital devices has fundamentally transformed how we communicate.',
    explanation:'✅ "Proliferation" (sophisticated noun), "digital devices" (precise), "fundamentally transformed" (strong verb phrase), "communicate" (precise verb).\n\n❌ The others use vague words: "important thing", "a lot", "very, very common" — all Band 5–6 language.\n\nBand 8+ avoids vague intensifiers (very, really, a lot) and replaces them with precise vocabulary.',
    hint:'Look for precise, specific language — not vague or repetitive words.'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  GRAMMAR LESSON
// ══════════════════════════════════════════════════════════════
function buildGrammarLesson(lesson) {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'⚡ Grammar Range & Accuracy',
    sections:[
      { heading:'What examiners look for', body:'The GRA (Grammatical Range and Accuracy) criterion is 25% of your Writing and Speaking score. It\'s not just about being error-free — it\'s about using a VARIETY of structures.' },
      { heading:'The progression', body:'Band 6: Uses mostly simple sentences with some complex ones. Errors are common.\nBand 7: Uses complex sentences with some errors in complex structures.\nBand 8: Uses a wide range of structures. Errors are rare.\nBand 9: Full range of structures with natural, consistent accuracy.' },
    ],
    highlight:'You don\'t need perfect grammar. You need RANGE. Show the examiner you CAN use complex structures.',
    example:{ wrong:'Technology is good. It helps people. But it has problems too. These problems are many.',
              right:'Although technology has undeniably improved quality of life, the challenges it introduces — particularly regarding privacy and social isolation — demand equally thoughtful solutions.' }
  })

  slides.push({ kind:'mini_explainer', band:6,
    title:'🔗 Complex Sentences: The Foundation',
    body:'A complex sentence has a MAIN clause + a SUBORDINATE clause connected by a subordinating conjunction.\n\nThink of it like this:\nMain clause = can stand alone ✅\nSubordinate clause = cannot stand alone ❌\n\nExample:\n"Although technology is useful (sub.) ← , it creates problems." (main) ✅\n"Although technology is useful." ← WRONG — incomplete thought ❌',
    quick:[
      { label:'Contrast: although, whereas, even though', icon:'↔️' },
      { label:'Cause: because, since, as, given that', icon:'➡️' },
      { label:'Condition: if, unless, provided that', icon:'❓' },
      { label:'Time: when, after, before, once, until', icon:'⏰' },
    ]
  })

  slides.push({ kind:'mcq', band:6,
    question:'Which is a correctly formed complex sentence?',
    options:[
      'Although technology is useful, it creates challenges.',
      'Although, technology is useful. It creates challenges.',
      'Technology is useful although, it creates challenges.',
      'Although technology. It is useful and creates challenges.',
    ],
    correct:'Although technology is useful, it creates challenges.',
    explanation:'✅ Correct structure: Subordinate clause (Although + S + V) + comma + Main clause\n\n❌ Option B: Never put a comma directly after "Although"\n❌ Option C: The comma belongs BEFORE "although" only when the main clause comes FIRST\n❌ Option D: "Although technology" has no verb — it\'s not a clause\n\nRule: When the subordinate clause comes FIRST, put a comma after it. When it comes SECOND, no comma needed.',
    hint:'The subordinate clause with "Although" must have a subject and verb.'
  })

  slides.push({ kind:'fill_blank', band:6,
    sentence:'_____ the government invested in education, literacy rates would improve significantly.',
    blanks:[{ correct:'If', distractors:['Although','Because','Whereas'] }],
    explanation:'"If" introduces a condition (first or second conditional).\n\n"Although" = contrast, "Because" = cause/reason, "Whereas" = comparison.\n\nThis sentence structure is: If + [condition], [result] — a basic first/second conditional.',
    hint:'This sentence shows a condition and a result — which word introduces conditions?'
  })

  slides.push({ kind:'explainer', band:7,
    title:'🔄 Passive Voice in Academic Writing',
    sections:[
      { heading:'When to use it', body:'Passive voice makes academic writing more objective and formal. Use it when:\n• The doer is unknown or unimportant\n• You want to emphasise the action/result\n• Standard academic convention requires it' },
      { heading:'Structure', body:'Active:  Subject + verb + object\n"Researchers conducted the study."\n\nPassive: Object + be + past participle [+ by + agent]\n"The study was conducted [by researchers]."' },
      { heading:'Tense forms', body:'Present: is/are + pp → "Data is collected daily"\nPast: was/were + pp → "The experiment was conducted"\nPerfect: has/have been + pp → "Results have been published"' },
    ],
    highlight:'In IELTS Task 1 (describing graphs), passive voice is very natural: "A sharp increase was recorded in 2020."',
    example:{ wrong:'We can see that the researchers found interesting results in the data.',
              right:'Notably, the findings reveal a statistically significant correlation — a result that has since been substantiated by three independent studies.' }
  })

  slides.push({ kind:'reorder_sentence', band:7,
    instruction:'Rearrange to form a correct passive sentence:',
    words:['been', 'has', 'significantly', 'The', 'environment', 'damaged', 'human', 'by', 'activity'],
    correct:'The environment has been significantly damaged by human activity.',
    explanation:'Structure: The environment (subject) + has been (present perfect passive) + significantly (adverb) + damaged (past participle) + by human activity (agent phrase).\n\nNote: "significantly" goes AFTER "been" and BEFORE "damaged" — adverbs in passive sentences go between the auxiliary and the past participle.',
    hint:'Start with "The environment has been..."'
  })

  slides.push({ kind:'mini_explainer', band:7,
    title:'🎯 Conditionals: The Four Types',
    body:'Type 0 — Always true: "If you heat water to 100°C, it boils."\nType 1 — Real future: "If temperatures rise, sea levels will increase."\nType 2 — Hypothetical present: "If governments invested more, outcomes would improve."\nType 3 — Hypothetical past: "If action had been taken sooner, the crisis could have been avoided."',
    quick:[
      { label:'Type 2: If + past → would + infinitive', icon:'💡' },
      { label:'Type 3: If + past perfect → would have + pp', icon:'💡' },
    ]
  })

  slides.push({ kind:'mcq', band:7,
    question:'Which sentence is a correctly formed SECOND conditional?',
    options:[
      'If the government will invest in renewables, emissions will fall.',
      'If the government invested in renewables, emissions would fall.',
      'If the government had invested in renewables, emissions would fall.',
      'If the government invests in renewables, emissions fall.',
    ],
    correct:'If the government invested in renewables, emissions would fall.',
    explanation:'✅ Second conditional: If + PAST SIMPLE (invested) + comma + would + INFINITIVE (fall)\n\nThis expresses a hypothetical or unlikely present/future situation.\n\n❌ Option A uses "will" in both clauses — this would be first conditional but is grammatically wrong\n❌ Option C uses "had invested" — this is third conditional (hypothetical past)\n❌ Option D is zero conditional (always true facts)',
    hint:'Second conditional: If + past simple... would + bare infinitive.'
  })

  slides.push({ kind:'error_correction', band:8,
    title:'✏️ Find the Grammar Error',
    instruction:'Identify the sentence that contains a grammatical mistake:',
    sentences:[
      { text:'Despite the challenges, the project was completed on time.', correct:true },
      { text:'Despite of the challenges, the project was completed on time.', correct:false,
        explanation:'"Despite" NEVER takes "of".\n\n✅ Correct: "Despite the challenges..."\n✅ Or: "In spite of the challenges..."\n\n"Despite of" is one of the most common errors in IELTS Band 6–7 essays. Memorise: DESPITE + noun/noun phrase. IN SPITE OF + noun/noun phrase.' },
      { text:'Although the project faced setbacks, it was completed successfully.', correct:true },
      { text:'Provided that funding is secured, the project will proceed.', correct:true },
    ]
  })

  slides.push({ kind:'match_pairs', band:8,
    instruction:'Match each sentence beginning to the correct ending:',
    pairs:[
      { word:'Although technology has many benefits,',  meaning:'it also presents significant challenges.' },
      { word:'Were the government to invest more,',     meaning:'outcomes would improve considerably.' },
      { word:'Not only does social media connect people,', meaning:'but it also spreads misinformation.' },
      { word:'Having considered all the evidence,',     meaning:'I firmly believe action must be taken.' },
    ],
    explanation:'These are all sophisticated sentence starters:\n• "Although..." = concessive clause (contrast)\n• "Were the government to..." = formal conditional inversion (Band 8+)\n• "Not only does..." = negative inversion (Band 8+)\n• "Having considered..." = perfect participle clause (Band 8+)'
  })

  slides.push({ kind:'mcq', band:9,
    question:'Which sentence uses INVERSION correctly for emphasis?',
    options:[
      'I have never seen such remarkable progress.',
      'Never I have seen such remarkable progress.',
      'Never have I seen such remarkable progress.',
      'Have never I seen such remarkable progress.',
    ],
    correct:'Never have I seen such remarkable progress.',
    explanation:'✅ Inversion after negative adverbs: NEVER + AUXILIARY (have) + SUBJECT (I) + MAIN VERB (seen)\n\nInversion is triggered by negative adverbs at the START of a sentence: Never, Rarely, Seldom, Hardly, No sooner, Not only, Under no circumstances.\n\nThis is a Band 8–9 structure — using it correctly shows the examiner your grammatical range.',
    hint:'After "Never" at the start of a sentence, flip the auxiliary and subject.'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  READING LESSON
// ══════════════════════════════════════════════════════════════
function buildReadingLesson() {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'👁️ IELTS Reading: The Smart Approach',
    sections:[
      { heading:'The big mistake', body:'Most students read the whole passage first, then answer questions. This wastes 10–15 minutes and often causes panic.' },
      { heading:'The smart strategy', body:'Step 1: Skim the passage (60 sec) — read first/last sentences of each paragraph only\nStep 2: Read ALL the questions carefully\nStep 3: Scan for specific answers — use keywords from questions' },
      { heading:'Key insight', body:'You don\'t need to understand every word. You need to locate information efficiently.' },
    ],
    highlight:'Questions follow the order of the passage (mostly). Work through the passage from top to bottom.',
  })

  slides.push({ kind:'mini_explainer', band:6,
    title:'✅ True / False / Not Given — The Trickiest Type',
    body:'TRUE: The statement agrees with the passage\nFALSE: The passage says the OPPOSITE\nNOT GIVEN: The passage doesn\'t mention this at all\n\nThe key distinction:\nFALSE = text contradicts → "many" vs "all"\nNOT GIVEN = topic simply absent from text\n\nCommon trap: "I know this is false in real life" doesn\'t matter. Only what the TEXT says.',
    quick:[
      { label:'TRUE: matches the text', icon:'✅' },
      { label:'FALSE: contradicts the text', icon:'❌' },
      { label:'N/G: not mentioned anywhere', icon:'❓' },
    ]
  })

  const passage = `The concept of "nudge theory," developed by behavioural economists Richard Thaler and Cass Sunstein, proposes that subtle changes to the way choices are presented can significantly influence human behaviour without restricting freedom of choice. Unlike traditional policy approaches that rely on legislation or financial incentives, nudge theory works by redesigning "choice architectures" — the environments in which decisions are made.

A classic example is the placement of healthier foods at eye level in canteens. Research consistently demonstrates that people are more likely to select whichever option requires the least effort. By making the healthier choice the default — the path of least resistance — nudge theory achieves behaviour change through environment design rather than instruction.

Critics of nudge theory argue that it is inherently paternalistic, subtly manipulating individuals without their explicit consent. They contend that while choice is technically preserved, the deliberate design of choice environments to favour particular outcomes undermines genuine autonomy. Proponents counter that all choice environments are already designed — the question is merely whether that design is intentional and beneficial.`

  slides.push({ kind:'passage', band:6,
    label:'📖 Read carefully — questions follow',
    text: passage,
    tip:'Tip: As you read, ask yourself: "What is each paragraph mainly about?" Skim for structure first.'
  })

  slides.push({ kind:'mini_explainer', band:6,
    title:'🔍 Reading Tip: Paraphrase Alert',
    body:'IELTS questions NEVER use the exact words from the passage. They always paraphrase.\n\nExample:\nPassage says: "subtle changes to the way choices are presented"\nQuestion says: "minor modifications to how options are displayed"\n\nSame meaning — different words. Always look for MEANING, not matching words.',
    quick:[{ label:'Train yourself to think: what does this MEAN?', icon:'💡' }]
  })

  slides.push({ kind:'tfng_single', band:6,
    statement:'Nudge theory relies primarily on financial incentives to change behaviour.',
    answer:'False',
    passage,
    explanation:'The passage explicitly states: "Unlike traditional policy approaches that rely on... financial incentives, nudge theory works by redesigning \'choice architectures\'" — this directly contradicts the statement.'
  })

  slides.push({ kind:'tfng_single', band:6,
    statement:'The placement of food in canteens can influence what people choose to eat.',
    answer:'True',
    passage,
    explanation:'"Research consistently demonstrates that people are more likely to select whichever option requires the least effort" + the canteen eye-level example confirms this is true.'
  })

  slides.push({ kind:'tfng_single', band:7,
    statement:'Thaler and Sunstein conducted experiments in school canteens.',
    answer:'Not Given',
    passage,
    explanation:'The passage mentions them as developers of nudge theory but says nothing about them conducting canteen experiments specifically. The canteen example is cited as research, not linked to them directly.\n\nNot Given ≠ False. The passage simply doesn\'t address this claim.'
  })

  slides.push({ kind:'mcq', band:7,
    question:'According to the passage, what is a "choice architecture"?',
    options:[
      'A type of building designed for making decisions',
      'The environment in which decisions are made',
      'A financial incentive to encourage healthy choices',
      'A legal framework for regulating behaviour',
    ],
    correct:'The environment in which decisions are made',
    explanation:'Directly defined in the text: "redesigning \'choice architectures\' — the environments in which decisions are made"\n\nThis is a DEFINITION question. Always look for where the passage defines a term — often signalled by a dash (—) or "which means..." or "refers to..."',
    hint:'The passage defines "choice architectures" with a dash — look for that definition.'
  })

  slides.push({ kind:'mcq', band:8,
    question:'What is the critics\' main objection to nudge theory?',
    options:[
      'It does not work in practice',
      'It is too expensive to implement',
      'It manipulates people without their knowledge',
      'It limits the range of choices available',
    ],
    correct:'It manipulates people without their knowledge',
    explanation:'"subtly manipulating individuals without their explicit consent" — this is the critics\' core objection.\n\n❌ "limits the range of choices" — critics actually say choice IS technically preserved, just influenced\n❌ "does not work" — the passage doesn\'t say this\n❌ "too expensive" — not mentioned\n\nFor opinion/viewpoint questions: find who is speaking (critics, proponents, researchers) and what they specifically say.',
    hint:'Find the paragraph that talks about "critics" — what specific objection do they raise?'
  })

  slides.push({ kind:'reorder_sentence', band:8,
    instruction:'Put these summary sentences in the order they appear in the passage:',
    words:['Nudge theory achieves change without restricting choice (Para 1)', 'Making healthy food easier to reach influences selection (Para 2)', 'Critics call nudge theory paternalistic (Para 3)'],
    isOrdering:true,
    correct:'Nudge theory achieves change without restricting choice (Para 1)|Making healthy food easier to reach influences selection (Para 2)|Critics call nudge theory paternalistic (Para 3)',
    explanation:'This reflects the passage structure:\n1. Definition and core concept\n2. Concrete example\n3. Critical perspective\n\nUnderstanding paragraph structure helps you predict where answers are located — saving valuable exam time.',
    hint:'Think about what order makes logical sense for explaining a concept.'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  QUIZ LESSON
// ══════════════════════════════════════════════════════════════
function buildQuizLesson() {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'📋 Know Your Exam Inside Out',
    sections:[
      { heading:'Why this matters', body:'Students who understand the exam format score higher — not because the questions are easier, but because they manage time better, know what\'s expected, and don\'t waste energy being confused by instructions.' },
      { heading:'IELTS overview', body:'🎧 Listening: 30 min + 10 min transfer = 40 questions\n👁️ Reading: 60 min = 40 questions across 3 passages\n✍️ Writing: 60 min = Task 1 (150+ words) + Task 2 (250+ words)\n🗣️ Speaking: 11–14 min = 3 parts' },
    ],
    highlight:'Academic and General Training tests differ in Reading and Writing Task 1. Always confirm which you\'re taking!'
  })

  slides.push({ kind:'mcq', band:6,
    question:'How many sections does the IELTS Listening test have?',
    options:['2','3','4','5'],
    correct:'4',
    explanation:'The 4 sections increase in difficulty:\nSection 1: Everyday conversation (e.g. booking a service)\nSection 2: Monologue about everyday topic (e.g. tour guide)\nSection 3: Discussion in educational/training context\nSection 4: Academic lecture or talk',
    hint:'Think about how IELTS progressively gets harder through the test.'
  })

  slides.push({ kind:'match_pairs', band:6,
    instruction:'Match each IELTS section to its correct time allocation:',
    pairs:[
      { word:'Listening',  meaning:'30 minutes + 10 min transfer' },
      { word:'Reading',    meaning:'60 minutes' },
      { word:'Writing',    meaning:'60 minutes' },
      { word:'Speaking',   meaning:'11–14 minutes' },
    ],
    explanation:'Total test time: approximately 2h 45min (not including speaking, which is usually on a different day).'
  })

  slides.push({ kind:'mini_explainer', band:7,
    title:'🎯 The 4 IELTS Writing Criteria',
    body:'Each criterion is worth exactly 25% of your Writing score:\n\n🎯 Task Achievement (Task 2) / Task Response (Task 1)\n→ Did you answer ALL parts of the question?\n\n🔗 Coherence & Cohesion\n→ Is your writing logically organised with clear paragraphing?\n\n📚 Lexical Resource\n→ Do you use a RANGE of vocabulary accurately?\n\n⚡ Grammatical Range & Accuracy\n→ Do you use VARIED structures with few errors?',
    quick:[{ label:'Missing any criterion tanks your overall score', icon:'⚠️' }]
  })

  slides.push({ kind:'mcq', band:7,
    question:'In IELTS Speaking, what does the examiner assess in Part 2?',
    options:[
      'Grammar only',
      'Fluency, Lexical Resource, Grammar, and Pronunciation equally',
      'Content knowledge about the topic',
      'Pronunciation and accent only',
    ],
    correct:'Fluency, Lexical Resource, Grammar, and Pronunciation equally',
    explanation:'All 4 criteria are assessed equally (25% each) throughout the entire speaking test:\n• Fluency & Coherence\n• Lexical Resource\n• Grammatical Range & Accuracy\n• Pronunciation\n\nNot just in Part 2 — all parts are assessed on all criteria.',
    hint:'The speaking criteria mirror the writing criteria but include Pronunciation instead of Task Achievement.'
  })

  slides.push({ kind:'fill_blank', band:7,
    sentence:'In IELTS Task 1, you should spend approximately _____ minutes and write at least _____ words.',
    blanks:[
      { correct:'20', distractors:['15','30','45'] },
      { correct:'150', distractors:['100','200','250'] },
    ],
    explanation:'Task 1 = 20 minutes, 150+ words\nTask 2 = 40 minutes, 250+ words\n\nWhy 40 minutes for Task 2? Because it\'s worth more marks — roughly double the mark allocation of Task 1. Always do Task 2 first if you\'re running short on time.',
    hint:'Task 2 gets 40 minutes and 250 words — Task 1 gets half that.'
  })

  slides.push({ kind:'mcq', band:8,
    question:'What does "Not Given" mean in IELTS Reading True/False/Not Given questions?',
    options:[
      'The statement is incorrect',
      'The passage contradicts the statement',
      'The information is not mentioned anywhere in the passage',
      'The statement cannot be verified',
    ],
    correct:'The information is not mentioned anywhere in the passage',
    explanation:'"Not Given" is the most misunderstood answer type.\n\nNOT GIVEN = the passage simply does not address this topic\nFALSE = the passage says the OPPOSITE\n\nCommon trap: students see "Not Given" and think "well that seems unlikely to be true, so it must be False." Wrong — your outside knowledge is irrelevant. Only what the TEXT says matters.',
    hint:'Ask yourself: "Does the passage address this topic at all?" Not: "Is this true in real life?"'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  WRITING LESSON
// ══════════════════════════════════════════════════════════════
function buildWritingLesson() {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'✍️ Task 2 Essay Structure',
    sections:[
      { heading:'The non-negotiable structure', body:'Introduction (50–70 words)\n↓\nBody Paragraph 1 — Main argument (90–120 words)\n↓\nBody Paragraph 2 — Second argument or counterargument (90–120 words)\n↓\nConclusion (40–60 words)\n\nTotal: 250–320 words is the ideal range.' },
      { heading:'What to write in the introduction', body:'Sentence 1: Paraphrase the question topic (NEVER copy)\nSentence 2: State your position or outline both sides\nOptional Sentence 3: Preview your main arguments' },
    ],
    highlight:'The most common Band 5–6 mistake: not answering ALL parts of the question. Read it twice before writing.',
    example:{ wrong:'Technology is very good and very bad. I will discuss this essay.',
              right:'While technological innovation has undeniably transformed modern society for the better, its rapid proliferation has simultaneously raised serious concerns regarding privacy and human connection that warrant careful consideration.' }
  })

  slides.push({ kind:'mini_explainer', band:6,
    title:'🔗 Cohesive Devices: Using Them Correctly',
    body:'Cohesive devices link ideas and show your reasoning — but OVERUSE is penalised.\n\nAdding: Furthermore, Moreover, In addition, Additionally\nContrast: However, Nevertheless, On the other hand, Conversely\nCause: Consequently, Therefore, As a result, Hence\nExample: For instance, For example, To illustrate, A case in point\nConcluding: In conclusion, To summarise, Overall',
    quick:[
      { label:'Vary your devices — don\'t repeat the same one', icon:'🔄' },
      { label:'"Furthermore" ≠ "Moreover" always — use the right one', icon:'💡' },
    ]
  })

  slides.push({ kind:'mcq', band:6,
    question:'Which cohesive device shows RESULT or CONSEQUENCE?',
    options:['Furthermore','However','Consequently','Nevertheless'],
    correct:'Consequently',
    explanation:'"Consequently" introduces a result or consequence of what was just said.\n\nFurthermore = adds more supporting information\nHowever = introduces contrast\nNevertheless = shows contrast despite difficulty (similar to "however" but stronger)\n\nExample: "Air pollution levels have risen dramatically. Consequently, respiratory diseases have become more prevalent."',
    hint:'Think: "as a result of this..." — which word fits that meaning?'
  })

  slides.push({ kind:'fill_blank', band:7,
    sentence:'Urban farming requires significant investment. _______, the long-term environmental benefits may outweigh the initial costs.',
    blanks:[{ correct:'Nevertheless', distractors:['Consequently','Furthermore','Similarly'] }],
    explanation:'"Nevertheless" is perfect here — it says "even though there\'s a problem (high cost), the result (benefits) still stands."\n\nIt\'s stronger and more academic than "However" alone. Use it when you want to say "this difficulty exists, BUT the main point remains valid."',
    hint:'The sentence first gives a problem, then says the benefits still matter — that\'s a contrast/concession.'
  })

  slides.push({ kind:'error_correction', band:7,
    title:'✏️ Find the Writing Error',
    instruction:'One of these sentences contains a common IELTS writing error:',
    sentences:[
      { text:'In conclusion, governments should prioritise renewable energy investment.', correct:true },
      { text:'Despite of the challenges, the policy was implemented successfully.', correct:false,
        explanation:'"Despite" is NEVER followed by "of" in standard English.\n\n✅ Fix: "Despite the challenges, the policy was implemented successfully."\n✅ Or: "In spite of the challenges, the policy was implemented successfully."\n\nThis error appears in approximately 30% of Band 6 essays — eliminating it alone can raise your score.' },
      { text:'Furthermore, the economic benefits of automation are well-documented.', correct:true },
    ]
  })

  slides.push({ kind:'match_pairs', band:8,
    instruction:'Match each essay element to its purpose:',
    pairs:[
      { word:'Introduction',      meaning:'Paraphrase topic + state your position' },
      { word:'Topic sentence',    meaning:'State the main idea of each body paragraph' },
      { word:'Supporting detail', meaning:'Explain and provide evidence for your point' },
      { word:'Conclusion',        meaning:'Restate position + recommend or predict' },
    ],
    explanation:'A well-structured essay shows the examiner you can organise information logically — this directly boosts your Coherence & Cohesion score.\n\nBand 9 essays have CLEAR topic sentences at the start of every body paragraph. Examiners can read just the first sentence of each paragraph and understand the entire argument.'
  })

  slides.push({ kind:'mcq', band:8,
    question:'Which Task 2 introduction is closest to Band 8–9 quality?',
    options:[
      'In this essay, I will discuss the advantages and disadvantages of technology.',
      'Technology is a very important topic. There are many pros and cons.',
      'The question of whether technological advancement serves society\'s interests more than it harms them is one that has attracted considerable debate in recent decades.',
      'I think technology has both good and bad sides, which I will explain in this essay.',
    ],
    correct:'The question of whether technological advancement serves society\'s interests more than it harms them is one that has attracted considerable debate in recent decades.',
    explanation:'✅ Band 8+ introduction features:\n• Complex sentence structure with "whether...or"\n• Sophisticated vocabulary: "technological advancement", "considerable debate"\n• Paraphrases the topic without repeating the question verbatim\n• Does NOT announce "I will discuss..." (avoid meta-commentary)\n• Sets up a nuanced discussion\n\n❌ "In this essay, I will discuss..." is the classic Band 5 opener — never say what you\'re about to do; just do it.',
    hint:'The best introduction paraphrases the topic using sophisticated vocabulary — it never copies the question.'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  SPEAKING LESSON
// ══════════════════════════════════════════════════════════════
function buildSpeakingLesson() {
  const slides = []

  slides.push({ kind:'explainer', band:6,
    title:'🗣️ Speaking Criteria & Strategy',
    sections:[
      { heading:'The 4 criteria (25% each)', body:'🎯 Fluency & Coherence — speak smoothly, organise ideas\n📚 Lexical Resource — range and accuracy of vocabulary\n⚡ Grammatical Range — variety and accuracy of structures\n🔊 Pronunciation — clear, intelligible delivery (not accent!)' },
      { heading:'The biggest mistake', body:'Memorising answers. Examiners are trained to spot them. They will ask unexpected follow-up questions that expose memorised content, and mark you down for lack of spontaneity.' },
    ],
    highlight:'You cannot prepare WHAT to say. You can prepare HOW to say things — language patterns, extending techniques, discourse markers.',
    example:{ wrong:'I like technology because it is very useful and helpful for many things.',
              right:'Technology has genuinely transformed the way I approach everyday tasks — I find it particularly invaluable for staying connected with colleagues abroad, though I do sometimes wonder whether we\'ve become slightly too dependent on it.' }
  })

  slides.push({ kind:'mini_explainer', band:6,
    title:'📢 Extending Answers in Part 1',
    body:'The examiner expects 2–4 sentences per Part 1 answer. Never give one-word or one-sentence replies.\n\nThe P-R-E-L formula:\nP = Point (answer the question directly)\nR = Reason (say why)\nE = Example (give a specific example)\nL = Link (connect back to the question or add a follow-up thought)\n\nQ: "Do you enjoy cooking?"\n❌ "Yes, I do."\n✅ "I genuinely enjoy cooking, mainly because I find it a relaxing way to unwind after work. For example, experimenting with new recipes at the weekend has become something of a hobby. I think there\'s something deeply satisfying about creating something from scratch."',
    quick:[
      { label:'P: Point → R: Reason → E: Example → L: Link', icon:'🔗' },
    ]
  })

  slides.push({ kind:'mcq', band:6,
    question:'Which Part 1 answer demonstrates the best speaking skills?',
    options:[
      '"Yes, I like reading."',
      '"I like reading because it is good."',
      '"I\'m quite an avid reader, actually — I tend to gravitate towards non-fiction, particularly books about psychology and human behaviour. I find that reading before bed helps me unwind, and I\'ve learned a great deal from books I\'d never have encountered otherwise."',
      '"Reading is my hobby. I read books. Books are interesting. I read every day."',
    ],
    correct:'"I\'m quite an avid reader, actually — I tend to gravitate towards non-fiction, particularly books about psychology and human behaviour. I find that reading before bed helps me unwind, and I\'ve learned a great deal from books I\'d never have encountered otherwise."',
    explanation:'✅ The best answer uses:\n• "actually" — natural discourse marker\n• "quite an avid reader" — precise vocabulary (avid = enthusiastic)\n• "tend to gravitate towards" — sophisticated verb phrase\n• Specific genre + specific reason + personal reflection\n• Natural, flowing sentences\n\n❌ The others are too short, too vague, or repetitive.',
    hint:'Look for the answer that gives specific details and uses varied, precise language.'
  })

  slides.push({ kind:'match_pairs', band:7,
    instruction:'Match each speaking phrase to its function:',
    pairs:[
      { word:'"That\'s an interesting question — let me think..."', meaning:'Buying thinking time naturally' },
      { word:'"What I mean is..."',                                meaning:'Self-correcting or clarifying' },
      { word:'"Not only that, but..."',                           meaning:'Adding a second connected point' },
      { word:'"Having said that..."',                             meaning:'Introducing a contrast or nuance' },
    ],
    explanation:'These discourse markers signal to the examiner that you\'re thinking in English — not translating. Using them naturally (not robotically) is a marker of Band 7+ fluency.\n\nKey word: NATURALLY. If they sound rehearsed, they lose their effect.'
  })

  slides.push({ kind:'mcq', band:8,
    question:'In Part 3, the examiner asks: "Do you think social media has changed the way people form friendships?" Which response is closest to Band 8?',
    options:[
      '"Yes, social media changed friendships a lot. People use it to talk to friends."',
      '"I think social media is both good and bad for friendships. It has advantages and disadvantages."',
      '"It\'s a nuanced question. While digital platforms have undeniably broadened the scope of who we can connect with, there\'s a compelling argument that the depth of those connections has diminished — we have more acquaintances but fewer genuinely close friends."',
      '"Social media is very popular nowadays and everyone uses it for friendships and communication purposes."',
    ],
    correct:'"It\'s a nuanced question. While digital platforms have undeniably broadened the scope of who we can connect with, there\'s a compelling argument that the depth of those connections has diminished — we have more acquaintances but fewer genuinely close friends."',
    explanation:'✅ Band 8 answer features:\n• "It\'s a nuanced question" — shows academic thinking\n• "While...there\'s a compelling argument that..." — complex sentence with concession\n• "undeniably", "compelling" — precise adverbs\n• Specific insight: breadth vs depth of connection\n• No hesitation fillers like "um", "very popular"\n\nBand 8 speaks in structured, specific, nuanced answers — not generalisations.',
    hint:'The best Part 3 answer shows depth of thought, specific vocabulary, and complex sentence structures.'
  })

  return slides
}

// ══════════════════════════════════════════════════════════════
//  DEFAULT (fallback for unlisted types)
// ══════════════════════════════════════════════════════════════
function buildDefaultLesson(lesson) {
  return [
    { kind:'explainer', band:6,
      title:`📖 ${lesson.title}`,
      sections:[
        { heading:'What you\'ll practise', body:`This lesson focuses on: ${lesson.title}\n\nIELTS tests four equally important skills:\n🎧 Listening · 👁️ Reading · ✍️ Writing · 🗣️ Speaking` },
        { heading:'Approach', body:'Work through each question carefully. After checking, read the explanation — even if you got it right, the explanation often contains Band 8+ tips.' },
      ],
      highlight:'There are no penalties for wrong answers in IELTS. Always attempt every question!'
    },
    { kind:'mcq', band:6,
      question:'What is a key feature of Band 8+ academic writing?',
      options:['Using very long sentences','Using a wide range of vocabulary accurately','Writing as many words as possible','Using the same vocabulary throughout'],
      correct:'Using a wide range of vocabulary accurately',
      explanation:'Band 8–9 writing uses vocabulary with "natural flexibility and precision" — meaning the right word in the right context, not just difficult words.\n\nRange = variety. Accuracy = appropriate usage. Both are required.',
      hint:'Think about what "Lexical Resource" actually measures.'
    },
    { kind:'fill_blank', band:7,
      sentence:'The study _______ a significant correlation between diet and mental health outcomes.',
      blanks:[{ correct:'demonstrated', distractors:['said','told','talked'] }],
      explanation:'"Demonstrated" is the correct academic reporting verb.\n\nAcademic verbs for presenting findings:\n• demonstrated, revealed, indicated, suggested, established, confirmed\n\nNEVER use "said" or "told" for research findings — these are informal speech verbs.',
      hint:'Research SHOWS findings — which academic verb means "showed clearly"?'
    },
    { kind:'mcq', band:8,
      question:'Which sentence uses hedging language correctly?',
      options:[
        'The results definitely prove that exercise prevents depression.',
        'The results would appear to suggest a correlation between exercise and improved mental health.',
        'The results say that exercise is maybe good for depression sometimes.',
        'The results confirm absolutely that exercise cures depression always.',
      ],
      correct:'The results would appear to suggest a correlation between exercise and improved mental health.',
      explanation:'"Would appear to suggest" is perfect hedging language — it makes the claim cautiously without overstating certainty.\n\nHedging in academic writing:\n• "would appear to" / "seems to" / "tends to"\n• "suggests" vs "proves"\n• "a correlation" vs "proof"\n\nOverclaiming ("definitely proves", "absolutely confirms") is penalised in academic writing. Real research rarely proves — it suggests.',
      hint:'Academic writing hedges claims — it avoids absolute certainty.'
    },
  ]
}

// ─────────────────────────────────────────────────────────────
//  SLIDE COMPONENTS
// ─────────────────────────────────────────────────────────────

function IntroSlide({ slide, onStart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 text-center max-w-lg mx-auto w-full">
      <div className="text-7xl mb-4 animate-pop">{slide.icon}</div>
      <h2 className="font-display text-3xl text-green-800 mb-2">{slide.title}</h2>
      <p className="text-green-500 font-semibold text-sm mb-6 max-w-xs leading-relaxed">{slide.what}</p>
      <div className="card w-full mb-5 text-left bg-lime-50 border-lime-200">
        <p className="font-semibold text-green-800 text-sm">{slide.tip}</p>
      </div>
      <div className="w-full space-y-2 mb-6">
        {['Starts at Band 6 — beginner-friendly','Builds up to Band 9 step by step','Every mistake explained clearly','Mix of question types to keep it engaging'].map((t,i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <span className="text-lime-500 text-base">✓</span>{t}
          </div>
        ))}
      </div>
      <button onClick={onStart} className="btn-primary w-full py-4 text-lg">Let's Go! 🚀</button>
    </div>
  )
}

function ExplainerSlide({ slide, onNext }) {
  const { label, color } = bandLabel(slide.band || 6)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-y-auto">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3`}>{label}</div>
      <div className="flex items-start gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
        <h3 className="font-display text-xl text-green-800 leading-snug">{slide.title}</h3>
      </div>
      {slide.sections && slide.sections.map((sec, i) => (
        <div key={i} className="mb-3">
          {sec.heading && <div className="font-bold text-green-700 text-xs uppercase tracking-wide mb-1.5">{sec.heading}</div>}
          <div className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-3">
            <p className="text-sm text-green-800 font-semibold whitespace-pre-line leading-relaxed">{sec.body}</p>
          </div>
        </div>
      ))}
      {/* Legacy .body support */}
      {slide.body && !slide.sections && (
        <div className="bg-lime-50 border-2 border-lime-200 rounded-2xl p-3 mb-3">
          <p className="text-sm text-green-800 font-semibold whitespace-pre-line leading-relaxed">{slide.body}</p>
        </div>
      )}
      {slide.highlight && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-3 mb-3 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-yellow-800">{slide.highlight}</p>
        </div>
      )}
      {slide.example && (
        <div className="space-y-2 mb-3">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
            <div className="text-xs font-bold text-red-500 mb-1">❌ Band 5–6 (avoid)</div>
            <p className="text-sm text-red-800 font-semibold italic">{slide.example.wrong}</p>
          </div>
          <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3">
            <div className="text-xs font-bold text-lime-600 mb-1">✅ Band 8+ (aim for this)</div>
            <p className="text-sm text-green-800 font-semibold italic">{slide.example.right}</p>
          </div>
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2 mt-2 shrink-0">
        Got it! <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function MiniExplainerSlide({ slide, onNext }) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-green-100 text-green-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3 flex items-center gap-1">
        <Lightbulb className="w-3.5 h-3.5" /> Quick Note
      </div>
      <h3 className="font-display text-xl text-green-800 mb-3 leading-snug">{slide.title}</h3>
      <div className="card bg-green-50 border-2 border-green-200 mb-3 flex-1">
        <p className="text-sm text-green-800 font-semibold whitespace-pre-line leading-relaxed">{slide.body}</p>
      </div>
      {slide.quick && (
        <div className="space-y-2 mb-3">
          {slide.quick.map((q, i) => (
            <div key={i} className="flex items-center gap-2 bg-lime-50 border border-lime-200 rounded-2xl px-3 py-2">
              <span className="text-lg shrink-0">{q.icon}</span>
              <span className="text-sm font-bold text-green-800">{q.label}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        Continue <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function FlashcardSlide({ slide, onNext }) {
  const [flipped, setFlipped] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { label, color } = bandLabel(slide.band || 7)
  return (
    <div className="flex-1 flex flex-col px-4 py-3 max-w-lg mx-auto w-full">
      <div className={`${color} text-white rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-2`}>{label}</div>
      <p className="text-xs font-bold text-green-500 text-center mb-2 uppercase tracking-wide">Vocabulary — tap card to flip</p>
      <div onClick={() => setFlipped(f => !f)} className="cursor-pointer mb-3" style={{ perspective:'1000px', height:'200px' }}>
        <div className="relative w-full h-full transition-all duration-500" style={{ transformStyle:'preserve-3d', transform:flipped?'rotateY(180deg)':'' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl flex flex-col items-center justify-center shadow-lg p-5" style={{ backfaceVisibility:'hidden' }}>
            <div className="text-white/60 text-xs font-bold mb-2 uppercase tracking-widest">{slide.partOfSpeech || 'word'}</div>
            <div className="font-display text-4xl text-white mb-2">{slide.word}</div>
            <div className="text-white/70 text-sm font-semibold">Tap to reveal →</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 rounded-3xl flex flex-col items-center justify-center shadow-lg p-5" style={{ backfaceVisibility:'hidden', transform:'rotateY(180deg)' }}>
            <div className="text-lime-300 text-xs font-bold mb-1 uppercase tracking-widest">Meaning</div>
            <div className="font-display text-xl text-white text-center mb-2">{slide.meaning}</div>
            <div className="text-white/70 text-xs font-semibold text-center italic">"{slide.example}"</div>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-2.5 mb-2">
        <div className="text-xs font-bold text-orange-600 mb-0.5">⚠️ Don't confuse with:</div>
        <p className="text-xs text-orange-800 font-semibold">{slide.wrong}</p>
      </div>
      <button onClick={() => setShowDetails(s => !s)} className="text-xs font-bold text-lime-600 mb-2 text-left">
        {showDetails ? '▲ Hide' : '▼ Show'} collocations & word family
      </button>
      {showDetails && (
        <div className="space-y-2 mb-2">
          {slide.collocations && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
              <div className="text-xs font-bold text-blue-600 mb-1">Common collocations:</div>
              <div className="flex flex-wrap gap-1">
                {slide.collocations.map((c,i) => <span key={i} className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>)}
              </div>
            </div>
          )}
          {slide.family && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5">
              <div className="text-xs font-bold text-purple-600 mb-1">Word family:</div>
              {slide.family.map((f,i) => <div key={i} className="text-xs text-purple-800 font-semibold">{f}</div>)}
            </div>
          )}
        </div>
      )}
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
        {slide.text.split('\n\n').map((p,i) => (
          <p key={i} className="text-sm text-blue-900 font-semibold leading-relaxed mb-3 last:mb-0">
            <span className="font-bold text-blue-500 mr-1">({String.fromCharCode(65+i)})</span>{p}
          </p>
        ))}
      </div>
      {slide.tip && <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-3 mb-3">
        <p className="text-xs font-bold text-yellow-700">{slide.tip}</p>
      </div>}
      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        Start Questions <ChevronRight className="w-5 h-5" />
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
        {slide.options.map((opt,i) => {
          let cls = 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50'
          if (checked) {
            if (opt===slide.correct) cls='bg-lime-100 border-2 border-lime-500 text-green-900'
            else if (opt===selected) cls='bg-red-100 border-2 border-red-400 text-red-900'
            else cls='bg-gray-50 border-2 border-gray-200 text-gray-400 opacity-50'
          } else if (opt===selected) cls='bg-lime-200 border-2 border-lime-400 text-green-900'
          return (
            <button key={i} onClick={() => !checked && setSelected(opt)}
              className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
              <span className="text-xs font-bold opacity-50 mr-2">{['A','B','C','D'][i]}.</span>{opt}
              {checked&&opt===slide.correct&&<span className="ml-2">✅</span>}
              {checked&&opt===selected&&opt!==slide.correct&&<span className="ml-2">❌</span>}
            </button>
          )
        })}
      </div>
      {!checked&&slide.hint&&<p className="text-xs font-semibold text-lime-600 mt-3 text-center">💡 {slide.hint}</p>}
      {checked&&<div className={`mt-4 p-4 rounded-2xl border-2 ${isCorrect?'bg-lime-50 border-lime-400':'bg-blue-50 border-blue-300'}`}>
        <div className="font-bold text-sm mb-1">{isCorrect?'🎉 Correct!':'📖 Explanation:'}</div>
        <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
      </div>}
    </div>
  )
}

function FillBlankSlide({ slide, checked, answers, setAnswers }) {
  const blanks = slide.blanks || []
  const allFilled = blanks.every((_,i) => answers[i] !== undefined)
  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-purple-100 text-purple-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">✏️ Fill in the Blank</div>
      <div className="card bg-purple-50 border-2 border-purple-200 mb-4">
        <p className="text-base font-bold text-green-900 leading-relaxed">
          {slide.sentence.split('_______').map((part, i) => (
            <span key={i}>
              {part}
              {i < blanks.length && (
                <span className={`inline-block min-w-[100px] text-center font-bold rounded-xl px-2 py-0.5 mx-1 border-2 text-sm ${
                  checked
                    ? (answers[i] === blanks[i].correct
                        ? 'bg-lime-200 border-lime-400 text-green-900'
                        : 'bg-red-100 border-red-400 text-red-900')
                    : (answers[i] ? 'bg-lime-100 border-lime-300 text-green-800' : 'bg-white border-dashed border-gray-400 text-gray-400')
                }`}>
                  {answers[i] || '???'}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
      {blanks.map((blank, i) => (
        <div key={i} className="mb-3">
          {blanks.length > 1 && <div className="text-xs font-bold text-gray-500 mb-1">Blank {i+1}:</div>}
          <div className="grid grid-cols-2 gap-2">
            {[blank.correct, ...blank.distractors].sort(() => Math.random() - 0.5).map((opt, j) => {
              let cls='bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              if (checked) {
                if (opt===blank.correct) cls='bg-lime-100 border-2 border-lime-500 text-green-900'
                else if (answers[i]===opt) cls='bg-red-100 border-2 border-red-400 text-red-900'
                else cls='bg-gray-50 border-2 border-gray-200 opacity-50'
              } else if (answers[i]===opt) cls='bg-purple-100 border-2 border-purple-400 text-purple-900'
              return (
                <button key={j} onClick={() => !checked && setAnswers(prev => ({...prev,[i]:opt}))}
                  className={`p-3 rounded-2xl font-bold text-sm transition-all ${cls}`}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {checked&&<div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-4 mt-2">
        <div className="font-bold text-sm mb-1">📖 Explanation:</div>
        <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
      </div>}
      {!checked&&slide.hint&&<p className="text-xs font-semibold text-lime-600 mt-3 text-center">💡 {slide.hint}</p>}
    </div>
  )
}

function MatchPairsSlide({ slide, checked, setChecked, onCorrect, onWrong }) {
  const pairs = slide.pairs
  const [selectedLeft, setSelectedLeft]   = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched]             = useState([])
  const [wrong, setWrong]                 = useState([])
  const [attempts, setAttempts]           = useState(0)

  const shuffledRight = useRef(shuffle(pairs.map(p => p.meaning))).current
  const allDone = matched.length === pairs.length

  useEffect(() => {
    if (allDone && !checked) setChecked(true)
  }, [allDone])

  function handleLeft(i)  {
    if (checked) return
    setSelectedLeft(i === selectedLeft ? null : i)
    if (selectedRight !== null) tryMatch(i, selectedRight)
  }
  function handleRight(i) {
    if (checked) return
    setSelectedRight(i === selectedRight ? null : i)
    if (selectedLeft !== null) tryMatch(selectedLeft, i)
  }
  function tryMatch(li, ri) {
    setAttempts(a => a+1)
    const leftWord    = pairs[li].word
    const rightMeaning = shuffledRight[ri]
    const correctPair = pairs.find(p => p.word === leftWord)
    if (correctPair?.meaning === rightMeaning) {
      setMatched(m => [...m, leftWord])
      onCorrect?.()
    } else {
      setWrong([li, ri])
      onWrong?.()
      setTimeout(() => setWrong([]), 700)
    }
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-teal-100 text-teal-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">🔗 Match the Pairs</div>
      <p className="font-display text-lg text-green-800 mb-1">{slide.instruction}</p>
      <p className="text-xs text-green-500 font-semibold mb-4">Tap a word on the left, then tap its meaning on the right</p>
      <div className="flex gap-3 flex-1">
        {/* Left column */}
        <div className="flex-1 space-y-2">
          {pairs.map((p,i) => {
            const isDone = matched.includes(p.word)
            const isSel  = selectedLeft === i
            const isWrong = wrong[0] === i
            return (
              <button key={i} onClick={() => handleLeft(i)} disabled={isDone}
                className={`w-full p-3 rounded-2xl font-bold text-sm text-left transition-all border-2 ${
                  isDone ? 'bg-lime-100 border-lime-400 text-green-800 opacity-70' :
                  isWrong ? 'bg-red-100 border-red-400 animate-wiggle' :
                  isSel ? 'bg-teal-200 border-teal-500 text-teal-900 scale-[0.97]' :
                  'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}>
                {isDone && <span className="mr-1">✅</span>}{p.word}
              </button>
            )
          })}
        </div>
        {/* Right column */}
        <div className="flex-1 space-y-2">
          {shuffledRight.map((m,i) => {
            const matchedPair = pairs.find(p => p.meaning === m)
            const isDone = matched.includes(matchedPair?.word)
            const isSel  = selectedRight === i
            const isWrong = wrong[1] === i
            return (
              <button key={i} onClick={() => handleRight(i)} disabled={isDone}
                className={`w-full p-3 rounded-2xl font-semibold text-xs text-left transition-all border-2 ${
                  isDone ? 'bg-lime-100 border-lime-400 text-green-800 opacity-70' :
                  isWrong ? 'bg-red-100 border-red-400 animate-wiggle' :
                  isSel ? 'bg-teal-200 border-teal-500 text-teal-900 scale-[0.97]' :
                  'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }`}>
                {isDone && <span className="mr-1">✅</span>}{m}
              </button>
            )
          })}
        </div>
      </div>
      {allDone && (
        <div className="mt-3 bg-lime-50 border-2 border-lime-400 rounded-2xl p-3">
          <div className="font-bold text-sm mb-1">🎉 All matched!</div>
          <p className="text-xs font-semibold text-gray-700 whitespace-pre-line">{slide.explanation}</p>
        </div>
      )}
      {!allDone && <div className="mt-3 text-xs text-gray-400 font-semibold text-center">{matched.length}/{pairs.length} matched</div>}
    </div>
  )
}

function ReorderSentenceSlide({ slide, checked, answer, setAnswer }) {
  const isOrdering = slide.isOrdering
  const words = slide.words
  const [placed, setPlaced]   = useState([])
  const [remaining, setRemaining] = useState(() => words.map((w,i) => ({ w, id:i })))

  function place(item) {
    if (checked) return
    setPlaced(p => [...p, item])
    setRemaining(r => r.filter(x => x.id !== item.id))
    const newPlaced = [...placed, item]
    setAnswer(newPlaced.map(x => x.w).join(' '))
  }
  function unplace(item) {
    if (checked) return
    setRemaining(r => [...r, item].sort((a,b) => a.id - b.id))
    setPlaced(p => p.filter(x => x.id !== item.id))
    const newPlaced = placed.filter(x => x.id !== item.id)
    setAnswer(newPlaced.map(x => x.w).join(' '))
  }
  function reset() { setPlaced([]); setRemaining(words.map((w,i) => ({w,id:i}))); setAnswer('') }

  const correct = slide.correct
  const isCorrect = checked && (isOrdering
    ? placed.map(x=>x.w).join('|') === correct
    : placed.map(x=>x.w).join(' ') === correct)

  return (
    <div className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
      <div className="bg-indigo-100 text-indigo-700 rounded-2xl px-3 py-1.5 text-xs font-bold self-start mb-3">
        🔀 {isOrdering ? 'Put in Order' : 'Build the Sentence'}
      </div>
      <p className="font-display text-lg text-green-900 mb-4">{slide.instruction}</p>

      {/* Drop zone */}
      <div className={`min-h-[70px] border-2 border-dashed rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-start transition-all ${
        placed.length > 0 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'
      }`}>
        {placed.length === 0 && <p className="text-gray-400 text-sm font-semibold m-auto">Tap words below to build your answer</p>}
        {placed.map(item => (
          <button key={item.id} onClick={() => unplace(item)}
            className="bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm hover:bg-indigo-600 active:scale-95 transition-all">
            {item.w} ✕
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 mb-4">
        {remaining.map(item => (
          <button key={item.id} onClick={() => place(item)}
            className="bg-white border-2 border-indigo-300 text-indigo-800 font-bold px-3 py-1.5 rounded-xl text-sm hover:bg-indigo-50 active:scale-95 transition-all">
            {item.w}
          </button>
        ))}
      </div>

      {!checked && placed.length > 0 && (
        <button onClick={reset} className="text-xs font-bold text-gray-400 hover:text-gray-600 mb-2">↺ Reset</button>
      )}

      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect ? 'bg-lime-50 border-lime-400' : 'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect ? '🎉 Correct!' : `📖 Correct answer:`}</div>
          {!isCorrect && <p className="font-bold text-green-800 text-sm mb-2">{isOrdering ? correct.replace(/\|/g,' → ') : correct}</p>}
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
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3 mb-3 max-h-32 overflow-y-auto">
          <div className="text-xs font-bold text-blue-500 mb-1">📖 Passage</div>
          <p className="text-xs text-blue-900 font-semibold leading-relaxed">{slide.passage}</p>
        </div>
      )}
      <div className="card bg-lime-50 border-2 border-lime-200 mb-4">
        <div className="text-xs font-bold text-lime-600 mb-1">Statement</div>
        <p className="font-bold text-green-900">{slide.statement}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {['True','False','Not Given'].map(opt => {
          let cls='bg-white border-2 border-gray-200 hover:border-lime-300'
          if (checked) {
            if (opt===slide.answer) cls='bg-lime-400 border-2 border-lime-600 text-green-900 font-bold'
            else if (opt===selected) cls='bg-red-200 border-2 border-red-400'
            else cls='bg-gray-100 opacity-50 border-2 border-gray-200'
          } else if (opt===selected) cls='bg-lime-200 border-2 border-lime-400'
          return (
            <button key={opt} onClick={() => !checked && setSelected(opt)}
              className={`py-4 rounded-2xl font-bold text-sm transition-all ${cls}`}>
              {opt==='Not Given'?'N / G':opt}
            </button>
          )
        })}
      </div>
      {checked && (
        <div className={`p-4 rounded-2xl border-2 ${isCorrect?'bg-lime-50 border-lime-400':'bg-blue-50 border-blue-300'}`}>
          <div className="font-bold text-sm mb-1">{isCorrect?'🎉 Correct!':'📖 Correct: '+slide.answer}</div>
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
        {slide.sentences.map((s,i) => {
          let cls='bg-white border-2 border-gray-200 hover:border-red-200'
          if (checked) {
            if (!s.correct) cls='bg-red-50 border-2 border-red-400'
            else cls='bg-gray-50 border-2 border-gray-200 opacity-50'
          } else if (selected===i) cls='bg-red-100 border-2 border-red-400'
          return (
            <div key={i}>
              <button onClick={() => !checked && setSelected(i)}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all ${cls}`}>
                <span className="opacity-40 mr-2">{i+1}.</span>{s.text}
                {checked&&!s.correct&&<span className="ml-2 text-red-600 font-bold">← ERROR</span>}
              </button>
              {checked&&!s.correct&&(
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

// ─────────────────────────────────────────────────────────────
//  MAIN LESSON PAGE
// ─────────────────────────────────────────────────────────────
export default function Lesson() {
  const { lessonId } = useParams()
  const navigate     = useNavigate()
  const { completeLesson } = useProgress()
  const { profile }  = useAuth()

  const [started,    setStarted]    = useState(false)
  const [slideIdx,   setSlideIdx]   = useState(0)
  const [selected,   setSelected]   = useState(null)   // mcq / tfng / error_correction
  const [fillAnswers,setFillAnswers]= useState({})      // fill_blank
  const [reorderAns, setReorderAns] = useState('')      // reorder
  const [checked,    setChecked]    = useState(false)
  const [correct,    setCorrect]    = useState(0)
  const [total,      setTotal]      = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [finished,   setFinished]   = useState(false)
  const [wrongSlides,setWrongSlides]= useState([])
  const [matchChecked, setMatchChecked] = useState(false)

  const found = findLesson(lessonId)
  if (!found) return (
    <div className="min-h-screen flex items-center justify-center bg-lime-50 p-8">
      <div className="text-center"><div className="text-5xl mb-4">😕</div>
        <p className="font-display text-xl text-green-700 mb-4">Lesson not found</p>
        <button onClick={() => navigate('/learn')} className="btn-primary">← Back to Learn</button>
      </div>
    </div>
  )

  const { lesson } = found
  const allSlides  = buildSlides(lesson)
  const slide      = allSlides[slideIdx]
  const progress   = started ? (slideIdx / (allSlides.length - 1)) * 100 : 0

  const QUESTION_KINDS = ['mcq','tfng_single','error_correction','fill_blank','reorder_sentence']
  const isQuestion = QUESTION_KINDS.includes(slide?.kind)
  const isMatch    = slide?.kind === 'match_pairs'
  const isAutoNext = ['explainer','mini_explainer','flashcard','passage','intro'].includes(slide?.kind)

  // ── Check answer ──
  function handleCheck() {
    let isOk = false
    if (slide.kind === 'mcq')              isOk = selected === slide.correct
    if (slide.kind === 'tfng_single')      isOk = selected === slide.answer
    if (slide.kind === 'error_correction') isOk = slide.sentences[selected]?.correct === false
    if (slide.kind === 'fill_blank') {
      isOk = slide.blanks.every((b,i) => fillAnswers[i] === b.correct)
    }
    if (slide.kind === 'reorder_sentence') {
      isOk = slide.isOrdering
        ? reorderAns.split(' ').join('|') === slide.correct
        : reorderAns === slide.correct
    }
    setChecked(true)
    setTotal(t => t+1)
    if (isOk) setCorrect(c => c+1)
    else { setMistakes(m => m + 1); setWrongSlides(prev => [...prev, slide]) }
  }

  // ── Advance ──
  async function advance() {
    const next = slideIdx + 1
    if (next >= allSlides.length) {
      const score = total > 0 ? Math.round((correct/total)*100) : 80
      await completeLesson(lessonId, score)
      setFinished(true)
    } else {
      setSlideIdx(next)
      setSelected(null); setChecked(false); setFillAnswers({}); setReorderAns(''); setMatchChecked(false)
    }
  }

  // ── Can check? ──
  const canCheck = (() => {
    if (!isQuestion && !isMatch) return false
    if (isMatch) return matchChecked
    if (slide?.kind === 'mcq' || slide?.kind === 'tfng_single') return selected !== null
    if (slide?.kind === 'error_correction') return selected !== null
    if (slide?.kind === 'fill_blank') return slide.blanks.every((_,i) => fillAnswers[i] !== undefined)
    if (slide?.kind === 'reorder_sentence') return reorderAns.length > 0
    return false
  })()

  // ── Finished ──
  if (finished) {
    const score = total > 0 ? Math.round((correct/total)*100) : 80
    const xp    = Math.round((score/100)*(lesson.xp||20))+10
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center p-4">
        {score>=70&&<Confetti recycle={false} numberOfPieces={200} colors={['#bbff33','#84d600','#22c55e','#a3f007']}/>}
        <div className="max-w-sm w-full text-center">
          <div className="text-7xl mb-4 animate-bounce-slow">{score===100?'🌟':score>=70?'🎉':'💪'}</div>
          <h2 className="font-display text-3xl text-green-800 mb-1">{score===100?'Perfect!':score>=70?'Well done!':'Keep going!'}</h2>
          <p className="text-green-500 font-semibold mb-5">{score>=70?'Great progress toward Band 9!':'Review the explanations and try again!'}</p>
          <div className="card mb-4">
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div><div className="font-display text-3xl text-lime-600">{score}%</div><div className="text-xs font-bold text-gray-500">Score</div></div>
              <div><div className="font-display text-3xl text-green-600">+{xp}</div><div className="text-xs font-bold text-gray-500">XP</div></div>
              <div><div className="font-display text-3xl text-yellow-500">{correct}/{total}</div><div className="text-xs font-bold text-gray-500">Correct</div></div>
            </div>
            <div className="flex justify-center gap-2">
              {[1,2,3].map(s=><span key={s} className={`text-3xl ${score>=s*33?'':'grayscale opacity-30'}`}>⭐</span>)}
            </div>
          </div>
          {wrongSlides.length>0&&(
            <div className="card mb-4 text-left bg-blue-50 border-2 border-blue-200">
              <div className="font-bold text-blue-800 mb-2 text-sm">📖 Mistakes to review:</div>
              {wrongSlides.map((ws,i)=>(
                <div key={i} className="mb-3 last:mb-0 p-3 bg-white rounded-xl">
                  <div className="text-xs font-bold text-gray-500 mb-1 truncate">{ws.question||ws.statement||ws.sentence||ws.title}</div>
                  <div className="text-xs text-green-700 font-semibold whitespace-pre-line line-clamp-3">{ws.explanation||(ws.sentences?.find(s=>!s.correct)?.explanation)||''}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={()=>navigate('/learn')} className="btn-secondary flex-1">← Learn</button>
            <button onClick={()=>{setSlideIdx(0);setStarted(false);setCorrect(0);setTotal(0);setFinished(false);setWrongSlides([])}} className="btn-primary flex-1">
              <RotateCcw className="w-4 h-4 inline mr-1"/>Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!started) return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3">
        <button onClick={()=>navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100"><X className="w-5 h-5 text-gray-500"/></button>
        <span className="font-bold text-green-800 flex-1 truncate">{lesson.title}</span>
      </div>
      <IntroSlide slide={allSlides[0]} onStart={()=>{setStarted(true);setSlideIdx(1)}}/>
    </div>
  )

  return (
    <div className="min-h-screen bg-lime-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-2 border-lime-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={()=>navigate('/learn')} className="p-2 rounded-xl hover:bg-lime-100"><X className="w-5 h-5 text-gray-500"/></button>
        <div className="flex-1">
          <div className="h-3 bg-lime-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill" style={{width:`${progress}%`}}/>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">❌</span>
          <span className="font-bold text-red-500 text-sm">{mistakes}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-lime-600"/>
          <span className="font-bold text-lime-700 text-sm">{slideIdx}/{allSlides.length-1}</span>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {slide?.kind==='explainer'       && <ExplainerSlide      slide={slide} onNext={advance}/>}
        {slide?.kind==='mini_explainer'  && <MiniExplainerSlide  slide={slide} onNext={advance}/>}
        {slide?.kind==='flashcard'       && <FlashcardSlide      slide={slide} onNext={advance}/>}
        {slide?.kind==='passage'         && <PassageSlide        slide={slide} onNext={advance}/>}
        {slide?.kind==='mcq'             && <MCQSlide            slide={slide} checked={checked} selected={selected} setSelected={setSelected}/>}
        {slide?.kind==='fill_blank'      && <FillBlankSlide      slide={slide} checked={checked} answers={fillAnswers} setAnswers={setFillAnswers}/>}
        {slide?.kind==='match_pairs'     && <MatchPairsSlide     slide={slide} checked={matchChecked} setChecked={setMatchChecked} onCorrect={()=>setCorrect(c=>c+1)} onWrong={()=>{setMistakes(m=>m+1);setWrongSlides(p=>[...p,slide])}}/>}
        {slide?.kind==='reorder_sentence'&& <ReorderSentenceSlide slide={slide} checked={checked} answer={reorderAns} setAnswer={setReorderAns}/>}
        {slide?.kind==='tfng_single'     && <TFNGSlide           slide={slide} checked={checked} selected={selected} setSelected={setSelected}/>}
        {slide?.kind==='error_correction'&& <ErrorCorrectionSlide slide={slide} checked={checked} selected={selected} setSelected={setSelected}/>}
      </div>

      {/* Bottom action bar */}
      {!isAutoNext && (
        <div className="sticky bottom-0 bg-white border-t-2 border-lime-200 p-4 max-w-lg mx-auto w-full">
          {isMatch ? (
            matchChecked ? (
              <button onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
                {slideIdx+1>=allSlides.length?'🎉 Finish!':'Continue'} <ChevronRight className="w-5 h-5"/>
              </button>
            ) : (
              <div className="text-center text-sm font-semibold text-green-500">Match all pairs to continue</div>
            )
          ) : !checked ? (
            <button onClick={handleCheck} disabled={!canCheck} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
              Check Answer
            </button>
          ) : (
            <button onClick={advance} className="btn-primary w-full flex items-center justify-center gap-2">
              {slideIdx+1>=allSlides.length?'🎉 Finish Lesson!':'Continue'} <ChevronRight className="w-5 h-5"/>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
