import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Examen DMV Florida Solo en Inglés 2026 — Lo Que Necesitas Saber",
  description: "Florida ahora requiere que todos los exámenes de licencia de conducir sean en inglés solamente desde el 6 de febrero de 2026. Aprende cómo prepararte y aprobar.",
  alternates: {
    canonical: "https://dmv-prep.com/florida-dmv-test-english-only-spanish",
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
              Efectivo desde el 6 de febrero de 2026
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">El Examen DMV de Florida Ahora Es Solo en Inglés</h1>
            <p className="text-gray-600 text-lg mb-6">Florida ahora exige que todos los exámenes de licencia de conducir se realicen en inglés. Sin intérpretes, sin traducciones. Aquí está lo que cambió y cómo prepararte.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                Comenzar Examen de Práctica Gratis <ArrowRight className="w-4 h-4" />
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
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Fecha efectiva</span><span className="font-semibold text-gray-900 text-right ml-4">6 de febrero de 2026</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Quién lo anunció</span><span className="font-semibold text-gray-900 text-right ml-4">FLHSMV de Florida</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Qué se requiere ahora</span><span className="font-semibold text-gray-900 text-right ml-4">Todos los exámenes solo en inglés</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Intérpretes permitidos</span><span className="font-semibold text-gray-900 text-right ml-4">No — no están permitidos</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Idiomas eliminados</span><span className="font-semibold text-gray-900 text-right ml-4">Español, Creole haitiano, árabe, chino, ruso, portugués</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Aplica a</span><span className="font-semibold text-gray-900 text-right ml-4">Todas las clasificaciones de licencia</span></div>
              
            </div>
          </section>

          <section>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">1</div><div className="font-semibold text-gray-900 mb-1">Practica el examen gratis</div><div className="text-sm text-gray-600">Toma pruebas de práctica gratuitas del DMV de Florida en inglés simple. Sin lenguaje legal confuso.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">2</div><div className="font-semibold text-gray-900 mb-1">Aprende las señales de tráfico</div><div className="text-sm text-gray-600">Las señales siempre están en inglés. Nuestro examen de señales explica cada una claramente.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">3</div><div className="font-semibold text-gray-900 mb-1">Aprende palabras clave del DMV</div><div className="text-sm text-gray-600">Palabras como "yield", "right of way" y "merge" aparecen en casi todas las preguntas.</div></div>
              
            </div>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Comenzar Examen de Práctica Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <div className="space-y-4">
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">¿El examen del DMV de Florida ahora es solo en inglés?</h3><p className="text-sm text-gray-600">Sí. Desde el 6 de febrero de 2026, Florida requiere todos los exámenes en inglés solamente. No se permiten intérpretes.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">¿En qué idiomas se ofrecía antes el examen?</h3><p className="text-sm text-gray-600">Antes del 6 de febrero de 2026, Florida ofrecía el examen en español, creole haitiano, árabe, chino, ruso y portugués.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">¿Cómo puedo prepararme si mi inglés no es perfecto?</h3><p className="text-sm text-gray-600">DMVPrep Pro explica todas las reglas en inglés simple y claro — diseñado para personas que no hablan inglés como primer idioma.</p></div>
              
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Comenzar Examen de Práctica Gratis</h2>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
              Comenzar Examen de Práctica Gratis <ArrowRight className="w-4 h-4" />
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
