process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

async function deleteQ(id) {
  await p.answer.deleteMany({where:{questionId:id}});
  await p.userProgress.deleteMany({where:{questionId:id}});
  await p.choice.deleteMany({where:{questionId:id}});
  await p.question.delete({where:{id}});
}

async function main() {
  let deleted = 0;

  // Delete Q58: "slow to 50 mph" Move Over - wrong for CA (no specific speed required)
  const moveOver50 = await p.question.findMany({
    where: { stateId: CA_STATE_ID, choices: { some: { isCorrect: true, text: { contains: '50 mph', mode: 'insensitive' } } } }
  });
  for (const q of moveOver50) {
    console.log('Deleting wrong Move Over Q:', q.text.substring(0,80));
    await deleteQ(q.id); deleted++;
  }

  // Delete Q53: "within 300 feet" emergency vehicle stop rule - not CA law
  const feet300 = await p.question.findMany({
    where: { stateId: CA_STATE_ID, choices: { some: { isCorrect: true, text: { contains: '300 feet', mode: 'insensitive' } } },
      text: { contains: 'emergency vehicle', mode: 'insensitive' } }
  });
  for (const q of feet300) {
    console.log('Deleting wrong 300 feet Q:', q.text.substring(0,80));
    await deleteQ(q.id); deleted++;
  }

  // Fix school zone: AB 382 allows local reduction to 20mph but 25mph is still the statewide default
  // Questions saying school zone is 20mph need to be deleted or corrected
  const school20 = await p.question.findMany({
    where: { stateId: CA_STATE_ID, choices: { some: { isCorrect: true, text: { contains: '20', mode: 'insensitive' } } },
      text: { contains: 'school', mode: 'insensitive' } }
  });
  for (const q of school20) {
    console.log('Deleting wrong school zone 20mph Q:', q.text.substring(0,80));
    await deleteQ(q.id); deleted++;
  }

  // Fix Right Of Way Q5/Q15/Q37: "one-third of a mile" for passing on hills - verify this is correct CA law
  // This IS correct per CA handbook - keeping these

  // Fix Q45 in Licensing: "10 days for address change" - verify
  // This IS correct - keeping

  // Delete duplicate "reaction time becomes slower" questions in Alcohol
  const reactionQs = await p.question.findMany({
    where: { stateId: CA_STATE_ID, text: { contains: 'reaction time', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (reactionQs.length > 2) {
    for (const q of reactionQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed reaction time Qs: ${reactionQs.length} -> 2`);
  }

  // Delete duplicate "peripheral vision" alcohol questions
  const peripheralQs = await p.question.findMany({
    where: { stateId: CA_STATE_ID, text: { contains: 'peripheral vision', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (peripheralQs.length > 2) {
    for (const q of peripheralQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed peripheral vision Qs: ${peripheralQs.length} -> 2`);
  }

  // Delete duplicate "multitask" alcohol questions
  const multitaskQs = await p.question.findMany({
    where: { stateId: CA_STATE_ID, text: { contains: 'multitask', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (multitaskQs.length > 1) {
    for (const q of multitaskQs.slice(1)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed multitask Qs: ${multitaskQs.length} -> 1`);
  }

  // Delete duplicate "open container" alcohol questions - keep 3
  const openQs = await p.question.findMany({
    where: { stateId: CA_STATE_ID, text: { contains: 'open container', mode: 'insensitive' } },
    orderBy: { createdAt: 'asc' }
  });
  if (openQs.length > 3) {
    for (const q of openQs.slice(3)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed open container Qs: ${openQs.length} -> 3`);
  }

  console.log('\nTotal deleted:', deleted);
  const total = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('CA questions remaining:', total);
  const topics = await p.topic.findMany();
  for (const t of topics) {
    const n = await p.question.count({where:{stateId:CA_STATE_ID, topicId:t.id}});
    console.log(`  ${t.name}: ${n}`);
  }
}
main().catch(console.error).finally(()=>p.$disconnect());
