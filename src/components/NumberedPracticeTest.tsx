import Link from 'next/link'

const STATE_DATA: Record<string, { name: string; abbr: string; totalQuestions: number; passingScore: string; passingCorrect: number }> = {
  florida:          { name: 'Florida',        abbr: 'FL', totalQuestions: 50, passingScore: '80%', passingCorrect: 40 },
  california:       { name: 'California',     abbr: 'CA', totalQuestions: 46, passingScore: '83%', passingCorrect: 38 },
  texas:            { name: 'Texas',          abbr: 'TX', totalQuestions: 40, passingScore: '70%', passingCorrect: 28 },
  'new-york':       { name: 'New York',       abbr: 'NY', totalQuestions: 20, passingScore: '70%', passingCorrect: 14 },
  pennsylvania:     { name: 'Pennsylvania',   abbr: 'PA', totalQuestions: 18, passingScore: '83%', passingCorrect: 15 },
  illinois:         { name: 'Illinois',       abbr: 'IL', totalQuestions: 35, passingScore: '80%', passingCorrect: 28 },
  ohio:             { name: 'Ohio',           abbr: 'OH', totalQuestions: 40, passingScore: '75%', passingCorrect: 30 },
  georgia:          { name: 'Georgia',        abbr: 'GA', totalQuestions: 40, passingScore: '75%', passingCorrect: 30 },
  'north-carolina': { name: 'North Carolina', abbr: 'NC', totalQuestions: 25, passingScore: '80%', passingCorrect: 20 },
  michigan:         { name: 'Michigan',       abbr: 'MI', totalQuestions: 50, passingScore: '80%', passingCorrect: 40 },
}

const TEST_FOCUS: Record<number, { title: string; description: string; topics: string[] }> = {
  1:  { title: 'Road Signs and Signals',              description: 'Focuses on road signs, traffic signals, and pavement markings — 20–30% of the real DMV test.',         topics: ['Stop and yield signs','Warning signs','Traffic light rules','Lane markings','Railroad crossings'] },
  2:  { title: 'Right of Way and Intersections',      description: 'Right-of-way rules at intersections, 4-way stops, roundabouts, and when to yield.',                    topics: ['4-way stop rules','Who goes first','Roundabout rules','Left turn right of way','Pedestrian right of way'] },
  3:  { title: 'Speed Limits and Following Distance', description: 'Speed limit rules, basic speed law, school zones, and safe following distance.',                        topics: ['School zone speeds','Basic speed law','Highway speed limits','3-second following rule','Weather and speed'] },
  4:  { title: 'Alcohol, Drugs, and DUI Laws',        description: 'Alcohol limits, DUI penalties, implied consent, and zero tolerance laws for minors.',                   topics: ['Legal BAC limit','Zero tolerance for minors','Implied consent law','DUI penalties','Driving while impaired'] },
  5:  { title: 'Parking, Turns, and Lane Changes',    description: 'Parking rules, no-parking zones, signaling, U-turns, and safe lane changes.',                          topics: ['No-parking zones','Parallel parking','Signaling requirements','U-turn rules','Safe lane changes'] },
  6:  { title: 'Emergency Situations',                description: 'What to do near emergency vehicles, school buses, and in emergency situations.',                        topics: ['Emergency vehicle rules','School bus stop laws','Move over law','Breakdown procedures','Accident rules'] },
  7:  { title: 'Night Driving and Adverse Conditions',description: 'Safe driving at night, in rain, fog, snow, and other difficult conditions.',                            topics: ['Headlight rules','Fog and rain driving','Hydroplaning','Night following distance','Skid recovery'] },
  8:  { title: 'Expressway and Highway Driving',      description: 'Merging, highway speed rules, passing, and expressway driving techniques.',                             topics: ['Merging onto highway','Passing rules','No-passing zones','Highway exits','High-speed following distance'] },
  9:  { title: 'Distracted Driving and Cell Phones',  description: 'Cell phone laws, distracted driving rules, and safe driving habits.',                                   topics: ['Hands-free laws','Texting while driving','Drowsy driving','Other distractions','Safe phone use'] },
  10: { title: 'Full Mixed Practice Test',            description: 'Covers all topics on the real DMV exam — the best final check before your real test.',                  topics: ['Signs and signals','Right of way','Speed limits','Parking','DUI laws','Special situations'] },
}

export function buildNumberedTestMetadata(stateSlug: string, testNumber: number) {
  const state = STATE_DATA[stateSlug]; const focus = TEST_FOCUS[testNumber]
  if (!state || !focus) return { title: '', description: '' }
  return {
    title: `${state.name} DMV Practice Test ${testNumber} 2026 — ${focus.title} | DMVPrep Pro`,
    description: `${focus.description} Free ${state.name} practice test ${testNumber} of 10. ${state.totalQuestions} questions, ${state.passingScore} to pass. No signup required.`,
  }
}

export default function NumberedPracticeTest({ stateSlug, testNumber }: { stateSlug: string; testNumber: number }) {
  const state = STATE_DATA[stateSlug]; const focus = TEST_FOCUS[testNumber]
  if (!state || !focus) return null

  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `${state.name} DMV Practice Test ${testNumber} — ${focus.title}`,
    "description": focus.description,
    "educationalLevel": "beginner",
    "about": { "@type": "Thing", "name": `${state.name} DMV Written Test` },
    "typicalAgeRange": "15-",
    "isAccessibleForFree": true,
    "url": `https://dmv-prep.com/state/${stateSlug}/dmv-practice-test-${testNumber}`,
  }
  const prevNum = testNumber > 1 ? testNumber - 1 : null
  const nextNum = testNumber < 10 ? testNumber + 1 : null
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }} />
      <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link><span>›</span>
        <Link href={`/state/${stateSlug}/dmv-practice-test`} className="hover:text-blue-600">{state.name} DMV Practice Test</Link>
        <span>›</span><span>Test {testNumber}</span>
      </nav>
      <h1 className="text-3xl font-bold mb-2">{state.name} DMV Practice Test {testNumber} — {focus.title}</h1>
      <p className="text-gray-600 mb-2">{focus.description}</p>
      <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6 border-y py-3">
        <span>{state.totalQuestions} questions</span>
        <span>{state.passingScore} ({state.passingCorrect} correct) to pass</span>
        <span className="text-blue-600 font-medium">Test {testNumber} of 10</span>
      </div>
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-sm mb-2 text-gray-700">Topics in this test:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {focus.topics.map(topic => (
            <li key={topic} className="text-sm text-gray-600 flex items-center gap-2"><span className="text-green-500">✓</span>{topic}</li>
          ))}
        </ul>
      </div>
      <Link href={`/practice?state=${state.abbr}&test=${testNumber}`} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-lg transition-colors mb-8">
        Start Practice Test {testNumber} — Free
      </Link>
      <div className="flex items-center justify-between mb-10">
        {prevNum ? <Link href={`/state/${stateSlug}/dmv-practice-test-${prevNum}`} className="text-blue-600 hover:underline text-sm">← Test {prevNum}: {TEST_FOCUS[prevNum].title}</Link> : <div />}
        {nextNum ? <Link href={`/state/${stateSlug}/dmv-practice-test-${nextNum}`} className="text-blue-600 hover:underline text-sm">Test {nextNum}: {TEST_FOCUS[nextNum].title} →</Link> : <div />}
      </div>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">All {state.name} DMV Practice Tests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <Link key={n} href={`/state/${stateSlug}/dmv-practice-test-${n}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors ${n === testNumber ? 'border-blue-400 bg-blue-50 text-blue-700 font-medium' : 'hover:border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
              <span className="font-bold text-gray-400 w-6">#{n}</span>
              <span>{TEST_FOCUS[n].title}</span>
            </Link>
          ))}
        </div>
      </section>
      <Link href={`/state/${stateSlug}/dmv-practice-test`} className="text-blue-600 hover:underline text-sm">← Back to {state.name} DMV Practice Test</Link>
    </main>
  )
}
