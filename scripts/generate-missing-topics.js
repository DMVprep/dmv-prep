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

const TOPIC_QUESTIONS = [
  {
    topicName: "Safe Driving",
    subjects: [
      { name: "Distracted driving", count: 3, prompt: "distracted driving and cell phone use while driving. Include texting, hands-free laws, and penalties. Make questions state-specific for STATE_NAME." },
      { name: "Stopping distance", count: 2, prompt: "total stopping distance (reaction distance + braking distance). Include how speed affects stopping distance (doubling speed = 4x braking distance). Use STATE_NAME handbook context." },
      { name: "Reaction time", count: 2, prompt: "reaction time while driving. Average reaction time is 1.5 seconds. At 60mph you travel 88 feet per second. Include how fatigue, alcohol, and distractions increase reaction time. For STATE_NAME." },
      { name: "Braking distance", count: 2, prompt: "braking distance at different speeds. At 20mph ~20ft, at 40mph ~80ft, at 60mph ~180ft. Braking distance increases with speed squared. For STATE_NAME." },
      { name: "Lane changing", count: 3, prompt: "safe lane changing procedure: check mirrors, signal, check blind spot, change lanes smoothly. Include common mistakes. For STATE_NAME." },
      { name: "Night driving", count: 2, prompt: "safe night driving: use headlights, reduce speed, increase following distance, avoid looking at oncoming headlights, use high beams appropriately. For STATE_NAME." },
      { name: "Defensive driving", count: 2, prompt: "defensive driving techniques: anticipate hazards, maintain safe following distance, scan intersections, expect the unexpected. For STATE_NAME." },
      { name: "Tailgating", count: 1, prompt: "tailgating: why it is dangerous, what to do if someone is tailgating you (slow down, move over), penalties. For STATE_NAME." },
      { name: "Road rage", count: 1, prompt: "road rage and aggressive driving: what it is, how to avoid it, what to do if confronted by an aggressive driver. For STATE_NAME." },
      { name: "Hill parking", count: 2, prompt: "parking on a hill: which way to turn wheels when parking uphill with curb, uphill without curb, downhill with curb, downhill without curb. For STATE_NAME." },
      { name: "Expressway entering", count: 2, prompt: "entering and exiting expressways/freeways: use acceleration lane, match traffic speed, signal and merge, use deceleration lane to exit. For STATE_NAME." },
    ]
  },
  {
    topicName: "Traffic Signs",
    subjects: [
      { name: "Lane markings", count: 2, prompt: "lane markings and pavement markings: solid yellow line, broken yellow line, double yellow line, white lines, shared turn lane markings, crosswalk markings. For STATE_NAME." },
    ]
  },
  {
    topicName: "Licensing & Permits",
    subjects: [
      { name: "Insurance requirements", count: 2, prompt: "auto insurance requirements: minimum liability coverage, proof of insurance requirement, penalties for driving without insurance. Use STATE_NAME specific minimum coverage amounts if known." },
      { name: "Financial responsibility", count: 1, prompt: "financial responsibility law: requirement to show ability to pay for damages in an accident, methods of proving financial responsibility. For STATE_NAME." },
      { name: "Hit and run", count: 2, prompt: "hit and run laws: requirement to stop after an accident, exchange information, report to police, penalties for leaving the scene of an accident. For STATE_NAME." },
      { name: "Registration", count: 1, prompt: "vehicle registration requirements: keeping registration current, displaying plates, penalties for expired registration. For STATE_NAME." },
      { name: "Child seats", count: 2, prompt: "child passenger safety: car seat and booster seat requirements by age/weight/height, rear-facing until age 2, forward-facing, booster seat ages, when children can use regular seat belt. For STATE_NAME." },
    ]
  },
  {
    topicName: "Alcohol & Substances",
    subjects: [
      { name: "Airbags", count: 1, prompt: "airbag safety: how airbags work with seatbelts, danger of airbags to children in front seat, proper seating distance from steering wheel. For STATE_NAME." },
    ]
  },
  {
    topicName: "Speed Limits",
    subjects: [
      { name: "Animals on road", count: 1, prompt: "encountering animals on the road: deer crossing areas, what to do if an animal is on the road, do not swerve into oncoming traffic. For STATE_NAME." },
      { name: "Bridges and tunnels", count: 1, prompt: "driving on bridges and through tunnels: reduce speed, turn on headlights in tunnels, bridge may ice before road, no stopping on bridges. For STATE_NAME." },
    ]
  },
];

async function main() {
  const states = await prisma.state.findMany({ select: { id: true, code: true, name: true }, orderBy: { code: "asc" } });
  const topics = await prisma.topic.findMany();
  const topicMap = {};
  topics.forEach(t => topicMap[t.name] = t.id);

  // Use top 10 states for generation, will cover others later
  const targetStates = states.filter(s => ["FL","CA","TX","NY","PA","IL","OH","GA","NC","MI"].includes(s.code));

  let totalCreated = 0;

  for (const topicGroup of TOPIC_QUESTIONS) {
    const topicId = topicMap[topicGroup.topicName];
    if (!topicId) { console.log("Topic not found: " + topicGroup.topicName); continue; }

    for (const subject of topicGroup.subjects) {
      console.log("\nGenerating: " + subject.name + " (" + subject.count + " per state)...");

      for (const state of targetStates) {
        const statePrompt = subject.prompt.replace(/STATE_NAME/g, state.name);
        
        const prompt = "Generate exactly " + subject.count + " DMV practice test multiple-choice questions about " + statePrompt + "\n\nReturn ONLY a JSON array of objects, each with: question, correct, wrong1, wrong2, wrong3, explanation.\nNo markdown, no backticks. Example:\n[{\"question\":\"What is...\",\"correct\":\"Answer A\",\"wrong1\":\"Answer B\",\"wrong2\":\"Answer C\",\"wrong3\":\"Answer D\",\"explanation\":\"Because...\"}]";

        const text = await callClaude(prompt);
        let parsed;
        try {
          const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(cleaned);
        } catch (e) {
          console.log("  Parse error for " + state.code + " " + subject.name);
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
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
      }
      console.log("  Created so far: " + totalCreated);
    }
  }

  console.log("\n=== DONE === Total new questions: " + totalCreated);
  const total = await prisma.question.count();
  console.log("Total questions in DB: " + total);
}

main().then(() => prisma.$disconnect());
