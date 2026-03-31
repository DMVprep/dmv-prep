const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.microLesson.count();
  const withImages = await prisma.microLesson.count({ where: { imageUrl: { not: null } } });
  const byTopic = await prisma.$queryRaw`
    SELECT topic, COUNT(*)::int as count FROM "MicroLesson" GROUP BY topic ORDER BY count DESC
  `;
  const byState = await prisma.$queryRaw`
    SELECT "stateCode", COUNT(*)::int as count FROM "MicroLesson" GROUP BY "stateCode" ORDER BY "stateCode"
  `;
  
  console.log("=== MICRO LESSONS ===");
  console.log("Total: " + total);
  console.log("With images: " + withImages);
  console.log("\nBy topic:");
  byTopic.forEach(t => console.log("  " + t.topic + ": " + t.count));
  console.log("\nBy state:");
  byState.forEach(s => console.log("  " + (s.stateCode || "Universal") + ": " + s.count));

  // Show sample lessons
  const samples = await prisma.microLesson.findMany({ take: 5, select: { title: true, topic: true, stateCode: true, imageUrl: true } });
  console.log("\nSamples:");
  samples.forEach(s => console.log("  [" + (s.stateCode || "ALL") + "] " + s.topic + " — " + s.title + (s.imageUrl ? " 📷" : "")));
}

main().then(() => prisma.$disconnect());
