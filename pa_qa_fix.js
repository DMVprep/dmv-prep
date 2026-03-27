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

// ── STEP 1: FIX ERRORS ───────────────────────────────────────────────────────

async function fixErrors() {
  console.log('Fixing errors...');

  // Error 1: School zone speed — answer says "Highway: 70 mph, School zone: 15 mph, Residential: 25 mph"
  // The school zone part (15 mph) is CORRECT. The residential part (25 mph) might be wrong but
  // this is a combo answer — the question asks about multiple zones. PA residential is 25 mph
  // per local ordinance — actually the handbook doesn't specify a statewide residential limit
  // beyond the general "posted limit" rule. Let's check — the answer includes 15 mph for school
  // zone which IS correct. The issue is the answer choice was flagged for containing "15 mph"
  // matching wrong_answer_pattern /20 mph|25 mph/ — wait, the wrong answer is the full choice text
  // "Highway: 70 mph, School zone: 15 mph, Residential: 25 mph"
  // The school zone IS 15 mph — this is actually CORRECT. The scanner false-positived because
  // the choice text contains "25 mph" for residential.
  // Skip this one — it's a false positive.
  console.log('Skipping error 1 — "15 mph school zone" in combo answer is correct');

  // Error 2: PA interstate max speed — "65 mph" → "70 mph"
  await p.choice.update({
    where: { id: 'cmmsas4qb00beneslkvrbvdmr' },
    data: { text: 'Highway: 70 mph, School zone: 15 mph, Residential: 25 mph' }
  });
  // Wait — that's error 1 not 2. Let me re-check:
  // Error 2: cmn3fvde203j897ugp1rhzagd — "65 mph" for interstate max speed → should be "70 mph"
  await p.choice.update({
    where: { id: 'cmn3fvde203j897ugp1rhzagd' },
    data: { text: '70 mph' }
  });
  console.log('Fixed: PA interstate max speed 65→70 mph');

  // Error 3: Rural roads comparison — "Rural roads are 30 mph faster (55 mph vs 25 mph)"
  // Max PA speed is 70, not 55. The comparison is wrong.
  await p.choice.update({
    where: { id: 'cmn3fvesq03kq97ugnvkti8is' },
    data: { text: 'Rural roads can be up to 45 mph faster (70 mph vs 25 mph)' }
  });
  console.log('Fixed: Rural roads comparison corrected to 70 mph max');

  // Error 4: Commercial driver — "Rural zones at 55 mph" → should be 70 mph max
  await p.choice.update({
    where: { id: 'cmn3fvflg03lk97ugkw18elh4' },
    data: { text: 'Rural zones up to 70 mph' }
  });
  console.log('Fixed: Commercial driver rural zone 55→70 mph');

  // Error 5: Junior license curfew after first 6 months — "Midnight to 5 AM" → should be "11 PM to 5 AM"
  // Note: The curfew doesn't change after 6 months — it's always 11 PM to 5 AM.
  // The question asks about "after first 6 months" — the answer should clarify the curfew stays 11 PM.
  // After 6 months, the passenger restriction loosens (1→3), but curfew stays 11 PM to 5 AM.
  await p.choice.update({
    where: { id: 'cmn3g52f404gq97ug93ciwnpo' },
    data: { text: '11 PM to 5 AM (curfew unchanged, but non-family passenger limit increases to 3)' }
  });
  console.log('Fixed: Junior license curfew midnight→11 PM');

  console.log('Error fixes complete.\n');
}

// ── STEP 2: DELETE DUPLICATES ─────────────────────────────────────────────────

async function deleteDuplicates() {
  console.log('Deleting duplicates...');

  const duplicateIds = [
    'cmn3frb9y036v97ugu1zym06u', // DO NOT ENTER sign
    'cmn3frbfl037197ugkwjh90vy', // WRONG WAY sign
    'cmn3frbqj037d97ughyqncl05', // SLIPPERY WHEN WET sign
    'cmn3frc5t037v97ugryqk2pvj', // ONE WAY sign
    'cmn3frru8039197ug2aizqadc', // highway guide signs color
    'cmn3fuhtr03i797ugpg76rikz', // exiting roundabout yield
    'cmn3g07dd03y197ugmy45c9ed', // dim high beams distance oncoming
    'cmn3g07u003yj97ugv4znvlns', // child restraint age/weight
    'cmn3g07z903yp97ugm9svzt3b', // park from fire hydrant
    'cmn3g084p03yv97ugvwv0sdzu', // park from crosswalk
    'cmn3g08ap03z197ugo32jrb6o', // handheld cell phones
    'cmn3g08gf03z797ugyymf95v3', // texting law
    'cmn3g08m603zd97ugl782t3jw', // when to use turn signals
    'cmn3g08ro03zj97uggwev44p2', // windshield wipers headlights
    'cmn3g08x303zp97ugjxkyn0yk', // calculate following distance
    'cmn3g092h03zv97ugugji46ob', // purpose of dimming high beams
    'cmn3g0985040197ugw2j5c293', // child passenger safety
    'cmn3g09dr040797ug8djh8kqo', // purpose of following distance
    'cmn3g2gce047797ugpvilcdaf', // max jail first highest BAC DUI
    'cmn3g51e304fj97ugjfi9hzoy', // knowledge test questions
  ];

  const choices = await p.choice.findMany({
    where: { questionId: { in: duplicateIds } },
    select: { id: true },
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
  console.log(`Deleted ${duplicateIds.length} duplicates.\n`);
}

// ── STEP 3: FILL GAPS ────────────────────────────────────────────────────────

function q(topicId, text, explanation, choices) {
  return { stateId: PA, topicId, text, explanation, choices: { create: choices } };
}

async function fillGaps() {
  console.log('Adding gap-filling questions...');

  const questions = [

    // ── speed:signal-distance ────────────────────────────────────────────────
    q(T.speed, 'In Pennsylvania, how far before a turn must you signal if traveling less than 35 mph?',
      'Pennsylvania law requires signaling at least 100 feet before a turn when traveling less than 35 mph, and at least 300 feet before a turn when traveling 35 mph or more.',
      [
        { text: '50 feet', isCorrect: false },
        { text: '100 feet', isCorrect: true },
        { text: '200 feet', isCorrect: false },
        { text: '300 feet', isCorrect: false },
      ]),

    q(T.speed, 'In Pennsylvania, how far before a turn must you signal if traveling 35 mph or more?',
      'When driving 35 mph or more, Pennsylvania law requires you to signal at least 300 feet before turning. At speeds below 35 mph, 100 feet is required.',
      [
        { text: '100 feet', isCorrect: false },
        { text: '200 feet', isCorrect: false },
        { text: '300 feet', isCorrect: true },
        { text: '500 feet', isCorrect: false },
      ]),

    q(T.safe, 'You are driving 40 mph in Pennsylvania and preparing to turn. When must you activate your turn signal?',
      'At 35 mph or more, Pennsylvania requires signaling at least 300 feet before the turn. Since 40 mph exceeds 35 mph, 300 feet applies.',
      [
        { text: 'At least 100 feet before the turn', isCorrect: false },
        { text: 'At least 200 feet before the turn', isCorrect: false },
        { text: 'At least 300 feet before the turn', isCorrect: true },
        { text: 'Just as you enter the turn', isCorrect: false },
      ]),

    // ── safe:parallel-park ───────────────────────────────────────────────────
    q(T.safe, 'When parallel parking in Pennsylvania, how far from the curb must your vehicle be?',
      'Pennsylvania law requires your vehicle to be parked no more than 12 inches from the curb when parallel parking.',
      [
        { text: 'No more than 6 inches', isCorrect: false },
        { text: 'No more than 12 inches', isCorrect: true },
        { text: 'No more than 18 inches', isCorrect: false },
        { text: 'No more than 24 inches', isCorrect: false },
      ]),

    q(T.safe, 'When parking on a downhill grade with a curb in Pennsylvania, how should you turn your front wheels?',
      'When parking downhill with a curb, turn your front wheels toward the curb (to the right). This prevents the vehicle from rolling into traffic if brakes fail.',
      [
        { text: 'Away from the curb (to the left)', isCorrect: false },
        { text: 'Straight ahead', isCorrect: false },
        { text: 'Toward the curb (to the right)', isCorrect: true },
        { text: 'It does not matter on a downhill', isCorrect: false },
      ]),

    q(T.safe, 'When parking uphill with a curb in Pennsylvania, how should you turn your front wheels?',
      'When parking uphill with a curb, turn your front wheels away from the curb (to the left). If brakes fail, the vehicle will roll back into the curb rather than into traffic.',
      [
        { text: 'Toward the curb (to the right)', isCorrect: false },
        { text: 'Straight ahead', isCorrect: false },
        { text: 'Away from the curb (to the left)', isCorrect: true },
        { text: 'It does not matter on an uphill', isCorrect: false },
      ]),

    // ── safe:bike-passing ────────────────────────────────────────────────────
    q(T.safe, 'When passing a bicycle in Pennsylvania, how much clearance must you allow between your vehicle and the bicycle?',
      'Pennsylvania\'s Safe Passing Law requires motorists to allow at least 4 feet of clearance between their vehicle and a bicycle when passing.',
      [
        { text: '2 feet', isCorrect: false },
        { text: '3 feet', isCorrect: false },
        { text: '4 feet', isCorrect: true },
        { text: '6 feet', isCorrect: false },
      ]),

    q(T.safe, 'Under Pennsylvania\'s Safe Passing Law, are you permitted to cross a double yellow center line to pass a bicycle?',
      'Yes. Pennsylvania law permits crossing double yellow lines to maintain the required 4-foot clearance when passing a bicycle, if it can be done safely.',
      [
        { text: 'No — double yellow lines can never be crossed', isCorrect: false },
        { text: 'Yes — if necessary to maintain 4 feet of clearance and it is safe to do so', isCorrect: true },
        { text: 'Only on roads with a speed limit under 35 mph', isCorrect: false },
        { text: 'Only if the cyclist signals you to pass', isCorrect: false },
      ]),

    // ── safe:hydroplane ──────────────────────────────────────────────────────
    q(T.safe, 'What is hydroplaning and at what speed can it begin to occur in Pennsylvania?',
      'Hydroplaning occurs when tires lose grip on the road and ride on a film of water. It can begin at speeds as low as 35 mph when there is as little as 1/10 inch of water on the road.',
      [
        { text: 'Losing traction on ice; begins at 20 mph', isCorrect: false },
        { text: 'Tires riding on a film of water; can begin at 35 mph', isCorrect: true },
        { text: 'Skidding in loose gravel; begins at 45 mph', isCorrect: false },
        { text: 'Tires losing air pressure; begins at 55 mph', isCorrect: false },
      ]),

    q(T.safe, 'If your vehicle begins to hydroplane in Pennsylvania, what should you do?',
      'When hydroplaning, keep both hands on the wheel, slowly take your foot off the gas, and brake gently if needed. Do not slam the brakes or turn sharply, as this causes skidding.',
      [
        { text: 'Brake hard to stop the vehicle quickly', isCorrect: false },
        { text: 'Accelerate to push through the water', isCorrect: false },
        { text: 'Ease off the gas and steer gently; brake gently if needed', isCorrect: true },
        { text: 'Turn the steering wheel sharply to regain traction', isCorrect: false },
      ]),

    // ── license:new-resident ─────────────────────────────────────────────────
    q(T.license, 'A person who moves to Pennsylvania and holds a valid out-of-state driver license must obtain a Pennsylvania license within how many days?',
      'New Pennsylvania residents who hold a valid driver license from another state must obtain a Pennsylvania driver license within 60 days of establishing residency.',
      [
        { text: '30 days', isCorrect: false },
        { text: '60 days', isCorrect: true },
        { text: '90 days', isCorrect: false },
        { text: '120 days', isCorrect: false },
      ]),

    q(T.license, 'You just moved to Pennsylvania from Ohio with a valid Ohio driver license. What must you do?',
      'New Pennsylvania residents must surrender their out-of-state license and obtain a Pennsylvania driver license within 60 days of establishing residency.',
      [
        { text: 'Your Ohio license is valid indefinitely in Pennsylvania', isCorrect: false },
        { text: 'Get a PA license within 30 days', isCorrect: false },
        { text: 'Surrender your Ohio license and get a PA license within 60 days', isCorrect: true },
        { text: 'You have 90 days to exchange your license', isCorrect: false },
      ]),

    // ── license:address-change ───────────────────────────────────────────────
    q(T.license, 'Within how many days must you notify PennDOT of a change of address in Pennsylvania?',
      'Pennsylvania law requires you to notify PennDOT within 15 days of any change in name or address. You can report it online at dmv.pa.gov or by calling 717-412-5300.',
      [
        { text: '10 days', isCorrect: false },
        { text: '15 days', isCorrect: true },
        { text: '30 days', isCorrect: false },
        { text: '60 days', isCorrect: false },
      ]),

    q(T.license, 'You moved to a new address in Pennsylvania. How can you notify PennDOT and what is the deadline?',
      'You must notify PennDOT within 15 days of an address change. You can report it online at dmv.pa.gov or by phone at 717-412-5300.',
      [
        { text: 'Within 30 days — in person at a driver license center', isCorrect: false },
        { text: 'Within 15 days — online at dmv.pa.gov or by phone', isCorrect: true },
        { text: 'Within 60 days — by certified mail only', isCorrect: false },
        { text: 'At your next license renewal', isCorrect: false },
      ]),

    // ── license:texting-fine ─────────────────────────────────────────────────
    q(T.license, 'What is the fine for violating Pennsylvania\'s anti-texting law while driving?',
      'Pennsylvania\'s anti-texting law, which went into effect March 8, 2012, carries a $50 fine for violations. It is a primary, summary offense.',
      [
        { text: '$25', isCorrect: false },
        { text: '$50', isCorrect: true },
        { text: '$100', isCorrect: false },
        { text: '$200', isCorrect: false },
      ]),

    q(T.license, 'In Pennsylvania, texting while driving is classified as what type of offense?',
      'Under Pennsylvania law, texting while driving is a primary, summary offense with a $50 fine. This means police can pull you over solely for texting.',
      [
        { text: 'A misdemeanor with up to $500 fine', isCorrect: false },
        { text: 'A secondary offense — only ticketed with another violation', isCorrect: false },
        { text: 'A primary summary offense with a $50 fine', isCorrect: true },
        { text: 'Only a warning for first offense', isCorrect: false },
      ]),

    // ── signs:railroad ───────────────────────────────────────────────────────
    q(T.signs, 'What shape is the advance railroad crossing warning sign in Pennsylvania?',
      'Railroad advance warning signs are round (circular) with a yellow background and black letters "RR" and an "X" symbol. This shape is used exclusively for railroad crossing warnings.',
      [
        { text: 'Diamond', isCorrect: false },
        { text: 'Pentagon', isCorrect: false },
        { text: 'Round (circular)', isCorrect: true },
        { text: 'Rectangle', isCorrect: false },
      ]),

    q(T.signs, 'You see a round yellow sign with an X and the letters RR on a Pennsylvania road. What does it mean?',
      'This is a railroad advance warning sign. A railroad crossing is ahead. Slow down, look and listen for trains, and be prepared to stop.',
      [
        { text: 'Road repair ahead', isCorrect: false },
        { text: 'Railroad crossing ahead — slow down and prepare to stop', isCorrect: true },
        { text: 'Restricted road — no trucks', isCorrect: false },
        { text: 'Rest area one mile ahead', isCorrect: false },
      ]),

    q(T.signs, 'In Pennsylvania, the railroad crossbuck sign (X-shaped sign at the crossing) should be treated like what type of sign?',
      'Per the PA Driver\'s Manual, you should treat the railroad crossbuck sign as a YIELD sign: slow down and prepare to stop if you see or hear a train approaching.',
      [
        { text: 'A stop sign — always come to a complete stop', isCorrect: false },
        { text: 'A yield sign — slow down and stop only if a train is approaching', isCorrect: true },
        { text: 'A warning sign — just slow down slightly', isCorrect: false },
        { text: 'An informational sign — no action required', isCorrect: false },
      ]),

  ];

  let added = 0;
  for (const qData of questions) {
    await p.question.create({ data: qData });
    added++;
  }
  console.log(`Added ${added} gap-filling questions.\n`);
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  await fixErrors();
  await deleteDuplicates();
  await fillGaps();

  const count = await p.question.count({ where: { stateId: PA } });
  console.log(`Final PA question count: ${count}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
