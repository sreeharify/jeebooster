/**
 * mockTestData.js
 *
 * Loads mock test sets from JSON files in src/data/tests/.
 * To add more test sets: edit the JSON files and add more objects to the arrays.
 * Each section file is an array of "sets" — the app picks one randomly each time.
 *
 * File locations:
 *   src/data/tests/listening.json  — array of listening sets
 *   src/data/tests/reading.json    — array of reading sets
 *   src/data/tests/writing.json    — array of writing sets
 *   src/data/tests/speaking.json   — array of speaking sets
 */

import PHYSICS_DATA   from './tests/physics.json'
import CHEMISTRY_DATA from './tests/chemistry.json'
import MATH_DATA      from './tests/math.json'

export const PHYSICS_SETS   = PHYSICS_DATA
export const CHEMISTRY_SETS = CHEMISTRY_DATA
export const MATH_SETS      = MATH_DATA
