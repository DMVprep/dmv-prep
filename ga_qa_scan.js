const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntn2w00093jd62fafhen2';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};

// ── GA-SPECIFIC GROUND TRUTH ─────────────────────────────────────────────────
// Key values that differ from other states:
// - New resident: 30 days
// - Permit age: 15 (not 15.5 or 16)
// - Permit hold: 12 months + 1 day (longest of all states done so far)
// - Supervised hours: 40 hours (6 at night) — NOT 50
// - Class D curfew: midnight–5 AM
// - BAC under 21: .02% (not zero tolerance)
// - Interstate rural: 70 mph
// - Interstate urban: 65 mph
// - Residential/urban: 30 mph
// - Fire hydrant: 15 feet
// - Crosswalk: 20 feet
// - Stop sign/signal: 30 feet
// - Railroad: 50 feet
// - Points suspension: 15 points in 24 months
// - Super Speeder: 75+ mph 2-lane or 85+ mph any road
// - Knowledge test: 40 questions, 75% to pass

const ERROR_PATTERNS = [
  // Wrong new-resident / address change
  { pattern: /new.*resident.*60 day|60.day.*new.*resident|within 60.*georgia/i,
    msg: 'WRONG: GA new resident = 30 days (not 60)' },
  { pattern: /new.*resident.*90 day|90.day.*new.*resident|within 90.*georgia/i,
    msg: 'WRONG: GA new resident = 30 days (not 90)' },
  // Wrong permit age
  { pattern: /permit.*age 16|age 16.*permit|minimum.*16.*permit/i,
    msg: 'WRONG: GA permit age = 15 (not 16)' },
  { pattern: /15[\.\s]*5|fifteen and a half/i,
    msg: 'WRONG: GA permit age = 15 (not 15.5 — that is Ohio)' },
  // Wrong permit hold
  { pattern: /permit.*6 month|six month.*permit|hold.*permit.*6/i,
    msg: 'WRONG: GA permit hold = 12 months + 1 day (not 6 months)' },
  { pattern: /permit.*9 month|nine month.*permit/i,
    msg: 'WRONG: GA permit hold = 12 months + 1 day (not 9 months)' },
  // Wrong supervised hours
  { pattern: /50 hour.*supervis|supervis.*50 hour|50 hour.*driving/i,
    msg: 'WRONG: GA supervised hours = 40 (not 50)' },
  { pattern: /65 hour|sixty.five hour/i,
    msg: 'WRONG: GA supervised hours = 40 (not 65)' },
  // Wrong night hours
  { pattern: /10 hour.*night|night.*10 hour/i,
    msg: 'WRONG: GA night hours = 6 (not 10)' },
  // Wrong curfew
  { pattern: /curfew.*10 pm|10 pm.*curfew|curfew.*10:00/i,
    msg: 'WRONG: GA Class D curfew = midnight–5 AM (not 10 PM)' },
  { pattern: /curfew.*11 pm|11 pm.*curfew/i,
    msg: 'WRONG: GA Class D curfew = midnight–5 AM (not 11 PM)' },
  // Wrong following distance — GA manual uses 2-second rule (one-thousand-one, one-thousand-two)
  { pattern: /4.second rule|four.second rule/i,
    msg: 'WRONG: GA following distance = 2-second rule (not 4-second)' },
  { pattern: /3.second rule|three.second rule/i,
    msg: 'WRONG: GA following distance = 2-second rule (not 3-second)' },
  // Wrong BAC adult
  { pattern: /\.10.*BAC|BAC.*\.10|limit.*\.10|\.10.*limit/i,
    msg: 'WRONG: GA adult BAC = .08 (not .10)' },
  // Wrong under-21 BAC
  { pattern: /under.*21.*zero.toleran|zero.toleran.*under.*21|any trace.*under.*21/i,
    msg: 'WRONG: GA under-21 BAC = .02 (not zero tolerance)' },
  { pattern: /under.*21.*\.00|\.00.*under.*21/i,
    msg: 'WRONG: GA under-21 BAC = .02 (not .00)' },
  // Wrong fire hydrant
  { pattern: /fire hydrant.*10 feet|10 feet.*fire hydrant/i,
    msg: 'WRONG: GA fire hydrant = 15 feet (not 10)' },
  { pattern: /fire hydrant.*20 feet|20 feet.*fire hydrant/i,
    msg: 'WRONG: GA fire hydrant = 15 feet (not 20)' },
  // Wrong residential speed
  { pattern: /residential.*25 mph|25 mph.*residential|urban.*25 mph|25 mph.*urban/i,
    msg: 'WRONG: GA residential/urban = 30 mph (not 25)' },
  // Wrong school zone
  { pattern: /school.zone.*25 mph|25 mph.*school.zone/i,
    msg: 'POSSIBLE: GA school zone speed varies — verify it is not 20 mph' },
  // Wrong interstate speed
  { pattern: /interstate.*55 mph|55 mph.*interstate/i,
    msg: 'WRONG: GA rural interstate = 70 mph (not 55)' },
  { pattern: /interstate.*60 mph|60 mph.*interstate/i,
    msg: 'WRONG: GA rural interstate = 70 mph (not 60)' },
  // Wrong points suspension
  { pattern: /12 point.*suspend|suspend.*12 point/i,
    msg: 'WRONG: GA suspension = 15 points in 24 months (not 12)' },
  // Wrong turn signal distance
  { pattern: /turn signal.*50 feet|50 feet.*turn signal/i,
    msg: 'POSSIBLE: GA turn signal distance — verify (100 feet)' },
  // Wrong bike passing
  { pattern: /bicycl.*4 feet|4 feet.*bicycl/i,
    msg: 'WRONG: GA bike passing = 3 feet (not 4)' },
  // Wrong knowledge test
  { pattern: /20 question.*test|test.*20 question/i,
    msg: 'WRONG: GA knowledge test = 40 questions (not 20)' },
  { pattern: /35 question.*test|test.*35 question/i,
    msg: 'WRONG: GA knowledge test = 40 questions (not 35)' },
];

const CONCEPTS = {
  'speed:max-interstate':    { topic: TOPIC.SPEED,   pattern: /70|interstate/i },
  'speed:max-residential':   { topic: TOPIC.SPEED,   pattern: /30\s*mph|residential.*speed|speed.*residential|urban.*30|30.*urban/i },
  'speed:school-zone':       { topic: TOPIC.SPEED,   pattern: /school.zone.*speed|speed.*school.zone|20\s*mph.*school|school.*20\s*mph/i },
  'speed:construction-zone': { topic: TOPIC.SPEED,   pattern: /construction.zone|work.zone/i },
  'speed:following':         { topic: TOPIC.SPEED,   pattern: /following.dist|2.second|two.second|one.thousand.one|tailgat/i },
  'speed:signal-distance':   { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*feet/i },
  'speed:super-speeder':     { topic: TOPIC.SPEED,   pattern: /super.?speeder|85 mph|75 mph.*two.lane/i },
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
  'alcohol:under21':         { topic: TOPIC.ALCOHOL, pattern: /under.*21.*\.02|\.02.*under.*21|under.*21.*alcohol/i },
  'alcohol:dui-penalties':   { topic: TOPIC.ALCOHOL, pattern: /DUI.*penalt|penalt.*DUI|first.*DUI|DUI.*convict/i },
  'alcohol:chemical-test':   { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:suspension':      { topic: TOPIC.ALCOHOL, pattern: /suspend.*DUI|DUI.*suspend|ALS|implied consent.*suspend/i },
  'alcohol:open-container':  { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle/i },
  'license:permit':          { topic: TOPIC.LICENSE, pattern: /instructional permit|learner.?s? permit|class.*CP|CP.*permit/i },
  'license:class-d':         { topic: TOPIC.LICENSE, pattern: /class.*D|class D|provisional|restricted.*licens/i },
  'license:gdl-curfew':      { topic: TOPIC.LICENSE, pattern: /curfew|midnight|5 a\.?m|nighttime.*restrict/i },
  'license:gdl-passengers':  { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger|non.family/i },
  'license:new-resident':    { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*georgia|30 day.*licens/i },
  'license:supervised-hours':{ topic: TOPIC.LICENSE, pattern: /40 hour|supervised.*hour|practice.*hour/i },
  'license:permit-duration': { topic: TOPIC.LICENSE, pattern: /12 month|twelve month|one year.*permit|permit.*one year/i },
  'license:joshua-law':      { topic: TOPIC.LICENSE, pattern: /joshua.?s? law|driver education.*30|30.*hour.*class/i },
  'license:points':          { topic: TOPIC.LICENSE, pattern: /point.*system|15 point|accumulate.*point/i },
  'license:super-speeder':   { topic: TOPIC.LICENSE, pattern: /super.?speeder/i },
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
  console.log('=== GA QA SCAN ===\n');

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
  if (!errors.length) { console.log('No obvious factual errors.\n'); }
  else {
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
        if (sim >= 0.65) dupes.push({ sim: Math.round(sim*100), topic: qs[i].topic.name,
          id1: qs[i].id, q1: qs[i].text.substring(0,100),
          id2: qs[j].id, q2: qs[j].text.substring(0,100) });
      }
    }
  }
  dupes.sort((a,b) => b.sim - a.sim);
  if (!dupes.length) { console.log('No duplicates found.\n'); }
  else {
    console.log(`Found ${dupes.length} duplicate pairs:\n`);
    for (const d of dupes) {
      console.log(`  [${d.topic}] ${d.sim}%`);
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
  console.log('\nGAPS:');
  if (!gaps.length) console.log('  None!');
  else gaps.forEach(g => console.log(`  ❌ ${g}`));
  console.log('\nOVER-TESTED (>8):');
  if (!over.length) console.log('  None!');
  else over.forEach(o => console.log(`  ⚠ ${o.c}: ${o.n}`));
  console.log('\nFULL COUNTS:');
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
