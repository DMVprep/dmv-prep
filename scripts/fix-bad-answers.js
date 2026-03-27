process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  // Find the bad fire hydrant question
  const bad = await p.question.findMany({
    where:{
      stateId: FL_STATE_ID,
      choices: { some: { isCorrect: true, text: { contains: '115' } } }
    },
    include:{ choices: true }
  });

  console.log('Bad questions found:', bad.length);
  bad.forEach(q => {
    console.log('Q:', q.text);
    console.log('Choices:', q.choices.map(c => c.text + (c.isCorrect?' (CORRECT)':'')).join(' | '));
    console.log('---');
  });

  // Fix: update correct answer to 15 feet
  for (const q of bad) {
    const wrongChoice = q.choices.find(c => c.isCorrect && c.text.includes('115'));
    const rightChoice = q.choices.find(c => c.text.includes('15 feet') && !c.isCorrect);
    if (wrongChoice && rightChoice) {
      await p.choice.update({ where:{id: wrongChoice.id}, data:{isCorrect: false} });
      await p.choice.update({ where:{id: rightChoice.id}, data:{isCorrect: true} });
      console.log('Fixed question:', q.text.substring(0,60));
    }
  }
}

main().catch(console.error).finally(()=>p.$disconnect());
