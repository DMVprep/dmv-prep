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

// ── OH-SPECIFIC GROUND TRUTH ─────────────────────────────────────────────────
// Key values that differ from other states:
// - New resident: 30 days (not 60 or 90)
// - Address change: 10 days
// - Permit age: 15.5 (not 15 or 16)
// - Permit hold: 6 months (not 9)
// - Supervised hours: 50 (10 at night)
// - Knowledge test: 40 questions, need 30 correct (75%)
// - BAC adult: .08
// - BAC under 21: .02 (NOT zero tolerance — key OH difference)
// - GDL curfew (age 16): midnight–6 AM
// - Interstate: 70 mph
// - Residential: 25 mph
// - School zone: 20 mph
// - Fire hydrant: 10 feet (NOT 15 — key OH difference)
// - Crosswalk/intersection: 20 feet
// - Stop sign/signal: 30 feet
// - Railroad: 50 feet
// - Turn signal: 100 feet
// - Bike passing: 3 feet
// - Following distance: 3-second rule
// - Seatbelt: drivers + front-seat occupants required

const ERROR_PATTERNS = [
  // Wrong new-resident timeframe
  { pattern: /new.*resident.*60 day|60.day.*new.*resident|within 60.*ohio/i,
    msg: 'WRONG: OH new resident = 30 days (not 60)' },
  { pattern: /new.*resident.*90 day|90.day.*new.*resident|within 90.*ohio/i,
    msg: 'WRONG: OH new resident = 30 days (not 90)' },
  // Wrong permit age
  { pattern: /permit.*age 15(?![\.\s]*5)|age 15(?![\.\s]*5).*permit|minimum.*15(?![\.\s]*5).*permit/i,
    msg: 'POSSIBLE: OH permit age = 15½ (not just 15)' },
  { pattern: /permit.*age 16|age 16.*permit|minimum.*16.*permit/i,
    msg: 'WRONG: OH permit age = 15½ (not 16)' },
  // Wrong permit hold
  { pattern: /permit.*9 month|9.month.*permit|nine month.*permit/i,
    msg: 'WRONG: OH permit hold = 6 months (not 9)' },
  { pattern: /permit.*12 month|12.month.*permit/i,
    msg: 'WRONG: OH permit hold = 6 months (not 12)' },
  // Wrong following distance
  { pattern: /4.second rule|four.second rule/i,
    msg: 'WRONG: OH following distance = 3-second rule (not 4)' },
  { pattern: /2.second rule|two.second rule/i,
    msg: 'WRONG: OH following distance = 3-second rule (not 2)' },
  // Wrong BAC adult
  { pattern: /\.10.*BAC|BAC.*\.10|limit.*\.10|\.10.*limit/i,
    msg: 'WRONG: OH adult BAC = .08 (not .10)' },
  // Wrong under-21 BAC — OH is .02, NOT zero tolerance
  { pattern: /under.*21.*zero.toleran|zero.toleran.*under.*21|any trace.*under|under.*any trace/i,
    msg: 'WRONG: OH under-21 BAC = .02 (not zero tolerance — that is IL/NY)' },
  { pattern: /under.*21.*\.00|\.00.*under.*21/i,
    msg: 'WRONG: OH under-21 BAC = .02 (not .00)' },
  // Wrong fire hydrant distance
  { pattern: /fire hydrant.*15 feet|15 feet.*fire hydrant/i,
    msg: 'WRONG: OH fire hydrant = 10 feet (not 15)' },
  { pattern: /fire hydrant.*20 feet|20 feet.*fire hydrant/i,
    msg: 'WRONG: OH fire hydrant = 10 feet (not 20)' },
  // Wrong residential speed
  { pattern: /residential.*30 mph|30 mph.*residential|25 mph.*city|city.*25 mph/i,
    msg: 'POSSIBLE: OH residential = 25 mph (verify context — cities may differ)' },
  // Wrong school zone
  { pattern: /school.zone.*25 mph|25 mph.*school.zone/i,
    msg: 'WRONG: OH school zone = 20 mph (not 25)' },
  { pattern: /school.zone.*15 mph|15 mph.*school.zone/i,
    msg: 'WRONG: OH school zone = 20 mph (not 15)' },
  // Wrong interstate speed
  { pattern: /interstate.*65 mph|65 mph.*interstate/i,
    msg: 'WRONG: OH interstate = 70 mph (not 65)' },
  { pattern: /interstate.*55 mph|55 mph.*interstate/i,
    msg: 'WRONG: OH interstate = 70 mph (not 55)' },
  // Wrong GDL curfew
  { pattern: /curfew.*10 pm|10 pm.*curfew|curfew.*10:00/i,
    msg: 'WRONG: OH GDL curfew = midnight (not 10 PM)' },
  { pattern: /curfew.*11 pm|11 pm.*curfew/i,
    msg: 'WRONG: OH GDL curfew = midnight (not 11 PM)' },
  // Wrong supervised hours
  { pattern: /65 hour|sixty.five hour/i,
    msg: 'WRONG: OH supervised hours = 50 (not 65)' },
  { pattern: /40 hour.*supervis|supervis.*40 hour/i,
    msg: 'WRONG: OH supervised hours = 50 (not 40)' },
  // Wrong turn signal distance
  { pattern: /turn signal.*50 feet|50 feet.*turn signal/i,
    msg: 'WRONG: OH turn signal = 100 feet (not 50)' },
  { pattern: /turn signal.*200 feet|200 feet.*turn signal/i,
    msg: 'WRONG: OH turn signal = 100 feet (not 200)' },
  // Wrong bike passing
  { pattern: /bicycl.*4 feet|4 feet.*bicycl/i,
    msg: 'WRONG: OH bike passing = 3 feet (not 4)' },
  // Wrong knowledge test count
  { pattern: /35 question|knowledge.*35|35.*knowledge test/i,
    msg: 'WRONG: OH knowledge test = 40 questions (not 35)' },
  { pattern: /20 question|knowledge.*20|20.*knowledge test/i,
    msg: 'WRONG: OH knowledge test = 40 questions (not 20)' },
  // Wrong railroad distance
  { pattern: /railroad.*10 feet|10 feet.*railroad.*stop/i,
    msg: 'WRONG: OH railroad crossing stop = within 50 feet of nearest rail' },
  // Wrong address change
  { pattern: /address.*change.*30 day|30.day.*address/i,
    msg: 'WRONG: OH address change = 10 days (not 30)' },
  { pattern: /address.*change.*15 day|15.day.*address/i,
    msg: 'WRONG: OH address change = 10 days (not 15)' },
];

const CONCEPTS = {
  'speed:max-interstate':    { topic: TOPIC.SPEED,   pattern: /70|interstate/i },
  'speed:max-residential':   { topic: TOPIC.SPEED,   pattern: /25\s*mph|residential.*speed|speed.*residential/i },
  'speed:school-zone':       { topic: TOPIC.SPEED,   pattern: /school.zone|20\s*mph/i },
  'speed:construction-zone': { topic: TOPIC.SPEED,   pattern: /construction.zone|work.zone/i },
  'speed:following':         { topic: TOPIC.SPEED,   pattern: /following.dist|3.second|three.second|tailgat/i },
  'speed:signal-distance':   { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*feet|100 feet.*turn/i },
  'speed:minimum':           { topic: TOPIC.SPEED,   pattern: /minimum speed|slow.*traffic|impede.*traffic/i },
  'row:pedestrian':          { topic: TOPIC.ROW,     pattern: /pedestrian|crosswalk/i },
  'row:school-bus':          { topic: TOPIC.ROW,     pattern: /school bus/i },
  'row:emergency':           { topic: TOPIC.ROW,     pattern: /emergency vehicle|ambulance|fire truck|siren/i },
  'row:roundabout':          { topic: TOPIC.ROW,     pattern: /roundabout|traffic circle/i },
  'row:intersection':        { topic: TOPIC.ROW,     pattern: /four.way.stop|all.way.stop|right.of.way.*intersect/i },
  'row:funeral':             { topic: TOPIC.ROW,     pattern: /funeral/i },
  'row:bicycle':             { topic: TOPIC.ROW,     pattern: /bicycl|cyclist/i },
  'row:motorcycle':          { topic: TOPIC.ROW,     pattern: /motorcycle/i },
  'safe:parallel-park':      { topic: TOPIC.SAFE,    pattern: /parallel park|curb.*park|park.*curb/i },
  'safe:park-hydrant':       { topic: TOPIC.SAFE,    pattern: /fire hydrant|hydrant/i },
  'safe:park-crosswalk':     { topic: TOPIC.SAFE,    pattern: /crosswalk.*park|park.*crosswalk|20 feet.*cross/i },
  'safe:park-railroad':      { topic: TOPIC.SAFE,    pattern: /railroad.*park|park.*railroad|50 feet.*rail/i },
  'safe:park-stop-sign':     { topic: TOPIC.SAFE,    pattern: /stop sign.*park|park.*stop sign|30 feet.*stop|30 feet.*signal/i },
  'safe:passing':            { topic: TOPIC.SAFE,    pattern: /pass.*vehicle|no.passing|passing.zone|solid yellow/i },
  'safe:headlights':         { topic: TOPIC.SAFE,    pattern: /headlight|high beam|dim.*light|low beam/i },
  'safe:seatbelt':           { topic: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
  'safe:texting':            { topic: TOPIC.SAFE,    pattern: /text|cell.?phone|handheld|electronic.*device/i },
  'safe:skid':               { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:weather':            { topic: TOPIC.SAFE,    pattern: /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i },
  'safe:turning':            { topic: TOPIC.SAFE,    pattern: /left turn|right turn|u.turn/i },
  'safe:lane-change':        { topic: TOPIC.SAFE,    pattern: /lane change|change lane|merge/i },
  'safe:bike-passing':       { topic: TOPIC.SAFE,    pattern: /3 feet.*bicycl|bicycl.*3 feet|pass.*bicycl|bicycl.*pass/i },
  'alcohol:bac':             { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':         { topic: TOPIC.ALCOHOL, pattern: /under.*21.*\.02|\.02.*under.*21|under.*21.*alcohol|21.*BAC/i },
  'alcohol:dui-penalties':   { topic: TOPIC.ALCOHOL, pattern: /OVI|DUI.*penalt|penalt.*DUI|revoc.*DUI|first.*OVI|first.*DUI/i },
  'alcohol:chemical-test':   { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:suspension':      { topic: TOPIC.ALCOHOL, pattern: /suspend.*OVI|OVI.*suspend|suspend.*DUI|DUI.*suspend/i },
  'alcohol:open-container':  { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle/i },
  'license:tipic':           { topic: TOPIC.LICENSE, pattern: /TIPIC|temporary.*permit|instruction permit|learner.?s? permit/i },
  'license:gdl':             { topic: TOPIC.LICENSE, pattern: /graduated|GDL|probationary/i },
  'license:gdl-curfew':      { topic: TOPIC.LICENSE, pattern: /curfew|midnight|nighttime.*restrict/i },
  'license:gdl-passengers':  { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger|one.*passenger/i },
  'license:new-resident':    { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*ohio|30 day.*licens/i },
  'license:address-change':  { topic: TOPIC.LICENSE, pattern: /address.*change|change.*address|10 day/i },
  'license:supervised-hours':{ topic: TOPIC.LICENSE, pattern: /50 hour|supervised.*hour|practice.*hour/i },
  'license:permit-duration': { topic: TOPIC.LICENSE, pattern: /6 month.*permit|six month.*permit|permit.*6 month/i },
  'license:knowledge-test':  { topic: TOPIC.LICENSE, pattern: /40 question|knowledge test.*40|75.*percent|30.*correct/i },
  'license:suspension':      { topic: TOPIC.LICENSE, pattern: /suspend.*licens|licens.*suspend|points.*suspend/i },
  'license:points':          { topic: TOPIC.LICENSE, pattern: /point.*system|12 point|accumulate.*point/i },
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

function normalize(t) { return t.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const inter = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? inter / union : 0;
}

async function main() {
  console.log('=== OH QA SCAN ===\n');

  const questions = await p.question.findMany({
    where: { stateId: STATE_ID },
    include: { choices: true, topic: { select: { name: true, id: true } } },
    orderBy: { topicId: 'asc' },
  });
  console.log(`Total questions: ${questions.length}\n`);

  // ── 1. FACTUAL ERRORS ────────────────────────────────────────────────────
  console.log('=== FACTUAL ERRORS ===');
  const errors = [];
  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const ep of ERROR_PATTERNS) {
      if (ep.pattern.test(combined)) {
        errors.push({ id: q.id, topic: q.topic.name, text: q.text.substring(0, 120), msg: ep.msg });
      }
    }
  }
  if (!errors.length) {
    console.log('No obvious factual errors detected.\n');
  } else {
    console.log(`Found ${errors.length} potential errors:\n`);
    for (const e of errors) {
      console.log(`  [${e.topic}] ID: ${e.id}`);
      console.log(`  Q: ${e.text}`);
      console.log(`  ⚠ ${e.msg}\n`);
    }
  }

  // ── 2. DUPLICATES ────────────────────────────────────────────────────────
  console.log('=== DUPLICATE SCAN ===');
  const byTopic = {};
  for (const q of questions) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }
  const dupes = [];
  for (const qs of Object.values(byTopic)) {
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const sim = similarity(qs[i].text, qs[j].text);
        if (sim >= 0.65) {
          dupes.push({ sim: Math.round(sim*100), topic: qs[i].topic.name,
            id1: qs[i].id, q1: qs[i].text.substring(0,100),
            id2: qs[j].id, q2: qs[j].text.substring(0,100) });
        }
      }
    }
  }
  dupes.sort((a,b) => b.sim - a.sim);
  if (!dupes.length) { console.log('No duplicates found.\n'); }
  else {
    console.log(`Found ${dupes.length} duplicate pairs:\n`);
    for (const d of dupes) {
      console.log(`  [${d.topic}] ${d.sim}% similar`);
      console.log(`  A: (${d.id1}) ${d.q1}`);
      console.log(`  B: (${d.id2}) ${d.q2}\n`);
    }
  }

  // ── 3. CONCEPT COVERAGE ──────────────────────────────────────────────────
  console.log('=== CONCEPT COVERAGE ===');
  const coverage = {};
  for (const c of Object.keys(CONCEPTS)) coverage[c] = [];
  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const [concept, cfg] of Object.entries(CONCEPTS)) {
      if (cfg.topic === q.topicId && cfg.pattern.test(combined)) coverage[concept].push(q.id);
    }
  }
  const gaps = [], over = [];
  for (const [c, ids] of Object.entries(coverage)) {
    if (ids.length === 0) gaps.push(c);
    else if (ids.length > 8) over.push({ c, n: ids.length });
  }
  console.log('\nGAPS (0 questions):');
  if (!gaps.length) console.log('  None!');
  else gaps.forEach(g => console.log(`  ❌ ${g}`));
  console.log('\nOVER-TESTED (>8):');
  if (!over.length) console.log('  None!');
  else over.forEach(o => console.log(`  ⚠ ${o.c}: ${o.n}`));
  console.log('\nFULL CONCEPT COUNTS:');
  for (const [c, ids] of Object.entries(coverage)) {
    const flag = ids.length === 0 ? ' ❌ GAP' : ids.length > 8 ? ` ⚠ OVER(${ids.length})` : '';
    console.log(`  ${c}: ${ids.length}${flag}`);
  }

  // ── 4. TOPIC SUMMARY ────────────────────────────────────────────────────
  console.log('\n=== TOPIC SUMMARY ===');
  const topicNames = {
    [TOPIC.SIGNS]:'Traffic Signs',[TOPIC.ROW]:'Right Of Way',
    [TOPIC.SPEED]:'Speed Limits',[TOPIC.SAFE]:'Safe Driving',
    [TOPIC.ALCOHOL]:'Alcohol & Substances',[TOPIC.LICENSE]:'Licensing & Permits',
  };
  for (const [tid, qs] of Object.entries(byTopic))
    console.log(`  ${topicNames[tid]||tid}: ${qs.length}`);
  console.log(`  TOTAL: ${questions.length}`);
  console.log(`  NEED TO TRIM: ~${Math.max(0, questions.length - 340)}`);

  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
