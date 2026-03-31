const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const patterns = [
    "What does this sign mean",
    "What is the speed limit",
    "What is the BAC limit",
    "When must you stop",
    "What shape is",
    "What color is",
    "What does a flashing",
    "How far must you park",
    "What does a yellow",
    "What does a red",
    "Who has the right of way",
    "What is the minimum age",
    "How many feet",
    "What is implied consent",
    "When must you yield",
    "What should you do if",
  ];

  console.log("=== SEARCHABLE QUESTION PATTERNS ===\n");
  for (const p of patterns) {
    const count = await prisma.question.count({
      where: { text: { startsWith: p, mode: "insensitive" } }
    });
    if (count > 0) console.log("  (" + count + ") " + p + "...");
  }

  // Get universal questions appearing in many states
  const universalQs = await prisma.$queryRaw`
    SELECT text, COUNT(DISTINCT "stateId")::int as states
    FROM "Question"
    WHERE text NOT LIKE '%Alabama%' AND text NOT LIKE '%Alaska%' AND text NOT LIKE '%Florida%'
      AND text NOT LIKE '%California%' AND text NOT LIKE '%Texas%' AND text NOT LIKE '%New York%'
      AND text NOT LIKE '%Georgia%' AND text NOT LIKE '%Ohio%' AND text NOT LIKE '%Illinois%'
      AND text NOT LIKE '%Pennsylvania%' AND text NOT LIKE '%Michigan%'
      AND text NOT LIKE '%in your state%'
      AND LENGTH(text) > 30 AND LENGTH(text) < 120
    GROUP BY text
    HAVING COUNT(DISTINCT "stateId") >= 3
    ORDER BY COUNT(DISTINCT "stateId") DESC
    LIMIT 50
  `;

  console.log("\n=== TOP UNIVERSAL QUESTIONS (3+ states) ===\n");
  universalQs.forEach((q, i) => {
    console.log("  " + (i+1) + ". (" + q.states + " states) " + q.text);
  });
}

main().then(() => prisma.$disconnect());
