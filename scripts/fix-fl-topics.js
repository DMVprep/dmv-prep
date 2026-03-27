process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

const TOPIC_IDS = {
  trafficSigns:  'cmmpntv01001e3jd60a0j8onz',
  rightOfWay:    'cmmpntvao001f3jd6afqngfl5',
  speedLimits:   'cmmpntvhy001g3jd6fkjlrbmq',
  safeDriving:   'cmmpntvnw001h3jd6zi1q1365',
  alcohol:       'cmn2ia2ei0000ua6cuap3rywt',
  licensing:     'cmn2ia2n20001ua6cq7y7tood',
};

async function deleteQ(id) {
  await p.answer.deleteMany({where:{questionId:id}});
  await p.userProgress.deleteMany({where:{questionId:id}});
  await p.choice.deleteMany({where:{questionId:id}});
  await p.question.delete({where:{id}});
}

async function main() {
  let deleted = 0;

  // 1. School zone: keep max 4 per topic, delete rest
  const schoolZoneQs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'school zone', mode: 'insensitive' } },
    include: { topic: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log(`School zone questions: ${schoolZoneQs.length}`);
  // Group by topic
  const byTopic = {};
  for (const q of schoolZoneQs) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }
  for (const [topicId, qs] of Object.entries(byTopic)) {
    const limit = topicId === TOPIC_IDS.speedLimits ? 4 : topicId === TOPIC_IDS.trafficSigns ? 3 : 2;
    if (qs.length > limit) {
      const toDelete = qs.slice(limit);
      for (const q of toDelete) { await deleteQ(q.id); deleted++; }
      console.log(`  ${qs[0].topic.name}: ${qs.length} -> ${limit}`);
    }
  }

  // 2. BAC questions: keep max 3 per topic
  const bacQs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'BAC', mode: 'insensitive' } },
    include: { topic: true },
    orderBy: { createdAt: 'asc' }
  });
  console.log(`\nBAC questions: ${bacQs.length}`);
  const bacByTopic = {};
  for (const q of bacQs) {
    if (!bacByTopic[q.topicId]) bacByTopic[q.topicId] = [];
    bacByTopic[q.topicId].push(q);
  }
  for (const [topicId, qs] of Object.entries(bacByTopic)) {
    const limit = topicId === TOPIC_IDS.alcohol ? 4 : 2;
    if (qs.length > limit) {
      const toDelete = qs.slice(limit);
      for (const q of toDelete) { await deleteQ(q.id); deleted++; }
      console.log(`  ${qs[0].topic.name}: ${qs.length} -> ${limit}`);
    }
  }

  // 3. Clearly misplaced: permit age in Right Of Way -> delete
  const misplacedPermit = await p.question.findMany({
    where: { stateId: FL_STATE_ID, topicId: TOPIC_IDS.rightOfWay,
      text: { contains: 'learner', mode: 'insensitive' } }
  });
  for (const q of misplacedPermit) { await deleteQ(q.id); deleted++; console.log(`Deleted misplaced permit Q: ${q.text.substring(0,60)}`); }

  // 4. Minimum/maximum speed in Right Of Way -> delete
  const misplacedSpeed = await p.question.findMany({
    where: { stateId: FL_STATE_ID, topicId: TOPIC_IDS.rightOfWay,
      text: { contains: 'speed limit', mode: 'insensitive' } }
  });
  for (const q of misplacedSpeed) { await deleteQ(q.id); deleted++; console.log(`Deleted misplaced speed Q: ${q.text.substring(0,60)}`); }

  // 5. Speeding buffer myth: keep max 2 total
  const bufferQs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'speeding buffer', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (bufferQs.length > 2) {
    for (const q of bufferQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`\nSpeeding buffer: ${bufferQs.length} -> 2`);
  }

  // 6. "fines are doubled" / "fines doubled": keep max 2 total
  const finesQs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: 'fines are doubled', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (finesQs.length > 2) {
    for (const q of finesQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`Fines doubled: ${finesQs.length} -> 2`);
  }

  // 7. "0.02%" under 21 BAC: keep max 2 total
  const zeroTwoQs = await p.question.findMany({
    where: { stateId: FL_STATE_ID, text: { contains: '0.02%', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (zeroTwoQs.length > 2) {
    for (const q of zeroTwoQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`0.02% BAC: ${zeroTwoQs.length} -> 2`);
  }

  console.log(`\nTotal deleted: ${deleted}`);
  const total = await p.question.count({where:{stateId:FL_STATE_ID}});
  console.log('FL questions remaining:', total);

  // Show final topic distribution
  const topics = await p.topic.findMany();
  for (const t of topics) {
    const n = await p.question.count({where:{stateId:FL_STATE_ID, topicId:t.id}});
    console.log(`  ${t.name}: ${n}`);
  }
}
main().catch(console.error).finally(()=>p.$disconnect());
