import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug } from "@/data/states";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Road Signs Practice Test 2026 — Free DMV Signs Quiz",
  description: "Study all US road signs with our free practice test. Learn regulatory, warning, and guide signs tested on every state DMV exam. Updated for 2026.",
  alternates: { canonical: "https://dmv-prep.com/road-signs-practice-test" },
};

const SIGN_CATEGORIES = [
  { name: "Regulatory Signs", color: "bg-red-100 text-red-800 border-red-200", desc: "Control traffic and are legally enforceable. Red, white and black colors.", examples: ["Stop", "Yield", "Speed Limit", "Do Not Enter", "No U-Turn"] },
  { name: "Warning Signs", color: "bg-yellow-100 text-yellow-800 border-yellow-200", desc: "Alert drivers to hazards ahead. Yellow diamond shape.", examples: ["Curve Ahead", "Railroad Crossing", "School Zone", "Pedestrian Crossing", "Slippery Road"] },
  { name: "Guide Signs", color: "bg-green-100 text-green-800 border-green-200", desc: "Provide direction and distance information. Green or blue color.", examples: ["Exit Signs", "Mile Markers", "Route Numbers", "Service Signs", "Recreation Signs"] },
  { name: "School Zone Signs", color: "bg-lime-100 text-lime-800 border-lime-200", desc: "Fluorescent yellow-green, pentagon shaped. Indicate school areas.", examples: ["School Crossing", "School Speed Limit", "School Bus Stop Ahead", "End School Zone"] },
  { name: "Work Zone Signs", color: "bg-orange-100 text-orange-800 border-orange-200", desc: "Orange color, indicate construction and maintenance areas.", examples: ["Road Work Ahead", "Flagger Ahead", "Lane Closed", "Detour"] },
];

const POPULAR_STATES = ["florida", "california", "texas", "new-york", "illinois", "pennsylvania", "ohio", "georgia", "north-carolina", "michigan"];

export default function RoadSignsPracticeTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How many road signs are on the DMV test?", "acceptedAnswer": { "@type": "Answer", "text": "Most state DMV tests include 5-10 road sign questions. You must identify signs by shape, color, and meaning. Traffic signs make up roughly 20-30% of the written test." } },
              { "@type": "Question", "name": "What are the most common road signs on the DMV test?", "acceptedAnswer": { "@type": "Answer", "text": "The most commonly tested signs are: Stop, Yield, No U-Turn, Speed Limit, Do Not Enter, Wrong Way, Railroad Crossing, School Zone, and No Passing Zone." } },
              { "@type": "Question", "name": "What shape is a warning sign?", "acceptedAnswer": { "@type": "Answer", "text": "Warning signs are yellow diamond-shaped signs. They alert drivers to potential hazards or changes in road conditions ahead." } },
            ]
          })
        }}
      />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Road Signs Practice Test 2026</h1>
          <p className="text-lg text-gray-600 mb-8">
            Master every road sign tested on the DMV written exam. Learn the meaning, shape, and color of all US traffic signs — free.
          </p>

          {/* Key facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { stat: "5–10", label: "Sign questions on most DMV tests" },
              { stat: "20–30%", label: "Of the DMV test covers road signs" },
              { stat: "3 shapes", label: "You must recognize to pass" },
            ].map((item) => (
              <div key={item.stat} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{item.stat}</p>
                <p className="text-sm text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Sign categories */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Road Sign Categories</h2>
          <div className="space-y-4 mb-10">
            {SIGN_CATEGORIES.map((cat) => (
              <div key={cat.name} className={`rounded-xl border p-5 ${cat.color}`}>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-sm mb-3 opacity-80">{cat.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {cat.examples.map(e => (
                    <span key={e} className="px-2 py-1 bg-white bg-opacity-60 rounded-full text-xs font-medium">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Study tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
            <h2 className="font-bold text-blue-900 text-lg mb-3">How to Remember Road Signs</h2>
            <div className="space-y-2">
              {[
                "Learn by shape first — octagon always means Stop, triangle means Yield",
                "Red signs are regulatory and legally required to obey",
                "Yellow signs warn of hazards — slow down when you see them",
                "Orange signs mean construction — fines are doubled in work zones",
                "Fluorescent yellow-green signs are always near schools or pedestrians",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </div>
              ))}
            </div>
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
                  href={`/state/${slug}/road-sign-practice-test`}
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
            <h2 className="text-2xl font-bold mb-2">Ready to Test Your Sign Knowledge?</h2>
            <p className="text-blue-100 mb-5">Take a full road sign practice test with real DMV exam questions.</p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Road Signs Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
