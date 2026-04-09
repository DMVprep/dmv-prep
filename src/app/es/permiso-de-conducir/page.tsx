// src/app/es/permiso-de-conducir/page.tsx
// Targets "permiso de conducir" and "examen de permiso de conducir" — both
// "max" interest head terms per the audit. Explainer page clarifying the
// US permit vs. license system for hispanohablantes.
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight, CheckCircle, AlertTriangle, BookOpen, Clock, Users,
  Shield, MapPin, Calendar, FileText, Languages
} from "lucide-react";

export const metadata: Metadata = {
  title: "Permiso de Conducir en Estados Unidos — Guía Completa en Español 2026 | DMVPrep Pro",
  description: "Todo sobre el permiso de conducir en Estados Unidos en español. Diferencia entre permiso de aprendiz y licencia de conducir, requisitos por estado, examen de permiso de conducir gratis, cómo aplicar sin Social Security. Guía 2026.",
  keywords: [
    "permiso de conducir",
    "permiso de conducir en Estados Unidos",
    "examen de permiso de conducir",
    "examen de permiso de conducir gratis",
    "permiso de aprendiz",
    "licencia de aprendiz",
    "cómo sacar el permiso de conducir",
    "permiso de conducir requisitos",
    "permiso de conducir sin SSN",
    "permiso vs licencia de conducir",
    "learner's permit español",
  ],
  alternates: {
    canonical: "https://dmv-prep.com/es/permiso-de-conducir",
    languages: {
      "es-US": "https://dmv-prep.com/es/permiso-de-conducir",
    },
  },
  openGraph: {
    title: "Permiso de Conducir en Estados Unidos — Guía Completa en Español 2026",
    description: "Diferencia entre permiso y licencia, requisitos, examen gratis y cómo aplicar sin Social Security. Todo en español.",
    url: "https://dmv-prep.com/es/permiso-de-conducir",
    type: "article",
    locale: "es_US",
  },
};

interface PermitType {
  tipo: string;
  para: string;
  descripcion: string;
  restricciones: string[];
  borderClass: string;
  bgClass: string;
  numberBgClass: string;
}

const PERMIT_TYPES: PermitType[] = [
  {
    tipo: "Permiso de Aprendiz (Learner's Permit)",
    para: "Adolescentes y adultos principiantes — el PRIMER paso",
    descripcion: "Es el primer documento que obtienes en el proceso de sacar tu licencia. Te permite practicar a manejar, pero solo con un adulto con licencia en el asiento del pasajero. Para obtenerlo, apruebas el examen escrito del DMV (el que nosotros te ayudamos a preparar). La edad mínima varía por estado: 14 años en Dakota del Sur, 15 en la mayoría de estados, 16 en California, Nueva Jersey y algunos otros.",
    restricciones: [
      "Debes manejar siempre con un adulto con licencia (21+ años en la mayoría de estados)",
      "No puedes manejar solo bajo ninguna circunstancia",
      "Algunos estados prohíben manejar entre 10 PM y 5 AM con permiso de aprendiz",
      "Debes mantener el permiso por 6 meses a 1 año antes de poder aplicar para la licencia provisional",
    ],
    borderClass: "border-blue-200",
    bgClass: "bg-blue-50",
    numberBgClass: "bg-blue-600",
  },
  {
    tipo: "Licencia Provisional / Intermedia (Provisional License)",
    para: "Adolescentes (16-17 años) que ya tuvieron el permiso de aprendiz",
    descripcion: "Es el segundo paso en el sistema de Licencia Gradual (GDL). Después de tener el permiso de aprendiz por un tiempo mínimo (6-12 meses dependiendo del estado) y de tomar el examen de manejo (behind-the-wheel), obtienes una licencia provisional con restricciones. Puedes manejar solo, pero con reglas más estrictas que un adulto.",
    restricciones: [
      "No puedes llevar pasajeros menores de 20 años durante los primeros 6-12 meses (excepto familiares directos)",
      "No puedes manejar entre las 11 PM y las 5 AM en la mayoría de estados",
      "Si te detiene la policía por una infracción, las consecuencias son más graves que para un conductor adulto",
      "Debes mantenerla por 1-2 años antes de poder convertirla en licencia completa",
    ],
    borderClass: "border-purple-200",
    bgClass: "bg-purple-50",
    numberBgClass: "bg-purple-600",
  },
  {
    tipo: "Licencia de Conducir Completa (Full Driver's License)",
    para: "Adultos (18+) y adolescentes que completaron el sistema GDL",
    descripcion: "Es la licencia sin restricciones especiales. Puedes manejar cualquier hora, llevar cualquier pasajero, sin supervisión. En la mayoría de estados, los adultos de 18+ años pueden ir directamente del permiso de aprendiz a la licencia completa sin pasar por la provisional, si demuestran experiencia manejando y aprueban los exámenes.",
    restricciones: [
      "Debes renovarla cada 4-8 años dependiendo del estado",
      "Si cometes infracciones graves (DUI, exceso grave de velocidad), el DMV puede suspenderla",
      "Algunas categorías requieren licencia especial: motocicleta, vehículo comercial (CDL), motorhome",
      "Si te mudas a otro estado, debes transferirla en un plazo de 30-90 días",
    ],
    borderClass: "border-green-200",
    bgClass: "bg-green-50",
    numberBgClass: "bg-green-600",
  },
];

interface StateRequirement {
  estado: string;
  edadMinima: string;
  tarifa: string;
  notas: string;
  slug: string;
}

const STATE_REQUIREMENTS: StateRequirement[] = [
  { estado: "California", edadMinima: "15 años 6 meses", tarifa: "$39", notas: "Requiere curso de educación vial para menores de 17½ años. Examen escrito de 46 preguntas, necesitas 38 correctas (83%).", slug: "california" },
  { estado: "Texas", edadMinima: "15 años", tarifa: "$16", notas: "Agencia: Texas DPS. Menores de 18 deben completar curso de educación vial. Examen escrito de 30 preguntas, necesitas 21 correctas (70%).", slug: "texas" },
  { estado: "Nueva York", edadMinima: "16 años", tarifa: "$65-$107.50 (incluye licencia futura)", notas: "Examen escrito disponible en 20 idiomas. Menores de 18 deben completar curso de 5 horas antes de la licencia. 20 preguntas, 70% para aprobar.", slug: "new-york" },
  { estado: "Florida", edadMinima: "15 años", tarifa: "$48", notas: "AVISO: Desde febrero 2026, examen solo en inglés. Requiere curso TLSAE (Traffic Law and Substance Abuse Education) de 4 horas. 50 preguntas, 80% para aprobar.", slug: "florida" },
  { estado: "Illinois", edadMinima: "15 años (con educación vial aprobada)", tarifa: "$20", notas: "Agencia: Secretaría de Estado (SOS). Programa TVDL disponible para residentes sin SSN en 9 facilidades específicas. 35 preguntas, 80% para aprobar.", slug: "illinois" },
  { estado: "Nueva Jersey", edadMinima: "16 años", tarifa: "$10 (más $24 por la licencia futura)", notas: "Agencia: MVC. Examen escrito en 13 idiomas. MVC paga intérprete si tu idioma no está listado (solicitar con 2 semanas de anticipación).", slug: "new-jersey" },
  { estado: "Arizona", edadMinima: "15 años 6 meses", tarifa: "$7", notas: "Agencia: MVD (Motor Vehicle Division). Examen escrito disponible en inglés, español, hindi y vietnamita. Programa Permit Test at Home disponible para menores de 18.", slug: "arizona" },
  { estado: "Colorado", edadMinima: "15 años (con curso de educación vial)", tarifa: "$19.34", notas: "Programa SB251 disponible para residentes sin SSN (más de 252,000 licencias emitidas desde 2013). Teléfono: 303-205-2335 para el programa SB251.", slug: "colorado" },
  { estado: "Nevada", edadMinima: "15 años 6 meses", tarifa: "$25.25", notas: "Examen escrito en 6 idiomas. KnowToDrive permite tomar el examen escrito desde casa con verificación por cámara web en español.", slug: "nevada" },
  { estado: "Tennessee", edadMinima: "15 años", tarifa: "$10.50", notas: "Agencia: TDOSHS. AVISO: Ley pendiente SB 1889 / HB 1708 podría cambiar examen a solo inglés. Prepárate ahora mientras sigue disponible en español.", slug: "tennessee" },
];

const FAQ_ITEMS = [
  {
    pregunta: "¿Cuál es la diferencia entre permiso y licencia de conducir en Estados Unidos?",
    respuesta: "En Estados Unidos, 'permiso' y 'licencia' son dos documentos DIFERENTES (esto es distinto a muchos países latinoamericanos donde las palabras significan lo mismo). El permiso de aprendiz (learner's permit) es el primer documento que obtienes — te permite practicar a manejar solo con un adulto con licencia en el carro. Después de tener el permiso por 6-12 meses y aprobar el examen de manejo, obtienes la licencia de conducir. La licencia es el documento final que te permite manejar solo.",
  },
  {
    pregunta: "¿Qué edad necesito para sacar el permiso de conducir en EE.UU.?",
    respuesta: "Depende del estado. Dakota del Sur es el más joven con 14 años. La mayoría de estados permiten sacar el permiso a los 15 o 15½. California requiere 15 años 6 meses. Nueva Jersey y algunos estados del noreste requieren 16 años. Si eres adulto (18+), puedes aplicar en cualquier momento sin restricciones de edad especiales. La buena noticia: el proceso es el mismo, lo único que cambia son las restricciones de la licencia provisional.",
  },
  {
    pregunta: "¿Puedo sacar el permiso de conducir sin Social Security (SSN)?",
    respuesta: "Sí, en algunos estados. Colorado (programa SB251, desde 2013), Illinois (programa TVDL), Nuevo México, Washington, Oregón, Vermont, Connecticut, Delaware, Hawái, Maryland, Nueva Jersey, Nueva York, Utah y Virginia ofrecen permisos y licencias a residentes sin SSN o sin estatus migratorio. Cada estado tiene sus propias reglas — Colorado acepta tarjeta consular mexicana, Illinois acepta tarjetas consulares de Brasil, Colombia, Ecuador, Guatemala y México. Consulta la página específica de tu estado.",
  },
  {
    pregunta: "¿Qué es el examen de permiso de conducir? ¿Es el mismo que el de la licencia?",
    respuesta: "El examen de permiso de conducir es el examen ESCRITO del DMV — el que tienes que pasar para obtener el permiso de aprendiz. Consiste en 20-50 preguntas de opción múltiple sobre reglas de tránsito, señales, y leyes específicas del estado. No hay prueba de manejo en esta etapa. Después, cuando apliques para la licencia provisional o completa, tomas el examen de manejo (behind-the-wheel), donde un examinador del DMV va contigo en el carro. Nuestro sitio te prepara para el examen escrito — el primer paso.",
  },
  {
    pregunta: "¿Cuántas preguntas tiene el examen de permiso de conducir?",
    respuesta: "Depende del estado. Los números más comunes: California 46 preguntas (83% para aprobar), Texas 30 (70%), Florida 50 (80%), Nueva York 20 (70%), Illinois 35 (80%), Nueva Jersey 50 (80%), Arizona 30 (80%), Colorado 25 (80%), Nevada 25 (80%), Tennessee 30 (80%). Cada estado publica sus propias preguntas, aunque los temas son similares: reglas de tránsito, señales de carretera, alcohol y drogas, derecho de paso, y reglas específicas del estado.",
  },
  {
    pregunta: "¿El examen está disponible en español?",
    respuesta: "En la mayoría de estados sí. California, Texas, Nueva York (en 20 idiomas), Illinois, Nueva Jersey (en 13 idiomas), Arizona, Colorado, Nevada y Tennessee ofrecen el examen escrito en español. PERO: desde el 6 de febrero de 2026, Florida solo ofrece el examen en inglés. Alaska, Oklahoma, Wyoming y Dakota del Sur también son solo en inglés. Tennessee está considerando una ley similar a la de Florida. Si tu estado ofrece el examen en español, tómalo en español — pero también prepárate con el vocabulario en inglés porque las señales en las calles son en inglés.",
  },
  {
    pregunta: "¿Qué pasa si fallo el examen de permiso de conducir?",
    respuesta: "Puedes volver a tomarlo. En la mayoría de estados hay un período de espera entre 1 y 7 días entre intentos, y tienes que pagar la tarifa otra vez cada vez. Algunos estados (como California) te permiten 3 intentos antes de hacerte esperar más tiempo. La buena noticia: no hay un límite total — puedes intentarlo las veces que sea necesario. Usa cada fallo como información sobre qué temas estudiar más, y vuelve a practicar con nosotros hasta que saques 90% o más consistentemente antes de volver al DMV.",
  },
  {
    pregunta: "¿Cuánto cuesta sacar el permiso de conducir?",
    respuesta: "Varía mucho por estado. Arizona es el más barato con solo $7. Nueva York cobra $65-107.50 (pero eso incluye el costo futuro de la licencia). La mayoría de estados cobran entre $15 y $50. Algunos estados tienen tarifas adicionales: curso de educación vial ($30-$100 en California, Florida, Illinois), tarifas por tomar el examen de manejo (behind-the-wheel), y tarifas por la licencia final cuando conviertes el permiso. Consulta la página específica de tu estado para el costo exacto.",
  },
];

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Permiso de Conducir en Estados Unidos — Guía Completa en Español 2026",
  description: "Todo sobre el permiso de conducir en Estados Unidos: diferencia entre permiso y licencia, requisitos por estado, examen gratis, y cómo aplicar sin SSN.",
  inLanguage: "es-US",
  author: {
    "@type": "Organization",
    name: "DMVPrep Pro",
  },
  publisher: {
    "@type": "Organization",
    name: "DMVPrep Pro",
    url: "https://dmv-prep.com",
  },
};

const faqSchemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.pregunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.respuesta,
    },
  })),
};

export default function PermisoConducirPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/es" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Permiso de conducir</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <FileText className="w-4 h-4" />
            <span>Guía completa 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Permiso de Conducir en Estados Unidos
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Todo lo que necesitas saber sobre el permiso de conducir en EE.UU. en español: qué es, en qué se diferencia de la licencia, cómo sacarlo, cuánto cuesta, y cómo aplicar si no tienes Social Security. Guía escrita por hispanohablantes para hispanohablantes.
          </p>

          {/* Primary CTA */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">¿Listo para empezar el proceso?</h2>
            <p className="text-gray-700 mb-4 text-sm">
              El primer paso para sacar tu permiso de conducir es aprobar el examen escrito del DMV. Prepárate con nuestro examen de práctica gratis en español — <strong>100% gratis, sin registro, sin tarjeta de crédito</strong>.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Empezar examen de práctica gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* The critical distinction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Permiso vs. Licencia: la diferencia clave que no existe en muchos países</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-900 mb-2">Punto importante para hispanohablantes</p>
                <p className="text-sm text-yellow-900 leading-relaxed">
                  En la mayoría de países latinoamericanos, "permiso de conducir" y "licencia de conducir" significan lo mismo — el documento final que te deja manejar. En Estados Unidos, <strong>son dos documentos completamente diferentes</strong>. El permiso viene primero, y es solo para practicar. La licencia viene después, y es la que usas para manejar solo.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Este sistema se llama Licencia Gradual (Graduated Driver Licensing, o GDL) y existe en los 50 estados de EE.UU. La idea es que los nuevos conductores — especialmente los adolescentes — aprendan por etapas, en lugar de saltar directamente de no manejar a manejar solos. Los adultos mayores de 18 años pueden pasar más rápido por el sistema, pero aún así tienen que empezar con el permiso de aprendiz antes de obtener la licencia.
          </p>
        </section>

        {/* Three types of permits/licenses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Los 3 tipos de permisos y licencias en EE.UU.</h2>
          <div className="space-y-5">
            {PERMIT_TYPES.map((pt, i) => (
              <article key={i} className={`border-2 ${pt.borderClass} ${pt.bgClass} rounded-2xl p-6`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${pt.numberBgClass} text-white flex items-center justify-center font-extrabold flex-shrink-0`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pt.tipo}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{pt.para}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{pt.descripcion}</p>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Restricciones principales:</p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {pt.restricciones.map((r, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* How to get it — 5 steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cómo sacar tu permiso de conducir — 5 pasos</h2>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Verifica que cumples los requisitos de edad y residencia</h3>
                <p className="text-sm text-gray-700">Cada estado tiene su propia edad mínima y requisitos de residencia. En la tabla de abajo tienes la edad mínima y el costo para los 10 estados con más hispanohablantes.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Estudia y practica el examen escrito</h3>
                <p className="text-sm text-gray-700">El examen del DMV tiene entre 20 y 50 preguntas dependiendo del estado. La mayoría de los hispanohablantes que fallan no lo hacen por falta de idioma — lo hacen por falta de preparación. Usa nuestro <Link href="/practice" className="text-blue-600 hover:underline font-semibold">examen de práctica gratis</Link> hasta sacar 90% o más consistentemente.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Reúne los documentos necesarios</h3>
                <p className="text-sm text-gray-700">Identificación (pasaporte, tarjeta consular, acta de nacimiento), prueba de residencia en el estado (2 documentos como factura de luz o estado de cuenta bancario), y prueba de presencia legal en EE.UU. (visa, green card, o documentos alternativos en estados como Colorado e Illinois). El menor de edad necesita firma del padre/tutor.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Haz cita en el DMV</h3>
                <p className="text-sm text-gray-700">La mayoría de los estados requieren cita previa. Las citas pueden tardar de 2 a 6 semanas en ciudades grandes. Usa nuestra <Link href="/es/citas-dmv" className="text-blue-600 hover:underline font-semibold">guía de citas DMV en español</Link> para encontrar el sitio oficial y teléfono de tu estado.</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">5</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Toma el examen escrito y recibe tu permiso</h3>
                <p className="text-sm text-gray-700">El día de tu cita, presenta tus documentos, paga la tarifa, y toma el examen escrito. Si apruebas, te entregan el permiso de aprendiz el mismo día (o te lo envían por correo en algunos estados). Desde ese momento puedes empezar a practicar manejar — siempre con un adulto con licencia al lado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* State-by-state requirements table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos del permiso por estado</h2>
          <p className="text-gray-700 mb-6">
            Los requisitos exactos varían por estado. Estos son los 10 estados con más población hispanohablante. Haz clic en el nombre del estado para ver la guía completa en español.
          </p>

          <div className="space-y-3">
            {STATE_REQUIREMENTS.map((st) => (
              <article key={st.slug} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {st.estado}
                    </h3>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Edad mínima:</span>{" "}
                      <span className="font-semibold text-gray-900">{st.edadMinima}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tarifa:</span>{" "}
                      <span className="font-semibold text-gray-900">{st.tarifa}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">{st.notas}</p>
                <Link
                  href={`/es/${st.slug}/examen-de-manejo`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Ver guía completa en {st.estado} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Without SSN section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Puedo sacar el permiso sin Social Security (SSN)?</h2>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Sí, en varios estados.</strong> Estados Unidos tiene dos categorías de licencias para residentes sin SSN o sin estatus migratorio: los estados que emiten "licencias estándar" (como cualquier otra) y los estados que emiten "licencias no Real ID" con una marca especial que indica que no son válidas para identificación federal (volar, entrar a edificios federales).
            </p>
            <p className="text-gray-800 leading-relaxed mb-4">
              Los estados con programas más establecidos son:
            </p>
            <ul className="space-y-2 text-gray-800 mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span><strong>Colorado</strong> — Programa SB251 / CO-RCSA desde 2013. Más de 252,000 licencias emitidas. <Link href="/es/colorado/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Ver guía Colorado</Link></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span><strong>Illinois</strong> — Programa TVDL (Temporary Visitor Driver's License). 9 facilidades específicas emiten estas licencias. <Link href="/es/illinois/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Ver guía Illinois</Link></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span><strong>Nuevo México, Washington, Oregón, Vermont, Connecticut, Delaware, Hawái, Maryland, Nueva Jersey, Nueva York, Utah, Virginia</strong> — cada uno con sus propias reglas específicas</span>
              </li>
            </ul>
            <p className="text-sm text-gray-700">
              Si estás en uno de estos estados, pregunta específicamente por el programa alternativo cuando hagas tu cita. En Colorado, llama al <strong>303-205-2335</strong> para el programa SB251.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre el permiso de conducir</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="cursor-pointer p-5 font-bold text-gray-900 hover:bg-gray-100 transition-colors list-none flex items-center justify-between">
                  <span>{item.pregunta}</span>
                  <span className="text-blue-600 text-xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm">{item.respuesta}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Empieza tu proceso del permiso de conducir hoy</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro examen de práctica es 100% gratis en español. 400+ preguntas reales por estado. Miles de hispanohablantes ya pasaron su examen de permiso con nosotros.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/practice"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-6 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-xl"
              >
                Empezar examen de práctica <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/es/citas-dmv"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-4 rounded-xl hover:bg-white/20 transition-colors"
              >
                Hacer cita del DMV en español
              </Link>
            </div>
            <div className="mt-4 text-sm text-blue-100">
              100% gratis · Sin registro · Los 50 estados
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
