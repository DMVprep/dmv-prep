import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Exame DMV Florida Somente em Inglês 2026 — O Que Você Precisa Saber",
  description: "A Flórida agora exige que todos os exames de carteira de motorista sejam feitos somente em inglês desde 6 de fevereiro de 2026. Saiba como se preparar e passar.",
  alternates: {
    canonical: "https://dmv-prep.com/florida-dmv-test-english-only-portuguese",
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
              Efetivo a partir de 6 de fevereiro de 2026
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">O Exame DMV da Flórida Agora É Somente em Inglês</h1>
            <p className="text-gray-600 text-lg mb-6">A Flórida agora exige que todos os exames de carteira de motorista sejam feitos em inglês. Sem intérpretes, sem traduções. Veja o que mudou e como se preparar.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
                Iniciar Exame de Prática Gratuito <ArrowRight className="w-4 h-4" />
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
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Data de vigência</span><span className="font-semibold text-gray-900 text-right ml-4">6 de fevereiro de 2026</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Quem anunciou</span><span className="font-semibold text-gray-900 text-right ml-4">FLHSMV da Flórida</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">O que é exigido agora</span><span className="font-semibold text-gray-900 text-right ml-4">Todos os exames somente em inglês</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Intérpretes permitidos</span><span className="font-semibold text-gray-900 text-right ml-4">Não — não são permitidos</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-white"><span className="text-gray-600">Idiomas removidos</span><span className="font-semibold text-gray-900 text-right ml-4">Espanhol, crioulo haitiano, árabe, chinês, russo, português</span></div>
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50"><span className="text-gray-600">Aplica-se a</span><span className="font-semibold text-gray-900 text-right ml-4">Todas as classificações de carteira de motorista</span></div>
              
            </div>
          </section>

          <section>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">1</div><div className="font-semibold text-gray-900 mb-1">Pratique o exame de graça</div><div className="text-sm text-gray-600">Faça testes de prática gratuitos do DMV da Flórida com explicações em inglês simples.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">2</div><div className="font-semibold text-gray-900 mb-1">Aprenda as placas de trânsito</div><div className="text-sm text-gray-600">As placas são sempre em inglês. Nosso teste de placas explica cada uma claramente.</div></div>
              <div className="border rounded-xl p-4"><div className="text-2xl font-bold text-blue-600 mb-2">3</div><div className="font-semibold text-gray-900 mb-1">Aprenda palavras-chave do DMV</div><div className="text-sm text-gray-600">Palavras como "yield", "right of way" e "merge" aparecem em quase todas as perguntas.</div></div>
              
            </div>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Iniciar Exame de Prática Gratuito <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <div className="space-y-4">
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">O exame do DMV da Flórida agora é somente em inglês?</h3><p className="text-sm text-gray-600">Sim. A partir de 6 de fevereiro de 2026, a Flórida exige que todos os exames sejam somente em inglês. Intérpretes não são permitidos.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">Em quais idiomas a Flórida oferecia o exame antes?</h3><p className="text-sm text-gray-600">Antes de 6 de fevereiro de 2026, a Flórida oferecia o exame em espanhol, crioulo haitiano, árabe, chinês, russo e português.</p></div>
              <div className="border rounded-lg p-4"><h3 className="font-semibold text-gray-900 mb-2">Como posso me preparar se meu inglês não é perfeito?</h3><p className="text-sm text-gray-600">O DMVPrep Pro explica todas as regras em inglês simples e claro — criado especificamente para pessoas que não falam inglês como primeiro idioma.</p></div>
              
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Iniciar Exame de Prática Gratuito</h2>
            <Link href="/practice?state=FL" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
              Iniciar Exame de Prática Gratuito <ArrowRight className="w-4 h-4" />
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
