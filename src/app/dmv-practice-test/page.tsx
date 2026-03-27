import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Free DMV Practice Test 2026 — Real Permit Test Questions",
  description: "Take our free DMV practice test with real permit test questions. Covers all 50 states. Traffic signs, right-of-way, speed limits, and safe driving. Pass on your first try.",
  alternates: { canonical: "https://dmv-prep.com/dmv-practice-test" },
};

const FAQ_DATA = [
  { q: "Is the DMV practice test free?", a: "Yes. DMVPrep Pro offers a completely free DMV practice test for all 50 states with no account required." },
  { q: "How many questions are on the DMV written test?", a: "The number of questions varies by state — typically 20 to 50 questions. Most states require 70-83% to pass." },
  { q: "What topics are on the DMV written test?", a: "Traffic signs, right-of-way rules, speed limits, safe driving practices, alcohol laws, and road markings." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_DATA.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
      }) }} />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Free DMV Practice Test 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Our free DMV practice test covers all the topics tested on the real written knowledge exam. Study traffic signs, right-of-way rules, speed limits, and safe driving — then take a full exam simulation to see if you are ready.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-2xl font-bold text-blue-600">50</p><p className="text-sm text-gray-500 mt-1">States covered</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-2xl font-bold text-blue-600">2,400+</p><p className="text-sm text-gray-500 mt-1">Practice questions</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-2xl font-bold text-blue-600">4</p><p className="text-sm text-gray-500 mt-1">Topics tested</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><p className="text-2xl font-bold text-blue-600">Free</p><p className="text-sm text-gray-500 mt-1">No account needed</p></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">What is on the DMV Test?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex justify-between mb-1"><span className="font-semibold text-gray-900 text-sm">Traffic Signs</span><span className="text-xs text-gray-500 font-bold">25%</span></div><p className="text-xs text-gray-500">Sign shapes, colors, and meanings tested on every DMV exam.</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex justify-between mb-1"><span className="font-semibold text-gray-900 text-sm">Right of Way</span><span className="text-xs text-gray-500 font-bold">20%</span></div><p className="text-xs text-gray-500">Who goes first at intersections, stops, and crossings.</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex justify-between mb-1"><span className="font-semibold text-gray-900 text-sm">Speed Limits</span><span className="text-xs text-gray-500 font-bold">15%</span></div><p className="text-xs text-gray-500">Speed limits by zone, school zones, and basic speed law.</p></div>
            <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex justify-between mb-1"><span className="font-semibold text-gray-900 text-sm">Safe Driving</span><span className="text-xs text-gray-500 font-bold">40%</span></div><p className="text-xs text-gray-500">Following distance, DUI laws, parking, railroad crossings.</p></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Practice by State</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
            <Link href="/state/florida/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Florida</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/california/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>California</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/texas/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Texas</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/new-york/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>New York</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/illinois/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Illinois</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/pennsylvania/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Pennsylvania</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/ohio/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Ohio</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/georgia/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Georgia</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/north-carolina/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>North Carolina</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
            <Link href="/state/michigan/dmv-practice-test" className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 group"><span>Michigan</span><ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" /></Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
            <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Tips to Pass on Your First Try</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Read the official driver handbook before practicing</span></li>
              <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Take at least 5 practice tests before your real exam</span></li>
              <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Aim for 90%+ on practice tests before scheduling</span></li>
              <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Focus on traffic signs — they appear on every test</span></li>
              <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Understand the rules, do not just memorize answers</span></li>
            </ul>
          </div>
          <div className="rounded-xl bg-blue-600 text-white p-8 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <h2 className="text-2xl font-bold mb-2">Start Your Free Practice Test</h2>
            <p className="text-blue-100 mb-5">No account needed. Real exam-style questions with explanations.</p>
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
