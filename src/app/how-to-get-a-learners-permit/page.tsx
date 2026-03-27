import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Get a Learner Permit 2026 — Step by Step Guide",
  description: "Learn exactly how to get your learner permit in any US state. Documents needed, age requirements, and what to expect at the DMV.",
  alternates: { canonical: "https://dmv-prep.com/how-to-get-a-learners-permit" },
};

const STEPS = [
  { step: "1", title: "Meet the age requirement", body: "Most states require you to be at least 15-16 years old. Michigan allows permits at 14 years 9 months. New Jersey requires 16. Check your state DMV website for the exact minimum age." },
  { step: "2", title: "Gather required documents", body: "You typically need: proof of identity (birth certificate or passport), Social Security number, proof of residency (utility bill or bank statement), and a completed application form. If under 18, a parent or guardian must sign." },
  { step: "3", title: "Study the driver handbook", body: "Read your state's official driver handbook cover to cover. Every question on the knowledge test comes directly from this handbook. Pay special attention to traffic signs, right-of-way rules, and speed limits." },
  { step: "4", title: "Take practice tests", body: "Take at least 5-10 full practice tests before your appointment. Aim for 90%+ consistently before scheduling. DMVPrep Pro offers free practice tests for all 50 states." },
  { step: "5", title: "Visit the DMV", body: "Make an appointment at your local DMV office. Bring all required documents. You will take a vision test and a written knowledge test (usually on a computer). Results are immediate." },
  { step: "6", title: "Pass and get your permit", body: "If you pass, you will receive a temporary learner permit immediately. Your permanent card is mailed within 2-4 weeks. With a permit, you can practice driving with a licensed adult supervisor." },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">How to Get a Learner Permit 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Getting your learner permit is the first step toward your driver license. Here is exactly what to do in any US state.</p>
          <div className="space-y-4 mb-10">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
                <div>
                  <h2 className="font-bold text-gray-900 mb-1">{s.title}</h2>
                  <p className="text-sm text-gray-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Start Studying Now</h2>
            <p className="text-blue-100 mb-4">Free practice tests for all 50 states. No signup needed.</p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Free Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
