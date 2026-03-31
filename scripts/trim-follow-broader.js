const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } });
  let totalDeleted = 0;

  for (const state of states) {
    const questions = await prisma.question.findMany({
      where: {
        stateId: state.id,
        OR: [
          { text: { contains: "following distance", mode: "insensitive" } },
          { text: { contains: "following rule", mode: "insensitive" } },
          { text: { contains: "two-second", mode: "insensitive" } },
          { text: { contains: "three-second", mode: "insensitive" } },
          { text: { contains: "four-second", mode: "insensitive" } },
          { text: { contains: "follow too closely", mode: "insensitive" } },
          { text: { contains: "following another vehicle", mode: "insensitive" } },
          { text: { contains: "tailgating", mode: "insensitive" } },
        ]
      },
      include: { choices: true },
      orderBy: { createdAt: "asc" },
    });

    if (questions.length <= 3) continue;

    let keep = [];
    const weatherQ = questions.find(q =>
      q.text.toLowerCase().includes("increase") ||
      q.text.toLowerCase().includes("weather") ||
      q.text.toLowerCase().includes("rain") ||
      q.text.toLowerCase().includes("adverse") ||
      q.text.toLowerCase().includes("tailgat")
    );
    if (weatherQ) keep.push(weatherQ.id);

    const normalQ = questions.find(q =>
      !keep.includes(q.id) && (
        q.text.toLowerCase().includes("recommended") ||
        q.text.toLowerCase().includes("normal") ||
        q.text.toLowerCase().includes("minimum safe")
      )
    );
    if (normalQ) keep.push(normalQ.id);

    const variedQ = questions.find(q =>
      !keep.includes(q.id) && (
        q.text.toLowerCase().includes("measure") ||
        q.text.toLowerCase().includes("determine") ||
        q.text.toLowerCase().includes("method") ||
        q.text.toLowerCase().includes("closely") ||
        q.text.toLowerCase().includes("aggressive")
      )
    );
    if (variedQ) keep.push(variedQ.id);

    for (const q of questions) {
      if (keep.length >= 3) break;
      if (!keep.includes(q.id)) keep.push(q.id);
    }

    const toDelete = questions.filter(q => !keep.includes(q.id));
    for (const q of toDelete) {
      await prisma.choice.deleteMany({ where: { questionId: q.id } });
      await prisma.question.delete({ where: { id: q.id } });
      totalDeleted++;
    }

    if (toDelete.length > 0) console.log("  " + state.code + ": kept 3, deleted " + toDelete.length);
  }

  console.log("\nTotal deleted: " + totalDeleted);
  const remaining = await prisma.question.count();
  console.log("Questions remaining: " + remaining);
}

main().then(() => prisma.$disconnect());
