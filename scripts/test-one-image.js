const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Reset all imageUrls first
  const reset = await prisma.question.updateMany({
    where: { imageUrl: { not: null } },
    data: { imageUrl: null }
  });
  console.log(`Reset ${reset.count} questions`);

  // Find one stop sign question in Florida
  const q = await prisma.question.findFirst({
    where: { 
      topic: { name: "Traffic Signs" },
      text: { contains: "What shape is a stop sign" }
    },
    select: { id: true, text: true, state: { select: { code: true } } }
  });

  if (q) {
    await prisma.question.update({
      where: { id: q.id },
      data: { imageUrl: "/signs/stop.png" }
    });
    console.log(`Set image on: [${q.state.code}] "${q.text}"`);
  } else {
    console.log("No matching question found");
  }
}

main().then(() => prisma.$disconnect());
