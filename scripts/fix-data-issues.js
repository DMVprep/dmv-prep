const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // === FIX 1: Remove [VERIFIED...] from explanations ===
  const verifiedQuestions = await prisma.question.findMany({
    where: { explanation: { contains: "[VERIFIED" } },
    select: { id: true, explanation: true },
  });

  let fixedVerified = 0;
  for (const q of verifiedQuestions) {
    const cleaned = q.explanation.replace(/\s*\[VERIFIED[^\]]*\]/g, '').trim();
    if (cleaned !== q.explanation) {
      await prisma.question.update({ where: { id: q.id }, data: { explanation: cleaned } });
      fixedVerified++;
    }
  }
  console.log(`Fixed ${fixedVerified} explanations (removed [VERIFIED] tags)`);

  // === FIX 2: Remove duplicate answer choices ===
  const allQuestions = await prisma.question.findMany({
    include: { choices: true },
  });

  let fixedDupes = 0;
  for (const q of allQuestions) {
    const seen = new Map();
    const toDelete = [];

    for (const c of q.choices) {
      const key = c.text.trim().toLowerCase();
      if (seen.has(key)) {
        // Keep the correct one if it exists, delete the duplicate
        const existing = seen.get(key);
        if (c.isCorrect && !existing.isCorrect) {
          // This one is correct, delete the previous one
          toDelete.push(existing.id);
          seen.set(key, c);
        } else {
          // Delete this duplicate
          toDelete.push(c.id);
        }
      } else {
        seen.set(key, c);
      }
    }

    if (toDelete.length > 0) {
      await prisma.choice.deleteMany({ where: { id: { in: toDelete } } });
      fixedDupes++;
    }
  }
  console.log(`Fixed ${fixedDupes} questions (removed duplicate choices)`);
}

main().then(() => prisma.$disconnect());
