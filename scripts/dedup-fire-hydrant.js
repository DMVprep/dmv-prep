process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

async function main() {
  const qs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'fire hydrant', mode: 'insensitive' } },
    include: { choices: true },
    orderBy: { createdAt: 'asc' }
  });

  console.log('Fire hydrant questions:', qs.length);
  // Keep first 2, delete rest
  const toDelete = qs.slice(2).map(q => q.id);
  console.log('Keeping:', 2, 'Deleting:', toDelete.length);

  if (toDelete.length > 0) {
    await p.answer.deleteMany({ where: { questionId: { in: toDelete } } });
    await p.userProgress.deleteMany({ where: { questionId: { in: toDelete } } });
    await p.choice.deleteMany({ where: { questionId: { in: toDelete } } });
    await p.question.deleteMany({ where: { id: { in: toDelete } } });
    console.log('Deleted', toDelete.length, 'duplicates');
  }

  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('FL questions remaining:', total);
}

main().catch(console.error).finally(() => p.$disconnect());
