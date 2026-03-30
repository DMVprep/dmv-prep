const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: 'asc' } });

  console.log('=== Following distance correct answers by state ===\n');

  for (const state of states) {
    const questions = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: 'following distance', mode: 'insensitive' },
      },
      include: { choices: true },
    });

    if (questions.length === 0) continue;

    // Get unique correct answers
    const answers = new Set();
    questions.forEach(q => {
      const correct = q.choices.find(c => c.isCorrect);
      if (correct) answers.add(correct.text);
    });

    const answerList = [...answers].join(' | ');
    const flag = answers.size > 1 ? ' ⚠️ CONFLICT' : '';
    console.log(state.code + ' (' + questions.length + 'q): ' + answerList + flag);
  }
}

main().then(() => prisma.$disconnect());
