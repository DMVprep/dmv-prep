const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Correct following distance values per state
const FIXES = {
  AK: "4 seconds",
  KY: "3-4 seconds",
  ME: "3 seconds",
  NV: "2 seconds",
  SC: "4 seconds",
  VT: "4 seconds",
};

// Low confidence states — set to 3-4 seconds
const LOW_CONF = ["DE","HI","LA","MA","MI","MN","MO","NE","NH","NM","NC","ND","OK","SD","TN","UT","WA","WY"];

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true } });
  const stateMap = {};
  states.forEach(s => stateMap[s.code] = s.id);

  let fixedAnswers = 0;
  let trimmed = 0;
  let deleted = 0;

  // === STEP 1: Fix wrong answers ===
  console.log("=== STEP 1: Fixing wrong following distance answers ===\n");

  // Fix specific states
  for (const [code, correctValue] of Object.entries(FIXES)) {
    const stateId = stateMap[code];
    if (!stateId) continue;

    const qs = await prisma.question.findMany({
      where: {
        stateId,
        text: { contains: "following distance", mode: "insensitive" },
        NOT: [
          { text: { contains: "increase", mode: "insensitive" } },
          { text: { contains: "adverse", mode: "insensitive" } },
          { text: { contains: "weather", mode: "insensitive" } },
          { text: { contains: "truck", mode: "insensitive" } },
          { text: { contains: "motorcycle", mode: "insensitive" } },
        ],
      },
      include: { choices: true },
    });

    for (const q of qs) {
      const correctChoice = q.choices.find(c => c.isCorrect);
      if (!correctChoice) continue;
      const ans = correctChoice.text.toLowerCase();
      const val = correctValue.split(" ")[0]; // "4" from "4 seconds"

      if (!ans.includes(val)) {
        // Check if correct value exists as a wrong choice — swap it
        const rightChoice = q.choices.find(c => !c.isCorrect && c.text.toLowerCase().includes(val + " second"));
        if (rightChoice) {
          await prisma.choice.update({ where: { id: correctChoice.id }, data: { isCorrect: false } });
          await prisma.choice.update({ where: { id: rightChoice.id }, data: { isCorrect: true } });
          // Update explanation
          await prisma.question.update({
            where: { id: q.id },
            data: { explanation: "The recommended following distance is " + correctValue + " under normal conditions." }
          });
          fixedAnswers++;
        }
      }
    }
    console.log("  " + code + ": fixed " + fixedAnswers + " answers to " + correctValue);
    fixedAnswers = 0;
  }

  // Fix low confidence states
  for (const code of LOW_CONF) {
    const stateId = stateMap[code];
    if (!stateId) continue;

    const qs = await prisma.question.findMany({
      where: {
        stateId,
        text: { contains: "following distance", mode: "insensitive" },
        NOT: [
          { text: { contains: "increase", mode: "insensitive" } },
          { text: { contains: "adverse", mode: "insensitive" } },
          { text: { contains: "weather", mode: "insensitive" } },
          { text: { contains: "truck", mode: "insensitive" } },
          { text: { contains: "motorcycle", mode: "insensitive" } },
        ],
      },
      include: { choices: true },
    });

    let stateFixed = 0;
    for (const q of qs) {
      const correctChoice = q.choices.find(c => c.isCorrect);
      if (!correctChoice) continue;

      // If answer doesnt include 3 or 4, try to fix
      const ans = correctChoice.text.toLowerCase();
      if (!ans.includes("3") && !ans.includes("4")) {
        const betterChoice = q.choices.find(c => !c.isCorrect && (c.text.includes("3") || c.text.includes("4")) && c.text.toLowerCase().includes("second"));
        if (betterChoice) {
          await prisma.choice.update({ where: { id: correctChoice.id }, data: { isCorrect: false } });
          await prisma.choice.update({ where: { id: betterChoice.id }, data: { isCorrect: true } });
          await prisma.question.update({
            where: { id: q.id },
            data: { explanation: "The recommended following distance is 3-4 seconds under normal conditions." }
          });
          stateFixed++;
        }
      }
    }
    if (stateFixed > 0) console.log("  " + code + " (low-conf): fixed " + stateFixed + " answers to 3-4 seconds");
  }

  // Fix CT "35 mph" question
  const ctState = stateMap["CT"];
  if (ctState) {
    const badQ = await prisma.question.findMany({
      where: {
        stateId: ctState,
        text: { contains: "following distance", mode: "insensitive" },
      },
      include: { choices: true },
    });
    for (const q of badQ) {
      const correctChoice = q.choices.find(c => c.isCorrect);
      if (correctChoice && correctChoice.text.includes("35 mph")) {
        const betterChoice = q.choices.find(c => !c.isCorrect && c.text.toLowerCase().includes("3 second"));
        if (betterChoice) {
          await prisma.choice.update({ where: { id: correctChoice.id }, data: { isCorrect: false } });
          await prisma.choice.update({ where: { id: betterChoice.id }, data: { isCorrect: true } });
          console.log("  CT: fixed 35mph answer");
        }
      }
    }
  }

  // === STEP 2: Trim to 3 per state, delete excess ===
  console.log("\n=== STEP 2: Trimming to 3 following distance questions per state ===\n");

  for (const state of states) {
    const questions = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "following distance", mode: "insensitive" },
      },
      include: { choices: true },
      orderBy: { text: "asc" },
    });

    if (questions.length <= 3) continue;

    // Keep best 3: one normal, one weather/increase, one varied
    let keep = [];

    const weatherQ = questions.find(q =>
      q.text.toLowerCase().includes("increase") ||
      q.text.toLowerCase().includes("weather") ||
      q.text.toLowerCase().includes("rain") ||
      q.text.toLowerCase().includes("adverse")
    );
    if (weatherQ) keep.push(weatherQ.id);

    const normalQ = questions.find(q =>
      !keep.includes(q.id) && (
        q.text.toLowerCase().includes("recommended") ||
        q.text.toLowerCase().includes("normal")
      )
    );
    if (normalQ) keep.push(normalQ.id);

    const minQ = questions.find(q =>
      !keep.includes(q.id) && (
        q.text.toLowerCase().includes("minimum") ||
        q.text.toLowerCase().includes("required") ||
        q.text.toLowerCase().includes("safe")
      )
    );
    if (minQ) keep.push(minQ.id);

    for (const q of questions) {
      if (keep.length >= 3) break;
      if (!keep.includes(q.id)) keep.push(q.id);
    }

    const toDelete = questions.filter(q => !keep.includes(q.id));
    for (const q of toDelete) {
      await prisma.choice.deleteMany({ where: { questionId: q.id } });
      await prisma.question.delete({ where: { id: q.id } });
      deleted++;
    }

    if (toDelete.length > 0) {
      trimmed++;
      console.log("  " + state.code + ": kept 3, deleted " + toDelete.length);
    }
  }

  console.log("\n=== DONE ===");
  console.log("Total questions deleted: " + deleted);
  console.log("States trimmed: " + trimmed);

  const remaining = await prisma.question.count();
  console.log("Total questions remaining: " + remaining);
}

main().then(() => prisma.$disconnect());
