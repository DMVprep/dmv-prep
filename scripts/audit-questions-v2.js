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
    const stateCode = q.state?.code || '??';

    // === CRITICAL: Multiple correct answers ===
    if (correctChoices.length > 1) {
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'MULTIPLE_CORRECT',
        severity: 'CRITICAL',
        text: q.text.substring(0, 140),
        detail: `${correctChoices.length} correct: ${correctChoices.map(c => c.text).join(' | ')}`,
      });
    }

    // === CRITICAL: No correct answer ===
    if (correctChoices.length === 0) {
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'NO_CORRECT',
        severity: 'CRITICAL',
        text: q.text.substring(0, 140),
        detail: `Choices: ${q.choices.map(c => c.text).join(' | ')}`,
      });
    }

    // === CRITICAL: Fewer than 4 choices ===
    if (q.choices.length < 4) {
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'FEW_CHOICES',
        severity: 'CRITICAL',
        text: q.text.substring(0, 140),
        detail: `Only ${q.choices.length} choices`,
      });
    }

    // === HIGH: Duplicate choice text ===
    const choiceTexts = q.choices.map(c => c.text.toLowerCase().trim());
    const uniqueTexts = new Set(choiceTexts);
    if (uniqueTexts.size < choiceTexts.length) {
      const dupes = choiceTexts.filter((t, i) => choiceTexts.indexOf(t) !== i);
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'DUPLICATE_CHOICES',
        severity: 'HIGH',
        text: q.text.substring(0, 140),
        detail: `Duplicate: "${dupes[0]}"`,
      });
    }

    // === HIGH: Nonsensical numbers in choices ===
    // Look for choices with suspiciously large/wrong numbers
    for (const c of q.choices) {
      const textLower = q.text.toLowerCase();
      const choiceText = c.text.toLowerCase();
      
      // Fire hydrant parking should be 15 feet, flag anything over 100
      if (textLower.includes('fire hydrant') && choiceText.match(/\d+/) && parseInt(choiceText.match(/\d+/)[0]) > 100) {
        issues.push({
          id: q.id,
          state: stateCode,
          type: 'SUSPICIOUS_NUMBER',
          severity: 'HIGH',
          text: q.text.substring(0, 140),
          detail: `Choice "${c.text}" seems wrong for fire hydrant (should be 15-20 feet)`,
        });
        break;
      }
      
      // Stop sign parking should be 30 feet
      if (textLower.includes('stop sign') && textLower.includes('park') && choiceText.match(/\d+/) && parseInt(choiceText.match(/\d+/)[0]) > 200) {
        issues.push({
          id: q.id,
          state: stateCode,
          type: 'SUSPICIOUS_NUMBER',
          severity: 'HIGH',
          text: q.text.substring(0, 140),
          detail: `Choice "${c.text}" seems wrong for stop sign parking`,
        });
        break;
      }
    }

    // === HIGH: Correct answer contains "all of the above" but other choices are contradictory ===
    if (correctChoices.length === 1) {
      const correctText = correctChoices[0].text.toLowerCase();
      if (correctText.includes('all of the above') || correctText.includes('all the above')) {
        // Check if other choices contradict each other
        const otherChoices = q.choices.filter(c => !c.isCorrect).map(c => c.text.toLowerCase());
        // Flag if fewer than 3 other choices (all of above needs at least 3 options)
        if (otherChoices.length < 2) {
          issues.push({
            id: q.id,
            state: stateCode,
            type: 'BAD_ALL_ABOVE',
            severity: 'HIGH',
            text: q.text.substring(0, 140),
            detail: `"All of the above" is correct but only ${otherChoices.length} other choices`,
          });
        }
      }
    }

    // === MEDIUM: Very short explanation ===
    if (q.explanation.trim().length < 15) {
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'SHORT_EXPLANATION',
        severity: 'MEDIUM',
        text: q.text.substring(0, 140),
        detail: `Explanation: "${q.explanation.trim()}"`,
      });
    }

    // === MEDIUM: Question text is very short (likely incomplete) ===
    if (q.text.trim().length < 20) {
      issues.push({
        id: q.id,
        state: stateCode,
        type: 'SHORT_QUESTION',
        severity: 'MEDIUM',
        text: q.text,
        detail: `Question only ${q.text.trim().length} chars`,
      });
    }

    // === MEDIUM: Explanation mentions a number that contradicts the correct answer ===
    if (correctChoices.length === 1) {
      const correctText = correctChoices[0].text;
      const correctNums = correctText.match(/\b\d+\b/g)?.map(Number) || [];
      
      if (correctNums.length > 0) {
        const explLower = q.explanation.toLowerCase();
        const textLower = q.text.toLowerCase();
        
        // For speed questions: check if explanation states a different speed as the answer
        if ((textLower.includes('speed') || textLower.includes('mph')) && correctNums.length === 1) {
          const correctNum = correctNums[0];
          // Look for "is X mph" or "the limit is X" patterns in explanation
          const explicitAnswer = q.explanation.match(/(?:is|limit is|speed is|minimum is|maximum is)\s+(\d+)\s*(?:mph|MPH|miles)/i);
          if (explicitAnswer) {
            const explainedNum = parseInt(explicitAnswer[1]);
            if (explainedNum !== correctNum && Math.abs(explainedNum - correctNum) > 2) {
              issues.push({
                id: q.id,
                state: stateCode,
                type: 'SPEED_CONTRADICTION',
                severity: 'CRITICAL',
                text: q.text.substring(0, 140),
                detail: `Answer: "${correctText}" but explanation says ${explicitAnswer[0]}`,
                explanation: q.explanation.substring(0, 200),
              });
            }
          }
        }

        // For distance/feet questions
        if ((textLower.includes('feet') || textLower.includes('far') || textLower.includes('distance') || textLower.includes('park')) && correctNums.length === 1) {
          const correctNum = correctNums[0];
          const explicitDist = q.explanation.match(/(?:at least|must (?:be |stop |park )?(?:at least )?)(\d+)\s*(?:feet|ft)/i);
          if (explicitDist) {
            const explainedNum = parseInt(explicitDist[1]);
            if (explainedNum !== correctNum && Math.abs(explainedNum - correctNum) > 5) {
              issues.push({
                id: q.id,
                state: stateCode,
                type: 'DISTANCE_CONTRADICTION',
                severity: 'HIGH',
                text: q.text.substring(0, 140),
                detail: `Answer: "${correctText}" but explanation says ${explicitDist[0]}`,
                explanation: q.explanation.substring(0, 200),
              });
            }
          }
        }
      }
    }

    // === MEDIUM: BAC value check ===
    if (q.text.toLowerCase().includes('bac') || q.text.toLowerCase().includes('blood alcohol')) {
      if (correctChoices.length === 1) {
        const correctText = correctChoices[0].text;
        const bacMatch = correctText.match(/0\.\d+/);
        if (bacMatch) {
          const bac = parseFloat(bacMatch[0]);
          // Standard BAC is 0.08 for adults, 0.02 or 0.00 for under 21
          if (bac !== 0.08 && bac !== 0.02 && bac !== 0.00 && bac !== 0.04 && bac !== 0.01) {
            issues.push({
              id: q.id,
              state: stateCode,
              type: 'UNUSUAL_BAC',
              severity: 'MEDIUM',
              text: q.text.substring(0, 140),
              detail: `BAC value ${bac} is unusual (expected 0.08, 0.04, 0.02, or 0.00)`,
            });
          }
        }
      }
    }
  }

  // === Check for duplicate questions within same state ===
  const byState = {};
  for (const q of questions) {
    const key = q.state?.code || '??';
    if (!byState[key]) byState[key] = [];
    byState[key].push(q);
  }

  for (const [stateCode, stateQs] of Object.entries(byState)) {
    const seen = {};
    for (const q of stateQs) {
      // Normalize text for comparison
      const normalized = q.text.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 80);
      if (seen[normalized]) {
        issues.push({
          id: q.id,
          state: stateCode,
          type: 'DUPLICATE_QUESTION',
          severity: 'MEDIUM',
          text: q.text.substring(0, 140),
          detail: `Duplicate of question ${seen[normalized]}`,
        });
      } else {
        seen[normalized] = q.id;
      }
    }
  }

  // === Print results by severity ===
  const bySeverity = { CRITICAL: [], HIGH: [], MEDIUM: [] };
  for (const issue of issues) {
    bySeverity[issue.severity].push(issue);
  }

  console.log('=== QUESTION QUALITY AUDIT v2 ===\n');

  for (const severity of ['CRITICAL', 'HIGH', 'MEDIUM']) {
    const sevIssues = bySeverity[severity];
    if (sevIssues.length === 0) continue;

    // Group by type
    const byType = {};
    for (const issue of sevIssues) {
      if (!byType[issue.type]) byType[issue.type] = [];
      byType[issue.type].push(issue);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${severity} (${sevIssues.length} issues)`);
    console.log(`${'='.repeat(60)}\n`);

    for (const [type, typeIssues] of Object.entries(byType).sort()) {
      console.log(`--- ${type} (${typeIssues.length}) ---\n`);
      typeIssues.slice(0, 20).forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.state}] ${issue.text}`);
        console.log(`   ${issue.detail}`);
        if (issue.explanation) console.log(`   Expl: ${issue.explanation}`);
        console.log('');
      });
      if (typeIssues.length > 20) {
        console.log(`   ... and ${typeIssues.length - 20} more\n`);
      }
    }
  }

  // === Summary ===
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total questions: ${questions.length}`);
  console.log(`Total issues: ${issues.length}`);
  console.log(`  CRITICAL: ${bySeverity.CRITICAL.length}`);
  console.log(`  HIGH: ${bySeverity.HIGH.length}`);
  console.log(`  MEDIUM: ${bySeverity.MEDIUM.length}`);
  
  // Type breakdown
  const allByType = {};
  for (const issue of issues) {
    if (!allByType[issue.type]) allByType[issue.type] = 0;
    allByType[issue.type]++;
  }
  console.log('\nBy type:');
  for (const [type, count] of Object.entries(allByType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
