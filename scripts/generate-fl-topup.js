process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

const TOPICS = [
  { id: 'cmmpntv01001e3jd60a0j8onz', name: 'Traffic Signs', target: 90, context: 'Florida road sign shapes and colors, regulatory signs meanings (stop, yield, no turn, one way, do not enter, wrong way, speed limit, no parking, disabled parking), warning signs (curve, hill, slippery road, low clearance, narrow bridge, divided highway, pedestrian crossing, bicycle crossing, animal crossing, merge, lane reduction, drawbridge), guide signs (green=directions, blue=services, brown=recreation), work zone signs (orange). AVOID questions about fire hydrant distances, railroad crossing distances, school bus stopping rules - those are already covered.' },
  { id: 'cmmpntvao001f3jd6afqngfl5', name: 'Right Of Way', target: 80, context: 'Florida right of way: T-intersections (through road has right of way), 4-way stops (first arrived goes first, tie=yield to right), roundabouts (yield to circulating traffic), left turns (yield to oncoming and pedestrians), entering highway from ramp (yield to highway traffic), pedestrians at crosswalks and intersections, blind pedestrians (white cane), emergency vehicles (pull right and stop), funeral processions, yielding when backing out. AVOID Move Over Law questions - already have 4.' },
  { id: 'cmmpntvhy001g3jd6fkjlrbmq', name: 'Speed Limits', target: 75, context: 'Florida speed limits: basic speed law (drive at safe speed for conditions), rural highways 65mph, urban interstate 65mph, other interstates 70mph, school zone 20mph only when lights flash OR children present, work zone reduced speed when workers present, advisory speed signs on curves, when weather requires slower speed, passing speed, speed on bridges, speed in alleys, night driving and speed. AVOID questions about minimum highway speed (40mph) and residential speed (30mph) - already have enough of those.' },
  { id: 'cmmpntvnw001h3jd6zi1q1365', name: 'Safe Driving', target: 90, context: 'Florida safe driving topics NOT yet well covered: headlights (required sunset to sunrise, in rain/fog/smoke, when wipers are on, high beams 500ft from oncoming 300ft when following), turn signals (required 100ft before turn), blind spots checking, expressway driving (entering, exiting, passing), night driving dangers, fatigue and drowsy driving, distracted driving and cell phone ban, road rage avoidance, hydroplaning, skidding recovery, carbon monoxide dangers, driving in fog/rain/sun glare, loading zones, sharing road with trucks, motorcycles, bicycles.' },
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

async function generateBatch(topic, existingQuestions, count) {
  const existingList = existingQuestions.slice(0, 40).map(q => '- ' + q.substring(0,80)).join('\n');
  const prompt = `You are generating Florida DMV permit test practice questions for "${topic.name}".

CONTEXT: ${topic.context}

ALREADY HAVE THESE (generate DIFFERENT concepts only):
${existingList}

Generate exactly ${count} unique questions. Rules:
- Each tests a DIFFERENT concept
- 4 answer choices, 1 correct
- Plausible wrong answers
- All facts must be accurate Florida DMV handbook facts
- Mix scenario-based and direct questions
- Include 1-2 sentence explanation

Return ONLY valid JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']') + 1;
  return JSON.parse(cleaned.slice(start, end));
}

async function insertQuestions(questions, topicId) {
  let inserted = 0;
  for (const q of questions) {
    try {
      await p.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          stateId: FL_STATE_ID,
          topicId: topicId,
          choices: { create: q.choices.map(c => ({ text: c.text, isCorrect: c.isCorrect })) }
        }
      });
      inserted++;
    } catch(e) {
      console.log('Skip:', q.text.substring(0, 50));
    }
  }
  return inserted;
}

async function main() {
  console.log('Topping up FL questions...\n');

  for (const topic of TOPICS) {
    const current = await p.question.count({ where: { topicId: topic.id, stateId: FL_STATE_ID } });
    console.log(`\n=== ${topic.name}: ${current} -> ${topic.target} ===`);

    const needed = topic.target - current;
    if (needed <= 0) { console.log('Already at target'); continue; }

    const existing = await p.question.findMany({
      where: { topicId: topic.id, stateId: FL_STATE_ID },
      select: { text: true }
    });
    const existingTexts = existing.map(q => q.text);

    let remaining = needed;
    let batch = 0;
    while (remaining > 0) {
      const size = Math.min(20, remaining);
      console.log(`  Batch ${++batch}: ${size} questions...`);
      try {
        const questions = await generateBatch(topic, existingTexts, size);
        const inserted = await insertQuestions(questions, topic.id);
        remaining -= inserted;
        existingTexts.push(...questions.map(q => q.text));
        console.log(`  +${inserted} inserted. Need ${remaining} more.`);
        await new Promise(r => setTimeout(r, 1000));
      } catch(e) {
        console.log('  Error:', e.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('\n✅ Done! FL total:', total);
}

main().catch(console.error).finally(() => p.$disconnect());
