import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Traffic Sign Shapes and What They Mean — DMV Guide",
  description: "Learn all traffic sign shapes and what each shape means. Octagon, triangle, diamond, pentagon, rectangle — each shape has a specific meaning on the DMV test.",
  alternates: { canonical: "https://dmv-prep.com/guide/traffic-sign-shapes" },
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
            <span className="text-gray-700">Traffic Sign Shapes and What They Mean</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Traffic Sign Shapes and What They Mean</h1>
          <p className="text-lg text-gray-600 mb-8">Traffic sign shapes are as important as colors. You can identify the type of sign from its shape alone — even if the text is obscured by snow, dirt, or distance. The DMV test frequently asks about sign shapes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border p-5 bg-red-100 border-red-300 text-red-900">
            <h3 className="font-bold text-lg mb-1">Octagon (8 sides)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">STOP — always</p>
            <p className="text-sm opacity-80">The octagon shape is used exclusively for stop signs. No other sign uses this shape. You must come to a complete stop.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-red-400 text-gray-900">
            <h3 className="font-bold text-lg mb-1">Triangle (inverted)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">YIELD — always</p>
            <p className="text-sm opacity-80">The downward-pointing triangle is used exclusively for yield signs. Slow down and give right-of-way.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Diamond</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Warning</p>
            <p className="text-sm opacity-80">Diamond-shaped signs warn of hazards, road conditions, or changes ahead. Always yellow or orange.</p>
          </div>
          <div className="rounded-xl border p-5 bg-lime-100 border-lime-300 text-lime-900">
            <h3 className="font-bold text-lg mb-1">Pentagon (5 sides)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">School zone</p>
            <p className="text-sm opacity-80">Pentagon-shaped signs indicate school zones and school crossings. Fluorescent yellow-green color.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Pennant (elongated triangle)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">No Passing Zone</p>
            <p className="text-sm opacity-80">Pennant-shaped signs appear on the left side of the road to mark the beginning of a no-passing zone.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-400 text-gray-900">
            <h3 className="font-bold text-lg mb-1">Rectangle (vertical)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Regulatory</p>
            <p className="text-sm opacity-80">Vertical rectangles are used for regulatory signs such as speed limits, turn restrictions, and lane rules.</p>
          </div>
          <div className="rounded-xl border p-5 bg-green-100 border-green-300 text-green-900">
            <h3 className="font-bold text-lg mb-1">Rectangle (horizontal)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Guide and information</p>
            <p className="text-sm opacity-80">Horizontal rectangles provide directions, distances, and information. Most guide signs are this shape.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Round/Circle</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Railroad crossing advance warning</p>
            <p className="text-sm opacity-80">Round signs warn of railroad crossings ahead. Also used for some regulatory signs.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-400 text-gray-900">
            <h3 className="font-bold text-lg mb-1">Crossbuck (X shape)</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Railroad crossing</p>
            <p className="text-sm opacity-80">The crossbuck X sign at railroad crossings is a yield sign. You must yield to trains.</p>
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
