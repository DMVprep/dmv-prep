const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const envFile = fs.readFileSync(".env.local", "utf8");
const matchKey = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = matchKey ? matchKey[1] : "";

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : "";
}

const ALREADY_DONE = ["CA", "FL", "IL", "NY", "PA", "TX"];

async function main() {
  const states = await prisma.state.findMany({ select: { code: true, name: true }, orderBy: { code: "asc" } });
  const remaining = states.filter(s => !ALREADY_DONE.includes(s.code));
  console.log("Generating lessons for " + remaining.length + " states\n");

  let totalCreated = 0;

  for (const state of remaining) {
    const prompt = `Generate exactly 6 state-specific DMV micro lessons for ${state.name}. Each lesson should be a real fact from the ${state.name} driver handbook.

Return ONLY a JSON array with objects containing: topic, title, simpleLine, explanation.

Topics needed (one each):
1. "speed-limits" — school zone or freeway speed limit specific to ${state.name}
2. "safe-driving" — following distance rule or phone/texting law specific to ${state.name}
3. "alcohol-dui" — BAC limit or DUI penalty specific to ${state.name}
4. "licensing-permits" — learner permit age, hours required, or graduated license rule for ${state.name}
5. "safe-driving" — another driving rule specific to ${state.name} (phone law, move over law, etc)
6. "right-of-way" — a right-of-way rule relevant to ${state.name}

Title format: "${state.name} [Rule]: [Key Fact]"
simpleLine: One sentence, plain English.
explanation: 2-3 sentences with specific ${state.name} values.

No markdown, no backticks. JSON only.`;

    const text = await callClaude(prompt);
    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (e) {
      console.log("  X " + state.code + " (parse error)");
      continue;
    }

    if (!Array.isArray(parsed)) continue;

    let created = 0;
    for (const lesson of parsed) {
      if (!lesson.title || !lesson.topic || !lesson.simpleLine) continue;

      const slug = lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").substring(0, 80);

      const existing = await prisma.microLesson.findFirst({ where: { slug } });
      if (existing) continue;

      await prisma.microLesson.create({
        data: {
          slug,
          topic: lesson.topic,
          title: lesson.title,
          simpleLine: lesson.simpleLine,
          explanation: lesson.explanation || lesson.simpleLine,
          stateCode: state.code,
          imageUrl: null,
        },
      });
      created++;
      totalCreated++;
    }

    console.log("  " + state.code + ": " + created + " lessons");
    await new Promise(r => setTimeout(r, 200));
  }

  const total = await prisma.microLesson.count();
  const byState = await prisma.microLesson.count({ where: { stateCode: { not: null } } });
  console.log("\nTotal created: " + totalCreated);
  console.log("Total lessons: " + total + " (" + byState + " state-specific)");
}

main().then(() => prisma.$disconnect());
