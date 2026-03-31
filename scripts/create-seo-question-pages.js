const fs = require("fs");

const pageContent = fs.readFileSync("src/app/questions/[slug]/page.tsx", "utf8");
const existingSlugs = [...pageContent.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
console.log("Existing question pages: " + existingSlugs.length);

const newQuestions = [
  { q: "What is the speed limit in school zones?", a: "School zone speed limits vary by state, typically ranging from 15-25 mph. These limits are in effect during posted hours, usually 30 minutes before and after school, or when children are present. Fines are typically doubled in school zones.", topic: "Speed Limits", slug: "what-is-the-speed-limit-in-school-zones" },
  { q: "When driving at night, what should you do?", a: "Use low beam headlights in traffic, switch to high beams on dark roads with no oncoming traffic, dim high beams within 500 feet of oncoming vehicles, reduce speed, increase following distance, and avoid looking directly at oncoming headlights.", topic: "Safe Driving", slug: "when-driving-at-night-what-should-you-do" },
  { q: "When driving in fog, what should you do?", a: "Use low beam headlights (never high beams), reduce speed significantly, increase following distance, use lane markings as a guide, and avoid passing. If fog is too thick, pull off the road and turn on hazard lights.", topic: "Safe Driving", slug: "when-driving-in-fog-what-should-you-do" },
  { q: "When must you yield to pedestrians?", a: "You must yield to pedestrians at all marked and unmarked crosswalks, when turning at intersections, when entering or exiting driveways, and when pedestrians are using a white cane or guide dog. Pedestrians always have the right of way in crosswalks.", topic: "Right of Way", slug: "when-must-you-yield-to-pedestrians" },
  { q: "What should you do if your vehicle starts to skid?", a: "Take your foot off the gas, do not slam the brakes, and steer in the direction you want the front of the car to go. Once you regain traction, straighten the wheel. Remain calm and make smooth, gentle corrections.", topic: "Safe Driving", slug: "what-to-do-if-your-vehicle-skids" },
  { q: "How far from a fire hydrant must you park?", a: "You must park at least 15 feet from a fire hydrant in most states. This ensures fire trucks can access the hydrant in an emergency. Parking too close can result in a ticket or towing.", topic: "Speed Limits", slug: "how-far-from-fire-hydrant-must-you-park" },
  { q: "What is the BAC limit for drivers under 21?", a: "All states have zero tolerance laws for drivers under 21. Any detectable alcohol is illegal, with most states setting the limit at 0.00% or 0.02% BAC. Penalties include license suspension, fines, and mandatory alcohol education.", topic: "Alcohol & Substances", slug: "bac-limit-for-drivers-under-21" },
  { q: "How far from railroad tracks must you park?", a: "You must park at least 50 feet from a railroad crossing. When a train approaches, stop at least 15 feet from the nearest rail. Never stop on the tracks.", topic: "Speed Limits", slug: "how-far-from-railroad-tracks-must-you-park" },
  { q: "When entering a roundabout, who must you yield to?", a: "Yield to all traffic already inside the roundabout. Slow down, wait for a safe gap, enter and travel counterclockwise. Do not stop inside the roundabout. Signal right before your exit.", topic: "Right of Way", slug: "who-has-right-of-way-in-roundabout" },
  { q: "How far from an intersection must you park?", a: "Park at least 20 feet from a crosswalk and 30 feet from a traffic signal or stop sign. Parking too close blocks visibility for other drivers and pedestrians.", topic: "Speed Limits", slug: "how-far-from-intersection-must-you-park" },
  { q: "When should you reduce speed below the posted limit?", a: "Reduce speed in rain, fog, snow, ice, heavy traffic, construction zones, school zones, sharp curves, poor visibility, and near pedestrians. The basic speed law requires driving at a safe speed for conditions.", topic: "Speed Limits", slug: "when-to-reduce-speed-below-posted-limit" },
  { q: "What does an orange diamond-shaped sign mean?", a: "An orange diamond sign indicates a construction or work zone ahead. Slow down, watch for workers and equipment. Fines are typically doubled in active work zones.", topic: "Traffic Signs", slug: "what-does-an-orange-diamond-sign-mean" },
  { q: "When turning left, who must you yield to?", a: "When turning left, yield to oncoming traffic going straight or turning right, and to pedestrians in the crosswalk. Wait for a safe gap before completing your turn.", topic: "Right of Way", slug: "who-must-you-yield-to-when-turning-left" },
  { q: "What factors affect your stopping distance?", a: "Speed (doubling speed quadruples braking distance), road conditions, tire condition, vehicle weight, brake condition, driver reaction time, and whether you are going uphill or downhill.", topic: "Safe Driving", slug: "what-factors-affect-stopping-distance" },
  { q: "What should you do before changing lanes?", a: "Check rearview mirror, check side mirror, turn your head to check blind spot, signal, verify the gap is large enough, and move smoothly. Never change lanes in an intersection.", topic: "Safe Driving", slug: "what-to-do-before-changing-lanes" },
  { q: "What is the speed limit in residential areas?", a: "Typically 25-30 mph in most states. Watch for children, pets, parked cars, and pedestrians. Some states have 20 mph limits near parks and playgrounds.", topic: "Speed Limits", slug: "what-is-speed-limit-in-residential-areas" },
  { q: "What documents do you need at the DMV?", a: "Typically: proof of identity (birth certificate or passport), Social Security Number, proof of residency (two documents), completed application, fees, and proof of driver education if required. Requirements vary by state.", topic: "Licensing & Permits", slug: "what-documents-needed-for-dmv" },
  { q: "What happens if convicted of DUI?", a: "License suspension, fines ($500-$10,000+), possible jail time, mandatory alcohol education, ignition interlock device, permanent criminal record, and increased insurance rates. Penalties increase for repeat offenses.", topic: "Alcohol & Substances", slug: "what-happens-if-convicted-of-dui" },
  { q: "What does a flashing red traffic light mean?", a: "A flashing red light means the same as a stop sign. Come to a complete stop, yield to traffic and pedestrians, then proceed when safe. This is different from a flashing yellow, which means proceed with caution.", topic: "Traffic Signs", slug: "what-does-flashing-red-traffic-light-mean" },
  { q: "What does a flashing yellow traffic light mean?", a: "A flashing yellow light means slow down and proceed with caution. You do not need to stop, but be prepared to stop if necessary. Watch for cross traffic and pedestrians.", topic: "Traffic Signs", slug: "what-does-flashing-yellow-traffic-light-mean" },
];

let added = 0;
let entries = [];

for (const nq of newQuestions) {
  if (existingSlugs.includes(nq.slug)) {
    console.log("  Skip: " + nq.slug);
    continue;
  }
  
  const related = '["what-does-a-yellow-diamond-sign-mean","what-does-a-red-octagon-sign-mean","what-is-the-safe-following-distance"]';
  entries.push('  { slug: "' + nq.slug + '", q: "' + nq.q + '", a: "' + nq.a.replace(/"/g, '\\"') + '", topic: "' + nq.topic + '", related: ' + related + ' },');
  added++;
}

if (added > 0) {
  const marker = '  { slug: "what-does-a-yellow-diamond-sign-mean"';
  const idx = pageContent.indexOf(marker);
  const updated = pageContent.slice(0, idx) + entries.join("\n") + "\n" + pageContent.slice(idx);
  fs.writeFileSync("src/app/questions/[slug]/page.tsx", updated);
}

console.log("Added " + added + " new question pages");
console.log("Total: " + (existingSlugs.length + added));
