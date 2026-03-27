const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATE_ID = 'cmmpntrsd000y3jd6z8mny40a';
const TOPIC = {
  ALCOHOL:  'cmn2ia2ei0000ua6cuap3rywt',
};

function cuid() {
  const ts = Date.now().toString(36);
  const rand = () => Math.random().toString(36).slice(2, 8);
  return `c${ts}${rand()}${rand()}`;
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
  console.log('=== OH FINAL PAD ===\n');

  // Add 5 solid, distinct alcohol questions to bring total to ~323
  await addQuestion(TOPIC.ALCOHOL,
    'What is the minimum license suspension for a first OVI conviction in Ohio?',
    'A first OVI conviction in Ohio carries a minimum license suspension of 90 days.',
    [{ text: '30 days', isCorrect: false },{ text: '60 days', isCorrect: false },{ text: '90 days', isCorrect: true },{ text: '6 months', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL,
    'In Ohio, what is the BAC limit for commercial driver\'s license (CDL) holders?',
    'CDL holders in Ohio are held to a stricter standard — the BAC limit is 0.04%, half the standard limit.',
    [{ text: '0.02%', isCorrect: false },{ text: '0.04%', isCorrect: true },{ text: '0.06%', isCorrect: false },{ text: '0.08%', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL,
    'Under Ohio\'s implied consent law, what is the consequence of refusing a chemical test for the first time?',
    'A first refusal of a chemical test in Ohio results in a 1-year Administrative License Suspension (ALS).',
    [{ text: '90-day suspension', isCorrect: false },{ text: '6-month suspension', isCorrect: false },{ text: '1-year suspension', isCorrect: true },{ text: '2-year suspension', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL,
    'In Ohio, which of the following is true about OVI charges and parked vehicles?',
    'Ohio\'s physical control law means you can be charged with OVI even if the vehicle is parked, if you are impaired and in the driver\'s seat with the key accessible.',
    [{ text: 'OVI only applies when the vehicle is moving', isCorrect: false },{ text: 'You can be charged with physical control of a vehicle while impaired even if parked', isCorrect: true },{ text: 'Parked vehicle OVI charges only apply if the engine is running', isCorrect: false },{ text: 'You cannot be charged with OVI unless you are observed driving', isCorrect: false }]);

  await addQuestion(TOPIC.ALCOHOL,
    'What does Ohio\'s "high test" OVI refer to?',
    'A "high test" OVI in Ohio refers to a BAC of 0.17% or above, which triggers enhanced mandatory penalties including ignition interlock.',
    [{ text: 'Any BAC above the 0.08% standard limit', isCorrect: false },{ text: 'A BAC of 0.10% or above', isCorrect: false },{ text: 'A BAC of 0.17% or above, triggering enhanced penalties', isCorrect: true },{ text: 'A BAC of 0.15% or above for repeat offenders', isCorrect: false }]);

  const finalCount = await p.question.count({ where: { stateId: STATE_ID } });
  const alcoholCount = await p.question.count({ where: { stateId: STATE_ID, topicId: TOPIC.ALCOHOL } });
  console.log(`\nFinal total: ${finalCount}`);
  console.log(`Alcohol & Substances: ${alcoholCount}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
