const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const NY = 'cmmpntr72000v3jd6patr1zka';
const T = {
  signs: 'cmmpntv01001e3jd60a0j8onz',
  row: 'cmmpntvao001f3jd6afqngfl5',
  speed: 'cmmpntvhy001g3jd6fkjlrbmq',
  safe: 'cmmpntvnw001h3jd6zi1q1365',
  alcohol: 'cmn2ia2ei0000ua6cuap3rywt',
  license: 'cmn2ia2n20001ua6cq7y7tood',
};

// ─── STEP 1: FIX FACTUAL ERRORS ──────────────────────────────────────────────

async function fixErrors() {
  console.log('Fixing factual errors...\n');

  // Fix 1-5, 14-16: Following distance — "3-second rule" → "2-second rule"
  // These choice IDs have "3-second rule" or "3 seconds" as the correct answer
  const followingFixes = [
    { choiceId: 'cmms0u0ux065of74yntjjglzf', newText: '2-second rule' },
    { choiceId: 'cmms0l7u705m6f74ysa0qfqar', newText: '2-second rule' },
    { choiceId: 'cmms0n8vi05q3f74y32ilgrcy', newText: '2-second rule' },
    { choiceId: 'cmms0ryrc05ymf74yybd6ib55', newText: '2-second rule' },
    { choiceId: 'cmn3fgcsu024q97ugev3gh4lt', newText: '2 seconds' },
    { choiceId: 'cmn3fgeo7026q97ugonwoum61', newText: 'Count 2 seconds between when the car ahead passes a point and when you pass it' },
    { choiceId: 'cmn3fildb02e297ugddocku9h', newText: 'Greater than the normal 2-second rule' },
  ];

  for (const fix of followingFixes) {
    await p.choice.update({ where: { id: fix.choiceId }, data: { text: fix.newText } });
    console.log(`Fixed following distance choice: ${fix.choiceId}`);
  }

  // Also fix the question texts that say "3-second rule"
  const followingQuestionFixes = [
    {
      id: 'cmn3fgeo7026p97ugxxtlzi6t',
      newText: 'Which of the following best describes the 2-second rule?',
      newExplanation: 'The 2-second rule: as the vehicle ahead passes a fixed object, count slowly. If you reach that object before you finish counting "one thousand one, one thousand two," you are following too closely.'
    },
  ];
  for (const fix of followingQuestionFixes) {
    await p.question.update({
      where: { id: fix.id },
      data: { text: fix.newText, explanation: fix.newExplanation }
    });
    console.log(`Fixed question text: ${fix.id}`);
  }

  // Fix 6-12: Outside NYC residential speed — "30 mph" → "55 mph"
  // The NY manual says: if no limit posted, drive no more than 55 mph.
  // NYC is 25 mph. There is no 30 mph default anywhere in NY.
  const speedFixes = [
    { choiceId: 'cmn3fd3js01tw97ug9knqw1z9', newText: '55 mph' },
    { choiceId: 'cmn3fd5w301wk97ugkndusmou', newText: '55 mph' },
    { choiceId: 'cmn3fdzh101x297ug6bh7802x', newText: '55 mph' },
    { choiceId: 'cmn3fe1mv01ze97ugnls1bjtc', newText: '55 mph' },
    { choiceId: 'cmn3ff0bh020e97ug86tg0qc5', newText: '55 mph' },
    { choiceId: 'cmn3ff1tj022297ugdm7owlib', newText: '55 mph — no posted limit means 55 mph statewide' },
    { choiceId: 'cmn3ff2am022k97ugv7wfmhvx', newText: '55 mph' },
  ];
  for (const fix of speedFixes) {
    await p.choice.update({ where: { id: fix.choiceId }, data: { text: fix.newText } });
    console.log(`Fixed speed limit choice: ${fix.choiceId}`);
  }

  // Fix question 13: NYC vs rest of NY comparison
  // "NYC is 25 mph, other cities are typically 30 mph" → "NYC is 25 mph, rest of NY defaults to 55 mph"
  await p.choice.update({
    where: { id: 'cmn3ff36o023k97ug5s9mvvru' },
    data: { text: 'NYC is 25 mph; outside NYC the default (no sign posted) is 55 mph' }
  });
  console.log('Fixed NYC vs rest of NY comparison choice');

  // Fix question 2: "30 MPH faster" comparison question
  // If NYC = 25 mph and upstate default = 55 mph, the difference is 30 mph — actually this is CORRECT.
  // 55 - 25 = 30 mph difference. So question ID cmms1ftzk06w1f74y8he4g69p is actually correct.
  // Skipping this one — the answer "30 MPH faster" IS correct for the question asked.
  console.log('Skipping fix #2 (cmms1ftzk06w1f74y8he4g69p) — "30 MPH faster" is correct: 55-25=30');

  // Fix 17: Driver Responsibility Assessment — check if "6 points" is actually correct
  // Per handbook: DRA applies if convicted of 6+ points in 18 months.
  // The scanner flagged this because our pattern matched suspension threshold (11 points).
  // "6 points" for DRA start IS correct per handbook. Do not fix.
  console.log('Skipping fix #17 — "6 points for DRA" is correct per NY handbook');

  console.log('\nError fixes complete.\n');
}

// ─── STEP 2: DELETE DUPLICATES ────────────────────────────────────────────────

async function deleteDuplicates() {
  console.log('Deleting duplicates...\n');

  const duplicateIds = [
    'cmn3fbxuq01s797ugctmcc393', // U-turn yield duplicate
    'cmn3fikw002dj97ugdbn48usc', // Night driving headlights duplicate
    'cmn3filpl02ed97ugnyx36kza', // Hazard lights duplicate
    'cmn3fje8h02fj97ugzdhexht2', // Brake failure duplicate
    'cmn3fjejl02fp97ugm95pyfph', // Steering wheel position duplicate
    'cmn3fpjf9031j97ugppvq76ar', // Junior license nighttime restriction duplicate
  ];

  // Get choice IDs first for answers
  const choices = await p.choice.findMany({
    where: { questionId: { in: duplicateIds } },
    select: { id: true }
  });
  const choiceIds = choices.map(c => c.id);

  await p.answer.deleteMany({ where: { choiceId: { in: choiceIds } } });
  await p.$transaction([
    p.answer.deleteMany({ where: { questionId: { in: duplicateIds } } }),
    p.userProgress.deleteMany({ where: { questionId: { in: duplicateIds } } }),
    p.questionTranslation.deleteMany({ where: { questionId: { in: duplicateIds } } }),
    p.choice.deleteMany({ where: { questionId: { in: duplicateIds } } }),
    p.question.deleteMany({ where: { id: { in: duplicateIds } } }),
  ]);

  console.log(`Deleted ${duplicateIds.length} duplicate questions.\n`);
}

// ─── STEP 3: FILL GAPS ────────────────────────────────────────────────────────

function q(topicId, text, explanation, choices) {
  return { stateId: NY, topicId, text, explanation, choices: { create: choices } };
}

async function fillGaps() {
  console.log('Adding gap-filling questions...\n');

  const questions = [

    // ── safe:park-crosswalk ──────────────────────────────────────────────────
    q(T.safe, 'How far from a crosswalk at an intersection must you park your vehicle in New York?',
      'New York law prohibits parking or standing within 20 feet of a crosswalk at an intersection.',
      [
        { text: '10 feet', isCorrect: false },
        { text: '15 feet', isCorrect: false },
        { text: '20 feet', isCorrect: true },
        { text: '30 feet', isCorrect: false },
      ]),

    q(T.safe, 'You want to park near an intersection in New York. What is the minimum distance you must keep from the crosswalk?',
      'Parking or standing within 20 feet of a crosswalk at an intersection is prohibited in New York State.',
      [
        { text: '10 feet', isCorrect: false },
        { text: '20 feet', isCorrect: true },
        { text: '30 feet', isCorrect: false },
        { text: '50 feet', isCorrect: false },
      ]),

    q(T.safe, 'In New York, how close to a traffic light or stop sign may you legally park?',
      'New York law prohibits parking within 30 feet of a traffic light, STOP sign, or YIELD sign.',
      [
        { text: '10 feet', isCorrect: false },
        { text: '20 feet', isCorrect: false },
        { text: '30 feet', isCorrect: true },
        { text: '50 feet', isCorrect: false },
      ]),

    // ── safe:passing ─────────────────────────────────────────────────────────
    q(T.safe, 'When passing another vehicle on a two-way road in New York, you must return to the right lane before an oncoming vehicle comes within how many feet of you?',
      'You cannot pass if you cannot safely return to the right lane before any oncoming vehicle comes within 200 feet of you.',
      [
        { text: '100 feet', isCorrect: false },
        { text: '150 feet', isCorrect: false },
        { text: '200 feet', isCorrect: true },
        { text: '500 feet', isCorrect: false },
      ]),

    q(T.safe, 'In New York, passing is prohibited within how many feet of a railroad crossing on a two-way road?',
      'You cannot pass within 100 feet of a railroad crossing on a two-way roadway.',
      [
        { text: '50 feet', isCorrect: false },
        { text: '100 feet', isCorrect: true },
        { text: '150 feet', isCorrect: false },
        { text: '200 feet', isCorrect: false },
      ]),

    q(T.safe, 'In New York, when may you pass another vehicle on the right?',
      'You may pass on the right when a vehicle ahead is making a left turn, or when on a road wide enough for two or more lanes in each direction where passing is not prohibited.',
      [
        { text: 'Never — passing on the right is always illegal', isCorrect: false },
        { text: 'When the vehicle ahead is making a left turn or the road has multiple lanes', isCorrect: true },
        { text: 'Only on highways with three or more lanes', isCorrect: false },
        { text: 'Whenever you can do so safely', isCorrect: false },
      ]),

    q(T.safe, 'After passing a vehicle on the left in New York, what must you see in your rear-view mirror before returning to the right lane?',
      'Before returning to the right lane after passing, you must see the front bumper of the vehicle you passed in your rear-view mirror.',
      [
        { text: 'The entire vehicle you passed', isCorrect: false },
        { text: 'The front bumper of the vehicle you passed', isCorrect: true },
        { text: 'At least 500 feet of clear road behind you', isCorrect: false },
        { text: 'The headlights of the vehicle you passed', isCorrect: false },
      ]),

    // ── license:address-change ───────────────────────────────────────────────
    q(T.license, 'Within how many days must you notify the New York DMV of a change of address?',
      'New York law requires you to notify DMV within 10 days of a change of address, using a Change-of-Address Form (MV-232) or online at dmv.ny.gov.',
      [
        { text: '5 days', isCorrect: false },
        { text: '10 days', isCorrect: true },
        { text: '30 days', isCorrect: false },
        { text: '60 days', isCorrect: false },
      ]),

    q(T.license, 'You moved to a new address in New York. How must you notify the DMV and within what timeframe?',
      'You must notify DMV within 10 days by mail using a Change-of-Address Form (MV-232) or online at dmv.ny.gov.',
      [
        { text: 'Within 30 days — call the DMV hotline', isCorrect: false },
        { text: 'Within 10 days — by mail or online', isCorrect: true },
        { text: 'Within 60 days — in person at a DMV office', isCorrect: false },
        { text: 'At your next license renewal', isCorrect: false },
      ]),

    q(T.license, 'A New York driver moves to a new address. Which form is used to report a change of address to the DMV?',
      'The Change-of-Address Form MV-232 is used to notify DMV of a new address. The change must be reported within 10 days.',
      [
        { text: 'Form MV-44', isCorrect: false },
        { text: 'Form MV-232', isCorrect: true },
        { text: 'Form MV-82', isCorrect: false },
        { text: 'Form MV-104', isCorrect: false },
      ]),

    // ── license:insurance ────────────────────────────────────────────────────
    q(T.license, 'What is the minimum liability insurance required for the death of one person in a New York traffic crash?',
      'New York minimum liability insurance requires $50,000 for the death of one person, $100,000 for death of two or more, $25,000 for injury to one person, $50,000 for injury to two or more, and $10,000 for property damage.',
      [
        { text: '$25,000', isCorrect: false },
        { text: '$30,000', isCorrect: false },
        { text: '$50,000', isCorrect: true },
        { text: '$100,000', isCorrect: false },
      ]),

    q(T.license, 'What is the minimum property damage liability insurance required in New York State?',
      'New York requires a minimum of $10,000 in property damage liability coverage per incident.',
      [
        { text: '$5,000', isCorrect: false },
        { text: '$10,000', isCorrect: true },
        { text: '$25,000', isCorrect: false },
        { text: '$50,000', isCorrect: false },
      ]),

    q(T.license, 'What does New York\'s minimum liability insurance of "$50,000/$100,000" cover?',
      'The $50,000/$100,000 refers to bodily injury liability: $50,000 for death or injury to one person, and $100,000 for death or injury to two or more persons in one incident.',
      [
        { text: 'Property damage: $50,000 per incident, $100,000 per year', isCorrect: false },
        { text: 'Bodily injury: $50,000 for one person, $100,000 for two or more', isCorrect: true },
        { text: 'Comprehensive and collision coverage limits', isCorrect: false },
        { text: 'Medical payments: $50,000 per person, $100,000 per family', isCorrect: false },
      ]),

    // ── signs:railroad ───────────────────────────────────────────────────────
    q(T.signs, 'What shape is the advance railroad crossing warning sign in New York?',
      'Railroad advance warning signs are round (circular) in shape. They are yellow with black letters "RR" and an "X" symbol, indicating a railroad crossing ahead.',
      [
        { text: 'Diamond', isCorrect: false },
        { text: 'Rectangle', isCorrect: false },
        { text: 'Round (circular)', isCorrect: true },
        { text: 'Pentagon', isCorrect: false },
      ]),

    q(T.signs, 'You see a round yellow sign with an X and the letters RR on a New York road. What does it mean?',
      'This is a railroad advance warning sign. Use caution and be prepared to stop — a railroad crossing is ahead.',
      [
        { text: 'Road repair zone ahead', isCorrect: false },
        { text: 'Railroad crossing ahead — use caution and prepare to stop', isCorrect: true },
        { text: 'Rest area one mile ahead', isCorrect: false },
        { text: 'Restricted road — no trucks', isCorrect: false },
      ]),

    // ── signs:green-arrow ────────────────────────────────────────────────────
    q(T.signs, 'What does a green arrow signal shown with a red light mean in New York?',
      'A green arrow with a red light means you may go only in the direction of the arrow, but only if the intersection is clear. You must yield to other traffic as required by law.',
      [
        { text: 'Wait for a full green light before proceeding', isCorrect: false },
        { text: 'You may go only in the direction of the arrow if the intersection is clear', isCorrect: true },
        { text: 'You have absolute right-of-way in all directions', isCorrect: false },
        { text: 'This signal applies only to buses and emergency vehicles', isCorrect: false },
      ]),

    q(T.signs, 'At a New York intersection, a green left-turn arrow appears. What does this mean?',
      'A green arrow means you can go in the direction of the arrow, but you must still yield to other traffic at the intersection as required by law.',
      [
        { text: 'You must yield to all oncoming traffic before turning', isCorrect: false },
        { text: 'You may turn in the direction of the arrow, yielding as required by law', isCorrect: true },
        { text: 'Stop and wait for a solid green before turning', isCorrect: false },
        { text: 'This arrow only applies during off-peak hours', isCorrect: false },
      ]),

    // ── signs:flashing-yellow ────────────────────────────────────────────────
    q(T.signs, 'What does a flashing yellow traffic light mean in New York?',
      'A flashing yellow light means "drive with caution." Slow down and be alert at the intersection.',
      [
        { text: 'Stop completely before proceeding', isCorrect: false },
        { text: 'Drive with caution — slow down and be alert', isCorrect: true },
        { text: 'Treat it the same as a green light', isCorrect: false },
        { text: 'Yield to all cross traffic before proceeding', isCorrect: false },
      ]),

    q(T.signs, 'You approach a New York intersection with a flashing yellow signal. What action should you take?',
      'A flashing yellow signal is a warning to slow down and proceed with caution. It does not require a full stop unless traffic conditions require it.',
      [
        { text: 'Come to a complete stop and wait for a green light', isCorrect: false },
        { text: 'Slow down and proceed with caution', isCorrect: true },
        { text: 'Proceed at normal speed — yellow means yield only', isCorrect: false },
        { text: 'Stop, yield to all traffic, then proceed', isCorrect: false },
      ]),

  ];

  let added = 0;
  for (const qData of questions) {
    await p.question.create({ data: qData });
    added++;
  }
  console.log(`Added ${added} gap-filling questions.\n`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  await fixErrors();
  await deleteDuplicates();
  await fillGaps();

  const count = await p.question.count({ where: { stateId: NY } });
  console.log(`\nFINAL NY question count: ${count}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
