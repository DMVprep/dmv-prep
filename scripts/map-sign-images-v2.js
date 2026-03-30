const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// STRICT mapping: only keywords that precisely match the sign
const SIGN_MAP = {
  "stop.png": { include: ["stop sign", "octagon", "red octagon", "what shape is a stop"], exclude: ["stop sign ahead", "stop ahead sign", "bus stop"] },
  "yield.png": { include: ["yield sign", "upside down triangle", "yield is what shape", "sign reading 'yield'", "'yield' in red"], exclude: ["yield to pedestrian", "yield to bus", "yield ahead"] },
  "speed-limit.png": { include: ["speed limit sign", "posted speed limit sign"], exclude: ["school zone speed", "school speed limit", "work zone"] },
  "school-zone.png": { include: ["school zone sign", "entering a school zone", "school zone ahead"], exclude: ["school crossing", "school bus"] },
  "school-bus-stop.png": { include: ["school bus with red lights", "school bus stop arm", "school bus ahead", "school bus flashing", "school bus with flashing"], exclude: [] },
  "pedestrian-crossing.png": { include: ["pedestrian crossing sign", "pedestrian crossing symbol"], exclude: [] },
  "no-u-turn.png": { include: ["no u-turn", "no u turn"], exclude: [] },
  "no-left-turn.png": { include: ["no left turn"], exclude: [] },
  "no-right-turn.png": { include: ["no right turn'", "sign reading 'no right turn'"], exclude: ["no right turn on red"] },
  "no-passing.png": { include: ["do not pass' sign", "sign reading 'do not pass'", "'do not pass'", "no passing sign", "no passing zone sign"], exclude: [] },
  "no-parking.png": { include: ["no parking sign", "sign reading 'no parking'", "'no parking'", "fire lane - no parking"], exclude: [] },
  "no-turn-on-red.png": { include: ["no turn on red"], exclude: [] },
  "do-not-enter.png": { include: ["do not enter"], exclude: [] },
  "wrong-way.png": { include: ["wrong way' sign", "sign reading 'wrong way'", "'wrong way'"], exclude: ["wrong way entrance"] },
  "one-way.png": { include: ["one way sign", "one-way sign"], exclude: [] },
  "keep-right.png": { include: ["keep right"], exclude: [] },
  "merging-traffic.png": { include: ["merge sign"], exclude: [] },
  "railroadcrossing.png": { include: ["railroad crossing sign", "approaching a railroad crossing", "railroad crossing warning", "railroad crossing ahead"], exclude: [] },
  "work-zone.png": { include: ["work zone", "construction zone"], exclude: [] },
  "slippery-surface.png": { include: ["slippery when wet", "slippery road sign"], exclude: [] },
  "low-clearance.png": { include: ["low clearance"], exclude: [] },
  "center-turn-lane.png": { include: ["center turn lane"], exclude: [] },
  "right-curve.png": { include: ["curve to the right", "right curve sign"], exclude: [] },
  "winding-road.png": { include: ["winding road"], exclude: [] },
  "soft-shoulder.png": { include: ["soft shoulder"], exclude: [] },
  "pavement-ends.png": { include: ["pavement ends"], exclude: [] },
  "animal-crossing.png": { include: ["deer crossing sign", "animal crossing sign"], exclude: [] },
  "lane-reduction.png": { include: ["lane ends merge"], exclude: [] },
  "lane-yellow-x.png": { include: ["yellow x signal", "yellow x over"], exclude: [] },
  "lane-red-x.png": { include: ["red x signal", "red x over", "red x above"], exclude: ["lane closed ahead"] },
  "must-turn.png": { include: ["must turn right", "must turn left", "lane must turn"], exclude: [] },
  "disabled-parking.png": { include: ["handicapped parking sign", "disabled parking sign", "wheelchair symbol"], exclude: [] },
  "hill-downgrade.png": { include: ["steep hill sign", "truck going down a steep hill"], exclude: [] },
  "no-symbol.png": { include: ["red circle with line through"], exclude: [] },
  "stop-sign-ahead.png": { include: ["stop sign ahead", "stop ahead sign"], exclude: [] },
  "blueguidesign.png": { include: ["blue sign", "service sign", "blue and white sign"], exclude: ["blue traffic light"] },
  "brownguidesign.png": { include: ["brown sign"], exclude: [] },
  "greenguidesign.png": { include: ["green guide sign", "green sign with white", "highway guide sign", "green and white sign"], exclude: ["green traffic light", "green arrow traffic"] },
};

async function main() {
  const signQuestions = await prisma.question.findMany({
    where: { topic: { name: "Traffic Signs" }, imageUrl: null },
    select: { id: true, text: true },
  });

  let matched = 0;
  let updates = [];

  for (const q of signQuestions) {
    const textLower = q.text.toLowerCase();
    for (const [filename, { include, exclude }] of Object.entries(SIGN_MAP)) {
      // Check if any exclude keyword matches — skip if so
      const excluded = exclude.some(kw => textLower.includes(kw));
      if (excluded) continue;
      
      const found = include.some(kw => textLower.includes(kw));
      if (found) {
        updates.push({ id: q.id, imageUrl: `/signs/${filename}`, keyword: include.find(kw => textLower.includes(kw)) });
        matched++;
        break;
      }
    }
  }

  console.log(`\n=== Matched ${matched} of ${signQuestions.length} sign questions (strict mode) ===\n`);

  const bySign = {};
  updates.forEach(u => { bySign[u.imageUrl] = (bySign[u.imageUrl] || 0) + 1; });
  Object.entries(bySign).sort((a,b) => b[1] - a[1]).forEach(([sign, count]) => {
    console.log(`  ${sign}: ${count} questions`);
  });

  // Show 2 samples per sign for final check
  console.log("\n=== SAMPLES ===\n");
  const samples = {};
  updates.forEach(u => {
    if (!samples[u.imageUrl]) samples[u.imageUrl] = [];
    if (samples[u.imageUrl].length < 2) {
      const q = signQuestions.find(sq => sq.id === u.id);
      samples[u.imageUrl].push(q.text.substring(0, 100));
    }
  });
  for (const [sign, texts] of Object.entries(samples).sort()) {
    console.log(`${sign}`);
    texts.forEach(t => console.log(`  → ${t}`));
  }

  console.log(`\nRun with --apply to write ${updates.length} updates to DB.`);

  if (process.argv.includes('--apply')) {
    console.log('\nApplying...');
    for (const u of updates) {
      await prisma.question.update({ where: { id: u.id }, data: { imageUrl: u.imageUrl } });
    }
    console.log(`Done! Updated ${updates.length} questions.`);
  }
}

main().then(() => prisma.$disconnect());
