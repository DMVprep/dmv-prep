import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "What to Bring to Your DMV Test — Complete Checklist 2026",
  description: "Complete checklist of documents and items to bring to your DMV written test. Do not arrive unprepared.",
  alternates: { canonical: "https://dmv-prep.com/guide/what-to-bring-to-dmv-test" },
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
            <span className="text-gray-700">What to Bring to Your DMV Written Test</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What to Bring to Your DMV Written Test</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">Arriving at the DMV without the right documents means your appointment is wasted. Here is exactly what you need to bring to pass your permit test and get your license.</p>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Required Documents</h2>
            <p className="text-gray-700 leading-relaxed">Proof of identity: US birth certificate, passport, or permanent resident card. Social Security number: Social Security card, W-2, or tax return. Proof of residency: Two documents showing your current address — utility bills, bank statements, or official mail. If under 18: parent or guardian signature on application.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">For Your First License</h2>
            <p className="text-gray-700 leading-relaxed">First-time applicants typically need: proof of identity, Social Security number, proof of residency (2 documents), completed application form, and payment for the application fee. Requirements vary by state — always check your state DMV website the day before your appointment.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What to Expect at the DMV</h2>
            <p className="text-gray-700 leading-relaxed">Arrive early — DMV offices often have long wait times. Bring your documents in a folder to keep them organized. You will take a vision test before the written test. The written test is typically taken on a computer or tablet. Results are immediate in most states.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">After You Pass</h2>
            <p className="text-gray-700 leading-relaxed">After passing the written test, you will receive a learner permit (temporary paper document). Your permanent permit or license card is mailed within 2-4 weeks. With a learner permit you can drive only with a licensed adult supervisor.</p>
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