process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

const TOPICS = [
  { id: 'cmn2ia2ei0000ua6cuap3rywt', name: 'Alcohol & Substances', target: 80, context: 'Florida DUI and substance laws: implied consent law details, DUI checkpoints, field sobriety tests, breathalyzer refusal consequences, DUI conviction penalties (1st/2nd/3rd offense fines and jail), license revocation periods, ignition interlock device requirements, drug impairment (prescription and illegal), open container laws, zero tolerance for under 21, BAC affected by body weight/food/time, alcohol elimination rate, effects of alcohol on driving ability, DUI with minor in vehicle, habitual offender status, SR-22 insurance requirement after DUI.' },
  { id: 'cmn2ia2n20001ua6cq7y7tood', name: 'Licensing & Permits', target: 50, context: 'Florida licensing: learner permit requirements (age 15, TLSAE course, vision test, written test), permit restrictions (licensed 21+ in front seat, daylight only first 3 months, then until 10pm), 50 hours supervised driving required (10 at night), must hold permit 12 months, restricted license at 16 (curfew 11pm-6am, no more than 1 non-family passenger under 18), full license at 18, license classes (E=regular, D=18+, CDL), vision requirements, point system (3pts minor violation, 4pts reckless, 6pts leaving scene), 12 points=30 day suspension, 18 points=3 months, 24 points=1 year, license renewal every 8 years, organ donor designation, license suspension reasons, reinstatement requirements, out of state transfer rules.' },
];

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

async function generateBatch(topic, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} Florida DMV practice questions for "${topic.name}".

CONTEXT: ${topic.context}

ALREADY COVERED (generate DIFFERENT concepts):
${existingList}

Rules: 4 choices, 1 correct, plausible wrong answers, accurate FL facts, 1-2 sentence explanation.

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

async function insertQuestions(questions, topicId) {
  let inserted = 0;
  for (const q of questions) {
    try {
      await p.question.create({
        data: {
          text: q.text, explanation: q.explanation,
          stateId: FL_STATE_ID, topicId: topicId,
          choices: { create: q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect})) }
        }
      });
      inserted++;
    } catch(e) { console.log('Skip:', q.text.substring(0,50)); }
  }
  return inserted;
}

async function main() {
  for (const topic of TOPICS) {
    const current = await p.question.count({where:{topicId:topic.id,stateId:FL_STATE_ID}});
    console.log(`\n=== ${topic.name}: ${current} -> ${topic.target} ===`);
    const needed = topic.target - current;
    if (needed <= 0) { console.log('Done'); continue; }

    const existing = await p.question.findMany({where:{topicId:topic.id,stateId:FL_STATE_ID},select:{text:true}});
    const existingTexts = existing.map(q=>q.text);
    let remaining = needed, batch = 0;

    while (remaining > 0) {
      const size = Math.min(20, remaining);
      console.log(`  Batch ${++batch}: ${size} questions...`);
      try {
        const questions = await generateBatch(topic, existingTexts, size);
        const inserted = await insertQuestions(questions, topic.id);
        remaining -= inserted;
        existingTexts.push(...questions.map(q=>q.text));
        console.log(`  +${inserted}. Need ${remaining} more.`);
        await new Promise(r=>setTimeout(r,1000));
      } catch(e) {
        console.log('  Error:', e.message);
        await new Promise(r=>setTimeout(r,2000));
      }
    }
  }

  const total = await p.question.count({where:{stateId:FL_STATE_ID}});
  console.log('\n✅ FL total:', total);
}

main().catch(console.error).finally(()=>p.$disconnect());
