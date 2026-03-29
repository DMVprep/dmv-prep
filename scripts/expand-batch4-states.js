// scripts/expand-batch4-states.js
// Expands UT, VA, WA, WI from 240 → ~400 questions each
// Run: node scripts/expand-batch4-states.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) console.log('\n⚠️  DRY-RUN MODE — no DB changes\n');

const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const ANTHROPIC_API_KEY = envFile.match(/ANTHROPIC_API_KEY="([^"]+)"/)?.[1];
const p = new PrismaClient();

const TOPIC = {
  SIGNS:'cmmpntv01001e3jd60a0j8onz', ROW:'cmmpntvao001f3jd6afqngfl5',
  SPEED:'cmmpntvhy001g3jd6fkjlrbmq', SAFE:'cmmpntvnw001h3jd6zi1q1365',
  ALCOHOL:'cmn2ia2ei0000ua6cuap3rywt', LICENSE:'cmn2ia2n20001ua6cq7y7tood',
};

const STATES = [
  { code:'UT', name:'Utah', handbook:'DMV Manuals/Driver-Handbook Utah.pdf', target:400,
    verifiedFacts:`- BAC: 0.05 adults (Utah unique — lower than all other states), 0.00 for under 21\n- Permit age: 15\n- School zone: 20 mph\n- Residential: 25 mph\n- Following distance: 2-second rule\n- Fire hydrant: 15 feet\n- GDL provisional license restrictions\n- Implied consent applies\n- School bus: stop when red lights flash\n- Seatbelt required all occupants` },
  { code:'VA', name:'Virginia', handbook:'DMV Manuals/dmv39 VA.pdf', target:400,
    verifiedFacts:`- BAC: 0.08 adults, 0.02 under 21\n- Permit age: 15 years 6 months\n- Residential/school: 25 mph\n- Unpaved road: 35 mph\n- Fire hydrant: 15 feet\n- GDL provisional restrictions\n- Implied consent applies\n- School bus: stop when red lights flash\n- Seatbelt required all occupants\n- Point system applies` },
  { code:'WA', name:'Washington', handbook:'DMV Manuals/driver-guide WA.pdf', target:400,
    verifiedFacts:`- BAC: 0.08 adults, 0.02 under 21\n- Permit age: 15 years 6 months\n- School zone: 20 mph\n- Fire hydrant: 15 feet\n- GDL intermediate license restrictions\n- Implied consent applies\n- School bus: stop when red lights flash\n- No handheld cell phone while driving\n- Seatbelt required all occupants\n- Point system applies` },
  { code:'WI', name:'Wisconsin', handbook:'DMV Manuals/bds126-motorists-handbookWI.pdf', target:400,
    verifiedFacts:`- BAC: 0.08 adults, 0.02 under 21 (OWI — Operating While Intoxicated)\n- Permit age: 15 years 6 months\n- School zone: 15 mph\n- Outlying city/village: 35 mph\n- Following distance: 4-second rule\n- GDL probationary license restrictions\n- Implied consent applies\n- School bus: stop when red lights flash\n- Seatbelt required all occupants\n- Point system applies` },
];

function extractPdfText(pdfPath) {
  try {
    console.log(`  📄 Extracting from ${path.basename(pdfPath)}...`);
    const script = `
import sys
try:
    from pypdf import PdfReader
except: from PyPDF2 import PdfReader
r = PdfReader(sys.argv[1])
t = ""
for i in range(min(40, len(r.pages))):
    try:
        x = r.pages[i].extract_text()
        if x: t += x + "\\n"
    except: pass
print(t[:60000])`.trim();
    fs.writeFileSync('/tmp/ep.py', script);
    const text = execSync(`python3 /tmp/ep.py "${pdfPath}"`, { maxBuffer:50*1024*1024, timeout:180000 }).toString();
    console.log(`  ✅ Extracted ${Math.round(text.length/1000)}KB`);
    return text;
  } catch(e) { console.log(`  ❌ PDF failed: ${e.message}`); return null; }
}

function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:6000, messages:[{role:'user',content:prompt}] });
    const req = https.request({ hostname:'api.anthropic.com', port:443, path:'/v1/messages', method:'POST',
      headers:{ 'Content-Type':'application/json','Content-Length':Buffer.byteLength(body),'x-api-key':ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01' }
    }, (res) => {
      let d=''; res.on('data',c=>d+=c);
      res.on('end',()=>{ if(res.statusCode!==200) return reject(new Error(`API ${res.statusCode}: ${d}`));
        try { resolve(JSON.parse(d).content[0].text); } catch(e) { reject(e); } });
    });
    req.on('error',reject); req.setTimeout(120000,()=>{req.destroy();reject(new Error('Timeout'));});
    req.write(body); req.end();
  });
}

function repairJSON(str) {
  let lastGood=-1,depth=0,inStr=false,esc=false;
  for(let i=0;i<str.length;i++){const c=str[i];if(esc){esc=false;continue;}if(c==='\\'&&inStr){esc=true;continue;}if(c==='"'){inStr=!inStr;continue;}if(inStr)continue;if(c==='{')depth++;if(c==='}'){depth--;if(depth===1)lastGood=i;}}
  if(lastGood===-1)return null;
  return str.slice(0,lastGood+1).trimEnd().replace(/,\s*$/,'')+'\n  ]\n}';
}

function buildPrompt(state, handbook, sample, batch, size, total) {
  return `Generate exactly ${size} DMV practice test questions for ${state.name}. Batch ${batch} of ${total}.

VERIFIED ${state.code} FACTS:
${state.verifiedFacts}

HANDBOOK EXCERPT:
${handbook.slice(0,30000)}

EXISTING QUESTIONS (do not duplicate):
${sample}

RULES:
- Exactly 4 choices, all with non-empty text
- Exactly 1 isCorrect:true
- Scenario-based where possible
- Spread across all 6 topics

Respond ONLY with JSON (no markdown):
{"questions":[{"topic":"Traffic Signs","text":"Question?","choices":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Why B."}]}

Valid topics: "Traffic Signs","Right of Way","Speed Limits","Safe Driving","Alcohol & Substances","Licensing & Permits"
Generate all ${size} questions now.`;
}

async function processState(cfg) {
  console.log(`\n${'═'.repeat(60)}\n  ${cfg.code} — ${cfg.name}\n${'═'.repeat(60)}`);
  const rec = await p.state.findUnique({where:{code:cfg.code}});
  if(!rec){console.log('  ❌ Not in DB');return null;}
  const cur = await p.question.count({where:{stateId:rec.id}});
  console.log(`  Current: ${cur} → Target: ${cfg.target}`);
  if(cur>=cfg.target){console.log('  ✅ Already at target');return{state:cfg.code,skipped:true};}

  const needed = cfg.target - cur;
  const existing = await p.question.findMany({where:{stateId:rec.id},select:{text:true},take:20});
  const sample = existing.slice(0,10).map(q=>`- ${q.text}`).join('\n');
  const handbook = extractPdfText(cfg.handbook) || cfg.verifiedFacts;

  const BATCH=40, numBatches=Math.ceil(needed/BATCH);
  const all=[];
  for(let b=0;b<numBatches;b++){
    const sz=Math.min(BATCH,needed-all.length); if(sz<=0)break;
    console.log(`  🤖 API call ${b+1}/${numBatches} (${sz} questions)...`);
    let raw; try{raw=await callAPI(buildPrompt(cfg,handbook,sample,b+1,sz,numBatches));}catch(e){console.log(`  ❌ ${e.message}`);continue;}
    const cleaned=raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    let parsed=null; try{parsed=JSON.parse(cleaned);}catch(_){}
    if(!parsed){const rep=repairJSON(cleaned);if(rep){try{parsed=JSON.parse(rep);console.log(`  ℹ  Recovered ${(parsed.questions||[]).length}`);}catch(_){}}}
    if(!parsed){console.log(`  ⚠  Parse failed batch ${b+1}`);continue;}
    console.log(`  ✅ Got ${(parsed.questions||[]).length}`); all.push(...(parsed.questions||[]));
    if(b<numBatches-1)await new Promise(r=>setTimeout(r,1500));
  }

  const topicMap={'Traffic Signs':TOPIC.SIGNS,'Right of Way':TOPIC.ROW,'Speed Limits':TOPIC.SPEED,'Safe Driving':TOPIC.SAFE,'Alcohol & Substances':TOPIC.ALCOHOL,'Licensing & Permits':TOPIC.LICENSE};
  let ins=0,skip=0;
  for(const q of all){
    const tid=topicMap[q.topic]; if(!tid){skip++;continue;}
    if(!q.choices||q.choices.length!==4){skip++;continue;}
    if(q.choices.filter(c=>c.isCorrect).length!==1){skip++;continue;}
    if(!q.text||q.text.length<10){skip++;continue;}
    if(q.choices.some(c=>!c.text||c.text.trim()==='')) {skip++;continue;}
    if(DRY_RUN){ins++;continue;}
    await p.question.create({data:{text:q.text,explanation:q.explanation||'',stateId:rec.id,topicId:tid,choices:{create:q.choices.map(c=>({text:c.text.trim(),isCorrect:Boolean(c.isCorrect)}))}}});
    ins++;
  }
  console.log(`  ✅ Inserted: ${ins} | Skipped: ${skip}`);
  const final=DRY_RUN?cur+ins:await p.question.count({where:{stateId:rec.id}});
  console.log(`  📊 Final: ${final}`);
  return{state:cfg.code,before:cur,inserted:ins,after:final};
}

async function main(){
  console.log('🚀 EXPANSION — BATCH 4: UT, VA, WA, WI');
  console.log(`   Mode: ${DRY_RUN?'DRY-RUN':'LIVE'}\n`);
  if(!ANTHROPIC_API_KEY){console.error('❌ No API key');process.exit(1);}
  const results=[];
  for(const s of STATES){const r=await processState(s);if(r)results.push(r);if(!DRY_RUN)await new Promise(r=>setTimeout(r,3000));}
  console.log('\n'+'='.repeat(60)+'\nSUMMARY\n'+'='.repeat(60));
  for(const r of results){if(r.skipped)console.log(`  ${r.state}: already at target`);else console.log(`  ${r.state}: ${r.before} → ${r.after} (+${r.inserted})`);}
  console.log('\n✅ All 16 states expanded. Run check-verified-states.js to verify.');
}

main().catch(console.error).finally(()=>p.$disconnect());
