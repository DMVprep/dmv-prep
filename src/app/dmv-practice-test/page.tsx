import states from '@/data/states.json'
import Link from 'next/link'

export const metadata = {
  title: 'Free DMV Practice Test 2026 – All 50 States | dmv-prep.com',
  description: "Free DMV practice tests for all 50 states. Real permit test questions, road signs, and exam prep. Pass your driver's license test on the first try."
}

export default function HubPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        Free DMV Practice Test 2026 – All 50 States
      </h1>
      <p className="text-gray-700 mb-8">
        Select your state below to start your free DMV practice test.
        Each test is built from the official state driver&apos;s manual.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {states.map((s) => (
          <Link
            key={s.slug}
            href={`/dmv-practice-test/${s.slug}`}
            className="border border-blue-200 rounded-lg px-4 py-3 text-blue-800 font-medium hover:bg-blue-50 transition"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </main>
  )
}