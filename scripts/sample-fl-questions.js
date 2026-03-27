
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

async function main() {
  const topics = await p.topic.findMany({ orderBy: { name: 'asc' } });
  for (const topic of topics) {
    const qs = await p.question.findMany({
      where: { state: { code: 'FL' }, topicId: topic.id },
      include: { choices: true },
      take: 8
    });
    console.log('\n' + '='.repeat(60));
    console.log(topic.name.toUpperCase());
    console.log('='.repeat(60));
    qs.forEach((q, i) => {
      const correct = q.choices.find(c => c.isCorrect);
      const wrong = q.choices.filter(c => !c.isCorrect);
      console.log('Q' + (i+1) + ': ' + q.text);
      console.log('  CORRECT: ' + (correct ? correct.text : 'NONE'));
      console.log('  WRONG: ' + wrong.map(c => c.text).join(' | '));
      console.log('');
    });
  }
}
main().catch(console.error).finally(() => p.$disconnect());
