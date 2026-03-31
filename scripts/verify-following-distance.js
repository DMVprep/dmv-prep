const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const KNOWN = {
    AL: "2", AK: "3", AZ: "3", AR: "2",
    CA: "3", CO: "3", CT: "3", DE: "3",
    FL: "4", GA: "3", HI: "3", ID: "3",
    IL: "3", IN: "3", IA: "3", KS: "2",
    KY: "4", LA: "3", ME: "4", MD: "3",
    MA: "3", MI: "3", MN: "3", MS: "3",
    MO: "3", MT: "3", NE: "3", NV: "3",
    NH: "3", NJ: "3", NM: "3", NY: "2",
    NC: "2", ND: "3", OH: "3", OK: "3",
    OR: "2", PA: "3", RI: "3", SC: "3",
    SD: "3", TN: "2", TX: "2", UT: "2",
    VT: "3", VA: "2", WA: "2", WV: "3",
    WI: "4", WY: "3",
  };

  console.log("States where normal-conditions following distance questions have wrong answers:\n");

  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } });
  let totalWrong = 0;

  for (const state of states) {
    const known = KNOWN[state.code];
    if (!known) continue;

    const qs = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "following distance", mode: "insensitive" },
      },
      include: { choices: true },
    });

    let wrongCount = 0;
    for (const q of qs) {
      const correct = q.choices.find(c => c.isCorrect);
      if (!correct) continue;
      const ans = correct.text.toLowerCase();
      // Check if answer contains the expected number
      // Skip questions about increasing distance (those have different correct answers)
      const isIncreaseQ = q.text.toLowerCase().includes("increase") || q.text.toLowerCase().includes("adverse") || q.text.toLowerCase().includes("should you") || q.text.toLowerCase().includes("when should");
      if (isIncreaseQ) continue;
      
      if (!ans.includes(known + " second") && !ans.includes(known + "-second") && !ans.includes(known + " to") && !ans.includes(known + "-to-")) {
        if (wrongCount === 0) console.log(state.code + " (handbook: " + known + " seconds):");
        console.log("  X " + q.text.substring(0, 70) + " -> " + correct.text);
        wrongCount++;
        totalWrong++;
      }
    }
  }

  console.log("\nTotal questions with potentially wrong following distance: " + totalWrong);
}

main().then(() => prisma.$disconnect());
