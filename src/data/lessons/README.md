# IELTSdua Lesson Content

All lesson content is stored as JSON files in this directory.
Edit any `.json` file to change lesson content — no code changes needed.

## Directory Structure

```
lessons/
  vocab/          — Vocabulary lessons
  grammar/        — Grammar lessons
  reading/        — Reading strategy lessons
  writing/        — Writing lessons
  speaking/       — Speaking lessons
  listening/      — Listening lessons
  info/           — Info / explainer-only lessons
  quiz/           — Quiz lessons
  mock/           — Mock test redirect
  default/        — Fallback for unknown lesson IDs
```

## Adding a New Lesson

1. Create a JSON file: `src/data/lessons/<category>/<lesson-name>.json`
2. Add the mapping in `src/data/lessonLoader.js`:
   ```js
   import myNewLesson from './lessons/category/lesson-name.json'
   // ...in LESSON_SLIDES:
   'l99_1': myNewLesson,
   ```
3. Add the lesson to `src/data/courseData.js`:
   ```js
   { id: 'l99_1', title: 'My New Lesson', type: 'grammar', xp: 25 }
   ```

## Slide Schema

Every JSON file is an **array of slide objects**. Supported slide types:

### `explainer` — Theory card
```json
{
  "kind": "explainer",
  "band": 7,
  "title": "Lesson title",
  "sections": [
    { "heading": "Section heading", "body": "Section text" }
  ],
  "highlight": "Key takeaway shown in yellow box",
  "example": {
    "wrong": "Band 5-6 example",
    "right": "Band 8+ example"
  }
}
```

### `mini_explainer` — Quick tip card
```json
{
  "kind": "mini_explainer",
  "title": "Quick tip title",
  "body": "Tip text",
  "quick": [
    { "label": "Bullet point", "icon": "💡" }
  ]
}
```

### `flashcard` — Vocabulary flip card
```json
{
  "kind": "flashcard",
  "band": 7,
  "word": "ubiquitous",
  "meaning": "present everywhere",
  "example": "Smartphones are ubiquitous.",
  "partOfSpeech": "adjective",
  "wrong": "Don't confuse with: ubiquitous",
  "collocations": ["become ubiquitous", "ubiquitous presence"],
  "family": ["ubiquity (n)"]
}
```

### `mcq` — Multiple choice
```json
{
  "kind": "mcq",
  "band": 7,
  "question": "Which sentence is correct?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": "Option B",
  "explanation": "Explanation shown after answering",
  "hint": "Optional hint shown before answering"
}
```

### `fill_blank` — Fill in the blank
```json
{
  "kind": "fill_blank",
  "band": 7,
  "sentence": "The study _______ a significant finding.",
  "blanks": [
    { "correct": "demonstrated", "distractors": ["said", "told", "asked"] }
  ],
  "explanation": "Why this answer is correct",
  "hint": "Optional hint"
}
```

### `match_pairs` — Matching pairs
```json
{
  "kind": "match_pairs",
  "band": 7,
  "instruction": "Match each word to its meaning:",
  "pairs": [
    { "word": "mitigate", "meaning": "reduce the severity of" },
    { "word": "exacerbate", "meaning": "make worse" }
  ],
  "explanation": "Shown after all pairs matched"
}
```
⚠️ **Every `meaning` must be unique** — duplicates will break the matching logic.

### `reorder_sentence` — Build a sentence
```json
{
  "kind": "reorder_sentence",
  "band": 7,
  "instruction": "Rearrange the words:",
  "words": ["The", "study", "was", "conducted", "carefully"],
  "correct": "The study was conducted carefully.",
  "explanation": "Why this order is correct"
}
```

### `tfng_single` — True / False / Not Given
```json
{
  "kind": "tfng_single",
  "band": 7,
  "statement": "The author argues that technology always improves education.",
  "answer": "False",
  "passage": "Optional passage text shown above the statement",
  "explanation": "Why this answer is correct"
}
```

### `error_correction` — Find the error
```json
{
  "kind": "error_correction",
  "band": 7,
  "title": "Find the Error",
  "instruction": "Which sentence contains a mistake?",
  "sentences": [
    { "text": "This sentence is correct.", "correct": true },
    { "text": "This sentence have an error.", "correct": false, "explanation": "Should be 'has'" }
  ]
}
```

### `passage` — Reading text (followed by questions)
```json
{
  "kind": "passage",
  "label": "Read carefully",
  "text": "Full passage text here...",
  "tip": "Optional tip shown below the passage"
}
```

## Mock Test Sets (`src/data/tests/`)

Each test file is an array of sets. Add more sets by appending to the arrays.
The app randomly picks one set per session.

### Adding More Listening Questions
Edit `src/data/tests/listening.json` — add a new object to the array following the existing format.

### Adding More Reading Passages  
Edit `src/data/tests/reading.json` — each set has a `passages` array.

### Adding More Writing Prompts
Edit `src/data/tests/writing.json` — each set has a `tasks` array with Task 1 and Task 2.

### Adding More Speaking Cards
Edit `src/data/tests/speaking.json` — each set has `part1`, `part2`, and `part3`.
