// scripts/qa-batch2-states.js
// QA pipeline for batch 2 states: MA, KY, AL, LA, ME
// Runs: duplicate scan, concept coverage check, over-tested trimming, data integrity, final summary
// Run: node scripts/qa-batch2-states.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const TOPIC = {
  SIGNS:   'cmmpntv01001e3jd60a0j8onz',
  ROW:     'cmmpntvao001f3jd6afqngfl5',
  SPEED:   'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:    'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL: 'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE: 'cmn2ia2n20001ua6cq7y7tood',
};

const TOPIC_NAMES = {
  [TOPIC.SIGNS]:'Traffic Signs', [TOPIC.ROW]:'Right of Way',
  [TOPIC.SPEED]:'Speed Limits', [TOPIC.SAFE]:'Safe Driving',
  [TOPIC.ALCOHOL]:'Alcohol & Substances', [TOPIC.LICENSE]:'Licensing & Permits',
};

const STATES = ['MA','KY','AL','LA','ME'];

// -- State-specific error patterns (facts that differ between states)
const STATE_ERRORS = {
  MA: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: MA following = 3-second (not 2)' },
    { pattern: /thickly.*settled.*25|25.*thickly.*settled/i, msg: 'CHECK: MA thickly settled default = 30 mph (25 only if posted)' },
    { pattern: /permit.*age.*15|age.*15.*permit|minimum.*15.*permit/i, msg: 'WRONG: MA permit age = 16 (not 15)' },
    { pattern: /DUI|DWI/i, msg: 'CHECK: MA uses OUI (not DUI/DWI)' },
    { pattern: /DMV/i, msg: 'CHECK: MA uses RMV (Registry of Motor Vehicles, not DMV)' },
    { pattern: /fire hydrant.*15|15.*fire hydrant/i, msg: 'WRONG: MA fire hydrant = 10 feet (not 15)' },
    { pattern: /curfew.*11|11.*curfew|curfew.*midnight(?!.*12:30)/i, msg: 'CHECK: MA JOL curfew = 12:30 AM - 5 AM' },
  ],
  KY: [
    { pattern: /following.*2.second|2.second.*following|following.*3.second|3.second.*following/i, msg: 'CHECK: KY following = 4-second minimum' },
    { pattern: /residential.*25|25.*residential/i, msg: 'WRONG: KY residential/business = 35 mph (not 25)' },
    { pattern: /permit.*age.*16(?!\.)|(?<!1)16.*permit.*age/i, msg: 'CHECK: KY permit age was 16 but lowered to 15 as of March 2025' },
    { pattern: /DMV/i, msg: 'CHECK: KY uses KSP (Kentucky State Police) for licensing, not DMV' },
    { pattern: /knowledge test.*30|30.*question.*test/i, msg: 'WRONG: KY test = 40 questions (not 30)' },
  ],
  AL: [
    { pattern: /residential.*25|25.*residential|urban.*25|25.*urban/i, msg: 'WRONG: AL urban district = 30 mph (not 25)' },
    { pattern: /fire hydrant.*10|10.*fire hydrant/i, msg: 'WRONG: AL fire hydrant = 15 feet (not 10)' },
    { pattern: /fire hydrant.*20|20.*fire hydrant/i, msg: 'WRONG: AL fire hydrant = 15 feet (not 20)' },
    { pattern: /DMV/i, msg: 'CHECK: AL uses ALEA (Alabama Law Enforcement Agency), not DMV' },
    { pattern: /knowledge test.*30|30.*question.*test/i, msg: 'CHECK: AL test = 40 questions' },
  ],
  LA: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: LA following = 3-second (not 2)' },
    { pattern: /maximum.*75|75.*maximum|speed.*75/i, msg: 'WRONG: LA max speed = 70 mph (not 75)' },
    { pattern: /DMV/i, msg: 'CHECK: LA uses OMV (Office of Motor Vehicles), not DMV' },
    { pattern: /fire hydrant.*10|10.*fire hydrant/i, msg: 'WRONG: LA fire hydrant = 15 feet (not 10)' },
    { pattern: /open container.*illegal.*passenger|passenger.*cannot.*open container/i, msg: 'CHECK: LA unique — passengers MAY have open containers in some parishes, driver may NOT' },
  ],
  ME: [
    { pattern: /following.*2.second|2.second.*following|following.*3.second|3.second.*following/i, msg: 'CHECK: ME following = 4-second minimum' },
    { pattern: /fire hydrant.*15|15.*fire hydrant/i, msg: 'WRONG: ME fire hydrant = 10 feet (not 15)' },
    { pattern: /residential.*30|30.*residential/i, msg: 'WRONG: ME residential/business = 25 mph (not 30)' },
    { pattern: /DMV/i, msg: 'CHECK: ME uses BMV (Bureau of Motor Vehicles)' },
    { pattern: /permit.*age.*16|age.*16.*permit/i, msg: 'WRONG: ME permit age = 15 (not 16)' },
    { pattern: /school zone.*20|20.*school zone/i, msg: 'WRONG: ME school zone = 15 mph (not 20)' },
  ],
};

// -- Concept coverage patterns (universal)
const CONCEPTS = [
  { tag: 'speed:residential', re: /residential.*speed|speed.*residential|business.*district.*speed|\d+\s*mph.*(residential|business|urban)/i },
  { tag: 'speed:school-zone', re: /school.*zone.*speed|speed.*school.*zone/i },
  { tag: 'speed:highway', re: /highway.*speed|interstate.*speed|speed.*highway|speed.*interstate|freeway.*speed/i },
  { tag: 'speed:following', re: /following.*distance|second.*rule|tailgat/i },
  { tag: 'speed:work-zone', re: /work.*zone|construction.*zone/i },
  { tag: 'speed:minimum', re: /minimum speed|slow.*traffic|impede.*traffic|too slow/i },
  { tag: 'row:pedestrian', re: /pedestrian|crosswalk/i },
  { tag: 'row:school-bus', re: /school bus/i },
  { tag: 'row:emergency', re: /emergency vehicle|ambulance|fire truck|siren/i },
  { tag: 'row:roundabout', re: /roundabout|traffic circle|rotary/i },
  { tag: 'row:intersection', re: /four.way.stop|all.way.stop|4.way|uncontrolled.*intersect/i },
  { tag: 'row:left-turn', re: /left.*turn.*yield|yield.*left.*turn|oncoming.*left/i },
  { tag: 'row:bicycle', re: /bicycl|cyclist/i },
  { tag: 'safe:headlights', re: /headlight|high beam|low beam/i },
  { tag: 'safe:seatbelt', re: /seat.?belt|safety belt/i },
  { tag: 'safe:child-seat', re: /child.*seat|car.*seat|booster.*seat|child.*restrain/i },
  { tag: 'safe:phone', re: /cell.?phone|handheld|hands.free|texting|electronic.*device/i },
  { tag: 'safe:passing', re: /pass.*vehicle|no.passing|passing.*zone|solid yellow/i },
  { tag: 'safe:parking', re: /fire hydrant|park.*feet|parallel park/i },
  { tag: 'safe:skid', re: /skid|hydroplan/i },
  { tag: 'safe:weather', re: /fog|snow|ice|rain.*driv|visibility|adverse.*weather/i },
  { tag: 'alcohol:bac', re: /\.08|blood.*alcohol|BAC/i },
  { tag: 'alcohol:under21', re: /under.*21|zero.*tolerance|minor.*alcohol/i },
  { tag: 'alcohol:penalties', re: /DUI.*penalt|OUI.*penalt|DWI.*penalt|penalt.*DUI|penalt.*OUI|first.*offense|jail.*DUI|fine.*DUI/i },
  { tag: 'alcohol:implied-consent', re: /implied.*consent|refus.*test|chemical.*test/i },
  { tag: 'alcohol:open-container', re: /open.*container/i },
  { tag: 'license:permit-age', re: /permit.*age|age.*permit|minimum.*age|learner/i },
  { tag: 'license:gdl', re: /graduated|intermediate|provisional|junior.*operator|JOL/i },
  { tag: 'license:curfew', re: /curfew|nighttime.*restrict|midnight/i },
  { tag: 'license:passenger', re: /passenger.*restrict|restrict.*passenger/i },
  { tag: 'license:supervised', re: /supervised.*hour|practice.*hour|\d+.*hour.*driving/i },
  { tag: 'license:points', re: /point.*system|points.*suspend|accumulate.*point/i },
  { tag: 'signs:stop', re: /stop sign|octagon/i },
  { tag: 'signs:yield', re: /yield sign|triangle.*sign/i },
  { tag: 'signs:warning', re: /warning sign|diamond.*sign|yellow.*sign.*warn/i },
  { tag: 'signs:construction', re: /construction.*sign|orange.*sign|work.*zone.*sign/i },
  { tag: 'signs:regulatory', re: /regulatory.*sign|white.*sign.*rule|speed limit.*sign/i },
  { tag: 'signs:guide', re: /guide.*sign|green.*sign|blue.*sign|brown.*sign/i },
  { tag: 'signs:flashing', re: /flashing.*red|flashing.*yellow|flash.*light/i },
  { tag: 'signs:railroad', re: /railroad.*sign|crossbuck|RR.*sign/i },
];

function normalize(t) { return t.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim(); }
function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const inter = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? inter / union : 0;
}

function score(q) {
  let s = 50;
  if (q.text.length > 120) s += 15;
  if (/you are driving|you see|you approach|you notice|you're|you enter/i.test(q.text)) s += 20;
  if (/\d+\s*(mph|feet|foot|%|hour|day|month)/i.test(q.text)) s += 10;
  if (q.text.length < 60) s -= 20;
  return s;
}

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

async function processState(stateCode) {
  const stateRecord = await p.state.findUnique({where:{code:stateCode}});
  if (!stateRecord) { console.log(`❌ ${stateCode} not found`); return; }

  console.log(`\n${'█'.repeat(60)}`);
  console.log(`  ${stateCode} — QA SCAN + TRIM + VERIFY`);
  console.log('█'.repeat(60));

  const questions = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
    orderBy: { topicId: 'asc' },
  });
  console.log(`\n  Total questions: ${questions.length}`);

  // ── 1. FACTUAL ERRORS ──
  console.log('\n  === FACTUAL ERROR SCAN ===');
  const errorPatterns = STATE_ERRORS[stateCode] || [];
  let errorCount = 0;
  const errorIds = [];
  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ') + ' ' + (q.explanation || '');
    for (const ep of errorPatterns) {
      if (ep.pattern.test(combined)) {
        errorCount++;
        console.log(`  ⚠ [${q.topic.name}] ${q.text.substring(0, 90)}`);
        console.log(`    ${ep.msg}`);
        // Only auto-delete clear WRONGs, not CHECKs
        if (ep.msg.startsWith('WRONG')) errorIds.push(q.id);
      }
    }
  }
  if (errorCount === 0) console.log('  ✅ No factual errors detected');
  else console.log(`  Found ${errorCount} potential issues (${errorIds.length} marked for deletion)`);
  
  if (errorIds.length > 0) {
    const deleted = await deleteQuestions(errorIds);
    console.log(`  🗑 Deleted ${deleted} questions with factual errors`);
  }

  // Refresh after deletions
  const questionsAfterErrors = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
    orderBy: { topicId: 'asc' },
  });

  // ── 2. DUPLICATES ──
  console.log('\n  === DUPLICATE SCAN ===');
  const byTopic = {};
  for (const q of questionsAfterErrors) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }
  const dupeIds = new Set();
  for (const qs of Object.values(byTopic)) {
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        if (dupeIds.has(qs[j].id)) continue;
        const sim = similarity(qs[i].text, qs[j].text);
        if (sim >= 0.65) {
          // Keep the higher-scoring one
          const toRemove = score(qs[i]) >= score(qs[j]) ? qs[j].id : qs[i].id;
          dupeIds.add(toRemove);
        }
      }
    }
  }
  if (dupeIds.size === 0) console.log('  ✅ No duplicates found');
  else {
    const deleted = await deleteQuestions([...dupeIds]);
    console.log(`  🗑 Removed ${deleted} duplicate questions`);
  }

  // ── 3. TRIM OVER-TESTED CONCEPTS ──
  console.log('\n  === TRIM OVER-TESTED ===');
  const MAX_PER_CONCEPT = 8;
  const questionsAfterDedup = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
  });
  
  const TRIM_PATTERNS = [
    { label: 'fire hydrant', topicId: TOPIC.SAFE, pattern: /fire hydrant|hydrant/i },
    { label: 'school bus', topicId: TOPIC.ROW, pattern: /school bus/i },
    { label: 'BAC/blood alcohol', topicId: TOPIC.ALCOHOL, pattern: /\.08|BAC|blood alcohol/i },
    { label: 'headlights', topicId: TOPIC.SAFE, pattern: /headlight|high beam/i },
    { label: 'seatbelt', topicId: TOPIC.SAFE, pattern: /seat.?belt|safety belt/i },
    { label: 'speed:residential', topicId: TOPIC.SPEED, pattern: /residential.*speed|speed.*residential|urban.*\d+\s*mph/i },
    { label: 'pedestrian', topicId: TOPIC.ROW, pattern: /pedestrian|crosswalk/i },
    { label: 'emergency vehicle', topicId: TOPIC.ROW, pattern: /emergency vehicle|ambulance|fire truck/i },
    { label: 'texting/phone', topicId: TOPIC.SAFE, pattern: /text.*driv|cell.*phone|handheld|hands.free/i },
    { label: 'DUI penalties', topicId: TOPIC.ALCOHOL, pattern: /DUI.*penalt|OUI.*penalt|DWI.*penalt|first.*offense.*DUI|first.*offense.*OUI/i },
    { label: 'warning signs', topicId: TOPIC.SIGNS, pattern: /warning sign|diamond.*sign|yellow.*sign/i },
    { label: 'sign colors', topicId: TOPIC.SIGNS, pattern: /sign.*color|color.*sign|blue.*sign|brown.*sign|green.*sign/i },
    { label: 'learner permit', topicId: TOPIC.LICENSE, pattern: /learner.?s? permit|instruction permit/i },
  ];

  let trimTotal = 0;
  for (const { label, topicId, pattern } of TRIM_PATTERNS) {
    const matching = questionsAfterDedup.filter(q => q.topicId === topicId && pattern.test(q.text + ' ' + q.choices.map(c=>c.text).join(' ')));
    if (matching.length > MAX_PER_CONCEPT) {
      matching.sort((a, b) => score(b) - score(a));
      const toDelete = matching.slice(MAX_PER_CONCEPT).map(q => q.id);
      const deleted = await deleteQuestions(toDelete);
      console.log(`  ${label}: ${matching.length} → ${MAX_PER_CONCEPT} (deleted ${deleted})`);
      trimTotal += deleted;
    }
  }
  if (trimTotal === 0) console.log('  ✅ No over-tested concepts');
  else console.log(`  Total trimmed: ${trimTotal}`);

  // ── 4. DATA INTEGRITY ──
  console.log('\n  === DATA INTEGRITY ===');
  const finalQs = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
  });
  const broken = finalQs.filter(q => !q.choices.some(c => c.isCorrect));
  const wrongCount = finalQs.filter(q => q.choices.length !== 4);
  if (broken.length) {
    console.log(`  ❌ ${broken.length} questions have no correct answer — deleting`);
    await deleteQuestions(broken.map(q => q.id));
  } else console.log('  ✅ All questions have a correct answer');
  if (wrongCount.length) {
    console.log(`  ❌ ${wrongCount.length} questions don't have exactly 4 choices — deleting`);
    await deleteQuestions(wrongCount.map(q => q.id));
  } else console.log('  ✅ All questions have exactly 4 choices');

  // ── 5. CONCEPT COVERAGE ──
  console.log('\n  === CONCEPT COVERAGE ===');
  const verifyQs = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
  });
  const coverage = {};
  for (const c of CONCEPTS) coverage[c.tag] = 0;
  for (const q of verifyQs) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const concept of CONCEPTS) {
      if (concept.re.test(combined)) coverage[concept.tag]++;
    }
  }
  const gaps = Object.entries(coverage).filter(([,n]) => n === 0).map(([t]) => t);
  const over = Object.entries(coverage).filter(([,n]) => n > 10).map(([t,n]) => `${t}(${n})`);
  if (gaps.length) console.log(`  Gaps: ${gaps.join(', ')}`);
  else console.log('  ✅ No concept gaps');
  if (over.length) console.log(`  Over-tested: ${over.join(', ')}`);
  else console.log('  ✅ No over-tested concepts');

  // ── 6. FINAL SUMMARY ──
  console.log('\n  === FINAL SUMMARY ===');
  const finalByTopic = {};
  for (const q of verifyQs) {
    if (!finalByTopic[q.topicId]) finalByTopic[q.topicId] = 0;
    finalByTopic[q.topicId]++;
  }
  for (const [tid, count] of Object.entries(finalByTopic)) {
    console.log(`  ${TOPIC_NAMES[tid] || tid}: ${count}`);
  }
  console.log(`  TOTAL: ${verifyQs.length}`);
  const target = verifyQs.length >= 320 && verifyQs.length <= 460;
  console.log(target ? '  ✅ Within target range (320-460)' : `  ⚠ Outside target (${verifyQs.length})`);
  
  return { state: stateCode, total: verifyQs.length, gaps: gaps.length, broken: broken.length + wrongCount.length };
}

async function main() {
  console.log('🔍 QA PIPELINE — BATCH 2 STATES\n');
  const results = [];
  for (const code of STATES) {
    const result = await processState(code);
    if (result) results.push(result);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('FINAL REPORT');
  console.log('='.repeat(60));
  for (const r of results) {
    const status = r.gaps === 0 && r.broken === 0 ? '✅' : '⚠';
    console.log(`  ${status} ${r.state}: ${r.total} questions | Gaps: ${r.gaps} | Broken: ${r.broken}`);
  }
}

main().catch(console.error).finally(() => p.$disconnect());
