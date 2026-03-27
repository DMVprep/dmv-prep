import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Road Sign Symbols Explained — DMV Study Guide",
  description: "Learn all common road sign symbols and what they mean. Arrows, figures, vehicles, and more — symbols tested on the DMV written exam.",
  alternates: { canonical: "https://dmv-prep.com/guide/road-sign-symbols" },
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
            <span className="text-gray-700">Road Sign Symbols Explained</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Road Sign Symbols Explained</h1>
          <p className="text-lg text-gray-600 mb-8">Road signs use symbols instead of words so they can be understood quickly and by drivers of all languages. Knowing what each symbol means is essential for the DMV written test.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Arrow pointing right/left</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Direction of turn or curve</p>
            <p className="text-sm opacity-80">Indicates the direction traffic must or may travel. Curved arrows show a curve; straight arrows show permitted directions.</p>
          </div>
          <div className="rounded-xl border p-5 bg-lime-100 border-lime-300 text-lime-900">
            <h3 className="font-bold text-lg mb-1">Walking figure</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Pedestrian crossing</p>
            <p className="text-sm opacity-80">Indicates a pedestrian crossing or school crossing ahead. Watch for people on foot.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-300 text-gray-900">
            <h3 className="font-bold text-lg mb-1">Bicycle symbol</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Bicycle lane or crossing</p>
            <p className="text-sm opacity-80">Marks a bicycle lane or indicates a bicycle crossing ahead. Yield to cyclists.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-300 text-gray-900">
            <h3 className="font-bold text-lg mb-1">Truck symbol</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Truck restrictions or crossing</p>
            <p className="text-sm opacity-80">Indicates truck route, truck crossing ahead, or a weight/height restriction for trucks.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">Deer or animal</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Animal crossing zone</p>
            <p className="text-sm opacity-80">Wildlife frequently crosses in this area. Watch for animals especially at dawn and dusk.</p>
          </div>
          <div className="rounded-xl border p-5 bg-yellow-100 border-yellow-300 text-yellow-900">
            <h3 className="font-bold text-lg mb-1">RR or X symbol</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Railroad crossing</p>
            <p className="text-sm opacity-80">Indicates a railroad crossing. Yield to trains. The crossbuck X is a yield sign.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-300 text-gray-900">
            <h3 className="font-bold text-lg mb-1">P with slash</h3>
            <p className="text-sm font-medium mb-1 opacity-75">No parking</p>
            <p className="text-sm opacity-80">Parking is prohibited in this area. A tow-away zone sign may accompany it.</p>
          </div>
          <div className="rounded-xl border p-5 bg-white border-gray-300 text-gray-900">
            <h3 className="font-bold text-lg mb-1">U-turn arrow with slash</h3>
            <p className="text-sm font-medium mb-1 opacity-75">No U-turn</p>
            <p className="text-sm opacity-80">U-turns are prohibited at this location.</p>
          </div>
          <div className="rounded-xl border p-5 bg-blue-100 border-blue-300 text-blue-900">
            <h3 className="font-bold text-lg mb-1">Wheelchair symbol</h3>
            <p className="text-sm font-medium mb-1 opacity-75">Accessible parking</p>
            <p className="text-sm opacity-80">Parking reserved for vehicles displaying a disabled permit and transporting a person with a disability.</p>
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
