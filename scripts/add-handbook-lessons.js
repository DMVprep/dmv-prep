const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Update existing lessons with handbook images
const UPDATES = {
  "Hill Parking: Which Way to Turn Your Wheels": "/handbook-illustrations/hill-parking-downhill.png",
  "Stopping Distance = Reaction + Braking": "/handbook-illustrations/total-stopping-distance.png",
  "Check Blind Spots Before Every Lane Change": "/handbook-illustrations/blind-spots.png",
  "Night Driving: See and Be Seen": "/handbook-illustrations/night-driving-high-beams.png",
  "Always Yield to Emergency Vehicles": "/handbook-illustrations/no-zones-trucks.png",
};

// New lessons based on handbook illustrations
const NEW_LESSONS = [
  { topic: "traffic-signs", title: "Broken Yellow Line: Passing Allowed", simpleLine: "A broken yellow center line means you may pass when safe.",
    image: "/handbook-illustrations/broken-yellow-line.png",
    explain: "A broken yellow line on your side of the road means you may cross it to pass another vehicle, but only when it is safe to do so. You must be able to see far enough ahead and complete the pass before reaching any oncoming traffic or a solid yellow line." },
  { topic: "traffic-signs", title: "Solid Yellow Line: No Passing", simpleLine: "A solid yellow line on your side means do not cross — no passing allowed.",
    image: "/handbook-illustrations/double-yellow-solid-right.png",
    explain: "When the solid yellow line is on your side of the center, you are not allowed to pass. The solid line means there is not enough visibility or room to pass safely. If the broken line is on your side, you may pass. If both sides are solid, neither direction may pass." },
  { topic: "traffic-signs", title: "Double Yellow Lines: No Passing Either Direction", simpleLine: "Double solid yellow lines mean no vehicle may cross to pass.",
    image: "/handbook-illustrations/double-yellow-lines.png",
    explain: "Two solid yellow lines in the center of the road mean that passing is not allowed from either direction. You may cross double yellow lines only to turn left into a driveway, alley, or side street — never to pass another vehicle." },
  { topic: "traffic-signs", title: "White Lines Separate Same-Direction Traffic", simpleLine: "White lines separate lanes going the same direction. Yellow lines separate opposite directions.",
    image: "/handbook-illustrations/solid-white-line.png",
    explain: "White lines divide lanes of traffic moving in the same direction. A broken white line means you may change lanes. A solid white line means stay in your lane — lane changes are discouraged or prohibited. Yellow lines always separate traffic moving in opposite directions." },
  { topic: "traffic-signs", title: "Center Turn Lane: Left Turns Only", simpleLine: "The center turn lane is shared by both directions — use it only for turning left.",
    image: "/handbook-illustrations/center-turn-lane.png",
    explain: "A center turn lane is marked with solid and broken yellow lines. Vehicles from both directions use this lane to make left turns. Do not use it as a travel lane or to pass other vehicles. Enter the lane no more than 200 feet before your turn." },
  { topic: "traffic-signs", title: "Green Light: Go If Clear", simpleLine: "A green light means you may go — but you must still yield to traffic and pedestrians already in the intersection.",
    image: "/handbook-illustrations/green-light.png",
    explain: "A steady green light means you may proceed through the intersection. However, you must still yield to vehicles and pedestrians already in the intersection. When turning left on green, yield to oncoming traffic." },
  { topic: "traffic-signs", title: "Yellow Light: Stop If You Can", simpleLine: "A yellow light means the light is about to turn red — stop if you can do so safely.",
    image: "/handbook-illustrations/yellow-light.png",
    explain: "A steady yellow light warns that the green light is ending and the light will turn red. If you can stop safely before the intersection, you should stop. If you are already in the intersection or too close to stop safely, proceed through with caution." },
  { topic: "traffic-signs", title: "Red Light: Stop Completely", simpleLine: "A red light means stop and stay stopped until the light turns green.",
    image: "/handbook-illustrations/red-light.png",
    explain: "A steady red light means you must come to a complete stop before the stop line or crosswalk. Remain stopped until the light turns green. In most states, you may turn right on red after stopping completely and yielding to pedestrians and traffic — unless a sign says No Turn On Red." },
  { topic: "traffic-signs", title: "Flashing Red Light = Stop Sign", simpleLine: "A flashing red light means treat it like a stop sign — stop completely, then proceed when safe.",
    image: "/handbook-illustrations/flashing-red-light.png",
    explain: "A flashing red traffic light has the same meaning as a stop sign. Come to a complete stop, yield to traffic and pedestrians, then proceed when the intersection is clear. This is different from a flashing yellow light, which means slow down and proceed with caution." },
  { topic: "traffic-signs", title: "Flashing Yellow Light: Proceed With Caution", simpleLine: "A flashing yellow light means slow down and watch for hazards — you do not need to stop.",
    image: "/handbook-illustrations/flashing-yellow-light.png",
    explain: "A flashing yellow light warns you to slow down and be especially careful. You do not need to stop (unlike a flashing red light), but you should reduce speed and be prepared to stop if necessary. These are often used at intersections or pedestrian crossings." },
  { topic: "safe-driving", title: "Following Distance for Large Trucks", simpleLine: "Stay further back behind trucks — they block your view and need more room to stop.",
    image: "/handbook-illustrations/following-distance-trucks.png",
    explain: "When following a large truck, increase your following distance beyond the normal rule. Trucks block your view of the road ahead, take longer to stop, and have large blind spots. If you cannot see the truck driver in their side mirror, they cannot see you." },
  { topic: "safe-driving", title: "Truck No-Zones: Stay Out of Blind Spots", simpleLine: "Trucks have huge blind spots on all four sides — avoid lingering in them.",
    image: "/handbook-illustrations/no-zones-trucks.png",
    explain: "Large trucks have blind spots (no-zones) on all four sides that are much larger than a car. The biggest no-zones are on the right side and directly behind the truck. If you cannot see the truck driver in their side mirror, they cannot see you. Pass trucks quickly and never linger alongside them." },
  { topic: "safe-driving", title: "Three-Point Turn: How to Turn Around", simpleLine: "A three-point turn lets you reverse direction on a narrow road.",
    image: "/handbook-illustrations/three-point-turn.png",
    explain: "When you need to turn around on a narrow road: 1) Signal right and pull close to the right curb, 2) Signal left, check traffic, and turn the wheel sharply left while moving forward, 3) Stop before reaching the opposite curb, 4) Shift to reverse and back up while turning the wheel right, 5) Shift to drive and complete the turn. Only do this when there is no other option and traffic is clear." },
  { topic: "safe-driving", title: "How to Pass Safely", simpleLine: "Only pass when you can see far enough ahead and complete the pass safely.",
    image: "/handbook-illustrations/passing.png",
    explain: "Before passing: check mirrors and blind spots, signal left, and make sure you have enough clear road ahead to complete the pass. Accelerate quickly past the vehicle, signal right, and return to your lane when you can see both headlights of the passed vehicle in your rearview mirror. Never pass on hills, curves, intersections, or where marked with solid lines." },
  { topic: "safe-driving", title: "Roundabouts: Yield and Go Counterclockwise", simpleLine: "Yield to traffic already in the roundabout — always go counterclockwise.",
    image: "/handbook-illustrations/roundabouts.png",
    explain: "When entering a roundabout: slow down, yield to vehicles already in the circle, and enter when there is a safe gap. Always travel counterclockwise (to your right). Do not stop inside the roundabout. Signal right before your exit. If you miss your exit, continue around again." },
  { topic: "safe-driving", title: "School Bus Rules: When to Stop", simpleLine: "Stop for school buses with flashing red lights — children may be crossing.",
    image: "/handbook-illustrations/school-bus-two-lanes.png",
    explain: "When a school bus displays flashing red lights and extends its stop arm, all traffic in both directions must stop. The only exception is on a divided highway with a physical barrier (like a median) — oncoming traffic on the other side does not need to stop. Never pass a stopped school bus. Wait until the lights stop flashing and the stop arm is retracted before proceeding." },
];

async function main() {
  // Update existing lessons
  let updated = 0;
  for (const [title, imageUrl] of Object.entries(UPDATES)) {
    const result = await prisma.microLesson.updateMany({
      where: { title, imageUrl: null },
      data: { imageUrl },
    });
    if (result.count > 0) { updated++; console.log("  Updated: " + title); }
  }

  // Create new lessons
  let created = 0;
  for (const lesson of NEW_LESSONS) {
    const existing = await prisma.microLesson.findFirst({ where: { title: lesson.title } });
    if (existing) { console.log("  Skipped: " + lesson.title); continue; }

    const slug = lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    await prisma.microLesson.create({
      data: {
        slug, topic: lesson.topic, title: lesson.title,
        simpleLine: lesson.simpleLine, explanation: lesson.explain,
        imageUrl: lesson.image, stateCode: null,
      },
    });
    created++;
    console.log("  Created: " + lesson.title + " [IMG]");
  }

  const total = await prisma.microLesson.count();
  const withImages = await prisma.microLesson.count({ where: { imageUrl: { not: null } } });
  console.log("\nUpdated " + updated + ", Created " + created);
  console.log("Total lessons: " + total + " (" + withImages + " with images)");
}

main().then(() => prisma.$disconnect());
