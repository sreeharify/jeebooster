import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Zap, AlertCircle, Clock } from 'lucide-react'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openrouter/optimus-alpha'
const MIN_INTERVAL_MS = 30000
let lastCallTime = 0

function bandColor(b) {
  if (!b) return 'text-gray-500'
  const n = parseFloat(b)
  if (n >= 8) return 'text-lime-600'
  if (n >= 7) return 'text-green-600'
  if (n >= 6) return 'text-yellow-600'
  return 'text-orange-500'
}

export default function SpeakingEvaluator({ question, part = 1, cueCard = null }) {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening]   = useState(false)
  const [supported,   setSupported]     = useState(true)
  const [result,      setResult]        = useState(null)
  const [loading,     setLoading]       = useState(false)
  const [error,       setError]         = useState('')
  const [cooldown,    setCooldown]       = useState(0)
  const [interim,     setInterim]       = useState('')
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous    = true
    rec.interimResults = true
    rec.lang          = 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t + ' '
        else interimText += t
      }
      if (finalText) setTranscript(prev => (prev + finalText).trim())
      setInterim(interimText)
    }

    rec.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setError(`Speech recognition error: ${e.error}`)
      }
      setIsListening(false)
    }

    rec.onend = () => {
      setIsListening(false)
      setInterim('')
    }

    recognitionRef.current = rec
    return () => { rec.abort() }
  }, [])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setError('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  function clearTranscript() {
    setTranscript('')
    setInterim('')
    setResult(null)
    setError('')
  }

  function startCooldown() {
    setCooldown(30)
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
  }

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length
  const minWords = part === 2 ? 80 : part === 3 ? 40 : 20

  async function evaluate() {
    if (wordCount < minWords || loading || cooldown > 0) return

    const now = Date.now()
    if (now - lastCallTime < MIN_INTERVAL_MS) {
      setError('Please wait before submitting again.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    lastCallTime = now

    const partDescriptions = {
      1: 'Part 1 — Short personal answers (3–5 sentences expected)',
      2: 'Part 2 — Long turn monologue (1–2 minutes, structured with intro/body/reflection)',
      3: 'Part 3 — Abstract discussion (analytical, 4–8 sentences, nuanced)',
    }

    const context = cueCard
      ? `Cue card: "${cueCard}"`
      : `Question: "${question}"`

    const systemPrompt = `You are an expert IELTS Speaking examiner. 
Evaluate the transcribed response strictly against the IELTS Speaking band descriptors.
The transcript is from speech-to-text and may have minor errors — evaluate for SPOKEN language, not written.
Respond ONLY with valid JSON — no markdown fences, no preamble.`

    const userPrompt = `IELTS Speaking ${partDescriptions[part]}
${context}
Transcribed response (${wordCount} words): "${transcript}"

Return EXACTLY this JSON:
{
  "overall": "7.0",
  "criteria": {
    "fluency_coherence": { "band": "7.0", "comment": "2-3 sentences of specific feedback" },
    "lexical_resource": { "band": "7.0", "comment": "2-3 sentences of specific feedback" },
    "grammatical_range": { "band": "7.0", "comment": "2-3 sentences of specific feedback" },
    "pronunciation": { "band": "7.0", "comment": "Note: based on word choices and transcription patterns" }
  },
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "better_phrase": {
    "original": "a weak phrase you spotted from the transcript",
    "upgraded": "a Band 8–9 version of that phrase"
  }
}`

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_KEY
      if (!apiKey) throw new Error('OPENROUTER_KEY not configured')

      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'IELTSdua',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 900,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
          ],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      const clean = text.replace(/```json\n?|```\n?/g, '').trim()
      setResult(JSON.parse(clean))
      startCooldown()
    } catch (err) {
      console.error('SpeakingEvaluator error:', err)
      setError(err.message || 'Evaluation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const CRITERIA_LABELS = {
    fluency_coherence: '🗣️ Fluency & Coherence',
    lexical_resource:  '📚 Lexical Resource',
    grammatical_range: '⚡ Grammatical Range & Accuracy',
    pronunciation:     '🔊 Pronunciation',
  }

  if (!supported) {
    return (
      <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-orange-800 text-sm">Speech Recognition Not Available</p>
            <p className="text-xs text-orange-700 font-semibold mt-1">
              Chrome Speech Recognition requires the Chrome browser. You can still type your response below for AI evaluation.
            </p>
          </div>
        </div>
        <textarea
          id="speaking-manual-input"
          name="speaking-manual-input"
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          rows={4}
          className="w-full input-field resize-none text-sm mt-3"
          placeholder="Type your spoken response here for AI evaluation…"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Question context */}
      <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-3">
        <div className="text-xs font-bold text-pink-600 mb-1">Part {part} Question</div>
        <p className="text-sm font-bold text-green-900">{cueCard || question}</p>
      </div>

      {/* Recording button + transcript */}
      <div className={`border-2 rounded-2xl p-4 transition-all ${
        isListening
          ? 'border-red-400 bg-red-50'
          : transcript
          ? 'border-lime-300 bg-lime-50'
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={toggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {isListening
              ? <MicOff className="w-6 h-6 text-white" />
              : <Mic className="w-6 h-6 text-white" />
            }
          </button>
          <div className="flex-1">
            <p className="font-bold text-green-800 text-sm">
              {isListening ? '🔴 Recording — speak now' : transcript ? 'Recording stopped' : 'Press to start recording'}
            </p>
            <p className="text-xs text-green-500 font-semibold">
              {isListening
                ? 'Press again to stop'
                : `${wordCount} words recorded${wordCount < minWords ? ` (need ${minWords}+ to evaluate)` : ' ✓'}`
              }
            </p>
          </div>
          {transcript && (
            <button onClick={clearTranscript} className="text-xs font-bold text-gray-400 hover:text-gray-600">
              Clear
            </button>
          )}
        </div>

        {/* Transcript display */}
        <div className="min-h-[60px]">
          {transcript && (
            <p className="text-sm text-green-800 font-semibold leading-relaxed">
              {transcript}
              {interim && <span className="text-gray-400 italic"> {interim}</span>}
            </p>
          )}
          {!transcript && !isListening && (
            <p className="text-gray-400 text-sm font-semibold text-center py-2">
              Your spoken response will appear here
            </p>
          )}
          {isListening && !transcript && (
            <div className="flex items-center gap-2 py-2">
              {[...Array(5)].map((_,i) => (
                <div key={i} className="flex-1 bg-red-300 rounded-full animate-bounce"
                  style={{ height:`${8 + Math.random()*12}px`, animationDelay:`${i*0.12}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editable transcript */}
      {transcript && !isListening && (
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1">Edit transcript if needed:</p>
          <textarea
            id="transcript-edit"
            name="transcript-edit"
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            rows={3}
            className="w-full input-field resize-none text-sm"
          />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-2xl p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={evaluate}
        disabled={wordCount < minWords || loading || cooldown > 0 || isListening}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Evaluating…</>
        ) : cooldown > 0 ? (
          <><Clock className="w-4 h-4" />Wait {cooldown}s</>
        ) : isListening ? (
          'Stop recording first'
        ) : (
          <><Zap className="w-4 h-4" />Evaluate with AI Examiner</>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-gradient-to-br from-pink-400 to-rose-600 rounded-3xl p-6 text-center text-white shadow-lg">
            <div className="text-xs font-bold text-pink-200 uppercase tracking-wide mb-1">AI Estimated Band</div>
            <div className="font-display text-7xl mb-1">{result.overall}</div>
            <div className="text-pink-100 text-sm font-semibold">
              {parseFloat(result.overall) >= 8 ? 'Excellent fluency and range!' :
               parseFloat(result.overall) >= 7 ? 'Good — solid Band 7 performance' :
               parseFloat(result.overall) >= 6 ? 'Developing — keep practising' :
               'Foundation stage — focus on extending answers'}
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-green-800">Criteria Breakdown</h3>
            {Object.entries(result.criteria || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-green-800 text-sm">{CRITERIA_LABELS[key] || key}</span>
                  <span className={`font-display text-xl font-bold ${bandColor(val.band)}`}>{val.band}</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full progress-fill"
                    style={{ width: `${Math.min(100, ((parseFloat(val.band)-4)/5)*100)}%` }} />
                </div>
                <p className="text-xs font-semibold text-gray-600">{val.comment}</p>
              </div>
            ))}
          </div>

          {result.strengths?.length > 0 && (
            <div className="card bg-lime-50 border-2 border-lime-200">
              <h3 className="font-bold text-green-800 mb-2">✅ Strengths</h3>
              {result.strengths.map((s,i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-lime-500 font-bold shrink-0">✓</span>
                  <p className="text-sm font-semibold text-green-800">{s}</p>
                </div>
              ))}
            </div>
          )}

          {result.improvements?.length > 0 && (
            <div className="card bg-blue-50 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">💡 Improvements</h3>
              {result.improvements.map((imp,i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-blue-400 font-bold shrink-0">{i+1}.</span>
                  <p className="text-sm font-semibold text-blue-900">{imp}</p>
                </div>
              ))}
            </div>
          )}

          {result.better_phrase?.original && (
            <div className="card">
              <h3 className="font-bold text-green-800 mb-3">✏️ Phrase Upgrade</h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 mb-2">
                <div className="text-xs font-bold text-red-500 mb-1">You said (Band 6):</div>
                <p className="text-sm font-semibold text-red-800 italic">"{result.better_phrase.original}"</p>
              </div>
              <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3">
                <div className="text-xs font-bold text-lime-600 mb-1">Band 8–9 version:</div>
                <p className="text-sm font-semibold text-green-800 italic">"{result.better_phrase.upgraded}"</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 font-semibold">
            ⚠️ AI evaluation is a guide — pronunciation assessment is limited without audio analysis
          </p>
        </div>
      )}
    </div>
  )
}
