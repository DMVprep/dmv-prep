const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function count(stateCode, keyword) {
  const state = await prisma.state.findUnique({ where: { code: stateCode } });
  if (!state) return 0;
  return await prisma.question.count({
    where: { stateId: state.id, text: { contains: keyword, mode: "insensitive" } }
  });
}

async function main() {
  const ALREADY_HAD = ["FL","CA","TX","NY","PA","IL","OH","GA","NC","MI"];
  const states = await prisma.state.findMany({ select: { code: true }, orderBy: { code: "asc" } });
  const remaining = states.filter(s => !ALREADY_HAD.includes(s.code)).map(s => s.code);

  const topics = [
    ["Distracted/cell phone", "cell phone"],
    ["Stopping distance", "stopping distance"],
    ["Reaction time", "reaction time"],
    ["Braking distance", "braking distance"],
    ["Lane changing", "lane chang"],
    ["Night driving", "night"],
    ["Defensive driving", "defensive"],
    ["Tailgating", "tailgat"],
    ["Road rage", "road rage"],
    ["Hill parking", "hill"],
    ["Expressway", "expressway"],
    ["Lane markings", "pavement marking"],
    ["Insurance", "insurance"],
    ["Financial resp", "financial responsibility"],
    ["Hit and run", "hit and run"],
    ["Registration", "registration"],
    ["Child seats", "child"],
    ["Airbags", "airbag"],
    ["Animals", "animal"],
    ["Bridges", "bridge"],
  ];

  console.log("=== GAPS: States with 0 questions per topic ===\n");
  let totalGaps = 0;

  for (const [name, kw] of topics) {
    const gaps = [];
    for (const code of remaining) {
      const c = await count(code, kw);
      if (c === 0) gaps.push(code);
    }
    if (gaps.length > 0) {
      console.log(name + " (" + gaps.length + " states missing): " + gaps.join(", "));
      totalGaps += gaps.length;
    }
  }
  
  console.log("\nTotal gaps: " + totalGaps);
}

main().then(() => prisma.$disconnect());
