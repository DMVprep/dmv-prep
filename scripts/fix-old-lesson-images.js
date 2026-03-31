const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UPDATES = {
  "Stop Sign: You Must Stop Completely": "/signs/stop.png",
  "Yield Sign: Slow Down and Give Way": "/signs/yield.png",
  "Yellow Diamond Signs Warn of Hazards": "/signs/animal-crossing.png",
  "Red Signs Are Laws — Not Suggestions": "/signs/do-not-enter.png",
  "Orange Signs Mark Construction Zones": "/signs/work-zone.png",
  "Green Signs Provide Directions": "/signs/greenguidesign.png",
  "Double Yellow Line Means No Passing": "/handbook-illustrations/double-yellow-lines.png",
  "Flashing Red Light Means Treat as Stop Sign": "/handbook-illustrations/flashing-red-light.png",
};

async function main() {
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(UPDATES)) {
    const result = await prisma.microLesson.updateMany({
      where: { title },
      data: { imageUrl },
    });
    if (result.count > 0) { updated++; console.log("  " + title + " -> " + imageUrl); }
  }
  
  const withImages = await prisma.microLesson.count({ where: { imageUrl: { not: null } } });
  const total = await prisma.microLesson.count();
  console.log("\nUpdated " + updated + " lessons");
  console.log("Total: " + total + " (" + withImages + " with images)");
}

main().then(() => prisma.$disconnect());
