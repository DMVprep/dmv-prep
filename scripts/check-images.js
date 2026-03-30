const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const withImages = await prisma.question.count({ where: { imageUrl: { not: null } } });
  console.log('Questions with images:', withImages);
  if (withImages > 0) {
    const samples = await prisma.question.findMany({
      where: { imageUrl: { not: null } },
      select: { text: true, imageUrl: true, state: { select: { code: true } } },
      take: 5,
    });
    samples.forEach(q => console.log(`  [${q.state.code}] ${q.imageUrl} — ${q.text.substring(0, 60)}`));
  }
}
main().then(() => prisma.$disconnect());
