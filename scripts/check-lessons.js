const{PrismaClient}=require('@prisma/client');
const p=new PrismaClient();
p.microLesson.groupBy({by:['stateCode'],_count:true,orderBy:{stateCode:'asc'}}).then(gs=>{
  let missing=[];
  let universal=0;
  gs.forEach(g=>{
    if(!g.stateCode) universal=g._count;
    if(g.stateCode && g._count<4) missing.push(g.stateCode+'('+g._count+')');
  });
  console.log('States with <4 lessons: '+(missing.length?missing.join(', '):'NONE'));
  console.log('Universal: '+universal);
  console.log('Total state groups: '+(gs.length-1));
  p.$disconnect();
});
