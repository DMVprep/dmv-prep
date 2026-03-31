// src/app/state/[state]/dmv-practice-test/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { CourseSchema, QuizSchema } from "@/components/seo/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { QuestionPreview } from "@/components/test/QuestionPreview";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { SAMPLE_QUESTIONS, DMV_VOCABULARY } from "@/data/questions";
import { STATE_SAMPLE_QUESTIONS } from "@/data/state-sample-questions";
import { CheckCircle, Clock, BookOpen, ArrowRight, AlertCircle, MapPin, Zap } from "lucide-react";
import CrossStateLinks from "@/components/CrossStateLinks";
import StateFaqSchema from "@/components/StateFaqSchema";
import { getCitiesByState } from "@/data/cities";

interface Props {
  params: { state: string };
}

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `${state.name} DMV Practice Test 2026 — Free Permit Test Questions`,
    description: `Free ${state.name} DMV practice test with 400+ real permit test questions. Plain-English explanations, Memory Engine with spaced repetition, Readiness Score. Pass your ${state.name} written test on the first try.`,
    keywords: [
      `${state.name} DMV practice test`,
      `${state.name} permit test`,
      `${state.code} DMV test`,
      `${state.name} driving test questions`,
    ],
    alternates: {
      canonical: `https://dmv-prep.com/state/${params.state}/dmv-practice-test`,
      languages: {
        "en": `https://dmv-prep.com/state/${params.state}/dmv-practice-test`,
        "es": `https://dmv-prep.com/${params.state}-dmv-practice-test-spanish`,
        "zh": `https://dmv-prep.com/${params.state}-dmv-practice-test-chinese`,
        "vi": `https://dmv-prep.com/${params.state}-dmv-practice-test-vietnamese`,
        "pt": `https://dmv-prep.com/${params.state}-dmv-practice-test-portuguese`,
        "ht": `https://dmv-prep.com/${params.state}-dmv-practice-test-haitian-creole`,
        "x-default": `https://dmv-prep.com/state/${params.state}/dmv-practice-test`,
      }
    },
  };
}

const STATE_TIPS: Record<string, string[]> = {
  default: [
    "Read each question carefully before answering",
    "If unsure, eliminate obviously wrong answers first",
    "Practice at least 3 full tests before your real exam",
    "Pay extra attention to road signs — they are heavily tested",
    "Get a good night's sleep before your test day",
  ],
};

const PAGE_LINKS = [
  { href: "road-sign-practice-test", label: "Road Sign Practice Test" },
  { href: "permit-test-questions", label: "Permit Test Questions" },
  { href: "dmv-handbook-summary", label: "DMV Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips & Guide" },
];

export default function StatePracticeTestPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();

  const allQuestions = STATE_SAMPLE_QUESTIONS[state.code] ?? SAMPLE_QUESTIONS.flatMap((t) => t.questions).slice(0, 10);
  const tips = STATE_TIPS[state.code] ?? STATE_TIPS.default;
  const cities = getCitiesByState(params.state);

  const faqs = [
    { q: `How many questions are on the ${state.name} DMV test?`, a: `The ${state.name} DMV written test has ${state.questionsCount} questions. You need to score ${state.passingScore}% or higher to pass.` },
    { q: `What topics are on the ${state.name} permit test?`, a: `The ${state.name} permit test covers traffic signs, right of way, speed limits, safe driving, alcohol and drug laws, and parking rules.` },
    { q: `How many times can I take the ${state.name} DMV test?`, a: `Most states allow you to retake the DMV written test after a waiting period. Check your local DMV office for specific rules in ${state.name}.` },
    { q: `Is the ${state.name} DMV test hard?`, a: `Most people who fail do so because they did not prepare. With regular practice using our free tests, the majority of users pass on their first try.` },
    { q: `Can I take the ${state.name} DMV test in another language?`, a: `Many DMV offices offer the written test in multiple languages. Check your local ${state.name} DMV office for available language options.` },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dmv-prep.com" },
      { "@type": "ListItem", "position": 2, "name": "All States", "item": "https://dmv-prep.com/states" },
      { "@type": "ListItem", "position": 3, "name": `${state.name} DMV Practice Test`, "item": `https://dmv-prep.com/state/${params.state}/dmv-practice-test` },
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <CourseSchema stateName={state.name} />
      <QuizSchema stateName={state.name} questionCount={allQuestions.length} stateSlug={params.state} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-14 px-4 border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-blue-600 font-medium mb-3 uppercase tracking-wide">
              {state.name} DMV Practice Test 2026
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
              {state.name} DMV Practice Test
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Practice real {state.name} DMV knowledge test questions with simple, clear
              explanations. This test is free and covers the same topics as the official
              {" "}{state.name} written permit exam.
            </p>

            <p className="text-xs text-gray-400 mb-6">
              Questions based on the Official {' '}{state.name} Driver Handbook
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              {[
                { icon: BookOpen, label: `${state.questionsCount} total questions` },
                { icon: CheckCircle, label: `${state.passingScore}% to pass` },
                { icon: Clock, label: "~30 minutes" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 shadow-sm">
                  <Icon className="w-4 h-4 text-blue-500" />
                  {label}
                </span>
              ))}
            </div>

            <Link
              href={`/practice?state=${state.code}`}
              className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2"
            >
              Start Full Practice Test
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Sub-page nav */}
        <section className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex gap-2 min-w-max">
            <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Practice Test
            </span>
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/state/${params.state}/${link.href}`}
                className="bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Sample questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sample {state.name} DMV Questions
            </h2>
            <p className="text-gray-500 mb-6">
              Try these free sample questions. Upgrade to unlock all 400+ {state.name} practice
              questions, the Memory Engine, Readiness Score, and full exam simulator.
            </p>
            <div className="space-y-4">
              {allQuestions.map((q, i) => (
                <QuestionPreview key={i} question={q} index={i} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={`/practice?state=${state.code}`}
                className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-8"
              >
                Start Free Practice Test
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>

          {/* What you get */}
          <section className="mb-12 card p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What You Get with DMVPrep Pro
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Everything you need to pass the {state.name} DMV test — built into one platform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "400+ Practice Questions", desc: `State-specific ${state.name} questions covering every topic on the real test.` },
                { title: "Memory Engine", desc: "Spaced repetition tracks what you know and schedules reviews so you never forget." },
                { title: "Readiness Score", desc: "See your real probability of passing — know exactly when you are ready." },
                { title: "SmartRecall Lessons", desc: "105 micro-lessons with built-in practice questions and instant feedback." },
                { title: "Weak Areas Identifier", desc: "Automatically finds the topics you struggle with so you can focus your study time." },
                { title: "Full Exam Simulator", desc: `Practice under real ${state.name} test conditions — ${state.questionsCount} questions, ${state.passingScore}% to pass.` },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="btn-primary inline-flex items-center justify-center gap-2 text-sm py-3 px-6">
                <Zap className="w-4 h-4" /> See Pricing
              </Link>
              <Link href="/lessons" className="btn-secondary inline-flex items-center justify-center gap-2 text-sm py-3 px-6">
                Try SmartRecall Lessons Free
              </Link>
            </div>
          </section>

          {/* About the test */}
          <section className="mb-12 card p-8 bg-blue-50 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About the {state.name} DMV Knowledge Test
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {[
                { label: "Total Questions", value: `${state.questionsCount} questions` },
                { label: "Passing Score", value: `${state.passingScore}% (${Math.ceil(state.questionsCount * state.passingScore / 100)} correct)` },
                { label: "Test Format", value: "Multiple choice" },
                { label: "Retake Policy", value: "Wait period if failed" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</div>
                  <div className="font-semibold text-gray-800">{value}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The {state.name} DMV written knowledge test covers traffic laws, road signs, safe
              driving practices, and state-specific rules. You must score at least {state.passingScore}%
              to pass. The test is taken at your local {state.name} DMV office.
            </p>
          </section>

          {/* Test tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tips to Pass the {state.name} DMV Test
            </h2>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* DMV Vocabulary */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">DMV Vocabulary Guide</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Important words you will see on the {state.name} DMV test — explained in simple English.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DMV_VOCABULARY.slice(0, 6).map((v) => (
                <div key={v.term} className="card p-4">
                  <div className="font-bold text-blue-600 mb-1">{v.term}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{v.definition}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Internal links — state sub-pages */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">More {state.name} DMV Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: `/state/${params.state}/road-sign-practice-test`, label: `${state.name} Road Sign Practice Test`, sub: "Learn every road sign on the test" },
                { href: `/state/${params.state}/permit-test-questions`, label: `${state.name} Permit Test Questions`, sub: "All question types covered" },
                { href: `/state/${params.state}/dmv-handbook-summary`, label: `${state.name} DMV Handbook Summary`, sub: "Key rules in plain English" },
                { href: `/state/${params.state}/dmv-test-tips`, label: `${state.name} Test Tips and Guide`, sub: "How to prepare and pass" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{link.label}</div>
                    <div className="text-xs text-gray-500">{link.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* City pages — internal links */}
          {cities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {state.name} DMV Practice Test by City
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                The {state.name} DMV knowledge test is the same statewide. Find your city for local tips and a direct link to start practicing.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/city/${city.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{city.name} DMV Practice Test</div>
                      <div className="text-xs text-gray-500 truncate">{city.localTip.split(' — ')[0]}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Language banner */}
          <section className="mb-12">
            
          </section>

          {/* Drivers also ask */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Drivers Also Ask</h2>
            <div className="space-y-2">
              {[
                { href: "/how-many-questions-on-dmv-test", text: `How many questions are on the ${state.name} DMV test?` },
                { href: "/dmv-test-passing-score-by-state", text: `What score do you need to pass the ${state.name} DMV test?` },
                { href: "/how-to-get-a-learners-permit", text: "How do I get a learner permit?" },
                { href: "/dmv-faq", text: "Can I take the DMV test in another language?" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                  <span className="text-sm text-gray-700 group-hover:text-blue-700">{item.text}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* Question Bank Links */}
          <section className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Common DMV Test Questions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: "/questions/what-does-a-yellow-diamond-sign-mean", label: "What does a yellow diamond sign mean?" },
                { href: "/questions/what-does-a-red-octagon-sign-mean", label: "What does a stop sign mean?" },
                { href: "/questions/who-has-right-of-way-at-a-4-way-stop", label: "Who has right of way at a 4-way stop?" },
                { href: "/questions/what-is-the-safe-following-distance", label: "What is the safe following distance?" },
                { href: "/questions/when-must-you-stop-at-a-railroad-crossing", label: "Railroad crossing rules" },
                { href: "/questions/what-is-the-bac-limit-for-driving", label: "What is the BAC limit for driving?" },
                { href: "/questions/what-does-a-flashing-red-light-mean", label: "What does a flashing red light mean?" },
                { href: "/questions/what-is-the-speed-limit-in-a-school-zone", label: "School zone speed limit rules" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Study Guides */}
          <section className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Study Guides for Your {state.name} DMV Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/dmv-guide/what-does-stop-sign-mean", label: "What Does a Stop Sign Mean?" },
                { href: "/dmv-guide/yield-sign-meaning", label: "Yield Sign Meaning Explained" },
                { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules at Intersections" },
                { href: "/dmv-guide/lane-markings-explained", label: "Lane Markings — Lines & Colors" },
                { href: "/dmv-guide/speed-limit-sign-rules", label: "Speed Limit Sign Rules" },
                { href: "/dmv-guide/railroad-crossing-rules", label: "Railroad Crossing Rules" },
                { href: "/dmv-guide/school-zone-speed-limit", label: "School Zone Speed Limit Rules" },
                { href: "/dmv-guide/no-passing-zone-meaning", label: "No Passing Zone Explained" },
                { href: `/state/${params.state}/road-sign-practice-test`, label: `${state.name} Road Sign Practice Test` },
                { href: "/dmv-guide/how-to-pass-dmv-test", label: "How to Pass Your DMV Test" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group text-sm text-gray-700 group-hover:text-blue-700">
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="card bg-blue-600 border-0 p-8 text-center text-white">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-blue-200" />
            <h3 className="text-2xl font-bold mb-2">Ready to unlock all 400+ questions?</h3>
            <p className="text-blue-100 mb-6">
              Create a free account to unlock the Memory Engine, track your Readiness Score, and use the full
              {state.name} exam simulator.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors">
                Create Free Account
              </Link>
              <Link href={`/practice?state=${state.code}`} className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-400 transition-colors">
                Start Without Account
              </Link>
            </div>
          </section>
        </div>
      </main>

      <CrossStateLinks currentSlug={params.state} />
      <StateFaqSchema
        stateName={state.name}
        stateSlug={params.state}
        totalQuestions={state.questionsCount}
        passingScore={String(state.passingScore) + '%'}
        passingCorrect={Math.ceil(state.questionsCount * state.passingScore / 100)}
      />
      <Footer />
    </div>
  );
}
