process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
process.env.DATABASE_URL = fs.readFileSync('/Users/jjakc/Desktop/dmv-prep/.env.local','utf8').match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();
const FL_STATE_ID = 'cmmpntmvv00083jd6x3g9m5js';
p.question.findMany({
  where:{stateId:FL_STATE_ID},
  include:{choices:true,topic:true},
  take:10,
  skip:Math.floor(Math.random()*490)
}).then(r=>{
  r.forEach(q=>{
    const correct=q.choices.find(c=>c.isCorrect===true);
    console.log('['+q.topic.name+']');
    console.log('Q: '+q.text);
    console.log('A: '+correct.text);
    console.log('Wrong: '+q.choices.filter(c=>!c.isCorrect).map(c=>c.text).join(' | '));
    console.log('---');
  });
}).finally(()=>p.$disconnect());
