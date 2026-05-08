import jeeGeneric from './lessons/jee/generic-lesson.json'
import rankRedirect from './lessons/jee/rank-redirect.json'
import defaultFallback from './lessons/default/fallback.json'

const LESSON_SLIDES = {
  // Simulator Redirect
  'mz_c1_l2': rankRedirect,
}

export function getSlides(lessonId) {
  // If it's the mock simulator, return the redirect
  if (lessonId === 'mz_c1_l2') return rankRedirect

  // For all new JEE patterns, return jeeGeneric
  if (
    lessonId.startsWith('p11_') || 
    lessonId.startsWith('c11_') || 
    lessonId.startsWith('m11_') ||
    lessonId.startsWith('p12_') || 
    lessonId.startsWith('c12_') || 
    lessonId.startsWith('m12_') ||
    lessonId.startsWith('s_') ||
    lessonId.startsWith('mz_')
  ) {
    return jeeGeneric
  }

  return LESSON_SLIDES[lessonId] ?? defaultFallback
}

export function hasContent(lessonId) {
  return (
    lessonId === 'mz_c1_l2' ||
    lessonId.startsWith('p11_') || 
    lessonId.startsWith('c11_') || 
    lessonId.startsWith('m11_') ||
    lessonId.startsWith('p12_') || 
    lessonId.startsWith('c12_') || 
    lessonId.startsWith('m12_') ||
    lessonId.startsWith('s_') ||
    lessonId.startsWith('mz_')
  )
}

export function getAllLessonIds() {
  // This is primarily for debugging/tests, we can return empty or the main ones
  return Object.keys(LESSON_SLIDES)
}

