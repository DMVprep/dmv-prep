import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Test for Immigrants 2026 — How to Get Your US Driver License",
  description: "Complete guide to passing the DMV written test as an immigrant in the US. Documents needed, language options, and free practice tests for all 50 states.",
  alternates: { canonical: "https://dmv-prep.com/dmv-test-for-immigrants" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can immigrants get a driver license in the US?", acceptedAnswer: { "@type": "Answer", text: "Yes. Most US states allow immigrants to apply for a driver license regardless of immigration status. Requirements vary by state. Some states require a Social Security number, while others accept an Individual Taxpayer Identification Number (ITIN) or foreign passport." } },
    { "@type": "Question", name: "Can I take the DMV written test in my language?", acceptedAnswer: { "@type": "Answer", text: "Many states offer the DMV knowledge test in multiple languages including Spanish, Chinese, Vietnamese, Portuguese, Arabic, and others. Florida requires the test in English only as of 2026. Check with your local DMV office for available languages." } },
    { "@type": "Question", name: "Can I use my foreign driver license in the US?", acceptedAnswer: { "@type": "Answer", text: "Most states allow you to drive with a valid foreign driver license for a limited time, usually 30-90 days. After that you must obtain a US state driver license. Some states have reciprocity agreements that waive the road test for drivers from certain countries." } },
    { "@type": "Question", name: "What documents do immigrants need for the DMV test?", acceptedAnswer: { "@type": "Answer", text: "Requirements vary by state but typically include: valid passport or foreign ID, visa or immigration documents, proof of state residency (utility bill or bank statement), and an ITIN or Social Security number. Check your specific state DMV website for exact requirements." } },
  ],
};

const STEPS = [
  { step: "1", title: "Check your state's requirements", body: "Every state has different rules for immigrants. Some require a Social Security number. Others accept an ITIN or foreign documents. Visit your state DMV website or call your local office to confirm what you need before your appointment." },
  { step: "2", title: "Gather your documents", body: "Most states require: valid passport or foreign ID card, current visa or immigration status documents, proof of state residency (utility bill, bank statement, or lease agreement), and a Social Security number or ITIN if required by your state." },
  { step: "3", title: "Study in your language", body: "Many states offer the DMV knowledge test in Spanish, Chinese, Vietnamese, Portuguese, Arabic, and other languages. Use DMV Prep to study the rules in your language, then practice reading the English versions so you are fully prepared." },
  { step: "4", title: "Learn US traffic rules", body: "Even if you drove for years in another country, US traffic laws are different. Pay close attention to right-of-way rules at 4-way stops, school bus laws, speed limits in school zones, and blood alcohol limits — these appear on every state test." },
  { step: "5", title: "Take at least 3 full practice tests", body: "Most immigrants who fail the DMV test do so because US traffic rules are unfamiliar. Taking 3 or more full practice tests dramatically increases your chance of passing on the first try. Focus on road signs — they are the most common test topic." },
  { step: "6", title: "Schedule and pass your DMV appointment", body: "Make an appointment at your local DMV office. Bring all required documents. You will take a vision test and a written knowledge test. If you pass, you will receive a temporary license immediately. Your permanent card is mailed within 2-4 weeks." },
];

const TIPS = [
  "Road signs in the US are standardized — red means stop or prohibition, yellow means warning, green means go or directions.",
  "The blood alcohol limit for driving is 0.08% in most states. Zero tolerance applies to drivers under 21.",
  "You must stop completely for a school bus with flashing red lights — this applies in both directions on undivided roads.",
  "At a 4-way stop, the car that arrives first goes first. If two cars arrive at the same time, the car on the right goes first.",
  "Speed limits are strictly enforced. School zone limits (usually 15-25 mph) apply whenever children are present.",
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">

          <div className="mb-2 text-sm text-blue-600 font-medium">For Immigrants & New Residents</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Test for Immigrants 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Moving to the US and need a driver license? This guide covers everything immigrants need to know — documents, language options, and how to pass the written test.</p>

          {/* Steps */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step-by-Step Guide</h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key US Traffic Rules for New Drivers</h2>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Language options */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice in Your Language</h2>
            <p className="text-gray-600 text-sm mb-4">Study the DMV rules in your language first, then practice in English before your real test.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { lang: "Spanish", href: "/california-dmv-practice-test-spanish" },
                { lang: "Chinese", href: "/california-dmv-practice-test-chinese" },
                { lang: "Vietnamese", href: "/california-dmv-practice-test-vietnamese" },
                { lang: "Portuguese", href: "/california-dmv-practice-test-portuguese" },
                { lang: "Haitian Creole", href: "/florida-dmv-practice-test-haitian-creole" },
                { lang: "English", href: "/practice" },
              ].map((l) => (
                <Link key={l.lang} href={l.href} className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  {l.lang}
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
            <h2 className="text-xl font-bold mb-2">Start Practicing Now</h2>
            <p className="text-blue-100 mb-4">Free DMV practice tests for all 50 states. Study in your language, pass in English.</p>
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
