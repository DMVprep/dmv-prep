process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

// Keep only these 6 slugs
const keepSlugs = [
  'traffic-signs',
  'right-of-way',
  'speed-limits',
  'safe-driving',
  'alcohol-substances',
  'licensing-permits'
];

p.topic.findMany().then(async topics => {
  const toDelete = topics.filter(t => !keepSlugs.includes(t.slug));
  console.log('Deleting:', toDelete.map(t => t.name).join(', '));
  
  // Delete topics not in use (no questions linked)
  for (const t of toDelete) {
    const count = await p.question.count({ where: { topicId: t.id } });
    if (count === 0) {
      await p.topic.delete({ where: { id: t.id } });
      console.log('Deleted:', t.name);
    } else {
      console.log('SKIP (has questions):', t.name, count);
    }
  }
  
  // Show remaining
  const remaining = await p.topic.findMany({ orderBy: { name: 'asc' } });
  console.log('\nRemaining topics:');
  remaining.forEach(t => console.log(t.id, '|', t.name, '|', t.slug));
}).finally(() => p.$disconnect());
