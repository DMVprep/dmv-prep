process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  let fixed = 0;

  // Fix 1: minimum highway speed 50mph -> 40mph (where 40mph option exists)
  const minSpeedQs = await p.question.findMany({
    where: {
      stateId: FL_STATE_ID,
      text: { contains: 'minimum', mode: 'insensitive' },
      choices: { some: { isCorrect: true, text: { contains: '50 MPH' } } }
    },
    include: { choices: true }
  });

  for (const q of minSpeedQs) {
    const wrongCorrect = q.choices.find(c => c.isCorrect && c.text.includes('50 MPH'));
    const rightAnswer = q.choices.find(c => !c.isCorrect && (c.text.includes('40 MPH') || c.text.includes('40 mph')));
    if (wrongCorrect && rightAnswer) {
      await p.choice.update({ where: { id: wrongCorrect.id }, data: { isCorrect: false } });
      await p.choice.update({ where: { id: rightAnswer.id }, data: { isCorrect: true } });
      console.log('Fixed min speed:', q.text.substring(0, 60));
      fixed++;
    } else if (wrongCorrect) {
      // No 40mph option - delete this question
      await p.answer.deleteMany({ where: { questionId: q.id } });
      await p.userProgress.deleteMany({ where: { questionId: q.id } });
      await p.choice.deleteMany({ where: { questionId: q.id } });
      await p.question.delete({ where: { id: q.id } });
      console.log('Deleted bad question:', q.text.substring(0, 60));
      fixed++;
    }
  }

  // Fix 2: residential 25mph -> 30mph
  const res25Qs = await p.question.findMany({
    where: {
      stateId: FL_STATE_ID,
      text: { contains: 'residential', mode: 'insensitive' },
      choices: { some: { isCorrect: true, text: { contains: '25' } } }
    },
    include: { choices: true }
  });

  for (const q of res25Qs) {
    const wrongCorrect = q.choices.find(c => c.isCorrect && c.text.includes('25'));
    const rightAnswer = q.choices.find(c => !c.isCorrect && c.text.includes('30'));
    if (wrongCorrect && rightAnswer) {
      await p.choice.update({ where: { id: wrongCorrect.id }, data: { isCorrect: false } });
      await p.choice.update({ where: { id: rightAnswer.id }, data: { isCorrect: true } });
      console.log('Fixed residential speed:', q.text.substring(0, 60));
      fixed++;
    } else {
      // Delete bad question
      await p.answer.deleteMany({ where: { questionId: q.id } });
      await p.userProgress.deleteMany({ where: { questionId: q.id } });
      await p.choice.deleteMany({ where: { questionId: q.id } });
      await p.question.delete({ where: { id: q.id } });
      console.log('Deleted bad residential question:', q.text.substring(0, 60));
      fixed++;
    }
  }

  console.log('\nTotal fixed/deleted:', fixed);
  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('FL questions remaining:', total);
}

main().catch(console.error).finally(() => p.$disconnect());
