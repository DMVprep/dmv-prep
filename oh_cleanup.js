const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntrsd000y3jd6z8mny40a';
const TOPIC = {
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
  console.log('=== OH REDUNDANCY CLEANUP ===\n');

  // ── DELETE: near-duplicate implied consent questions (keep one, delete other)
  // cmn3h2xrb and cmn3h5pdt ask essentially the same thing
  // Also miscategorized as open-container — they're implied consent questions
  console.log('--- Deleting near-duplicate implied consent questions ---');
  await deleteQuestions(['cmn3h5pdt07pj97ugwvhk1n8x']); // dup of cmn3h2xrb

  // ── DELETE: over-represented physical control questions (keep 1, delete 4)
  // cmn3h2xik, cmn3h3xm0, cmn3h4y93, cmn3h5pwe — keep cmn3h3xm0 (clearest), delete rest
  console.log('--- Trimming physical control questions (6 → 1) ---');
  await deleteQuestions([
    'cmn3h2xik07gp97ughrcuew3v',  // "in or on a vehicle even if parked" — redundant
    'cmn3h4y9307md97ug9767rnea',  // "keys outside vehicle" — too niche
    'cmn3h5pwe07q797ug2p73rr8g',  // near-dup of cmn3h3xm0
  ]);

  // ── DELETE: over-represented ignition interlock questions (keep 1, delete 3)
  // cmn3h2y0c, cmn3h3yjr, cmn3h4zt0, cmn3h4zy0 — keep cmn3h2y0c (high test penalty), delete rest
  console.log('--- Trimming ignition interlock questions (4 → 1) ---');
  await deleteQuestions([
    'cmn3h3yjr07kj97ugg3gu6u4o',  // dup "one year minimum" interlock
    'cmn3h4zt007o797ugj6lh00ib',  // "no violations during period" — too niche
    'cmn3h4zy007od97ug77y2as9q',  // "tampering with interlock" — too niche
  ]);

  // ── DELETE: over-represented driver intervention program questions (keep 1, delete 1)
  // cmn3h2xmy and cmn3h4xom are both about the 72-hour DIP
  console.log('--- Trimming driver intervention program questions (2 → 1) ---');
  await deleteQuestions(['cmn3h4xom07lp97ug511bi67t']); // dup — "72 hours" same fact

  // ── DELETE: minimum wait for occupational privileges — very niche, low test value
  console.log('--- Deleting niche OVI sub-questions ---');
  await deleteQuestions([
    'cmn3h4xth07lv97uge6eri1lk',  // "15 days wait for occupational privileges" — too niche
  ]);

  // ── ADD: better open-container question (replace the miscategorized ones)
  console.log('\n--- Adding proper open-container question ---');
  await addQuestion(TOPIC.ALCOHOL,
    'In Ohio, is it legal for a passenger to drink an open alcoholic beverage while riding in a vehicle?',
    'Ohio law prohibits having an open container of alcohol in the passenger compartment of a vehicle.',
    [
      { text: 'Yes, only the driver is prohibited from drinking', isCorrect: false },
      { text: 'Yes, if the vehicle is parked', isCorrect: false },
      { text: 'No — open containers of alcohol are prohibited in the passenger area', isCorrect: true },
      { text: 'Yes, passengers over 21 may drink if the driver is sober', isCorrect: false },
    ]
  );

  // ── ADD: OVI vs DUI terminology question (Ohio-specific — called OVI not DUI)
  await addQuestion(TOPIC.ALCOHOL,
    'What does OVI stand for in Ohio, and how does it differ from the term DUI used in other states?',
    'Ohio uses OVI (Operating a Vehicle Impaired) instead of DUI. It applies to operating any vehicle — not just automobiles — while impaired.',
    [
      { text: 'OVI means "Ohio Vehicle Infraction" and is a lesser charge than DUI', isCorrect: false },
      { text: 'OVI stands for Operating a Vehicle Impaired — Ohio\'s term for what other states call DUI', isCorrect: true },
      { text: 'OVI only applies to commercial drivers; regular drivers face DUI charges', isCorrect: false },
      { text: 'OVI and DUI are identical terms used interchangeably in Ohio law', isCorrect: false },
    ]
  );

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  console.log(`\n=== CLEANUP COMPLETE ===`);
  console.log(`Final count: ${finalCount}`);

  // Quick alcohol topic count
  const alcoholCount = await p.question.count({ where: { stateId: STATE_ID, topicId: TOPIC.ALCOHOL } });
  console.log(`Alcohol & Substances: ${alcoholCount}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
