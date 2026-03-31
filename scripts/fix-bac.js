const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. Fix BAC questions with wrong values
  // Every state except Utah is 0.08%. Utah is 0.05%.
  console.log("=== BAC FIX ===\n");
  
  const states = await prisma.state.findMany({ select: { id: true, code: true } });
  let bacFixed = 0;

  for (const state of states) {
    const bacQs = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "BAC", mode: "insensitive" },
      },
      include: { choices: true },
    });

    for (const q of bacQs) {
      const correct = q.choices.find(c => c.isCorrect);
      if (!correct) continue;
      const ans = correct.text.toLowerCase();
      
      // Check for clearly wrong BAC values
      if (ans.includes("0.10") || ans.includes("0.1%") || ans.includes(".10%")) {
        // Wrong — should be 0.08% (or 0.05% for UT)
        const rightVal = state.code === "UT" ? "0.05%" : "0.08%";
        const betterChoice = q.choices.find(c => !c.isCorrect && c.text.includes(rightVal));
        if (betterChoice) {
          await prisma.choice.update({ where: { id: correct.id }, data: { isCorrect: false } });
          await prisma.choice.update({ where: { id: betterChoice.id }, data: { isCorrect: true } });
          console.log("  [" + state.code + "] Fixed BAC from 0.10 to " + rightVal + ": " + q.text.substring(0, 60));
          bacFixed++;
        }
      }
    }
  }
  console.log("BAC questions fixed: " + bacFixed);

  // 2. Find and fix AZ 0.10% BAC specifically
  const azState = await prisma.state.findUnique({ where: { code: "AZ" } });
  const azBac = await prisma.question.findMany({
    where: { stateId: azState.id, text: { contains: "BAC", mode: "insensitive" } },
    include: { choices: true },
  });
  console.log("\nAZ BAC questions:");
  for (const q of azBac) {
    const correct = q.choices.find(c => c.isCorrect);
    console.log("  " + q.text.substring(0, 60) + " -> " + (correct ? correct.text : "?"));
  }

  // 3. Find IN 0.10% BAC
  const inState = await prisma.state.findUnique({ where: { code: "IN" } });
  const inBac = await prisma.question.findMany({
    where: { stateId: inState.id, text: { contains: "BAC", mode: "insensitive" } },
    include: { choices: true },
  });
  console.log("\nIN BAC questions:");
  for (const q of inBac) {
    const correct = q.choices.find(c => c.isCorrect);
    console.log("  " + q.text.substring(0, 60) + " -> " + (correct ? correct.text : "?"));
  }
}

main().then(() => prisma.$disconnect());
