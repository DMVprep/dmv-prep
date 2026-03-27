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

// ── STEP 1: ADD MISSING GAP QUESTIONS ────────────────────────────────────────

async function fillGaps() {
  console.log('Adding missing gap questions...');

  const questions = [
    // alcohol:agg-dwi (3 questions)
    {
      stateId: NY, topicId: T.alcohol,
      text: 'What BAC level constitutes Aggravated DWI (Agg-DWI) in New York?',
      explanation: 'A BAC of .18 or higher constitutes Aggravated DWI in New York, which carries harsher penalties than standard DWI.',
      choices: { create: [
        { text: '.08% or higher', isCorrect: false },
        { text: '.15% or higher', isCorrect: false },
        { text: '.18% or higher', isCorrect: true },
        { text: '.20% or higher', isCorrect: false },
      ]},
    },
    {
      stateId: NY, topicId: T.alcohol,
      text: 'What is the minimum fine for a first Aggravated DWI conviction in New York?',
      explanation: 'A first Aggravated DWI conviction carries a fine of $1,000 to $2,500 and a minimum one-year license revocation.',
      choices: { create: [
        { text: '$500', isCorrect: false },
        { text: '$1,000', isCorrect: true },
        { text: '$2,500', isCorrect: false },
        { text: '$5,000', isCorrect: false },
      ]},
    },
    {
      stateId: NY, topicId: T.alcohol,
      text: 'How does a first Aggravated DWI conviction differ from a standard first DWI in New York?',
      explanation: 'Aggravated DWI (.18 BAC or higher) carries higher fines ($1,000-$2,500 vs $500-$1,000) and a longer minimum revocation (1 year vs 6 months) compared to standard DWI.',
      choices: { create: [
        { text: 'There is no difference — both are treated the same', isCorrect: false },
        { text: 'Higher fines and longer minimum license revocation', isCorrect: true },
        { text: 'Only the fine is higher — revocation period is the same', isCorrect: false },
        { text: 'Aggravated DWI results in automatic jail time, standard does not', isCorrect: false },
      ]},
    },

    // license:new-resident (3 questions)
    {
      stateId: NY, topicId: T.license,
      text: 'A new New York State resident must obtain a New York driver license within how many days of establishing residency?',
      explanation: 'New residents must apply for a New York driver license within 30 days of becoming a permanent resident of New York State.',
      choices: { create: [
        { text: '10 days', isCorrect: false },
        { text: '30 days', isCorrect: true },
        { text: '60 days', isCorrect: false },
        { text: '90 days', isCorrect: false },
      ]},
    },
    {
      stateId: NY, topicId: T.license,
      text: 'You recently moved to New York from another state and have a valid out-of-state license. What must you do?',
      explanation: 'New residents with a valid out-of-state license must surrender it and obtain a New York license within 30 days of establishing residency.',
      choices: { create: [
        { text: 'Your out-of-state license is valid indefinitely in New York', isCorrect: false },
        { text: 'Surrender your out-of-state license and get a NY license within 30 days', isCorrect: true },
        { text: 'Apply within 10 days or face a fine', isCorrect: false },
        { text: 'You have 90 days to exchange your license', isCorrect: false },
      ]},
    },
    {
      stateId: NY, topicId: T.license,
      text: 'A new resident of New York State from a foreign country (other than Canada) must do which of the following to get a NY driver license?',
      explanation: 'New residents from foreign countries (other than Canada) must pass the vision test, complete the safe driving course, surrender their foreign license, and pass both written and road tests.',
      choices: { create: [
        { text: 'Only take the vision test — foreign license is automatically accepted', isCorrect: false },
        { text: 'Pass vision test, complete safe driving course, and pass written and road tests', isCorrect: true },
        { text: 'Only pass the written test — no road test required', isCorrect: false },
        { text: 'Wait 6 months before applying for a NY license', isCorrect: false },
      ]},
    },
  ];

  let added = 0;
  for (const q of questions) {
    await p.question.create({ data: q });
    added++;
  }
  console.log(`Added ${added} gap questions.\n`);
}

// ── STEP 2: SECOND TRIM PASS ──────────────────────────────────────────────────

async function secondTrim() {
  console.log('Running second trim pass...');

  // Fetch current questions for over-tested concepts
  const qs = await p.question.findMany({
    where: { stateId: NY },
    select: { id: true, text: true },
  });

  // speed:nyc (13) → keep 6: 25mph rule, NYC exception, right-on-red NYC, comparison
  const nycKeep = new Set([
    'cmms0gwgy0551f74ys3we5rhy', // speed limit NYC no sign → 25 MPH
    'cmms0is1n05bnf74yt5o90xfw', // NYC max speed unless posted → 25 MPH
    'cmms1fryk06tbf74yo4iirbic', // when legal exceed 25 in NYC → never unless posted
    'cmms1ftzk06w1f74y8he4g69p', // unposted rural vs NYC → 30 MPH faster
    'cmn3ff36o023j97ugb4qgv6qb', // primary diff NYC vs rest → 25 vs 55
    'cmn3fgfmc027p97ugfu79lb95', // why right on red prohibited NYC → pedestrians
  ]);
  const nycIds = qs.filter(q =>
    /new york city|NYC|25 mph|right.*red.*city|city.*right.*red/i.test(q.text) &&
    !/aggravated|BAC|DWI|junior|learner|following|pedestrian|school bus|emergency|railroad|parallel|hydrant|crosswalk|insurance|address|point system|knowledge test/i.test(q.text)
  ).map(q => q.id);

  // speed:default (23) → keep 5
  const defaultKeep = new Set([
    'cmms0gx0d055tf74y4fq5m8o6', // default no sign outside NYC → 55 MPH
    'cmms0n77h05npf74ymemss746', // no limit posted NY → 55 MPH
    'cmms1dk6c06qlf74yt5gk7n9p', // when legal 55 → no posted limit
    'cmn3fd3js01tv97ug3me3xmia', // Albany residential no sign → 55 mph
    'cmn3fe2cy020797ugim4o9ch7', // Bronx city street no sign → 25 mph
  ]);
  const defaultIds = qs.filter(q =>
    /55 mph|no.*posted.*speed|default.*speed|speed.*no.*sign|unposted/i.test(q.text) &&
    !/NYC|new york city|school zone|following|work zone|fog|rain|snow|weather|basic speed/i.test(q.text)
  ).map(q => q.id);

  // speed:following (11) → keep 4
  const followingKeep = new Set([
    'cmms0u0ux065lf74yatkbqces', // proper following distance → 2-second rule
    'cmn3fgeo7026p97ugxxtlzi6t', // describes 2-second rule → count 2 seconds
    'cmn3fgfri027v97ugfzf9a8jr', // safety purpose following distance → reaction time
    'cmn3fildb02e197ugin81w2ih', // following motorcycle → greater than 2-second
  ]);
  const followingIds = qs.filter(q =>
    /following distance|2.second|two.second|space cushion/i.test(q.text)
  ).map(q => q.id);

  // row:pedestrian (18) → keep 6
  const pedKeep = new Set([
    'cmms0q2ki05vvf74y430opf5q', // right turn pedestrian crosswalk → yield
    'cmn3fatkh01mp97ug0f3z46uu', // blind pedestrian white cane → complete stop
    'cmn3fbvqr01q797ug4t9fuupm', // pedestrian outside crosswalk → driver must avoid
    'cmn3fbvx801qd97ugv3lsdqkg', // right turn pedestrian approaching → wait
    'cmn3fbyj101sp97ugn9ug7jco', // green light left turn pedestrian → after pedestrians clear
    'cmn3fijza02cp97ug1m9izfn2', // pedestrian in crosswalk → yield ROW
  ]);
  const pedIds = qs.filter(q =>
    /pedestrian.*crosswalk|crosswalk.*pedestrian|yield.*pedestrian|pedestrian.*yield|blind.*pedestrian|white cane|guide dog.*corner/i.test(q.text)
  ).map(q => q.id);

  // row:emergency (11) → keep 5
  const emergencyKeep = new Set([
    'cmms0q19g05ubf74y5p96e3bn', // emergency approaching from behind → pull right stop
    'cmn3fatth01n197ugz8ryll7o', // Move Over passing stopped → move or 20 below
    'cmn3fbwld01r197ugmuyufhey', // cannot move over → slow 20 below
    'cmn3fbyo401sv97ug9b10cvtt', // divided highway stopped emergency → 20 below
    'cmn3fhgrg029d97uguollvoor', // emergency vehicle from behind → pull right stop
  ]);
  const emergencyIds = qs.filter(q =>
    /emergency vehicle|move over.*law|move over.*sign/i.test(q.text)
  ).map(q => q.id);

  // alcohol:bac (22) → keep 6 (many overlap with dwi)
  const bacKeep = new Set([
    'cmn3fkbk002hd97ugl5lduxdm', // Agg DWI BAC → .18
    'cmn3fla7v02kv97ugudn0prvh', // max BAC for DWAI → .07
    'cmn3fladw02l197ugb1ov1tqn', // under 21 zero tolerance → .02
    'cmn3flbf602lv97ug90vbyxmd', // BAC begins impair → .05
    'cmn3fla2t02kp97ugjix9bl04', // min BAC standard DWI → .08
    'cmn3fkcuq02iv97uge1k0e4rz', // factor NOT affecting BAC → hair color
  ]);
  const bacIds = qs.filter(q =>
    /blood alcohol|BAC.*level|BAC.*percent|\.08|\.07|\.05|\.02.*BAC|BAC.*\.02/i.test(q.text) &&
    !/aggravated|DWI.*fine|DWI.*jail|DWI.*revoc|lookback|ignition|conditional|plea|checkp|CDL.*DWI|probation.*DWI|field sobriety|implied consent|Leandra/i.test(q.text)
  ).map(q => q.id);

  // alcohol:dwi (9) → keep 8 (just barely over — remove 1 most redundant)
  const dwiKeep = new Set([
    'cmn3fkbz302hv97ugxsmrezxj', // max fine first DWI → $1,000
    'cmn3fkc4402i197uggheqvtqh', // revocation first DWI → at least 6 months
    'cmn3fla2t02kp97ugjix9bl04', // min BAC standard DWI → .08
    'cmn3fmeyh02nv97ug61yutiez', // second DWI → $5,000 and 18-month rev
    'cmn3fmf3302o197ugoxm3spfa', // after DWI → ignition interlock
    'cmn3fmfba02o797ugqbelobz1', // lookback period → 10 years
    'cmn3fmh1v02q797ug4qfbqt0h', // child under 16 → Leandra's Law felony
    'cmn3fna7602s797ug43j6jjkm', // refuse chemical test → revocation + $500
  ]);
  const dwiIds = qs.filter(q =>
    /driving while intoxicated|DWI.*convict|convict.*DWI|first.*DWI|DWI.*first|DWI.*fine|DWI.*jail|DWI.*revoc/i.test(q.text)
  ).map(q => q.id);

  // license:junior-license (14) → keep 8
  const juniorKeep = new Set([
    'cmn3fo16l02u797ug1ve143rm', // nighttime curfew → 9 PM to 5 AM
    'cmn3fo1em02ud97ugoxttfrur', // max passengers under 21 → one
    'cmn3fo2f402vp97ug36x532mh', // min age junior license → 16.5
    'cmn3fo2tf02w797ugvp3exqj8', // who exempt from passenger limit → family
    'cmn3fo37502wp97ugdxf3yxb1', // full license without junior → 18
    'cmn3foy2m02x797ugeyn7tlar', // friends under 21 → 1 passenger
    'cmn3foybi02xd97ug2no08wvr', // restriction begins → 9:00 PM
    'cmn3foyp802xv97ugoi2pcwb9', // drive after 9 PM for work → work exemption
  ]);
  const juniorIds = qs.filter(q =>
    /junior.*licen|class DJ|class MJ|nighttime.*junior|junior.*nighttime|junior.*passenger|passenger.*junior/i.test(q.text)
  ).map(q => q.id);

  // license:points (16) → keep 5
  const pointsKeep = new Set([]);
  // Fetch point system questions to pick best 5
  const pointQs = qs.filter(q =>
    /point system|11 point|18 month.*point|point.*suspension|speeding.*point|reckless.*point|cell.*point|school bus.*point/i.test(q.text)
  );
  // Pick 5 best covering: threshold, reduction, speeding points, cell phone points, school bus points
  const pointsToKeep = pointQs.slice(0, 5).map(q => q.id);
  pointsToKeep.forEach(id => pointsKeep.add(id));
  const pointIds = pointQs.map(q => q.id);

  // Build delete list
  const toDelete = new Set();
  const conceptPairs = [
    [nycIds, nycKeep],
    [defaultIds, defaultKeep],
    [followingIds, followingKeep],
    [pedIds, pedKeep],
    [emergencyIds, emergencyKeep],
    [bacIds, bacKeep],
    [dwiIds, dwiKeep],
    [juniorIds, juniorKeep],
    [pointIds, pointsKeep],
  ];

  for (const [ids, keep] of conceptPairs) {
    for (const id of ids) {
      if (!keep.has(id)) toDelete.add(id);
    }
  }

  const deleteArr = [...toDelete];
  console.log(`Deleting ${deleteArr.length} questions...`);

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

  console.log(`Done.\n`);
}

async function main() {
  await fillGaps();
  await secondTrim();

  const final = await p.question.count({ where: { stateId: NY } });
  console.log(`Final NY question count: ${final}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
