const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let assigned = 0;

  // === Pedestrian right-of-way lessons -> pedestrian-crossing sign ===
  const pedLessons = await prisma.microLesson.findMany({
    where: {
      imageUrl: null,
      OR: [
        { title: { contains: 'Pedestrian Right-of-Way' } },
        { title: { contains: 'Pedestrians: Crosswalk' } },
        { title: { contains: 'Pedestrians in Crosswalks' } },
      ],
    },
  });
  for (const l of pedLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/pedestrian-crossing.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> pedestrian-crossing.png');
    assigned++;
  }

  // === Intersection / 4-way stop lessons -> all-way-stop sign ===
  const intersectionLessons = await prisma.microLesson.findMany({
    where: {
      imageUrl: null,
      OR: [
        { title: { contains: 'Four-Way Stop' } },
        { title: { contains: '4-Way Stop' } },
        { title: { contains: 'Intersections: Yield to Right' } },
        { title: { contains: 'Intersections: Right-of-Way' } },
        { title: { contains: 'Intersections: Right Vehicle' } },
      ],
    },
  });
  for (const l of intersectionLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/all-way-stop.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> all-way-stop.png');
    assigned++;
  }

  // === School bus lessons -> school bus illustration (two lanes version) ===
  const schoolBusLessons = await prisma.microLesson.findMany({
    where: {
      imageUrl: null,
      title: { contains: 'School Bus' },
    },
  });
  for (const l of schoolBusLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/handbook-illustrations/school-bus-two-lanes.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> school-bus-two-lanes.png');
    assigned++;
  }

  // === Blind intersection (CA) -> could use yield sign ===
  const blindIntersection = await prisma.microLesson.findFirst({
    where: { title: { contains: 'Blind Intersection' }, imageUrl: null },
  });
  if (blindIntersection) {
    await prisma.microLesson.update({
      where: { id: blindIntersection.id },
      data: { imageUrl: '/signs/yield.png' },
    });
    console.log('Assigned: [CA] Blind Intersection -> yield.png');
    assigned++;
  }

  // === Alaska Wildlife Right-of-Way -> animal crossing sign ===
  const wildlifeLessons = await prisma.microLesson.findMany({
    where: { title: { contains: 'Wildlife' }, imageUrl: null },
  });
  for (const l of wildlifeLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/animal-crossing.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> animal-crossing.png');
    assigned++;
  }

  // === Louisiana Funeral Processions -> no good sign, skip ===

  // === Kentucky Intersections: Right-of-Way Rules -> all-way-stop ===
  const kyIntersection = await prisma.microLesson.findFirst({
    where: { title: { contains: 'Kentucky Intersections' }, imageUrl: null },
  });
  if (kyIntersection) {
    await prisma.microLesson.update({
      where: { id: kyIntersection.id },
      data: { imageUrl: '/signs/all-way-stop.png' },
    });
    console.log('Assigned: [KY] Kentucky Intersections -> all-way-stop.png');
    assigned++;
  }

  console.log('\nTotal newly assigned: ' + assigned);

  // === Summary ===
  const totalNoImage = await prisma.microLesson.count({ where: { imageUrl: null } });
  const totalAll = await prisma.microLesson.count();
  console.log('\n=== FINAL COUNT ===');
  console.log('Total lessons: ' + totalAll);
  console.log('With images: ' + (totalAll - totalNoImage));
  console.log('Without images: ' + totalNoImage);

  // List remaining lessons without images that COULD use one
  console.log('\n=== STILL NEED ILLUSTRATION (no suitable image exists) ===');
  const remaining = await prisma.microLesson.findMany({
    where: { imageUrl: null },
    select: { title: true, stateCode: true, topic: true },
    orderBy: { topic: 'asc' },
  });

  const followingDist = remaining.filter(l => l.title.includes('Following Distance'));
  const others = remaining.filter(l => !l.title.includes('Following Distance'));

  console.log('\nFollowing Distance lessons (need car-to-car illustration): ' + followingDist.length);
  console.log('Other lessons without images: ' + others.length);
  others.filter(l => !['alcohol-dui', 'licensing-permits', 'safe-driving'].includes(l.topic) || 
    l.title.includes('Funeral') || l.title.includes('Three Tiers') || l.title.includes('65 Hours') || 
    l.title.includes('50 Hours') || l.title.includes('30 Hours'))
    .forEach(l => console.log('  [' + (l.stateCode || 'UNIV') + '] ' + l.title));
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
