const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Find questions with VERIFIED in explanation
  const verified = await prisma.question.count({
    where: { explanation: { contains: "[VERIFIED" } }
  });
  console.log(`\n1. Questions with [VERIFIED] in explanation: ${verified}`);

  // 2. Find questions with duplicate answer choices (check all)
  const allQuestions = await prisma.question.findMany({
    include: { choices: true, state: { select: { code: true } } },
  });
  
  let dupeCount = 0;
  let dupeExamples = [];
  for (const q of allQuestions) {
    const texts = q.choices.map(c => c.text.trim().toLowerCase());
    const unique = new Set(texts);
    if (unique.size < texts.length) {
      dupeCount++;
      if (dupeExamples.length < 5) {
        dupeExamples.push({ state: q.state.code, text: q.text.substring(0, 80), choices: q.choices.map(c => `${c.isCorrect ? '✓' : ' '} ${c.text}`) });
      }
    }
  }
  console.log(`\n2. Questions with duplicate answer choices: ${dupeCount} of ${allQuestions.length}`);
  dupeExamples.forEach(e => {
    console.log(`  [${e.state}] Q: ${e.text}`);
    e.choices.forEach(c => console.log(`    ${c}`));
  });
}

main().then(() => prisma.$disconnect());
