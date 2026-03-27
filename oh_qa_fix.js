const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntrsd000y3jd6z8mny40a';
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
  console.log('=== OH QA FIX ===\n');
  console.log('--- STEP 1: Fixing factual errors ---');

  // Fix: wrong school zone speed (25 or 15 → 20 mph)
  await fixQuestion('cmmsblmtb02v3nesl8pif3snw',
    'If you are driving and see a school zone sign ahead with children present, what speed must you reduce to?',
    [{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false }]);

  await fixQuestion('cmmsbjvvp02lrnesljzccum8d',
    'When driving through a school zone in Ohio, what is the maximum speed limit?',
    [{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false }]);

  await fixQuestion('cmmsbzqm1042nnesl9ekijp3u',
    'A school zone sign indicates children are present. What speed must you maintain in Ohio?',
    [{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false },{ text: '35 mph', isCorrect: false }]);

  await fixQuestion('cmn3h0owf078197ug5imvu5wr',
    'At what speed should you drive in an Ohio school zone when children are present?',
    [{ text: '15 mph', isCorrect: false },{ text: '20 mph', isCorrect: true },{ text: '25 mph', isCorrect: false },{ text: '30 mph', isCorrect: false }]);

  // Fix: wrong fire hydrant distance (15 or 20 → 10 feet)
  await fixQuestion('cmmsbln2v02vhneslnj3kzzh8',
    'What is the minimum distance you must park from a fire hydrant in Ohio?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '20 feet', isCorrect: false }]);

  await fixQuestion('cmmsbjwh802mjneslgkedjau2',
    'How far must you park from a fire hydrant in Ohio?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '20 feet', isCorrect: false }]);

  await fixQuestion('cmmsblkw602sdnesli8pjf0ra',
    'How far from a fire hydrant must you park your vehicle in Ohio?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '25 feet', isCorrect: false }]);

  await fixQuestion('cmn3gzqlq075d97ugla381wtz',
    'How far must you park from a fire hydrant in Ohio?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '20 feet', isCorrect: false }]);

  await fixQuestion('cmn3gzscm077d97ugslfya6at',
    'What is the minimum parking distance from a fire hydrant in Ohio?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '20 feet', isCorrect: false }]);

  await fixQuestion('cmn3h1nca07bj97ugcdbuyx8h',
    'When parallel parking in Ohio, what is the minimum distance you must maintain from a fire hydrant?',
    [{ text: '5 feet', isCorrect: false },{ text: '10 feet', isCorrect: true },{ text: '15 feet', isCorrect: false },{ text: '20 feet', isCorrect: false }]);

  // Fix: wrong BAC adult (.10 → .08)
  await fixQuestion('cmmsbn3xv031pneslby3k2d7m',
    'What is the BAC limit for adult drivers in Ohio?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmmsbqfgq03b1neslkdim8am6',
    'What is the legal BAC limit for adult drivers in Ohio?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.12%', isCorrect: false }]);

  await fixQuestion('cmmsbwnrf03tbnesl3arepq5q',
    'What is the BAC limit that constitutes OVI (Operating a Vehicle Impaired) in Ohio for adult drivers?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmn3h3woz07ij97ugwad2i53s',
    'In Ohio, what BAC level triggers an automatic Administrative License Suspension (ALS)?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.16%', isCorrect: false }]);

  await fixQuestion('cmn3h5oxv07p197ugbn4g3i00',
    'In Ohio, what is the BAC limit for adult drivers (21 and over)?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  await fixQuestion('cmn3h5ql407r197ugryxl1thq',
    'At what BAC level does Ohio\'s Administrative License Suspension (ALS) automatically take effect?',
    [{ text: '.05%', isCorrect: false },{ text: '.08%', isCorrect: true },{ text: '.10%', isCorrect: false },{ text: '.15%', isCorrect: false }]);

  // Fix: wrong under-21 BAC (zero tolerance / .00 → .02)
  await fixQuestion('cmmsbqgtq03cznesl4d5eltkk',
    'What is the BAC limit for drivers under 21 years old in Ohio?',
    [{ text: '.00% (any alcohol)', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmmsc7n6504jrneslx7do8lkx',
    'What is the legal BAC limit for drivers under 21 years old in Ohio?',
    [{ text: '.00% (any alcohol)', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  await fixQuestion('cmn3h2w6b07f197ug8v4q2mdc',
    'What is the BAC limit for drivers under 21 years old in Ohio?',
    [{ text: '.00% (any alcohol)', isCorrect: false },{ text: '.02%', isCorrect: true },{ text: '.04%', isCorrect: false },{ text: '.08%', isCorrect: false }]);

  // Fix: "zero tolerance" question — Ohio's under-21 law is .02, not true zero tolerance
  await fixQuestion('cmn3h3y8207k797ug6qj6u38a',
    'In Ohio, what BAC level makes it illegal for a driver under 21 to operate a vehicle?',
    [{ text: '.00% — any trace of alcohol', isCorrect: false },{ text: '.02% or higher', isCorrect: true },{ text: '.04% or higher', isCorrect: false },{ text: '.08% or higher', isCorrect: false }]);

  // Fix: wrong interstate speed (65 or 55 → 70 mph)
  await fixQuestion('cmmsby94h03xznesl5gthhpge',
    'You are driving on Interstate 70 in Ohio. What is the maximum legal speed?',
    [{ text: '55 mph', isCorrect: false },{ text: '60 mph', isCorrect: false },{ text: '65 mph', isCorrect: false },{ text: '70 mph', isCorrect: true }]);

  // Fix: wrong railroad crossing stop distance
  await fixQuestion('cmmsbsii803exneslb4v44ac2',
    'At a railroad crossing, how far from the tracks must you stop your vehicle?',
    [{ text: 'Within 10 feet of the nearest rail', isCorrect: false },{ text: 'Within 15 feet of the nearest rail', isCorrect: false },{ text: 'Within 50 feet of the nearest rail', isCorrect: true },{ text: 'Within 100 feet of the nearest rail', isCorrect: false }]);

  await fixQuestion('cmmscbdxr04vtneslo5z3ht50',
    'When approaching a railroad crossing, what is the required stopping distance from the tracks?',
    [{ text: 'Within 10 feet of the nearest rail', isCorrect: false },{ text: 'Within 15 feet of the nearest rail', isCorrect: false },{ text: 'Within 50 feet of the nearest rail', isCorrect: true },{ text: 'Within 100 feet of the nearest rail', isCorrect: false }]);

  // Fix: wrong turn signal distance (50 → 100 feet)
  await fixQuestion('cmn3h0ph2078p97ug36gv8c3r',
    'How far in advance must you activate your turn signal before changing lanes or turning in Ohio?',
    [{ text: 'At least 50 feet', isCorrect: false },{ text: 'At least 100 feet', isCorrect: true },{ text: 'At least 150 feet', isCorrect: false },{ text: 'At least 200 feet', isCorrect: false }]);

  // Fix: wrong permit hold (9 or 12 months → 6 months)
  await fixQuestion('cmn3h6nn607rp97ugmx71ct3x',
    'How long must you hold a temporary instruction permit (TIPIC) before applying for a probationary license in Ohio?',
    [{ text: '3 months', isCorrect: false },{ text: '6 months', isCorrect: true },{ text: '9 months', isCorrect: false },{ text: '12 months', isCorrect: false }]);

  // Fix: wrong supervised hours (40 → 50)
  await fixQuestion('cmn3h6nse07rv97ug2ls7l1gt',
    'How many hours of supervised driving practice are required before getting a probationary license in Ohio?',
    [{ text: '25 hours', isCorrect: false },{ text: '40 hours', isCorrect: false },{ text: '50 hours (including 10 at night)', isCorrect: true },{ text: '65 hours', isCorrect: false }]);

  // Fix: wrong knowledge test count (35 → 40)
  await fixQuestion('cmmsbn4fk032hneslnv0olnig',
    'How many questions are on the Ohio knowledge test and what score is required to pass?',
    [{ text: '35 questions, need 28 correct (80%)', isCorrect: false },{ text: '40 questions, need 30 correct (75%)', isCorrect: true },{ text: '50 questions, need 40 correct (80%)', isCorrect: false },{ text: '20 questions, need 16 correct (80%)', isCorrect: false }]);

  // Delete redundant wrong-value school zone questions
  console.log('\n--- STEP 2: Deleting duplicates ---');
  await deleteQuestions([
    'cmn3gs2hv06gd97ugtvh3oxy7',  // dup diamond yellow sign
    'cmn3gs24906fv97ug7h6e8lzt',  // dup brown signs
    'cmmsc7ow704m3neslzfqppmpk',  // dup cell phone laws
    'cmn3gs2dk06g797ug24mvvyc6',  // dup Wrong Way sign
    'cmmsbjxyw02ohneslkafznlre',  // dup following distance
    'cmn3gs2qy06gp97ugfjnopvl9',  // dup deer symbol sign
    'cmn3gs15g06ep97ugujkpqssx',  // dup stop sign shape
  ]);

  console.log('\n--- Deleting redundant error questions ---');
  await deleteQuestions([
    // Extra school zone wrong-value questions
    'cmmsbzsj0045dnesl4y8avxcu',
    'cmn3gxxg706yp97ug5it6s817',
    'cmn3gyvlv072p97ugl7rae5th',
    // Extra interstate wrong-value questions
    'cmn3gwxrc06wj97ug1dzztykk',
    'cmn3gyva7072d97ug3397w8nb',
    'cmn3gyvg6072j97ugxfz7xciz',
    // Wrong permit hold duration questions (12 months)
    'cmn3h7om207vj97ugsqtvxzra',
    'cmn3h88q807yp97ugpod4ncb5',
  ]);

  console.log('\n--- STEP 3: Adding gap questions ---');

  // GAP: speed:following (OH: 3-second rule)
  await addQuestion(TOPIC.SPEED,
    'What following distance rule should Ohio drivers use in normal conditions?',
    'Use the three-second rule to determine a safe following distance.',
    [{ text: 'Two-second rule', isCorrect: false },{ text: 'Three-second rule', isCorrect: true },{ text: 'Four-second rule', isCorrect: false },{ text: 'Five-second rule', isCorrect: false }]);

  await addQuestion(TOPIC.SPEED,
    'How do you apply the three-second rule for following distance in Ohio?',
    'When the vehicle ahead passes a fixed object, count to three. If you reach the object before finishing, you are following too closely.',
    [{ text: 'Count to three after you pass a fixed object the other car just passed', isCorrect: true },{ text: 'Stay three car lengths behind at all times', isCorrect: false },{ text: 'Maintain three feet of clearance from the bumper ahead', isCorrect: false },{ text: 'Count to three from the time you first see the car ahead brake', isCorrect: false }]);

  // GAP: speed:signal-distance (OH: 100 feet)
  await addQuestion(TOPIC.SPEED,
    'How far in advance must you activate your turn signal before turning in Ohio?',
    'Ohio law requires activating the turn signal at least 100 feet before turning.',
    [{ text: 'At least 50 feet', isCorrect: false },{ text: 'At least 100 feet', isCorrect: true },{ text: 'At least 150 feet', isCorrect: false },{ text: 'At least 200 feet', isCorrect: false }]);

  // GAP: row:funeral
  await addQuestion(TOPIC.ROW,
    'What must a driver do when a funeral procession is passing in Ohio?',
    'Drivers must yield to vehicles in an organized funeral procession and may not break into the line of vehicles.',
    [{ text: 'Proceed normally — funeral processions have no special right of way', isCorrect: false },{ text: 'Yield and do not cut into the procession', isCorrect: true },{ text: 'Stop completely and wait until all vehicles have passed', isCorrect: false },{ text: 'Pull to the right shoulder and stop as you would for an emergency vehicle', isCorrect: false }]);

  // GAP: row:bicycle
  await addQuestion(TOPIC.ROW,
    'When a bicyclist is riding in a traffic lane in Ohio, what right do they have?',
    'Bicyclists have the same rights and responsibilities as other road users and are entitled to use the traffic lane.',
    [{ text: 'They must stay on the shoulder and yield to all vehicles', isCorrect: false },{ text: 'They are entitled to use the traffic lane and have the same rights as other vehicles', isCorrect: true },{ text: 'They may only use designated bike lanes', isCorrect: false },{ text: 'They must ride as close to the right edge as possible at all times', isCorrect: false }]);

  await addQuestion(TOPIC.ROW,
    'In Ohio, who has the right of way when a driver is turning right and a bicyclist is approaching from the right?',
    'Drivers must yield to bicyclists just as they would to other vehicles — the bicyclist has the right of way.',
    [{ text: 'The driver, because they signaled the turn', isCorrect: false },{ text: 'Whoever arrives first', isCorrect: false },{ text: 'The bicyclist — the driver must yield and let them pass first', isCorrect: true },{ text: 'The driver may turn if the bicyclist is more than 20 feet away', isCorrect: false }]);

  // GAP: row:motorcycle
  await addQuestion(TOPIC.ROW,
    'Can a motorist share a traffic lane alongside a motorcycle in Ohio?',
    'Motorcyclists are entitled to the full width of a traffic lane. Lane sharing is prohibited.',
    [{ text: 'Yes, if the lane is wide enough', isCorrect: false },{ text: 'Yes, but only on multi-lane highways', isCorrect: false },{ text: 'No — motorcyclists are entitled to the full width of the lane', isCorrect: true },{ text: 'Yes, if the motorcyclist consents', isCorrect: false }]);

  // GAP: safe:park-crosswalk (OH: 20 feet from crosswalk at intersection)
  await addQuestion(TOPIC.SAFE,
    'In Ohio, how close may you park to a crosswalk at an intersection?',
    'Parking is prohibited within 20 feet of a crosswalk at an intersection.',
    [{ text: 'Within 10 feet', isCorrect: false },{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet — parking prohibited within 20 feet', isCorrect: true },{ text: 'Within 30 feet', isCorrect: false }]);

  // GAP: safe:park-stop-sign (OH: 30 feet from stop sign or traffic signal)
  await addQuestion(TOPIC.SAFE,
    'How close may you park to a STOP sign or traffic control signal in Ohio?',
    'Parking is prohibited within 30 feet of a flashing beacon, stop sign, or traffic control device.',
    [{ text: 'Within 15 feet', isCorrect: false },{ text: 'Within 20 feet', isCorrect: false },{ text: 'Within 30 feet — parking prohibited within 30 feet', isCorrect: true },{ text: 'Within 50 feet', isCorrect: false }]);

  // GAP: safe:bike-passing (OH: 3 feet)
  await addQuestion(TOPIC.SAFE,
    'When passing a bicyclist on any road in Ohio, what minimum clearance must you maintain?',
    'Ohio law requires at least 3 feet of clearance when passing a bicyclist.',
    [{ text: '1 foot', isCorrect: false },{ text: '2 feet', isCorrect: false },{ text: '3 feet', isCorrect: true },{ text: '4 feet', isCorrect: false }]);

  // GAP: license:address-change (OH: 10 days)
  await addQuestion(TOPIC.LICENSE,
    'Within how many days must you notify the Ohio BMV of an address change?',
    'You must notify the Ohio BMV of an address change within 10 days of moving.',
    [{ text: '5 days', isCorrect: false },{ text: '10 days', isCorrect: true },{ text: '30 days', isCorrect: false },{ text: '60 days', isCorrect: false }]);

  // GAP: license:knowledge-test (OH: 40 questions, 75%)
  await addQuestion(TOPIC.LICENSE,
    'How many questions are on the Ohio BMV knowledge test and what score is required to pass?',
    'The Ohio knowledge test has 40 questions. Applicants must answer at least 30 correctly (75%) to pass.',
    [{ text: '20 questions, need 16 correct', isCorrect: false },{ text: '35 questions, need 28 correct', isCorrect: false },{ text: '40 questions, need 30 correct (75%)', isCorrect: true },{ text: '50 questions, need 40 correct', isCorrect: false }]);

  // GAP: signs:green-arrow
  await addQuestion(TOPIC.SIGNS,
    'What does a green arrow signal mean at an intersection in Ohio?',
    'A green arrow indicates a protected turn — you may proceed in the direction of the arrow without conflicting traffic.',
    [{ text: 'You may proceed but must yield to all crossing pedestrians', isCorrect: false },{ text: 'You have a protected turn — proceed in the direction of the arrow', isCorrect: true },{ text: 'Oncoming traffic also has a green — wait for a gap', isCorrect: false },{ text: 'You must turn; going straight is not permitted', isCorrect: false }]);

  await addQuestion(TOPIC.SIGNS,
    'A green arrow appears alongside a red traffic light at an Ohio intersection. What does this mean?',
    'A green arrow alongside a red light is a protected movement — you may turn in the direction of the arrow.',
    [{ text: 'The red light takes priority — stop and wait', isCorrect: false },{ text: 'You may turn in the direction of the arrow; it is a protected movement', isCorrect: true },{ text: 'Treat it as a four-way stop', isCorrect: false },{ text: 'Proceed only if no pedestrians are present', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== FIX COMPLETE ===`);
  console.log(`Final count: ${finalCount} (target 320-360)`);
  if (finalCount > 360) console.log(`Run oh_trim.js to trim ~${finalCount - 340} more`);
  else console.log(`Within target — run oh_trim.js then deploy`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
