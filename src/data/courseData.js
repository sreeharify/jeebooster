export const COURSE_DATA = [
  {
    id: 1,
    title: 'IELTS Foundations',
    icon: '🌱',
    color: 'from-lime-400 to-green-500',
    description: 'Learn what IELTS is and build core skills',
    units: [
      {
        id: 'u1',
        title: 'What is IELTS?',
        icon: '📚',
        lessons: [
          { id: 'l1_1', title: 'Test Format Overview', type: 'info', xp: 15 },
          { id: 'l1_2', title: 'Band Score System', type: 'quiz', xp: 20 },
          { id: 'l1_3', title: 'Academic vs General', type: 'quiz', xp: 20 },
          { id: 'l1_4', title: 'Study Plan Builder', type: 'interactive', xp: 25 },
        ]
      },
      {
        id: 'u2',
        title: 'Core Vocabulary',
        icon: '📝',
        lessons: [
          { id: 'l2_1', title: 'Academic Word List 1', type: 'vocab', xp: 20 },
          { id: 'l2_2', title: 'Academic Word List 2', type: 'vocab', xp: 20 },
          { id: 'l2_3', title: 'Collocations', type: 'match', xp: 25 },
          { id: 'l2_4', title: 'Synonyms & Paraphrasing', type: 'fill', xp: 30 },
          { id: 'l2_5', title: 'Vocabulary Test', type: 'test', xp: 40 },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Listening Mastery',
    icon: '🎧',
    color: 'from-green-400 to-green-600',
    description: 'Ace all 4 sections of the Listening test',
    units: [
      {
        id: 'u3',
        title: 'Listening Section 1 & 2',
        icon: '🔊',
        lessons: [
          { id: 'l3_1', title: 'Everyday Conversations', type: 'listen', xp: 20 },
          { id: 'l3_2', title: 'Form Completion', type: 'listen_fill', xp: 25 },
          { id: 'l3_3', title: 'Map & Diagram Labelling', type: 'listen', xp: 25 },
          { id: 'l3_4', title: 'Monologue Practice', type: 'listen', xp: 25 },
        ]
      },
      {
        id: 'u4',
        title: 'Listening Section 3 & 4',
        icon: '🎓',
        lessons: [
          { id: 'l4_1', title: 'Academic Discussions', type: 'listen', xp: 30 },
          { id: 'l4_2', title: 'Multiple Choice', type: 'quiz', xp: 25 },
          { id: 'l4_3', title: 'Lecture Note-Taking', type: 'listen', xp: 30 },
          { id: 'l4_4', title: 'Prediction Strategies', type: 'info', xp: 20 },
          { id: 'l4_5', title: 'Listening Mini-Test', type: 'test', xp: 50 },
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Reading Skills',
    icon: '👁️',
    color: 'from-green-500 to-green-700',
    description: 'Master skimming, scanning, and comprehension',
    units: [
      {
        id: 'u5',
        title: 'Reading Strategies',
        icon: '🔍',
        lessons: [
          { id: 'l5_1', title: 'Skimming & Scanning', type: 'reading', xp: 20 },
          { id: 'l5_2', title: 'True/False/Not Given', type: 'reading', xp: 25 },
          { id: 'l5_3', title: 'Matching Headings', type: 'reading', xp: 25 },
          { id: 'l5_4', title: 'Matching Information', type: 'reading', xp: 25 },
        ]
      },
      {
        id: 'u6',
        title: 'Reading Question Types',
        icon: '❓',
        lessons: [
          { id: 'l6_1', title: 'Summary Completion', type: 'reading', xp: 25 },
          { id: 'l6_2', title: 'Sentence Completion', type: 'reading', xp: 25 },
          { id: 'l6_3', title: 'Short Answer Questions', type: 'reading', xp: 25 },
          { id: 'l6_4', title: 'Diagram Labelling', type: 'reading', xp: 25 },
          { id: 'l6_5', title: 'Reading Mini-Test', type: 'test', xp: 50 },
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Writing Excellence',
    icon: '✍️',
    color: 'from-lime-500 to-green-600',
    description: 'Write Band 9 Task 1 and Task 2 essays',
    units: [
      {
        id: 'u7',
        title: 'Task 1 Academic',
        icon: '📊',
        lessons: [
          { id: 'l7_1', title: 'Describing Graphs & Charts', type: 'writing', xp: 30 },
          { id: 'l7_2', title: 'Process Diagrams', type: 'writing', xp: 30 },
          { id: 'l7_3', title: 'Maps & Plans', type: 'writing', xp: 30 },
          { id: 'l7_4', title: 'Data Comparisons', type: 'writing', xp: 30 },
          { id: 'l7_5', title: 'Task 1 Vocabulary', type: 'vocab', xp: 25 },
        ]
      },
      {
        id: 'u8',
        title: 'Task 2 Essays',
        icon: '📄',
        lessons: [
          { id: 'l8_1', title: 'Opinion Essays', type: 'writing', xp: 35 },
          { id: 'l8_2', title: 'Discussion Essays', type: 'writing', xp: 35 },
          { id: 'l8_3', title: 'Problem-Solution Essays', type: 'writing', xp: 35 },
          { id: 'l8_4', title: 'Advantages-Disadvantages', type: 'writing', xp: 35 },
          { id: 'l8_5', title: 'Thesis Statements', type: 'writing', xp: 30 },
          { id: 'l8_6', title: 'Cohesion & Coherence', type: 'writing', xp: 30 },
          { id: 'l8_7', title: 'Writing Mini-Test', type: 'test', xp: 60 },
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Speaking Confidence',
    icon: '🗣️',
    color: 'from-green-400 to-lime-500',
    description: 'Speak fluently and achieve Band 9 in Speaking',
    units: [
      {
        id: 'u9',
        title: 'Speaking Part 1',
        icon: '💬',
        lessons: [
          { id: 'l9_1', title: 'Introducing Yourself', type: 'speaking', xp: 25 },
          { id: 'l9_2', title: 'Personal Topics', type: 'speaking', xp: 25 },
          { id: 'l9_3', title: 'Extending Answers', type: 'speaking', xp: 25 },
          { id: 'l9_4', title: 'Part 1 Fluency Tips', type: 'info', xp: 20 },
        ]
      },
      {
        id: 'u10',
        title: 'Speaking Parts 2 & 3',
        icon: '🎤',
        lessons: [
          { id: 'l10_1', title: 'Cue Card Technique', type: 'speaking', xp: 30 },
          { id: 'l10_2', title: 'Abstract Discussion', type: 'speaking', xp: 30 },
          { id: 'l10_3', title: 'Expressing Opinions', type: 'speaking', xp: 30 },
          { id: 'l10_4', title: 'Lexical Resource', type: 'vocab', xp: 25 },
          { id: 'l10_5', title: 'Speaking Mock Test', type: 'test', xp: 60 },
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Grammar for Band 9',
    icon: '⚡',
    color: 'from-green-600 to-green-800',
    description: 'Master complex grammar structures',
    units: [
      {
        id: 'u11',
        title: 'Sentence Structures',
        icon: '🔧',
        lessons: [
          { id: 'l11_1', title: 'Complex Sentences', type: 'grammar', xp: 25 },
          { id: 'l11_2', title: 'Relative Clauses', type: 'grammar', xp: 25 },
          { id: 'l11_3', title: 'Passive Voice', type: 'grammar', xp: 25 },
          { id: 'l11_4', title: 'Conditionals', type: 'grammar', xp: 30 },
          { id: 'l11_5', title: 'Reported Speech', type: 'grammar', xp: 25 },
        ]
      },
      {
        id: 'u12',
        title: 'Advanced Grammar',
        icon: '🏆',
        lessons: [
          { id: 'l12_1', title: 'Inversion & Emphasis', type: 'grammar', xp: 35 },
          { id: 'l12_2', title: 'Nominalization', type: 'grammar', xp: 35 },
          { id: 'l12_3', title: 'Hedging Language', type: 'grammar', xp: 30 },
          { id: 'l12_4', title: 'Discourse Markers', type: 'grammar', xp: 30 },
          { id: 'l12_5', title: 'Grammar Mastery Test', type: 'test', xp: 70 },
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Full Mock Tests',
    icon: '🏅',
    color: 'from-lime-400 to-lime-600',
    description: 'Complete timed practice tests',
    units: [
      {
        id: 'u13',
        title: 'Practice Tests',
        icon: '📋',
        lessons: [
          { id: 'l13_1', title: 'Mock Test 1 — Listening', type: 'mock', xp: 80 },
          { id: 'l13_2', title: 'Mock Test 1 — Reading', type: 'mock', xp: 80 },
          { id: 'l13_3', title: 'Mock Test 1 — Writing', type: 'mock', xp: 80 },
          { id: 'l13_4', title: 'Mock Test 2 — Full', type: 'mock', xp: 120 },
          { id: 'l13_5', title: 'Mock Test 3 — Full', type: 'mock', xp: 120 },
        ]
      }
    ]
  }
]

export const ACHIEVEMENTS = [
  { id: 'first_lesson', title: 'First Steps', desc: 'Complete your first lesson', icon: '🌱', xp: 50 },
  { id: 'streak_3', title: 'On Fire', desc: '3-day streak', icon: '🔥', xp: 30 },
  { id: 'streak_7', title: 'Week Warrior', desc: '7-day streak', icon: '⚡', xp: 100 },
  { id: 'streak_30', title: 'Unstoppable', desc: '30-day streak', icon: '💪', xp: 300 },
  { id: 'xp_500', title: 'Scholar', desc: 'Earn 500 XP', icon: '📚', xp: 50 },
  { id: 'xp_2000', title: 'Expert', desc: 'Earn 2000 XP', icon: '🎓', xp: 100 },
  { id: 'perfect_lesson', title: 'Perfectionist', desc: 'Score 100% on a lesson', icon: '⭐', xp: 75 },
  { id: 'complete_section', title: 'Section Master', desc: 'Complete a full section', icon: '🏆', xp: 150 },
  { id: 'vocab_100', title: 'Word Wizard', desc: 'Learn 100 vocabulary words', icon: '📖', xp: 100 },
  { id: 'all_units', title: 'IELTS Champion', desc: 'Complete all units', icon: '👑', xp: 500 },
]

export const VOCAB_BANK = [
  { word: 'ubiquitous', meaning: 'present everywhere', example: 'Mobile phones have become ubiquitous in modern society.', category: 'AWL' },
  { word: 'alleviate', meaning: 'to reduce or lessen', example: 'Exercise can alleviate symptoms of depression.', category: 'AWL' },
  { word: 'proliferate', meaning: 'to increase rapidly', example: 'Social media platforms continue to proliferate.', category: 'AWL' },
  { word: 'exacerbate', meaning: 'to make worse', example: 'Stress can exacerbate health problems.', category: 'AWL' },
  { word: 'mitigate', meaning: 'to reduce the severity', example: 'Trees can mitigate urban heat islands.', category: 'AWL' },
  { word: 'substantiate', meaning: 'to provide evidence for', example: 'The theory was substantiated by new research.', category: 'AWL' },
  { word: 'contemplate', meaning: 'to think deeply about', example: 'She contemplated the implications of the decision.', category: 'AWL' },
  { word: 'encompass', meaning: 'to include or cover', example: 'The study encompasses a wide range of topics.', category: 'AWL' },
  { word: 'scrutinize', meaning: 'to examine carefully', example: 'Scientists scrutinize every piece of data.', category: 'AWL' },
  { word: 'advocate', meaning: 'to publicly support', example: 'She advocated for better education funding.', category: 'AWL' },
  { word: 'ambiguous', meaning: 'open to more than one interpretation', example: 'The results were ambiguous and inconclusive.', category: 'AWL' },
  { word: 'analogous', meaning: 'comparable or similar', example: 'This process is analogous to how a computer works.', category: 'AWL' },
  { word: 'arbitrary', meaning: 'random, based on whim', example: 'The selection process seemed arbitrary.', category: 'AWL' },
  { word: 'coherent', meaning: 'logical and consistent', example: 'A coherent argument is essential in academic writing.', category: 'AWL' },
  { word: 'compensate', meaning: 'to make up for', example: 'Hard work can compensate for lack of talent.', category: 'AWL' },
  { word: 'concurrent', meaning: 'happening at the same time', example: 'The two events were concurrent.', category: 'AWL' },
  { word: 'conviction', meaning: 'a firm belief', example: 'She spoke with great conviction.', category: 'AWL' },
  { word: 'diminish', meaning: 'to become or make smaller', example: 'Resources are diminishing rapidly.', category: 'AWL' },
  { word: 'elaborate', meaning: 'to explain in more detail', example: 'Could you elaborate on your point?', category: 'AWL' },
  { word: 'empirical', meaning: 'based on observation/experiment', example: 'We need empirical evidence to prove this.', category: 'AWL' },
]

export const GRAMMAR_LESSONS = {
  complex_sentences: {
    title: 'Complex Sentences',
    explanation: 'Complex sentences contain an independent clause and at least one dependent clause, connected by subordinating conjunctions.',
    conjunctions: ['although', 'because', 'since', 'while', 'whereas', 'unless', 'if', 'when', 'after', 'before'],
    examples: [
      { simple: 'Air pollution is a problem. Many cities have cars.', complex: 'Air pollution is a serious problem because many cities are heavily reliant on cars.' },
      { simple: 'Technology advances. Jobs change.', complex: 'As technology continues to advance rapidly, the nature of employment is fundamentally changing.' },
    ],
    exercises: [
      { prompt: 'Combine: "The population is growing. Resources are limited."', answer: 'Although the population is growing exponentially, natural resources remain limited.' },
      { prompt: 'Combine: "Students study hard. They want good grades."', answer: 'Students study hard because they want to achieve good grades.' },
    ]
  }
}

export const WRITING_TEMPLATES = {
  opinion_essay: {
    structure: [
      { part: 'Introduction', template: 'In recent years, [topic] has become a highly controversial issue. While some argue that [view 1], I firmly believe that [your view] for the following reasons.' },
      { part: 'Body Paragraph 1', template: 'The most compelling reason to support this view is that [main point]. For instance, [specific example]. This clearly demonstrates that [link back to thesis].' },
      { part: 'Body Paragraph 2', template: 'Furthermore, [second point]. Research has shown that [evidence]. Consequently, [conclusion of point].' },
      { part: 'Counterargument', template: 'Admittedly, those who oppose this view argue that [counterargument]. However, this argument overlooks the fact that [rebuttal].' },
      { part: 'Conclusion', template: 'In conclusion, while there are merits to both sides, I maintain that [restate thesis]. Governments and individuals must [recommendation] if we are to [desired outcome].' },
    ]
  },
  task1_graph: {
    structure: [
      { part: 'Overview', template: 'The [graph/chart/table] illustrates [what it shows] over a period of [time period].' },
      { part: 'Key Trend', template: 'Overall, it is evident that [most notable trend]. Another key feature is that [second trend].' },
      { part: 'Details 1', template: 'Looking at the data in more detail, [specific data point 1]. This was followed by [next point].' },
      { part: 'Details 2', template: 'In contrast, [comparison]. By [end date], [final figure], representing [percentage change].' },
    ]
  }
}
