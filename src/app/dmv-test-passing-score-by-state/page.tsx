import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Test Passing Score by State 2026 — What Score Do You Need?",
  description: "Find out exactly what score you need to pass the DMV written test in your state. Passing scores range from 70% to 86% depending on the state.",
  alternates: { canonical: "https://dmv-prep.com/dmv-test-passing-score-by-state" },
};

const SCORES = [
  { state: "Florida", code: "FL", questions: 50, passing: "80%", correct: 40 },
  { state: "California", code: "CA", questions: 46, passing: "83%", correct: 38 },
  { state: "Texas", code: "TX", questions: 30, passing: "70%", correct: 21 },
  { state: "New York", code: "NY", questions: 20, passing: "70%", correct: 14 },
  { state: "Illinois", code: "IL", questions: 35, passing: "80%", correct: 28 },
  { state: "Pennsylvania", code: "PA", questions: 18, passing: "83%", correct: 15 },
  { state: "Ohio", code: "OH", questions: 40, passing: "75%", correct: 30 },
  { state: "Georgia", code: "GA", questions: 40, passing: "75%", correct: 30 },
  { state: "North Carolina", code: "NC", questions: 25, passing: "80%", correct: 20 },
  { state: "Michigan", code: "MI", questions: 50, passing: "80%", correct: 40 },
  { state: "Arizona", code: "AZ", questions: 30, passing: "80%", correct: 24 },
  { state: "Washington", code: "WA", questions: 40, passing: "80%", correct: 32 },
  { state: "Colorado", code: "CO", questions: 25, passing: "80%", correct: 20 },
  { state: "Virginia", code: "VA", questions: 35, passing: "86%", correct: 30 },
  { state: "New Jersey", code: "NJ", questions: 50, passing: "80%", correct: 40 },
  { state: "Tennessee", code: "TN", questions: 30, passing: "80%", correct: 24 },
  { state: "Minnesota", code: "MN", questions: 40, passing: "80%", correct: 32 },
  { state: "Wisconsin", code: "WI", questions: 50, passing: "80%", correct: 40 },
  { state: "Missouri", code: "MO", questions: 25, passing: "80%", correct: 20 },
  { state: "Indiana", code: "IN", questions: 50, passing: "84%", correct: 42 },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">DMV Test Passing Score by State 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Find out exactly how many questions are on the DMV written test in your state and what score you need to pass.</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">State</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Questions</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Passing Score</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Must Get Correct</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Practice</th>
                </tr>
              </thead>
              <tbody>
                {SCORES.map((s, i) => (
                  <tr key={s.code} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 font-medium text-gray-900">{s.state}</td>
                    <td className="p-4 text-center text-gray-600">{s.questions}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{s.passing}</td>
                    <td className="p-4 text-center text-gray-600">{s.correct} of {s.questions}</td>
                    <td className="p-4 text-center">
                      <Link href={"/practice?state=" + s.code} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        Practice →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-blue-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Practice?</h2>
            <p className="text-blue-100 mb-4">Take a free practice test for your state right now.</p>
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
