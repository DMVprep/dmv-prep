// scripts/add-illustrations.js
// Run with: node scripts/add-illustrations.js
//
// Links 6 SVG illustrations to one lesson per topic category.
// Only updates the imageUrl field — does not touch any other data.

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ILLUSTRATION_MAP = [
  {
    slug: "4-way-stop-who-goes-first",
    imageUrl: "/illustrations/right-of-way-4way-stop.svg",
    topic: "Right of Way",
  },
  {
    slug: "stop-sign-complete-stop",
    imageUrl: "/illustrations/traffic-signs-stop.svg",
    topic: "Traffic Signs",
  },
  {
    slug: "basic-speed-law",
    imageUrl: "/illustrations/speed-limits-school-zone.svg",
    topic: "Speed Limits",
  },
  {
    slug: "bac-limit-008",
    imageUrl: "/illustrations/alcohol-dui-bac-limit.svg",
    topic: "Alcohol & DUI",
  },
  {
    slug: "following-distance-3-seconds",
    imageUrl: "/illustrations/safe-driving-following-distance.svg",
    topic: "Safe Driving",
  },
  {
    slug: "graduated-license-restrictions",
    imageUrl: "/illustrations/licensing-permits-learners.svg",
    topic: "Licensing & Permits",
  },
];

async function main() {
  console.log("Adding illustrations to lessons...\n");

  for (const item of ILLUSTRATION_MAP) {
    const lesson = await prisma.microLesson.findUnique({ where: { slug: item.slug } });
    if (!lesson) {
      // Try alternative slugs
      console.log(`  NOT FOUND: slug "${item.slug}" — searching by topic...`);
      const fallback = await prisma.microLesson.findFirst({
        where: { topic: item.topic === "Right of Way" ? "right-of-way" 
                      : item.topic === "Traffic Signs" ? "traffic-signs"
                      : item.topic === "Speed Limits" ? "speed-limits"
                      : item.topic === "Alcohol & DUI" ? "alcohol-dui"
                      : item.topic === "Safe Driving" ? "safe-driving"
                      : "licensing-permits",
                 stateCode: null },
        orderBy: { createdAt: "asc" },
      });
      if (fallback) {
        await prisma.microLesson.update({
          where: { id: fallback.id },
          data: { imageUrl: item.imageUrl },
        });
        console.log(`  ✓ ${item.topic}: "${fallback.title}" → ${item.imageUrl} (fallback match)`);
      } else {
        console.log(`  ✗ ${item.topic}: No lesson found`);
      }
      continue;
    }

    await prisma.microLesson.update({
      where: { slug: item.slug },
      data: { imageUrl: item.imageUrl },
    });
    console.log(`  ✓ ${item.topic}: "${lesson.title}" → ${item.imageUrl}`);
  }

  console.log("\nDone!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
