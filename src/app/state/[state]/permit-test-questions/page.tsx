// src/app/state/[state]/permit-test-questions/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { SAMPLE_QUESTIONS } from "@/data/questions";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `${state.name} Permit Test Questions 2026  Real DMV Practice`,
    description: `Real ${state.name} permit test questions with answers and plain-English explanations. Practice the most common topics on the ${state.name} DMV written exam.`,
  };
}

const PAGE_LINKS = [
  { href: "dmv-practice-test", label: "Practice Test" },
  { href: "road-sign-practice-test", label: "Road Sign Practice Test" },
  { href: "permit-test-questions", label: "Permit Test Questions" },
  { href: "dmv-handbook-summary", label: "DMV Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips & Guide" },
];

const TOPICS = [
  { name: "Traffic Signs & Signals", pct: "25%", desc: "Sign shapes, colors, meanings. Traffic light rules. Flashing lights." },
  { name: "Right of Way", pct: "20%", desc: "4-way stops, intersections, pedestrians, emergency vehicles, roundabouts." },
  { name: "Speed Limits", pct: "15%", desc: "School zones, residential areas, highways, basic speed law." },
  { name: "Safe Driving", pct: "20%", desc: "Following distance, blind spots, lane changes, night driving, weather." },
  { name: "Alcohol & Drugs", pct: "10%", desc: "BAC limits, DUI laws, zero tolerance for minors, implied consent." },
  { name: "Parking & Turns", pct: "10%", desc: "No-parking zones, parallel parking, U-turns, signaling rules." },
];

export default function PermitTestQuestionsPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();

  const allQuestions = SAMPLE_QUESTIONS.flatMap((t) => t.questions);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-14 px-4 border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">
              {state.name} Permit Test
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {state.name} Permit Test Questions
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Practice the most common {state.name} DMV permit test questions. Every question includes a plain-English explanation so you understand  not just memorize.
            </p>
            <Link href={`/practice?state=${state.code}`} className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10">
              Take Full Practice Test <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex gap-2 min-w-max">
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={`/state/${params.state}/${link.href}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${link.href === "permit-test-questions" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What Topics Are on the {state.name} Permit Test?</h2>
            <p className="text-gray-500 mb-6 text-sm">The {state.name} DMV written test covers these main topics. Here is roughly how much each topic appears:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPICS.map((topic) => (
                <div key={topic.name} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">{topic.name}</div>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{topic.pct}</span>
                  </div>
                  <div className="text-sm text-gray-500">{topic.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sample Permit Test Questions</h2>
            <p className="text-gray-500 mb-6 text-sm">These are the types of questions you will see on the real {state.name} DMV test.</p>
            <div className="space-y-6">
              {allQuestions.map((q, i) => (
                <div key={i} className="card p-6">
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Question {i + 1}</div>
                  <p className="font-semibold text-gray-900 mb-4">{q.text}</p>
                  <div className="space-y-2 mb-4">
                    {q.choices.map((choice, ci) => (
                      <div key={ci} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${ci === q.correct ? "border-green-300 bg-green-50 text-green-800" : "border-gray-100 bg-gray-50 text-gray-500"}`}>
                        {ci === q.correct ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                        {choice}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                    <span className="font-bold">Why: </span>{q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card bg-blue-600 border-0 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Practice all {state.questionsCount} {state.name} permit test questions</h3>
            <p className="text-blue-100 mb-6">Our full practice test covers every topic on the real exam  free, no signup needed.</p>
            <Link href={`/practice?state=${state.code}`} className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50">
              Start Practicing Free <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
