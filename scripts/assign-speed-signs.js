const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Map speed values to sign image paths
  const speedSignMap = {
    15: '/signs/speed-limit-15.png',
    20: '/signs/speed-limit-20.png',
    25: '/signs/speed-limit-25.png',
    50: '/signs/speed-limit.png',
    65: '/signs/speed-limit-65.png',
    70: '/signs/speed-limit-70.png',
  };

  // Get all lessons that need speed limit signs
  const speedLessons = await prisma.microLesson.findMany({
    where: {
      imageUrl: null,
      OR: [
        { title: { contains: 'MPH' } },
        { title: { contains: 'mph' } },
        { title: { contains: 'Speed Limit' } },
        { title: { contains: 'Freeway Speed' } },
      ],
    },
  });

  let assigned = 0;
  let noSign = [];

  for (const lesson of speedLessons) {
    // Extract the speed number from the title
    const match = lesson.title.match(/(\d+)\s*(?:mph|MPH)/i);
    if (!match) {
      noSign.push(lesson);
      continue;
    }

    const speed = parseInt(match[1]);
    const signPath = speedSignMap[speed];

    if (signPath) {
      await prisma.microLesson.update({
        where: { id: lesson.id },
        data: { imageUrl: signPath },
      });
      console.log('Assigned: [' + (lesson.stateCode || 'UNIV') + '] ' + lesson.title + ' -> speed-limit-' + speed + '.png');
      assigned++;
    } else {
      noSign.push(lesson);
    }
  }

  console.log('\nTotal speed signs assigned: ' + assigned);

  if (noSign.length > 0) {
    console.log('\nStill need signs for:');
    noSign.forEach(l => {
      const match = l.title.match(/(\d+)\s*(?:mph|MPH)/i);
      const speed = match ? match[1] : '?';
      console.log('  [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' (needs ' + speed + ' mph sign)');
    });
  }

  // Also assign school-speed-limit sign to school zone lessons that already have it in their title
  // but got their image removed - use the specific speed limit sign instead
  const schoolZoneLessons = await prisma.microLesson.findMany({
    where: {
      title: { contains: 'School Zone' },
      imageUrl: '/signs/school-zone.png',
    },
  });
  
  let schoolFixed = 0;
  for (const lesson of schoolZoneLessons) {
    const match = lesson.title.match(/(\d+)\s*(?:mph|MPH)/i);
    if (match) {
      const speed = parseInt(match[1]);
      const signPath = speedSignMap[speed];
      if (signPath) {
        await prisma.microLesson.update({
          where: { id: lesson.id },
          data: { imageUrl: signPath },
        });
        console.log('School zone fix: [' + (lesson.stateCode || 'UNIV') + '] ' + lesson.title + ' -> speed-limit-' + speed + '.png');
        schoolFixed++;
      }
    }
  }

  // Also fix the school-speed-limit.png assignments - these should use the specific speed sign
  const schoolSpeedLessons = await prisma.microLesson.findMany({
    where: {
      imageUrl: '/signs/school-speed-limit.png',
    },
  });

  for (const lesson of schoolSpeedLessons) {
    const match = lesson.title.match(/(\d+)\s*(?:mph|MPH)/i);
    if (match) {
      const speed = parseInt(match[1]);
      const signPath = speedSignMap[speed];
      if (signPath) {
        await prisma.microLesson.update({
          where: { id: lesson.id },
          data: { imageUrl: signPath },
        });
        console.log('School speed fix: [' + (lesson.stateCode || 'UNIV') + '] ' + lesson.title + ' -> speed-limit-' + speed + '.png');
        schoolFixed++;
      }
    }
  }

  console.log('\nSchool zone sign fixes: ' + schoolFixed);

  // Summary
  const totalNoImage = await prisma.microLesson.count({ where: { imageUrl: null } });
  const totalAll = await prisma.microLesson.count();
  console.log('\n=== FINAL COUNT ===');
  console.log('Total lessons: ' + totalAll);
  console.log('With images: ' + (totalAll - totalNoImage));
  console.log('Without images: ' + totalNoImage);
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
