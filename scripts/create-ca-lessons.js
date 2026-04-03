const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CA_LESSONS = [
  // === LICENSING ===
  {
    title: "California Provisional License: No Driving 11 PM to 5 AM",
    slug: "ca-provisional-license-restrictions",
    topic: "licensing-permits",
    stateCode: "CA",
    simpleLine: "Under 18: no driving 11 PM–5 AM for the first 12 months, and no passengers under 20 without an adult 25+.",
    explanation: "California issues a 'provisional' license to drivers under 18. During the first 12 months, you cannot drive between 11 PM and 5 AM, and you cannot carry passengers under 20 years old unless a licensed driver age 25+ is with you. Exceptions exist for medical needs, school activities, work, or driving an immediate family member — but you must carry a signed note. A parent or guardian can cancel a teen's license at any time.",
    imageUrl: null,
  },
  {
    title: "California Instruction Permit: Must Be 15½ Years Old",
    slug: "ca-instruction-permit-age",
    topic: "licensing-permits",
    stateCode: "CA",
    simpleLine: "You must be at least 15½ to get a California instruction permit and complete a driver education program.",
    explanation: "To get a California instruction permit, you must be at least 15½ years old, complete a driver education program, and have your parent or guardian sign the application. If parents share joint custody, both must sign. You cannot use the permit until you start behind-the-wheel training with a licensed instructor. To practice on your own, you need a California-licensed driver age 25+ in the front seat.",
    imageUrl: null,
  },
  {
    title: "California Requires 50 Hours of Practice Driving",
    slug: "ca-50-hours-practice",
    topic: "licensing-permits",
    stateCode: "CA",
    simpleLine: "Under 18: you must log 50 hours of practice driving, including 10 hours at night, with a driver age 25+.",
    explanation: "Before you can take the behind-the-wheel drive test in California, you must practice driving for at least 50 hours with a California-licensed driver who is at least 25 years old. Ten of those hours must be at night. You must also hold your instruction permit for at least 6 months (or turn 18) before scheduling the drive test. You are allowed 3 attempts to pass the knowledge test before you must reapply.",
    imageUrl: null,
  },
  {
    title: "California Point System: 4 Points in 12 Months = Suspension",
    slug: "ca-point-system",
    topic: "licensing-permits",
    stateCode: "CA",
    simpleLine: "You are a negligent operator if you get 4+ points in 12 months, 6+ in 24 months, or 8+ in 36 months.",
    explanation: "California uses a point system. Most traffic violations add 1 point. Serious violations (DUI, hit-and-run, reckless driving) add 2 points. You become a 'negligent operator' and risk license suspension if you accumulate: 4 or more points in 12 months, 6 or more in 24 months, or 8 or more in 36 months. Points stay on your record for 3-7 years depending on the violation.",
    imageUrl: null,
  },

  // === SPEED LIMITS ===
  {
    title: "California Speed Limits: The Complete Table",
    slug: "ca-speed-limit-table",
    topic: "speed-limits",
    stateCode: "CA",
    simpleLine: "CA speed limits: residential/business 25, school zone 25, alleys 15, blind intersections 15, freeways 65.",
    explanation: "California speed limits: Residential or business districts = 25 mph. School zones (when children present) = 25 mph (some areas 15-20 mph). Alleys = 15 mph. Blind intersections (no stop sign, can't see 100 ft) = 15 mph. Near railroad tracks (within 100 ft, can't see 400 ft) = 15 mph. Two-lane undivided highways = 55 mph. Most freeways = 65 mph (some posted 70 mph). The Basic Speed Law always applies: drive at a speed safe for conditions, even if below the posted limit.",
    imageUrl: null,
  },
  {
    title: "California 15 MPH Zones: Alleys, Blind Intersections, Railroad Tracks",
    slug: "ca-15-mph-zones",
    topic: "speed-limits",
    stateCode: "CA",
    simpleLine: "In California, the speed limit is 15 mph in alleys, at blind intersections, and near railroad tracks.",
    explanation: "California has three special 15 mph zones that are frequently tested: 1) Alleys — any road narrower than 25 feet. 2) Blind intersections — where you cannot see 100 feet in any direction and there is no stop sign or signal. 3) Near railroad tracks — within 100 feet of a crossing when you cannot see trains from 400 feet away. These are commonly missed on the CA knowledge test.",
    imageUrl: '/signs/speed-limit-15.png',
  },

  // === RIGHT OF WAY ===
  {
    title: "California Right-of-Way: The Law Only Says Who Must Yield",
    slug: "ca-right-of-way-yield",
    topic: "right-of-way",
    stateCode: "CA",
    simpleLine: "No one 'has' the right-of-way in California. The law only says who must yield it.",
    explanation: "In California, no driver, pedestrian, or bicyclist automatically has the right-of-way. The law only says who must yield. At uncontrolled intersections (no signs or signals), yield to the vehicle that arrived first. If two vehicles arrive at the same time, the driver on the left must yield to the driver on the right. Always yield to pedestrians in marked and unmarked crosswalks.",
    imageUrl: null,
  },
  {
    title: "California Right Turn on Red: Stop First — But Not on Red Arrow",
    slug: "ca-right-turn-on-red",
    topic: "right-of-way",
    stateCode: "CA",
    simpleLine: "You may turn right on a red light after a complete stop — but you may NOT turn right on a red arrow.",
    explanation: "In California, you can make a right turn at a solid red light after coming to a complete stop, unless a 'NO TURN ON RED' sign is posted. However, you may NOT turn right on a red arrow — you must wait for the green. This is a key difference from some other states. You may also turn left on red only from a one-way street onto a one-way street, after a complete stop. Always yield to pedestrians and traffic with the green light.",
    imageUrl: null,
  },
  {
    title: "California U-Turn Rules: Know Where You Cannot Turn Around",
    slug: "ca-u-turn-rules",
    topic: "right-of-way",
    stateCode: "CA",
    simpleLine: "Never U-turn in business districts (except at intersections), on one-way streets, or where you can't see 200 feet.",
    explanation: "In California, you may NOT make a U-turn: in business districts except at intersections or divided highway openings, on a one-way street, at or on a railroad crossing, where a NO U-TURN sign is posted, where you cannot see 200 feet in each direction, in front of a fire station, or across two sets of double yellow lines. You MAY U-turn across a single set of double yellow lines, in residential areas if no vehicle is within 200 feet, and at intersections with a green light unless posted otherwise.",
    imageUrl: null,
  },
  {
    title: "California Move Over Law: Emergency and Roadside Vehicles",
    slug: "ca-move-over-law",
    topic: "right-of-way",
    stateCode: "CA",
    simpleLine: "Move over a lane for stopped emergency vehicles, tow trucks, and Caltrans vehicles with flashing lights.",
    explanation: "California's Move Over law requires you to move over a lane when approaching stopped emergency vehicles, tow trucks, and Caltrans vehicles with flashing lights. If you cannot safely change lanes, you must slow down to a reasonable and safe speed. This law protects officers, paramedics, tow truck operators, and highway workers. Violation can result in fines and points on your license.",
    imageUrl: '/signs/emergency-vehicle.png',
  },
  {
    title: "California School Bus: Stop When Red Lights Flash",
    slug: "ca-school-bus-rules",
    topic: "right-of-way",
    stateCode: "CA",
    simpleLine: "Stop for a school bus with flashing red lights. On a divided highway with a median, opposite traffic does not stop.",
    explanation: "When a school bus has flashing red lights and the stop sign arm extended, you must stop from both directions on an undivided road. Remain stopped until the lights stop flashing. On a divided highway with a physical median or barrier, traffic going the opposite direction does not need to stop. Passing a stopped school bus can result in a fine up to $1,000 and a suspended license for one year.",
    imageUrl: '/handbook-illustrations/school-bus-stop-both.png',
  },

  // === SAFE DRIVING ===
  {
    title: "California Seat Belt Law: All Occupants Must Buckle Up",
    slug: "ca-seat-belt-law",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "All drivers and passengers must wear seat belts in California. Children under 8 need a car seat.",
    explanation: "California law requires all drivers and passengers to wear seat belts. Children under 2 must ride in a rear-facing car seat (unless they weigh 40+ lbs or are 40+ inches tall). Children under 8 must be secured in a car seat or booster in the back seat. Children under 8 who are 4'9\" or taller may use a seat belt. The driver can be cited for any unbelted passenger under 16.",
    imageUrl: null,
  },
  {
    title: "California Child Restraint: Under 8 Must Use a Car Seat",
    slug: "ca-child-restraint",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "Children under 2 must be rear-facing. Under 8 must use a car seat or booster in the back seat.",
    explanation: "California has strict child restraint laws: Children under 2 years old must ride rear-facing in a car seat unless the child weighs 40+ pounds or is 40+ inches tall. Children under 8 must be secured in a car seat or booster seat in the back seat. Children under 8 who are 4 feet 9 inches or taller may use a regular seat belt. The driver is responsible for making sure all children are properly secured.",
    imageUrl: null,
  },
  {
    title: "California Headlight Rules: Use with Wipers, Dim Within 500 Feet",
    slug: "ca-headlight-rules",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "Use headlights 30 min after sunset to 30 min before sunrise, and whenever you use windshield wipers.",
    explanation: "California requires headlights from 30 minutes after sunset until 30 minutes before sunrise, and whenever conditions prevent you from seeing 1,000 feet ahead. If you need to use your windshield wipers (fog, rain, snow), you must turn on your low-beam headlights. Dim high beams to low within 500 feet of oncoming vehicles and 300 feet of a vehicle you're following. Driving with only parking lights is illegal.",
    imageUrl: null,
  },
  {
    title: "California HOV/Carpool Lanes: Diamond Symbol Rules",
    slug: "ca-hov-carpool-lanes",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "HOV lanes are marked with a diamond. Do not cross double white lines to enter or exit.",
    explanation: "California's HOV (carpool) lanes are reserved for vehicles with the required number of passengers (usually 2+), motorcycles, and vehicles with clean-air decals. They are marked with a diamond symbol on the road. Never cross double solid white lines to enter or exit an HOV lane — use only the designated entrances and exits where the line is broken. Signs along the road show minimum passenger requirements and hours of operation.",
    imageUrl: null,
  },
  {
    title: "California Center Turn Lane: Only 200 Feet",
    slug: "ca-center-turn-lane",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "You may only drive 200 feet in a center left turn lane. It is not a passing or travel lane.",
    explanation: "A center left turn lane is the middle lane on a two-way street, marked with solid and broken yellow lines on both sides. Use it only to prepare for and make a left turn or U-turn. You may drive no more than 200 feet in this lane. It is not a regular traffic lane and must not be used for passing. Before entering, check for vehicles coming toward you in the same lane.",
    imageUrl: '/handbook-illustrations/center-turn-lane.png',
  },
  {
    title: "California Bicycle Safety: Give 3 Feet of Clearance",
    slug: "ca-bicycle-3-feet",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "You must give bicyclists at least 3 feet of clearance when passing. It is illegal to drive in a bike lane.",
    explanation: "California law requires drivers to maintain at least 3 feet of distance between their vehicle and a bicyclist when passing. If 3 feet is not possible, slow down to a safe speed. It is illegal to drive in a bicycle lane unless you are parking (where permitted), entering or leaving the road, or turning within 200 feet of an intersection. Always check blind spots before crossing a bike lane.",
    imageUrl: '/handbook-illustrations/sharrow.png',
  },
  {
    title: "California Turnout Areas: Let 5+ Vehicles Pass",
    slug: "ca-turnout-areas",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "If 5 or more vehicles are following you on a two-lane road, you must use a turnout area to let them pass.",
    explanation: "On California two-lane roads where passing is unsafe, you must use a turnout area or lane to let vehicles behind you pass when 5 or more are following you. This is a legal requirement, not just courtesy. Driving too slowly and blocking traffic is also a citable offense. If there is no turnout area, pull over when safe to let traffic pass.",
    imageUrl: null,
  },
  {
    title: "California Colored Curbs: What Each Color Means",
    slug: "ca-colored-curbs",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "White = pickup/dropoff. Green = limited time. Yellow = loading. Red = no stopping. Blue = disabled only.",
    explanation: "California uses colored curbs to indicate parking rules: White = stop only to pick up or drop off passengers. Green = park for a limited time (check signs or curb markings for the time limit). Yellow = loading and unloading only — stay with your vehicle. Red = no stopping, standing, or parking at any time. Blue = parking only for disabled persons with a placard or special plate. Parking in a blue zone without a placard can result in a fine of $250-$1,000.",
    imageUrl: null,
  },
  {
    title: "California Parking Rules: 18 Inches from the Curb",
    slug: "ca-parking-rules",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "Park within 18 inches of the curb. No parking within 15 feet of a fire hydrant or 20 feet of a crosswalk.",
    explanation: "When parallel parking in California, your vehicle must be within 18 inches of the curb. Never park: within 15 feet of a fire hydrant, within 20 feet of a crosswalk (15 feet where a curb extension is present), on a sidewalk, on a marked or unmarked crosswalk, within 3 feet of a sidewalk ramp for disabled persons, in front of a driveway, double parked, or in a tunnel or on a bridge. If you park on a freeway, your vehicle can be towed after 4 hours.",
    imageUrl: null,
  },
  {
    title: "California Merging: Match Speed and Signal 5 Seconds Early",
    slug: "ca-merging-rules",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "When merging onto a freeway, match the speed of traffic. Signal at least 5 seconds before changing lanes.",
    explanation: "When entering a California freeway: be at or near the speed of traffic before merging, do not stop on the on-ramp unless absolutely necessary, use mirrors and turn signals, and check blind spots. When exiting: signal at least 5 seconds (about 400 feet) before your exit. Change lanes one at a time. If you miss your exit, do not back up — continue to the next exit. You need about half a block (150 ft) to merge on city streets, or a full block (300 ft) on the highway.",
    imageUrl: '/handbook-illustrations/limited-access-highways.png',
  },
  {
    title: "California Emergency Handling: Skids and Brake Failure",
    slug: "ca-emergency-handling",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "In a skid: ease off the gas, steer where you want to go. Brake failure: pump brakes, downshift, use parking brake.",
    explanation: "If your car skids: take your foot off the gas and steer in the direction you want the front of the car to go. Do not brake hard — it makes the skid worse. If your brakes fail: pump the brake pedal hard and fast, shift to a lower gear, slowly apply the parking brake, and rub your tires on the curb if needed. If your accelerator sticks: shift to neutral, turn off the ignition (don't lock the steering), and brake. For a tire blowout: grip the wheel firmly, ease off the gas, and steer straight.",
    imageUrl: null,
  },
  {
    title: "California Fog and Rain: Low Beams Only, Reduce Speed",
    slug: "ca-fog-rain-driving",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "In fog or rain, use low beams only — never high beams. If you use wipers, headlights must be on.",
    explanation: "In California, if you need your windshield wipers, you must also turn on your low-beam headlights. In fog: use low beams only (high beams reflect off fog and reduce visibility). Reduce speed and increase following distance. In heavy rain: watch for hydroplaning — your tires can ride on a film of water. Slow down and avoid sudden braking or turning. If fog is too thick to see, pull completely off the road, turn on emergency flashers, and wait.",
    imageUrl: null,
  },
  {
    title: "California Headphones Banned: No Earbuds in Both Ears",
    slug: "ca-headphones-banned",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "It is illegal to wear a headset or earplugs in both ears while driving in California.",
    explanation: "California law prohibits wearing a headset, earbuds, or earplugs in both ears while driving or riding a bicycle. You must be able to hear horns, sirens, and emergency vehicles. You may wear a single earbud in one ear for phone calls using a hands-free device. Hearing aids are exempt from this rule.",
    imageUrl: null,
  },
  {
    title: "California Passing: Not Within 100 Feet of Intersections",
    slug: "ca-passing-rules",
    topic: "safe-driving",
    stateCode: "CA",
    simpleLine: "Do not pass within 100 feet of an intersection, bridge, tunnel, or railroad crossing.",
    explanation: "In California, do not pass another vehicle: within 100 feet of an intersection, bridge, tunnel, or railroad crossing, if you are approaching a hill or curve and cannot see oncoming traffic, at crossroads or driveways, or unless you have enough space to safely return to your lane. To pass safely, the hill or curve should be at least one-third of a mile ahead. You may pass on the right only on a multi-lane road, when the vehicle ahead is turning left, or on a one-way street. Never drive off the pavement to pass.",
    imageUrl: null,
  },
  {
    title: "California Railroad Crossings: Stop at Least 15 Feet Away",
    slug: "ca-railroad-crossings",
    topic: "traffic-signs",
    stateCode: "CA",
    simpleLine: "Stop at least 15 feet from railroad tracks when lights flash or gates are down. Never stop on the tracks.",
    explanation: "At railroad crossings with flashing lights or lowered gates, stop at least 15 feet from the nearest rail. Never stop on the tracks. Wait until gates are fully raised and lights stop flashing before crossing. If your vehicle stalls on the tracks, get everyone out immediately and move away from the tracks. A round yellow sign with an X warns you a railroad crossing is ahead. If there are multiple tracks, make sure all are clear before proceeding.",
    imageUrl: '/signs/railroadcrossing.png',
  },
  {
    title: "California Implied Consent: Refusal = 1-Year Suspension",
    slug: "ca-implied-consent",
    topic: "alcohol-dui",
    stateCode: "CA",
    simpleLine: "By driving in California, you have agreed to a chemical test if arrested for DUI. Refusal = 1-year suspension.",
    explanation: "California's implied consent law means that by driving on California roads, you have already agreed to submit to a breath, blood, or urine test if lawfully arrested for DUI. If you refuse, your license will be suspended for 1 year for the first refusal, 2 years for the second, and 3 years for the third. This suspension is separate from any DUI penalties. The DUI limit is 0.08% BAC for adults, 0.04% for commercial drivers, and 0.01% for drivers under 21.",
    imageUrl: null,
  },
  {
    title: "California DUI: 0.08% BAC, 0.04% Commercial, 0.01% Under 21",
    slug: "ca-dui-bac-limits",
    topic: "alcohol-dui",
    stateCode: "CA",
    simpleLine: "California DUI limits: 0.08% for adults, 0.04% for commercial drivers, 0.01% for under 21.",
    explanation: "California has three BAC (blood alcohol concentration) limits: 0.08% for adult drivers age 21+, 0.04% for commercial vehicle drivers, and 0.01% for drivers under 21 (zero tolerance). A first DUI conviction can result in: license suspension for 4-10 months, fines of $390-$1,000 plus penalty assessments, DUI school (3-9 months), up to 6 months in jail, and an ignition interlock device. Penalties increase significantly for repeat offenses.",
    imageUrl: null,
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const lesson of CA_LESSONS) {
    const existing = await prisma.microLesson.findFirst({
      where: { slug: lesson.slug },
    });
    if (existing) {
      console.log('SKIP (exists): ' + lesson.title);
      skipped++;
      continue;
    }

    await prisma.microLesson.create({
      data: {
        title: lesson.title,
        slug: lesson.slug,
        topic: lesson.topic,
        stateCode: lesson.stateCode,
        simpleLine: lesson.simpleLine,
        explanation: lesson.explanation,
        imageUrl: lesson.imageUrl,
      },
    });
    console.log('CREATED: [' + lesson.topic + '] ' + lesson.title);
    created++;
  }

  const caTotal = await prisma.microLesson.count({ where: { stateCode: 'CA' } });
  console.log('\n=== SUMMARY ===');
  console.log('Created: ' + created);
  console.log('Skipped: ' + skipped);
  console.log('Total CA lessons now: ' + caTotal);
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
