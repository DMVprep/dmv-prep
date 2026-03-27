import Link from 'next/link'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'DMV Exam Simulator 2026 — Practice Under Real Test Conditions | DMVPrep Pro',
  description: 'Simulate the real DMV written knowledge test. Timed, randomized questions, instant pass/fail results. All 50 states. No signup required.',
}
const STATES = [
  { slug: 'california', name: 'California', abbr: 'CA', q: 46, pass: '83%' },{ slug: 'florida', name: 'Florida', abbr: 'FL', q: 50, pass: '80%' },
  { slug: 'texas', name: 'Texas', abbr: 'TX', q: 40, pass: '70%' },{ slug: 'new-york', name: 'New York', abbr: 'NY', q: 20, pass: '70%' },
  { slug: 'pennsylvania', name: 'Pennsylvania', abbr: 'PA', q: 18, pass: '83%' },{ slug: 'illinois', name: 'Illinois', abbr: 'IL', q: 35, pass: '80%' },
  { slug: 'ohio', name: 'Ohio', abbr: 'OH', q: 40, pass: '75%' },{ slug: 'georgia', name: 'Georgia', abbr: 'GA', q: 40, pass: '75%' },
  { slug: 'north-carolina', name: 'North Carolina', abbr: 'NC', q: 25, pass: '80%' },{ slug: 'michigan', name: 'Michigan', abbr: 'MI', q: 50, pass: '80%' },
]
export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">DMV Exam Simulator 2026</h1>
      <p className="text-gray-600 mb-8">Practice under real test conditions. Questions randomize every time, passing score matches your state's real exam. Know you're ready before you go.</p>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Select Your State</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STATES.map(s => (
            <Link key={s.slug} href={`/practice?state=${s.abbr}`} className="flex items-center justify-between px-4 py-3 rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-400 w-6">{s.abbr}</span><span className="font-medium">{s.name}</span></div>
              <div className="text-xs text-gray-500">{s.q}q · {s.pass} to pass</div>
            </Link>
          ))}
        </div>
      </section>
      <div className="flex gap-3 flex-wrap border-t pt-6">
        <Link href="/road-signs-practice-test" className="border rounded-lg p-3 hover:bg-gray-50 text-sm font-medium">Road Signs Practice →</Link>
        <Link href="/permit-test-practice" className="border rounded-lg p-3 hover:bg-gray-50 text-sm font-medium">Permit Test Practice →</Link>
        <Link href="/states" className="border rounded-lg p-3 hover:bg-gray-50 text-sm font-medium">All 50 States →</Link>
      </div>
    </main>
  )
}
