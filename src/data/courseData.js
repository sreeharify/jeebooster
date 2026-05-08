export const COURSE_DATA = [
  {
    id: 'c11',
    title: 'Class 11',
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
              { id: 'p11_c1_l1', title: 'SI Units & Fundamental Units', type: 'info', xp: 20 },
              { id: 'p11_c1_l2', title: 'Least Count, Accuracy & Precision', type: 'quiz', xp: 30 },
              { id: 'p11_c1_l3', title: 'Errors & Significant Figures', type: 'quiz', xp: 30 },
              { id: 'p11_c1_l4', title: 'Dimensional Analysis & Applications', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c2',
            title: 'Motion in a Straight Line',
            lessons: [
              { id: 'p11_c2_l1', title: 'Frame of Reference & Graphs', type: 'info', xp: 20 },
              { id: 'p11_c2_l2', title: 'Speed, Velocity & Uniform Motion', type: 'quiz', xp: 30 },
              { id: 'p11_c2_l3', title: 'Accelerated Motion & Graphs', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c3',
            title: 'Motion in a Plane',
            lessons: [
              { id: 'p11_c3_l1', title: 'Scalars, Vectors & Unit Vector', type: 'info', xp: 20 },
              { id: 'p11_c3_l2', title: 'Vector Products & Resolution', type: 'quiz', xp: 30 },
              { id: 'p11_c3_l3', title: 'Projectile Motion', type: 'quiz', xp: 35 },
              { id: 'p11_c3_l4', title: 'Uniform Circular Motion', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c4',
            title: 'Laws of Motion',
            lessons: [
              { id: 'p11_c4_l1', title: 'Force, Inertia & Newton’s Laws', type: 'info', xp: 20 },
              { id: 'p11_c4_l2', title: 'Momentum, Impulse & Conservation', type: 'quiz', xp: 30 },
              { id: 'p11_c4_l3', title: 'Static, Kinetic & Rolling Friction', type: 'quiz', xp: 35 },
              { id: 'p11_c4_l4', title: 'Dynamics of Circular Motion', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c5',
            title: 'Work, Energy, and Power',
            lessons: [
              { id: 'p11_c5_l1', title: 'Work Done by Constant/Variable Forces', type: 'info', xp: 20 },
              { id: 'p11_c5_l2', title: 'Kinetic & Potential Energies', type: 'quiz', xp: 30 },
              { id: 'p11_c5_l3', title: 'Work-Energy Theorem & Power', type: 'quiz', xp: 30 },
              { id: 'p11_c5_l4', title: 'Spring PE & Motion in Vertical Circle', type: 'quiz', xp: 35 },
              { id: 'p11_c5_l5', title: 'Elastic & Inelastic Collisions', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c6',
            title: 'System of Particles and Rotational Motion',
            lessons: [
              { id: 'p11_c6_l1', title: 'Centre of Mass: System & Rigid Body', type: 'info', xp: 25 },
              { id: 'p11_c6_l2', title: 'Torque & Angular Momentum', type: 'quiz', xp: 35 },
              { id: 'p11_c6_l3', title: 'Moment of Inertia & Gyration', type: 'quiz', xp: 40 },
              { id: 'p11_c6_l4', title: 'Parallel & Perpendicular Axes Theorems', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c7',
            title: 'Gravitation',
            lessons: [
              { id: 'p11_c7_l1', title: 'Kepler’s Laws & Universal Law', type: 'info', xp: 20 },
              { id: 'p11_c7_l2', title: 'Acceleration due to Gravity (g)', type: 'quiz', xp: 30 },
              { id: 'p11_c7_l3', title: 'Gravitational Potential & Energy', type: 'quiz', xp: 30 },
              { id: 'p11_c7_l4', title: 'Escape & Orbital Velocity', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c8',
            title: 'Mechanical Properties of Solids',
            lessons: [
              { id: 'p11_c8_l1', title: 'Elastic Behavior & Stress-Strain', type: 'info', xp: 20 },
              { id: 'p11_c8_l2', title: 'Hooke’s Law & Moduli (Y, B, G)', type: 'quiz', xp: 30 },
              { id: 'p11_c8_l3', title: 'Poisson’s Ratio & Elastic Energy', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c9',
            title: 'Mechanical Properties of Fluids',
            lessons: [
              { id: 'p11_c9_l1', title: 'Pascal’s Law & Fluid Pressure', type: 'info', xp: 20 },
              { id: 'p11_c9_l2', title: 'Viscosity, Stokes’ Law & Terminal velocity', type: 'quiz', xp: 35 },
              { id: 'p11_c9_l3', title: 'Bernoulli’s Principle & Applications', type: 'quiz', xp: 35 },
              { id: 'p11_c9_l4', title: 'Surface Tension, Contact Angle & Capillary', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c10',
            title: 'Thermal Properties of Matter',
            lessons: [
              { id: 'p11_c10_l1', title: 'Thermal Expansion & Calorimetry', type: 'info', xp: 20 },
              { id: 'p11_c10_l2', title: 'Change of State & Latent Heat', type: 'quiz', xp: 30 },
              { id: 'p11_c10_l3', title: 'Heat Transfer: Conduction, Convection, Radiation', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c11',
            title: 'Thermodynamics',
            lessons: [
              { id: 'p11_c11_l1', title: 'Zeroth & First Law', type: 'info', xp: 25 },
              { id: 'p11_c11_l2', title: 'Isothermal & Adiabatic Processes', type: 'quiz', xp: 35 },
              { id: 'p11_c11_l3', title: 'Second Law & Reversible Processes', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c12',
            title: 'Kinetic Theory',
            lessons: [
              { id: 'p11_c12_l1', title: 'Ideal Gas Equation & RMS Speed', type: 'info', xp: 20 },
              { id: 'p11_c12_l2', title: 'Degrees of Freedom & Equipartition', type: 'quiz', xp: 30 },
              { id: 'p11_c12_l3', title: 'Specific Heats & Mean Free Path', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p11_c13',
            title: 'Oscillations',
            lessons: [
              { id: 'p11_c13_l1', title: 'Simple Harmonic Motion (SHM)', type: 'info', xp: 25 },
              { id: 'p11_c13_l2', title: 'Energy in SHM & Simple Pendulum', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p11_c14',
            title: 'Waves',
            lessons: [
              { id: 'p11_c14_l1', title: 'Traveling & Progressive Waves', type: 'info', xp: 25 },
              { id: 'p11_c14_l2', title: 'Superposition & Standing Waves', type: 'quiz', xp: 35 },
              { id: 'p11_c14_l3', title: 'Beats & Doppler Effect', type: 'quiz', xp: 35 },
            ]
          }
        ]
      },
      {
        id: 'c11_s',
        title: 'Chemistry',
        icon: '🧪',
        chapters: [
          {
            id: 'c11_c1',
            title: 'Some Basic Concepts of Chemistry',
            lessons: [
              { id: 'c11_c1_l1', title: 'Laws of Combination & Dalton’s Theory', type: 'info', xp: 25 },
              { id: 'c11_c1_l2', title: 'Mole Concept & Molar Mass', type: 'quiz', xp: 30 },
              { id: 'c11_c1_l3', title: 'Formula & Stoichiometry', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c11_c2',
            title: 'Structure of Atom',
            lessons: [
              { id: 'c11_c2_l1', title: 'Atomic Models & Dual Nature', type: 'info', xp: 25 },
              { id: 'c11_c2_l2', title: 'Quantum Numbers & Orbitals', type: 'quiz', xp: 35 },
              { id: 'c11_c2_l3', title: 'Aufbau, Pauli & Hund’s Rules', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c3',
            title: 'Classification of Elements',
            lessons: [
              { id: 'c11_c3_l1', title: 'Modern Periodic Law & Table', type: 'info', xp: 20 },
              { id: 'c11_c3_l2', title: 'Periodic Trends (Radii, Enthalpy, etc)', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c11_c4',
            title: 'Chemical Bonding',
            lessons: [
              { id: 'c11_c4_l1', title: 'Lewis Structure & Bond Parameters', type: 'info', xp: 30 },
              { id: 'c11_c4_l2', title: 'VSEPR Theory & Hybridization', type: 'quiz', xp: 35 },
              { id: 'c11_c4_l3', title: 'MOT & Hydrogen Bonding', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c5',
            title: 'Chemical Thermodynamics',
            lessons: [
              { id: 'c11_c5_l1', title: 'First Law: Enthalpy & Internal Energy', type: 'info', xp: 30 },
              { id: 'c11_c5_l2', title: 'Hess’s Law & Enthalpy Types', type: 'quiz', xp: 35 },
              { id: 'c11_c5_l3', title: 'Second Law & Gibbs Energy', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c6',
            title: 'Equilibrium',
            lessons: [
              { id: 'c11_c6_l1', title: 'Chemical Equilibrium & Le Chatelier', type: 'info', xp: 30 },
              { id: 'c11_c6_l2', title: 'Ionic Equilibrium: Acids & Bases', type: 'quiz', xp: 35 },
              { id: 'c11_c6_l3', title: 'Buffer, Solubility Product & Common Ion', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c7',
            title: 'Redox Reactions',
            lessons: [
              { id: 'c11_c7_l1', title: 'Oxidation Number & Redox balancing', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'c11_c8',
            title: 'Organic Chemistry: Basic Principles',
            lessons: [
              { id: 'c11_c8_l1', title: 'IUPAC Nomenclature & Classification', type: 'info', xp: 25 },
              { id: 'c11_c8_l2', title: 'Electronic Displacements', type: 'quiz', xp: 35 },
              { id: 'c11_c8_l3', title: 'Reaction Mechanisms & Purification', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c11_c9',
            title: 'Hydrocarbons',
            lessons: [
              { id: 'c11_c9_l1', title: 'Alkanes, Alkenes & Alkynes', type: 'info', xp: 30 },
              { id: 'c11_c9_l2', title: 'Aromatic Hydrocarbons', type: 'quiz', xp: 30 },
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
            title: 'Sets',
            lessons: [
              { id: 'm11_c1_l1', title: 'Sets & Representations', type: 'info', xp: 20 },
              { id: 'm11_c1_l2', title: 'Subsets & Venn Diagrams', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c2',
            title: 'Relations and Functions',
            lessons: [
              { id: 'm11_c2_l1', title: 'Cartesian Product & Relations', type: 'info', xp: 20 },
              { id: 'm11_c2_l2', title: 'Types of Real Functions', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c3',
            title: 'Trigonometric Functions',
            lessons: [
              { id: 'm11_c3_l1', title: 'Measuring Angles & Signs', type: 'info', xp: 25 },
              { id: 'm11_c3_l2', title: 'Addition & Double Angle Formulae', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c4',
            title: 'Complex Numbers & Quadratic',
            lessons: [
              { id: 'm11_c4_l1', title: 'Algebraic Properties & Argand Plane', type: 'info', xp: 25 },
              { id: 'm11_c4_l2', title: 'Fundamental Theorem & Quadratic Solns', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c5',
            title: 'Linear Inequalities',
            lessons: [
              { id: 'm11_c5_l1', title: 'Algebraic Solutions & Number Line', type: 'info', xp: 20 },
            ]
          },
          {
            id: 'm11_c6',
            title: 'Permutations and Combinations',
            lessons: [
              { id: 'm11_c6_l1', title: 'Fundamental Principle & Factorial', type: 'info', xp: 25 },
              { id: 'm11_c6_l2', title: 'Permutations & Combinations formula', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c7',
            title: 'Binomial Theorem',
            lessons: [
              { id: 'm11_c7_l1', title: 'Binomial Expansion & General Terms', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'm11_c8',
            title: 'Sequence and Series',
            lessons: [
              { id: 'm11_c8_l1', title: 'Arithmetic Progression (AP)', type: 'info', xp: 25 },
              { id: 'm11_c8_l2', title: 'Geometric Progression (GP)', type: 'quiz', xp: 30 },
              { id: 'm11_c8_l3', title: 'AM & GM Relationship', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c9',
            title: 'Straight Lines',
            lessons: [
              { id: 'm11_c9_l1', title: 'Slope & Equation Forms', type: 'info', xp: 25 },
              { id: 'm11_c9_l2', title: 'Distance Calculations', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c10',
            title: 'Conic Sections',
            lessons: [
              { id: 'm11_c10_l1', title: 'Circle & Parabola', type: 'info', xp: 30 },
              { id: 'm11_c10_l2', title: 'Ellipse & Hyperbola', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c11',
            title: '3D Geometry Basics',
            lessons: [
              { id: 'm11_c11_l1', title: 'Coordinates & Distance in 3D', type: 'info', xp: 20 },
            ]
          },
          {
            id: 'm11_c12',
            title: 'Limits and Derivatives',
            lessons: [
              { id: 'm11_c12_l1', title: 'Intuitive Idea of Limits', type: 'info', xp: 25 },
              { id: 'm11_c12_l2', title: 'Standard Limits & Derivatives', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm11_c13',
            title: 'Statistics',
            lessons: [
              { id: 'm11_c13_l1', title: 'Mean Deviation & Variance', type: 'info', xp: 25 },
            ]
          },
          {
            id: 'm11_c14',
            title: 'Probability',
            lessons: [
              { id: 'm11_c14_l1', title: 'Sample Spaces & Probability of Event', type: 'info', xp: 25 },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'c12',
    title: 'Class 12',
    icon: '📘',
    color: 'from-orange-500 to-red-600',
    description: 'Advanced topics for JEE Main and Advanced success.',
    subjects: [
      {
        id: 'p12',
        title: 'Physics',
        icon: '⚡',
        chapters: [
          {
            id: 'p12_c1',
            title: 'Electric Charges and Fields',
            lessons: [
              { id: 'p12_c1_l1', title: 'Coulomb’s Law & Electric Field', type: 'info', xp: 30 },
              { id: 'p12_c1_l2', title: 'Dipole, Flux & Gauss’s Law', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c2',
            title: 'Electrostatic Potential & Capacitance',
            lessons: [
              { id: 'p12_c2_l1', title: 'Potential Difference & Energy', type: 'info', xp: 30 },
              { id: 'p12_c2_l2', title: 'Equipotential Surfaces & Dielectrics', type: 'quiz', xp: 35 },
              { id: 'p12_c2_l3', title: 'Capacitors & Energy Storage', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c3',
            title: 'Current Electricity',
            lessons: [
              { id: 'p12_c3_l1', title: 'Ohm’s law, Drift Velocity & Mobility', type: 'info', xp: 25 },
              { id: 'p12_c3_l2', title: 'Kirchhoff’s laws & Wheatstone bridge', type: 'quiz', xp: 35 },
              { id: 'p12_c3_l3', title: 'Emf, Internal resistance & Cells', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c4',
            title: 'Moving Charges and Magnetism',
            lessons: [
              { id: 'p12_c4_l1', title: 'Biot-Savart & Ampere’s law', type: 'info', xp: 30 },
              { id: 'p12_c4_l2', title: 'Magnet Force on Charge & Conductors', type: 'quiz', xp: 35 },
              { id: 'p12_c4_l3', title: 'Torque & Moving Coil Galvanometer', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c5',
            title: 'Magnetism and Matter',
            lessons: [
              { id: 'p12_c5_l1', title: 'Magnetic Dipole & Bar Magnet', type: 'info', xp: 20 },
              { id: 'p12_c5_l2', title: 'Magnetic properties of materials', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c6',
            title: 'Electromagnetic Induction',
            lessons: [
              { id: 'p12_c6_l1', title: 'Faraday’s Law & Lenz’s Law', type: 'info', xp: 30 },
              { id: 'p12_c6_l2', title: 'Self and Mutual Inductance', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c7',
            title: 'Alternating Current',
            lessons: [
              { id: 'p12_c7_l1', title: 'RMS Value, Reactance & Impedance', type: 'info', xp: 30 },
              { id: 'p12_c7_l2', title: 'LCR Circuits & Resonance', type: 'quiz', xp: 40 },
              { id: 'p12_c7_l3', title: 'AC Generator & Transformer', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c8',
            title: 'Electromagnetic Waves',
            lessons: [
              { id: 'p12_c8_l1', title: 'Displacement current & EM Spectrum', type: 'info', xp: 20 },
            ]
          },
          {
            id: 'p12_c9',
            title: 'Ray Optics & Instruments',
            lessons: [
              { id: 'p12_c9_l1', title: 'Reflection, Refraction & TIR', type: 'info', xp: 30 },
              { id: 'p12_c9_l2', title: 'Lenses & Prisms', type: 'quiz', xp: 35 },
              { id: 'p12_c9_l3', title: 'Optical Instruments: Microscopes', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'p12_c10',
            title: 'Wave Optics',
            lessons: [
              { id: 'p12_c10_l1', title: 'Huygens’ Principle & Reflection', type: 'info', xp: 35 },
              { id: 'p12_c10_l2', title: 'Interference & YDSE', type: 'quiz', xp: 40 },
              { id: 'p12_c10_l3', title: 'Diffraction & Resolving Power', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'p12_c11',
            title: 'Dual Nature of Radiation',
            lessons: [
              { id: 'p12_c11_l1', title: 'Photoelectric Effect & Einstein Equation', type: 'info', xp: 30 },
              { id: 'p12_c11_l2', title: 'Matter Waves & de Broglie', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c12',
            title: 'Atoms',
            lessons: [
              { id: 'p12_c12_l1', title: 'Rutherford & Bohr Model', type: 'info', xp: 30 },
              { id: 'p12_c12_l2', title: 'Hydrogen Spectrum', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c13',
            title: 'Nuclei',
            lessons: [
              { id: 'p12_c13_l1', title: 'Mass-Energy & Binding Energy', type: 'info', xp: 30 },
              { id: 'p12_c13_l2', title: 'Nuclear Fission and Fusion', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'p12_c14',
            title: 'Semiconductor Electronics',
            lessons: [
              { id: 'p12_c14_l1', title: 'Intrinsic/Extrinsic p-n Junction', type: 'info', xp: 30 },
              { id: 'p12_c14_l2', title: 'Diode as Rectifier & I-V characteristics', type: 'quiz', xp: 40 },
              { id: 'p12_c14_l3', title: 'Logic Gates: AND, OR, NOT, etc', type: 'quiz', xp: 40 },
            ]
          }
        ]
      },
      {
        id: 'c12_s',
        title: 'Chemistry',
        icon: '⚗️',
        chapters: [
          {
            id: 'c12_c1',
            title: 'Solutions',
            lessons: [
              { id: 'c12_c1_l1', title: 'Raoult’s Law & Ideal Solutions', type: 'info', xp: 30 },
              { id: 'c12_c1_l2', title: 'Colligative Properties & Van’t Hoff', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c2',
            title: 'Electrochemistry',
            lessons: [
              { id: 'c12_c2_l1', title: 'Standard Potential & Nernst Eq', type: 'info', xp: 30 },
              { id: 'c12_c2_l2', title: 'Conductivity, Electrolysis & Corrosion', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c3',
            title: 'Chemical Kinetics',
            lessons: [
              { id: 'c12_c3_l1', title: 'Rate Law, Order & Molecularity', type: 'info', xp: 30 },
              { id: 'c12_c3_l2', title: 'Arrhenius Eq & Collision Theory', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c4',
            title: 'd- and f-Block Elements',
            lessons: [
              { id: 'c12_c4_l1', title: 'Transition Metal Trends & Oxidation States', type: 'info', xp: 30 },
              { id: 'c12_c4_l2', title: 'Lanthanoids and Actinoids', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c12_c5',
            title: 'Coordination Compounds',
            lessons: [
              { id: 'c12_c5_l1', title: 'Bonding: Werner, VBT & CFT', type: 'info', xp: 35 },
              { id: 'c12_c5_l2', title: 'Isomerism & Nomenclature', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'c12_c6',
            title: 'Haloalkanes and Haloarenes',
            lessons: [
              { id: 'c12_c6_l1', title: 'Nature of C-X & Substitution Mechanisms', type: 'info', xp: 35 },
            ]
          },
          {
            id: 'c12_c7',
            title: 'Alcohols, Phenols, and Ethers',
            lessons: [
              { id: 'c12_c7_l1', title: 'Preparation & Dehydration mechanism', type: 'info', xp: 35 },
            ]
          },
          {
            id: 'c12_c8',
            title: 'Aldehydes, Ketones, Carboxylic Acids',
            lessons: [
              { id: 'c12_c8_l1', title: 'Carbonyl nucleophilic addition', type: 'info', xp: 35 },
              { id: 'c12_c8_l2', title: 'Acidity of Carboxylic Acids', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'c12_c9',
            title: 'Amines',
            lessons: [
              { id: 'c12_c9_l1', title: 'Preparation & Diazonium salts', type: 'info', xp: 30 },
            ]
          },
          {
            id: 'c12_c10',
            title: 'Biomolecules',
            lessons: [
              { id: 'c12_c10_l1', title: 'Carbohydrates & Proteins', type: 'info', xp: 30 },
              { id: 'c12_c10_l2', title: 'Vitamins & Nucleic Acids', type: 'quiz', xp: 30 },
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
            title: 'Relations and Functions',
            lessons: [
              { id: 'm12_c1_l1', title: 'Reflexive, Symmetric, Transitive & Equivalence', type: 'info', xp: 30 },
              { id: 'm12_c1_l2', title: 'One-to-one & Onto Functions', type: 'quiz', xp: 30 },
            ]
          },
          {
            id: 'm12_c2',
            title: 'Inverse Trigonometric Functions',
            lessons: [
              { id: 'm12_c2_l1', title: 'Principal Value Branches & Graphs', type: 'info', xp: 30 },
            ]
          },
          {
            id: 'm12_c3',
            title: 'Matrices',
            lessons: [
              { id: 'm12_c3_l1', title: 'Matrix Operations & Transpose', type: 'info', xp: 30 },
              { id: 'm12_c3_l2', title: 'Symmetric & Invertible Matrices', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'm12_c4',
            title: 'Determinants',
            lessons: [
              { id: 'm12_c4_l1', title: 'Adjoint, Inverse & System Solutions', type: 'info', xp: 35 },
            ]
          },
          {
            id: 'm12_c5',
            title: 'Continuity and Differentiability',
            lessons: [
              { id: 'm12_c5_l1', title: 'Chain rule & Implicit Derivatives', type: 'info', xp: 30 },
              { id: 'm12_c5_l2', title: 'Exp/Log & Second-order Derivatives', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c6',
            title: 'Applications of Derivatives',
            lessons: [
              { id: 'm12_c6_l1', title: 'Increasing/Decreasing Functions', type: 'info', xp: 30 },
              { id: 'm12_c6_l2', title: 'Maxima and Minima Tests', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c7',
            title: 'Integrals',
            lessons: [
              { id: 'm12_c7_l1', title: 'Substitution & Parts Integration', type: 'info', xp: 35 },
              { id: 'm12_c7_l2', title: 'Definite Integrals: Fundamental Theorem', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c8',
            title: 'Applications of Integrals',
            lessons: [
              { id: 'm12_c8_l1', title: 'Area under Standard Curves', type: 'info', xp: 35 },
            ]
          },
          {
            id: 'm12_c9',
            title: 'Differential Equations',
            lessons: [
              { id: 'm12_c9_l1', title: 'Variable Separation & Homogeneous Eq', type: 'info', xp: 35 },
              { id: 'm12_c9_l2', title: 'Linear Eq of First Order', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'm12_c10',
            title: 'Vector Algebra',
            lessons: [
              { id: 'm12_c10_l1', title: 'Magnitude, Direction & Components', type: 'info', xp: 30 },
              { id: 'm12_c10_l2', title: 'Dot and Cross products', type: 'quiz', xp: 35 },
            ]
          },
          {
            id: 'm12_c11',
            title: '3D Geometry',
            lessons: [
              { id: 'm12_c11_l1', title: 'Direction Cosines & Line Equations', type: 'info', xp: 35 },
              { id: 'm12_c11_l2', title: 'Shortest Distance between lines', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'm12_c12',
            title: 'Linear Programming',
            lessons: [
              { id: 'm12_c12_l1', title: 'Graphical Method & Feasibility', type: 'info', xp: 30 },
            ]
          },
          {
            id: 'm12_c13',
            title: 'Probability',
            lessons: [
              { id: 'm12_c13_l1', title: 'Bayes’ Theorem & Distributions', type: 'info', xp: 35 },
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
    description: 'Exam strategy, experimental skills, and advanced JEE topics.',
    subjects: [
      {
        id: 'strategy',
        title: 'JEE Mastery',
        icon: '💡',
        chapters: [
          {
            id: 's_c1',
            title: 'The Road to AIR 1',
            lessons: [
              { id: 's_c1_l1', title: 'Preparation Roadmap', type: 'info', xp: 50 },
              { id: 's_c1_l2', title: 'Time Management', type: 'quiz', xp: 50 },
            ]
          },
          {
            id: 'extra_p',
            title: 'Physics Experimental Skills',
            lessons: [
              { id: 'extra_p_l1', title: 'Vernier Callipers & Screw Gauge', type: 'info', xp: 40 },
              { id: 'extra_p_l2', title: 'Error Analysis: Simple Pendulum', type: 'quiz', xp: 40 },
              { id: 'extra_p_l3', title: 'Metre Bridge & Potentiometer', type: 'quiz', xp: 40 },
              { id: 'extra_p_l4', title: 'Resonance Column & Cooling laws', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'extra_c',
            title: 'Chemistry practicals',
            lessons: [
              { id: 'extra_c_l1', title: 'Detection of extra elements (N, S, Cl)', type: 'info', xp: 40 },
              { id: 'extra_c_l2', title: 'Inorganic Qualitative Analysis', type: 'quiz', xp: 50 },
              { id: 'extra_c_l3', title: 'Titrimetric analysis (KMnO4)', type: 'quiz', xp: 40 },
            ]
          },
          {
            id: 'extra_m',
            title: 'Advanced Mathematics',
            lessons: [
              { id: 'extra_m_l1', title: 'Logarithms & HP/AGP', type: 'info', xp: 40 },
              { id: 'extra_m_l2', title: 'System of Equations (Cramer’s Rule)', type: 'quiz', xp: 50 },
              { id: 'extra_m_l3', title: 'Newton-Leibniz Formula', type: 'quiz', xp: 40 },
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
  { id: 'all_units', title: 'JeeBooster Champion', desc: 'Complete all units', icon: '👑', xp: 500 },
]

export const VOCAB_BANK = []
export const GRAMMAR_LESSONS = {}
export const WRITING_TEMPLATES = {}
