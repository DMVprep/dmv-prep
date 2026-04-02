const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FL_LESSONS = [
  // === CHAPTER 1: YOUR LICENSE ===
  {
    title: "Florida Learner's Permit: Driving Restrictions",
    slug: "fl-learner-driving-restrictions",
    topic: "licensing-permits",
    stateCode: "FL",
    simpleLine: "Learner drivers must have a licensed driver age 21+ in the front passenger seat at all times.",
    explanation: "With a Florida learner's permit: for the first 3 months you can only drive during daylight hours. After 3 months, you may drive from 6 AM to 10 PM. A licensed driver age 21 or older must sit in the front passenger seat at all times. You must hold your learner's permit for at least 12 months (or until age 18) before getting a Class E license, and you must have no traffic convictions during that time.",
    imageUrl: null,
  },
  {
    title: "Florida Minor Curfew: No Driving Late at Night",
    slug: "fl-minor-curfew",
    topic: "licensing-permits",
    stateCode: "FL",
    simpleLine: "Under 17: no driving 11 PM to 6 AM. Age 17: no driving 1 AM to 5 AM.",
    explanation: "Florida has nighttime driving restrictions for young drivers. If you are under 17, you may not drive between 11:00 PM and 6:00 AM unless accompanied by a driver age 21+ or driving to/from work. If you are 17, you may not drive between 1:00 AM and 5:00 AM under the same conditions. These curfew rules are strictly enforced.",
    imageUrl: null,
  },
  {
    title: "Florida Residency: 30 Days to Get a FL License",
    slug: "fl-residency-license-requirement",
    topic: "licensing-permits",
    stateCode: "FL",
    simpleLine: "You must get a Florida license within 30 days of becoming a resident.",
    explanation: "If you move to Florida with a valid out-of-state license, you must get a Florida license within 30 days. You are considered a Florida resident if you: enroll children in public school, register to vote, file for homestead exemption, accept employment, or live in Florida for more than 6 consecutive months. Out-of-state license holders only need a vision test (no written or road test) unless driving ability is questionable.",
    imageUrl: null,
  },

  // === CHAPTER 2: YOUR DRIVING PRIVILEGE ===
  {
    title: "Florida Point System: How Points Lead to Suspension",
    slug: "fl-point-system",
    topic: "licensing-permits",
    stateCode: "FL",
    simpleLine: "12 points in 12 months = 30-day suspension. 18 points in 18 months = 3-month suspension.",
    explanation: "Florida uses a point system for traffic violations. Points add up: speeding 15 mph or less over = 3 points. Speeding 16+ over = 4 points. Reckless driving = 4 points. Passing a stopped school bus = 4 points. Leaving the scene of an accident = 6 points. If you accumulate 12 points in 12 months, your license is suspended for 30 days. 18 points in 18 months = 3-month suspension. 24 points in 36 months = 1-year suspension. Fines are doubled in school and construction zones.",
    imageUrl: null,
  },
  {
    title: "Florida Zero Tolerance: Under 21 BAC Limit Is 0.02%",
    slug: "fl-zero-tolerance-under-21",
    topic: "alcohol-dui",
    stateCode: "FL",
    simpleLine: "Any driver under 21 with a BAC of 0.02% or higher automatically loses their license for 6 months.",
    explanation: "Florida has a zero-tolerance law for drivers under 21. If you are stopped and your breath or blood alcohol level is 0.02% or higher, your license is automatically suspended for 6 months. This is an administrative suspension -- it does not appear as a DUI on your record. If you refuse to take the test, your license is automatically suspended for 1 year. The adult DUI limit is 0.08%, but for under-21 drivers, even one drink can put you over 0.02%.",
    imageUrl: null,
  },
  {
    title: "Florida Insurance: PIP and PDL Are Required",
    slug: "fl-insurance-requirements",
    topic: "licensing-permits",
    stateCode: "FL",
    simpleLine: "Florida requires $10,000 PIP and $10,000 PDL insurance on all vehicles with 4+ wheels.",
    explanation: "Florida law requires two types of insurance for all vehicles with four or more wheels: $10,000 Personal Injury Protection (PIP) and $10,000 Property Damage Liability (PDL). You cannot register a vehicle or buy a license plate without proof of PIP coverage. If your insurance lapses, your license and plates can be suspended for up to 3 years. If you are at fault in a crash, the Financial Responsibility Law also requires bodily injury liability coverage: $10,000/$20,000 minimum.",
    imageUrl: null,
  },
  {
    title: "Florida Crash Reporting: What to Do After an Accident",
    slug: "fl-crash-reporting",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "Stop, help the injured, exchange information, and report damage over $100 within 5 days.",
    explanation: "If you are in a crash in Florida, you must: 1) Stop immediately. 2) Help anyone who is injured. 3) Give your name, address, registration, and show your license to others involved. 4) Call police, FHP, or the sheriff if there is injury, death, or property damage. 5) If no officer writes a report and damage appears over $100, you must file a written report within 5 days. Move your car off the road if it is blocking traffic. Leaving the scene of a crash causing injury or death is a felony.",
    imageUrl: null,
  },

  // === CHAPTER 3: YOUR DRIVING ===
  {
    title: "Florida Seat Belt Law: Front Seat Mandatory",
    slug: "fl-seat-belt-law",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "The driver and front-seat passenger must wear seat belts. All passengers under 18 must buckle up.",
    explanation: "Florida law requires the driver and front-seat passenger to wear seat belts at all times. Every passenger under 18 must wear a seat belt regardless of where they sit. Wearing a seat belt makes you twice as likely to survive a crash. The risk of death is 5 times greater if you are thrown from the vehicle. More than half of fatal crashes happen at speeds under 40 mph and within 25 miles of home.",
    imageUrl: null,
  },
  {
    title: "Florida Child Restraint: Under 5 Must Use a Car Seat",
    slug: "fl-child-restraint",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "Children 5 and under must use a child restraint. Under 3 must be in a car seat or infant carrier.",
    explanation: "Florida law requires all children age 5 and younger to ride in a federally approved child restraint device. Children age 3 and younger must use an infant carrier or car seat. Children ages 4-5 may use a separate carrier, integrated seat, or seat belt. Children should be secured in the rear seat -- never in the front passenger seat, especially if the vehicle has an air bag. Never leave children unattended in a vehicle, especially in hot weather.",
    imageUrl: null,
  },
  {
    title: "Florida Speed Limits: The Complete Table",
    slug: "fl-speed-limit-table",
    topic: "speed-limits",
    stateCode: "FL",
    simpleLine: "Florida speed limits: Municipal/residential 30, limited-access highways 70, other roads 55, school zones 20.",
    explanation: "Florida standard speed limits: Municipal areas = 30 mph. Business or residential areas = 30 mph. Rural interstate/limited-access highways = 70 mph. All other roads and highways = 55 mph. School zones = 20 mph. Remember: the posted speed is the maximum for good conditions. You must slow down in rain, fog, heavy traffic, or poor road conditions. Driving too slowly is also illegal -- you can be ticketed for blocking traffic.",
    imageUrl: null,
  },
  {
    title: "Florida Right Turn on Red: Stop First, Then Go",
    slug: "fl-right-turn-on-red",
    topic: "right-of-way",
    stateCode: "FL",
    simpleLine: "You may turn right on red after a complete stop -- unless a sign says 'No Turn on Red.'",
    explanation: "In Florida, you may make a right turn at a red light after coming to a complete stop, as long as the way is clear and no sign prohibits it. Look for 'NO TURN ON RED' signs. You must yield to pedestrians and traffic with the green light. You may also turn left on red only when turning from a one-way street onto another one-way street, after a complete stop.",
    imageUrl: null,
  },
  {
    title: "Florida Open Intersections: Who Yields?",
    slug: "fl-open-intersections",
    topic: "right-of-way",
    stateCode: "FL",
    simpleLine: "At an intersection without signs or signals, yield to the vehicle on your right.",
    explanation: "An open intersection has no traffic signs or signals. You must yield if: a vehicle is already in the intersection, you enter a state highway from a secondary road, you enter a paved road from an unpaved road, or you plan to turn left and a vehicle is approaching from the opposite direction. When two cars arrive at the same time, the driver on the left must yield to the driver on the right. No one 'has' the right-of-way in Florida -- the law only says who must yield.",
    imageUrl: null,
  },
  {
    title: "Florida Blind Persons: White Cane Means Stop",
    slug: "fl-blind-persons-right-of-way",
    topic: "right-of-way",
    stateCode: "FL",
    simpleLine: "You must come to a complete stop when a pedestrian is using a white cane or guide dog.",
    explanation: "When a pedestrian is crossing guided by a dog or carrying a white cane (or white cane with red tip), all vehicles must come to a complete stop. This is Florida law, not just courtesy. Blind pedestrians rely on traffic sounds to know when it is safe to cross. Never honk at a person with a white cane -- it can confuse them. Wait until they have completely crossed before moving.",
    imageUrl: null,
  },
  {
    title: "Florida Turn Signals: Signal for the Last 100 Feet",
    slug: "fl-turn-signals",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "You must signal your turn for at least the last 100 feet before turning.",
    explanation: "Florida law requires you to signal at least 100 feet before making a turn. You may use hand signals or your vehicle's directional signals. For a right turn, approach in the right lane. For a left turn on a two-lane road, approach from the part of the right half nearest the center line. Slow down before reaching the crosswalk, not while in it. Finish your turn in the proper lane. If you miss your turn, go to the next intersection -- never make a last-minute turn.",
    imageUrl: null,
  },
  {
    title: "Florida Expressway Driving: How to Enter and Exit Safely",
    slug: "fl-expressway-driving",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "Use the acceleration lane to match highway speed, then merge when safe. Never stop on a ramp.",
    explanation: "Florida expressway entrances have three parts: entrance ramp, acceleration lane, and merging area. On the ramp, start checking for openings. In the acceleration lane, speed up to match traffic. Merge when safe -- you must yield to expressway traffic. Never stop on an acceleration lane unless traffic is too heavy. When exiting: get in the exit lane early, signal your intention, and slow down only after leaving the expressway. Never back up on a ramp. If you miss your exit, go to the next one.",
    imageUrl: '/handbook-illustrations/limited-access-highways.png',
  },
  {
    title: "Florida Parking Rules: Know the Distances",
    slug: "fl-parking-distances",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "No parking within 15 feet of a fire hydrant, 20 feet of an intersection, or 50 feet of a railroad crossing.",
    explanation: "Florida prohibits parking in these locations: within 15 feet of a fire hydrant, within 20 feet of an intersection, within 20 feet of a fire/ambulance station entrance, within 50 feet of a railroad crossing, within 30 feet of any stop sign or traffic signal, within 30 feet of a rural mailbox (8am-6pm), on crosswalks, sidewalks, bridges, or in front of driveways. You must park within 1 foot of the curb. Always park on the right side unless on a one-way street.",
    imageUrl: null,
  },
  {
    title: "Florida Emergency Handling: Tire Blowout",
    slug: "fl-tire-blowout",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "If a tire blows out: do not brake. Steer straight, slow down gradually, then pull off the road.",
    explanation: "If you have a tire blowout while driving: 1) Do NOT use your brakes. 2) Concentrate on steering -- keep the wheel steady. 3) Slow down gradually by taking your foot off the gas. 4) Brake softly only when the car is under control. 5) Pull completely off the pavement. For brake failure: pump the pedal hard and fast, shift to a lower gear, and apply the parking brake slowly. For a jammed gas pedal: shift to neutral, turn off the ignition (do not lock the steering), and brake.",
    imageUrl: null,
  },
  {
    title: "Florida Headlight Rules: When to Use Them",
    slug: "fl-headlight-rules",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "Use headlights between sunset and sunrise, and during any rain, smoke, or fog.",
    explanation: "Florida law requires you to use your low-beam or high-beam headlights between sunset and sunrise, and during any rain, smoke, or fog. Parking lights alone do not meet the law. High beams reveal objects 450+ feet ahead but must not be used within 500 feet of oncoming vehicles or within 300 feet of a vehicle you are following. Low beams are only effective for speeds up to 20-25 mph. When leaving a brightly lit area, drive slowly until your eyes adjust to darkness.",
    imageUrl: null,
  },
  {
    title: "Florida Funeral Processions: Yield and Do Not Interrupt",
    slug: "fl-funeral-processions",
    topic: "right-of-way",
    stateCode: "FL",
    simpleLine: "You must yield to funeral processions. Do not drive between vehicles in the procession.",
    explanation: "Pedestrians and drivers must yield the right-of-way to funeral processions. When the first vehicle lawfully enters an intersection, all other vehicles in the procession may follow. Vehicles in the procession must have their headlights on as a signal. Do not drive between or interfere with a funeral procession unless directed by a police officer.",
    imageUrl: null,
  },
  {
    title: "Florida Move Over Law: Slow Down for Emergency Vehicles",
    slug: "fl-move-over-law",
    topic: "right-of-way",
    stateCode: "FL",
    simpleLine: "Move over one lane for stopped emergency vehicles. If you can't, slow down to 20 mph below the limit.",
    explanation: "When approaching a law enforcement or emergency vehicle parked on the roadside with lights activated: on a multi-lane road, move over to the lane farthest from the vehicle as soon as safe. On a two-lane road, slow to 20 mph below the posted speed limit (or 5 mph if the limit is 20 or less). This law also applies to sanitation vehicles, tow trucks, and utility vehicles. Violation can result in fines and points on your license.",
    imageUrl: '/signs/emergency-vehicle.png',
  },
  {
    title: "Florida Railroad Crossings: Stop Within 15-50 Feet",
    slug: "fl-railroad-crossings",
    topic: "traffic-signs",
    stateCode: "FL",
    simpleLine: "Stop within 50 feet but not less than 15 feet from railroad tracks when signals are active.",
    explanation: "When approaching a railroad crossing with flashing lights, lowered gates, or a flagger warning: stop within 50 feet but not less than 15 feet from the nearest rail. Do not stop on the tracks or within 6 feet of either rail. Wait until the gate is fully raised and lights stop flashing before crossing. If there are multiple tracks, make sure all are clear. An average freight train at 30 mph needs more than half a mile to stop. If your car stalls on the tracks, get out immediately and move away -- toward the train but off the tracks.",
    imageUrl: '/signs/railroadcrossing.png',
  },
  {
    title: "Florida Sign Shapes: What Each Shape Means",
    slug: "fl-sign-shapes",
    topic: "traffic-signs",
    stateCode: "FL",
    simpleLine: "Octagon = stop. Triangle = yield. Diamond = warning. Pentagon = school. Round = railroad.",
    explanation: "Traffic sign shapes have specific meanings: Octagon (8 sides) = stop. Triangle (pointing down) = yield. Diamond = warning of hazards ahead. Pentagon (5 sides) = school zone or crossing. Round = railroad crossing ahead. Horizontal rectangle = guide or information. Vertical rectangle = regulatory (speed limits, no parking). Pennant = no passing zone (placed on left side of road). Colors also have meanings: red = stop/prohibition, yellow = warning, green = direction, orange = construction, blue = motorist services, brown = recreation areas.",
    imageUrl: null,
  },
  {
    title: "Florida Lane Signals: Red X Means Lane Closed",
    slug: "fl-lane-signals",
    topic: "traffic-signs",
    stateCode: "FL",
    simpleLine: "Red X = lane closed, do not drive in it. Green arrow = lane open. Yellow X = lane closing, exit safely.",
    explanation: "Lane signals are used when traffic direction changes during the day or to show which lanes are open or closed, such as at toll booths. A red X means the lane is closed -- never drive in it. A green downward arrow means the lane is open. A yellow X means the lane signal is about to change to red -- prepare to leave the lane safely. These are commonly found on reversible lanes and bridges.",
    imageUrl: null,
  },
  {
    title: "Florida Vehicle Equipment: What Your Car Must Have",
    slug: "fl-vehicle-equipment",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "Your car needs working brakes, headlights (high and low beam), taillights, horn, and tires with 2/32-inch tread.",
    explanation: "Florida requires these equipment standards: two braking systems (foot brake + parking brake), high-beam headlights visible 450 feet, low-beam visible 150 feet, two red taillights visible 1,000 feet, brake lights visible 300 feet in daytime, a horn audible from 200 feet, windshield wipers, and tires with at least 2/32-inch tread. Your windshield must be clear of unapproved stickers. Side windows cannot reflect more than 35% of light. If your car fails inspection, you cannot take the driving test.",
    imageUrl: null,
  },
  {
    title: "Florida ABS Brakes: Press Hard and Steer",
    slug: "fl-abs-brakes",
    topic: "safe-driving",
    stateCode: "FL",
    simpleLine: "With ABS brakes, press down hard on the pedal and hold it -- do not pump. Steer around the hazard.",
    explanation: "Anti-lock Braking Systems (ABS) prevent your wheels from locking during hard braking. With ABS: press the brake pedal down hard and hold it firmly -- do not pump the brakes. The system pumps the brakes for you, much faster than you could. While braking hard, you can steer around the hazard. If you release pressure or pump the pedal, you turn off the ABS. Check your dashboard for an ABS light when starting your car to confirm the system is working.",
    imageUrl: null,
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const lesson of FL_LESSONS) {
    // Check if already exists
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

  // Final count
  const flTotal = await prisma.microLesson.count({ where: { stateCode: 'FL' } });
  console.log('\n=== SUMMARY ===');
  console.log('Created: ' + created);
  console.log('Skipped: ' + skipped);
  console.log('Total FL lessons now: ' + flTotal);
}

main().then(() => prisma.$disconnect()).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
