import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { VocabularySearch } from "./VocabularySearch";
import { VOCAB_TERMS, VOCAB_CATEGORIES } from "@/data/vocabulary";

// Legacy variable names for VocabularySearch compatibility
const CATEGORIES = VOCAB_CATEGORIES.map(c => ({ key: c.key, label: c.label }));

export const metadata: Metadata = {
  title: "DMV Vocabulary — 120 Driving Terms Explained in Plain English",
  description: "Learn the 120 DMV vocabulary words you need to pass your permit test. Every driving term explained in simple, plain English — perfect for ESL learners and first-time drivers. Available in Spanish too.",
  keywords: ["DMV vocabulary", "driving terms", "permit test words", "ESL driving", "DMV glossary", "driving dictionary", "permit test vocabulary"],
  alternates: {
    canonical: "https://dmv-prep.com/vocabulary",
    languages: {
      "en-US": "https://dmv-prep.com/vocabulary",
      "es-US": "https://dmv-prep.com/es/vocabulario",
    },
  },
};

// Vocab data imported from shared data file

export default function VocabularyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DMV Vocabulary</h1>
              <p className="text-sm text-gray-500">120 driving terms explained in plain English</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Every word you need to know for the DMV written test — defined in simple language anyone can understand.
            Perfect if English is your second language or you are studying for the first time.
          </p>
        </div>

        <VocabularySearch terms={VOCAB_TERMS} categories={CATEGORIES} />

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ready to practice?</h2>
          <p className="text-sm text-gray-600 mb-4">Now that you know the terms, test yourself with real DMV questions.</p>
          <div className="flex justify-center gap-3">
            <Link href="/lessons" className="px-5 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
              Read Lessons
            </Link>
            <Link href="/state/florida/dmv-practice-test" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Start Practice Test →
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "DMV Vocabulary — Driving Terms for the Permit Test",
        description: "120+ driving terms explained in plain English for the DMV written test.",
        url: "https://dmv-prep.com/vocabulary",
        hasDefinedTerm: VOCAB_TERMS.slice(0, 20).map(t => ({
          "@type": "DefinedTerm",
          name: t.word,
          description: t.definition,
        })),
      })}} />
    </div>
  );
}
