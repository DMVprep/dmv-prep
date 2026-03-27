process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n]+)/)?.[1];

const p = new PrismaClient();

const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';

const TOPICS = [
  { id: 'cmmpntv01001e3jd60a0j8onz', name: 'Traffic Signs', target: 100, context: 'Florida road signs: regulatory signs (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning signs (curve, merge, railroad, school zone, pedestrian, animal crossing, slippery road, low clearance), guide signs (green highway, blue service, brown recreation), work zone signs (orange), school zone signs (fluorescent yellow-green pentagon). Questions about sign colors, shapes, meanings.' },
  { id: 'cmmpntvao001f3jd6afqngfl5', name: 'Right Of Way', target: 90, context: 'Florida right of way rules: 4-way stops (first to arrive goes first, ties yield to right), roundabouts (yield to traffic already in circle), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash and arm extended on undivided roads), yielding when entering highway from ramp, Move Over Law (move over or slow 20mph below limit for stopped emergency vehicles), intersections with no signs (yield to right).' },
  { id: 'cmmpntvhy001g3jd6fkjlrbmq', name: 'Speed Limits', target: 80, context: 'Florida speed limits: residential 30mph, school zone 20mph when lights flash or children present, highway 55mph standard, interstate up to 70mph, minimum highway speed 40mph, work zone fines doubled, school zone fines doubled. Stopping distance increases with speed. Driving too slowly can be dangerous. Advisory speeds on curves. No speed buffer above posted limit.' },
  { id: 'cmmpntvnw001h3jd6zi1q1365', name: 'Safe Driving', target: 100, context: 'Florida safe driving: following distance 3 seconds minimum (4 in bad weather), headlights required sunset to sunrise and in rain/fog/smoke, high beams 500ft from oncoming traffic and 300ft when following, turn signals 100ft before turning, merging safely on highways, blind spots, defensive driving, fatigue, road rage avoidance, cell phone laws (handheld banned while driving), seatbelt laws (all passengers), child restraint laws, parking distances (15ft from fire hydrant, 20ft from crosswalk, 30ft from stop sign, 50ft from railroad crossing, 20ft from intersection), center turn lane rules, right turn on red (stop first, yield, then go unless signed), two-second following rule, expressway driving.' },
  { id: 'cmn2ia2ei0000ua6cuap3rywt', name: 'Alcohol & Substances', target: 80, context: 'Florida DUI laws: BAC limit 0.08% adults, 0.02% under 21, 0.04% CDL drivers. Implied consent law (must submit to chemical test). DUI penalties: fines, license suspension, jail time, ignition interlock. Zero tolerance for minors. Drug impairment same as alcohol. Prescription drugs can impair driving. Open container laws. DUI checkpoints legal in Florida. Blood alcohol affected by weight, food, time. Alcohol elimination rate approximately 1 drink per hour.' },
  { id: 'cmn2ia2n20001ua6cq7y7tood', name: 'Licensing & Permits', target: 50, context: 'Florida GDL: learner permit at age 15 (written test + vision test, TLSAE course required), must hold permit 12 months, 50 hours supervised driving (10 at night), restricted license at 16 (curfew 11pm-6am first year, 1am after), full license at 18. License renewal every 8 years. Point system: 12 points in 12 months = 30 day suspension. Vision requirements. License classes. ID requirements. Out of state license transfer. Permit restrictions (must have licensed 21+ in front seat, daylight only first 3 months).' },
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

async function generateBatch(topic, batchNum, existingQuestions, count) {
  const existingList = existingQuestions.slice(0, 30).map(q => '- ' + q).join('\n');
  
  const prompt = `You are generating Florida DMV permit test practice questions for the topic "${topic.name}".

CONTEXT: ${topic.context}

ALREADY GENERATED (do not repeat these concepts):
${existingList}

Generate exactly ${count} unique multiple-choice questions. Each must:
- Test a DIFFERENT concept from all others in this batch AND from existing questions
- Have exactly 4 answer choices (A, B, C, D)
- Have exactly 1 correct answer
- Use realistic wrong answers that are plausible but clearly incorrect
- Be based on actual Florida DMV handbook facts
- Vary in style: some scenario-based ("You are driving and..."), some direct ("What is the..."), some true/false style ("Which statement is correct...")
- Include a brief explanation (1-2 sentences) of why the answer is correct

Return ONLY valid JSON array, no other text:
[
  {
    "text": "question text here",
    "explanation": "brief explanation here",
    "choices": [
      {"text": "correct answer", "isCorrect": true},
      {"text": "wrong answer 1", "isCorrect": false},
      {"text": "wrong answer 2", "isCorrect": false},
      {"text": "wrong answer 3", "isCorrect": false}
    ]
  }
]`;

  const response = await callClaude(prompt);
  
  // Clean and parse JSON
  const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']') + 1;
  return JSON.parse(cleaned.slice(start, end));
}

async function insertQuestions(questions, topicId, stateId) {
  let inserted = 0;
  for (const q of questions) {
    try {
      await p.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          stateId: stateId,
          topicId: topicId,
          choices: {
            create: q.choices.map(c => ({
              text: c.text,
              isCorrect: c.isCorrect
            }))
          }
        }
      });
      inserted++;
    } catch(e) {
      console.log('Skip duplicate:', q.text.substring(0, 50));
    }
  }
  return inserted;
}

async function main() {
  console.log('Starting FL question generation...\n');
  
  for (const topic of TOPICS) {
    console.log(`\n=== ${topic.name} (target: ${topic.target}) ===`);
    
    // Get existing questions for this topic
    const existing = await p.question.findMany({
      where: { topicId: topic.id, stateId: FL_STATE_ID },
      select: { text: true }
    });
    console.log(`Current: ${existing.length} questions`);
    
    const needed = topic.target - existing.length;
    if (needed <= 0) {
      console.log('Already at target, skipping');
      continue;
    }
    
    console.log(`Need: ${needed} more questions`);
    const existingTexts = existing.map(q => q.text);
    
    // Generate in batches of 20
    let totalInserted = 0;
    let remaining = needed;
    let batchNum = 0;
    
    while (remaining > 0) {
      const batchSize = Math.min(20, remaining);
      console.log(`  Batch ${++batchNum}: generating ${batchSize} questions...`);
      
      try {
        const questions = await generateBatch(topic, batchNum, existingTexts, batchSize);
        const inserted = await insertQuestions(questions, topic.id, FL_STATE_ID);
        totalInserted += inserted;
        remaining -= inserted;
        existingTexts.push(...questions.map(q => q.text));
        console.log(`  Inserted ${inserted} questions. Total: ${existing.length + totalInserted}/${topic.target}`);
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
      } catch(e) {
        console.log('  Batch error:', e.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
    console.log(`✅ ${topic.name} complete: ${existing.length + totalInserted} questions`);
  }
  
  console.log('\n🎉 FL question generation complete!');
  
  // Final count
  const total = await p.question.count({ where: { stateId: FL_STATE_ID } });
  console.log('Total FL questions:', total);
}

main().catch(console.error).finally(() => p.$disconnect());
