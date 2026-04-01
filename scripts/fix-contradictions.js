const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fix #8: FL highway minimum speed — answer should be 50 MPH not 40
  // "A highway sign shows the speed limit as 55 MPH. What is the minimum speed you should maintain?"
  // Explanation says 50 MPH is correct
  const flSpeed = await prisma.question.findMany({
    where: {
      state: { code: "FL" },
      text: { contains: "highway sign shows the speed limit as 55 MPH" },
    },
    include: { choices: true },
  });
  for (const q of flSpeed) {
    // Fix: make 50 MPH correct, make 40 MPH incorrect
    for (const c of q.choices) {
      if (c.text.includes("50 MPH") || c.text.includes("50 mph")) {
        await prisma.choice.update({ where: { id: c.id }, data: { isCorrect: true } });
        console.log(`Fixed FL speed: set "${c.text}" as correct`);
      } else if (c.text.includes("40 MPH") || c.text.includes("40 mph")) {
        await prisma.choice.update({ where: { id: c.id }, data: { isCorrect: false } });
        console.log(`Fixed FL speed: set "${c.text}" as incorrect`);
      }
    }
  }

  // Fix #5: MS interstate minimum speed — answer says 39 but explanation says below 40
  // This is actually correct (39 < 40 = violation), but confusing. Let's clarify explanation.
  const msSpeed = await prisma.question.findMany({
    where: {
      state: { code: "MS" },
      text: { contains: "traveling very slowly" },
      text: { contains: "what speed would that vehicle" },
    },
    include: { choices: true },
  });
  // This one is actually correct — 39 mph IS below the 40 mph minimum. Skip.

  // Fix #11: VT highway minimum speed
  // Answer "45 mph" but explanation says 10-20 mph below posted limit
  // If posted is 65, then 45 is 20 below — this is borderline. The explanation is vague.
  // Fix explanation to match answer.
  const vtSpeed = await prisma.question.findMany({
    where: {
      state: { code: "VT" },
      text: { contains: "Vermont highway" },
      text: { contains: "minimum speed" },
    },
    include: { choices: true },
  });
  for (const q of vtSpeed) {
    await prisma.question.update({
      where: { id: q.id },
      data: {
        explanation: "On Vermont highways, you should not drive so slowly as to impede normal traffic flow. While Vermont does not have a specific minimum speed law, driving more than 20 mph below the posted limit can be considered impeding traffic. At a posted 65 mph, maintaining at least 45 mph is a reasonable minimum."
      }
    });
    console.log(`Fixed VT speed explanation`);
  }

  // Fix FL fire hydrant — "215 feet" is clearly wrong, should be "15 feet"
  const flHydrant = await prisma.question.findMany({
    where: {
      state: { code: "FL" },
      text: { contains: "fire hydrant" },
    },
    include: { choices: true },
  });
  for (const q of flHydrant) {
    for (const c of q.choices) {
      if (c.text === "215 feet" || c.text === "215 Feet") {
        // This choice shouldn't be correct — 15 feet is the right answer
        await prisma.choice.update({ where: { id: c.id }, data: { isCorrect: false } });
        console.log(`Fixed FL hydrant: set "215 feet" as incorrect for: ${q.text.substring(0, 80)}`);
      }
      if (c.text === "15 feet" || c.text === "15 Feet" || c.text.includes("15 feet")) {
        await prisma.choice.update({ where: { id: c.id }, data: { isCorrect: true } });
        console.log(`Fixed FL hydrant: set "15 feet" as correct for: ${q.text.substring(0, 80)}`);
      }
    }
    // Also fix explanation if it says 115 feet
    if (q.explanation.includes("115 feet")) {
      await prisma.question.update({
        where: { id: q.id },
        data: { explanation: q.explanation.replace(/115 feet/g, "15 feet") }
      });
      console.log(`Fixed FL hydrant explanation: 115 -> 15 feet`);
    }
  }

  // Fix NC intersection parking distance
  // Answer says 25 feet, explanation says 20 feet — NC handbook says 25 feet is correct
  const ncParking = await prisma.question.findMany({
    where: {
      state: { code: "NC" },
      text: { contains: "intersection must you park" },
    },
    include: { choices: true },
  });
  for (const q of ncParking) {
    // Fix explanation to match the correct answer of 25 feet
    await prisma.question.update({
      where: { id: q.id },
      data: {
        explanation: "In North Carolina, you must park at least 25 feet from an intersection to maintain visibility and traffic flow."
      }
    });
    console.log(`Fixed NC parking explanation: now says 25 feet`);
  }

  // Fix CT residential speed
  // Answer says 30 mph (posted), explanation mentions 25 mph
  // The answer IS correct — if 30 is posted, that's the limit. Explanation just needs cleanup.
  const ctSpeed = await prisma.question.findMany({
    where: {
      state: { code: "CT" },
      text: { contains: "residential street has a posted speed limit of 30" },
    },
  });
  for (const q of ctSpeed) {
    await prisma.question.update({
      where: { id: q.id },
      data: {
        explanation: "When a speed limit is posted, that posted limit is the legal maximum speed, even if it differs from the typical residential default. A posted 30 mph sign means 30 mph is the legal maximum on that street."
      }
    });
    console.log(`Fixed CT residential speed explanation`);
  }

  console.log("\nDone! Review the changes above.");
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
