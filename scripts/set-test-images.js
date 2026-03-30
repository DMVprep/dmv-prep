const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const updated = await prisma.question.updateMany({
    where: {
      topic: { name: "Traffic Signs" },
      state: { code: "OR" },
      text: { contains: "stop sign", mode: "insensitive" }
    },
    data: { imageUrl: "/signs/stop.png" }
  });
  console.log('Set stop.png on ' + updated.count + ' Oregon stop sign questions');
}
main().then(() => prisma.$disconnect());
