// src/data/spanish-states.ts
// Spanish-specific metadata for the 10 priority states.
// Complements src/data/states.ts — don't duplicate fields already there.

export type TestLanguageStatus = "english_only" | "bilingual" | "pending_legislation";

export interface SpanishStateInfo {
  slug: string;              // matches stateToSlug() from states.ts
  nameEs: string;            // state name in Spanish (most are identical to English)
  status: TestLanguageStatus;
  englishOnlyEffectiveDate?: string; // ISO date if english_only
  spanishPopulationRank: number;     // 1 = most Spanish speakers
  summary: string;           // one-sentence Spanish summary for the card
}

export const SPANISH_STATES: SpanishStateInfo[] = [
  {
    slug: "florida",
    nameEs: "Florida",
    status: "english_only",
    englishOnlyEffectiveDate: "2026-02-06",
    spanishPopulationRank: 3,
    summary: "Desde el 6 de febrero de 2026, el examen de manejo de Florida solo se ofrece en inglés. Te enseñamos a pasarlo, explicado en español.",
  },
  {
    slug: "california",
    nameEs: "California",
    status: "bilingual",
    spanishPopulationRank: 1,
    summary: "El examen de manejo de California todavía se ofrece en español. Prepárate con la mejor explicación nativa en español.",
  },
  {
    slug: "texas",
    nameEs: "Texas",
    status: "bilingual",
    spanishPopulationRank: 2,
    summary: "El examen de manejo de Texas se ofrece en español. Prepárate con explicaciones claras y vocabulario bilingüe.",
  },
  {
    slug: "new-york",
    nameEs: "Nueva York",
    status: "bilingual",
    spanishPopulationRank: 4,
    summary: "El examen de manejo de Nueva York está disponible en español. Aprende con el mejor método para hispanohablantes.",
  },
  {
    slug: "arizona",
    nameEs: "Arizona",
    status: "bilingual",
    spanishPopulationRank: 5,
    summary: "El examen de manejo de Arizona se ofrece en español. Aprende las reglas con explicaciones claras en tu idioma.",
  },
  {
    slug: "new-jersey",
    nameEs: "Nueva Jersey",
    status: "bilingual",
    spanishPopulationRank: 6,
    summary: "El examen de manejo de Nueva Jersey está disponible en español. Prepárate con el mejor método para hispanohablantes.",
  },
  {
    slug: "illinois",
    nameEs: "Illinois",
    status: "bilingual",
    spanishPopulationRank: 7,
    summary: "El examen de manejo de Illinois se ofrece en español. Domina las reglas con explicaciones nativas en español.",
  },
  {
    slug: "colorado",
    nameEs: "Colorado",
    status: "bilingual",
    spanishPopulationRank: 8,
    summary: "El examen de manejo de Colorado está disponible en español. Aprende con explicaciones claras y prácticas.",
  },
  {
    slug: "nevada",
    nameEs: "Nevada",
    status: "bilingual",
    spanishPopulationRank: 9,
    summary: "El examen de manejo de Nevada se ofrece en español. Prepárate con el mejor método para pasar a la primera.",
  },
  {
    slug: "tennessee",
    nameEs: "Tennessee",
    status: "pending_legislation",
    spanishPopulationRank: 10,
    summary: "Tennessee está considerando una ley para ofrecer el examen solo en inglés. Prepárate ahora, antes de que cambie la ley.",
  },
];

export function getSpanishStateBySlug(slug: string): SpanishStateInfo | undefined {
  return SPANISH_STATES.find((s) => s.slug === slug);
}
