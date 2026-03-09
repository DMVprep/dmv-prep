import Link from 'next/link'
import { notFound } from 'next/navigation'
import states from '@/data/states.json'

type State = {
  name: string
  abbr: string
  slug: string
  questions: number
  passing: number
  passPct: number
  minAge: number
  fee: string
  onlineAvailable: boolean
  manualUrl: string
}

export async function generateStaticParams() {
  return states.map((s: State) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params
  const state = states.find((s: State) => s.slug === stateSlug) as State
  if (!state) return {}
  return {
    title: `${state.name} DMV Practice Test 2026 – Real Permit Test Questions`,
    description: `Free ${state.name} DMV practice test 2026. Covers traffic laws, road signs & rules. Pass your permit test on the first try with real exam questions.`,
    alternates: {
      canonical: `https://dmv-prep.com/dmv-practice-test/${state.slug}`
    }
  }
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params
  const state = states.find((s: State) => s.slug === stateSlug) as State
  if (!state) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        Free {state.name} DMV Practice Test 2026
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        Prepare for your {state.name} driver&apos;s permit test with our free practice questions.
        Built from the official {state.name} Driver&apos;s Manual — covering traffic signs,
        right-of-way rules, and state-specific laws. The real test has {state.questions} questions
        and requires {state.passing} correct answers ({state.passPct}%) to pass.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-900">{state.questions}</div>
          <div className="text-sm text-gray-500 mt-1">Total Questions</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{state.passing}</div>
          <div className="text-sm text-gray-500 mt-1">To Pass</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">{state.passPct}%</div>
          <div className="text-sm text-gray-500 mt-1">Passing Score</div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          What to Expect on the {state.name} DMV Test
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Traffic signs, signals, and pavement markings</li>
          <li>Right-of-way rules and intersection procedures</li>
          <li>Speed limits and safe following distances</li>
          <li>DUI/DWI laws and consequences</li>
          <li>Parking, turning, and lane change rules</li>
          <li>Sharing the road with pedestrians and cyclists</li>
        </ul>
      </section>

      <section className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Free {state.name} DMV Practice Test
        </h2>
        <p className="text-gray-500">[Interactive quiz component goes here]</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-3">
          Tips to Pass the {state.name} DMV Test
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>Read the official {state.name} Driver&apos;s Manual cover to cover.</li>
          <li>Take at least 3 full practice tests on dmv-prep.com.</li>
          <li>Focus on road signs — they are heavily tested.</li>
          <li>Review every question you get wrong before retesting.</li>
          <li>Get a good night&apos;s sleep before test day.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          FAQ – {state.name} DMV Knowledge Test
        </h2>
        <div className="space-y-4">
          {[
            {
              q: `How many questions are on the ${state.name} DMV test?`,
              a: `The ${state.name} knowledge test has ${state.questions} multiple-choice questions.`
            },
            {
              q: `What score do you need to pass the ${state.name} permit test?`,
              a: `You need ${state.passing} out of ${state.questions} correct — a ${state.passPct}% passing score.`
            },
            {
              q: `Can you take the ${state.name} permit test online?`,
              a: state.onlineAvailable
                ? `Yes — ${state.name} allows eligible applicants to take the knowledge test online.`
                : `No — ${state.name} requires the knowledge test in person at a DMV office.`
            },
            {
              q: `How many times can you retake the ${state.name} DMV test?`,
              a: `${state.name} allows multiple retakes. Check the official DMV for the current retake policy.`
            },
            {
              q: `What documents do I need for the ${state.name} permit test?`,
              a: `Typically: proof of identity, Social Security Number, two proofs of residency, and the ${state.fee} fee.`
            }
          ].map(({ q, a }, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-blue-900">{q}</div>
              <div className="text-gray-700 mt-1">{a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-4 flex-wrap">
        <a href="/road-signs-test" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Road Signs Test
        </a>
        <a href="/dmv-exam-simulator" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Full Exam Simulator
        </a>
      <Link href="/dmv-practice-test" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
  All 50 States
</Link>
      </section>
    </main>
  )
}