const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const matchKey = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = matchKey ? matchKey[1] : '';

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
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : '';
}

async function getStateQuestionData(stateId) {
  const speedQs = await prisma.question.findMany({
    where: { stateId, text: { contains: 'speed limit', mode: 'insensitive' } },
    include: { choices: true }, take: 15,
  });
  const followQs = await prisma.question.findMany({
    where: { stateId, text: { contains: 'following distance', mode: 'insensitive' } },
    include: { choices: true }, take: 10,
  });
  const bacQs = await prisma.question.findMany({
    where: { stateId, OR: [
      { text: { contains: 'BAC', mode: 'insensitive' } },
      { text: { contains: 'blood alcohol', mode: 'insensitive' } },
      { text: { contains: 'DUI', mode: 'insensitive' } },
      { text: { contains: 'implied consent', mode: 'insensitive' } },
    ]}, include: { choices: true }, take: 10,
  });
  const phoneQs = await prisma.question.findMany({
    where: { stateId, OR: [
      { text: { contains: 'cell phone', mode: 'insensitive' } },
      { text: { contains: 'texting', mode: 'insensitive' } },
      { text: { contains: 'hand-held', mode: 'insensitive' } },
      { text: { contains: 'hands-free', mode: 'insensitive' } },
    ]}, include: { choices: true }, take: 10,
  });
  const fmt = (qs) => qs.map(q => {
    const c = q.choices.find(c => c.isCorrect);
    return 'Q: ' + q.text + ' -> ' + (c ? c.text : '?');
  }).join('\n');
  return { speed: fmt(speedQs), follow: fmt(followQs), bac: fmt(bacQs), phone: fmt(phoneQs) };
}

async function main() {
  const coveredStates = ['FL', 'CA', 'TX', 'NY', 'PA', 'IL'];
  const states = await prisma.state.findMany({
    where: { code: { notIn: coveredStates } },
    select: { code: true, id: true },
    orderBy: { code: 'asc' },
  });

  let output = '';
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    console.log('Processing ' + state.code + ' (' + (i+1) + '/' + states.length + ')...');
    const data = await getStateQuestionData(state.id);

    const prompt = 'Based on these DMV practice test questions and answers for ' + state.code + ', extract the state-specific rules and generate a JavaScript object.\n\nSPEED LIMIT data:\n' + data.speed + '\n\nFOLLOWING DISTANCE data:\n' + data.follow + '\n\nBAC/ALCOHOL data:\n' + data.bac + '\n\nPHONE LAW data:\n' + data.phone + '\n\nGenerate a JavaScript object in this exact format (use the ACTUAL values from the questions above, do not make up data):\n{\n  speedLimits: [\n    { rule: "School zone (when children present)", value: "XX mph" },\n    { rule: "Residential streets", value: "XX mph" },\n    // add 3-6 most important speed limits\n  ],\n  followingDistance: [\n    { rule: "Normal conditions", value: "X seconds" },\n    // add 2-3 rules\n  ],\n  alcoholLaws: [\n    { rule: "Legal BAC limit (adults 21+)", value: "0.0X%" },\n    { rule: "Zero tolerance (under 21)", value: "0.0X%" },\n    // add 3-5 rules\n  ],\n  phoneLaws: [\n    { rule: "Texting while driving", value: "Illegal" },\n    // add 2-4 rules\n  ],\n}\n\nReturn ONLY the JavaScript object. No backticks, no explanation, no variable name.';

    const text = await callClaude(prompt);
    const cleaned = text.replace(/```javascript/g, '').replace(/```js/g, '').replace(/```/g, '').trim();
    output += '  ' + state.code + ': ' + cleaned + ',\n';

    if (i % 5 === 0 && i > 0) await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync('scripts/handbook-data-output.txt', output);
  console.log('\nDone! Output saved to scripts/handbook-data-output.txt');
}

main().then(() => prisma.$disconnect());
