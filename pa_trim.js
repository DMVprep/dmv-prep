const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const PA = 'cmmpntsfr00113jd6ayb2qei8';
const T = {
  signs: 'cmmpntv01001e3jd60a0j8onz',
  row: 'cmmpntvao001f3jd6afqngfl5',
  speed: 'cmmpntvhy001g3jd6fkjlrbmq',
  safe: 'cmmpntvnw001h3jd6zi1q1365',
  alcohol: 'cmn2ia2ei0000ua6cuap3rywt',
  license: 'cmn2ia2n20001ua6cq7y7tood',
};

// ── STEP 1: ADD MISSING GAP QUESTIONS ────────────────────────────────────────

async function fillMissingGaps() {
  console.log('Adding missing gap questions...');

  const questions = [
    // safe:passing (PA-specific rules)
    {
      stateId: PA, topicId: T.safe,
      text: 'In Pennsylvania, when may you pass another vehicle on the right?',
      explanation: 'In PA you may pass on the right when: the vehicle ahead is making or signaling a left turn (staying on berm/shoulder), or when driving on a road with two or more marked lanes in each direction.',
      choices: { create: [
        { text: 'Never — passing on the right is always illegal in Pennsylvania', isCorrect: false },
        { text: 'When the vehicle ahead is making a left turn, or on a multi-lane road', isCorrect: true },
        { text: 'Only on highways with three or more lanes', isCorrect: false },
        { text: 'Whenever traffic is moving slowly', isCorrect: false },
      ]},
    },
    {
      stateId: PA, topicId: T.safe,
      text: 'In Pennsylvania, passing is prohibited within how many feet of an intersection or railroad crossing?',
      explanation: 'Passing is prohibited within 100 feet of any intersection, railroad grade crossing, bridge, elevated structure, or tunnel in Pennsylvania.',
      choices: { create: [
        { text: '50 feet', isCorrect: false },
        { text: '100 feet', isCorrect: true },
        { text: '200 feet', isCorrect: false },
        { text: '300 feet', isCorrect: false },
      ]},
    },
    {
      stateId: PA, topicId: T.safe,
      text: 'After passing a vehicle on the left in Pennsylvania, when may you return to the right lane?',
      explanation: 'Before returning to the right lane after passing, you must be able to see the headlights of the passed vehicle in your rearview mirror.',
      choices: { create: [
        { text: 'As soon as you clear the front bumper of the passed vehicle', isCorrect: false },
        { text: 'When you can see the headlights of the passed vehicle in your rearview mirror', isCorrect: true },
        { text: 'After traveling at least 200 feet past the vehicle', isCorrect: false },
        { text: 'Immediately — there is no requirement', isCorrect: false },
      ]},
    },

    // license:new-resident (60 days)
    {
      stateId: PA, topicId: T.license,
      text: 'How many days does a person who moves to Pennsylvania have to obtain a Pennsylvania driver license?',
      explanation: 'People who move to Pennsylvania and hold a valid license from another state must obtain a Pennsylvania driver license within 60 days of establishing residency and surrender their out-of-state license.',
      choices: { create: [
        { text: '30 days', isCorrect: false },
        { text: '60 days', isCorrect: true },
        { text: '90 days', isCorrect: false },
        { text: '120 days', isCorrect: false },
      ]},
    },
    {
      stateId: PA, topicId: T.license,
      text: 'You recently moved to Pennsylvania from New Jersey with a valid NJ driver license. What are you required to do?',
      explanation: 'New Pennsylvania residents must surrender their out-of-state license and obtain a Pennsylvania driver license within 60 days of establishing residency in the state.',
      choices: { create: [
        { text: 'Your NJ license is valid in Pennsylvania indefinitely', isCorrect: false },
        { text: 'Get a PA license within 30 days', isCorrect: false },
        { text: 'Surrender your NJ license and get a PA license within 60 days', isCorrect: true },
        { text: 'Only required if you plan to stay more than 6 months', isCorrect: false },
      ]},
    },
  ];

  for (const q of questions) {
    await p.question.create({ data: q });
  }
  console.log(`Added ${questions.length} gap questions.\n`);
}

// ── STEP 2: TRIM OVER-TESTED CONCEPTS ────────────────────────────────────────

async function trim() {
  console.log('Fetching questions for trim...');

  const qs = await p.question.findMany({
    where: { stateId: PA },
    select: { id: true, text: true, choices: { select: { id: true, text: true, isCorrect: true } } },
  });

  // Keep sets for each over-tested concept
  // alcohol:bac + alcohol:dui (53 each) → keep 8 each covering distinct aspects
  const keepBac = new Set([]);
  const keepDui = new Set([]);

  // Fetch all BAC and DUI questions to pick best
  const bacQs = qs.filter(q => /blood alcohol|BAC.*level|BAC.*percent|\.08|\.02.*DUI|DUI.*BAC/i.test(q.text));
  const duiQs = qs.filter(q => /driving under the influence|DUI.*convict|convict.*DUI|DUI.*penalty|DUI.*fine|DUI.*jail|DUI.*suspend/i.test(q.text));

  // Pick 8 most distinct BAC questions
  const bacKeepIds = bacQs.slice(0, 8).map(q => q.id);
  bacKeepIds.forEach(id => keepBac.add(id));

  // Pick 8 most distinct DUI questions  
  const duiKeepIds = duiQs.slice(0, 8).map(q => q.id);
  duiKeepIds.forEach(id => keepDui.add(id));

  // speed:max (27) → keep 5
  const maxSpeedQs = qs.filter(q => /maximum.*speed.*Pennsylvania|PA.*maximum.*speed|70 mph|max.*speed.*PA|interstate.*speed.*PA/i.test(q.text));
  const keepMaxSpeed = new Set(maxSpeedQs.slice(0, 5).map(q => q.id));

  // speed:school-zone (19) → keep 4
  const schoolQs = qs.filter(q => /school zone.*speed|speed.*school zone/i.test(q.text));
  const keepSchool = new Set(schoolQs.slice(0, 4).map(q => q.id));

  // speed:following (16) → keep 5
  const followQs = qs.filter(q => /following distance|4.second|four.second/i.test(q.text));
  const keepFollow = new Set(followQs.slice(0, 5).map(q => q.id));

  // row:pedestrian (13) → keep 6
  const pedQs = qs.filter(q => /pedestrian.*crosswalk|yield.*pedestrian|pedestrian.*yield/i.test(q.text));
  const keepPed = new Set(pedQs.slice(0, 6).map(q => q.id));

  // row:school-bus (9) → keep 5
  const busQs = qs.filter(q => /school bus.*stop|stop.*school bus/i.test(q.text));
  const keepBus = new Set(busQs.slice(0, 5).map(q => q.id));

  // row:emergency (19) → keep 6
  const emergQs = qs.filter(q => /emergency vehicle|move over/i.test(q.text));
  const keepEmerg = new Set(emergQs.slice(0, 6).map(q => q.id));

  // safe:park-railroad (10) → keep 4
  const parkRailQs = qs.filter(q => /railroad.*park|park.*railroad/i.test(q.text));
  const keepParkRail = new Set(parkRailQs.slice(0, 4).map(q => q.id));

  // safe:texting (11) → keep 4
  const textQs = qs.filter(q => /texting|text.*drive/i.test(q.text));
  const keepText = new Set(textQs.slice(0, 4).map(q => q.id));

  // alcohol:chemical-test (10) → keep 4
  const chemQs = qs.filter(q => /chemical test|implied consent/i.test(q.text));
  const keepChem = new Set(chemQs.slice(0, 4).map(q => q.id));

  // license:learner-permit (20) → keep 6
  const learnerQs = qs.filter(q => /learner.*permit/i.test(q.text));
  const keepLearner = new Set(learnerQs.slice(0, 6).map(q => q.id));

  // license:junior-license (19) → keep 8 (complex PA rules)
  const juniorQs = qs.filter(q => /junior.*licen|junior driver/i.test(q.text));
  const keepJunior = new Set(juniorQs.slice(0, 8).map(q => q.id));

  // signs:warning (12) → keep 6
  const warnQs = qs.filter(q => /yellow.*diamond|warning sign/i.test(q.text));
  const keepWarn = new Set(warnQs.slice(0, 6).map(q => q.id));

  // Build delete list
  const toDelete = new Set();
  const pairs = [
    [bacQs.map(q=>q.id), keepBac],
    [duiQs.map(q=>q.id), keepDui],
    [maxSpeedQs.map(q=>q.id), keepMaxSpeed],
    [schoolQs.map(q=>q.id), keepSchool],
    [followQs.map(q=>q.id), keepFollow],
    [pedQs.map(q=>q.id), keepPed],
    [busQs.map(q=>q.id), keepBus],
    [emergQs.map(q=>q.id), keepEmerg],
    [parkRailQs.map(q=>q.id), keepParkRail],
    [textQs.map(q=>q.id), keepText],
    [chemQs.map(q=>q.id), keepChem],
    [learnerQs.map(q=>q.id), keepLearner],
    [juniorQs.map(q=>q.id), keepJunior],
    [warnQs.map(q=>q.id), keepWarn],
  ];

  for (const [ids, keep] of pairs) {
    for (const id of ids) {
      if (!keep.has(id)) toDelete.add(id);
    }
  }

  const deleteArr = [...toDelete];
  console.log(`Deleting ${deleteArr.length} over-tested questions...`);

  if (deleteArr.length > 0) {
    const choices = await p.choice.findMany({
      where: { questionId: { in: deleteArr } },
      select: { id: true },
    });
    const choiceIds = choices.map(c => c.id);
    await p.answer.deleteMany({ where: { choiceId: { in: choiceIds } } });
    await p.$transaction([
      p.answer.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.userProgress.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.questionTranslation.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.choice.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.question.deleteMany({ where: { id: { in: deleteArr } } }),
    ]);
  }

  console.log('Trim complete.\n');
}

async function main() {
  await fillMissingGaps();
  await trim();

  const final = await p.question.count({ where: { stateId: PA } });
  console.log(`Final PA question count: ${final}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
