# JeeBoost — Lesson Generation Prompt Template

Copy everything below the line, fill in the [BRACKETED] fields, then paste into your LLM along with the content guide.

---

## HOW TO USE

1. Open your LLM (ChatGPT, Claude, Gemini, etc.)
2. Upload `content-guide-for-ai.md` as a reference file (or paste it in)
3. Copy the prompt below, fill in the fields, and send it

---

---
PROMPT START — COPY FROM HERE
---

You are generating a lesson JSON file for **JeeBoost**, a Duolingo-style JEE Mains learning app. You have been given the `content-guide-for-ai.md` file as your complete reference. Follow it exactly.

## LESSON TO GENERATE

- **Lesson ID:** `[LESSON_ID]`  
  *(e.g. `p11_c1_l1`, `c12_c3_l2`, `m11_c12_l2` — from courseData.js)*
- **Subject:** `[SUBJECT]`  
  *(Physics / Chemistry / Mathematics)*
- **Class:** `[CLASS]`  
  *(Class 11 / Class 12)*
- **Chapter:** `[CHAPTER_NAME]`  
  *(e.g. Units and Measurements, Chemical Kinetics, Integrals)*
- **Topic / Lesson Title:** `[TOPIC_NAME]`  
  *(e.g. SI Units & Fundamental Units, Rate Law and Order of Reaction, Integration by Substitution)*
- **Lesson Type:** `[info OR quiz]`  
  *(info = concept-heavy, quiz = practice-heavy)*

## JEE SYLLABUS COVERAGE FOR THIS TOPIC

Cover ALL of the following subtopics — do not skip any:

```
[PASTE THE SPECIFIC SYLLABUS POINTS FOR THIS TOPIC]

Example:
- SI units, Fundamental and derived units
- Definition of metre, kilogram, second (modern 2019 definitions)
- SI prefixes (nano, micro, milli, kilo, mega, giga)
- CGS system and conversions (1 N = 10⁵ dyne, 1 J = 10⁷ erg)
- Dimensional formulae of key quantities
- Principle of homogeneity
- Uses of dimensional analysis (checking, deriving, converting)
- Limitations of dimensional analysis
- Quantities with same dimensions (JEE trap questions)
```

## OUTPUT REQUIREMENTS

Generate a **single valid JSON array** — the complete lesson file.

### Extreme Depth & Comprehensiveness Required
The student must learn **EVERYTHING** about this specific JEE topic just by going through this lesson. Do not miss any edge cases, exceptions, or advanced applications relevant to JEE Main.
- **Minimum 20 unique sub-sections/concepts covered.** (There is NO limit on how many slides you generate — keep generating until the topic is exhaustively covered).
- Build deep intuition before dropping formulas.
- Treat this as a complete standalone module, replacing any textbook.
- Refer to the internet (or your deep training knowledge) to ensure no sub-topic or JEE trap is missed.

### Mandatory slide counts and kinds:
- **Total slides: 40–80+** (Never generate fewer than 40 slides for a core topic. Be exhaustive.)
- **At least 4 `visual` slides** with proper inline SVG or HTML diagrams to build intuition.
- **At least 2 `formula_card` slides** covering main equations and derivations.
- **At least 2 `tap_reveal` slides** for memorizing sequences, laws, or tables.
- **At least 3 `worked_example` slides** (covering easy, medium, and difficult JEE-style problems step-by-step).
- **At least 2 `common_mistake` slides** (JEE-specific traps and misconceptions).
- **At least 5 `mcq` slides at level 3 or 4** interspersed throughout the lesson.
- **At least 2 `match_pairs` slides** and **2 `fill_blank` slides**.
- **At least 1 `error_correction` slide**.

### Lesson Arc — highly structured storytelling:
1. **The Hook (Beginning)**: Start with a powerful `explainer` and `visual`. Why does this topic exist? What physical/mathematical problem does it solve?
2. **The Climb (Middle)**: Exhaustive covering of every subtopic.
   - For *every* distinct subtopic, use the loop: Teach (`explainer`/`visual`) → Practice (`fill_blank`/`match_pairs`) → Deepen (`formula_card`/`mini_explainer`) → Test (`mcq`/`worked_example`).
   - Increase difficulty continuously (Level 1 → Level 4).
3. **The Crucible (Challenge)**: A sequence of back-to-back Level 3 and 4 MCQs, `error_correction` and `worked_example` slides. Include actual past year questions with `"tag": "prev_year"`.
4. **The Anchor (Conclusion)**: Comprehensive summary. Use a `flashcard` for key formulas and a final `explainer` highlighting what to review before the exam.

### Tagging rules:
- Teaching slides (`explainer`, `mini_explainer`, `visual`, `formula_card`, `tap_reveal`, `flashcard`, `worked_example`, `common_mistake`): `"tag": "note"`
- Practice slides (`mcq`, `fill_blank`, `match_pairs`, `reorder_sentence`, `error_correction`): `"tag": "question"`
- Actual JEE past year questions: `"tag": "prev_year"` + `"year": "JEE Main 20XX"`

### Difficulty progression:
- First 8 slides: levels 1–2
- Middle slides: levels 2–3
- Last 5 slides: levels 3–4

### Quality rules (critical):
- `mcq`: `correct` must exactly match one of the 4 `options`. All 4 must be distinct. Show **full working** in `explanation` (formula → substitution → answer with units).
- `fill_blank`: Each blank = one `_______` (7 underscores). Each blank has exactly 3 `distractors`. Distractors must be plausible (common student mistakes).
- `match_pairs`: Every `meaning` must be **100% unique** — the app breaks if two meanings are the same.
- `error_correction`: Exactly **one** sentence has `"correct": false`. It must have an `explanation`.
- `reorder_sentence`: If ordering items (not building a sentence), set `"isOrdering": true` and join `correct` items with `|`.
- `visual` HTML: Use **inline styles only**. No Tailwind classes. Font size ≥ 15px. Max width 360px. Use SVG for diagrams with arrows, circles, shapes.
- `worked_example`: 3–6 steps. Each step has a short `step` title and a detailed `detail` showing working.

### Style rules:
- Keep body text short — max 4–5 lines per section block. Use bullet points with `\n• `.
- Use `\n\n` between logical blocks in body strings.
- No walls of text. This is mobile-first.
- Formulas: put on their own line, surrounded by blank lines.
- Be encouraging in explanations: "Great thinking!", "A common trap here is..."

## OUTPUT FORMAT

Output **only** the raw JSON array. No markdown code fences, no explanation before or after — just the JSON. It must be valid, parseable JSON.

Start with `[` and end with `]`.

---
PROMPT END
---

## FILL-IN EXAMPLES

### Example 1 — Physics
```
Lesson ID:     p11_c1_l2
Subject:       Physics
Class:         Class 11
Chapter:       Units and Measurements
Topic:         Least Count, Accuracy & Precision
Lesson Type:   quiz
Syllabus:
  - Least count of measuring instruments
  - Vernier callipers — least count, zero error, reading
  - Screw gauge — pitch, least count, zero error, reading
  - Accuracy vs Precision (definitions + diagram)
  - Absolute error, relative error, percentage error
  - Propagation of errors (sum, difference, product, quotient, power)
```

### Example 2 — Chemistry
```
Lesson ID:     c12_c3_l1
Subject:       Chemistry
Class:         Class 12
Chapter:       Chemical Kinetics
Topic:         Rate Law, Order & Molecularity
Lesson Type:   info
Syllabus:
  - Rate of reaction (average and instantaneous)
  - Rate law expression and rate constant (k)
  - Order of reaction (zero, first, second) — definition and determination
  - Molecularity (unimolecular, bimolecular, termolecular)
  - Differences between order and molecularity
  - Units of rate constant for different orders
  - Integrated rate equations for zero and first order
  - Half-life expressions
```

### Example 3 — Mathematics
```
Lesson ID:     m12_c7_l1
Subject:       Mathematics
Class:         Class 12
Chapter:       Integrals
Topic:         Integration by Substitution & Parts
Lesson Type:   quiz
Syllabus:
  - Integration as reverse of differentiation
  - Standard integrals list (must cover all standard forms)
  - Method of substitution — technique and examples
  - Integration by parts — ILATE rule
  - Integral of e^x[f(x) + f'(x)] type
  - Integral of 1/(ax²+bx+c) and similar forms
```

## AFTER THE AI GENERATES THE JSON

1. Copy the output
2. Save it as `src/data/lessons/jee/[LESSON_ID].json`
3. Open `src/data/lessonLoader.js`
4. Add this import at the top (in the dedicated imports section):
   ```js
   import [LESSON_ID_CAMEL] from './lessons/jee/[LESSON_ID].json'
   ```
5. Add this line inside `LESSON_SLIDES`:
   ```js
   '[LESSON_ID]': [LESSON_ID_CAMEL],
   ```
6. The lesson is now live — navigate to it in the app to test.
