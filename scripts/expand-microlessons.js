const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

const envFile = fs.readFileSync(".env.local", "utf8");
const matchKey = envFile.match(/ANTHROPIC_API_KEY=["']?([^"'\n]+)/);
const API_KEY = matchKey ? matchKey[1] : "";

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content && data.content[0] ? data.content[0].text : "";
}

// New lessons to create — universal + with sign images where applicable
const NEW_LESSONS = [
  // SIGN-BASED (with images from /signs/)
  { topic: "traffic-signs", title: "Stop Sign: Come to a Complete Stop", simpleLine: "A stop sign means come to a full and complete stop — not a rolling stop.", image: "/signs/stop.png",
    explain: "When you see a red octagonal stop sign, you must bring your vehicle to a complete stop before the stop line, crosswalk, or intersection. Look left, right, then left again before proceeding. Rolling through a stop sign is illegal and dangerous." },
  { topic: "traffic-signs", title: "Yield Sign: Slow Down and Give Way", simpleLine: "Yield means slow down and let others go first.", image: "/signs/yield.png",
    explain: "A yield sign is a red and white triangle pointing down. It means slow down, be prepared to stop, and give the right of way to vehicles and pedestrians already in the intersection or approaching from another direction." },
  { topic: "traffic-signs", title: "Do Not Enter: Wrong Direction", simpleLine: "A Do Not Enter sign means you are heading into oncoming traffic.", image: "/signs/do-not-enter.png",
    explain: "This red and white sign is placed at highway exit ramps and one-way streets. If you see this sign, you are going the wrong way. Stop immediately and turn around safely. Driving past this sign puts you directly in the path of oncoming traffic." },
  { topic: "traffic-signs", title: "Wrong Way: Turn Around Immediately", simpleLine: "A Wrong Way sign confirms you are driving against traffic.", image: "/signs/wrong-way.png",
    explain: "This sign is placed further down a one-way road or exit ramp to warn drivers who missed the Do Not Enter sign. If you see this, pull over safely and turn around. You are in extreme danger of a head-on collision." },
  { topic: "traffic-signs", title: "Railroad Crossing: Look and Listen", simpleLine: "Railroad crossings are one of the most dangerous places on the road.", image: "/signs/railroadcrossing.png",
    explain: "When approaching a railroad crossing, slow down and look both ways. If lights are flashing or gates are down, stop at least 15 feet from the nearest rail. Never try to beat a train — trains cannot stop quickly and are wider than the tracks." },
  { topic: "traffic-signs", title: "School Zone: Slow Down for Children", simpleLine: "School zones have lower speed limits because children are unpredictable.", image: "/signs/school-zone.png",
    explain: "When you see a school zone sign, reduce your speed to the posted school zone limit (usually 15-25 mph depending on your state). Watch for children crossing, school buses, and crossing guards. Fines are typically doubled in school zones." },
  { topic: "traffic-signs", title: "Work Zone: Fines Doubled, Workers Present", simpleLine: "Slow down in work zones — fines are doubled and workers are at risk.", image: "/signs/work-zone.png",
    explain: "Orange signs indicate a construction or work zone ahead. Reduce your speed, follow posted signs, and watch for workers and equipment. Speeding fines are typically doubled in active work zones. Merge early when lanes are closed." },
  { topic: "traffic-signs", title: "Pedestrian Crossing: Always Yield to Walkers", simpleLine: "Pedestrians in a crosswalk always have the right of way.", image: "/signs/pedestrian-crossing.png",
    explain: "When you see this sign, watch for people crossing the road. You must yield to pedestrians in marked and unmarked crosswalks. Do not pass vehicles stopped at a crosswalk — they may be yielding to a pedestrian you cannot see." },
  { topic: "traffic-signs", title: "Merging Traffic: Adjust Your Speed", simpleLine: "When traffic merges, adjust speed and make room for vehicles entering.", image: "/signs/merging-traffic.png",
    explain: "This sign warns that traffic from another road is about to join your lane. When you see it, be prepared to adjust your speed and position. If you are merging, match the speed of traffic and signal before entering the lane." },
  { topic: "traffic-signs", title: "Slippery When Wet: Reduce Speed", simpleLine: "Wet roads can double your stopping distance.", image: "/signs/slippery-surface.png",
    explain: "This yellow warning sign means the road surface becomes slippery when wet. Reduce your speed, increase your following distance, and avoid sudden braking or sharp turns. Hydroplaning can occur when your tires lose contact with the road." },

  // SAFE DRIVING (no image needed — text-based concepts)
  { topic: "safe-driving", title: "Stopping Distance = Reaction + Braking", simpleLine: "The faster you go, the longer it takes to stop — it is not just about braking.",
    explain: "Total stopping distance has two parts: reaction distance (how far you travel while your brain processes the danger) and braking distance (how far you travel after applying the brakes). At 30 mph, total stopping distance is about 90 feet. At 60 mph, it jumps to over 300 feet. Doubling your speed quadruples your braking distance." },
  { topic: "safe-driving", title: "Check Blind Spots Before Every Lane Change", simpleLine: "Mirrors cannot show you everything — always turn your head.",
    explain: "Every vehicle has blind spots — areas on the sides that mirrors cannot cover. Before changing lanes: 1) Check your rearview mirror, 2) Check your side mirror, 3) Turn your head to check the blind spot, 4) Signal, 5) Change lanes smoothly. Skipping the head check is one of the most common causes of lane-change accidents." },
  { topic: "safe-driving", title: "Night Driving: See and Be Seen", simpleLine: "At night, your visibility drops dramatically — slow down and use lights properly.",
    explain: "At night, reduce your speed because you cannot see as far ahead. Use low beams in traffic and fog. Switch to high beams on dark roads with no oncoming traffic. Dim your high beams within 500 feet of oncoming vehicles. Avoid looking directly at oncoming headlights — look toward the right edge of the road." },
  { topic: "safe-driving", title: "Distracted Driving Kills", simpleLine: "Taking your eyes off the road for 5 seconds at 55 mph means driving blind for a football field.",
    explain: "Distracted driving includes texting, eating, adjusting the radio, or talking to passengers. Texting is the most dangerous because it takes your eyes, hands, and mind off driving. At 55 mph, looking at your phone for 5 seconds means traveling the length of a football field without looking at the road. Put your phone away or use hands-free only." },
  { topic: "safe-driving", title: "Hill Parking: Which Way to Turn Your Wheels", simpleLine: "Turn wheels toward the curb when downhill, away from the curb when uphill.",
    explain: "When parking on a hill: DOWNHILL with a curb — turn wheels toward the curb (right). UPHILL with a curb — turn wheels away from the curb (left). NO CURB (up or down) — turn wheels toward the edge of the road (right). Memory trick: Uphill = away, Downhill = toward, No curb = always right." },
  { topic: "safe-driving", title: "Hydroplaning: What to Do", simpleLine: "If your car hydroplanes, ease off the gas — do not brake hard or turn sharply.",
    explain: "Hydroplaning happens when your tires ride on a film of water instead of the road. It can happen at speeds as low as 35 mph. If you hydroplane: 1) Take your foot off the gas, 2) Do not brake hard, 3) Do not turn the steering wheel sharply, 4) Steer straight or gently in the direction you want to go. To prevent it: slow down in rain and replace worn tires." },

  // RIGHT OF WAY
  { topic: "right-of-way", title: "Four-Way Stop: First to Arrive Goes First", simpleLine: "At a four-way stop, the first vehicle to stop goes first. If tied, yield to the right.",
    explain: "When two or more vehicles arrive at a four-way stop at the same time, the vehicle on the right goes first. If you are facing another vehicle and both want to go straight, both may proceed. If one vehicle wants to turn left, it must yield to the vehicle going straight." },
  { topic: "right-of-way", title: "Always Yield to Emergency Vehicles", simpleLine: "When you hear a siren, pull to the right and stop.",
    explain: "When an emergency vehicle approaches with lights and siren, you must pull over to the right side of the road and come to a complete stop. Remain stopped until the emergency vehicle has passed. If you are in an intersection, clear it first, then pull over. Never follow within 500 feet of an emergency vehicle." },

  // ALCOHOL
  { topic: "alcohol-dui", title: "BAC 0.08% = Illegal for Adults", simpleLine: "One drink can impair your driving — the legal limit is lower than you think.",
    explain: "The legal blood alcohol content (BAC) limit is 0.08% for drivers 21 and older in most states (0.05% in Utah). For drivers under 21, any alcohol is illegal (zero tolerance). For commercial drivers, the limit is 0.04%. Even one drink can slow your reaction time. The only way to sober up is time — coffee, cold showers, and fresh air do not work." },
  { topic: "alcohol-dui", title: "Implied Consent: You Already Agreed to the Test", simpleLine: "By driving, you already agreed to take a BAC test if asked by police.",
    explain: "Every state has an implied consent law. This means that by driving on public roads, you automatically consent to a chemical test (breath, blood, or urine) if a law enforcement officer suspects you of DUI. Refusing the test results in automatic license suspension — even if you are not over the limit." },

  // LICENSING
  { topic: "licensing-permits", title: "Always Carry Proof of Insurance", simpleLine: "Driving without insurance is illegal in nearly every state.",
    explain: "You must carry proof of auto insurance whenever you drive. If you are stopped by police or involved in an accident and cannot show proof of insurance, you face fines, license suspension, and even vehicle impoundment. Most states require minimum liability coverage — check your state's specific requirements." },
  { topic: "licensing-permits", title: "Child Safety Seats Save Lives", simpleLine: "Children must be in the right seat for their age, weight, and height.",
    explain: "All states require children to be properly restrained. General guidelines: Rear-facing car seat until at least age 2. Forward-facing car seat with harness until about age 5 or 40+ pounds. Booster seat until about 4 feet 9 inches tall (usually ages 8-12). Children under 13 should always ride in the back seat. Check your state for specific laws." },
  { topic: "licensing-permits", title: "Hit and Run: You Must Stop", simpleLine: "Leaving the scene of an accident is a serious crime — always stop.",
    explain: "If you are involved in any accident, you must stop immediately. Exchange information with the other driver (name, address, license, insurance, registration). If someone is injured, call 911. If property is damaged and the owner is not present, leave a note with your information. Leaving the scene is a criminal offense that can result in felony charges, jail time, and permanent license revocation." },
];

async function main() {
  let created = 0;

  for (const lesson of NEW_LESSONS) {
    // Check if similar lesson already exists
    const existing = await prisma.microLesson.findFirst({
      where: { title: lesson.title }
    });
    if (existing) {
      console.log("  Skipped (exists): " + lesson.title);
      continue;
    }

    const slug = lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

    await prisma.microLesson.create({
      data: {
        slug: slug,
        topic: lesson.topic,
        title: lesson.title,
        simpleLine: lesson.simpleLine,
        explanation: lesson.explain,
        imageUrl: lesson.image || null,
        stateCode: null, // Universal
      },
    });
    created++;
    console.log("  Created: " + lesson.title + (lesson.image ? " [IMG]" : ""));
  }

  const total = await prisma.microLesson.count();
  const withImages = await prisma.microLesson.count({ where: { imageUrl: { not: null } } });
  console.log("\nCreated " + created + " new micro lessons");
  console.log("Total lessons: " + total + " (" + withImages + " with images)");
}

main().then(() => prisma.$disconnect());
