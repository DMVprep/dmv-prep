// src/app/es/vocabulario/page.tsx
// Spanish vocabulary page — 120 DMV terms explained in Spanish with
// English reference badges. Uses the same data file as /vocabulary.
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen, Globe, ArrowRight } from "lucide-react";
import { VocabularioSearch } from "./VocabularioSearch";
import { VOCAB_TERMS, VOCAB_CATEGORIES } from "@/data/vocabulary";

export const metadata: Metadata = {
  title: "Vocabulario DMV en Español — 120 Palabras del Examen de Manejo",
  description: "Las 120 palabras más importantes del examen de manejo del DMV, explicadas en español claro con ejemplos. Cada término también incluye su traducción al inglés para que reconozcas las palabras en el examen.",
  keywords: [
    "vocabulario DMV",
    "vocabulario examen de manejo",
    "palabras DMV español",
    "glosario DMV",
    "términos de manejo español",
    "diccionario de manejo",
    "palabras del examen de conducir",
    "DMV en español vocabulario",
  ],
  alternates: {
    canonical: "https://dmv-prep.com/es/vocabulario",
    languages: {
      "en-US": "https://dmv-prep.com/vocabulary",
      "es-US": "https://dmv-prep.com/es/vocabulario",
    },
  },
  openGraph: {
    title: "Vocabulario DMV en Español — 120 Palabras del Examen de Manejo",
    description: "Las 120 palabras más importantes del examen de manejo en español claro, con traducción al inglés.",
    url: "https://dmv-prep.com/es/vocabulario",
    type: "article",
    locale: "es_US",
  },
};

// Schema.org
const schemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Vocabulario DMV en Español",
  description: "120 términos del examen de manejo del DMV explicados en español con traducción al inglés",
  inLanguage: "es-US",
  hasDefinedTerm: VOCAB_TERMS.slice(0, 10).map((t) => ({
    "@type": "DefinedTerm",
    name: t.wordEs,
    description: t.definitionEs,
    inDefinedTermSet: "https://dmv-prep.com/es/vocabulario",
  })),
};

export default function VocabularioPage() {
  const categoriesForSearch = VOCAB_CATEGORIES
    .filter((c) => c.key !== "all")
    .map((c) => ({ key: c.key, labelEs: c.labelEs }));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vocabulario DMV en Español</h1>
              <p className="text-sm text-gray-500">120 palabras del examen de manejo explicadas en español</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            Cada palabra que necesitas saber para el examen del DMV — definida en español claro y sencillo, con la traducción al inglés para que la reconozcas en el examen y en las señales de tránsito. Especialmente útil si estás aprendiendo a manejar en Estados Unidos por primera vez.
          </p>

          {/* Link to English version */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <Globe className="w-3.5 h-3.5" />
            <Link href="/vocabulary" className="hover:text-blue-600 hover:underline">Ver en inglés</Link>
          </div>
        </div>

        {/* Hero explainer card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
          <h2 className="text-sm font-bold text-blue-900 mb-2">¿Por qué vocabulario bilingüe?</h2>
          <p className="text-sm text-blue-900 leading-relaxed">
            Aunque tomes el examen escrito en español, las <strong>señales de tránsito en las calles de Estados Unidos están en inglés</strong>: STOP, YIELD, ONE WAY, DO NOT ENTER, MERGE. Nuestro vocabulario te enseña cada término en español pero también te muestra la palabra en inglés, para que cuando veas el letrero en la calle o en el examen, lo reconozcas al instante.
          </p>
        </div>

        {/* Search + term list */}
        <VocabularioSearch terms={VOCAB_TERMS} categories={categoriesForSearch} />

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center mt-12 text-white">
          <h2 className="text-xl font-bold mb-2">¿Listo para practicar?</h2>
          <p className="text-sm text-blue-100 mb-5">
            Ahora que conoces el vocabulario, ponte a prueba con preguntas reales del examen del DMV.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/es" className="px-5 py-3 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
              Ir a la página principal en español
            </Link>
            <Link href="/practice" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors">
              Empezar examen de práctica <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
