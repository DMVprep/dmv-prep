process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_KEY = envFile.match(/ANTHROPIC_API_KEY=([^\n\r]+)/)?.[1]?.trim();
const p = new PrismaClient();

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
    code: 'TX', name: 'Texas',
    facts: {
      trafficSigns: 'Texas road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school zone, animal, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Texas-specific: TxDOT signs, farm-to-market road signs.',
      rightOfWay: 'Texas right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash), Move Over law (move over or slow down 20mph below limit for stopped emergency vehicles on shoulder).',
      speedLimits: 'Texas speed limits: urban districts 30mph, school zones 20mph when children present, residential alleys 15mph, numbered highways 70mph default, unnumbered highways 60mph, outside city limits 70mph, some interstates 75-85mph where posted. Work zone and school zone fines doubled.',
      safeDriving: 'Texas safe driving: following distance 2-second rule minimum, headlights required 30 min after sunset to 30 min before sunrise and when visibility under 1000ft, turn signals required, handheld cell phone ban in school zones, texting banned for all drivers, seatbelts required all occupants, child restraint under 8 years or under 4ft 9in, parking distances (15ft from fire hydrant, 20ft from crosswalk, 50ft from railroad crossing), right turn on red after stop unless posted, center turn lane rules.',
      alcohol: 'Texas DUI/DWI laws: BAC limit 0.08% adults, 0.00% under 21 (zero tolerance — any detectable amount), 0.04% CDL. DWI penalties: 1st offense up to $2000 fine, 3-180 days jail, 90-365 day license suspension. 2nd offense up to $4000, 1 month-1 year jail. Felony DWI with child passenger. Implied consent (must submit to breath/blood test). Open container law. Intoxication assault/manslaughter charges. ALR program (Administrative License Revocation).',
      licensing: 'Texas GDL: learner permit at 15 (written test + vision), must hold 6 months, 30 hours supervised driving (10 at night), restricted license at 16 (no more than 1 non-family passenger under 21 first 12 months, no driving midnight-5am), full license at 18. Point system: 2 points moving violation, 3 points speeding 25%+ over limit. 6 points in 36 months = surcharge. License renewal every 6 years. DPS offices.'
    }
  },
  {
    code: 'NY', name: 'New York',
    facts: {
      trafficSigns: 'New York road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way, no U-turn), warning signs (curve, merge, railroad, pedestrian, school zone, deer crossing, slippery road), guide signs (green=highway, blue=services), work zone (orange). NYC-specific: no right turn on red in NYC unless posted, bus lane signs, bike lane signs.',
      rightOfWay: 'New York right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming and pedestrians), pedestrians always have right of way in crosswalks, blind pedestrians (must stop), emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway: stop only if same side), Move Over law (slow to 20mph below limit or move over).',
      speedLimits: 'New York speed limits: NYC 25mph default, residential outside NYC 30mph, unposted roads 55mph, school zones 15mph when posted, highway 55mph, some interstates 65mph. Speed camera zones in NYC school zones. Work zone fines doubled. Basic speed law applies.',
      safeDriving: 'New York safe driving: following distance 3-second rule, headlights required sunset to sunrise and when windshield wipers in use, high beams within 500ft of oncoming or 200ft behind another vehicle, turn signals required 100ft before turning, handheld cell phone ban (hands-free required), texting banned, seatbelts required all occupants, child restraint under 4 years and under 40lbs in rear-facing, 4-8 years in booster seat. NYC: no right turn on red unless posted. Parking: 15ft from fire hydrant, 20ft from intersection.',
      alcohol: 'New York DWI laws: BAC 0.08% DWI, 0.18% Aggravated DWI, 0.05-0.07% DWAI (Driving While Ability Impaired). Under 21: 0.02% zero tolerance. CDL: 0.04%. Implied consent. DWAI drugs separate offense. Penalties: 1st DWI up to $1000 fine, 1 year revocation, possible jail. Aggravated DWI harsher. Chemical test refusal: 1 year revocation plus $500 fine.',
      licensing: 'New York GDL: learner permit at 16 (written test), must hold 6 months with 50 hours supervised (15 at night), Junior license at 16.5 (curfew 9pm-5am, 1 passenger under 21 unless family), full license at 17 or 18. Point system: 3-11 points per violation. 11 points in 18 months = suspension. Driver Responsibility Assessment for 6+ points. License renewal every 8 years. MV-44 form for permit.'
    }
  },
  {
    code: 'PA', name: 'Pennsylvania',
    facts: {
      trafficSigns: 'Pennsylvania road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer crossing, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). PA Turnpike signs, toll plaza signs.',
      rightOfWay: 'Pennsylvania right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only stop if same direction), Move Over law (move to adjacent lane or slow to safe speed for stopped emergency vehicles).',
      speedLimits: 'Pennsylvania speed limits: urban districts 35mph, school zones 15mph when posted, residential 25mph, business districts 35mph, rural 55mph, interstates/expressways 65mph (some 70mph). Work zone fines doubled. Basic speed law. PA Turnpike speed limits.',
      safeDriving: 'Pennsylvania safe driving: following distance 3-4 seconds, headlights required sunset to sunrise and when wipers in use, high beams within 500ft of oncoming or 300ft behind, turn signals required, handheld cell phone ban for learners and juniors, texting banned all drivers (NOT full handheld ban for adults), seatbelts required front seat (all under 18), child restraint under 4 years or under 40lbs. Parking: 15ft from fire hydrant, 20ft from crosswalk.',
      alcohol: 'Pennsylvania DUI laws: BAC tiers: General Impairment 0.08-0.099%, High BAC 0.10-0.159%, Highest BAC 0.16%+. Under 21: 0.02%. CDL: 0.04%. Penalties increase by tier and offense. 1st offense general impairment: up to $300 fine, 6 months probation, no jail. Highest BAC 1st offense: 72 hours to 6 months jail. Implied consent. ARD program for first offenders.',
      licensing: 'Pennsylvania GDL: learner permit at 16 (written test + vision), must hold 6 months, 65 hours supervised (10 at night, 10 in adverse conditions), Junior license at 16.5 (curfew 11pm-5am first 6 months then midnight, 1 passenger under 18 unless family), full license at 18. Knowledge test is 18 questions, need 15 correct (83%). PennDOT license centers. Point system: violations add points, 6 points = warning, 11 points = suspension.'
    }
  },
  {
    code: 'IL', name: 'Illinois',
    facts: {
      trafficSigns: 'Illinois road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Illinois-specific: tollway signs, Chicago city signs.',
      rightOfWay: 'Illinois right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians always have right of way, blind pedestrians (must stop), emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only same direction), Move Over law (Scott\'s Law — max $10,000 fine for violations, move over or slow to safe speed).',
      speedLimits: 'Illinois speed limits: urban/suburban 30mph, school zones 20mph on school days 6:30am-4pm only, rural two-lane 55mph, rural four-lane 65mph, interstate/tollway 70mph. Work zone fines doubled. Construction zone fines doubled when workers present. Basic speed law.',
      safeDriving: 'Illinois safe driving: following distance 3-second rule, headlights required sunset to sunrise and when raining/snowing/foggy, hands-free phone required for age 19+ (no phone at all under 19 except emergencies), texting banned all drivers, seatbelts required all occupants, child restraint under 8 years or under 4ft 9in. Parking: 15ft from fire hydrant, 20ft from intersection.',
      alcohol: 'Illinois DUI laws: BAC 0.08% adults, 0.00% under 21 (zero tolerance), 0.04% CDL. Penalties: 1st offense minimum 1 year license revocation, possible jail, fines. 2nd offense minimum 5 year revocation. Aggravated DUI (child in vehicle, school zone, no license, prior reckless homicide). Implied consent — refusal = 12 month statutory summary suspension. BAIID (Breath Alcohol Ignition Interlock Device) required for reinstatement.',
      licensing: 'Illinois GDL: instruction permit at 15 (written test + vision), must hold 9 months, 50 hours supervised (10 at night), restricted license at 16 (curfew: Sun-Thu 10pm-6am, Fri-Sat 11pm-6am, 1 passenger under 20 unless family first 12 months), full license at 18. Secretary of State DMV. Point system: violations tracked, repeated offenses lead to suspension.'
    }
  },
  {
    code: 'OH', name: 'Ohio',
    facts: {
      trafficSigns: 'Ohio road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer, slippery road, hill), guide (green=highway, blue=services, brown=recreation), work zone (orange). Ohio BMV signs, Ohio Turnpike signs.',
      rightOfWay: 'Ohio right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians in crosswalks, blind pedestrians (must stop), emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only same direction), Move Over law (move over or slow to safe speed for stopped emergency vehicles).',
      speedLimits: 'Ohio speed limits: residential/urban 25mph, school zones 20mph when children present, business districts 35mph, rural highways 55mph, freeways/interstates 70mph. Work zone fines doubled. Basic speed law. Ohio prima facie speed limits.',
      safeDriving: 'Ohio safe driving: following distance 4 seconds (Ohio handbook explicitly states 4 seconds), headlights required 30 min after sunset to 30 min before sunrise and when visibility under 1000ft, handheld cell phone ban for all drivers, texting banned all drivers, under 18 no electronic devices at all (including hands-free), seatbelts required all occupants, child restraint under 4 years or under 40lbs. Parking: 10ft from fire hydrant, 20ft from intersection.',
      alcohol: 'Ohio OVI (Operating Vehicle Impaired) laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. High test 0.17%+. Penalties: 1st offense 3 days to 6 months jail or driver intervention program, $375-$1075 fine, 90 day to 3 year suspension. Implied consent — refusal = 1 year ALS suspension. Physical control law (impaired in parked car).',
      licensing: 'Ohio GDL: temporary instruction permit at 15 years 6 months (written test), must hold 6 months, 50 hours supervised (10 at night), restricted license at 16 (curfew: midnight-6am first 12 months then 1am-5am, 1 passenger under 21 unless family first 12 months), full license at 17+1 year or 18. Ohio BMV. Points: 2-6 points per violation. 12 points in 2 years = suspension.'
    }
  },
  {
    code: 'GA', name: 'Georgia',
    facts: {
      trafficSigns: 'Georgia road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Georgia-specific: SR signs, Peach Pass toll signs.',
      rightOfWay: 'Georgia right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming and pedestrians), pedestrians in crosswalks, emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only same direction), Move Over law (Slow Down Move Over — move over or slow to safe speed), Slow Poke law (must move right if going slower than traffic flow).',
      speedLimits: 'Georgia speed limits: urban districts 30mph, school zones 25mph when children present or lights flashing, residential 30mph, rural two-lane 55mph, multi-lane highway 65mph, interstates 70mph. Work zone and school zone fines doubled. Basic speed law.',
      safeDriving: 'Georgia safe driving: following distance 3-second rule, headlights required 30 min after sunset to 30 min before sunrise and when visibility under 500ft, Hands-Free Georgia Act (no holding phone while driving — applies to all drivers), texting banned, seatbelts required all occupants, child restraint under 8 years or under 4ft 9in. Parking: 15ft from fire hydrant, 20ft from intersection.',
      alcohol: 'Georgia DUI laws: BAC 0.08% adults, 0.02% under 21, 0.04% CDL. Less Safe DUI (any impairment regardless of BAC). Penalties: 1st offense 24 hours to 1 year jail, $300-$1000 fine, 12 month license suspension. 2nd offense harsher. Habitual violator after 3 convictions = felony. Implied consent — refusal = 1 year suspension. DUI roadblocks legal in Georgia.',
      licensing: 'Georgia GDL: learner permit at 15 (written test + vision), must hold 12 months, 40 hours supervised (6 at night), Class D license at 16: first 6 months family only, 7-12 months 1 passenger under 21, after 12 months 3 passengers under 21, curfew midnight-5am NO EXCEPTIONS, full license at 18. Points system: 2-6 points per violation. 15 points in 24 months = suspension.'
    }
  },
  {
    code: 'NC', name: 'North Carolina',
    facts: {
      trafficSigns: 'North Carolina road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). NCDOT signs, toll signs.',
      rightOfWay: 'North Carolina right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians always have right of way, emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only same direction), Move Over law (move over or slow to safe speed for stopped emergency vehicles).',
      speedLimits: 'North Carolina speed limits: residential/urban 35mph, school zones 25mph when children present, rural two-lane 55mph, multi-lane highway 65mph, interstates 70mph, school buses 45mph max. Work zone fines doubled. Basic speed law.',
      safeDriving: 'North Carolina safe driving: following distance 2-second rule minimum, headlights required sunset to sunrise and when visibility under 400ft or when wipers in use, turn signals required, cell phone ban: under 18 no cell phone at all (except emergencies), adults no texting, seatbelts required all occupants, child restraint under 8 years or under 80lbs. Parking: 15ft from fire hydrant, 25ft from intersection.',
      alcohol: 'North Carolina DWI laws: BAC 0.08% adults, 0.00% under 21 (zero tolerance), 0.04% CDL. Five levels of DWI based on aggravating/mitigating factors. Level 5 (least severe): $200 fine, 24 hours to 60 days jail. Level 1A (most severe): $10,000 fine, mandatory minimum 12 months jail. Implied consent. Limited driving privilege available. Habitual DWI = felony.',
      licensing: 'North Carolina GDL: limited learner permit at 15 (written test), must hold 12 months, 60 hours supervised (10 at night), limited provisional license at 16 (curfew 9pm-5am, 1 passenger under 21 unless family first 6 months), full license at 16.5+. NCDMV. Points system: 1-5 points per violation. 12 points in 3 years = suspension. Knowledge test: 25 questions, need 20 correct (80%).'
    }
  },
  {
    code: 'MI', name: 'Michigan',
    facts: {
      trafficSigns: 'Michigan road signs: regulatory (stop, yield, speed limit, no turn, one way, do not enter, wrong way), warning (curve, merge, railroad, pedestrian, school, deer, slippery), guide (green=highway, blue=services, brown=recreation), work zone (orange). Michigan-specific: Michigan left (indirect left turn), MDOT signs.',
      rightOfWay: 'Michigan right of way: 4-way stops (first arrived, ties yield to right), roundabouts (yield to circulating), left turns (yield to oncoming), pedestrians always have right of way, blind pedestrians (must stop), emergency vehicles (pull right and stop), school buses (stop when red lights flash — divided highway only same direction), Move Over law (move over or slow to safe speed for stopped emergency vehicles on shoulder).',
      speedLimits: 'Michigan speed limits: urban/residential 25mph, school zones 25mph (when children present or lights flashing), business districts 25-35mph, rural roads 55mph, limited access highways 70mph, freeways 75mph where posted. Work zone fines doubled. Basic speed law.',
      safeDriving: 'Michigan safe driving: following distance 3-4 seconds, headlights required 30 min after sunset to 30 min before sunrise and when visibility under 500ft, MCL 257.602b bans handheld phones for ALL drivers, Kelsey\'s Law: Level 1 and 2 licenses no phone use at all (including hands-free), texting banned all drivers, seatbelts required all occupants (Level 1&2 must wear regardless), child restraint under 8 years or under 4ft 9in. Parking: 15ft from fire hydrant, 15-20ft from crosswalk.',
      alcohol: 'Michigan OWI laws: BAC 0.08% OWI, 0.17% High BAC OWI, 0.10% OWVI (Operating While Visibly Impaired). Under 21: 0.02% Zero Tolerance. CDL: 0.04%. Penalties: 1st OWI up to $500 fine, up to 93 days jail, 180 day license suspension. High BAC 1st offense: mandatory 45 days jail or 360 hours community service. Implied consent — refusal = 6 year revocation if prior. Sobriety Court program.',
      licensing: 'Michigan GDL: Level 1 (learner) at 14 years 9 months (written test), must hold 6 months, 50 hours supervised (10 at night), Level 2 (restricted) at 16: curfew 10pm-5am, 1 passenger under 21 unless family first 12 months, no phone at all (Kelsey\'s Law), full Level 3 at 17+1 year or 18. Michigan SOS. Points: 1-6 points per violation. 12 points = warning, more = suspension. Knowledge test: 50 questions, need 40 correct (80%).'
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
  return data.content[0].text;
}

async function generateBatch(stateName, topicName, context, existingTexts, count) {
  const existingList = existingTexts.slice(0,40).map(q=>'- '+q.substring(0,80)).join('\n');
  const prompt = `Generate exactly ${count} ${stateName} DMV practice questions for "${topicName}".

CONTEXT: ${context}

ALREADY COVERED (generate DIFFERENT concepts only):
${existingList}

Rules: 4 choices, 1 correct, plausible wrong answers, accurate ${stateName} facts only, 1-2 sentence explanation.

Return ONLY JSON array:
[{"text":"...","explanation":"...","choices":[{"text":"...","isCorrect":true},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false},{"text":"...","isCorrect":false}]}]`;

  const response = await callClaude(prompt);
  const cleaned = response.replace(/\`\`\`json\n?/g,'').replace(/\`\`\`\n?/g,'').trim();
  return JSON.parse(cleaned.slice(cleaned.indexOf('['), cleaned.lastIndexOf(']')+1));
}

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
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processing ${stateData.name} (${stateData.code})`);
  console.log('='.repeat(50));

  // Step 1: Cleanup duplicates
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

  // Step 2: Broad dedup
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
            await p.question.create({data:{text:q.text,explanation:q.explanation,stateId:stateRecord.id,topicId,choices:{create:q.choices.map(c=>({text:c.text,isCorrect:c.isCorrect}))}}});
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

  const total = await p.question.count({where:{stateId:stateRecord.id}});
  console.log(`\n✅ ${stateData.name} complete: ${total} questions`);
}

async function main() {
  for (const stateData of STATES) {
    await processState(stateData);
  }
  console.log('\n🎉 All states complete!');
}
main().catch(console.error).finally(()=>p.$disconnect());
