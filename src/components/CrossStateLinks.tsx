import Link from 'next/link'

const ALL_STATES = [
  { slug: 'california',     abbr: 'CA', name: 'California' },
  { slug: 'florida',        abbr: 'FL', name: 'Florida' },
  { slug: 'texas',          abbr: 'TX', name: 'Texas' },
  { slug: 'new-york',       abbr: 'NY', name: 'New York' },
  { slug: 'pennsylvania',   abbr: 'PA', name: 'Pennsylvania' },
  { slug: 'illinois',       abbr: 'IL', name: 'Illinois' },
  { slug: 'ohio',           abbr: 'OH', name: 'Ohio' },
  { slug: 'georgia',        abbr: 'GA', name: 'Georgia' },
  { slug: 'north-carolina', abbr: 'NC', name: 'North Carolina' },
  { slug: 'michigan',       abbr: 'MI', name: 'Michigan' },
]

export default function CrossStateLinks({ currentSlug }: { currentSlug: string }) {
  const others = ALL_STATES.filter(s => s.slug !== currentSlug)
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-semibold mb-2">DMV Practice Tests in Other States</h2>
      <p className="text-gray-500 text-sm mb-5">Moving states or just curious? Each state has different DMV rules and questions.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {others.map(state => (
          <Link key={state.slug} href={`/state/${state.slug}/dmv-practice-test`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700 hover:text-blue-700">
            <span className="text-xs font-bold text-gray-400 w-6">{state.abbr}</span>
            <span>{state.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
