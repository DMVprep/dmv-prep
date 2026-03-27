import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Florida DMV Test English Only 2026 — What You Need to Know",
  description: "Florida now requires all DMV driver license exams to be in English only, effective February 6, 2026. Learn what changed, who is affected, and how to prepare and pass.",
  alternates: {
    canonical: "https://dmv-prep.com/florida-dmv-test-english-only",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the Florida DMV test now in English only?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Effective February 6, 2026, Florida requires all driver license knowledge and skills exams to be administered in English only. No interpreters or translation services are permitted.",
      },
    },
    {
      "@type": "Question",
      name: "What languages did Florida offer the DMV test in before?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Before February 6, 2026, Florida offered the Class E knowledge exam in multiple languages including Spanish, Haitian Creole, Arabic, Chinese, Russian, and Portuguese.",
      },
    },
    {
      "@type": "Question",
      name: "How can I prepare for the Florida DMV test in English?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Study with free Florida DMV practice tests that use plain, simple English. DMVPrep Pro explains every rule in clear English designed for non-native speakers — no legal jargon.",
      },
    },
    {
      "@type": "Question",
      name: "Which states require the DMV test in English only?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As of 2026, Florida, Oklahoma, South Dakota, and Wyoming require driver license knowledge exams to be taken in English only.",
      },
    },
  ],
};

export default function FloridaEnglishOnlyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          {/* Hero */}
          <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 border-b border-gray-100">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
                <AlertCircle className="w-4 h-4" />
                Effective February 6, 2026
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                Florida DMV Test Is Now English Only
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Florida now requires all driver license exams — both written and driving — to be taken in English. No interpreters, no translations. Here is what changed and how to prepare.
              </p>
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                Practice the Florida Test in English <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

            {/* What changed */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Changed</h2>
              <div className="card overflow-hidden">
                {[
                  { label: "Effective date", value: "February 6, 2026" },
                  { label: "Who announced it", value: "Florida FLHSMV (Dept. of Highway Safety and Motor Vehicles)" },
                  { label: "What is now required", value: "All knowledge and skills exams in English only" },
                  { label: "Interpreters allowed", value: "No — not permitted in any form" },
                  { label: "Languages removed", value: "Spanish, Haitian Creole, Arabic, Chinese, Russian, Portuguese" },
                  { label: "Applies to", value: "All driver license classifications statewide" },
                ].map((item, i) => (
                  <div key={i} className={"flex items-center justify-between px-5 py-3 text-sm " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900 text-right ml-4">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Who is affected */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Is Affected</h2>
              <p className="text-gray-600 mb-4">
                This change affects anyone in Florida who needs to take a driver license knowledge or skills exam and is not fully comfortable reading English. This includes:
              </p>
              <ul className="space-y-2">
                {[
                  "New immigrants and non-native English speakers applying for a first Florida driver license",
                  "International residents who previously took the test in Spanish, Haitian Creole, or another language",
                  "Anyone renewing a license who needs to retake the knowledge test",
                  "Teen drivers whose parents are non-native English speakers and need help preparing",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* How to prepare */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Prepare and Pass in English</h2>
              <p className="text-gray-600 mb-6">
                The good news: the Florida DMV written test is straightforward if you prepare with the right materials. DMVPrep Pro was built specifically for non-native English speakers — every explanation uses plain, simple English without confusing legal language.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { step: "1", title: "Practice the test", desc: "Take free Florida DMV practice tests in simple English. See exactly what questions look like." },
                  { step: "2", title: "Study the signs", desc: "Road signs are always in English. Our road sign practice test explains every sign." },
                  { step: "3", title: "Learn key words", desc: "Our DMV vocabulary guide explains confusing words like 'yield', 'right of way', and 'merge'." },
                ].map(item => (
                  <div key={item.step} className="border rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{item.step}</div>
                    <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  Start Free Florida Practice Test <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/state/florida/road-sign-practice-test" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Road Sign Practice Test
                </Link>
              </div>
            </section>

            {/* What the test covers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What the Florida DMV Test Covers</h2>
              <div className="card overflow-hidden">
                {[
                  { topic: "Traffic signs and signals", pct: "25%" },
                  { topic: "Right of way rules", pct: "20%" },
                  { topic: "Speed limits", pct: "15%" },
                  { topic: "Safe driving practices", pct: "20%" },
                  { topic: "Alcohol and drug laws", pct: "10%" },
                  { topic: "Parking and turns", pct: "10%" },
                ].map((item, i) => (
                  <div key={i} className={"flex items-center justify-between px-5 py-3 text-sm " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                    <span className="text-gray-700">{item.topic}</span>
                    <span className="font-bold text-blue-600">{item.pct}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">50 questions total. You need 80% (40 correct) to pass.</p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((q) => (
                  <div key={q.name} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{q.name}</h3>
                    <p className="text-sm text-gray-600">{q.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Ready to practice in English?</h2>
              <p className="text-blue-100 mb-6 text-sm">
                Free Florida DMV practice test — 50 questions, plain English explanations. No signup required.
              </p>
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
                Start Practice Test — Free <ArrowRight className="w-4 h-4" />
              </Link>
            </section>

            {/* Related */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Also Useful</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href="/state/florida/dmv-practice-test" className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">Florida DMV Practice Test</div>
                  <div className="text-xs text-gray-500 mt-0.5">50 questions, free</div>
                </Link>
                <Link href="/state/florida/dmv-cheat-sheet" className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">Florida DMV Cheat Sheet</div>
                  <div className="text-xs text-gray-500 mt-0.5">All key rules on one page</div>
                </Link>
                <Link href="/state/florida/road-sign-practice-test" className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">Florida Road Sign Test</div>
                  <div className="text-xs text-gray-500 mt-0.5">Signs are always in English</div>
                </Link>
                <Link href="/dmv-test-english-only-states" className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">States With English-Only DMV Tests</div>
                  <div className="text-xs text-gray-500 mt-0.5">Full list of English-only states</div>
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
