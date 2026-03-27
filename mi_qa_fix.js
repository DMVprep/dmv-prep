const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntpdu000l3jd65ylqhor7';
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
    await p.choice.create({ data: { id: cuid(), text: ch.text, isCorrect: ch.isCorrect, questionId: id } });
  }
  console.log(`  Fixed: ${newText.substring(0, 80)}`);
}

async function addQuestion(topicId, text, explanation, choices) {
  const qid = cuid();
  await p.question.create({ data: { id: qid, text, explanation, stateId: STATE_ID, topicId } });
  for (const ch of choices) {
    await p.choice.create({ data: { id: cuid(), text: ch.text, isCorrect: ch.isCorrect, questionId: qid } });
  }
  console.log(`  Added: ${text.substring(0, 80)}`);
}

async function main() {
  console.log('=== MI QA FIX ===\n');

  console.log('--- STEP 1: Fixing factual errors ---');

  // Fix: wrong residential speed (30 or 35 → 25 mph)
  await fixQuestion('cmmse39vj0addneslufrbtxgv',
    'What is the speed limit in residential areas in Michigan?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: true },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmmse3c8t0aghneslr1k1ej8b',
    'You are driving in a residential neighborhood in Michigan and see children playing nearby. What speed should you maintain?',
    [{ text: '20 mph or less', isCorrect: false },{ text: 'At or below 25 mph unless posted otherwise', isCorrect: true },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmmse4usv0aj7neslyodo6eho',
    'What is the maximum speed limit allowed in a residential area in Michigan unless otherwise posted?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: true },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmmseklfn0bwzneslvhheszkr',
    'You are driving through a quiet residential street in Michigan. What is the maximum legal speed?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: true },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmmsemy5h0c3zneslgaa1wz9a',
    'When driving through a residential neighborhood in Michigan during the day, what is the maximum speed?',
    [{ text: '20 mph', isCorrect: false },{ text: '25 mph', isCorrect: true },{ text: '30 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  // Fix: wrong freeway speed (55 or 65 → 70 mph)
  await fixQuestion('cmn3iscr70bkd97ugy504gq7f',
    'What is the maximum speed limit on Michigan freeways for passenger vehicles where posted?',
    [{ text: '55 mph', isCorrect: false },{ text: '60 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true }]);

  await fixQuestion('cmn3isdvm0blj97ugt3pxtb23',
    'You are driving on a Michigan freeway with no posted speed limit signs visible. What is the assumed maximum speed for a passenger vehicle?',
    [{ text: '55 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true },{ text: '75 mph', isCorrect: false }]);

  // Fix: wrong adult BAC (.10 → .08)
  await fixQuestion('cmmse6rt50atbnesl7brhrw6i',
    'What is the legal BAC limit for adult drivers in Michigan?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmmsehs190bnnneslpkwhki9u',
    'What BAC level constitutes Operating While Intoxicated (OWI) for an adult driver in Michigan?',
    [{ text: '.05%', isCorrect: false },{ text: '.08% or higher', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmmseqf9h0cdpnesl6gqfy7xo',
    'What is the BAC limit for adult drivers in Michigan?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmn3iz9dr0c7j97ug40yp83f2',
    'What is the standard BAC level that defines Operating While Intoxicated (OWI) in Michigan?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.17%', isCorrect: false }]);

  // Fix: wrong under-21 BAC (.04 → .02)
  await fixQuestion('cmmsefed00bfhneslytw4m82k',
    'What is the blood alcohol concentration (BAC) limit for drivers under 21 in Michigan?',
    [{ text: 'Zero — any amount is illegal', isCorrect: false },{ text: '.02% — Michigan\'s Zero Tolerance threshold', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  // Fix: wrong fire hydrant (10 or 20 → 15 feet)
  await fixQuestion('cmmse4yod0ao9neslu5e8thsn',
    'How close to a fire hydrant can you legally park in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet — no closer than 15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmmse3auc0aejnesl0io03w6q',
    'How far must you park from a fire hydrant in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmmse3dbd0ai1nesldalrv8x7',
    'You notice a fire hydrant while parking. What is the minimum required distance in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3ivhah0bvp97ugue3v2f1t',
    'How far must you park from a fire hydrant in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmn3ivirv0bxj97ugmm7o0a15',
    'Parking within what distance of a fire hydrant is a violation in Michigan?',
    [{ text: 'Within 10 feet', isCorrect: false },{ text: 'Within 15 feet', isCorrect: true },{ text: 'Within 20 feet', isCorrect: false },{ text: 'Within 25 feet', isCorrect: false }]);

  await fixQuestion('cmn3iwesg0byp97ugiouhzuaa',
    'What is the minimum distance you must park from a fire hydrant in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '30 feet', isCorrect: false }]);

  await fixQuestion('cmn3ixdci0c3j97ug2qwrwa2j',
    'How far from a fire hydrant must you park your vehicle in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: true },{ text: '20 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  // Fix crosswalk parking question (flagged as hydrant — actually about crosswalk = 20 feet)
  await fixQuestion('cmn3iwg950c0j97ugesq7w840',
    'What parking distance applies near crosswalks in Michigan?',
    [{ text: '10 feet', isCorrect: false },{ text: '15 feet', isCorrect: false },{ text: '20 feet — parking prohibited within 20 feet of a crosswalk', isCorrect: true },{ text: '30 feet', isCorrect: false }]);

  // Fix: wrong hydrant on Traffic Signs topic
  await fixQuestion('cmmse88vj0az5neslwrb8wswn',
    'You need to park your car. Which of these parking distances from a fire hydrant is correct in Michigan?',
    [{ text: 'No closer than 10 feet', isCorrect: false },{ text: 'No closer than 15 feet', isCorrect: true },{ text: 'No closer than 20 feet', isCorrect: false },{ text: 'No closer than 25 feet', isCorrect: false }]);

  // Fix: wrong curfew (midnight → 10 PM)
  await fixQuestion('cmmseaijj0b5dneslwngalytt',
    'During what hours are Level 2 teen drivers in Michigan prohibited from driving without supervision?',
    [{ text: '11 PM to 5 AM', isCorrect: false },{ text: 'Midnight to 5 AM', isCorrect: false },{ text: '10 PM to 5 AM', isCorrect: true },{ text: '9 PM to 6 AM', isCorrect: false }]);

  await fixQuestion('cmmsehqny0blpneslgahohx7z',
    'What are the restricted driving hours for Level 2 teen drivers in Michigan?',
    [{ text: 'No driving from 11 PM to 5 AM', isCorrect: false },{ text: 'No driving from midnight to 5 AM', isCorrect: false },{ text: 'No driving from 10 PM to 5 AM', isCorrect: true },{ text: 'No driving from 9 PM to 6 AM', isCorrect: false }]);

  await fixQuestion('cmmsefdv50bepnesl7d12d9h5',
    'A teen driver with a Level 2 license is driving at 11 PM on a weeknight. Which statement is correct?',
    [{ text: 'This is allowed since the curfew starts at midnight', isCorrect: false },{ text: 'This violates the curfew — Level 2 drivers cannot drive from 10 PM to 5 AM', isCorrect: true },{ text: 'This is allowed as long as a parent is notified', isCorrect: false },{ text: 'This is allowed if driving to or from work', isCorrect: false }]);

  await fixQuestion('cmmsesia80cjxnesl4bsdzckp',
    'At what time does the Level 2 teen driving curfew begin in Michigan?',
    [{ text: '9 PM', isCorrect: false },{ text: '10 PM', isCorrect: true },{ text: '11 PM', isCorrect: false },{ text: 'Midnight', isCorrect: false }]);

  // Fix: wrong supervised hours (40 or 60 → 50)
  await fixQuestion('cmn3j2abu0ch197ugkwmlldei',
    'How many hours of supervised driving practice are required during Michigan\'s GDL Level 1?',
    [{ text: '30 hours', isCorrect: false },{ text: '40 hours', isCorrect: false },{ text: '50 hours (including 10 at night)', isCorrect: true },{ text: '60 hours', isCorrect: false }]);

  // Fix: wrong permit age (15 or 16 → 14 years 9 months)
  await fixQuestion('cmn3j3e920cn197ugv5b4vuus',
    'At what minimum age can a Michigan teen apply for a Level 1 Learner\'s License?',
    [{ text: '14 years old', isCorrect: false },{ text: '14 years and 9 months old', isCorrect: true },{ text: '15 years old', isCorrect: false },{ text: '16 years old', isCorrect: false }]);

  console.log('\n--- STEP 2: Deleting wrong-value questions (extras) ---');
  await deleteQuestions([
    // Extra wrong freeway speed questions
    'cmn3ith2w0bnp97uglexg1puo',
    'cmn3isehd0bm797ugdx5ecfz9',
    'cmn3iuksl0bsd97ugh3totls4',
    'cmn3ium100btv97uga2leul30',
    'cmn3iumcw0bu797ugi9d9k5tr',
    'cmn3iukiu0bs197ugjb8libo6',
    'cmn3iujmz0br197ugispqbrmz',
    'cmn3itjm50bq197ugadyb0ip4',
    // Extra wrong residential speed questions
    'cmmsemxmu0c37neslf9uzgwdf',
    'cmmsej6el0bthneslzuspie4o',
    'cmmsej4ak0bqdneslgih4e97w',
    'cmn3itjwn0bqd97ugru3qchm8',
    'cmn3itiz50bpd97ug4p8rr447',
    // Extra wrong BAC questions
    'cmn3izany0c9197ugz5q88vj6',
    'cmn3iza7z0c8j97ugt91kzogv',
    'cmn3iy67g0c4797ug54xpx6bk',
    'cmn3j1fd60cfv97ugg567w4dl',
    'cmn3j1fq40cg797ugtyrp75h4',
  ]);

  console.log('\n--- STEP 3: Deleting duplicates ---');
  await deleteQuestions([
    'cmmseuqqt0cprneslzw26a8av', // dup cell phone prohibited
    'cmn3inmmc0b7d97ug8fn50bdp', // dup curved arrow sign
    'cmn3iwe8b0by197ugceski7ui', // dup headlights visibility (keep first)
    'cmn3ixbh30c1j97ug107os4z4', // dup headlights visibility (keep first)
    'cmn3ioijf0b9v97ugusvzb78k', // dup work zone sign color
    'cmn3j2bp00cij97ug589iy20c', // dup 12 points suspension
    'cmn3iojo70bb197uglmskfs4v', // dup deer sign
    'cmn3innmt0b8j97ugxf4xjkxq', // dup Michigan Left
    'cmn3innid0b8d97uggtizlpsl', // dup slippery when wet
    'cmn3j0mhx0cc197ugh0to5m0y', // dup alcohol judgment
  ]);

  console.log('\n--- STEP 4: Adding gap questions ---');

  // GAP: speed:signal-distance (MI: 100 feet)
  await addQuestion(TOPIC.SPEED,
    'How far before turning must you signal in Michigan?',
    'Michigan law requires activating your turn signal at least 100 feet before turning or changing lanes.',
    [{ text: '50 feet', isCorrect: false },{ text: '75 feet', isCorrect: false },{ text: '100 feet', isCorrect: true },{ text: '200 feet', isCorrect: false }]);

  // GAP: safe:parallel-park
  await addQuestion(TOPIC.SAFE,
    'When parallel parking on a two-way street facing uphill with no curb in Michigan, how should your wheels be turned?',
    'When parking uphill without a curb, turn your wheels to the right so the vehicle rolls away from traffic if brakes fail.',
    [{ text: 'Straight ahead', isCorrect: false },{ text: 'To the left toward traffic', isCorrect: false },{ text: 'To the right away from traffic', isCorrect: true },{ text: 'Direction does not matter', isCorrect: false }]);

  // GAP: safe:skid
  await addQuestion(TOPIC.SAFE,
    'What is the correct action if your vehicle begins to skid in Michigan?',
    'Steer in the direction you want the front of the vehicle to go. Avoid hard braking during a skid.',
    [{ text: 'Brake firmly and steer toward the shoulder', isCorrect: false },{ text: 'Steer in the direction the rear is sliding and ease off the brakes', isCorrect: true },{ text: 'Turn the wheel sharply in the opposite direction', isCorrect: false },{ text: 'Accelerate to regain traction', isCorrect: false }]);

  // GAP: safe:turning
  await addQuestion(TOPIC.SAFE,
    'When making a left turn at an intersection in Michigan, what must you yield to?',
    'When turning left, you must yield to oncoming traffic and pedestrians in the crosswalk.',
    [{ text: 'Nothing — left-turning vehicles have right-of-way', isCorrect: false },{ text: 'Only pedestrians in the crosswalk', isCorrect: false },{ text: 'All oncoming traffic and pedestrians in the crosswalk', isCorrect: true },{ text: 'Only vehicles that arrive first at the intersection', isCorrect: false }]);

  // GAP: safe:bike-passing
  await addQuestion(TOPIC.SAFE,
    'When passing a bicyclist on a Michigan road, what should you do?',
    'The MI handbook states to pass bicyclists with care, allowing sufficient space. Move into the adjacent lane when safe to do so.',
    [{ text: 'Stay in your lane and honk to alert the cyclist', isCorrect: false },{ text: 'Pass at normal speed — bicyclists must yield to cars', isCorrect: false },{ text: 'Allow sufficient clearance, moving into the adjacent lane when safe', isCorrect: true },{ text: 'Wait behind the cyclist until they pull over', isCorrect: false }]);

  // GAP: signs:green-arrow
  await addQuestion(TOPIC.SIGNS,
    'What does a green arrow traffic signal mean in Michigan?',
    'A green arrow indicates a protected turn movement — you may proceed in the direction of the arrow without conflicting traffic.',
    [{ text: 'Yield to oncoming traffic before turning', isCorrect: false },{ text: 'You have a protected turn — proceed in the arrow direction', isCorrect: true },{ text: 'Stop completely then turn when safe', isCorrect: false },{ text: 'Oncoming traffic also has a green — check for a gap', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== FIX COMPLETE ===`);
  console.log(`Final count: ${finalCount} (target 320–360)`);
  if (finalCount > 360) console.log(`Run mi_trim.js to trim ~${finalCount - 340} more`);

  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
