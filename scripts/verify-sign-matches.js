const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SIGN_MAP = {
  "stop.png": ["stop sign", "octagon", "red octagon"],
  "yield.png": ["yield sign", "yield", "triangle sign", "upside down triangle"],
  "yield-ahead.png": ["yield ahead"],
  "speed-limit.png": ["speed limit sign", "posted speed limit"],
  "school-speed-limit.png": ["school zone speed", "school speed limit"],
  "school-zone.png": ["school zone sign", "school zone"],
  "school-zone-arrow.png": ["school zone", "school crossing"],
  "school-bus-stop.png": ["school bus", "school bus stop"],
  "end-school-zone.png": ["end school zone"],
  "pedestrian-crossing.png": ["pedestrian crossing", "pedestrian sign", "crosswalk sign"],
  "no-u-turn.png": ["no u-turn", "no u turn"],
  "no-left-turn.png": ["no left turn"],
  "no-right-turn.png": ["no right turn"],
  "no-turns.png": ["no turns"],
  "no-passing.png": ["no passing", "do not pass"],
  "no-parking.png": ["no parking"],
  "no-turn-on-red.png": ["no turn on red"],
  "no-symbol.png": ["red circle with line", "prohibition sign"],
  "do-not-enter.png": ["do not enter", "wrong way entrance"],
  "wrong-way.png": ["wrong way sign", "wrong way"],
  "one-way.png": ["one way sign", "one-way"],
  "keep-right.png": ["keep right"],
  "merging-traffic.png": ["merging traffic", "merge sign", "merging lane"],
  "lane-reduction.png": ["lane reduction", "lane ends", "lanes reduce"],
  "left-lane-must-turn.png": ["left lane must turn"],
  "must-turn.png": ["must turn"],
  "pass-with-care.png": ["pass with care"],
  "slower-traffic.png": ["slower traffic keep right"],
  "railroadcrossing.png": ["railroad crossing", "railway crossing", "train crossing"],
  "railroad-crossing.png": ["railroad crossing", "railway crossing"],
  "cross-road.png": ["cross road", "crossroad", "intersection ahead"],
  "side-road.png": ["side road"],
  "right-curve.png": ["right curve", "curve ahead", "curve to the right"],
  "reverse-curve.png": ["reverse curve", "s-curve"],
  "sharp-right-turn.png": ["sharp turn", "sharp right turn", "sharp curve"],
  "winding-road.png": ["winding road"],
  "slippery-surface.png": ["slippery", "slippery when wet", "slippery road"],
  "hill-downgrade.png": ["steep hill", "downgrade", "steep downgrade", "hill ahead"],
  "soft-shoulder.png": ["soft shoulder"],
  "narrow-bridge.png": ["narrow bridge"],
  "one-lane-bridge.png": ["one lane bridge"],
  "dip.png": ["dip in road", "dip ahead"],
  "low-clearance.png": ["low clearance"],
  "pavement-ends.png": ["pavement ends"],
  "divided-hwy-ahead.png": ["divided highway ahead", "divided highway begins"],
  "divided-hwy-ends.png": ["divided highway ends"],
  "two-way-traffic.png": ["two-way traffic", "two way traffic"],
  "roundabout-ahead.png": ["roundabout", "traffic circle"],
  "animal-crossing.png": ["animal crossing", "deer crossing"],
  "bicycle-crossing.png": ["bicycle crossing", "bicycle sign"],
  "truck-crossing.png": ["truck crossing"],
  "traffic-signal-ahead.png": ["traffic signal ahead", "traffic light ahead"],
  "stop-sign-ahead.png": ["stop sign ahead", "stop ahead"],
  "work-zone.png": ["work zone", "construction zone", "construction area"],
  "fines-doubled.png": ["fines doubled", "double fines"],
  "speed-reduction.png": ["speed reduction", "reduced speed ahead"],
  "advisory-speed.png": ["advisory speed"],
  "exit-speed.png": ["exit speed", "ramp speed"],
  "center-turn-lane.png": ["center turn lane", "center lane"],
  "turn-lanes.png": ["turn lane", "turn lanes"],
  "begin-right-turn-lane.png": ["right turn lane"],
  "restricted-lane.png": ["restricted lane", "hov lane", "carpool"],
  "disabled-parking.png": ["disabled parking", "handicapped parking", "accessible parking"],
  "draw-bridge.png": ["draw bridge", "drawbridge"],
  "emergency-stop.png": ["emergency stop"],
  "emergency-vehicle.png": ["emergency vehicle"],
  "flashingarrow.png": ["flashing arrow"],
  "all-way-stop.png": ["all way stop", "four-way stop", "4-way stop"],
  "lane-green-arrow.png": ["green arrow", "lane control"],
  "lane-red-x.png": ["red x", "lane closed"],
  "lane-yellow-x.png": ["yellow x", "lane closing"],
  "blueguidesign.png": ["blue sign", "service sign", "hospital sign", "gas sign"],
  "brownguidesign.png": ["brown sign", "recreation sign", "park sign"],
  "greenguidesign.png": ["green sign", "guide sign", "highway sign", "interstate sign"],
};

async function main() {
  const signQuestions = await prisma.question.findMany({
    where: { topic: { name: "Traffic Signs" }, imageUrl: null },
    select: { id: true, text: true },
  });

  // Group by sign and show 2 sample questions each
  const samples = {};
  const problemKeywords = [];

  for (const q of signQuestions) {
    const textLower = q.text.toLowerCase();
    for (const [filename, keywords] of Object.entries(SIGN_MAP)) {
      const matchedKw = keywords.find(kw => textLower.includes(kw));
      if (matchedKw) {
        if (!samples[filename]) samples[filename] = [];
        if (samples[filename].length < 3) {
          samples[filename].push({ text: q.text.substring(0, 120), keyword: matchedKw });
        }
        break;
      }
    }
  }

  // Print samples for review
  console.log("=== VERIFY: Sample matches per sign (3 questions each) ===\n");
  for (const [sign, qs] of Object.entries(samples).sort()) {
    console.log(`📌 ${sign}`);
    qs.forEach((q, i) => console.log(`   ${i+1}. [${q.keyword}] "${q.text}"`));
    console.log("");
  }
}

main().then(() => prisma.$disconnect());
