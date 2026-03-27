import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Road Sign Colors and Their Meanings — Complete Guide",
  description: "Learn what every road sign color means. Red, yellow, green, blue, orange, brown — each color has a specific meaning tested on the DMV exam.",
  alternates: { canonical: "https://dmv-prep.com/guide/road-sign-colors-meanings" },
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
            <span className="text-gray-700">Road Sign Colors and Their Meanings</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Road Sign Colors and Their Meanings</h1>
          <p className="text-lg text-gray-600 mb-8">Every road sign color has a specific meaning. Learning color codes is one of the fastest ways to identify signs — you can recognize what a sign means before you can even read the text.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border p-5 bg-red-100 border-red-300 text-red-900">
            <h3 className="font-bold text-lg mb-1">Red</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Stop, prohibition, or danger</p>
            <p className="text-sm opacity-80">Stop signs, yield signs, Do Not Enter, Wrong Way, No U-Turn. Red always means stop or you are not allowed to do something.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Yellow</h3>
            <p className="text-sm font-medium mb-1 opacity-75">General warning</p>
            <p className="text-sm opacity-80">Diamond-shaped warning signs alerting drivers to hazards, curves, crossings, and changes in road conditions ahead.</p>
          </div>
          <div className="rounded-xl border p-5 bg-orange-100 border-orange-300 text-orange-900">
            <h3 className="font-bold text-lg mb-1">Orange</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Construction and work zones</p>
            <p className="text-sm opacity-80">Temporary signs in construction and maintenance areas. Fines are doubled for violations in active work zones.</p>
          </div>
          <div className="rounded-xl border p-5 bg-green-100 border-green-300 text-green-900">
            <h3 className="font-bold text-lg mb-1">Green</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Directions and distances</p>
            <p className="text-sm opacity-80">Highway exit signs, route markers, distance markers. Guide drivers to destinations.</p>
          </div>
          <div className="rounded-xl border p-5 bg-blue-100 border-blue-300 text-blue-900">
            <h3 className="font-bold text-lg mb-1">Blue</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Services and information</p>
            <p className="text-sm opacity-80">Rest areas, hospitals, gas, food, lodging. Also used for disabled parking spaces.</p>
          </div>
          <div className="rounded-xl border p-5 bg-gray-100 border-gray-300 text-gray-900">
            <h3 className="font-bold text-lg mb-1">White/Black</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Regulatory rules</p>
            <p className="text-sm opacity-80">Speed limits, turn restrictions, one-way signs. Control traffic and are legally enforceable.</p>
          </div>
          <div className="rounded-xl border p-5 bg-amber-100 border-amber-300 text-amber-900">
            <h3 className="font-bold text-lg mb-1">Brown</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Recreation and culture</p>
            <p className="text-sm opacity-80">Parks, campgrounds, historical sites, scenic areas.</p>
          </div>
          <div className="rounded-xl border p-5 bg-lime-100 border-lime-300 text-lime-900">
            <h3 className="font-bold text-lg mb-1">Fluorescent Yellow-Green</h3>
            <p className="text-sm font-medium mb-1 opacity-75">School and pedestrian zones</p>
            <p className="text-sm opacity-80">High-visibility signs near schools, crosswalks, and bicycle paths. Pentagon-shaped school crossing signs use this color.</p>
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
