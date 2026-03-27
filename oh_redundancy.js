const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntrsd000y3jd6z8mny40a';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};

// Concepts with ≤3 questions — worth printing in full to check redundancy
// Also print all alcohol questions since that topic is thin
const PRINT_CONCEPTS = {
  'alcohol:bac':           { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':       { topic: TOPIC.ALCOHOL, pattern: /under.*21.*\.02|\.02.*under.*21|under.*21.*alcohol/i },
  'alcohol:chemical-test': { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:suspension':    { topic: TOPIC.ALCOHOL, pattern: /suspend.*OVI|OVI.*suspend|suspend.*DUI|ALS/i },
  'alcohol:open-container':{ topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle/i },
  'speed:signal-distance': { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*feet|100 feet.*turn/i },
  'speed:minimum':         { topic: TOPIC.SPEED,   pattern: /minimum speed|slow.*traffic|impede.*traffic/i },
  'row:funeral':           { topic: TOPIC.ROW,     pattern: /funeral/i },
  'row:intersection':      { topic: TOPIC.ROW,     pattern: /four.way.stop|all.way.stop|right.of.way.*intersect/i },
  'row:motorcycle':        { topic: TOPIC.ROW,     pattern: /motorcycle/i },
  'safe:park-crosswalk':   { topic: TOPIC.SAFE,    pattern: /crosswalk.*park|park.*crosswalk|20 feet.*cross/i },
  'safe:park-stop-sign':   { topic: TOPIC.SAFE,    pattern: /stop sign.*park|park.*stop sign|30 feet.*stop|30 feet.*signal/i },
  'safe:skid':             { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:bike-passing':     { topic: TOPIC.SAFE,    pattern: /3 feet.*bicycl|bicycl.*3 feet|pass.*bicycl|bicycl.*pass/i },
  'license:new-resident':  { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*ohio|30 day.*licens/i },
  'license:address-change':{ topic: TOPIC.LICENSE, pattern: /address.*change|change.*address|10 day/i },
  'license:knowledge-test':{ topic: TOPIC.LICENSE, pattern: /40 question|knowledge test.*40|75.*percent|30.*correct/i },
  'license:permit-duration':{ topic: TOPIC.LICENSE, pattern: /6 month.*permit|six month.*permit|permit.*6 month/i },
  'signs:railroad':        { topic: TOPIC.SIGNS,   pattern: /railroad.*sign|RR.*sign|crossbuck/i },
  'signs:school':          { topic: TOPIC.SIGNS,   pattern: /school.*sign|sign.*school|pentagon|five.sided/i },
  'signs:work-zone':       { topic: TOPIC.SIGNS,   pattern: /work.zone.*sign|orange.*sign|construction.*sign/i },
};

// Also check ALL questions within each concept for semantic redundancy
// by printing question text grouped by concept
async function main() {
  console.log('=== OH REDUNDANCY CHECK ===\n');
  console.log('Printing questions per concept for manual review.\n');
  console.log('Look for: same fact tested multiple times, trivially reworded questions,\n"what is X" asked 3 different ways with same answer.\n');

  const questions = await p.question.findMany({
    where: { stateId: STATE_ID },
    include: { choices: true },
    orderBy: { id: 'asc' },
  });

  for (const [concept, cfg] of Object.entries(PRINT_CONCEPTS)) {
    const matching = questions.filter(q => {
      if (q.topicId !== cfg.topic) return false;
      const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
      return cfg.pattern.test(combined);
    });

    console.log(`\n── ${concept} (${matching.length} questions) ──`);
    if (!matching.length) {
      console.log('  (none)');
      continue;
    }
    for (const q of matching) {
      const correct = q.choices.find(c => c.isCorrect);
      console.log(`  Q: ${q.text}`);
      console.log(`  A: ${correct ? correct.text : 'NO CORRECT ANSWER'}`);
      console.log(`  ID: ${q.id}\n`);
    }
  }

  // Also print full alcohol topic for overview
  console.log('\n\n═══ FULL ALCOHOL TOPIC (all 23 questions) ═══');
  const alcoholQs = questions.filter(q => q.topicId === TOPIC.ALCOHOL);
  for (const q of alcoholQs) {
    const correct = q.choices.find(c => c.isCorrect);
    console.log(`\n  Q: ${q.text}`);
    console.log(`  A: ${correct ? correct.text : 'NO CORRECT ANSWER'}`);
    console.log(`  ID: ${q.id}`);
  }

  console.log(`\n\nTotal OH questions: ${questions.length}`);
  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
