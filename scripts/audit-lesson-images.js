const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define which images make sense for which topics
const VALID_IMAGE_TOPICS = {
  // Traffic sign images — only relevant for traffic-signs topic
  "stop.png": ["traffic-signs"],
  "yield.png": ["traffic-signs"],
  "speed-limit.png": ["traffic-signs", "speed-limits"],
  "school-zone.png": ["traffic-signs", "speed-limits"],
  "school-speed-limit.png": ["traffic-signs", "speed-limits"],
  "school-bus-stop.png": ["traffic-signs", "safe-driving"],
  "pedestrian-crossing.png": ["traffic-signs", "right-of-way"],
  "no-u-turn.png": ["traffic-signs"],
  "no-left-turn.png": ["traffic-signs"],
  "no-right-turn.png": ["traffic-signs"],
  "no-passing.png": ["traffic-signs"],
  "no-parking.png": ["traffic-signs"],
  "no-turn-on-red.png": ["traffic-signs"],
  "do-not-enter.png": ["traffic-signs"],
  "wrong-way.png": ["traffic-signs"],
  "one-way.png": ["traffic-signs"],
  "keep-right.png": ["traffic-signs"],
  "merging-traffic.png": ["traffic-signs", "safe-driving"],
  "railroadcrossing.png": ["traffic-signs"],
  "railroad-crossing.png": ["traffic-signs"],
  "work-zone.png": ["traffic-signs", "safe-driving"],
  "slippery-surface.png": ["traffic-signs", "safe-driving"],
  "low-clearance.png": ["traffic-signs"],
  "center-turn-lane.png": ["traffic-signs"],
  "right-curve.png": ["traffic-signs"],
  "winding-road.png": ["traffic-signs"],
  "soft-shoulder.png": ["traffic-signs"],
  "pavement-ends.png": ["traffic-signs"],
  "animal-crossing.png": ["traffic-signs"],
  "lane-reduction.png": ["traffic-signs"],
  "lane-yellow-x.png": ["traffic-signs"],
  "lane-red-x.png": ["traffic-signs"],
  "lane-green-arrow.png": ["traffic-signs"],
  "must-turn.png": ["traffic-signs"],
  "disabled-parking.png": ["traffic-signs"],
  "hill-downgrade.png": ["traffic-signs", "safe-driving"],
  "no-symbol.png": ["traffic-signs"],
  "stop-sign-ahead.png": ["traffic-signs"],
  "blueguidesign.png": ["traffic-signs"],
  "brownguidesign.png": ["traffic-signs"],
  "greenguidesign.png": ["traffic-signs"],
  "advisory-speed.png": ["traffic-signs", "speed-limits"],
  "exit-speed.png": ["traffic-signs", "speed-limits"],
  "speed-reduction.png": ["traffic-signs", "speed-limits"],
  "roundabout-ahead.png": ["traffic-signs", "right-of-way"],
  "traffic-signal-ahead.png": ["traffic-signs"],
  "two-way-traffic.png": ["traffic-signs"],
  "divided-hwy-ahead.png": ["traffic-signs"],
  "divided-hwy-ends.png": ["traffic-signs"],
  "narrow-bridge.png": ["traffic-signs"],
  "sharp-right-turn.png": ["traffic-signs"],
  "side-road.png": ["traffic-signs"],
  "cross-road.png": ["traffic-signs"],
  "dip.png": ["traffic-signs"],
  "truck-crossing.png": ["traffic-signs"],
  "bicycle-crossing.png": ["traffic-signs"],
  "all-way-stop.png": ["traffic-signs", "right-of-way"],
  "flashingarrow.png": ["traffic-signs"],
  "fines-doubled.png": ["traffic-signs", "safe-driving"],
  "emergency-stop.png": ["traffic-signs", "safe-driving"],
  "emergency-vehicle.png": ["traffic-signs", "safe-driving"],
  "restricted-lane.png": ["traffic-signs"],
  "pass-with-care.png": ["traffic-signs"],
  "slower-traffic.png": ["traffic-signs"],
  "draw-bridge.png": ["traffic-signs"],
  "reverse-curve.png": ["traffic-signs"],
  "yield-ahead.png": ["traffic-signs"],
  "begin-right-turn-lane.png": ["traffic-signs"],
  "left-lane-must-turn.png": ["traffic-signs"],
  "one-lane-bridge.png": ["traffic-signs"],
  "turn-lanes.png": ["traffic-signs"],
  "end-school-zone.png": ["traffic-signs", "speed-limits"],
  "school-zone-arrow.png": ["traffic-signs", "speed-limits"],
};

// Handbook illustrations — check filename for topic relevance
const HANDBOOK_TOPIC_KEYWORDS = {
  "alcohol-dui": ["alcohol", "dui", "bac", "drink", "impair", "beer", "wine"],
  "safe-driving": ["following", "distance", "brake", "stop", "merge", "blind", "mirror", "seat", "belt", "airbag", "signal", "turn", "lane", "park", "night", "rain", "fog", "highway", "freeway"],
  "speed-limits": ["speed", "limit", "zone", "mph"],
  "right-of-way": ["right-of-way", "yield", "intersection", "pedestrian", "crosswalk", "roundabout"],
  "traffic-signs": ["sign", "signal", "light", "arrow", "marking", "lane"],
  "licensing-permits": ["license", "permit", "registration", "insurance", "learner"],
};

async function main() {
  const lessons = await prisma.microLesson.findMany({
    where: { imageUrl: { not: null } },
  });

  console.log(`Auditing ${lessons.length} lessons with images...\n`);

  const issues = [];
  const good = [];

  for (const lesson of lessons) {
    const imageUrl = lesson.imageUrl;
    const topic = lesson.topic;
    const title = lesson.title;

    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    const isSignImage = imageUrl.includes('/signs/');
    const isHandbookImage = imageUrl.includes('/handbook-illustrations/');

    if (isSignImage) {
      const validTopics = VALID_IMAGE_TOPICS[filename];
      if (validTopics && validTopics.includes(topic)) {
        good.push({ title, topic, image: filename, reason: 'Sign matches topic' });
      } else if (validTopics && !validTopics.includes(topic)) {
        issues.push({
          id: lesson.id,
          title,
          topic,
          image: imageUrl,
          severity: 'HIGH',
          reason: `Sign "${filename}" is for [${validTopics?.join(', ')}] but lesson topic is [${topic}]`,
        });
      } else {
        // Unknown sign file
        issues.push({
          id: lesson.id,
          title,
          topic,
          image: imageUrl,
          severity: 'MEDIUM',
          reason: `Unknown sign file: ${filename}`,
        });
      }
    } else if (isHandbookImage) {
      // Check if handbook illustration filename relates to the topic
      const topicKeywords = HANDBOOK_TOPIC_KEYWORDS[topic] || [];
      const filenameLower = filename.toLowerCase();
      const titleLower = title.toLowerCase();
      const matches = topicKeywords.some(kw => filenameLower.includes(kw) || titleLower.includes(kw));
      
      if (matches) {
        good.push({ title, topic, image: filename, reason: 'Handbook image matches topic' });
      } else {
        issues.push({
          id: lesson.id,
          title,
          topic,
          image: imageUrl,
          severity: 'MEDIUM',
          reason: `Handbook image "${filename}" may not match topic [${topic}] — verify visually`,
        });
      }
    } else {
      // Other image source
      good.push({ title, topic, image: filename, reason: 'External image' });
    }
  }

  // Print issues
  console.log(`=== LESSON IMAGE AUDIT ===\n`);
  console.log(`Good matches: ${good.length}`);
  console.log(`Issues found: ${issues.length}\n`);

  const high = issues.filter(i => i.severity === 'HIGH');
  const medium = issues.filter(i => i.severity === 'MEDIUM');

  if (high.length > 0) {
    console.log(`\n--- HIGH: Wrong topic sign images (${high.length}) ---\n`);
    high.forEach((issue, i) => {
      console.log(`${i + 1}. "${issue.title}" [${issue.topic}]`);
      console.log(`   Image: ${issue.image}`);
      console.log(`   Issue: ${issue.reason}`);
      console.log(`   ID: ${issue.id}`);
      console.log('');
    });
  }

  if (medium.length > 0) {
    console.log(`\n--- MEDIUM: Verify manually (${medium.length}) ---\n`);
    medium.forEach((issue, i) => {
      console.log(`${i + 1}. "${issue.title}" [${issue.topic}]`);
      console.log(`   Image: ${issue.image}`);
      console.log(`   Issue: ${issue.reason}`);
      console.log(`   ID: ${issue.id}`);
      console.log('');
    });
  }

  // Ask about auto-fix
  console.log(`\n=== RECOMMENDED ACTION ===`);
  console.log(`Remove images from ${high.length} lessons where sign doesn't match topic.`);
  console.log(`Run with --apply to remove these images.\n`);

  if (process.argv.includes('--apply')) {
    console.log('Applying fixes...');
    for (const issue of high) {
      await prisma.microLesson.update({
        where: { id: issue.id },
        data: { imageUrl: null },
      });
      console.log(`  Removed image from: "${issue.title}"`);
    }
    console.log(`\nDone! Removed ${high.length} mismatched images.`);
  }
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
