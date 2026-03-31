const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } });
  const topics = await prisma.topic.findMany();

  console.log("=== TOPIC DISTRIBUTION PER STATE (flagging imbalances) ===\n");

  for (const state of states) {
    const total = await prisma.question.count({ where: { stateId: state.id } });
    const byTopic = [];
    
    for (const topic of topics) {
      const count = await prisma.question.count({ where: { stateId: state.id, topicId: topic.id } });
      const pct = ((count / total) * 100).toFixed(0);
      byTopic.push({ name: topic.name, count, pct: parseInt(pct) });
    }

    // Flag if any topic is >35% or <5%
    const flags = byTopic.filter(t => t.pct > 35 || (t.pct < 5 && t.count > 0));
    if (flags.length > 0 || total < 200) {
      console.log(state.code + " (" + total + " total):");
      byTopic.forEach(t => {
        const flag = t.pct > 35 ? " ⚠️ HIGH" : (t.pct < 8 ? " ⚠️ LOW" : "");
        console.log("  " + t.name + ": " + t.count + " (" + t.pct + "%)" + flag);
      });
      console.log("");
    }
  }
}

main().then(() => prisma.$disconnect());
