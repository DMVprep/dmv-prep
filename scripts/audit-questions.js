const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.question.findMany({
    include: {
      choices: true,
      topic: true,
      state: true,
    },
  });

  console.log(`Auditing ${questions.length} questions...\n`);

  const issues = [];

  for (const q of questions) {
    const correctChoices = q.choices.filter(c => c.isCorrect);
    const explanationLower = q.explanation.toLowerCase();
    const textLower = q.text.toLowerCase();

    // Issue 1: No correct answer
    if (correctChoices.length === 0) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'NO_CORRECT_ANSWER',
        text: q.text.substring(0, 120),
        detail: 'No choice is marked as correct',
      });
      continue;
    }

    // Issue 2: Multiple correct answers
    if (correctChoices.length > 1) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'MULTIPLE_CORRECT',
        text: q.text.substring(0, 120),
        detail: `${correctChoices.length} choices marked correct: ${correctChoices.map(c => c.text).join(' | ')}`,
      });
    }

    // Issue 3: Number mismatch between correct answer and explanation
    const correctText = correctChoices[0]?.text || '';
    
    // Extract numbers from correct answer
    const answerNumbers = correctText.match(/\d+/g)?.map(Number) || [];
    
    // Extract numbers from explanation
    const explainNumbers = q.explanation.match(/\d+/g)?.map(Number) || [];
    
    // For questions about speeds, distances, BAC, etc. — check if the key number in the answer appears in the explanation
    if (answerNumbers.length > 0 && explainNumbers.length > 0) {
      const keyNumber = answerNumbers[0]; // The main number in the answer
      
      // Check if the explanation mentions a DIFFERENT number in a contradictory way
      // Look for patterns like "the answer is X" or "X mph" or "X feet" in explanation
      const speedMatch = q.explanation.match(/(\d+)\s*(mph|MPH|miles per hour)/g);
      const feetMatch = q.explanation.match(/(\d+)\s*(feet|ft)/g);
      const secondMatch = q.explanation.match(/(\d+)\s*(second|seconds)/g);
      const percentMatch = q.explanation.match(/(\d+)\s*(%|percent)/g);
      const bacMatch = q.explanation.match(/0\.\d+/g);
      
      // For speed questions
      if (textLower.includes('speed') || textLower.includes('mph')) {
        if (speedMatch) {
          const explainSpeeds = speedMatch.map(m => parseInt(m));
          // If the explanation mentions a specific speed that's different from the answer
          if (explainSpeeds.length > 0 && !explainSpeeds.includes(keyNumber)) {
            // Check if the explanation explicitly states the correct value
            const isContradiction = explainSpeeds.some(s => {
              return (explanationLower.includes(`${s} mph`) || explanationLower.includes(`${s} miles`)) &&
                     (explanationLower.includes('is ' + s) || explanationLower.includes('minimum') || explanationLower.includes('maximum'));
            });
            if (isContradiction) {
              issues.push({
                id: q.id,
                state: q.state?.code || '??',
                type: 'ANSWER_CONTRADICTS_EXPLANATION',
                text: q.text.substring(0, 120),
                detail: `Answer says "${correctText}" but explanation mentions: ${speedMatch.join(', ')}`,
                explanation: q.explanation.substring(0, 200),
              });
            }
          }
        }
      }

      // For distance questions
      if (textLower.includes('feet') || textLower.includes('far') || textLower.includes('distance')) {
        if (feetMatch) {
          const explainFeet = feetMatch.map(m => parseInt(m));
          if (explainFeet.length > 0 && !explainFeet.includes(keyNumber)) {
            issues.push({
              id: q.id,
              state: q.state?.code || '??',
              type: 'DISTANCE_MISMATCH',
              text: q.text.substring(0, 120),
              detail: `Answer says "${correctText}" but explanation mentions: ${feetMatch.join(', ')}`,
              explanation: q.explanation.substring(0, 200),
            });
          }
        }
      }
    }

    // Issue 4: Explanation says "incorrect" or "wrong" about the marked correct answer
    if (explanationLower.includes('incorrect') || explanationLower.includes('wrong answer')) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'EXPLANATION_SAYS_INCORRECT',
        text: q.text.substring(0, 120),
        detail: `Explanation contains "incorrect" or "wrong answer" — may be mislabeled`,
        explanation: q.explanation.substring(0, 200),
      });
    }

    // Issue 5: Very short or empty explanation
    if (q.explanation.trim().length < 10) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'SHORT_EXPLANATION',
        text: q.text.substring(0, 120),
        detail: `Explanation is very short: "${q.explanation}"`,
      });
    }

    // Issue 6: Fewer than 4 choices
    if (q.choices.length < 4) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'FEW_CHOICES',
        text: q.text.substring(0, 120),
        detail: `Only ${q.choices.length} choices (should be 4)`,
      });
    }

    // Issue 7: Duplicate choice text
    const choiceTexts = q.choices.map(c => c.text.toLowerCase().trim());
    const uniqueTexts = new Set(choiceTexts);
    if (uniqueTexts.size < choiceTexts.length) {
      issues.push({
        id: q.id,
        state: q.state?.code || '??',
        type: 'DUPLICATE_CHOICES',
        text: q.text.substring(0, 120),
        detail: `Has duplicate answer choices`,
      });
    }
  }

  // Print results grouped by type
  const byType = {};
  for (const issue of issues) {
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
  }

  console.log('=== QUESTION QUALITY AUDIT RESULTS ===\n');
  
  let totalIssues = 0;
  for (const [type, typeIssues] of Object.entries(byType).sort()) {
    console.log(`\n--- ${type} (${typeIssues.length}) ---\n`);
    typeIssues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.state}] ${issue.text}`);
      console.log(`   ${issue.detail}`);
      if (issue.explanation) console.log(`   Explanation: ${issue.explanation}`);
      console.log('');
    });
    totalIssues += typeIssues.length;
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total questions: ${questions.length}`);
  console.log(`Total issues found: ${totalIssues}`);
  for (const [type, typeIssues] of Object.entries(byType).sort()) {
    console.log(`  ${type}: ${typeIssues.length}`);
  }
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
