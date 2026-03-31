const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Fix FL "two-second" questions — FL uses 4-second rule
  const flState = await prisma.state.findUnique({ where: { code: "FL" } });
  
  const badQs = await prisma.question.findMany({
    where: {
      stateId: flState.id,
      text: { contains: "two-second following", mode: "insensitive" },
    },
    include: { choices: true },
  });
  
  console.log("FL two-second questions to delete: " + badQs.length);
  for (const q of badQs) {
    await prisma.choice.deleteMany({ where: { questionId: q.id } });
    await prisma.question.delete({ where: { id: q.id } });
    console.log("  Deleted: " + q.text.substring(0, 60));
  }

  // Count all following-related questions per state
  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } });
  
  console.log("\nFollowing-related questions per state:");
  for (const state of states) {
    const count = await prisma.question.count({
      where: {
        stateId: state.id,
        OR: [
          { text: { contains: "following distance", mode: "insensitive" } },
          { text: { contains: "following rule", mode: "insensitive" } },
          { text: { contains: "two-second", mode: "insensitive" } },
          { text: { contains: "three-second", mode: "insensitive" } },
          { text: { contains: "four-second", mode: "insensitive" } },
          { text: { contains: "follow too closely", mode: "insensitive" } },
          { text: { contains: "following another vehicle", mode: "insensitive" } },
        ]
      }
    });
    if (count > 3) console.log("  " + state.code + ": " + count + " (needs trimming)");
  }
}

main().then(() => prisma.$disconnect());
