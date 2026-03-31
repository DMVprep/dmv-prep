const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const states = await prisma.state.findMany({
    select: { id: true, code: true },
    orderBy: { code: "asc" },
    take: 10,
  });

  for (const state of states) {
    const qs = await prisma.question.findMany({
      where: {
        stateId: state.id,
        text: { contains: "following distance", mode: "insensitive" },
        NOT: { text: { contains: "increase", mode: "insensitive" } },
      },
      include: { choices: true },
      take: 3,
    });

    const answers = qs.map(q => {
      const c = q.choices.find(c => c.isCorrect);
      return c ? c.text : "?";
    });
    const unique = [...new Set(answers)];
    console.log(state.code + ": " + unique.join(" | "));
  }
}

main().then(() => prisma.$disconnect());
