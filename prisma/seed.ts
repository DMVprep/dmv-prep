// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { US_STATES } from "../src/data/states";
import { SAMPLE_QUESTIONS } from "../src/data/questions";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create states
  for (const s of US_STATES) {
    await prisma.state.upsert({
      where: { code: s.code },
      update: {},
      create: { code: s.code, name: s.name },
    });
  }
  console.log(`✓ ${US_STATES.length} states created`);

  // Create topics
  const topicMap: Record<string, string> = {};
  for (const tg of SAMPLE_QUESTIONS) {
    const topic = await prisma.topic.upsert({
      where: { slug: tg.topic },
      update: {},
      create: {
        name: tg.topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: tg.topic,
      },
    });
    topicMap[tg.topic] = topic.id;
  }
  console.log("✓ Topics created");

  // Add questions for California (CA) as sample
  const caState = await prisma.state.findUnique({ where: { code: "CA" } });
  if (!caState) throw new Error("CA state not found");

  let qCount = 0;
  for (const tg of SAMPLE_QUESTIONS) {
    const topicId = topicMap[tg.topic];
    for (const q of tg.questions) {
      const existing = await prisma.question.findFirst({
        where: { text: q.text, stateId: caState.id },
      });
      if (existing) continue;

      await prisma.question.create({
        data: {
          text: q.text,
          explanation: q.explanation,
          stateId: caState.id,
          topicId,
          choices: {
            create: q.choices.map((text, i) => ({
              text,
              isCorrect: i === q.correct,
            })),
          },
        },
      });
      qCount++;
    }
  }
  console.log(`✓ ${qCount} sample questions created for California`);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@dmvprep.pro" },
    update: {},
    create: {
      email: "admin@dmvprep.pro",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      plan: "PREMIUM",
    },
  });
  console.log("✓ Admin user created (admin@dmvprep.pro / admin123)");

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
