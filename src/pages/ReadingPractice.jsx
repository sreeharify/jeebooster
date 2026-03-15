import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useProgress } from '../contexts/ProgressContext'
import { Clock, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

const PASSAGES = [
  {
    id: 'p1',
    title: 'The Circular Economy',
    level: 'Band 6–7',
    time: 15,
    text: `The concept of the circular economy has gained considerable traction in recent years as businesses and governments alike seek sustainable alternatives to the traditional linear model of production and consumption. Unlike the conventional "take, make, dispose" approach, a circular economy aims to keep resources in use for as long as possible, extract maximum value from them, and recover and regenerate products and materials at the end of each service life.

The transition to a circular economy represents a fundamental shift in how we think about economic activity. Rather than treating waste as an inevitable by-product of production, a circular economy views waste as a design flaw — one that can be eliminated through innovative thinking and systemic change. This perspective has led to the emergence of new business models, including product-as-a-service offerings, where companies lease rather than sell products, retaining ownership and responsibility for end-of-life management.

Proponents argue that the circular economy offers compelling economic benefits alongside its environmental advantages. The Ellen MacArthur Foundation estimates that transitioning to circular models could generate trillions of dollars in economic benefits globally. Companies that embrace circularity can reduce raw material costs, create new revenue streams, and develop stronger relationships with customers through service-based offerings. For consumers, circular models can offer access to high-quality products at lower costs.

However, the transition is not without challenges. Critics point out that circular business models are often more complex to manage than traditional linear ones, requiring sophisticated reverse logistics systems and changes across entire supply chains. Small and medium enterprises, in particular, may lack the capital and expertise needed to transition effectively. Furthermore, without supportive regulatory frameworks and consumer behaviour change, even the most innovative circular business models may struggle to achieve scale.

Despite these challenges, momentum is growing. The European Union has adopted a Circular Economy Action Plan as part of its Green Deal strategy, and numerous countries have introduced policies to support the transition. Meanwhile, technological advances in areas such as artificial intelligence and materials science are making it increasingly feasible to design products for disassembly, track materials throughout their lifecycle, and match waste streams with potential users.`,
    questions: [
      {
        type: 'tfng',
        heading: 'Questions 1–5: True, False, or Not Given',
        instruction: 'Do the following statements agree with the information given in the passage?',
        items: [
          { text: 'The circular economy is a relatively new concept that has only recently begun attracting attention.', answer: 'True', explanation: '"has gained considerable traction in recent years" confirms it\'s a recent trend.' },
          { text: 'The Ellen MacArthur Foundation estimates circular models could generate over $5 trillion globally.', answer: 'Not Given', explanation: 'The passage mentions "trillions" but gives no specific figure.' },
          { text: 'A circular economy eliminates all waste entirely.', answer: 'False', explanation: 'It "views waste as a design flaw" to be eliminated — but the passage doesn\'t claim it\'s fully eliminated.' },
          { text: 'Small businesses face fewer challenges transitioning to circular models than large corporations.', answer: 'False', explanation: '"Small and medium enterprises... may lack the capital and expertise" — implying they face more, not fewer, challenges.' },
          { text: 'The EU has included circular economy goals within its Green Deal strategy.', answer: 'True', explanation: 'Directly stated: "The European Union has adopted a Circular Economy Action Plan as part of its Green Deal strategy."' },
        ]
      },
      {
        type: 'mcq',
        heading: 'Questions 6–8: Multiple Choice',
        instruction: 'Choose the best answer A, B, C, or D.',
        items: [
          {
            text: 'According to the passage, what distinguishes a circular economy from a linear one?',
            options: ['A circular economy generates more profit.', 'A circular economy keeps resources in use as long as possible.', 'A circular economy relies on government subsidies.', 'A circular economy is based on digital technology.'],
            answer: 1,
            explanation: 'Directly stated in paragraph 1: "aims to keep resources in use for as long as possible."'
          },
          {
            text: 'What does "product-as-a-service" mean in this context?',
            options: ['Products that are sold cheaply to consumers.', 'Products that repair themselves automatically.', 'Companies leasing rather than selling products.', 'Online marketplaces for second-hand goods.'],
            answer: 2,
            explanation: 'Defined in paragraph 2: "companies lease rather than sell products, retaining ownership."'
          },
          {
            text: 'Which factor does NOT support the growth of circular economy models, according to the passage?',
            options: ['AI and materials science advances', 'EU policy frameworks', 'Consumer behaviour change', 'All of the above support it'],
            answer: 3,
            explanation: 'All three are mentioned as supporting factors. Consumer behaviour change is cited as something needed for scale.'
          },
        ]
      },
    ]
  },
  {
    id: 'p2',
    title: 'Rewilding: Restoring Nature at Scale',
    level: 'Band 7–9',
    time: 20,
    text: `Rewilding — the large-scale restoration of ecosystems to the point where nature can take care of itself — has emerged as one of the most ambitious and contentious conservation strategies of the twenty-first century. Unlike traditional conservation, which typically focuses on protecting specific species or habitats, rewilding takes a more hands-off approach, aiming to restore the natural processes and interactions that drive healthy ecosystems.

Central to many rewilding projects is the reintroduction of apex predators and other keystone species — those whose removal has cascading effects throughout the ecosystem. The reintroduction of wolves to Yellowstone National Park in the United States in 1995 is perhaps the most celebrated example. Their presence reduced overgrazing by elk, allowing riverside vegetation to regenerate, which in turn stabilised riverbanks, reduced erosion, and even altered the course of rivers — a phenomenon ecologists have termed a "trophic cascade."

In Europe, rewilding projects have proliferated across Scandinavia, the Iberian Peninsula, and the Carpathian Mountains, driven in part by the availability of land abandoned as rural populations have migrated to cities. The Rewilding Europe initiative, launched in 2011, has worked across ten landscape areas with the stated aim of making Europe a wilder place. Proponents highlight not only the ecological benefits — increased biodiversity, enhanced carbon sequestration, and greater resilience to climate change — but also economic opportunities in the form of nature-based tourism.

Critics, however, raise valid concerns. Farmers and rural communities in areas where large predators are being reintroduced often feel their livelihoods are threatened. There are also scientific debates about the extent to which historical ecosystems can or should be restored, given that environmental conditions have changed considerably since these species were present. Some ecologists argue that rewilding risks becoming a distraction from more immediate conservation needs, such as reducing pollution and habitat fragmentation.

Despite the controversies, rewilding represents a bold and necessary experiment. As biodiversity loss accelerates and the limitations of traditional conservation become apparent, the approach offers a compelling vision: not merely to slow the decline of nature, but to reverse it. Whether that vision can be realised at scale while navigating the complex social, economic, and political landscape of the twenty-first century remains to be seen.`,
    questions: [
      {
        type: 'heading_match',
        heading: 'Questions 1–5: Matching Headings',
        instruction: 'Match each paragraph (A–E) with the correct heading from the list below.',
        headings: [
          'i. Economic and ecological arguments for rewilding',
          'ii. Definition and distinction from traditional conservation',
          'iii. An optimistic but cautious conclusion',
          'iv. Opposition and scientific debate',
          'v. A landmark example of ecosystem restoration',
          'vi. The spread of rewilding across a continent',
        ],
        items: [
          { para: 'Paragraph A', answer: 'ii. Definition and distinction from traditional conservation' },
          { para: 'Paragraph B', answer: 'v. A landmark example of ecosystem restoration' },
          { para: 'Paragraph C', answer: 'vi. The spread of rewilding across a continent' },
          { para: 'Paragraph D', answer: 'iv. Opposition and scientific debate' },
          { para: 'Paragraph E', answer: 'iii. An optimistic but cautious conclusion' },
        ]
      },
      {
        type: 'tfng',
        heading: 'Questions 6–9: True, False, or Not Given',
        instruction: '',
        items: [
          { text: 'Rewilding is a more interventionist approach than traditional conservation.', answer: 'False', explanation: 'The passage says rewilding takes a "more hands-off approach."' },
          { text: 'The reintroduction of wolves to Yellowstone changed the course of rivers.', answer: 'True', explanation: '"altered the course of rivers" is directly stated.' },
          { text: 'All ecologists agree that rewilding is more effective than traditional conservation.', answer: 'Not Given', explanation: 'Some ecologists are critical, but no comparison of effectiveness is made.' },
          { text: 'Rewilding Europe was established in 2011.', answer: 'True', explanation: 'Directly stated: "launched in 2011."' },
        ]
      },
    ]
  },
]

export default function ReadingPractice() {
  const [selectedPassage, setSelectedPassage] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showText, setShowText] = useState(true)
  const { awardXP } = useProgress()

  function handleTFNGAnswer(qIdx, iIdx, val) {
    setAnswers(prev => ({ ...prev, [`${qIdx}-${iIdx}`]: val }))
  }

  function handleMCQAnswer(qIdx, iIdx, val) {
    setAnswers(prev => ({ ...prev, [`${qIdx}-${iIdx}`]: val }))
  }

  function handleHeadingAnswer(qIdx, iIdx, val) {
    setAnswers(prev => ({ ...prev, [`${qIdx}-${iIdx}`]: val }))
  }

  async function handleSubmit() {
    setSubmitted(true)
    let correct = 0, total = 0
    selectedPassage.questions.forEach((q, qi) => {
      q.items.forEach((item, ii) => {
        total++
        const ans = answers[`${qi}-${ii}`]
        if (q.type === 'tfng' && ans === item.answer) correct++
        if (q.type === 'mcq' && ans === item.answer) correct++
        if (q.type === 'heading_match' && ans === item.answer) correct++
      })
    })
    const pct = Math.round((correct / total) * 100)
    await awardXP(pct >= 80 ? 50 : pct >= 60 ? 30 : 15, 'Reading practice')
  }

  if (!selectedPassage) {
    return (
      <div className="min-h-screen bg-lime-50 pb-24 pt-16">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-4">
          <h2 className="font-display text-3xl text-green-800 mb-1">Reading Practice 👁️</h2>
          <p className="text-green-500 font-semibold text-sm mb-5">Build your reading speed and accuracy</p>

          <div className="space-y-4">
            {PASSAGES.map(p => (
              <div key={p.id} className="card-hover" onClick={() => setSelectedPassage(p)}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-green-800">{p.title}</h3>
                  <span className="text-xs font-bold bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full shrink-0 ml-2">{p.level}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-green-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.time} min</span>
                  <span>•</span>
                  <span>{p.questions.reduce((s, q) => s + q.items.length, 0)} questions</span>
                  <span>•</span>
                  <span>{p.questions.map(q => q.type.toUpperCase().replace('_', '/')).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 bg-gradient-to-br from-lime-50 to-green-50">
            <h3 className="font-display text-xl text-green-800 mb-3">📖 Reading Strategies</h3>
            {[
              { name: 'Skim first', detail: 'Read the passage quickly (60–90 sec) to understand the overall structure and topic before reading questions.' },
              { name: 'Read questions before scanning', detail: 'Knowing what you\'re looking for makes scanning much more efficient.' },
              { name: 'T/F/NG distinction', detail: '"False" means the text contradicts the statement. "Not Given" means the information isn\'t in the text at all.' },
              { name: 'Paraphrase awareness', detail: 'Questions rarely use the exact words from the text. Look for synonyms and paraphrases.' },
              { name: 'Time management', detail: 'Aim for ~20 minutes per passage in the real test. Don\'t spend more than 2 minutes on any single question.' },
            ].map((s, i) => (
              <div key={i} className="flex gap-3 mb-2 last:mb-0">
                <span className="text-lime-500 font-bold shrink-0">✓</span>
                <div>
                  <span className="font-bold text-green-800 text-sm">{s.name}: </span>
                  <span className="text-sm text-green-600 font-semibold">{s.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  let totalQ = 0, correctQ = 0
  if (submitted) {
    selectedPassage.questions.forEach((q, qi) => {
      q.items.forEach((item, ii) => {
        totalQ++
        const ans = answers[`${qi}-${ii}`]
        if ((q.type === 'tfng' || q.type === 'heading_match') && ans === item.answer) correctQ++
        if (q.type === 'mcq' && ans === item.answer) correctQ++
      })
    })
  }

  return (
    <div className="min-h-screen bg-lime-50 pb-24 pt-16">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button onClick={() => { setSelectedPassage(null); setAnswers({}); setSubmitted(false) }} className="flex items-center gap-2 text-green-600 font-bold mb-3">
          ← Back to passages
        </button>

        {submitted && (
          <div className={`card mb-4 text-center border-2 ${correctQ / totalQ >= 0.8 ? 'border-lime-400 bg-lime-50' : 'border-orange-300 bg-orange-50'}`}>
            <div className="text-4xl mb-2">{correctQ / totalQ >= 0.8 ? '🎉' : '💪'}</div>
            <div className="font-display text-2xl text-green-800">{correctQ}/{totalQ} correct</div>
            <div className="text-sm font-semibold text-green-500">{Math.round((correctQ / totalQ) * 100)}% accuracy</div>
          </div>
        )}

        {/* Passage Toggle */}
        <div className="card mb-4">
          <button onClick={() => setShowText(!showText)} className="w-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-green-800">{selectedPassage.title}</h3>
              <span className="text-xs font-bold text-lime-600 bg-lime-100 px-2 py-0.5 rounded-full">{selectedPassage.level}</span>
            </div>
            {showText ? <ChevronUp className="w-4 h-4 text-green-500" /> : <ChevronDown className="w-4 h-4 text-green-500" />}
          </button>
          {showText && (
            <div className="mt-3 text-sm text-gray-800 font-semibold leading-relaxed space-y-3">
              {selectedPassage.text.split('\n\n').map((para, i) => (
                <p key={i}><span className="font-bold text-lime-600">({String.fromCharCode(65 + i)})</span> {para}</p>
              ))}
            </div>
          )}
        </div>

        {/* Questions */}
        {selectedPassage.questions.map((q, qi) => (
          <div key={qi} className="card mb-4">
            <h3 className="font-bold text-green-800 mb-1">{q.heading}</h3>
            {q.instruction && <p className="text-xs font-semibold text-green-500 mb-3">{q.instruction}</p>}

            {q.type === 'tfng' && (
              <div className="space-y-3">
                {q.items.map((item, ii) => {
                  const ans = answers[`${qi}-${ii}`]
                  const isCorrect = submitted && ans === item.answer
                  const isWrong = submitted && ans !== item.answer
                  return (
                    <div key={ii} className={`p-3 rounded-2xl border-2 ${submitted ? (isCorrect ? 'border-lime-300 bg-lime-50' : 'border-red-200 bg-red-50') : 'border-gray-200 bg-white'}`}>
                      <p className="text-sm font-semibold text-green-900 mb-2">{ii + 1}. {item.text}</p>
                      <div className="flex gap-2">
                        {['True', 'False', 'Not Given'].map(opt => (
                          <button key={opt} disabled={submitted}
                            onClick={() => handleTFNGAnswer(qi, ii, opt)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold border-2 transition-all
                              ${submitted
                                ? (opt === item.answer ? 'bg-lime-400 border-lime-500 text-green-900' : (opt === ans && opt !== item.answer) ? 'bg-red-300 border-red-400 text-white' : 'bg-gray-100 border-gray-200 text-gray-500')
                                : (ans === opt ? 'bg-lime-200 border-lime-400 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-lime-50')
                              }`}>
                            {opt === 'Not Given' ? 'N/G' : opt}
                          </button>
                        ))}
                      </div>
                      {submitted && isWrong && item.explanation && (
                        <p className="text-xs text-green-700 font-semibold mt-2 bg-lime-50 rounded-xl p-2">💡 {item.explanation}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {q.type === 'mcq' && (
              <div className="space-y-3">
                {q.items.map((item, ii) => {
                  const ans = answers[`${qi}-${ii}`]
                  return (
                    <div key={ii} className="border-2 border-gray-200 rounded-2xl p-3">
                      <p className="text-sm font-bold text-green-900 mb-2">{ii + 1}. {item.text}</p>
                      <div className="space-y-2">
                        {item.options.map((opt, oi) => (
                          <button key={oi} disabled={submitted}
                            onClick={() => handleMCQAnswer(qi, ii, oi)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border-2 transition-all
                              ${submitted
                                ? (oi === item.answer ? 'bg-lime-100 border-lime-400 text-green-800' : (oi === ans && oi !== item.answer) ? 'bg-red-100 border-red-300 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-500')
                                : (ans === oi ? 'bg-lime-200 border-lime-400 text-green-800' : 'bg-white border-gray-200 hover:border-lime-200 text-gray-700')
                              }`}>
                            <span className="font-bold mr-1 opacity-60">{['A', 'B', 'C', 'D'][oi]}.</span> {opt}
                          </button>
                        ))}
                      </div>
                      {submitted && ans !== item.answer && item.explanation && (
                        <p className="text-xs text-green-700 font-semibold mt-2 bg-lime-50 rounded-xl p-2">💡 {item.explanation}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {q.type === 'heading_match' && (
              <div className="space-y-3">
                <div className="bg-lime-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-lime-700 mb-2">Available headings:</p>
                  {q.headings.map((h, hi) => (
                    <div key={hi} className="text-xs font-semibold text-green-800 mb-1">{h}</div>
                  ))}
                </div>
                {q.items.map((item, ii) => {
                  const ans = answers[`${qi}-${ii}`]
                  const isCorrect = submitted && ans === item.answer
                  const isWrong = submitted && ans && ans !== item.answer
                  return (
                    <div key={ii} className={`p-3 rounded-2xl border-2 ${isCorrect ? 'border-lime-400 bg-lime-50' : isWrong ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
                      <p className="font-bold text-green-800 text-sm mb-2">{item.para}</p>
                      <select
                        disabled={submitted}
                        value={ans || ''}
                        onChange={e => handleHeadingAnswer(qi, ii, e.target.value)}
                        className="w-full text-xs font-semibold border-2 border-lime-200 rounded-xl p-2 bg-white text-green-800 focus:outline-none focus:border-lime-400"
                      >
                        <option value="">— Select a heading —</option>
                        {q.headings.map((h, hi) => (
                          <option key={hi} value={h}>{h}</option>
                        ))}
                      </select>
                      {submitted && isWrong && (
                        <p className="text-xs text-lime-700 font-bold mt-1">✓ Correct: {item.answer}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {!submitted ? (
          <button onClick={handleSubmit} className="btn-primary w-full mb-4">
            📤 Submit Answers
          </button>
        ) : (
          <button onClick={() => { setSelectedPassage(null); setAnswers({}); setSubmitted(false) }} className="btn-secondary w-full mb-4">
            ← Try Another Passage
          </button>
        )}
      </div>
    </div>
  )
}
