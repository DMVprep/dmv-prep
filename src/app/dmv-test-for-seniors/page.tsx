import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Test for Seniors 2026 — License Renewal Guide for Older Drivers",
  description: "Everything seniors need to know about renewing a driver license in 2026. Vision tests, written tests, renewal periods, and free practice tests by state.",
  alternates: { canonical: "https://dmv-prep.com/dmv-test-for-seniors" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Do seniors have to retake the DMV written test?", acceptedAnswer: { "@type": "Answer", text: "It depends on the state. Some states require seniors to retake the written knowledge test at renewal. Others only require a vision test. California requires drivers 70+ to renew in person. Illinois requires drivers 75+ to take a road test. Check your state DMV website for current requirements." } },
    { "@type": "Question", name: "How often do seniors need to renew their license?", acceptedAnswer: { "@type": "Answer", text: "Most states require license renewal every 4-8 years. However, many states have shorter renewal periods for older drivers. For example, Illinois requires drivers 81-86 to renew every 2 years, and drivers 87+ every year." } },
    { "@type": "Question", name: "Can seniors renew their license online?", acceptedAnswer: { "@type": "Answer", text: "Many states allow online renewal for drivers under a certain age. However, most states require older drivers to renew in person so a vision test can be administered. Check your state DMV website to see if online renewal is available for your age group." } },
    { "@type": "Question", name: "What vision requirements do seniors need to meet?", acceptedAnswer: { "@type": "Answer", text: "Most states require a minimum visual acuity of 20/40 in at least one eye, with or without corrective lenses. Some states have additional field of vision requirements. If you wear glasses or contacts, bring them to your DMV appointment." } },
  ],
};

const STEPS = [
  { step: "1", title: "Check your state's senior renewal rules", body: "Every state has different rules for older drivers. Some require more frequent renewal, in-person visits, vision tests, or written tests starting at a certain age. Visit your state DMV website or call your local office to find out exactly what applies to you." },
  { step: "2", title: "Schedule a vision check if needed", body: "Most states require a vision test at renewal for drivers over a certain age. If you wear glasses or contacts, make sure your prescription is current before your appointment. Bring your corrective lenses to the DMV." },
  { step: "3", title: "Review current traffic rules", body: "Traffic laws change over time. If it has been years since you last studied them, some rules may be different now. Pay special attention to cell phone laws, right-of-way rules, and speed limits — these are the most commonly updated areas." },
  { step: "4", title: "Practice the written test", body: "If your state requires a knowledge test at renewal, take several practice tests before your appointment. The questions cover road signs, traffic laws, and safe driving — the same topics as when you first got your license, but the rules may have changed." },
  { step: "5", title: "Visit the DMV with your documents", body: "Bring your current license, proof of residency if required, and any medical clearance your state may require. Arrive early and let the staff know if you need any accommodations." },
];

const TIPS = [
  "Many states offer senior-specific DMV services including shorter wait times and dedicated service windows — ask when you call.",
  "If your state requires a road test, practice in familiar areas and make sure your vehicle mirrors and seat are properly adjusted.",
  "Cell phone laws have changed significantly. Handheld phone use while driving is now illegal in most states — this is frequently tested.",
  "Right-of-way rules at roundabouts are now tested in many states. Yield to traffic already in the circle.",
  "If you have a medical condition that affects driving, ask your doctor about any reporting requirements in your state before your renewal.",
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">

          <div className="mb-2 text-sm text-blue-600 font-medium">For Seniors & License Renewal</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Test for Seniors 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Renewing your driver license as an older driver? This guide covers everything you need — what tests to expect, how to prepare, and what rules have changed.</p>

          {/* Steps */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step-by-Step Renewal Guide</h2>
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tips for Senior Drivers</h2>
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
                { name: "Illinois", href: "/state/illinois/dmv-practice-test" },
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
            <h2 className="text-xl font-bold mb-2">Practice Before Your Renewal</h2>
            <p className="text-blue-100 mb-4">Free DMV practice tests for all 50 states. Review current traffic laws before your appointment.</p>
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
