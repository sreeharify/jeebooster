/**
 * lessonLoader.js
 *
 * Maps every lesson ID to a JSON file in src/data/lessons/.
 * Edit those JSON files to change lesson content — no code changes needed.
 *
 * JSON slide schema:
 *   { kind, band?, title?, ...kindSpecificFields }
 *
 * Supported kinds:
 *   explainer, mini_explainer, flashcard, passage,
 *   mcq, fill_blank, match_pairs, reorder_sentence,
 *   tfng_single, error_correction
 *
 * To add a new lesson:
 *   1. Create src/data/lessons/<category>/<lesson-name>.json
 *   2. Add its lesson ID → file path mapping in LESSON_FILES below
 *   3. Add the lesson ID to courseData.js
 */

// ── Static imports for all lesson JSON files ─────────────────
// Vite bundles these at build time — no runtime fetch needed.
// When you add a new JSON file, add its import + mapping here.

import vocabAcademic1        from './lessons/vocab/academic-words-1.json'
import vocabAcademic2        from './lessons/vocab/academic-words-2.json'
import vocabCollocations     from './lessons/vocab/collocations.json'
import vocabSynonyms         from './lessons/vocab/synonyms-paraphrasing.json'
import vocabVocabTest        from './lessons/vocab/vocabulary-test.json'
import vocabWriting          from './lessons/vocab/writing-vocabulary.json'

import grammarComplex        from './lessons/grammar/complex-sentences.json'
import grammarRelative       from './lessons/grammar/relative-clauses.json'
import grammarPassive        from './lessons/grammar/passive-voice.json'
import grammarConditionals   from './lessons/grammar/conditionals.json'
import grammarReported       from './lessons/grammar/reported-speech.json'
import grammarInversion      from './lessons/grammar/inversion.json'
import grammarNominal        from './lessons/grammar/nominalization.json'
import grammarHedging        from './lessons/grammar/hedging.json'
import grammarDiscourse      from './lessons/grammar/discourse-markers.json'
import grammarTest           from './lessons/grammar/grammar-mastery-test.json'

import readingBase           from './lessons/reading/reading-base.json'
import readingSkimScan       from './lessons/reading/skim-scan.json'
import readingTFNG           from './lessons/reading/tfng.json'
import readingHeadings       from './lessons/reading/headings.json'
import readingMatching       from './lessons/reading/matching.json'
import readingSummary        from './lessons/reading/summary-completion.json'
import readingShortAnswer    from './lessons/reading/short-answer.json'
import readingTest           from './lessons/reading/reading-test.json'

import writingBase           from './lessons/writing/cohesion-coherence.json'
import writingGraphs         from './lessons/writing/graphs-charts.json'
import writingProcess        from './lessons/writing/process-diagrams.json'
import writingComparison     from './lessons/writing/maps-comparisons.json'
import writingOpinion        from './lessons/writing/opinion-essay.json'
import writingDiscussion     from './lessons/writing/discussion-essay.json'
import writingProbSol        from './lessons/writing/problem-solution.json'
import writingAdvDisadv      from './lessons/writing/adv-disadv.json'
import writingThesis         from './lessons/writing/thesis-statements.json'
import writingTest           from './lessons/writing/writing-test.json'

import speakingBase          from './lessons/speaking/speaking-base.json'
import speakingPart1         from './lessons/speaking/part1-intro.json'
import speakingPersonal      from './lessons/speaking/personal-topics.json'
import speakingExtending     from './lessons/speaking/extending-answers.json'
import speakingCueCard       from './lessons/speaking/cue-card.json'
import speakingAbstract      from './lessons/speaking/abstract-discussion.json'
import speakingOpinions      from './lessons/speaking/expressing-opinions.json'
import speakingFluency       from './lessons/speaking/fluency-tips.json'
import speakingTest          from './lessons/speaking/speaking-test.json'

import listeningEveryday     from './lessons/listening/everyday-conversations.json'
import listeningForm         from './lessons/listening/form-completion.json'
import listeningMap          from './lessons/listening/map-diagram.json'
import listeningMonologue    from './lessons/listening/monologue.json'
import listeningAcademic     from './lessons/listening/academic-discussions.json'
import listeningNotes        from './lessons/listening/note-taking.json'
import listeningPredict      from './lessons/listening/prediction-strategies.json'
import listeningTest         from './lessons/listening/listening-test.json'

import infoTestFormat        from './lessons/info/test-format.json'
import infoStudyPlan         from './lessons/info/study-plan.json'

import quizGeneral           from './lessons/quiz/general-quiz.json'

import mockRedirect          from './lessons/mock/redirect.json'
import defaultFallback       from './lessons/default/fallback.json'

// ── ID → slides mapping ───────────────────────────────────────
const LESSON_SLIDES = {
  // Foundations
  'l1_1': infoTestFormat,
  'l1_4': infoStudyPlan,

  // Vocabulary
  'l2_1': vocabAcademic1,
  'l2_2': vocabAcademic2,
  'l2_3': vocabCollocations,
  'l2_4': vocabSynonyms,
  'l2_5': vocabVocabTest,
  'l7_5': vocabWriting,

  // Grammar
  'l11_1': grammarComplex,
  'l11_2': grammarRelative,
  'l11_3': grammarPassive,
  'l11_4': grammarConditionals,
  'l11_5': grammarReported,
  'l12_1': grammarInversion,
  'l12_2': grammarNominal,
  'l12_3': grammarHedging,
  'l12_4': grammarDiscourse,
  'l12_5': grammarTest,

  // Reading
  'l5_1': readingSkimScan,
  'l5_2': readingTFNG,
  'l5_3': readingHeadings,
  'l5_4': readingMatching,
  'l6_1': readingSummary,
  'l6_2': readingSummary,
  'l6_3': readingShortAnswer,
  'l6_4': readingMatching,
  'l6_5': readingTest,

  // Writing
  'l7_1': writingGraphs,
  'l7_2': writingProcess,
  'l7_3': writingComparison,
  'l7_4': writingComparison,
  'l8_1': writingOpinion,
  'l8_2': writingDiscussion,
  'l8_3': writingProbSol,
  'l8_4': writingAdvDisadv,
  'l8_5': writingThesis,
  'l8_6': writingBase,
  'l8_7': writingTest,

  // Speaking
  'l9_1': speakingPart1,
  'l9_2': speakingPersonal,
  'l9_3': speakingExtending,
  'l9_4': speakingFluency,
  'l10_1': speakingCueCard,
  'l10_2': speakingAbstract,
  'l10_3': speakingOpinions,
  'l10_4': vocabWriting,
  'l10_5': speakingTest,

  // Listening
  'l3_1': listeningEveryday,
  'l3_2': listeningForm,
  'l3_3': listeningMap,
  'l3_4': listeningMonologue,
  'l4_1': listeningAcademic,
  'l4_3': listeningNotes,
  'l4_4': listeningPredict,
  'l4_5': listeningTest,

  // Quiz
  'l4_2': quizGeneral,

  // Mock tests (all redirect to the Mock Test page for now)
  'l13_1': mockRedirect,
  'l13_2': mockRedirect,
  'l13_3': mockRedirect,
  'l13_4': mockRedirect,
  'l13_5': mockRedirect,
}

/**
 * Returns the slides array for a given lesson ID.
 * Falls back to the default lesson if the ID is not found.
 * @param {string} lessonId
 * @returns {Array} slides
 */
export function getSlides(lessonId) {
  return LESSON_SLIDES[lessonId] ?? defaultFallback
}

/**
 * Returns true if a lesson ID has content defined.
 */
export function hasContent(lessonId) {
  return lessonId in LESSON_SLIDES
}

/**
 * Returns all lesson IDs that have content.
 */
export function getAllLessonIds() {
  return Object.keys(LESSON_SLIDES)
}
