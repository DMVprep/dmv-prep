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

// ── IL-SPECIFIC GROUND TRUTH ─────────────────────────────────────────────────
// All values verified from IL Rules of the Road 2025 handbook
const IL = {
  newResident:        90,    // days to get IL license after moving
  addressChange:      10,    // days to notify SOS of address change
  nameChange:         30,    // days to update name on DL/ID
  followingDistance:   3,    // second rule
  maxSpeedInterstate: 70,
  maxSpeedFourLane:   65,
  maxSpeedHighway:    55,
  maxSpeedCity:       30,
  maxSpeedAlley:      15,
  schoolZoneSpeed:    20,
  bacAdult:          0.08,
  bacUnder21:         0,     // any trace / zero tolerance
  duiRefusalSuspension: 1,   // year
  duiFailSuspension: 6,      // months
  firstDuiRevocation: 1,     // year minimum
  under21DuiRevocation: 2,   // year minimum
  bikePassingFeet:    3,
  turnSignalResidential: 100, // feet
  turnSignalOther:   200,    // feet
  fireHydrantFeet:    15,
  stopSignParkingFeet: 30,
  railroadCrossingStopMin: 15,
  railroadCrossingStopMax: 50,
  railroadParkingFeet: 50,
  minLicenseAge:      16,
  permitMonths:        9,
  supervisedHours:    50,    // total (10 at night)
  supervisedNightHours: 10,
  gdlCurfewWeekday:  '10 PM',
  gdlCurfewWeekend:  '11 PM',
  parallelParkInches: 12,
  passingIntersectionFeet: 100,
  emergencyParkingClearance: 200, // feet visibility each direction
  crosswalkParkingFeet: 20,   // within 20ft of fire station driveway or crosswalk at intersection
};

// ── CONCEPT MAP ──────────────────────────────────────────────────────────────
const CONCEPTS = {
  // Speed
  'speed:max-interstate':     { topic: TOPIC.SPEED,   pattern: /70|interstate|tollway/i },
  'speed:max-highway':        { topic: TOPIC.SPEED,   pattern: /65|four.lane|4.lane/i },
  'speed:max-city':           { topic: TOPIC.SPEED,   pattern: /30\s*mph.*cit|city.*30\s*mph|urban.*30|30.*urban/i },
  'speed:max-alley':          { topic: TOPIC.SPEED,   pattern: /alley|15\s*mph/i },
  'speed:school-zone':        { topic: TOPIC.SPEED,   pattern: /school.zone|20\s*mph/i },
  'speed:construction-zone':  { topic: TOPIC.SPEED,   pattern: /construction.zone|work.zone/i },
  'speed:following':          { topic: TOPIC.SPEED,   pattern: /following.dist|3.second|three.second|tailgat/i },
  'speed:signal-distance':    { topic: TOPIC.SPEED,   pattern: /turn signal.*100|100.*turn signal|signal.*200|200.*signal|signal.*feet/i },
  'speed:minimum':            { topic: TOPIC.SPEED,   pattern: /minimum speed|slow.*traffic|impede.*traffic/i },
  // Right of Way
  'row:pedestrian':           { topic: TOPIC.ROW,     pattern: /pedestrian|crosswalk/i },
  'row:school-bus':           { topic: TOPIC.ROW,     pattern: /school bus/i },
  'row:emergency':            { topic: TOPIC.ROW,     pattern: /emergency vehicle|ambulance|fire truck|police.*siren|siren/i },
  'row:roundabout':           { topic: TOPIC.ROW,     pattern: /roundabout|traffic circle/i },
  'row:intersection':         { topic: TOPIC.ROW,     pattern: /intersection.*right.of.way|right.of.way.*intersection|four.way.stop|all.way.stop/i },
  'row:funeral':              { topic: TOPIC.ROW,     pattern: /funeral/i },
  'row:bicycle':              { topic: TOPIC.ROW,     pattern: /bicycl|cyclist|bike lane/i },
  'row:motorcycle':           { topic: TOPIC.ROW,     pattern: /motorcycle/i },
  // Safe Driving
  'safe:parallel-park':       { topic: TOPIC.SAFE,    pattern: /parallel park|12 inch|curb.*park|park.*curb/i },
  'safe:park-hydrant':        { topic: TOPIC.SAFE,    pattern: /fire hydrant|hydrant/i },
  'safe:park-crosswalk':      { topic: TOPIC.SAFE,    pattern: /crosswalk.*park|park.*crosswalk|fire station.*20|20.*fire station/i },
  'safe:park-railroad':       { topic: TOPIC.SAFE,    pattern: /railroad.*park|park.*railroad|50 feet.*rail/i },
  'safe:park-stop-sign':      { topic: TOPIC.SAFE,    pattern: /stop sign.*park|park.*stop sign|30 feet.*stop|yield.*30 feet/i },
  'safe:park-hill':           { topic: TOPIC.SAFE,    pattern: /hill.*park|park.*hill|uphill|downhill.*park|park.*downhill/i },
  'safe:passing':             { topic: TOPIC.SAFE,    pattern: /pass.*vehicle|no.passing|passing.zone|solid yellow/i },
  'safe:headlights':          { topic: TOPIC.SAFE,    pattern: /headlight|high beam|dim.*light|low beam/i },
  'safe:seatbelt':            { topic: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
  'safe:texting':             { topic: TOPIC.SAFE,    pattern: /text|cell.?phone|handheld|wireless.*device|under.*19|19.*phone/i },
  'safe:skid':                { topic: TOPIC.SAFE,    pattern: /skid|hydroplan|aquaplan/i },
  'safe:weather':             { topic: TOPIC.SAFE,    pattern: /fog|snow|ice|rain.*driv|driv.*rain|visibility|adverse.*weather/i },
  'safe:turning':             { topic: TOPIC.SAFE,    pattern: /left turn|right turn|u.turn|turn.*signal|signal.*turn/i },
  'safe:lane-change':         { topic: TOPIC.SAFE,    pattern: /lane change|change lane|merge/i },
  'safe:bike-passing':        { topic: TOPIC.SAFE,    pattern: /3 feet.*bicycl|bicycl.*3 feet|pass.*bicycl|bicycl.*pass/i },
  // Alcohol
  'alcohol:bac':              { topic: TOPIC.ALCOHOL, pattern: /\.08|blood.alcohol|BAC/i },
  'alcohol:under21':          { topic: TOPIC.ALCOHOL, pattern: /under.*21.*alcohol|21.*zero|zero.toleran|any trace/i },
  'alcohol:dui-penalties':    { topic: TOPIC.ALCOHOL, pattern: /DUI.*penalt|penalt.*DUI|revoc.*DUI|DUI.*revoc|one.year.*revoc|first.*DUI/i },
  'alcohol:chemical-test':    { topic: TOPIC.ALCOHOL, pattern: /chemical test|breath test|implied consent|refus.*test|test.*refus/i },
  'alcohol:suspension':       { topic: TOPIC.ALCOHOL, pattern: /suspend.*DUI|DUI.*suspend|six month|6 month.*DUI|DUI.*6 month/i },
  'alcohol:aggravated':       { topic: TOPIC.ALCOHOL, pattern: /aggravat.*DUI|DUI.*aggravat/i },
  'alcohol:cannabis':         { topic: TOPIC.ALCOHOL, pattern: /cannabis|marijuana|THC/i },
  'alcohol:open-container':   { topic: TOPIC.ALCOHOL, pattern: /open container|alcohol.*vehicle|drink.*driv/i },
  // Licensing
  'license:learner-permit':   { topic: TOPIC.LICENSE, pattern: /instruction permit|learner.?s? permit|permit.*age|age.*permit/i },
  'license:gdl':              { topic: TOPIC.LICENSE, pattern: /graduated|GDL|initial licens/i },
  'license:gdl-curfew':       { topic: TOPIC.LICENSE, pattern: /curfew|10 p\.?m|11 p\.?m|nighttime.*restrict/i },
  'license:gdl-passengers':   { topic: TOPIC.LICENSE, pattern: /passenger.*restrict|restrict.*passenger|one.*passenger/i },
  'license:new-resident':     { topic: TOPIC.LICENSE, pattern: /new.*resident|moved.*illinois|90 day|90-day/i },
  'license:address-change':   { topic: TOPIC.LICENSE, pattern: /address.*change|change.*address|10 day/i },
  'license:name-change':      { topic: TOPIC.LICENSE, pattern: /name.*change|change.*name|30 day/i },
  'license:supervised-hours': { topic: TOPIC.LICENSE, pattern: /50 hour|supervised.*hour|practice.*hour/i },
  'license:permit-duration':  { topic: TOPIC.LICENSE, pattern: /9 month|nine month|permit.*hold|hold.*permit/i },
  'license:suspension':       { topic: TOPIC.LICENSE, pattern: /suspend.*licens|licens.*suspend|revoc/i },
  'license:points':           { topic: TOPIC.LICENSE, pattern: /point.*system|traffic.*violation.*suspend|3.*violation|three.*violation/i },
  // Signs
  'signs:warning':            { topic: TOPIC.SIGNS,   pattern: /warning sign|diamond|yellow.*sign|sign.*yellow/i },
  'signs:railroad':           { topic: TOPIC.SIGNS,   pattern: /railroad.*sign|RR.*sign|sign.*railroad|crossbuck/i },
  'signs:school':             { topic: TOPIC.SIGNS,   pattern: /school.*sign|sign.*school|pentagon|five.sided/i },
  'signs:work-zone':          { topic: TOPIC.SIGNS,   pattern: /work.zone.*sign|sign.*work.zone|orange.*sign|construction.*sign/i },
  'signs:regulatory':         { topic: TOPIC.SIGNS,   pattern: /regulatory|stop sign|yield sign|do not enter|wrong way/i },
  'signs:green-arrow':        { topic: TOPIC.SIGNS,   pattern: /green arrow|protected turn|arrow.*signal/i },
  'signs:flashing':           { topic: TOPIC.SIGNS,   pattern: /flashing.*light|flashing.*signal|flash.*yellow|flash.*red/i },
  'signs:colors':             { topic: TOPIC.SIGNS,   pattern: /sign.*color|color.*sign|blue.*sign|brown.*sign|green.*sign/i },
  'signs:shapes':             { topic: TOPIC.SIGNS,   pattern: /octagon|shape.*sign|sign.*shape|eight.sided|triangle.*sign/i },
};

// ── KNOWN ERRORS TO FLAG ─────────────────────────────────────────────────────
// Patterns that suggest a wrong value for IL
const ERROR_PATTERNS = [
  // Wrong new-resident timeframe
  { pattern: /new.*resident.*30 day|30.day.*new.*resident|must.*obtain.*30|within 30.*illinois/i,
    msg: 'WRONG: IL new resident = 90 days (not 30)' },
  { pattern: /new.*resident.*60 day|60.day.*new.*resident|within 60.*illinois/i,
    msg: 'WRONG: IL new resident = 90 days (not 60)' },
  // Wrong address change
  { pattern: /address.*change.*30 day|30.day.*address|notify.*30.*address/i,
    msg: 'WRONG: IL address change = 10 days (not 30)' },
  { pattern: /address.*change.*15 day|15.day.*address/i,
    msg: 'WRONG: IL address change = 10 days (not 15)' },
  // Wrong following distance
  { pattern: /4.second rule|four.second rule/i,
    msg: 'WRONG: IL following distance = 3-second rule (not 4)' },
  { pattern: /2.second rule|two.second rule/i,
    msg: 'WRONG: IL following distance = 3-second rule (not 2)' },
  // Wrong BAC
  { pattern: /\.10.*BAC|BAC.*\.10|limit.*\.10|\.10.*limit/i,
    msg: 'WRONG: IL BAC limit = .08 (not .10)' },
  { pattern: /\.16.*BAC|BAC.*\.16|limit.*\.16/i,
    msg: 'WRONG: IL BAC limit = .08 (not .16)' },
  // Wrong school zone speed
  { pattern: /school.zone.*25 mph|25 mph.*school.zone/i,
    msg: 'WRONG: IL school zone = 20 mph (not 25)' },
  { pattern: /school.zone.*15 mph|15 mph.*school.zone/i,
    msg: 'WRONG: IL school zone = 20 mph (not 15)' },
  // Wrong max speed
  { pattern: /interstate.*65 mph|65 mph.*interstate/i,
    msg: 'WRONG: IL interstate max = 70 mph (not 65)' },
  { pattern: /interstate.*55 mph|55 mph.*interstate/i,
    msg: 'WRONG: IL interstate max = 70 mph (not 55)' },
  // Wrong fire hydrant distance
  { pattern: /fire hydrant.*10 feet|10 feet.*fire hydrant/i,
    msg: 'WRONG: IL fire hydrant = 15 feet (not 10)' },
  { pattern: /fire hydrant.*20 feet|20 feet.*fire hydrant/i,
    msg: 'WRONG: IL fire hydrant = 15 feet (not 20)' },
  // Wrong bike passing
  { pattern: /bicycl.*4 feet|4 feet.*bicycl/i,
    msg: 'WRONG: IL bike passing = 3 feet (not 4)' },
  // Wrong city speed
  { pattern: /city.*25 mph|25 mph.*city|urban.*25|25.*urban/i,
    msg: 'WRONG: IL city/urban speed = 30 mph (not 25)' },
  // Wrong supervised hours
  { pattern: /65 hour|sixty.five hour/i,
    msg: 'WRONG: IL supervised hours = 50 (not 65)' },
  { pattern: /40 hour|forty hour/i,
    msg: 'WRONG: IL supervised hours = 50 (not 40)' },
  // Wrong permit hold
  { pattern: /permit.*6 month|6.month.*permit|six month.*permit/i,
    msg: 'WRONG: IL permit hold = 9 months (not 6)' },
  // Wrong curfew
  { pattern: /curfew.*9 pm|9 pm.*curfew|9:00.*pm.*curfew/i,
    msg: 'WRONG: IL GDL curfew = 10 PM weekdays / 11 PM weekends (not 9 PM)' },
  { pattern: /curfew.*midnight|midnight.*curfew/i,
    msg: 'WRONG: IL GDL curfew = 10 PM weekdays / 11 PM weekends (not midnight)' },
  // Wrong turn signal distance
  { pattern: /turn signal.*50 feet|50 feet.*turn signal/i,
    msg: 'WRONG: IL turn signal = 100ft (residential) / 200ft (other) — not 50ft' },
  // Wrong min age
  { pattern: /minimum.*age.*15(?!\s*-)|age.*15.*licens|licens.*age.*15/i,
    msg: 'POSSIBLE ERROR: IL min license age = 16 (permit at 15, license at 16)' },
  // Wrong railroad crossing stop distance
  { pattern: /railroad.*stop.*10 feet|10 feet.*railroad.*stop/i,
    msg: 'WRONG: IL railroad crossing stop = 15-50 feet (not 10)' },
  // Parallel parking wrong
  { pattern: /18 inch.*curb|curb.*18 inch/i,
    msg: 'WRONG: IL parallel park = within 12 inches of curb (not 18)' },
  // Wrong DUI refusal
  { pattern: /refus.*test.*6 month|6 month.*refus.*test/i,
    msg: 'WRONG: IL chem test refusal = 1 year suspension (not 6 months)' },
  // Wrong 4-lane highway speed
  { pattern: /four.lane.*55 mph|55 mph.*four.lane|4.lane.*55 mph/i,
    msg: 'WRONG: IL 4-lane highway = 65 mph (not 55)' },
];

// ── DUPLICATE DETECTION ──────────────────────────────────────────────────────
function normalize(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const intersection = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? intersection / union : 0;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== IL QA SCAN ===\n');

  const questions = await p.question.findMany({
    where: { stateId: STATE_ID },
    include: {
      choices: true,
      topic: { select: { name: true, id: true } },
    },
    orderBy: { topicId: 'asc' },
  });

  console.log(`Total questions: ${questions.length}\n`);

  // ── 1. FACTUAL ERROR SCAN ────────────────────────────────────────────────
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
  if (errors.length === 0) {
    console.log('No obvious factual errors detected.\n');
  } else {
    console.log(`Found ${errors.length} potential errors:\n`);
    for (const e of errors) {
      console.log(`  [${e.topic}] ID: ${e.id}`);
      console.log(`  Q: ${e.text}`);
      console.log(`  ⚠ ${e.msg}\n`);
    }
  }

  // ── 2. DUPLICATE SCAN ───────────────────────────────────────────────────
  console.log('=== DUPLICATE SCAN ===');
  const dupes = [];
  const byTopic = {};
  for (const q of questions) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }

  for (const [tid, qs] of Object.entries(byTopic)) {
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        const sim = similarity(qs[i].text, qs[j].text);
        if (sim >= 0.65) {
          dupes.push({
            sim: Math.round(sim * 100),
            topic: qs[i].topic.name,
            id1: qs[i].id, q1: qs[i].text.substring(0, 100),
            id2: qs[j].id, q2: qs[j].text.substring(0, 100),
          });
        }
      }
    }
  }
  dupes.sort((a, b) => b.sim - a.sim);

  if (dupes.length === 0) {
    console.log('No duplicates detected.\n');
  } else {
    console.log(`Found ${dupes.length} duplicate pairs:\n`);
    for (const d of dupes) {
      console.log(`  [${d.topic}] ${d.sim}% similar`);
      console.log(`  A: (${d.id1}) ${d.q1}`);
      console.log(`  B: (${d.id2}) ${d.q2}\n`);
    }
  }

  // ── 3. CONCEPT COVERAGE ─────────────────────────────────────────────────
  console.log('=== CONCEPT COVERAGE ===');
  const coverage = {};
  for (const [concept, cfg] of Object.entries(CONCEPTS)) {
    coverage[concept] = [];
  }

  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const [concept, cfg] of Object.entries(CONCEPTS)) {
      if (cfg.topic === q.topicId && cfg.pattern.test(combined)) {
        coverage[concept].push(q.id);
      }
    }
  }

  const gaps = [];
  const overtested = [];
  for (const [concept, ids] of Object.entries(coverage)) {
    if (ids.length === 0) gaps.push(concept);
    else if (ids.length > 8) overtested.push({ concept, count: ids.length, ids });
  }

  console.log('\nGAPS (0 questions):');
  if (gaps.length === 0) console.log('  None!');
  else gaps.forEach(g => console.log(`  ❌ ${g}`));

  console.log('\nOVER-TESTED (>8 questions):');
  if (overtested.length === 0) console.log('  None!');
  else overtested.forEach(o => console.log(`  ⚠ ${o.concept}: ${o.count} questions`));

  console.log('\nFULL CONCEPT COUNTS:');
  for (const [concept, ids] of Object.entries(coverage)) {
    const flag = ids.length === 0 ? ' ❌ GAP' : ids.length > 8 ? ` ⚠ OVER(${ids.length})` : '';
    console.log(`  ${concept}: ${ids.length}${flag}`);
  }

  // ── 4. TOPIC SUMMARY ────────────────────────────────────────────────────
  console.log('\n=== TOPIC SUMMARY ===');
  const topicNames = {
    [TOPIC.SIGNS]:   'Traffic Signs',
    [TOPIC.ROW]:     'Right Of Way',
    [TOPIC.SPEED]:   'Speed Limits',
    [TOPIC.SAFE]:    'Safe Driving',
    [TOPIC.ALCOHOL]: 'Alcohol & Substances',
    [TOPIC.LICENSE]: 'Licensing & Permits',
  };
  for (const [tid, qs] of Object.entries(byTopic)) {
    console.log(`  ${topicNames[tid] || tid}: ${qs.length}`);
  }
  console.log(`  TOTAL: ${questions.length}`);
  console.log(`  TARGET: 320-360 total, max 8 per concept`);
  console.log(`  NEED TO TRIM: ~${Math.max(0, questions.length - 340)} questions`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
