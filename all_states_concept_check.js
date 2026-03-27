
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const STATES = [
  { name: 'Florida', id: 'cmmpntmvv00083jd6x3g9m5js' },
  { name: 'California', id: 'cmmpntm4s00043jd6mtc4xwmi' },
  { name: 'Texas', id: 'cmmpnttf800163jd6zc01uwlv' },
];

// Core testable concepts — state-agnostic where possible
const CONCEPTS = [
  // Speed
  { tag: 'speed:urban', re: /urban.*?district|city.*?speed|residential.*?speed limit/i },
  { tag: 'speed:alley', re: /alley/i },
  { tag: 'speed:school-zone', re: /school.*?zone.*?speed|speed.*?school.*?zone/i },
  { tag: 'speed:following-distance', re: /following.*?distance|follow.*?second/i },
  { tag: 'speed:stopping-distance', re: /stopping.*?distance|feet.*?stop.*?mph/i },
  { tag: 'speed:highway', re: /highway.*?speed|speed.*?highway|freeway.*?speed|mph.*?highway/i },
  // Alcohol
  { tag: 'alcohol:bac-adult', re: /bac.*?adult|adult.*?bac|legal.*?limit.*?alcohol|0\.08/i },
  { tag: 'alcohol:bac-cdl', re: /cdl.*?bac|bac.*?cdl|commercial.*?driver.*?alcohol|0\.04/i },
  { tag: 'alcohol:zero-tolerance', re: /zero.*?tolerance|minor.*?alcohol.*?driv|dui.*?minor/i },
  { tag: 'alcohol:dwi-penalty', re: /dwi.*?penalt|penalt.*?dwi|dwi.*?fine|fine.*?dwi|dwi.*?jail/i },
  { tag: 'alcohol:open-container', re: /open.*?container/i },
  { tag: 'alcohol:implied-consent', re: /implied.*?consent/i },
  { tag: 'alcohol:sobering-myths', re: /coffee|cold.*?shower|sober.*?myth|myth.*?sober|exercise.*?sober/i },
  // Licensing
  { tag: 'license:learner-age', re: /learner.*?age|age.*?learner|minimum.*?age.*?permit|permit.*?minimum.*?age/i },
  { tag: 'license:provisional-age', re: /provisional.*?age|age.*?provisional|restricted.*?license.*?age/i },
  { tag: 'license:gdl-passenger', re: /passenger.*?restriction|restrict.*?passenger/i },
  { tag: 'license:gdl-curfew', re: /curfew|midnight.*?driv|driv.*?midnight/i },
  { tag: 'license:gdl-phase', re: /phase.*?one|phase.*?two|6.*?month.*?learner|months.*?learner/i },
  { tag: 'license:renewal', re: /renew.*?license|license.*?renew/i },
  { tag: 'license:address-change', re: /address.*?change|change.*?address/i },
  { tag: 'license:new-resident', re: /new.*?resident|establish.*?residency/i },
  { tag: 'license:insurance-minimum', re: /minimum.*?insurance|liability.*?minimum|financial.*?responsibility.*?amount/i },
  { tag: 'license:knowledge-exam', re: /knowledge.*?exam|written.*?exam|pass.*?percent|percent.*?pass/i },
  { tag: 'license:suspended', re: /suspend.*?license|license.*?suspend/i },
  { tag: 'license:dwli', re: /driving.*?while.*?license.*?invalid|dwli/i },
  // Right of way
  { tag: 'row:railroad-stop', re: /railroad.*?stop.*?feet|stop.*?feet.*?railroad|how far.*?railroad/i },
  { tag: 'row:school-bus', re: /school.*?bus/i },
  { tag: 'row:emergency-vehicle', re: /emergency.*?vehicle.*?yield|yield.*?emergency|ambulance.*?yield|fire.*?truck.*?yield/i },
  { tag: 'row:move-over', re: /move.*?over.*?law|slow.*?down.*?move|move.*?over.*?emergency/i },
  { tag: 'row:pedestrian', re: /pedestrian.*?right.*?way|yield.*?pedestrian|pedestrian.*?crosswalk/i },
  { tag: 'row:left-turn-yield', re: /left.*?turn.*?yield|yield.*?left.*?turn/i },
  { tag: 'row:roundabout', re: /roundabout/i },
  { tag: 'row:intersection-uncontrolled', re: /uncontrolled.*?intersection|intersection.*?no.*?sign/i },
  // Safe driving
  { tag: 'safe:signal-feet', re: /signal.*?100.*?feet|100.*?feet.*?signal|signal.*?before.*?turn/i },
  { tag: 'safe:headlights-when', re: /headlight.*?sunset|when.*?use.*?headlight|turn.*?on.*?headlight/i },
  { tag: 'safe:headlights-lowbeam', re: /low.*?beam/i },
  { tag: 'safe:park-hydrant', re: /fire.*?hydrant.*?park|park.*?fire.*?hydrant|how far.*?hydrant/i },
  { tag: 'safe:park-crosswalk', re: /crosswalk.*?park|park.*?crosswalk|how far.*?crosswalk/i },
  { tag: 'safe:park-railroad', re: /railroad.*?park|park.*?railroad|how far.*?railroad.*?park/i },
  { tag: 'safe:parallel-park', re: /parallel.*?park/i },
  { tag: 'safe:seatbelt-required', re: /seat.*?belt.*?required|required.*?seat.*?belt|who.*?wear.*?belt/i },
  { tag: 'safe:child-seat', re: /child.*?seat|car.*?seat.*?age|booster.*?seat/i },
  { tag: 'safe:passing-rules', re: /when.*?pass.*?prohibit|pass.*?prohibit|no.*?pass.*?zone|passing.*?illegal/i },
  { tag: 'safe:skid', re: /skid/i },
  { tag: 'safe:distracted', re: /distract|texting.*?driv|cell.*?phone.*?driv/i },
  { tag: 'safe:right-turn-red', re: /right.*?turn.*?red|red.*?light.*?right.*?turn/i },
  { tag: 'safe:defensive-driving', re: /defensive.*?driv/i },
  { tag: 'safe:road-rage', re: /road.*?rage|aggressive.*?driv/i },
  // Traffic signs
  { tag: 'signs:stop-shape', re: /stop.*?sign.*?shape|shape.*?stop.*?sign|octagon/i },
  { tag: 'signs:yield-shape', re: /yield.*?sign.*?shape|shape.*?yield.*?sign/i },
  { tag: 'signs:warning-shape', re: /warning.*?sign.*?shape|shape.*?warning|diamond.*?sign.*?warn/i },
  { tag: 'signs:school-shape', re: /school.*?sign.*?shape|pentagon.*?sign/i },
  { tag: 'signs:railroad-shape', re: /railroad.*?sign.*?shape|round.*?sign.*?railroad/i },
  { tag: 'signs:colors', re: /sign.*?color|blue.*?sign.*?mean|green.*?sign.*?mean|brown.*?sign|orange.*?sign.*?mean/i },
  { tag: 'signs:flashing-red', re: /flashing.*?red.*?light|red.*?flashing.*?light/i },
  { tag: 'signs:flashing-yellow', re: /flashing.*?yellow|yellow.*?flashing/i },
  { tag: 'signs:green-arrow', re: /green.*?arrow/i },
  { tag: 'signs:construction-color', re: /construction.*?sign.*?color|color.*?construction.*?sign|orange.*?construction/i },
];

const OVER_THRESHOLD = 6; // flag if concept has more than this many questions

async function checkState(stateName, stateId) {
  const qs = await p.question.findMany({
    where: { stateId },
    include: { topic: { select: { name: true } }, choices: { select: { text: true, isCorrect: true } } },
  });

  const conceptMap = {};
  for (const q of qs) {
    const correct = q.choices.find(c => c.isCorrect)?.text || '';
    const fullText = q.text + ' ' + correct;
    for (const concept of CONCEPTS) {
      if (concept.re.test(fullText)) {
        if (!conceptMap[concept.tag]) conceptMap[concept.tag] = [];
        conceptMap[concept.tag].push({ q: q.text.substring(0,85), a: correct.substring(0,50), id: q.id, topic: q.topic?.name });
      }
    }
  }

  const overTested = Object.entries(conceptMap).filter(([,v]) => v.length > OVER_THRESHOLD).sort((a,b) => b[1].length - a[1].length);
  const gaps = CONCEPTS.filter(c => !conceptMap[c.tag] || conceptMap[c.tag].length === 0);
  const healthy = Object.entries(conceptMap).filter(([,v]) => v.length >= 1 && v.length <= OVER_THRESHOLD).length;

  console.log('\n' + '█'.repeat(60));
  console.log('  ' + stateName.toUpperCase() + ' — ' + qs.length + ' questions');
  console.log('█'.repeat(60));
  console.log('  Over-tested concepts (>' + OVER_THRESHOLD + ' questions): ' + overTested.length);
  console.log('  Healthy concepts (1-' + OVER_THRESHOLD + '): ' + healthy);
  console.log('  Coverage gaps (0 questions): ' + gaps.length);

  if (overTested.length > 0) {
    console.log('\n  ⚠️  OVER-TESTED:');
    overTested.forEach(([tag, items]) => {
      console.log('    ' + tag + ' — ' + items.length + ' questions');
      items.forEach((item, i) => {
        console.log('      ' + (i+1) + '. [' + item.topic + '] ' + item.q);
        console.log('         → ' + item.a);
        console.log('         ID: ' + item.id);
      });
    });
  }

  if (gaps.length > 0) {
    console.log('\n  ❌ COVERAGE GAPS:');
    gaps.forEach(g => console.log('    ' + g.tag));
  }

  return { stateName, total: qs.length, overTested: overTested.length, gaps: gaps.length, healthy, overTestedDetails: overTested, gapDetails: gaps };
}

async function main() {
  console.log('CONCEPT BALANCE CHECK — ALL STATES');
  console.log('Threshold: flag concepts with >' + OVER_THRESHOLD + ' questions\n');

  const results = [];
  for (const state of STATES) {
    const result = await checkState(state.name, state.id);
    results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY ACROSS ALL STATES');
  console.log('='.repeat(60));
  results.forEach(r => {
    console.log('  ' + r.stateName.padEnd(12) + ' | ' + String(r.total).padEnd(5) + ' Qs | Over-tested: ' + String(r.overTested).padEnd(3) + ' | Gaps: ' + r.gaps);
  });

  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
