// scripts/regenerate-damaged-states.js
// Regenerate questions for states that lost too many during QA: AZ, AR, CO, CT
// Uses handbook-verified facts to generate correct questions
// Run: node scripts/regenerate-damaged-states.js

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = (envFile.match(/ANTHROPIC_API_KEY="([^"]+)"/)?.[1] || envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1])?.trim();
const p = new PrismaClient();

const TOPIC_IDS = {
  trafficSigns: 'cmmpntv01001e3jd60a0j8onz',
  rightOfWay: 'cmmpntvao001f3jd6afqngfl5',
  speedLimits: 'cmmpntvhy001g3jd6fkjlrbmq',
  safeDriving: 'cmmpntvnw001h3jd6zi1q1365',
  alcohol: 'cmn2ia2ei0000ua6cuap3rywt',
  licensing: 'cmn2ia2n20001ua6cq7y7tood',
};

// Handbook-verified facts for each damaged state
const STATES = [
  {
    code: 'AZ', name: 'Arizona',
    facts: {
      trafficSigns: 'Arizona road signs: regulatory (stop, yield, speed limit, one way, do not enter), warning (curve, merge, railroad, pedestrian, school zone, deer crossing), guide (green=highway, blue=services, brown=recreation), work zone (orange). School crosswalk = pentagon-shaped sign.',
      rightOfWay: 'Arizona right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash). Move Over law. Funeral processions have right of way.',
      speedLimits: 'Arizona speed limits (VERIFIED from handbook): school crosswalk 15 mph, business/residential districts 25 mph, open highways/city freeways 55 mph, designated open highways 65 mph, rural freeways 75 mph. IMPORTANT: residential = 25 mph NOT 30 or 35.',
      safeDriving: 'Arizona safe driving: following distance 3-second minimum (3-6 seconds in poor conditions). IMPORTANT: AZ uses 3-second rule, NOT 2-second. Headlights required sunset to sunrise. Seatbelts required. Child restraint laws. Parking: 15 feet from fire hydrant. IMPORTANT: AZ hydrant = 15 feet NOT 10 or 20.',
      alcohol: 'Arizona DUI laws: BAC 0.08% adults, under 21 zero tolerance, 0.04% CDL. Extreme DUI at 0.15%+. Super extreme DUI at 0.20%+. Implied consent. Open container law. Penalties increase for repeat offenses.',
      licensing: 'Arizona GDL: instruction permit at 15.5 (written test + vision), graduated license at 16 with driver ed. Must hold permit 6 months. 30 hours supervised driving. MVD (Motor Vehicle Division) administers.',
    }
  },
  {
    code: 'AR', name: 'Arkansas',
    facts: {
      trafficSigns: 'Arkansas road signs: regulatory (stop, yield, speed limit, one way, do not enter), warning (curve, merge, railroad, pedestrian, school zone, deer crossing), guide (green=highway, blue=services, brown=recreation), work zone (orange).',
      rightOfWay: 'Arkansas right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash). Move Over law.',
      speedLimits: 'Arkansas speed limits: school zones when posted, residential areas as posted, state highways as posted, interstate 70 mph. Basic speed law applies.',
      safeDriving: 'Arkansas safe driving: following distance 2-second rule (VERIFIED from handbook — AR uses 2-second rule). Headlights required sunset to sunrise. Seatbelts required. Child restraint laws. Parking: 15 feet from fire hydrant. IMPORTANT: AR hydrant = 15 feet NOT 10 or 20.',
      alcohol: 'Arkansas DWI laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. Penalties: 1st offense fine + jail + suspension. Implied consent. Open container law.',
      licensing: 'Arkansas GDL: learner permit at 14, intermediate at 16, full license at 18. Written test + vision test. DFA (Department of Finance and Administration) administers licensing.',
    }
  },
  {
    code: 'CO', name: 'Colorado',
    facts: {
      trafficSigns: 'Colorado road signs: regulatory (stop, yield, speed limit, one way, do not enter), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, falling rocks), guide (green=highway, blue=services, brown=recreation), work zone (orange).',
      rightOfWay: 'Colorado right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash). Move Over law — slow to 25 mph if posted limit 45 or less, or 20 under posted limit if above 45.',
      speedLimits: 'Colorado speed limits: residential 25-30 mph as posted, school zones 20 mph when children present, highways as posted. Basic speed law — adjust for conditions.',
      safeDriving: 'Colorado safe driving: following distance 3-second rule (VERIFIED from handbook — CO uses 3-second rule, NOT 2-second). Headlights required sunset to sunrise and in poor visibility. Seatbelts required all ages. Child restraint laws. Parking: 15 feet from fire hydrant. IMPORTANT: CO hydrant = 15 feet NOT 10.',
      alcohol: 'Colorado DUI/DWAI laws: BAC 0.08% DUI, 0.05% DWAI (Driving While Ability Impaired — unique to CO), 0.02% under 21, 0.04% CDL. Express consent law. Penalties increase for repeat offenses.',
      licensing: 'Colorado GDL: learner permit at 15 (written test + vision), minor license at 16. Must hold permit 12 months. 50 hours supervised driving (10 at night). DMV administers.',
    }
  },
  {
    code: 'CT', name: 'Connecticut',
    facts: {
      trafficSigns: 'Connecticut road signs: regulatory (stop, yield, speed limit, one way, do not enter), warning (curve, merge, railroad, pedestrian, school zone, deer crossing), guide (green=highway, blue=services, brown=recreation), work zone (orange).',
      rightOfWay: 'Connecticut right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash). Move Over law.',
      speedLimits: 'Connecticut speed limits: residential as posted (typically 25 mph), school zones as posted, state highways as posted, interstate 55-65 mph. Basic speed law applies.',
      safeDriving: 'Connecticut safe driving: following distance 3-second rule (VERIFIED from handbook — CT uses three-second rule, NOT 2-second). Headlights required sunset to sunrise and in poor visibility. Seatbelts required. Child restraint laws. Parking: 10 feet from fire hydrant. IMPORTANT: CT hydrant = 10 feet NOT 15 or 20. More than 1 foot from curb = illegal.',
      alcohol: 'Connecticut DUI laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. Implied consent. Penalties: 1st offense — fine, jail up to 6 months, 45-day license suspension. Look-back period 10 years.',
      licensing: 'Connecticut GDL: learner permit at 16 (written test + vision), provisional license at 16.33 (after 120 days + 40 hours supervised). Nighttime restriction midnight-5 AM first 6 months. DMV administers. Test: 25 questions, need 20 correct (80%).',
    }
  },
];

const TOPIC_TARGETS = {
  [TOPIC_IDS.trafficSigns]: { key: 'trafficSigns', target: 90 },
  [TOPIC_IDS.rightOfWay]: { key: 'rightOfWay', target: 80 },
  [TOPIC_IDS.speedLimits]: { key: 'speedLimits', target: 75 },
  [TOPIC_IDS.safeDriving]: { key: 'safeDriving', target: 90 },
  [TOPIC_IDS.alcohol]: { key: 'alcohol', target: 75 },
  [TOPIC_IDS.licensing]: { key: 'licensing', target: 50 },
};

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) { throw new Error(data.error.message); }
  if (!data.content || !data.content[0]) { throw new Error('No content'); }
  return data.content[0].text;
}

async function generateBatch(stateName, topicName, context, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} ${stateName} DMV practice questions for "${topicName}".

CONTEXT (use ONLY these verified facts): ${context}

ALREADY IN DATABASE (generate DIFFERENT questions):
${existingList}

Rules:
- 4 choices each, exactly 1 correct answer
- Plausible wrong answers (not obviously wrong)
- Use ONLY the verified ${stateName}-specific facts above
- Include the state name in some questions
- 1-2 sentence explanation for the correct answer
- Mix of direct knowledge and scenario-based questions

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

async function processState(stateData) {
  const stateRecord = await p.state.findUnique({where:{code:stateData.code}});
  if (!stateRecord) { console.log(`❌ ${stateData.code} not found`); return; }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`REGENERATING ${stateData.name} (${stateData.code})`);
  console.log('='.repeat(50));

  const currentTotal = await p.question.count({where:{stateId:stateRecord.id}});
  console.log(`  Current questions: ${currentTotal}`);

  for (const [topicId, {key, target}] of Object.entries(TOPIC_TARGETS)) {
    const current = await p.question.count({where:{topicId,stateId:stateRecord.id}});
    const needed = target - current;
    const topicName = key.replace(/([A-Z])/g,' $1').trim();
    console.log(`\n  ${topicName}: ${current} -> ${target} (need ${needed})`);
    if (needed <= 0) { console.log('  Already at target'); continue; }

    const existing = await p.question.findMany({where:{topicId,stateId:stateRecord.id},select:{text:true}});
    const existingTexts = existing.map(q=>q.text);
    const context = stateData.facts[key];
    let remaining = needed, batch = 0;

    while (remaining > 0) {
      const size = Math.min(20, remaining);
      try {
        const questions = await generateBatch(stateData.name, topicName, context, existingTexts, size);
        let inserted = 0;
        for (const q of questions) {
          try {
            if (!q.choices || q.choices.length !== 4) continue;
            if (q.choices.filter(c => c.isCorrect).length !== 1) continue;
            await p.question.create({data:{text:q.text,explanation:q.explanation,stateId:stateRecord.id,topicId,choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}}});
            inserted++;
          } catch(e) {}
        }
        remaining -= inserted;
        existingTexts.push(...questions.map(q=>q.text));
        console.log(`  Batch ${++batch}: +${inserted}. Need ${remaining} more.`);
        await new Promise(r=>setTimeout(r,1500));
      } catch(e) {
        console.log('  Error:', e.message?.substring(0, 100));
        await new Promise(r=>setTimeout(r,3000));
      }
    }
  }

  const total = await p.question.count({where:{stateId:stateRecord.id}});
  console.log(`\n✅ ${stateData.name} restored: ${total} questions`);
}

async function main() {
  console.log('🔧 REGENERATING DAMAGED STATES: AZ, AR, CO, CT\n');
  if (!ANTHROPIC_KEY) { console.log('❌ No API key'); process.exit(1); }
  console.log(`API key: ${ANTHROPIC_KEY.substring(0,15)}...${ANTHROPIC_KEY.slice(-4)}\n`);
  for (const s of STATES) { await processState(s); }
  console.log('\n🎉 All states restored!');
}
main().catch(console.error).finally(()=>p.$disconnect());
