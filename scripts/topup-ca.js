process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

const TOPICS = [
  { id: 'cmmpntv01001e3jd60a0j8onz', name: 'Traffic Signs', target: 85 },
  { id: 'cmmpntvao001f3jd6afqngfl5', name: 'Right Of Way', target: 75 },
  { id: 'cmmpntvhy001g3jd6fkjlrbmq', name: 'Speed Limits', target: 70 },
  { id: 'cmmpntvnw001h3jd6zi1q1365', name: 'Safe Driving', target: 85 },
  { id: 'cmn2ia2ei0000ua6cuap3rywt', name: 'Alcohol & Substances', target: 70 },
  { id: 'cmn2ia2n20001ua6cq7y7tood', name: 'Licensing & Permits', target: 45 },
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

async function generateBatch(topicName, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} California DMV practice questions for "${topicName}". Each must cover a DIFFERENT concept not in the list below. Accurate CA handbook facts only. 4 choices, 1 correct, plausible wrong answers, 1-2 sentence explanation.

ALREADY COVERED:
${existingList}

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

async function main() {
  for (const topic of TOPICS) {
    const current = await p.question.count({where:{topicId:topic.id,stateId:CA_STATE_ID}});
    const needed = topic.target - current;
    console.log(`${topic.name}: ${current} -> ${topic.target} (need ${needed})`);
    if (needed <= 0) continue;

    const existing = await p.question.findMany({where:{topicId:topic.id,stateId:CA_STATE_ID},select:{text:true}});
    const existingTexts = existing.map(q=>q.text);
    let remaining = needed, batch = 0;

    while (remaining > 0) {
      const size = Math.min(20, remaining);
      try {
        const questions = await generateBatch(topic.name, existingTexts, size);
        let inserted = 0;
        for (const q of questions) {
          try {
            await p.question.create({data:{text:q.text,explanation:q.explanation,stateId:CA_STATE_ID,topicId:topic.id,choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}}});
            inserted++;
          } catch(e) {}
        }
        remaining -= inserted;
        existingTexts.push(...questions.map(q=>q.text));
        console.log(`  Batch ${++batch}: +${inserted}. Need ${remaining} more.`);
        await new Promise(r=>setTimeout(r,1000));
      } catch(e) {
        console.log('  Error:', e.message);
        await new Promise(r=>setTimeout(r,2000));
      }
    }
  }
  const total = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('\n✅ CA total:', total);
}
main().catch(console.error).finally(()=>p.$disconnect());
