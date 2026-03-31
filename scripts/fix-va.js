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
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : "";
}

async function main() {
  const vaState = await prisma.state.findUnique({ where: { code: "VA" } });
  const alcTopic = await prisma.topic.findFirst({ where: { name: "Alcohol & Substances" } });

  const prompt = 'Generate exactly 10 DMV multiple-choice questions about Virginia alcohol and DUI laws. Cover BAC limit 0.08%, zero tolerance under 21, implied consent, DUI penalties, refusal to test, commercial driver BAC 0.04%, effects of alcohol on driving, mixing drugs and driving. Return ONLY a JSON array. No markdown. Each object: question, correct, wrong1, wrong2, wrong3, explanation.';

  const text = await callClaude(prompt);
  let parsed;
  try { parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim()); }
  catch(e) { console.log("Parse error"); return; }

  let created = 0;
  for (const q of parsed) {
    if (!q.question || !q.correct) continue;
    await prisma.question.create({
      data: {
        text: q.question, explanation: q.explanation || "",
        stateId: vaState.id, topicId: alcTopic.id,
        choices: { create: [
          { text: q.correct, isCorrect: true },
          { text: q.wrong1, isCorrect: false },
          { text: q.wrong2, isCorrect: false },
          { text: q.wrong3, isCorrect: false },
        ]},
      },
    });
    created++;
  }
  console.log("Created " + created + " VA alcohol questions");
  const total = await prisma.question.count();
  console.log("Total: " + total);
}

main().then(() => prisma.$disconnect());
