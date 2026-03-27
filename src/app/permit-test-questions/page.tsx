import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug } from "@/data/states";
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Permit Test Questions 2026 — Free Practice Questions",
  description: "Practice with real DMV permit test questions for every US state. Covers traffic signs, right-of-way, speed limits, and safe driving. Free and updated for 2026.",
  alternates: { canonical: "https://dmv-prep.com/permit-test-questions" },
};

const SAMPLE_QS = [
  { q: "What does a yellow diamond-shaped sign mean?", a: "Warning — a hazard or change in road conditions ahead.", topic: "Traffic Signs" },
  { q: "At a 4-way stop, who goes first?", a: "The vehicle that arrived first. If two arrive simultaneously, the driver on the right goes first.", topic: "Right of Way" },
  { q: "What is the speed limit in a residential area when no sign is posted?", a: "25–30 mph depending on your state. Always check for posted signs.", topic: "Speed Limits" },
  { q: "How far must you stop from a railroad crossing?", a: "At least 15 feet from the nearest rail.", topic: "Safe Driving" },
  { q: "When must you yield to a pedestrian?", a: "Always, when a pedestrian is in or approaching a crosswalk — marked or unmarked.", topic: "Right of Way" },
  { q: "What does a flashing red traffic light mean?", a: "Treat it like a stop sign — come to a complete stop and proceed when safe.", topic: "Traffic Signs" },
];

const TOPICS = [
  { name: "Traffic Signs", count: "25%", desc: "Sign shapes, colors, and meanings. Regulatory, warning, guide, and school zone signs.", color: "border-red-200 bg-red-50" },
  { name: "Right of Way", count: "20%", desc: "Who goes first at intersections, 4-way stops, roundabouts, and pedestrian crossings.", color: "border-blue-200 bg-blue-50" },
  { name: "Speed Limits", count: "15%", desc: "Speed limits by zone, school zones, work zones, and basic speed law.", color: "border-green-200 bg-green-50" },
  { name: "Safe Driving", count: "40%", desc: "Following distance, passing, DUI laws, parking, railroad crossings, seat belts.", color: "border-purple-200 bg-purple-50" },
];

const POPULAR_STATES = ["florida","california","texas","new-york","illinois","pennsylvania","ohio","georgia","north-carolina","michigan"];

export default function PermitTestQuestionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How many questions are on the permit test?", "acceptedAnswer": { "@type": "Answer", "text": "The number of questions varies by state — typically 20 to 50 questions. Most states require 80% or higher to pass." } },
              { "@type": "Question", "name": "What topics are on the permit test?", "acceptedAnswer": { "@type": "Answer", "text": "The permit test covers traffic signs, right-of-way rules, speed limits, safe driving practices, alcohol and drug laws, and road markings." } },
              { "@type": "Question", "name": "How many times can you take the permit test?", "acceptedAnswer": { "@type": "Answer", "text": "This varies by state. Most states allow multiple attempts, sometimes with a waiting period between tries." } },
            ]
          })
        }}
      />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Permit Test Questions 2026</h1>
          <p className="text-lg text-gray-600 mb-8">
            Practice with real DMV permit test questions for every US state. Study the topics that appear most on the exam and pass on your first try.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { stat: "20–50", label: "Questions per state test" },
              { stat: "80%", label: "Passing score most states" },
              { stat: "4", label: "Main topics tested" },
              { stat: "2,400+", label: "Practice questions available" },
            ].map((item) => (
              <div key={item.stat} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{item.stat}</p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Topics */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Topics Are on the Permit Test?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {TOPICS.map((t) => (
              <div key={t.name} className={`rounded-xl border p-5 ${t.color}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{t.name}</h3>
                  <span className="text-sm font-bold text-gray-500">{t.count} of test</span>
                </div>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Sample questions */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sample Permit Test Questions</h2>
          <div className="space-y-4 mb-10">
            {SAMPLE_QS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{item.topic}</span>
                    <p className="font-semibold text-gray-900 mt-1 mb-2">{item.q}</p>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* State links */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Practice by State</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
            {POPULAR_STATES.map((slug) => {
              const state = US_STATES.find(s => stateToSlug(s.name) === slug);
              if (!state) return null;
              return (
                <Link
                  key={slug}
                  href={`/state/${slug}/permit-test-questions`}
                  className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"
                >
                  {state.name}
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-blue-100 mb-5">Take a full DMV practice test with real exam-style questions for your state.</p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
