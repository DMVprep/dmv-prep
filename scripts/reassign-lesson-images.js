const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// MANUAL MAPPING: illustration filename -> lesson title keywords it matches
// Based on what each FL handbook illustration actually depicts
const IMAGE_TO_LESSON = {
  // Lane markings
  "broken-yellow-line.png": ["broken yellow", "passing allowed"],
  "double-yellow-lines.png": ["double yellow", "no passing either"],
  "double-yellow-solid-right.png": ["solid yellow", "no passing"],
  "double-yellow-broken-right.png": ["pass on one side", "passing one direction"],
  "broken-white-line.png": ["broken white", "white dashed", "lane change"],
  "solid-white-line.png": ["solid white", "white lines separate", "same-direction"],
  "double-white-line.png": ["double white"],
  "center-turn-lane.png": ["center turn lane", "two-way left turn"],
  "white-stop-line.png": ["stop line", "white line at intersection"],
  "turn-lanes.png": ["turn lane", "turning lanes"],
  "sharrow.png": ["shared lane", "sharrow", "bicycle share"],
  "reversible-lane.png": ["reversible lane"],

  // Traffic signals
  "red-light.png": ["red light means stop", "solid red light", "red traffic light"],
  "yellow-light.png": ["yellow light", "amber light", "light about to turn"],
  "green-light.png": ["green light means go", "solid green light"],
  "red-arrow.png": ["red arrow"],
  "yellow-arrow.png": ["yellow arrow"],
  "green-arrow.png": ["green arrow", "protected turn"],
  "green-arrow-2.png": ["green arrow"],
  "flashing-red-light.png": ["flashing red", "treat as stop sign"],
  "flashing-yellow-light.png": ["flashing yellow", "proceed with caution"],
  "flashing-yellow-arrow.png": ["flashing yellow arrow"],
  "red-x-lane.png": ["red x", "lane closed", "red x signal"],
  "yellow-x-lane.png": ["yellow x", "lane closing"],

  // Safe driving
  "following-distance-trucks.png": ["following distance truck", "truck following", "large vehicle following"],
  "blind-spots.png": ["blind spot", "check blind"],
  "no-zones-trucks.png": ["no zone", "truck blind spot", "no-zone"],
  "passing.png": ["how to pass", "pass safely", "passing another"],
  "total-stopping-distance.png": ["stopping distance", "total stopping", "braking distance"],
  "night-driving-glare.png": ["night driving", "glare", "headlight glare"],
  "night-driving-high-beams.png": ["high beam", "dim your lights", "bright lights"],
  "three-point-turn.png": ["three-point turn", "3-point turn", "turnabout"],
  "roundabouts.png": ["roundabout"],
  "limited-access-highways.png": ["highway driving", "freeway", "limited access", "merging onto"],

  // Parking
  "hill-parking-downhill.png": ["parking downhill", "downhill parking", "park downhill"],
  "hill-parking-uphill-curb.png": ["parking uphill", "uphill with curb", "park uphill"],
  "hill-parking-uphill-no-curb.png": ["uphill no curb", "uphill without curb"],

  // Railroad & school bus
  "railroad-crossing-signals.png": ["railroad crossing", "railroad signal", "train crossing"],
  "school-bus-two-lanes.png": ["school bus", "bus stop", "flashing red lights"],
  "school-bus-multi-lane.png": ["school bus multi", "school bus divided"],
  "school-bus-divided-highway.png": ["school bus divided highway", "median"],

  // Bicycle
  "bicycle-lane.png": ["bicycle", "cyclist", "bike lane", "cyclists have"],
};

async function main() {
  // Step 1: Clear ALL handbook illustration images from lessons
  const cleared = await prisma.microLesson.updateMany({
    where: { imageUrl: { contains: '/handbook-illustrations/' } },
    data: { imageUrl: null },
  });
  console.log(`Cleared ${cleared.count} existing handbook illustration assignments\n`);

  // Also clear the emergency vehicle one that had no-zones-trucks
  await prisma.microLesson.update({
    where: { id: 'cmmybrv3i0004pd2tde2bba2j' },
    data: { imageUrl: null },
  }).catch(() => {});

  // Step 2: Get all lessons
  const lessons = await prisma.microLesson.findMany({
    select: { id: true, title: true, topic: true, simpleLine: true, explanation: true, imageUrl: true },
  });

  console.log(`Total lessons: ${lessons.length}\n`);

  // Step 3: Match illustrations to lessons
  let matched = 0;
  const assignments = [];

  for (const [filename, keywords] of Object.entries(IMAGE_TO_LESSON)) {
    const imageUrl = `/handbook-illustrations/${filename}`;

    for (const lesson of lessons) {
      // Skip lessons that already have an image (sign images)
      if (lesson.imageUrl) continue;

      const titleLower = lesson.title.toLowerCase();
      const simpleLower = lesson.simpleLine.toLowerCase();
      const explLower = lesson.explanation.toLowerCase();

      const match = keywords.some(kw => 
        titleLower.includes(kw.toLowerCase()) || 
        simpleLower.includes(kw.toLowerCase())
      );

      if (match) {
        assignments.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          topic: lesson.topic,
          imageUrl,
          matchedKeyword: keywords.find(kw => titleLower.includes(kw.toLowerCase()) || simpleLower.includes(kw.toLowerCase())),
        });
      }
    }
  }

  // Deduplicate: one image per lesson (first match wins)
  const seenLessons = new Set();
  const uniqueAssignments = [];
  for (const a of assignments) {
    if (!seenLessons.has(a.lessonId)) {
      seenLessons.add(a.lessonId);
      uniqueAssignments.push(a);
    }
  }

  console.log(`Matched ${uniqueAssignments.length} lessons to handbook illustrations:\n`);
  
  for (const a of uniqueAssignments) {
    console.log(`  "${a.lessonTitle}" [${a.topic}]`);
    console.log(`    -> ${a.imageUrl} (matched: "${a.matchedKeyword}")`);
  }

  if (process.argv.includes('--apply')) {
    console.log('\nApplying assignments...');
    for (const a of uniqueAssignments) {
      await prisma.microLesson.update({
        where: { id: a.lessonId },
        data: { imageUrl: a.imageUrl },
      });
    }
    console.log(`Done! Assigned ${uniqueAssignments.length} handbook illustrations.`);
  } else {
    console.log(`\nRun with --apply to assign these ${uniqueAssignments.length} images.`);
  }
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
