import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Pennsylvania DMV Practice Test 2 2026 — Free Pennsylvania Permit Questions",
  description: "Free Pennsylvania DMV practice test 2 with 25 real permit test questions. Traffic signs, right-of-way, speed limits, and safe driving.",
  alternates: { canonical: "https://dmv-prep.com/state/pennsylvania/practice-test-2" },
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
            <Link href="/state/pennsylvania/dmv-practice-test" className="hover:text-blue-600">Pennsylvania DMV Practice Test</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Practice Test 2</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Pennsylvania DMV Practice Test 2</h1>
          <p className="text-gray-600 mb-6">25 real Pennsylvania DMV exam-style questions covering traffic signs, right-of-way, speed limits, and safe driving.</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">25</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">Free</p>
              <p className="text-sm text-gray-500">No signup needed</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
            <h2 className="font-bold text-gray-900 mb-3">Topics Covered</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-700">Traffic Signs</span><span className="font-bold text-gray-500">25%</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-700">Right of Way</span><span className="font-bold text-gray-500">20%</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-700">Speed Limits</span><span className="font-bold text-gray-500">15%</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-700">Safe Driving</span><span className="font-bold text-gray-500">40%</span></div>
            </div>
          </div>
          <div className="rounded-xl bg-blue-600 text-white p-8 text-center mb-8">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Start Practice Test 2</h2>
            <p className="text-blue-100 mb-4 text-sm">Real Pennsylvania DMV exam questions with explanations.</p>
            <Link href="/practice?state=PA" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/state/pennsylvania/practice-test-1" className="py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-center text-gray-600 hover:border-blue-400 transition-colors">Test 1</Link>
            <Link href="/state/pennsylvania/practice-test-2" className="py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-center text-gray-600 hover:border-blue-400 transition-colors">Test 2</Link>
            <Link href="/state/pennsylvania/practice-test-3" className="py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-center text-gray-600 hover:border-blue-400 transition-colors">Test 3</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}