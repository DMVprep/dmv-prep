process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
p.topic.findMany({orderBy:{name:'asc'}}).then(r=>{
  r.forEach(t=>console.log(t.id+' | '+t.name+' | '+t.slug));
}).finally(()=>p.$disconnect());
