process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';
p.question.groupBy({
  by:['topicId'],
  where:{stateId:FL_STATE_ID},
  _count:{id:true}
}).then(async rows=>{
  const topics = await p.topic.findMany({where:{id:{in:rows.map(r=>r.topicId)}}});
  const topicMap = Object.fromEntries(topics.map(t=>[t.id,t.name]));
  let total=0;
  rows.forEach(r=>{
    console.log(topicMap[r.topicId]+': '+r._count.id);
    total+=r._count.id;
  });
  console.log('\nTotal: '+total);
}).finally(()=>p.$disconnect());
