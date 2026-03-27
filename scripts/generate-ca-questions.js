process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

const TOPICS = [
  { id: 'cmmpntv01001e3jd60a0j8onz', name: 'Traffic Signs', target: 90, context: 'California road signs: regulatory signs (stop, yield, speed limit, no turn, one way, do not enter, wrong way, no U-turn, divided highway), warning signs (curve, merge, railroad, pedestrian, bicycle, animal, school zone, slippery road, hill, low clearance), guide signs (green=freeway/highway, blue=services, brown=recreation), work zone signs (orange). California-specific: Caltrans signs, HOV lane signs, carpool lane signs, CHP signs. Questions about sign shapes, colors, meanings. Do NOT repeat the same concept more than twice.' },
  { id: 'cmmpntvao001f3jd6afqngfl5', name: 'Right Of Way', target: 80, context: 'California right of way rules: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating traffic), left turns (yield to oncoming and pedestrians), T-intersections (through road has priority), entering highway from on-ramp (yield to highway traffic), pedestrians always have right of way in crosswalks marked or unmarked, blind pedestrians with white cane or guide dog (must stop), emergency vehicles (pull right and stop within 300 feet), funeral processions, school buses (stop when red lights flash on undivided road, divided road only stop if same side), Move Over law (slow to 50mph or move over for stopped emergency vehicles). Each question must cover a DIFFERENT scenario.' },
  { id: 'cmmpntvhy001g3jd6fkjlrbmq', name: 'Speed Limits', target: 75, context: 'California speed limits: residential/business districts 25mph, school zones 25mph when children present, near senior center 25mph, highway 65mph default, freeway 65mph (some 70mph posted), minimum freeway speed 45mph, near blind intersections 15mph, alleys 15mph, within 100ft of railroad crossing where view obscured 15mph, work zones reduced when workers present. Basic speed law: drive at safe speed for conditions regardless of posted limit. Prima facie speed limits. Speeding fines in work/school zones doubled. Each question must be about a DIFFERENT speed rule.' },
  { id: 'cmmpntvnw001h3jd6zi1q1365', name: 'Safe Driving', target: 90, context: 'California safe driving: following distance 3 seconds minimum, headlights required 30 minutes after sunset to 30 minutes before sunrise and when visibility less than 1000 feet, high beams within 500ft of oncoming or 300ft behind another vehicle, turn signals required 100ft before turning, handheld cell phones BANNED (hands-free required for 18+, NO phone use at all under 18 except emergency), texting banned for all drivers, seatbelts required for all occupants, child restraint required under 8 years or under 4ft 9in, parking on hills (curb side), right turn on red permitted unless sign says otherwise, expressway driving, blind spots, merging, lane changes, hydroplaning, fatigue, road rage, sharing road with trucks/motorcycles/bicycles/pedestrians, parking distances (15ft from fire hydrant, 3ft from driveway, 15ft from crosswalk at stop sign).' },
  { id: 'cmn2ia2ei0000ua6cuap3rywt', name: 'Alcohol & Substances', target: 75, context: 'California DUI laws: BAC limit 0.08% adults, 0.01% under 21 (zero tolerance), 0.04% CDL drivers, 0.01% on DUI probation. Implied consent law (must submit to chemical test or face license suspension). DUI penalties: 1st offense fines $390-$1000 plus penalty assessments, license suspension 6 months, possible jail, DUI program. 2nd offense harsher. Felony DUI if injury/death. Drug impairment same as alcohol. Cannabis: legal but cannot drive impaired. Open container law (no open alcohol in passenger area). DUI checkpoints legal. Alcohol elimination 1 drink per hour approximately. Prescription drugs can impair. Refusing breathalyzer adds 1 year suspension.' },
  { id: 'cmn2ia2n20001ua6cq7y7tood', name: 'Licensing & Permits', target: 50, context: 'California GDL: provisional permit at 15.5 years (written test + driving test with licensed adult 25+), must hold permit 6 months, 50 hours supervised driving (10 at night), provisional license at 16 (no passengers under 20 unless licensed adult 25+ present for first 12 months, no driving 11pm-5am for first 12 months), full license at 18. Adults 18+ get regular license after passing tests. License classes: C (regular), A/B (commercial), M (motorcycle). Real ID requirements. Point system: 1 point minor violations, 2 points major. 4 points in 12 months = negligent operator. License renewal every 5 years. Vision requirements 20/200 correctable to 20/40. Out of state transfer within 10 days of residency.' },
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

async function generateBatch(topic, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} California DMV permit test practice questions for "${topic.name}".

CONTEXT: ${topic.context}

ALREADY COVERED (generate DIFFERENT concepts only):
${existingList}

Rules:
- Each question tests a DIFFERENT concept from all others
- 4 answer choices, exactly 1 correct
- Plausible wrong answers (not obviously wrong)
- All facts must be accurate California DMV handbook facts
- Mix scenario-based ("You are driving...") and direct ("What is the...") questions
- Include 1-2 sentence explanation

Return ONLY valid JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

async function insertQuestions(questions, topicId) {
  let inserted = 0;
  for (const q of questions) {
    try {
      await p.question.create({
        data: { text: q.text, explanation: q.explanation, stateId: CA_STATE_ID, topicId,
          choices: { create: q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect})) } }
      });
      inserted++;
    } catch(e) { console.log('Skip:', q.text.substring(0,50)); }
  }
  return inserted;
}

async function main() {
  console.log('Starting CA question generation...\n');
  for (const topic of TOPICS) {
    const current = await p.question.count({where:{topicId:topic.id,stateId:CA_STATE_ID}});
    console.log(`\n=== ${topic.name}: ${current} -> ${topic.target} ===`);
    const needed = topic.target - current;
    if (needed <= 0) { console.log('Already at target'); continue; }

    const existing = await p.question.findMany({where:{topicId:topic.id,stateId:CA_STATE_ID},select:{text:true}});
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
  const total = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('\n✅ CA total:', total);
}
main().catch(console.error).finally(()=>p.$disconnect());
