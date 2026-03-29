const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const ALL = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

async function main() {
  console.log('\n📊 FULL 50-STATE CHECK\n');
  console.log('State | Total | Broken | Status');
  console.log('------|-------|--------|-------');
  let totalQ = 0, totalBroken = 0, below320 = [];
  for (const code of ALL) {
    const s = await p.state.findUnique({ where: { code } });
    if (!s) { console.log(code + ' | NOT IN DB'); continue; }
    const qs = await p.question.findMany({ where: { stateId: s.id }, include: { choices: true } });
    const total = qs.length;
    const broken = qs.filter(q => !q.choices.some(c => c.isCorrect) || q.choices.length !== 4).length;
    const status = total >= 320 && broken === 0 ? '✅' : '❌';
    if (total < 320) below320.push(code + ':' + total);
    totalQ += total; totalBroken += broken;
    console.log(code + ' | ' + total + ' | ' + broken + ' | ' + status);
  }
  console.log('\nTOTAL QUESTIONS: ' + totalQ);
  console.log('TOTAL BROKEN: ' + totalBroken);
  if (below320.length) console.log('BELOW 320: ' + below320.join(', '));
  else console.log('\n✅ All 50 states clean and at target.');
}
main().catch(console.error).finally(() => p.$disconnect());
