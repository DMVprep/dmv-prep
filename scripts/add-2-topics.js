process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const topics = [
  { name: 'Alcohol & Substances', slug: 'alcohol-substances' },
  { name: 'Licensing & Permits', slug: 'licensing-permits' },
];

Promise.all(topics.map(t =>
  p.topic.upsert({
    where: { slug: t.slug },
    update: {},
    create: { name: t.name, slug: t.slug }
  })
)).then(results => {
  results.forEach(t => console.log('OK:', t.id, '|', t.name));
  console.log('Done');
}).catch(e => console.error('Error:', e.message))
.finally(() => p.$disconnect());
