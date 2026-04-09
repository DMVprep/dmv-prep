// src/data/spanish-state-content.ts
// Rich Spanish content per state. Keyed by state slug.
// The page template reads from here and renders optional sections.

export interface StateStoryParagraph {
  text: string;
}

export interface StateSpecificContent {
  // Hero subtitle override (optional — replaces default "Gratis, sin registro..." for bilingual states)
  heroSubtitle?: string;

  // Local population / language statistics for credibility
  localStats?: {
    spanishSpeakersPercent: string;   // e.g. "28.8%"
    spanishSpeakersNumber: string;    // e.g. "9.7 millones"
    extraStat?: string;               // e.g. "4.2 millones solo en el área metropolitana de Los Ángeles"
  };

  // "What's the situation in this state" section — renders for bilingual + pending_legislation states
  stateSpecificSection?: {
    title: string;
    paragraphs: string[];
  };

  // "Connection to Florida / future risk" section — warns about the trend
  floridaWarningSection?: {
    title: string;
    paragraphs: string[];
  };

  // State-specific quick tip (critical detail competitors miss)
  criticalTip?: {
    title: string;
    body: string;
  };

  // State-specific test details (fee, retake rules, etc.)
  testDetails?: {
    fee?: string;               // e.g. "$38"
    retakeWaitDays?: number;    // e.g. 7
    maxAttemptsPerPeriod?: string; // e.g. "3 intentos en 12 meses"
    minAgePermit?: string;      // e.g. "15 años y medio"
  };
}

export const STATE_CONTENT: Record<string, StateSpecificContent> = {
  california: {
    heroSubtitle:
      "El examen de manejo de California todavía se ofrece en español — por ahora. Te preparamos con el mejor método para hispanohablantes, tengas el examen en el idioma que tengas.",

    localStats: {
      spanishSpeakersPercent: "28.8%",
      spanishSpeakersNumber: "9.7 millones",
      extraStat: "4.2 millones de personas que hablan español en casa solo en el área metropolitana de Los Ángeles — el 34.5% de la población del condado.",
    },

    stateSpecificSection: {
      title: "De 32 a 7 idiomas: California ya empezó a cerrar la puerta",
      paragraphs: [
        "Hasta abril de 2021, el DMV de California ofrecía el examen de manejo escrito en 32 idiomas. Era uno de los estados más accesibles del país para inmigrantes de cualquier origen.",
        "En una sola directiva, el departamento redujo la lista a 7 idiomas: inglés, español, armenio, chino, hindi, punjabi y vietnamita. Se eliminaron 25 idiomas que antes estaban disponibles, incluyendo tagalo, japonés, coreano, árabe y ruso, entre otros.",
        "El español sobrevivió ese recorte porque una ley estatal de 1973 — la Dymally-Alatorre Language Services Act — obliga al DMV a ofrecer servicios en el idioma de cualquier grupo que represente al menos el 5% de la población. California tiene 28.8% de residentes que hablan español en casa, así que el requisito se cumple con margen.",
        "Pero el patrón es claro: el DMV de California ya demostró que puede reducir sus opciones de idiomas sin previo aviso. Lo que pasó con 25 idiomas en 2021 podría pasar con el español si las leyes cambian. Y con la presión federal actual sobre licencias de conducir en inglés, ese escenario ya no es hipotético.",
      ],
    },

    floridaWarningSection: {
      title: "Lo que pasó en Florida puede pasar aquí",
      paragraphs: [
        "El 6 de febrero de 2026, Florida eliminó todas las opciones de idiomas que no fueran inglés para el examen de manejo. No hubo negociación, no hubo período de transición. De un día para otro, los hispanohablantes de Florida — alrededor de 4 millones de personas — perdieron la opción de tomar el examen en español.",
        "El motivo fue político: un accidente mortal en la autopista de Florida en agosto de 2025, protagonizado por un conductor que no hablaba bien inglés, desató una presión legislativa que terminó con la nueva directiva estatal. En ocho semanas, todo cambió.",
        "California no es Florida políticamente, pero el ambiente nacional está cambiando. El gobierno federal ya impuso nuevos requisitos de inglés para licencias comerciales (CDL). Tennessee está considerando una ley similar a la de Florida. La tendencia es clara.",
        "¿Qué significa esto para ti? Si te preparas ahora con un método que te enseña las reglas en español pero te entrena con las preguntas en inglés, no importa qué pase con la ley. Aprobarás el examen en cualquier escenario. Ese es nuestro método — y por eso funciona.",
      ],
    },

    criticalTip: {
      title: "Un detalle importante que pocos mencionan",
      body: "Aunque California ofrece el examen escrito de manejo en español, la parte del examen sobre señales de tránsito (road signs) debe tomarse en inglés, sin importar cuál sea tu idioma principal. Esto significa que aunque elijas hacer el examen escrito en español, igual vas a tener que reconocer y entender las señales con texto en inglés. Por eso nuestro método bilingüe funciona incluso si tomas el examen en español: te enseñamos tanto las reglas como el vocabulario visual de las señales.",
    },

    testDetails: {
      fee: "$38",
      retakeWaitDays: 7,
      maxAttemptsPerPeriod: "3 intentos en un período de 12 meses",
      minAgePermit: "15 años y medio",
    },
  },
  texas: {
    heroSubtitle:
      "El examen de manejo de Texas todavía se ofrece en español — pero con restricciones que muchos no saben. Te preparamos con el mejor método bilingüe para hispanohablantes.",

    localStats: {
      spanishSpeakersPercent: "29.2%",
      spanishSpeakersNumber: "8.4 millones",
      extraStat: "Texas tiene uno de los porcentajes más altos de hispanohablantes del país — solo superado por Nuevo México. Las ciudades de Houston, Dallas, San Antonio, Austin y El Paso concentran las comunidades hispanas más grandes del estado.",
    },

    stateSpecificSection: {
      title: "Texas ya tiene más restricciones de idioma de las que crees",
      paragraphs: [
        "El DPS (Department of Public Safety) de Texas — que es la agencia oficial de licencias, no el DMV — solo ofrece el examen escrito de manejo en dos idiomas: inglés y español. Nada más. Si tu idioma principal es otro, ya estás obligado a tomarlo en inglés.",
        "Pero eso no es todo. El examen de licencia comercial (CDL) ya es solo en inglés desde hace años. Los examinadores no pueden comunicarse contigo en ningún idioma que no sea inglés durante la prueba de manejo, ni siquiera con un intérprete. Y aunque puedes llevar un traductor al DPS, el traductor solo puede ayudarte antes y después del examen — no durante.",
        "Además, las señales de tránsito deben entenderse en inglés, sin importar en qué idioma tomes el examen escrito. Esto no es una regla nueva, es política oficial del DPS. Así que aunque hagas el examen en español, igual necesitas reconocer palabras como STOP, YIELD, ONE WAY, DO NOT ENTER y muchas otras en el inglés exacto que aparecen en las calles.",
        "En otras palabras: Texas ya es parcialmente un estado de examen en inglés. Estás a un voto legislativo de que sea completamente así, como pasó en Florida.",
      ],
    },

    floridaWarningSection: {
      title: "El viento sopla en la misma dirección que Florida",
      paragraphs: [
        "Texas y Florida son estados políticamente similares. Lo que se aprueba en Florida tiende a llegar a Texas tarde o temprano. Y lo que pasó en Florida el 6 de febrero de 2026 fue un cambio radical: de un día para otro, todos los exámenes de manejo se convirtieron en exámenes solo en inglés.",
        "El gobierno federal ya endureció los requisitos de inglés para las licencias comerciales (CDL), y esa política aplica en Texas igual que en Florida. Tennessee está considerando una ley casi idéntica a la de Florida. La presión política para que más estados sigan ese camino es real y está documentada.",
        "La pregunta no es si Texas va a considerar una ley similar. La pregunta es cuándo. Y cuando llegue ese momento, los hispanohablantes que dependían del examen en español van a tener semanas — no meses — para adaptarse.",
        "Prepárate ahora con un método que te enseña las reglas en español pero te entrena con las preguntas en inglés. Así, no importa si el examen sigue en español o cambia a solo inglés: vas a estar listo para los dos escenarios.",
      ],
    },

    criticalTip: {
      title: "Un detalle importante que pocos mencionan",
      body: "El Texas Driver Handbook está disponible en español, y puedes tomar el examen escrito en español si lo pides. Pero las señales de tránsito deben entenderse en inglés — esta es política oficial del DPS, no negociable. Y si tienes menos de 25 años, debes completar un curso aprobado de educación vial antes de tomar el examen. Nuestro método cubre ambos requisitos: te enseñamos las reglas en español, te entrenamos con vocabulario visual en inglés, y cubrimos todo el contenido del curso de manejo oficial del DPS de Texas.",
    },

    testDetails: {
      fee: "$25 (adultos) / $16 (menores de 18)",
      retakeWaitDays: 1,
      maxAttemptsPerPeriod: "Después de 3 fallos, debes volver a solicitar",
      minAgePermit: "15 años",
    },
  },
  "new-york": {
    heroSubtitle:
      "Nueva York es el estado más accesible del país para tomar el examen de manejo en tu idioma — disponible en 20 idiomas, incluyendo español. Aquí te ayudamos a aprovecharlo al máximo.",

    localStats: {
      spanishSpeakersPercent: "19%",
      spanishSpeakersNumber: "3.8 millones",
      extraStat: "En la ciudad de Nueva York, alrededor del 24% de los residentes hablan español en casa. Barrios como Washington Heights, Jackson Heights, el Bronx, Corona y Bushwick concentran las comunidades hispanohablantes más grandes — puertorriqueñas, dominicanas, mexicanas, centroamericanas y sudamericanas.",
    },

    stateSpecificSection: {
      title: "Nueva York ofrece el examen en 20 idiomas — el más accesible del país",
      paragraphs: [
        "El Departamento de Vehículos Motorizados del estado de Nueva York (NYS DMV) ofrece el examen escrito para la licencia Clase D en 20 idiomas: inglés, albanés, árabe, bengalí, bosnio, chino, francés, griego, criollo haitiano, hebreo, italiano, japonés, coreano, nepalí, polaco, ruso, español, turco, urdu y yiddish. Ningún otro estado en Estados Unidos ofrece tantas opciones.",
        "Esta accesibilidad no es accidental. Nueva York tiene una tradición larga de servicios públicos multilingües. La ciudad de Nueva York es una de las más diversas del mundo, con más de 200 idiomas hablados en los cinco distritos. Y a diferencia de Florida o estados como Tennessee que están recortando el acceso, Nueva York mantiene su política inclusiva sin señales de cambio.",
        "Para los hispanohablantes, esto significa una ventaja real: puedes tomar el examen escrito en español, estudiar el manual de manejo oficial en español, y no preocuparte por barreras de idioma en el proceso de solicitud. Es uno de los pocos estados donde realmente puedes empezar a manejar sin hablar inglés.",
      ],
    },

    floridaWarningSection: {
      title: "Pero una advertencia: las reglas del examen de Nueva York son más estrictas de lo que parecen",
      paragraphs: [
        "El examen de Nueva York tiene solo 20 preguntas y necesitas 14 correctas para aprobar (70%). Eso suena fácil — y comparado con California (46 preguntas, 83%) o Maryland (88%), lo es.",
        "Pero hay una trampa que muchos no saben: de esas 20 preguntas, exactamente 4 son sobre señales de tránsito, y tienes que acertar al menos 2 de esas 4. Aunque saques 14 correctas en total, si fallas más de 2 preguntas de señales, repruebas el examen. Es un requisito separado.",
        "Esto significa que el vocabulario visual de señales de tránsito — STOP, YIELD, ONE WAY, DO NOT ENTER, y todas las demás — no es opcional. Aunque hagas el examen escrito en español, las señales siguen apareciendo con texto en inglés y tienes que reconocerlas. Muchos hispanohablantes aprueban las preguntas de reglas pero fallan las de señales por no conocer el vocabulario visual.",
        "Nuestro método cubre exactamente eso: te enseñamos las reglas en español claro, pero también te entrenamos con el vocabulario visual de las señales en inglés. Es la combinación que te lleva a aprobar las dos secciones del examen, no solo una.",
      ],
    },

    criticalTip: {
      title: "Un detalle importante que pocos mencionan",
      body: "Nueva York es uno de los pocos estados que NO requiere un período de espera entre intentos del examen escrito. Si fallas, puedes volver a intentarlo el mismo día o al día siguiente — sin tarifa adicional. Además, si tienes menos de 18 años, puedes tomar el examen en línea desde casa a través del programa OKTA del DMV (disponible en inglés y español). Pero recuerda: aunque la política de reintentos sea flexible, fallar varias veces puede retrasar tu proceso semanas. Prepárate bien desde el principio con nuestro método.",
    },

    testDetails: {
      fee: "$5 para el examen escrito ($1 adicional cada 6 meses para residentes de NYC y condados vecinos)",
      retakeWaitDays: 0,
      maxAttemptsPerPeriod: "Sin límite — puedes reintentar inmediatamente",
      minAgePermit: "16 años",
    },
  },
};

export function getStateContent(slug: string): StateSpecificContent | undefined {
  return STATE_CONTENT[slug];
}
