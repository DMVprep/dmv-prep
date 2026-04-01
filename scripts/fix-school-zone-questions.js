const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// States where "when children are present" is WRONG as the primary trigger
// These states use posted hours, flashing beacons, or time-based enforcement
const TIME_BASED_STATES = [
  'FL', 'TX', 'IL', 'GA', 'NY', 'PA', 'KY', 'CO',
  'AK', 'AL', 'AZ', 'CT', 'DE', 'HI', 'IA', 'ID',
  'IN', 'KS', 'LA', 'MA', 'MD', 'MI', 'MN', 'MO',
  'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
  'NV', 'OK', 'OR', 'RI', 'SC', 'SD', 'TN', 'UT',
  'VA', 'VT', 'WV', 'WY',
];

// States where "when children are present" IS correct (or partially correct)
const CHILDREN_PRESENT_STATES = [
  'CA', // California - primary trigger is children present
  'WA', // Washington - children present OR when flashing
  'AR', // Arkansas - children present OR beacon lit
  'OH', // Ohio - when children going to/from school
  'ME', // Maine - within 30 min OR children present
  'WI', // Wisconsin - posted hours OR children present
];

async function main() {
  let fixedQuestions = 0;
  let fixedChoices = 0;
  let fixedExplanations = 0;
  let skipped = 0;

  for (const stateCode of TIME_BASED_STATES) {
    // Find questions mentioning "children are present" for this state
    const questions = await prisma.question.findMany({
      where: {
        state: { code: stateCode },
        OR: [
          { text: { contains: 'children are present' } },
          { explanation: { contains: 'children are present' } },
        ],
      },
      include: { choices: true, state: true },
    });

    if (questions.length === 0) continue;

    console.log(`\n[${stateCode}] Found ${questions.length} questions to review`);

    for (const q of questions) {
      let changed = false;

      // Fix explanation text - replace "children are present" with accurate language
      if (q.explanation.includes('children are present')) {
        let newExpl = q.explanation;
        // Replace various patterns
        newExpl = newExpl.replace(/when children are present or when school zone signs are posted/gi, 'during posted school hours or when flashing beacons are active');
        newExpl = newExpl.replace(/when children are present or when school zone signs are flashing/gi, 'during posted school hours or when flashing beacons are active');
        newExpl = newExpl.replace(/when children are present or when school zone signals are flashing/gi, 'during posted school hours or when flashing beacons are active');
        newExpl = newExpl.replace(/when children are present or crossing/gi, 'during posted school hours or when signs indicate');
        newExpl = newExpl.replace(/when children are present or lights are flashing/gi, 'during posted school hours or when flashing beacons are active');
        newExpl = newExpl.replace(/when children are present or likely to be present/gi, 'during posted school hours or when signs indicate');
        newExpl = newExpl.replace(/during school hours when children are present/gi, 'during posted school hours or when signs indicate');
        newExpl = newExpl.replace(/during school hours and when children are present/gi, 'during posted school hours or when signs indicate');
        newExpl = newExpl.replace(/during times when children are present/gi, 'during posted school hours');
        newExpl = newExpl.replace(/school hours when children are present/gi, 'posted school hours or when signs indicate');
        newExpl = newExpl.replace(/school hours or when children are present/gi, 'posted school hours or when signs indicate');
        newExpl = newExpl.replace(/when children are present, such as when going to or from school/gi, 'during posted school hours or when signs indicate');
        newExpl = newExpl.replace(/when children are present/gi, 'during posted school hours or when signs indicate');
        
        if (newExpl !== q.explanation) {
          await prisma.question.update({
            where: { id: q.id },
            data: { explanation: newExpl },
          });
          fixedExplanations++;
          changed = true;
        }
      }

      // Fix question text if it mentions "children are present" in the scenario
      if (q.text.includes('children are present')) {
        // Most question texts use it as a scenario setup, which is OK
        // "You are driving through a school zone when children are present" is fine as a scenario
        // We only need to fix if the question is ASKING about the trigger
        // e.g., "When does the school zone speed limit apply?"
        // For scenario questions, the text is acceptable
      }

      // Fix choice text - this is the most critical
      for (const choice of q.choices) {
        if (choice.text.includes('children are present') && choice.isCorrect) {
          let newChoiceText = choice.text;
          
          // Common patterns in correct answers
          newChoiceText = newChoiceText.replace(/When children are present or lights are flashing/gi, 'During posted school hours or when flashing beacons are active');
          newChoiceText = newChoiceText.replace(/When children are present or lights flashing/gi, 'During posted school hours or when flashing beacons are active');
          newChoiceText = newChoiceText.replace(/When children are present$/gi, 'During posted school hours or when signs indicate');
          newChoiceText = newChoiceText.replace(/Reduce speed to (\d+) mph when children are present/gi, 'Reduce speed to $1 mph during posted school hours or when signs indicate');
          newChoiceText = newChoiceText.replace(/School zone with children present/gi, 'Active school zone during posted hours');
          newChoiceText = newChoiceText.replace(/When no children are present and lights are not flashing/gi, 'When school is not in session and signs do not indicate reduced speed');
          newChoiceText = newChoiceText.replace(/When no children are present/gi, 'When school is not in session and signs do not indicate reduced speed');
          newChoiceText = newChoiceText.replace(/When children are no longer present in the area/gi, 'When the posted enforcement hours end');
          newChoiceText = newChoiceText.replace(/Well below normal speeds due to children present/gi, 'Well below normal speeds due to active school zone');

          if (newChoiceText !== choice.text) {
            await prisma.choice.update({
              where: { id: choice.id },
              data: { text: newChoiceText },
            });
            console.log(`  Fixed choice: "${choice.text}" -> "${newChoiceText}"`);
            fixedChoices++;
            changed = true;
          }
        }
        
        // Also fix incorrect choices that reference "children are present"
        if (choice.text.includes('children are present') && !choice.isCorrect) {
          // These are wrong answer choices - leave them as-is since they're
          // meant to be wrong answers. The student should know NOT to pick these
          // in time-based states.
        }
      }

      if (changed) {
        fixedQuestions++;
      } else {
        skipped++;
      }
    }
  }

  // Also fix the FL-specific question about "When does the 20 MPH school zone speed limit apply?"
  // where the correct answer says "When children are present or lights flashing"
  const flSpecific = await prisma.question.findMany({
    where: {
      state: { code: 'FL' },
      text: { contains: 'school zone speed limit apply' },
    },
    include: { choices: true },
  });
  for (const q of flSpecific) {
    for (const c of q.choices) {
      if (c.isCorrect && c.text.includes('children are present')) {
        await prisma.choice.update({
          where: { id: c.id },
          data: { text: 'During posted school hours or when flashing beacons are active' },
        });
        console.log(`  FL SPECIFIC: Fixed "${c.text}" -> "During posted school hours or when flashing beacons are active"`);
        fixedChoices++;
      }
    }
  }

  console.log(`\n=== QUESTION FIX SUMMARY ===`);
  console.log(`Questions touched: ${fixedQuestions}`);
  console.log(`Choices fixed: ${fixedChoices}`);
  console.log(`Explanations fixed: ${fixedExplanations}`);
  console.log(`Skipped (no change needed): ${skipped}`);
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
