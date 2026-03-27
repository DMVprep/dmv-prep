process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

// Key concepts that should appear max N times
const LIMITS = [
  { keyword: 'railroad crossing', max: 4 },
  { keyword: 'school bus', max: 4 },
  { keyword: 'following distance', max: 4 },
  { keyword: 'BAC', max: 6 },
  { keyword: 'move over', max: 4 },
  { keyword: 'center turn lane', max: 3 },
  { keyword: 'right turn on red', max: 3 },
  { keyword: 'intersection.*park\|park.*intersection', max: 3 },
  { keyword: 'residential.*speed\|speed.*residential', max: 4 },
  { keyword: 'minimum speed', max: 3 },
  { keyword: 'permit.*age\|age.*permit', max: 3 },
];

async function main() {
  let totalDeleted = 0;

  for (const limit of LIMITS) {
    const qs = await p.question.findMany({
      where: { stateId: FL_STATE_ID, text: { contains: limit.keyword.split('\\|')[0].split('.*')[0], mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' }
    });

    if (qs.length > limit.max) {
      const toDelete = qs.slice(limit.max).map(q => q.id);
      await p.answer.deleteMany({ where: { questionId: { in: toDelete } } });
      await p.userProgress.deleteMany({ where: { questionId: { in: toDelete } } });
      await p.choice.deleteMany({ where: { questionId: { in: toDelete } } });
      await p.question.deleteMany({ where: { id: { in: toDelete } } });
      console.log(`"${limit.keyword}": had ${qs.length}, kept ${limit.max}, deleted ${toDelete.length}`);
      totalDeleted += toDelete.length;
    } else {
      console.log(`"${limit.keyword}": ${qs.length} (ok)`);
    }
  }

  console.log('\nTotal deleted:', totalDeleted);
  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('FL questions remaining:', total);
}

main().catch(console.error).finally(() => p.$disconnect());
