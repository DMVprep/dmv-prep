const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const NY_STATE_ID = 'cmmpntr72000v3jd6patr1zka';

// Key facts from the official NY DMV Driver's Manual (MV-21, 9/25)
const NY_FACTS = {
  // Chapter 1 - Licenses
  new_resident_days: 30,           // must get NY license within 30 days
  address_change_days: 10,         // must notify DMV within 10 days (NY is 10, not 30!)
  junior_permit_min_age: 16,       // Class DJ minimum age
  senior_license_min_age: 18,      // Class D minimum age (or 17 with driver ed)
  learner_permit_min_hours: 50,    // 50 hours supervised practice
  learner_permit_night_hours: 15,  // 15 of those hours must be at night
  knowledge_test_questions: 20,    // 20 questions on written test
  knowledge_test_pass: 14,         // must answer at least 14 of 20 correctly
  road_signs_required: 2,          // must correctly answer 2 of 4 road sign questions
  junior_permit_hold_months: 6,    // must hold permit minimum 6 months before road test

  // Chapter 2 - Point system
  speeding_11_20_over: 4,          // 11-20 mph over = 4 points
  speeding_21_30_over: 6,          // 21-30 mph over = 6 points
  speeding_31_40_over: 8,          // 31-40 mph over = 8 points
  speeding_over_40: 11,            // over 40 mph over = 11 points
  reckless_driving_points: 5,
  cell_phone_points: 5,
  passing_school_bus_points: 5,
  following_too_closely_points: 4,
  signal_stop_yield_violation: 3,
  points_suspension_threshold: 11, // 11+ points in 18 months = suspension
  point_reduction_max: 4,          // PIRP course can reduce up to 4 points
  point_reduction_frequency: 18,   // every 18 months
  probation_period_months: 6,      // 6 months probation after passing road test (age 18+)

  // Chapter 2 - Driving while suspended
  dwls_fine_min: 200,             // mandatory fine $200-$5000
  dwls_fine_max: 5000,

  // Chapter 3 - Insurance minimums
  insurance_death_one: 50000,      // $50,000 death of one person
  insurance_death_two: 100000,     // $100,000 death of two or more
  insurance_injury_one: 25000,     // $25,000 injury one person
  insurance_injury_two: 50000,     // $50,000 injury two or more
  insurance_property: 10000,       // $10,000 property damage

  // Chapter 4 - Traffic control
  signal_turn_distance_ft: 100,    // must signal 100 feet before turn

  // Chapter 5 - ROW / turns
  // U-turn: must be from left portion nearest centerline
  // Cannot make U-turn within 500 feet visibility

  // Chapter 6 - Passing
  pass_prohibited_railroad_ft: 100,  // within 100 feet of railroad crossing
  pass_prohibited_bridge_ft: 100,    // within 100 feet of bridge/tunnel on two-way road
  return_lane_oncoming_ft: 200,      // must return before oncoming within 200 feet

  // Chapter 7 - Parking
  park_curb_max_ft: 1,             // wheels no more than 1 foot (12 inches) from curb
  park_hydrant_ft: 15,             // within 15 feet of fire hydrant
  park_crosswalk_ft: 20,           // within 20 feet of crosswalk at intersection
  park_stop_sign_ft: 30,           // within 30 feet of stop sign
  park_traffic_light_ft: 30,       // within 30 feet of traffic light
  park_fire_station_same_side: 20, // within 20 feet of fire station driveway
  park_fire_station_opp_side: 75,  // within 75 feet on opposite side of fire station
  park_railroad_ft: 50,            // within 50 feet of railroad crossing
  park_pedestrian_safety_area: 30, // within 30 feet of pedestrian safety area

  // Chapter 8 - Safe driving
  nyc_speed_limit: 25,             // NYC default speed limit is 25 mph (not 30!)
  default_speed_limit: 55,         // default speed limit if no sign posted (outside NYC)
  following_distance_seconds: 2,   // 2-second rule
  high_beam_oncoming_ft: 500,      // dim to low beam within 500 feet of oncoming
  high_beam_following_ft: 200,     // dim to low beam within 200 feet of vehicle ahead
  headlights_required_visibility: 1000, // required when visibility less than 1000 feet
  school_bus_stop_distance_ft: 20, // stop at least 20 feet from stopped school bus

  // Chapter 9 - Alcohol
  bac_impaired: 0.05,              // BAC over .05 = evidence of impairment
  bac_intoxicated: 0.08,           // BAC .08 or higher = intoxicated
  bac_aggravated: 0.18,            // BAC .18 or higher = aggravated DWI
  zero_tolerance_min: 0.02,        // zero tolerance: .02 to .07 BAC under 21
  zero_tolerance_suspension: 6,    // 6-month suspension for zero tolerance violation
  dwai_suspension: 90,             // DWAI = 90-day suspension
  dwi_revocation_min_months: 6,    // DWI first offense = minimum 6-month revocation
  agg_dwi_revocation_min_months: 12, // Agg-DWI first = minimum 1-year revocation
  leandras_law_age: 16,            // child under 16 in vehicle = felony
  cell_phone_fine_first: 200,      // first offense cell phone fine up to $200
  texting_fine_first: 200,         // first offense texting fine up to $200
  texting_fine_second: 250,        // second offense texting fine up to $250
  texting_fine_third: 450,         // third offense texting fine up to $450

  // Chapter 10 - Railroad crossings
  railroad_stop_min_ft: 15,        // must stop at least 15 feet from tracks

  // Chapter 6 - School buses
  school_bus_fine_first_min: 250,  // first violation passing school bus: min $250
  school_bus_fine_max: 1000,       // maximum $1,000 for three violations in 3 years
};

async function main() {
  console.log('NY QA SCAN\n' + '='.repeat(60));

  const questions = await p.question.findMany({
    where: { stateId: NY_STATE_ID },
    select: {
      id: true,
      text: true,
      explanation: true,
      choices: { select: { id: true, text: true, isCorrect: true } },
    },
  });

  console.log(`Total NY questions: ${questions.length}\n`);

  const errors = [];
  const suspects = [];

  // Key patterns to check for known NY-specific facts
  const checks = [
    // Address change: NY requires 10 days, not 30
    {
      pattern: /change.*address|address.*change|new address|move.*notif|notif.*move/i,
      correct_answer_pattern: /10 days/i,
      wrong_answer_pattern: /30 days|60 days|90 days/i,
      fact: 'NY address change must be reported within 10 DAYS (not 30)',
      severity: 'ERROR',
    },
    // NYC speed limit: 25 mph (not 30)
    {
      pattern: /new york city|NYC|speed limit.*city|city.*speed limit|manhattan|brooklyn/i,
      correct_answer_pattern: /25 mph/i,
      wrong_answer_pattern: /30 mph|35 mph/i,
      fact: 'NYC default speed limit is 25 mph',
      severity: 'ERROR',
    },
    // Default speed (no sign): 55 mph outside NYC
    {
      pattern: /no.*posted.*speed|no speed.*sign|speed.*not.*posted|default.*speed/i,
      correct_answer_pattern: /55 mph/i,
      wrong_answer_pattern: /65 mph|70 mph|45 mph/i,
      fact: 'Default speed limit in NY (no sign posted) is 55 mph',
      severity: 'ERROR',
    },
    // Parking from curb: 1 foot (12 inches) in NY
    {
      pattern: /parallel park.*curb|curb.*parallel park|park.*near.*curb|feet.*curb|curb.*feet/i,
      correct_answer_pattern: /1 foot|12 inch/i,
      wrong_answer_pattern: /18 inch|2 feet|6 inch/i,
      fact: 'NY parallel parking: wheels no more than 1 foot (12 inches) from curb',
      severity: 'ERROR',
    },
    // Insurance - death one person: $50,000
    {
      pattern: /minimum.*insurance|insurance.*minimum|liability.*insurance|required.*insurance/i,
      correct_answer_pattern: /\$50,000|\$50000|50,000/i,
      wrong_answer_pattern: /\$25,000.*death|\$30,000.*death|\$15,000.*death/i,
      fact: 'NY minimum insurance: $50,000 death one person',
      severity: 'ERROR',
    },
    // Knowledge test: 20 questions, need 14 correct
    {
      pattern: /written test|knowledge test|permit test.*question|how many question/i,
      correct_answer_pattern: /20 question|14.*correct|14 of 20/i,
      wrong_answer_pattern: /50 question|36 question|40 question|25 question/i,
      fact: 'NY knowledge test: 20 questions, must answer 14 correctly',
      severity: 'ERROR',
    },
    // High beam oncoming: 500 feet
    {
      pattern: /high beam.*oncoming|oncoming.*high beam|dim.*oncoming|oncoming.*dim/i,
      correct_answer_pattern: /500 feet/i,
      wrong_answer_pattern: /300 feet|200 feet|400 feet|1,000 feet/i,
      fact: 'NY: dim high beams within 500 feet of oncoming vehicle',
      severity: 'ERROR',
    },
    // High beam following: 200 feet
    {
      pattern: /high beam.*follow|follow.*high beam|dim.*follow|follow.*dim.*light/i,
      correct_answer_pattern: /200 feet/i,
      wrong_answer_pattern: /300 feet|500 feet|400 feet/i,
      fact: 'NY: dim high beams within 200 feet of vehicle ahead',
      severity: 'ERROR',
    },
    // Zero tolerance: .02 BAC under 21
    {
      pattern: /zero tolerance|under 21.*bac|bac.*under 21/i,
      correct_answer_pattern: /\.02|0\.02/i,
      wrong_answer_pattern: /\.01|0\.01|\.05|0\.05/i,
      fact: 'NY zero tolerance: .02 BAC triggers violation for under-21 drivers',
      severity: 'ERROR',
    },
    // BAC intoxicated: .08
    {
      pattern: /intoxicated.*bac|bac.*intoxicated|legal limit.*bac|drunk driving.*bac/i,
      correct_answer_pattern: /\.08|0\.08/i,
      wrong_answer_pattern: /\.05|0\.05|\.10|0\.10/i,
      fact: 'NY DWI BAC limit: .08 or higher = intoxicated',
      severity: 'ERROR',
    },
    // Aggravated DWI: .18
    {
      pattern: /aggravated.*dwi|agg.*dwi|aggravated.*intox/i,
      correct_answer_pattern: /\.18|0\.18/i,
      wrong_answer_pattern: /\.15|0\.15|\.16|0\.16/i,
      fact: 'NY Aggravated DWI threshold is .18 BAC (not .15)',
      severity: 'ERROR',
    },
    // Leandra's Law: child under 16
    {
      pattern: /leandra|child.*vehicle.*dwi|dwi.*child|passenger.*under/i,
      correct_answer_pattern: /under 16|age 16/i,
      wrong_answer_pattern: /under 15|under 18|under 14/i,
      fact: "NY Leandra's Law: DWI with child under 16 in vehicle = felony",
      severity: 'ERROR',
    },
    // Park from railroad: 50 feet
    {
      pattern: /park.*railroad|railroad.*park/i,
      correct_answer_pattern: /50 feet/i,
      wrong_answer_pattern: /15 feet|25 feet|100 feet/i,
      fact: 'NY: cannot park within 50 feet of railroad crossing',
      severity: 'ERROR',
    },
    // Signal before turn: 100 feet
    {
      pattern: /signal.*turn|turn.*signal.*before|signal.*before.*turn|how far.*signal/i,
      correct_answer_pattern: /100 feet/i,
      wrong_answer_pattern: /50 feet|200 feet|300 feet/i,
      fact: 'NY: must signal at least 100 feet before turning',
      severity: 'ERROR',
    },
    // Following distance: 2-second rule
    {
      pattern: /following distance|space cushion|two.second|2.second/i,
      correct_answer_pattern: /2.second|two.second/i,
      wrong_answer_pattern: /4.second|four.second|3.second/i,
      fact: 'NY following distance: 2-second rule (not 4-second like FL)',
      severity: 'ERROR',
    },
    // Points suspension: 11 points in 18 months
    {
      pattern: /point.*suspend|suspend.*point|how many point|accumulate.*point/i,
      correct_answer_pattern: /11 point|18 month/i,
      wrong_answer_pattern: /12 point|8 point|6 point/i,
      fact: 'NY: 11 or more points in 18 months = license suspension',
      severity: 'ERROR',
    },
    // DWAI suspension: 90 days
    {
      pattern: /DWAI.*suspend|driving while.*impaired.*suspend|ability impaired.*suspend/i,
      correct_answer_pattern: /90.day/i,
      wrong_answer_pattern: /30.day|60.day|6.month/i,
      fact: 'NY DWAI (alcohol): 90-day suspension',
      severity: 'ERROR',
    },
  ];

  for (const q of questions) {
    const correctChoice = q.choices.find(c => c.isCorrect);
    if (!correctChoice) continue;

    for (const check of checks) {
      if (check.pattern.test(q.text) || (q.explanation && check.pattern.test(q.explanation))) {
        // Check if the correct answer is wrong
        if (check.wrong_answer_pattern && check.wrong_answer_pattern.test(correctChoice.text)) {
          errors.push({
            id: q.id,
            severity: check.severity,
            fact: check.fact,
            question: q.text.substring(0, 100),
            correct_answer: correctChoice.text,
            correct_answer_id: correctChoice.id,
          });
        }
      }
    }
  }

  // Duplicate detection
  const seen = new Map();
  const duplicates = [];
  for (const q of questions) {
    const normalized = q.text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen.has(normalized)) {
      duplicates.push({ id: q.id, text: q.text.substring(0, 80), duplicate_of: seen.get(normalized) });
    } else {
      seen.set(normalized, q.id);
    }
  }

  // Concept coverage check
  const concepts = {
    'speed:nyc': /new york city|25 mph.*city|nyc.*speed/i,
    'speed:default': /no.*posted|default.*speed|55 mph/i,
    'speed:school-zone': /school zone.*speed|speed.*school zone/i,
    'speed:following': /following distance|2.second|two.second/i,
    'row:pedestrian': /pedestrian.*crosswalk|crosswalk.*pedestrian|yield.*pedestrian/i,
    'row:school-bus': /school bus.*stop|stop.*school bus/i,
    'row:emergency': /emergency vehicle|fire.truck|ambulance.*yield/i,
    'row:roundabout': /roundabout|traffic circle|rotary/i,
    'safe:parallel-park': /parallel park/i,
    'safe:park-hydrant': /fire hydrant.*park|park.*fire hydrant/i,
    'safe:park-crosswalk': /crosswalk.*park|park.*crosswalk/i,
    'safe:park-railroad': /railroad.*park|park.*railroad/i,
    'safe:passing': /how to pass|pass on the left|pass on the right/i,
    'safe:high-beam': /high beam|dim.*headlight|low beam.*oncoming/i,
    'safe:headlights-when': /when.*headlight|headlight.*when|windshield wiper.*headlight/i,
    'safe:skid': /skid|lose.*traction|rear wheels.*slide/i,
    'safe:signal-turn': /signal.*100 feet|100 feet.*turn|signal.*before turn/i,
    'safe:seatbelt': /seat belt|seatbelt|safety belt/i,
    'safe:cell-phone': /cell phone|mobile.*phone|handheld/i,
    'safe:texting': /texting|text.*drive|electronic device.*drive/i,
    'alcohol:bac': /\.08|blood alcohol|BAC/i,
    'alcohol:dwi': /driving while intoxicated|DWI/i,
    'alcohol:dwai': /driving while.*impaired|DWAI/i,
    'alcohol:agg-dwi': /aggravated.*DWI|Agg.DWI|\.18/i,
    'alcohol:zero-tolerance': /zero tolerance|under 21.*bac|\.02/i,
    'alcohol:leandras-law': /leandra|child.*vehicle.*dwi/i,
    'alcohol:chemical-test': /chemical test|breathalyzer|implied consent/i,
    'license:learner-permit': /learner permit|learning permit|permit.*age/i,
    'license:junior-license': /junior.*licen|class DJ|class MJ/i,
    'license:gdl-restrictions': /junior.*restrict|passenger.*junior|curfew.*junior/i,
    'license:new-resident': /new resident|out.of.state.*licen|30 days.*licen/i,
    'license:address-change': /change.*address|address.*change|10 days/i,
    'license:insurance': /minimum.*insurance|\$50,000|\$25,000.*injury/i,
    'license:points': /point system|11 point|18 month.*point/i,
    'license:dwls': /suspended.*driv|driv.*suspended|revoked.*licen/i,
    'license:knowledge-test': /knowledge test|20 question|14.*correct/i,
    'signs:warning': /yellow.*diamond|warning sign.*shape|diamond.*warning/i,
    'signs:stop': /stop sign.*shape|octagon|stop.*red/i,
    'signs:yield': /yield.*shape|yield.*triangle|triangular.*yield/i,
    'signs:railroad': /railroad.*sign.*round|round.*railroad/i,
    'signs:work-zone': /orange.*sign|work zone.*color|construction.*color/i,
    'signs:green-arrow': /green arrow|arrow.*green/i,
    'signs:flashing-red': /flashing red|flash.*red.*light/i,
    'signs:flashing-yellow': /flashing yellow|flash.*yellow/i,
  };

  const coverage = {};
  for (const [concept, pattern] of Object.entries(concepts)) {
    const count = questions.filter(q =>
      pattern.test(q.text) || (q.explanation && pattern.test(q.explanation))
    ).length;
    coverage[concept] = count;
  }

  // Report
  console.log('FACTUAL ERRORS FOUND: ' + errors.length);
  if (errors.length > 0) {
    errors.forEach((e, i) => {
      console.log(`\n[${i + 1}] ${e.severity}: ${e.fact}`);
      console.log(`  Q: ${e.question}`);
      console.log(`  Wrong answer: "${e.correct_answer}"`);
      console.log(`  Choice ID: ${e.correct_answer_id}`);
      console.log(`  Question ID: ${e.id}`);
    });
  }

  console.log('\n\nDUPLICATES FOUND: ' + duplicates.length);
  if (duplicates.length > 0) {
    duplicates.slice(0, 20).forEach((d, i) => {
      console.log(`[${i + 1}] ID: ${d.id}`);
      console.log(`  Text: ${d.text}`);
    });
  }

  console.log('\n\nCONCEPT COVERAGE:');
  const gaps = [];
  const overtested = [];
  for (const [concept, count] of Object.entries(coverage)) {
    const status = count === 0 ? '❌ GAP' : count > 6 ? '⚠️  OVER' : '✅';
    if (count === 0) gaps.push(concept);
    if (count > 6) overtested.push({ concept, count });
    console.log(`  ${status.padEnd(8)} ${concept.padEnd(30)} ${count} questions`);
  }

  console.log('\n\nSUMMARY:');
  console.log(`  Total questions: ${questions.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Duplicates: ${duplicates.length}`);
  console.log(`  Gaps (0 questions): ${gaps.length} — ${gaps.join(', ')}`);
  console.log(`  Over-tested (>6): ${overtested.length} — ${overtested.map(o => o.concept + '(' + o.count + ')').join(', ')}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
