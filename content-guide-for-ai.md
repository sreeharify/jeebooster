# JeeBoost — Content Guide for AI Chapter Generation

This document tells an AI exactly where content lives, how it is structured,
and what to produce to create rich, gamified lesson chapters for JEE Mains.

---

## APP OVERVIEW

JeeBoost is a **Duolingo-style gamified learning app** for JEE Mains preparation.
Lessons are bite-sized slides: explainers, SVG diagrams, formula cards, interactive
questions, step-by-step worked examples, and mistake-busters. Every lesson should
feel like a **game**, not a textbook — short, punchy, visual, and rewarding.

---

## WHERE CONTENT LIVES

### Lesson slides
```
src/data/lessons/jee/
  <lesson-id>.json    →  slide array for that lesson
```
Lesson IDs come from `src/data/courseData.js`.
Example: lesson `p11_c1_l1` → `src/data/lessons/jee/p11_c1_l1.json`

### Curriculum structure
```
src/data/courseData.js
  COURSE_DATA: Class 11 → Subjects → Chapters → Lessons
               Class 12 → Subjects → Chapters → Lessons
               Misc & Strategy → JEE Mastery
```

### Mock test sets
```
src/data/tests/
  math.json / physics.json / chemistry.json
```

---

## CORE FIELD RULES

### `tag` — Flashcard & Revision System
Every slide MUST have a `"tag"` field:

| Value | Used for | Auto-extracted to |
|---|---|---|
| `"note"` | Explainers, formulas, concepts | Spaced-repetition flashcard deck |
| `"question"` | All practice questions | Question bank |
| `"prev_year"` | MCQs directly from JEE past papers | Shows **📋 JEE Prev Year** badge |

### `level` — Difficulty (replaces IELTS band)

| `level` | Label | Emoji | Description |
|---|---|---|---|
| `1` | Foundation | 🌱 | NCERT definition, direct fact recall |
| `2` | Intermediate | ⚡ | Single-step application or formula use |
| `3` | Advanced | 🔥 | Multi-step, combining concepts |
| `4` | Expert | 🚀 | JEE Advanced/previous year level |

Every question slide MUST have `level`. Explainer slides SHOULD have `level`.

---

## READABILITY RULES (Critical)

These rules ensure students can read comfortably on mobile:

1. **Keep body text short** — Maximum 4–5 lines per section block. Split longer content into multiple sections.
2. **Use bullet points** with `\n• ` for lists. Never write a wall of sentences.
3. **Bold key terms** with markdown-style `**term**` — the app renders these in bold.
4. **Use `\n\n`** between logical blocks within a `body` string.
5. **Formula lines** should be on their own line, preceded and followed by a blank line.
6. **Sections** should each focus on ONE idea only. More sections = more readable.

---

## ALL SLIDE KINDS

---

### 1. `explainer` — Teaching card with sections

The primary teaching slide. Use for introducing concepts, laws, definitions.

```json
{
  "kind": "explainer",
  "tag": "note",
  "level": 1,
  "title": "Newton's Second Law of Motion",
  "sections": [
    {
      "heading": "The Law",
      "body": "The **net force** on an object equals its mass times acceleration.\n\n**F = ma**\n\nThis is a vector equation — force and acceleration point in the same direction."
    },
    {
      "heading": "Key Points",
      "body": "• F is the **NET** (resultant) force — not any single force\n• Mass (m) is a scalar — no direction\n• SI unit: **1 Newton = 1 kg·m/s²**"
    }
  ],
  "highlight": "Always find NET force first before applying F = ma.",
  "example": {
    "wrong": "Applied force is 10 N → a = 10/5 = 2 m/s². ❌ (ignored friction!)",
    "right": "Applied = 10 N, Friction = 4 N → Net F = 6 N → a = 6/5 = 1.2 m/s² ✓"
  }
}
```

**Fields:**
- `sections[]` — array of `{ heading?, body }`. Heading optional.
- `highlight` — Key takeaway in yellow box. Optional.
- `example` — `wrong` (red box: common mistake) + `right` (green box: correct approach). Optional.

---

### 2. `visual` — SVG/HTML Diagram Slide

Renders an inline SVG or HTML snippet as a visual aid. Use for diagrams, spectrum bars,
tables, force diagrams, number lines, graphs, etc. This is the most powerful slide for
physical intuition — a good diagram replaces 3 explainer slides.

```json
{
  "kind": "visual",
  "tag": "note",
  "title": "The 7 SI Base Units",
  "caption": "Every physical quantity is built from these 7.",
  "html": "<div style='font-family:sans-serif;padding:8px'><table style='width:100%;border-collapse:collapse;font-size:15px'><thead><tr style='background:#16a34a;color:white'><th style='padding:10px;text-align:left;border-radius:8px 0 0 0'>Quantity</th><th style='padding:10px;text-align:left'>Unit</th><th style='padding:10px;text-align:left;border-radius:0 8px 0 0'>Symbol</th></tr></thead><tbody><tr style='background:#f0fdf4'><td style='padding:10px;font-weight:bold'>Length</td><td style='padding:10px'>metre</td><td style='padding:10px;color:#16a34a;font-weight:bold'>m</td></tr><tr style='background:#fff'><td style='padding:10px;font-weight:bold'>Mass</td><td style='padding:10px'>kilogram</td><td style='padding:10px;color:#16a34a;font-weight:bold'>kg</td></tr><tr style='background:#f0fdf4'><td style='padding:10px;font-weight:bold'>Time</td><td style='padding:10px'>second</td><td style='padding:10px;color:#16a34a;font-weight:bold'>s</td></tr><tr style='background:#fff'><td style='padding:10px;font-weight:bold'>Electric Current</td><td style='padding:10px'>ampere</td><td style='padding:10px;color:#16a34a;font-weight:bold'>A</td></tr><tr style='background:#f0fdf4'><td style='padding:10px;font-weight:bold'>Temperature</td><td style='padding:10px'>kelvin</td><td style='padding:10px;color:#16a34a;font-weight:bold'>K</td></tr><tr style='background:#fff'><td style='padding:10px;font-weight:bold'>Amount</td><td style='padding:10px'>mole</td><td style='padding:10px;color:#16a34a;font-weight:bold'>mol</td></tr><tr style='background:#f0fdf4;'><td style='padding:10px;font-weight:bold;border-radius:0 0 0 8px'>Luminous Intensity</td><td style='padding:10px'>candela</td><td style='padding:10px;color:#16a34a;font-weight:bold;border-radius:0 0 8px 0'>cd</td></tr></tbody></table></div>"
}
```

**Rules for writing `html`:**
- Use **inline styles only** (no class names — Tailwind is not available inside innerHTML).
- Keep it **self-contained**: no external images, no JavaScript, no `<script>` tags.
- Use `<svg>` for vector shapes (arrows, circles, diagrams, spectrum bars).
- Use `<table>` for comparison tables.
- Use `<div>` with flexbox/grid for layouts.
- Preferred colors: green `#16a34a`, lime `#84cc16`, blue `#3b82f6`, orange `#f97316`, red `#ef4444`, gray `#6b7280`.
- Font size should be `15px` minimum for readability.
- Max useful width is **360px** (mobile). Avoid fixed widths wider than this.

**SVG Example — Force diagram:**
```json
{
  "kind": "visual",
  "tag": "note",
  "title": "Free Body Diagram: Block on Incline",
  "caption": "Forces acting on a block sliding down a frictionless incline.",
  "html": "<svg width='320' height='220' viewBox='0 0 320 220' style='display:block;margin:auto;font-family:sans-serif'><polygon points='20,190 300,190 300,90' fill='#d1fae5' stroke='#16a34a' stroke-width='2'/><rect x='145' y='105' width='50' height='50' rx='6' fill='#16a34a' transform='rotate(-18,170,130)'/><text x='165' y='135' fill='white' font-size='12' font-weight='bold' transform='rotate(-18,170,130)'>Block</text><line x1='170' y1='130' x2='170' y2='195' stroke='#ef4444' stroke-width='2.5' marker-end='url(#arr)'/><text x='178' y='172' fill='#ef4444' font-size='13' font-weight='bold'>mg</text><line x1='170' y1='130' x2='115' y2='90' stroke='#3b82f6' stroke-width='2.5' marker-end='url(#arr2)'/><text x='108' y='85' fill='#3b82f6' font-size='13' font-weight='bold'>N</text><defs><marker id='arr' markerWidth='8' markerHeight='8' refX='4' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 Z' fill='#ef4444'/></marker><marker id='arr2' markerWidth='8' markerHeight='8' refX='4' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 Z' fill='#3b82f6'/></marker></defs><text x='290' y='208' fill='#6b7280' font-size='11'>θ</text></svg>"
}
```

**Common visual types and when to use:**
| Use case | Approach |
|---|---|
| Tables (units, formulas, properties) | `<table>` with inline styles |
| Spectrum / number line / scale | `<svg>` with `<rect>` bars and `<text>` labels |
| Force / vector diagrams | `<svg>` with `<line>` + `<polygon>` arrows |
| Atomic / orbital diagrams | `<svg>` with `<circle>` elements |
| Graphs (qualitative) | `<svg>` with `<polyline>` or `<path>` |
| Flow charts / process steps | `<div>` with flexbox arrows |
| Comparison (two columns) | `<div>` with CSS grid `grid-template-columns: 1fr 1fr` |

---

### 3. `formula_card` — Large highlighted formula

A dedicated slide for a key formula — large, color-coded, with part-by-part breakdown.
Use after introducing a concept but before applying it in questions.

```json
{
  "kind": "formula_card",
  "tag": "note",
  "level": 2,
  "title": "Kinematic Equation — Velocity-Time",
  "formula": "v = u + at",
  "color": "blue",
  "parts": [
    { "symbol": "v", "meaning": "Final velocity (m/s)" },
    { "symbol": "u", "meaning": "Initial velocity (m/s)" },
    { "symbol": "a", "meaning": "Acceleration (m/s²)" },
    { "symbol": "t", "meaning": "Time (s)" }
  ],
  "note": "Valid only when acceleration is constant.",
  "derived_from": "Definition of acceleration: a = (v−u)/t → rearranged to v = u + at"
}
```

**Fields:**
- `formula` — The formula string, displayed large and centered.
- `color` — Accent color: `"green"`, `"blue"`, `"orange"`, `"purple"`, `"red"`.
- `parts[]` — Each `{ symbol, meaning }` shown as a color-coded legend below.
- `note` — Small warning/condition shown at bottom. Optional.
- `derived_from` — Brief derivation shown collapsed. Optional.

---

### 4. `tap_reveal` — Progressive reveal card

Cards are revealed one by one on tap. Perfect for memorizing lists (base units,
periodic trends, steps of a process, laws in sequence).

```json
{
  "kind": "tap_reveal",
  "tag": "note",
  "title": "Tap to Reveal: The 7 SI Base Units",
  "instruction": "Tap each card to reveal the unit and symbol.",
  "items": [
    { "front": "Length", "back": "metre (m)" },
    { "front": "Mass", "back": "kilogram (kg)" },
    { "front": "Time", "back": "second (s)" },
    { "front": "Electric Current", "back": "ampere (A)" },
    { "front": "Temperature", "back": "kelvin (K)" },
    { "front": "Amount of Substance", "back": "mole (mol)" },
    { "front": "Luminous Intensity", "back": "candela (cd)" }
  ]
}
```

**Use for:** lists of facts, law statements, periodic trends, reaction steps, definitions.

---

### 5. `worked_example` — Step-by-step solution

A JEE-style problem solved step by step. Each step is revealed when the student taps
"Next Step". Builds problem-solving intuition better than just reading a solution.

```json
{
  "kind": "worked_example",
  "tag": "note",
  "level": 3,
  "title": "Worked Example: Unit Conversion using Dimensions",
  "problem": "Convert 1 Joule into CGS units (ergs) using dimensional analysis.",
  "steps": [
    {
      "step": "Write the dimensional formula",
      "detail": "Energy = [M¹ L² T⁻²]\nSo a = 1, b = 2, c = −2"
    },
    {
      "step": "Write the conversion formula",
      "detail": "n₂ = n₁ × (M₁/M₂)¹ × (L₁/L₂)² × (T₁/T₂)⁻²\n\nHere: System 1 = SI, System 2 = CGS\nn₁ = 1 J"
    },
    {
      "step": "Substitute unit ratios",
      "detail": "M₁/M₂ = 1 kg / 1 g = 1000\nL₁/L₂ = 1 m / 1 cm = 100\nT₁/T₂ = 1 s / 1 s = 1"
    },
    {
      "step": "Calculate",
      "detail": "n₂ = 1 × (1000)¹ × (100)² × (1)⁻²\n   = 1 × 10³ × 10⁴ × 1\n   = 10⁷"
    },
    {
      "step": "Final Answer",
      "detail": "**1 Joule = 10⁷ erg** ✓\n\nSame result as the standard conversion — dimensional analysis works!"
    }
  ]
}
```

**Rules:**
- `problem` — The question posed.
- `steps[]` — Array of `{ step, detail }`. Each `step` is a short title; `detail` is the working.
- 3–6 steps is ideal. Too many steps = student loses patience.
- Always end with a "Final Answer" step that states the result clearly.

---

### 6. `common_mistake` — Misconception buster

A red-themed slide highlighting 2–4 mistakes students typically make on this topic.
High-retention format — mistakes are memorable.

```json
{
  "kind": "common_mistake",
  "tag": "note",
  "title": "⚠️ Common Mistakes: Newton's Laws",
  "mistakes": [
    {
      "mistake": "Using a single force instead of the NET force in F = ma",
      "fix": "Always resolve ALL forces, then find the resultant before applying F = ma."
    },
    {
      "mistake": "Thinking heavier objects fall faster",
      "fix": "In free fall (no air resistance), all bodies fall with the same acceleration g, regardless of mass."
    },
    {
      "mistake": "Confusing action-reaction pairs — thinking they cancel each other",
      "fix": "Action-reaction pairs act on DIFFERENT bodies, so they never cancel. Only forces on the SAME body cancel."
    }
  ]
}
```

**Rules:**
- `mistakes[]` — Array of `{ mistake, fix }`.
- 2–4 mistakes per slide. Do not overload.
- `mistake` — What students get wrong (stated directly, in student language).
- `fix` — The correct understanding, concisely stated.

---

### 7. `mcq` — Multiple choice question

```json
{
  "kind": "mcq",
  "tag": "question",
  "level": 2,
  "question": "A 5 kg block is pushed with 20 N on a surface where μ = 0.2. Find acceleration. (g = 10 m/s²)",
  "options": ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
  "correct": "2 m/s²",
  "explanation": "Friction = μmg = 0.2 × 5 × 10 = 10 N\nNet force = 20 − 10 = 10 N\na = F/m = 10/5 = **2 m/s²**",
  "hint": "Find friction force first, then subtract from applied force."
}
```

For JEE previous year questions, use `"tag": "prev_year"`:
```json
{
  "kind": "mcq",
  "tag": "prev_year",
  "level": 3,
  "year": "JEE Main 2023",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct": "...",
  "explanation": "..."
}
```

**Rules:**
- `correct` must exactly match one of the `options` strings.
- All 4 options must be distinct.
- Use realistic JEE-style distractors (common errors, wrong units, sign mistakes).
- `explanation` must show **full working** for numericals — formula, substitution, result.
- `hint` — Optional. Shown before checking. Costs XP to use (gamification hook).

---

### 8. `fill_blank` — Fill in the blank

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
  "explanation": "Pressure = Force/Area = [MLT⁻²]/[L²] = **[ML⁻¹T⁻²]**"
}
```

**Rules:**
- Use `_______` (7 underscores) per blank. `distractors` must have exactly 3 items.
- Great for: dimensional formulae, completing equations, reaction products, unit conversions.

---

### 9. `match_pairs` — Match left to right

```json
{
  "kind": "match_pairs",
  "tag": "question",
  "level": 1,
  "instruction": "Match each quantity to its SI unit:",
  "pairs": [
    { "word": "Force", "meaning": "Newton (N)" },
    { "word": "Energy", "meaning": "Joule (J)" },
    { "word": "Power", "meaning": "Watt (W)" },
    { "word": "Pressure", "meaning": "Pascal (Pa)" }
  ],
  "explanation": "F = kg·m/s² = N; Energy = N·m = J; Power = J/s = W; Pressure = N/m² = Pa"
}
```

**CRITICAL: Every `meaning` must be 100% unique. Duplicates break the game.**

---

### 10. `reorder_sentence` — Drag into correct order

```json
{
  "kind": "reorder_sentence",
  "tag": "question",
  "level": 2,
  "instruction": "Arrange EM waves from lowest to highest frequency:",
  "words": ["Microwaves", "X-rays", "Radio Waves", "Infrared", "Visible Light"],
  "correct": "Radio Waves|Microwaves|Infrared|Visible Light|X-rays",
  "isOrdering": true,
  "explanation": "Radio < Microwave < Infrared < Visible < UV < X-ray < Gamma (increasing frequency)"
}
```

**Rules:**
- `isOrdering: true` → items joined by `|` in `correct` (for sequences/rankings).
- Omit `isOrdering` → items joined by spaces + period (for sentence building).

---

### 11. `error_correction` — Spot the wrong statement

```json
{
  "kind": "error_correction",
  "tag": "question",
  "level": 3,
  "title": "Spot the Mistake: Thermodynamics",
  "instruction": "One of these statements is WRONG. Which one?",
  "sentences": [
    { "text": "In isothermal process, temperature stays constant.", "correct": true },
    {
      "text": "In isobaric process, the volume remains constant.",
      "correct": false,
      "explanation": "WRONG — In isobaric process, PRESSURE stays constant. Volume staying constant = isochoric process."
    },
    { "text": "In adiabatic process, no heat is exchanged with surroundings.", "correct": true }
  ]
}
```

**Rules:** Exactly ONE `"correct": false`. That entry MUST have `"explanation"`. 3–4 sentences total.

---

### 12. `flashcard` — Flip card for formulas/concepts

```json
{
  "kind": "flashcard",
  "tag": "note",
  "level": 2,
  "word": "Escape Velocity",
  "meaning": "Minimum speed to escape a planet's gravity: vₑ = √(2GM/R) = √(2gR)",
  "example": "Earth: vₑ = √(2 × 9.8 × 6.4×10⁶) ≈ 11.2 km/s",
  "partOfSpeech": "Physics · Gravitation",
  "wrong": "Don't confuse with orbital velocity vₒ = √(gR). Escape = √2 × orbital!",
  "collocations": ["vₑ = √(2GM/R)", "vₑ = √2 · vₒ", "vₑ independent of mass of object"],
  "family": ["Orbital velocity — vₒ = √(gR)", "Binding energy — ½mvₑ² = GMm/R"]
}
```

**Adapting for JEE:** `word` = concept name, `partOfSpeech` = "Subject · Chapter", `collocations` = related formula forms.

---

### 13. `mini_explainer` — Quick tip / shortcut

```json
{
  "kind": "mini_explainer",
  "tag": "note",
  "title": "⚡ Shortcut: Dimensional Analysis Check",
  "body": "To quickly verify any equation:\n1. Write dimensions of every term\n2. Check all terms match\n3. If any term differs → equation is WRONG",
  "quick": [
    { "label": "v = u + at: [LT⁻¹] = [LT⁻¹] + [LT⁻²][T] = [LT⁻¹] ✓", "icon": "✅" },
    { "label": "v = u + at²: [LT⁻¹] ≠ [L] ✗ — Dimensionally WRONG", "icon": "❌" }
  ]
}
```

---

### 14. `passage` — Long-form reading before questions

```json
{
  "kind": "passage",
  "tag": "note",
  "label": "📖 Read carefully — questions follow",
  "text": "A block of mass 5 kg is placed on a rough inclined plane at 30°...\n\nThe normal force balances the perpendicular component...",
  "tip": "Draw a free body diagram before attempting the questions."
}
```

---

## GAMIFICATION FEATURES

### Streak Bonuses
The app tracks consecutive correct answers within a lesson. At 3-in-a-row, a "🔥 On a roll!" animation triggers. The JSON does not need to encode this — it happens automatically in the UI.

### Hint Penalty
Using the `hint` field in an MCQ costs the student XP. Include helpful but not give-away hints.

### JEE Prev Year Badge
Setting `"tag": "prev_year"` and `"year": "JEE Main 20XX"` renders a gold badge on the question card. Use for actual past paper questions to boost student motivation.

### XP Scoring
- Base XP per lesson defined in `courseData.js`
- Student earns XP proportional to score (score% × lesson XP)
- 60% minimum to unlock next lesson

---

## LESSON STRUCTURE TEMPLATE

A high-quality subtopic is now divided into **4 separate Parts** (completed progressively). 
Each part is a separate JSON file/array containing **5–8 slides** (totalling ~20-30 slides across all parts). 

```
── PART 1: BASICS (5–8 slides) ──
01  explainer     (tag:note, level:1)   — Concept intro
02  visual        (tag:note)            — Diagram orienting the student
03  explainer     (tag:note, level:1)   — Core concept
04  formula_card  (tag:note, level:1)   — Main formula
05  mcq           (tag:question, L1)    — Basic recall

── PART 2: MEMORIZATION & CHECKING (5–8 slides) ──
01  tap_reveal    (tag:note)            — Memorization list
02  mini_explainer(tag:note)            — Shortcut or trick
03  fill_blank    (tag:question, L2)    — Formula application
04  match_pairs   (tag:question, L1)    — Concepts matching
05  mcq           (tag:question, L2)    — Conceptual problem

── PART 3: DEEP DIVE (5–8 slides) ──
01  explainer     (tag:note, level:2)   — Deeper aspect
02  visual        (tag:note)            — Complex diagram
03  worked_example(tag:note, level:3)   — Full problem solved step by step
04  mcq           (tag:question, L3)    — Multi-step problem
05  reorder       (tag:question, L2)    — Sequence order

── PART 4: MASTERY (5–8 slides) ──
01  common_mistake(tag:note)            — Common misconceptions
02  error_correction(tag:question, L3)  — Identify wrong statement
03  mcq           (tag:prev_year, L4)   — Expert/JEE PYQ problem
04  flashcard     (tag:note, level:2)   — Quick summary
05  explainer     (tag:note, level:1)   — Lesson wrap-up
```

Each part should use at least **3-4 different slide kinds**.

---

## SUBJECT-SPECIFIC GUIDELINES

### Physics
- State physical quantities with units in every numerical.
- Describe free-body diagrams in `visual` slides using SVG arrows.
- Sign convention must be stated explicitly for mechanics.
- Show full working: formula → substitution → simplification → answer with units.

### Chemistry
- Write balanced equations in `explainer` body text.
- Name reaction types/mechanisms (SN1, SN2, E1, E2, Markovnikov, etc.).
- Periodic trends: always state "increases/decreases across period/down group".
- Use `visual` for orbital diagrams, periodic table excerpts, reaction mechanism arrows.

### Mathematics
- Show numbered steps for proofs.
- Use `visual` for coordinate geometry diagrams.
- For calculus: show integration/differentiation steps clearly.
- `formula_card` for every important identity (trig, integration standard forms).

---

## VISUAL GUIDELINES (for `html` field in `visual` slides)

```
COLOR PALETTE
  Primary green:  #16a34a
  Lime accent:    #84cc16
  Blue:           #3b82f6
  Orange:         #f97316
  Red:            #ef4444
  Purple:         #8b5cf6
  Gray:           #6b7280
  Background:     white (#ffffff) or very light (#f0fdf4)

TYPOGRAPHY
  Font family: sans-serif
  Minimum font size: 15px for body, 13px for labels
  Bold key terms: font-weight:bold

LAYOUT
  Max width: 360px (mobile-first)
  Padding: 8–12px inside containers
  Border radius: 8px for cards, 4px for table cells

SVG CONVENTIONS
  Arrow heads: <marker> with <path d='M0,0 L8,4 L0,8 Z'>
  Line thickness: 2–3px for main lines, 1px for supporting
  Text on SVG: font-family='sans-serif', font-size='13'
  SVG viewBox: always set a viewBox to scale properly
```

**What makes a great `visual` slide:**
- One clear idea per diagram (don't pack too much)
- Labels are readable at 15px+
- Uses color to highlight the KEY element (e.g. the force being discussed)
- Has a clear `caption` explaining what the student is looking at

---

## MATH & EQUATION FORMATTING

1. **Use Unicode & HTML for Inline Math**: For standard formulas integrated into text, use appropriate Unicode symbols (`∫`, `∑`, `°`, `±`, `α`, `β`) and HTML tags (`<sup>`, `<sub>`, `<i>`). Example: `[ML⁻¹T⁻²]`, `x² + y²`, `F = ma`.
2. **No Raw-Text Integrals**: NEVER try to write complex structures (like integrals with limits, limits to infinity, big fractions) as raw text (e.g. "integral from 0 to 1"). 
3. **Complex Math in Visual Slides**: If an equation is too complex to look good with Unicode/HTML in a regular text block, use a `visual` slide. Construct it elegantly with SVG or HTML layouts (using tables or flexbox for fractions) to present limits, matrices, or large summation formulas cleanly.

---

## MOCK TEST FILE STRUCTURE

```json
[
  {
    "id": "p1",
    "title": "Physics Mock Test 1",
    "questions": [
      {
        "id": "p1_1",
        "question": "A particle moves in a circle of radius 2 m at speed 4 m/s. Centripetal acceleration is:",
        "options": ["2 m/s²", "4 m/s²", "8 m/s²", "16 m/s²"],
        "correct": "8 m/s²",
        "explanation": "a = v²/r = 16/2 = 8 m/s²"
      }
    ]
  }
]
```

- 25–30 questions per set.
- Question IDs unique: `p1_1 … p1_30`, `p2_1 … p2_30`.
- Mix chapters and difficulty: ~40% L1–2, ~40% L3, ~20% L4.

---

## ADDING A NEW LESSON — CHECKLIST

Before submitting a lesson JSON, verify:

- [ ] Valid JSON — array of slide objects
- [ ] Ensure 4 parts are generated (`<lesson_id>_p1.json` to `<lesson_id>_p4.json`)
- [ ] **~5-8 slides per part** (totalling ~20-30 for the whole subtopic)
- [ ] Follow Math & Equation Formatting correctly (no raw text integrals)
- [ ] Every slide has `kind`, `tag`, and `level` (for question slides)
- [ ] At least **3-4 different `kind` values** used per part
- [ ] At least **2 `visual` slides** with SVG/HTML diagrams overall
- [ ] At least **1 `worked_example`** for non-trivial topics
- [ ] At least **1 `common_mistake`** slide
- [ ] Difficulty increases: starts L1 → ends L3–4
- [ ] `mcq` correct matches options exactly, all 4 options distinct
- [ ] `fill_blank` blank count = blanks array length, 3 distractors each
- [ ] `match_pairs` ALL meanings are unique
- [ ] `reorder_sentence` correct contains all words items
- [ ] `error_correction` exactly ONE sentence has `correct: false` with explanation
- [ ] Explanations show full working (formula → substitution → answer with units)
- [ ] No walls of text (max 4–5 lines per section block)
- [ ] Lesson has a clear opening (hook) and closing (summary)
- [ ] Import added in `lessonLoader.js` after creating the file
