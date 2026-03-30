const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  // Set multiple sign images on Oregon questions
  const maps = [
    { keyword: "stop sign", image: "/signs/stop.png" },
    { keyword: "yield", image: "/signs/yield.png" },
    { keyword: "railroad crossing", image: "/signs/railroadcrossing.png" },
    { keyword: "school zone", image: "/signs/school-zone.png" },
    { keyword: "do not enter", image: "/signs/do-not-enter.png" },
    { keyword: "work zone", image: "/signs/work-zone.png" },
    { keyword: "speed limit sign", image: "/signs/speed-limit.png" },
    { keyword: "wrong way", image: "/signs/wrong-way.png" },
  ];

  let total = 0;
  for (const m of maps) {
    const updated = await prisma.question.updateMany({
      where: {
        topic: { name: "Traffic Signs" },
        state: { code: "OR" },
        text: { contains: m.keyword, mode: "insensitive" },
        imageUrl: null,
      },
      data: { imageUrl: m.image }
    });
    if (updated.count > 0) {
      console.log('  ' + m.image + ': ' + updated.count + ' questions');
      total += updated.count;
    }
  }
  console.log('\nTotal: ' + total + ' Oregon questions now have images');
}
main().then(() => prisma.$disconnect());
