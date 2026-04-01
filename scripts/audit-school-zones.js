const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find all school zone questions that mention 'children are present'
  const childrenPresent = await prisma.question.findMany({
    where: {
      OR: [
        { text: { contains: 'children are present' } },
        { explanation: { contains: 'children are present' } },
      ],
    },
    include: { state: true, choices: { where: { isCorrect: true } } },
  });
  console.log('Questions mentioning "children are present": ' + childrenPresent.length);
  const byState = {};
  childrenPresent.forEach(q => {
    const s = q.state ? q.state.code : '??';
    if (!byState[s]) byState[s] = [];
    byState[s].push(q);
  });
  for (const [state, qs] of Object.entries(byState).sort()) {
    console.log('  ' + state + ': ' + qs.length + ' questions');
    qs.slice(0, 2).forEach(q => {
      console.log('    Q: ' + q.text.substring(0, 120));
      console.log('    A: ' + (q.choices[0] ? q.choices[0].text : 'N/A'));
    });
  }

  // Check for "when flashing" or "when lights" mentions
  const flashingQs = await prisma.question.findMany({
    where: {
      OR: [
        { text: { contains: 'when flashing' } },
        { text: { contains: 'lights are flashing' } },
        { explanation: { contains: 'when flashing' } },
        { explanation: { contains: 'lights are flashing' } },
      ],
      topic: { slug: 'speed-limits' },
    },
    include: { state: true },
  });
  console.log('\nQuestions mentioning "flashing lights" (speed-limits topic): ' + flashingQs.length);

  // Check for "posted hours" or "posted times" mentions
  const postedTimesQs = await prisma.question.findMany({
    where: {
      OR: [
        { text: { contains: 'posted hours' } },
        { text: { contains: 'posted times' } },
        { explanation: { contains: 'posted hours' } },
        { explanation: { contains: 'posted times' } },
      ],
      topic: { slug: 'speed-limits' },
    },
    include: { state: true },
  });
  console.log('Questions mentioning "posted hours/times" (speed-limits topic): ' + postedTimesQs.length);

  // Also check lessons
  console.log('\n--- LESSONS ---\n');
  
  const allSchoolLessons = await prisma.microLesson.findMany({
    where: {
      OR: [
        { title: { contains: 'School Zone' } },
        { title: { contains: 'school zone' } },
        { simpleLine: { contains: 'school' } },
      ],
    },
    orderBy: { stateCode: 'asc' },
  });
  
  console.log('Total school-related lessons: ' + allSchoolLessons.length);
  
  const childrenLessons = allSchoolLessons.filter(l => 
    l.simpleLine.includes('children are present') || 
    l.explanation.includes('children are present')
  );
  console.log('Lessons mentioning "children are present": ' + childrenLessons.length);
  childrenLessons.forEach(l => {
    console.log('  [' + (l.stateCode || 'universal') + '] ' + l.title);
    console.log('    simpleLine: ' + l.simpleLine);
  });

  console.log('\n--- ALL SCHOOL ZONE LESSONS BY STATE ---\n');
  allSchoolLessons.forEach(l => {
    console.log('[' + (l.stateCode || 'UNIV') + '] ' + l.title);
    console.log('  Key: ' + l.simpleLine);
    console.log('  Expl: ' + l.explanation.substring(0, 150));
    console.log('');
  });
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
