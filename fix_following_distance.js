const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const state = await prisma.state.findUnique({ where: { code: 'FL' } });
  
  // Find questions mentioning "3 second" or "three second" following distance
  const questions = await prisma.question.findMany({
    where: {
      stateId: state.id,
      OR: [
        { text: { contains: '3-second', mode: 'insensitive' } },
        { text: { contains: 'three second', mode: 'insensitive' } },
        { explanation: { contains: '3-second', mode: 'insensitive' } },
        { explanation: { contains: 'three second', mode: 'insensitive' } },
      ]
    },
    include: { choices: true }
  });
  
  console.log(`Found ${questions.length} questions about following distance`);
  questions.forEach(q => {
    console.log('\nQ:', q.text);
    console.log('Explanation:', q.explanation);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
