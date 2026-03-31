const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Check for duplicate questions (same text, same state)
  const dupes = await prisma.$queryRaw`
    SELECT q.text, s.code, COUNT(*)::int as count
    FROM "Question" q JOIN "State" s ON q."stateId" = s.id
    GROUP BY q.text, s.code
    HAVING COUNT(*) > 1
    ORDER BY count DESC
    LIMIT 20
  `;

  console.log("=== DUPLICATE QUESTIONS (same text + same state) ===");
  console.log("Found " + dupes.length + " duplicate patterns\n");
  dupes.forEach(d => {
    console.log("  [" + d.code + "] (" + d.count + "x) " + d.text.substring(0, 80));
  });

  // Re-run topic audit for previously missing/low topics
  console.log("\n=== UPDATED TOPIC COUNTS (previously missing/low) ===\n");
  const checks = [
    ["Distracted driving", "distracted driv"],
    ["Cell phone", "cell phone"],
    ["Stopping distance", "stopping distance"],
    ["Reaction time", "reaction time"],
    ["Braking distance", "braking distance"],
    ["Lane changing", "lane chang"],
    ["Night driving", "night driv"],
    ["Defensive driving", "defensive driv"],
    ["Tailgating", "tailgat"],
    ["Road rage", "road rage"],
    ["Hill parking", "parking uphill"],
    ["Hill parking 2", "hill"],
    ["Child seat", "child seat"],
    ["Child restraint", "child restraint"],
    ["Booster seat", "booster"],
    ["Car seat", "car seat"],
    ["Insurance", "insurance"],
    ["Financial responsibility", "financial responsibility"],
    ["Hit and run", "hit and run"],
    ["Registration", "registration"],
    ["Airbags", "airbag"],
    ["Animals on road", "animal"],
    ["Bridges/tunnels", "bridge"],
    ["Lane markings", "lane marking"],
    ["Expressway", "expressway"],
  ];

  for (const [name, kw] of checks) {
    const c = await prisma.question.count({ where: { text: { contains: kw, mode: "insensitive" } } });
    console.log("  " + name + ": " + c);
  }
}

main().then(() => prisma.$disconnect());
