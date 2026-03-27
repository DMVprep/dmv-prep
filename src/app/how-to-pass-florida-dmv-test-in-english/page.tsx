import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Pass the Florida DMV Test in English 2026 — Study Guide",
  description: "Florida DMV test is now English only. Here is exactly how to prepare and pass — even if English is not your first language. Free practice tests included.",
  alternates: {
    canonical: "https://dmv-prep.com/how-to-pass-florida-dmv-test-in-english",
  },
};

const DMV_WORDS = [
  { word: "Yield", meaning: "Slow down and let other cars or people go first. It is NOT a complete stop." },
  { word: "Right of way", meaning: "The right to go first. When you have it, other drivers must wait for you." },
  { word: "Merge", meaning: "Smoothly move your car into another lane of traffic." },
  { word: "Pedestrian", meaning: "A person who is walking — not in a car or bike." },
  { word: "Intersection", meaning: "The place where two roads cross each other." },
  { word: "Crosswalk", meaning: "A marked area where people can safely walk across the street." },
  { word: "Median", meaning: "The divider in the middle of a road that separates traffic going in opposite directions." },
  { word: "Right of way", meaning: "Who is allowed to go first at an intersection or crosswalk." },
  { word: "Implied consent", meaning: "By getting a license, you agree to take a BAC test if police ask." },
  { word: "Basic speed law", meaning: "Drive at a speed that is safe for conditions — even below the posted limit." },
];

export default function HowToPassEnglishPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-green-50 to-white py-12 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              How to Pass the Florida DMV Test in English
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Florida now requires all DMV tests in English only. If English is not your first language, this guide will show you exactly how to prepare and pass — step by step.
            </p>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Start Free Florida Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Good News First</h2>
            <p className="text-gray-600 mb-4">
              The Florida DMV written test is not a language test — it is a driving knowledge test. The questions are straightforward and follow predictable patterns. Most people who fail do so because they did not practice, not because of language difficulty.
            </p>
            <p className="text-gray-600">
              With the right preparation — especially using practice tests written in plain, simple English — most people pass on their first try regardless of their English level.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Study Plan</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Learn the key vocabulary first", desc: "Before anything else, learn the 10-15 most important DMV words. Words like 'yield', 'right of way', and 'merge' appear on almost every test. We explain them all in simple language below.", time: "30 minutes" },
                { step: "2", title: "Take a practice test to see where you are", desc: "Take a free Florida DMV practice test right now without studying. This shows you exactly which topics you need to focus on.", time: "20 minutes" },
                { step: "3", title: "Study road signs", desc: "Road signs are always in English — shapes, colors, and symbols. Take the Florida road sign practice test. Signs are 25-30% of the real test.", time: "45 minutes" },
                { step: "4", title: "Study each topic area", desc: "Focus on right of way, speed limits, alcohol laws, and safe driving. These make up most of the test. Read each explanation carefully.", time: "1-2 hours" },
                { step: "5", title: "Take 3 full practice tests", desc: "Take at least 3 complete practice tests before going to the DMV. Each test randomizes the questions. When you score 90%+ consistently, you are ready.", time: "1 hour" },
                { step: "6", title: "Review what you got wrong", desc: "After each test, read the explanation for every wrong answer. Understanding why matters more than memorizing.", time: "30 minutes" },
              ].map(item => (
                <div key={item.step} className="flex gap-4 p-4 border rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">{item.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key DMV Words to Learn First</h2>
            <p className="text-gray-600 mb-4">These words appear most often on the Florida DMV test. Learn them and you will understand most questions.</p>
            <div className="card overflow-hidden">
              {DMV_WORDS.map((item, i) => (
                <div key={i} className={"px-5 py-3 text-sm " + (i % 2 === 0 ? "bg-white" : "bg-gray-50")}>
                  <span className="font-bold text-blue-700">{item.word}: </span>
                  <span className="text-gray-700">{item.meaning}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Test Day</h2>
            <div className="space-y-3">
              {[
                "Read each question slowly and carefully — do not rush",
                "If you do not understand a word, look at the answer choices — they can help you understand the question",
                "Eliminate answers that are obviously wrong first",
                "Traffic signs questions are the easiest — you can identify signs by shape and color",
                "Questions about alcohol laws always follow the same pattern — 0.08% for adults, zero tolerance for under 21",
                "You have plenty of time — the test is not timed strictly, take your time",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to start practicing?</h2>
            <p className="text-blue-100 mb-6 text-sm">Free Florida DMV practice test — plain English, 50 questions. No signup.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors">
                Start Practice Test <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/state/florida/dmv-cheat-sheet" className="inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-400 transition-colors">
                Florida Cheat Sheet
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Related</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/florida-dmv-test-english-only" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida English-Only Law — Full Details</div>
                <div className="text-xs text-gray-500 mt-0.5">What changed and when</div>
              </Link>
              <Link href="/state/florida/road-sign-practice-test" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida Road Sign Practice Test</div>
                <div className="text-xs text-gray-500 mt-0.5">Signs are always in English</div>
              </Link>
              <Link href="/state/florida/dmv-handbook-summary" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida Handbook Summary</div>
                <div className="text-xs text-gray-500 mt-0.5">Key rules in plain English</div>
              </Link>
              <Link href="/dmv-test-english-only-states" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">All English-Only DMV States</div>
                <div className="text-xs text-gray-500 mt-0.5">Florida, Oklahoma, South Dakota, Wyoming</div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
