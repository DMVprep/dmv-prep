const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Top 10 states by population
  const topStates = ['CA','TX','FL','NY','PA','IL','OH','GA','NC','MI'];
  
  for (const sc of topStates) {
    const stateSpecific = await prisma.microLesson.findMany({
      where: { stateCode: sc },
      select: { title: true, topic: true, imageUrl: true },
      orderBy: { topic: 'asc' },
    });
    
    console.log('\n[' + sc + '] State-specific: ' + stateSpecific.length);
    stateSpecific.forEach(l => {
      const img = l.imageUrl ? ' IMG:' + l.imageUrl.split('/').pop() : ' (no image)';
      console.log('  [' + l.topic + '] ' + l.title + img);
    });
  }

  // Universal lessons
  const universal = await prisma.microLesson.findMany({
    where: { stateCode: null },
    select: { id: true, title: true, topic: true, simpleLine: true, imageUrl: true },
    orderBy: { topic: 'asc' },
  });
  
  console.log('\n\n=== UNIVERSAL LESSONS (' + universal.length + ') ===\n');
  
  // Group by topic
  const byTopic = {};
  universal.forEach(l => {
    if (!byTopic[l.topic]) byTopic[l.topic] = [];
    byTopic[l.topic].push(l);
  });
  
  for (const [topic, lessons] of Object.entries(byTopic).sort()) {
    console.log('\n--- ' + topic.toUpperCase() + ' (' + lessons.length + ') ---');
    lessons.forEach(l => {
      const img = l.imageUrl ? ' IMG:' + l.imageUrl.split('/').pop() : ' (no img)';
      const generic = (l.simpleLine.includes('most states') || l.simpleLine.includes('Most states') || l.simpleLine.includes('typically')) ? ' ** GENERIC **' : '';
      console.log('  ' + l.title + img + generic);
    });
  }

  // Count images
  const withImages = universal.filter(l => l.imageUrl);
  const withoutImages = universal.filter(l => !l.imageUrl);
  console.log('\n\n=== IMAGE STATUS ===');
  console.log('With images: ' + withImages.length);
  console.log('Without images: ' + withoutImages.length);
  console.log('\nLessons needing images:');
  withoutImages.forEach(l => console.log('  [' + l.topic + '] ' + l.title));
}

main().then(() => prisma.$disconnect());
