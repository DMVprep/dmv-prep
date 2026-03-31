const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== ACCURACY AUDIT ===\n");

  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } });

  // 1. Find questions where the same question text has DIFFERENT correct answers within the same state
  console.log("--- 1. CONFLICTING ANSWERS (same question, same state, different correct answer) ---\n");
  
  let conflicts = 0;
  for (const state of states) {
    const qs = await prisma.question.findMany({
      where: { stateId: state.id },
      include: { choices: true },
    });

    const byText = {};
    for (const q of qs) {
      const key = q.text.toLowerCase().trim();
      const correct = q.choices.find(c => c.isCorrect);
      if (!correct) continue;
      if (!byText[key]) byText[key] = [];
      byText[key].push({ id: q.id, answer: correct.text });
    }

    for (const [text, answers] of Object.entries(byText)) {
      if (answers.length < 2) continue;
      const uniqueAnswers = new Set(answers.map(a => a.answer.toLowerCase().trim()));
      if (uniqueAnswers.size > 1) {
        if (conflicts < 20) {
          console.log("[" + state.code + "] " + text.substring(0, 60));
          answers.forEach(a => console.log("  -> " + a.answer));
        }
        conflicts++;
      }
    }
  }
  console.log("\nTotal conflicting question sets: " + conflicts);

  // 2. Questions with no correct answer
  console.log("\n--- 2. QUESTIONS WITH NO CORRECT ANSWER ---\n");
  const allQs = await prisma.question.findMany({
    include: { choices: true, state: { select: { code: true } } },
  });
  
  let noCorrect = 0;
  for (const q of allQs) {
    if (!q.choices.some(c => c.isCorrect)) {
      if (noCorrect < 10) console.log("[" + q.state.code + "] " + q.text.substring(0, 70));
      noCorrect++;
    }
  }
  console.log("Total with no correct answer: " + noCorrect);

  // 3. Questions with multiple correct answers
  console.log("\n--- 3. QUESTIONS WITH MULTIPLE CORRECT ANSWERS ---\n");
  let multiCorrect = 0;
  for (const q of allQs) {
    const correctCount = q.choices.filter(c => c.isCorrect).length;
    if (correctCount > 1) {
      if (multiCorrect < 10) {
        console.log("[" + q.state.code + "] " + q.text.substring(0, 70));
        q.choices.filter(c => c.isCorrect).forEach(c => console.log("  CORRECT: " + c.text));
      }
      multiCorrect++;
    }
  }
  console.log("Total with multiple correct: " + multiCorrect);

  // 4. BAC limit check — verify consistency per state
  console.log("\n--- 4. BAC LIMIT CONSISTENCY ---\n");
  for (const state of states) {
    const bacQs = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "BAC limit", mode: "insensitive" },
        text: { contains: "adult", mode: "insensitive" },
      },
      include: { choices: true },
    });
    
    const answers = new Set();
    bacQs.forEach(q => {
      const c = q.choices.find(c => c.isCorrect);
      if (c) answers.add(c.text.toLowerCase().trim());
    });
    
    if (answers.size > 1) {
      console.log(state.code + " BAC conflict: " + [...answers].join(" vs "));
    }
  }

  // 5. School zone speed limit check
  console.log("\n--- 5. SCHOOL ZONE SPEED CONSISTENCY ---\n");
  for (const state of states) {
    const szQs = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "school zone", mode: "insensitive" },
        text: { contains: "speed", mode: "insensitive" },
      },
      include: { choices: true },
    });
    
    const answers = new Set();
    szQs.forEach(q => {
      const c = q.choices.find(c => c.isCorrect);
      if (c && c.text.toLowerCase().includes("mph")) answers.add(c.text.toLowerCase().trim());
    });
    
    if (answers.size > 1) {
      console.log(state.code + " school zone conflict: " + [...answers].join(" vs "));
    }
  }

  // 6. Very short or very long questions (possible garbage)
  console.log("\n--- 6. SUSPICIOUS QUESTIONS (too short or too long) ---\n");
  let suspicious = 0;
  for (const q of allQs) {
    if (q.text.length < 15) {
      if (suspicious < 5) console.log("[" + q.state.code + "] TOO SHORT: " + q.text);
      suspicious++;
    }
    if (q.text.length > 300) {
      if (suspicious < 10) console.log("[" + q.state.code + "] TOO LONG: " + q.text.substring(0, 80) + "...");
      suspicious++;
    }
  }
  console.log("Total suspicious: " + suspicious);
}

main().then(() => prisma.$disconnect());
