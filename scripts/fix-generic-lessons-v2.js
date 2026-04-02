const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // === STEP 1: Remove duplicate universal lessons ===
  const duplicateTitlesToRemove = [
    "The Legal BAC Limit for Adults Is 0.08%",
    "Implied Consent: You Must Submit to Testing",
    "Four-Way Stop: First to Arrive Goes First",
    "Stop Sign: You Must Stop Completely",
    "Always Check Blind Spots Before Changing Lanes",
    "Hydroplaning: What to Do",
    "Always Yield to Emergency Vehicles",
    "School Zones Have Reduced Speed Limits",
  ];

  let deleted = 0;
  for (const title of duplicateTitlesToRemove) {
    const lesson = await prisma.microLesson.findFirst({
      where: { title, stateCode: null },
    });
    if (lesson) {
      try {
        await prisma.microLesson.delete({ where: { id: lesson.id } });
        console.log('Removed duplicate: ' + title);
        deleted++;
      } catch (e) {
        console.log('Cannot delete (has relations): ' + title);
      }
    }
  }
  console.log('\nDeleted ' + deleted + ' duplicate lessons\n');

  // === STEP 2: Assign ONLY correct images ===
  // Only assign when the image genuinely matches the lesson content

  const safeAssignments = [
    // Universal lessons - only assign when image is genuinely correct
    { title: 'Emergency Vehicles: Pull Over and Stop', stateCode: null, image: '/signs/emergency-vehicle.png' },
    { title: 'Hill Parking: Which Way to Turn Your Wheels', stateCode: null, image: '/handbook-illustrations/hill-parking-downhill.png' },
    { title: 'Green Light: Go If Clear', stateCode: null, image: '/handbook-illustrations/green-light.png' },
    { title: 'Truck No-Zones: Stay Out of Blind Spots', stateCode: null, image: '/handbook-illustrations/no-zones-trucks.png' },
    { title: 'Following Distance for Large Trucks', stateCode: null, image: '/handbook-illustrations/following-distance-trucks.png' },
  ];

  let assigned = 0;
  for (const a of safeAssignments) {
    const where = { title: a.title };
    if (a.stateCode) where.stateCode = a.stateCode;
    else where.stateCode = null;
    
    const lesson = await prisma.microLesson.findFirst({ where });
    if (lesson && !lesson.imageUrl) {
      await prisma.microLesson.update({
        where: { id: lesson.id },
        data: { imageUrl: a.image },
      });
      console.log('Assigned: ' + a.title + ' -> ' + a.image.split('/').pop());
      assigned++;
    }
  }

  // State roundabout lessons - roundabout illustration is correct for all
  const roundaboutLessons = await prisma.microLesson.findMany({
    where: { title: { contains: 'Roundabout' }, imageUrl: null },
  });
  for (const l of roundaboutLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/handbook-illustrations/roundabouts.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> roundabouts.png');
    assigned++;
  }

  // State pedestrian right-of-way lessons - pedestrian crossing sign is correct
  const pedLessons = await prisma.microLesson.findMany({
    where: { title: { contains: 'Yield to Pedestrians' }, imageUrl: null },
  });
  for (const l of pedLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/pedestrian-crossing.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> pedestrian-crossing.png');
    assigned++;
  }

  // Move Over law lessons - emergency vehicle sign is correct
  const moveOverLessons = await prisma.microLesson.findMany({
    where: { title: { contains: 'Move Over' }, imageUrl: null },
  });
  for (const l of moveOverLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/signs/emergency-vehicle.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> emergency-vehicle.png');
    assigned++;
  }

  // School bus rule lessons - school bus illustration
  const schoolBusLessons = await prisma.microLesson.findMany({
    where: { title: { contains: 'School Bus' }, imageUrl: null },
  });
  for (const l of schoolBusLessons) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: '/handbook-illustrations/school-bus-two-lanes.png' },
    });
    console.log('Assigned: [' + (l.stateCode || 'UNIV') + '] ' + l.title + ' -> school-bus-two-lanes.png');
    assigned++;
  }

  console.log('\nTotal images assigned: ' + assigned);

  // === STEP 3: Remove WRONG speed limit signs from state lessons ===
  // The speed-limit.png shows "50" which is wrong for most state freeway speed lessons
  const wrongSpeedSigns = await prisma.microLesson.findMany({
    where: {
      imageUrl: '/signs/speed-limit.png',
      OR: [
        { title: { contains: '65 mph' } },
        { title: { contains: '70 mph' } },
        { title: { contains: '75 mph' } },
        { title: { contains: '25 mph' } },
        { title: { contains: '30 mph' } },
      ],
    },
  });
  for (const l of wrongSpeedSigns) {
    await prisma.microLesson.update({
      where: { id: l.id },
      data: { imageUrl: null },
    });
    console.log('Removed wrong speed sign from: [' + (l.stateCode || 'UNIV') + '] ' + l.title);
  }

  // === STEP 4: Report what images are still needed ===
  console.log('\n\n=== IMAGES STILL NEEDED ===');
  console.log('(These lessons have no image and no suitable one exists yet)\n');
  
  const noImage = await prisma.microLesson.findMany({
    where: { imageUrl: null },
    select: { title: true, stateCode: true, topic: true },
    orderBy: [{ topic: 'asc' }, { stateCode: 'asc' }],
  });

  // Group by what kind of image would be needed
  const needsNewSign = [];
  const needsIllustration = [];
  const okWithoutImage = [];

  for (const l of noImage) {
    const t = l.title.toLowerCase();
    const sc = l.stateCode || 'UNIV';

    if (t.includes('speed limit') || t.includes('freeway speed') || t.includes('mph')) {
      needsNewSign.push(l);
    } else if (t.includes('following distance') && !t.includes('truck')) {
      needsIllustration.push(l);
    } else if (t.includes('bac') || t.includes('dui') || t.includes('alcohol') || t.includes('implied consent') || t.includes('zero tolerance')) {
      okWithoutImage.push(l);  // alcohol topics don't need signs
    } else if (t.includes('phone') || t.includes('texting') || t.includes('handheld') || t.includes('hands-free') || t.includes('distracted')) {
      okWithoutImage.push(l);  // phone topics don't need signs
    } else if (t.includes('license') || t.includes('permit') || t.includes('insurance') || t.includes('vision') || t.includes('hit and run') || t.includes('child safety') || t.includes('graduated')) {
      okWithoutImage.push(l);  // licensing topics don't need signs
    } else {
      needsIllustration.push(l);
    }
  }

  console.log('--- NEED NEW SPEED LIMIT SIGNS (' + needsNewSign.length + ') ---');
  console.log('We only have a "50 mph" speed limit sign. We need:');
  const speedsNeeded = new Set();
  for (const l of needsNewSign) {
    const match = l.title.match(/(\d+)\s*mph/i);
    if (match) speedsNeeded.add(match[1]);
    console.log('  [' + (l.stateCode || 'UNIV') + '] ' + l.title);
  }
  console.log('\nSpeed limit signs needed: ' + [...speedsNeeded].sort((a,b) => a-b).join(', ') + ' mph');

  console.log('\n--- NEED NEW ILLUSTRATIONS (' + needsIllustration.length + ') ---');
  for (const l of needsIllustration) {
    console.log('  [' + (l.stateCode || 'UNIV') + '] ' + l.title);
  }

  console.log('\n--- OK WITHOUT IMAGE (' + okWithoutImage.length + ') ---');
  console.log('(These topics work fine as text-only lessons)');
  for (const l of okWithoutImage) {
    console.log('  [' + (l.stateCode || 'UNIV') + '] ' + l.title);
  }

  // Final count
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
