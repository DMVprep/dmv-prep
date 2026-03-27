import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const envLocal = readFileSync(".env.local", "utf8");
for (const line of envLocal.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").replace(/^"|"$/g,"").trim();
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const prisma = new PrismaClient();

const STATE_FACTS = {
  FL: {
    name: "Florida",
    examQuestions: 50,
    examPassScore: 80,
    rules: `
FLORIDA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 MPH
- Speed limit on highways: 55 MPH
- Speed limit in school zones: 20 MPH (when children are present or lights flashing)
- Minimum highway speed: 50 MPH
- Following distance: 4 seconds
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Permit age: 15 years old. License age: 16 years old
- Knowledge test: 50 multiple-choice questions
- Fines doubled in school zones and work zones
- Move Over Law: must move over or slow down 20 mph below limit for stopped emergency vehicles
- The speeding buffer is a myth - not allowed to drive up to 10 MPH over the speed limit
- Implied consent law applies to all drivers
- Right turn on red permitted unless posted otherwise
- Stop at least 15 feet from a railroad crossing
- School bus: all traffic must stop when red lights flash and stop arm extends
- BAC limit: 0.08% for adults, 0.02% for minors
- School crossing signs are pentagon-shaped and fluorescent yellow-green
- Center turn lane: used only for left turns, not for passing or traveling
    `
  },
  TX: {
    name: "Texas",
    examQuestions: 30,
    examPassScore: 70,
    rules: `
TEXAS DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 MPH
- Speed limit on numbered Texas/US highways outside urban districts: 70 MPH
- Speed limit on unnumbered highways outside urban districts: 60 MPH
- BAC limit for adults: 0.08
- BAC limit for minors: any detectable amount (zero tolerance)
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years old. License age: 16 years old
- Teen curfew: no driving midnight to 5:00 a.m. (exceptions: work, school activity, medical emergency)
- Teen passengers: no more than one passenger under 21 who is not a family member
- Passing: not within 100 feet of an intersection or railroad crossing
- Parking: 15 feet from fire hydrant, 20 feet from crosswalk at intersection, 50 feet from railroad crossing
- Under 18: cannot use any wireless device including hands-free except in emergencies
- Slow Down Move Over law applies to emergency and service vehicles
- Seat belt required for all occupants
- No texting while driving for any driver
- Right turn on red permitted unless posted otherwise
    `
  },
  NY: {
    name: "New York",
    examQuestions: 20,
    examPassScore: 70,
    rules: `
NEW YORK DRIVER HANDBOOK - KEY RULES:
- Speed limit in New York City: 25 MPH
- Speed limit when no limit posted: 55 MPH
- Following distance: 2-second rule
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Railroad crossing: stop at least 15 feet from tracks
- Permit age: 16 years old
- License age: 18 years old (or 17 with driver education Certificate of Completion)
- Knowledge test: 20 questions, must get at least 14 correct including 2 of 4 road sign questions
- Parking: 15 feet from fire hydrant, cannot park in an intersection, 50 feet from railroad crossing
- Point system: accumulating 11 points in 18 months leads to license suspension
- Handheld device ban while driving - hands-free required
- Move Over law for stopped emergency vehicles
- Right turn on red permitted unless posted (not permitted in NYC unless signed)
- Junior driver license: restrictions on passengers and nighttime driving
    `
  },
  IL: {
    name: "Illinois",
    examQuestions: 35,
    examPassScore: 80,
    rules: `
ILLINOIS DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 MPH
- Speed limit on interstates and tollways: 70 MPH
- Speed limit on 4-lane highways: 65 MPH
- Speed limit on other highways and rural areas: 55 MPH
- Speed limit in school zones: 20 MPH (school days 6:30 a.m. to 4 p.m. when children are present)
- BAC limit for adults: 0.08%. BAC for minors: any trace of alcohol (zero tolerance)
- Following distance: 3-second rule
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years old. License age: 16 years old
- Teen curfew: Sunday-Thursday 10 p.m. to 6 a.m.; Friday-Saturday 11 p.m. to 6 a.m.
- Teen passengers: one in front seat plus safety belt capacity in back seat
- Passing visibility: must return to lane before within 200 feet of oncoming vehicle
- Parking: 15 feet from fire hydrant, 20 feet from crosswalk at intersection, 50 feet from railroad crossing
- Scott's Law (Move Over): must slow and move over for stopped emergency vehicles; fines up to $10,000
- Illegal to flash turn signals as a courtesy or do-pass signal to other drivers
- Zero tolerance BAC for minors
    `
  },
  CA: {
    name: "California",
    examQuestions: 46,
    examPassScore: 83,
    rules: `
CALIFORNIA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential/business districts: 25 MPH
- Speed limit near schools and children: 25 MPH
- Speed limit on highways when not posted: 65 MPH
- Speed limit on two-lane undivided highways: 55 MPH
- BAC limit for adults: 0.08%. BAC for minors: 0.01% (zero tolerance)
- Permit age: 15 and a half years old. License age: 16 years old
- Teen curfew: no driving 11 p.m. to 5 a.m. during first 12 months
- Teen passengers: no passengers under 20 during first 12 months unless licensed driver 25+ present
- Passing on hills or curves: hill or curve must be at least one-third of a mile ahead
- Parking: 15 feet from fire hydrant, 20 feet from unmarked or marked crosswalk
- Alcohol or cannabis in vehicle: container must be sealed and unopened
- Hands-free device required for all drivers, no handheld phone use
- Right turn on red permitted unless posted otherwise
- Stop at railroad crossings when lights flash or gate lowers
- School bus: all traffic must stop when red lights flash and stop arm extends
- Following distance: 3-second minimum
    `
  }
};

// Additional states
const NEW_STATE_FACTS = {
  PA: {
    name: "Pennsylvania",
    examQuestions: 18,
    examPassScore: 83,
    rules: `
PENNSYLVANIA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 15 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 16. License age: 16.5 years old
- Teen curfew: 11 p.m. to 5 a.m.
- Teen passengers: first 6 months only family; after 6 months 1 passenger under 18. Never more passengers than seat belts.
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 18 questions, 83% to pass
- Texting while driving prohibited
- Move Over law: must move to next lane or slow down for emergency responders
    `
  },
  OH: {
    name: "Ohio",
    examQuestions: 40,
    examPassScore: 75,
    rules: `
OHIO DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 20 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years 6 months. License age: 16 years old
- Teen curfew: midnight to 6 a.m.
- Teen passengers: 1 passenger under 21 unless family member
- Parking: 10 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 40 questions, 75% to pass
- Move Over law: must change lanes or slow for emergency vehicles
- Texting while driving prohibited
    `
  },
  GA: {
    name: "Georgia",
    examQuestions: 40,
    examPassScore: 75,
    rules: `
GEORGIA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: midnight to 5 a.m.
- Teen passengers: first 6 months no passengers under 21 except family; second 6 months 1 passenger under 21; afterward up to 3 under 21
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 40 questions, 75% to pass
- Hands-Free Georgia Act: prohibits holding or using a phone while driving
- Slow Poke law: slower traffic must keep right
    `
  },
  NC: {
    name: "North Carolina",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
NORTH CAROLINA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 35 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.00% (zero tolerance)
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: 9 p.m. to 5 a.m.
- Teen passengers: no more than 1 passenger under 21 except family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Move Over law: must change lanes or slow down for emergency vehicles
- Texting while driving prohibited
- Zero tolerance BAC for minors
    `
  },
  MI: {
    name: "Michigan",
    examQuestions: 50,
    examPassScore: 80,
    rules: `
MICHIGAN DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 14 years 9 months. License age: 16 years old
- Teen curfew: 10 p.m. to 5 a.m.
- Teen passengers: 1 passenger under 21 except family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 50 questions, 80% to pass
- Cell phone prohibited for drivers under 18; handheld phone ban for all drivers
- Move Over law: must change lanes or slow for emergency vehicles
    `
  },
};

const NEW_STATE_FACTS_2 = {

  AZ: {
    name: "Arizona",
    examQuestions: 30,
    examPassScore: 80,
    rules: `
ARIZONA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 75 mph
- Speed limit in school zones: 15 mph
- Minimum highway speed: 45 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.00% (zero tolerance)
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years 6 months. License age: 16 years old
- Teen curfew: midnight to 5 a.m.
- Teen passengers: no more than 1 passenger under 18 for first 6 months unless family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 30 questions, 80% to pass
- Arizona hands-free law bans handheld phone use while driving
    `
  },
  WA: {
    name: "Washington",
    examQuestions: 40,
    examPassScore: 80,
    rules: `
WASHINGTON DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 20 mph
- Minimum highway speed: 40 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: 1 a.m. to 5 a.m.
- Teen passengers: 1 passenger under 20 for first 6 months; up to 3 under 20 for next 6 months
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 40 questions, 80% to pass
- Move Over law requires slowing to 10 mph below posted speed and moving over when approaching emergency scenes
    `
  },
  CO: {
    name: "Colorado",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
COLORADO DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 mph
- Speed limit on highways: 75 mph
- Speed limit in school zones: 20 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: midnight to 5 a.m.
- Teen passengers: 1 passenger under 21 for first 6 months; up to 3 under 21 for next 6 months
- Parking: 5 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Move Over law requires drivers to move over or slow for emergency and service vehicles
    `
  },
  VA: {
    name: "Virginia",
    examQuestions: 35,
    examPassScore: 86,
    rules: `
VIRGINIA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years 6 months. License age: 16 years 3 months
- Teen curfew: midnight to 4 a.m.
- Teen passengers: 1 passenger under 21 for first year unless family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 35 questions, 86% to pass
- Move Over law requires drivers to change lanes or reduce speed when approaching stationary emergency vehicles
- Texting while driving prohibited
    `
  },
  NJ: {
    name: "New Jersey",
    examQuestions: 50,
    examPassScore: 80,
    rules: `
NEW JERSEY DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 65 mph
- Speed limit in school zones: 25 mph
- Minimum highway speed: 35 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.01%
- Following distance: 3 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 16. License age: 17 years old
- Teen curfew: 11:01 p.m. to 5 a.m.
- Teen passengers: 1 passenger unless family
- Parking: 10 feet from fire hydrant, 25 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 50 questions, 80% to pass
- Graduated Driver License decal requirement for drivers under 21
- Hands-free phone law prohibits handheld phone use while driving
    `
  },
  TN: {
    name: "Tennessee",
    examQuestions: 30,
    examPassScore: 80,
    rules: `
TENNESSEE DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 15 mph
- Minimum highway speed: 45 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: 11 p.m. to 6 a.m.
- Teen passengers: 1 passenger under 21 unless family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 30 questions, 80% to pass
- Hands-free driving law prohibits holding a cellphone or mobile device while driving
    `
  },
  MN: {
    name: "Minnesota",
    examQuestions: 40,
    examPassScore: 80,
    rules: `
MINNESOTA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 30 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.00% (zero tolerance)
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: midnight to 5 a.m.
- Teen passengers: 1 passenger under 20 unless family
- Parking: 10 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 40 questions, 80% to pass
- Hands-free law prohibits holding a phone while driving
    `
  },
  WI: {
    name: "Wisconsin",
    examQuestions: 50,
    examPassScore: 80,
    rules: `
WISCONSIN DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 15 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15 years 6 months. License age: 16 years old
- Teen curfew: midnight to 5 a.m.
- Teen passengers: 1 passenger under 21 unless family
- Parking: 15 feet from fire hydrant, 25 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 50 questions, 80% to pass
- Move Over law requires drivers to change lanes or slow when approaching emergency vehicles
    `
  },
  MO: {
    name: "Missouri",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
MISSOURI DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 20 mph
- Minimum highway speed: 40 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years old
- Teen curfew: 1 a.m. to 5 a.m.
- Teen passengers: 1 passenger under 19 for first 6 months
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Texting ban for drivers under 21
    `
  },
  IN: {
    name: "Indiana",
    examQuestions: 50,
    examPassScore: 84,
    rules: `
INDIANA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 30 mph
- Speed limit on highways: 70 mph
- Speed limit in school zones: 20 mph
- Minimum highway speed: 45 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from tracks
- Permit age: 15. License age: 16 years 90 days
- Teen curfew: 10 p.m. to 5 a.m.
- Teen passengers: 1 passenger for first 180 days unless family
- Parking: 15 feet from fire hydrant, 20 feet from intersection, 50 feet from railroad crossing
- Knowledge test: 50 questions, 84% to pass
- Hands-free driving law bans holding a phone while driving
    `
  },
};

const NEW_STATE_FACTS_3 = {

  MS: {
    name: "Mississippi",
    examQuestions: 30,
    examPassScore: 80,
    rules: `
MISSISSIPPI DRIVER HANDBOOK - KEY RULES:
- Speed limit on interstates: 70 mph; four-lane highways: 65 mph; two-lane highways: 55 mph; Natchez Trace Parkway: 50 mph
- Speed limit in school zones: 15 mph
- Minimum speed on interstates: 40 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: at least one car length for each 10 mph of speed
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15. License age: 16
- Parking: within 5 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 30 questions, 80% to pass
- Refusal to submit to chemical test results in 90-day suspension
    `
  },
  KS: {
    name: "Kansas",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
KANSAS DRIVER HANDBOOK - KEY RULES:
- Speed limit in urban districts: 30 mph
- Speed limit on separated multilane highways: 75 mph; state/federal highways: 65 mph; county/township roads: 55 mph
- Speed limit in school zones: 20 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 14. License age: 17
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Prohibits writing, sending, or reading text-based communication while driving
    `
  },
  CT: {
    name: "Connecticut",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
CONNECTICUT DRIVER HANDBOOK - KEY RULES:
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds at speeds under 30 mph; 3 seconds at higher speeds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 16. License age: 18
- Teen curfew: 11 p.m. to 5 a.m.
- Teen passengers: first 6 months no passengers except instructor or parents; second 6 months only immediate family
- Parking: within 10 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 25 questions, 80% to pass
- 3-foot passing law for bicycles
    `
  },
  OK: {
    name: "Oklahoma",
    examQuestions: 20,
    examPassScore: 70,
    rules: `
OKLAHOMA DRIVER HANDBOOK - KEY RULES:
- Speed limit on turnpikes: 80 mph; interstates: 75 mph; divided/undivided highways: 65 mph; county roads: 55 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: any measurable amount (zero tolerance)
- Following distance: 4 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15 years 6 months. License age: 16
- Teen curfew: 10 p.m. to 5 a.m.
- Teen passengers: 1 passenger or household members only unless supervised by licensed driver 21+
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 20 questions, 70% to pass
    `
  },
  UT: {
    name: "Utah",
    examQuestions: 50,
    examPassScore: 80,
    rules: `
UTAH DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on highways: 55 mph; interstates: 65-80 mph as posted
- Speed limit in school zones: 20 mph
- BAC limit for adults: 0.05% (stricter than most states). BAC for minors: 0.00% (zero tolerance)
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15. License age: 16
- Teen curfew: midnight to 5 a.m.
- Teen passengers: no passengers except immediate family for first 6 months
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 50 questions, 80% to pass
- Additional 100% score required on traffic safety test for first-time applicants
    `
  },
  IA: {
    name: "Iowa",
    examQuestions: 35,
    examPassScore: 80,
    rules: `
IOWA DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential areas: 25 mph
- Speed limit on interstate highways: 70 mph; other highways: 65 mph; secondary roads: 55 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 14. License age: 16
- Teen curfew: 12:30 a.m. to 5 a.m.
- Teen passengers: only one unrelated minor passenger during intermediate license
- Parking: within 5 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 35 questions, 80% to pass
- Implied consent law applies; refusal leads to license revocation
    `
  },
  AR: {
    name: "Arkansas",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
ARKANSAS DRIVER HANDBOOK - KEY RULES:
- Speed limit on interstate highways: 70 mph; highways outside urban districts: 55 mph; highways within urban districts: 30 mph
- Speed limit in school zones: 25 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 14. License age: 16
- Teen curfew: 11 p.m. to 4 a.m.
- Teen passengers: no more than one unrelated minor passenger unless accompanied by licensed driver 21+
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Cell phone use prohibited for intermediate license holders except emergencies
    `
  },
  MD: {
    name: "Maryland",
    examQuestions: 25,
    examPassScore: 85,
    rules: `
MARYLAND DRIVER HANDBOOK - KEY RULES:
- Speed limit in business/residential districts: 30 mph
- Speed limit in school zones: 15 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 3 to 4 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15 years 9 months. License age: 16 years 6 months
- Teen curfew: midnight to 5 a.m.
- Teen passengers: no passengers under 18 for first 151 days unless immediate family
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 25 questions, 85% to pass
- Must complete 60 hours of supervised driving including 10 hours at night
    `
  },
  OR: {
    name: "Oregon",
    examQuestions: 35,
    examPassScore: 80,
    rules: `
OREGON DRIVER HANDBOOK - KEY RULES:
- Speed limit in residential districts: 20 mph
- Speed limit on interstate highways: 65 mph (70 mph on some rural interstates); most other roads: 55 mph
- Speed limit in school zones: 20 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.00% (zero tolerance)
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15. License age: 16
- Teen passengers: first 6 months no passengers under 20 except family; second 6 months no more than 3 passengers under 20
- Parking: within 10 feet of fire hydrant, within 20 feet of crosswalk at intersection, within 50 feet of railroad crossing
- Knowledge test: 35 questions, 80% to pass
- Must hold instruction permit for at least 6 months if under 18
    `
  },
  NV: {
    name: "Nevada",
    examQuestions: 25,
    examPassScore: 80,
    rules: `
NEVADA DRIVER HANDBOOK - KEY RULES:
- Speed limit in business/residential districts: 25 mph
- Speed limit on urban freeways: 65 mph; rural interstate freeways: 70+ mph as posted
- Speed limit in school zones: 15 mph
- BAC limit for adults: 0.08%. BAC for minors: 0.02%
- Following distance: 2 seconds
- Railroad crossing: stop 15 to 50 feet from nearest rail
- Permit age: 15 years 6 months. License age: 16
- Teen curfew: 10 p.m. to 5 a.m.
- Teen passengers: no passengers under 18 for first 6 months except family
- Parking: within 15 feet of fire hydrant, within 50 feet of railroad crossing
- Knowledge test: 25 questions, 80% to pass
- Implied consent law applies; refusal results in license revocation
    `
  },
};

const TOPICS = [
  { slug: "traffic-signs", name: "Traffic Signs", focus: "sign shapes, colors, meanings, regulatory signs, warning signs, guide signs, pavement markings, lane lines, traffic signals" },
  { slug: "right-of-way", name: "Right Of Way", focus: "right-of-way at intersections, 4-way stops, yielding, left turns, pedestrians, cyclists, emergency vehicles, school buses, roundabouts, merging" },
  { slug: "speed-limits", name: "Speed Limits", focus: "speed limits by zone type, school zones, residential, highway, minimum speeds, fines, basic speed law" },
  { slug: "safe-driving", name: "Safe Driving", focus: "following distance, passing rules, alcohol BAC laws, seat belts, cell phone laws, parking rules, railroad crossings, teen driver restrictions, Move Over law, weather driving, DUI penalties" },
];

const BATCHES = 4;
const QUESTIONS_PER_BATCH = 15;

async function generateQuestions(stateName, stateRules, topic, batchNum) {
  const prompt = `You are writing official DMV knowledge test questions for ${stateName}.

OFFICIAL ${stateName.toUpperCase()} HANDBOOK RULES (use ONLY these facts):
${stateRules}

Generate exactly ${QUESTIONS_PER_BATCH} unique DMV test questions for the topic: "${topic.name}"
Focus on: ${topic.focus}
Batch number: ${batchNum} — make these DIFFERENT from all other batches, vary question styles and scenarios

STRICT RULES:
- ONLY use facts explicitly stated in the handbook rules above
- Every number, speed, and distance must come directly from the handbook
- Each question has exactly 4 answer choices, exactly 1 correct
- Wrong answers must use plausible but incorrect values (e.g. wrong speeds, wrong distances)
- Vary question formats: "What should you do...", "What is the speed limit...", "How far must you...", "When is it legal to...", "Which of the following..."
- Explanations must be direct and factual — no "According to..." prefix, just state the rule clearly in 1-2 sentences
- Mix simple recall questions with scenario-based questions
- Never invent rules not in the handbook

Return ONLY raw JSON, no markdown:
{"questions":[{"text":"question","choices":["A","B","C","D"],"correctIndex":0,"explanation":"Direct explanation of the rule here."}]}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim().replace(/^```json\s*/,"").replace(/```\s*$/,"").trim();
  return JSON.parse(raw).questions;
}

async function translateBatch(questions, language) {
  const langNames = { es: "Spanish", zh: "Simplified Chinese", pt: "Brazilian Portuguese", fr: "French" };
  const prompt = `Translate these DMV test questions to ${langNames[language]}. Keep all numbers, speeds, and distances exactly as stated. Return ONLY raw JSON:
{"translations":[{"text":"...","explanation":"...","choices":["A","B","C","D"]}]}
Questions: ${JSON.stringify(questions.map(q => ({ text: q.text, explanation: q.explanation, choices: q.choices })))}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });
  const raw = response.content[0].text.trim().replace(/^```json\s*/,"").replace(/```\s*$/,"").trim();
  return JSON.parse(raw).translations;
}

async function main() {
  console.log("Starting seed...");

  // Update state exam configs
  for (const [code, state] of Object.entries({ ...STATE_FACTS, ...NEW_STATE_FACTS, ...NEW_STATE_FACTS_2, ...NEW_STATE_FACTS_3 })) {
    await prisma.state.update({
      where: { code },
      data: { examQuestionCount: state.examQuestions, examPassScore: state.examPassScore }
    });
  }
  console.log("State exam configs updated");

  const topicRecords = {};
  for (const t of TOPICS) {
    topicRecords[t.slug] = await prisma.topic.findUnique({ where: { slug: t.slug } });
  }

  let total = await prisma.question.count();
  console.log(`Existing questions: ${total}`);

  for (const [code, state] of Object.entries({ ...STATE_FACTS, ...NEW_STATE_FACTS, ...NEW_STATE_FACTS_2, ...NEW_STATE_FACTS_3 })) {
    const stateRecord = await prisma.state.findUnique({ where: { code } });
    if (!stateRecord) { console.log(`State ${code} not found`); continue; }

    console.log(`\n========== ${state.name} ==========`);

    for (const topic of TOPICS) {
      console.log(`\n  Topic: ${topic.name}`);

      const existing = await prisma.question.count({
        where: { stateId: stateRecord.id, topicId: topicRecords[topic.slug].id }
      });

      if (existing >= BATCHES * QUESTIONS_PER_BATCH) {
        console.log(`    Skipped — already have ${existing} questions`);
        continue;
      }

      for (let batch = 1; batch <= BATCHES; batch++) {
        try {
          const questions = await generateQuestions(state.name, state.rules, topic, batch);
          console.log(`    Batch ${batch}: ${questions.length} questions generated`);

          const translations = {};
          for (const lang of ["es","zh","pt","fr"]) {
            try {
              translations[lang] = await translateBatch(questions, lang);
              console.log(`    Translated ${lang}`);
            } catch (e) {
              console.log(`    Translation failed ${lang}`);
              translations[lang] = null;
            }
          }

          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const created = await prisma.question.create({
              data: {
                text: q.text,
                explanation: q.explanation,
                stateId: stateRecord.id,
                topicId: topicRecords[topic.slug].id,
                choices: { create: q.choices.map((text, idx) => ({ text, isCorrect: idx === q.correctIndex })) },
              },
            });
            for (const lang of ["es","zh","pt","fr"]) {
              const t = translations[lang]?.[i];
              if (t) {
                try {
                  await prisma.questionTranslation.create({
                    data: { questionId: created.id, language: lang, text: t.text, explanation: t.explanation, choices: t.choices },
                  });
                } catch (e) {}
              }
            }
          }
          total += questions.length;
          console.log(`    Saved. Total: ${total}`);
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {
          console.error(`    Batch ${batch} failed: ${e.message}`);
        }
      }
    }
  }

  console.log(`\nDone! Final count: ${await prisma.question.count()}`);
  await prisma.$disconnect();
}

main().catch(async e => { console.error(e); await prisma.$disconnect(); process.exit(1); });
