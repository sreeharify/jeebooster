import jeeGeneric from './lessons/jee/generic-lesson.json'
import rankRedirect from './lessons/jee/rank-redirect.json'
import defaultFallback from './lessons/default/fallback.json'

// ── Dedicated lesson content (add new imports here) ──
import p11_c1_l1_p1 from './lessons/jee/p11_c1_l1_p1.json'
import p11_c1_l1_p2 from './lessons/jee/p11_c1_l1_p2.json'
import p11_c1_l1_p3 from './lessons/jee/p11_c1_l1_p3.json'
import p11_c1_l1_p4 from './lessons/jee/p11_c1_l1_p4.json'

const LESSON_SLIDES = {
  // Simulator Redirect
  'mz_c1_l2': rankRedirect,

  // ── Physics Class 11 ──
  'p11_c1_l1_p1': p11_c1_l1_p1,
  'p11_c1_l1_p2': p11_c1_l1_p2,
  'p11_c1_l1_p3': p11_c1_l1_p3,
  'p11_c1_l1_p4': p11_c1_l1_p4,

  // ── Add more lessons below as they are created ──
  // 'p11_c1_l2': p11_c1_l2,
}

export function getSlides(lessonId) {
  // 1. Check for dedicated lesson content first
  if (LESSON_SLIDES[lessonId]) return LESSON_SLIDES[lessonId]

  // 2. For JEE lesson IDs without dedicated content, use generic placeholder
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

  // 3. Fallback
  return defaultFallback
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

