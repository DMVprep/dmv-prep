import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Warning Signs Practice Test 2026 — DMV Warning Signs Quiz",
  description: "Study all warning signs for the DMV test. Yellow diamond signs, their meanings, and when to slow down. Free practice quiz with explanations.",
  alternates: { canonical: "https://dmv-prep.com/warning-signs-test" },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Warning Signs Practice Test 2026</h1>
          <p className="text-lg text-gray-600 mb-8">Warning signs are yellow diamond-shaped signs that alert drivers to hazards ahead. They make up a large portion of every DMV road sign test. Master all warning signs here.</p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Signs You Must Know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Curve Ahead</h3>
              <p className="text-xs text-gray-500">Warns of a curved road ahead. Slow down before entering the curve.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Sharp Turn</h3>
              <p className="text-xs text-gray-500">The road ahead makes a sharp turn. Reduce speed significantly.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Winding Road</h3>
              <p className="text-xs text-gray-500">Several curves ahead. Drive slowly and do not pass.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Steep Hill</h3>
              <p className="text-xs text-gray-500">A steep downgrade ahead. Use lower gear to control speed.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Slippery When Wet</h3>
              <p className="text-xs text-gray-500">Road becomes slippery in wet conditions. Slow down and avoid sudden turns.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Pedestrian Crossing</h3>
              <p className="text-xs text-gray-500">Pedestrians may be crossing. Watch for people and be prepared to stop.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">School Zone Ahead</h3>
              <p className="text-xs text-gray-500">A school is nearby. Watch for children and slow down.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Railroad Crossing</h3>
              <p className="text-xs text-gray-500">A railroad crossing is ahead. Slow down and watch for trains.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Deer Crossing</h3>
              <p className="text-xs text-gray-500">Deer frequently cross this area. Watch for animals especially at dawn and dusk.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Two-Way Traffic</h3>
              <p className="text-xs text-gray-500">The road ahead changes from one-way to two-way. Watch for oncoming traffic.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Merging Traffic</h3>
              <p className="text-xs text-gray-500">Another lane of traffic is merging ahead. Adjust speed and position.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Lane Ends</h3>
              <p className="text-xs text-gray-500">A lane is ending ahead. Merge safely into the continuing lane.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Divided Highway Begins</h3>
              <p className="text-xs text-gray-500">The road ahead becomes divided by a median. Keep right.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Narrow Bridge</h3>
              <p className="text-xs text-gray-500">The bridge ahead is narrower than the road. Stay centered in your lane.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Low Clearance</h3>
              <p className="text-xs text-gray-500">A structure ahead has limited height clearance. Check your vehicle height.</p>
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
