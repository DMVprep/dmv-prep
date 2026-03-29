// scripts/topup-ut-va.js
// Tops up UT (397→400) and VA (399→400)
// Run: node scripts/topup-ut-va.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const https = require('https');

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
    code: 'UT', name: 'Utah', target: 400,
    facts: 'Utah BAC is 0.05 for adults (unique — lowest in USA), 0.00 for under 21. Permit age 15. School zone 20mph. Residential 25mph. Following distance 2-second rule. Fire hydrant 15 feet. GDL provisional license applies. Implied consent law. School bus stop when red lights flash. Seatbelt required all occupants.',
  },
  {
    code: 'VA', name: 'Virginia', target: 400,
    facts: 'Virginia BAC 0.08 adults, 0.02 under 21. Permit age 15 years 6 months. Residential and school zone 25mph. Unpaved road 35mph. Fire hydrant 15 feet. GDL provisional license restrictions. Implied consent law. School bus stop when red lights flash. Seatbelt required. Point system applies.',
  },
];

function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });
    const req = https.request({
      hostname: 'api.anthropic.com', port: 443, path: '/v1/messages', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`API ${res.statusCode}: ${d}`));
        try { resolve(JSON.parse(d).content[0].text); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body); req.end();
  });
}

async function topup(stateCfg) {
  const stateRecord = await p.state.findUnique({ where: { code: stateCfg.code } });
  const currentCount = await p.question.count({ where: { stateId: stateRecord.id } });
  const needed = stateCfg.target - currentCount;

  console.log(`${stateCfg.code}: current ${currentCount}, need ${needed} more`);
  if (needed <= 0) { console.log(`${stateCfg.code}: already at target`); return; }

  const prompt = `Generate exactly ${needed} DMV practice test questions for ${stateCfg.name}.

KEY FACTS: ${stateCfg.facts}

Rules: exactly 4 choices per question, all with non-empty text, exactly 1 isCorrect true, spread across all 6 topics.

Respond ONLY with JSON, no markdown:
{"questions":[{"topic":"Safe Driving","text":"Question?","choices":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Why B."}]}

Valid topics: "Traffic Signs","Right of Way","Speed Limits","Safe Driving","Alcohol & Substances","Licensing & Permits"
Generate all ${needed} questions now.`;

  const raw = await callAPI(prompt);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const questions = JSON.parse(cleaned).questions || [];

  let inserted = 0, skipped = 0;
  for (const q of questions) {
    const topicId = topicMap[q.topic];
    if (!topicId) { skipped++; continue; }
    if (!q.choices || q.choices.length !== 4) { skipped++; continue; }
    if (q.choices.filter(c => c.isCorrect).length !== 1) { skipped++; continue; }
    if (!q.text || q.text.length < 10) { skipped++; continue; }
    if (q.choices.some(c => !c.text || c.text.trim() === '')) { skipped++; continue; }

    await p.question.create({
      data: {
        text: q.text, explanation: q.explanation || '',
        stateId: stateRecord.id, topicId,
        choices: { create: q.choices.map(c => ({ text: c.text.trim(), isCorrect: Boolean(c.isCorrect) })) },
      },
    });
    inserted++;
  }

  const finalCount = await p.question.count({ where: { stateId: stateRecord.id } });
  console.log(`${stateCfg.code}: inserted ${inserted}, skipped ${skipped}, final: ${finalCount}`);
}

async function main() {
  console.log('Topping up UT and VA to 400...\n');
  for (const s of STATES) {
    await topup(s);
  }
}

main().catch(console.error).finally(() => p.$disconnect());
