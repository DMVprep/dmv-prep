const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const ACTIVE = [
  'AL','AR','AZ','CA','CO','CT','FL','GA','IA','IL','IN','KS','KY','LA',
  'MA','MD','ME','MI','MN','MO','MS','NC','NJ','NV','NY','OH','OK','OR',
  'PA','TN','TX','UT','VA','WA','WI'
];

async function main() {
  console.log('\n📊 FULL INTEGRITY CHECK — ALL 35 ACTIVE STATES\n');
  console.log('State | Total | Broken | Status');
  console.log('------|-------|--------|-------');
  let totalQ = 0, totalBroken = 0;
  for (const code of ACTIVE) {
    const state = await p.state.findUnique({ where: { code } });
    if (!state) { console.log(code + ' | NOT FOUND'); continue; }
    const qs = await p.question.findMany({ where: { stateId: state.id }, include: { choices: true } });
    const total = qs.length;
    const noCorrect = qs.filter(q => !q.choices.some(c => c.isCorrect)).length;
    const wrongCount = qs.filter(q => q.choices.length !== 4).length;
    const broken = noCorrect + wrongCount;
    const inRange = total >= 320 && total <= 460;
    const status = inRange && broken === 0 ? '✅' : '❌';
    totalQ += total; totalBroken += broken;
    console.log(code + ' | ' + total + ' | ' + broken + ' | ' + status);
  }
  console.log('\nTOTAL QUESTIONS: ' + totalQ);
  console.log('TOTAL BROKEN: ' + totalBroken);
  console.log(totalBroken === 0 ? '\n✅ All clean.' : '\n❌ Issues found.');
}
main().catch(console.error).finally(() => p.$disconnect());
