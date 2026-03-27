
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const qs = await p.question.findMany({
    where: { stateId: 'cmmpnttf800163jd6zc01uwlv' },
    include: { topic: { select: { name: true } }, choices: { select: { text: true, isCorrect: true } } },
    orderBy: { topic: { name: 'asc' } },
  });

  const CONCEPTS = [
    { tag: 'speed:urban', re: /urban.*?district|city.*?speed/i },
    { tag: 'speed:alley', re: /alley/i },
    { tag: 'speed:highway-numbered', re: /numbered.*?highway|farm.*?market|ranch.*?market/i },
    { tag: 'speed:school-zone', re: /school.*?zone.*?speed|speed.*?school.*?zone/i },
    { tag: 'speed:following-distance', re: /following.*?distance|follow.*?second/i },
    { tag: 'speed:stopping-distance', re: /stopping.*?distance|feet.*?stop.*?mph/i },
    { tag: 'alcohol:bac-adult', re: /bac.*?adult|adult.*?bac|legal.*?limit.*?alcohol|0\.08/i },
    { tag: 'alcohol:bac-cdl', re: /cdl.*?bac|bac.*?cdl|commercial.*?driver.*?alcohol|0\.04/i },
    { tag: 'alcohol:zero-tolerance', re: /zero.*?tolerance|minor.*?alcohol.*?drive|dui.*?minor/i },
    { tag: 'alcohol:dwi-penalty', re: /dwi.*?penalt|penalt.*?dwi|dwi.*?fine|fine.*?dwi/i },
    { tag: 'alcohol:open-container', re: /open.*?container/i },
    { tag: 'alcohol:implied-consent', re: /implied.*?consent/i },
    { tag: 'alcohol:sobering-myths', re: /coffee|shower|sober.*?myth/i },
    { tag: 'license:learner-age', re: /learner.*?age|age.*?learner|minimum.*?age.*?permit/i },
    { tag: 'license:provisional-age', re: /provisional.*?age|age.*?provisional/i },
    { tag: 'license:gdl-passenger', re: /passenger.*?restriction|restrict.*?passenger/i },
    { tag: 'license:gdl-curfew', re: /curfew|midnight|5.*?a\.?m/i },
    { tag: 'license:gdl-phase', re: /phase.*?one|phase.*?two|6.*?month.*?learner/i },
    { tag: 'license:renewal', re: /renew.*?license|license.*?renew/i },
    { tag: 'license:address-change', re: /address.*?change|change.*?address/i },
    { tag: 'license:new-resident', re: /new.*?resident|establish.*?residency/i },
    { tag: 'license:insurance-minimum', re: /minimum.*?insurance|liability.*?minimum/i },
    { tag: 'license:knowledge-exam', re: /knowledge.*?exam|written.*?exam|70.*?percent/i },
    { tag: 'license:suspended', re: /suspend.*?license|license.*?suspend/i },
    { tag: 'license:dwli', re: /driving.*?while.*?license.*?invalid|dwli/i },
    { tag: 'row:railroad-stop', re: /railroad.*?stop|stop.*?railroad.*?feet/i },
    { tag: 'row:school-bus', re: /school.*?bus/i },
    { tag: 'row:emergency-vehicle', re: /emergency.*?vehicle|ambulance.*?yield/i },
    { tag: 'row:move-over', re: /move.*?over|slow.*?down.*?emergency.*?stopped/i },
    { tag: 'row:pedestrian', re: /pedestrian.*?right|yield.*?pedestrian/i },
    { tag: 'row:left-turn-yield', re: /left.*?turn.*?yield|yield.*?left.*?turn/i },
    { tag: 'row:roundabout', re: /roundabout/i },
    { tag: 'safe:signal-feet', re: /signal.*?100.*?feet|100.*?feet.*?signal/i },
    { tag: 'safe:headlights-when', re: /headlight.*?sunset|when.*?use.*?headlight/i },
    { tag: 'safe:headlights-lowbeam', re: /low.*?beam/i },
    { tag: 'safe:park-hydrant', re: /fire.*?hydrant.*?park|park.*?fire.*?hydrant/i },
    { tag: 'safe:park-crosswalk', re: /crosswalk.*?park|park.*?crosswalk/i },
    { tag: 'safe:park-railroad', re: /railroad.*?park|park.*?railroad/i },
    { tag: 'safe:parallel-park', re: /parallel.*?park/i },
    { tag: 'safe:seatbelt-required', re: /seat.*?belt.*?required|who.*?wear.*?belt/i },
    { tag: 'safe:child-seat', re: /child.*?seat|car.*?seat.*?age/i },
    { tag: 'safe:passing-rules', re: /when.*?pass|pass.*?prohibit|no.*?pass.*?zone/i },
    { tag: 'safe:skid', re: /skid/i },
    { tag: 'safe:distracted', re: /distract|texting.*?driv|cell.*?phone.*?driv/i },
    { tag: 'safe:right-turn-red', re: /right.*?turn.*?red|red.*?light.*?right/i },
    { tag: 'signs:stop-shape', re: /stop.*?sign.*?shape|octagon/i },
    { tag: 'signs:yield-shape', re: /yield.*?sign.*?shape/i },
    { tag: 'signs:warning-shape', re: /warning.*?sign.*?shape|diamond.*?sign/i },
    { tag: 'signs:school-shape', re: /school.*?sign.*?shape|pentagon/i },
    { tag: 'signs:colors', re: /sign.*?color|blue.*?sign|brown.*?sign|orange.*?sign/i },
    { tag: 'signs:flashing-red', re: /flash.*?red/i },
    { tag: 'signs:flashing-yellow', re: /flash.*?yellow/i },
    { tag: 'signs:construction-color', re: /construction.*?sign.*?color|orange.*?construction/i },
  ];

  const conceptMap = {};
  for (const q of qs) {
    const topic = q.topic?.name || 'Unknown';
    const correct = q.choices.find(c => c.isCorrect)?.text || '';
    const fullText = q.text + ' ' + correct;
    for (const concept of CONCEPTS) {
      if (concept.re.test(fullText)) {
        if (!conceptMap[concept.tag]) conceptMap[concept.tag] = [];
        conceptMap[concept.tag].push({ topic, q: q.text.substring(0,90), a: correct.substring(0,50), id: q.id });
      }
    }
  }

  console.log('CONCEPT FREQUENCY REPORT');
  console.log('Flagging concepts tested 4+ times\n' + '='.repeat(60));

  let overCount = 0;
  for (const [tag, items] of Object.entries(conceptMap).sort((a,b) => b[1].length - a[1].length)) {
    if (items.length >= 4) {
      overCount++;
      console.log('\n⚠️  ' + tag + ' — ' + items.length + ' questions');
      items.forEach((item, i) => {
        console.log('  ' + (i+1) + '. [' + item.topic + '] ' + item.q);
        console.log('     → ' + item.a);
        console.log('     ID: ' + item.id);
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Over-tested concepts (4+): ' + overCount);
  console.log('\nCOVERAGE GAPS (0 questions):');
  for (const concept of CONCEPTS) {
    if (!conceptMap[concept.tag] || conceptMap[concept.tag].length === 0) {
      console.log('  ❌ ' + concept.tag);
    }
  }

  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
