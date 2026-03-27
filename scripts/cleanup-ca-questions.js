process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

async function main() {
  const questions = await p.question.findMany({
    where:{stateId:CA_STATE_ID},
    include:{choices:true},
    orderBy:{createdAt:'asc'}
  });
  console.log('Total CA questions:', questions.length);

  const seen = new Map();
  const toDelete = [];
  for (const q of questions) {
    const key = q.text.substring(0,60).toLowerCase().trim();
    if (seen.has(key)) toDelete.push(q.id);
    else seen.set(key, q.id);
  }
  console.log('Duplicates to delete:', toDelete.length);

  if (toDelete.length > 0) {
    await p.answer.deleteMany({where:{questionId:{in:toDelete}}});
    await p.userProgress.deleteMany({where:{questionId:{in:toDelete}}});
    await p.choice.deleteMany({where:{questionId:{in:toDelete}}});
    await p.question.deleteMany({where:{id:{in:toDelete}}});
    console.log('Deleted', toDelete.length, 'duplicates');
  }

  const remaining = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('Remaining:', remaining);
}
main().catch(console.error).finally(()=>p.$disconnect());
