process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

const KNOWN_FACTS = [
  { pattern: /fire hydrant/i, correct: '15', label: 'Fire hydrant' },
  { pattern: /following distance/i, correct: ['3 second','3-second'], label: 'Following distance' },
  { pattern: /school zone.*speed|speed.*school zone/i, correct: '25', label: 'School zone speed' },
  { pattern: /residential.*speed|speed.*residential|business district/i, correct: '25', label: 'Residential speed' },
  { pattern: /BAC.*adult|adult.*BAC|legal.*BAC|BAC.*legal/i, correct: '0.08', label: 'Adult BAC' },
  { pattern: /under 21.*BAC|BAC.*under 21|minor.*BAC|zero tolerance/i, correct: '0.01', label: 'Minor BAC' },
  { pattern: /permit.*age|age.*permit|minimum age.*permit/i, correct: ['15', '16'], label: 'Permit age' },
  { pattern: /freeway.*speed|highway.*speed|speed.*freeway/i, correct: ['65','70'], label: 'Freeway speed' },
];

async function main() {
  const questions = await p.question.findMany({where:{stateId:CA_STATE_ID},include:{choices:true}});
  console.log('Checking', questions.length, 'CA questions...\n');
  let issues = 0;

  for (const q of questions) {
    const correct = q.choices.find(c=>c.isCorrect);
    if (!correct) continue;
    for (const fact of KNOWN_FACTS) {
      if (fact.pattern.test(q.text)) {
        const expected = Array.isArray(fact.correct) ? fact.correct : [fact.correct];
        const matches = expected.some(e => correct.text.includes(e));
        if (!matches) {
          console.log(`ISSUE [${fact.label}]`);
          console.log('Q:', q.text.substring(0,100));
          console.log('CORRECT:', correct.text);
          console.log('EXPECTED:', expected.join(' or '));
          console.log('---');
          issues++;
        }
      }
    }
  }
  console.log('Total issues:', issues);
}
main().catch(console.error).finally(()=>p.$disconnect());
