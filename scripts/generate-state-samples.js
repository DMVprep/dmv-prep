const{PrismaClient}=require('@prisma/client');
const fs=require('fs');
const envFile=fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL=envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p=new PrismaClient();
const TOPIC_IDS={'Traffic Signs':'cmmpntv01001e3jd60a0j8onz','Right of Way':'cmmpntvao001f3jd6afqngfl5','Speed Limits':'cmmpntvhy001g3jd6fkjlrbmq','Safe Driving':'cmmpntvnw001h3jd6zi1q1365','Alcohol & Substances':'cmn2ia2ei0000ua6cuap3rywt'};
const ALL=['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
async function main(){
  const output={};
  for(const code of ALL){
    const s=await p.state.findUnique({where:{code}});
    if(!s){console.log(code+': not in DB');continue;}
    const total=await p.question.count({where:{stateId:s.id}});
    if(total===0){console.log(code+': no questions');continue;}
    const qs=[];
    for(const[name,topicId]of Object.entries(TOPIC_IDS)){
      const found=await p.question.findMany({where:{stateId:s.id,topicId},include:{choices:true},take:2});
      for(const q of found){
        const ci=q.choices.findIndex(c=>c.isCorrect);
        if(ci===-1)continue;
        qs.push({text:q.text,explanation:q.explanation||'',choices:q.choices.map(c=>c.text),correct:ci});
      }
    }
    output[code]=qs.slice(0,10);
    console.log(code+': '+qs.length+' questions extracted');
  }
  const ts=`// src/data/state-sample-questions.ts\n// AUTO-GENERATED — run scripts/generate-state-samples.js to regenerate\n\nexport interface SampleQuestion {\n  text: string;\n  explanation: string;\n  choices: string[];\n  correct: number;\n}\n\nexport const STATE_SAMPLE_QUESTIONS: Record<string, SampleQuestion[]> = ${JSON.stringify(output,null,2)};\n`;
  fs.writeFileSync('src/data/state-sample-questions.ts',ts);
  console.log('\n✅ Written to src/data/state-sample-questions.ts');
}
main().catch(console.error).finally(()=>p.$disconnect());
