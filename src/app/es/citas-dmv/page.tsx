// src/app/es/citas-dmv/page.tsx
// Targets "citas DMV en español" (+1,300% rising Spanish query from audit).
// Near-zero competition navigational intent page.
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight, CheckCircle, AlertTriangle, Phone, Globe,
  Calendar, MapPin, Clock, Languages
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo Hacer una Cita del DMV en Español — Guía Completa 2026 | DMVPrep Pro",
  description: "Cómo hacer una cita en el DMV en español paso a paso. Teléfonos, sitios web oficiales e instrucciones para California, Texas, Nueva York, Florida, Illinois, Nueva Jersey, Arizona, Colorado, Nevada y Tennessee. Todo en español.",
  keywords: [
    "citas DMV en español",
    "cita DMV español",
    "www dmv ny gov en español citas",
    "cómo hacer cita DMV",
    "reservar cita DMV español",
    "appointment DMV español",
    "cita para licencia de conducir",
    "DMV cita en línea español",
    "teléfono DMV español",
  ],
  alternates: {
    canonical: "https://dmv-prep.com/es/citas-dmv",
    languages: {
      "es-US": "https://dmv-prep.com/es/citas-dmv",
    },
  },
  openGraph: {
    title: "Cómo Hacer una Cita del DMV en Español — Guía 2026",
    description: "Guía paso a paso para hacer una cita en el DMV en español. Teléfonos y sitios oficiales para los 10 estados con más hispanohablantes.",
    url: "https://dmv-prep.com/es/citas-dmv",
    type: "article",
    locale: "es_US",
  },
};

interface StateAppointmentInfo {
  slug: string;
  nameEs: string;
  agency: string;
  website: string;
  websiteLabel: string;
  phone?: string;
  notes: string;
  spanishSupport: string;
}

const STATE_APPOINTMENTS: StateAppointmentInfo[] = [
  {
    slug: "california",
    nameEs: "California",
    agency: "California DMV",
    website: "https://www.dmv.ca.gov/portal/appointments/select-appointment-type/",
    websiteLabel: "dmv.ca.gov/appointments",
    notes: "El DMV de California ofrece el sistema de citas en línea con interfaz en español. Puedes seleccionar el tipo de servicio, encontrar una oficina cercana, y elegir fecha y hora. El sitio web oficial permite cambiar al idioma español en la esquina superior derecha.",
    spanishSupport: "Sitio web completo en español. Servicios del examen en español en la mayoría de oficinas.",
  },
  {
    slug: "texas",
    nameEs: "Texas",
    agency: "Texas DPS (Department of Public Safety)",
    website: "https://txapps.texas.gov/tolapp/txdlr/welcome.dl",
    websiteLabel: "txapps.texas.gov",
    notes: "En Texas, la agencia oficial es el DPS (Departamento de Seguridad Pública), no el DMV. Debes hacer tu cita en línea usando el portal de Texas DPS. El sistema está principalmente en inglés, pero el examen escrito se puede tomar en español en la oficina.",
    spanishSupport: "Examen escrito disponible en español. Traductor permitido solo antes y después del examen, no durante.",
  },
  {
    slug: "new-york",
    nameEs: "Nueva York",
    agency: "NYS DMV (New York State DMV)",
    website: "https://dmv.ny.gov/es/reservaciones",
    websiteLabel: "dmv.ny.gov/es/reservaciones",
    notes: "Nueva York tiene una página completa de citas en español directamente en el sitio oficial. Puedes seleccionar 'Reservar una cita' y elegir la oficina del DMV más cercana. El examen escrito se ofrece en 20 idiomas incluyendo español.",
    spanishSupport: "Página de citas en español oficial. Examen escrito disponible en 20 idiomas. OKTA online disponible para menores de 18.",
  },
  {
    slug: "florida",
    nameEs: "Florida",
    agency: "FLHSMV (Dept. of Highway Safety and Motor Vehicles)",
    website: "https://www.flhsmv.gov/locations/",
    websiteLabel: "flhsmv.gov/locations",
    notes: "IMPORTANTE: Desde el 6 de febrero de 2026, Florida solo ofrece el examen en inglés. Las citas se pueden hacer en línea o por teléfono en cada oficina local. Muchas oficinas en Miami, Orlando y Tampa tienen personal que habla español para ayudarte con el proceso de registro, aunque el examen en sí debe hacerse en inglés.",
    spanishSupport: "El examen ahora es solo en inglés. Personal bilingüe en muchas oficinas del sur de Florida, pero el test escrito ya no se ofrece en español.",
  },
  {
    slug: "illinois",
    nameEs: "Illinois",
    agency: "Illinois Secretary of State (SOS)",
    website: "https://www.ilsos.gov/departments/drivers/home.html",
    websiteLabel: "ilsos.gov",
    phone: "1-800-252-8980",
    notes: "En Illinois, la agencia oficial es la Secretaría de Estado (SOS), no el DMV. Para hacer una cita, visita el sitio oficial o llama al 1-800-252-8980. Si aplicas bajo el programa TVDL (para residentes sin Social Security), solo 9 facilidades específicas emiten estas licencias — verifica antes de ir.",
    spanishSupport: "Examen escrito disponible en español. Manual oficial en español, inglés y polaco.",
  },
  {
    slug: "new-jersey",
    nameEs: "Nueva Jersey",
    agency: "NJ MVC (Motor Vehicle Commission)",
    website: "https://telegov.njportal.com/njmvc/AppointmentWizard",
    websiteLabel: "telegov.njportal.com/njmvc",
    notes: "Nueva Jersey usa un sistema de citas en línea llamado TeleGov. El MVC (Motor Vehicle Commission) es la agencia oficial, no el DMV. El examen escrito se ofrece en 13 idiomas. Si tu idioma no está en la lista, el MVC paga un intérprete certificado — pero debes solicitarlo con 2 semanas de anticipación.",
    spanishSupport: "Examen escrito en 13 idiomas incluyendo español. MVC paga intérprete si tu idioma no está listado.",
  },
  {
    slug: "arizona",
    nameEs: "Arizona",
    agency: "Arizona MVD (Motor Vehicle Division)",
    website: "https://azdot.gov/motor-vehicles/driver-services/office-locations-appointments",
    websiteLabel: "azdot.gov/motor-vehicles",
    notes: "En Arizona, la agencia se llama MVD (no DMV), y es parte del ADOT (Departamento de Transporte de Arizona). El examen escrito se ofrece en inglés, español, hindi y vietnamita. El propio ADOT publica un examen de práctica oficial en español en azdot.gov.",
    spanishSupport: "Examen escrito en 4 idiomas. Sitio oficial con sección en español. Programa 'Permit Test at Home' para menores de 18.",
  },
  {
    slug: "colorado",
    nameEs: "Colorado",
    agency: "Colorado DMV",
    website: "https://dmv.colorado.gov/AppointmentScheduling",
    websiteLabel: "DMV.Colorado.gov/AppointmentScheduling",
    phone: "303-205-2335",
    notes: "Colorado tiene un programa único llamado SB251 / CO-RCSA que permite a residentes sin Social Security obtener licencia legal. Para hacer una cita bajo este programa, llama al 303-205-2335. Las 36 oficinas estatales del DMV ofrecen servicio SB251 desde junio de 2023.",
    spanishSupport: "Examen escrito y manual oficial en español. Programa @Home Driving Knowledge Test disponible en español con verificación por cámara web.",
  },
  {
    slug: "nevada",
    nameEs: "Nevada",
    agency: "Nevada DMV",
    website: "https://dmvapp.nv.gov/DMV/DL/Appointment/pages/Appointment_step_1.aspx",
    websiteLabel: "dmvapp.nv.gov",
    notes: "Nevada requiere cita en sus oficinas de Reno, Las Vegas, Henderson y Carson City. Las oficinas rurales aceptan walk-ins. Nevada tiene KnowToDrive, una plataforma oficial para tomar el examen escrito desde casa en inglés o español con verificación por cámara web — eliminando la necesidad de ir al DMV solo para el test escrito.",
    spanishSupport: "Examen escrito en 6 idiomas (inglés, español, mandarín, cantonés, coreano, vietnamita). KnowToDrive online en español.",
  },
  {
    slug: "tennessee",
    nameEs: "Tennessee",
    agency: "TDOSHS (Dept. of Safety and Homeland Security)",
    website: "https://apps.tn.gov/dlrs/",
    websiteLabel: "apps.tn.gov/dlrs",
    notes: "En Tennessee, la agencia oficial es el Departamento de Seguridad y Seguridad Nacional (TDOSHS), no el DMV. El sistema de citas se hace en línea. IMPORTANTE: Tennessee está considerando la ley SB 1889 / HB 1708 que cambiaría el examen a solo inglés. Por ahora el examen sigue disponible en español — haz tu cita y prepara el examen lo antes posible.",
    spanishSupport: "Actualmente disponible en inglés, español, coreano y japonés. Ley pendiente puede cambiar esto.",
  },
];

const FAQ_ITEMS = [
  {
    pregunta: "¿Necesito hacer cita en el DMV para tomar el examen de manejo?",
    respuesta: "En la mayoría de los estados, sí. California, Nueva York, Texas, Nueva Jersey y la mayoría de estados requieren cita previa para el examen escrito y la prueba de manejo. Algunas oficinas rurales aceptan walk-ins (sin cita), pero es arriesgado — puedes esperar horas y luego te dicen que no hay espacio. Siempre es mejor hacer cita por adelantado.",
  },
  {
    pregunta: "¿Puedo hacer la cita por teléfono si no entiendo el sitio web en inglés?",
    respuesta: "Sí. La mayoría de los DMV estatales tienen líneas telefónicas con opción en español. En California llama al 1-800-777-0133. En Illinois llama al 1-800-252-8980. En Colorado (para el programa SB251) llama al 303-205-2335. Cuando llamas, presiona el número que dice 'para español' o 'for Spanish'.",
  },
  {
    pregunta: "¿Cuánto tiempo de anticipación debo reservar la cita?",
    respuesta: "Depende del estado y la época del año. En ciudades grandes como Los Ángeles, Houston, Nueva York o Miami, las citas pueden tener 2-6 semanas de espera, especialmente en verano (junio a agosto). En oficinas rurales puede ser solo 1-2 semanas. Reserva tu cita tan pronto sepas que estás listo para el examen — y sigue preparándote mientras esperas.",
  },
  {
    pregunta: "¿Qué documentos debo llevar a mi cita?",
    respuesta: "Depende del estado, pero en general necesitas: (1) Prueba de identidad — pasaporte, tarjeta consular o acta de nacimiento; (2) Prueba de presencia legal en EE.UU. — visa, green card, o en estados como Colorado e Illinois, un documento consular aceptado; (3) Dos pruebas de residencia en el estado — factura de luz, estado de cuenta bancario; (4) Número de Seguro Social (o declaración jurada de no elegibilidad en estados que lo permiten); (5) Dinero para la tarifa (varía de $5 a $40 según el estado). Cada estado tiene una lista exacta en nuestra página específica de ese estado.",
  },
  {
    pregunta: "¿Puedo cambiar o cancelar mi cita si no puedo ir?",
    respuesta: "Sí. La mayoría de los sistemas de citas en línea te permiten cancelar o cambiar la fecha hasta 24 horas antes. Si pierdes tu cita sin avisar ('no-show'), algunos estados como Nueva Jersey te bloquean de hacer otra cita por 30 días. Si sabes que no puedes ir, cancela con anticipación.",
  },
  {
    pregunta: "¿Necesito ser ciudadano o residente legal para hacer una cita del DMV?",
    respuesta: "Depende del estado. La mayoría de los estados requieren algún tipo de presencia legal — visa, residencia permanente, ciudadanía, o estatus temporal aprobado. Pero hay excepciones importantes: Colorado (programa SB251), Illinois (programa TVDL), Nuevo México, Washington, Oregón, Vermont, Connecticut, Delaware, Hawái, Maryland, Nueva Jersey, Nueva York, Utah y Virginia ofrecen licencias a residentes sin Social Security o sin estatus migratorio, bajo reglas específicas. Consulta la página de tu estado para más detalles.",
  },
  {
    pregunta: "¿Puedo llevar un intérprete a mi cita del DMV?",
    respuesta: "Generalmente puedes llevar un intérprete para la parte de registro y entrega de documentos, pero NO para el examen escrito en sí. El examen escrito debes tomarlo solo, en el idioma oficial que ofrezca el estado. Nueva Jersey es la excepción — el MVC paga un intérprete certificado si tu idioma no está entre los 13 disponibles, pero debes solicitarlo con 2 semanas de anticipación.",
  },
  {
    pregunta: "¿Hay DMV donde atiendan en español directamente?",
    respuesta: "Sí. En estados con alta población hispana (California, Texas, Nueva York, Florida, Illinois, Nueva Jersey, Arizona), muchas oficinas del DMV tienen personal bilingüe. Las oficinas en Los Ángeles, Houston, Miami, Nueva York, Chicago, y Phoenix casi siempre tienen al menos un empleado que habla español. Pregunta cuando llegues o cuando llames para tu cita.",
  },
];

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo hacer una cita en el DMV en español",
  description: "Guía paso a paso para hacer una cita en el DMV en español en los 10 estados con más hispanohablantes de Estados Unidos.",
  inLanguage: "es-US",
  step: [
    {
      "@type": "HowToStep",
      name: "Identifica tu estado",
      text: "Cada estado tiene su propia agencia — DMV, MVD, MVC, SOS, o TDOSHS. Encuentra cuál aplica a ti en la lista de abajo.",
    },
    {
      "@type": "HowToStep",
      name: "Visita el sitio oficial o llama",
      text: "Usa el enlace oficial de tu estado o llama al teléfono listado. Busca la opción 'español' o 'for Spanish'.",
    },
    {
      "@type": "HowToStep",
      name: "Reserva tu cita",
      text: "Selecciona el tipo de servicio (examen escrito, prueba de manejo, renovación), fecha y hora. Reserva con al menos 2 semanas de anticipación.",
    },
    {
      "@type": "HowToStep",
      name: "Prepárate para el examen",
      text: "Usa nuestro examen de práctica gratis en español mientras esperas tu cita. 400+ preguntas por estado.",
    },
  ],
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

export default function CitasDMVPage() {
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
          <span className="text-gray-900">Citas del DMV en español</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Calendar className="w-4 h-4" />
            <span>Guía oficial 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Cómo Hacer una Cita del DMV en Español
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Guía completa con teléfonos, sitios web oficiales e instrucciones paso a paso para los 10 estados con más hispanohablantes de Estados Unidos. Todo lo que necesitas para reservar tu cita en el DMV, en español.
          </p>

          {/* Quick CTA */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-900 mb-1">Consejo importante</p>
                <p className="text-sm text-green-800 leading-relaxed">
                  Reserva tu cita <strong>y</strong> empieza a practicar al mismo tiempo. Las citas pueden tardar 2-6 semanas. Usa ese tiempo para estudiar con nuestro examen de práctica gratis en español.
                </p>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-900 hover:underline mt-2"
                >
                  Empezar examen de práctica gratis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Overview: How to make an appointment (the HowTo steps visually) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Los 4 pasos para hacer tu cita del DMV</h2>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Identifica tu estado y su agencia</h3>
                <p className="text-sm text-gray-700">En EE.UU., la agencia oficial no siempre se llama DMV. En Arizona es el MVD. En Nueva Jersey es el MVC. En Illinois es la Secretaría de Estado. En Tennessee es el TDOSHS. Encuentra cuál es la tuya en la lista de abajo.</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Visita el sitio oficial o llama por teléfono</h3>
                <p className="text-sm text-gray-700">Usa el enlace oficial que aparece al lado de tu estado. Si prefieres hablar con una persona, llama al número de teléfono. Busca la opción "español" o "for Spanish" cuando te contesten.</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Reserva tu cita con anticipación</h3>
                <p className="text-sm text-gray-700">En ciudades grandes, las citas tienen 2-6 semanas de espera. Reserva tan pronto sepas que estás listo para el examen. Ten a la mano tu identificación y un correo electrónico válido para recibir la confirmación.</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Prepárate para el examen mientras esperas</h3>
                <p className="text-sm text-gray-700">Mientras esperas tu cita, usa nuestro examen de práctica gratis en español para estudiar. 400+ preguntas por estado, con explicaciones claras en español. La mayoría de los hispanohablantes que fallan el examen lo hacen por no estar preparados — no por falta de idioma.</p>
              </div>
            </div>
          </div>
        </section>

        {/* State-by-state appointment info */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Citas del DMV por estado</h2>
          <p className="text-gray-700 mb-6">
            Información oficial de los 10 estados con más hispanohablantes. Haz clic en el enlace oficial para ir directamente al sistema de citas de tu estado.
          </p>

          <div className="space-y-6">
            {STATE_APPOINTMENTS.map((st) => (
              <article key={st.slug} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {st.nameEs}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{st.agency}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">{st.notes}</p>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Globe className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-500">Sitio oficial: </span>
                      <a href={st.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline break-all">
                        {st.websiteLabel}
                      </a>
                    </div>
                  </div>
                  {st.phone && (
                    <div className="flex items-start gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-gray-500">Teléfono: </span>
                        <span className="text-gray-900 font-medium">{st.phone}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm">
                    <Languages className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-500">Español: </span>
                      <span className="text-gray-700">{st.spanishSupport}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/es/${st.slug}/examen-de-manejo`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Ver guía completa del examen en {st.nameEs} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Other states note */}
        <section className="mb-12">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">¿Vives en otro estado?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Tenemos guías específicas en español para los <strong>50 estados de Estados Unidos</strong>. Cada una incluye el nombre de la agencia oficial, cuántas preguntas tiene el examen, qué porcentaje necesitas para aprobar, y si el examen se ofrece en español.
            </p>
            <Link
              href="/es"
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
            >
              Ver los 50 estados <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes sobre citas del DMV</h2>
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
            <h2 className="text-2xl font-bold mb-3">Mientras esperas tu cita del DMV, empieza a estudiar</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro examen de práctica es 100% gratis, sin registro. 400+ preguntas reales por estado, explicadas en español claro. La mayoría de los hispanohablantes que estudian con nosotros pasan a la primera.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-xl"
            >
              Empezar examen de práctica gratis <ArrowRight className="w-5 h-5" />
            </Link>
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
