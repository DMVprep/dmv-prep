const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.question.findMany({
    include: { _count: { select: { choices: true } } },
  });

  const counts = {};
  questions.forEach(q => {
    const c = q._count.choices;
    counts[c] = (counts[c] || 0) + 1;
  });

  console.log("=== Questions by number of choices ===");
  Object.entries(counts).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([n, count]) => {
    console.log(`  ${n} choices: ${count} questions`);
  });
}

main().then(() => prisma.$disconnect());
