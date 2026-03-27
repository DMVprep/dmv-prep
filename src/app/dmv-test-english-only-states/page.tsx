import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "States With English-Only DMV Tests 2026 — Full List",
  description: "Which states require the DMV written knowledge test to be taken in English only? Full list of English-only DMV test states as of 2026, including Florida's new law.",
  alternates: {
    canonical: "https://dmv-prep.com/dmv-test-english-only-states",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which states require the DMV test in English only?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As of 2026, four states require the DMV knowledge test to be taken in English only: Florida (effective February 6, 2026), Oklahoma, South Dakota, and Wyoming.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use an interpreter for the DMV test?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In English-only states like Florida, Oklahoma, South Dakota, and Wyoming, interpreters are not permitted during the DMV knowledge test. Most other states allow interpreters or offer tests in multiple languages.",
      },
    },
    {
      "@type": "Question",
      name: "How many languages does California offer the DMV test in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "California offers the DMV written knowledge test in 35 languages, making it one of the most multilingual DMV testing states in the US.",
      },
    },
  ],
};

const ENGLISH_ONLY_STATES = [
  {
    name: "Florida",
    abbr: "FL",
    since: "February 6, 2026",
    note: "Previously offered in Spanish, Haitian Creole, Arabic, Chinese, Russian, and Portuguese. Changed by FLHSMV directive.",
    link: "/florida-dmv-test-english-only",
    practice: "/state/florida/dmv-practice-test",
  },
  {
    name: "Oklahoma",
    abbr: "OK",
    since: "Long-standing policy",
    note: "Oklahoma has historically required the knowledge test in English only.",
    link: null,
    practice: "/state/oklahoma/dmv-practice-test",
  },
  {
    name: "South Dakota",
    abbr: "SD",
    since: "Long-standing policy",
    note: "South Dakota requires English-only testing for driver license knowledge exams.",
    link: null,
    practice: "/state/south-dakota/dmv-practice-test",
  },
  {
    name: "Wyoming",
    abbr: "WY",
    since: "Long-standing policy",
    note: "Wyoming requires English-only testing for driver license knowledge exams.",
    link: null,
    practice: "/state/wyoming/dmv-practice-test",
  },
];

const MULTILINGUAL_STATES = [
  { name: "California", abbr: "CA", languages: "35 languages", slug: "california" },
  { name: "New York", abbr: "NY", languages: "25+ languages", slug: "new-york" },
  { name: "Texas", abbr: "TX", languages: "Multiple languages", slug: "texas" },
  { name: "Illinois", abbr: "IL", languages: "Multiple languages", slug: "illinois" },
  { name: "Pennsylvania", abbr: "PA", languages: "Multiple languages", slug: "pennsylvania" },
];

export default function EnglishOnlyStatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-4 border-b border-gray-100">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                States With English-Only DMV Tests 2026
              </h1>
              <p className="text-gray-600 text-lg">
                Most US states offer the DMV knowledge test in multiple languages. But a small number of states — including Florida as of 2026 — require the test to be taken in English only.
              </p>
            </div>
          </section>

          <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">English-Only DMV Test States</h2>
              <div className="space-y-4">
                {ENGLISH_ONLY_STATES.map(state => (
                  <div key={state.abbr} className="border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{state.name}</h3>
                        <div className="text-sm text-gray-500">English-only since: {state.since}</div>
                      </div>
                      <span className="text-sm font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">English only</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{state.note}</p>
                    <div className="flex gap-3">
                      <Link href={state.practice} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                        Practice Test <ArrowRight className="w-3 h-3" />
                      </Link>
                      {state.link && (
                        <Link href={state.link} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline">
                          Learn more <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">States That Offer Tests in Multiple Languages</h2>
              <p className="text-gray-600 mb-4">Most states offer the knowledge test in several languages. Here are some of the most multilingual states:</p>
              <div className="card overflow-hidden">
                {MULTILINGUAL_STATES.map((state, i) => (
                  <div key={state.abbr} className={"flex items-center justify-between px-5 py-3 text-sm " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-400 w-6">{state.abbr}</span>
                      <Link href={"/state/" + state.slug + "/dmv-practice-test"} className="font-medium text-blue-600 hover:underline">{state.name}</Link>
                    </div>
                    <span className="text-green-700 font-medium text-xs bg-green-100 px-2 py-1 rounded-full">{state.languages}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map(q => (
                  <div key={q.name} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{q.name}</h3>
                    <p className="text-sm text-gray-600">{q.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Practice for Your State</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href="/florida-dmv-test-english-only" className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium text-sm">Florida English-Only Law Guide</div>
                  <div className="text-xs text-gray-500 mt-0.5">Effective February 6, 2026</div>
                </Link>
                <Link href="/how-to-pass-florida-dmv-test-in-english" className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium text-sm">How to Pass in English</div>
                  <div className="text-xs text-gray-500 mt-0.5">Step-by-step study guide</div>
                </Link>
                <Link href="/states" className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium text-sm">All 50 States Practice Tests</div>
                  <div className="text-xs text-gray-500 mt-0.5">Find your state</div>
                </Link>
                <Link href="/dmv-cheat-sheet" className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="font-medium text-sm">DMV Cheat Sheet</div>
                  <div className="text-xs text-gray-500 mt-0.5">Key rules at a glance</div>
                </Link>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
