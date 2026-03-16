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

import LISTENING_DATA from './tests/listening.json'
import READING_DATA   from './tests/reading.json'
import WRITING_DATA   from './tests/writing.json'
import SPEAKING_DATA  from './tests/speaking.json'

export const LISTENING_SETS = LISTENING_DATA
export const READING_SETS   = READING_DATA
export const WRITING_SETS   = WRITING_DATA
export const SPEAKING_SETS  = SPEAKING_DATA
