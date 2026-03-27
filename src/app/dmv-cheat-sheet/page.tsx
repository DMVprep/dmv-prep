import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Cheat Sheet 2026 — Free Quick Reference for All 50 States",
  description: "Free DMV cheat sheet covering speed limits, road signs, right of way, alcohol laws, and parking rules. Select your state for state-specific rules.",
};

const STATES = [
  { slug: "california", name: "California", abbr: "CA", questions: 46, passing: "83%" },
  { slug: "florida", name: "Florida", abbr: "FL", questions: 50, passing: "80%" },
  { slug: "texas", name: "Texas", abbr: "TX", questions: 40, passing: "70%" },
  { slug: "new-york", name: "New York", abbr: "NY", questions: 20, passing: "70%" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", questions: 18, passing: "83%" },
  { slug: "illinois", name: "Illinois", abbr: "IL", questions: 35, passing: "80%" },
  { slug: "ohio", name: "Ohio", abbr: "OH", questions: 40, passing: "75%" },
  { slug: "georgia", name: "Georgia", abbr: "GA", questions: 40, passing: "75%" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", questions: 25, passing: "80%" },
  { slug: "michigan", name: "Michigan", abbr: "MI", questions: 50, passing: "80%" },
];

const UNIVERSAL_RULES = [
  { topic: "Stop Sign", rule: "Full stop required. Wait until safe before proceeding." },
  { topic: "Yellow Diamond", rule: "Warning — hazard ahead. Slow down." },
  { topic: "4-Way Stop", rule: "First to arrive goes first. Tie = rightmost goes first." },
  { topic: "Pedestrians", rule: "Always yield at crosswalks — marked or unmarked." },
  { topic: "Emergency vehicles", rule: "Pull over to the right and stop completely." },
  { topic: "BAC limit (21+)", rule: "0.08% in all 50 states." },
  { topic: "Texting", rule: "Illegal in all 50 states while driving." },
  { topic: "School bus", rule: "Stop when red lights flash — both directions." },
  { topic: "Work zone", rule: "Fines doubled. Slow down and obey flaggers." },
  { topic: "Fire hydrant", rule: "Park 15 feet away minimum." },
];

export default function NationalCheatSheetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-yellow-50 to-white py-10 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">DMV Cheat Sheet 2026</h1>
            <p className="text-gray-600 mb-6">
              Select your state for a state-specific cheat sheet covering speed limits, alcohol laws,
              road signs, right of way, and parking rules.
            </p>
            <Link href="/states" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
              View All 50 States <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your State</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATES.map(state => (
                <Link key={state.slug} href={"/state/" + state.slug + "/dmv-cheat-sheet"}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-6">{state.abbr}</span>
                    <span className="font-medium text-gray-900">{state.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">{state.questions}q · {state.passing} to pass</div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rules That Apply in All 50 States</h2>
            <div className="card overflow-hidden">
              {UNIVERSAL_RULES.map((item, i) => (
                <div key={i} className={"flex items-start gap-3 px-4 py-3 text-sm " + (i % 2 !== 0 ? "bg-gray-50" : "bg-white")}>
                  <span className="font-semibold text-gray-900 min-w-fit">{item.topic}</span>
                  <span className="text-gray-600">{item.rule}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Also Study</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/road-signs-practice-test" className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Road Signs Practice Test</div>
                <div className="text-xs text-gray-500 mt-0.5">All 50 states</div>
              </Link>
              <Link href="/dmv-exam-simulator" className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">DMV Exam Simulator</div>
                <div className="text-xs text-gray-500 mt-0.5">Real test conditions</div>
              </Link>
              <Link href="/permit-test-practice" className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Permit Test Practice</div>
                <div className="text-xs text-gray-500 mt-0.5">For first-time drivers</div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
