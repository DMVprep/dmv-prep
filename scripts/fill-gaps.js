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

const GAPS = [
  { topic: "Safe Driving", name: "cell phone", count: 2, states: ["AZ","CT","ME","NM","SD","UT"], prompt: "cell phone and texting laws while driving" },
  { topic: "Safe Driving", name: "reaction time", count: 2, states: ["MS"], prompt: "reaction time while driving and how speed affects it" },
  { topic: "Safe Driving", name: "braking distance", count: 2, states: ["AR","CO","CT","DE","KY","ME","NV","OK","TN"], prompt: "braking distance at different speeds and how it increases with speed" },
  { topic: "Safe Driving", name: "lane changing", count: 2, states: ["AR","AZ","CO","DE","HI","ID","IN","KS","LA","MD","MN","MO","MS","MT","ND","NE","NH","NJ","NM","NV","OR","RI","SC","SD","TN","UT","VA","VT","WA","WI","WV","WY"], prompt: "safe lane changing: check mirrors, signal, check blind spot, merge smoothly" },
  { topic: "Safe Driving", name: "defensive driving", count: 2, states: ["AL","AR","IN","UT","WI","WY"], prompt: "defensive driving: anticipate hazards, maintain distance, scan ahead" },
  { topic: "Safe Driving", name: "tailgating", count: 1, states: ["CT","HI","IA","ID","NE","NJ","NM","SC","SD","WV"], prompt: "tailgating dangers and what to do when being tailgated" },
  { topic: "Safe Driving", name: "road rage", count: 1, states: ["AK","KS","KY","LA","MD","MO","MT","ND","NV","RI","VT","WA","WI","WY"], prompt: "road rage and aggressive driving: avoid and respond safely" },
  { topic: "Safe Driving", name: "hill parking", count: 2, states: ["AZ","CO","RI"], prompt: "parking on hills: wheel direction uphill/downhill with and without curb" },
  { topic: "Safe Driving", name: "expressway", count: 2, states: ["HI","SD","UT","VA","WI","WV","WY"], prompt: "entering and exiting highways: acceleration lane, match speed, deceleration lane" },
  { topic: "Traffic Signs", name: "lane markings", count: 2, states: ["AL","AR","AZ","CO","CT","DE","HI","IA","ID","IN","KS","KY","LA","MA","MD","ME","MO","MS","ND","NE","NJ","NV","OK","OR","RI","SC","SD","TN","UT","VA","VT","WA","WI","WV"], prompt: "pavement markings: solid yellow lines, broken yellow, double yellow, white lines, shared turn lane" },
  { topic: "Licensing & Permits", name: "financial responsibility", count: 1, states: ["TN"], prompt: "financial responsibility law and proving ability to pay for damages" },
  { topic: "Licensing & Permits", name: "hit and run", count: 2, states: ["AK","AL","AR","AZ","CO","CT","DE","HI","IA","ID","IN","KS","KY","LA","MA","MD","ME","MN","MO","MS","MT","ND","NE","NH","NJ","NM","NV","OK","OR","RI","SC","SD","TN","UT","VA","VT","WV","WY"], prompt: "hit and run: must stop after accident, exchange info, report to police, penalties" },
  { topic: "Licensing & Permits", name: "registration", count: 1, states: ["MN","MS","ND","NV","RI","SC","TN","UT","VA","VT","WA","WI","WV","WY"], prompt: "vehicle registration: keep current, display plates, penalties for expired" },
  { topic: "Licensing & Permits", name: "child seats", count: 2, states: ["AL","CT","DE","KS","KY","NE"], prompt: "child safety seats by age and weight: rear-facing, forward-facing, booster, seat belt" },
  { topic: "Speed Limits", name: "animals on road", count: 1, states: ["AL","AR","AZ","CO","CT","DE","HI","IA","ID","IN","KS","KY","LA","MA","MD","ME","MN","MO","MS","MT","ND","NE","NH","NJ","NV","OK","OR","RI","SC","SD","TN","UT","VT","WA","WI","WV","WY"], prompt: "encountering animals on road: deer crossings, do not swerve into traffic, reduce speed" },
  { topic: "Speed Limits", name: "bridges", count: 1, states: ["AK","AR","AZ","CO","CT","DE","HI","IA","ID","IN","KS","KY","MA","MD","ME","MN","MO","MS","MT","ND","NE","NH","NJ","NM","NV","OK","OR","RI","SC","SD","TN","UT","VA","VT","WA","WI","WV","WY"], prompt: "bridges and tunnels: headlights in tunnels, bridges freeze first, reduce speed, no stopping" },
];

async function main() {
  const allStates = await prisma.state.findMany({ select: { id: true, code: true, name: true } });
  const stateMap = {};
  allStates.forEach(s => { stateMap[s.code] = { id: s.id, name: s.name }; });

  const topics = await prisma.topic.findMany();
  const topicMap = {};
  topics.forEach(t => { topicMap[t.name] = t.id; });

  let totalCreated = 0;

  for (const gap of GAPS) {
    const topicId = topicMap[gap.topic];
    if (!topicId) continue;

    console.log("\n" + gap.name + " (" + gap.states.length + " states, " + gap.count + " each)...");

    for (const code of gap.states) {
      const state = stateMap[code];
      if (!state) continue;

      const prompt = 'Generate exactly ' + gap.count + ' DMV multiple-choice questions about ' + gap.prompt + ' for ' + state.name + '. Return ONLY a JSON array. No markdown. Each object: question, correct, wrong1, wrong2, wrong3, explanation.';

      const text = await callClaude(prompt);
      let parsed;
      try {
        parsed = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (e) {
        console.log("  X " + code);
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

  console.log("\n=== DONE === New questions: " + totalCreated);
  const total = await prisma.question.count();
  console.log("Total in DB: " + total);
}

main().then(() => prisma.$disconnect());
