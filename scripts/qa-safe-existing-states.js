// scripts/qa-safe-existing-states.js
// SAFE QA pipeline for the 20 unverified states.
//
// RULES:
//   ✅ Factual errors  → LOGGED to qa-report.json only (no DB changes)
//   ✅ Duplicates      → LOGGED to qa-report.json only (no DB changes)
//   ✅ Over-tested     → LOGGED to qa-report.json only (no DB changes)
//   🗑 Broken integrity → DELETED (questions with no correct answer OR ≠4 choices are unusable)
//
// Run (dry-run, no deletes at all):
//   node scripts/qa-safe-existing-states.js --dry-run
//
// Run (real — only deletes structurally broken questions):
//   node scripts/qa-safe-existing-states.js
//
// Output: scripts/qa-report.json  ← review this before doing anything else

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) console.log('\n⚠️  DRY-RUN MODE — no DB changes will be made\n');

const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

// ── Topic IDs ──────────────────────────────────────────────────────────────
const TOPIC = {
  SIGNS:   'cmmpntv01001e3jd60a0j8onz',
  ROW:     'cmmpntvao001f3jd6afqngfl5',
  SPEED:   'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:    'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL: 'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE: 'cmn2ia2n20001ua6cq7y7tood',
};

const TOPIC_NAMES = {
  [TOPIC.SIGNS]:   'Traffic Signs',
  [TOPIC.ROW]:     'Right of Way',
  [TOPIC.SPEED]:   'Speed Limits',
  [TOPIC.SAFE]:    'Safe Driving',
  [TOPIC.ALCOHOL]: 'Alcohol & Substances',
  [TOPIC.LICENSE]: 'Licensing & Permits',
};

// ── States to QA (20 unverified) ──────────────────────────────────────────
// Excludes the 15 verified states: CA FL GA IL MI NY NC OH PA TX MA KY AL LA ME
const STATES = [
  'AZ','AR','CO','CT',          // restored states — extra scrutiny
  'IN','IA','KS','MD','MN','MS',
  'MO','NV','NJ','OK','OR',
  'TN','UT','VA','WA','WI',
];

// ── Handbook-verified factual error patterns ───────────────────────────────
// msg prefix: "WRONG" = clear error | "CHECK" = needs human eye
const STATE_ERRORS = {
  AZ: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: AZ fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: AZ fire hydrant = 15 ft (not 20)' },
    { pattern: /following.*2.second|2.second.*following/i, msg: 'CHECK: AZ following = 3-second min (3-6 poor conditions)' },
    { pattern: /residential.*30\b|30\b.*residential|business.*30\b|30\b.*business/i, msg: 'WRONG: AZ residential/business = 25 mph (not 30)' },
    { pattern: /residential.*35\b|35\b.*residential|business.*35\b|35\b.*business/i, msg: 'WRONG: AZ residential/business = 25 mph (not 35)' },
    { pattern: /school.*crosswalk.*20\b|20\b.*school.*crosswalk/i, msg: 'WRONG: AZ school crosswalk = 15 mph (not 20)' },
    { pattern: /school.*crosswalk.*25\b|25\b.*school.*crosswalk/i, msg: 'WRONG: AZ school crosswalk = 15 mph (not 25)' },
  ],
  AR: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: AR fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: AR fire hydrant = 15 ft (not 20)' },
    { pattern: /following.*3.second|3.second.*following|following.*4.second|4.second.*following/i, msg: 'CHECK: AR following = 2-second rule' },
  ],
  CO: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: CO following = 3-second rule (not 2)' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: CO fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: CO fire hydrant = 15 ft (not 20)' },
  ],
  CT: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: CT following = 3-second rule (not 2)' },
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: CT fire hydrant = 10 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: CT fire hydrant = 10 ft (not 20)' },
  ],
  IN: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: IN fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: IN fire hydrant = 15 ft (not 20)' },
    { pattern: /interstate.*65\b|65\b.*interstate/i, msg: 'CHECK: IN passenger vehicles = 70 mph max; trucks >26k lbs = 65 mph' },
  ],
  IA: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: IA fire hydrant = 5 ft (not 10)' },
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: IA fire hydrant = 5 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: IA fire hydrant = 5 ft (not 20)' },
    { pattern: /following.*2.second|2.second.*following/i, msg: 'CHECK: IA following = 3-to-4-second rule' },
    { pattern: /residential.*30\b|30\b.*residential/i, msg: 'WRONG: IA residential = 25 mph (not 30)' },
    { pattern: /residential.*35\b|35\b.*residential/i, msg: 'WRONG: IA residential = 25 mph (not 35)' },
  ],
  KS: [
    { pattern: /urban.*25\b|25\b.*urban|residential.*25\b|25\b.*residential/i, msg: 'WRONG: KS urban district = 30 mph (not 25)' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: KS fire hydrant = 15 ft (not 10)' },
    { pattern: /following.*3.second|3.second.*following/i, msg: 'CHECK: KS following = 2-second (good), 4-second (adverse)' },
  ],
  MD: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'CHECK: MD following = 3-to-4-second (handbook recommendation)' },
  ],
  MN: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: MN following = 3-second rule (not 2)' },
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: MN fire hydrant = 10 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: MN fire hydrant = 10 ft (not 20)' },
    { pattern: /urban.*25\b|25\b.*urban/i, msg: 'WRONG: MN urban/town = 30 mph (not 25)' },
    { pattern: /residential.*25\b|25\b.*residential/i, msg: 'CHECK: MN urban/town roads = 30 mph' },
  ],
  MS: [
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: MS fire hydrant = 10 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: MS fire hydrant = 10 ft (not 20)' },
    { pattern: /school zone.*20\b|20\b.*school zone/i, msg: 'WRONG: MS school zone = 15 mph (not 20)' },
    { pattern: /school zone.*25\b|25\b.*school zone/i, msg: 'WRONG: MS school zone = 15 mph (not 25)' },
  ],
  MO: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: MO following = 3-second rule (not 2)' },
    { pattern: /city.*30\b|30\b.*city|town.*30\b|30\b.*town|residential.*30\b|30\b.*residential/i, msg: 'WRONG: MO city/town/village = 25 mph (not 30)' },
    { pattern: /city.*35\b|35\b.*city|town.*35\b|35\b.*town/i, msg: 'WRONG: MO city/town/village = 25 mph (not 35)' },
    { pattern: /interstate.*65\b|65\b.*interstate/i, msg: 'CHECK: MO interstate max = 70 mph' },
  ],
  NV: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: NV following = 3-second min (not 2)' },
    { pattern: /residential.*30\b|30\b.*residential/i, msg: 'WRONG: NV residential = 25 mph (not 30)' },
    { pattern: /residential.*35\b|35\b.*residential/i, msg: 'WRONG: NV residential = 25 mph (not 35)' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: NV fire hydrant = 15 ft parallel / 20 ft angle (not 10)' },
  ],
  NJ: [
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: NJ fire hydrant = 10 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: NJ fire hydrant = 10 ft (not 20)' },
    { pattern: /residential.*30\b|30\b.*residential|business.*30\b|30\b.*business/i, msg: 'WRONG: NJ residential/business = 25 mph (not 30)' },
    { pattern: /school zone.*15\b|15\b.*school zone/i, msg: 'WRONG: NJ school zone = 25 mph (not 15)' },
    { pattern: /school zone.*20\b|20\b.*school zone/i, msg: 'WRONG: NJ school zone = 25 mph (not 20)' },
    { pattern: /interstate.*65\b|65\b.*interstate/i, msg: 'CHECK: NJ interstate default = 55 mph (65 on designated highways only)' },
  ],
  OK: [
    { pattern: /following.*2.second|2.second.*following/i, msg: 'WRONG: OK following = 3-second rule (not 2)' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: OK fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: OK fire hydrant = 15 ft (not 20)' },
  ],
  OR: [
    { pattern: /fire hydrant.*15\b|15\b.*fire hydrant/i, msg: 'WRONG: OR fire hydrant = 10 ft (not 15)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: OR fire hydrant = 10 ft (not 20)' },
    { pattern: /business.*25\b|25\b.*business/i, msg: 'WRONG: OR business district = 20 mph (not 25)' },
    { pattern: /residential.*20\b|20\b.*residential/i, msg: 'CHECK: OR residential = 25 mph (20 is for business districts)' },
    { pattern: /school zone.*15\b|15\b.*school zone/i, msg: 'CHECK: OR school zone = 20 mph (not 15)' },
    { pattern: /school zone.*25\b|25\b.*school zone/i, msg: 'WRONG: OR school zone = 20 mph (not 25)' },
  ],
  TN: [
    { pattern: /following.*3.second|3.second.*following|following.*4.second|4.second.*following/i, msg: 'CHECK: TN following = 2-second rule' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: TN fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: TN fire hydrant = 15 ft (not 20)' },
  ],
  UT: [
    { pattern: /following.*3.second|3.second.*following|following.*4.second|4.second.*following/i, msg: 'CHECK: UT following = 2-second rule' },
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: UT fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: UT fire hydrant = 15 ft (not 20)' },
    { pattern: /residential.*30\b|30\b.*residential|business.*30\b|30\b.*business/i, msg: 'WRONG: UT residential/business = 25 mph (not 30)' },
    { pattern: /school zone.*15\b|15\b.*school zone/i, msg: 'CHECK: UT school zone = 20 mph (not 15)' },
  ],
  VA: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: VA fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: VA fire hydrant = 15 ft (not 20)' },
    { pattern: /residential.*30\b|30\b.*residential|business.*30\b|30\b.*business/i, msg: 'WRONG: VA residential/business = 25 mph (not 30)' },
    { pattern: /residential.*35\b|35\b.*residential|business.*35\b|35\b.*business/i, msg: 'WRONG: VA residential/business = 25 mph (not 35)' },
  ],
  WA: [
    { pattern: /fire hydrant.*10\b|10\b.*fire hydrant/i, msg: 'WRONG: WA fire hydrant = 15 ft (not 10)' },
    { pattern: /fire hydrant.*20\b|20\b.*fire hydrant/i, msg: 'WRONG: WA fire hydrant = 15 ft (not 20)' },
    { pattern: /school zone.*15\b|15\b.*school zone/i, msg: 'WRONG: WA school zone = 20 mph (not 15)' },
    { pattern: /school zone.*25\b|25\b.*school zone/i, msg: 'WRONG: WA school zone = 20 mph (not 25)' },
  ],
  WI: [
    { pattern: /following.*2.second|2.second.*following|following.*3.second|3.second.*following/i, msg: 'WRONG: WI following = 4-second rule' },
    { pattern: /school zone.*20\b|20\b.*school zone/i, msg: 'WRONG: WI school zone = 15 mph (not 20)' },
    { pattern: /school zone.*25\b|25\b.*school zone/i, msg: 'WRONG: WI school zone = 15 mph (not 25)' },
    { pattern: /outlying.*25\b|25\b.*outlying|village.*25\b|25\b.*village/i, msg: 'WRONG: WI outlying city/village = 35 mph (not 25)' },
  ],
};

// ── Concept coverage ───────────────────────────────────────────────────────
const CONCEPTS = [
  { tag: 'speed:residential',  re: /residential.*speed|speed.*residential|business.*district.*speed|\d+\s*mph.*(residential|business|urban)/i },
  { tag: 'speed:school-zone',  re: /school.*zone.*speed|speed.*school.*zone/i },
  { tag: 'speed:highway',      re: /highway.*speed|interstate.*speed|speed.*highway|speed.*interstate|freeway.*speed/i },
  { tag: 'speed:following',    re: /following.*distance|second.*rule|tailgat/i },
  { tag: 'speed:work-zone',    re: /work.*zone|construction.*zone/i },
  { tag: 'row:pedestrian',     re: /pedestrian|crosswalk/i },
  { tag: 'row:school-bus',     re: /school bus/i },
  { tag: 'row:emergency',      re: /emergency vehicle|ambulance|fire truck|siren/i },
  { tag: 'row:roundabout',     re: /roundabout|traffic circle|rotary/i },
  { tag: 'row:intersection',   re: /four.way.stop|all.way.stop|4.way|uncontrolled.*intersect/i },
  { tag: 'row:left-turn',      re: /left.*turn.*yield|yield.*left.*turn|oncoming.*left/i },
  { tag: 'safe:headlights',    re: /headlight|high beam|low beam/i },
  { tag: 'safe:seatbelt',      re: /seat.?belt|safety belt/i },
  { tag: 'safe:child-seat',    re: /child.*seat|car.*seat|booster.*seat|child.*restrain/i },
  { tag: 'safe:phone',         re: /cell.?phone|handheld|hands.free|texting|electronic.*device/i },
  { tag: 'safe:passing',       re: /pass.*vehicle|no.passing|passing.*zone|solid yellow/i },
  { tag: 'safe:parking',       re: /fire hydrant|park.*feet|parallel park/i },
  { tag: 'safe:weather',       re: /fog|snow|ice|rain.*driv|visibility|adverse.*weather/i },
  { tag: 'alcohol:bac',        re: /\.08|blood.*alcohol|BAC/i },
  { tag: 'alcohol:under21',    re: /under.*21|zero.*tolerance|minor.*alcohol/i },
  { tag: 'alcohol:penalties',  re: /DUI.*penalt|OUI.*penalt|DWI.*penalt|penalt.*DUI|first.*offense|jail.*DUI|fine.*DUI/i },
  { tag: 'alcohol:implied',    re: /implied.*consent|refus.*test|chemical.*test/i },
  { tag: 'license:permit-age', re: /permit.*age|age.*permit|minimum.*age|learner/i },
  { tag: 'license:gdl',        re: /graduated|intermediate|provisional|junior.*operator/i },
  { tag: 'signs:stop',         re: /stop sign|octagon/i },
  { tag: 'signs:yield',        re: /yield sign|triangle.*sign/i },
  { tag: 'signs:warning',      re: /warning sign|diamond.*sign|yellow.*sign.*warn/i },
  { tag: 'signs:regulatory',   re: /regulatory.*sign|white.*sign.*rule|speed limit.*sign/i },
  { tag: 'signs:flashing',     re: /flashing.*red|flashing.*yellow|flash.*light/i },
  { tag: 'signs:railroad',     re: /railroad.*sign|crossbuck|RR.*sign/i },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function normalize(t) {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}
function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const inter = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? inter / union : 0;
}
function qualityScore(q) {
  let s = 50;
  if (q.text.length > 120) s += 15;
  if (/you are driving|you see|you approach|you notice|you're|you enter/i.test(q.text)) s += 20;
  if (/\d+\s*(mph|feet|foot|%|hour|day|month)/i.test(q.text)) s += 10;
  if (q.text.length < 60) s -= 20;
  return s;
}

// Only deletes structurally broken questions (no correct answer / wrong choice count)
async function deleteBroken(ids, reason) {
  if (!ids.length) return 0;
  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would delete ${ids.length} broken questions (${reason})`);
    return 0;
  }
  await p.$transaction([
    p.userProgress.deleteMany({ where: { questionId: { in: ids } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: ids } } }),
    p.choice.deleteMany({ where: { questionId: { in: ids } } }),
    p.question.deleteMany({ where: { id: { in: ids } } }),
  ]);
  return ids.length;
}

// ── Per-state processor ────────────────────────────────────────────────────
async function processState(stateCode) {
  const stateRecord = await p.state.findUnique({ where: { code: stateCode } });
  if (!stateRecord) {
    console.log(`❌ ${stateCode} not found in DB`);
    return null;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${stateCode}`);
  console.log('─'.repeat(60));

  const questions = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true, topic: { select: { name: true, id: true } } },
    orderBy: { topicId: 'asc' },
  });
  console.log(`  Total questions: ${questions.length}`);

  const report = {
    state: stateCode,
    totalBefore: questions.length,
    factualErrors: [],
    duplicates: [],
    overTested: [],
    broken: { noCorrectAnswer: [], wrongChoiceCount: [] },
    conceptGaps: [],
    totalAfter: null,
  };

  // ── 1. FACTUAL ERROR SCAN (log only — no deletes) ──────────────────────
  console.log('\n  [1] FACTUAL ERROR SCAN (log only)');
  const errorPatterns = STATE_ERRORS[stateCode] || [];
  for (const q of questions) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ') + ' ' + (q.explanation || '');
    for (const ep of errorPatterns) {
      if (ep.pattern.test(combined)) {
        report.factualErrors.push({
          id: q.id,
          topic: q.topic.name,
          severity: ep.msg.startsWith('WRONG') ? 'WRONG' : 'CHECK',
          issue: ep.msg,
          questionText: q.text.substring(0, 120),
        });
        console.log(`  ⚠ [${ep.msg.startsWith('WRONG') ? 'WRONG' : 'CHECK'}] ${q.text.substring(0, 80)}`);
        console.log(`    → ${ep.msg}`);
      }
    }
  }
  if (report.factualErrors.length === 0) console.log('  ✅ No factual errors detected');
  else console.log(`  Found ${report.factualErrors.length} issues — logged to report, NO deletions`);

  // ── 2. DUPLICATE SCAN (log only — no deletes) ──────────────────────────
  console.log('\n  [2] DUPLICATE SCAN (log only)');
  const byTopic = {};
  for (const q of questions) {
    if (!byTopic[q.topicId]) byTopic[q.topicId] = [];
    byTopic[q.topicId].push(q);
  }
  const seenDupes = new Set();
  for (const qs of Object.values(byTopic)) {
    for (let i = 0; i < qs.length; i++) {
      for (let j = i + 1; j < qs.length; j++) {
        if (seenDupes.has(qs[i].id) || seenDupes.has(qs[j].id)) continue;
        const sim = similarity(qs[i].text, qs[j].text);
        if (sim >= 0.65) {
          const weaker = qualityScore(qs[i]) >= qualityScore(qs[j]) ? qs[j] : qs[i];
          seenDupes.add(weaker.id);
          report.duplicates.push({
            keepId: weaker.id === qs[i].id ? qs[j].id : qs[i].id,
            removeId: weaker.id,
            similarity: Math.round(sim * 100),
            keepText: (weaker.id === qs[i].id ? qs[j] : qs[i]).text.substring(0, 80),
            removeText: weaker.text.substring(0, 80),
          });
        }
      }
    }
  }
  if (report.duplicates.length === 0) console.log('  ✅ No duplicates found');
  else console.log(`  Found ${report.duplicates.length} potential duplicates — logged to report, NO deletions`);

  // ── 3. OVER-TESTED CONCEPTS (log only — no deletes) ────────────────────
  console.log('\n  [3] OVER-TESTED CONCEPTS (log only)');
  const MAX_PER_CONCEPT = 8;
  const TRIM_PATTERNS = [
    { label: 'fire hydrant',    topicId: TOPIC.SAFE,    pattern: /fire hydrant|hydrant/i },
    { label: 'school bus',      topicId: TOPIC.ROW,     pattern: /school bus/i },
    { label: 'BAC/blood alcohol', topicId: TOPIC.ALCOHOL, pattern: /\.08|BAC|blood alcohol/i },
    { label: 'headlights',      topicId: TOPIC.SAFE,    pattern: /headlight|high beam/i },
    { label: 'seatbelt',        topicId: TOPIC.SAFE,    pattern: /seat.?belt|safety belt/i },
    { label: 'speed:residential', topicId: TOPIC.SPEED, pattern: /residential.*speed|speed.*residential|urban.*\d+\s*mph/i },
    { label: 'pedestrian',      topicId: TOPIC.ROW,     pattern: /pedestrian|crosswalk/i },
    { label: 'emergency vehicle', topicId: TOPIC.ROW,   pattern: /emergency vehicle|ambulance|fire truck/i },
    { label: 'texting/phone',   topicId: TOPIC.SAFE,    pattern: /text.*driv|cell.*phone|handheld|hands.free/i },
    { label: 'DUI penalties',   topicId: TOPIC.ALCOHOL, pattern: /DUI.*penalt|OUI.*penalt|DWI.*penalt|first.*offense.*DUI/i },
    { label: 'warning signs',   topicId: TOPIC.SIGNS,   pattern: /warning sign|diamond.*sign|yellow.*sign/i },
    { label: 'sign colors',     topicId: TOPIC.SIGNS,   pattern: /sign.*color|color.*sign|blue.*sign|green.*sign/i },
    { label: 'learner permit',  topicId: TOPIC.LICENSE, pattern: /learner.?s? permit|instruction permit/i },
  ];
  for (const { label, topicId, pattern } of TRIM_PATTERNS) {
    const matching = questions.filter(q => q.topicId === topicId && pattern.test(q.text + ' ' + q.choices.map(c => c.text).join(' ')));
    if (matching.length > MAX_PER_CONCEPT) {
      matching.sort((a, b) => qualityScore(b) - qualityScore(a));
      const toFlag = matching.slice(MAX_PER_CONCEPT).map(q => ({ id: q.id, text: q.text.substring(0, 80) }));
      report.overTested.push({ concept: label, count: matching.length, max: MAX_PER_CONCEPT, suggested: toFlag });
      console.log(`  ⚠ "${label}": ${matching.length} questions (max ${MAX_PER_CONCEPT}) — logged, NOT deleted`);
    }
  }
  if (report.overTested.length === 0) console.log('  ✅ No over-tested concepts');

  // ── 4. DATA INTEGRITY (only actual deletions) ──────────────────────────
  console.log('\n  [4] DATA INTEGRITY (broken questions only — will delete)');
  const noCorrect = questions.filter(q => !q.choices.some(c => c.isCorrect));
  const wrongCount = questions.filter(q => q.choices.length !== 4);

  if (noCorrect.length) {
    console.log(`  ❌ ${noCorrect.length} questions with no correct answer`);
    report.broken.noCorrectAnswer = noCorrect.map(q => ({ id: q.id, text: q.text.substring(0, 80) }));
    const deleted = await deleteBroken(noCorrect.map(q => q.id), 'no correct answer');
    if (deleted) console.log(`  🗑 Deleted ${deleted}`);
  } else {
    console.log('  ✅ All questions have a correct answer');
  }

  if (wrongCount.length) {
    // Some may overlap with noCorrect — filter already-deleted ones
    const noCorrectIds = new Set(noCorrect.map(q => q.id));
    const toDelete = wrongCount.filter(q => !noCorrectIds.has(q.id));
    console.log(`  ❌ ${toDelete.length} questions without exactly 4 choices`);
    report.broken.wrongChoiceCount = toDelete.map(q => ({ id: q.id, choiceCount: q.choices.length, text: q.text.substring(0, 80) }));
    const deleted = await deleteBroken(toDelete.map(q => q.id), 'wrong choice count');
    if (deleted) console.log(`  🗑 Deleted ${deleted}`);
  } else {
    console.log('  ✅ All questions have exactly 4 choices');
  }

  // ── 5. CONCEPT COVERAGE ────────────────────────────────────────────────
  console.log('\n  [5] CONCEPT COVERAGE');
  const finalQs = await p.question.findMany({
    where: { stateId: stateRecord.id },
    include: { choices: true },
  });
  const coverage = {};
  for (const c of CONCEPTS) coverage[c.tag] = 0;
  for (const q of finalQs) {
    const combined = q.text + ' ' + q.choices.map(c => c.text).join(' ');
    for (const concept of CONCEPTS) {
      if (concept.re.test(combined)) coverage[concept.tag]++;
    }
  }
  const gaps = Object.entries(coverage).filter(([, n]) => n === 0).map(([t]) => t);
  report.conceptGaps = gaps;
  if (gaps.length) console.log(`  Gaps: ${gaps.join(', ')}`);
  else console.log('  ✅ No concept gaps');

  // ── 6. FINAL SUMMARY ──────────────────────────────────────────────────
  report.totalAfter = finalQs.length;
  const inRange = finalQs.length >= 320 && finalQs.length <= 460;
  console.log(`\n  TOTAL: ${finalQs.length} ${inRange ? '✅' : '⚠ (outside 320-460 target)'}`);
  console.log(`  Factual issues: ${report.factualErrors.length} | Dupes: ${report.duplicates.length} | Broken deleted: ${noCorrect.length + wrongCount.length}`);

  return report;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔍 SAFE QA PIPELINE — 20 UNVERIFIED STATES');
  console.log('   Factual errors & duplicates: LOGGED ONLY');
  console.log('   Broken integrity questions:  DELETED\n');

  const allReports = [];
  for (const code of STATES) {
    const report = await processState(code);
    if (report) allReports.push(report);
  }

  // Write full JSON report
  const reportPath = 'scripts/qa-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(allReports, null, 2));
  console.log(`\n📄 Full report written to ${reportPath}`);

  // Print summary table
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log('  State | Before | After | Factual | Dupes | Broken | Gaps');
  console.log('  ' + '-'.repeat(66));
  for (const r of allReports) {
    const brokenTotal = r.broken.noCorrectAnswer.length + r.broken.wrongChoiceCount.length;
    const status = r.factualErrors.filter(e => e.severity === 'WRONG').length === 0 && brokenTotal === 0 ? '✅' : '⚠ ';
    console.log(`  ${status} ${r.state.padEnd(3)} | ${String(r.totalBefore).padStart(6)} | ${String(r.totalAfter).padStart(5)} | ${String(r.factualErrors.length).padStart(7)} | ${String(r.duplicates.length).padStart(5)} | ${String(brokenTotal).padStart(6)} | ${r.conceptGaps.length}`);
  }
  console.log('\n✅ Done. Review scripts/qa-report.json before making any fixes.');
}

main().catch(console.error).finally(() => p.$disconnect());
