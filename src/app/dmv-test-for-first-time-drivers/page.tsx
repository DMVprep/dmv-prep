import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Test for First Time Drivers 2026 — Complete Beginner Guide",
  description: "First time taking the DMV written test? This guide covers everything beginners need to know — what to study, what to bring, and how to pass on the first try.",
  alternates: { canonical: "https://dmv-prep.com/dmv-test-for-first-time-drivers" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is on the DMV written test for first time drivers?", acceptedAnswer: { "@type": "Answer", text: "The DMV knowledge test covers road signs, traffic laws, right-of-way rules, speed limits, safe driving practices, alcohol and drug laws, and parking rules. All questions come directly from your state's official driver handbook." } },
    { "@type": "Question", name: "How hard is the DMV written test?", acceptedAnswer: { "@type": "Answer", text: "Most first time drivers who fail do so because they did not study enough. The test is not hard if you prepare properly. Take at least 3 full practice tests and aim for 90% before your real appointment. Most states require 70-83% to pass." } },
    { "@type": "Question", name: "What should I bring to my DMV written test?", acceptedAnswer: { "@type": "Answer", text: "You typically need: proof of identity (birth certificate or passport), Social Security number, proof of residency (utility bill or bank statement), completed application form, and payment for the license fee. If under 18, a parent or guardian must sign. Check your specific state DMV website for exact requirements." } },
    { "@type": "Question", name: "How many times can I take the DMV written test if I fail?", acceptedAnswer: { "@type": "Answer", text: "Most states allow you to retake the test after a waiting period of 1-7 days. Some states limit the number of attempts before requiring a new application. Use any waiting time to study the topics you missed." } },
  ],
};

const STEPS = [
  { step: "1", title: "Get your state's driver handbook", body: "Every question on the DMV knowledge test comes from your state's official driver handbook. Download it free from your state DMV website. You do not need to memorize every word — focus on road signs, right-of-way rules, speed limits, and alcohol laws." },
  { step: "2", title: "Learn road signs first", body: "Road signs make up 20-30% of every DMV test. Learn the shapes and colors first — red means stop or prohibition, yellow means warning, green means go or directions, orange means construction. Then learn the specific signs one by one." },
  { step: "3", title: "Study right-of-way rules", body: "Right-of-way questions are the most commonly failed topic. Know who goes first at 4-way stops, who yields when turning left, when to yield to pedestrians, and how to handle roundabouts. These rules are on every state test." },
  { step: "4", title: "Take practice tests daily", body: "Take a full practice test every day for one week before your appointment. Check which questions you miss and study those topics specifically. Aim to score 90% or higher consistently before scheduling your real test." },
  { step: "5", title: "Gather your documents", body: "Check your state DMV website for the exact list of documents required. Most states need proof of identity, Social Security number, and proof of residency. If you are under 18, a parent or guardian must come with you to sign." },
  { step: "6", title: "Pass your test", body: "Arrive early, stay calm, and read each question carefully. If you are unsure, eliminate obviously wrong answers first. You will get your results immediately after finishing. If you pass, you receive a temporary license the same day." },
];

const TIPS = [
  "The night before your test — review road signs for 30 minutes, then get a full night of sleep. Do not try to cram everything the night before.",
  "On test day — eat breakfast, arrive 15 minutes early, and bring all required documents. Rushing raises anxiety and causes careless mistakes.",
  "Read every question twice before answering. Many wrong answers happen because people misread the question, not because they don't know the answer.",
  "If you see the word 'always' or 'never' in an answer choice, be cautious — most driving rules have exceptions.",
  "After a wrong answer, write down the correct rule. Reviewing your mistakes is the fastest way to improve your score.",
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">

          <div className="mb-2 text-sm text-blue-600 font-medium">For First Time Drivers</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Test for First Time Drivers 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Taking the DMV written test for the first time? This guide covers exactly what to study, what to bring, and how to pass on your first try.</p>

          {/* Steps */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Prepare Step by Step</h2>
            <div className="space-y-4">
              {STEPS.map((s) => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tips to Pass on Your First Try</h2>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* State links */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Test by State</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Florida", href: "/state/florida/dmv-practice-test" },
                { name: "California", href: "/state/california/dmv-practice-test" },
                { name: "Texas", href: "/state/texas/dmv-practice-test" },
                { name: "New York", href: "/state/new-york/dmv-practice-test" },
                { name: "Pennsylvania", href: "/state/pennsylvania/dmv-practice-test" },
                { name: "All States", href: "/states" },
              ].map((s) => (
                <Link key={s.name} href={s.href} className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {s.name}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Start Practicing Now — It's Free</h2>
            <p className="text-blue-100 mb-4">Free DMV practice tests for all 50 states. No signup needed to start.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
