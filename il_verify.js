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

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const intersection = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? intersection / union : 0;
}

const CONCEPTS = {
  'speed:max-interstate':    { topic: TOPIC.SPEED,   pattern: /70|interstate|tollway/i },
  'speed:max-highway':       { topic: TOPIC.SPEED,   pattern: /65|four.lane|4.lane/i },
  'speed:max-city':          { topic: TOPIC.SPEED,   pattern: /30\s*mph.*cit|city.*30|30.*city|urban.*30|30.*urban/i },
  'speed:max-alley':         { topic: TOPIC.SPEED,   pattern: /alley|15\s*mph/i },
  'speed:school-zone':       { topic: TOPIC.SPEED,   pattern: /school.zone|20\s*mph/i },
  'speed:construction-zone': { topic: TOPIC.SPEED,   pattern: /construction.zone|work.zone/i },
  'speed:following':         { topic: TOPIC.SPEED,   pattern: /following.dist|3.second|three.second|tailgat/i },
  'speed:signal-distance':   { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*200|200.*signal|signal.*feet|100 feet.*turn|200 feet.*turn/i },
  'speed:minimum':           { topic: TOPIC.SPEED,   pattern: /minimum speed|slow.*traffic|impede.*traffic/i },
  'row:pedestrian':          { topic: TOPIC.ROW,     pattern: /pedestrian|crosswalk/i },
  'row:school-bus':          { topic: TOPIC.ROW,     pattern: /school bus/i },
  'row:emergency':           { topic: TOPIC.ROW,     pattern: /emergency vehicle|ambulance|fire truck|siren/i },
  'row:roundabout':          { topic: TOPIC.ROW,     pattern: /roundabout|traffic circle/i },
  'row:intersection':        { topic: TOPIC.ROW,     pattern: /four.way.stop|all.way.stop|right.of.way.*intersect/i },
  'row:funeral':             { topic: TOPIC.ROW,     pattern: /funeral/i },
  'row:bicycle':             { topic: TOPIC.ROW,     pattern: /bicycl|cyclist/i },
  'row:motorcycle':          { topic: TOPIC.ROW,     pattern: /motorcycle/i },
  'safe:parallel-park':      { topic: TOPIC.SAFE,    pattern: /parallel park|12 inch|curb.*park|park.*curb/i },
  'safe:park-hydrant':       { topic: TOPIC.SAFE,    pattern: /fire hydrant|hydrant/i },
  'safe:park-crosswalk':     { topic: TOPIC.SAFE,    pattern: /crosswalk.*park|park.*crosswalk|fire station.*20|20.*fire station/i },
  'safe:park-railroad':      { topic: TOPIC.SAFE,    pattern: /railroad.*park|park.*railroad|50 feet.*rail/i },
  'safe:park-stop-sign':     { topic: TOPIC.SAFE,    pattern: /stop sign.*park|park.*stop sign|30 feet.*stop|30 feet.*yield/i },
  'safe:park-hill':          { topic: TOPIC.SAFE,    pattern: /hill.*park|park.*hill|uphill|downhill.*park/i },
  'safe:passing':            { topic: TOPIC.SAFE,    pattern: /pass.*vehicle|no.passing|passing.zone|solid yellow/i },
  'safe:headlights':         { topic: TOPIC.SAFE,    pattern: /headlight|high beam|dim.*light|low beam/i },
  'safe:seatbelt':           { topic: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
  'safe:texting':            { topic: TOPIC.SAFE,    pattern: /text|cell.?phone|handheld|wireless.*device|under.*19/i },
  'safe:skid':               { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:weather':            { topic: TOPIC.SAFE,    pattern: /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i },
  'safe:turning':            { topic: TOPIC.SAFE,    pattern: /left turn|right turn|u.turn/i },
  'safe:lane-change':        { topic: TOPIC.SAFE,    pattern: /lane change|change lane|merge/i },
  'safe:bike-passing':       { topic: TOPIC.SAFE,    pattern: /3 feet.*bicycl|bicycl.*3 feet|pass.*bicycl|bicycl.*pass/i },
  'alcohol:bac':             { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':         { topic: TOPIC.ALCOHOL, pattern: /under.*21.*alcohol|zero.toleran|any trace/i },
  'alcohol:dui-penalties':   { topic: TOPIC.ALCOHOL, pattern: /DUI.*penalt|penalt.*DUI|revoc.*DUI|DUI.*revoc|first.*DUI/i },
  'alcohol:chemical-test':   { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:suspension':      { topic: TOPIC.ALCOHOL, pattern: /suspend.*DUI|DUI.*suspend|six month|6 month.*DUI/i },
  'alcohol:aggravated':      { topic: TOPIC.ALCOHOL, pattern: /aggravat.*DUI|DUI.*aggravat/i },
  'alcohol:cannabis':        { topic: TOPIC.ALCOHOL, pattern: /cannabis|marijuana|THC/i },
  'alcohol:open-container':  { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle|drink.*driv/i },
  'license:learner-permit':  { topic: TOPIC.LICENSE, pattern: /instruction permit|learner.?s? permit/i },
  'license:gdl':             { topic: TOPIC.LICENSE, pattern: /graduated|GDL|initial licens/i },
  'license:gdl-curfew':      { topic: TOPIC.LICENSE, pattern: /curfew|10 p\.?m|11 p\.?m|nighttime.*restrict/i },
  'license:gdl-passengers':  { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger/i },
  'license:new-resident':    { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*illinois|90 day/i },
  'license:address-change':  { topic: TOPIC.LICENSE, pattern: /address.*change|change.*address|10 day/i },
  'license:name-change':     { topic: TOPIC.LICENSE, pattern: /name.*change|change.*name|30 day/i },
  'license:supervised-hours':{ topic: TOPIC.LICENSE, pattern: /50 hour|supervised.*hour|practice.*hour/i },
  'license:permit-duration': { topic: TOPIC.LICENSE, pattern: /9 month|nine month|permit.*hold/i },
  'license:suspension':      { topic: TOPIC.LICENSE, pattern: /suspend.*licens|licens.*suspend/i },
  'license:points':          { topic: TOPIC.LICENSE, pattern: /point.*system|3.*violation|three.*violation/i },
  'signs:warning':           { topic: TOPIC.SIGNS,   pattern: /warning sign|diamond|yellow.*sign/i },
  'signs:railroad':          { topic: TOPIC.SIGNS,   pattern: /railroad.*sign|RR.*sign|crossbuck/i },
  'signs:school':            { topic: TOPIC.SIGNS,   pattern: /school.*sign|sign.*school|pentagon|five.sided/i },
  'signs:work-zone':         { topic: TOPIC.SIGNS,   pattern: /work.zone.*sign|orange.*sign|construction.*sign/i },
  'signs:regulatory':        { topic: TOPIC.SIGNS,   pattern: /regulatory|stop sign|yield sign|do not enter|wrong way/i },
  'signs:green-arrow':       { topic: TOPIC.SIGNS,   pattern: /green arrow|protected turn/i },
  'signs:flashing':          { topic: TOPIC.SIGNS,   pattern: /flashing.*light|flashing.*signal|flash.*yellow|flash.*red/i },
  'signs:colors':            { topic: TOPIC.SIGNS,   pattern: /sign.*color|color.*sign|blue.*sign|brown.*sign/i },
  'signs:shapes':            { topic: TOPIC.SIGNS,   pattern: /octagon|shape.*sign|eight.sided|triangle.*sign/i },
};

async function main() {
  console.log('=== IL FINAL VERIFICATION ===\n');

  const questions = await p.question.findMany({
    where: { stateId: STATE_ID },
    include: { choices: true, topic: { select: { name: true, id: true } } },
    orderBy: { topicId: 'asc' },
  });

  console.log(`Total: ${questions.length}\n`);

  // ── 1. TOPIC DISTRIBUTION ────────────────────────────────────────────────
  console.log('=== TOPIC DISTRIBUTION ===');
  const topicNames = {
    [TOPIC.SIGNS]:   'Traffic Signs',
    [TOPIC.ROW]:     'Right Of Way',
    [TOPIC.SPEED]:   'Speed Limits',
    [TOPIC.SAFE]:    'Safe Driving',
    [TOPIC.ALCOHOL]: 'Alcohol & Substances',
    [TOPIC.LICENSE]: 'Licensing & Permits',
  };
  const byTopic = {};
  for (const q of questions) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }
  const idealPerTopic = Math.round(questions.length / 6);
  for (const [tid, qs] of Object.entries(byTopic)) {
    const pct = Math.round(qs.length / questions.length * 100);
    const flag = qs.length > idealPerTopic * 1.4 ? ' ⚠ HIGH' : qs.length < idealPerTopic * 0.6 ? ' ⚠ LOW' : '';
    console.log(`  ${topicNames[tid]}: ${qs.length} (${pct}%)${flag}`);
  }
  console.log(`  Ideal per topic: ~${idealPerTopic}`);

  // ── 2. CONCEPT COVERAGE ──────────────────────────────────────────────────
  console.log('\n=== CONCEPT COVERAGE ===');
  const coverage = {};
  for (const concept of Object.keys(CONCEPTS)) coverage[concept] = [];

  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const [concept, cfg] of Object.entries(CONCEPTS)) {
      if (cfg.topic === q.topicId && cfg.pattern.test(combined)) {
        coverage[concept].push(q.id);
      }
    }
  }

  const gaps = [], over = [], ok = [];
  for (const [c, ids] of Object.entries(coverage)) {
    if (ids.length === 0) gaps.push(c);
    else if (ids.length > 8) over.push({ c, n: ids.length });
    else ok.push({ c, n: ids.length });
  }

  if (gaps.length) {
    console.log(`\nGAPS (${gaps.length}):`);
    gaps.forEach(g => console.log(`  ❌ ${g}`));
  } else {
    console.log('\n✅ No gaps');
  }

  if (over.length) {
    console.log(`\nSTILL OVER-TESTED (${over.length}):`);
    over.forEach(o => console.log(`  ⚠ ${o.c}: ${o.n}`));
  } else {
    console.log('✅ No over-tested concepts');
  }

  console.log('\nAll concept counts:');
  for (const [c, ids] of Object.entries(coverage)) {
    const flag = ids.length === 0 ? ' ❌' : ids.length > 8 ? ` ⚠(${ids.length})` : '';
    console.log(`  ${c}: ${ids.length}${flag}`);
  }

  // ── 3. DUPLICATE SCAN ────────────────────────────────────────────────────
  console.log('\n=== DUPLICATE SCAN (≥65% similarity) ===');
  const dupes = [];
  for (const [tid, qs] of Object.entries(byTopic)) {
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const sim = similarity(qs[i].text, qs[j].text);
        if (sim >= 0.65) {
          dupes.push({
            sim: Math.round(sim * 100),
            topic: qs[i].topic.name,
            id1: qs[i].id, q1: qs[i].text.substring(0, 90),
            id2: qs[j].id, q2: qs[j].text.substring(0, 90),
          });
        }
      }
    }
  }
  dupes.sort((a, b) => b.sim - a.sim);

  if (!dupes.length) {
    console.log('✅ No duplicates found');
  } else {
    console.log(`Found ${dupes.length} similar pairs:\n`);
    for (const d of dupes) {
      console.log(`  [${d.topic}] ${d.sim}% similar`);
      console.log(`  A: (${d.id1}) ${d.q1}`);
      console.log(`  B: (${d.id2}) ${d.q2}\n`);
    }
  }

  // ── 4. QUESTIONS WITH NO CORRECT ANSWER ──────────────────────────────────
  console.log('=== QUESTIONS WITH NO CORRECT ANSWER ===');
  const broken = questions.filter(q => !q.choices.some(c => c.isCorrect));
  if (!broken.length) {
    console.log('✅ All questions have a correct answer');
  } else {
    console.log(`Found ${broken.length} broken questions:`);
    broken.forEach(q => console.log(`  [${q.topic.name}] ${q.id}: ${q.text.substring(0, 80)}`));
  }

  // ── 5. QUESTIONS WITH WRONG CHOICE COUNT ─────────────────────────────────
  console.log('\n=== QUESTIONS WITH != 4 CHOICES ===');
  const wrongCount = questions.filter(q => q.choices.length !== 4);
  if (!wrongCount.length) {
    console.log('✅ All questions have exactly 4 choices');
  } else {
    console.log(`Found ${wrongCount.length} questions with wrong choice count:`);
    wrongCount.forEach(q => console.log(`  [${q.topic.name}] ${q.id} (${q.choices.length} choices): ${q.text.substring(0, 70)}`));
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total: ${questions.length} | Gaps: ${gaps.length} | Over-tested: ${over.length} | Dupes: ${dupes.length} | Broken: ${broken.length} | Wrong choice count: ${wrongCount.length}`);
  if (gaps.length === 0 && over.length === 0 && dupes.length === 0 && broken.length === 0 && wrongCount.length === 0) {
    console.log('✅ Ready to deploy');
  } else {
    console.log('⚠ Issues found — review above before deploying');
  }

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
