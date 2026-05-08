export const COURSE_DATA = [
  {
    id: 'c11',
    title: 'Class 11 - Foundation',
    icon: '📗',
    color: 'from-blue-500 to-indigo-600',
    description: 'Master the fundamentals of Physics, Chemistry, and Mathematics.',
    subjects: [
      {
        id: 'p11',
        title: 'Physics',
        icon: '⚛️',
        chapters: [
          {
            id: 'p11_c1',
            title: 'Units and Measurements',
            lessons: [
              { id: 'p11_c1_l1', title: 'SI Units & Fundamental Quantities', type: 'info', xp: 20 },
              { id: 'p11_c1_l2', title: 'Dimensional Analysis & Applications', type: 'quiz', xp: 30 },
              { id: 'p11_c1_l3', title: 'Errors & Significant Figures', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c2',
            title: 'Kinematics',
            lessons: [
              { id: 'p11_c2_l1', title: 'Motion in Straight Line: Graphs', type: 'info', xp: 20 },
              { id: 'p11_c2_l2', title: 'Vector Algebra & Resolution', type: 'quiz', xp: 30 },
              { id: 'p11_c2_l3', title: 'Projectile Motion', type: 'quiz', xp: 35 },
              { id: 'p11_c2_l4', title: 'Uniform Circular Motion', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c3',
            title: 'Laws of Motion',
            lessons: [
              { id: 'p11_c3_l1', title: 'Newton’s Laws & Inertia', type: 'info', xp: 20 },
              { id: 'p11_c3_l2', title: 'Friction: Static & Kinetic', type: 'quiz', xp: 30 },
              { id: 'p11_c3_l3', title: 'Circular Dynamics & Banking', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c4',
            title: 'Work, Energy and Power',
            lessons: [
              { id: 'p11_c4_l1', title: 'Work-Energy Theorem', type: 'info', xp: 20 },
              { id: 'p11_c4_l2', title: 'Conservation of Energy', type: 'quiz', xp: 30 },
              { id: 'p11_c4_l3', title: 'Power and Collisions', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c5',
            title: 'Rotational Motion',
            lessons: [
              { id: 'p11_c5_l1', title: 'Centre of Mass', type: 'info', xp: 20 },
              { id: 'p11_c5_l2', title: 'Torque & Angular Momentum', type: 'quiz', xp: 35 },
              { id: 'p11_c5_l3', title: 'Moment of Inertia', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'p11_c6',
            title: 'Gravitation',
            lessons: [
              { id: 'p11_c6_l1', title: 'Kepler’s Laws', type: 'info', xp: 20 },
              { id: 'p11_c6_l2', title: 'Gravitational Potential', type: 'quiz', xp: 30 },
              { id: 'p11_c6_l3', title: 'Satellites & Escape Velocity', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c7',
            title: 'Properties of Matter',
            lessons: [
              { id: 'p11_c7_l1', title: 'Elasticity & Hooke’s Law', type: 'info', xp: 20 },
              { id: 'p11_c7_l2', title: 'Fluids: Bernoulli’s Principle', type: 'quiz', xp: 35 },
              { id: 'p11_c7_l3', title: 'Surface Tension & Viscosity', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c8',
            title: 'Thermodynamics',
            lessons: [
              { id: 'p11_c8_l1', title: 'Laws of Thermodynamics', type: 'info', xp: 25 },
              { id: 'p11_c8_l2', title: 'Heat Engines & Spontaneity', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c9',
            title: 'Kinetic Theory of Gases',
            lessons: [
              { id: 'p11_c9_l1', title: 'Ideal Gas Equation', type: 'info', xp: 20 },
              { id: 'p11_c9_l2', title: 'RMS Speed & Degree of Freedom', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c10',
            title: 'Oscillations and Waves',
            lessons: [
              { id: 'p11_c10_l1', title: 'SHM & Pendulums', type: 'info', xp: 25 },
              { id: 'p11_c10_l2', title: 'Wave Superposition & Beats', type: 'quiz', xp: 35 },
              { id: 'p11_c10_l3', title: 'Doppler Effect', type: 'quiz', xp: 35 },
            ]
          }
        ]
      },
      {
        id: 'c11',
        title: 'Chemistry',
        icon: '🧪',
        chapters: [
          {
            id: 'c11_c1',
            title: 'Basic Concepts of Chemistry',
            lessons: [
              { id: 'c11_c1_l1', title: 'Mole Concept & Molar Mass', type: 'info', xp: 25 },
              { id: 'c11_c1_l2', title: 'Stoichiometry & Molarity', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c11_c2',
            title: 'Atomic Structure',
            lessons: [
              { id: 'c11_c2_l1', title: 'Bohr’s Model & Spectrum', type: 'info', xp: 25 },
              { id: 'c11_c2_l2', title: 'Quantum Numbers & Orbitals', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c3',
            title: 'Chemical Bonding',
            lessons: [
              { id: 'c11_c3_l1', title: 'VSEPR & Hybridization', type: 'info', xp: 30 },
              { id: 'c11_c3_l2', title: 'MOT & H-Bonding', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c4',
            title: 'Chemical Thermodynamics',
            lessons: [
              { id: 'c11_c4_l1', title: 'Enthalpy & Entropy', type: 'info', xp: 25 },
              { id: 'c11_c4_l2', title: 'Gibbs Energy & Spontaneity', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c5',
            title: 'Equilibrium',
            lessons: [
              { id: 'c11_c5_l1', title: 'Le Chatelier’s Principle', type: 'info', xp: 25 },
              { id: 'c11_c5_l2', title: 'pH & Buffer Solutions', type: 'quiz', xp: 35 },
              { id: 'c11_c5_l3', title: 'Solubility Product (Ksp)', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c11_c6',
            title: 'Redox Reactions',
            lessons: [
              { id: 'c11_c6_l1', title: 'Oxidation Number & Balancing', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'c11_c7',
            title: 'p-Block Elements',
            lessons: [
              { id: 'c11_c7_l1', title: 'Group 13 & 14 Trends', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'c11_c8',
            title: 'Basic Organic Chemistry',
            lessons: [
              { id: 'c11_c8_l1', title: 'IUPAC Nomenclature', type: 'info', xp: 25 },
              { id: 'c11_c8_l2', title: 'Electronic Effects', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c9',
            title: 'Hydrocarbons',
            lessons: [
              { id: 'c11_c9_l1', title: 'Alkanes, Alkenes & Alkynes', type: 'info', xp: 30 },
              { id: 'c11_c9_l2', title: 'Aromaticity & Preparation', type: 'quiz', xp: 35 },
            ]
          }
        ]
      },
      {
        id: 'm11',
        title: 'Mathematics',
        icon: '📐',
        chapters: [
          {
            id: 'm11_c1',
            title: 'Sets, Relations & Functions',
            lessons: [
              { id: 'm11_c1_l1', title: 'Set Operations', type: 'info', xp: 20 },
              { id: 'm11_c1_l2', title: 'Types of Functions', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c2',
            title: 'Complex Numbers',
            lessons: [
              { id: 'm11_c2_l1', title: 'Algebra of Complex Numbers', type: 'info', xp: 25 },
              { id: 'm11_c2_l2', title: 'Quadratic Roots & Formations', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c3',
            title: 'Permutations & Combinations',
            lessons: [
              { id: 'm11_c3_l1', title: 'Fundamental Principle', type: 'info', xp: 25 },
              { id: 'm11_c3_l2', title: 'Circular & Practical P&C', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'm11_c4',
            title: 'Binomial Theorem',
            lessons: [
              { id: 'm11_c4_l1', title: 'General & Middle Terms', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'm11_c5',
            title: 'Sequence and Series',
            lessons: [
              { id: 'm11_c5_l1', title: 'AP & GP Properties', type: 'info', xp: 25 },
              { id: 'm11_c5_l2', title: 'Sum of Special Series', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c6',
            title: 'Coordinate Geometry I',
            lessons: [
              { id: 'm11_c6_l1', title: 'Straight Lines: Forms', type: 'info', xp: 25 },
              { id: 'm11_c6_l2', title: 'Circles: Standard Equations', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c7',
            title: 'Conic Sections',
            lessons: [
              { id: 'm11_c7_l1', title: 'Parabola & Ellipse', type: 'info', xp: 30 },
              { id: 'm11_c7_l2', title: 'Hyperbola Properties', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c8',
            title: 'Trigonometry',
            lessons: [
              { id: 'm11_c8_l1', title: 'Trigonometric Identities', type: 'info', xp: 25 },
              { id: 'm11_c8_l2', title: 'General Solutions', type: 'quiz', xp: 30 },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c12',
    title: 'Class 12 - Advanced',
    icon: '📘',
    color: 'from-purple-500 to-red-600',
    description: 'Advanced topics for JEE Main and Advanced success.',
    subjects: [
      {
        id: 'p12',
        title: 'Physics',
        icon: '⚡',
        chapters: [
          {
            id: 'p12_c1',
            title: 'Electrostatics',
            lessons: [
              { id: 'p12_c1_l1', title: 'Coulomb’s & Gauss’s Law', type: 'info', xp: 30 },
              { id: 'p12_c1_l2', title: 'Electric Potential & Energy', type: 'quiz', xp: 30 },
              { id: 'p12_c1_l3', title: 'Capacitance & Dielectrics', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c2',
            title: 'Current Electricity',
            lessons: [
              { id: 'p12_c2_l1', title: 'Drift Velocity & Ohm’s Law', type: 'info', xp: 25 },
              { id: 'p12_c2_l2', title: 'Kirchhoff’s Laws & Bridges', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c3',
            title: 'Magnetism',
            lessons: [
              { id: 'p12_c3_l1', title: 'Moving Charges: Force', type: 'info', xp: 30 },
              { id: 'p12_c3_l2', title: 'Ampere’s Law & Solenoids', type: 'quiz', xp: 35 },
              { id: 'p12_c3_l3', title: 'Earth Magnetism', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c4',
            title: 'EMI and AC',
            lessons: [
              { id: 'p12_c4_l1', title: 'Faraday’s Law & Lenz Law', type: 'info', xp: 30 },
              { id: 'p12_c4_l2', title: 'LCR Circuits & Resonance', type: 'quiz', xp: 40 },
              { id: 'p12_c4_l3', title: 'Transformers & Generators', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c5',
            title: 'Optics',
            lessons: [
              { id: 'p12_c5_l1', title: 'Ray Optics: Lens Formula', type: 'info', xp: 30 },
              { id: 'p12_c5_l2', title: 'Wave Optics: YDSE', type: 'quiz', xp: 40 },
              { id: 'p12_c5_l3', title: 'Diffraction & Polarization', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c6',
            title: 'Modern Physics',
            lessons: [
              { id: 'p12_c6_l1', title: 'Photoelectric Effect', type: 'info', xp: 30 },
              { id: 'p12_c6_l2', title: 'Atoms: Bohr Model', type: 'quiz', xp: 30 },
              { id: 'p12_c6_l3', title: 'Nuclei: Fission & Fusion', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c7',
            title: 'Semiconductors',
            lessons: [
              { id: 'p12_c7_l1', title: 'Diodes & Rectifiers', type: 'info', xp: 30 },
              { id: 'p12_c7_l2', title: 'Transistors & Logic Gates', type: 'quiz', xp: 40 },
            ]
          }
        ]
      },
      {
        id: 'c12',
        title: 'Chemistry',
        icon: '⚗️',
        chapters: [
          {
            id: 'c12_c1',
            title: 'Solutions',
            lessons: [
              { id: 'c12_c1_l1', title: 'Raoult’s Law & Ideal Solns', type: 'info', xp: 30 },
              { id: 'c12_c1_l2', title: 'Colligative Properties', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c2',
            title: 'Electrochemistry',
            lessons: [
              { id: 'c12_c2_l1', title: 'Nernst Equation', type: 'info', xp: 30 },
              { id: 'c12_c2_l2', title: 'Molar Conductivity', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c3',
            title: 'Chemical Kinetics',
            lessons: [
              { id: 'c12_c3_l1', title: 'Order & Molecularity', type: 'info', xp: 30 },
              { id: 'c12_c3_l2', title: 'Arrhenius Equation', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c4',
            title: 'Coordination Compounds',
            lessons: [
              { id: 'c12_c4_l1', title: 'IUPAC & Werner’s Theory', type: 'info', xp: 30 },
              { id: 'c12_c4_l2', title: 'VBT & CFT Theory', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'c12_c5',
            title: 'Organic Compounds I',
            lessons: [
              { id: 'c12_c5_l1', title: 'Haloalkanes & Haloarenes', type: 'info', xp: 30 },
              { id: 'c12_c5_l2', title: 'Alcohols & Phenols', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c6',
            title: 'Organic Compounds II',
            lessons: [
              { id: 'c12_c6_l1', title: 'Aldehydes & Ketones', type: 'info', xp: 30 },
              { id: 'c12_c6_l2', title: 'Amines & Biomolecules', type: 'quiz', xp: 35 },
            ]
          }
        ]
      },
      {
        id: 'm12',
        title: 'Mathematics',
        icon: '📊',
        chapters: [
          {
            id: 'm12_c1',
            title: 'Matrices & Determinants',
            lessons: [
              { id: 'm12_c1_l1', title: 'Matrix Algebra', type: 'info', xp: 30 },
              { id: 'm12_c1_l2', title: 'Properties of Determinants', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'm12_c2',
            title: 'Calculus I',
            lessons: [
              { id: 'm12_c2_l1', title: 'Limits & Continuity', type: 'info', xp: 30 },
              { id: 'm12_c2_l2', title: 'Differentiation & Apps', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c3',
            title: 'Calculus II',
            lessons: [
              { id: 'm12_c3_l1', title: 'Definite Integrals', type: 'info', xp: 35 },
              { id: 'm12_c3_l2', title: 'Differential Equations', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c4',
            title: 'Vector & 3D Geometry',
            lessons: [
              { id: 'm12_c4_l1', title: 'Vector Algebra', type: 'info', xp: 30 },
              { id: 'm12_c4_l2', title: '3D Lines & Shortest Dist', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c5',
            title: 'Probability',
            lessons: [
              { id: 'm12_c5_l1', title: 'Bayes’ Theorem', type: 'info', xp: 35 },
              { id: 'm12_c5_l2', title: 'Random Variables', type: 'quiz', xp: 35 },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'misc',
    title: 'Miscellaneous & Strategy',
    icon: '🚀',
    color: 'from-orange-400 to-pink-600',
    description: 'Exam strategy, rank prediction, and mental preparation.',
    subjects: [
      {
        id: 'strategy',
        title: 'Preparation Strategy',
        icon: '💡',
        chapters: [
          {
            id: 's_c1',
            title: 'The Road to AIR 1',
            lessons: [
              { id: 's_c1_l1', title: 'Preparation Roadmap', type: 'info', xp: 50 },
              { id: 's_c1_l2', title: 'Time Management', type: 'quiz', xp: 50 },
            ]
          }
        ]
      },
      {
        id: 'mock_zone',
        title: 'Mock Test Zone',
        icon: '📝',
        chapters: [
          {
            id: 'mz_c1',
            title: 'Simulator',
            lessons: [
              { id: 'mz_c1_l1', title: 'Daily JEE Quiz', type: 'quiz', xp: 40 },
              { id: 'mz_c1_l2', title: 'Full Practice Mock', type: 'mock', xp: 100 },
            ]
          }
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
  { id: 'complete_section', title: 'Subject Master', desc: 'Complete a full subject section', icon: '🏆', xp: 150 },
  { id: 'rank_prediction', title: 'Fortune Teller', desc: 'Get your focus areas in Rank Predictor', icon: '🔮', xp: 100 },
  { id: 'all_units', title: 'JeeBooster Champion', desc: 'Complete all units', icon: '👑', xp: 500 },
]

export const VOCAB_BANK = []
export const GRAMMAR_LESSONS = {}
export const WRITING_TEMPLATES = {}
