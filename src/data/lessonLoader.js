import jeeGeneric from './lessons/jee/generic-lesson.json'
import rankRedirect from './lessons/jee/rank-redirect.json'
import defaultFallback from './lessons/default/fallback.json'

const LESSON_SLIDES = {
  // Class 11
  'l11_p1': jeeGeneric, 'l11_p2': jeeGeneric, 'l11_p3': jeeGeneric, 'l11_p4': jeeGeneric,
  'l11_c1': jeeGeneric, 'l11_c2': jeeGeneric, 'l11_c3': jeeGeneric, 'l11_c4': jeeGeneric,
  'l11_m1': jeeGeneric, 'l11_m2': jeeGeneric, 'l11_m3': jeeGeneric, 'l11_m4': jeeGeneric,

  // Class 12
  'l12_p1': jeeGeneric, 'l12_p2': jeeGeneric, 'l12_p3': jeeGeneric, 'l12_p4': jeeGeneric,
  'l12_c1': jeeGeneric, 'l12_c2': jeeGeneric, 'l12_c3': jeeGeneric, 'l12_c4': jeeGeneric,
  'l12_m1': jeeGeneric, 'l12_m2': jeeGeneric, 'l12_m3': jeeGeneric, 'l12_m4': jeeGeneric,

  // Misc
  'l_strat1': jeeGeneric, 'l_strat2': jeeGeneric,
  'l_mock1': jeeGeneric, 'l_mock2': rankRedirect,
}

export function getSlides(lessonId) {
  return LESSON_SLIDES[lessonId] ?? defaultFallback
}

export function hasContent(lessonId) {
  return lessonId in LESSON_SLIDES
}

export function getAllLessonIds() {
  return Object.keys(LESSON_SLIDES)
}

