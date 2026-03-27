import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "How Many Questions Are on the Permit Test? — By State 2026",
  description: "Find out exactly how many questions are on the DMV permit test in your state and what score you need to pass.",
  alternates: { canonical: "https://dmv-prep.com/guide/how-many-questions-on-permit-test" },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/dmv-practice-test" className="hover:text-blue-600">DMV Practice Test</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">How Many Questions Are on the Permit Test?</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How Many Questions Are on the Permit Test?</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">The number of questions on the DMV permit test varies significantly by state — from just 18 questions in Pennsylvania to 50 questions in Florida and Michigan. Here is a complete breakdown by state.</p>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Questions by State</h2>
            <p className="text-gray-700 leading-relaxed">Florida: 50 questions, 80% to pass (40 correct). California: 46 questions, 83% to pass (38 correct). Texas: 30 questions, 70% to pass (21 correct). New York: 20 questions, 70% to pass (14 correct, including 2 of 4 sign questions). Illinois: 35 questions, 80% to pass. Pennsylvania: 18 questions, 83% to pass. Ohio: 40 questions, 75% to pass. Georgia: 40 questions, 75% to pass. North Carolina: 25 questions, 80% to pass. Michigan: 50 questions, 80% to pass.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What Topics Are Tested</h2>
            <p className="text-gray-700 leading-relaxed">All states test the same core topics: traffic signs and signals (about 25%), right-of-way rules (about 20%), speed limits and basic speed law (about 15%), and safe driving practices including alcohol laws, parking, and railroad crossings (about 40%).</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">How Long Do You Have</h2>
            <p className="text-gray-700 leading-relaxed">Most states give 25-60 minutes to complete the written test. The time limit is rarely a problem for prepared test takers. Read each question carefully and do not rush.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What Happens If You Fail</h2>
            <p className="text-gray-700 leading-relaxed">Most states allow multiple retakes with a waiting period between attempts — typically 1 to 7 days. Some states charge a fee for each attempt. Check your state DMV website for specific retake policies.</p>
          </section>

          <div className="rounded-xl bg-blue-600 text-white p-8 text-center mb-8">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Ready to Practice?</h2>
            <p className="mb-4 text-blue-100 text-sm">Take a free DMV practice test with real exam-style questions.</p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="/guide/how-to-pass-the-permit-test" className="flex items-center gap-2 text-blue-600 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />How to Pass the Permit Test</Link>
              <Link href="/guide/how-many-questions-on-permit-test" className="flex items-center gap-2 text-blue-600 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />How Many Questions on the Test</Link>
              <Link href="/guide/what-to-bring-to-dmv-test" className="flex items-center gap-2 text-blue-600 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />What to Bring to DMV Test</Link>
              <Link href="/guide/permit-test-failure-rate" className="flex items-center gap-2 text-blue-600 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />Why People Fail the Permit Test</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}