// scripts/topup-nj-ok.js
// Tops up NJ (373→400) and OK (313→400)
// Run: node scripts/topup-nj-ok.js

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

const NJ_CONTENT = `
NEW JERSEY DRIVER MANUAL - Key Rules:
- Speed limits: residential 25 mph, suburban 35 mph, school zone 25 mph, interstate 55 mph default
- Fire hydrant: 10 feet minimum parking distance
- Intersection: cannot park within 25 feet
- Railroad crossing: cannot park within 50 feet
- BAC: 0.08 adults, 0.01 under 21 (zero tolerance)
- Implied consent: refusing test = suspension
- GDL: permit at 16, probationary license at 17, basic license at 18
- Permit/probationary: no driving 11:01 PM to 5 AM
- No cell phone (handheld OR hands-free) for permit/probationary holders
- Max 1 additional passenger for permit/probationary holders
- Red GDL decals required on license plates
- School bus: must stop when red lights flash
- Seatbelt: required for all occupants
- Following distance: 3-second rule
- High beams: dim within 500 feet of oncoming, 200 feet when following
- Move Over law applies
- Flashing red = treat as stop sign; flashing yellow = slow down, caution
- Octagon red sign = STOP; inverted triangle = YIELD; diamond yellow = warning
`;

const OK_CONTENT = `
OKLAHOMA DRIVER MANUAL - Key Rules:
- Speed: residential 25 mph, school zone 25 mph, turnpike/interstate 70 mph max
- Fire hydrant: 15 feet minimum parking distance
- Crosswalk at intersection: cannot park within 20 feet
- Traffic signal/stop sign: cannot park within 30 feet
- Railroad crossing: cannot park within 50 feet
- BAC: 0.08 adults, 0.02 under 21 (zero tolerance)
- Implied consent: refusing test = 180-day automatic revocation (first offense)
- DUI penalties: suspension, fines, possible jail, ignition interlock
- GDL: learner permit at 15 (with driver ed), driving hours 5 AM to 10 PM only
- Passenger restriction: max 1 passenger unless all in same household or 21+ licensed driver present
- Must hold learner permit 180 days before driving test
- Basic unrestricted license at 18
- School/church bus: must stop when red lights flash, 10 feet minimum
- Move Over law (Bernardo's Law): change lanes or slow for stopped emergency vehicles
- Seatbelt required for all; child passenger restraint required
- Following distance: 3-second rule, increase in adverse conditions
- High beams: dim within 500 feet oncoming, 300 feet following
- Point system: violations accumulate points, too many = suspension
- Flashing red = treat as stop sign; flashing yellow = slow down, caution
- Octagon red = STOP; inverted triangle = YIELD; diamond yellow = warning; orange = construction
`;

const STATES = [
  {
    code: 'NJ',
    name: 'New Jersey',
    content: NJ_CONTENT,
    target: 400,
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    content: OK_CONTENT,
    target: 400,
  },
];

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

function buildPrompt(state, needed, existingSample) {
  return `Generate exactly ${needed} DMV practice test questions for ${state.name}.

OFFICIAL RULES:
${state.content}

EXISTING QUESTIONS (do not duplicate):
${existingSample}

RULES:
- Exactly 4 choices per question — ALL 4 choices must have non-empty text
- Exactly 1 isCorrect: true
- Every choice text must be a complete, non-empty string
- Scenario-based where possible
- Spread across all 6 topics
- Short, clear explanations

Respond with ONLY this JSON (no markdown, no text before or after):
{"questions":[{"topic":"Traffic Signs","text":"Question?","choices":[{"text":"Option A","isCorrect":false},{"text":"Option B","isCorrect":true},{"text":"Option C","isCorrect":false},{"text":"Option D","isCorrect":false}],"explanation":"Why B is correct."}]}

Valid topics: "Traffic Signs", "Right of Way", "Speed Limits", "Safe Driving", "Alcohol & Substances", "Licensing & Permits"

IMPORTANT: Every single choice must have a non-empty "text" field. Do not leave any text field blank or undefined.

Generate all ${needed} questions now.`;
}

async function generateAndInsert(stateCfg) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${stateCfg.code} — ${stateCfg.name}`);
  console.log('═'.repeat(60));

  const stateRecord = await p.state.findUnique({ where: { code: stateCfg.code } });
  if (!stateRecord) { console.log(`  ❌ Not found in DB`); return null; }

  const currentCount = await p.question.count({ where: { stateId: stateRecord.id } });
  const needed = stateCfg.target - currentCount;
  console.log(`  Current: ${currentCount} → Target: ${stateCfg.target} (need ${needed} more)`);

  if (needed <= 0) { console.log(`  ✅ Already at target`); return { state: stateCfg.code, skipped: true }; }

  const existing = await p.question.findMany({ where: { stateId: stateRecord.id }, select: { text: true }, take: 20 });
  const existingSample = existing.slice(0, 10).map(q => `- ${q.text}`).join('\n');

  // Generate in batches of 40
  const BATCH_SIZE = 40;
  const numBatches = Math.ceil(needed / BATCH_SIZE);
  const allQuestions = [];

  for (let b = 0; b < numBatches; b++) {
    const batchSize = Math.min(BATCH_SIZE, needed - allQuestions.length);
    if (batchSize <= 0) break;
    console.log(`  🤖 API call ${b + 1}/${numBatches} (${batchSize} questions)...`);

    let raw;
    try { raw = await callAPI(buildPrompt(stateCfg, batchSize, existingSample)); }
    catch (err) { console.log(`  ❌ Call failed: ${err.message}`); continue; }

    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let parsed = null;
    try { parsed = JSON.parse(cleaned); } catch (_) {}
    if (!parsed) {
      const repaired = repairJSON(cleaned);
      if (repaired) {
        try {
          parsed = JSON.parse(repaired);
          console.log(`  ℹ  Recovered ${(parsed.questions || []).length} from truncated response`);
        } catch (_) {}
      }
    }
    if (!parsed) { console.log(`  ⚠  Could not parse batch ${b+1}`); continue; }

    allQuestions.push(...(parsed.questions || []));
    console.log(`  ✅ Got ${(parsed.questions || []).length} questions`);
    if (b < numBatches - 1) await new Promise(r => setTimeout(r, 1500));
  }

  // Insert with strict validation — skip any question with empty choice text
  const topicMap = {
    'Traffic Signs': TOPIC.SIGNS, 'Right of Way': TOPIC.ROW,
    'Speed Limits': TOPIC.SPEED, 'Safe Driving': TOPIC.SAFE,
    'Alcohol & Substances': TOPIC.ALCOHOL, 'Licensing & Permits': TOPIC.LICENSE,
  };

  let inserted = 0, skipped = 0;
  for (const q of allQuestions) {
    const topicId = topicMap[q.topic];
    if (!topicId) { skipped++; continue; }
    if (!q.choices || q.choices.length !== 4) { skipped++; continue; }
    if (q.choices.filter(c => c.isCorrect).length !== 1) { skipped++; continue; }
    if (!q.text || q.text.length < 10) { skipped++; continue; }
    // Strict: every choice must have non-empty text
    if (q.choices.some(c => !c.text || c.text.trim() === '')) { skipped++; continue; }
    if (DRY_RUN) { inserted++; continue; }

    await p.question.create({
      data: {
        text: q.text, explanation: q.explanation || '',
        stateId: stateRecord.id, topicId,
        choices: { create: q.choices.map(c => ({ text: c.text.trim(), isCorrect: Boolean(c.isCorrect) })) },
      },
    });
    inserted++;
  }

  console.log(`  ✅ Inserted: ${inserted} | Skipped: ${skipped}`);
  const finalCount = DRY_RUN
    ? currentCount + inserted
    : await p.question.count({ where: { stateId: stateRecord.id } });
  console.log(`  📊 Final: ${finalCount}`);

  return { state: stateCfg.code, before: currentCount, inserted, after: finalCount };
}

async function main() {
  console.log('🚀 TOP-UP: NJ + OK → 400');
  console.log(`   Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}\n`);
  if (!ANTHROPIC_API_KEY) { console.error('❌ No API key'); process.exit(1); }

  const results = [];
  for (const s of STATES) {
    const r = await generateAndInsert(s);
    if (r) results.push(r);
    if (!DRY_RUN) await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  for (const r of results) {
    if (r.skipped) console.log(`  ${r.state}: already at target`);
    else console.log(`  ${r.state}: ${r.before} → ${r.after} (+${r.inserted})`);
  }
  console.log('\n✅ Done. Run expand-batch4-states.js next (UT, VA, WA, WI)');
}

main().catch(console.error).finally(() => p.$disconnect());
