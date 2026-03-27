process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  // Fix Q87: After first year curfew is 1AM-5AM not 1AM-6AM (17yo)
  const q87 = await p.question.findFirst({
    where: { stateId: FL_STATE_ID, text: { contains: 'after the first year with a restricted license', mode: 'insensitive' } },
    include: { choices: true }
  });
  if (q87) {
    console.log('Q87:', q87.text);
    console.log('Choices:', q87.choices.map(c => c.text + (c.isCorrect?' CORRECT':'')).join(' | '));
    const wrongCorrect = q87.choices.find(c => c.isCorrect && c.text.includes('6 AM'));
    const rightAnswer = q87.choices.find(c => !c.isCorrect && c.text.includes('5 AM'));
    if (wrongCorrect && rightAnswer) {
      await p.choice.update({ where: { id: wrongCorrect.id }, data: { isCorrect: false }});
      await p.choice.update({ where: { id: rightAnswer.id }, data: { isCorrect: true }});
      await p.question.update({ where: { id: q87.id }, data: { explanation: 'After the first year (at age 17), the curfew changes to 1 AM to 5 AM. This is less restrictive than the first year (11 PM to 6 AM). Driving to/from work remains an exception.' }});
      console.log('Fixed Q87');
    } else {
      console.log('Q87: no matching choices to swap - deleting');
      await p.choice.deleteMany({ where: { questionId: q87.id }});
      await p.question.delete({ where: { id: q87.id }});
    }
  } else { console.log('Q87 not found'); }

  // Fix Q95 explanation - work IS a valid exception to curfew
  const q95 = await p.question.findFirst({
    where: { stateId: FL_STATE_ID, text: { contains: '5:30 AM', mode: 'insensitive' } }
  });
  if (q95) {
    await p.question.update({ where: { id: q95.id }, data: { explanation: 'Driving to or from work is an explicit exception to Florida\'s teen driving curfew. Even though 5:30 AM falls within the restricted hours (11 PM-6 AM), traveling to work is permitted. Teen drivers should carry proof of employment.' }});
    console.log('Fixed Q95 explanation');
  }

  // Fix Q115: TLSAE replaced by DETS as of August 2025
  const q115 = await p.question.findFirst({
    where: { stateId: FL_STATE_ID, text: { contains: 'TLSAE', mode: 'insensitive' } },
    include: { choices: true }
  });
  if (q115) {
    await p.question.update({ where: { id: q115.id }, data: {
      text: 'Which mandatory course must be completed before obtaining a learner\'s permit in Florida as of August 2025?',
      explanation: 'As of August 1, 2025, Florida replaced the 4-hour TLSAE course with the 6-hour Driver Education Traffic Safety (DETS) course. This course is mandatory for all first-time permit applicants who are minors.'
    }});
    const tlsaeChoice = q115.choices.find(c => c.isCorrect && c.text.includes('TLSAE'));
    if (tlsaeChoice) {
      await p.choice.update({ where: { id: tlsaeChoice.id }, data: { text: 'DETS (Driver Education Traffic Safety) — 6-hour course' }});
    }
    const wrongDets = q115.choices.find(c => !c.isCorrect && c.text.includes('DETS'));
    if (wrongDets) {
      await p.choice.update({ where: { id: wrongDets.id }, data: { isCorrect: false, text: 'TLSAE (Traffic Law and Substance Abuse Education) — 4-hour course' }});
    }
    console.log('Fixed Q115: TLSAE updated to DETS');
  }

  // Fix Q112: 13 months -> curfew should be 1AM-5AM
  const q112 = await p.question.findFirst({
    where: { stateId: FL_STATE_ID, text: { contains: '13 months', mode: 'insensitive' } },
    include: { choices: true }
  });
  if (q112) {
    const correct = q112.choices.find(c => c.isCorrect);
    console.log('Q112 current answer:', correct?.text);
    if (correct && correct.text.includes('6 AM')) {
      const rightChoice = q112.choices.find(c => !c.isCorrect && c.text.includes('5 AM'));
      if (rightChoice) {
        await p.choice.update({ where: { id: correct.id }, data: { isCorrect: false }});
        await p.choice.update({ where: { id: rightChoice.id }, data: { isCorrect: true }});
        await p.question.update({ where: { id: q112.id }, data: { explanation: 'After the first year with a restricted license (now age 17), the curfew is 1 AM to 5 AM — not 6 AM. The curfew for 17-year-olds ends at 5 AM.' }});
        console.log('Fixed Q112');
      } else {
        console.log('Q112: deleting - no 5AM option found');
        await p.choice.deleteMany({ where: { questionId: q112.id }});
        await p.question.delete({ where: { id: q112.id }});
      }
    }
  }

  const total = await p.question.count({ where: { stateId: FL_STATE_ID }});
  console.log('\nFL questions remaining:', total);
}
main().catch(console.error).finally(() => p.$disconnect());
