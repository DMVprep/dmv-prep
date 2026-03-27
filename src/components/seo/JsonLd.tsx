// src/components/seo/JsonLd.tsx
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
    "url": "https://dmv-prep.vercel.app",
    "description": "Free DMV practice tests for all 50 states",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dmv-prep.vercel.app/states?q={search_term_string}",
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

export function CourseSchema({ stateName }: { stateName: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${stateName} DMV Practice Test`,
    "description": `Free ${stateName} DMV permit test practice with plain-English explanations`,
    "provider": {
      "@type": "Organization",
      "name": "DMVPrep Pro",
      "url": "https://dmv-prep.vercel.app",
    },
    "isAccessibleForFree": true,
    "educationalLevel": "beginner",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
