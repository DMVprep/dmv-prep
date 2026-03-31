const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Check a sample state (FL) for near-duplicate questions
  const state = await prisma.state.findUnique({ where: { code: "FL" } });
  const questions = await prisma.question.findMany({
    where: { stateId: state.id },
    select: { id: true, text: true },
  });

  // Find questions where the first 40 chars match
  const groups = {};
  for (const q of questions) {
    const key = q.text.substring(0, 40).toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(q.text);
  }

  const nearDupes = Object.entries(groups).filter(([k, v]) => v.length > 2);
  console.log("FL: " + questions.length + " total questions");
  console.log("Near-duplicate groups (3+ similar): " + nearDupes.length + "\n");
  
  nearDupes.sort((a, b) => b[1].length - a[1].length);
  nearDupes.slice(0, 15).forEach(([prefix, texts]) => {
    console.log("(" + texts.length + "x) " + prefix + "...");
    texts.slice(0, 3).forEach(t => console.log("  - " + t.substring(0, 80)));
  });
}

main().then(() => prisma.$disconnect());
