const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const PA_STATE_ID = 'cmmpntsfr00113jd6ayb2qei8';

// Key facts from the official PA Driver's Manual (PUB 95, 4-21)
// These are PA-specific values that commonly differ from other states
const PA_FACTS = {
  // Chapter 1 - Licenses
  learner_permit_min_age: 16,
  junior_license_min_age: 16,
  new_resident_days: 60,            // must get PA license within 60 DAYS (not 30!)
  address_change_days: 15,          // must notify PennDOT within 15 DAYS (not 30!)
  supervised_hours_under18: 65,     // 65 hours (not 50!) before road test
  supervised_night_hours: 10,       // 10 hours at night
  supervised_bad_weather: 5,        // 5 hours bad weather
  permit_hold_months: 6,            // must hold permit 6 months before road test
  knowledge_test_questions: 18,     // 18 questions (not 20!)
  knowledge_test_pass: 15,          // must answer 15 of 18 correctly
  road_test_fail_wait_days: 7,      // under 18 must wait 7 days after failing road test
  road_test_attempts: 3,            // 3 chances per permit before must reapply

  // Chapter 1 - Junior license restrictions
  junior_curfew_start: '11 PM',     // 11 PM to 5 AM curfew
  junior_curfew_end: '5 AM',
  junior_passenger_first6: 1,       // max 1 non-family passenger under 18 in first 6 months
  junior_passenger_after6: 3,       // max 3 non-family passengers after first 6 months
  junior_points_suspension: 6,      // suspended if 6+ points or 26+ mph over limit
  junior_suspension_days: 90,       // 90-day suspension

  // Chapter 3 - Following distance
  following_distance_seconds: 4,    // PA uses 4-SECOND RULE (not 2-second!)
  motorcycle_following_seconds: 4,  // same 4 seconds behind motorcycles

  // Chapter 3 - Speed limits
  max_speed_limit: 70,              // PA maximum speed limit is 70 mph
  school_zone_speed: 15,            // 15 mph when school zone lights flashing

  // Chapter 3 - Signaling
  signal_under_35mph_ft: 100,       // signal 100 feet before turn under 35 mph
  signal_over_35mph_ft: 300,        // signal 300 feet before turn at 35+ mph

  // Chapter 3 - Parking
  park_curb_max_inches: 12,         // 12 inches from curb (same as NY)
  park_hydrant_ft: 15,              // 15 feet from fire hydrant
  park_crosswalk_ft: 20,            // 20 feet from crosswalk
  park_stop_sign_ft: 30,            // 30 feet from stop sign/signal
  park_railroad_ft: 50,             // 50 feet from railroad crossing
  park_fire_station_ft: 20,         // 20 feet from fire station driveway

  // Chapter 3 - Headlights
  headlight_oncoming_ft: 500,       // dim within 500 feet of oncoming vehicle
  headlight_following_ft: 300,      // dim within 300 feet of vehicle ahead
  headlight_visibility_ft: 1000,    // required when can't see 1000 feet ahead
  headlight_low_beam_max_speed: 45, // don't overdrive headlights — max 45 mph at night

  // Chapter 3 - School bus
  school_bus_stop_ft: 10,           // stop at least 10 feet from school bus

  // Chapter 3 - Passing
  pass_prohibited_intersection_ft: 100,  // within 100 feet of intersection
  pass_prohibited_railroad_ft: 100,      // within 100 feet of railroad crossing
  pass_prohibited_bridge_ft: 100,        // within 100 feet of bridge/tunnel
  bike_passing_clearance_ft: 4,          // 4 feet clearance when passing bicycle

  // Chapter 3 - Emergency vehicles
  emergency_vehicle_follow_ft: 500,      // stay at least 500 feet behind emergency vehicle

  // Chapter 4 - DUI
  bac_adult: 0.08,                  // standard DUI BAC
  bac_under21: 0.02,                // zero tolerance under 21
  bac_cdl: 0.04,                    // CDL drivers
  bac_highest_rate: 0.16,           // highest rate table threshold (not 0.18 like NY!)
  dui_chemical_refusal_suspension: 12,   // 12-month suspension for chemical test refusal
  dui_first_general_fine: 300,      // first offense general impairment fine
  dui_first_high_fine_min: 500,     // first offense high rate minimum fine

  // Chapter 4 - Points
  point_threshold_action: 6,        // PennDOT acts at 6+ points (first time = written exam)
  point_removal_rate: 3,            // 3 points removed per 12 consecutive clean months

  // Chapter 5 - Laws
  texting_fine: 50,                 // $50 fine for texting while driving
  insurance_lapse_days: 31,         // 31+ days without insurance = registration suspended
  insurance_suspension_months: 3,   // 3-month registration AND driving privilege suspension
};

async function main() {
  console.log('PA QA SCAN\n' + '='.repeat(60));

  const questions = await p.question.findMany({
    where: { stateId: PA_STATE_ID },
    select: {
      id: true,
      text: true,
      explanation: true,
      choices: { select: { id: true, text: true, isCorrect: true } },
    },
  });

  console.log(`Total PA questions: ${questions.length}\n`);

  const errors = [];
  const suspects = [];

  const checks = [
    // New resident: PA is 60 days (not 30!)
    {
      pattern: /new.*resident.*license|license.*new.*resident|moving.*Pennsylvania.*license|establish.*residency.*Pennsylvania/i,
      wrong_answer_pattern: /30 days|90 days|10 days/i,
      correct_answer_pattern: /60 days/i,
      fact: 'PA new residents must get PA license within 60 DAYS (not 30)',
      severity: 'ERROR',
    },
    // Address change: PA is 15 days (not 30!)
    {
      pattern: /change.*address|address.*change|new address|move.*notify|notify.*move/i,
      wrong_answer_pattern: /30 days|10 days|60 days/i,
      correct_answer_pattern: /15 days/i,
      fact: 'PA address change must be reported within 15 DAYS (not 30)',
      severity: 'ERROR',
    },
    // Following distance: PA uses 4-second rule
    {
      pattern: /following distance|space cushion|how far behind|safe.*follow/i,
      wrong_answer_pattern: /2.second|two.second|3.second|three.second/i,
      correct_answer_pattern: /4.second|four.second/i,
      fact: 'PA following distance is the 4-SECOND RULE (not 2 or 3 second)',
      severity: 'ERROR',
    },
    // Supervised hours: PA requires 65 hours (not 50!)
    {
      pattern: /supervised.*driving.*hours|hours.*supervised.*driving|behind.*wheel.*hours|practice.*hours.*permit/i,
      wrong_answer_pattern: /50 hours|40 hours|30 hours/i,
      correct_answer_pattern: /65 hours/i,
      fact: 'PA requires 65 hours supervised driving (not 50)',
      severity: 'ERROR',
    },
    // Knowledge test: PA is 18 questions (not 20!)
    {
      pattern: /knowledge test.*question|written test.*question|how many.*question.*test|test.*question.*permit/i,
      wrong_answer_pattern: /20 questions|25 questions|36 questions/i,
      correct_answer_pattern: /18 questions/i,
      fact: 'PA knowledge test has 18 questions (not 20)',
      severity: 'ERROR',
    },
    // Knowledge test pass: must answer 15 of 18
    {
      pattern: /pass.*knowledge test|knowledge test.*pass|correctly.*pass|correct.*permit test/i,
      wrong_answer_pattern: /14.*correct|16.*correct|14 of 20/i,
      correct_answer_pattern: /15.*correct|15 of 18/i,
      fact: 'PA knowledge test: must answer 15 of 18 correctly (not 14)',
      severity: 'ERROR',
    },
    // School zone speed: 15 mph
    {
      pattern: /school zone.*speed|speed.*school zone/i,
      wrong_answer_pattern: /20 mph|25 mph/i,
      correct_answer_pattern: /15 mph/i,
      fact: 'PA school zone speed limit is 15 mph (not 20 or 25)',
      severity: 'ERROR',
    },
    // Max speed limit: 70 mph
    {
      pattern: /maximum.*speed.*Pennsylvania|PA.*maximum.*speed|highest.*speed.*limit.*PA/i,
      wrong_answer_pattern: /65 mph|55 mph/i,
      correct_answer_pattern: /70 mph/i,
      fact: 'PA maximum speed limit is 70 mph',
      severity: 'ERROR',
    },
    // School bus stop distance: 10 feet (not 20!)
    {
      pattern: /stop.*school bus.*feet|school bus.*stop.*feet|how far.*school bus/i,
      wrong_answer_pattern: /20 feet|25 feet|15 feet/i,
      correct_answer_pattern: /10 feet/i,
      fact: 'PA: stop at least 10 feet from school bus (not 20)',
      severity: 'ERROR',
    },
    // Junior license curfew: 11 PM (not 9 PM or midnight!)
    {
      pattern: /junior.*curfew|curfew.*junior|junior.*drive.*night|night.*junior.*drive/i,
      wrong_answer_pattern: /9 pm|9:00 pm|midnight|10 pm/i,
      correct_answer_pattern: /11 pm|11:00 pm/i,
      fact: 'PA junior license curfew starts at 11 PM (not 9 PM)',
      severity: 'ERROR',
    },
    // DUI BAC highest rate: 0.16 (not 0.18 like NY!)
    {
      pattern: /highest.*rate.*DUI|DUI.*highest.*rate|aggravated.*DUI|highest.*BAC.*table/i,
      wrong_answer_pattern: /\.18|0\.18/i,
      correct_answer_pattern: /\.16|0\.16/i,
      fact: 'PA highest rate DUI threshold is .16 BAC (not .18 like NY)',
      severity: 'ERROR',
    },
    // Under 21 BAC: .02
    {
      pattern: /under 21.*BAC|BAC.*under 21|zero tolerance.*BAC|minor.*DUI.*BAC/i,
      wrong_answer_pattern: /\.01|0\.01|\.05|0\.05/i,
      correct_answer_pattern: /\.02|0\.02/i,
      fact: 'PA under-21 DUI threshold is .02 BAC',
      severity: 'ERROR',
    },
    // Signal distance: 100 ft under 35 mph, 300 ft at 35+ mph
    {
      pattern: /signal.*before.*turn|turn.*signal.*feet|how far.*signal.*turn/i,
      wrong_answer_pattern: /200 feet.*all|50 feet|always 100 feet/i,
      correct_answer_pattern: /100 feet.*less than 35|300 feet.*35|100.*300/i,
      fact: 'PA: signal 100 ft if under 35 mph, 300 ft if 35+ mph',
      severity: 'SUSPECT',
    },
    // Emergency vehicle following: 500 feet
    {
      pattern: /follow.*emergency vehicle|emergency vehicle.*follow|behind.*emergency/i,
      wrong_answer_pattern: /200 feet|300 feet|100 feet/i,
      correct_answer_pattern: /500 feet/i,
      fact: 'PA: stay at least 500 feet behind emergency vehicle',
      severity: 'ERROR',
    },
    // Points system: PennDOT acts at 6 points
    {
      pattern: /point.*action|corrective.*action.*point|PennDOT.*six.*point|6.*point.*written/i,
      wrong_answer_pattern: /11 point|12 point|8 point/i,
      correct_answer_pattern: /6 point|six point/i,
      fact: 'PA: PennDOT takes action at 6 points (not 11 like NY)',
      severity: 'ERROR',
    },
    // Texting fine: $50
    {
      pattern: /texting.*fine|fine.*texting|text.*while.*driving.*fine/i,
      wrong_answer_pattern: /\$200|\$100|\$150/i,
      correct_answer_pattern: /\$50/i,
      fact: 'PA texting fine is $50 (not $200 like NY)',
      severity: 'ERROR',
    },
    // Bike passing clearance: 4 feet
    {
      pattern: /pass.*bicycle.*feet|bicycle.*pass.*feet|clearance.*bicycle|bicycle.*clearance/i,
      wrong_answer_pattern: /3 feet|2 feet|6 feet/i,
      correct_answer_pattern: /4 feet/i,
      fact: 'PA: must allow 4 feet when passing a bicycle',
      severity: 'ERROR',
    },
  ];

  for (const q of questions) {
    const correctChoice = q.choices.find(c => c.isCorrect);
    if (!correctChoice) continue;

    for (const check of checks) {
      if (check.pattern.test(q.text) || (q.explanation && check.pattern.test(q.explanation))) {
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
      duplicates.push({ id: q.id, text: q.text.substring(0, 80) });
    } else {
      seen.set(normalized, q.id);
    }
  }

  // Concept coverage
  const concepts = {
    'speed:max': /maximum.*speed.*Pennsylvania|70 mph/i,
    'speed:school-zone': /school zone.*speed|speed.*school zone/i,
    'speed:following': /following distance|4.second|four.second/i,
    'speed:signal-distance': /100 feet.*turn|300 feet.*turn|signal.*35 mph/i,
    'row:pedestrian': /pedestrian.*crosswalk|yield.*pedestrian/i,
    'row:school-bus': /school bus.*stop|stop.*school bus/i,
    'row:emergency': /emergency vehicle|move over/i,
    'row:roundabout': /roundabout|traffic circle/i,
    'safe:parallel-park': /parallel park/i,
    'safe:park-hydrant': /fire hydrant.*park|park.*fire hydrant/i,
    'safe:park-crosswalk': /crosswalk.*park|park.*crosswalk/i,
    'safe:park-railroad': /railroad.*park|park.*railroad/i,
    'safe:passing': /passing.*left|pass.*two.lane|pass.*right/i,
    'safe:bike-passing': /pass.*bicycle|bicycle.*pass|4 feet.*bicycle/i,
    'safe:headlights': /high beam|low beam|500 feet.*oncoming|headlight.*when/i,
    'safe:seatbelt': /seat belt|seatbelt/i,
    'safe:texting': /texting|text.*drive|anti.text/i,
    'safe:skid': /skid|rear.*skid|steer.*skid/i,
    'safe:hydroplane': /hydroplan/i,
    'alcohol:bac': /\.08|blood alcohol|BAC/i,
    'alcohol:dui': /driving under the influence|DUI/i,
    'alcohol:under21': /under 21.*\.02|zero tolerance|\.02.*minor/i,
    'alcohol:highest-rate': /highest rate|\.16/i,
    'alcohol:chemical-test': /chemical test|implied consent/i,
    'license:learner-permit': /learner.*permit|permit.*age/i,
    'license:junior-license': /junior.*licen|junior driver/i,
    'license:supervised-hours': /65 hours|supervised.*hours|hours.*practice/i,
    'license:curfew': /11 pm|curfew.*junior|junior.*curfew/i,
    'license:new-resident': /new resident|60 days.*licen/i,
    'license:address-change': /change.*address|15 days.*PennDOT/i,
    'license:points': /point system|6.*point.*action/i,
    'license:dui-penalty': /DUI.*suspend|suspend.*DUI/i,
    'license:texting-fine': /texting.*\$50|\$50.*texting/i,
    'signs:warning': /yellow.*diamond|warning sign/i,
    'signs:railroad': /railroad.*round|round.*railroad/i,
    'signs:school': /pentagon.*school|school.*pentagon/i,
    'signs:work-zone': /orange.*sign|work zone.*color/i,
    'signs:green-arrow': /green arrow/i,
    'signs:flashing-yellow': /flashing yellow/i,
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
  errors.forEach((e, i) => {
    console.log(`\n[${i + 1}] ${e.severity}: ${e.fact}`);
    console.log(`  Q: ${e.question}`);
    console.log(`  Wrong answer: "${e.correct_answer}"`);
    console.log(`  Choice ID: ${e.correct_answer_id}`);
    console.log(`  Question ID: ${e.id}`);
  });

  console.log('\n\nDUPLICATES FOUND: ' + duplicates.length);
  duplicates.slice(0, 20).forEach((d, i) => {
    console.log(`[${i + 1}] ID: ${d.id} — ${d.text}`);
  });

  console.log('\n\nCONCEPT COVERAGE:');
  const gaps = [], overtested = [];
  for (const [concept, count] of Object.entries(coverage)) {
    const status = count === 0 ? '❌ GAP' : count > 8 ? '⚠️  OVER' : '✅ OK ';
    if (count === 0) gaps.push(concept);
    if (count > 8) overtested.push(concept + '(' + count + ')');
    console.log(`  ${status.padEnd(8)} ${concept.padEnd(35)} ${count}`);
  }

  console.log('\n\nSUMMARY:');
  console.log(`  Total: ${questions.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Duplicates: ${duplicates.length}`);
  console.log(`  Gaps: ${gaps.length} — ${gaps.join(', ')}`);
  console.log(`  Over-tested (>8): ${overtested.length} — ${overtested.join(', ')}`);

  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
