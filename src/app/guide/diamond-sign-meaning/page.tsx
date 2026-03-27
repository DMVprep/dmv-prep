import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "What Does a Diamond-Shaped Sign Mean? — DMV Guide",
  description: "Diamond-shaped signs are warning signs. Learn what every diamond sign means and how to respond correctly for the DMV test.",
  alternates: { canonical: "https://dmv-prep.com/guide/diamond-sign-meaning" },
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/road-signs-practice-test" className="hover:text-blue-600">Road Signs</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">What Does a Diamond-Shaped Sign Mean?</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">What Does a Diamond-Shaped Sign Mean?</h1>
          <p className="text-lg text-gray-600 mb-8">Diamond-shaped signs are always warning signs. They alert drivers to hazards, changes in road conditions, or unusual situations ahead. When you see a diamond sign, slow down and be prepared to react.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Yellow Diamond</h3>
            <p className="text-sm font-medium mb-1 opacity-75">General warning sign</p>
            <p className="text-sm opacity-80">The most common type. Warns of curves, hills, intersections, crossings, and road condition changes.</p>
          </div>
          <div className="rounded-xl border p-5 bg-orange-100 border-orange-300 text-orange-900">
            <h3 className="font-bold text-lg mb-1">Orange Diamond</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Construction warning</p>
            <p className="text-sm opacity-80">Indicates hazards in or near construction and work zones. Workers may be present.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Curve Ahead</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Road curves ahead</p>
            <p className="text-sm opacity-80">Reduce speed before entering the curve. Do not brake while in the curve — slow down before.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Railroad Crossing Ahead</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Train crossing ahead</p>
            <p className="text-sm opacity-80">Slow down, look and listen for trains. Be prepared to stop.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Pedestrian Crossing</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Watch for pedestrians</p>
            <p className="text-sm opacity-80">Pedestrians may be crossing. Slow down and be prepared to stop.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Slippery When Wet</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Road may be slippery</p>
            <p className="text-sm opacity-80">Reduce speed in wet conditions. Avoid sudden braking or sharp steering.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Two-Way Traffic</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Oncoming traffic ahead</p>
            <p className="text-sm opacity-80">Road changes from one-way to two-way. Watch for vehicles coming toward you.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Divided Highway Ahead</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Median begins ahead</p>
            <p className="text-sm opacity-80">Road becomes divided. Keep right — oncoming traffic will be on the other side of a barrier.</p>
          </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-500" />Key Facts for the DMV Test</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Learn signs by shape and color before memorizing individual signs</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />The DMV test may show just an image — know what each sign looks like</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Road signs make up 20-30% of most DMV written tests</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Practice until you can identify every sign instantly</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link href="/road-signs-practice-test" className="flex-1 py-3 bg-white border-2 border-gray-200 rounded-xl text-center font-semibold text-gray-700 hover:border-blue-400 transition-colors text-sm flex items-center justify-center gap-2">Road Signs Guide</Link>
            <Link href="/practice" className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-center font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">Start Practice Test <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Link href="/guide/road-sign-colors-meanings" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />Road Sign Colors</Link>
              <Link href="/guide/traffic-sign-shapes" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />Traffic Sign Shapes</Link>
              <Link href="/guide/diamond-sign-meaning" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />Diamond Sign Meaning</Link>
              <Link href="/guide/road-sign-symbols" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50"><ArrowRight className="w-3.5 h-3.5" />Road Sign Symbols</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
