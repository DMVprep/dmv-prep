const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Find all following-related questions (broader search)
  const followQs = await prisma.question.count({
    where: { OR: [
      { text: { contains: "following distance", mode: "insensitive" } },
      { text: { contains: "following rule", mode: "insensitive" } },
      { text: { contains: "two-second", mode: "insensitive" } },
      { text: { contains: "three-second", mode: "insensitive" } },
      { text: { contains: "four-second", mode: "insensitive" } },
      { text: { contains: "follow too closely", mode: "insensitive" } },
      { text: { contains: "following another vehicle", mode: "insensitive" } },
    ]}
  });
  console.log("Total following-related questions: " + followQs);

  // Check which state this is from
  const twoSecQ = await prisma.question.findMany({
    where: { text: { contains: "two-second following rule", mode: "insensitive" } },
    include: { state: { select: { code: true } }, choices: true },
  });
  console.log("\n'Two-second following rule' questions: " + twoSecQ.length);
  twoSecQ.forEach(q => {
    const correct = q.choices.find(c => c.isCorrect);
    console.log("  [" + q.state.code + "] " + q.text.substring(0, 60) + " -> " + (correct ? correct.text.substring(0, 50) : "?"));
  });

  // Check for near-duplicate questions in Florida (most likely test state)
  const flState = await prisma.state.findUnique({ where: { code: "FL" } });
  const flQs = await prisma.question.findMany({
    where: { stateId: flState.id },
    select: { text: true },
  });
  
  // Group by first 50 chars
  const groups = {};
  flQs.forEach(q => {
    const key = q.text.substring(0, 50).toLowerCase();
    groups[key] = (groups[key] || 0) + 1;
  });
  
  const repeats = Object.entries(groups).filter(([k, v]) => v > 2).sort((a, b) => b[1] - a[1]);
  console.log("\nFL near-duplicate question patterns (3+):");
  repeats.slice(0, 15).forEach(([k, v]) => console.log("  (" + v + "x) " + k));
}

main().then(() => prisma.$disconnect());
