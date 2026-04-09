// src/app/es/page.tsx
// Spanish homepage — targets "examen de manejo" (81 search volume, highest in US)
// and speaks directly to hispanohablantes, not translated English content.
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SPANISH_STATES, getSpanishStateBySlug } from "@/data/spanish-states";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import {
  CheckCircle, AlertTriangle, BookOpen, Globe, Users, ArrowRight,
  Shield, Award, Zap, Heart, MessageCircle, MapPin
} from "lucide-react";

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Examen de Manejo Gratis ${YEAR} en Español — Pasa tu Examen del DMV a la Primera | DMVPrep Pro`,
  description: `Examen de manejo gratis en español para todos los 50 estados. Explicaciones claras en español, preguntas reales del DMV. Pasa a la primera — sin importar si tu estado cambia el examen a solo inglés. 100% gratis, sin registro.`,
  keywords: [
    "examen de manejo",
    "examen de manejo gratis",
    "examen de manejo 2026",
    "examen de manejo en español",
    "examen de permiso de conducir",
    "examen de permiso de conducir gratis",
    "DMV en español",
    "examen de licencia de conducir",
    "preguntas del examen de manejo",
    "preparación examen de manejo DMV",
  ],
  alternates: {
    canonical: "https://dmv-prep.com/es",
    languages: {
      "en-US": "https://dmv-prep.com",
      "es-US": "https://dmv-prep.com/es",
    },
  },
  openGraph: {
    title: `Examen de Manejo Gratis ${YEAR} — Pasa tu Examen del DMV en Español`,
    description: `Examen de manejo gratis en español para todos los 50 estados. Explicaciones claras escritas por nativos, no traducciones. Pasa a la primera.`,
    url: "https://dmv-prep.com/es",
    siteName: "DMVPrep Pro",
    type: "website",
    locale: "es_US",
  },
};

// The 10 flagship states with rich Spanish content — prioritized in state picker
const FLAGSHIP_STATE_SLUGS = [
  "california", "texas", "florida", "new-york", "arizona",
  "new-jersey", "illinois", "colorado", "nevada", "tennessee",
];

// Testimonials — Spanish speakers first, in Spanish
const TESTIMONIOS = [
  {
    nombre: "María G.",
    origen: "Originaria de México",
    bandera: "🇲🇽",
    color: "bg-orange-50",
    quote: "Fallé el examen del DMV dos veces antes. Las explicaciones en español finalmente me hicieron entender todo. ¡Pasé a la primera con 92%!",
    estrellas: 5,
  },
  {
    nombre: "Carlos R.",
    origen: "Originario de Colombia",
    bandera: "🇨🇴",
    color: "bg-yellow-50",
    quote: "Estudié 5 días con esta página. Las explicaciones simples me ayudaron a entender todo claramente. ¡Pasé con 89%!",
    estrellas: 5,
  },
  {
    nombre: "Fátima A.",
    origen: "Originaria de Marruecos",
    bandera: "🇲🇦",
    color: "bg-green-50",
    quote: "Estaba muy nerviosa por el examen. Después de dos semanas de práctica aquí, entré confiada y pasé con 95%. ¡Muchas gracias!",
    estrellas: 5,
  },
  {
    nombre: "José L.",
    origen: "Originario de Guatemala",
    bandera: "🇬🇹",
    color: "bg-blue-50",
    quote: "El método bilingüe me salvó. Aprendí las reglas en español pero reconocía todas las palabras en inglés el día del examen. Primera vez — aprobado.",
    estrellas: 5,
  },
  {
    nombre: "Ana S.",
    origen: "Originaria de Perú",
    bandera: "🇵🇪",
    color: "bg-red-50",
    quote: "La sección de vocabulario en inglés fue lo mejor. STOP, YIELD, ONE WAY — todas esas palabras las vi en las calles después de estudiar aquí.",
    estrellas: 5,
  },
  {
    nombre: "Roberto M.",
    origen: "Originario de Cuba",
    bandera: "🇨🇺",
    color: "bg-purple-50",
    quote: "En Cuba nunca aprendí a manejar oficialmente. Aquí en Miami necesitaba licencia y este sitio me preparó en 3 semanas. Pasé a la primera.",
    estrellas: 5,
  },
];

const ERRORES_COMUNES = [
  {
    titulo: "Girar a la derecha en luz roja",
    descripcion: "En la mayoría de países de habla hispana, girar a la derecha en rojo no está permitido o no existe. En Estados Unidos, casi todos los estados lo permiten después de detenerse completamente — pero hay intersecciones específicas donde está prohibido y debes mirar los letreros \"No Turn On Red\".",
  },
  {
    titulo: "Las paradas de 4 vías (4-way stop)",
    descripcion: "El concepto de 4-way stop no existe en muchos países latinoamericanos. La regla de EE.UU. es: el primero en llegar es el primero en pasar. Si dos vehículos llegan al mismo tiempo, el de la derecha tiene el derecho de paso.",
  },
  {
    titulo: "Detenerse detrás del autobús escolar",
    descripcion: "Cuando un autobús escolar (school bus) extiende su brazo de stop con luces rojas intermitentes, debes detenerte completamente — incluso si vas en dirección opuesta en una calle de dos carriles. Las multas pueden ser de $250 a $1,000 y es una falta grave que muchos hispanohablantes no esperan.",
  },
  {
    titulo: "Las líneas amarillas y blancas",
    descripcion: "Líneas amarillas separan tráfico en direcciones opuestas. Líneas blancas separan tráfico en la misma dirección. Líneas dobles amarillas nunca se cruzan (excepto para girar). Muchos hispanohablantes fallan preguntas sobre el significado de las líneas porque en sus países el sistema es diferente.",
  },
  {
    titulo: "El cinturón de seguridad no es opcional",
    descripcion: "En EE.UU., no usar cinturón de seguridad es una infracción primaria en casi todos los estados — un oficial te puede detener solo por eso. Las multas van de $25 a $500 dependiendo del estado. En muchos países latinoamericanos la ley existe pero no se aplica. Aquí sí.",
  },
];

const FAQ_ITEMS = [
  {
    pregunta: "¿Puedo tomar el examen de manejo en español en Estados Unidos?",
    respuesta: "Depende del estado. La mayoría de los estados todavía ofrecen el examen escrito en español — incluyendo California, Texas, Nueva York, Arizona, Nueva Jersey, Illinois, Colorado y Nevada. Sin embargo, Florida eliminó todas las opciones que no fueran inglés el 6 de febrero de 2026. Alaska, Oklahoma, Wyoming y Dakota del Sur también solo ofrecen el examen en inglés. Tennessee está considerando una ley similar a la de Florida. Nuestra página tiene información específica para cada estado.",
  },
  {
    pregunta: "¿Necesito hablar inglés para sacar mi licencia?",
    respuesta: "No necesitas hablar inglés para aprobar el examen escrito en los estados que lo ofrecen en español. Pero SÍ necesitas reconocer señales de tránsito en inglés — STOP, YIELD, ONE WAY, DO NOT ENTER — porque las señales en las calles están en inglés en todo el país. Nuestro método bilingüe te enseña las reglas en español pero te entrena con el vocabulario visual de las señales en inglés.",
  },
  {
    pregunta: "¿Puedo obtener una licencia si no tengo número de Seguro Social?",
    respuesta: "Sí, en algunos estados. Colorado (programa SB251 / CO-RCSA) e Illinois (programa TVDL) ofrecen licencias de conducir a residentes sin número de Seguro Social. Otros estados como Nuevo México y Washington también tienen programas similares. Consulta nuestra página específica de cada estado para ver los requisitos exactos.",
  },
  {
    pregunta: "¿Es realmente gratis el examen de práctica?",
    respuesta: "Sí, el examen de práctica es 100% gratis. No necesitas crear cuenta, no pedimos tarjeta de crédito, y puedes tomar tantos exámenes como quieras. Tenemos más de 400 preguntas por estado en español e inglés. Nuestra versión Premium opcional ($7/mes o $39/año) añade funciones avanzadas, pero el contenido básico es completamente gratis.",
  },
  {
    pregunta: "¿Cuántas preguntas tiene el examen de manejo?",
    respuesta: "Depende del estado. California tiene 46 preguntas (necesitas 83% para aprobar), Florida tiene 50 (80%), Texas tiene 30 (70%), Nueva York tiene 20 (70% con una regla extra para señales), Illinois 35 (80%), y otros estados varían entre 20 y 50 preguntas. Nuestra página de cada estado tiene los detalles exactos.",
  },
  {
    pregunta: "¿Puedo llevar a alguien que me traduzca el examen?",
    respuesta: "Generalmente no durante el examen. La mayoría de los estados no permiten intérpretes o diccionarios durante el examen escrito. Nueva Jersey es una excepción — si tu idioma no está en la lista de 13 idiomas disponibles, el MVC paga un intérprete certificado. En Texas, un traductor solo puede ayudarte antes y después del examen, no durante. Por eso es importante prepararte bien antes de ir al DMV.",
  },
  {
    pregunta: "¿Qué pasa si el examen en mi estado se vuelve solo en inglés como en Florida?",
    respuesta: "Por eso existe DMVPrep Pro. Nosotros te enseñamos las reglas en español claro y sencillo, pero te entrenamos con las preguntas escritas en inglés. Cuando llegues al examen — sin importar si está en español o en inglés — vas a reconocer las palabras, las preguntas y las respuestas porque ya las habrás visto durante la preparación. Nuestro método funciona en cualquier escenario.",
  },
  {
    pregunta: "¿Tienen preguntas específicas para mi estado?",
    respuesta: "Sí. Tenemos más de 400 preguntas específicas por cada uno de los 50 estados. Cada estado tiene sus propias reglas — límites de velocidad, leyes de alcohol, requisitos de cinturón de seguridad — y nuestras preguntas reflejan las reglas reales de cada estado, no un promedio genérico.",
  },
];

// Schema.org structured data
const schemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DMVPrep Pro",
  alternateName: "Examen de Manejo en Español",
  url: "https://dmv-prep.com/es",
  description: "Examen de manejo gratis en español para todos los 50 estados de EE.UU.",
  inLanguage: "es-US",
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

export default function SpanishHomePage() {
  const flagshipStates = FLAGSHIP_STATE_SLUGS
    .map((slug) => {
      const esState = getSpanishStateBySlug(slug);
      const state = getStateBySlug(slug);
      return esState && state ? { esState, state } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

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

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Heart className="w-4 h-4" />
                <span>Hecho para hispanohablantes — por personas que hablan tu idioma</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Examen de Manejo<br />
                <span className="text-blue-600">Gratis en Español {YEAR}</span>
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                <strong>100% gratis.</strong> Aprende las reglas en español claro y sencillo. Prepárate con preguntas reales del DMV. <strong>Pasa a la primera</strong> — aunque tu estado cambie el examen a solo inglés.
              </p>

              {/* Alert: Florida English-only + Tennessee pending */}
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-900 mb-1">Aviso importante: las leyes están cambiando</p>
                  <p className="text-sm text-red-800 leading-relaxed">
                    Desde el <strong>6 de febrero de 2026</strong>, Florida solo ofrece el examen en inglés. Tennessee está considerando una ley similar. Nuestro método te protege: aprende en español, reconoce todo en inglés.
                  </p>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Empezar examen de práctica gratis <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                {["Sin tarjeta de crédito", "Sin registro", "Los 50 estados"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Study plan card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <div className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-1">Tu plan de estudio</div>
                  <div className="text-2xl font-extrabold text-gray-900">Pasa tu examen del DMV en 3 pasos</div>
                  <div className="text-sm text-gray-500 mt-2">Lee una vez. Practica. Nosotros hacemos el resto.</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">1</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Lee las mini-lecciones</div>
                      <div className="text-xs text-gray-500 mt-0.5">Lecciones cortas en español claro. Toma ~15 minutos. Una lectura es suficiente.</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">2</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Practica después</div>
                      <div className="text-xs text-gray-500 mt-0.5">20 preguntas después de leer. Luego 20 más al día siguiente. Retroalimentación inmediata.</div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">3</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Pasa el examen</div>
                      <div className="text-xs text-gray-500 mt-0.5">Ve al DMV con confianza. Sabes las reglas, reconoces las palabras, estás listo.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* State picker */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <MapPin className="w-4 h-4" />
              <span>Encuentra tu estado</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">¿En qué estado vas a tomar el examen?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada estado tiene sus propias reglas. Elige tu estado para ver información específica, preguntas de práctica y todo lo que necesitas saber.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
            {flagshipStates.map(({ esState, state }) => (
              <Link
                key={esState.slug}
                href={`/es/${esState.slug}/examen-de-manejo`}
                className="bg-white hover:bg-blue-600 hover:text-white text-gray-900 text-center py-4 px-3 rounded-xl font-bold transition-all border-2 border-gray-200 hover:border-blue-600 shadow-sm hover:shadow-md"
              >
                <div className="text-base">{esState.nameEs}</div>
                <div className="text-[11px] font-medium opacity-70 mt-0.5">{state.questionsCount} preguntas · {state.passingScore}%</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/es/examenes-por-estado"
              className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:underline"
            >
              Ver los 50 estados <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The method */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">El examen cambió. Nuestro método te protege.</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Florida ya eliminó el español. Tennessee está considerando lo mismo. El gobierno federal endureció los requisitos de inglés para licencias comerciales. Mientras tanto, nosotros te preparamos para cualquier escenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Te enseñamos en español</h3>
              <p className="text-gray-700 leading-relaxed">
                Lecciones escritas por hispanohablantes nativos, no traducciones del inglés. Explicaciones claras sin lenguaje legal confuso. Entenderás todo a la primera.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Te entrenamos con el vocabulario en inglés</h3>
              <p className="text-gray-700 leading-relaxed">
                Practicas con las mismas palabras que verás en el examen y en las señales de tránsito: STOP, YIELD, ONE WAY, DO NOT ENTER, MERGE. Cuando llegues al DMV, nada te va a sorprender.
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pasas en cualquier idioma</h3>
              <p className="text-gray-700 leading-relaxed">
                Si tu estado ofrece el examen en español, lo pasas en español. Si cambia a solo inglés como Florida, ya reconoces todo en inglés. Nuestro método funciona en cualquier escenario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal status explainer */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Puedo sacar mi licencia si...?</h2>
            <p className="text-lg text-gray-600">
              Respuestas honestas a las preguntas que más importan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">... no tengo número de Seguro Social (SSN)?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Sí, en algunos estados. <Link href="/es/colorado/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Colorado</Link> (programa SB251, desde 2013) e <Link href="/es/illinois/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Illinois</Link> (programa TVDL) ofrecen licencias legales a residentes sin SSN. Colorado ha emitido más de 252,000 licencias bajo SB251. Illinois acepta tarjetas consulares de Brasil, Colombia, Ecuador, Guatemala y México.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">... recién llegué a Estados Unidos?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                La mayoría de estados todavía ofrecen el examen escrito en español: <Link href="/es/california/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">California</Link>, <Link href="/es/texas/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Texas</Link>, <Link href="/es/new-york/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Nueva York</Link>, <Link href="/es/arizona/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Arizona</Link>, <Link href="/es/new-jersey/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Nueva Jersey</Link>. Nueva York ofrece el examen en 20 idiomas — el más accesible del país. Cada estado tiene sus propios requisitos; revisa la página específica de tu estado.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-red-500 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">... vivo en Florida?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Malas noticias: desde el <strong>6 de febrero de 2026</strong>, Florida eliminó todas las opciones que no fueran inglés. No más español, no más criollo haitiano, no más traductores. Pero la buena noticia es que nuestro método funciona exactamente para este escenario — te enseñamos en español, te entrenamos con las preguntas en inglés. <Link href="/es/florida/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Ver guía completa para Florida</Link>.
              </p>
            </div>

            <div className="bg-white rounded-xl border-l-4 border-yellow-500 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">... vivo en Tennessee?</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Tennessee está considerando la ley SB 1889 / HB 1708 que cambiaría el examen a solo inglés, similar a lo que pasó en Florida. Por ahora el examen sigue disponible en español, pero es urgente prepararte ahora mientras la política sigue vigente. <Link href="/es/tennessee/examen-de-manejo" className="text-blue-600 font-semibold hover:underline">Ver guía completa para Tennessee</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Los errores más comunes de los hispanohablantes</h2>
            <p className="text-lg text-gray-600">
              Estos son los temas que más confunden a los hispanohablantes en el examen — porque las reglas son diferentes a las de nuestros países de origen.
            </p>
          </div>

          <div className="space-y-4">
            {ERRORES_COMUNES.map((error, i) => (
              <div key={i} className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{error.titulo}</h3>
                <p className="text-gray-700 leading-relaxed">{error.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Historias reales de hispanohablantes</h2>
            <p className="text-lg text-gray-600">Personas como tú que pasaron el examen con nuestro método.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIOS.map((t, i) => (
              <div key={i} className={`${t.color} rounded-2xl p-6 border border-gray-100`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{t.bandera}</div>
                  <div>
                    <div className="font-bold text-gray-900">{t.nombre}</div>
                    <div className="text-xs text-gray-600">{t.origen}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.estrellas)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
            <p className="text-lg text-gray-600">Lo que los hispanohablantes más preguntan sobre el examen de manejo en EE.UU.</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden group">
                <summary className="cursor-pointer p-5 font-bold text-gray-900 hover:bg-gray-100 transition-colors list-none flex items-center justify-between">
                  <span>{item.pregunta}</span>
                  <span className="text-blue-600 text-xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-700 leading-relaxed">{item.respuesta}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para pasar tu examen?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Miles de hispanohablantes ya pasaron su examen de manejo con nosotros. Empieza tu examen de práctica gratis — sin registro, sin tarjeta de crédito.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-xl"
          >
            Empezar examen de práctica gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-6 text-sm text-blue-100">
            100% gratis · Sin registro · Los 50 estados
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
