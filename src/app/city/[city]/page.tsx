import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CITIES, getCityBySlug, getCitiesByState } from '@/data/cities'

export async function generateStaticParams() {
  return CITIES.map(c => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city)
  if (!city) return {}
  return {
    title: `${city.name} DMV Practice Test 2026 — Free ${city.stateName} Permit Test | DMV Prep`,
    description: `Free DMV practice test for ${city.name}, ${city.stateName}. ${city.totalQuestions} questions, ${city.passingScore} to pass. Study for the ${city.stateName} ${city.agencyName} knowledge test. No signup needed.`,
    alternates: { canonical: `https://dmv-prep.com/city/${params.city}` },
  }
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city)
  if (!city) notFound()

  const otherCities = getCitiesByState(city.stateSlug).filter(c => c.slug !== city.slug)
  const stateTestUrl = `/state/${city.stateSlug}/dmv-practice-test`
  const practiceUrl  = `/practice?state=${city.stateAbbr}`
  const signsUrl     = `/state/${city.stateSlug}/road-sign-practice-test`
  const handbookUrl  = `/state/${city.stateSlug}/dmv-handbook-summary`

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Does the ${city.stateName} DMV test change based on what city I live in?`,
        acceptedAnswer: { '@type': 'Answer', text: `No — the ${city.stateName} ${city.agencyName} knowledge test is the same statewide. Whether you test in ${city.name} or anywhere else in ${city.stateName}, the questions and passing score are identical.` },
      },
      {
        '@type': 'Question',
        name: `How many questions are on the ${city.stateName} DMV test?`,
        acceptedAnswer: { '@type': 'Answer', text: `The ${city.stateName} DMV knowledge test has ${city.totalQuestions} questions. You need ${city.passingScore} (${city.passingCorrect} correct) to pass.` },
      },
      {
        '@type': 'Question',
        name: `How do I prepare for the ${city.stateName} DMV written test in ${city.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Practice with questions based on the official ${city.stateName} driver handbook. Take at least 3 full practice tests covering road signs, speed limits, right-of-way, alcohol laws, and GDL rules before your appointment.` },
      },
    ],
  }

  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `${city.name} ${city.stateName} DMV Practice Test 2026`,
    description: `Free DMV practice test for drivers in ${city.name}, ${city.stateName}.`,
    isAccessibleForFree: true,
    url: `https://dmv-prep.com/city/${params.city}`,
  }

  const topics = ['Road Signs & Signals','Right of Way','Speed Limits','Alcohol & DUI Laws','Parking Rules','Safe Driving','Distracted Driving','Emergency Vehicles','Teen & GDL Rules','Highway Driving']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }} />

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1.5">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href={stateTestUrl} className="hover:text-blue-600">{city.stateName} DMV Practice Test</Link>
          <span>›</span>
          <span>{city.name}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
          {city.name} DMV Practice Test 2026
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Prepare for the <strong>{city.stateName} {city.agencyName} knowledge test</strong> with free practice questions.
          The test is the same for all {city.stateName} drivers — including those in {city.name}.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm border-y py-3 mb-6 text-gray-500">
          <span><strong className="text-gray-900">{city.totalQuestions}</strong> questions</span>
          <span><strong className="text-gray-900">{city.passingScore}</strong> to pass ({city.passingCorrect} correct)</span>
          <span className="text-green-600 font-medium">Free — no signup</span>
        </div>

        {/* Local tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800"><strong>📍 {city.name} tip:</strong> {city.localTip}</p>
        </div>

        {/* CTA */}
        <Link href={practiceUrl}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors mb-8">
          Start Free Practice Test — {city.name}
        </Link>

        {/* Topics */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What's on the {city.stateName} DMV Test?</h2>
          <p className="text-gray-600 mb-4">
            Whether you test in {city.name} or anywhere else in {city.stateName}, the knowledge test covers the same 10 topic areas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topics.map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span className="text-green-500">✓</span>{t}
              </div>
            ))}
          </div>
        </section>

        {/* How to prepare */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Prepare in {city.name}</h2>
          <ol className="space-y-3">
            {[
              ['Take a full practice test first', 'See where you stand before you study. Most drivers discover gaps in road signs or right-of-way rules.'],
              ['Study your weak topics', `Road signs and right-of-way together make up roughly half of the real ${city.stateName} ${city.agencyName} test.`],
              ['Know the local context', city.localTip],
              ['Take at least 3 full practice tests', 'Drivers who complete 3+ practice tests pass at a significantly higher rate on their first attempt.'],
              ['Review the handbook summary', `Check the key rules from the ${city.stateName} driver handbook — especially speed limits, alcohol laws, and GDL rules.`],
            ].map(([title, body], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">DMV Test FAQ — {city.name}, {city.stateName}</h2>
          <div className="space-y-4">
            {[
              {
                q: `Does the ${city.stateName} DMV test change based on what city I live in?`,
                a: `No — the ${city.stateName} ${city.agencyName} knowledge test is the same statewide. Whether you test in ${city.name} or anywhere else in ${city.stateName}, the questions and passing score are identical.`,
              },
              {
                q: `How many questions are on the ${city.stateName} DMV test?`,
                a: `The test has ${city.totalQuestions} questions. You need ${city.passingScore} (${city.passingCorrect} correct) to pass.`,
              },
              {
                q: `Where can I take my DMV test near ${city.name}?`,
                a: `Visit your local ${city.agencyName} office near ${city.name}. Most offices offer walk-in or scheduled appointments. Check the official ${city.stateName} ${city.agencyName} website for current locations and hours.`,
              },
              {
                q: `What if I fail the ${city.stateName} DMV test?`,
                a: `You can retake it. Most states require a short waiting period of 1–3 days. Use that time to practice the topics you missed.`,
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other cities */}
        {otherCities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Other Cities in {city.stateName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {otherCities.map(c => (
                <Link key={c.slug} href={`/city/${c.slug}`}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                  <span className="text-gray-800">{c.name} DMV Practice Test</span>
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">More {city.stateName} DMV Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: stateTestUrl, label: `${city.stateName} DMV Practice Test`, sub: `Full ${city.totalQuestions}-question test` },
              { href: signsUrl,     label: 'Road Sign Practice Test',             sub: 'Visual sign identification' },
              { href: handbookUrl,  label: `${city.stateName} Handbook Summary`,  sub: 'Key rules in plain English' },
              { href: '/dmv-faq',  label: 'DMV FAQ',                             sub: 'Common questions answered' },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <span className="text-blue-600">📖</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{link.label}</div>
                  <div className="text-xs text-gray-500">{link.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to pass your {city.stateName} DMV test?</h2>
          <p className="text-blue-100 mb-5">Free practice for {city.name} residents — no account needed.</p>
          <Link href={practiceUrl}
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Start Free Practice Test
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
