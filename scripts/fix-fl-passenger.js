process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  // Find and delete Q101 and Q126 about passenger restrictions
  // These imply Florida has statutory passenger limits which it does not
  const passengerQs = await p.question.findMany({
    where: {
      stateId: FL_STATE_ID,
      OR: [
        { text: { contains: 'non-family passenger', mode: 'insensitive' } },
        { text: { contains: 'transport passengers', mode: 'insensitive' } },
        { text: { contains: 'maximum number of non-family', mode: 'insensitive' } },
        { text: { contains: '1 passenger', mode: 'insensitive' } },
        { text: { contains: 'transport friends', mode: 'insensitive' } },
      ]
    },
    include: { choices: true }
  });

  console.log('Passenger restriction questions found:', passengerQs.length);
  passengerQs.forEach(q => {
    const correct = q.choices.find(c => c.isCorrect);
    console.log('Q:', q.text.substring(0, 100));
    console.log('A:', correct?.text);
    console.log('---');
  });

  // Delete them all - Florida has no statutory passenger restriction
  for (const q of passengerQs) {
    await p.answer.deleteMany({ where: { questionId: q.id } });
    await p.userProgress.deleteMany({ where: { questionId: q.id } });
    await p.choice.deleteMany({ where: { questionId: q.id } });
    await p.question.delete({ where: { id: q.id } });
    console.log('Deleted:', q.text.substring(0, 60));
  }

  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('\nFL questions remaining:', total);
}
main().catch(console.error).finally(() => p.$disconnect());
