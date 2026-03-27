process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

const LIMITS = [
  { keyword: 'fire hydrant', max: 3 },
  { keyword: 'school bus', max: 4 },
  { keyword: 'following distance', max: 4 },
  { keyword: 'BAC', max: 6 },
  { keyword: 'move over', max: 4 },
  { keyword: 'right turn on red', max: 3 },
  { keyword: 'provisional license', max: 5 },
  { keyword: 'cell phone', max: 5 },
  { keyword: 'seatbelt', max: 4 },
  { keyword: 'minimum age', max: 3 },
];

async function main() {
  // Delete the bad "40 MPH difference" question
  const bad = await p.question.findMany({
    where: { stateId: CA_STATE_ID, choices: { some: { isCorrect: true, text: { contains: '40 MPH difference' } } } },
    include: { choices: true }
  });
  console.log('Bad questions found:', bad.length);
  for (const q of bad) {
    await p.answer.deleteMany({where:{questionId:q.id}});
    await p.userProgress.deleteMany({where:{questionId:q.id}});
    await p.choice.deleteMany({where:{questionId:q.id}});
    await p.question.delete({where:{id:q.id}});
    console.log('Deleted:', q.text.substring(0,60));
  }

  // Broad dedup
  let totalDeleted = 0;
  for (const limit of LIMITS) {
    const qs = await p.question.findMany({
      where:{stateId:CA_STATE_ID, text:{contains:limit.keyword,mode:'insensitive'}},
      orderBy:{createdAt:'asc'}
    });
    if (qs.length > limit.max) {
      const toDelete = qs.slice(limit.max).map(q=>q.id);
      await p.answer.deleteMany({where:{questionId:{in:toDelete}}});
      await p.userProgress.deleteMany({where:{questionId:{in:toDelete}}});
      await p.choice.deleteMany({where:{questionId:{in:toDelete}}});
      await p.question.deleteMany({where:{id:{in:toDelete}}});
      console.log(`"${limit.keyword}": had ${qs.length}, kept ${limit.max}, deleted ${toDelete.length}`);
      totalDeleted += toDelete.length;
    } else {
      console.log(`"${limit.keyword}": ${qs.length} (ok)`);
    }
  }
  console.log('\nTotal deleted:', totalDeleted);
  const total = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('CA questions remaining:', total);
}
main().catch(console.error).finally(()=>p.$disconnect());
