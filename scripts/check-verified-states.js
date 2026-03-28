const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const VERIFIED = ['CA','FL','GA','IL','MI','NY','NC','OH','PA','TX','MA','KY','AL','LA','ME'];
const RESTORED = ['AZ','AR','CO','CT'];
const ALL_ACTIVE = [...VERIFIED, ...RESTORED];

async function main() {
  console.log('\n📊 QUESTION INTEGRITY CHECK\n');
  console.log('State | Total | No Correct Ans | Wrong # Choices | Status');
  console.log('------|-------|----------------|-----------------|-------');
  let totalQ = 0, totalBroken = 0;
  for (const code of ALL_ACTIVE) {
    const state = await p.state.findUnique({ where: { code } });
    if (!state) { console.log(code + ' | NOT FOUND'); continue; }
    const qs = await p.question.findMany({ where: { stateId: state.id }, include: { choices: true } });
    const total = qs.length;
    const noCorrect = qs.filter(q => !q.choices.some(c => c.isCorrect)).length;
    const wrongCount = qs.filter(q => q.choices.length !== 4).length;
    const inRange = total >= 320 && total <= 460;
    const clean = noCorrect === 0 && wrongCount === 0;
    const status = inRange && clean ? 'OK' : 'ISSUE';
    const group = VERIFIED.includes(code) ? 'verified' : 'restored';
    totalQ += total;
    totalBroken += noCorrect + wrongCount;
    console.log(code + ' | ' + total + ' | ' + noCorrect + ' | ' + wrongCount + ' | ' + status + ' (' + group + ')');
  }
  console.log('\nTOTAL QUESTIONS: ' + totalQ);
  console.log('TOTAL BROKEN: ' + totalBroken);
}

main().catch(console.error).finally(() => p.$disconnect());
