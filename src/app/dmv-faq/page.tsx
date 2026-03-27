import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV FAQ 2026 — Frequently Asked Questions About the DMV Test",
  description: "Answers to the most common DMV test questions. Can you take the test in another language? How many times can you retake it? What do you need to bring?",
  alternates: { canonical: "https://dmv-prep.com/dmv-faq" },
};

const FAQS = [
  { q: "Can I take the DMV test in another language?", a: "Yes. Most states offer the written knowledge test in multiple languages. Common options include Spanish, Chinese, Vietnamese, Portuguese, Korean, and more. Check your state DMV website for available languages. DMVPrep Pro also offers practice questions with translations in Spanish, Chinese, Portuguese, and French." },
  { q: "How many times can I retake the DMV written test if I fail?", a: "Most states allow unlimited retakes, usually with a waiting period of 1-7 days between attempts. Some states charge a fee for each attempt. After multiple failures, some states require additional steps such as a driving course. Check your state DMV for specific policies." },
  { q: "What do I need to bring to the DMV written test?", a: "Typically you need: proof of identity (birth certificate or passport), Social Security number, proof of residency (two documents showing your address), a completed application, and payment for any fees. If under 18, a parent or guardian must accompany you. Requirements vary by state." },
  { q: "How long does the DMV written test take?", a: "Most DMV written tests take 15-30 minutes to complete. The time limit varies by state — typically 25-60 minutes. Most prepared test takers finish well within the time limit. Rushing is not necessary if you have studied." },
  { q: "Is the DMV practice test the same as the real test?", a: "Our practice tests are based on the same content as the real test — the official state driver handbook. The exact questions will differ, but the topics, difficulty, and format are similar. Scoring consistently above 90% on practice tests means you are ready for the real exam." },
  { q: "Can I use my phone or notes during the DMV test?", a: "No. Using any reference materials during the DMV written test is strictly prohibited and will result in automatic failure. You must answer all questions from memory. This is why thorough preparation with practice tests beforehand is essential." },
  { q: "What happens if I pass the written test?", a: "After passing, you receive a learner permit (temporary paper document). Your permanent permit card is mailed within 2-4 weeks. With a permit, you can drive only with a licensed adult supervisor. You must hold the permit for a minimum period before applying for a full license." },
  { q: "Do I need to make an appointment for the DMV test?", a: "Most states now require or strongly recommend appointments. Walk-in availability varies by location and time of day. Check your state DMV website to schedule. Appointments are usually available within 1-2 weeks at most locations." },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 mb-8">Answers to the most common questions about the DMV written knowledge test.</p>
          <div className="space-y-4 mb-10">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-bold text-gray-900 mb-2">{faq.q}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-blue-100 mb-4">Free DMV practice tests for all 50 states.</p>
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
