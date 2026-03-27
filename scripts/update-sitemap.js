const fs = require('fs');
const path = 'src/app/sitemap.ts';
let f = fs.readFileSync(path, 'utf8');

const newEntries = `    { url: \`\${BASE_URL}/florida-dmv-test-english-only\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/dmv-test-english-only-states\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish/california\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish/texas\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish/new-york\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish/new-jersey\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: \`\${BASE_URL}/dmv-test-in-spanish/florida\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/how-many-questions-on-dmv-test\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/dmv-test-passing-score\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/dmv-test-age-requirements\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/first-time-drivers-guide\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: \`\${BASE_URL}/examen-dmv-ingles-obligatorio-florida\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/estados-examen-dmv-solo-ingles\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: \`\${BASE_URL}/examen-dmv-en-espanol\`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },`;

const target = `    { url: \`\${BASE_URL}/dmv-test-passing-score-by-state\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];`;

const replacement = `    { url: \`\${BASE_URL}/dmv-test-passing-score-by-state\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
${newEntries}
  ];`;

if (f.includes(target)) {
  f = f.replace(target, replacement);
  fs.writeFileSync(path, f);
  console.log('Sitemap updated with', newEntries.split('\n').length, 'new entries');
} else {
  console.log('Target not found');
}
