// src/data/states.ts
export const US_STATES = [
  { code: "AL", name: "Alabama", questionsCount: 30, passingScore: 80 },
  { code: "AK", name: "Alaska", questionsCount: 20, passingScore: 80 },
  { code: "AZ", name: "Arizona", questionsCount: 30, passingScore: 80 },
  { code: "AR", name: "Arkansas", questionsCount: 25, passingScore: 80 },
  { code: "CA", name: "California", questionsCount: 46, passingScore: 83 },
  { code: "CO", name: "Colorado", questionsCount: 20, passingScore: 80 },
  { code: "CT", name: "Connecticut", questionsCount: 25, passingScore: 80 },
  { code: "DE", name: "Delaware", questionsCount: 30, passingScore: 77 },
  { code: "FL", name: "Florida", questionsCount: 50, passingScore: 80 },
  { code: "GA", name: "Georgia", questionsCount: 40, passingScore: 75 },
  { code: "HI", name: "Hawaii", questionsCount: 30, passingScore: 80 },
  { code: "ID", name: "Idaho", questionsCount: 40, passingScore: 85 },
  { code: "IL", name: "Illinois", questionsCount: 35, passingScore: 80 },
  { code: "IN", name: "Indiana", questionsCount: 30, passingScore: 80 },
  { code: "IA", name: "Iowa", questionsCount: 35, passingScore: 80 },
  { code: "KS", name: "Kansas", questionsCount: 25, passingScore: 80 },
  { code: "KY", name: "Kentucky", questionsCount: 30, passingScore: 80 },
  { code: "LA", name: "Louisiana", questionsCount: 30, passingScore: 80 },
  { code: "ME", name: "Maine", questionsCount: 30, passingScore: 80 },
  { code: "MD", name: "Maryland", questionsCount: 25, passingScore: 85 },
  { code: "MA", name: "Massachusetts", questionsCount: 25, passingScore: 72 },
  { code: "MI", name: "Michigan", questionsCount: 50, passingScore: 80 },
  { code: "MN", name: "Minnesota", questionsCount: 40, passingScore: 80 },
  { code: "MS", name: "Mississippi", questionsCount: 30, passingScore: 80 },
  { code: "MO", name: "Missouri", questionsCount: 25, passingScore: 80 },
  { code: "MT", name: "Montana", questionsCount: 33, passingScore: 82 },
  { code: "NE", name: "Nebraska", questionsCount: 25, passingScore: 80 },
  { code: "NV", name: "Nevada", questionsCount: 50, passingScore: 80 },
  { code: "NH", name: "New Hampshire", questionsCount: 40, passingScore: 80 },
  { code: "NJ", name: "New Jersey", questionsCount: 50, passingScore: 80 },
  { code: "NM", name: "New Mexico", questionsCount: 25, passingScore: 72 },
  { code: "NY", name: "New York", questionsCount: 20, passingScore: 70 },
  { code: "NC", name: "North Carolina", questionsCount: 25, passingScore: 80 },
  { code: "ND", name: "North Dakota", questionsCount: 25, passingScore: 80 },
  { code: "OH", name: "Ohio", questionsCount: 40, passingScore: 75 },
  { code: "OK", name: "Oklahoma", questionsCount: 50, passingScore: 80 },
  { code: "OR", name: "Oregon", questionsCount: 35, passingScore: 80 },
  { code: "PA", name: "Pennsylvania", questionsCount: 18, passingScore: 83 },
  { code: "RI", name: "Rhode Island", questionsCount: 25, passingScore: 80 },
  { code: "SC", name: "South Carolina", questionsCount: 30, passingScore: 80 },
  { code: "SD", name: "South Dakota", questionsCount: 25, passingScore: 80 },
  { code: "TN", name: "Tennessee", questionsCount: 30, passingScore: 80 },
  { code: "TX", name: "Texas", questionsCount: 40, passingScore: 70 },
  { code: "UT", name: "Utah", questionsCount: 50, passingScore: 80 },
  { code: "VT", name: "Vermont", questionsCount: 20, passingScore: 80 },
  { code: "VA", name: "Virginia", questionsCount: 35, passingScore: 80 },
  { code: "WA", name: "Washington", questionsCount: 40, passingScore: 80 },
  { code: "WV", name: "West Virginia", questionsCount: 25, passingScore: 76 },
  { code: "WI", name: "Wisconsin", questionsCount: 50, passingScore: 80 },
  { code: "WY", name: "Wyoming", questionsCount: 25, passingScore: 80 },
];

export function getStateByCode(code: string) {
  return US_STATES.find(s => s.code.toLowerCase() === code.toLowerCase());
}

export function getStateBySlug(slug: string) {
  return US_STATES.find(s => s.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
}

export function stateToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}
