// src/app/state/[state]/dmv-test-tips/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `How to Pass the ${state.name} DMV Test 2026 — Tips & Study Guide`,
    description: `Proven tips to pass the ${state.name} DMV written test on your first try. Study plan, common mistakes to avoid, and what to expect on test day.`,
  };
}

const PAGE_LINKS = [
  { href: "dmv-practice-test", label: "Practice Test" },
  { href: "road-sign-practice-test", label: "Road Sign Practice Test" },
  { href: "permit-test-questions", label: "Permit Test Questions" },
  { href: "dmv-handbook-summary", label: "DMV Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips & Guide" },
];

const TIPS = [
  { icon: "", title: "Study a little every day", desc: "15–20 minutes of practice each day is better than cramming the night before. Your brain remembers better with regular review." },
  { icon: "", title: "Focus on road signs first", desc: "Road signs are the most common topic on DMV tests — usually 20–30% of the exam. Learn every sign shape and color." },
  { icon: "", title: "Read every question carefully", desc: "Many questions use words like 'always', 'never', 'first', and 'except'. These words change the answer — read slowly." },
  { icon: "", title: "Take at least 3 full practice tests", desc: "The more tests you take, the more comfortable you will be. Aim to score 90%+ on practice tests before your real exam." },
  { icon: "", title: "Eliminate wrong answers", desc: "If you are unsure, cross out the answers that seem obviously wrong. This improves your chances even when guessing." },
  { icon: "", title: "Sleep well the night before", desc: "A tired brain makes more mistakes. Go to bed early the night before your test. Avoid last-minute cramming." },
  { icon: "", title: "Arrive early on test day", desc: "Give yourself extra time. Being rushed or late makes you nervous. Arrive 15 minutes early to settle in." },
  { icon: "", title: "Bring what you need", desc: "Bring your ID, any required documents, and enough money for the fee. Check your state DMV website for the exact requirements." },
];

const COMMON_MISTAKES = [
  { mistake: "Guessing on road sign questions without studying them", fix: "Study all sign shapes and colors — there are only a few categories." },
  { mistake: "Confusing 'yield' with 'stop'", fix: "Yield = slow down and wait if needed. Stop = always stop completely first." },
  { mistake: "Forgetting the 3-second following distance rule", fix: "Count 3 full seconds between you and the car ahead — more in bad weather." },
  { mistake: "Not knowing the BAC limits", fix: "0.08% for adults, 0.04% for commercial drivers, near-zero for minors under 21." },
  { mistake: "Mixing up who has right of way at 4-way stops", fix: "First to arrive goes first. Tied? The car on the RIGHT goes first." },
  { mistake: "Not knowing school zone speed limits", fix: "15–25 mph when children are present — watch for flashing lights." },
];

const STUDY_PLAN = [
  { day: "Day 1–2", task: "Read the DMV Handbook Summary on this page" },
  { day: "Day 3–4", task: "Study all road signs — shapes, colors, meanings" },
  { day: "Day 5–6", task: "Take 2 quick practice tests (10 questions each)" },
  { day: "Day 7", task: "Take a full practice test — review every wrong answer" },
  { day: "Day 8", task: "Focus only on topics you got wrong" },
  { day: "Day 9", task: "Take 2 more full practice tests" },
  { day: "Day 10", task: "Light review only — rest and sleep well tonight" },
  { day: "Test Day", task: "Arrive early, stay calm, read each question carefully" },
];

export default function TestTipsPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-purple-50 to-white py-14 px-4 border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-purple-600 font-medium mb-3 uppercase tracking-wide">
              Study Guide
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              How to Pass the {state.name} DMV Test
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Most people who fail the DMV test fail because they did not prepare the right way — not because the test is too hard. Follow this guide and you will pass on your first try.
            </p>
            <Link href={`/practice?state=${state.code}`} className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10">
              Start Practicing Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex gap-2 min-w-max">
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={`/state/${params.state}/${link.href}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${link.href === "dmv-test-tips" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">8 Tips to Pass on Your First Try</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TIPS.map((tip) => (
                <div key={tip.title} className="card p-5 flex gap-4">
                  <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{tip.title}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">10-Day Study Plan</h2>
            <p className="text-gray-500 mb-6 text-sm">Follow this plan and you will be ready for your {state.name} DMV test in 10 days.</p>
            <div className="card overflow-hidden">
              {STUDY_PLAN.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${i === STUDY_PLAN.length - 1 ? "border-t-2 border-blue-100 bg-blue-50" : ""}`}>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${i === STUDY_PLAN.length - 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                    {item.day}
                  </div>
                  <div className="text-sm text-gray-700">{item.task}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Common Mistakes — and How to Avoid Them</h2>
            <p className="text-gray-500 mb-6 text-sm">These are the most common reasons people fail the DMV test.</p>
            <div className="space-y-4">
              {COMMON_MISTAKES.map((item, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="font-medium text-gray-800">{item.mistake}</div>
                  </div>
                  <div className="flex items-start gap-3 ml-8">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-700">{item.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 bg-yellow-50 border-yellow-200">
            <h2 className="text-xl font-bold text-yellow-900 mb-3">What to Bring on Test Day</h2>
            <ul className="space-y-2">
              {[
                "Valid photo ID (passport, ID card, or previous license)",
                "Proof of residency if required (utility bill, lease, etc.)",
                "Social Security Number or card",
                "Payment for the test fee (check your state DMV website for amount)",
                "Any required parental consent forms if you are under 18",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                  <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card bg-blue-600 border-0 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">You are ready — start practicing now</h3>
            <p className="text-blue-100 mb-6">Take a free {state.name} DMV practice test and see where you stand today.</p>
            <Link href={`/practice?state=${state.code}`} className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50">
              Take Free Practice Test <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
