const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Overall distribution
  const topics = await prisma.$queryRaw`
    SELECT t.name, COUNT(*)::int as count
    FROM "Question" q JOIN "Topic" t ON q."topicId" = t.id
    GROUP BY t.name ORDER BY count DESC
  `;
  const total = topics.reduce((s, t) => s + t.count, 0);
  console.log('=== OVERALL DISTRIBUTION (' + total + ' total) ===');
  topics.forEach(t => {
    const pct = ((t.count / total) * 100).toFixed(1);
    console.log('  ' + t.name + ': ' + t.count + ' (' + pct + '%)');
  });

  // Following distance specifically
  const followAll = await prisma.question.count({
    where: { text: { contains: 'following distance', mode: 'insensitive' } }
  });
  console.log('\n=== FOLLOWING DISTANCE ===');
  console.log('Total questions mentioning "following distance": ' + followAll);

  // Per state sample
  const followByState = await prisma.$queryRaw`
    SELECT s.code, COUNT(*)::int as count
    FROM "Question" q JOIN "State" s ON q."stateId" = s.id
    WHERE LOWER(q.text) LIKE '%following distance%'
    GROUP BY s.code ORDER BY count DESC LIMIT 15
  `;
  console.log('Per state (top 15):');
  followByState.forEach(s => console.log('  ' + s.code + ': ' + s.count));

  // Duplicate/similar questions check
  const dupeCheck = await prisma.$queryRaw`
    SELECT LEFT(q.text, 60) as snippet, COUNT(*)::int as count
    FROM "Question" q
    WHERE LOWER(q.text) LIKE '%following distance%'
    GROUP BY LEFT(q.text, 60)
    HAVING COUNT(*) > 5
    ORDER BY count DESC
  `;
  console.log('\nMost repeated following distance question patterns:');
  dupeCheck.forEach(d => console.log('  (' + d.count + 'x) ' + d.snippet));
}

main().then(() => prisma.$disconnect());
