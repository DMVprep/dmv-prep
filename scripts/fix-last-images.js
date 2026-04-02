const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let fixed = 0;

  // WA and KS pedestrian lessons - slightly different title format
  const pedMissed = await prisma.microLesson.findMany({
    where: {
      imageUrl: null,
      OR: [
        { title: { contains: 'Pedestrians: Right-of-Way' } },
        { title: { contains: 'Pedestrians at Crosswalks' } },
      ],
    },
  });
  for (const l of pedMissed) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/pedestrian-crossing.png' },
    });
    console.log('Fixed: [' + l.stateCode + '] ' + l.title + ' -> pedestrian-crossing.png');
    fixed++;
  }

  // AR intersections - yield sign
  const arIntersection = await prisma.microLesson.findFirst({
    where: { title: { contains: 'Arkansas Intersections' }, imageUrl: null },
  });
  if (arIntersection) {
    await prisma.microLesson.update({
      where: { id: arIntersection.id },
      data: { imageUrl: '/signs/all-way-stop.png' },
    });
    console.log('Fixed: [AR] Arkansas Intersections -> all-way-stop.png');
    fixed++;
  }

  console.log('\nFixed: ' + fixed + ' lessons');

  // Final count
  const totalNoImage = await prisma.microLesson.count({ where: { imageUrl: null } });
  const totalAll = await prisma.microLesson.count();
  console.log('\n=== FINAL COUNT ===');
  console.log('Total lessons: ' + totalAll);
  console.log('With images: ' + (totalAll - totalNoImage));
  console.log('Without images: ' + totalNoImage);
}

main().then(() => prisma.$disconnect());
