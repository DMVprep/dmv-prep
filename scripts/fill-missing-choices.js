const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = match ? match[1] : '';

if (!API_KEY) { console.error('No API key found'); process.exit(1); }

async function generateChoices(question, existingChoices, numNeeded) {
  const correctChoice = existingChoices.find(c => c.isCorrect);
  const wrongChoices = existingChoices.filter(c => !c.isCorrect);

  const prompt = `You are helping create a DMV practice test. Given this question and its existing answer choices, generate exactly ${numNeeded} additional WRONG answer choices that are plausible but incorrect. They should be similar in format and length to the existing choices.

Question: ${question}

Correct answer: ${correctChoice ? correctChoice.text : 'Unknown'}
Existing wrong answers: ${wrongChoices.map(c => c.text).join(', ') || 'None'}

Return ONLY a JSON array of strings with the ${numNeeded} new wrong choices. No explanation, no markdown, no backticks. Example: ["Choice 1", "Choice 2"]`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data.content && data.content[0] ? data.content[0].text : '';
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('  Parse error:', text.substring(0, 80));
    return null;
  }
}

async function main() {
  const questions = await prisma.question.findMany({
    include: { choices: true },
  });

  const needsFilling = questions.filter(q => q.choices.length < 4 && q.choices.length > 0);
  console.log('Found ' + needsFilling.length + ' questions needing more choices\n');

  let fixed = 0;
  let errors = 0;

  for (let i = 0; i < needsFilling.length; i++) {
    const q = needsFilling[i];
    const numNeeded = 4 - q.choices.length;

    if (i % 20 === 0) console.log('Processing ' + (i + 1) + '/' + needsFilling.length + '...');

    const newChoices = await generateChoices(q.text, q.choices, numNeeded);

    if (newChoices && Array.isArray(newChoices) && newChoices.length === numNeeded) {
      for (const choiceText of newChoices) {
        await prisma.choice.create({
          data: {
            text: choiceText,
            isCorrect: false,
            questionId: q.id,
          },
        });
      }
      fixed++;
    } else {
      errors++;
    }

    if (i % 10 === 0 && i > 0) await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone! Fixed ' + fixed + ' questions, ' + errors + ' errors');
}

main().then(() => prisma.$disconnect());
