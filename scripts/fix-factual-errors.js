// scripts/fix-factual-errors.js
// Reads qa-report.json and fixes WRONG factual errors by updating choice text + explanation.
// CHECK items are skipped — those need human review.
//
// Run (dry-run, see what would change, no DB writes):
//   node scripts/fix-factual-errors.js --dry-run
//
// Run (real — writes to DB):
//   node scripts/fix-factual-errors.js
//
// Output: scripts/fix-log.json  ← full record of every change made

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const DRY_RUN = process.argv.includes('--dry-run');
if (DRY_RUN) console.log('\n⚠️  DRY-RUN MODE — no DB changes will be made\n');

const envFile = fs.readFileSync('.env.local', 'utf8');
process.env.DATABASE_URL = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
const p = new PrismaClient();

// ── Correction map ─────────────────────────────────────────────────────────
// For each error pattern, defines:
//   wrongValues: strings to look for in choice text (case-insensitive)
//   correctValue: what to replace the matched text with
//   correctFact: human-readable fact for the explanation update
//
// A question can trigger multiple patterns. Each pattern is applied independently.
// We find the choice whose text contains a wrongValue and update just that choice.

const CORRECTIONS = {
  // ── Fire hydrant distances ──────────────────────────────────────────────
  'WRONG: AZ fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Arizona law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: AZ fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Arizona law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: AR fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Arkansas law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: AR fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Arkansas law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: CO fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Colorado law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: CO fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Colorado law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: CT fire hydrant = 10 ft (not 15)':  { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '10 feet', correctFact: 'Connecticut law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: CT fire hydrant = 10 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '10 feet', correctFact: 'Connecticut law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: IN fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Indiana law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: IN fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Indiana law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: IA fire hydrant = 5 ft (not 10)':   { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '5 feet',  correctFact: 'Iowa law requires parking at least 5 feet from a fire hydrant.' },
  'WRONG: IA fire hydrant = 5 ft (not 15)':   { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '5 feet',  correctFact: 'Iowa law requires parking at least 5 feet from a fire hydrant.' },
  'WRONG: IA fire hydrant = 5 ft (not 20)':   { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '5 feet',  correctFact: 'Iowa law requires parking at least 5 feet from a fire hydrant.' },
  'WRONG: KS fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Kansas law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: MN fire hydrant = 10 ft (not 15)':  { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '10 feet', correctFact: 'Minnesota law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: MN fire hydrant = 10 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '10 feet', correctFact: 'Minnesota law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: MS fire hydrant = 10 ft (not 15)':  { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '10 feet', correctFact: 'Mississippi law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: MS fire hydrant = 10 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '10 feet', correctFact: 'Mississippi law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: NV fire hydrant = 15 ft parallel / 20 ft angle (not 10)': { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Nevada law requires parking at least 15 feet from a fire hydrant (parallel parking) or 20 feet (angle parking).' },
  'WRONG: NJ fire hydrant = 10 ft (not 15)':  { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '10 feet', correctFact: 'New Jersey law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: NJ fire hydrant = 10 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '10 feet', correctFact: 'New Jersey law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: OK fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Oklahoma law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: OK fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Oklahoma law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: OR fire hydrant = 10 ft (not 15)':  { wrongValues: ['15 feet', '15ft', '15-foot', 'within 15'], correctValue: '10 feet', correctFact: 'Oregon law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: OR fire hydrant = 10 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '10 feet', correctFact: 'Oregon law requires parking at least 10 feet from a fire hydrant.' },
  'WRONG: TN fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Tennessee law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: TN fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Tennessee law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: UT fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Utah law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: UT fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Utah law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: VA fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Virginia law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: VA fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Virginia law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: WA fire hydrant = 15 ft (not 10)':  { wrongValues: ['10 feet', '10ft', '10-foot', 'within 10'], correctValue: '15 feet', correctFact: 'Washington law requires parking at least 15 feet from a fire hydrant.' },
  'WRONG: WA fire hydrant = 15 ft (not 20)':  { wrongValues: ['20 feet', '20ft', '20-foot', 'within 20'], correctValue: '15 feet', correctFact: 'Washington law requires parking at least 15 feet from a fire hydrant.' },

  // ── Speed limits: residential / business ───────────────────────────────
  'WRONG: AZ residential/business = 25 mph (not 30)': { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Arizona residential and business districts is 25 mph unless otherwise posted.' },
  'WRONG: AZ residential/business = 25 mph (not 35)': { wrongValues: ['35 mph', '35mph'], correctValue: '25 mph', correctFact: 'The speed limit in Arizona residential and business districts is 25 mph unless otherwise posted.' },
  'WRONG: IA residential = 25 mph (not 30)':          { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Iowa residential areas is 25 mph unless otherwise posted.' },
  'WRONG: IA residential = 25 mph (not 35)':          { wrongValues: ['35 mph', '35mph'], correctValue: '25 mph', correctFact: 'The speed limit in Iowa residential areas is 25 mph unless otherwise posted.' },
  'WRONG: KS urban district = 30 mph (not 25)':       { wrongValues: ['25 mph', '25mph'], correctValue: '30 mph', correctFact: 'The speed limit in Kansas urban districts is 30 mph unless otherwise posted.' },
  'WRONG: MO city/town/village = 25 mph (not 30)':    { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Missouri cities, towns, and villages is 25 mph unless otherwise posted.' },
  'WRONG: MO city/town/village = 25 mph (not 35)':    { wrongValues: ['35 mph', '35mph'], correctValue: '25 mph', correctFact: 'The speed limit in Missouri cities, towns, and villages is 25 mph unless otherwise posted.' },
  'WRONG: NV residential = 25 mph (not 30)':          { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Nevada business and residential districts is 25 mph unless otherwise posted.' },
  'WRONG: NV residential = 25 mph (not 35)':          { wrongValues: ['35 mph', '35mph'], correctValue: '25 mph', correctFact: 'The speed limit in Nevada business and residential districts is 25 mph unless otherwise posted.' },
  'WRONG: NJ residential/business = 25 mph (not 30)': { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in New Jersey residential and business districts is 25 mph unless otherwise posted.' },
  'WRONG: UT residential/business = 25 mph (not 30)': { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Utah residential and business districts is 25 mph unless otherwise posted.' },
  'WRONG: VA residential/business = 25 mph (not 30)': { wrongValues: ['30 mph', '30mph'], correctValue: '25 mph', correctFact: 'The speed limit in Virginia residential, business, and school areas is 25 mph unless otherwise posted.' },
  'WRONG: VA residential/business = 25 mph (not 35)': { wrongValues: ['35 mph', '35mph'], correctValue: '25 mph', correctFact: 'The speed limit in Virginia residential, business, and school areas is 25 mph unless otherwise posted.' },

  // ── Speed limits: school zones ─────────────────────────────────────────
  'WRONG: AZ school crosswalk = 15 mph (not 20)': { wrongValues: ['20 mph', '20mph'], correctValue: '15 mph', correctFact: 'The speed limit when passing a school crosswalk in Arizona is 15 mph.' },
  'WRONG: AZ school crosswalk = 15 mph (not 25)': { wrongValues: ['25 mph', '25mph'], correctValue: '15 mph', correctFact: 'The speed limit when passing a school crosswalk in Arizona is 15 mph.' },
  'WRONG: MS school zone = 15 mph (not 20)':      { wrongValues: ['20 mph', '20mph'], correctValue: '15 mph', correctFact: 'The speed limit in Mississippi school zones is 15 mph.' },
  'WRONG: MS school zone = 15 mph (not 25)':      { wrongValues: ['25 mph', '25mph'], correctValue: '15 mph', correctFact: 'The speed limit in Mississippi school zones is 15 mph.' },
  'WRONG: NJ school zone = 25 mph (not 15)':      { wrongValues: ['15 mph', '15mph'], correctValue: '25 mph', correctFact: 'The speed limit in New Jersey school zones is 25 mph.' },
  'WRONG: NJ school zone = 25 mph (not 20)':      { wrongValues: ['20 mph', '20mph'], correctValue: '25 mph', correctFact: 'The speed limit in New Jersey school zones is 25 mph.' },
  'WRONG: OR school zone = 20 mph (not 25)':      { wrongValues: ['25 mph', '25mph'], correctValue: '20 mph', correctFact: 'The speed limit in Oregon school zones is 20 mph.' },
  'WRONG: WA school zone = 20 mph (not 15)':      { wrongValues: ['15 mph', '15mph'], correctValue: '20 mph', correctFact: 'The speed limit in Washington school zones is 20 mph.' },
  'WRONG: WA school zone = 20 mph (not 25)':      { wrongValues: ['25 mph', '25mph'], correctValue: '20 mph', correctFact: 'The speed limit in Washington school zones is 20 mph.' },
  'WRONG: WI school zone = 15 mph (not 20)':      { wrongValues: ['20 mph', '20mph'], correctValue: '15 mph', correctFact: 'The speed limit in Wisconsin school zones is 15 mph.' },
  'WRONG: WI school zone = 15 mph (not 25)':      { wrongValues: ['25 mph', '25mph'], correctValue: '15 mph', correctFact: 'The speed limit in Wisconsin school zones is 15 mph.' },

  // ── Following distance ─────────────────────────────────────────────────
  'WRONG: CO following = 3-second rule (not 2)': { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Colorado recommends a minimum 3-second following distance in normal conditions.' },
  'WRONG: CT following = 3-second rule (not 2)': { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Connecticut recommends a minimum 3-second following distance in normal conditions.' },
  'WRONG: MN following = 3-second rule (not 2)': { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Minnesota recommends a minimum 3-second following distance in normal conditions.' },
  'WRONG: MO following = 3-second rule (not 2)': { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Missouri recommends a minimum 3-second following distance in normal conditions.' },
  'WRONG: NV following = 3-second min (not 2)':  { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Nevada requires a minimum 3-second following distance (4 seconds recommended) in normal conditions.' },
  'WRONG: OK following = 3-second rule (not 2)': { wrongValues: ['2-second', '2 second', 'two-second', 'two second'], correctValue: '3-second', correctFact: 'Oklahoma recommends a minimum 3-second following distance in normal conditions.' },
  'WRONG: WI following = 4-second rule':         { wrongValues: ['2-second', '2 second', 'two-second', 'two second', '3-second', '3 second', 'three-second', 'three second'], correctValue: '4-second', correctFact: 'Wisconsin recommends a minimum 4-second following distance in normal conditions.' },

  // ── Oregon business district speed ─────────────────────────────────────
  'WRONG: OR business district = 20 mph (not 25)': { wrongValues: ['25 mph', '25mph'], correctValue: '20 mph', correctFact: 'The speed limit in Oregon business districts is 20 mph unless otherwise posted.' },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function findChoiceToFix(choices, wrongValues, correctValue) {
  // Find the choice whose text contains one of the wrong values
  // but does NOT already have the correct value
  for (const choice of choices) {
    const lower = choice.text.toLowerCase();
    const alreadyCorrect = lower.includes(correctValue.toLowerCase());
    if (alreadyCorrect) continue;
    for (const wrong of wrongValues) {
      if (lower.includes(wrong.toLowerCase())) {
        return { choice, matchedWrong: wrong };
      }
    }
  }
  return null;
}

function replaceFirst(str, find, replace) {
  const idx = str.toLowerCase().indexOf(find.toLowerCase());
  if (idx === -1) return null;
  return str.slice(0, idx) + replace + str.slice(idx + find.length);
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔧 FACTUAL ERROR FIX SCRIPT');
  console.log(`   Mode: ${DRY_RUN ? 'DRY-RUN (no DB changes)' : 'LIVE (writing to DB)'}\n`);

  const report = JSON.parse(fs.readFileSync('scripts/qa-report.json', 'utf8'));
  const fixLog = [];
  let totalFixed = 0;
  let totalSkipped = 0;
  let totalNoMatch = 0;

  for (const stateReport of report) {
    const { state, factualErrors } = stateReport;
    const wrongErrors = factualErrors.filter(e => e.severity === 'WRONG');
    if (wrongErrors.length === 0) continue;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`  ${state} — ${wrongErrors.length} WRONG errors`);
    console.log('─'.repeat(60));

    // Deduplicate by question ID — one question may have multiple errors
    // Process all errors for a question together
    const byQuestion = {};
    for (const err of wrongErrors) {
      if (!byQuestion[err.id]) byQuestion[err.id] = [];
      byQuestion[err.id].push(err);
    }

    for (const [questionId, errors] of Object.entries(byQuestion)) {
      // Fetch question + choices fresh each time (in case previous fix changed something)
      const question = await p.question.findUnique({
        where: { id: questionId },
        include: { choices: true },
      });

      if (!question) {
        console.log(`  ❌ Question ${questionId} not found in DB`);
        continue;
      }

      const questionLog = {
        questionId,
        state,
        questionText: question.text.substring(0, 100),
        fixes: [],
        skipped: [],
      };

      for (const err of errors) {
        const correction = CORRECTIONS[err.issue];
        if (!correction) {
          console.log(`  ⚠ No correction rule for: "${err.issue}"`);
          questionLog.skipped.push({ issue: err.issue, reason: 'No correction rule defined' });
          totalSkipped++;
          continue;
        }

        const { wrongValues, correctValue, correctFact } = correction;
        const result = findChoiceToFix(question.choices, wrongValues, correctValue);

        if (!result) {
          // The wrong value might not be in an answer choice — could be in question text
          // Try to find in question text instead
          const qLower = question.text.toLowerCase();
          const foundInQuestion = wrongValues.some(w => qLower.includes(w.toLowerCase()));
          if (foundInQuestion) {
            console.log(`  ℹ  [${state}] Wrong value in question text (not choices) — needs manual fix`);
            questionLog.skipped.push({ issue: err.issue, reason: 'Wrong value found in question text, not choices — manual fix needed' });
            totalSkipped++;
          } else {
            console.log(`  ℹ  [${state}] No matching wrong value found in choices or question text — may already be fixed`);
            questionLog.skipped.push({ issue: err.issue, reason: 'Wrong value not found in choices or question text — possibly already correct' });
            totalNoMatch++;
          }
          continue;
        }

        const { choice, matchedWrong } = result;
        const newChoiceText = replaceFirst(choice.text, matchedWrong, correctValue);

        if (!newChoiceText) {
          questionLog.skipped.push({ issue: err.issue, reason: 'replaceFirst returned null' });
          totalSkipped++;
          continue;
        }

        console.log(`  ✏  [${state}] ${question.text.substring(0, 60)}`);
        console.log(`     Choice: "${choice.text.substring(0, 60)}"`);
        console.log(`     → Fix:  "${newChoiceText.substring(0, 60)}"`);

        if (!DRY_RUN) {
          await p.choice.update({
            where: { id: choice.id },
            data: { text: newChoiceText },
          });
          // Update explanation to reflect correct fact
          await p.question.update({
            where: { id: questionId },
            data: { explanation: question.explanation
              ? question.explanation + ` [VERIFIED: ${correctFact}]`
              : correctFact
            },
          });
        }

        questionLog.fixes.push({
          choiceId: choice.id,
          issue: err.issue,
          oldText: choice.text,
          newText: newChoiceText,
          correctFact,
        });
        totalFixed++;
      }

      fixLog.push(questionLog);
    }
  }

  // Write fix log
  const logPath = 'scripts/fix-log.json';
  fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Fixes applied:  ${totalFixed}${DRY_RUN ? ' (dry-run, not written)' : ''}`);
  console.log(`  Skipped:        ${totalSkipped} (no rule or in question text)`);
  console.log(`  Already ok:     ${totalNoMatch} (wrong value not found)`);
  console.log(`\n📄 Fix log written to ${logPath}`);
  if (DRY_RUN) console.log('\n⚠️  This was a dry-run. Run without --dry-run to apply fixes.');
  else console.log('\n✅ Done. Review scripts/fix-log.json to verify all changes.');
}

main().catch(console.error).finally(() => p.$disconnect());
