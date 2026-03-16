import { useState, useRef } from 'react'
import { Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react'

// OpenRouter via Cloudflare Pages proxy
// The env var OPENROUTERKEY is set as a secret in Cloudflare Pages
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openrouter/optimus-alpha'

// Rate limiting: min 30 seconds between evaluations
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

export default function EssayEvaluator({ prompt, taskType = 'task2', minWords = 250 }) {
  const [essay, setEssay]       = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [cooldown, setCooldown] = useState(0)
  const timerRef = useRef(null)

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length
  const hasEnough = wordCount >= minWords

  function startCooldown() {
    setCooldown(30)
    timerRef.current = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0 }
        return c - 1
      })
    }, 1000)
  }

  async function evaluate() {
    if (!hasEnough || loading || cooldown > 0) return

    const now = Date.now()
    if (now - lastCallTime < MIN_INTERVAL_MS) {
      setError('Please wait before submitting again.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    lastCallTime = now

    const systemPrompt = `You are an expert IELTS examiner with 15 years of experience. 
Evaluate the essay strictly according to the official IELTS band descriptors.
Respond ONLY with a valid JSON object — no markdown, no preamble, no explanation outside the JSON.`

    const userPrompt = `Task type: IELTS Writing ${taskType === 'task1' ? 'Task 1' : 'Task 2'}
Task prompt: "${prompt}"
Candidate essay (${wordCount} words):
"${essay}"

Evaluate and return EXACTLY this JSON structure:
{
  "overall": "7.0",
  "criteria": {
    "task_achievement": { "band": "7.0", "comment": "2-3 sentences of specific feedback" },
    "coherence_cohesion": { "band": "6.5", "comment": "2-3 sentences of specific feedback" },
    "lexical_resource": { "band": "7.0", "comment": "2-3 sentences of specific feedback" },
    "grammatical_range": { "band": "7.0", "comment": "2-3 sentences of specific feedback" }
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific actionable improvement 1", "specific actionable improvement 2", "specific actionable improvement 3"],
  "rewritten_sentence": "Take one weak sentence from the essay and rewrite it at Band 9 level",
  "original_sentence": "The original weak sentence you rewrote"
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
          max_tokens: 1200,
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

      // Strip possible markdown fences
      const clean = text.replace(/```json\n?|```\n?/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
      startCooldown()
    } catch (err) {
      console.error('EssayEvaluator error:', err)
      setError(err.message || 'Evaluation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const CRITERIA_LABELS = {
    task_achievement:  taskType === 'task1' ? '📋 Task Achievement' : '🎯 Task Response',
    coherence_cohesion:'🔗 Coherence & Cohesion',
    lexical_resource:  '📚 Lexical Resource',
    grammatical_range: '⚡ Grammatical Range & Accuracy',
  }

  return (
    <div className="space-y-4">
      {/* Task prompt */}
      {prompt && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
          <div className="text-xs font-bold text-yellow-600 mb-1">📋 Task Prompt</div>
          <p className="text-sm font-semibold text-yellow-900 leading-relaxed">{prompt}</p>
        </div>
      )}

      {/* Essay input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-green-800 text-sm">Your Essay</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 transition-all ${
            hasEnough
              ? 'bg-lime-100 border-lime-400 text-lime-700'
              : 'bg-gray-100 border-gray-300 text-gray-500'
          }`}>
            {wordCount} / {minWords}+ words
          </span>
        </div>
        <textarea
          id="essay-input"
          name="essay-input"
          value={essay}
          onChange={e => setEssay(e.target.value)}
          rows={10}
          className="w-full input-field resize-none text-sm leading-relaxed"
          placeholder={`Write your ${taskType === 'task1' ? 'Task 1 response' : 'Task 2 essay'} here…\n\nMinimum ${minWords} words required before you can submit for AI evaluation.`}
        />
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div className={`h-full rounded-full progress-fill ${hasEnough ? 'bg-lime-400' : 'bg-orange-400'}`}
            style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-2xl p-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={evaluate}
        disabled={!hasEnough || loading || cooldown > 0}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Evaluating with AI…
          </>
        ) : cooldown > 0 ? (
          <><Clock className="w-4 h-4" />Wait {cooldown}s before next submission</>
        ) : (
          <><Zap className="w-4 h-4" />Evaluate with AI Examiner</>
        )}
      </button>

      {!hasEnough && (
        <p className="text-center text-xs text-orange-500 font-semibold">
          {minWords - wordCount} more words needed to unlock evaluation
        </p>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall band */}
          <div className="bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-6 text-center text-white shadow-lg">
            <div className="text-xs font-bold text-lime-200 uppercase tracking-wide mb-1">AI Estimated Band</div>
            <div className="font-display text-7xl mb-1">{result.overall}</div>
            <div className="text-lime-100 text-sm font-semibold">
              {parseFloat(result.overall) >= 8 ? 'Outstanding — near Band 9 level!' :
               parseFloat(result.overall) >= 7 ? 'Good — strong Band 7 work!' :
               parseFloat(result.overall) >= 6 ? 'Developing — clear progress to make' :
               'Foundational — focus on the improvements below'}
            </div>
          </div>

          {/* Criteria breakdown */}
          <div className="card space-y-4">
            <h3 className="font-bold text-green-800">Criteria Breakdown</h3>
            {Object.entries(result.criteria || {}).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-green-800 text-sm">{CRITERIA_LABELS[key] || key}</span>
                  <span className={`font-display text-xl font-bold ${bandColor(val.band)}`}>
                    {val.band}
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full progress-fill"
                    style={{ width: `${Math.min(100, ((parseFloat(val.band) - 4) / 5) * 100)}%` }} />
                </div>
                <p className="text-xs font-semibold text-gray-600 leading-relaxed">{val.comment}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {result.strengths?.length > 0 && (
            <div className="card bg-lime-50 border-2 border-lime-200">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-lime-600" /> Strengths
              </h3>
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                  <span className="text-lime-500 font-bold shrink-0">✓</span>
                  <p className="text-sm font-semibold text-green-800">{s}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          {result.improvements?.length > 0 && (
            <div className="card bg-blue-50 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" /> Priority Improvements
              </h3>
              {result.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                  <span className="text-blue-400 font-bold shrink-0 text-lg leading-tight">{i+1}.</span>
                  <p className="text-sm font-semibold text-blue-900">{imp}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sentence rewrite */}
          {result.original_sentence && result.rewritten_sentence && (
            <div className="card">
              <h3 className="font-bold text-green-800 mb-3">✏️ Sentence Upgrade Example</h3>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 mb-2">
                <div className="text-xs font-bold text-red-500 mb-1">Your sentence (Band 6):</div>
                <p className="text-sm font-semibold text-red-800 italic">"{result.original_sentence}"</p>
              </div>
              <div className="bg-lime-50 border-2 border-lime-300 rounded-2xl p-3">
                <div className="text-xs font-bold text-lime-600 mb-1">Band 9 rewrite:</div>
                <p className="text-sm font-semibold text-green-800 italic">"{result.rewritten_sentence}"</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 font-semibold">
            ⚠️ AI evaluation is a guide only — official IELTS examiners may score differently
          </p>
        </div>
      )}
    </div>
  )
}
