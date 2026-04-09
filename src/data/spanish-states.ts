// src/data/spanish-states.ts
// Spanish-specific metadata for all 50 US states.
// Complements src/data/states.ts — don't duplicate fields already there.
//
// status values:
//   - "english_only":      State only offers the test in English (FL as of 2026-02-06,
//                          plus AK, OK, WY, SD which were always English-only).
//   - "bilingual":         State offers test in Spanish AND we have flagship rich
//                          content for it in spanish-state-content.ts.
//   - "bilingual_basic":   State offers test in Spanish but we don't have flagship
//                          rich content yet — renders a solid lighter template.
//   - "pending_legislation": State has active bill to go English-only (Tennessee).

export type TestLanguageStatus = "english_only" | "bilingual" | "bilingual_basic" | "pending_legislation";

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
  {
    slug: "alabama",
    nameEs: "Alabama",
    status: "bilingual_basic",
    spanishPopulationRank: 28,
    summary: "El examen de manejo de Alabama está disponible en español. Prepárate con explicaciones claras en tu idioma.",
  },
  {
    slug: "alaska",
    nameEs: "Alaska",
    status: "english_only",
    spanishPopulationRank: 50,
    summary: "El examen de manejo de Alaska solo se ofrece en inglés. Te enseñamos el material en español para que estés listo.",
  },
  {
    slug: "arkansas",
    nameEs: "Arkansas",
    status: "bilingual_basic",
    spanishPopulationRank: 32,
    summary: "El examen de manejo de Arkansas se ofrece en español. Aprende las reglas con nuestro método bilingüe.",
  },
  {
    slug: "connecticut",
    nameEs: "Connecticut",
    status: "bilingual_basic",
    spanishPopulationRank: 17,
    summary: "El examen de manejo de Connecticut está disponible en español. Prepárate con explicaciones nativas.",
  },
  {
    slug: "delaware",
    nameEs: "Delaware",
    status: "bilingual_basic",
    spanishPopulationRank: 35,
    summary: "El examen de manejo de Delaware se ofrece en español. Aprende con explicaciones claras en tu idioma.",
  },
  {
    slug: "georgia",
    nameEs: "Georgia",
    status: "bilingual_basic",
    spanishPopulationRank: 15,
    summary: "El examen de manejo de Georgia está disponible en español. Domina las reglas con nuestro método bilingüe.",
  },
  {
    slug: "hawaii",
    nameEs: "Hawái",
    status: "bilingual_basic",
    spanishPopulationRank: 45,
    summary: "El examen de manejo de Hawái se ofrece en varios idiomas, incluyendo español. Prepárate con explicaciones claras.",
  },
  {
    slug: "idaho",
    nameEs: "Idaho",
    status: "bilingual_basic",
    spanishPopulationRank: 38,
    summary: "El examen de manejo de Idaho está disponible en español. Aprende las reglas con nuestro método bilingüe.",
  },
  {
    slug: "indiana",
    nameEs: "Indiana",
    status: "bilingual_basic",
    spanishPopulationRank: 22,
    summary: "El examen de manejo de Indiana se ofrece en español. Prepárate con explicaciones nativas en tu idioma.",
  },
  {
    slug: "iowa",
    nameEs: "Iowa",
    status: "bilingual_basic",
    spanishPopulationRank: 34,
    summary: "El examen de manejo de Iowa está disponible en español. Domina las reglas con nuestro método bilingüe.",
  },
  {
    slug: "kansas",
    nameEs: "Kansas",
    status: "bilingual_basic",
    spanishPopulationRank: 24,
    summary: "El examen de manejo de Kansas se ofrece en español. Aprende con explicaciones claras en tu idioma.",
  },
  {
    slug: "kentucky",
    nameEs: "Kentucky",
    status: "bilingual_basic",
    spanishPopulationRank: 36,
    summary: "El examen de manejo de Kentucky está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "louisiana",
    nameEs: "Luisiana",
    status: "bilingual_basic",
    spanishPopulationRank: 30,
    summary: "El examen de manejo de Luisiana se ofrece en español. Aprende las reglas con explicaciones nativas.",
  },
  {
    slug: "maine",
    nameEs: "Maine",
    status: "bilingual_basic",
    spanishPopulationRank: 48,
    summary: "El examen de manejo de Maine está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "maryland",
    nameEs: "Maryland",
    status: "bilingual_basic",
    spanishPopulationRank: 18,
    summary: "El examen de manejo de Maryland se ofrece en español. Domina las reglas con explicaciones claras en tu idioma.",
  },
  {
    slug: "massachusetts",
    nameEs: "Massachusetts",
    status: "bilingual_basic",
    spanishPopulationRank: 14,
    summary: "El examen de manejo de Massachusetts está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "michigan",
    nameEs: "Míchigan",
    status: "bilingual_basic",
    spanishPopulationRank: 21,
    summary: "El examen de manejo de Míchigan se ofrece en español. Aprende con explicaciones claras en tu idioma.",
  },
  {
    slug: "minnesota",
    nameEs: "Minnesota",
    status: "bilingual_basic",
    spanishPopulationRank: 27,
    summary: "El examen de manejo de Minnesota está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "mississippi",
    nameEs: "Misisipi",
    status: "bilingual_basic",
    spanishPopulationRank: 39,
    summary: "El examen de manejo de Misisipi se ofrece en español. Aprende las reglas con explicaciones claras.",
  },
  {
    slug: "missouri",
    nameEs: "Misuri",
    status: "bilingual_basic",
    spanishPopulationRank: 26,
    summary: "El examen de manejo de Misuri está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "montana",
    nameEs: "Montana",
    status: "bilingual_basic",
    spanishPopulationRank: 46,
    summary: "El examen de manejo de Montana se ofrece en español. Aprende con explicaciones nativas en tu idioma.",
  },
  {
    slug: "nebraska",
    nameEs: "Nebraska",
    status: "bilingual_basic",
    spanishPopulationRank: 31,
    summary: "El examen de manejo de Nebraska está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "new-hampshire",
    nameEs: "Nuevo Hampshire",
    status: "bilingual_basic",
    spanishPopulationRank: 44,
    summary: "El examen de manejo de Nuevo Hampshire se ofrece en español. Aprende con explicaciones claras.",
  },
  {
    slug: "new-mexico",
    nameEs: "Nuevo México",
    status: "bilingual_basic",
    spanishPopulationRank: 11,
    summary: "Nuevo México tiene uno de los porcentajes más altos de hispanohablantes del país. El examen de manejo está disponible en español.",
  },
  {
    slug: "north-carolina",
    nameEs: "Carolina del Norte",
    status: "bilingual_basic",
    spanishPopulationRank: 12,
    summary: "El examen de manejo de Carolina del Norte se ofrece en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "north-dakota",
    nameEs: "Dakota del Norte",
    status: "bilingual_basic",
    spanishPopulationRank: 49,
    summary: "El examen de manejo de Dakota del Norte está disponible en español. Aprende con explicaciones claras.",
  },
  {
    slug: "ohio",
    nameEs: "Ohio",
    status: "bilingual_basic",
    spanishPopulationRank: 20,
    summary: "El examen de manejo de Ohio se ofrece en español. Domina las reglas con nuestro método bilingüe.",
  },
  {
    slug: "oklahoma",
    nameEs: "Oklahoma",
    status: "english_only",
    spanishPopulationRank: 29,
    summary: "El examen de manejo de Oklahoma solo se ofrece en inglés. Te enseñamos el material en español para que estés listo.",
  },
  {
    slug: "oregon",
    nameEs: "Oregón",
    status: "bilingual_basic",
    spanishPopulationRank: 23,
    summary: "El examen de manejo de Oregón está disponible en español. Aprende con explicaciones claras en tu idioma.",
  },
  {
    slug: "pennsylvania",
    nameEs: "Pensilvania",
    status: "bilingual_basic",
    spanishPopulationRank: 13,
    summary: "El examen de manejo de Pensilvania se ofrece en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "rhode-island",
    nameEs: "Rhode Island",
    status: "bilingual_basic",
    spanishPopulationRank: 37,
    summary: "El examen de manejo de Rhode Island está disponible en español. Aprende con explicaciones nativas.",
  },
  {
    slug: "south-carolina",
    nameEs: "Carolina del Sur",
    status: "bilingual_basic",
    spanishPopulationRank: 25,
    summary: "El examen de manejo de Carolina del Sur se ofrece en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "south-dakota",
    nameEs: "Dakota del Sur",
    status: "english_only",
    spanishPopulationRank: 47,
    summary: "El examen de manejo de Dakota del Sur solo se ofrece en inglés. Te enseñamos el material en español.",
  },
  {
    slug: "utah",
    nameEs: "Utah",
    status: "bilingual_basic",
    spanishPopulationRank: 19,
    summary: "El examen de manejo de Utah está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "vermont",
    nameEs: "Vermont",
    status: "bilingual_basic",
    spanishPopulationRank: 43,
    summary: "El examen de manejo de Vermont se ofrece en español. Aprende con explicaciones claras en tu idioma.",
  },
  {
    slug: "virginia",
    nameEs: "Virginia",
    status: "bilingual_basic",
    spanishPopulationRank: 16,
    summary: "El examen de manejo de Virginia está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "washington",
    nameEs: "Washington",
    status: "bilingual_basic",
    spanishPopulationRank: 33,
    summary: "El examen de manejo de Washington se ofrece en español. Aprende con explicaciones nativas en tu idioma.",
  },
  {
    slug: "west-virginia",
    nameEs: "Virginia Occidental",
    status: "bilingual_basic",
    spanishPopulationRank: 42,
    summary: "El examen de manejo de Virginia Occidental está disponible en español. Prepárate con nuestro método bilingüe.",
  },
  {
    slug: "wisconsin",
    nameEs: "Wisconsin",
    status: "bilingual_basic",
    spanishPopulationRank: 40,
    summary: "El examen de manejo de Wisconsin se ofrece en español. Aprende con explicaciones claras.",
  },
  {
    slug: "wyoming",
    nameEs: "Wyoming",
    status: "english_only",
    spanishPopulationRank: 41,
    summary: "El examen de manejo de Wyoming solo se ofrece en inglés. Te enseñamos el material en español para que estés listo.",
  },
];

export function getSpanishStateBySlug(slug: string): SpanishStateInfo | undefined {
  return SPANISH_STATES.find((s) => s.slug === slug);
}
