// scripts/generate-new-states.js
// Generates 400 questions each for 15 new states:
// AK, DE, HI, ID, MT, NE, NH, NM, ND, RI, SC, SD, VT, WV, WY
// Run: node scripts/generate-new-states.js
// Run single state: node scripts/generate-new-states.js --state=AK

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_STATE = (process.argv.find(a => a.startsWith('--state=')) || '').replace('--state=', '').toUpperCase();
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

const topicMap = {
  'Traffic Signs': TOPIC.SIGNS, 'Right of Way': TOPIC.ROW,
  'Speed Limits': TOPIC.SPEED, 'Safe Driving': TOPIC.SAFE,
  'Alcohol & Substances': TOPIC.ALCOHOL, 'Licensing & Permits': TOPIC.LICENSE,
};

const STATES = [
  {
    code: 'AK', name: 'Alaska', target: 400,
    handbook: 'DMV Manuals/Alaska.pdf',
    facts: 'Alaska: BAC 0.08 adults 0.00 under 21; permit age 14; school zone 20mph; following distance 3 seconds; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'DE', name: 'Delaware', target: 400,
    handbook: 'DMV Manuals/Delaware.pdf',
    facts: 'Delaware: BAC 0.08 adults 0.02 under 21; permit age 16; residential 25mph; school zone 20mph; fire hydrant 15 feet; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'HI', name: 'Hawaii', target: 400,
    handbook: 'DMV Manuals/mvso-11272-Hawaii-Drivers-Manual-r3-LR-10-24-18.pdf',
    facts: 'Hawaii: BAC 0.08 adults 0.02 under 21; permit age 15 years 6 months; residential 25mph; school zone 15mph; fire hydrant 10 feet; GDL provisional license restrictions; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'ID', name: 'Idaho', target: 400,
    handbook: 'DMV Manuals/Idaho driver_manual.pdf',
    facts: 'Idaho: BAC 0.08 adults 0.02 under 21; permit age 14 years 6 months; residential 35mph; school zone 20mph; following distance 3 seconds; fire hydrant 15 feet; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'MT', name: 'Montana', target: 400,
    handbook: 'DMV Manuals/25-0100M-Montana-Driver-Manual-English.pdf',
    facts: 'Montana: BAC 0.08 adults 0.02 under 21; permit age 14 years 6 months; urban speed 25mph; school zone 15mph; interstate no daytime limit but reasonable speed required; following distance 3 seconds; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'NE', name: 'Nebraska', target: 400,
    handbook: 'DMV Manuals/Nebraska.pdf',
    facts: 'Nebraska: BAC 0.08 adults 0.02 under 21; permit age 15; residential 25mph; highway 65mph; school zone 25mph; fire hydrant 15 feet; GDL provisional operators permit restrictions; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'NH', name: 'New Hampshire', target: 400,
    handbook: 'DMV Manuals/NH.pdf',
    facts: 'New Hampshire: BAC 0.08 adults 0.02 under 21; permit age 15 years 6 months; residential 30mph; school zone 20mph; fire hydrant 15 feet; GDL youth operator license restrictions; no nighttime driving midnight to 1AM for youth operators; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'NM', name: 'New Mexico', target: 400,
    handbook: 'DMV Manuals/NM.pdf',
    facts: 'New Mexico: BAC 0.08 adults 0.02 under 21; permit age 15; urban speed 30mph; school zone 15mph; fire hydrant 15 feet; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'ND', name: 'North Dakota', target: 400,
    handbook: 'DMV Manuals/ND.pdf',
    facts: 'North Dakota: BAC 0.08 adults 0.02 under 21; permit age 14; urban speed 25mph; school zone 20mph; highway max 75mph; following distance 3 seconds; fire hydrant 15 feet; GDL restrictions; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'RI', name: 'Rhode Island', target: 400,
    handbook: 'DMV Manuals/RI.pdf',
    facts: 'Rhode Island: BAC 0.08 adults 0.02 under 21; permit age 16; residential 25mph; school zone 20mph; fire hydrant 10 feet; GDL limited instructional permit and limited provisional license restrictions; no nighttime driving 1AM to 5AM for provisional; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'SC', name: 'South Carolina', target: 400,
    handbook: 'DMV Manuals/SC.pdf',
    facts: 'South Carolina: BAC 0.08 adults 0.02 under 21; permit age 15; residential 30mph; school zone 20mph; fire hydrant 15 feet; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'SD', name: 'South Dakota', target: 400,
    handbook: 'DMV Manuals/SD.pdf',
    facts: 'South Dakota: BAC 0.08 adults 0.02 under 21; permit age 14; residential 25mph; school zone 15mph; highway 80mph max; following distance 3 seconds; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'VT', name: 'Vermont', target: 400,
    handbook: 'DMV Manuals/VT.pdf',
    facts: 'Vermont: BAC 0.08 adults 0.02 under 21; permit age 15; residential 25mph; school zone 15mph; highway 65mph; fire hydrant 15 feet; GDL learner permit then youth operator license restrictions; no driving after midnight for youth operators; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
  {
    code: 'WV', name: 'West Virginia', target: 400,
    handbook: 'DMV Manuals/WV.pdf',
    facts: 'West Virginia: BAC 0.08 adults 0.02 under 21; permit age 15; residential 25mph; school zone 15mph; highway 70mph; fire hydrant 10 feet; GDL restrictions apply; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties; point system.',
  },
  {
    code: 'WY', name: 'Wyoming', target: 400,
    handbook: 'DMV Manuals/WY.pdf',
    facts: 'Wyoming: BAC 0.08 adults 0.02 under 21; permit age 15; residential 30mph; school zone 20mph; highway 80mph; following distance 3 seconds; fire hydrant 15 feet; implied consent; school bus stop when red lights flash; seatbelt all occupants; child seat required; DUI penalties.',
  },
];

function extractPdf(pdfPath) {
  try {
    const script = `
import sys
try:
    from pypdf import PdfReader
except: from PyPDF2 import PdfReader
r = PdfReader(sys.argv[1])
t = ""
for i in range(min(40, len(r.pages))):
    try:
        x = r.pages[i].extract_text()
        if x: t += x + "\\n"
    except: pass
print(t[:40000])`.trim();
    fs.writeFileSync('/tmp/ep.py', script);
    return execSync(`python3 /tmp/ep.py "${pdfPath}"`, { maxBuffer: 50*1024*1024, timeout: 180000 }).toString();
  } catch(e) { return null; }
}

function parseResponse(raw) {
  let str = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const fc = str.indexOf('}]}');
  if (fc !== -1) str = str.slice(0, fc + 3);
  str = str.replace(/,(\s*[\]\}])/g, '$1');
  try { return JSON.parse(str); } catch (_) {}
  let lg = -1, d = 0, ins = false, esc = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (esc) { esc = false; continue; }
    if (c === '\\' && ins) { esc = true; continue; }
    if (c === '"') { ins = !ins; continue; }
    if (ins) continue;
    if (c === '{') d++;
    if (c === '}') { d--; if (d === 1) lg = i; }
  }
  if (lg === -1) return null;
  try { return JSON.parse(str.slice(0, lg + 1).trimEnd().replace(/,\s*$/, '') + '\n  ]\n}'); }
  catch (_) { return null; }
}

function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] });
    const req = https.request({
      hostname: 'api.anthropic.com', port: 443, path: '/v1/messages', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`API ${res.statusCode}: ${d}`));
        try { resolve(JSON.parse(d).content[0].text); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body); req.end();
  });
}

function buildPrompt(state, handbook, sample, batch, size, total) {
  return `Generate exactly ${size} DMV practice test questions for ${state.name}. Batch ${batch} of ${total}.

KEY FACTS FOR ${state.code}:
${state.facts}

OFFICIAL HANDBOOK CONTENT:
${handbook.slice(0, 25000)}

EXISTING QUESTIONS (do not duplicate):
${sample}

RULES:
- Exactly 4 choices per question, all with non-empty text
- Exactly 1 isCorrect: true
- Scenario-based where possible: "You are driving...", "You see...", "You must..."
- Spread evenly across all 6 topics
- Short clear explanations

Respond ONLY with valid JSON, no markdown:
{"questions":[{"topic":"Safe Driving","text":"Question?","choices":[{"text":"Option A","isCorrect":false},{"text":"Option B","isCorrect":true},{"text":"Option C","isCorrect":false},{"text":"Option D","isCorrect":false}],"explanation":"Explanation."}]}

Valid topics: "Traffic Signs","Right of Way","Speed Limits","Safe Driving","Alcohol & Substances","Licensing & Permits"
Generate all ${size} questions now.`;
}

async function processState(cfg) {
  console.log(`\n${'═'.repeat(55)}\n  ${cfg.code} — ${cfg.name}\n${'═'.repeat(55)}`);
  const rec = await p.state.findUnique({ where: { code: cfg.code } });
  if (!rec) { console.log('  ❌ Not in DB — skipping'); return null; }

  const cur = await p.question.count({ where: { stateId: rec.id } });
  console.log(`  Current: ${cur} → Target: ${cfg.target}`);
  if (cur >= cfg.target) { console.log('  ✅ Already at target'); return { state: cfg.code, skipped: true }; }

  const needed = cfg.target - cur;
  const existing = await p.question.findMany({ where: { stateId: rec.id }, select: { text: true }, take: 20 });
  const sample = existing.slice(0, 10).map(q => `- ${q.text}`).join('\n');

  console.log(`  📄 Extracting from ${path.basename(cfg.handbook)}...`);
  const pdf = extractPdf(cfg.handbook);
  const handbook = pdf || cfg.facts;
  if (pdf) console.log(`  ✅ Extracted ${Math.round(pdf.length / 1000)}KB`);
  else console.log('  ⚠  PDF failed — using verified facts');

  const BATCH = 40, nb = Math.ceil(needed / BATCH);
  const all = [];

  for (let b = 0; b < nb; b++) {
    const sz = Math.min(BATCH, needed - all.length);
    if (sz <= 0) break;
    console.log(`  🤖 API call ${b+1}/${nb} (${sz} questions)...`);
    let raw;
    try { raw = await callAPI(buildPrompt(cfg, handbook, sample, b+1, sz, nb)); }
    catch (e) { console.log(`  ❌ ${e.message}`); continue; }
    const parsed = parseResponse(raw);
    if (!parsed) { console.log(`  ⚠  Parse failed batch ${b+1}`); continue; }
    const qs = parsed.questions || [];
    console.log(`  ✅ Got ${qs.length}`);
    all.push(...qs);
    if (b < nb - 1) await new Promise(r => setTimeout(r, 1500));
  }

  let ins = 0, skip = 0;
  for (const q of all) {
    const tid = topicMap[q.topic];
    if (!tid || !q.choices || q.choices.length !== 4) { skip++; continue; }
    if (q.choices.filter(c => c.isCorrect).length !== 1) { skip++; continue; }
    if (!q.text || q.text.length < 10) { skip++; continue; }
    if (q.choices.some(c => !c.text || c.text.trim() === '')) { skip++; continue; }
    if (DRY_RUN) { ins++; continue; }
    await p.question.create({
      data: {
        text: q.text, explanation: q.explanation || '',
        stateId: rec.id, topicId: tid,
        choices: { create: q.choices.map(c => ({ text: c.text.trim(), isCorrect: Boolean(c.isCorrect) })) },
      },
    });
    ins++;
  }

  console.log(`  ✅ Inserted: ${ins} | Skipped: ${skip}`);
  const final = DRY_RUN ? cur + ins : await p.question.count({ where: { stateId: rec.id } });
  console.log(`  📊 Final: ${final}`);
  return { state: cfg.code, before: cur, inserted: ins, after: final };
}

async function main() {
  const states = ONLY_STATE ? STATES.filter(s => s.code === ONLY_STATE) : STATES;
  if (ONLY_STATE && states.length === 0) { console.error(`State ${ONLY_STATE} not found`); process.exit(1); }

  console.log(`🚀 GENERATING NEW STATES: ${states.map(s => s.code).join(', ')}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'} | Target: 400 per state\n`);
  if (!ANTHROPIC_API_KEY) { console.error('❌ No API key'); process.exit(1); }

  const results = [];
  for (const s of states) {
    const r = await processState(s);
    if (r) results.push(r);
    if (!DRY_RUN) await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n' + '='.repeat(55) + '\nSUMMARY\n' + '='.repeat(55));
  for (const r of results) {
    if (r.skipped) console.log(`  ${r.state}: already at target`);
    else console.log(`  ${r.state}: ${r.before} → ${r.after} (+${r.inserted})`);
  }
  console.log('\n✅ Done. Run check-all-states.js to verify.');
}

main().catch(console.error).finally(() => p.$disconnect());
