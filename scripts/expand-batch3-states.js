// scripts/expand-batch3-states.js
// Expands NJ and OK from 240 → ~400 questions (OR and TN already done)
// Uses official handbook content fetched from nj.gov and oklahoma.gov
// Run: node scripts/expand-batch3-states.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const https = require('https');

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) console.log('\n⚠️  DRY-RUN MODE — no DB changes\n');

const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_API_KEY = envFile.match(/ANTHROPIC_API_KEY="([^"]+)"/)?.[1];
const p = new PrismaClient();

const TOPIC = {
  SIGNS:   'cmmpntv01001e3jd60a0j8onz',
  ROW:     'cmmpntvao001f3jd6afqngfl5',
  SPEED:   'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:    'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL: 'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE: 'cmn2ia2n20001ua6cq7y7tood',
};

// ── Official handbook content fetched from nj.gov and oklahoma.gov ─────────
const NJ_HANDBOOK = `
NEW JERSEY DRIVER MANUAL - Official Content (nj.gov/mvc)

GRADUATED DRIVER LICENSE (GDL) PROGRAM:
- Must be at least 16 years old to get Special Learner Permit
- Must practice supervised driving for at least 6 months
- Must be at least 17 to get Probationary License
- Must practice unsupervised for at least 1 year with probationary license
- Must be at least 18 to get Basic (unrestricted) Driver License
- Permit age: 16 years old minimum

SPECIAL LEARNER PERMIT AND PROBATIONARY LICENSE RESTRICTIONS:
- No driving between 11:01 p.m. and 5:00 a.m.
- No using hand-held OR hands-free cell phones or any electronic devices
- Permit holder must be accompanied by adult supervising driver (at least 21, valid NJ license, 3+ years experience)
- Passengers limited to parent/guardian/dependent of permit holder plus ONE additional passenger
- Permit holder and ALL passengers must wear seat belts
- Must display red GDL decals on license plates

SPEED LIMITS:
- Residential streets: 25 mph
- Suburban residential: 35 mph
- School zones: 25 mph
- Interstate/highway: 55 mph default (65 mph on designated highways)

ALCOHOL / DUI:
- BAC: 0.08% for adults (DWI)
- Under 21: 0.01% BAC (zero tolerance)
- Implied consent law applies — refusing test results in license suspension
- First DWI offense: license suspension 3 months to 1 year, fines $250-$400, possible jail up to 30 days
- Ignition interlock device may be required

TRAFFIC SIGNS AND SIGNALS:
- Octagon (8-sided) red sign = STOP
- Triangle (inverted) sign = YIELD
- Diamond-shaped yellow signs = Warning signs
- Orange signs = Construction/work zone signs
- Flashing red light: treat as STOP sign (come to full stop)
- Flashing yellow light: slow down, proceed with caution
- Railroad crossbuck sign: yield to trains

RIGHT OF WAY:
- School bus: must stop when red lights flash, cannot pass until lights stop
- Emergency vehicles with sirens/lights: pull to right curb and stop
- Pedestrians at crosswalks always have right of way
- At four-way stop: first to arrive goes first; if simultaneous, yield to vehicle on right
- Left turn: must yield to oncoming traffic

SAFE DRIVING:
- Following distance: 3-second rule minimum
- Fire hydrant: 10 feet parking distance
- Seat belts required for ALL occupants — driver responsible for passengers under 18
- Child safety seat required based on age/height/weight
- High beams: dim within 500 feet of oncoming vehicle, 200 feet when following
- Move Over law: slow down or move over for stopped emergency vehicles

PARKING:
- Cannot park within 10 feet of a fire hydrant
- Cannot park within 25 feet of an intersection
- Cannot park within 50 feet of a railroad crossing
`;

const OK_HANDBOOK = `
OKLAHOMA DRIVER MANUAL - Official Content (oklahoma.gov)

GRADUATED DRIVER LICENSE (GDL):
- Learner Permit age: 15 years old (with driver education), 16 (without)
- Must hold learner permit for at least 180 days before driving test
- Intermediate License age: 16 (with driver education), 16.5 (without)
- GDL restriction: driving only 5 a.m. to 10 p.m. (with exceptions for work, school, church)
- Passenger restriction: only 1 passenger (unless all live in same household) unless 21+ licensed driver is present
- Basic unrestricted license: age 18

SPEED LIMITS (Basic Speed Rule):
- Must drive at speed safe for conditions, regardless of posted limit
- Residential areas: 25 mph (general)
- School zones: 25 mph when children present
- Highway/rural: 70 mph maximum on turnpikes/interstates
- Following distance: 3-second rule; increase in adverse conditions

ALCOHOL / DUI:
- BAC: 0.08% for adults
- Under 21: 0.02% BAC (zero tolerance)
- Implied consent law: refusing test = automatic 180-day license revocation (first offense)
- DUI penalties: suspension, fines, possible jail, ignition interlock
- Additional penalties for drivers under 18

TRAFFIC SIGNS AND SIGNALS:
- Octagon (8-sided) red sign = STOP — must come to complete stop
- Triangle (inverted) = YIELD
- Diamond-shaped yellow = Warning signs
- Orange = Construction/work zone signs
- Flashing red light: treat as STOP sign
- Flashing yellow light: slow down, proceed with caution
- Railroad crossbuck: yield, stop if train approaching
- White rectangular signs = Regulatory signs (speed limits, restrictions)
- Green signs = Guide signs (highways, directions)

RIGHT OF WAY:
- School/church bus: MUST stop when red lights flash — 10 feet minimum — cannot pass until lights off
- Move Over law (Bernardo's Law): must change lanes or slow down for stopped emergency vehicles
- Pedestrians: must yield to blind persons; must yield to children playing in streets
- Funeral processions: must yield
- At intersections: yield to vehicles already in intersection; four-way stop — first to arrive goes first
- Left turn: yield to oncoming traffic

SAFE DRIVING:
- Fire hydrant: 15 feet minimum parking distance
- Seat belts: required for ALL occupants — driver responsible
- Child passenger restraint required based on age/weight
- High beams: dim within 500 feet of oncoming traffic, 300 feet when following
- Passing: only where road markings permit; do not pass on hills or curves
- Car phones: avoid use while driving; if necessary, use hands-free

PARKING (Unlawful Parking):
- Within 15 feet of a fire hydrant
- On sidewalk, crosswalk, or blocking driveway
- Within 20 feet of a crosswalk at an intersection
- Within 30 feet of a traffic signal or stop sign
- Within 50 feet of a railroad crossing

POINT SYSTEM:
- Points accumulate for moving violations
- Too many points = license suspension
- DUI: major violation, automatic suspension
`;

const STATES = [
  {
    code: 'NJ',
    name: 'New Jersey',
    handbookText: NJ_HANDBOOK,
    target: 400,
    verifiedFacts: `
- Fire hydrant: 10 feet minimum parking distance
- Residential speed: 25 mph; suburban: 35 mph; school zone: 25 mph
- Interstate default: 55 mph (65 on designated highways)
- BAC: 0.08 for adults, 0.01 for under 21 (zero tolerance)
- Permit age: 16 years old
- GDL: probationary license at 17, basic license at 18
- No cell phone use (handheld OR hands-free) for permit/probationary holders
- No driving 11:01 PM to 5:00 AM for permit/probationary holders
- Implied consent: refusing test = suspension
- School bus: must stop when red lights flash
- Seatbelt: required for all occupants
- Must display red GDL decals on license plates
`,
    gaps: ['row:school-bus','row:roundabout','row:intersection','row:left-turn',
           'safe:headlights','safe:seatbelt','safe:child-seat','alcohol:penalties',
           'alcohol:implied','license:gdl','signs:stop','signs:yield',
           'signs:warning','signs:flashing','signs:railroad'],
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    handbookText: OK_HANDBOOK,
    target: 400,
    verifiedFacts: `
- Fire hydrant: 15 feet minimum parking distance
- Following distance: 3-second rule
- BAC: 0.08 for adults, 0.02 for under 21
- Permit age: 15 years old (with driver ed), 16 (without)
- GDL driving hours: 5 a.m. to 10 p.m. only (with exceptions)
- Passenger restriction: max 1 passenger unless 21+ licensed driver present
- Implied consent: refusing test = 180-day automatic revocation (first offense)
- School/church bus: must stop when red lights flash, 10 feet minimum
- Move Over law (Bernardo's Law) applies
- Seatbelt required for all occupants
- Child passenger restraint required
- Point system for violations
`,
    gaps: ['row:pedestrian','row:school-bus','row:emergency','row:roundabout',
           'row:intersection','row:left-turn','safe:headlights','safe:seatbelt',
           'safe:child-seat','safe:phone','alcohol:penalties','alcohol:implied',
           'license:gdl','signs:stop','signs:yield','signs:flashing',
           'signs:regulatory','signs:railroad'],
  },
];

// ── HTTPS API call ─────────────────────────────────────────────────────────
function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    });
    const options = {
      hostname: 'api.anthropic.com', port: 443, path: '/v1/messages', method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`API ${res.statusCode}: ${data}`));
        try { resolve(JSON.parse(data).content[0].text); }
        catch (e) { reject(new Error(`Response parse: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// ── Repair truncated JSON ──────────────────────────────────────────────────
function repairJSON(str) {
  let lastGood = -1, depth = 0, inString = false, escape = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 1) lastGood = i; }
  }
  if (lastGood === -1) return null;
  return str.slice(0, lastGood + 1).trimEnd().replace(/,\s*$/, '') + '\n  ]\n}';
}

// ── Build prompt ───────────────────────────────────────────────────────────
function buildPrompt(state, existingSample, batchNum, batchSize, totalBatches) {
  const gapDescriptions = {
    'row:pedestrian': 'pedestrian right of way',
    'row:school-bus': 'school bus stopping rules',
    'row:emergency': 'yielding to emergency vehicles / Move Over law',
    'row:roundabout': 'roundabout rules',
    'row:intersection': 'four-way stop / uncontrolled intersection',
    'row:left-turn': 'left turn yield rules',
    'safe:headlights': 'headlight use rules',
    'safe:seatbelt': 'seatbelt requirements',
    'safe:child-seat': 'child safety seat requirements',
    'safe:phone': 'cell phone / texting laws',
    'safe:passing': 'passing rules / no-passing zones',
    'alcohol:bac': 'blood alcohol limits',
    'alcohol:under21': 'zero tolerance under 21',
    'alcohol:penalties': 'DUI/DWI penalties',
    'alcohol:implied': 'implied consent law',
    'license:gdl': 'graduated driver licensing / restrictions',
    'license:curfew': 'nighttime curfew / driving hours',
    'license:passenger': 'passenger restrictions for new drivers',
    'license:points': 'point system',
    'signs:stop': 'stop sign rules',
    'signs:yield': 'yield sign rules',
    'signs:warning': 'warning signs / diamond shape',
    'signs:regulatory': 'regulatory signs',
    'signs:flashing': 'flashing red vs yellow lights',
    'signs:railroad': 'railroad crossing signs',
  };
  const gapList = state.gaps.map(g => `  - ${gapDescriptions[g] || g}`).join('\n');

  return `Generate exactly ${batchSize} DMV practice test questions for ${state.name}. Batch ${batchNum} of ${totalBatches}.

VERIFIED ${state.code} FACTS (use exactly, do not contradict):
${state.verifiedFacts}

OFFICIAL HANDBOOK CONTENT:
${state.handbookText}

EXISTING QUESTIONS (do not duplicate):
${existingSample}

PRIORITY TOPICS:
${gapList}

RULES:
- Exactly 4 choices per question
- Exactly 1 isCorrect: true
- Scenario-based where possible
- Spread across all 6 topics
- Short, clear explanations

Respond with ONLY this JSON (no markdown, no text before or after):
{"questions":[{"topic":"Traffic Signs","text":"Question?","choices":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Why B is correct."}]}

Valid topics: "Traffic Signs", "Right of Way", "Speed Limits", "Safe Driving", "Alcohol & Substances", "Licensing & Permits"

Generate all ${batchSize} questions now.`;
}

// ── Generate in batches of 40 ──────────────────────────────────────────────
async function generateQuestions(state, existingQuestions, totalNeeded) {
  const BATCH_SIZE = 40;
  const numBatches = Math.ceil(totalNeeded / BATCH_SIZE);
  const allQuestions = [];
  const existingSample = existingQuestions.slice(0, 10).map(q => `- ${q.text}`).join('\n');

  for (let b = 0; b < numBatches; b++) {
    const batchSize = Math.min(BATCH_SIZE, totalNeeded - allQuestions.length);
    if (batchSize <= 0) break;
    console.log(`  🤖 API call ${b + 1}/${numBatches} (${batchSize} questions)...`);

    let raw;
    try {
      raw = await callAPI(buildPrompt(state, existingSample, b + 1, batchSize, numBatches));
    } catch (err) {
      console.log(`  ❌ Call ${b + 1} failed: ${err.message}`);
      continue;
    }

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let parsed = null;
    try { parsed = JSON.parse(cleaned); } catch (_) {}
    if (!parsed) {
      const repaired = repairJSON(cleaned);
      if (repaired) {
        try {
          parsed = JSON.parse(repaired);
          console.log(`  ℹ  Recovered ${(parsed.questions || []).length} questions from truncated response`);
        } catch (_) {}
      }
    }
    if (!parsed) {
      fs.writeFileSync(`/tmp/api-response-${state.code}-batch${b+1}.txt`, raw);
      console.log(`  ⚠  Could not parse batch ${b+1} — saved debug file`);
      continue;
    }

    const batchQs = parsed.questions || [];
    console.log(`  ✅ Got ${batchQs.length} questions`);
    allQuestions.push(...batchQs);
    if (b < numBatches - 1) await new Promise(r => setTimeout(r, 1500));
  }
  return allQuestions;
}

// ── Insert ─────────────────────────────────────────────────────────────────
async function insertQuestions(stateRecord, questions) {
  const topicMap = {
    'Traffic Signs': TOPIC.SIGNS, 'Right of Way': TOPIC.ROW,
    'Speed Limits': TOPIC.SPEED, 'Safe Driving': TOPIC.SAFE,
    'Alcohol & Substances': TOPIC.ALCOHOL, 'Licensing & Permits': TOPIC.LICENSE,
  };
  let inserted = 0, skipped = 0;
  for (const q of questions) {
    const topicId = topicMap[q.topic];
    if (!topicId) { skipped++; continue; }
    if (!q.choices || q.choices.length !== 4) { skipped++; continue; }
    if (q.choices.filter(c => c.isCorrect).length !== 1) { skipped++; continue; }
    if (!q.text || q.text.length < 10) { skipped++; continue; }
    if (DRY_RUN) { inserted++; continue; }
    await p.question.create({
      data: {
        text: q.text, explanation: q.explanation || '',
        stateId: stateRecord.id, topicId,
        choices: { create: q.choices.map(c => ({ text: c.text, isCorrect: Boolean(c.isCorrect) })) },
      },
    });
    inserted++;
  }
  return { inserted, skipped };
}

// ── Per-state ──────────────────────────────────────────────────────────────
async function processState(stateCfg) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${stateCfg.code} — ${stateCfg.name}`);
  console.log('═'.repeat(60));

  const stateRecord = await p.state.findUnique({ where: { code: stateCfg.code } });
  if (!stateRecord) { console.log(`  ❌ Not found in DB`); return null; }

  const currentCount = await p.question.count({ where: { stateId: stateRecord.id } });
  console.log(`  Current: ${currentCount} → Target: ${stateCfg.target}`);
  if (currentCount >= stateCfg.target) { console.log(`  ✅ Already at target`); return { state: stateCfg.code, skipped: true }; }

  const totalNeeded = stateCfg.target - currentCount;
  const existing = await p.question.findMany({ where: { stateId: stateRecord.id }, select: { text: true }, take: 20 });

  console.log(`  📄 Using official handbook content from ${stateCfg.code === 'NJ' ? 'nj.gov/mvc' : 'oklahoma.gov'}`);
  const questions = await generateQuestions(stateCfg, existing, totalNeeded);
  console.log(`  📝 Total generated: ${questions.length}`);

  const byTopic = {};
  for (const q of questions) byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
  for (const [t, n] of Object.entries(byTopic)) console.log(`     ${t}: ${n}`);

  const { inserted, skipped } = await insertQuestions(stateRecord, questions);
  console.log(`  ✅ Inserted: ${inserted} | Skipped: ${skipped}`);

  const finalCount = DRY_RUN
    ? currentCount + inserted
    : await p.question.count({ where: { stateId: stateRecord.id } });
  console.log(`  📊 Final: ${finalCount}`);

  return { state: stateCfg.code, before: currentCount, generated: questions.length, inserted, skipped, after: finalCount };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 EXPANSION — BATCH 3 (NJ + OK only, OR + TN already done)');
  console.log(`   Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  console.log('   Source: Official handbook content from nj.gov and oklahoma.gov\n');

  if (!ANTHROPIC_API_KEY) { console.error('❌ No API key'); process.exit(1); }

  const results = [];
  for (const stateCfg of STATES) {
    const result = await processState(stateCfg);
    if (result) results.push(result);
    if (!DRY_RUN) await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  for (const r of results) {
    if (r.skipped) console.log(`  ${r.state}: already at target`);
    else console.log(`  ${r.state}: ${r.before} → ${r.after} (+${r.inserted})`);
  }
  console.log('\n✅ Batch 3 complete. Next: expand-batch4-states.js (UT, VA, WA, WI)');
}

main().catch(console.error).finally(() => p.$disconnect());
