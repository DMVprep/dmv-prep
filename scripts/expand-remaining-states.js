const{PrismaClient}=require('@prisma/client');
const fs=require('fs');
const https=require('https');
const{execSync}=require('child_process');
const path=require('path');
const DRY_RUN=process.argv.includes('--dry-run');
const envFile=fs.readFileSync('.env.local','utf8');
process.env.DATABASE_URL=envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_API_KEY=envFile.match(/ANTHROPIC_API_KEY="([^"]+)"/)?.[1];
const p=new PrismaClient();
const TOPIC={SIGNS:'cmmpntv01001e3jd60a0j8onz',ROW:'cmmpntvao001f3jd6afqngfl5',SPEED:'cmmpntvhy001g3jd6fkjlrbmq',SAFE:'cmmpntvnw001h3jd6zi1q1365',ALCOHOL:'cmn2ia2ei0000ua6cuap3rywt',LICENSE:'cmn2ia2n20001ua6cq7y7tood'};
const TM={'Traffic Signs':TOPIC.SIGNS,'Right of Way':TOPIC.ROW,'Speed Limits':TOPIC.SPEED,'Safe Driving':TOPIC.SAFE,'Alcohol & Substances':TOPIC.ALCOHOL,'Licensing & Permits':TOPIC.LICENSE};
const STATES=[
{code:'IN',name:'Indiana',target:400,handbook:'DMV Manuals/drivers-manual IN.pdf',facts:'Indiana: fire hydrant 15ft; interstate 70mph cars 65mph trucks over 26000lbs; BAC 0.08 adults 0.02 under 21; permit age 15; GDL probationary license; implied consent; school bus stop 20ft; work zone fines doubled; seatbelt all; no texting; Move Over law.'},
{code:'IA',name:'Iowa',target:400,handbook:'DMV Manuals/dlmanual Oiowa.pdf',facts:'Iowa: fire hydrant 5ft unique shortest USA; residential 25mph business 45mph; following 3-4 seconds; BAC 0.08 adults 0.02 under 21; permit age 14; uses OWI not DUI; implied consent; school bus stop; seatbelt required; point system.'},
{code:'KS',name:'Kansas',target:400,handbook:'DMV Manuals/DMV Kansas.pdf',facts:'Kansas: fire hydrant 15ft; urban 30mph school zone 20mph highway 75mph; following 2sec good 4sec adverse; BAC 0.08 adults 0.02 under 21; permit age 14; DUI penalties; implied consent; point system; school bus stop; seatbelt all.'},
{code:'MD',name:'Maryland',target:400,handbook:'DMV Manuals/DL-002Maryland.pdf',facts:'Maryland: following 3-4 seconds; BAC 0.08 DWI 0.07 DUI unique; under 21 BAC 0.02; permit age 15yr9mo; GDL no driving midnight-5AM; max 1 passenger under 18 first 5 months; implied consent; school bus stop; Move Over; points 8 warning 12 revocation; seatbelt all.'},
{code:'MN',name:'Minnesota',target:400,handbook:'DMV Manuals/dvs-class-d-drivers-manual-english MN.pdf',facts:'Minnesota: fire hydrant 10ft; urban 30mph; following 3 seconds; BAC 0.08 adults 0.02 under 21; permit age 15; GDL provisional; implied consent; school bus stop; seatbelt all; child seat required; point system.'},
{code:'MS',name:'Mississippi',target:400,handbook:'DMV Manuals/1.15.2025 Mississipil.pdf',facts:'Mississippi: fire hydrant 10ft; school zone 15mph; interstate 70mph; BAC 0.08 adults 0.02 under 21; permit age 15; implied consent; school bus stop; seatbelt all; child seat required; DUI penalties.'},
{code:'MO',name:'Missouri',target:400,handbook:'DMV Manuals/Driver Guide MO.pdf',facts:'Missouri: city 25mph; interstate 70mph min 40mph; following 3 seconds; BAC 0.08 adults 0.02 under 21; permit age 15; implied consent; school bus stop; seatbelt all; child seat required; point system; DUI penalties.'},
{code:'NV',name:'Nevada',target:400,handbook:'DMV Manuals/dlbookNVD.pdf',facts:'Nevada: fire hydrant 15ft parallel 20ft angle; business residential 25mph; following 3sec min 4 recommended; BAC 0.08 adults 0.02 under 21; permit age 15yr6mo; GDL restricted; implied consent; school bus stop; seatbelt all; child seat required; DUI penalties.'},
];
function extractPdf(p){try{const s=`import sys\ntry:\n from pypdf import PdfReader\nexcept: from PyPDF2 import PdfReader\nr=PdfReader(sys.argv[1])\nt=""\nfor i in range(min(40,len(r.pages))):\n try:\n  x=r.pages[i].extract_text()\n  if x: t+=x+"\\n"\n except: pass\nprint(t[:40000])`;fs.writeFileSync('/tmp/ep.py',s);return execSync('python3 /tmp/ep.py "'+p+'"',{maxBuffer:50*1024*1024,timeout:180000}).toString();}catch(e){return null;}}
function parse(raw){let s=raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();const fc=s.indexOf('}]}');if(fc!==-1)s=s.slice(0,fc+3);s=s.replace(/,(\s*[\]\}])/g,'$1');try{return JSON.parse(s);}catch(_){}let lg=-1,d=0,ins=false,esc=false;for(let i=0;i<s.length;i++){const c=s[i];if(esc){esc=false;continue;}if(c==='\\'&&ins){esc=true;continue;}if(c==='"'){ins=!ins;continue;}if(ins)continue;if(c==='{')d++;if(c==='}'){d--;if(d===1)lg=i;}}if(lg===-1)return null;try{return JSON.parse(s.slice(0,lg+1).trimEnd().replace(/,\s*$/,'')+'\n  ]\n}');}catch(_){return null;}}
function callAPI(prompt){return new Promise((res,rej)=>{const body=JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:6000,messages:[{role:'user',content:prompt}]});const req=https.request({hostname:'api.anthropic.com',port:443,path:'/v1/messages',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body),'x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'}},(r)=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{if(r.statusCode!==200)return rej(new Error('API '+r.statusCode));try{res(JSON.parse(d).content[0].text);}catch(e){rej(e);}});});req.on('error',rej);req.setTimeout(120000,()=>{req.destroy();rej(new Error('Timeout'));});req.write(body);req.end();});}
async function processState(cfg){
console.log('\n'+'═'.repeat(50)+'\n  '+cfg.code+' — '+cfg.name+'\n'+'═'.repeat(50));
const rec=await p.state.findUnique({where:{code:cfg.code}});
if(!rec){console.log('  NOT IN DB');return null;}
const cur=await p.question.count({where:{stateId:rec.id}});
console.log('  Current: '+cur+' → Target: '+cfg.target);
if(cur>=cfg.target){console.log('  Already at target');return{state:cfg.code,skipped:true};}
const needed=cfg.target-cur;
const ex=await p.question.findMany({where:{stateId:rec.id},select:{text:true},take:20});
const sample=ex.slice(0,10).map(q=>'- '+q.text).join('\n');
const pdf=extractPdf(cfg.handbook);
const hb=pdf||(console.log('  PDF failed, using facts')||cfg.facts);
if(pdf)console.log('  PDF extracted '+Math.round(pdf.length/1000)+'KB');
const BATCH=40,nb=Math.ceil(needed/BATCH);
const all=[];
for(let b=0;b<nb;b++){
  const sz=Math.min(BATCH,needed-all.length);if(sz<=0)break;
  console.log('  API call '+(b+1)+'/'+nb+' ('+sz+' questions)...');
  const prompt='Generate exactly '+sz+' DMV practice test questions for '+cfg.name+'. KEY FACTS: '+cfg.facts+' HANDBOOK: '+hb.slice(0,20000)+' EXISTING (no duplicates): '+sample+' RULES: exactly 4 choices all with non-empty text strings, exactly 1 isCorrect true, spread across all 6 topics. Output ONLY valid JSON no markdown: {"questions":[{"topic":"Safe Driving","text":"Q?","choices":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"E."}]} Valid topics: Traffic Signs, Right of Way, Speed Limits, Safe Driving, Alcohol & Substances, Licensing & Permits. Generate all '+sz+' now.';
  let raw;try{raw=await callAPI(prompt);}catch(e){console.log('  FAILED: '+e.message);continue;}
  const parsed=parse(raw);
  if(!parsed){console.log('  Parse failed batch '+(b+1));continue;}
  const qs=parsed.questions||[];console.log('  Got '+qs.length);all.push(...qs);
  if(b<nb-1)await new Promise(r=>setTimeout(r,1500));
}
let ins=0,skip=0;
for(const q of all){
  const tid=TM[q.topic];
  if(!tid||!q.choices||q.choices.length!==4||q.choices.filter(c=>c.isCorrect).length!==1||!q.text||q.text.length<10){skip++;continue;}
  if(q.choices.some(c=>!c.text||c.text.trim()==='')) {skip++;continue;}
  if(DRY_RUN){ins++;continue;}
  await p.question.create({data:{text:q.text,explanation:q.explanation||'',stateId:rec.id,topicId:tid,choices:{create:q.choices.map(c=>({text:c.text.trim(),isCorrect:Boolean(c.isCorrect)}))}}});
  ins++;
}
console.log('  Inserted: '+ins+' Skipped: '+skip);
const final=DRY_RUN?cur+ins:await p.question.count({where:{stateId:rec.id}});
console.log('  Final: '+final);
return{state:cfg.code,before:cur,inserted:ins,after:final};
}
async function main(){
console.log('EXPANDING REMAINING STATES: IN IA KS MD MN MS MO NV');
console.log('Mode: '+(DRY_RUN?'DRY-RUN':'LIVE')+'\n');
const results=[];
for(const s of STATES){const r=await processState(s);if(r)results.push(r);if(!DRY_RUN)await new Promise(r=>setTimeout(r,3000));}
console.log('\nSUMMARY');
for(const r of results){if(r.skipped)console.log(r.state+': already at target');else console.log(r.state+': '+r.before+' → '+r.after+' (+'+r.inserted+')');}
}
main().catch(console.error).finally(()=>p.$disconnect());
