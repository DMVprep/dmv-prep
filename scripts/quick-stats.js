const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const total = await prisma.question.count();
  const withImages = await prisma.question.count({ where: { imageUrl: { not: null } } });
  const aota = await prisma.question.count({ where: { choices: { some: { text: "All of the above", isCorrect: true } } } });
  console.log('Total questions: ' + total);
  console.log('Questions with images: ' + withImages);
  console.log('All of the above questions: ' + aota);
}
main().then(() => prisma.$disconnect());
