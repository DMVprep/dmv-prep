const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntnlf000c3jd6e2gf6ygd';
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
  console.log('=== IL QA FIX ===\n');
  console.log('--- STEP 1: Fixing factual errors ---');

  await fixQuestion('cmms1ua3s07xrf74yyrqmy06o',
    'What is the maximum speed limit on Illinois interstates and tollways?',
    [{ text: '55 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true },{ text: '75 mph', isCorrect: false }]);

  await fixQuestion('cmms2eg5x09n7f74yfkx5lcb5',
    'You are driving on an interstate highway in Illinois. What is the maximum legal speed?',
    [{ text: '55 mph', isCorrect: false },{ text: '60 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true }]);

  await fixQuestion('cmms1sdpk07rxf74ywg8hka10',
    'What is the speed limit on 4-lane highways in Illinois?',
    [{ text: '55 mph', isCorrect: false },{ text: '60 mph', isCorrect: false },{ text: '65 mph', isCorrect: true },{ text: '70 mph', isCorrect: false }]);

  await fixQuestion('cmn3gdfg8056p97ug7pdl3fwh',
    'What is the speed limit in city and town areas of Illinois unless otherwise posted?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: true },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmn3gej5805c197ugo0nfr25g',
    'What speed limit applies in Illinois urban and suburban areas unless otherwise posted?',
    [{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: true },{ text: '35 mph', isCorrect: false },{ text: '45 mph', isCorrect: false }]);

  await fixQuestion('cmms1u9m607wzf74ynjp6nohi',
    'What is the speed limit in school zones during school hours when children are present?',
    [{ text: '10 mph', isCorrect: false },{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false }]);

  await fixQuestion('cmms1sd0q07qrf74ykkbn5y8w',
    'When you see a school zone sign, what is the maximum speed allowed during school days when children are present?',
    [{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false }]);

  await fixQuestion('cmn3gdgyj058d97ugh2tshrf3',
    'What is the school zone speed limit in Illinois?',
    [{ text: '10 mph', isCorrect: false },{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false }]);

  await fixQuestion('cmms1u9vi07xdf74yrh989x10',
    'How far must you park from a fire hydrant in Illinois?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3gh79505ij97ug3be5bkze',
    'What is the minimum distance you must park from a fire hydrant in Illinois?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmms1u94n07w7f74y0otw4n9y',
    'What is the required following distance behind another vehicle in normal driving conditions in Illinois?',
    [{ text: 'One-second rule', isCorrect: false },{ text: 'Two-second rule', isCorrect: false },{ text: 'Three-second rule', isCorrect: true },{ text: 'Four-second rule', isCorrect: false }]);

  await fixQuestion('cmms1w4zy086bf74yma0hn1m4',
    'What is the recommended following distance behind another vehicle in Illinois?',
    [{ text: 'Two-second rule', isCorrect: false },{ text: 'Three-second rule', isCorrect: true },{ text: 'Four-second rule', isCorrect: false },{ text: 'Five-second rule', isCorrect: false }]);

  await fixQuestion('cmms1zsto08fnf74ysvd9hxul',
    'What is the minimum following distance recommended in Illinois?',
    [{ text: 'Two-second rule', isCorrect: false },{ text: 'Three-second rule', isCorrect: true },{ text: 'Four-second rule', isCorrect: false },{ text: 'Six-second rule', isCorrect: false }]);

  await fixQuestion('cmms25z8g08wrf74y2lrqewq5',
    'When following another vehicle, what following distance rule should Illinois drivers use?',
    [{ text: 'Two-second rule', isCorrect: false },{ text: 'Three-second rule', isCorrect: true },{ text: 'Four-second rule', isCorrect: false },{ text: 'Five-second rule', isCorrect: false }]);

  await fixQuestion('cmms1y2k408dbf74yohf5bozo',
    'What is the legal BAC limit for adult drivers in Illinois?',
    [{ text: '.04%', isCorrect: false },{ text: '.06%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false }]);

  await fixQuestion('cmms1zurs08idf74y412pv2v4',
    'What is the BAC limit for adult drivers in Illinois?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmms2ijpy09y3f74yj5m6olz7',
    'What is the BAC limit for adult drivers (21 and over) in Illinois?',
    [{ text: '.06%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.12%', isCorrect: false }]);

  await fixQuestion('cmn3glezi05vv97ug3rmvnzft',
    'What is the standard BAC limit for adult drivers (21+) in Illinois?',
    [{ text: '.06%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.16%', isCorrect: false }]);

  await fixQuestion('cmn3gle7r05uv97uggdgui2ec',
    'Which of the following constitutes Aggravated DUI in Illinois?',
    [{ text: 'A BAC of .06% or more', isCorrect: false },{ text: 'A BAC of .08% or more for a first offense', isCorrect: false },{ text: 'A DUI with a BAC of .16% or more, triggering enhanced mandatory penalties', isCorrect: true },{ text: 'Any DUI on a controlled-access highway', isCorrect: false }]);

  await fixQuestion('cmn3gldya05uj97ugoffzoqdx',
    'How long is the statutory summary suspension for refusing a chemical test in Illinois?',
    [{ text: '3 months', isCorrect: false },{ text: '6 months', isCorrect: false },{ text: '1 year', isCorrect: true },{ text: '2 years', isCorrect: false }]);

  await fixQuestion('cmn3gmj3h05x797ug5c1wx5lh',
    'If you refuse a chemical test after being arrested for DUI in Illinois, what is the suspension period?',
    [{ text: '45 days', isCorrect: false },{ text: '6 months', isCorrect: false },{ text: '1 year', isCorrect: true },{ text: '18 months', isCorrect: false }]);

  await fixQuestion('cmms2ii1a09vrf74yr8du1j9u',
    'What is the teen driver nighttime driving restriction on Friday and Saturday nights in Illinois?',
    [{ text: 'No driving after 10 PM', isCorrect: false },{ text: 'No driving after 11 PM', isCorrect: true },{ text: 'No driving after midnight', isCorrect: false },{ text: 'No driving after 1 AM', isCorrect: false }]);

  await fixQuestion('cmms2knbq0a1zf74y26xxo7uu',
    'What is the nighttime driving restriction for teen drivers on Friday nights in Illinois?',
    [{ text: 'No driving after 10 PM', isCorrect: false },{ text: 'No driving after 11 PM', isCorrect: true },{ text: 'No driving after midnight', isCorrect: false },{ text: 'No restriction on Fridays', isCorrect: false }]);

  await fixQuestion('cmn3gpb19066j97ugu8mc71dc',
    'How long must you hold an instruction permit before applying for a graduated license in Illinois?',
    [{ text: '3 months', isCorrect: false },{ text: '6 months', isCorrect: false },{ text: '9 months', isCorrect: true },{ text: '12 months', isCorrect: false }]);

  await fixQuestion('cmn3gqfc606bj97ugp9c729p9',
    'What must a new Illinois resident with a valid out-of-state license do?',
    [{ text: 'Obtain an Illinois license within 30 days', isCorrect: false },{ text: 'Obtain an Illinois license within 60 days', isCorrect: false },{ text: 'Obtain an Illinois license within 90 days or before expiration, whichever comes first', isCorrect: true },{ text: 'Obtain an Illinois license within 120 days', isCorrect: false }]);

  await fixQuestion('cmn3gr4yf06dj97ugnpr6oqvz',
    'How long must an Illinois teen hold an instruction permit before being eligible for a graduated license?',
    [{ text: '3 months', isCorrect: false },{ text: '6 months', isCorrect: false },{ text: '9 months', isCorrect: true },{ text: '12 months', isCorrect: false }]);

  await fixQuestion('cmn3gqfro06c197ug5slhsdet',
    'Can you apply for a graduated license before completing all 50 hours of required supervised driving practice?',
    [{ text: 'Yes, after 40 hours if all other requirements are met', isCorrect: false },{ text: 'Yes, after 25 hours with an instructor\'s approval', isCorrect: false },{ text: 'No, all 50 hours including 10 at night must be completed', isCorrect: true },{ text: 'Yes, after 30 hours if you pass a skills test', isCorrect: false }]);

  await fixQuestion('cmn3gpb5x066p97ug0583xt33',
    'How many hours of supervised driving practice are required before obtaining a graduated license in Illinois?',
    [{ text: '20 hours', isCorrect: false },{ text: '40 hours', isCorrect: false },{ text: '50 hours (including 10 at night)', isCorrect: true },{ text: '65 hours', isCorrect: false }]);

  console.log('\n--- STEP 2: Deleting duplicates ---');
  await deleteQuestions([
    'cmn3gauzu051v97ugi9r2y62r',
    'cmn3g91lg04uv97ug2detahx9',
    'cmn3g8gal04s197ugqw1b1vq1',
    'cmn3goess064d97ughg7wik12',
    'cmn3g8etp04q797ughhg3ecfx',
    'cmn3g903l04tv97ugn49ynk5g',
    'cmms2ik9a09yvf74y5qycr69g',
  ]);

  console.log('\n--- Deleting redundant error questions ---');
  await deleteQuestions([
    'cmms2cdj709d3f74ysltv9m1d','cmms2cguy09glf74yn14uj4lf','cmn3gdezh056797ug735sx3f3',
    'cmn3gdg09057d97ug8azd533o','cmn3geh2f059j97ugleqqo7at','cmn3gei3d05ap97ugfc55golp',
    'cmn3ggaou05gd97ugajcc5mlf','cmn3ggb7f05h197ugeo6vypye',
    'cmms2a4d80997f74y9vl22srk','cmn3gdh35058j97ug1ngr7dji','cmn3gfqlg05dj97ug7b7gox4o','cmn3gfrl305ep97ugxysvq75s',
    'cmn3gdfvq057797ugnh45gs4p','cmn3gdhdq058v97ughnzep0mx','cmn3gej9r05c797ug4biel1uu','cmn3gfq1u05cv97ugfyym8sg6',
    'cmn3geh7p059p97ug2fxfv3kz','cmn3gehyn05aj97ugfdj6rm2o','cmn3geihn05b797ugii5s1tpo','cmn3gej0a05bv97ugpwvsbdd2','cmn3gfpqo05cj97ug0wcq471k',
    'cmms1sdyz07sbf74yex24n51y','cmms1w3zx084rf74y8t46963n','cmn3gh8xj05k797ugjr43u8eq','cmn3gjkcj05o197ugzo562398','cmn3gkhud05td97ugw4sdzup2',
    'cmn3gibpm05ld97ugab4y46z6','cmn3gpawt066d97ugwcai59r5',
  ]);

  console.log('\n--- STEP 3: Adding gap questions ---');

  await addQuestion(TOPIC.SPEED, 'In a business or residential district in Illinois, how far in advance must you signal before turning?',
    'In a business or residential district, you must give a continuous turn signal for at least 100 feet before turning.',
    [{ text: 'At least 50 feet', isCorrect: false },{ text: 'At least 100 feet', isCorrect: true },{ text: 'At least 150 feet', isCorrect: false },{ text: 'At least 200 feet', isCorrect: false }]);

  await addQuestion(TOPIC.SPEED, 'On a rural highway in Illinois (outside business or residential areas), how far ahead must you signal before turning?',
    'Outside business or residential areas, the turn signal must be given at least 200 feet before turning.',
    [{ text: 'At least 50 feet', isCorrect: false },{ text: 'At least 100 feet', isCorrect: false },{ text: 'At least 200 feet', isCorrect: true },{ text: 'At least 300 feet', isCorrect: false }]);

  await addQuestion(TOPIC.ROW, 'When a bicyclist is riding in a traffic lane in Illinois, what right do they have?',
    'Bicyclists have the same rights as other roadway users and are entitled to use the full width of the traffic lane.',
    [{ text: 'They must stay on the shoulder and yield to all vehicles', isCorrect: false },{ text: 'They are entitled to use the full width of the traffic lane', isCorrect: true },{ text: 'They may only use bike lanes, never travel lanes', isCorrect: false },{ text: 'They must ride two abreast to increase visibility', isCorrect: false }]);

  await addQuestion(TOPIC.ROW, 'In Illinois, who has the right of way when a motorist is turning right and a bicyclist is approaching from the right?',
    'When turning right, a motorist must let any approaching bicyclist pass through the intersection first before completing the turn.',
    [{ text: 'The motorist, because they signaled the turn', isCorrect: false },{ text: 'Whoever arrives at the intersection first', isCorrect: false },{ text: 'The bicyclist — the motorist must let the bicyclist pass first', isCorrect: true },{ text: 'The motorist may turn if the bike is more than 20 feet away', isCorrect: false }]);

  await addQuestion(TOPIC.ROW, 'When following a motorcycle in Illinois, what following distance is recommended?',
    'Allow at least three to four seconds following distance when behind a motorcycle so the motorcyclist has enough time to maneuver in an emergency.',
    [{ text: 'One to two seconds', isCorrect: false },{ text: 'At least three to four seconds', isCorrect: true },{ text: 'The same two-second rule used for all vehicles', isCorrect: false },{ text: 'Five seconds minimum', isCorrect: false }]);

  await addQuestion(TOPIC.ROW, 'Can a motorist share a traffic lane alongside a motorcycle in Illinois?',
    'Motorcyclists are entitled to the full width of a traffic lane. Drivers may not share the lane with a motorcycle.',
    [{ text: 'Yes, if the motorcycle is riding near the left edge of the lane', isCorrect: false },{ text: 'Yes, if the lane is wide enough for both vehicles', isCorrect: false },{ text: 'No — motorcyclists are entitled to the full width of the lane', isCorrect: true },{ text: 'Yes, but only on multi-lane highways', isCorrect: false }]);

  await addQuestion(TOPIC.SAFE, 'In Illinois, how close may you park to a crosswalk at an intersection or a fire station driveway?',
    'Standing or parking is prohibited within 20 feet of a fire station driveway or crosswalk at an intersection.',
    [{ text: 'Within 10 feet', isCorrect: false },{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet — parking is prohibited within 20 feet', isCorrect: true },{ text: 'Within 30 feet', isCorrect: false }]);

  await addQuestion(TOPIC.SAFE, 'How close may you park to a STOP sign, YIELD sign, or traffic control signal in Illinois?',
    'Standing or parking is prohibited within 30 feet of a STOP sign, YIELD sign, or traffic control signal.',
    [{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet', isCorrect: false },{ text: 'Within 30 feet — parking is prohibited within 30 feet', isCorrect: true },{ text: 'Within 50 feet', isCorrect: false }]);

  await addQuestion(TOPIC.SAFE, 'When passing a bicyclist on any road in Illinois, what minimum clearance must you maintain?',
    'When passing a bicyclist, keep a minimum distance of 3 feet from the edge of the vehicle\'s side mirror.',
    [{ text: '1 foot', isCorrect: false },{ text: '2 feet', isCorrect: false },{ text: '3 feet from the edge of the vehicle\'s side mirror', isCorrect: true },{ text: '4 feet', isCorrect: false }]);

  await addQuestion(TOPIC.SAFE, 'In Illinois, if there is not enough room to give a bicyclist the required passing clearance, what must you do?',
    'If there is not 3 feet of passing space, drivers must wait to pass until they can do so safely.',
    [{ text: 'Pass slowly at reduced speed with only 1 foot of clearance', isCorrect: false },{ text: 'Sound your horn and proceed carefully', isCorrect: false },{ text: 'Wait to pass until you can safely provide at least 3 feet of clearance', isCorrect: true },{ text: 'Use the opposing lane only if it is clear', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL, 'In Illinois, it is illegal to drive with a THC concentration of how much or more per milliliter of whole blood?',
    'It is illegal to drive with a THC concentration of 5 nanograms or more per milliliter of whole blood.',
    [{ text: '2 nanograms', isCorrect: false },{ text: '5 nanograms', isCorrect: true },{ text: '10 nanograms', isCorrect: false },{ text: '15 nanograms', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL, 'Under Illinois law, where must cannabis be stored if transported in a vehicle?',
    'Cannabis may only be transported in a vehicle in a sealed, odor-proof, and child-resistant container.',
    [{ text: 'In any closed container in the trunk', isCorrect: false },{ text: 'In a sealed, odor-proof, and child-resistant container', isCorrect: true },{ text: 'In a locked glove compartment', isCorrect: false },{ text: 'There are no restrictions', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL, 'In Illinois, may a passenger consume cannabis in a vehicle while it is being driven?',
    'No driver or passenger may use cannabis in a motor vehicle.',
    [{ text: 'Yes, as long as the driver is not using it', isCorrect: false },{ text: 'Yes, if the vehicle is a limousine or charter bus', isCorrect: false },{ text: 'No — no driver or passenger may use cannabis in a motor vehicle', isCorrect: true },{ text: 'Yes, if the cannabis is used for medical purposes', isCorrect: false }]);

  await addQuestion(TOPIC.LICENSE, 'Within how many days must you notify the Illinois Secretary of State of an address change?',
    'You must notify the Secretary of State of an address change within 10 days of any move.',
    [{ text: '5 days', isCorrect: false },{ text: '10 days', isCorrect: true },{ text: '15 days', isCorrect: false },{ text: '30 days', isCorrect: false }]);

  await addQuestion(TOPIC.LICENSE, 'If you move to a new address in Illinois, how quickly must you report the change to the Secretary of State?',
    'Illinois law requires you to report an address change within 10 days of moving.',
    [{ text: 'Within 10 days of the move', isCorrect: true },{ text: 'Within 30 days of the move', isCorrect: false },{ text: 'At your next license renewal', isCorrect: false },{ text: 'Within 60 days of the move', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS, 'What does a green arrow signal mean at an intersection?',
    'A green arrow indicates a protected turn — you may proceed in the direction of the arrow without conflicting traffic.',
    [{ text: 'You may proceed but must yield to all crossing pedestrians', isCorrect: false },{ text: 'You have a protected turn — proceed in the direction of the arrow', isCorrect: true },{ text: 'Oncoming traffic has a green light — wait for a gap', isCorrect: false },{ text: 'You must turn; going straight is not permitted', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS, 'A green arrow appears alongside a red traffic light. What does this mean?',
    'A green arrow alongside a red light means you may turn in the direction of the arrow; it is a protected movement with no conflicting traffic.',
    [{ text: 'The red light takes priority — stop and wait', isCorrect: false },{ text: 'You may turn in the direction of the arrow; it is a protected movement', isCorrect: true },{ text: 'The signal is malfunctioning — treat it as a four-way stop', isCorrect: false },{ text: 'Proceed only if no pedestrians are present', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS, 'What must a driver do when approaching a flashing red traffic signal?',
    'A flashing red signal must be treated the same as a stop sign — come to a complete stop, then proceed when safe.',
    [{ text: 'Slow down and proceed if clear — treat it like a yield sign', isCorrect: false },{ text: 'Come to a complete stop, then proceed when safe — treat it like a stop sign', isCorrect: true },{ text: 'Proceed without stopping if no other vehicles are present', isCorrect: false },{ text: 'Stop and wait for the signal to turn green', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS, 'What does a flashing yellow traffic signal indicate?',
    'A flashing yellow signal warns drivers to slow down and proceed with caution.',
    [{ text: 'Stop completely before proceeding', isCorrect: false },{ text: 'The intersection is closed', isCorrect: false },{ text: 'Slow down and proceed with caution', isCorrect: true },{ text: 'Yield to all oncoming traffic as if at a yield sign', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== FIX COMPLETE ===`);
  console.log(`Final count: ${finalCount} (target 320-360)`);
  if (finalCount > 360) console.log(`Run il_trim.js to trim ~${finalCount - 340} more`);
  else console.log(`Within target — run il_trim.js then deploy`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
