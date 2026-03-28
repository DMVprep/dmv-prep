// scripts/generate-batch2-states.js
// Generate questions for 5 missing states: MA, KY, AL, LA, SC
// Uses the same pipeline as generate-all-states.js
// Run: node scripts/generate-batch2-states.js

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = (envFile.match(/ANTHROPIC_API_KEY="([^"]+)"/)?.[1] || envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1])?.trim();
const p = new PrismaClient();

// Topic IDs (same across all states — these are from the existing DB)
const TOPIC_IDS = {
  trafficSigns: 'cmmpntv01001e3jd60a0j8onz',
  rightOfWay: 'cmmpntvao001f3jd6afqngfl5',
  speedLimits: 'cmmpntvhy001g3jd6fkjlrbmq',
  safeDriving: 'cmmpntvnw001h3jd6zi1q1365',
  alcohol: 'cmn2ia2ei0000ua6cuap3rywt',
  licensing: 'cmn2ia2n20001ua6cq7y7tood',
};

const STATES = [
  {
    code: 'MA', name: 'Massachusetts',
    facts: {
      trafficSigns: 'Massachusetts road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Massachusetts-specific: Rotary signs (Massachusetts term for roundabout), keep right signs.',
      rightOfWay: 'Massachusetts right of way: 4-way stops (first arrived, ties yield to right), rotaries/roundabouts (yield to traffic already in rotary), left turns (yield to oncoming), pedestrians always have right of way in crosswalks (marked and unmarked), emergency vehicles (pull right and stop), school buses (stop when red lights flash — all directions on undivided road), Move Over law (move over or slow down for stopped emergency vehicles). Massachusetts law: must stop for pedestrians in crosswalks — failure is a fine.',
      speedLimits: 'Massachusetts speed limits: thickly settled/business districts 30 mph default, residential 30 mph unless posted, school zones 20 mph when posted/children present, state highways 50 mph unless posted, limited access/divided highways 65 mph max, Massachusetts Turnpike (I-90) 65 mph. Work zone fines doubled. Basic speed law applies. Minimum speed on highways — cannot impede traffic.',
      safeDriving: 'Massachusetts safe driving: following distance 3-second rule minimum (4 seconds for motorcycles, increase in bad weather), headlights required 30 min after sunset to 30 min before sunrise and when visibility under 500 feet and when wipers in continuous use, high beams dim within 500 feet of oncoming or 200 feet behind, turn signals required 100 feet before turning, ALL handheld electronic device use banned for ALL drivers (hands-free only — primary offense), texting banned, seatbelts required all ages (primary enforcement), child restraint: under 8 years AND under 57 inches in car seat/booster. Parking: 10 feet from fire hydrant, 20 feet from intersection. Right turn on red allowed after full stop (except where posted).',
      alcohol: 'Massachusetts OUI laws (Operating Under the Influence — not DUI/DWI): BAC 0.08% adults, 0.02% under 21 (zero tolerance), 0.04% CDL. OUI penalties: 1st offense up to $5000 fine, up to 2.5 years jail, 1 year license loss. 2nd offense: 30 days to 2.5 years jail, 2 year license loss. Implied consent — refusal of breathalyzer: 180-day automatic license suspension (1st offense), 3 year suspension (2nd offense). Melanie\'s Law: repeat offenders face ignition interlock device. OUI causing death: up to 15 years. Open container law. Massachusetts calls it OUI not DUI.',
      licensing: 'Massachusetts GDL (Junior Operator License — JOL): learner permit at 16 (25-question written test, 18 correct to pass = 72%, vision test), must hold 6 months clean record, complete driver ed (30 hours classroom + 12 hours behind wheel + 6 hours observation for under 18), 40 hours supervised driving (with licensed driver 21+ with 1 year experience). JOL at 16.5: no passengers under 18 for first 6 months (except family), curfew 12:30 AM–5 AM. Passenger restriction lifted at 17, nighttime at 18. Permit valid 2 years. Knowledge test: 25 questions, 18 correct (72%). RMV (Registry of Motor Vehicles — not DMV). Fee: $30 permit.',
    }
  },
  {
    code: 'KY', name: 'Kentucky',
    facts: {
      trafficSigns: 'Kentucky road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, slippery, low clearance), guide (green=highway, blue=services, brown=recreation), work zone (orange). Kentucky-specific: coal truck warning signs, parkway signs.',
      rightOfWay: 'Kentucky right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating traffic), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — all traffic on undivided road must stop, on divided highway with median only same direction stops), Move Over law (move over or reduce speed at least 20 mph below limit for stopped emergency/utility vehicles). Funeral processions have right of way.',
      speedLimits: 'Kentucky speed limits: residential/business districts 35 mph, school zones 25 mph when flashing, off-street parking 15 mph, state highways 55 mph, interstate highways 65 mph default (70 mph on designated rural segments of I-65, I-64, I-71, I-75 and certain parkways), urban interstates 55-65 mph near Louisville and Lexington. Work zone fines doubled when workers present. Basic speed law applies. Minimum speed — cannot impede traffic on highway.',
      safeDriving: 'Kentucky safe driving: following distance 4-second rule minimum (more in bad conditions — KY uses 4-second not 3-second rule), headlights required from sunset to sunrise and when visibility under 500 feet and when wipers in use, high beams dim within 500 feet of oncoming or 200 feet behind, turn signals required 100 feet before turning, handheld phone ban for novice/permit drivers ONLY (adults may use handheld — texting banned for ALL drivers, primary offense), seatbelts required all front seat and all under 18 (primary enforcement), child restraint: under 40 inches in rear-facing, 40+ inches and under 7 years in forward-facing/booster. Parking: 15 feet from fire hydrant, 20 feet from crosswalk.',
      alcohol: 'Kentucky DUI laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. Aggravated DUI at 0.15%+. DUI penalties: 1st offense $200-$500 fine, 48 hours to 30 days jail (or community service), 30-120 day license suspension. 2nd offense (within 10 years): $350-$500 fine, 7 days to 6 months jail, 12-18 month suspension. 4th offense = Class D felony. Implied consent — refusal: automatic license suspension. Look-back period: 10 years. Ignition interlock device for repeat offenders. Open container law.',
      licensing: 'Kentucky GDL: learner permit at 16 (written test + vision test at KSP regional office), must hold 6 months, complete 60 hours supervised driving (10 at night) with licensed driver 21+, driver education required. Intermediate license at 16.5: curfew midnight–6 AM, no more than 1 unrelated passenger under 20 for first 6 months. Full unrestricted license at 18. NOTE: As of March 2025, permit age lowered to 15. Knowledge test: 40 questions, 32 correct (80%). Administered by Kentucky State Police (KSP), not DMV. Point system: 12 points in 2 years = suspension. License renewal every 4 years. Fee: $12 permit.',
    }
  },
  {
    code: 'AL', name: 'Alabama',
    facts: {
      trafficSigns: 'Alabama road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Alabama-specific: hurricane evacuation route signs in coastal areas.',
      rightOfWay: 'Alabama right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — on undivided road ALL traffic must stop, on divided highway with physical barrier only same direction), Move Over law (move over or slow to safe speed for stopped emergency vehicles). Yield to funeral processions.',
      speedLimits: 'Alabama speed limits: urban districts 30 mph, unpaved roads 35 mph, county paved roads 45 mph, other locations 55 mph, posted highways 65 mph, interstate highways 70 mph where posted. School zones — reduced speed when children present/lights flashing. Minimum speed limits may also be posted. Work zone fines doubled. Basic speed law.',
      safeDriving: 'Alabama safe driving: following distance 2-second rule minimum, headlights required from sunset to sunrise and when visibility under 500 feet, high beams dim within 500 feet of oncoming or 200 feet behind, turn signals required, ALL drivers banned from texting (primary offense since 2012), NO statewide handheld phone ban for adults (only texting banned), seatbelts required front seat occupants (primary enforcement) and all under 15, child restraint: under 6 years or under 60 pounds. Parking: 15 feet from fire hydrant. Right turn on red after full stop unless posted otherwise. Move Over law.',
      alcohol: 'Alabama DUI laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. DUI penalties: 1st offense up to $2100 fine, up to 1 year jail, 90-day license suspension. 2nd offense (within 5 years): up to $5100, up to 1 year jail, 1 year suspension. 4th offense = Class C felony. Implied consent — refusal: 90-day suspension. Open container law. Alabama mandatory minimum fine of $600 for 1st DUI. Ignition interlock device may be required. Chemical test refusal admissible in court.',
      licensing: 'Alabama GDL: learner permit (Restricted License/Stage I) at 15 (written test + vision test), must hold 6 months, 50 hours supervised driving (10 at night) with licensed driver 21+. Restricted license (Stage II) at 16: no driving midnight–6 AM (exceptions for work/school/emergency), no more than 1 non-family passenger under 21 for first 6 months. Full license at 18 (or 17 with driver ed completion + 12 months clean record). Knowledge test: 40 questions, need 32 correct (80%). ALEA (Alabama Law Enforcement Agency) administers licenses — not DMV. Fee: $36.25. Point system: 12-14 points in 2 years = suspension.',
    }
  },
  {
    code: 'LA', name: 'Louisiana',
    facts: {
      trafficSigns: 'Louisiana road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, flooding, slippery when wet), guide (green=highway, blue=services, brown=recreation), work zone (orange). Louisiana-specific: flood zone signs, bridge weight limit signs, causeway signs (Lake Pontchartrain Causeway).',
      rightOfWay: 'Louisiana right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians always have right of way in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — ALL traffic both directions on undivided road, divided highway only same direction), Move Over law (move over or reduce speed by 20 mph below limit for stopped emergency vehicles). Funeral processions have right of way.',
      speedLimits: 'Louisiana speed limits: maximum speed 70 mph for any vehicle unless otherwise posted, towing speed limit 45 mph, school buses 35 mph when loading/unloading. School zones have reduced speed when lights flashing (varies by location). Lower speeds posted on residential and business streets. Work zone fines doubled. Basic speed law — drive at speed safe for conditions even if below posted limit. Driving too slowly also dangerous and illegal if impeding traffic.',
      safeDriving: 'Louisiana safe driving: following distance 3-second rule minimum (increase in bad weather/heavy traffic), headlights required sunset to sunrise and when visibility under 500 feet and when wipers in use, high beams dim within 500 feet of oncoming or 200 feet behind, turn signals required, handheld phone use banned while driving (primary offense since 2023 — hands-free only for ALL drivers), texting banned, seatbelts required all front seat (primary enforcement), child restraint: under 2 years in rear-facing, 2-4 years in forward-facing, 4-9 years and under 60 pounds in booster. Parking: 15 feet from fire hydrant, 20 feet from crosswalk, 50 feet from railroad crossing. Right turn on red after stop.',
      alcohol: 'Louisiana DUI/DWI laws: BAC 0.08% adults, 0.02% under 21 (zero tolerance), 0.04% CDL. DWI penalties: 1st offense $300-$1000 fine, 10 days to 6 months jail (may be suspended), 90-day license suspension. 2nd offense (within 10 years): $750-$1000, 30 days to 6 months jail (48 hours mandatory), 2 year suspension. 3rd offense: felony, 1-5 years. Implied consent — refusal: automatic suspension. Open container law (Louisiana is unique: passengers MAY have open containers in some parishes — driver may NOT drink). Ignition interlock for repeat offenders. DWI vehicular homicide: 5-30 years.',
      licensing: 'Louisiana GDL: learner permit (Class E Learner) at 15 (written test + vision test), must hold 6 months (180 days), complete 50 hours supervised driving (15 at night) with licensed driver 21+. Intermediate license at 16: no driving 11 PM–5 AM (exceptions), no more than 1 non-family passenger under 21 for first year. Full license at 17. Driver ed (38 hours classroom + 14 hours behind wheel) required for under 18. Knowledge test: 40 questions, need 32 correct (80%). OMV (Office of Motor Vehicles) — not DMV. Fee: $32.25. Point system: accumulating points leads to suspension.',
    }
  },
  {
    code: 'ME', name: 'Maine',
    facts: {
      trafficSigns: 'Maine road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, deer crossing, moose crossing, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Maine-specific: 5-sided school zone sign means slow to 15 mph, moose crossing warning signs common in rural areas.',
      rightOfWay: 'Maine right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians always have right of way at crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — all traffic both directions unless separated by median), Move Over law. Funeral processions have right of way. Must stop for blind pedestrians with white cane.',
      speedLimits: 'Maine speed limits: business/residential/built-up areas 25 mph, outside business/residential areas 45 mph, school zones 15 mph during recess or when children going to/leaving school. Maine Turnpike and interstate speeds posted (typically 65 mph). Basic speed law — must drive at speed reasonable for conditions. Driving too slowly also illegal if impeding traffic. Work zone fines doubled.',
      safeDriving: 'Maine safe driving: following distance 4-second rule minimum (increase in adverse conditions — Maine uses 4-second not 3-second rule), headlights required sunset to sunrise and when visibility is poor, high beams dim for oncoming traffic and when following, turn signals required, handheld phone use — Maine has hands-free law for phone calls but texting banned for all drivers, seatbelts required (all passengers), child restraint: under 12 years and under 100 pounds must be in rear seat if possible, proper child safety seat required by weight/age. Parking: 10 feet from fire hydrant, 15 feet from fire station driveway, 15 feet from crosswalk.',
      alcohol: 'Maine OUI laws (Operating Under the Influence): BAC 0.08% adults, under 21 — zero tolerance (any measurable BAC), 0.04% CDL. OUI penalties: 1st offense minimum $500 fine, 150-day license suspension. 2nd offense (within 10 years): minimum $700, 3-year suspension. 3rd offense: felony, minimum $1100, 6-year suspension. Implied consent — refusal results in 275-day suspension (1st), 18-month (2nd). Speeding 30+ mph over limit can also result in suspension. Maine calls it OUI not DUI.',
      licensing: 'Maine GDL: learner permit at 15 (must complete driver ed if under 18, written knowledge exam + vision test), accompanied by licensed driver at least 20 years old with 2+ years experience. Intermediate/provisional license — provisional for 2 years if under 21 (1 year if 21+). Moving violation during provisional = 30-day suspension. Knowledge test at BMV (Bureau of Motor Vehicles). Permit fee: $35. License valid 6 years.',
    }
  },
];

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 8000, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await res.json();
  if (data.error) {
    console.log('  API Error:', JSON.stringify(data.error).substring(0, 200));
    throw new Error(data.error.message || 'API error');
  }
  if (!data.content || !data.content[0]) {
    console.log('  Unexpected API response:', JSON.stringify(data).substring(0, 300));
    throw new Error('No content in API response');
  }
  return data.content[0].text;
}

async function generateBatch(stateName, topicName, context, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} ${stateName} DMV practice questions for "${topicName}".

CONTEXT: ${context}

ALREADY COVERED (generate DIFFERENT concepts only):
${existingList}

Rules:
- 4 choices each, exactly 1 correct answer
- Plausible wrong answers (not obviously wrong)
- Use accurate ${stateName}-specific facts ONLY
- Include the state name in some questions where relevant
- 1-2 sentence explanation for the correct answer
- Mix of direct knowledge and scenario-based questions

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

// Target question counts per topic (same as existing states)
const TOPIC_TARGETS = {
  [TOPIC_IDS.trafficSigns]: { key: 'trafficSigns', target: 90 },
  [TOPIC_IDS.rightOfWay]: { key: 'rightOfWay', target: 80 },
  [TOPIC_IDS.speedLimits]: { key: 'speedLimits', target: 75 },
  [TOPIC_IDS.safeDriving]: { key: 'safeDriving', target: 90 },
  [TOPIC_IDS.alcohol]: { key: 'alcohol', target: 75 },
  [TOPIC_IDS.licensing]: { key: 'licensing', target: 50 },
};

async function processState(stateData) {
  const stateRecord = await p.state.findUnique({where:{code:stateData.code}});
  if (!stateRecord) {
    console.log(`❌ State ${stateData.code} not found in DB — skipping`);
    return;
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processing ${stateData.name} (${stateData.code})`);
  console.log('='.repeat(50));

  // Check current question count
  const currentTotal = await p.question.count({where:{stateId:stateRecord.id}});
  if (currentTotal > 100) {
    console.log(`⚠ ${stateData.name} already has ${currentTotal} questions — skipping to avoid duplicates`);
    return;
  }

  // Step 1: Cleanup any existing duplicates
  const allQs = await p.question.findMany({where:{stateId:stateRecord.id},include:{choices:true},orderBy:{createdAt:'asc'}});
  const seen = new Map();
  const toDelete = [];
  for (const q of allQs) {
    const key = q.text.substring(0,60).toLowerCase().trim();
    if (seen.has(key)) toDelete.push(q.id);
    else seen.set(key, q.id);
  }
  if (toDelete.length > 0) {
    await p.answer.deleteMany({where:{questionId:{in:toDelete}}});
    await p.userProgress.deleteMany({where:{questionId:{in:toDelete}}});
    await p.choice.deleteMany({where:{questionId:{in:toDelete}}});
    await p.question.deleteMany({where:{id:{in:toDelete}}});
    console.log(`Removed ${toDelete.length} duplicates`);
  }

  // Step 2: Broad dedup limits
  const LIMITS = [
    {keyword:'fire hydrant',max:3},{keyword:'school bus',max:4},{keyword:'following distance',max:4},
    {keyword:'BAC',max:6},{keyword:'move over',max:4},{keyword:'right turn on red',max:3},
    {keyword:'speed limit',max:8},{keyword:'minimum age',max:3},
  ];
  for (const limit of LIMITS) {
    const qs = await p.question.findMany({where:{stateId:stateRecord.id,text:{contains:limit.keyword,mode:'insensitive'}},orderBy:{createdAt:'asc'}});
    if (qs.length > limit.max) {
      const del = qs.slice(limit.max).map(q=>q.id);
      await p.answer.deleteMany({where:{questionId:{in:del}}});
      await p.userProgress.deleteMany({where:{questionId:{in:del}}});
      await p.choice.deleteMany({where:{questionId:{in:del}}});
      await p.question.deleteMany({where:{id:{in:del}}});
      console.log(`  "${limit.keyword}": ${qs.length} -> ${limit.max}`);
    }
  }

  // Step 3: Generate new questions per topic
  for (const [topicId, {key, target}] of Object.entries(TOPIC_TARGETS)) {
    const current = await p.question.count({where:{topicId,stateId:stateRecord.id}});
    const needed = target - current;
    const topicName = key.replace(/([A-Z])/g,' $1').replace('Of Way','of Way').replace('And','&').trim();
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
            // Validate: must have exactly 4 choices with exactly 1 correct
            if (!q.choices || q.choices.length !== 4) continue;
            const correctCount = q.choices.filter(c => c.isCorrect).length;
            if (correctCount !== 1) continue;
            
            await p.question.create({data:{text:q.text,explanation:q.explanation,stateId:stateRecord.id,topicId,choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}}});
            inserted++;
          } catch(e) {
            // Skip silently on insert errors (e.g., duplicates)
          }
        }
        remaining -= inserted;
        existingTexts.push(...questions.map(q=>q.text));
        console.log(`  Batch ${++batch}: +${inserted}. Need ${remaining} more.`);
        await new Promise(r=>setTimeout(r,1500)); // Rate limit buffer
      } catch(e) {
        console.log('  Error:', e.message?.substring(0, 100));
        await new Promise(r=>setTimeout(r,3000));
      }
    }
  }

  const total = await p.question.count({where:{stateId:stateRecord.id}});
  console.log(`\n✅ ${stateData.name} complete: ${total} questions`);
}

async function main() {
  console.log('🚀 BATCH 2: Generating questions for MA, KY, AL, LA, ME\n');
  console.log('This will take 30-60 minutes due to API calls.\n');
  
  // Debug: verify API key loaded
  if (!ANTHROPIC_KEY) {
    console.log('❌ ANTHROPIC_API_KEY not found in .env.local');
    process.exit(1);
  }
  console.log(`API key loaded: ${ANTHROPIC_KEY.substring(0, 10)}...${ANTHROPIC_KEY.slice(-4)}\n`);
  
  for (const stateData of STATES) {
    await processState(stateData);
  }
  console.log('\n🎉 Batch 2 complete!');
}
main().catch(console.error).finally(()=>p.$disconnect());
