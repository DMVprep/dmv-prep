// scripts/expand-batch1-states.js
// Expands IN, IA, KS, MD from 240 → ~400 questions each
// Uses Node https module + repairs truncated JSON responses
//
// Run: node scripts/expand-batch1-states.js --dry-run
// Run: node scripts/expand-batch1-states.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

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

const STATES = [
  {
    code: 'IN',
    name: 'Indiana',
    handbook: 'DMV Manuals/drivers-manual IN.pdf',
    target: 400,
    verifiedFacts: `
- Fire hydrant: 15 feet minimum parking distance
- Passenger vehicle max speed: 70 mph on interstate
- Trucks over 26,000 lbs: 65 mph max on interstate
- BAC: 0.08 for adults, 0.02 for under 21
- Permit age: 15 years old
- GDL: probationary license after permit
- Implied consent: refusing chemical test = automatic suspension
- School bus: must stop when red lights flash, 20 feet minimum
- Work zone: fines doubled
- Seatbelt: required for all occupants
- Cell phone: no texting while driving
- Move Over law applies
`,
    gaps: ['row:pedestrian','row:school-bus','row:roundabout','row:intersection',
           'row:left-turn','safe:headlights','safe:seatbelt','safe:child-seat',
           'safe:passing','alcohol:penalties','alcohol:implied','license:gdl',
           'signs:stop','signs:yield','signs:warning','signs:railroad'],
  },
  {
    code: 'IA',
    name: 'Iowa',
    handbook: 'DMV Manuals/dlmanual Oiowa.pdf',
    target: 400,
    verifiedFacts: `
- Fire hydrant: 5 feet minimum (Iowa is unique)
- Residential speed: 25 mph
- Business/suburban speed: 45 mph
- Following distance: 3-to-4-second rule
- BAC: 0.08 for adults, 0.02 for under 21
- Permit age: 14 years old
- Iowa uses OWI not DUI
- Implied consent: refusing test = automatic revocation
- School bus: must stop when red lights flash
- Seatbelt and child seat laws apply
`,
    gaps: ['speed:following','speed:work-zone','row:school-bus','row:roundabout',
           'row:intersection','row:left-turn','safe:headlights','safe:seatbelt',
           'safe:child-seat','safe:phone','alcohol:penalties','signs:stop',
           'signs:warning','signs:regulatory','signs:flashing'],
  },
  {
    code: 'KS',
    name: 'Kansas',
    handbook: 'DMV Manuals/DMV Kansas.pdf',
    target: 400,
    verifiedFacts: `
- Fire hydrant: 15 feet minimum parking distance
- Urban district speed: 30 mph
- School zone: 20 mph
- Highway max: 75 mph
- Following distance: 2-second (good), 4-second (adverse)
- BAC: 0.08 for adults, 0.02 for under 21
- Permit age: 14 years old
- DUI penalties: suspension, fines, possible jail
- Implied consent law applies
- Point system applies
- School bus: must stop when red lights flash
`,
    gaps: ['speed:following','row:pedestrian','row:school-bus','row:emergency',
           'row:roundabout','row:intersection','row:left-turn','safe:headlights',
           'safe:seatbelt','safe:child-seat','safe:passing','alcohol:penalties',
           'alcohol:implied','license:gdl','signs:stop','signs:yield',
           'signs:warning','signs:regulatory','signs:flashing','signs:railroad'],
  },
  {
    code: 'MD',
    name: 'Maryland',
    handbook: 'DMV Manuals/DL-002Maryland.pdf',
    target: 400,
    verifiedFacts: `
- Following distance: 3-to-4-second rule
- BAC: 0.08 = DWI; 0.07 = DUI (Maryland unique lower threshold)
- Under 21: 0.02 BAC limit
- Permit age: 15 years, 9 months
- GDL provisional license restrictions
- Nighttime curfew: midnight to 5 AM for provisional holders
- Passenger restriction: max 1 under 18 (first 5 months provisional)
- Implied consent: refusing = immediate suspension
- School bus: must stop when red lights flash
- Move Over law applies
- Point system: 8 points = warning, 12 = revocation
`,
    gaps: ['row:pedestrian','row:school-bus','row:emergency','row:roundabout',
           'row:intersection','row:left-turn','safe:headlights','safe:seatbelt',
           'safe:child-seat','safe:phone','safe:passing','alcohol:penalties',
           'alcohol:implied','signs:stop','signs:yield','signs:warning','signs:flashing'],
  },
];

// ── Extract PDF text ───────────────────────────────────────────────────────
function extractPdfText(pdfPath) {
  try {
    console.log(`  📄 Extracting text from ${path.basename(pdfPath)}...`);
    const pythonScript = `
import sys
try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader
reader = PdfReader(sys.argv[1])
text = ""
max_pages = min(80, len(reader.pages))
for i in range(max_pages):
    try:
        t = reader.pages[i].extract_text()
        if t: text += t + "\\n"
    except: pass
print(text[:60000])
`.trim();
    fs.writeFileSync('/tmp/extract_pdf.py', pythonScript);
    const text = execSync(`python3 /tmp/extract_pdf.py "${pdfPath}"`, {
      maxBuffer: 50 * 1024 * 1024,
      timeout: 120000,
    }).toString();
    console.log(`  ✅ Extracted ${Math.round(text.length / 1000)}KB of text`);
    return text;
  } catch (err) {
    console.error(`  ❌ PDF extraction failed: ${err.message}`);
    return null;
  }
}

// ── HTTPS API call ─────────────────────────────────────────────────────────
function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    });

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
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
        try {
          resolve(JSON.parse(data).content[0].text);
        } catch (e) {
          reject(new Error(`Response parse error: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

// ── Repair truncated JSON ──────────────────────────────────────────────────
// The API sometimes cuts off mid-response. This finds the last complete
// question object and closes the JSON properly.
function repairJSON(str) {
  // Find the last occurrence of a complete question closing brace
  // A complete question looks like: ...}\n    }\n (with 4-space indent)
  let lastGood = -1;
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      // depth 1 means we just closed a question object (inside the questions array)
      if (depth === 1) lastGood = i;
    }
  }

  if (lastGood === -1) return null;

  const partial = str.slice(0, lastGood + 1).trimEnd().replace(/,\s*$/, '');
  return partial + '\n  ]\n}';
}

// ── Build prompt ───────────────────────────────────────────────────────────
function buildPrompt(state, handbookText, existingSample, batchNum, batchSize, totalBatches) {
  const gapDescriptions = {
    'speed:following': 'following distance rules',
    'speed:work-zone': 'work zone speed and rules',
    'speed:school-zone': 'school zone speed limits',
    'speed:residential': 'residential/business speed limits',
    'speed:highway': 'highway/interstate speed limits',
    'row:pedestrian': 'pedestrian right of way',
    'row:school-bus': 'school bus stopping rules',
    'row:emergency': 'yielding to emergency vehicles',
    'row:roundabout': 'roundabout rules',
    'row:intersection': 'four-way stop / uncontrolled intersection',
    'row:left-turn': 'left turn yield rules',
    'row:bicycle': 'bicycle right of way',
    'safe:headlights': 'headlight use rules',
    'safe:seatbelt': 'seatbelt requirements',
    'safe:child-seat': 'child safety seat requirements',
    'safe:phone': 'cell phone / texting laws',
    'safe:passing': 'passing rules / no-passing zones',
    'safe:parking': 'parking restrictions',
    'safe:weather': 'driving in adverse weather',
    'safe:skid': 'skidding / hydroplaning',
    'alcohol:bac': 'blood alcohol limits',
    'alcohol:under21': 'zero tolerance under 21',
    'alcohol:penalties': 'DUI/DWI/OWI penalties',
    'alcohol:implied': 'implied consent law',
    'alcohol:open-container': 'open container laws',
    'license:permit-age': 'minimum permit age',
    'license:gdl': 'graduated driver licensing',
    'license:curfew': 'nighttime curfew',
    'license:passenger': 'passenger restrictions',
    'license:supervised': 'supervised driving hours',
    'license:points': 'point system',
    'signs:stop': 'stop sign rules',
    'signs:yield': 'yield sign rules',
    'signs:warning': 'warning signs / diamond shape',
    'signs:construction': 'construction zone signs',
    'signs:regulatory': 'regulatory signs',
    'signs:guide': 'guide signs / green and blue',
    'signs:flashing': 'flashing red vs yellow lights',
    'signs:railroad': 'railroad crossing signs',
  };

  const gapList = state.gaps.map(g => `  - ${gapDescriptions[g] || g}`).join('\n');

  return `Generate exactly ${batchSize} DMV practice test questions for ${state.name}. Batch ${batchNum} of ${totalBatches}.

VERIFIED ${state.code} FACTS (use exactly, do not contradict):
${state.verifiedFacts}

HANDBOOK EXCERPT:
${handbookText.slice(0, 30000)}

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

// ── Generate in batches ────────────────────────────────────────────────────
async function generateQuestions(state, handbookText, existingQuestions, totalNeeded) {
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
      raw = await callAPI(buildPrompt(state, handbookText, existingSample, b + 1, batchSize, numBatches));
    } catch (err) {
      console.log(`  ❌ Call ${b + 1} failed: ${err.message}`);
      continue;
    }

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed = null;

    // Try 1: direct parse
    try {
      parsed = JSON.parse(cleaned);
    } catch (_) {}

    // Try 2: repair truncated JSON
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
      console.log(`  ⚠  Could not parse batch ${b+1} — saved to /tmp/api-response-${state.code}-batch${b+1}.txt`);
      continue;
    }

    const batchQs = parsed.questions || [];
    console.log(`  ✅ Got ${batchQs.length} questions`);
    allQuestions.push(...batchQs);

    if (b < numBatches - 1) await new Promise(r => setTimeout(r, 1500));
  }

  return allQuestions;
}

// ── Insert questions ───────────────────────────────────────────────────────
async function insertQuestions(stateRecord, questions) {
  const topicMap = {
    'Traffic Signs': TOPIC.SIGNS,
    'Right of Way': TOPIC.ROW,
    'Speed Limits': TOPIC.SPEED,
    'Safe Driving': TOPIC.SAFE,
    'Alcohol & Substances': TOPIC.ALCOHOL,
    'Licensing & Permits': TOPIC.LICENSE,
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
        text: q.text,
        explanation: q.explanation || '',
        stateId: stateRecord.id,
        topicId,
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

  if (currentCount >= stateCfg.target) {
    console.log(`  ✅ Already at target`);
    return { state: stateCfg.code, skipped: true };
  }

  const totalNeeded = stateCfg.target - currentCount;
  const existing = await p.question.findMany({ where: { stateId: stateRecord.id }, select: { text: true }, take: 20 });
  const handbookText = extractPdfText(stateCfg.handbook);
  if (!handbookText) return null;

  const questions = await generateQuestions(stateCfg, handbookText, existing, totalNeeded);
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
  console.log('🚀 EXPANSION — BATCH 1: IN, IA, KS, MD');
  console.log(`   Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  console.log('   Target: ~400 per state\n');

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
}

main().catch(console.error).finally(() => p.$disconnect());
