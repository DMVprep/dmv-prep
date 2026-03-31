const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const envFile = fs.readFileSync(".env.local", "utf8");
const matchKey = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = matchKey ? matchKey[1] : "";

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : "";
}

const ALREADY_DONE = ["FL","CA","TX","NY","PA","IL","OH","GA","NC","MI"];

const SUBJECTS = [
  { name: "Distracted driving", count: 3, topic: "Safe Driving", prompt: "distracted driving and cell phone use while driving. Include texting, hands-free laws, and penalties." },
  { name: "Stopping distance", count: 2, topic: "Safe Driving", prompt: "total stopping distance (reaction distance + braking distance). Include how speed affects stopping distance." },
  { name: "Reaction time", count: 2, topic: "Safe Driving", prompt: "reaction time while driving. Average reaction time is 1.5 seconds. At 60mph you travel 88 feet per second." },
  { name: "Braking distance", count: 2, topic: "Safe Driving", prompt: "braking distance at different speeds. Braking distance increases with speed squared." },
  { name: "Lane changing", count: 3, topic: "Safe Driving", prompt: "safe lane changing procedure: check mirrors, signal, check blind spot, change lanes smoothly." },
  { name: "Night driving", count: 2, topic: "Safe Driving", prompt: "safe night driving: headlights, reduce speed, increase following distance, high beams." },
  { name: "Defensive driving", count: 2, topic: "Safe Driving", prompt: "defensive driving techniques: anticipate hazards, safe following distance, scan intersections." },
  { name: "Tailgating", count: 1, topic: "Safe Driving", prompt: "tailgating: why dangerous, what to do if tailgated, penalties." },
  { name: "Road rage", count: 1, topic: "Safe Driving", prompt: "road rage: what it is, how to avoid, what to do if confronted." },
  { name: "Hill parking", count: 2, topic: "Safe Driving", prompt: "parking on a hill: turn wheels uphill with curb, downhill with curb, no curb rules." },
  { name: "Expressway", count: 2, topic: "Safe Driving", prompt: "entering and exiting expressways: acceleration lane, match speed, signal, deceleration lane." },
  { name: "Lane markings", count: 2, topic: "Traffic Signs", prompt: "pavement markings: solid yellow, broken yellow, double yellow, white lines, shared turn lane." },
  { name: "Insurance", count: 2, topic: "Licensing & Permits", prompt: "auto insurance requirements: minimum coverage, proof of insurance, penalties without insurance." },
  { name: "Financial resp", count: 1, topic: "Licensing & Permits", prompt: "financial responsibility law: proving ability to pay for accident damages." },
  { name: "Hit and run", count: 2, topic: "Licensing & Permits", prompt: "hit and run: must stop, exchange info, report to police, penalties for leaving scene." },
  { name: "Registration", count: 1, topic: "Licensing & Permits", prompt: "vehicle registration: keep current, display plates, penalties for expired." },
  { name: "Child seats", count: 2, topic: "Licensing & Permits", prompt: "child safety seats: rear-facing age 2, forward-facing, booster seat, when regular belt OK." },
  { name: "Airbags", count: 1, topic: "Alcohol & Substances", prompt: "airbag safety: work with seatbelts, danger to children in front, proper distance from wheel." },
  { name: "Animals", count: 1, topic: "Speed Limits", prompt: "animals on road: deer crossings, do not swerve into oncoming traffic." },
  { name: "Bridges", count: 1, topic: "Speed Limits", prompt: "bridges and tunnels: headlights in tunnels, bridges ice before roads, no stopping." },
];

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true, name: true }, orderBy: { code: "asc" } });
  const topics = await prisma.topic.findMany();
  const topicMap = {};
  topics.forEach(t => topicMap[t.name] = t.id);

  const targetStates = states.filter(s => !ALREADY_DONE.includes(s.code));
  console.log("Generating for " + targetStates.length + " remaining states\n");

  let totalCreated = 0;

  for (const subject of SUBJECTS) {
    const topicId = topicMap[subject.topic];
    if (!topicId) { console.log("Topic not found: " + subject.topic); continue; }

    console.log("\n" + subject.name + " (" + subject.count + " per state)...");

    for (const state of targetStates) {
      const prompt = 'Generate exactly ' + subject.count + ' DMV practice test multiple-choice questions about ' + subject.prompt + ' Make questions specific for ' + state.name + '. Return ONLY a JSON array. No markdown, no backticks. Each object must have: question, correct, wrong1, wrong2, wrong3, explanation.';

      const text = await callClaude(prompt);
      let parsed;
      try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.log("  X " + state.code);
        continue;
      }

      if (!Array.isArray(parsed)) continue;

      for (const q of parsed) {
        if (!q.question || !q.correct || !q.wrong1 || !q.wrong2 || !q.wrong3) continue;
        await prisma.question.create({
          data: {
            text: q.question,
            explanation: q.explanation || "",
            stateId: state.id,
            topicId: topicId,
            choices: {
              create: [
                { text: q.correct, isCorrect: true },
                { text: q.wrong1, isCorrect: false },
                { text: q.wrong2, isCorrect: false },
                { text: q.wrong3, isCorrect: false },
              ],
            },
          },
        });
        totalCreated++;
      }

      await new Promise(r => setTimeout(r, 200));
    }
    console.log("  Total so far: " + totalCreated);
  }

  console.log("\n=== DONE === Total new questions: " + totalCreated);
  const total = await prisma.question.count();
  console.log("Total questions in DB: " + total);
}

main().then(() => prisma.$disconnect());
