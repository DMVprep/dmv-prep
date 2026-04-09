// src/app/es/[state]/examen-de-manejo/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { SPANISH_STATES, getSpanishStateBySlug } from "@/data/spanish-states";
import { ArrowRight, CheckCircle, AlertTriangle, BookOpen, Globe } from "lucide-react";

interface Props { params: { state: string } }

const YEAR = new Date().getFullYear();

export async function generateStaticParams() {
  return SPANISH_STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const esState = getSpanishStateBySlug(params.state);
  const state = getStateBySlug(params.state);
  if (!esState || !state) return {};

  const title =
    esState.status === "english_only"
      ? `Examen de Manejo de ${esState.nameEs} ${YEAR} — Ahora Solo en Inglés | Aprende en Español`
      : `Examen de Manejo de ${esState.nameEs} ${YEAR} en Español — Gratis y Sin Registro`;

  const description =
    esState.status === "english_only"
      ? `Desde el 6 de febrero de 2026, el examen de manejo de ${esState.nameEs} solo se ofrece en inglés. Te enseñamos el material en español y te preparamos para aprobar el examen en inglés. Gratis, sin registro.`
      : `Prepárate gratis para el examen de manejo de ${esState.nameEs} con la mejor explicación en español. ${state.questionsCount} preguntas, necesitas ${state.passingScore}% para aprobar.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://dmv-prep.com/es/${params.state}/examen-de-manejo`,
      languages: {
        "en-US": `https://dmv-prep.com/state/${params.state}/dmv-practice-test`,
        "es-US": `https://dmv-prep.com/es/${params.state}/examen-de-manejo`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://dmv-prep.com/es/${params.state}/examen-de-manejo`,
      type: "article",
      locale: "es_US",
    },
  };
}

export default function SpanishStatePage({ params }: Props) {
  const esState = getSpanishStateBySlug(params.state);
  const state = getStateBySlug(params.state);
  if (!esState || !state) notFound();

  const correctNeeded = Math.ceil((state.questionsCount * state.passingScore) / 100);

  // FAQ schema — renders on all pages, content varies by state status
  const faqItems =
    esState.status === "english_only"
      ? [
          {
            q: `¿El examen de manejo de ${esState.nameEs} realmente es solo en inglés?`,
            a: `Sí. Desde el 6 de febrero de 2026, el Departamento de Seguridad Vial y Vehículos Motorizados de ${esState.nameEs} (FLHSMV) eliminó todas las opciones en otros idiomas. Ya no se ofrece en español, criollo haitiano, portugués ni ningún otro idioma. Todos los exámenes escritos y orales se administran únicamente en inglés.`,
          },
          {
            q: "¿Puedo llevar un traductor o un diccionario al examen?",
            a: "No. El estado prohibió explícitamente el uso de traductores, intérpretes y cualquier material de traducción durante el examen. Debes entender las preguntas en inglés por tu cuenta.",
          },
          {
            q: "¿Qué pasa si no hablo bien inglés? ¿Puedo prepararme?",
            a: "Sí, y por eso existe DMVPrep Pro. Nosotros te explicamos todas las reglas en español claro y sencillo, pero te entrenamos con las preguntas escritas en inglés. Así, cuando llegues al examen, reconocerás las palabras, las preguntas y las respuestas — porque ya las habrás visto durante la preparación.",
          },
          {
            q: `¿Cuántas preguntas tiene el examen de ${esState.nameEs}?`,
            a: `El examen de manejo de ${esState.nameEs} tiene ${state.questionsCount} preguntas. Debes contestar correctamente al menos ${correctNeeded} (${state.passingScore}%) para aprobar.`,
          },
          {
            q: "¿Cuánto cuesta usar DMVPrep Pro?",
            a: "Es gratis para empezar. Puedes hacer exámenes de práctica, leer las lecciones y usar la explicación bilingüe sin pagar nada ni registrarte. Tenemos un plan premium opcional si quieres acceso completo a todas las preguntas y funciones avanzadas.",
          },
          {
            q: "¿Por qué esta página está en español si el examen es en inglés?",
            a: "Porque aprender es más rápido y efectivo en tu idioma nativo. Te explicamos las reglas, el vocabulario y las trampas en español — pero te mostramos las preguntas en el mismo formato exacto del examen real, para que el día del examen no te encuentres con sorpresas.",
          },
          {
            q: "¿Qué documentos necesito llevar al DMV?",
            a: `Para obtener tu licencia de conducir en ${esState.nameEs}, generalmente necesitas: prueba de identidad (pasaporte o acta de nacimiento), prueba de número de Seguro Social, dos pruebas de residencia (facturas de servicios, estados de cuenta bancarios), y la solicitud completada. Verifica los requisitos exactos en el sitio oficial del DMV de ${esState.nameEs}.`,
          },
          {
            q: "¿Qué pasa si fallo el examen?",
            a: `Puedes volver a tomarlo. En la mayoría de los estados, hay un período de espera de entre 1 y 7 días entre intentos. Usa ese tiempo para practicar con nosotros — la mayoría de los hispanohablantes que fallan, fallan porque no reconocieron el vocabulario en inglés, no porque no supieran las reglas. Nosotros atacamos exactamente ese problema.`,
          },
        ]
      : [
          {
            q: `¿El examen de manejo de ${esState.nameEs} se ofrece en español?`,
            a: `Sí. Actualmente ${esState.nameEs} todavía ofrece el examen escrito de manejo en español. Aun así, muchos hispanohablantes encuentran que entender las reglas primero en español — y luego practicar con preguntas en ambos idiomas — es la mejor forma de aprobar a la primera.`,
          },
          {
            q: `¿Podría cambiar y volverse solo en inglés como Florida?`,
            a: `Es posible. Florida cambió su política el 6 de febrero de 2026, eliminando todas las opciones en otros idiomas. Tennessee está considerando una ley similar. La tendencia política es hacia exámenes solo en inglés. Prepararte con nosotros te protege de este cambio — aprendes en español pero reconoces todo en inglés.`,
          },
          {
            q: `¿Cuántas preguntas tiene el examen de ${esState.nameEs}?`,
            a: `El examen de manejo de ${esState.nameEs} tiene ${state.questionsCount} preguntas. Debes contestar correctamente al menos ${correctNeeded} (${state.passingScore}%) para aprobar.`,
          },
          {
            q: "¿Cuánto cuesta usar DMVPrep Pro?",
            a: "Es gratis para empezar. Puedes hacer exámenes de práctica, leer las lecciones y usar la explicación bilingüe sin pagar nada ni registrarte.",
          },
          {
            q: "¿Qué documentos necesito llevar al DMV?",
            a: "Generalmente necesitas: prueba de identidad (pasaporte o acta de nacimiento), número de Seguro Social, dos pruebas de residencia, y la solicitud completada. Verifica los requisitos exactos en el sitio oficial del DMV de tu estado.",
          },
          {
            q: "¿Qué pasa si fallo el examen?",
            a: "Puedes volver a tomarlo después de un período de espera (generalmente 1 a 7 días). Usa ese tiempo para practicar con nosotros.",
          },
        ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://dmv-prep.com" },
      { "@type": "ListItem", position: 2, name: "Español", item: "https://dmv-prep.com/es" },
      {
        "@type": "ListItem",
        position: 3,
        name: `Examen de Manejo de ${esState.nameEs}`,
        item: `https://dmv-prep.com/es/${params.state}/examen-de-manejo`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">Examen de Manejo de {esState.nameEs}</span>
          </nav>

          {/* Urgent alert for english-only states */}
          {esState.status === "english_only" && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900 mb-1">Aviso importante: cambio de ley en {esState.nameEs}</p>
                <p className="text-sm text-red-800 leading-relaxed">
                  Desde el <strong>6 de febrero de 2026</strong>, el examen de manejo de {esState.nameEs} solo se ofrece en inglés. Si tu idioma principal es el español, esta página te va a ayudar.
                </p>
              </div>
            </div>
          )}

          {/* Pending legislation alert for at-risk states */}
          {esState.status === "pending_legislation" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-900 mb-1">Aviso: legislación pendiente en {esState.nameEs}</p>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  {esState.nameEs} está considerando una ley para ofrecer el examen solo en inglés, como ya hizo Florida. Si te preparas ahora con nuestro método bilingüe, estarás listo pase lo que pase.
                </p>
              </div>
            </div>
          )}

          {/* H1 + hero */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {esState.status === "english_only"
              ? `Examen de Manejo de ${esState.nameEs} ${YEAR}`
              : `Examen de Manejo de ${esState.nameEs} ${YEAR} en Español`}
          </h1>
          {esState.status === "english_only" && (
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Ahora solo en inglés. <strong className="text-gray-900">Nosotros te enseñamos a pasarlo, explicado en español.</strong>
            </p>
          )}
          {esState.status !== "english_only" && (
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Gratis, sin registro. Explicaciones claras en español escritas por nativos — no traducciones.
            </p>
          )}

          {/* Quick facts box — featured snippet bait */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 mb-8">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Datos rápidos del examen</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900"><strong>{state.questionsCount} preguntas</strong> en el examen escrito</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900"><strong>{correctNeeded} respuestas correctas</strong> ({state.passingScore}%) para aprobar</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">
                  {esState.status === "english_only" ? (
                    <><strong>Solo en inglés</strong> desde el 6 de febrero de 2026</>
                  ) : (
                    <>Disponible en <strong>inglés y español</strong> (por ahora)</>
                  )}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-900">Sin traductor ni diccionario durante el examen</span>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="bg-blue-600 rounded-xl p-6 text-white mb-10">
            <h2 className="font-bold text-xl mb-2">Empieza tu examen de práctica gratis</h2>
            <p className="text-blue-100 text-sm mb-4">Preguntas reales en el mismo formato del examen oficial. Sin registro, sin tarjeta de crédito.</p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Empezar examen de práctica <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Section: What changed (english_only only) */}
          {esState.status === "english_only" && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué cambió el 6 de febrero de 2026?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Antes del 6 de febrero de 2026, el Departamento de Seguridad Vial y Vehículos Motorizados de Florida (FLHSMV) ofrecía el examen de manejo en varios idiomas, incluyendo español, criollo haitiano y portugués. Miles de hispanohablantes aprobaban el examen cada año estudiando y respondiendo en su idioma nativo.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Eso cambió. El estado emitió una directiva eliminando todas las opciones que no fueran inglés. Tampoco se permiten traductores, intérpretes ni diccionarios durante el examen. Todos los exámenes escritos y orales — para cualquier tipo de licencia — ahora son solo en inglés.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                El cambio afectó inmediatamente a las personas que ya tenían cita para tomar el examen. Solo en el condado de Hillsborough, aproximadamente el <strong>37% de los exámenes de manejo en 2025</strong> se tomaron en un idioma distinto al inglés — eso son más de 13.000 personas en un solo condado. Florida tiene alrededor de <strong>4 millones de residentes</strong> que hablan español en casa. El impacto es enorme.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Si eres una de esas personas, no estás solo. Y tampoco estás sin opciones. Nosotros construimos esta página específicamente para ti.
              </p>
            </section>
          )}

          {/* Section: Why DMVPrep Pro works */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Por qué DMVPrep Pro funciona si el examen es en inglés?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Porque no traducimos. <strong>Enseñamos.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hay muchos sitios que ofrecen exámenes de práctica "en español". El problema es que la mayoría son traducciones automáticas de materiales en inglés, con frases raras y vocabulario incorrecto. Si estudias con ellos, aprendes mal en español — y luego no entiendes nada en inglés el día del examen.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nuestro método es diferente: <strong>las explicaciones están escritas en español nativo</strong>, como si te las explicara un amigo que habla bien español y conoce las reglas de manejo de Estados Unidos. Pero <strong>las preguntas de práctica están en el mismo inglés exacto del examen oficial</strong>. Así, mientras estudias, tu cerebro conecta el concepto en español con las palabras en inglés que vas a ver el día del examen.
            </p>
            <p className="text-gray-700 leading-relaxed">
              El resultado: entiendes las reglas profundamente (porque las aprendiste en tu idioma) y reconoces las preguntas rápidamente (porque ya las has visto escritas en inglés muchas veces). Esa es la diferencia entre estudiar y prepararte de verdad.
            </p>
          </section>

          {/* Section: Vocabulary bridge — the unique moat */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vocabulario en inglés que debes conocer para el examen</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Estas son las palabras en inglés que aparecen con más frecuencia en el examen de manejo y que causan más confusión a los hispanohablantes. Apréndelas bien — y aprenderás a reconocerlas en cualquier pregunta.
            </p>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Yield</strong> <span className="text-gray-500">/yiild/</span> — Ceder el paso. No significa parar, significa bajar la velocidad y dejar pasar a otros vehículos o peatones.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Right of way</strong> — Derecho de paso. Quién tiene prioridad en una intersección.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Shoulder</strong> — El hombro de la carretera. La parte al lado del carril, donde puedes parar en una emergencia.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Merging</strong> — Incorporarse a otra vía, generalmente a una autopista desde una rampa de entrada.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Pull over</strong> — Orillarse, apartarse al lado del camino. Lo que debes hacer cuando una ambulancia o patrulla viene con sirenas.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Blind spot</strong> — Punto ciego. La zona al lado de tu vehículo que no puedes ver en los espejos.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Tailgating</strong> — Seguir muy de cerca al vehículo de adelante. Es ilegal y peligroso.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Crosswalk</strong> — Cruce peatonal. La zona marcada donde los peatones cruzan la calle.
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-3 border-b border-gray-100">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Curb</strong> — Bordillo o acera. El borde elevado al lado de la calle.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Roundabout</strong> — Glorieta o rotonda. Una intersección circular donde debes ceder el paso a los vehículos que ya están adentro.
                  </div>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">
              Con acceso premium, tienes un glosario completo de más de 200 términos con pronunciación y ejemplos.
            </p>
          </section>

          {/* Section: Common mistakes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Errores comunes de hispanohablantes en el examen</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">1. Confundir "yield" con "stop"</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "Yield" significa ceder el paso, no parar. Solo debes detenerte si hay otro vehículo o peatón. Muchos hispanohablantes paran innecesariamente en señales de "yield" y fallan preguntas sobre derecho de paso.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">2. No entender las unidades en pies (feet) y millas (miles)</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Estados Unidos usa pies y millas, no metros ni kilómetros. Muchas preguntas mencionan distancias como "500 feet" o "15 feet from a fire hydrant". Aprende las distancias clave en pies — no intentes convertirlas mentalmente el día del examen.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">3. Traducir palabra por palabra en lugar de entender el concepto</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Frases como "right-of-way" o "failure to yield" no se traducen literalmente. Son conceptos. Aprende qué significa cada concepto en español, luego memoriza la frase completa en inglés.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">4. Asumir que las reglas son iguales a las de tu país de origen</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Las reglas de manejo en México, Colombia, Centroamérica o el Caribe son diferentes a las de Estados Unidos. Por ejemplo, en muchos países se puede girar a la derecha en rojo solo si hay un letrero; aquí generalmente se puede al revés (a menos que diga "No Turn on Red"). No asumas — aprende las reglas de este país.
                </p>
              </div>
            </div>
          </section>

          {/* Section: How we help you — the method */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo estudiamos contigo paso a paso</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Aprende las reglas en español</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Lee nuestras lecciones cortas — 15 minutos, en español claro, sin jerga. Cada lección cubre un tema del examen: señales, derecho de paso, velocidades, alcohol, etc.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Practica con preguntas en inglés</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Cada pregunta de práctica está escrita en el mismo inglés del examen real. Si no entiendes una palabra, la puedes ver traducida al instante. Eso acelera tu aprendizaje.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Revisamos lo que fallas automáticamente</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Las preguntas que contestas mal vuelven a aparecer hasta que las dominas. No tienes que organizar nada — nosotros te recordamos qué necesitas repasar.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Examen de práctica completo antes del día real</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Cuando estés listo, haz un examen completo con las {state.questionsCount} preguntas y el mismo tiempo que el examen real. Si logras {state.passingScore}% o más, estás listo.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ section with schema */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="bg-white rounded-xl border border-gray-200 p-5 group">
                  <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-start justify-between gap-4">
                    <span>{item.q}</span>
                    <span className="text-blue-600 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0">+</span>
                  </summary>
                  <p className="text-gray-700 text-sm leading-relaxed mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <div className="bg-blue-600 rounded-xl p-8 text-white text-center mb-10">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <h2 className="font-bold text-2xl mb-2">¿Listo para empezar?</h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Comienza tu primer examen de práctica ahora. Gratis, sin registro. Toma menos de 5 minutos.
            </p>
            <Link href="/practice" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Empezar examen gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Other Spanish states */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Examen de manejo en otros estados</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {SPANISH_STATES.filter((s) => s.slug !== params.state).map((s) => (
                <Link
                  key={s.slug}
                  href={`/es/${s.slug}/examen-de-manejo`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                >
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <span>{s.nameEs}</span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
