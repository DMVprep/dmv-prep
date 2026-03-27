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

// ── NC-SPECIFIC GROUND TRUTH (all from official NC Driver Handbook + GS statutes) ─────
// Key differences from other states:
// - New resident: 60 days (not 30 or 90)
// - GDL Level 1 permit age: 15
// - Level 1 hold: 9 months; supervised hours: 60 (10 at night)
// - Level 1 curfew: 5 AM–9 PM (with supervisor)
// - Level 2 hold: 6 months; 12 hours supervised (6 at night)
// - Level 2 unsupervised: 5 AM–9 PM; 1 non-household under-21 passenger
// - Provisional (under 18): ZERO tolerance alcohol (any amount = 1-year revocation)
// - Adult BAC: .08% — NC calls it DWI not DUI
// - Speed in town/city: 35 mph (NOT 30 — key NC difference)
// - Speed outside town/city: 55 mph
// - Interstate max: 70 mph when posted
// - Fire hydrant: 15 feet (GS 20-162)
// - Intersection curb: 25 feet from curb intersection
// - Following distance: 2-second rule
// - Bicycle passing: 2 feet minimum (GS 20-149) — NOT 3 feet
// - Turn signal: 100 feet before turns/lane changes
// - Points suspension: 12 points in 3 years
// - DWI refusal: immediate 30-day revocation + minimum 12-month additional

const ERROR_PATTERNS = [
  // Wrong new-resident timeframe
  { pattern: /new.*resident.*30 day|30.day.*new.*resident|within 30.*carolina/i,
    msg: 'WRONG: NC new resident = 60 days (not 30)' },
  { pattern: /new.*resident.*90 day|90.day.*new.*resident|within 90.*carolina/i,
    msg: 'WRONG: NC new resident = 60 days (not 90)' },
  // Wrong city/town speed
  { pattern: /residential.*30 mph|30 mph.*residential|city.*30 mph|30 mph.*city|urban.*30 mph|30 mph.*urban/i,
    msg: 'WRONG: NC town/city default = 35 mph (not 30)' },
  { pattern: /residential.*25 mph|25 mph.*residential/i,
    msg: 'WRONG: NC town/city default = 35 mph (not 25)' },
  // Wrong following distance
  { pattern: /3.second rule|three.second rule/i,
    msg: 'WRONG: NC following distance = 2-second rule (not 3)' },
  { pattern: /4.second rule|four.second rule/i,
    msg: 'WRONG: NC following distance = 2-second rule (not 4)' },
  // Wrong BAC adult
  { pattern: /\.10.*BAC|BAC.*\.10|limit.*\.10|\.10.*limit/i,
    msg: 'WRONG: NC adult BAC = .08 (not .10)' },
  // Wrong under-21 BAC — NC is ZERO tolerance (any amount)
  { pattern: /under.*21.*\.02|\.02.*under.*21/i,
    msg: 'WRONG: NC under-21 = zero tolerance/any amount (not .02 — that is OH/GA)' },
  { pattern: /under.*21.*\.04|\.04.*under.*21/i,
    msg: 'WRONG: NC under-21 = zero tolerance/any amount' },
  // Wrong fire hydrant
  { pattern: /fire hydrant.*10 feet|10 feet.*fire hydrant/i,
    msg: 'WRONG: NC fire hydrant = 15 feet (not 10)' },
  { pattern: /fire hydrant.*20 feet|20 feet.*fire hydrant/i,
    msg: 'WRONG: NC fire hydrant = 15 feet (not 20)' },
  // Wrong bike passing — NC is 2 feet, not 3
  { pattern: /bicycl.*3 feet|3 feet.*bicycl/i,
    msg: 'WRONG: NC bicycle passing = 2 feet (not 3 — that is GA/IL/OH)' },
  { pattern: /bicycl.*4 feet|4 feet.*bicycl/i,
    msg: 'WRONG: NC bicycle passing = 2 feet (not 4)' },
  // Wrong permit hold
  { pattern: /permit.*6 month|six month.*permit|hold.*6.*month.*permit/i,
    msg: 'POSSIBLE: NC Level 1 permit hold = 9 months; Level 2 = 6 months — check context' },
  // Wrong supervised hours
  { pattern: /50 hour.*supervis|supervis.*50 hour|50 hour.*driv/i,
    msg: 'WRONG: NC Level 1 supervised hours = 60 (not 50)' },
  { pattern: /40 hour.*supervis|supervis.*40 hour/i,
    msg: 'WRONG: NC Level 1 supervised hours = 60 (not 40)' },
  // Wrong curfew
  { pattern: /curfew.*midnight|midnight.*curfew/i,
    msg: 'WRONG: NC curfew = 9 PM–5 AM (not midnight)' },
  { pattern: /curfew.*10 pm|10 pm.*curfew/i,
    msg: 'WRONG: NC curfew = 9 PM–5 AM (not 10 PM)' },
  { pattern: /curfew.*11 pm|11 pm.*curfew/i,
    msg: 'WRONG: NC curfew = 9 PM–5 AM (not 11 PM)' },
  // Wrong interstate speed
  { pattern: /interstate.*55 mph|55 mph.*interstate/i,
    msg: 'WRONG: NC interstate max = 70 mph when posted (not 55)' },
  { pattern: /interstate.*65 mph|65 mph.*interstate/i,
    msg: 'WRONG: NC interstate max = 70 mph when posted (not 65)' },
  // Wrong turn signal
  { pattern: /turn signal.*50 feet|50 feet.*turn signal/i,
    msg: 'WRONG: NC turn signal = 100 feet (not 50)' },
  // Wrong points suspension
  { pattern: /15 point.*suspend|suspend.*15 point/i,
    msg: 'WRONG: NC points suspension = 12 points in 3 years (not 15)' },
  // DUI vs DWI
  { pattern: /DUI(?!.*DWI)/i,
    msg: 'NOTE: NC uses DWI (Driving While Impaired) not DUI' },
];

const CONCEPTS = {
  'speed:max-interstate':    { topic: TOPIC.SPEED,   pattern: /70|interstate/i },
  'speed:max-city':          { topic: TOPIC.SPEED,   pattern: /35\s*mph|city.*speed|speed.*city|town.*35|35.*town/i },
  'speed:school-zone':       { topic: TOPIC.SPEED,   pattern: /school.zone.*speed|speed.*school.zone/i },
  'speed:construction-zone': { topic: TOPIC.SPEED,   pattern: /construction.zone|work.zone/i },
  'speed:following':         { topic: TOPIC.SPEED,   pattern: /following.dist|2.second|two.second|tailgat/i },
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
  'safe:park-intersection':  { topic: TOPIC.SAFE,    pattern: /intersection.*park|park.*intersection|25 feet.*curb/i },
  'safe:park-railroad':      { topic: TOPIC.SAFE,    pattern: /railroad.*park|park.*railroad/i },
  'safe:passing':            { topic: TOPIC.SAFE,    pattern: /pass.*vehicle|no.passing|passing.zone|solid yellow/i },
  'safe:headlights':         { topic: TOPIC.SAFE,    pattern: /headlight|high beam|dim.*light|low beam/i },
  'safe:seatbelt':           { topic: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
  'safe:texting':            { topic: TOPIC.SAFE,    pattern: /text|cell.?phone|handheld|hands.free/i },
  'safe:skid':               { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:weather':            { topic: TOPIC.SAFE,    pattern: /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i },
  'safe:turning':            { topic: TOPIC.SAFE,    pattern: /left turn|right turn|u.turn/i },
  'safe:lane-change':        { topic: TOPIC.SAFE,    pattern: /lane change|change lane|merge/i },
  'safe:bike-passing':       { topic: TOPIC.SAFE,    pattern: /2 feet.*bicycl|bicycl.*2 feet|pass.*bicycl|bicycl.*pass/i },
  'alcohol:bac':             { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':         { topic: TOPIC.ALCOHOL, pattern: /under.*21.*zero|zero.*toleran|any.*amount.*21|provisional.*alcohol/i },
  'alcohol:dwi-penalties':   { topic: TOPIC.ALCOHOL, pattern: /DWI.*penalt|penalt.*DWI|DWI.*convict|first.*DWI/i },
  'alcohol:chemical-test':   { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test/i },
  'alcohol:dwi-high-bac':    { topic: TOPIC.ALCOHOL, pattern: /\.15.*BAC|BAC.*\.15|ignition interlock/i },
  'alcohol:open-container':  { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle/i },
  'license:level1':          { topic: TOPIC.LICENSE, pattern: /level.?one|level 1|limited learner|learner permit/i },
  'license:level2':          { topic: TOPIC.LICENSE, pattern: /level.?two|level 2|limited provisional/i },
  'license:level3':          { topic: TOPIC.LICENSE, pattern: /level.?three|level 3|full provisional/i },
  'license:gdl-curfew':      { topic: TOPIC.LICENSE, pattern: /curfew|9 p\.?m|nighttime.*restrict/i },
  'license:gdl-passengers':  { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger|non.household/i },
  'license:new-resident':    { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*carolina|60 day.*licens/i },
  'license:supervised-hours':{ topic: TOPIC.LICENSE, pattern: /60 hour|supervised.*hour|driving.*log/i },
  'license:driver-ed':       { topic: TOPIC.LICENSE, pattern: /driver education|30 hour.*class|classroom.*30/i },
  'license:points':          { topic: TOPIC.LICENSE, pattern: /point.*system|12 point|accumulate.*point/i },
  'license:provisional-alcohol': { topic: TOPIC.LICENSE, pattern: /provisional.*alcohol|under.*18.*alcohol|any.*amount.*driv/i },
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
  console.log('=== NC QA SCAN ===\n');

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
