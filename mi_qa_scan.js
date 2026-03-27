const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntpdu000l3jd65ylqhor7';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};

// ── MI-SPECIFIC GROUND TRUTH (official MCL statutes + What Every Driver Must Know) ────
// Key MI differences:
// - Freeway/interstate: 70 mph (cars), 60 mph trucks/buses
// - Trunk line/county highway: 55 mph
// - Residential/business: 25 mph (NOT 30 or 35)
// - Work zone: 45 mph
// - School zone: min 25 mph when posted
// - Adult BAC: .08% — MI calls it OWI (not DUI)
// - Under-21: .02% triggers Zero Tolerance (NOT zero/any amount — that's NC)
// - High BAC "Super Drunk": .17% or higher
// - Fire hydrant: 15 feet (MCL 257.675d)
// - Crosswalk parking: 20 feet
// - GDL Level 1 permit: age 14 years 9 months
// - Level 1 hold: 6 months before Segment 2; overall 50 hours (10 at night) before Level 2
// - Level 2 curfew: 10 PM – 5 AM
// - Level 2 passengers: 1 under-21 non-family
// - Level 3: age 17+, 6 months at Level 2, 12 months violation-free
// - Following distance: 3 to 4 second rule (handbook)
// - Turn signal: 100 feet before turning
// - New resident: 30 days
// - Points: 12 points = suspension hearing

const ERROR_PATTERNS = [
  // Wrong residential speed — MI is 25 mph not 30 or 35
  { pattern: /residential.*30 mph|30 mph.*residential|city.*30 mph|30 mph.*city|urban.*30 mph|30 mph.*urban/i,
    msg: 'WRONG: MI residential/business = 25 mph (not 30)' },
  { pattern: /residential.*35 mph|35 mph.*residential/i,
    msg: 'WRONG: MI residential/business = 25 mph (not 35)' },
  // Wrong freeway speed
  { pattern: /freeway.*55 mph|55 mph.*freeway|interstate.*55 mph|55 mph.*interstate/i,
    msg: 'WRONG: MI freeway/interstate = 70 mph cars (not 55)' },
  { pattern: /freeway.*65 mph|65 mph.*freeway|interstate.*65 mph|65 mph.*interstate/i,
    msg: 'WRONG: MI freeway/interstate = 70 mph cars (not 65)' },
  // Wrong BAC adult
  { pattern: /\.10.*BAC|BAC.*\.10|limit.*\.10|\.10.*limit/i,
    msg: 'WRONG: MI adult BAC = .08 (not .10)' },
  // Wrong under-21 — MI is .02, not zero tolerance
  { pattern: /under.*21.*zero tolerance|zero tolerance.*under.*21|any amount.*under.*21/i,
    msg: 'NOTE: MI under-21 = .02% (zero tolerance threshold is .02, not any amount — that is NC)' },
  { pattern: /under.*21.*\.04|\.04.*under.*21/i,
    msg: 'WRONG: MI under-21 = .02% (not .04)' },
  // Wrong fire hydrant
  { pattern: /fire hydrant.*10 feet|10 feet.*fire hydrant/i,
    msg: 'WRONG: MI fire hydrant = 15 feet (not 10)' },
  { pattern: /fire hydrant.*20 feet|20 feet.*fire hydrant/i,
    msg: 'WRONG: MI fire hydrant = 15 feet (not 20)' },
  // Wrong following distance — MI handbook says 3–4 second rule
  { pattern: /2.second rule|two.second rule/i,
    msg: 'WRONG: MI following distance = 3 to 4 second rule (not 2)' },
  // Wrong supervised hours
  { pattern: /40 hour.*supervis|supervis.*40 hour/i,
    msg: 'WRONG: MI Level 1 supervised = 50 hours (not 40)' },
  { pattern: /60 hour.*supervis|supervis.*60 hour/i,
    msg: 'WRONG: MI Level 1 supervised = 50 hours (not 60)' },
  // Wrong curfew
  { pattern: /curfew.*midnight|midnight.*curfew/i,
    msg: 'WRONG: MI Level 2 curfew = 10 PM–5 AM (not midnight)' },
  { pattern: /curfew.*11 pm|11 pm.*curfew/i,
    msg: 'WRONG: MI Level 2 curfew = 10 PM–5 AM (not 11 PM)' },
  { pattern: /curfew.*9 pm|9 pm.*curfew/i,
    msg: 'WRONG: MI Level 2 curfew = 10 PM–5 AM (not 9 PM)' },
  // Wrong permit age
  { pattern: /permit.*age 15|age 15.*permit|at.*15.*permit/i,
    msg: 'WRONG: MI Level 1 permit = age 14 years 9 months (not 15)' },
  { pattern: /permit.*age 16|age 16.*permit/i,
    msg: 'WRONG: MI Level 1 permit = age 14 years 9 months (not 16)' },
  // Wrong work zone speed
  { pattern: /work zone.*25 mph|25 mph.*work zone/i,
    msg: 'WRONG: MI work zone default = 45 mph (not 25)' },
  { pattern: /work zone.*35 mph|35 mph.*work zone/i,
    msg: 'WRONG: MI work zone default = 45 mph (not 35)' },
  // Wrong points threshold
  { pattern: /15 point.*suspend|suspend.*15 point/i,
    msg: 'WRONG: MI points = 12 points triggers suspension hearing (not 15)' },
  // DUI vs OWI
  { pattern: /\bDUI\b(?!.*\bOWI\b)/i,
    msg: 'NOTE: MI uses OWI (Operating While Intoxicated) not DUI' },
];

const CONCEPTS = {
  'speed:max-freeway':       { topic: TOPIC.SPEED,   pattern: /70|freeway|interstate/i },
  'speed:max-residential':   { topic: TOPIC.SPEED,   pattern: /25\s*mph|residential.*speed|speed.*residential|business.*district.*25/i },
  'speed:school-zone':       { topic: TOPIC.SPEED,   pattern: /school.zone.*speed|speed.*school.zone/i },
  'speed:work-zone':         { topic: TOPIC.SPEED,   pattern: /work.zone|construction.zone/i },
  'speed:following':         { topic: TOPIC.SPEED,   pattern: /following.dist|3.second|four.second|second.rule|tailgat/i },
  'speed:signal-distance':   { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*100 feet/i },
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
  'safe:park-railroad':      { topic: TOPIC.SAFE,    pattern: /railroad.*park|park.*railroad/i },
  'safe:passing':            { topic: TOPIC.SAFE,    pattern: /pass.*vehicle|no.passing|passing.zone|solid yellow/i },
  'safe:headlights':         { topic: TOPIC.SAFE,    pattern: /headlight|high beam|dim.*light|low beam/i },
  'safe:seatbelt':           { topic: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
  'safe:texting':            { topic: TOPIC.SAFE,    pattern: /text|cell.?phone|handheld|kelsey/i },
  'safe:skid':               { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:weather':            { topic: TOPIC.SAFE,    pattern: /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i },
  'safe:turning':            { topic: TOPIC.SAFE,    pattern: /left turn|right turn|u.turn/i },
  'safe:lane-change':        { topic: TOPIC.SAFE,    pattern: /lane change|change lane|merge/i },
  'safe:bike-passing':       { topic: TOPIC.SAFE,    pattern: /pass.*bicycl|bicycl.*pass|bicyclist.*feet/i },
  'alcohol:bac':             { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':         { topic: TOPIC.ALCOHOL, pattern: /under.*21.*\.02|\.02.*under.*21|zero.toleran|under.*21.*alcohol/i },
  'alcohol:owi-penalties':   { topic: TOPIC.ALCOHOL, pattern: /OWI.*penalt|penalt.*OWI|OWI.*convict|first.*OWI|first.*offense.*drunk/i },
  'alcohol:chemical-test':   { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:high-bac':        { topic: TOPIC.ALCOHOL, pattern: /\.17|super drunk|high BAC/i },
  'alcohol:open-container':  { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle/i },
  'license:level1':          { topic: TOPIC.LICENSE, pattern: /level.?one|level 1|learner.*license|segment.?1/i },
  'license:level2':          { topic: TOPIC.LICENSE, pattern: /level.?two|level 2|intermediate|segment.?2/i },
  'license:level3':          { topic: TOPIC.LICENSE, pattern: /level.?three|level 3|full.*license.*driv/i },
  'license:gdl-curfew':      { topic: TOPIC.LICENSE, pattern: /curfew|10 p\.?m|nighttime.*restrict/i },
  'license:gdl-passengers':  { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger|under.*21.*passenger/i },
  'license:new-resident':    { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*michigan|30 day.*licens/i },
  'license:supervised-hours':{ topic: TOPIC.LICENSE, pattern: /50 hour|supervised.*hour|driving.*log/i },
  'license:points':          { topic: TOPIC.LICENSE, pattern: /point.*system|12 point|accumulate.*point/i },
  'license:kelsey-law':      { topic: TOPIC.LICENSE, pattern: /kelsey.*law|cell phone.*teen|teen.*cell phone/i },
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
  console.log('=== MI QA SCAN ===\n');
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
