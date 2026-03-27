process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

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

async function dedup(topicId, keyword, max) {
  const qs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId, text:{contains:keyword,mode:'insensitive'}},
    orderBy:{createdAt:'asc'}
  });
  if (qs.length > max) {
    for (const q of qs.slice(max)) await deleteQ(q.id);
    return qs.length - max;
  }
  return 0;
}

async function main() {
  let deleted = 0;

  // --- SPEED LIMITS: massive dedup ---
  // "residential" / "25 MPH" questions - keep 4
  deleted += await dedup(TOPIC_IDS.speedLimits, 'residential', 4);
  // "business district" - keep 3
  deleted += await dedup(TOPIC_IDS.speedLimits, 'business district', 3);
  // "school zone" in speed limits - keep 3
  deleted += await dedup(TOPIC_IDS.speedLimits, 'school', 3);
  // "two-lane undivided" - keep 4
  deleted += await dedup(TOPIC_IDS.speedLimits, 'two-lane undivided', 4);
  // "highway" speed limit - keep 4
  deleted += await dedup(TOPIC_IDS.speedLimits, 'highway', 4);
  console.log('After speed limit dedup, deleted so far:', deleted);

  // --- RIGHT OF WAY: remove misplaced topics ---
  // Speed limit questions in right of way
  const rowSpeedQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      OR:[
        {text:{contains:'speed limit',mode:'insensitive'}},
        {text:{contains:'MPH',mode:'insensitive'}},
      ]
    }
  });
  for (const q of rowSpeedQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowSpeedQs.length} speed limit Qs from Right Of Way`);

  // Teen curfew in right of way - delete
  const rowCurfewQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      OR:[{text:{contains:'curfew',mode:'insensitive'}},{text:{contains:'11 p.m',mode:'insensitive'}},{text:{contains:'11 PM',mode:'insensitive'}}]
    }
  });
  for (const q of rowCurfewQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowCurfewQs.length} curfew Qs from Right Of Way`);

  // BAC in right of way - delete
  const rowBACQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      text:{contains:'BAC',mode:'insensitive'}}
  });
  for (const q of rowBACQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowBACQs.length} BAC Qs from Right Of Way`);

  // Permit age in right of way - delete
  const rowPermitQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      OR:[{text:{contains:'permit',mode:'insensitive'}},{text:{contains:'15 and a half',mode:'insensitive'}}]
    }
  });
  for (const q of rowPermitQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowPermitQs.length} permit Qs from Right Of Way`);

  // Passenger restriction in right of way - delete
  const rowPassQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      text:{contains:'passenger',mode:'insensitive'}}
  });
  for (const q of rowPassQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowPassQs.length} passenger Qs from Right Of Way`);

  // Cell phone/hands-free in right of way - delete
  const rowPhoneQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      OR:[{text:{contains:'hands-free',mode:'insensitive'}},{text:{contains:'cell phone',mode:'insensitive'}}]
    }
  });
  for (const q of rowPhoneQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowPhoneQs.length} phone Qs from Right Of Way`);

  // Open container in right of way - delete
  const rowOpenQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.rightOfWay,
      OR:[{text:{contains:'open container',mode:'insensitive'}},{text:{contains:'sealed',mode:'insensitive'}}]
    }
  });
  for (const q of rowOpenQs) { await deleteQ(q.id); deleted++; }
  console.log(`Deleted ${rowOpenQs.length} open container Qs from Right Of Way`);

  // --- TRAFFIC SIGNS: remove misplaced topics ---
  const tsRemove = [
    {field:'BAC',label:'BAC'},
    {field:'curfew',label:'curfew'},
    {field:'11 p.m',label:'curfew 11pm'},
    {field:'hands-free',label:'phone'},
    {field:'permit',label:'permit'},
    {field:'15 and a half',label:'permit age'},
    {field:'sealed',label:'open container'},
    {field:'following distance',label:'following distance'},
  ];
  for (const r of tsRemove) {
    const qs = await p.question.findMany({
      where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.trafficSigns, text:{contains:r.field,mode:'insensitive'}}
    });
    for (const q of qs) { await deleteQ(q.id); deleted++; }
    if (qs.length > 0) console.log(`Deleted ${qs.length} "${r.label}" Qs from Traffic Signs`);
  }
  // Speed limit questions in traffic signs - keep only 5 total
  const tsSpeedQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.trafficSigns,
      OR:[{text:{contains:'speed limit',mode:'insensitive'}},{text:{contains:'MPH',mode:'insensitive'}}]
    },
    orderBy:{createdAt:'asc'}
  });
  if (tsSpeedQs.length > 5) {
    for (const q of tsSpeedQs.slice(5)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed speed limit Qs in Traffic Signs: ${tsSpeedQs.length} -> 5`);
  }

  // --- SAFE DRIVING: remove misplaced topics ---
  // Teen curfew - keep max 2
  const sdCurfewQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.safeDriving,
      OR:[{text:{contains:'curfew',mode:'insensitive'}},{text:{contains:'11 p.m',mode:'insensitive'}},{text:{contains:'11 PM',mode:'insensitive'}}]
    },
    orderBy:{createdAt:'asc'}
  });
  if (sdCurfewQs.length > 2) {
    for (const q of sdCurfewQs.slice(2)) { await deleteQ(q.id); deleted++; }
    console.log(`Trimmed curfew Qs in Safe Driving: ${sdCurfewQs.length} -> 2`);
  }
  // Permit age in safe driving - delete
  const sdPermitQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.safeDriving,
      OR:[{text:{contains:'15 and a half',mode:'insensitive'}},{text:{contains:'learner',mode:'insensitive'}}]
    }
  });
  for (const q of sdPermitQs) { await deleteQ(q.id); deleted++; }
  if (sdPermitQs.length > 0) console.log(`Deleted ${sdPermitQs.length} permit Qs from Safe Driving`);
  // Railroad crossing in safe driving - delete
  const sdRailQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.safeDriving,
      text:{contains:'railroad',mode:'insensitive'}}
  });
  for (const q of sdRailQs) { await deleteQ(q.id); deleted++; }
  if (sdRailQs.length > 0) console.log(`Deleted ${sdRailQs.length} railroad Qs from Safe Driving`);
  // Speed limit in safe driving - delete
  const sdSpeedQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.safeDriving,
      text:{contains:'speed limit',mode:'insensitive'}}
  });
  for (const q of sdSpeedQs) { await deleteQ(q.id); deleted++; }
  if (sdSpeedQs.length > 0) console.log(`Deleted ${sdSpeedQs.length} speed limit Qs from Safe Driving`);

  // --- LICENSING: delete wrong/risky questions ---
  // Delete $39 fee question (wrong - actual fee is $45-46)
  const feeQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.licensing,
      choices:{some:{text:{contains:'$39',mode:'insensitive'}}}}
  });
  for (const q of feeQs) { await deleteQ(q.id); deleted++; console.log('Deleted wrong fee Q'); }
  // Delete vague grace period question
  const graceQs = await p.question.findMany({
    where:{stateId:CA_STATE_ID, topicId:TOPIC_IDS.licensing,
      text:{contains:'grace period',mode:'insensitive'}}
  });
  for (const q of graceQs) { await deleteQ(q.id); deleted++; console.log('Deleted grace period Q'); }

  // --- GLOBAL DEDUP across all topics ---
  // Duplicate Right of Way questions
  deleted += await dedup(TOPIC_IDS.rightOfWay, 'white cane', 1);
  deleted += await dedup(TOPIC_IDS.rightOfWay, 'funeral procession', 1);
  deleted += await dedup(TOPIC_IDS.rightOfWay, '300 feet', 1);
  deleted += await dedup(TOPIC_IDS.rightOfWay, 'roundabout', 2);
  deleted += await dedup(TOPIC_IDS.rightOfWay, 'T-intersection', 1);
  deleted += await dedup(TOPIC_IDS.rightOfWay, 'Move Over', 2);

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
