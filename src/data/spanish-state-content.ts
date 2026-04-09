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
};

export function getStateContent(slug: string): StateSpecificContent | undefined {
  return STATE_CONTENT[slug];
}
