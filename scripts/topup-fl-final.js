process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

const TOPUPS = [
  {
    topicId: 'cmmpntvhy001g3jd6fkjlrbmq',
    name: 'Speed Limits',
    target: 75,
    context: 'Florida speed limits: residential 30mph, school zones 20mph when children present or lights flashing, business districts 30mph, rural two-lane 60mph, limited access highways 70mph, some turnpike sections 75mph. Move Over law: slow 20mph below limit for stopped emergency vehicles. Work zone and school zone fines doubled. Basic speed law (never drive faster than safe for conditions). Minimum speed: cannot impede traffic unreasonably. Interstate minimum typically 40mph where posted.'
  },
  {
    topicId: 'cmmpntvao001f3jd6afqngfl5',
    name: 'Right Of Way',
    target: 80,
    context: 'Florida right of way rules: 4-way stops (first to arrive goes first, tie goes to driver on right), roundabouts (yield to circulating traffic on left), left turns (yield to oncoming traffic and pedestrians), merging onto highway (yield to highway traffic), pedestrians always have right of way in crosswalks, blind pedestrians with white cane must stop completely, funeral processions have right of way, emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only stop same direction), yield signs, uncontrolled intersections (yield to right).'
  },
  {
    topicId: 'cmn2ia2n20001ua6cq7y7tood',
    name: 'Licensing & Permits',
    target: 50,
    context: 'Florida GDL: learner permit at 15 (DETS course required as of Aug 2025), hold 12 months, 50 hours supervised (10 at night), no moving violations. Restricted license at 16: curfew 11PM-6AM first year (work/school/medical exceptions), after first year 1AM-5AM. Full license at 18. Points system: 3 points minor violation, 4 points reckless driving, 6 points leaving scene. 12 points/12mo = 30-day suspension, 18 points/12mo = 3-month suspension, 24 points/36mo = 1-year suspension. License renewal every 8 years. Vision required 20/40. Class E for regular vehicles. SR-22 required after DUI. Hardship license available. CDL for commercial vehicles.'
  }
];

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  return data.content[0].text;
}

async function main() {
  for (const t of TOPUPS) {
    const current = await p.question.count({where:{stateId:FL_STATE_ID,topicId:t.topicId}});
    const needed = t.target - current;
    console.log(`${t.name}: ${current} -> ${t.target} (need ${needed})`);
    if (needed <= 0) continue;

    const existing = await p.question.findMany({where:{stateId:FL_STATE_ID,topicId:t.topicId},select:{text:true}});
    const existingList = existing.map(q=>'- '+q.text.substring(0,80)).join('\n');

    let remaining = needed;
    let batch = 0;
    while (remaining > 0) {
      const size = Math.min(20, remaining);
      const prompt = `Generate exactly ${size} Florida DMV practice questions for "${t.name}".

CONTEXT: ${t.context}

ALREADY COVERED (generate DIFFERENT concepts):
${existingList.substring(0, 3000)}

Rules: 4 choices, 1 correct, plausible wrong answers, accurate FL facts only, 1-2 sentence explanation. Do NOT ask about school zones, speeding buffer myth, or BAC limits (already covered).

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

      try {
        const response = await callClaude(prompt);
        const cleaned = response.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
        const questions = JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
        let inserted = 0;
        for (const q of questions) {
          try {
            await p.question.create({data:{text:q.text,explanation:q.explanation,stateId:FL_STATE_ID,topicId:t.topicId,choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}}});
            inserted++;
          } catch(e) {}
        }
        remaining -= inserted;
        console.log(`  Batch ${++batch}: +${inserted}. Need ${remaining} more.`);
        await new Promise(r=>setTimeout(r,1000));
      } catch(e) {
        console.log('  Error:', e.message);
        await new Promise(r=>setTimeout(r,2000));
      }
    }
  }

  const total = await p.question.count({where:{stateId:FL_STATE_ID}});
  console.log('\nFL total:', total);
  const topics = await p.topic.findMany();
  for (const t of topics) {
    const n = await p.question.count({where:{stateId:FL_STATE_ID,topicId:t.id}});
    console.log(`  ${t.name}: ${n}`);
  }
}
main().catch(console.error).finally(()=>p.$disconnect());
