import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Test for Non-English Speakers 2026 — Practice in Your Language",
  description: "Take the DMV practice test in Spanish, Chinese, Vietnamese, Portuguese, or Haitian Creole. Free study guide for non-English speakers preparing for the US driver license test.",
  alternates: { canonical: "https://dmv-prep.com/dmv-test-for-non-english-speakers" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I take the DMV test in a language other than English?", acceptedAnswer: { "@type": "Answer", text: "Many US states offer the DMV knowledge test in multiple languages including Spanish, Chinese, Vietnamese, Portuguese, Arabic, Korean, and others. However, some states require the test in English only. Florida, for example, requires all DMV exams in English as of February 2026. Always check with your local DMV office." } },
    { "@type": "Question", name: "Which states offer the DMV test in Spanish?", acceptedAnswer: { "@type": "Answer", text: "Most US states offer the DMV knowledge test in Spanish including California, Texas, New York, New Jersey, Illinois, Georgia, and many others. A few states like Florida, Oklahoma, and Wyoming require the test in English only." } },
    { "@type": "Question", name: "Is it better to take the DMV test in English or my native language?", acceptedAnswer: { "@type": "Answer", text: "If your state offers the test in your language, you can take it in whichever language you feel most comfortable. However, road signs, pavement markings, and police instructions in the US are always in English. Practicing in English as well helps you drive more safely every day." } },
    { "@type": "Question", name: "How can I study for the DMV test if I don't speak English well?", acceptedAnswer: { "@type": "Answer", text: "Use DMV Prep to study the rules in your language. Our premium plan includes translations for every practice question in Spanish, Chinese, Vietnamese, and Portuguese. Study the meaning of each rule in your language first, then practice reading the English version before your test." } },
  ],
};

const LANGUAGES = [
  { name: "Spanish / Español", href: "/california-dmv-practice-test-spanish", states: "Available in CA, TX, NY, IL, GA and most states" },
  { name: "Chinese / 中文", href: "/california-dmv-practice-test-chinese", states: "Available in CA, NY, IL and several states" },
  { name: "Vietnamese / Tiếng Việt", href: "/california-dmv-practice-test-vietnamese", states: "Available in CA, TX, WA and several states" },
  { name: "Portuguese / Português", href: "/california-dmv-practice-test-portuguese", states: "Available in MA, NJ, NY and several states" },
  { name: "Haitian Creole / Krèyòl", href: "/florida-dmv-practice-test-haitian-creole", states: "Available in NY, MA and several states" },
];

const TIPS = [
  "Study the rules in your language first so you understand the meaning. Then practice reading the English versions before your real test.",
  "Road signs are the same in every US state — learn the shapes and colors first, then the specific signs.",
  "Right-of-way rules are different from many other countries. In the US, the car on the right goes first at a 4-way stop when two cars arrive at the same time.",
  "Speed limits are strictly enforced. School zones usually have a 15-25 mph limit whenever children are present — even on weekends.",
  "The blood alcohol limit for driving is 0.08% for adults. For drivers under 21, zero alcohol is allowed in most states.",
  "If a school bus has flashing red lights, you must stop in both directions on an undivided road. This rule surprises many drivers from other countries.",
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">

          <div className="mb-2 text-sm text-blue-600 font-medium">For Non-English Speakers</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Test for Non-English Speakers 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Preparing for the US driver license test but English is not your first language? This guide shows you how to study in your language and pass the DMV written test.</p>

          {/* Language options */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice in Your Language</h2>
            <div className="space-y-3">
              {LANGUAGES.map((l) => (
                <Link key={l.name} href={l.href} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div>
                    <div className="font-bold text-gray-900">{l.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{l.states}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key US Traffic Rules to Know</h2>
            <ul className="space-y-3">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
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
            <h2 className="text-xl font-bold mb-2">Study in Your Language — Pass in English</h2>
            <p className="text-blue-100 mb-4">Create a free account to access translations for every practice question.</p>
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
