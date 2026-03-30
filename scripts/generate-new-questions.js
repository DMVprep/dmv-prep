const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = match ? match[1] : '';

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : '';
}

// Sign-based "What does this sign mean?" questions
const SIGN_QUESTIONS = [
  { image: "/signs/stop.png", name: "Stop Sign" },
  { image: "/signs/yield.png", name: "Yield Sign" },
  { image: "/signs/do-not-enter.png", name: "Do Not Enter Sign" },
  { image: "/signs/wrong-way.png", name: "Wrong Way Sign" },
  { image: "/signs/one-way.png", name: "One Way Sign" },
  { image: "/signs/no-u-turn.png", name: "No U-Turn Sign" },
  { image: "/signs/no-left-turn.png", name: "No Left Turn Sign" },
  { image: "/signs/no-right-turn.png", name: "No Right Turn Sign" },
  { image: "/signs/no-passing.png", name: "No Passing Sign" },
  { image: "/signs/no-parking.png", name: "No Parking Sign" },
  { image: "/signs/speed-limit.png", name: "Speed Limit Sign" },
  { image: "/signs/school-zone.png", name: "School Zone Sign" },
  { image: "/signs/school-bus-stop.png", name: "School Bus Stop Sign" },
  { image: "/signs/pedestrian-crossing.png", name: "Pedestrian Crossing Sign" },
  { image: "/signs/railroadcrossing.png", name: "Railroad Crossing Sign" },
  { image: "/signs/merging-traffic.png", name: "Merging Traffic Sign" },
  { image: "/signs/slippery-surface.png", name: "Slippery When Wet Sign" },
  { image: "/signs/work-zone.png", name: "Work Zone Sign" },
  { image: "/signs/keep-right.png", name: "Keep Right Sign" },
  { image: "/signs/center-turn-lane.png", name: "Center Turn Lane Sign" },
  { image: "/signs/right-curve.png", name: "Right Curve Sign" },
  { image: "/signs/winding-road.png", name: "Winding Road Sign" },
  { image: "/signs/hill-downgrade.png", name: "Steep Hill Sign" },
  { image: "/signs/animal-crossing.png", name: "Animal Crossing Sign" },
  { image: "/signs/divided-hwy-ahead.png", name: "Divided Highway Ahead Sign" },
  { image: "/signs/two-way-traffic.png", name: "Two-Way Traffic Sign" },
  { image: "/signs/low-clearance.png", name: "Low Clearance Sign" },
  { image: "/signs/roundabout-ahead.png", name: "Roundabout Ahead Sign" },
  { image: "/signs/stop-sign-ahead.png", name: "Stop Sign Ahead Sign" },
  { image: "/signs/traffic-signal-ahead.png", name: "Traffic Signal Ahead Sign" },
  { image: "/signs/blueguidesign.png", name: "Blue Service Sign" },
  { image: "/signs/brownguidesign.png", name: "Brown Recreation Sign" },
  { image: "/signs/greenguidesign.png", name: "Green Guide Sign" },
  { image: "/signs/lane-reduction.png", name: "Lane Reduction Sign" },
  { image: "/signs/no-turn-on-red.png", name: "No Turn on Red Sign" },
  { image: "/signs/soft-shoulder.png", name: "Soft Shoulder Sign" },
];

async function main() {
  // Get all states
  const states = await prisma.state.findMany({ select: { id: true, code: true } });
  const signsTopic = await prisma.topic.findFirst({ where: { name: "Traffic Signs" } });
  
  // Get topics for "all of the above" questions
  const allTopics = await prisma.topic.findMany();

  if (!signsTopic) { console.error('No Traffic Signs topic found'); return; }

  console.log('Generating sign identification questions...\n');

  // TYPE 1: "What does this sign mean?" - one per sign per state (top 10 states)
  const topStates = states.filter(s => ['FL','CA','TX','NY','PA','IL','OH','GA','NC','MI'].includes(s.code));
  
  let signQCount = 0;
  for (const sign of SIGN_QUESTIONS) {
    const prompt = `You are creating a DMV practice test question. The test-taker sees an image of a "${sign.name}". Generate a JSON object with:
- "question": a short question like "What does this sign mean?" or "What action should you take when you see this sign?"
- "correct": the correct answer (brief, clear)
- "wrong1", "wrong2", "wrong3": three plausible but wrong answers, similar in length to the correct answer

Return ONLY valid JSON, no markdown, no backticks. Example:
{"question":"What does this sign mean?","correct":"Come to a complete stop","wrong1":"Slow down and yield","wrong2":"Proceed with caution","wrong3":"Stop only if other vehicles are present"}`;

    const text = await callClaude(prompt);
    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      console.error('  Parse error for ' + sign.name + ': ' + text.substring(0, 60));
      continue;
    }

    for (const state of topStates) {
      await prisma.question.create({
        data: {
          text: parsed.question,
          explanation: 'This is a ' + sign.name + '. ' + parsed.correct + '.',
          imageUrl: sign.image,
          stateId: state.id,
          topicId: signsTopic.id,
          choices: {
            create: [
              { text: parsed.correct, isCorrect: true },
              { text: parsed.wrong1, isCorrect: false },
              { text: parsed.wrong2, isCorrect: false },
              { text: parsed.wrong3, isCorrect: false },
            ],
          },
        },
      });
      signQCount++;
    }
    if (signQCount % 50 === 0) console.log('  Created ' + signQCount + ' sign questions...');
  }
  console.log('Created ' + signQCount + ' sign identification questions\n');

  // TYPE 2: "All of the above" questions - across all topics
  console.log('Generating "All of the above" questions...\n');

  const aotaTopics = [
    { topic: "Traffic Signs", prompts: [
      "What is true about warning signs?",
      "What should you do when you see a stop sign?",
      "What do regulatory signs do?",
    ]},
    { topic: "Right Of Way", prompts: [
      "When approaching a four-way stop, you should:",
      "At an uncontrolled intersection, you must:",
      "When must you yield to pedestrians?",
    ]},
    { topic: "Speed Limits", prompts: [
      "When should you reduce your speed below the posted limit?",
      "What are the rules for driving in a school zone?",
      "What factors affect your stopping distance?",
    ]},
    { topic: "Safe Driving", prompts: [
      "What should you do before changing lanes?",
      "When driving at night, you should:",
      "What should you do if your vehicle starts to skid?",
    ]},
    { topic: "Alcohol & Substances", prompts: [
      "What are the consequences of refusing a breathalyzer test?",
      "What are the effects of alcohol on driving ability?",
      "What happens if you are convicted of DUI?",
    ]},
    { topic: "Licensing & Permits", prompts: [
      "What documents do you need to bring to the DMV?",
      "What restrictions apply to a learner's permit?",
    ]},
  ];

  let aotaCount = 0;
  for (const topicGroup of aotaTopics) {
    const topic = allTopics.find(t => t.name === topicGroup.topic);
    if (!topic) continue;

    for (const questionText of topicGroup.prompts) {
      const prompt = `You are creating a DMV practice test "All of the above" question. The question is: "${questionText}"

Generate a JSON object with:
- "stmt1", "stmt2", "stmt3": three correct statements that ALL answer the question truthfully
- "explanation": a brief explanation of why all three are correct

Each statement should be a standalone correct answer. Return ONLY valid JSON, no markdown, no backticks.
Example: {"stmt1":"Check your mirrors","stmt2":"Signal your intention","stmt3":"Check your blind spot","explanation":"Before changing lanes, you must check mirrors, signal, and check your blind spot to ensure safety."}`;

      const text = await callClaude(prompt);
      let parsed;
      try {
        parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        console.error('  Parse error for AOTA: ' + questionText.substring(0, 40));
        continue;
      }

      for (const state of topStates) {
        await prisma.question.create({
          data: {
            text: questionText,
            explanation: parsed.explanation,
            stateId: state.id,
            topicId: topic.id,
            choices: {
              create: [
                { text: parsed.stmt1, isCorrect: false },
                { text: parsed.stmt2, isCorrect: false },
                { text: parsed.stmt3, isCorrect: false },
                { text: 'All of the above', isCorrect: true },
              ],
            },
          },
        });
        aotaCount++;
      }
    }
    console.log('  ' + topicGroup.topic + ': done');
  }
  console.log('\nCreated ' + aotaCount + ' "All of the above" questions');
  console.log('\nTotal new questions: ' + (signQCount + aotaCount));
}

main().then(() => prisma.$disconnect());
