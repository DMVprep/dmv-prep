process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

// Keywords that clearly belong to specific topics
const TOPIC_KEYWORDS = {
  'alcohol-substances': ['BAC','DUI','DWI','alcohol','breathalyzer','implied consent','ignition interlock','sobriety','intoxicated','impaired','drink','drunk'],
  'licensing-permits': ['permit','license','GDL','curfew','points','suspend','revok','renewal','class E','learner','restricted','graduated'],
  'speed-limits': ['speed limit','mph','MPH','speeding','minimum speed','maximum speed','work zone fine','school zone fine'],
  'traffic-signs': ['sign','signal','arrow','marking','lane','crosswalk','railroad','stop arm','school bus light','flashing light'],
  'right-of-way': ['right of way','yield','merge','pedestrian','intersection','4-way','four-way','emergency vehicle','school bus stop'],
  'safe-driving': ['following distance','headlight','seat belt','seatbelt','turn signal','parking','blind spot','fatigue','distracted','cell phone','texting']
};

async function main() {
  const topics = await p.topic.findMany();
  const topicMap = Object.fromEntries(topics.map(t=>[t.id, t]));

  console.log('Checking for questions likely in wrong topics...\n');
  let totalIssues = 0;

  for (const topic of topics) {
    const qs = await p.question.findMany({
      where: { state: { code: 'FL' }, topicId: topic.id },
      select: { id: true, text: true }
    });

    // Check for keywords from OTHER topics
    for (const q of qs) {
      for (const [otherSlug, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (otherSlug === topic.slug) continue;
        const matches = keywords.filter(kw => q.text.toLowerCase().includes(kw.toLowerCase()));
        if (matches.length >= 2) {
          console.log(`POSSIBLE WRONG TOPIC: [${topic.name}] → should be [${otherSlug}]`);
          console.log(`  Q: ${q.text.substring(0,90)}`);
          console.log(`  Keywords: ${matches.join(', ')}`);
          totalIssues++;
        }
      }
    }
  }
  console.log(`\nTotal possible misplacements: ${totalIssues}`);

  // Check duplicates by keyword count
  console.log('\n--- DUPLICATE CHECK ---');
  const dupeKeywords = [
    'fines are doubled','school zone','speeding buffer','BAC','0.02%',
    'following distance','fire hydrant','right turn on red'
  ];
  for (const kw of dupeKeywords) {
    const count = await p.question.count({
      where: { state: { code: 'FL' }, text: { contains: kw, mode: 'insensitive' } }
    });
    if (count > 3) console.log(`"${kw}": ${count} questions`);
  }
}
main().catch(console.error).finally(()=>p.$disconnect());
