import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Egzamen DMV Florida An Anglè Sèlman 2026 — Sa Ou Bezwen Konnen",
  description: "Florida kounye a egzije ke tout egzamen lisans kondwi yo fèt an anglè sèlman depi 6 fevriye 2026. Aprann kijan pou prepare ou epi pase.",
  alternates: {
    canonical: "https://dmv-prep.com/florida-dmv-test-english-only-haitian-creole",
    languages: {
      "en": "https://dmv-prep.com/florida-dmv-test-english-only",
      "es": "https://dmv-prep.com/florida-dmv-test-english-only-spanish",
      "ht": "https://dmv-prep.com/florida-dmv-test-english-only-haitian-creole",
      "pt": "https://dmv-prep.com/florida-dmv-test-english-only-portuguese",
    },
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <AlertCircle className="w-4 h-4" />
              Efektif depi 6 fevriye 2026
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Egzamen DMV Florida Kounye a An Anglè Sèlman</h1>
            <p className="text-gray-600 text-lg mb-6">Florida kounye a egzije ke tout egzamen lisans kondwi fèt an anglè. Pa gen entèprèt, pa gen tradiksyon. Men sa ki chanje epi kijan pou prepare ou.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                Kòmanse Egzamen Pratik Gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/florida-dmv-test-english-only" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                English version
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Changed</h2>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Dat efektif</span><span className="font-semibold text-gray-900 text-right ml-4">6 fevriye 2026</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Ki moun ki anonse li</span><span className="font-semibold text-gray-900 text-right ml-4">FLHSMV Florida</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Sa ki egzije kounye a</span><span className="font-semibold text-gray-900 text-right ml-4">Tout egzamen an anglè sèlman</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Entèprèt pèmèt</span><span className="font-semibold text-gray-900 text-right ml-4">Non — pa pèmèt</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Lang yo retire</span><span className="font-semibold text-gray-900 text-right ml-4">Espanyòl, Kreyòl ayisyen, arab, chinwa, ris, pòtigè</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Aplike pou</span><span className="font-semibold text-gray-900 text-right ml-4">Tout kalifikasyon lisans kondwi</span></div>
              
            </div>
          </section>

          <section>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">1</div><div className="font-semibold text-gray-900 mb-1">Pratike egzamen an gratis</div><div className="text-sm text-gray-600">Pran egzamen pratik DMV Florida gratis ak eksplikasyon an anglè senp.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">2</div><div className="font-semibold text-gray-900 mb-1">Aprann siy wout yo</div><div className="text-sm text-gray-600">Siy wout yo toujou an anglè. Egzamen pratik siy nou an eksplike chak siy klèman.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">3</div><div className="font-semibold text-gray-900 mb-1">Aprann mo kle DMV yo</div><div className="text-sm text-gray-600">Mo tankou "yield", "right of way" ak "merge" parèt nan prèske tout kesyon yo.</div></div>
              
            </div>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Kòmanse Egzamen Pratik Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <div className="space-y-4">
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">Egzamen DMV Florida a kounye a an anglè sèlman?</h3><p className="text-sm text-gray-600">Wi. Depi 6 fevriye 2026, Florida egzije ke tout egzamen lisans kondwi yo an anglè sèlman. Pa gen entèprèt pèmèt.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">Ki lang Florida te ofri egzamen an anvan?</h3><p className="text-sm text-gray-600">Anvan 6 fevriye 2026, Florida te ofri egzamen an espanyòl, kreyòl ayisyen, arab, chinwa, ris ak pòtigè.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">Kijan mwen ka prepare si anglè mwen pa pafè?</h3><p className="text-sm text-gray-600">DMVPrep Pro eksplike tout règ yo an anglè senp ak klè — kreye espesyalman pou moun ki pa pale anglè kòm premye lang.</p></div>
              
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Kòmanse Egzamen Pratik Gratis</h2>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
              Kòmanse Egzamen Pratik Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/state/florida/dmv-practice-test" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida DMV Practice Test</div>
                <div className="text-xs text-gray-500 mt-0.5">50 questions</div>
              </Link>
              <Link href="/state/florida/road-sign-practice-test" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida Road Sign Test</div>
                <div className="text-xs text-gray-500 mt-0.5">Signs are always in English</div>
              </Link>
              <Link href="/state/florida/dmv-cheat-sheet" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">Florida DMV Cheat Sheet</div>
                <div className="text-xs text-gray-500 mt-0.5">Key rules at a glance</div>
              </Link>
              <Link href="/florida-dmv-test-english-only" className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="font-medium text-sm">English-Only Law Details</div>
                <div className="text-xs text-gray-500 mt-0.5">What changed and when</div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
