process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

// Known correct FL facts
const KNOWN_FACTS = [
  { pattern: /fire hydrant/i, correctShouldContain: '15', label: 'Fire hydrant distance' },
  { pattern: /railroad crossing.*stop|stop.*railroad/i, correctShouldContain: '15', label: 'RR crossing stop distance' },
  { pattern: /following distance/i, correctShouldContain: ['3 second','4 second'], label: 'Following distance' },
  { pattern: /school zone.*speed|speed.*school zone/i, correctShouldContain: '20', label: 'School zone speed' },
  { pattern: /residential.*speed|speed.*residential/i, correctShouldContain: '30', label: 'Residential speed' },
  { pattern: /highway.*speed|speed.*highway/i, correctShouldContain: '55', label: 'Highway speed' },
  { pattern: /BAC.*adult|adult.*BAC/i, correctShouldContain: '0.08', label: 'Adult BAC' },
  { pattern: /BAC.*minor|minor.*BAC|under 21.*BAC/i, correctShouldContain: '0.02', label: 'Minor BAC' },
  { pattern: /intersection.*park|park.*intersection/i, correctShouldContain: '20', label: 'Intersection parking' },
  { pattern: /permit.*age|age.*permit/i, correctShouldContain: '15', label: 'Permit age' },
];

async function main() {
  const questions = await p.question.findMany({
    where: { stateId: FL_STATE_ID },
    include: { choices: true }
  });

  console.log('Checking', questions.length, 'questions...\n');
  let issues = 0;

  for (const q of questions) {
    const correct = q.choices.find(c => c.isCorrect);
    if (!correct) continue;

    for (const fact of KNOWN_FACTS) {
      if (fact.pattern.test(q.text)) {
        const expected = Array.isArray(fact.correctShouldContain) 
          ? fact.correctShouldContain 
          : [fact.correctShouldContain];
        const matches = expected.some(e => correct.text.includes(e));
        if (!matches) {
          console.log('ISSUE ['+fact.label+']');
          console.log('Q: '+q.text.substring(0,100));
          console.log('CORRECT: '+correct.text);
          console.log('EXPECTED to contain: '+expected.join(' or '));
          console.log('---');
          issues++;
        }
      }
    }
  }

  console.log('\nTotal issues found:', issues);
}

main().catch(console.error).finally(()=>p.$disconnect());
