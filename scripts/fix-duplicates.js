const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Find duplicates EXCLUDING "What does this sign mean?" type questions
  const allDupes = await prisma.$queryRaw`
    SELECT q.text, q."stateId", COUNT(*)::int as count
    FROM "Question" q
    WHERE q.text NOT IN ('What does this sign mean?', 'What does this sign indicate to drivers?', 'What action should you take when you see this sign?', 'Identify the meaning of this road sign.')
    GROUP BY q.text, q."stateId"
    HAVING COUNT(*) > 1
    ORDER BY count DESC
  `;

  console.log("Found " + allDupes.length + " non-sign duplicate patterns\n");
  
  let totalDeleted = 0;
  for (const dupe of allDupes) {
    const copies = await prisma.question.findMany({
      where: { text: dupe.text, stateId: dupe.stateId },
      orderBy: { createdAt: "asc" },
    });
    
    // Keep the first, delete the rest
    for (let i = 1; i < copies.length; i++) {
      await prisma.choice.deleteMany({ where: { questionId: copies[i].id } });
      await prisma.question.delete({ where: { id: copies[i].id } });
      totalDeleted++;
    }
    if (dupe.count > 2) {
      console.log("  Cleaned: (" + dupe.count + "x) " + dupe.text.substring(0, 70));
    }
  }

  console.log("\nDeleted " + totalDeleted + " duplicate questions");
  const total = await prisma.question.count();
  console.log("Total questions remaining: " + total);
}

main().then(() => prisma.$disconnect());
