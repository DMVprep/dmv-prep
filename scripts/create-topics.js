process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

const newTopics = [
  { name: 'Road Signs', slug: 'road-signs' },
  { name: 'Traffic Signals', slug: 'traffic-signals' },
  { name: 'Pavement Markings', slug: 'pavement-markings' },
  { name: 'Right of Way', slug: 'right-of-way-rules' },
  { name: 'Speed Limits', slug: 'speed-limit-rules' },
  { name: 'Headlights & Visibility', slug: 'headlights-visibility' },
  { name: 'Alcohol & Drugs', slug: 'alcohol-drugs' },
  { name: 'School Buses & Zones', slug: 'school-buses-zones' },
  { name: 'Merging & Lane Changes', slug: 'merging-lane-changes' },
  { name: 'Parking & Stopping', slug: 'parking-stopping' },
  { name: 'Sharing the Road', slug: 'sharing-the-road' },
  { name: 'Vehicle Equipment', slug: 'vehicle-equipment' },
  { name: 'Fines & Penalties', slug: 'fines-penalties' },
  { name: 'GDL & Licensing', slug: 'gdl-licensing' },
  { name: 'Emergencies & Special Situations', slug: 'emergencies-special' },
];

Promise.all(newTopics.map(t =>
  p.topic.upsert({
    where: { slug: t.slug },
    update: {},
    create: { name: t.name, slug: t.slug }
  })
)).then(results => {
  results.forEach(t => console.log('OK:', t.id, '|', t.name));
  console.log('Done - '+results.length+' topics');
}).catch(e => console.error('Error:', e.message))
.finally(() => p.$disconnect());
