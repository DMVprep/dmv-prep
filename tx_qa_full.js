const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const p = new PrismaClient();
const STATE_ID = 'cmmpnttf800163jd6zc01uwlv';

const CHECKS = [
  { re: /urban.*?(25|35|40|45|55)\s*mph|(25|35|40|45|55)\s*mph.*?urban/i, msg: 'TX urban district = 30 mph', topic: 'Speed Limits' },
  { re: /alley.*?(25|30|20)\s*mph|(25|30|20)\s*mph.*?alley/i, msg: 'TX alley = 15 mph', topic: 'Speed Limits' },
  { re: /ranch.*?road.*?(50|55|65)\s*mph|(50|55|65)\s*mph.*?(ranch|farm.*?market)/i, msg: 'TX FM/RM roads outside urban = 70 mph for cars', topic: 'Speed Limits' },
  { re: /0\.0[679][^0-9]/i, msg: 'TX adult BAC = 0.08 (CDL = 0.04)', topic: 'Alcohol & Substances' },
  { re: /minor.*?0\.0[1-9].*?legal|legal.*?minor.*?0\.0[1-9]/i, msg: 'TX zero tolerance — ANY detectable BAC for minors', topic: 'Alcohol & Substances' },
  { re: /learner.*?(13|14|16|17)\s*year|(13|14|16|17)\s*year.*?learner/i, msg: 'TX learner license min age = 15', topic: 'Licensing & Permits' },
  { re: /knowledge.*?exam.*?(60|65|75|80)\s*percent|(60|65|75|80)\s*percent.*?pass/i, msg: 'TX knowledge exam pass = 70%', topic: 'Licensing & Permits' },
  { re: /address.*?(7|14|10|45|60)\s*days.*?change|(7|14|10|45|60)\s*days.*?address/i, msg: 'TX address change = 30 days', topic: 'Licensing & Permits' },
  { re: /new.*?resident.*?(30|60|120)\s*days|(30|60|120)\s*days.*?new.*?resident.*?licen/i, msg: 'TX new residents have 90 days to get TX license', topic: 'Licensing & Permits' },
  { re: /insurance.*?\$(10|15|20|25),000.*?person|\$(10|15|20|25),000.*?bodily.*?one/i, msg: 'TX min liability = $30,000 per person', topic: 'Licensing & Permits' },
  { re: /railroad.*?(10|20|25|30|100)\s*feet.*?stop|stop.*?(10|20|25|30|100)\s*feet.*?railroad/i, msg: 'TX railroad: stop 15-50 feet from rail', topic: 'Right Of Way' },
  { re: /fire.*?truck.*?(100|200|300|1000)\s*feet|follow.*?fire.*?(100|200|300|1000)\s*feet/i, msg: 'TX: cannot follow fire truck within 500 feet', topic: 'Right Of Way' },
  { re: /school.*?bus.*?1st.*?\$(100|200|300|400)\b|\$(100|200|300|400)\b.*?school.*?bus.*?first/i, msg: 'TX school bus 1st offense = $500-$1,250', topic: 'Right Of Way' },
  { re: /fire.*?hydrant.*?(10|20|25|30)\s*feet|(10|20|25|30)\s*feet.*?fire.*?hydrant/i, msg: 'TX: do not park within 15 feet of fire hydrant', topic: 'Safe Driving' },
  { re: /signal.*?(50|150|200|300)\s*feet.*?turn|turn.*?signal.*?(50|150|200|300)\s*feet/i, msg: 'TX: signal at least 100 feet before turning', topic: 'Safe Driving' },
  { re: /low.*?beam.*?(300|700|1000)\s*feet.*?approach|approach.*?(300|700|1000)\s*feet.*?low/i, msg: 'TX: low beams within 500 feet of approaching vehicle', topic: 'Safe Driving' },
  { re: /park.*?crosswalk.*?(10|30|50)\s*feet|(10|30|50)\s*feet.*?crosswalk/i, msg: 'TX: do not park within 20 feet of a crosswalk', topic: 'Safe Driving' },
  { re: /park.*?railroad.*?(10|15|25|100)\s*feet.*?crossing|(10|15|25|100)\s*feet.*?railroad.*?crossing/i, msg: 'TX: do not park within 50 feet of railroad crossing', topic: 'Safe Driving' },
  { re: /child.*?seat.*?(6|7|9|10)\s*years|(6|7|9|10)\s*years.*?child.*?seat/i, msg: "TX: child seat required under age 8 (or under 4'9\")", topic: 'Safe Driving' },
  { re: /parallel.*?park.*?(6|12|24|36)\s*inch|(6|12|24|36)\s*inch.*?curb/i, msg: 'TX: parallel park max 18 inches from curb', topic: 'Safe Driving' },
];

function normalize(s) { return s.toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ').trim(); }

function similarity(a, b) {
  const na = normalize(a), nb = normalize(b);
  if (na === nb) return 1.0;
  const wa = new Set(na.split(' ')), wb = new Set(nb.split(' '));
  const intersection = [...wa].filter(w => wb.has(w) && w.length > 3).length;
  const union = new Set([...wa,...wb]).size;
  return intersection / union;
}

async function main() {
  console.log('Loading TX questions...\n');
  const questions = await p.question.findMany({
    where: { stateId: STATE_ID },
    include: { topic: { select: { name: true } }, choices: { select: { id: true, text: true, isCorrect: true } } },
    orderBy: { topic: { name: 'asc' } },
  });
  console.log(`Loaded ${questions.length} questions\n${'='.repeat(60)}\n`);

  const critical=[], factual=[], quality=[], dupes=[], topicCounts={};
  for (const q of questions) { const t=q.topic?.name||'Unknown'; topicCounts[t]=(topicCounts[t]||0)+1; }

  // Duplicate detection
  console.log('Checking duplicates (this takes ~30 seconds)...');
  for (let i=0;i<questions.length;i++) {
    for (let j=i+1;j<questions.length;j++) {
      const sim=similarity(questions[i].text,questions[j].text);
      if (sim>0.75) dupes.push({ sim:Math.round(sim*100)+'%', q1:{id:questions[i].id,topic:questions[i].topic?.name,text:questions[i].text.substring(0,100)}, q2:{id:questions[j].id,topic:questions[j].topic?.name,text:questions[j].text.substring(0,100)} });
    }
  }

  // Per-question checks
  for (const q of questions) {
    const topic=q.topic?.name||'Unknown';
    const correct=q.choices.filter(c=>c.isCorrect);
    const allText=[q.text,...q.choices.map(c=>c.text)].join(' ');

    if (correct.length===0) critical.push({id:q.id,topic,q:q.text.substring(0,120),issue:'NO CORRECT ANSWER'});
    if (correct.length>1) critical.push({id:q.id,topic,q:q.text.substring(0,120),issue:`${correct.length} correct answers marked`});
    if (q.choices.length<3) critical.push({id:q.id,topic,q:q.text.substring(0,120),issue:`Only ${q.choices.length} choices (need ≥3)`});

    // Duplicate choices within question
    const choiceNorms=q.choices.map(c=>normalize(c.text));
    if (new Set(choiceNorms).size < q.choices.length) critical.push({id:q.id,topic,q:q.text.substring(0,120),issue:'Duplicate answer choices'});

    // Weak correct answer
    if (correct.length===1) {
      const ca=correct[0].text.toLowerCase().trim();
      if (ca.length<3) critical.push({id:q.id,topic,q:q.text.substring(0,120),issue:`Correct answer too short: "${correct[0].text}"`});
      if (['all of the above','none of the above','both a and b'].includes(ca)) quality.push({id:q.id,topic,q:q.text.substring(0,120),issue:`Weak answer: "${correct[0].text}"`});
    }

    // Correct answer leaked in question
    if (correct.length===1) {
      const ca=normalize(correct[0].text);
      if (ca.length>10 && normalize(q.text).includes(ca)) quality.push({id:q.id,topic,q:q.text.substring(0,120),issue:'Correct answer text appears verbatim in question'});
    }

    // Factual checks
    for (const chk of CHECKS) {
      if (chk.topic && chk.topic!==topic) continue;
      if (chk.re.test(allText)) {
        const correctText=correct[0]?.text||'';
        if (chk.re.test(correctText)||chk.re.test(q.text)) {
          factual.push({id:q.id,topic,q:q.text.substring(0,120),a:correctText.substring(0,100),issue:chk.msg});
          break;
        }
      }
    }
  }

  // Print report
  console.log('\nTOPIC BREAKDOWN:');
  for (const [t,c] of Object.entries(topicCounts)) console.log(`  ${t.padEnd(28)}${c}`);

  console.log(`\n${'='.repeat(60)}\nCRITICAL ERRORS (${critical.length}):`);
  if (!critical.length) console.log('  None');
  critical.forEach((e,i)=>{ console.log(`\n  ${i+1}. [${e.topic}] ${e.issue}\n     Q: ${e.q}\n     ID: ${e.id}`); });

  console.log(`\n${'='.repeat(60)}\nFACTUAL ERRORS (${factual.length}):`);
  if (!factual.length) console.log('  None');
  factual.forEach((e,i)=>{ console.log(`\n  ${i+1}. [${e.topic}]\n     Q: ${e.q}\n     A: ${e.a}\n     ISSUE: ${e.issue}\n     ID: ${e.id}`); });

  console.log(`\n${'='.repeat(60)}\nDUPLICATES (${dupes.length}):`);
  if (!dupes.length) console.log('  None');
  dupes.forEach((d,i)=>{ console.log(`\n  ${i+1}. ${d.sim} match\n     Q1 [${d.q1.topic}]: ${d.q1.text}\n     Q2 [${d.q2.topic}]: ${d.q2.text}\n     IDs: ${d.q1.id} / ${d.q2.id}`); });

  console.log(`\n${'='.repeat(60)}\nQUALITY ISSUES (${quality.length}):`);
  if (!quality.length) console.log('  None');
  quality.forEach((e,i)=>{ console.log(`\n  ${i+1}. [${e.topic}] ${e.issue}\n     Q: ${e.q}\n     ID: ${e.id}`); });

  console.log(`\n${'='.repeat(60)}\nSUMMARY:`);
  console.log(`  Total:          ${questions.length}`);
  console.log(`  Critical:       ${critical.length}`);
  console.log(`  Factual errors: ${factual.length}`);
  console.log(`  Duplicates:     ${dupes.length}`);
  console.log(`  Quality issues: ${quality.length}`);

  fs.writeFileSync('tx_qa_full_report.json', JSON.stringify({generatedAt:new Date().toISOString(),handbook:'Texas DL-7 January 2026',summary:{total:questions.length,critical:critical.length,factual:factual.length,duplicates:dupes.length,quality:quality.length},topicCounts,critical,factual,duplicates:dupes,quality},null,2));
  console.log('\nSaved to tx_qa_full_report.json');
  await p.$disconnect();
}
main().catch(e=>{ console.error(e); p.$disconnect(); });
