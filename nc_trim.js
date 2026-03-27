const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntret000w3jd6x7hr74xe';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};
const MAX = 8;

async function deleteQuestions(ids) {
  if (!ids.length) return 0;
  await p.$transaction([
    p.userProgress.deleteMany({ where: { questionId: { in: ids } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: ids } } }),
    p.choice.deleteMany({ where: { questionId: { in: ids } } }),
    p.question.deleteMany({ where: { id: { in: ids } } }),
  ]);
  return ids.length;
}

function score(q) {
  const t = q.text;
  let s = 50;
  if (t.length > 120) s += 15;
  if (/you are driving|you see|you approach|you notice|you're|you enter/i.test(t)) s += 20;
  if (/north carolina|NC/i.test(t)) s += 10;
  if (/\d+\s*(mph|feet|foot|%|hour|day|month)/i.test(t)) s += 10;
  if (t.length < 60) s -= 20;
  return s;
}

async function trimConcept(label, topicId, pattern, keep) {
  const qs = await p.question.findMany({
    where: { stateId: STATE_ID, topicId },
    include: { choices: true },
    orderBy: { id: 'asc' },
  });
  const matching = qs.filter(q => pattern.test(q.text + ' ' + q.choices.map(c => c.text).join(' ')));
  if (matching.length <= keep) {
    console.log(`  ${label}: ${matching.length} — ok`);
    return 0;
  }
  matching.sort((a, b) => score(b) - score(a));
  const toDelete = matching.slice(keep).map(q => q.id);
  await deleteQuestions(toDelete);
  console.log(`  ${label}: ${matching.length} → ${keep} (deleted ${toDelete.length})`);
  return toDelete.length;
}

async function main() {
  console.log('=== NC TRIM ===\n');
  const before = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`Before: ${before}\n`);
  let deleted = 0;

  console.log('--- Speed Limits ---');
  deleted += await trimConcept('speed:max-interstate',    TOPIC.SPEED,   /70|interstate/i, MAX);
  deleted += await trimConcept('speed:max-city',         TOPIC.SPEED,   /35\s*mph|city.*speed|town.*35|35.*town|urban.*35|35.*urban|residential.*speed|speed.*residential/i, MAX);
  deleted += await trimConcept('speed:construction-zone',TOPIC.SPEED,   /construction.zone|work.zone/i, MAX);

  console.log('\n--- Right of Way ---');
  deleted += await trimConcept('row:pedestrian', TOPIC.ROW, /pedestrian|crosswalk/i, MAX);
  deleted += await trimConcept('row:emergency',  TOPIC.ROW, /emergency vehicle|ambulance|fire truck|siren/i, MAX);

  console.log('\n--- Safe Driving ---');
  deleted += await trimConcept('safe:headlights', TOPIC.SAFE, /headlight|high beam|dim.*light|low beam/i, MAX);
  deleted += await trimConcept('safe:seatbelt',   TOPIC.SAFE, /seat.?belt|safety belt/i, MAX);
  deleted += await trimConcept('safe:texting',    TOPIC.SAFE, /text|cell.?phone|handheld|hands.free/i, MAX);
  deleted += await trimConcept('safe:weather',    TOPIC.SAFE, /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i, MAX);
  deleted += await trimConcept('safe:lane-change',TOPIC.SAFE, /lane change|change lane|merge/i, MAX);

  console.log('\n--- Alcohol ---');
  deleted += await trimConcept('alcohol:bac',          TOPIC.ALCOHOL, /\.08|blood.alcohol|BAC/i, MAX);
  deleted += await trimConcept('alcohol:dwi-penalties',TOPIC.ALCOHOL, /DWI.*penalt|penalt.*DWI|DWI.*convict|first.*DWI/i, MAX);

  console.log('\n--- Licensing ---');
  deleted += await trimConcept('license:level1', TOPIC.LICENSE, /level.?one|level 1|limited learner|learner permit/i, MAX);
  deleted += await trimConcept('license:level2', TOPIC.LICENSE, /level.?two|level 2|limited provisional/i, MAX);

  console.log('\n--- Traffic Signs ---');
  deleted += await trimConcept('signs:warning',    TOPIC.SIGNS, /warning sign|diamond|yellow.*sign/i, MAX);
  deleted += await trimConcept('signs:regulatory', TOPIC.SIGNS, /regulatory|stop sign|yield sign|do not enter|wrong way/i, MAX);
  deleted += await trimConcept('signs:colors',     TOPIC.SIGNS, /sign.*color|color.*sign|blue.*sign|brown.*sign/i, MAX);

  const after = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== TRIM COMPLETE ===`);
  console.log(`Before: ${before} | After: ${after} | Deleted: ${deleted}`);
  console.log(`Target: 320–360`);
  if (after > 360) console.log(`⚠ Still ${after - 360} over`);
  else if (after < 320) console.log(`⚠ Under target`);
  else console.log(`✅ Within target range`);

  const topicNames = {
    [TOPIC.SIGNS]:'Traffic Signs',[TOPIC.ROW]:'Right Of Way',
    [TOPIC.SPEED]:'Speed Limits',[TOPIC.SAFE]:'Safe Driving',
    [TOPIC.ALCOHOL]:'Alcohol & Substances',[TOPIC.LICENSE]:'Licensing & Permits',
  };
  console.log('\nFinal topic breakdown:');
  for (const [tid, name] of Object.entries(topicNames)) {
    const cnt = await p.question.count({ where: { stateId: STATE_ID, topicId: tid } });
    console.log(`  ${name}: ${cnt}`);
  }

  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
