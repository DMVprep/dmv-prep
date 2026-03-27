const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntn2w00093jd62fafhen2';
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
  console.log('=== GA QA FIX ===\n');
  console.log('--- STEP 1: Fixing factual errors ---');

  // Fix: wrong fire hydrant (10 or 20 → 15 feet)
  await fixQuestion('cmmschk2605n1neslxyopz4i0',
    'What does a fire hydrant parking restriction sign prohibit in Georgia?',
    [{ text: 'Parking within 10 feet', isCorrect: false },{ text: 'Parking within 15 feet', isCorrect: true },{ text: 'Parking within 20 feet', isCorrect: false },{ text: 'Parking within 25 feet', isCorrect: false }]);

  await fixQuestion('cmmscfzsd05dpneslsk9f9soi',
    'How far from a fire hydrant must you park your vehicle in Georgia?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmmsceh6k057vnesl9evytivu',
    'How far must you park from a fire hydrant in Georgia?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmn3hxqti08sv97ug5e2jfbww',
    'What is the minimum distance you must park from a fire hydrant in Georgia?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3hwspi08pp97ugd0f4ahcr',
    'How far must you park from a fire hydrant in Georgia?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmn3hyujg08yp97ugk42bprs7',
    'You are parallel parking on a city street near a fire hydrant. What is the closest you can legally park?',
    [{ text: '10 feet away', isCorrect: false },{ text: '15 feet away', isCorrect: true },{ text: '20 feet away', isCorrect: false },{ text: '25 feet away', isCorrect: false }]);

  await fixQuestion('cmn3hysr508wd97uga4l7y07l',
    'In Georgia, within how many feet of a fire hydrant is parking prohibited?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  // Fix: wrong residential speed (25 → 30 mph) — keep best 2, delete rest
  await fixQuestion('cmmschh1c05idneslchdq7eqa',
    'What is the speed limit in residential areas in Georgia unless otherwise posted?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: true },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmmscfz3f05cjneslrfsobjru',
    'What is the speed limit in a residential area when no other signs are posted in Georgia?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: true },{ text: '35 mph', isCorrect: false },{ text: '40 mph', isCorrect: false }]);

  await fixQuestion('cmmscegf4056pneslx73ljdya',
    'What is the maximum speed limit in residential areas in Georgia unless otherwise posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: true },{ text: '35 mph', isCorrect: false },{ text: '45 mph', isCorrect: false }]);

  // Fix: wrong adult BAC (.10 → .08)
  await fixQuestion('cmmscg16705g1neslpn6tfr7k',
    'What is the legal blood alcohol concentration limit for adults in Georgia?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.12%', isCorrect: false }]);

  await fixQuestion('cmmscmd5q0645neslbczjreyv',
    'What BAC level is the legal limit for adult drivers in Georgia?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmmscq8qj06ftneslpqyhy3vc',
    'For adult drivers 21 and over, what is the legal blood alcohol content limit in Georgia?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.12%', isCorrect: false }]);

  await fixQuestion('cmmsco00m06b5nesluud12uto',
    'For adults, what is the legal BAC limit while driving in Georgia?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmn3hzrw9091797ugr5rz51sm',
    'What is the standard BAC limit for adult drivers (21 and over) in Georgia?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmn3i0uuu092v97ugb21ndaaw',
    'In Georgia, what BAC level triggers automatic license suspension upon DUI arrest?',
    [{ text: '.05%', isCorrect: false },{ text: '.08% or higher', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  // Fix: wrong under-21 BAC (.00 or zero tolerance → .02)
  await fixQuestion('cmmscg1et05gfnesld3wtreta',
    'For drivers under 21, what is the legal blood alcohol concentration limit in Georgia?',
    [{ text: '.00% (any amount)', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmmscejbq05bdneslu3izibkc',
    'What is the legal BAC limit for drivers under 21 in Georgia?',
    [{ text: '.00% (any amount)', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmn3hzqhp08zj97ugtjznwh4b',
    'What is the BAC limit for drivers under 21 years old in Georgia?',
    [{ text: '.00%', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  // Fix: "zero tolerance" question — GA under-21 is .02, not true zero
  await fixQuestion('cmn3hzspc092797ug4cbtexe3',
    'In Georgia, what BAC level makes it illegal for a driver under 21 to operate a vehicle?',
    [{ text: '.00% — any trace of alcohol', isCorrect: false },{ text: '.02% or higher', isCorrect: true },{ text: '.04% or higher', isCorrect: false },{ text: '.08% or higher', isCorrect: false }]);

  // Fix: wrong knowledge test count (35 → 40)
  await fixQuestion('cmmscejki05brnesl7blkpw89',
    'How many questions are on the Georgia knowledge test?',
    [{ text: '20 questions', isCorrect: false },{ text: '30 questions', isCorrect: false },{ text: '40 questions', isCorrect: true },{ text: '50 questions', isCorrect: false }]);

  await fixQuestion('cmmscmdmq064xneslnwegy631',
    'How many questions are on the Georgia knowledge test and what percentage must you answer correctly?',
    [{ text: '20 questions, 75% to pass', isCorrect: false },{ text: '35 questions, 70% to pass', isCorrect: false },{ text: '40 questions, 75% to pass', isCorrect: true },{ text: '50 questions, 80% to pass', isCorrect: false }]);

  // Fix: wrong permit hold (6 or 9 months → 12 months + 1 day)
  await fixQuestion('cmn3i3mxu09c797ugoimvbvhi',
    'How long must you hold a Class C Instructional Permit before applying for a Class D license in Georgia?',
    [{ text: '6 months', isCorrect: false },{ text: '9 months', isCorrect: false },{ text: '12 months and 1 day', isCorrect: true },{ text: '18 months', isCorrect: false }]);

  await fixQuestion('cmn3i57i909j797ug7bdre364',
    'What is the minimum time a Georgia learner must hold an Instructional Permit before qualifying for a Class D license?',
    [{ text: '6 months', isCorrect: false },{ text: '9 months', isCorrect: false },{ text: '12 months and 1 day', isCorrect: true },{ text: '18 months', isCorrect: false }]);

  // Fix: wrong supervised hours (50 → 40)
  await fixQuestion('cmn3i3n3509cd97ugjj3xjl64',
    'How many total hours of supervised driving are required before a Georgia learner can apply for a Class D license?',
    [{ text: '20 hours', isCorrect: false },{ text: '30 hours', isCorrect: false },{ text: '40 hours', isCorrect: true },{ text: '50 hours', isCorrect: false }]);

  await fixQuestion('cmn3i587a09k197ugt16bnzt6',
    'How many total hours of supervised driving practice must be completed for a Georgia Class D license?',
    [{ text: '20 hours', isCorrect: false },{ text: '40 hours', isCorrect: true },{ text: '50 hours', isCorrect: false },{ text: '65 hours', isCorrect: false }]);

  // Fix: wrong night hours (10 → 6)
  await fixQuestion('cmn3i3n8o09cj97ug42i0mois',
    'Of the required supervised driving hours in Georgia, how many must be completed at night?',
    [{ text: '2 hours', isCorrect: false },{ text: '4 hours', isCorrect: false },{ text: '6 hours', isCorrect: true },{ text: '10 hours', isCorrect: false }]);

  await fixQuestion('cmn3i57mq09jd97ugendoajq8',
    'During nighttime supervised driving practice in Georgia, how many hours must learner\'s permit holders complete?',
    [{ text: '2 hours', isCorrect: false },{ text: '4 hours', isCorrect: false },{ text: '6 hours', isCorrect: true },{ text: '10 hours', isCorrect: false }]);

  // Fix: wrong curfew (11 PM → midnight)
  await fixQuestion('cmn3i3nyz09dd97ug8owegfjj',
    'What are the curfew hours for Class D license holders in Georgia?',
    [{ text: 'No driving from 10 PM to 6 AM', isCorrect: false },{ text: 'No driving from 11 PM to 5 AM', isCorrect: false },{ text: 'No driving from midnight to 5 AM — no exceptions', isCorrect: true },{ text: 'No driving from 1 AM to 5 AM', isCorrect: false }]);

  // Fix: wrong following distance (3-second → 2-second)
  await fixQuestion('cmn3hwv2808sd97ugpgl3bbag',
    'How should you adjust your following distance when driving behind a large truck in Georgia?',
    [{ text: 'Use the same 2-second rule as for other vehicles', isCorrect: false },{ text: 'Increase your following distance beyond the standard 2-second rule', isCorrect: true },{ text: 'Maintain a 3-second following distance specifically for trucks', isCorrect: false },{ text: 'Stay within 1 car length to maintain visibility', isCorrect: false }]);

  await fixQuestion('cmn3hwtbp08qj97ugfdwqq0mc',
    'When should you increase your following distance beyond the standard 2-second rule?',
    [{ text: 'Only when following large trucks', isCorrect: false },{ text: 'Only on rural highways', isCorrect: false },{ text: 'In inclement weather, heavy traffic, at night, or behind large vehicles', isCorrect: true },{ text: 'Only when the road is wet', isCorrect: false }]);

  // Delete school zone questions that assert wrong fixed speed (25 mph)
  // GA school zones don't have a statewide fixed speed — keep only questions that say "posted speed" or match what's posted
  console.log('\n--- STEP 2: Deleting duplicates ---');
  await deleteQuestions([
    'cmn3ha20o085v97ug195ttpwl',  // dup pentagon sign
    'cmn3haew6087797ugd3pjfglv',  // dup work zone color
    'cmn3haeme086v97ugv9lyg5rx',  // dup highway guide sign color
    'cmn3haehb086p97ugk84tnmlg',  // dup curved arrow sign
    'cmn3haead086j97ugt0xrh16o',  // dup red octagon
    'cmn3ha0yf084j97ug4jhzc0b5',  // dup blue signs
    'cmn3hagnn087j97ugrq61byua',  // dup SR sign (keep one)
    'cmn3ha0u1084d97ug1j3nnsvo',  // dup SR sign (keep one)
    'cmn3haew6087797ugd3pjfglv',  // dup work zone color
    'cmn3hyusf08z197ug7f4rnz0n',  // dup large truck following distance
    'cmmsd58q807qhneslmhjxt6m0',  // dup railroad parking distance
  ]);

  console.log('\n--- Deleting redundant wrong-value questions ---');
  await deleteQuestions([
    // Extra residential 25 mph questions (we fixed 3 canonical ones above)
    'cmmscruc006m1nesl74iwsugs',
    'cmmscthwu06rhneslvtuwf6wq',
    'cmmsctimd06snnesl5lo9lc03',
    'cmmscvfsq06xbnesl3jdl314r',
    'cmmscx5r406z9neslrsx4n9el',
    'cmn3hu6ok08gp97uggo8zpiip',
    'cmn3hu8sp08jd97ug3zq8860b',
    'cmn3hv6i208mp97ug517vauwn',
    'cmn3hv6vg08n797ugrcpr0t6k',
    'cmn3hvtpf08nj97ug9rh16mb9',
    'cmn3hvu6s08o797ugzq8dcj0l',
    'cmn3hvuy208p797uggzxn4it9',
    // Interstate wrong speed
    'cmn3hvv2a08pd97ug53fwnpq1',
    // School zone asserting fixed 25 mph speed (GA has no statewide fixed school zone speed)
    'cmmscrtgt06kvnesloo2ukmxd',
    'cmmscthwu06rhneslvtuwf6wq',
    'cmmscvdz606ulneslhymmitok',
    'cmmscvfa006wjneslk3sua647',
    'cmmscx6gz070fnesl0gz12c00',
    'cmmscx8ia073jnesldmy7cmmh',
    'cmn3hv5co08ld97ugdqhbv3lh',
    'cmn3hu93g08jp97uglw8ok4te',
    'cmmschhin05j5neslk54dithf',
    'cmmscegnz0573nesl4r87ye2y',
  ]);

  console.log('\n--- STEP 3: Adding gap questions ---');

  // GAP: speed:signal-distance (GA manual: turn signal before turns — 100 ft standard)
  await addQuestion(TOPIC.SPEED,
    'In Georgia, how far before a turn must you activate your turn signal?',
    'You must give a continuous turn signal for at least 100 feet before turning.',
    [{ text: 'At least 50 feet', isCorrect: false },{ text: 'At least 100 feet', isCorrect: true },{ text: 'At least 150 feet', isCorrect: false },{ text: 'At least 200 feet', isCorrect: false }]);

  // GAP: speed:super-speeder
  await addQuestion(TOPIC.SPEED,
    'What is Georgia\'s Super Speeder law?',
    'Any driver convicted of speeding 75 mph or more on a two-lane road, or 85 mph or more on any road, is assessed an additional $200 state fee.',
    [{ text: 'Any speeding over 20 mph above the limit', isCorrect: false },{ text: 'Speeding 75+ mph on a two-lane road or 85+ mph on any road', isCorrect: true },{ text: 'Any speed over 70 mph on any road', isCorrect: false },{ text: 'Speeding in a school zone or construction zone', isCorrect: false }]);

  await addQuestion(TOPIC.SPEED,
    'A driver is convicted of going 87 mph on an interstate in Georgia. What additional penalty applies beyond the local fine?',
    'Driving 85 mph or more on any road triggers Georgia\'s Super Speeder law, which adds a $200 state fee. Failure to pay results in license suspension.',
    [{ text: 'No additional state penalty — only local fines apply', isCorrect: false },{ text: 'A $200 Super Speeder state fee is added to the local fine', isCorrect: true },{ text: 'An automatic 30-day license suspension', isCorrect: false },{ text: 'Mandatory attendance at a defensive driving course', isCorrect: false }]);

  // GAP: row:bicycle
  await addQuestion(TOPIC.ROW,
    'When a bicyclist is riding in a traffic lane in Georgia, what right do they have?',
    'Bicyclists (including those on electric bikes) have the same rights and responsibilities as other vehicle drivers on Georgia roads.',
    [{ text: 'They must yield to all motor vehicles', isCorrect: false },{ text: 'They have the same rights as other vehicle drivers', isCorrect: true },{ text: 'They may only use bike lanes', isCorrect: false },{ text: 'They must ride on the sidewalk when available', isCorrect: false }]);

  // GAP: row:motorcycle
  await addQuestion(TOPIC.ROW,
    'Can a motorist share a traffic lane alongside a motorcycle in Georgia?',
    'Motorcyclists are entitled to the full use of a traffic lane. Drivers must not share the lane with a motorcyclist.',
    [{ text: 'Yes, if the lane is wide enough', isCorrect: false },{ text: 'Yes, but only on multi-lane highways', isCorrect: false },{ text: 'No — motorcyclists are entitled to the full width of the lane', isCorrect: true },{ text: 'Yes, if the motorcyclist consents', isCorrect: false }]);

  // GAP: safe:park-crosswalk (GA: 20 feet from crosswalk at intersection)
  await addQuestion(TOPIC.SAFE,
    'In Georgia, how close may you park to a crosswalk at an intersection?',
    'Parking is prohibited within 20 feet of a crosswalk at an intersection.',
    [{ text: 'Within 10 feet', isCorrect: false },{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet — parking prohibited within 20 feet', isCorrect: true },{ text: 'Within 30 feet', isCorrect: false }]);

  // GAP: safe:park-stop-sign (GA: 30 feet from stop sign, yield sign, or traffic signal)
  await addQuestion(TOPIC.SAFE,
    'How close may you park to a stop sign, yield sign, or traffic control signal in Georgia?',
    'Parking is prohibited within 30 feet of any flashing signal, stop sign, yield sign, or traffic-control signal.',
    [{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet', isCorrect: false },{ text: 'Within 30 feet — parking prohibited within 30 feet', isCorrect: true },{ text: 'Within 50 feet', isCorrect: false }]);

  // GAP: safe:skid
  await addQuestion(TOPIC.SAFE,
    'What is the correct procedure when your vehicle begins to skid in Georgia?',
    'When skidding, steer in the direction you want the front of the vehicle to go. Avoid slamming the brakes.',
    [{ text: 'Brake firmly and steer toward the shoulder', isCorrect: false },{ text: 'Steer in the direction the rear is sliding and avoid sudden braking', isCorrect: true },{ text: 'Turn the wheel hard in the opposite direction of the skid', isCorrect: false },{ text: 'Accelerate to regain traction', isCorrect: false }]);

  // GAP: safe:bike-passing (GA: 3 feet clearance when passing bicyclist)
  await addQuestion(TOPIC.SAFE,
    'When passing a bicyclist on any road in Georgia, what minimum clearance must you maintain?',
    'Georgia law requires at least 3 feet of clearance when passing a bicyclist.',
    [{ text: '1 foot', isCorrect: false },{ text: '2 feet', isCorrect: false },{ text: '3 feet', isCorrect: true },{ text: '4 feet', isCorrect: false }]);

  // GAP: license:new-resident (GA: 30 days)
  await addQuestion(TOPIC.LICENSE,
    'How soon must a new Georgia resident obtain a Georgia driver\'s license?',
    'Georgia law requires any person wanting to operate a motor vehicle in Georgia to obtain a Georgia license or permit within 30 days of becoming a resident.',
    [{ text: 'Within 10 days', isCorrect: false },{ text: 'Within 30 days', isCorrect: true },{ text: 'Within 60 days', isCorrect: false },{ text: 'Within 90 days', isCorrect: false }]);

  // GAP: license:joshua-law
  await addQuestion(TOPIC.LICENSE,
    'What does Joshua\'s Law require for 16-year-olds seeking a Class D Provisional License in Georgia?',
    'Joshua\'s Law requires completion of a DDS-approved driver education course (30 hours classroom or online, plus 6 hours behind-the-wheel) before a 16-year-old can obtain a Class D license.',
    [{ text: 'Only 40 hours of supervised driving — no classroom requirement', isCorrect: false },{ text: 'Completion of a DDS-approved 30-hour driver education course plus behind-the-wheel training', isCorrect: true },{ text: 'Passing an additional road safety exam at the DDS office', isCorrect: false },{ text: 'A minimum of one year of riding as a passenger with a licensed adult', isCorrect: false }]);

  await addQuestion(TOPIC.LICENSE,
    'Under Joshua\'s Law in Georgia, what is the classroom instruction requirement for teen driver education?',
    'Joshua\'s Law requires at least 30 hours of classroom instruction (or equivalent online course) as part of the approved driver education program for 16-year-olds.',
    [{ text: '10 hours of classroom instruction', isCorrect: false },{ text: '20 hours of classroom instruction', isCorrect: false },{ text: '30 hours of classroom instruction or equivalent online course', isCorrect: true },{ text: '40 hours of classroom instruction', isCorrect: false }]);

  // GAP: license:super-speeder (GA-specific — affects license)
  await addQuestion(TOPIC.LICENSE,
    'What happens if a Georgia driver fails to pay the Super Speeder fee after conviction?',
    'Failure to pay the $200 Super Speeder state fee on time results in a license suspension and an additional $50 reinstatement fee.',
    [{ text: 'A warning is issued and the fee is doubled', isCorrect: false },{ text: 'License suspension and an additional $50 reinstatement fee', isCorrect: true },{ text: 'The driver must complete a defensive driving course', isCorrect: false },{ text: 'The fee is sent to collections with no license impact', isCorrect: false }]);

  // GAP: signs:green-arrow
  await addQuestion(TOPIC.SIGNS,
    'What does a green arrow signal mean at an intersection in Georgia?',
    'A green arrow indicates a protected turn — you may proceed in the direction of the arrow without conflicting traffic.',
    [{ text: 'You may proceed but must yield to pedestrians', isCorrect: false },{ text: 'You have a protected turn — proceed in the direction of the arrow', isCorrect: true },{ text: 'Oncoming traffic also has a green — wait for a gap', isCorrect: false },{ text: 'You must turn; going straight is not permitted', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS,
    'A green arrow appears alongside a red traffic light at a Georgia intersection. What does this mean?',
    'A green arrow with a red light is a protected movement — you may turn in the direction of the arrow without yielding to oncoming traffic.',
    [{ text: 'The red light takes priority — stop and wait', isCorrect: false },{ text: 'You may turn in the direction of the arrow; it is a protected movement', isCorrect: true },{ text: 'Treat it as a four-way stop', isCorrect: false },{ text: 'Proceed only if no pedestrians are present', isCorrect: false }]);

  // GAP: signs:flashing
  await addQuestion(TOPIC.SIGNS,
    'What must a driver do when approaching a flashing red signal in Georgia?',
    'A flashing red signal must be treated the same as a stop sign — come to a complete stop, then proceed when safe.',
    [{ text: 'Slow down and proceed if clear — treat like a yield sign', isCorrect: false },{ text: 'Come to a complete stop, then proceed when safe — treat like a stop sign', isCorrect: true },{ text: 'Proceed without stopping if no vehicles are present', isCorrect: false },{ text: 'Stop and wait for the signal to turn green', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS,
    'What does a flashing yellow traffic signal indicate in Georgia?',
    'A flashing yellow signal means slow down and proceed with caution.',
    [{ text: 'Stop completely before proceeding', isCorrect: false },{ text: 'The intersection is closed', isCorrect: false },{ text: 'Slow down and proceed with caution', isCorrect: true },{ text: 'Yield to all oncoming traffic', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== FIX COMPLETE ===`);
  console.log(`Final count: ${finalCount} (target 320-360)`);
  if (finalCount > 360) console.log(`Run ga_trim.js to trim ~${finalCount - 340} more`);
  else console.log(`Within target — run ga_trim.js then deploy`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
