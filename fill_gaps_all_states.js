const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Topic IDs
const T = {
  signs: 'cmmpntv01001e3jd60a0j8onz',
  row: 'cmmpntvao001f3jd6afqngfl5',
  speed: 'cmmpntvhy001g3jd6fkjlrbmq',
  safe: 'cmmpntvnw001h3jd6zi1q1365',
  alcohol: 'cmn2ia2ei0000ua6cuap3rywt',
  license: 'cmn2ia2n20001ua6cq7y7tood',
};

// State IDs
const S = {
  tx: 'cmmpnttf800163jd6zc01uwlv',
  fl: 'cmmpntmvv00083jd6x3g9m5js',
  ca: 'cmmpntm4s00043jd6mtc4xwmi',
};

// Helper: build question with choices
function q(stateId, topicId, text, explanation, choices) {
  // choices: array of { text, isCorrect }
  return {
    stateId, topicId, text, explanation,
    choices: { create: choices },
  };
}

// ─── ALL GAP-FILLING QUESTIONS ────────────────────────────────────────────────

const questions = [

  // ════════════════════════════════════════════════════════════════
  // TEXAS GAPS
  // ════════════════════════════════════════════════════════════════

  // alcohol:sobering-myths (TX)
  q(S.tx, T.alcohol, 'Which method will NOT help sober up a person who has been drinking alcohol in Texas?',
    'Only time sobers a person up. It takes about one hour for the body to rid itself of each drink. Coffee, cold showers, and exercise do not speed up this process.',
    [
      { text: 'Drinking black coffee', isCorrect: false },
      { text: 'Taking a cold shower', isCorrect: false },
      { text: 'Waiting — only time sobers you up', isCorrect: true },
      { text: 'Exercising vigorously', isCorrect: false },
    ]),

  q(S.tx, T.alcohol, 'A friend has been drinking and wants to drive after drinking two cups of coffee. What should you tell them?',
    'Coffee does not reduce blood alcohol content. Only time allows the body to process alcohol. The person should not drive.',
    [
      { text: 'Coffee will help them sober up enough to drive safely', isCorrect: false },
      { text: 'They should wait — coffee does not reduce BAC', isCorrect: true },
      { text: 'Two cups of coffee is enough to counteract two drinks', isCorrect: false },
      { text: 'Exercise combined with coffee will sober them up', isCorrect: false },
    ]),

  q(S.tx, T.alcohol, 'How long does it take the average body to process one standard alcoholic drink in Texas?',
    'It takes approximately one hour for the body to rid itself of each drink consumed. No shortcut exists.',
    [
      { text: '15 minutes', isCorrect: false },
      { text: '30 minutes', isCorrect: false },
      { text: 'About one hour', isCorrect: true },
      { text: '2 to 3 hours', isCorrect: false },
    ]),

  // license:provisional-age (TX)
  q(S.tx, T.license, 'At what minimum age can a Texas resident obtain a provisional (restricted) driver license?',
    'A provisional license is issued to persons 16 to 18 years of age after completing all GDL Phase One requirements.',
    [
      { text: '15 years old', isCorrect: false },
      { text: '16 years old', isCorrect: true },
      { text: '17 years old', isCorrect: false },
      { text: '18 years old', isCorrect: false },
    ]),

  q(S.tx, T.license, 'What type of license is issued to Texas drivers between 16 and 18 years of age?',
    'A provisional license is issued to drivers aged 16-18 with Phase Two GDL restrictions. It expires on the holder\'s 18th birthday.',
    [
      { text: 'Learner license', isCorrect: false },
      { text: 'Hardship license', isCorrect: false },
      { text: 'Provisional license', isCorrect: true },
      { text: 'Full Class C license', isCorrect: false },
    ]),

  // license:address-change (TX)
  q(S.tx, T.license, 'Within how many days must you report a change of address to the Texas DPS?',
    'Texas law requires a change of address to be reported to DPS within 30 days.',
    [
      { text: '10 days', isCorrect: false },
      { text: '30 days', isCorrect: true },
      { text: '60 days', isCorrect: false },
      { text: '90 days', isCorrect: false },
    ]),

  q(S.tx, T.license, 'You moved to a new address in Texas. When must you update your driver license address with DPS?',
    'A change of address must be reported to DPS within 30 days. You can do this online, by mail, or in person.',
    [
      { text: 'Within 7 days', isCorrect: false },
      { text: 'Within 30 days', isCorrect: true },
      { text: 'Within 60 days', isCorrect: false },
      { text: 'At your next license renewal', isCorrect: false },
    ]),

  // license:new-resident (TX)
  q(S.tx, T.license, 'A new Texas resident has how many days to obtain a Texas driver license after establishing residency?',
    'New residents who are exchanging a valid out-of-state license have 90 days to establish residency and secure a Texas driver license.',
    [
      { text: '30 days', isCorrect: false },
      { text: '60 days', isCorrect: false },
      { text: '90 days', isCorrect: true },
      { text: '180 days', isCorrect: false },
    ]),

  q(S.tx, T.license, 'You just moved to Texas from another state with a valid driver license. What must you do?',
    'New residents have 90 days to exchange their out-of-state license for a Texas driver license after establishing residency.',
    [
      { text: 'Immediately surrender your out-of-state license', isCorrect: false },
      { text: 'Obtain a Texas license within 90 days', isCorrect: true },
      { text: 'Your out-of-state license is valid indefinitely in Texas', isCorrect: false },
      { text: 'Apply within 30 days or face a fine', isCorrect: false },
    ]),

  // license:insurance-minimum (TX)
  q(S.tx, T.license, 'What is the minimum liability insurance required for bodily injury to one person in Texas?',
    'Texas minimum liability insurance is $30,000 per person, $60,000 per incident for two or more persons, and $25,000 for property damage.',
    [
      { text: '$10,000', isCorrect: false },
      { text: '$20,000', isCorrect: false },
      { text: '$30,000', isCorrect: true },
      { text: '$50,000', isCorrect: false },
    ]),

  q(S.tx, T.license, 'What is the minimum liability coverage required for property damage under Texas law?',
    'Texas requires minimum liability coverage of $30,000/$60,000 for bodily injury and $25,000 for property damage.',
    [
      { text: '$10,000', isCorrect: false },
      { text: '$25,000', isCorrect: true },
      { text: '$50,000', isCorrect: false },
      { text: '$100,000', isCorrect: false },
    ]),

  q(S.tx, T.license, 'What does the "30/60/25" refer to in Texas auto insurance requirements?',
    '$30,000 per person / $60,000 per incident bodily injury / $25,000 property damage — the minimum liability coverage required in Texas.',
    [
      { text: 'Maximum coverage limits allowed by law', isCorrect: false },
      { text: 'Minimum liability coverage amounts required by Texas law', isCorrect: true },
      { text: 'Required deductible amounts for collision coverage', isCorrect: false },
      { text: 'Monthly premium limits for basic coverage', isCorrect: false },
    ]),

  // license:dwli (TX)
  q(S.tx, T.license, 'What is the penalty for driving in Texas while your license is suspended for the first time?',
    'Driving while license invalid (DWLI) is a Class C misdemeanor punishable by a fine of up to $500.',
    [
      { text: 'A fine of up to $200', isCorrect: false },
      { text: 'A fine of up to $500', isCorrect: true },
      { text: 'Automatic jail time of 30 days', isCorrect: false },
      { text: 'A fine of up to $2,000', isCorrect: false },
    ]),

  q(S.tx, T.license, 'In Texas, what offense is it to drive a motor vehicle while your license is suspended or revoked?',
    'Driving while license invalid (DWLI) is classified as a Class C misdemeanor for a first offense, punishable by up to $500.',
    [
      { text: 'A Class A felony', isCorrect: false },
      { text: 'A Class C misdemeanor', isCorrect: true },
      { text: 'An infraction with no criminal record', isCorrect: false },
      { text: 'A Class B misdemeanor automatically', isCorrect: false },
    ]),

  // safe:headlights-lowbeam (TX)
  q(S.tx, T.safe, 'In Texas, when must you switch to low beam headlights when approaching another vehicle?',
    'Use low beam headlights within 500 feet of an approaching vehicle to avoid blinding the other driver.',
    [
      { text: 'Within 1,000 feet', isCorrect: false },
      { text: 'Within 500 feet', isCorrect: true },
      { text: 'Within 200 feet', isCorrect: false },
      { text: 'Within 300 feet', isCorrect: false },
    ]),

  q(S.tx, T.safe, 'How close must you be following another vehicle before switching to low beam headlights in Texas?',
    'Use low beam headlights when following closely within 300 feet behind another vehicle.',
    [
      { text: 'Within 500 feet', isCorrect: false },
      { text: 'Within 300 feet', isCorrect: true },
      { text: 'Within 150 feet', isCorrect: false },
      { text: 'Within 100 feet', isCorrect: false },
    ]),

  // safe:parallel-park (TX)
  q(S.tx, T.safe, 'When parallel parking in Texas, how far from the curb must your vehicle be?',
    'When parallel parking, your vehicle must be no more than 18 inches from the curb or edge of the road.',
    [
      { text: 'No more than 6 inches', isCorrect: false },
      { text: 'No more than 12 inches', isCorrect: false },
      { text: 'No more than 18 inches', isCorrect: true },
      { text: 'No more than 24 inches', isCorrect: false },
    ]),

  q(S.tx, T.safe, 'What is the maximum distance your vehicle can be from the curb when parallel parked in Texas?',
    'Texas law requires parallel parking within 18 inches of the curb. On two-way roads, the right-hand wheels must be within 18 inches of the right-hand curb.',
    [
      { text: '6 inches', isCorrect: false },
      { text: '12 inches', isCorrect: false },
      { text: '18 inches', isCorrect: true },
      { text: '36 inches', isCorrect: false },
    ]),

  // safe:skid (TX)
  q(S.tx, T.safe, 'If your vehicle begins to skid in Texas, what is the first thing you should do?',
    'When a car skids, do not hit the brakes suddenly. Take your foot off the gas pedal and turn your steering wheel in the direction of the skid.',
    [
      { text: 'Apply the brakes hard and fast', isCorrect: false },
      { text: 'Take your foot off the gas and steer into the skid', isCorrect: true },
      { text: 'Turn the wheel sharply in the opposite direction', isCorrect: false },
      { text: 'Accelerate to regain traction', isCorrect: false },
    ]),

  q(S.tx, T.safe, 'Your car starts to skid on a wet road. Which action should you take?',
    'Remove your foot from the accelerator and steer in the direction the rear of the car is skidding. Avoid sudden braking.',
    [
      { text: 'Brake firmly and hold the wheel straight', isCorrect: false },
      { text: 'Ease off the gas and steer in the direction of the skid', isCorrect: true },
      { text: 'Accelerate out of the skid', isCorrect: false },
      { text: 'Turn the wheel hard in the opposite direction of the skid', isCorrect: false },
    ]),

  // safe:defensive-driving (TX)
  q(S.tx, T.safe, 'What is the primary goal of defensive driving in Texas?',
    'Defensive driving means protecting yourself and others from dangerous and unexpected situations by staying alert and having a plan of action.',
    [
      { text: 'To drive as fast as possible while staying legal', isCorrect: false },
      { text: 'To avoid crashes by anticipating hazards and staying alert', isCorrect: true },
      { text: 'To always drive below the speed limit', isCorrect: false },
      { text: 'To yield the right-of-way in all situations', isCorrect: false },
    ]),

  q(S.tx, T.safe, 'Which of the following best describes a defensive driver in Texas?',
    'A defensive driver stays alert, keeps eyes moving, looks for trouble spots, and knows that the law requires drivers to protect each other from their own mistakes.',
    [
      { text: 'A driver who always has the right-of-way', isCorrect: false },
      { text: 'A driver who avoids highways and busy roads', isCorrect: false },
      { text: 'A driver who anticipates hazards and is prepared to react safely', isCorrect: true },
      { text: 'A driver who drives slowly in all conditions', isCorrect: false },
    ]),

  // safe:road-rage (TX)
  q(S.tx, T.safe, 'What is road rage also known as in Texas traffic safety terminology?',
    'Road rage is also referred to as aggressive driving. It occurs when a driver becomes angry and fails to follow the rules of the road.',
    [
      { text: 'Defensive driving', isCorrect: false },
      { text: 'Aggressive driving', isCorrect: true },
      { text: 'Distracted driving', isCorrect: false },
      { text: 'Impaired driving', isCorrect: false },
    ]),

  q(S.tx, T.safe, 'A driver is tailgating you and making aggressive gestures. What should you do according to Texas guidelines?',
    'To avoid road rage, do not engage or retaliate. Stay calm, allow extra space, and report aggressive driving to local authorities.',
    [
      { text: 'Brake suddenly to teach them a lesson', isCorrect: false },
      { text: 'Make eye contact and gesture back', isCorrect: false },
      { text: 'Stay calm, avoid engagement, and report if necessary', isCorrect: true },
      { text: 'Speed up to get away from the driver', isCorrect: false },
    ]),

  // signs:railroad-shape (TX)
  q(S.tx, T.signs, 'What shape is the advance railroad warning sign in Texas?',
    'Railroad advance warning signs are round (circular) in shape and help drivers identify upcoming railroad crossings.',
    [
      { text: 'Diamond', isCorrect: false },
      { text: 'Pentagon', isCorrect: false },
      { text: 'Round (circular)', isCorrect: true },
      { text: 'Octagon', isCorrect: false },
    ]),

  q(S.tx, T.signs, 'You see a round yellow sign with an X and the letters RR. What does this sign indicate?',
    'A round yellow sign with an X and RR is a railroad advance warning sign, alerting drivers to an upcoming railroad crossing.',
    [
      { text: 'Rest area ahead', isCorrect: false },
      { text: 'Railroad crossing ahead — slow down and be prepared to stop', isCorrect: true },
      { text: 'Road repair ahead', isCorrect: false },
      { text: 'Restricted road — no trucks allowed', isCorrect: false },
    ]),

  // signs:green-arrow (TX)
  q(S.tx, T.signs, 'What does a green arrow displayed at the same time as a red light mean in Texas?',
    'A green arrow with a red light means you may proceed carefully in the direction of the arrow after yielding to vehicles and pedestrians.',
    [
      { text: 'Stop and wait for a full green light', isCorrect: false },
      { text: 'Proceed carefully in the direction of the arrow after yielding', isCorrect: true },
      { text: 'You have the right-of-way over all other traffic', isCorrect: false },
      { text: 'The intersection is closed in all other directions', isCorrect: false },
    ]),

  q(S.tx, T.signs, 'A green arrow pointing left appears alongside a red light at an intersection. What should you do?',
    'A green arrow with a red light allows you to turn in the direction of the arrow. You must still yield to any vehicles or pedestrians in your path.',
    [
      { text: 'Wait for the light to turn fully green before turning', isCorrect: false },
      { text: 'Turn in the direction of the arrow, yielding to others in your path', isCorrect: true },
      { text: 'Only proceed if no pedestrians are present', isCorrect: false },
      { text: 'This signal only applies to buses and emergency vehicles', isCorrect: false },
    ]),

  // ════════════════════════════════════════════════════════════════
  // FLORIDA GAPS
  // ════════════════════════════════════════════════════════════════

  // alcohol:bac-cdl (FL)
  q(S.fl, T.alcohol, 'What is the legal BAC limit for commercial driver license (CDL) holders in Florida?',
    'CDL holders are held to a stricter standard. A BAC of 0.04% or higher while operating a commercial vehicle is considered legally intoxicated in Florida.',
    [
      { text: '0.08%', isCorrect: false },
      { text: '0.06%', isCorrect: false },
      { text: '0.04%', isCorrect: true },
      { text: '0.02%', isCorrect: false },
    ]),

  q(S.fl, T.alcohol, 'A CDL driver in Florida has a BAC of 0.05% while driving a commercial vehicle. Are they in violation of the law?',
    'Yes. CDL holders must have a BAC below 0.04% when operating a commercial vehicle. A BAC of 0.05% exceeds the commercial driving limit.',
    [
      { text: 'No — the legal limit is 0.08% for all drivers', isCorrect: false },
      { text: 'Yes — CDL holders cannot have a BAC of 0.04% or higher', isCorrect: true },
      { text: 'No — 0.05% is only illegal for drivers under 21', isCorrect: false },
      { text: 'Only if they are carrying passengers', isCorrect: false },
    ]),

  // alcohol:dwi-penalty (FL)
  q(S.fl, T.alcohol, 'What is the maximum fine for a first DUI conviction in Florida?',
    'A first DUI conviction in Florida carries a fine of $500 to $1,000. Enhanced penalties apply if BAC is 0.15% or higher or if a minor was in the vehicle.',
    [
      { text: '$250', isCorrect: false },
      { text: '$500 to $1,000', isCorrect: true },
      { text: '$2,000', isCorrect: false },
      { text: '$5,000', isCorrect: false },
    ]),

  q(S.fl, T.alcohol, 'In Florida, a first DUI conviction can result in imprisonment of up to how many months?',
    'A first DUI in Florida can result in imprisonment of up to 6 months. The term can be extended if BAC is 0.15% or higher.',
    [
      { text: '3 months', isCorrect: false },
      { text: '6 months', isCorrect: true },
      { text: '12 months', isCorrect: false },
      { text: '24 months', isCorrect: false },
    ]),

  q(S.fl, T.alcohol, 'What happens to your driver license after a first DUI conviction in Florida?',
    'After a first DUI in Florida, your license is revoked for a minimum of 180 days up to one year.',
    [
      { text: 'Suspended for 30 days', isCorrect: false },
      { text: 'Revoked for 180 days to 1 year', isCorrect: true },
      { text: 'Cancelled permanently', isCorrect: false },
      { text: 'No license action for a first offense', isCorrect: false },
    ]),

  // license:provisional-age (FL)
  q(S.fl, T.license, 'At what age can a Florida teen obtain a learner driver license?',
    'In Florida, a learner driver license can be obtained at age 15. The learner must hold the license for at least 12 months before getting a full license.',
    [
      { text: '14 years old', isCorrect: false },
      { text: '15 years old', isCorrect: true },
      { text: '16 years old', isCorrect: false },
      { text: '17 years old', isCorrect: false },
    ]),

  q(S.fl, T.license, 'At what age can a Florida driver obtain a full unrestricted Class E license?',
    'In Florida, drivers can obtain a full Class E license at age 18. Between 16 and 18, drivers hold a restricted license with GDL limitations.',
    [
      { text: '16 years old', isCorrect: false },
      { text: '17 years old', isCorrect: false },
      { text: '18 years old', isCorrect: true },
      { text: '21 years old', isCorrect: false },
    ]),

  // license:gdl-passenger (FL)
  q(S.fl, T.license, 'During the first year of the Florida Graduated Driver License program, how many non-family passengers under 18 are allowed?',
    'During the first 12 months of holding a restricted license in Florida, the driver may not have more than one non-family passenger under 18.',
    [
      { text: 'No passengers under 18 are allowed', isCorrect: false },
      { text: 'No more than one non-family passenger under 18', isCorrect: true },
      { text: 'Up to three passengers under 18', isCorrect: false },
      { text: 'Any number of family members', isCorrect: false },
    ]),

  q(S.fl, T.license, 'A 16-year-old Florida driver with a restricted license wants to drive three friends to school. Is this allowed?',
    'No. During the first 12 months of holding a restricted license, a Florida teen may not have more than one non-family passenger under 18.',
    [
      { text: 'Yes, as long as everyone wears a seat belt', isCorrect: false },
      { text: 'No — only one non-family passenger under 18 is permitted', isCorrect: true },
      { text: 'Yes, school trips are always an exception', isCorrect: false },
      { text: 'Yes, if a parent gives written permission', isCorrect: false },
    ]),

  // license:gdl-phase (FL)
  q(S.fl, T.license, 'How long must a Florida teen hold a learner license before advancing to a restricted license?',
    'Florida requires teens to hold a learner license for at least 12 months before they can apply for a restricted license.',
    [
      { text: '3 months', isCorrect: false },
      { text: '6 months', isCorrect: false },
      { text: '12 months', isCorrect: true },
      { text: '18 months', isCorrect: false },
    ]),

  q(S.fl, T.license, 'How many hours of supervised driving are required before a Florida teen can get a restricted license?',
    'Florida requires 50 hours of supervised driving (including 10 hours at night) before a teen can advance to a restricted license.',
    [
      { text: '25 hours including 5 at night', isCorrect: false },
      { text: '50 hours including 10 at night', isCorrect: true },
      { text: '40 hours daytime only', isCorrect: false },
      { text: '100 hours including 25 at night', isCorrect: false },
    ]),

  // license:address-change (FL)
  q(S.fl, T.license, 'Within how many days must a Florida driver notify the DHSMV of an address change?',
    'Florida drivers must notify the Department of Highway Safety and Motor Vehicles (DHSMV) of an address change within 30 days.',
    [
      { text: '10 days', isCorrect: false },
      { text: '30 days', isCorrect: true },
      { text: '60 days', isCorrect: false },
      { text: '90 days', isCorrect: false },
    ]),

  // license:new-resident (FL)
  q(S.fl, T.license, 'A new Florida resident has how many days to obtain a Florida driver license?',
    'New Florida residents must obtain a Florida driver license within 30 days of establishing residency in the state.',
    [
      { text: '10 days', isCorrect: false },
      { text: '30 days', isCorrect: true },
      { text: '60 days', isCorrect: false },
      { text: '90 days', isCorrect: false },
    ]),

  q(S.fl, T.license, 'You recently moved to Florida from another state. When must you get a Florida driver license?',
    'New residents must obtain a Florida driver license within 30 days of becoming a Florida resident.',
    [
      { text: 'Immediately upon moving', isCorrect: false },
      { text: 'Within 30 days of becoming a resident', isCorrect: true },
      { text: 'Within 90 days', isCorrect: false },
      { text: 'Your out-of-state license is valid for one year', isCorrect: false },
    ]),

  // license:insurance-minimum (FL)
  q(S.fl, T.license, 'What is the minimum Personal Injury Protection (PIP) insurance required for Florida drivers?',
    'Florida requires a minimum of $10,000 in Personal Injury Protection (PIP) and $10,000 in Property Damage Liability (PDL).',
    [
      { text: '$5,000 PIP', isCorrect: false },
      { text: '$10,000 PIP', isCorrect: true },
      { text: '$25,000 PIP', isCorrect: false },
      { text: '$50,000 PIP', isCorrect: false },
    ]),

  q(S.fl, T.license, 'Florida is a no-fault insurance state. What minimum coverage is required?',
    'Florida requires $10,000 Personal Injury Protection (PIP) and $10,000 Property Damage Liability (PDL) as minimum coverage.',
    [
      { text: '$25,000 bodily injury liability only', isCorrect: false },
      { text: '$10,000 PIP and $10,000 PDL', isCorrect: true },
      { text: '$30,000 combined coverage', isCorrect: false },
      { text: '$50,000 comprehensive coverage', isCorrect: false },
    ]),

  // license:knowledge-exam (FL)
  q(S.fl, T.license, 'What is the minimum passing score on the Florida driver license knowledge exam?',
    'Florida requires a score of 80% or higher to pass the Class E knowledge exam. The test has 50 questions and you must answer at least 40 correctly.',
    [
      { text: '70%', isCorrect: false },
      { text: '75%', isCorrect: false },
      { text: '80%', isCorrect: true },
      { text: '90%', isCorrect: false },
    ]),

  q(S.fl, T.license, 'How many questions are on the Florida Class E driver license knowledge test?',
    'The Florida Class E knowledge exam has 50 questions. You must answer at least 40 correctly (80%) to pass.',
    [
      { text: '20 questions', isCorrect: false },
      { text: '40 questions', isCorrect: false },
      { text: '50 questions', isCorrect: true },
      { text: '100 questions', isCorrect: false },
    ]),

  // license:dwli (FL)
  q(S.fl, T.license, 'What is the penalty for driving with a suspended license in Florida for the first time?',
    'Driving with a suspended or revoked license in Florida is a second-degree misdemeanor for a first offense, punishable by up to 60 days in jail and a $500 fine.',
    [
      { text: 'A small fine with no criminal record', isCorrect: false },
      { text: 'A second-degree misdemeanor with up to 60 days jail', isCorrect: true },
      { text: 'Automatic license revocation for life', isCorrect: false },
      { text: 'A first-degree felony', isCorrect: false },
    ]),

  q(S.fl, T.license, 'In Florida, if you knowingly drive with a suspended license, what criminal charge may apply?',
    'Knowingly driving with a suspended or revoked license is a misdemeanor in Florida. Repeat offenses can escalate to a felony.',
    [
      { text: 'No criminal charge — only a civil fine', isCorrect: false },
      { text: 'A misdemeanor charge', isCorrect: true },
      { text: 'A first-degree felony charge', isCorrect: false },
      { text: 'Only a warning for a first offense', isCorrect: false },
    ]),

  // row:emergency-vehicle (FL)
  q(S.fl, T.row, 'Under Florida law, when an emergency vehicle approaches with lights and sirens, what must you do?',
    'Florida law requires drivers to immediately pull to the right edge of the road and stop when an emergency vehicle approaches with lights or sirens activated.',
    [
      { text: 'Slow down but continue driving', isCorrect: false },
      { text: 'Pull to the right and stop until the emergency vehicle passes', isCorrect: true },
      { text: 'Speed up to clear the road quickly', isCorrect: false },
      { text: 'Only yield if the vehicle is behind you', isCorrect: false },
    ]),

  q(S.fl, T.row, 'Under the Florida Move Over Law, what must you do when passing a stopped emergency vehicle with lights activated on the highway?',
    'Florida\'s Move Over Law requires drivers to move over one lane away from the stopped emergency vehicle, or if unable to do so, slow down to a speed 20 mph below the posted limit.',
    [
      { text: 'Maintain your speed and stay in your lane', isCorrect: false },
      { text: 'Move over one lane or slow down 20 mph below the posted limit', isCorrect: true },
      { text: 'Stop completely behind the emergency vehicle', isCorrect: false },
      { text: 'Sound your horn and proceed normally', isCorrect: false },
    ]),

  q(S.fl, T.row, 'Florida\'s Move Over Law applies to which types of stopped vehicles?',
    'Florida\'s Move Over Law applies to law enforcement, emergency, sanitation, utility service, and wrecker vehicles stopped on the roadway with lights activated.',
    [
      { text: 'Only police vehicles', isCorrect: false },
      { text: 'Emergency vehicles and police only', isCorrect: false },
      { text: 'Emergency, law enforcement, utility, sanitation, and wrecker vehicles', isCorrect: true },
      { text: 'Any vehicle stopped on the shoulder', isCorrect: false },
    ]),

  // safe:parallel-park (FL)
  q(S.fl, T.safe, 'When parallel parking in Florida, how far from the curb should your vehicle be?',
    'Florida requires vehicles to be parked within 12 inches of the curb when parallel parking.',
    [
      { text: 'Within 6 inches', isCorrect: false },
      { text: 'Within 12 inches', isCorrect: true },
      { text: 'Within 18 inches', isCorrect: false },
      { text: 'Within 24 inches', isCorrect: false },
    ]),

  q(S.fl, T.safe, 'When parallel parking on a two-way street in Florida, which side of the road must you park on?',
    'On a two-way street, you must parallel park on the right side of the road with your vehicle facing the direction of traffic.',
    [
      { text: 'Either side, depending on available space', isCorrect: false },
      { text: 'The right side, facing the direction of traffic', isCorrect: true },
      { text: 'The left side closest to the curb', isCorrect: false },
      { text: 'Either side as long as you are within 12 inches of the curb', isCorrect: false },
    ]),

  // signs:yield-shape (FL)
  q(S.fl, T.signs, 'What shape is a yield sign in Florida?',
    'Yield signs are downward-pointing equilateral triangles — the only sign shape exclusively used for yielding.',
    [
      { text: 'Octagon', isCorrect: false },
      { text: 'Diamond', isCorrect: false },
      { text: 'Downward-pointing triangle', isCorrect: true },
      { text: 'Pentagon', isCorrect: false },
    ]),

  q(S.fl, T.signs, 'You see a red and white downward-pointing triangular sign. What does it mean?',
    'A downward-pointing triangular sign is exclusively used for yield signs. Slow down and yield to cross traffic or pedestrians.',
    [
      { text: 'Stop completely before proceeding', isCorrect: false },
      { text: 'Yield — slow down and give right-of-way to others', isCorrect: true },
      { text: 'Construction zone ahead', isCorrect: false },
      { text: 'School crossing ahead', isCorrect: false },
    ]),

  // signs:railroad-shape (FL)
  q(S.fl, T.signs, 'What shape is the advance railroad warning sign in Florida?',
    'Railroad advance warning signs are round (circular) in shape. This unique shape helps drivers identify upcoming railroad crossings from a distance.',
    [
      { text: 'Diamond', isCorrect: false },
      { text: 'Rectangle', isCorrect: false },
      { text: 'Round (circular)', isCorrect: true },
      { text: 'Octagon', isCorrect: false },
    ]),

  q(S.fl, T.signs, 'Which sign shape is exclusively used for railroad advance warnings in Florida?',
    'Round signs are exclusively used for railroad advance warning signs. When you see a round yellow sign, a railroad crossing is ahead.',
    [
      { text: 'Diamond-shaped signs', isCorrect: false },
      { text: 'Pentagon-shaped signs', isCorrect: false },
      { text: 'Round signs', isCorrect: true },
      { text: 'Rectangular signs', isCorrect: false },
    ]),

  // signs:flashing-yellow (FL)
  q(S.fl, T.signs, 'What does a flashing yellow light at an intersection mean in Florida?',
    'A flashing yellow light is a warning signal. Drivers should slow down and proceed through the intersection with caution.',
    [
      { text: 'Stop completely before proceeding', isCorrect: false },
      { text: 'Slow down and proceed with caution', isCorrect: true },
      { text: 'The intersection is closed', isCorrect: false },
      { text: 'Yield to all traffic before proceeding', isCorrect: false },
    ]),

  q(S.fl, T.signs, 'You approach an intersection with a flashing yellow signal. What should you do?',
    'A flashing yellow signal warns drivers to slow down and use caution. It does not require a full stop unless traffic or pedestrians require it.',
    [
      { text: 'Come to a complete stop and wait for green', isCorrect: false },
      { text: 'Slow down and proceed with caution', isCorrect: true },
      { text: 'Treat it as a green light and proceed normally', isCorrect: false },
      { text: 'Honk your horn to alert others and proceed', isCorrect: false },
    ]),

  // signs:construction-color (FL)
  q(S.fl, T.signs, 'What color are construction and maintenance warning signs in Florida?',
    'Construction and maintenance warning signs are orange with black text or symbols. Orange is the standard color for all work zone signs.',
    [
      { text: 'Yellow', isCorrect: false },
      { text: 'Red', isCorrect: false },
      { text: 'Orange', isCorrect: true },
      { text: 'Blue', isCorrect: false },
    ]),

  q(S.fl, T.signs, 'You see an orange diamond-shaped sign on the highway. What does this indicate?',
    'Orange signs indicate construction and maintenance zones. Diamond-shaped orange signs warn of hazards in or near work zones.',
    [
      { text: 'A scenic route or rest area ahead', isCorrect: false },
      { text: 'A construction or maintenance work zone ahead', isCorrect: true },
      { text: 'A school zone with reduced speed', isCorrect: false },
      { text: 'A railroad crossing ahead', isCorrect: false },
    ]),

  // ════════════════════════════════════════════════════════════════
  // CALIFORNIA GAPS
  // ════════════════════════════════════════════════════════════════

  // speed:stopping-distance (CA)
  q(S.ca, T.speed, 'At 55 mph on dry pavement, approximately how many feet does it take to stop a vehicle in California?',
    'At 55 mph, it takes approximately 400 feet to stop a vehicle on dry pavement — about the length of a city block. This includes reaction time and braking distance.',
    [
      { text: 'About 100 feet', isCorrect: false },
      { text: 'About 200 feet', isCorrect: false },
      { text: 'About 400 feet', isCorrect: true },
      { text: 'About 600 feet', isCorrect: false },
    ]),

  q(S.ca, T.speed, 'Why is it important to understand stopping distances when driving in California?',
    'Stopping distance includes both reaction distance and braking distance. At higher speeds, both increase significantly, requiring more space between vehicles.',
    [
      { text: 'So you can calculate how fast to drive', isCorrect: false },
      { text: 'To maintain a safe following distance and avoid rear-end collisions', isCorrect: true },
      { text: 'To determine when to use cruise control', isCorrect: false },
      { text: 'It is only important for commercial drivers', isCorrect: false },
    ]),

  q(S.ca, T.speed, 'Which factor most increases your total stopping distance in California?',
    'Higher speed dramatically increases both reaction distance and braking distance. Wet or slippery roads also significantly increase stopping distance.',
    [
      { text: 'The color of the vehicle', isCorrect: false },
      { text: 'Higher speed and poor road conditions', isCorrect: true },
      { text: 'The number of passengers in the vehicle', isCorrect: false },
      { text: 'The time of day you are driving', isCorrect: false },
    ]),

  // alcohol:bac-cdl (CA)
  q(S.ca, T.alcohol, 'What is the legal BAC limit for commercial vehicle drivers in California?',
    'Commercial drivers in California are held to a stricter standard. A BAC of 0.04% or higher while operating a commercial vehicle constitutes DUI.',
    [
      { text: '0.08%', isCorrect: false },
      { text: '0.05%', isCorrect: false },
      { text: '0.04%', isCorrect: true },
      { text: '0.01%', isCorrect: false },
    ]),

  q(S.ca, T.alcohol, 'A commercial truck driver in California has a BAC of 0.06%. Are they in violation of the law?',
    'Yes. California CDL holders cannot operate a commercial vehicle with a BAC of 0.04% or higher. A 0.06% BAC exceeds this limit.',
    [
      { text: 'No — only 0.08% or higher is illegal for all drivers', isCorrect: false },
      { text: 'Yes — CDL holders are over the 0.04% commercial limit', isCorrect: true },
      { text: 'Only if they are transporting passengers', isCorrect: false },
      { text: 'No — the limit for commercial drivers is 0.08%', isCorrect: false },
    ]),

  // alcohol:zero-tolerance (CA)
  q(S.ca, T.alcohol, 'What is California\'s Zero Tolerance law for drivers under 21?',
    'California\'s Zero Tolerance law makes it illegal for any driver under 21 to drive with a BAC of 0.01% or higher — essentially no alcohol at all.',
    [
      { text: 'Drivers under 21 cannot have a BAC over 0.08%', isCorrect: false },
      { text: 'Drivers under 21 cannot have a BAC of 0.01% or higher', isCorrect: true },
      { text: 'Drivers under 21 cannot have a BAC over 0.05%', isCorrect: false },
      { text: 'Zero tolerance only applies to drivers under 18', isCorrect: false },
    ]),

  q(S.ca, T.alcohol, 'An 18-year-old California driver is stopped and found to have a BAC of 0.02%. What happens?',
    'Under California\'s Zero Tolerance law, any driver under 21 with a BAC of 0.01% or higher faces license suspension. A 0.02% BAC is a violation.',
    [
      { text: 'Nothing — 0.02% is below the 0.08% legal limit', isCorrect: false },
      { text: 'License suspension — any detectable amount violates zero tolerance', isCorrect: true },
      { text: 'Only a warning is issued for a first offense', isCorrect: false },
      { text: 'The driver receives a fine but keeps their license', isCorrect: false },
    ]),

  q(S.ca, T.alcohol, 'What does California\'s Zero Tolerance law specifically prohibit for drivers under 21?',
    'Zero Tolerance prohibits drivers under 21 from driving with ANY measurable alcohol in their system (0.01% BAC or higher).',
    [
      { text: 'Drinking any alcohol, even at home', isCorrect: false },
      { text: 'Driving with a BAC of 0.01% or higher', isCorrect: true },
      { text: 'Driving after midnight', isCorrect: false },
      { text: 'Carrying open containers in the vehicle', isCorrect: false },
    ]),

  // alcohol:dwi-penalty (CA)
  q(S.ca, T.alcohol, 'What is the minimum jail time for a first DUI conviction in California?',
    'A first DUI conviction in California carries a minimum of 96 hours (4 days) in jail, with a maximum of 6 months.',
    [
      { text: 'No jail time for a first offense', isCorrect: false },
      { text: 'A minimum of 96 hours (4 days)', isCorrect: true },
      { text: 'A minimum of 30 days', isCorrect: false },
      { text: 'A minimum of 6 months', isCorrect: false },
    ]),

  q(S.ca, T.alcohol, 'After a DUI conviction in California, for how long is your driver license suspended for a first offense?',
    'A first DUI conviction in California results in a 6-month driver license suspension.',
    [
      { text: '30 days', isCorrect: false },
      { text: '3 months', isCorrect: false },
      { text: '6 months', isCorrect: true },
      { text: '1 year', isCorrect: false },
    ]),

  q(S.ca, T.alcohol, 'What is the maximum fine for a first DUI offense in California (before penalty assessments)?',
    'The base fine for a first California DUI is up to $1,000. However, with penalty assessments, the total cost can be much higher.',
    [
      { text: '$250', isCorrect: false },
      { text: '$500', isCorrect: false },
      { text: '$1,000', isCorrect: true },
      { text: '$5,000', isCorrect: false },
    ]),

  // license:gdl-curfew (CA)
  q(S.ca, T.license, 'During the first 12 months of holding a provisional license in California, when are teen drivers prohibited from driving?',
    'California provisional license holders under 18 are prohibited from driving between 11 PM and 5 AM during the first 12 months, unless accompanied by a licensed adult 25 or older.',
    [
      { text: 'Between 10 PM and 6 AM', isCorrect: false },
      { text: 'Between 11 PM and 5 AM', isCorrect: true },
      { text: 'Between midnight and 5 AM', isCorrect: false },
      { text: 'Between 9 PM and 6 AM', isCorrect: false },
    ]),

  q(S.ca, T.license, 'A 16-year-old with a California provisional license needs to drive at midnight. What is required?',
    'During the first 12 months of holding a provisional license, teens may not drive between 11 PM and 5 AM unless accompanied by a licensed driver 25 or older.',
    [
      { text: 'This is always prohibited regardless of circumstance', isCorrect: false },
      { text: 'A licensed driver 25 or older must be in the vehicle', isCorrect: true },
      { text: 'They may drive if a parent gives verbal permission', isCorrect: false },
      { text: 'This is permitted if the destination is less than 5 miles away', isCorrect: false },
    ]),

  // license:gdl-phase (CA)
  q(S.ca, T.license, 'How long must a California teen hold an instruction permit before applying for a provisional license?',
    'California requires teens to hold an instruction permit for at least 6 months before applying for a provisional driver license.',
    [
      { text: '3 months', isCorrect: false },
      { text: '6 months', isCorrect: true },
      { text: '9 months', isCorrect: false },
      { text: '12 months', isCorrect: false },
    ]),

  q(S.ca, T.license, 'How many hours of supervised driving must a California teen complete before getting a provisional license?',
    'California requires 50 hours of supervised driving practice (including 10 hours at night) before a provisional license can be issued.',
    [
      { text: '25 hours with no nighttime requirement', isCorrect: false },
      { text: '50 hours including 10 hours at night', isCorrect: true },
      { text: '100 hours including 25 hours at night', isCorrect: false },
      { text: '40 hours with no nighttime requirement', isCorrect: false },
    ]),

  // license:insurance-minimum (CA)
  q(S.ca, T.license, 'What is the minimum liability insurance required for bodily injury to one person in California?',
    'California minimum liability insurance requires $15,000 per person, $30,000 per accident for bodily injury, and $5,000 for property damage.',
    [
      { text: '$10,000', isCorrect: false },
      { text: '$15,000', isCorrect: true },
      { text: '$25,000', isCorrect: false },
      { text: '$50,000', isCorrect: false },
    ]),

  q(S.ca, T.license, 'What is the minimum property damage liability coverage required in California?',
    'California requires a minimum of $5,000 in property damage liability coverage as part of the 15/30/5 minimum insurance requirement.',
    [
      { text: '$1,000', isCorrect: false },
      { text: '$5,000', isCorrect: true },
      { text: '$10,000', isCorrect: false },
      { text: '$25,000', isCorrect: false },
    ]),

  // license:knowledge-exam (CA)
  q(S.ca, T.license, 'What is the minimum passing score on the California driver knowledge test?',
    'California requires a score of 83% or higher (no more than 6 errors on a 36-question test, or 3 errors on an 18-question renewal test) to pass.',
    [
      { text: '70%', isCorrect: false },
      { text: '75%', isCorrect: false },
      { text: '80%', isCorrect: false },
      { text: '83% (no more than 6 errors)', isCorrect: true },
    ]),

  q(S.ca, T.license, 'How many questions are on the California DMV knowledge test for a first-time applicant?',
    'The California DMV knowledge test for first-time applicants consists of 36 questions. You may miss no more than 6 to pass.',
    [
      { text: '20 questions', isCorrect: false },
      { text: '30 questions', isCorrect: false },
      { text: '36 questions', isCorrect: true },
      { text: '50 questions', isCorrect: false },
    ]),

  // license:dwli (CA)
  q(S.ca, T.license, 'What is the penalty for driving with a suspended license in California for the first time?',
    'Driving with a suspended or revoked license in California is a misdemeanor punishable by 10 days to 6 months in jail and fines up to $1,000.',
    [
      { text: 'A small fine with no criminal record', isCorrect: false },
      { text: 'A misdemeanor with possible jail time and fines', isCorrect: true },
      { text: 'Automatic permanent revocation', isCorrect: false },
      { text: 'Only a warning for a first offense', isCorrect: false },
    ]),

  q(S.ca, T.license, 'In California, driving on a suspended license is classified as what type of offense?',
    'Driving with a suspended or revoked license (VC 14601) is a misdemeanor in California.',
    [
      { text: 'A felony', isCorrect: false },
      { text: 'An infraction', isCorrect: false },
      { text: 'A misdemeanor', isCorrect: true },
      { text: 'A civil violation only', isCorrect: false },
    ]),

  // row:railroad-stop (CA)
  q(S.ca, T.row, 'When approaching a railroad crossing in California, how far from the tracks must you stop if a train is approaching?',
    'California law requires stopping between 15 and 50 feet from the nearest rail when a train is approaching or when warning signals are activated.',
    [
      { text: '5 to 10 feet', isCorrect: false },
      { text: '15 to 50 feet', isCorrect: true },
      { text: '50 to 100 feet', isCorrect: false },
      { text: '100 feet', isCorrect: false },
    ]),

  q(S.ca, T.row, 'At a California railroad crossing with flashing red lights, what must you do?',
    'When red lights flash at a railroad crossing, you must stop 15 to 50 feet from the nearest rail and remain stopped until the lights stop flashing and it is safe to proceed.',
    [
      { text: 'Slow down and proceed carefully', isCorrect: false },
      { text: 'Stop 15 to 50 feet from the rail and wait until safe to proceed', isCorrect: true },
      { text: 'Stop only if you can see a train coming', isCorrect: false },
      { text: 'Proceed if no train is visible in either direction', isCorrect: false },
    ]),

  q(S.ca, T.row, 'You are approaching a California railroad crossing. The crossing has no signals but a crossbuck sign. What should you do?',
    'At uncontrolled crossings with only a crossbuck sign, slow down, look and listen in both directions for a train. Stop if a train is approaching.',
    [
      { text: 'Proceed at normal speed — crossbuck means it is safe', isCorrect: false },
      { text: 'Slow down, look and listen, and stop if a train is approaching', isCorrect: true },
      { text: 'Stop completely regardless of whether a train is present', isCorrect: false },
      { text: 'Only slow down if the signal lights are flashing', isCorrect: false },
    ]),

  // row:emergency-vehicle (CA)
  q(S.ca, T.row, 'Under California law, what must you do when an emergency vehicle approaches with lights or siren?',
    'California law requires drivers to immediately pull to the right curb and stop, parallel to the curb, until the emergency vehicle passes.',
    [
      { text: 'Slow down and stay in your lane', isCorrect: false },
      { text: 'Pull to the right curb and stop until the emergency vehicle passes', isCorrect: true },
      { text: 'Speed up to clear the intersection quickly', isCorrect: false },
      { text: 'Only yield if the vehicle is in your lane', isCorrect: false },
    ]),

  q(S.ca, T.row, 'You are at an intersection when an emergency vehicle with lights and siren approaches. What must you do?',
    'You must not block an intersection. If you are at an intersection, proceed through it before pulling to the right and stopping for the emergency vehicle.',
    [
      { text: 'Stop immediately in the intersection', isCorrect: false },
      { text: 'Clear the intersection then pull to the right and stop', isCorrect: true },
      { text: 'Continue driving until you find a safe pull-off', isCorrect: false },
      { text: 'Only yield if the emergency vehicle is directly behind you', isCorrect: false },
    ]),

  q(S.ca, T.row, 'California\'s Move Over law requires drivers to do what when passing a stopped emergency vehicle on a multi-lane road?',
    'California\'s Move Over law requires drivers to move one lane away from the stopped emergency or authorized vehicle, or slow down if a lane change is not possible.',
    [
      { text: 'Stop behind the emergency vehicle', isCorrect: false },
      { text: 'Move over one lane or slow to a safe speed if unable to change lanes', isCorrect: true },
      { text: 'Sound your horn and proceed at normal speed', isCorrect: false },
      { text: 'Only applies to police vehicles, not other emergency vehicles', isCorrect: false },
    ]),

  // safe:headlights-lowbeam (CA)
  q(S.ca, T.safe, 'In California, at what distance must you dim your high beams when approaching an oncoming vehicle?',
    'California law requires you to dim your high beams within 500 feet of an oncoming vehicle to avoid blinding the driver.',
    [
      { text: '200 feet', isCorrect: false },
      { text: '300 feet', isCorrect: false },
      { text: '500 feet', isCorrect: true },
      { text: '1,000 feet', isCorrect: false },
    ]),

  q(S.ca, T.safe, 'When following another vehicle in California at night, at what distance should you switch to low beam headlights?',
    'You must use low beam headlights when following within 300 feet of another vehicle to avoid blinding the driver through their mirrors.',
    [
      { text: '100 feet', isCorrect: false },
      { text: '300 feet', isCorrect: true },
      { text: '500 feet', isCorrect: false },
      { text: '1,000 feet', isCorrect: false },
    ]),

  // safe:park-railroad (CA)
  q(S.ca, T.safe, 'How far from railroad tracks must you park your vehicle in California?',
    'California law prohibits parking within 7.5 feet of the nearest rail of a railroad track.',
    [
      { text: '5 feet', isCorrect: false },
      { text: '7.5 feet', isCorrect: true },
      { text: '15 feet', isCorrect: false },
      { text: '50 feet', isCorrect: false },
    ]),

  q(S.ca, T.safe, 'You want to park near a railroad track in California. What is the minimum distance from the nearest rail?',
    'You must park at least 7.5 feet from the nearest rail of any railroad track in California.',
    [
      { text: '3 feet', isCorrect: false },
      { text: '7.5 feet', isCorrect: true },
      { text: '10 feet', isCorrect: false },
      { text: '25 feet', isCorrect: false },
    ]),

  // safe:parallel-park (CA)
  q(S.ca, T.safe, 'When parallel parking in California, how far from the curb must your right wheels be?',
    'California requires your right wheels to be within 18 inches of the curb when parallel parking on the right side of the road.',
    [
      { text: '6 inches', isCorrect: false },
      { text: '12 inches', isCorrect: false },
      { text: '18 inches', isCorrect: true },
      { text: '24 inches', isCorrect: false },
    ]),

  q(S.ca, T.safe, 'You are parallel parking on a hill with a curb in California. What must you do with your front wheels when parking downhill?',
    'When parking downhill next to a curb, turn your front wheels toward the curb. This prevents the vehicle from rolling into traffic if the brakes fail.',
    [
      { text: 'Turn wheels away from the curb', isCorrect: false },
      { text: 'Keep wheels straight', isCorrect: false },
      { text: 'Turn wheels toward the curb', isCorrect: true },
      { text: 'Turn wheels to the left regardless of direction', isCorrect: false },
    ]),

  // safe:skid (CA)
  q(S.ca, T.safe, 'Your vehicle begins to skid in California. What is the correct first response?',
    'When skidding, ease off the accelerator and steer in the direction you want the front of the car to go. Do not brake suddenly.',
    [
      { text: 'Apply the brakes firmly and immediately', isCorrect: false },
      { text: 'Ease off the gas and steer in the direction you want to go', isCorrect: true },
      { text: 'Accelerate to regain traction quickly', isCorrect: false },
      { text: 'Pull the emergency brake to stop the skid', isCorrect: false },
    ]),

  q(S.ca, T.safe, 'To recover from a rear-wheel skid in California, which way should you steer?',
    'In a rear-wheel skid, steer in the direction the rear of the car is sliding (into the skid) to regain control.',
    [
      { text: 'Opposite the direction of the skid', isCorrect: false },
      { text: 'Into the direction of the skid', isCorrect: true },
      { text: 'Straight ahead regardless of skid direction', isCorrect: false },
      { text: 'To the right regardless of skid direction', isCorrect: false },
    ]),

  // safe:defensive-driving (CA)
  q(S.ca, T.safe, 'What is the primary purpose of defensive driving in California?',
    'Defensive driving helps you avoid crashes and road hazards by anticipating dangerous situations and making safe decisions despite conditions around you.',
    [
      { text: 'To drive as fast as legally possible', isCorrect: false },
      { text: 'To anticipate hazards and avoid crashes through safe decisions', isCorrect: true },
      { text: 'To always yield the right-of-way to other drivers', isCorrect: false },
      { text: 'To reduce fuel consumption', isCorrect: false },
    ]),

  q(S.ca, T.safe, 'Which of the following is an example of defensive driving in California?',
    'Scanning the road ahead for hazards, maintaining a safe following distance, and being prepared to react are all components of defensive driving.',
    [
      { text: 'Tailgating slow drivers to encourage them to speed up', isCorrect: false },
      { text: 'Scanning ahead for hazards and maintaining safe following distance', isCorrect: true },
      { text: 'Always driving exactly at the posted speed limit regardless of conditions', isCorrect: false },
      { text: 'Using your horn frequently to alert other drivers', isCorrect: false },
    ]),

  // signs:yield-shape (CA)
  q(S.ca, T.signs, 'What is the shape of a yield sign in California?',
    'Yield signs are downward-pointing equilateral triangles. This unique shape allows drivers to recognize yield signs even from a distance or if the sign is faded.',
    [
      { text: 'Octagon', isCorrect: false },
      { text: 'Diamond', isCorrect: false },
      { text: 'Downward-pointing triangle', isCorrect: true },
      { text: 'Pentagon', isCorrect: false },
    ]),

  q(S.ca, T.signs, 'A red and white triangular sign pointing downward means what in California?',
    'A downward-pointing triangular sign is exclusively used for yield signs — slow down and be prepared to stop for crossing traffic.',
    [
      { text: 'Stop completely', isCorrect: false },
      { text: 'Yield to crossing traffic or pedestrians', isCorrect: true },
      { text: 'Railroad crossing ahead', isCorrect: false },
      { text: 'School zone speed limit applies', isCorrect: false },
    ]),

  // signs:school-shape (CA)
  q(S.ca, T.signs, 'What shape are school zone and school crossing warning signs in California?',
    'School advance and school crossing signs are pentagon-shaped (five-sided). This unique shape helps drivers instantly recognize school zones.',
    [
      { text: 'Diamond', isCorrect: false },
      { text: 'Octagon', isCorrect: false },
      { text: 'Pentagon (five-sided)', isCorrect: true },
      { text: 'Round', isCorrect: false },
    ]),

  q(S.ca, T.signs, 'You see a yellow pentagon-shaped sign with children walking on it. What does this mean?',
    'Pentagon-shaped signs are used exclusively for school advance and school crossing warnings. Slow down and watch for children.',
    [
      { text: 'Playground area — no parking', isCorrect: false },
      { text: 'School zone or school crossing ahead — slow down and watch for children', isCorrect: true },
      { text: 'Pedestrian crossing in a shopping area', isCorrect: false },
      { text: 'Park or recreational area ahead', isCorrect: false },
    ]),

  // signs:railroad-shape (CA)
  q(S.ca, T.signs, 'Which sign shape is used exclusively for railroad advance warning signs in California?',
    'Round signs are exclusively used for railroad advance warnings. When you see a round yellow sign with an X, prepare for a railroad crossing ahead.',
    [
      { text: 'Diamond', isCorrect: false },
      { text: 'Pentagon', isCorrect: false },
      { text: 'Round (circular)', isCorrect: true },
      { text: 'Horizontal rectangle', isCorrect: false },
    ]),

  q(S.ca, T.signs, 'What does a round yellow sign with an X and the letters RR mean in California?',
    'This is a railroad advance warning sign. It means a railroad crossing is ahead. Slow down, look and listen for trains.',
    [
      { text: 'Road repair ahead', isCorrect: false },
      { text: 'Railroad crossing ahead — slow down and prepare to stop', isCorrect: true },
      { text: 'Restricted road — no right turns', isCorrect: false },
      { text: 'Rest area one mile ahead', isCorrect: false },
    ]),

  // signs:green-arrow (CA)
  q(S.ca, T.signs, 'What does a green arrow signal mean in California when shown with a red light?',
    'A green arrow with a red light means you may proceed in the direction of the arrow, but you must yield to any vehicles or pedestrians lawfully in the intersection.',
    [
      { text: 'You must wait for a full green light', isCorrect: false },
      { text: 'Proceed in the direction of the arrow after yielding to others', isCorrect: true },
      { text: 'You have absolute right-of-way in all directions', isCorrect: false },
      { text: 'This signal is for buses and emergency vehicles only', isCorrect: false },
    ]),

  q(S.ca, T.signs, 'A green left-turn arrow appears at a California intersection. What does this mean?',
    'A green arrow for left turns (protected turn) means you may turn in the direction shown. Oncoming traffic is stopped, giving you a protected turn.',
    [
      { text: 'You may turn but must yield to all oncoming traffic', isCorrect: false },
      { text: 'You have a protected turn — oncoming traffic is stopped', isCorrect: true },
      { text: 'Only buses and trucks may turn on this signal', isCorrect: false },
      { text: 'You must come to a complete stop before turning', isCorrect: false },
    ]),

];

async function main() {
  console.log('Adding ' + questions.length + ' gap-filling questions across TX, FL, CA...\n');

  let txCount = 0, flCount = 0, caCount = 0;

  for (const qData of questions) {
    await p.question.create({ data: qData });
    if (qData.stateId === S.tx) txCount++;
    else if (qData.stateId === S.fl) flCount++;
    else if (qData.stateId === S.ca) caCount++;
  }

  console.log('Added TX: ' + txCount + ' questions');
  console.log('Added FL: ' + flCount + ' questions');
  console.log('Added CA: ' + caCount + ' questions');
  console.log('Total added: ' + questions.length);

  // Final counts
  const counts = await p.question.groupBy({
    by: ['stateId'],
    where: { stateId: { in: [S.tx, S.fl, S.ca] } },
    _count: { _all: true },
  });
  const names = { [S.tx]: 'Texas', [S.fl]: 'Florida', [S.ca]: 'California' };
  console.log('\nFINAL QUESTION COUNTS:');
  counts.forEach(c => console.log('  ' + names[c.stateId] + ': ' + c._count._all));

  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
