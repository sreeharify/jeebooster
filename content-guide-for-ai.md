# JeeBoost — Content Guide for AI Chapter Generation

This document tells an AI exactly where content is stored, how it is structured,
and what to produce to create new lesson chapters for the JEE Mains learning app.

---

## APP OVERVIEW

JeeBoost is a **Duolingo-style gamified learning app** for JEE Mains preparation.
Lessons are broken into bite-sized slides: short explainers, interactive questions,
formula cards, and mini-challenges. The goal is to make JEE prep feel less like
textbook grinding and more like a game where every slide teaches or tests one
atomic concept.

---

## WHERE CONTENT LIVES

### Lesson slides
```
src/data/lessons/jee/
  <lesson-id>.json        → slide array for that lesson
```

Each lesson ID comes from `src/data/courseData.js`.
For example, lesson `p11_c1_l1` (SI Units & Fundamental Units) would be stored as:
```
src/data/lessons/jee/p11_c1_l1.json
```

### Curriculum structure
```
src/data/courseData.js
  → COURSE_DATA array: Class 11 → Subjects → Chapters → Lessons
                       Class 12 → Subjects → Chapters → Lessons
                       Misc & Strategy → JEE Mastery chapters
```

### Mock test sets
```
src/data/tests/
  math.json        ← array of math mock sets
  physics.json     ← array of physics mock sets
  chemistry.json   ← array of chemistry mock sets
```

---

## HOW LESSON FILES ARE STRUCTURED

Every lesson JSON file is an **array of slide objects**.
Each slide has a `kind` field. The app renders a different component per kind.
Each slide also has an optional `tag` field for filtering (see TAGGING below).

### TAGGING SYSTEM — `tag` field

Every slide can have an optional `"tag"` field with one of two values:

| Value        | Meaning                                                                 |
|--------------|-------------------------------------------------------------------------|
| `"note"`     | This slide teaches a concept, formula, or fact worth reviewing later.   |
| `"question"` | This slide is a practice question the student must answer.              |

**Rules:**
- `tag` is optional. If omitted, the slide has no special tag.
- Slides of kind `explainer`, `mini_explainer`, and `flashcard` should almost always be tagged `"note"`.
- Slides of kind `mcq`, `fill_blank`, `match_pairs`, `reorder_sentence`, `error_correction` should almost always be tagged `"question"`.
- The user will later filter `"note"` slides to auto-generate spaced-repetition flashcards.

### DIFFICULTY LEVELS — `level` field

Instead of IELTS band scores, we use a 4-tier difficulty system:

| `level` | Label              | Emoji | Meaning                                                     |
|---------|--------------------|-------|-------------------------------------------------------------|
| `1`     | Level 1 — Foundation    | 🌱    | Basic NCERT concept, definition-level understanding          |
| `2`     | Level 2 — Intermediate  | ⚡    | Apply formulas, single-step numericals                       |
| `3`     | Level 3 — Advanced      | 🔥    | Multi-step problems, tricky conceptual questions             |
| `4`     | Level 4 — Expert        | 🚀    | JEE Advanced level, competitive problem-solving              |

**Rules:**
- Every question slide (`mcq`, `fill_blank`, etc.) MUST have a `level` field (1–4).
- Explainer/note slides CAN have a `level` to indicate the depth of the concept.
- Lessons should start at Level 1–2 and gradually build to Level 3–4.
- The `level` replaces the old `band` field. Do NOT use `band`.

---

## SLIDE SCHEMAS (copy-paste ready)

### 1. `explainer` — Teaching card with sections
```json
{
  "kind": "explainer",
  "tag": "note",
  "level": 1,
  "title": "Newton's Second Law of Motion",
  "sections": [
    {
      "heading": "The Law",
      "body": "The net force acting on an object is equal to the product of its mass and acceleration.\n\nF = ma\n\nThis is a vector equation — force and acceleration point in the same direction."
    },
    {
      "heading": "Key Points",
      "body": "• F is the net (resultant) force, NOT any single force.\n• Mass (m) is a scalar — it does not have direction.\n• In SI units: 1 Newton = 1 kg·m/s²"
    }
  ],
  "highlight": "F = ma is the most important equation in mechanics. Always resolve forces into components before applying it.",
  "example": {
    "wrong": "A 5 kg block has force 10 N. Acceleration = 10/5 = 2. (Missing direction & units)",
    "right": "A 5 kg block on a frictionless surface has a horizontal force of 10 N. By F = ma, a = 10/5 = 2 m/s² (horizontal, in the direction of the force)."
  }
}
```
**Fields:**
- `sections[]` — array of `{ heading, body }`. Heading is optional.
- `highlight` — Key takeaway shown in a yellow box. Optional.
- `example` — Optional. `wrong` = common mistake, `right` = correct approach.
- Use `\n` for line breaks, `\n\n` for paragraph breaks inside `body`.

### 2. `mini_explainer` — Quick tip / formula card
```json
{
  "kind": "mini_explainer",
  "tag": "note",
  "title": "Quick Formula: Projectile Range",
  "body": "The horizontal range of a projectile launched at angle θ with speed u:\n\nR = u² sin(2θ) / g\n\nMaximum range occurs at θ = 45°.",
  "quick": [
    { "label": "R is maximum when sin(2θ) = 1, i.e., θ = 45°", "icon": "💡" },
    { "label": "R is the same for θ and (90° − θ)", "icon": "🔄" },
    { "label": "On the Moon, g is smaller → R is larger", "icon": "🌙" }
  ]
}
```

### 3. `mcq` — Multiple choice question (4 options)
```json
{
  "kind": "mcq",
  "tag": "question",
  "level": 2,
  "question": "A body of mass 2 kg is acted upon by two forces: 3 N east and 4 N north. What is the magnitude of acceleration?",
  "options": [
    "2.5 m/s²",
    "3.5 m/s²",
    "5 m/s²",
    "7 m/s²"
  ],
  "correct": "2.5 m/s²",
  "explanation": "Net force = √(3² + 4²) = √(9 + 16) = √25 = 5 N\nBy F = ma → a = F/m = 5/2 = 2.5 m/s²",
  "hint": "Find the resultant of two perpendicular forces first."
}
```
**Rules:**
- `correct` must exactly match one of the `options` strings.
- All 4 options must be distinct.
- `level` sets the difficulty badge.
- `hint` is optional — shown before answering.
- For numerical questions, include full working in `explanation`.
- Use realistic JEE-style distractors (common calculation errors, sign mistakes, missing factors).

### 4. `fill_blank` — Fill in the blank (select from options)
```json
{
  "kind": "fill_blank",
  "tag": "question",
  "level": 2,
  "sentence": "The dimensional formula of pressure is _______.",
  "blanks": [
    {
      "correct": "[M L⁻¹ T⁻²]",
      "distractors": ["[M L T⁻²]", "[M L⁻² T⁻²]", "[M L² T⁻²]"]
    }
  ],
  "explanation": "Pressure = Force / Area = [M L T⁻²] / [L²] = [M L⁻¹ T⁻²]",
  "hint": "Pressure = Force per unit Area. Find dimensions of each."
}
```
**Rules:**
- Use exactly `_______` (7 underscores) for each blank in the sentence.
- `distractors` must have exactly 3 items.
- For multiple blanks, add more objects to `blanks` array and more `_______` in the sentence.
- Great for: formula completion, reaction products, dimensional analysis, unit conversions.

### 5. `match_pairs` — Match left column to right column
```json
{
  "kind": "match_pairs",
  "tag": "question",
  "level": 1,
  "instruction": "Match each physical quantity to its SI unit:",
  "pairs": [
    { "word": "Force", "meaning": "Newton (N)" },
    { "word": "Energy", "meaning": "Joule (J)" },
    { "word": "Power", "meaning": "Watt (W)" },
    { "word": "Pressure", "meaning": "Pascal (Pa)" }
  ],
  "explanation": "Force = kg·m/s² = N, Energy = kg·m²/s² = J, Power = J/s = W, Pressure = N/m² = Pa."
}
```
**CRITICAL RULE: Every `meaning` must be completely unique. No two pairs can share the same meaning text, even partially. Duplicate meanings break the matching logic.**

- Recommended: 3–5 pairs per slide.
- Pairs are shuffled randomly each time.
- Great for: quantity ↔ unit, formula ↔ name, reaction ↔ product, element ↔ property.

### 6. `reorder_sentence` — Drag items into correct order
```json
{
  "kind": "reorder_sentence",
  "tag": "question",
  "level": 2,
  "instruction": "Arrange these electromagnetic waves in order of increasing frequency:",
  "words": ["Microwaves", "Visible Light", "X-rays", "Radio Waves", "Infrared"],
  "correct": "Radio Waves|Microwaves|Infrared|Visible Light|X-rays",
  "isOrdering": true,
  "explanation": "EM spectrum order (increasing frequency): Radio < Microwave < Infrared < Visible < UV < X-ray < Gamma.",
  "hint": "Think about the electromagnetic spectrum from left to right."
}
```
**Rules:**
- For **ordering tasks** (sequences, rankings): set `"isOrdering": true` and join items with `|` in `correct`.
- For **sentence building** (rare in JEE context): omit `isOrdering` and join with spaces + period at end.
- `words` should contain all and only the items in `correct`.
- Great for: EM spectrum order, reaction mechanism steps, periodic trends, thermodynamic process sequences, increasing/decreasing property order.

### 7. `error_correction` — Find the statement with a mistake
```json
{
  "kind": "error_correction",
  "tag": "question",
  "level": 3,
  "title": "Spot the Error: Thermodynamics",
  "instruction": "One of these statements is WRONG. Which one?",
  "sentences": [
    {
      "text": "In an isothermal process, the temperature remains constant.",
      "correct": true
    },
    {
      "text": "In an adiabatic process, the system exchanges no heat with its surroundings.",
      "correct": true
    },
    {
      "text": "In an isobaric process, the volume remains constant.",
      "correct": false,
      "explanation": "This is wrong. In an isobaric process, PRESSURE remains constant, not volume. The process where volume remains constant is called isochoric (or isometric)."
    }
  ]
}
```
**Rules:**
- Exactly ONE statement must have `"correct": false`.
- The false statement must have an `"explanation"` field.
- Recommended: 3–4 statements total.
- Great for: common JEE misconceptions, tricky definitions, easily confused laws/theorems.

### 8. `flashcard` — Formula / concept flip card
```json
{
  "kind": "flashcard",
  "tag": "note",
  "level": 2,
  "word": "Escape Velocity",
  "meaning": "The minimum velocity needed for an object to escape Earth's gravitational field: vₑ = √(2gR)",
  "example": "For Earth: vₑ = √(2 × 9.8 × 6.4×10⁶) ≈ 11.2 km/s",
  "partOfSpeech": "Physics · Gravitation",
  "wrong": "Don't confuse with orbital velocity: vₒ = √(gR). Escape velocity = √2 × orbital velocity.",
  "collocations": [
    "vₑ = √(2GM/R)",
    "vₑ = √(2gR)",
    "vₑ = √2 × vₒ"
  ],
  "family": [
    "Orbital Velocity — vₒ = √(gR) = √(GM/R)",
    "Binding Energy — E = -GMm/2R"
  ]
}
```
**Adaptation for JEE:**
- `word` → the concept or formula name.
- `meaning` → definition + key formula.
- `example` → a quick numerical example applying the formula.
- `partOfSpeech` → Subject · Chapter (e.g., "Chemistry · Equilibrium").
- `wrong` → common confusion / mistake students make.
- `collocations` → related formulas or alternate forms.
- `family` → related concepts in the same topic.

### 9. `passage` — Long-form reading (use before questions)
```json
{
  "kind": "passage",
  "tag": "note",
  "label": "📖 Read the following passage carefully — questions follow",
  "text": "A block of mass 5 kg is placed on a rough inclined plane making an angle of 30° with the horizontal. The coefficient of kinetic friction between the block and the plane is 0.3.\n\nThe block is released from rest and slides down the incline. The forces acting on the block are: gravitational component along the plane (mg sin θ), normal force (mg cos θ), and frictional force (μₖ mg cos θ) opposing the motion.",
  "tip": "Draw a free-body diagram before attempting the questions."
}
```
**Rules:**
- Use `\n\n` between paragraphs.
- Use before a series of MCQ slides that reference this passage.
- Great for: passage-based JEE problems, comprehension-type chemistry situations, multi-part physics scenarios.

---

## HOW MOCK TEST FILES ARE STRUCTURED

### math.json / physics.json / chemistry.json — Array of mock sets
```json
[
  {
    "id": "p1",
    "title": "Physics Mock Test 1",
    "questions": [
      {
        "id": "p1_1",
        "question": "A particle moves in a circle of radius 2 m with constant speed 4 m/s. The centripetal acceleration is:",
        "options": ["2 m/s²", "4 m/s²", "8 m/s²", "16 m/s²"],
        "correct": "8 m/s²",
        "explanation": "Centripetal acceleration = v²/r = 16/2 = 8 m/s²"
      },
      {
        "id": "p1_2",
        "question": "...",
        "options": ["...", "...", "...", "..."],
        "correct": "...",
        "explanation": "..."
      }
    ]
  }
]
```
**Rules:**
- Each set should have 25–30 questions (mimicking one subject section of JEE Main).
- Question IDs must be unique across all sets: `p1_1..p1_30`, `p2_1..p2_30`, etc.
- `correct` must exactly match one of the `options`.
- Mix difficulty: ~40% Level 1–2, ~40% Level 3, ~20% Level 4.
- Cover multiple chapters per set for variety.

---

## GAMIFICATION PHILOSOPHY (Duolingo-style)

The lesson flow should feel like a **game**, not a textbook. Follow these principles:

### 1. Short & Punchy
- Each slide should teach or test ONE atomic concept only.
- Explainer slides should be 2–4 short paragraphs max. No walls of text.
- If a concept needs more explanation, split it across multiple slides.

### 2. Teach → Practice → Challenge Loop
Structure every lesson as a cycle of:
```
explainer → mcq → explainer → fill_blank → match_pairs → harder mcq → ...
```
- Never have more than 2 explainers in a row without a question.
- After each explainer, immediately test the concept that was just taught.
- Gradually increase difficulty within the same lesson.

### 3. Variety is Key
A good 15-slide lesson should use at least 4 different slide kinds:
```
explainer → mcq → mini_explainer → fill_blank → mcq → match_pairs →
explainer → reorder → mcq → error_correction → flashcard → mcq → ...
```

### 4. Encouraging Explanations
- Correct answer: celebrate! "🎉 Correct! Here's why..."
- Wrong answer: never shame. Always explain the reasoning step-by-step.
- Include common mistakes in explanations: "A common error is..."

### 5. XP & Level Progression
- Each lesson has an XP value (defined in `courseData.js`).
- Students earn XP proportional to their score.
- 60% minimum score required to unlock the next lesson.
- This creates a "can't skip fundamentals" game loop.

---

## RECOMMENDED LESSON STRUCTURE (Template)

A typical lesson with ~12–18 slides should follow this pattern:

```
Slide 01: explainer (tag:"note")   — Introduce the core concept
Slide 02: mcq (tag:"question")     — Quick check: did they get the definition? (Level 1)
Slide 03: explainer (tag:"note")   — Dive deeper: formula derivation or key property
Slide 04: flashcard (tag:"note")   — Summarize the formula in a flip card
Slide 05: fill_blank (tag:"question") — Apply the formula in a simple case (Level 2)
Slide 06: mcq (tag:"question")     — Conceptual question testing understanding (Level 2)
Slide 07: mini_explainer (tag:"note") — Quick trick or shortcut
Slide 08: match_pairs (tag:"question") — Connect related concepts/formulas (Level 1)
Slide 09: explainer (tag:"note")   — Advanced case or exception
Slide 10: mcq (tag:"question")     — Multi-step numerical problem (Level 3)
Slide 11: reorder (tag:"question") — Order steps of a process/derivation (Level 2)
Slide 12: error_correction (tag:"question") — Spot the misconception (Level 3)
Slide 13: mcq (tag:"question")     — JEE-level tricky question (Level 3)
Slide 14: flashcard (tag:"note")   — Summary card of the full topic
Slide 15: mcq (tag:"question")     — Final boss: hardest question (Level 4)
```

---

## INSTRUCTIONS FOR AN AI GENERATING CHAPTER CONTENT

### Step-by-step workflow:

1. **Identify the lesson** from `courseData.js` — note the lesson ID, title, and which chapter it belongs to.
2. **Check the syllabus** — refer to `syllabus.txt` or the chapter title to know exactly which NCERT topics to cover.
3. **Create the JSON file** at `src/data/lessons/jee/<lesson_id>.json`.
4. **Follow the Recommended Lesson Structure** above — aim for 12–18 slides per lesson.
5. **Tag every slide** with `"tag": "note"` or `"tag": "question"` as appropriate.
6. **Set difficulty levels** — start at Level 1, build to Level 3–4 by the end.
7. **Use at least 4 different slide kinds** per lesson.

### Quality standards:

- **Explanations must be specific** — show full working for numerical problems. Include formulas, substitution, and final answer with units.
- **Content must be JEE-specific** — use problems that could appear in JEE Main. Focus on conceptual clarity AND numerical problem-solving.
- **Levels must be accurate:**
  - Level 1 = NCERT definition / direct formula application
  - Level 2 = Single-step numerical or conceptual
  - Level 3 = Multi-step, combining two concepts, or tricky
  - Level 4 = Advanced / JEE previous year level
- **No duplicate questions** — each question must be unique across the whole app.
- **Distractors must be realistic** — wrong options should be results of common mistakes (sign error, wrong formula, forgot a factor, wrong unit).
- **match_pairs meanings must ALL be unique** — this is enforced by the app and will log errors if violated.
- **Keep text concise** — this is mobile-first. No long paragraphs.

### Subject-specific guidelines:

#### Physics
- Always state physical quantities with units.
- Include free-body diagrams as text descriptions where relevant.
- For mechanics problems, specify reference frame and sign convention.
- For numerical answers, include the formula, substitution step, and final value.

#### Chemistry
- For reactions, write balanced equations.
- For organic chemistry, name the reaction type and mechanism (SN1, SN2, E1, E2, etc.).
- For periodic trends, always specify "increases/decreases across period/down group".
- For thermodynamics/equilibrium problems, show the ICE table logic in explanations.

#### Mathematics
- For proofs/derivations, break into numbered steps.
- For coordinate geometry, specify the diagram conceptually.
- For calculus, show differentiation/integration steps clearly.
- For permutation/combination, explain the counting logic.

### Recommended slide counts per lesson type:

| Lesson type | `type` in courseData | Recommended slides | Note/Question split |
|-------------|---------------------|--------------------|--------------------|
| Intro/Info  | `info`              | 10–14              | 60% notes / 40% questions |
| Practice    | `quiz`              | 14–18              | 30% notes / 70% questions |

---

## EXAMPLE: Complete lesson for `p11_c4_l1` (Force, Inertia & Newton's Laws)

```json
[
  {
    "kind": "explainer",
    "tag": "note",
    "level": 1,
    "title": "What is Force?",
    "sections": [
      {
        "heading": "Definition",
        "body": "A force is a push or pull that can change the state of motion of an object. It is a vector quantity — it has both magnitude and direction."
      },
      {
        "heading": "Effects of Force",
        "body": "A force can:\n• Change the speed of an object\n• Change the direction of motion\n• Change the shape of an object"
      }
    ],
    "highlight": "Force is measured in Newtons (N). 1 N = 1 kg·m/s²"
  },
  {
    "kind": "mcq",
    "tag": "question",
    "level": 1,
    "question": "Which of the following is NOT an effect of force?",
    "options": [
      "Change in speed",
      "Change in direction",
      "Change in mass",
      "Change in shape"
    ],
    "correct": "Change in mass",
    "explanation": "Force can change speed, direction, and shape of an object. Mass is an intrinsic property and cannot be changed by applying force (in classical mechanics)."
  },
  {
    "kind": "explainer",
    "tag": "note",
    "level": 1,
    "title": "Newton's First Law — Law of Inertia",
    "sections": [
      {
        "heading": "The Law",
        "body": "An object at rest stays at rest, and an object in motion stays in uniform motion in a straight line, unless acted upon by a net external force."
      },
      {
        "heading": "Inertia",
        "body": "Inertia is the tendency of a body to resist change in its state of motion. Mass is the measure of inertia — more mass means more inertia."
      }
    ],
    "highlight": "No net force → no acceleration → velocity stays constant (including zero)."
  },
  {
    "kind": "match_pairs",
    "tag": "question",
    "level": 1,
    "instruction": "Match each Newton's Law to its description:",
    "pairs": [
      { "word": "1st Law", "meaning": "A body stays at rest or in uniform motion unless a net force acts" },
      { "word": "2nd Law", "meaning": "Net force equals mass times acceleration (F = ma)" },
      { "word": "3rd Law", "meaning": "Every action has an equal and opposite reaction" }
    ],
    "explanation": "These three laws form the foundation of classical mechanics. The first introduces inertia, the second quantifies force, and the third describes interaction between bodies."
  },
  {
    "kind": "mini_explainer",
    "tag": "note",
    "title": "🧠 Quick Concept: Inertial Frames",
    "body": "Newton's laws are valid only in inertial reference frames — frames that are not accelerating.\n\nA car moving at constant velocity on a straight road is an inertial frame.\nA car taking a sharp turn is NOT an inertial frame.",
    "quick": [
      { "label": "Earth is approximately inertial for most JEE problems", "icon": "🌍" },
      { "label": "Pseudo forces appear in non-inertial frames", "icon": "⚠️" }
    ]
  },
  {
    "kind": "flashcard",
    "tag": "note",
    "level": 2,
    "word": "F = ma",
    "meaning": "Newton's Second Law: The net external force on a body equals the product of its mass and acceleration.",
    "example": "A 3 kg block with net force 12 N → a = 12/3 = 4 m/s²",
    "partOfSpeech": "Physics · Laws of Motion",
    "wrong": "Don't use F = ma with a single force — always use the NET force (sum of all forces).",
    "collocations": [
      "F_net = ma",
      "a = F/m",
      "F = dp/dt (momentum form)"
    ],
    "family": [
      "Impulse — J = FΔt = Δp",
      "Momentum — p = mv"
    ]
  },
  {
    "kind": "mcq",
    "tag": "question",
    "level": 2,
    "question": "A 5 kg block is pushed with a force of 20 N on a surface with friction coefficient μ = 0.2. What is the acceleration? (g = 10 m/s²)",
    "options": [
      "1 m/s²",
      "2 m/s²",
      "3 m/s²",
      "4 m/s²"
    ],
    "correct": "2 m/s²",
    "explanation": "Friction = μmg = 0.2 × 5 × 10 = 10 N\nNet force = 20 − 10 = 10 N\na = F_net/m = 10/5 = 2 m/s²",
    "hint": "Don't forget to subtract friction from the applied force."
  },
  {
    "kind": "fill_blank",
    "tag": "question",
    "level": 2,
    "sentence": "According to Newton's Third Law, if body A exerts a force F on body B, then body B exerts a force of _______ on body A.",
    "blanks": [
      {
        "correct": "−F (equal magnitude, opposite direction)",
        "distractors": ["F (same direction)", "2F (double the force)", "F/2 (half the force)"]
      }
    ],
    "explanation": "Newton's Third Law: Fᴬ→ᴮ = −Fᴮ→ᴬ. The forces are equal in magnitude but opposite in direction. They act on DIFFERENT bodies."
  },
  {
    "kind": "error_correction",
    "tag": "question",
    "level": 3,
    "title": "Spot the Misconception",
    "instruction": "One of these statements about Newton's Laws is WRONG. Which one?",
    "sentences": [
      {
        "text": "A book lying on a table has zero net force acting on it.",
        "correct": true
      },
      {
        "text": "Action and reaction forces act on the SAME body.",
        "correct": false,
        "explanation": "This is wrong! Action-reaction pairs always act on DIFFERENT bodies. The normal force on the book (by the table) and the weight of the book (by Earth) are NOT an action-reaction pair — they just happen to be equal and opposite."
      },
      {
        "text": "A body can be in equilibrium even if multiple forces act on it.",
        "correct": true
      }
    ]
  },
  {
    "kind": "mcq",
    "tag": "question",
    "level": 3,
    "question": "Two blocks of masses 2 kg and 3 kg are connected by a light string and pulled by a force of 25 N on a frictionless surface. What is the tension in the string?",
    "options": [
      "5 N",
      "10 N",
      "15 N",
      "20 N"
    ],
    "correct": "10 N",
    "explanation": "Total mass = 2 + 3 = 5 kg\nAcceleration of system = 25/5 = 5 m/s²\nTension pulls the 2 kg block: T = 2 × 5 = 10 N\n(Or: T = 25 − 3×5 = 25 − 15 = 10 N from the 3 kg block's perspective)",
    "hint": "First find the acceleration of the entire system, then isolate one block."
  }
]
```

---

## ADDING A NEW LESSON — CHECKLIST

When generating a new lesson file, verify:

- [ ] File is valid JSON (array of slide objects)
- [ ] File is saved as `src/data/lessons/jee/<lesson_id>.json`
- [ ] Every slide has a `kind` field
- [ ] Every slide has a `tag` field (`"note"` or `"question"`)
- [ ] Every question slide has a `level` field (1–4)
- [ ] `mcq` → `correct` matches exactly one option, all 4 options are distinct
- [ ] `fill_blank` → `_______` count matches `blanks` array length, each has 3 distractors
- [ ] `match_pairs` → all meanings are unique
- [ ] `reorder_sentence` → `correct` contains all items from `words`
- [ ] `error_correction` → exactly one sentence has `"correct": false` with `explanation`
- [ ] Lesson has 12–18 slides
- [ ] At least 4 different slide kinds are used
- [ ] Difficulty progresses from Level 1 → Level 3–4
- [ ] No walls of text — keep it mobile-friendly
- [ ] Explanations show full working for numericals
- [ ] No duplicate questions across the app
