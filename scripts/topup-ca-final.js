process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();
const CA_STATE_ID = 'cmmpntm4s00043jd6mtc4xwmi';

const TOPICS = [
  {
    id: 'cmmpntv01001e3jd60a0j8onz', name: 'Traffic Signs', target: 85,
    context: `California traffic signs: regulatory signs (octagonal STOP, triangular YIELD, rectangular speed limits, do not enter, one way, no U-turn, no left/right turn), warning signs (diamond-shaped yellow: curves, merges, railroad crossings, pedestrian crossings, school zones, slippery road, deer crossing), guide signs (green=highway destinations, blue=services like gas/food/lodging, brown=recreational areas), work zone signs (orange diamond). HAWK signals (High-Intensity Activated Crosswalk). Pavement markings: white lines same direction, yellow lines opposite direction, broken=may cross, solid=do not cross, double solid=no passing. HOV lane signs. Low clearance signs. Wrong way signs. Lane control signals.`
  },
  {
    id: 'cmmpntvao001f3jd6afqngfl5', name: 'Right Of Way', target: 80,
    context: `California right of way rules: 4-way stops (first to arrive goes first; simultaneous arrival = yield to vehicle on right), uncontrolled intersections (yield to vehicle on right), roundabouts (yield to circulating traffic already inside), left turns (yield to oncoming traffic and pedestrians), right turns (yield to pedestrians in crosswalk), pedestrians always have right of way in all crosswalks marked and unmarked, blind pedestrians with white cane or guide dog must always stop completely, emergency vehicles with lights/sirens (pull right and stop, do not block intersections), Move Over Law (move over one lane or slow to safe speed for stopped emergency vehicles on shoulder), school buses with flashing red lights and stop arm extended (all traffic stops; divided highway only same side stops), funeral processions (yield and do not cut through), merging onto freeway (yield to freeway traffic), yield signs, T-intersections (through street has right of way).`
  },
  {
    id: 'cmmpntvhy001g3jd6fkjlrbmq', name: 'Speed Limits', target: 75,
    context: `California speed limits: residential districts 25 mph, business districts 25 mph, near schools and children 25 mph, two-lane undivided highways 55 mph, multi-lane highways and freeways 65 mph (some posted 70 mph), alleys 15 mph, blind intersections 15 mph, within 100 feet of railroad crossing with obstructed view 15 mph, freeway minimum speed 45 mph. Basic Speed Law: never drive faster than safe for conditions regardless of posted limit. Prima facie speed limits are presumed safe but can be exceeded if proven safe or must be reduced if conditions warrant. Work zone and school zone fines doubled. Cannot impede traffic flow by driving too slowly.`
  },
  {
    id: 'cmmpntvnw001h3jd6zi1q1365', name: 'Safe Driving', target: 90,
    context: `California safe driving: following distance minimum 3 seconds (more in bad weather), headlights required 30 min after sunset to 30 min before sunrise and when visibility under 1000 feet, dim high beams within 500 feet of oncoming or 300 feet behind another vehicle, signal at least 100 feet before turning, seatbelts required all occupants all seats, child restraint required under 8 years OR under 4 feet 9 inches tall, cell phone: hands-free required for all drivers age 18+, no phone use at all for drivers under 18 except emergencies, texting banned all drivers, parking on hills (uphill with curb: wheels away from curb; downhill with curb: wheels toward curb; no curb: wheels toward edge), park at least 15 feet from fire hydrant, 20 feet from crosswalk, 3 feet from driveway, passing on right only in specific situations, no passing in no-passing zones, sharing road with motorcycles (give full lane), sharing road with cyclists (3-foot minimum clearance), drowsy driving (pull over and rest), road rage (don't engage).`
  },
  {
    id: 'cmn2ia2ei0000ua6cuap3rywt', name: 'Alcohol & Substances', target: 75,
    context: `California DUI: BAC limit 0.08% adults, 0.01% under 21 (zero tolerance), 0.04% CDL. First DUI: $390-$1000 base fine (much higher with assessments), 6 month license suspension, up to 6 months jail, DUI school required, possible ignition interlock. Second DUI within 10 years: 2-year suspension, longer jail. Felony DUI: injury/death involved or 4th offense. Implied consent: must submit to chemical test (breath/blood/urine) upon arrest or face additional 1-year suspension for first refusal. DUI checkpoints legal in California. Marijuana DUI same penalties as alcohol DUI. Prescription drug DUI possible if impaired. Only time eliminates alcohol (liver processes ~1 drink/hour). Coffee/cold shower do not help.`
  },
  {
    id: 'cmn2ia2n20001ua6cq7y7tood', name: 'Licensing & Permits', target: 50,
    context: `California GDL: provisional instruction permit at 15.5 years, supervising driver must be 25+, hold permit 6 months, 50 hours supervised driving (10 at night). Provisional license at 16: no driving 11PM-5AM first 12 months (work/school/medical exceptions), no passengers under 20 unless licensed driver 25+ present. Full unrestricted license at 18. Class C for regular passenger vehicles, Class M for motorcycles, Class A/B for commercial. Points: 1 point minor violation, 2 points major violation (DUI, hit and run, reckless). 4 points in 12 months = negligent operator. License renewal every 5 years. Vision required 20/40 correctable. New residents must get CA license within 10 days. Address change notification required within 10 days. Written test: 36 questions, must pass 30 (83%). Can retake same day if fail. Parental consent required under 18.`
  }
];

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01'},
    body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:8000,messages:[{role:'user',content:prompt}]})
  });
  const data = await res.json();
  return data.content[0].text;
}

async function main() {
  for (const topic of TOPICS) {
    const current = await p.question.count({where:{stateId:CA_STATE_ID,topicId:topic.id}});
    const needed = topic.target - current;
    console.log(`\n${topic.name}: ${current} -> ${topic.target} (need ${needed})`);
    if (needed <= 0) { console.log('  Already at target'); continue; }

    const existing = await p.question.findMany({where:{stateId:CA_STATE_ID,topicId:topic.id},select:{text:true}});
    const existingList = existing.map(q=>'- '+q.text.substring(0,80)).join('\n');
    let remaining = needed, batch = 0;

    while (remaining > 0) {
      const size = Math.min(20, remaining);
      const prompt = `Generate exactly ${size} California DMV practice test questions for the topic "${topic.name}".

CONTEXT (verified CA facts only):
${topic.context}

ALREADY COVERED — generate DIFFERENT concepts:
${existingList.substring(0,3000)}

STRICT RULES:
- Questions must be clearly about "${topic.name}" — no mixing topics
- 4 answer choices, exactly 1 correct
- Plausible wrong answers (not obviously wrong)
- Clear, direct question wording matching real DMV test style
- 1-2 sentence explanation citing the specific rule
- Accurate California-specific facts only

Return ONLY a JSON array, no other text:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

      try {
        const response = await callClaude(prompt);
        const cleaned = response.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
        const questions = JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
        let inserted = 0;
        for (const q of questions) {
          try {
            await p.question.create({data:{
              text:q.text, explanation:q.explanation,
              stateId:CA_STATE_ID, topicId:topic.id,
              choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}
            }});
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

  const total = await p.question.count({where:{stateId:CA_STATE_ID}});
  console.log('\n=== CA FINAL ===');
  console.log('Total:', total);
  const topics = await p.topic.findMany();
  for (const t of topics) {
    const n = await p.question.count({where:{stateId:CA_STATE_ID,topicId:t.id}});
    console.log(`  ${t.name}: ${n}`);
  }
}
main().catch(console.error).finally(()=>p.$disconnect());
