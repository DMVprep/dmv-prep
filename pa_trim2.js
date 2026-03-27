const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const PA = 'cmmpntsfr00113jd6ayb2qei8';

async function main() {
  const qs = await p.question.findMany({
    where: { stateId: PA },
    select: { id: true, text: true },
  });

  const keep = new Set();
  const toDelete = new Set();

  function trimConcept(pattern, keepN) {
    const matched = qs.filter(q => pattern.test(q.text));
    matched.slice(0, keepN).forEach(q => keep.add(q.id));
    matched.slice(keepN).forEach(q => { if (!keep.has(q.id)) toDelete.add(q.id); });
    console.log(`  ${pattern} → ${matched.length} found, keeping ${keepN}, deleting ${Math.max(0, matched.length - keepN)}`);
  }

  // alcohol: BAC + DUI overlap heavily — treat as one pool, keep 8 total
  const alcAll = qs.filter(q =>
    /blood alcohol|BAC|driving under the influence|DUI.*convict|DUI.*penalty|DUI.*fine|DUI.*jail|DUI.*suspend|DUI.*prison|implied consent/i.test(q.text)
  );
  console.log(`  alcohol combined → ${alcAll.length} found, keeping 8`);
  alcAll.slice(0, 8).forEach(q => keep.add(q.id));
  alcAll.slice(8).forEach(q => { if (!keep.has(q.id)) toDelete.add(q.id); });

  // Other over-tested concepts
  trimConcept(/maximum.*speed.*Pennsylvania|70 mph|interstate.*speed.*PA|expressway.*speed.*PA/i, 5);
  trimConcept(/school zone.*speed|speed.*school zone/i, 4);
  trimConcept(/following distance|4.second|four.second/i, 5);
  trimConcept(/pedestrian.*crosswalk|yield.*pedestrian|pedestrian.*yield/i, 6);
  trimConcept(/school bus.*stop|stop.*school bus/i, 5);
  trimConcept(/emergency vehicle|move over/i, 6);
  trimConcept(/orange.*sign|work zone/i, 5);
  trimConcept(/texting|text.*drive/i, 4);
  trimConcept(/yellow.*diamond|warning sign/i, 5);
  trimConcept(/learner.*permit/i, 6);
  trimConcept(/junior.*licen/i, 8);

  const deleteArr = [...toDelete];
  console.log(`\nDeleting ${deleteArr.length} questions...`);

  if (deleteArr.length > 0) {
    const choices = await p.choice.findMany({
      where: { questionId: { in: deleteArr } },
      select: { id: true },
    });
    const cids = choices.map(c => c.id);
    await p.answer.deleteMany({ where: { choiceId: { in: cids } } });
    await p.$transaction([
      p.answer.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.userProgress.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.questionTranslation.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.choice.deleteMany({ where: { questionId: { in: deleteArr } } }),
      p.question.deleteMany({ where: { id: { in: deleteArr } } }),
    ]);
  }

  const final = await p.question.count({ where: { stateId: PA } });
  console.log(`Final PA count: ${final}`);
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
