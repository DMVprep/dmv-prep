const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get states without handbook data
  const coveredStates = ['FL', 'CA', 'TX', 'NY', 'PA', 'IL'];
  const states = await prisma.state.findMany({
    where: { code: { notIn: coveredStates } },
    select: { code: true, id: true },
  });

  console.log('States needing handbook data: ' + states.length + '\n');

  // For each state, find questions about speed limits, following distance, alcohol, phones
  for (const state of states.slice(0, 5)) { // Test with 5 first
    console.log('\n=== ' + state.code + ' ===');

    // Speed limits
    const speedQs = await prisma.question.findMany({
      where: { stateId: state.id, text: { contains: 'speed limit', mode: 'insensitive' } },
      include: { choices: true },
      take: 10,
    });
    console.log('Speed limit questions: ' + speedQs.length);
    speedQs.slice(0, 3).forEach(q => {
      const correct = q.choices.find(c => c.isCorrect);
      console.log('  Q: ' + q.text.substring(0, 70) + ' -> ' + (correct ? correct.text : '?'));
    });

    // Following distance
    const followQs = await prisma.question.findMany({
      where: { stateId: state.id, text: { contains: 'following distance', mode: 'insensitive' } },
      include: { choices: true },
      take: 5,
    });
    console.log('Following distance questions: ' + followQs.length);
    followQs.slice(0, 2).forEach(q => {
      const correct = q.choices.find(c => c.isCorrect);
      console.log('  Q: ' + q.text.substring(0, 70) + ' -> ' + (correct ? correct.text : '?'));
    });

    // BAC
    const bacQs = await prisma.question.findMany({
      where: { stateId: state.id, text: { contains: 'BAC', mode: 'insensitive' } },
      include: { choices: true },
      take: 5,
    });
    console.log('BAC questions: ' + bacQs.length);
    bacQs.slice(0, 2).forEach(q => {
      const correct = q.choices.find(c => c.isCorrect);
      console.log('  Q: ' + q.text.substring(0, 70) + ' -> ' + (correct ? correct.text : '?'));
    });

    // Phone laws
    const phoneQs = await prisma.question.findMany({
      where: { stateId: state.id, OR: [
        { text: { contains: 'cell phone', mode: 'insensitive' } },
        { text: { contains: 'texting', mode: 'insensitive' } },
        { text: { contains: 'hand-held', mode: 'insensitive' } },
      ]},
      include: { choices: true },
      take: 5,
    });
    console.log('Phone law questions: ' + phoneQs.length);
    phoneQs.slice(0, 2).forEach(q => {
      const correct = q.choices.find(c => c.isCorrect);
      console.log('  Q: ' + q.text.substring(0, 70) + ' -> ' + (correct ? correct.text : '?'));
    });
  }
}

main().then(() => prisma.$disconnect());
