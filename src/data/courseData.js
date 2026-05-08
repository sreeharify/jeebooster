export const COURSE_DATA = [
  {
    id: 1,
    title: 'Class 11 - JEE Prep',
    icon: '📗',
    color: 'from-blue-500 to-indigo-600',
    description: 'Foundation for Physics, Chemistry, and Mathematics',
    units: [
      {
        id: 'u11_p',
        title: 'Physics - Mechanics I',
        icon: '⚛️',
        lessons: [
          { id: 'l11_p1', title: 'Units & Dimensions', type: 'info', xp: 20 },
          { id: 'l11_p2', title: 'Kinematics', type: 'quiz', xp: 30 },
          { id: 'l11_p3', title: 'Laws of Motion', type: 'quiz', xp: 30 },
          { id: 'l11_p4', title: 'Work, Energy & Power', type: 'quiz', xp: 30 },
        ]
      },
      {
        id: 'u11_c',
        title: 'Chemistry - Physical I',
        icon: '🧪',
        lessons: [
          { id: 'l11_c1', title: 'Mole Concept', type: 'info', xp: 25 },
          { id: 'l11_c2', title: 'Atomic Structure', type: 'quiz', xp: 30 },
          { id: 'l11_c3', title: 'Chemical Bondnig', type: 'quiz', xp: 30 },
          { id: 'l11_c4', title: 'Thermodynamics', type: 'quiz', xp: 35 },
        ]
      },
      {
        id: 'u11_m',
        title: 'Mathematics - Algebra I',
        icon: '📐',
        lessons: [
          { id: 'l11_m1', title: 'Sets & Relations', type: 'info', xp: 20 },
          { id: 'l11_m2', title: 'Trigonometry', type: 'quiz', xp: 30 },
          { id: 'l11_m3', title: 'Quadratic Equations', type: 'quiz', xp: 30 },
          { id: 'l11_m4', title: 'Sequence & Series', type: 'quiz', xp: 30 },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Class 12 - JEE Advanced',
    icon: '📘',
    color: 'from-red-500 to-orange-600',
    description: 'Mastering the final year topics for JEE Main/Advanced',
    units: [
      {
        id: 'u12_p',
        title: 'Physics - Electromagnetism',
        icon: '⚡',
        lessons: [
          { id: 'l12_p1', title: 'Electrostatics', type: 'info', xp: 30 },
          { id: 'l12_p2', title: 'Current Electricity', type: 'quiz', xp: 30 },
          { id: 'l12_p3', title: 'Magnetism', type: 'quiz', xp: 30 },
          { id: 'l12_p4', title: 'Modern Physics', type: 'quiz', xp: 40 },
        ]
      },
      {
        id: 'u12_c',
        title: 'Chemistry - Organic',
        icon: '⚗️',
        lessons: [
          { id: 'l12_c1', title: 'Haloalkanes', type: 'info', xp: 30 },
          { id: 'l12_c2', title: 'Alcohols & Phenols', type: 'quiz', xp: 30 },
          { id: 'l12_c3', title: 'Biomolecules', type: 'quiz', xp: 30 },
          { id: 'l12_c4', title: 'Polymers', type: 'quiz', xp: 30 },
        ]
      },
      {
        id: 'u12_m',
        title: 'Mathematics - Calculus II',
        icon: '📊',
        lessons: [
          { id: 'l12_m1', title: 'Limits & Continuity', type: 'info', xp: 30 },
          { id: 'l12_m2', title: 'Differentiation', type: 'quiz', xp: 30 },
          { id: 'l12_m3', title: 'Integration', type: 'quiz', xp: 40 },
          { id: 'l12_m4', title: 'Probability', type: 'quiz', xp: 40 },
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Miscellaneous & Strategy',
    icon: '🏆',
    color: 'from-purple-500 to-pink-600',
    description: 'Tips, Rank Predictions and General Strategy',
    units: [
      {
        id: 'umisc_s',
        title: 'JEE Strategy',
        icon: '💡',
        lessons: [
          { id: 'l_strat1', title: 'Preparation Roadmap', type: 'info', xp: 50 },
          { id: 'l_strat2', title: 'Time Management', type: 'info', xp: 50 },
        ]
      },
      {
        id: 'umisc_t',
        title: 'Mock Test Zone',
        icon: '📝',
        lessons: [
          { id: 'l_mock1', title: 'Daily JEE Quiz', type: 'quiz', xp: 40 },
          { id: 'l_mock2', title: 'Mock Test 1', type: 'mock', xp: 100 },
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
