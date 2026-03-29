const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const topics = await prisma.$queryRaw`
    SELECT t.name, COUNT(*)::int as count 
    FROM "Question" q 
    JOIN "Topic" t ON q."topicId" = t.id 
    GROUP BY t.name 
    ORDER BY count DESC
  `;
  console.log("=== Questions by topic ===");
  topics.forEach(t => console.log(`  ${t.name}: ${t.count}`));

  const withImages = await prisma.question.count({ where: { imageUrl: { not: null } } });
  const total = await prisma.question.count();
  console.log(`\n=== Images: ${withImages} of ${total} questions have imageUrl ===`);

  const signQuestions = await prisma.question.findMany({
    where: { topic: { name: "Traffic Signs" } },
    select: { id: true, text: true, imageUrl: true },
    take: 15,
  });
  console.log("\n=== Sample sign questions ===");
  signQuestions.forEach(q => console.log(`  [${q.imageUrl ? 'IMG' : '---'}] ${q.text.substring(0, 100)}`));
}

main().then(() => prisma.$disconnect());
