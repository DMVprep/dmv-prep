import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Regulatory Signs Practice Test 2026 — DMV Regulatory Signs Quiz",
  description: "Study all regulatory signs for the DMV test. Red and white signs that control traffic and are legally enforceable. Free practice quiz with explanations.",
  alternates: { canonical: "https://dmv-prep.com/regulatory-signs-test" },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Regulatory Signs Practice Test 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Regulatory signs control traffic and are legally enforceable. Violating them can result in fines or license points. They are heavily tested on every DMV written exam.</p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Signs You Must Know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Stop Sign</h3>
              <p className="text-xs text-gray-500">Eight-sided red sign. You must come to a complete stop before the stop line.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Yield Sign</h3>
              <p className="text-xs text-gray-500">Downward-pointing triangle. Slow down and give right-of-way to other traffic.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Speed Limit</h3>
              <p className="text-xs text-gray-500">White rectangle. Your speed must not exceed the posted limit.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Do Not Enter</h3>
              <p className="text-xs text-gray-500">Red circle with horizontal white bar. Never enter this road.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Wrong Way</h3>
              <p className="text-xs text-gray-500">Red and white sign. You are going the wrong direction — turn around.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">No U-Turn</h3>
              <p className="text-xs text-gray-500">Red circle with slash over U-turn arrow. U-turns are prohibited here.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">No Left Turn</h3>
              <p className="text-xs text-gray-500">Red circle with slash over left arrow. Left turns are prohibited.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">No Right Turn</h3>
              <p className="text-xs text-gray-500">Red circle with slash over right arrow. Right turns are prohibited.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">One Way</h3>
              <p className="text-xs text-gray-500">Black and white arrow. Traffic flows only in the direction shown.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Keep Right</h3>
              <p className="text-xs text-gray-500">White sign with arrow. Stay to the right of the divider ahead.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">No Passing Zone</h3>
              <p className="text-xs text-gray-500">Yellow pennant shape on left side of road. Passing is prohibited.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">No Parking</h3>
              <p className="text-xs text-gray-500">Red circle with P and slash. Parking is not allowed in this area.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Disabled Parking</h3>
              <p className="text-xs text-gray-500">Blue square with wheelchair symbol. Reserved for disabled permit holders only.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">HOV Lane</h3>
              <p className="text-xs text-gray-500">White diamond on road surface. Lane reserved for high-occupancy vehicles.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Pedestrian Crossing</h3>
              <p className="text-xs text-gray-500">White rectangle with walking figure. Pedestrians have the right of way here.</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-500" /> How to Study Road Signs</h2>
            <ul className="space-y-2">
              <li className="text-sm text-blue-800 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Learn signs by shape first — shape alone tells you the category</li>
              <li className="text-sm text-blue-800 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Then learn by color — red means stop or prohibition, yellow means warning</li>
              <li className="text-sm text-blue-800 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Practice identifying signs without reading the text — the DMV may show just the image</li>
              <li className="text-sm text-blue-800 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Take the road sign practice test until you score 100%</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/road-signs-practice-test" className="flex-1 py-3 bg-white border-2 border-gray-200 rounded-xl text-center font-semibold text-gray-700 hover:border-blue-400 transition-colors text-sm flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" /> All Road Signs Guide
            </Link>
            <Link href="/practice" className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-center font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-xl bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h2>
            <p className="text-blue-100 mb-5">Take a full road sign practice test with real DMV exam questions.</p>
            <Link href="/state/florida/road-sign-practice-test" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Start Road Signs Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
