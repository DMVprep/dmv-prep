const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntret000w3jd6x7hr74xe';
const TOPIC = {
  SIGNS:    'cmmpntv01001e3jd60a0j8onz',
  ROW:      'cmmpntvao001f3jd6afqngfl5',
  SPEED:    'cmmpntvhy001g3jd6fkjlrbmq',
  SAFE:     'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
  LICENSE:  'cmn2ia2n20001ua6cq7y7tood',
};

function cuid() {
  const ts = Date.now().toString(36);
  const rand = () => Math.random().toString(36).slice(2, 8);
  return `c${ts}${rand()}${rand()}`;
}

async function deleteQuestions(ids) {
  if (!ids.length) return;
  await p.$transaction([
    p.userProgress.deleteMany({ where: { questionId: { in: ids } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: ids } } }),
    p.choice.deleteMany({ where: { questionId: { in: ids } } }),
    p.question.deleteMany({ where: { id: { in: ids } } }),
  ]);
  console.log(`  Deleted ${ids.length} questions.`);
}

async function fixQuestion(id, newText, newChoices) {
  await p.choice.deleteMany({ where: { questionId: id } });
  await p.question.update({ where: { id }, data: { text: newText } });
  for (const ch of newChoices) {
    await p.choice.create({
      data: { id: cuid(), text: ch.text, isCorrect: ch.isCorrect, questionId: id }
    });
  }
  console.log(`  Fixed: ${newText.substring(0, 80)}`);
}

async function addQuestion(topicId, text, explanation, choices) {
  const qid = cuid();
  await p.question.create({ data: { id: qid, text, explanation, stateId: STATE_ID, topicId } });
  for (const ch of choices) {
    await p.choice.create({
      data: { id: cuid(), text: ch.text, isCorrect: ch.isCorrect, questionId: qid }
    });
  }
  console.log(`  Added: ${text.substring(0, 80)}`);
}

async function main() {
  console.log('=== NC QA FIX ===\n');

  console.log('--- STEP 1: Fixing factual errors ---');

  // Fix: wrong city/town speed (25 or 30 → 35 mph)
  await fixQuestion('cmmsd9p87083pneslfommboku',
    'What is the maximum speed limit in residential areas in North Carolina unless otherwise posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmmsd86ez0825nesl1ahtww4a',
    'While driving in a residential neighborhood in North Carolina, what is the maximum legal speed unless posted otherwise?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '40 mph', isCorrect: false }]);

  await fixQuestion('cmmsd83b907xvneslqc4ajblo',
    'What is the default speed limit in a residential area in North Carolina?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmmsd6mxd07s1nesl8kfq0aa5',
    'What is the default speed limit in residential areas in North Carolina when no signs are posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '40 mph', isCorrect: false }]);

  await fixQuestion('cmmsdh2rb08vbnesl5gp7w0d2',
    'In which zone must you exercise extra caution when yielding to pedestrians in North Carolina?',
    [{ text: '25 mph school zone', isCorrect: false },{ text: '35 mph urban/city zone — the default city speed', isCorrect: false },{ text: 'Any crosswalk, regardless of speed limit', isCorrect: true },{ text: 'Only in 15 mph zones', isCorrect: false }]);

  await fixQuestion('cmmsdntfi09fxneslmd78fyag',
    'You are driving on a residential street in North Carolina. What is the maximum legal speed unless posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmn3iar810a0j97ugzrhaevm6',
    'What is the default speed limit in urban/city areas of North Carolina unless otherwise posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmn3ibzs30a3p97ugs5ruvglb',
    'What is the default speed limit in a business district in a North Carolina city unless posted otherwise?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmmsdkcj10985nesl005gg732',
    'You are driving on a residential street in North Carolina where children play. What is the maximum legal speed unless posted?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: false },{ text: '35 mph', isCorrect: true },{ text: '45 mph', isCorrect: false }]);

  // Fix: wrong interstate speed (55 or 65 → 70 mph)
  await fixQuestion('cmn3iarjj0a0v97ugb8qku21t',
    'What is the maximum speed limit on a North Carolina interstate highway when posted?',
    [{ text: '55 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true },{ text: '75 mph', isCorrect: false }]);

  await fixQuestion('cmmsdm18c09c1nesll8xlus1x',
    'On a North Carolina interstate highway, what is the maximum posted speed limit?',
    [{ text: '55 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true },{ text: '75 mph', isCorrect: false }]);

  await fixQuestion('cmmsdkb310967nesl0uo4y4no',
    'On an interstate highway in North Carolina, what is the maximum legal speed when posted?',
    [{ text: '55 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true },{ text: '75 mph', isCorrect: false }]);

  // Fix: wrong adult BAC (.10 → .08)
  await fixQuestion('cmmsdbdwy08dtnesl8f9mf2iv',
    'What is the BAC limit for adult drivers in North Carolina?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmmsd6q9r07x3neslzai64ly3',
    'What is the BAC limit for adult drivers in North Carolina?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.12%', isCorrect: false }]);

  await fixQuestion('cmn3ihie70an797ugpws1plxg',
    'At what BAC level is an adult driver considered legally impaired in North Carolina?',
    [{ text: '.05%', isCorrect: false },{ text: '.08% or higher', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  // Fix: wrong under-21 BAC (.02 → zero tolerance/any amount)
  await fixQuestion('cmmsdbe5e08e7nesl7k3to8nl',
    'What is the BAC limit for drivers under 21 in North Carolina?',
    [{ text: '.02% — the same as Georgia and Ohio', isCorrect: false },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false },{ text: 'Any amount — North Carolina has zero tolerance', isCorrect: true }]);

  await fixQuestion('cmmsd9sc7088rneslz7n7jjh4',
    'What is the BAC limit for drivers under 21 years old in North Carolina?',
    [{ text: '.02%', isCorrect: false },{ text: '.04%', isCorrect: false },{ text: 'Any detectable amount — NC has zero tolerance for under-21', isCorrect: true },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmmsdd1ef08jnneslz9779b9o',
    'What is the BAC limit for drivers under 21 in North Carolina?',
    [{ text: '.02%', isCorrect: false },{ text: '.04%', isCorrect: false },{ text: 'Zero — any alcohol consumption while driving is unlawful', isCorrect: true },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmn3ihiwx0anp97ugij3v3lhc',
    'What BAC level applies to all drivers under 21 in North Carolina?',
    [{ text: '.02%', isCorrect: false },{ text: '.04%', isCorrect: false },{ text: 'Any amount — NC has zero tolerance for under-21 drivers', isCorrect: true },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmn3ihg5q0akv97ug0w1za863',
    'What is the BAC limit for drivers under 21 in North Carolina?',
    [{ text: '.02%', isCorrect: false },{ text: '.05%', isCorrect: false },{ text: 'Zero — any alcohol is unlawful for under-21 drivers in NC', isCorrect: true },{ text: '.08%', isCorrect: false }]);

  // Fix: .15 BAC "grossly aggravating" questions — .08 is the impairment threshold, .15 is aggravating
  // These two questions are about .15 being a grossly aggravating factor — actually correct, just badly worded
  // The scan flagged .10 in choices; fix to make clear .15 is the aggravating threshold
  await fixQuestion('cmn3ije4p0arj97ugssf68r2w',
    'In North Carolina, what BAC level is considered a grossly aggravating factor that increases DWI penalties?',
    [{ text: '.08% — the standard impairment level', isCorrect: false },{ text: '.10%', isCorrect: false },{ text: '.15% or higher', isCorrect: true },{ text: '.20% or higher', isCorrect: false }]);

  await fixQuestion('cmn3iigp60aqj97ugwyn8q55c',
    'What BAC level is considered a grossly aggravating factor in North Carolina DWI cases?',
    [{ text: '.08%', isCorrect: false },{ text: '.10%', isCorrect: false },{ text: '.15% or higher', isCorrect: true },{ text: '.20%', isCorrect: false }]);

  // Fix: wrong fire hydrant (10 or 20 → 15 feet)
  await fixQuestion('cmmsd8759082xnesl6rn0jcvm',
    'How far from a fire hydrant must you park your vehicle in North Carolina?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmmsd6npk07t7neslf96kxqb3',
    'How far must you park from a fire hydrant in North Carolina?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmmsdh1dw08tdneslk01b5j5c',
    'How far from a fire hydrant must you park to avoid blocking emergency vehicle access in NC?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3if3nf0add97ug2fokjuqm',
    'Where are you prohibited from parking in relation to a fire hydrant in North Carolina?',
    [{ text: 'Within 10 feet', isCorrect: false },{ text: 'Within 15 feet', isCorrect: true },{ text: 'Within 20 feet', isCorrect: false },{ text: 'Within 25 feet', isCorrect: false }]);

  await fixQuestion('cmn3if5ar0afj97ug2n73nn1b',
    'How close can you legally park to a fire hydrant in North Carolina?',
    [{ text: 'Up to 10 feet away', isCorrect: false },{ text: 'No closer than 15 feet', isCorrect: true },{ text: 'Up to 20 feet away', isCorrect: false },{ text: 'Up to 25 feet away', isCorrect: false }]);

  await fixQuestion('cmn3ig2n80ah797ugjcxl4axd',
    'How far must you park from a fire hydrant in North Carolina?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmn3igknq0akp97uguq0a6sl7',
    'You are parking downtown near a fire hydrant. What is the minimum legal distance in North Carolina?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3ie5es0a9p97ug774hpx81',
    'How far must you park from a fire hydrant in North Carolina?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  // Fix: wrong supervised hours (40 or 50 → 60)
  await fixQuestion('cmn3im2st0b1d97ugga9z96hg',
    'How many total supervised driving hours are required before obtaining a limited provisional license in North Carolina?',
    [{ text: '30 hours', isCorrect: false },{ text: '40 hours', isCorrect: false },{ text: '50 hours', isCorrect: false },{ text: '60 hours', isCorrect: true }]);

  await fixQuestion('cmn3il1b60axj97ugco3lblnd',
    'How many hours of supervised driving are required before obtaining a limited provisional license in North Carolina?',
    [{ text: '30 hours', isCorrect: false },{ text: '40 hours', isCorrect: false },{ text: '50 hours', isCorrect: false },{ text: '60 hours', isCorrect: true }]);

  // Fix: wrong curfew (10 PM or 11 PM → 9 PM)
  await fixQuestion('cmn3il1fq0axp97ugrw4nonpt',
    'What is the curfew for drivers with a Level 2 limited provisional license in North Carolina?',
    [{ text: 'No driving from 10 PM to 5 AM', isCorrect: false },{ text: 'No driving from 11 PM to 5 AM', isCorrect: false },{ text: 'No unsupervised driving from 9 PM to 5 AM', isCorrect: true },{ text: 'No driving from midnight to 5 AM', isCorrect: false }]);

  console.log('\n--- STEP 2: Deleting wrong-value questions (keep best, delete rest) ---');
  // Delete extra residential speed wrong-value questions (kept best 3 above)
  await deleteQuestions([
    'cmmsdpho309mxneslowtya0pd', // "25 mph zone" wrong
    'cmmsdpgp709lrneslvtsqk4iu', // school zone speed wrong
    'cmmsdnv1r09i9neslxdrntqw9', // residential 30 mph wrong
    'cmmsdm1ic09cfneslgzacfk8n', // "25 mph zone" wrong
    'cmmsdpj1109ovneslj2dnhm96', // highway to residential wrong
  ]);
  // Delete extra interstate wrong-value questions
  await deleteQuestions([
    'cmn3ias4i0a1j97ug6yk0ngdz', // interstate 55 wrong
    'cmn3ibzbx0a3797ugh08h5vlu', // towing trailer 55/65 wrong
    'cmn3ic05t0a4797ugzy1dnk0z', // rural four-lane 55/65 wrong
    'cmn3ic0ou0a4v97ugb9gjz7fn', // large truck 55/65 wrong
    'cmn3ic1d60a5p97ug1veujc31', // school bus 55/65 wrong
    'cmn3id6fz0a6797ugw93d5tbp', // interstate snowstorm 55/65 wrong
    'cmn3id8180a8d97ugkneg9s9n', // commercial truck 55/65 wrong
    'cmn3id7690a7797ugsai6at0e', // heavy traffic interstate wrong
  ]);

  console.log('\n--- STEP 3: Deleting duplicates ---');
  await deleteQuestions([
    'cmn3i70gj09p197ugld9492h3', // dup diamond sign
    'cmn3i6zv109od97ugmtfia6io', // dup work zone color
    'cmn3i71vy09qj97ugk3ufakck', // dup slippery when wet
    'cmn3i70qv09pd97ugsjqvhg5p', // dup blue signs
    'cmn3i717s09pv97ugy4swdn36', // dup wrong way sign
    'cmn3igk650ak197uglwjpgki2', // dup 19-yr-old texting
    'cmn3i6za109np97ugbif2iwgg', // dup stop sign shape
    'cmn3i71c909q197ugz93cpp4b', // dup curved arrows sign
    'cmn3ie5j00a9v97ugv24r3faw', // dup seatbelt occupants
  ]);

  console.log('\n--- STEP 4: Adding gap questions ---');

  // GAP: speed:following (NC handbook: 2-second rule)
  await addQuestion(TOPIC.SPEED,
    'What is the recommended following distance for drivers in North Carolina?',
    'The NC Driver Handbook recommends maintaining at least a 2-second following distance behind the vehicle ahead.',
    [{ text: '1-second rule', isCorrect: false },{ text: '2-second rule', isCorrect: true },{ text: '3-second rule', isCorrect: false },{ text: '4-second rule', isCorrect: false }]);

  // GAP: speed:signal-distance (NC: 100 feet)
  await addQuestion(TOPIC.SPEED,
    'How far before a turn must you signal in North Carolina?',
    'North Carolina law requires drivers to signal at least 100 feet before turning or changing lanes.',
    [{ text: '50 feet', isCorrect: false },{ text: '75 feet', isCorrect: false },{ text: '100 feet', isCorrect: true },{ text: '200 feet', isCorrect: false }]);

  // GAP: row:bicycle (NC: entitled to full lane)
  await addQuestion(TOPIC.ROW,
    'When a bicyclist is riding in a traffic lane in North Carolina, what rights do they have?',
    'According to the NC Driver Handbook, bicyclists are entitled to use of the full lane and have the same rights as other vehicle operators.',
    [{ text: 'They must yield to all motor vehicles', isCorrect: false },{ text: 'They may only use designated bike lanes', isCorrect: false },{ text: 'They are entitled to use of the full lane', isCorrect: true },{ text: 'They must ride on the sidewalk when available', isCorrect: false }]);

  // GAP: safe:parallel-park
  await addQuestion(TOPIC.SAFE,
    'When parallel parking on a two-way street in North Carolina, which direction must your wheels be turned when facing uphill without a curb?',
    'When parking uphill without a curb, turn your wheels to the right so the vehicle rolls away from traffic if the brakes fail.',
    [{ text: 'Straight ahead', isCorrect: false },{ text: 'To the left, toward traffic', isCorrect: false },{ text: 'To the right, away from traffic', isCorrect: true },{ text: 'It does not matter', isCorrect: false }]);

  // GAP: safe:bike-passing (NC: 2 feet minimum per GS 20-149)
  await addQuestion(TOPIC.SAFE,
    'When passing a bicyclist on a North Carolina road, what is the minimum required clearance?',
    'North Carolina law (GS 20-149) requires at least 2 feet of clearance when passing a bicyclist. The NC Driver Handbook also notes bicyclists are entitled to the full lane.',
    [{ text: '1 foot', isCorrect: false },{ text: '2 feet', isCorrect: true },{ text: '3 feet', isCorrect: false },{ text: '4 feet', isCorrect: false }]);

  // GAP: alcohol:open-container
  await addQuestion(TOPIC.ALCOHOL,
    'Is it legal to have an open container of alcohol in the passenger area of a vehicle in North Carolina?',
    'It is illegal to have an open container of alcohol in the passenger area of a motor vehicle on a public road in North Carolina.',
    [{ text: 'Yes, if the driver is not drinking', isCorrect: false },{ text: 'Yes, if all passengers are 21 or older', isCorrect: false },{ text: 'No — open containers are prohibited in the passenger area', isCorrect: true },{ text: 'Only prohibited on interstates', isCorrect: false }]);

  // GAP: license:level3
  await addQuestion(TOPIC.LICENSE,
    'What restrictions are lifted when a North Carolina teen receives a Level 3 Full Provisional License?',
    'A Level 3 Full Provisional License removes the curfew, supervision, and passenger restrictions from Levels 1 and 2, but under-18 holders still cannot use a cell phone while driving.',
    [{ text: 'All restrictions including the cell phone ban are lifted', isCorrect: false },{ text: 'Curfew, supervision, and passenger limits are lifted, but cell phone ban remains for those under 18', isCorrect: true },{ text: 'Only the curfew is lifted', isCorrect: false },{ text: 'All restrictions are lifted including the alcohol prohibition', isCorrect: false }]);

  // GAP: license:new-resident (NC: 60 days)
  await addQuestion(TOPIC.LICENSE,
    'How soon must a new North Carolina resident obtain a NC driver license?',
    'A new resident has 60 days after establishing residence in North Carolina to obtain a North Carolina driver license or learner permit.',
    [{ text: '30 days', isCorrect: false },{ text: '60 days', isCorrect: true },{ text: '90 days', isCorrect: false },{ text: '6 months', isCorrect: false }]);

  // GAP: license:provisional-alcohol (under-18 zero tolerance)
  await addQuestion(TOPIC.LICENSE,
    'What happens to a provisional licensee in North Carolina who drives after consuming any amount of alcohol?',
    'It is unlawful for a provisional licensee (under 18) to drive after or while consuming any amount of alcohol. A conviction results in a one-year license revocation.',
    [{ text: 'A fine of $100 with no license penalty', isCorrect: false },{ text: 'A 30-day suspension', isCorrect: false },{ text: 'A one-year license revocation', isCorrect: true },{ text: 'Mandatory community service', isCorrect: false }]);

  await addQuestion(TOPIC.LICENSE,
    'In North Carolina, what is the alcohol policy for drivers under 18?',
    'NC has zero tolerance for provisional licensees. Driving after consuming any amount of alcohol or drugs results in a one-year revocation.',
    [{ text: 'BAC must be below .02%', isCorrect: false },{ text: 'BAC must be below .04%', isCorrect: false },{ text: 'Zero tolerance — any alcohol consumption results in a one-year revocation', isCorrect: true },{ text: 'The same .08% limit as adults', isCorrect: false }]);

  // GAP: signs:green-arrow
  await addQuestion(TOPIC.SIGNS,
    'What does a green arrow traffic signal mean in North Carolina?',
    'A green arrow indicates a protected turn — you may proceed in the direction of the arrow without conflicting traffic.',
    [{ text: 'Yield to oncoming traffic before turning', isCorrect: false },{ text: 'You have a protected turn — proceed in the arrow direction', isCorrect: true },{ text: 'Come to a complete stop then turn', isCorrect: false },{ text: 'Oncoming traffic also has green — wait for a gap', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== FIX COMPLETE ===`);
  console.log(`Final count: ${finalCount} (target 320–360)`);
  if (finalCount > 360) console.log(`Run nc_trim.js to trim ~${finalCount - 340} more`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
