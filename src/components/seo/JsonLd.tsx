// src/components/seo/JsonLd.tsx

const SITE_URL = "https://dmv-prep.com";

export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DMVPrep Pro",
    "url": SITE_URL,
    "description": "Free DMV practice tests for all 50 states. Designed for first-time drivers and non-native speakers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/states?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DMVPrep Pro",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "description": "The DMV prep platform for people building a new life in America. Free practice tests for all 50 states with plain-English explanations.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": `${SITE_URL}/contact`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CourseSchema({ stateName }: { stateName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${stateName} DMV Practice Test`,
    "description": `Free ${stateName} DMV permit test practice with plain-English explanations. Covers road signs, right of way, speed limits, and more.`,
    "provider": {
      "@type": "Organization",
      "name": "DMVPrep Pro",
      "url": SITE_URL,
    },
    "isAccessibleForFree": true,
    "educationalLevel": "beginner",
    "inLanguage": ["en", "es"],
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT1H",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function QuizSchema({ stateName, questionCount, stateSlug }: { stateName: string; questionCount: number; stateSlug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `${stateName} DMV Practice Test`,
    "description": `Practice ${questionCount}+ real ${stateName} DMV permit test questions with instant feedback and plain-English explanations.`,
    "url": `${SITE_URL}/state/${stateSlug}/dmv-practice-test`,
    "educationalLevel": "beginner",
    "assesses": "DMV knowledge test readiness",
    "educationalUse": "practice",
    "learningResourceType": "Quiz",
    "isAccessibleForFree": true,
    "inLanguage": "en",
    "provider": {
      "@type": "Organization",
      "name": "DMVPrep Pro",
      "url": SITE_URL,
    },
    "about": {
      "@type": "Thing",
      "name": `${stateName} Driver License Knowledge Test`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
