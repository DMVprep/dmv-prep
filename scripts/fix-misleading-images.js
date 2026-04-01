const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Patterns that indicate a TRUE sign identification question (KEEP image)
const SIGN_ID_PATTERNS = [
  'what does this sign',
  'what does a ',
  'this sign means',
  'this sign indicates',
  'what type of sign',
  'what shape is',
  'what shape does',
  'what color is',
  'what color does',
  'sign is what shape',
  'sign is what color',
  'what does the sign',
  'identify this sign',
  'which sign',
  'a sign with',
  'a sign reading',
  'a sign showing',
  'sign reading',
  'pennant-shaped sign',
  'diamond-shaped sign',
  'octagon-shaped',
  'triangle-shaped',
  'rectangular sign',
  'what does a red',
  'what does a yellow',
  'what does a green',
  'what does a blue',
  'what does a brown',
  'what does a white',
  'what does a orange',
  'what does an orange',
  'sign that says',
  'sign that reads',
  'sign with a',
  'what is indicated by',
  'what is the meaning of this',
  'what is the purpose of this sign',
  'when you see this sign',
  'when approaching this sign',
  'what should you do when you see this sign',
  'what should you do when approaching this sign',
  'round sign',
  'crossbuck sign',
  'chevron sign',
  'what does this road sign',
];

// Patterns that indicate a RULE/BEHAVIOR question (REMOVE image)
const RULE_PATTERNS = [
  'what should you do',
  'you should',
  'you must',
  'what is the maximum',
  'what is the minimum',
  'what is the speed limit',
  'what is the legal',
  'what is the fine',
  'what is the penalty',
  'how far',
  'how many feet',
  'how many seconds',
  'how long',
  'when approaching',
  'when entering',
  'when you see a',
  'if you see a',
  'you are approaching',
  'in a residential',
  'in a school zone',
  'in a work zone',
  'in a construction zone',
  'in a business district',
  'what happens if',
  'what happens when',
  'are you required',
  'is it legal',
  'can you',
  'when can you',
  'where should you',
  'where must you',
  'at a stop sign, you',
  'at a yield sign, you',
  'at a red light',
  'at a flashing',
  'within how many',
  'how much is the fine',
  'what are the consequences',
  'posted speed limit signs, what is',
];

async function main() {
  const questions = await prisma.question.findMany({
    where: { imageUrl: { not: null } },
    select: { id: true, text: true, imageUrl: true, topic: { select: { name: true } } },
  });

  console.log(`Total questions with images: ${questions.length}\n`);

  const toKeep = [];
  const toRemove = [];
  const uncertain = [];

  for (const q of questions) {
    const textLower = q.text.toLowerCase();

    // Check if it's a sign ID question (keep image)
    const isSignID = SIGN_ID_PATTERNS.some(p => textLower.includes(p));

    // Check if it's a rule/behavior question (remove image)
    const isRule = RULE_PATTERNS.some(p => textLower.includes(p));

    if (isSignID && !isRule) {
      toKeep.push(q);
    } else if (isRule && !isSignID) {
      toRemove.push(q);
    } else if (isSignID && isRule) {
      // Both match — err on keeping if it's clearly about the sign
      if (textLower.includes('what does this sign') || textLower.includes('what does a ') || textLower.includes('this sign') || textLower.includes('approaching this sign')) {
        toKeep.push(q);
      } else {
        uncertain.push(q);
      }
    } else {
      // Neither pattern matched — check if it's Traffic Signs topic
      if (q.topic?.name === 'Traffic Signs') {
        toKeep.push(q); // Probably a sign question with unusual wording
      } else {
        toRemove.push(q); // Non-sign topic with an image = likely wrong
      }
    }
  }

  console.log(`KEEP image: ${toKeep.length}`);
  console.log(`REMOVE image: ${toRemove.length}`);
  console.log(`UNCERTAIN: ${uncertain.length}`);

  // Show all removals
  console.log('\n\n=== WILL REMOVE IMAGE FROM THESE QUESTIONS ===\n');
  toRemove.forEach((q, i) => {
    console.log(`${i + 1}. [${q.topic?.name || 'Unknown'}] ${q.text.substring(0, 130)}`);
    console.log(`   Image: ${q.imageUrl}`);
    console.log('');
  });

  // Show uncertain
  if (uncertain.length > 0) {
    console.log('\n=== UNCERTAIN (will keep image for safety) ===\n');
    uncertain.forEach((q, i) => {
      console.log(`${i + 1}. [${q.topic?.name || 'Unknown'}] ${q.text.substring(0, 130)}`);
      console.log(`   Image: ${q.imageUrl}`);
      console.log('');
    });
  }

  // Show sample of keeps
  console.log('\n=== SAMPLE KEEPS (first 10) ===\n');
  toKeep.slice(0, 10).forEach((q, i) => {
    console.log(`${i + 1}. [${q.topic?.name || 'Unknown'}] ${q.text.substring(0, 130)}`);
    console.log(`   Image: ${q.imageUrl}`);
    console.log('');
  });

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total with images: ${questions.length}`);
  console.log(`Will keep: ${toKeep.length + uncertain.length}`);
  console.log(`Will remove: ${toRemove.length}`);
  console.log(`\nRun with --apply to remove images from ${toRemove.length} questions.`);

  if (process.argv.includes('--apply')) {
    console.log('\nApplying...');
    let count = 0;
    for (const q of toRemove) {
      await prisma.question.update({
        where: { id: q.id },
        data: { imageUrl: null },
      });
      count++;
    }
    console.log(`Done! Removed images from ${count} questions.`);
  }
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
