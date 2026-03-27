const fs = require('fs');

const fixes = [
  {
    file: 'src/app/state/[state]/road-sign-practice-test/page.tsx',
    old: 'Learn all ',
    oldFull: null,
    search: 'Learn all ',
  },
  {
    file: 'src/app/road-signs-practice-test/page.tsx',
    old: 'Study all US road signs with our free practice test. Learn regulatory, warning, and guide signs tested on every state DMV exam. Updated for 2026.',
    new: 'Master every road sign on the DMV test — FREE. Regulatory, warning, and guide signs with real exam questions. Pass your permit test first try. Updated 2026.',
  },
  {
    file: 'src/app/first-time-drivers-guide/page.tsx',
    old: "Complete guide for first-time drivers. Learn how to get your learner's permit, pass the DMV written test, and get your driver's license in 2026. All 50 states covered.",
    new: "First-time driver? Here's exactly how to get your permit and license — step by step. Free guide for all 50 states. Start your journey today!",
  },
  {
    file: 'src/app/how-many-questions-on-dmv-test/page.tsx',
    old: "Find out exactly how many questions are on the DMV written test in every state. Includes passing scores, number of questions allowed wrong, and tips to pass first try.",
    new: "How many questions on YOUR state's DMV test? Complete list for all 50 states with passing scores and tips. Find out now — free!",
  },
  {
    file: 'src/app/dmv-test-passing-score/page.tsx',
    old: "Find out what score you need to pass the DMV written test in every state. Most states require 80%, but some are higher or lower. Full list for all 50 states updated 2026.",
    new: "What score do you need to pass the DMV test in your state? Full list for all 50 states. Most require 80% — find yours now!",
  },
  {
    file: 'src/app/dmv-test-age-requirements/page.tsx',
    old: "Find out the minimum age to get a learner's permit and driver's license in every US state. Complete 2026 guide to DMV age requirements for all 50 states.",
    new: "How old do you need to be to get a driver's permit? Age requirements for all 50 states — some start at 14! Full 2026 guide.",
  },
];

let fixed = 0;
fixes.forEach(({file, old: o, new: n}) => {
  if (!n) return;
  try {
    let f = fs.readFileSync(file, 'utf8');
    if (f.includes(o)) {
      f = f.replace(o, n);
      fs.writeFileSync(file, f);
      console.log('✅', file.split('/').slice(-2).join('/'));
      fixed++;
    } else {
      console.log('❌ Not found:', file.split('/').slice(-2).join('/'));
    }
  } catch(e) {
    console.log('❌ Error:', file.split('/').slice(-2).join('/'), e.message);
  }
});

// Fix road sign page description separately using regex
const rsFile = 'src/app/state/[state]/road-sign-practice-test/page.tsx';
try {
  let f = fs.readFileSync(rsFile, 'utf8');
  const old = 'Learn all ';
  const idx = f.indexOf('description:');
  const descLine = f.substring(idx, idx+200);
  console.log('Road sign desc:', descLine.substring(0,100));
} catch(e) {
  console.log('Road sign error:', e.message);
}

console.log('\nFixed:', fixed, '/', fixes.length);
