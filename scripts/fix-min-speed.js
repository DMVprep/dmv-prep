process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  // Find questions where correct answer is 50 MPH as minimum highway speed
  const questions = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'minimum', mode: 'insensitive' } },
    include: { choices: true }
  });

  let fixed = 0;
  for (const q of questions) {
    const correct = q.choices.find(c => c.isCorrect);
    if (correct && correct.text.includes('50 MPH')) {
      // Check if there's a 40 mph option
      const fortyOpt = q.choices.find(c => c.text.toLowerCase().includes('40'));
      console.log('Q:', q.text.substring(0, 80));
      console.log('Current correct:', correct.text);
      console.log('40mph option:', fortyOpt ? fortyOpt.text : 'NOT FOUND');
      console.log('---');
    }
  }

  // Fix residential 25mph -> should be 30mph
  const res25 = await p.question.findMany({
    where: {
      stateId: FL_STATE_ID,
      text: { contains: 'residential', mode: 'insensitive' },
      choices: { some: { isCorrect: true, text: { contains: '25' } } }
    },
    include: { choices: true }
  });

  console.log('\nResidential 25mph questions:', res25.length);
  res25.forEach(q => {
    const correct = q.choices.find(c => c.isCorrect);
    console.log('Q:', q.text.substring(0, 80));
    console.log('CORRECT:', correct?.text);
    console.log('---');
  });
}

main().catch(console.error).finally(() => p.$disconnect());
