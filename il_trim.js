const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntnlf000c3jd6e2gf6ygd';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};

const MAX_PER_CONCEPT = 8;

async function deleteQuestions(ids) {
  if (!ids.length) return 0;
  const choiceIds = (await p.choice.findMany({
    where: { questionId: { in: ids } }, select: { id: true }
  })).map(c => c.id);
  await p.answer.deleteMany({ where: { choiceId: { in: choiceIds } } });
  await p.$transaction([
    p.answer.deleteMany({ where: { questionId: { in: ids } } }),
    p.userProgress.deleteMany({ where: { questionId: { in: ids } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: ids } } }),
    p.choice.deleteMany({ where: { questionId: { in: ids } } }),
    p.question.deleteMany({ where: { id: { in: ids } } }),
  ]);
  return ids.length;
}

// Score a question — lower = trim first
// Prefer: scenario-based, specific IL facts, unique phrasing
// Penalize: pure recall, vague, very short, no IL-specific detail
function score(q) {
  const text = q.text;
  let s = 50;
  if (text.length > 120) s += 15;           // longer = more nuanced
  if (/you are driving|you notice|you see|you approach|you need/i.test(text)) s += 20; // scenario
  if (/illinois/i.test(text)) s += 10;       // IL-specific
  if (/\d+\s*(mph|feet|foot|inches|hour|day|month|year)/i.test(text)) s += 10; // specific number
  if (text.length < 60) s -= 20;             // too short = generic
  if (/what is the|what does|which of the following/i.test(text) && text.length < 80) s -= 10;
  return s;
}

async function trimConcept(label, topicId, pattern, keep) {
  const qs = await p.question.findMany({
    where: { stateId: STATE_ID, topicId },
    include: { choices: true },
    orderBy: { id: 'asc' },
  });

  const matching = qs.filter(q => {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    return pattern.test(combined);
  });

  if (matching.length <= keep) {
    console.log(`  ${label}: ${matching.length} — already at/under ${keep}, skipping`);
    return 0;
  }

  // Sort: best questions first (highest score)
  matching.sort((a, b) => score(b) - score(a));

  const toDelete = matching.slice(keep).map(q => q.id);
  await deleteQuestions(toDelete);
  console.log(`  ${label}: trimmed ${matching.length} → ${keep} (deleted ${toDelete.length})`);
  return toDelete.length;
}

async function main() {
  console.log('=== IL TRIM ===\n');

  let totalDeleted = 0;
  const before = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`Before: ${before} questions\n`);

  // ── SPEED LIMITS ──────────────────────────────────────────────────────────
  console.log('--- Speed Limits ---');

  totalDeleted += await trimConcept('speed:max-interstate', TOPIC.SPEED,
    /70|interstate|tollway/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('speed:max-highway', TOPIC.SPEED,
    /65|four.lane|4.lane/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('speed:max-alley', TOPIC.SPEED,
    /alley|15\s*mph/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('speed:school-zone', TOPIC.SPEED,
    /school.zone|20\s*mph/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('speed:construction-zone', TOPIC.SPEED,
    /construction.zone|work.zone/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('speed:minimum', TOPIC.SPEED,
    /minimum speed|slow.*traffic|impede.*traffic/i, MAX_PER_CONCEPT);

  // ── RIGHT OF WAY ──────────────────────────────────────────────────────────
  console.log('\n--- Right of Way ---');

  totalDeleted += await trimConcept('row:pedestrian', TOPIC.ROW,
    /pedestrian|crosswalk/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('row:emergency', TOPIC.ROW,
    /emergency vehicle|ambulance|fire truck|police.*siren|siren/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('row:intersection', TOPIC.ROW,
    /intersection.*right.of.way|right.of.way.*intersection|four.way.stop|all.way.stop/i, MAX_PER_CONCEPT);

  // ── SAFE DRIVING ──────────────────────────────────────────────────────────
  console.log('\n--- Safe Driving ---');

  totalDeleted += await trimConcept('safe:headlights', TOPIC.SAFE,
    /headlight|high beam|dim.*light|low beam/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('safe:seatbelt', TOPIC.SAFE,
    /seat.?belt|safety belt/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('safe:weather', TOPIC.SAFE,
    /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('safe:lane-change', TOPIC.SAFE,
    /lane change|change lane|merge/i, MAX_PER_CONCEPT);

  // ── ALCOHOL & SUBSTANCES ──────────────────────────────────────────────────
  console.log('\n--- Alcohol & Substances ---');

  totalDeleted += await trimConcept('alcohol:bac', TOPIC.ALCOHOL,
    /\.08|blood.alcohol|BAC/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('alcohol:dui-penalties', TOPIC.ALCOHOL,
    /DUI.*penalt|penalt.*DUI|revoc.*DUI|DUI.*revoc|one.year.*revoc|first.*DUI/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('alcohol:suspension', TOPIC.ALCOHOL,
    /suspend.*DUI|DUI.*suspend|six month|6 month.*DUI|DUI.*6 month/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('alcohol:aggravated', TOPIC.ALCOHOL,
    /aggravat.*DUI|DUI.*aggravat/i, MAX_PER_CONCEPT);

  // ── LICENSING & PERMITS ───────────────────────────────────────────────────
  console.log('\n--- Licensing & Permits ---');

  totalDeleted += await trimConcept('license:learner-permit', TOPIC.LICENSE,
    /instruction permit|learner.?s? permit|permit.*age|age.*permit/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('license:supervised-hours', TOPIC.LICENSE,
    /50 hour|supervised.*hour|practice.*hour/i, MAX_PER_CONCEPT);

  // ── TRAFFIC SIGNS ─────────────────────────────────────────────────────────
  console.log('\n--- Traffic Signs ---');

  totalDeleted += await trimConcept('signs:warning', TOPIC.SIGNS,
    /warning sign|diamond|yellow.*sign|sign.*yellow/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('signs:regulatory', TOPIC.SIGNS,
    /regulatory|stop sign|yield sign|do not enter|wrong way/i, MAX_PER_CONCEPT);

  totalDeleted += await trimConcept('signs:colors', TOPIC.SIGNS,
    /sign.*color|color.*sign|blue.*sign|brown.*sign|green.*sign/i, MAX_PER_CONCEPT);

  // ── FINAL COUNT ───────────────────────────────────────────────────────────
  const after = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== TRIM COMPLETE ===`);
  console.log(`Before: ${before} | After: ${after} | Deleted: ${totalDeleted}`);
  console.log(`Target: 320–360`);

  if (after > 360) {
    console.log(`⚠ Still ${after - 360} over target — may need another pass`);
  } else if (after < 320) {
    console.log(`⚠ Under target — check concept gaps`);
  } else {
    console.log(`✅ Within target range`);
  }

  // Print final topic breakdown
  console.log('\nFinal topic breakdown:');
  const topicNames = {
    [TOPIC.SIGNS]:   'Traffic Signs',
    [TOPIC.ROW]:     'Right Of Way',
    [TOPIC.SPEED]:   'Speed Limits',
    [TOPIC.SAFE]:    'Safe Driving',
    [TOPIC.ALCOHOL]: 'Alcohol & Substances',
    [TOPIC.LICENSE]: 'Licensing & Permits',
  };
  for (const [tid, name] of Object.entries(topicNames)) {
    const cnt = await p.question.count({ where: { stateId: STATE_ID, topicId: tid } });
    console.log(`  ${name}: ${cnt}`);
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
