const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const questions = await prisma.question.findMany({
    where: {
      state: { code: "OR" },
      text: { contains: "following distance", mode: "insensitive" }
    },
    include: { choices: true },
  });
  questions.forEach(q => {
    console.log('\nQ: ' + q.text);
    console.log('Explanation: ' + q.explanation);
    q.choices.forEach(c => console.log('  ' + (c.isCorrect ? 'Y' : ' ') + ' ' + c.text));
  });
}
main().then(() => prisma.$disconnect());
