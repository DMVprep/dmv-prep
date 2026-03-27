const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const p = new PrismaClient();

const ERROR_PATTERNS = [
  { pattern: /urban.*?(?:25|35|40|45|55)\s*mph|(?:25|35|40|45|55)\s*mph.*?urban/i, flag: 'Wrong urban speed limit — TX is 30 mph', topic: 'Speed Limits' },
  { pattern: /alley.*?(?:25|30|20)\s*mph|(?:25|30|20)\s*mph.*?alley/i, flag: 'Wrong alley speed limit — TX is 15 mph', topic: 'Speed Limits' },
  { pattern: /0\.0[679][^0-9]/i, flag: 'TX BAC legal limit is 0.08', topic: 'Alcohol & Substances' },
  { pattern: /learner.*?(?:14|13|16|17)\s*year|(?:14|13|16|17)\s*year.*?learner/i, flag: 'TX learner license min age is 15', topic: 'Licensing & Permits' },
  { pattern: /railroad.*?(?:10|20|25|30|100)\s*feet|(?:10|20|25|30|100)\s*feet.*?railroad/i, flag: 'TX railroad: stop 15–50 feet from nearest rail', topic: 'Right Of Way' },
  { pattern: /fire.*?hydrant.*?(?:10|20|25|30)\s*feet|(?:10|20|25|30)\s*feet.*?fire.*?hydrant/i, flag: 'TX: do not park within 15 feet of fire hydrant', topic: 'Safe Driving' },
  { pattern: /signal.*?(?:50|150|200|300)\s*feet.*?turn|turn.*?signal.*?(?:50|150|200|300)\s*feet/i, flag: 'TX: signal at least 100 feet before turning', topic: 'Safe Driving' },
  { pattern: /new.*?resident.*?(?:30|60|120)\s*days|(?:30|60|120)\s*days.*?new.*?resident.*?licen/i, flag: 'TX new residents have 90 days to get TX license', topic: 'Licensing & Permits' },
  { pattern: /(?:pass|score).*?(?:60|65|75|80)\s*percent|(?:60|65|75|80)\s*percent.*?(?:pass|score)/i, flag: 'TX knowledge exam requires 70% to pass', topic: 'Licensing & Permits' },
  { pattern: /low.*?beam.*?(?:300|700|1000)\s*feet.*?approach|approach.*?(?:300|700|1000)\s*feet.*?low/i, flag: 'TX: low beams within 500 feet of approaching vehicle', topic: 'Safe Driving' },
  { pattern: /address.*?(?:7|14|10|45|60)\s*days|(?:7|14|10|45|60)\s*days.*?address.*?change/i, flag: 'TX: address change must be reported within 30 days', topic: 'Licensing & Permits' },
];

async function main() {
  const stateId = 'cmmpnttf800163jd6zc01uwlv';
  const questions = await p.question.findMany({
    where: { stateId },
    include: { topic: { select: { name: true } }, choices: { select: { text: true, isCorrect: true } } },
    orderBy: { topic: { name: 'asc' } },
  });

  console.log(`Loaded ${questions.length} TX questions\n`);

  const errors = [], warnings = [], topicCounts = {};

  for (const q of questions) {
    const topic = q.topic?.name || 'Unknown';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    const correctChoice = q.choices.find(c => c.isCorrect);
    const allText = [q.text, ...q.choices.map(c => c.text)].join(' ');

    if (!correctChoice) errors.push({ id: q.id, topic, question: q.text.substring(0, 120), issue: 'NO CORRECT ANSWER' });
    if (q.choices.length < 2) errors.push({ id: q.id, topic, question: q.text.substring(0, 120), issue: `Only ${q.choices.length} choices` });

    for (const ep of ERROR_PATTERNS) {
      if (ep.topic && ep.topic !== topic) continue;
      if (ep.pattern.test(allText)) {
        warnings.push({ id: q.id, topic, question: q.text.substring(0, 120), correctAnswer: correctChoice?.text?.substring(0, 100) || 'N/A', flag: ep.flag });
        break;
      }
    }
  }

  console.log('TOPIC BREAKDOWN:');
  for (const [t, c] of Object.entries(topicCounts)) console.log(`  ${t}: ${c}`);

  console.log('\nCRITICAL ERRORS:');
  if (!errors.length) console.log('  None');
  errors.forEach((e, i) => console.log(`  ${i+1}. [${e.topic}] ${e.issue}\n     Q: ${e.question}\n     ID: ${e.id}`));

  console.log('\nFLAGGED FOR REVIEW:');
  if (!warnings.length) console.log('  None');
  warnings.forEach((w, i) => console.log(`  ${i+1}. [${w.topic}]\n     Q: ${w.question}\n     A: ${w.correctAnswer}\n     FLAG: ${w.flag}\n     ID: ${w.id}\n`));

  console.log(`\nSUMMARY: ${questions.length} total | ${errors.length} errors | ${warnings.length} flagged`);
  fs.writeFileSync('tx_qa_report.json', JSON.stringify({ topicCounts, errors, warnings }, null, 2));
  console.log('Saved to tx_qa_report.json');
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
