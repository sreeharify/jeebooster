# IELTSdua — Content Guide for AI Expansion

This document tells an AI exactly where content is stored, how it is structured,
and what to produce to expand lessons or mock tests.

---

## WHERE CONTENT LIVES

### Lesson slides
```
src/data/lessons/
  vocab/
    academic-words-1.json     → lesson l2_1  (Academic Word List Set 1)
    academic-words-2.json     → lesson l2_2  (Academic Word List Set 2)
    collocations.json         → lesson l2_3
    synonyms-paraphrasing.json→ lesson l2_4
    vocabulary-test.json      → lesson l2_5
    writing-vocabulary.json   → lessons l7_5, l10_4

  grammar/
    complex-sentences.json    → lesson l11_1
    relative-clauses.json     → lesson l11_2
    passive-voice.json        → lesson l11_3
    conditionals.json         → lesson l11_4
    reported-speech.json      → lesson l11_5
    inversion.json            → lesson l12_1
    nominalization.json       → lesson l12_2
    hedging.json              → lesson l12_3
    discourse-markers.json    → lesson l12_4
    grammar-mastery-test.json → lesson l12_5

  reading/
    skim-scan.json            → lesson l5_1
    tfng.json                 → lesson l5_2  (True/False/Not Given)
    headings.json             → lesson l5_3
    matching.json             → lessons l5_4, l6_4
    summary-completion.json   → lessons l6_1, l6_2
    short-answer.json         → lesson l6_3
    reading-test.json         → lesson l6_5

  writing/
    graphs-charts.json        → lesson l7_1
    process-diagrams.json     → lesson l7_2
    maps-comparisons.json     → lessons l7_3, l7_4
    opinion-essay.json        → lesson l8_1
    discussion-essay.json     → lesson l8_2
    problem-solution.json     → lesson l8_3
    adv-disadv.json           → lesson l8_4
    thesis-statements.json    → lesson l8_5
    cohesion-coherence.json   → lesson l8_6
    writing-test.json         → lesson l8_7

  speaking/
    part1-intro.json          → lesson l9_1
    personal-topics.json      → lesson l9_2
    extending-answers.json    → lesson l9_3
    fluency-tips.json         → lesson l9_4
    cue-card.json             → lesson l10_1
    abstract-discussion.json  → lesson l10_2
    expressing-opinions.json  → lesson l10_3
    speaking-test.json        → lesson l10_5

  listening/
    everyday-conversations.json → lesson l3_1
    form-completion.json        → lesson l3_2
    map-diagram.json            → lesson l3_3
    monologue.json              → lesson l3_4
    academic-discussions.json   → lesson l4_1
    note-taking.json            → lesson l4_3
    prediction-strategies.json  → lesson l4_4
    listening-test.json         → lesson l4_5

  info/
    test-format.json          → lesson l1_1
    study-plan.json           → lesson l1_4

  quiz/
    band-score-system.json    → lesson l1_2
    academic-vs-general.json  → lesson l1_3
    general-quiz.json         → lesson l4_2
```

### Mock test sets
```
src/data/tests/
  listening.json   ← array of 2 listening sets (10 questions each)
  reading.json     ← array of 2 reading sets (13 questions each)
  writing.json     ← array of 2 writing sets (Task 1 + Task 2)
  speaking.json    ← array of 2 speaking sets (Part 1 + 2 + 3)
```

---

## HOW LESSON FILES ARE STRUCTURED

Every lesson JSON file is an **array of slide objects**.
Each slide has a `kind` field. The app renders a different component per kind.

### RULE: Every `meaning` in `match_pairs` must be unique within that slide.

---

## SLIDE SCHEMAS (copy-paste ready)

### 1. `explainer` — Teaching card with sections
```json
{
  "kind": "explainer",
  "band": 7,
  "title": "The title shown at top",
  "sections": [
    {
      "heading": "Section heading (optional)",
      "body": "Main text. Use \\n for newlines, \\n\\n for paragraph breaks."
    },
    {
      "heading": "Another section",
      "body": "More content here."
    }
  ],
  "highlight": "Key takeaway shown in a yellow box. Optional.",
  "example": {
    "wrong": "Band 5–6 example sentence shown in red",
    "right": "Band 8+ example sentence shown in green"
  }
}
```

### 2. `mini_explainer` — Quick tip card
```json
{
  "kind": "mini_explainer",
  "title": "Short title",
  "body": "Main explanation text. Use \\n for line breaks.",
  "quick": [
    { "label": "Bullet point text", "icon": "💡" },
    { "label": "Another bullet", "icon": "⚠️" }
  ]
}
```

### 3. `mcq` — Multiple choice question (4 options)
```json
{
  "kind": "mcq",
  "band": 7,
  "question": "The question text?",
  "options": [
    "Option A text",
    "Option B text",
    "Option C text",
    "Option D text"
  ],
  "correct": "Option B text",
  "explanation": "Detailed explanation shown after answering. Use \\n for line breaks.",
  "hint": "Optional hint shown before the user checks their answer."
}
```
**Rules:**
- `correct` must exactly match one of the `options` strings
- All 4 options must be distinct
- `band` sets the difficulty badge: 6 = Foundation, 7 = Developing, 8 = Advanced, 9 = Expert

### 4. `fill_blank` — Fill in the blank (select from options)
```json
{
  "kind": "fill_blank",
  "band": 7,
  "sentence": "The research _______ that urban farming can contribute significantly.",
  "blanks": [
    {
      "correct": "demonstrated",
      "distractors": ["said", "told", "asked"]
    }
  ],
  "explanation": "Explanation of why the correct answer is right.",
  "hint": "Optional hint text."
}
```
**Rules:**
- Use exactly `_______` (7 underscores) for each blank
- `distractors` must have exactly 3 items
- For multiple blanks, add more objects to the `blanks` array and more `_______` in the sentence

### 5. `match_pairs` — Match left column to right column
```json
{
  "kind": "match_pairs",
  "band": 7,
  "instruction": "Match each word to its meaning:",
  "pairs": [
    { "word": "mitigate",    "meaning": "reduce the severity of something" },
    { "word": "exacerbate",  "meaning": "make a problem worse" },
    { "word": "ubiquitous",  "meaning": "found or appearing everywhere" },
    { "word": "proliferate", "meaning": "increase rapidly in number" }
  ],
  "explanation": "Explanation shown after all pairs are matched correctly."
}
```
**CRITICAL RULE: Every `meaning` must be completely unique. No two pairs can share the same meaning text, even partially. Duplicate meanings break the matching logic.**

- Recommended: 3–5 pairs per slide
- Pairs are shuffled randomly each time

### 6. `reorder_sentence` — Drag words into correct order
```json
{
  "kind": "reorder_sentence",
  "band": 7,
  "instruction": "Arrange the words to form a correct sentence:",
  "words": ["The", "study", "was", "conducted", "under", "controlled", "conditions"],
  "correct": "The study was conducted under controlled conditions.",
  "explanation": "Why this word order is correct.",
  "hint": "Optional hint."
}
```
**Rules:**
- `correct` must be the words joined by single spaces with a period at the end
- `words` should contain all and only the words in `correct`
- Good for: passive voice, inversion, complex sentence structures

### 7. `tfng_single` — True / False / Not Given
```json
{
  "kind": "tfng_single",
  "band": 7,
  "statement": "The statement the student must evaluate.",
  "answer": "True",
  "passage": "Optional: passage text shown above the statement. Include for reading questions.",
  "explanation": "Why the answer is True/False/Not Given. Should reference specific passage text."
}
```
**Rules:**
- `answer` must be exactly: `"True"`, `"False"`, or `"Not Given"`
- For standalone TFNG practice, include `passage`
- For lessons that already showed a passage slide, `passage` can be omitted

### 8. `error_correction` — Find the sentence with a mistake
```json
{
  "kind": "error_correction",
  "band": 8,
  "title": "Find the Error",
  "instruction": "One sentence contains a grammatical or vocabulary error. Which one?",
  "sentences": [
    {
      "text": "This sentence is correct.",
      "correct": true
    },
    {
      "text": "This sentence have an error in it.",
      "correct": false,
      "explanation": "Subject-verb agreement error: 'have' should be 'has' because 'sentence' is singular."
    },
    {
      "text": "This sentence is also correct.",
      "correct": true
    }
  ]
}
```
**Rules:**
- Exactly ONE sentence must have `"correct": false`
- The false sentence must have an `"explanation"` field
- Recommended: 3–4 sentences total

### 9. `flashcard` — Vocabulary flip card
```json
{
  "kind": "flashcard",
  "band": 7,
  "word": "enumerate",
  "meaning": "to mention things one by one in a list",
  "example": "The report enumerates five key recommendations.",
  "partOfSpeech": "verb",
  "wrong": "Don't confuse with: 'elaborate' (to explain in detail)",
  "collocations": [
    "enumerate the factors",
    "enumerate the problems",
    "enumerate key points"
  ],
  "family": [
    "enumeration (n) — 'a detailed enumeration of...'",
    "enumerable (adj) — rare in academic writing"
  ]
}
```

### 10. `passage` — Reading text (use before questions)
```json
{
  "kind": "passage",
  "label": "📖 Read carefully — questions follow",
  "text": "First paragraph of the passage.\n\nSecond paragraph separated by double newline.\n\nThird paragraph.",
  "tip": "Tip shown below the passage. Optional."
}
```
**Note:** Use `\n\n` between paragraphs — the app renders each as a separate paragraph with a letter label (A), (B), (C).

---

## HOW MOCK TEST FILES ARE STRUCTURED

### listening.json — Array of listening sets
```json
[
  {
    "setId": "L1",
    "title": "Listening Test — Set A",
    "sections": [
      {
        "section": 1,
        "label": "Section 1 — Everyday Conversation",
        "context": "Listen to a conversation between...",
        "transcript": "Full transcript text here. The app reads this aloud using Chrome TTS.",
        "questions": [
          {
            "id": "L1_1",
            "type": "mcq",
            "question": "What is the question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": "Option A",
            "explanation": "Brief explanation."
          }
        ]
      },
      {
        "section": 2,
        "label": "Section 2 — Monologue",
        "context": "Listen to a campus orientation talk.",
        "transcript": "Second section transcript...",
        "questions": [ ]
      }
    ]
  }
]
```
**Rules:**
- Each set has 2 sections, each section has 5 questions (10 total per set)
- Questions IDs must be unique across all sets: L1_1..L1_10, L2_1..L2_10
- `correct` must exactly match one of the `options`
- Transcripts should sound like natural speech — include contractions, hesitations, self-corrections

### reading.json — Array of reading sets
```json
[
  {
    "setId": "R1",
    "title": "Reading Test — Set A",
    "passages": [
      {
        "title": "Passage 1: The Rise of Urban Farming",
        "text": "Paragraph one text.\n\nParagraph two text.\n\nParagraph three text.",
        "questions": [
          {
            "id": "R1_1",
            "type": "tfng",
            "statement": "Urban farming is widely regarded as a complete solution to food insecurity.",
            "answer": "False",
            "explanation": "The passage says 'partial solution' not 'complete solution'."
          },
          {
            "id": "R1_2",
            "type": "mcq",
            "question": "What does the author identify as the primary challenge?",
            "options": ["Cost", "Space", "Water supply", "Government regulations"],
            "correct": "Cost",
            "explanation": "Paragraph 2 states 'the prohibitive cost of setup remains the key barrier'."
          },
          {
            "id": "R1_3",
            "type": "heading",
            "question": "Which heading best matches Paragraph 2?",
            "options": [
              "The financial barriers to urban agriculture",
              "Environmental benefits of city farming",
              "Government support for urban growers",
              "Historical origins of urban farming"
            ],
            "correct": "The financial barriers to urban agriculture",
            "explanation": "Paragraph 2 focuses entirely on cost barriers."
          }
        ]
      }
    ]
  }
]
```
**Rules:**
- Each set has 2 passages, total ~13 questions across both
- Question types: `"tfng"`, `"mcq"`, `"heading"`
- TFNG uses `"answer"`: `"True"`, `"False"`, or `"Not Given"`
- MCQ/heading use `"correct"` matching an option exactly
- Question IDs: R1_1..R1_13, R2_1..R2_13

### writing.json — Array of writing sets
```json
[
  {
    "setId": "W1",
    "title": "Writing Test — Set A",
    "tasks": [
      {
        "taskNum": 1,
        "type": "Task 1 — Academic",
        "prompt": "The bar chart below shows the percentage of households with internet access in five countries between 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        "data": {
          "description": "Imagined data for practice:",
          "points": [
            "UK: rose from 73% to 96%",
            "India: rose from 8% to 47%",
            "Brazil: rose from 34% to 74%",
            "Nigeria: rose from 4% to 31%",
            "Japan: rose from 78% to 93%"
          ]
        },
        "minWords": 150,
        "bandGuide": [
          { "band": 6, "desc": "Describes some features but misses key trends or overview" },
          { "band": 7, "desc": "Covers main features with a clear overview and comparisons" },
          { "band": 8, "desc": "Selects and highlights key features accurately with precise data" },
          { "band": 9, "desc": "All key features covered, fully accurate, well-organised, sophisticated language" }
        ],
        "modelParagraph": "Overall, all five countries experienced a substantial increase in household internet access over the decade, with developed nations consistently maintaining higher connectivity rates than emerging economies."
      },
      {
        "taskNum": 2,
        "type": "Task 2 — Opinion Essay",
        "prompt": "Some people believe that social media has had a largely negative impact on society. To what extent do you agree or disagree?",
        "data": null,
        "minWords": 250,
        "bandGuide": [
          { "band": 6, "desc": "Position is clear but development is limited; some irrelevant content" },
          { "band": 7, "desc": "Clear position with developed main ideas; minor lapses in logic" },
          { "band": 8, "desc": "Well-developed argument with clear position and relevant conclusions" },
          { "band": 9, "desc": "Fully developed position, persuasive argument, precise conclusion" }
        ],
        "modelParagraph": "While social media undeniably enables unprecedented global connectivity, I firmly contend that its net effect has been detrimental, primarily due to its role in amplifying misinformation and fostering compulsive usage patterns that erode psychological wellbeing."
      }
    ]
  }
]
```

### speaking.json — Array of speaking sets
```json
[
  {
    "setId": "S1",
    "title": "Speaking Test — Set A",
    "part1": {
      "topic": "Daily Routines",
      "questions": [
        {
          "q": "Do you have a set daily routine?",
          "bandTip": "Use contrast: 'On weekdays I tend to... whereas at weekends I...' Show variety in your life."
        },
        {
          "q": "What time of day do you feel most productive?",
          "bandTip": "Give a specific time + reason + example. 'I find my concentration peaks around 10am because...'"
        },
        {
          "q": "Has your daily routine changed much over the past few years?",
          "bandTip": "Use 'used to' for past habits and present tense for current. Show time awareness."
        }
      ]
    },
    "part2": {
      "topic": "Describe a skill you would like to learn",
      "cuePoints": [
        "What the skill is",
        "Why you want to learn it",
        "How you would learn it",
        "How it would benefit your life"
      ],
      "modelOpening": "I'd like to talk about learning to play the piano — it's something I've always admired but never had the opportunity to pursue seriously until recently."
    },
    "part3": {
      "theme": "Skills and Education",
      "questions": [
        {
          "q": "Do you think schools today teach the right skills for modern life?",
          "bandTip": "Acknowledge both sides: 'While core academic skills remain valuable, there's a compelling argument that digital literacy and critical thinking are underemphasised...'"
        },
        {
          "q": "How has technology changed the way people learn new skills?",
          "bandTip": "Structure: change → positive aspects → potential downsides → overall assessment."
        },
        {
          "q": "Do you think people today have more or fewer opportunities to learn new skills than previous generations?",
          "bandTip": "Challenge the premise if appropriate: 'I'd argue this depends entirely on which skills we're talking about...'"
        }
      ]
    }
  }
]
```

---

## INSTRUCTIONS FOR AN AI EXPANDING THIS CONTENT

### To expand a lesson file:
1. Open the target JSON file (e.g. `src/data/lessons/grammar/conditionals.json`)
2. Note the existing slide topics to avoid repeating them
3. Add new slides to the end of the array following the schemas above
4. Ensure band progression: start new slides at Band 6–7, build to Band 8–9
5. Vary the `kind` — mix explainers, MCQs, fill-blanks, match-pairs, reorder sentences

### To add a new mock test set:
1. Open the target test file (e.g. `src/data/tests/listening.json`)
2. Copy the structure of an existing set
3. Append a new set object to the array
4. Assign a new `setId` (L3, R3, W3, S3 etc.)
5. Use new question IDs (L3_1 through L3_10 for listening)

### Quality standards:
- **Explanations must be specific** — explain exactly WHY the correct answer is right AND why wrong answers are wrong
- **Examples must be IELTS-specific** — use academic language, essay contexts, exam scenarios
- **Band levels must be accurate** — Band 6 questions test basic knowledge; Band 9 tests sophisticated nuance
- **No duplicate questions** — each question in a file must be unique across the whole app
- **Passage text for TFNG** — write dense academic paragraphs ~150 words covering a clear topic
- **match_pairs meanings must ALL be unique** — this is enforced by the app and will log errors if violated

### Recommended additions per category:
- **Grammar**: 3–5 more MCQs per topic testing different aspects of the same structure
- **Vocabulary**: 2–3 more flashcard + MCQ pairs per word family
- **Reading**: A second passage on a different topic in the TFNG/MCQ format
- **Writing**: An additional MCQ comparing Band 6 vs Band 8 paragraphs
- **Listening**: An entirely new set (L3) with a different context (job interview, academic lecture, phone booking)
- **Mock tests**: A third set (L3, R3, W3, S3) for each section doubles practice variety

