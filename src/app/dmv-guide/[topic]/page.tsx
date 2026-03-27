// src/app/dmv-guide/[topic]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, AlertTriangle, BookOpen, HelpCircle } from "lucide-react";

interface Props { params: { topic: string } }

interface DMVQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TopicPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  sections: { heading: string; content: string }[];
  keyFacts: string[];
  questions: DMVQuestion[];
  relatedLinks: { href: string; label: string }[];
}

const TOPICS: TopicPage[] = [
  {
    slug: "what-does-stop-sign-mean",
    title: "What Does a Stop Sign Mean?",
    metaTitle: "What Does a Stop Sign Mean? — Complete DMV Guide",
    metaDesc: "Learn exactly what a stop sign means, when you must stop, and what the law requires. Includes example DMV test questions.",
    intro: "A stop sign is one of the most recognized signs in the world — but many drivers don\'t fully understand the legal requirements behind it. This guide explains exactly what the law requires when you encounter a stop sign.",
    sections: [
      { heading: "What the Stop Sign Means", content: "A stop sign is a red, octagonal sign with white lettering. When you see a stop sign, you are legally required to bring your vehicle to a complete stop — meaning zero miles per hour. You must stop before the stop line painted on the road. If there is no stop line, you must stop before the crosswalk. If there is no crosswalk, stop at the nearest point where you have a clear view of intersecting traffic. A rolling stop — sometimes called a \'California stop\' — is illegal and can result in a traffic citation." },
      { heading: "What to Do After Stopping", content: "After coming to a complete stop, you must yield the right-of-way to all vehicles and pedestrians that are in or approaching the intersection. Only proceed when it is safe to do so. At an intersection with a stop sign, vehicles proceed in the order they arrived. If two vehicles arrive at the same time, the driver on the left must yield to the driver on the right." },
      { heading: "All-Way Stop Signs", content: "Some intersections have stop signs on all approaches — these are called all-way stops or 4-way stops. At an all-way stop, all vehicles must stop and then take turns proceeding through the intersection in the order they arrived. If vehicles arrive at the same time, the vehicle on the right has the right-of-way. Never assume another driver will yield — always make eye contact before proceeding." },
      { heading: "Stop Sign Colors and Shapes", content: "Stop signs are always red and octagonal (8-sided). This distinctive shape means you can recognize it even if the lettering is obscured by snow or dirt. No other sign uses this shape, making it immediately identifiable. The white border and reflective material ensure visibility at night." }
    ],
    keyFacts: ["You must come to a complete stop — zero mph", "Stop before the stop line, crosswalk, or intersection edge", "Yield to all vehicles and pedestrians before proceeding", "At 4-way stops, the first vehicle to arrive goes first", "If two vehicles arrive simultaneously, the one on the right goes first", "A rolling stop is illegal and ticketable"],
    questions: [
      { question: "When approaching a stop sign, you must:", options: ["Slow down to 5 mph and proceed if clear", "Come to a complete stop before the stop line", "Stop only if other vehicles are present", "Yield to oncoming traffic without stopping"], correct: 1, explanation: "You must always come to a complete stop at a stop sign, regardless of whether other vehicles are present. A rolling slow-down is not a legal stop." },
      { question: "At a 4-way stop, two cars arrive at the same time from opposite directions. Who goes first?", options: ["The car going straight has the right-of-way", "The car turning left has the right-of-way", "Either driver may proceed at the same time", "The car on the right has the right-of-way"], correct: 3, explanation: "When vehicles arrive at a 4-way stop simultaneously, the driver on the right has the right-of-way." },
      { question: "If there is no stop line at a stop sign, where should you stop?", options: ["In the middle of the intersection", "Before the crosswalk or at the edge of the intersection", "10 feet before the sign", "Wherever is convenient"], correct: 1, explanation: "Without a stop line, stop before the crosswalk. Without a crosswalk, stop at the point nearest the intersecting roadway where you have a clear view." }
    ],
    relatedLinks: [{ href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules at Intersections" }, { href: "/dmv-guide/yield-sign-meaning", label: "What Does a Yield Sign Mean?" }, { href: "/state/florida/road-sign-practice-test", label: "Florida Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "Florida DMV Practice Test" }]
  },
  {
    slug: "yield-sign-meaning",
    title: "What Does a Yield Sign Mean?",
    metaTitle: "Yield Sign Meaning — What It Means and When to Stop",
    metaDesc: "Understand exactly what a yield sign means, when you must slow down or stop, and how it differs from a stop sign. DMV test questions included.",
    intro: "The yield sign is often misunderstood. Many drivers treat it as optional or assume it only applies when traffic is heavy. In reality, the yield sign has specific legal requirements that every driver must understand to pass the DMV test and drive safely.",
    sections: [
      { heading: "What a Yield Sign Looks Like", content: "A yield sign is a downward-pointing triangle with a red border and red text on a white background. The distinctive triangular shape means you can identify it even from a distance. It is the only sign with this inverted triangle shape, making it unmistakable." },
      { heading: "What Yield Means", content: "When you see a yield sign, you must slow down and give the right-of-way to vehicles and pedestrians in or approaching the intersection or road you are entering. You must be prepared to stop — but you do not have to stop if the way is clear. The key difference from a stop sign: you must stop only if necessary to avoid a conflict with other traffic." },
      { heading: "Common Yield Sign Locations", content: "Yield signs appear at roundabout entrances, where a secondary road merges onto a main road, at freeway on-ramps, at T-intersections, and at crosswalks for pedestrians. At roundabouts, you must yield to vehicles already circulating inside the roundabout before you enter." },
      { heading: "Yield vs. Stop — Key Differences", content: "At a stop sign, you must always come to a complete stop regardless of traffic. At a yield sign, you may proceed without stopping if the way is completely clear — but you must slow down and be ready to stop if needed. Failing to yield when required is a moving violation and can cause serious accidents." }
    ],
    keyFacts: ["Yield signs are downward-pointing triangles with red borders", "You must slow down and give right-of-way to other traffic", "You do not have to stop if the road is completely clear", "You must stop if stopping is necessary to avoid a crash", "At roundabouts, always yield to vehicles already inside", "Failure to yield is a moving violation"],
    questions: [
      { question: "What does a yield sign require you to do?", options: ["Always come to a complete stop", "Slow down and give right-of-way; stop only if necessary", "Proceed at normal speed if no cars are visible", "Stop and wait for a green light"], correct: 1, explanation: "A yield sign means slow down, give right-of-way to traffic in the intersection, and stop only if necessary to avoid a crash. You don\'t have to stop if the way is clear." },
      { question: "A yield sign is shaped like:", options: ["A red octagon", "A yellow diamond", "A downward-pointing triangle", "A white rectangle"], correct: 2, explanation: "Yield signs are uniquely shaped as downward-pointing (inverted) triangles with a red border and red text on white background." },
      { question: "At a roundabout with a yield sign, you must yield to:", options: ["Vehicles entering from the right", "Vehicles already circulating inside the roundabout", "Pedestrians only", "No one — proceed immediately"], correct: 1, explanation: "At roundabout entrances, you must yield to all vehicles already circulating inside the roundabout before you enter." }
    ],
    relatedLinks: [{ href: "/dmv-guide/what-does-stop-sign-mean", label: "What Does a Stop Sign Mean?" }, { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "right-of-way-rules",
    title: "Right-of-Way Rules at Intersections",
    metaTitle: "Right-of-Way Rules — Complete Guide for DMV Test",
    metaDesc: "Master right-of-way rules at intersections, 4-way stops, roundabouts, and more. Essential knowledge for your DMV test.",
    intro: "Right-of-way rules determine who goes first when two vehicles meet. They don\'t give you the legal right to proceed regardless — they tell you who must yield. Understanding these rules is critical for both passing your DMV test and avoiding accidents.",
    sections: [
      { heading: "The Basic Rule", content: "Right-of-way laws tell drivers who must yield — give up their turn — in different situations. Importantly, having the right-of-way does not mean you can proceed recklessly. Every driver must do everything possible to avoid a crash, even if they legally have the right-of-way." },
      { heading: "At Uncontrolled Intersections", content: "At intersections with no signs or signals, yield to the vehicle that arrives first. If two vehicles arrive at the same time, yield to the vehicle on your right. This is sometimes called the \'right-hand rule.\' Always slow down when approaching an uncontrolled intersection." },
      { heading: "At Stop Signs", content: "At a 4-way stop, vehicles proceed in the order they arrive. If two vehicles arrive simultaneously, the driver on the left yields to the driver on the right. A vehicle going straight has priority over a vehicle turning left. A vehicle turning right has priority over a vehicle turning left." },
      { heading: "Turning Left", content: "When turning left at an intersection, you must yield to all oncoming traffic going straight or turning right. Left-turning vehicles must wait for a safe gap in traffic before completing the turn. This is one of the most common right-of-way mistakes — never assume oncoming traffic will stop or slow for you." },
      { heading: "Pedestrians and Cyclists", content: "You must always yield to pedestrians in marked or unmarked crosswalks. Even if a pedestrian crosses against the light, you are required to avoid hitting them. Bicyclists in bike lanes have the right-of-way over turning vehicles. Always check for cyclists before making turns." }
    ],
    keyFacts: ["At uncontrolled intersections, yield to vehicles on your right", "At 4-way stops, first to arrive proceeds first", "Left-turning vehicles must yield to oncoming traffic", "Always yield to pedestrians in crosswalks", "Emergency vehicles with sirens always have the right-of-way", "Having right-of-way does not mean you can drive unsafely"],
    questions: [
      { question: "At an intersection with no signs or signals, you must yield to:", options: ["Vehicles approaching from the left", "Vehicles approaching from the right", "All vehicles regardless of direction", "No one — proceed at normal speed"], correct: 1, explanation: "At uncontrolled intersections, if two vehicles arrive at the same time, the driver on the left yields to the driver on the right." },
      { question: "When turning left at a green light, you must yield to:", options: ["Nothing — green means go", "Pedestrians only", "Oncoming traffic going straight or turning right", "Vehicles behind you"], correct: 2, explanation: "Left-turning vehicles must always yield to oncoming traffic traveling straight or turning right, even at a green light." },
      { question: "A pedestrian is crossing mid-block outside a crosswalk. You must:", options: ["Proceed — they are jaywalking", "Honk to warn them", "Yield to avoid hitting them", "Speed up to clear the area quickly"], correct: 2, explanation: "You must always yield to pedestrians to avoid a collision, even if they are crossing illegally. Every driver must do everything possible to avoid a crash." }
    ],
    relatedLinks: [{ href: "/dmv-guide/what-does-stop-sign-mean", label: "Stop Sign Rules" }, { href: "/dmv-guide/yield-sign-meaning", label: "Yield Sign Meaning" }, { href: "/driving-rules/right-of-way", label: "Right-of-Way Diagram" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "lane-markings-explained",
    title: "Lane Markings Explained — Lines, Colors and Meanings",
    metaTitle: "Lane Markings Explained — Road Lines and Colors Guide",
    metaDesc: "Learn what every road line and lane marking means — white, yellow, solid, dashed, double lines. Essential for your DMV test.",
    intro: "Road markings communicate rules that every driver must follow. Understanding the difference between white and yellow lines, solid and dashed lines, and double lines is essential for your DMV test and for driving safely every day.",
    sections: [
      { heading: "Yellow Lines — Divide Opposite Traffic", content: "Yellow lines separate traffic flowing in opposite directions. A solid yellow line on your side of the road means you may not cross it to pass. A broken yellow line means passing is allowed when safe. Double solid yellow lines mean no passing from either direction — these appear on roads where passing is dangerous due to curves, hills, or limited visibility." },
      { heading: "White Lines — Same Direction Traffic", content: "White lines separate traffic moving in the same direction. Dashed white lines between lanes mean you may change lanes when safe to do so. Solid white lines indicate you should stay in your lane — they appear at intersections, on exit ramps, and near bike lanes. A solid white line at an intersection marks the stop line where you must stop." },
      { heading: "Double Yellow Lines", content: "Double solid yellow lines are painted on roads where passing is prohibited in both directions. You may not cross double yellow lines to pass another vehicle. However, you may cross double yellow lines to make a left turn into a driveway or side street, as long as it is safe to do so." },
      { heading: "Center Turn Lanes", content: "A center turn lane is marked with yellow lines and left-turn arrows pointing in both directions. Drivers from either direction may use it only for turning left. You must not use the center turn lane for passing or as a travel lane. Enter the center turn lane only when you are ready to turn." },
      { heading: "Edge Lines and Special Markings", content: "White edge lines mark the right side of the road. Yellow edge lines appear on the left side of divided highways. Raised pavement markers (reflectors) echo the color system: white between same-direction lanes, yellow on divided highways, and red on the wrong side of divided roads to warn you if you\'re going the wrong way." }
    ],
    keyFacts: ["Yellow lines divide traffic going in opposite directions", "White lines divide traffic going in the same direction", "Dashed lines = lane changes or passing allowed when safe", "Solid lines = stay in your lane", "Double solid yellow = no passing from either direction", "Center turn lanes are for turning left only — not passing"],
    questions: [
      { question: "A solid yellow line on your side of the road means:", options: ["You may pass if the road ahead is clear", "Passing is not allowed from your side", "Slow down — school zone ahead", "One-way traffic only"], correct: 1, explanation: "A solid yellow line on your side means you may not cross it to pass. Only a broken yellow line permits passing when safe." },
      { question: "White dashed lines between lanes of traffic mean:", options: ["Do not change lanes", "You may change lanes when safe", "Bike lane ahead", "Construction zone"], correct: 1, explanation: "Dashed white lines separate same-direction lanes and indicate that lane changes are permitted when it is safe to do so." },
      { question: "You may cross double solid yellow lines to:", options: ["Pass a slow vehicle", "Make a left turn into a driveway", "Drive in the center turn lane", "Never — it is always illegal"], correct: 1, explanation: "You may cross double solid yellow lines only to turn left into a driveway or side street when it is safe. Passing is never allowed across double solid yellow lines." }
    ],
    relatedLinks: [{ href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/dmv-guide/no-passing-zone-meaning", label: "No Passing Zone Rules" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "how-to-pass-dmv-test",
    title: "How to Pass Your DMV Test — Complete Study Guide",
    metaTitle: "How to Pass the DMV Test — Study Tips and Strategy Guide",
    metaDesc: "Proven tips to pass your DMV written test on the first try. Study strategy, common mistakes to avoid, and free practice tests.",
    intro: "Most people who fail the DMV written test do so because they studied the wrong way — memorizing random facts instead of understanding the rules. This guide gives you a proven strategy to pass on your first attempt.",
    sections: [
      { heading: "Step 1: Read the Driver\'s Handbook", content: "The DMV test is taken directly from your state\'s official driver\'s handbook. Every question on the test is based on information in that handbook. Read it cover to cover at least once before you start practicing. Pay special attention to chapters on traffic signs, right-of-way rules, speed limits, and alcohol/drug laws — these make up the majority of test questions." },
      { heading: "Step 2: Take Practice Tests Daily", content: "After reading the handbook, start taking practice tests. Research consistently shows that active recall — testing yourself — is far more effective than re-reading. Take at least 3-5 practice tests before your actual test. Focus on questions you get wrong and review the explanation for each one. Aim for a consistent score of 90% or higher before scheduling your test." },
      { heading: "Step 3: Know the Most Tested Topics", content: "Certain topics appear on almost every DMV test: traffic sign shapes and colors, right-of-way rules at intersections and 4-way stops, speed limits in school zones and residential areas, blood alcohol content laws, safe following distance, and what to do at railroad crossings. Make sure you can answer questions on all of these topics confidently." },
      { heading: "Step 4: Understand — Don\'t Memorize", content: "The DMV test often phrases questions differently from how they appear in the handbook. If you understand the rule rather than memorize a specific sentence, you\'ll be able to answer any variation. Ask yourself \'why\' for every rule — understanding the reasoning behind traffic laws makes them much easier to remember." },
      { heading: "Test Day Tips", content: "Get a good night\'s sleep before your test. Bring all required documents — check your state\'s DMV website for the exact list. Read each question carefully; DMV questions often include words like \'always,\' \'never,\' \'must,\' and \'should\' that change the correct answer. If you\'re unsure, eliminate obviously wrong answers first. Don\'t change your answer unless you\'re certain — your first instinct is often correct." }
    ],
    keyFacts: ["Read the full driver\'s handbook before practicing", "Take at least 5 full practice tests before your real test", "Aim for 90%+ on practice tests before scheduling", "Focus on: signs, right-of-way, speed limits, alcohol laws", "Understand the rules — don\'t just memorize answers", "Most states require 80% or higher to pass"],
    questions: [
      { question: "What is the most effective way to study for the DMV written test?", options: ["Read the handbook once the night before", "Memorize all the answers to practice tests", "Read the handbook, then take multiple practice tests", "Watch driving videos online"], correct: 2, explanation: "The most effective approach is to read the handbook first to understand the rules, then reinforce that knowledge by taking multiple practice tests with active recall." },
      { question: "What percentage is typically required to pass the DMV written test?", options: ["70%", "75%", "80%", "90%"], correct: 2, explanation: "Most states require a score of 80% or higher to pass the DMV written knowledge test, though this varies by state." },
      { question: "Which topics are most commonly tested on the DMV written exam?", options: ["Vehicle maintenance and engine types", "Traffic signs, right-of-way, and speed limits", "Map reading and navigation", "Vehicle insurance requirements"], correct: 1, explanation: "Traffic signs, right-of-way rules, and speed limits make up the majority of DMV test questions in virtually every state." }
    ],
    relatedLinks: [{ href: "/state/florida/dmv-practice-test", label: "Florida DMV Practice Test" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-handbook-summary", label: "DMV Handbook Summary" }, { href: "/state/florida/dmv-test-tips", label: "More Test Tips" }]
  },
  {
    slug: "speed-limit-sign-rules",
    title: "Speed Limit Signs — Rules Every Driver Must Know",
    metaTitle: "Speed Limit Sign Rules — What Every Driver Must Know",
    metaDesc: "Learn speed limit rules including school zones, residential areas, and when you can be ticketed even below the posted limit.",
    intro: "Speed limits are more nuanced than most drivers realize. You can receive a ticket for driving below the posted speed limit, and you\'re expected to slow down even when no sign is present. Here\'s everything you need to know.",
    sections: [
      { heading: "Posted vs. Basic Speed Law", content: "Posted speed limits show the maximum speed allowed under favorable conditions. But Florida\'s Basic Speed Law says you must drive at a speed that is safe given the actual conditions — weather, traffic, visibility, and road conditions. This means you can be cited for driving at the posted speed limit if conditions make that speed unsafe, such as during heavy rain or fog." },
      { heading: "Standard Florida Speed Limits", content: "When no speed limit is posted, Florida\'s standard limits apply: 20 mph in school zones when children are present or lights are flashing, 30 mph in urban business or residential areas, 55 mph on most rural roads and state highways, and 70 mph on limited access highways. Always check for posted signs as local limits may differ." },
      { heading: "School Zone Speed Limits", content: "In Florida, school zones have a posted speed limit of 20 mph. This limit applies when school zone lights are flashing or when children are present. Speeding fines are doubled in active school zones. When a school bus is stopped with its red lights flashing and stop sign extended, all traffic in both directions must stop." },
      { heading: "Minimum Speed Limits", content: "Driving too slowly can also be illegal. On highways with a posted speed of 70 mph, the minimum speed is 50 mph. You must not drive so slowly that you block or delay traffic moving at normal, safe speeds. On multi-lane highways, slower traffic must keep right and allow faster vehicles to pass on the left." }
    ],
    keyFacts: ["Speed limits show maximum speed under good conditions", "You can be ticketed for unsafe speed even below the limit", "School zones: 20 mph when flashing or children present", "Residential areas: 30 mph unless otherwise posted", "Highways: 70 mph maximum, 50 mph minimum", "Fines are doubled for speeding in school and work zones"],
    questions: [
      { question: "What is the standard speed limit in a Florida residential area when no sign is posted?", options: ["20 mph", "25 mph", "30 mph", "35 mph"], correct: 2, explanation: "Florida\'s standard speed limit in urban business or residential areas is 30 mph when no other speed limit is posted." },
      { question: "A school zone speed limit sign shows 20 mph. When does this limit apply?", options: ["Only during school hours on weekdays", "Only when the yellow lights are flashing", "When lights are flashing or children are present", "At all times, 24 hours a day"], correct: 2, explanation: "The 20 mph school zone limit applies when the flashing lights are active OR when children are present near the road, not just during specific hours." },
      { question: "You can legally be ticketed for driving below the posted speed limit if:", options: ["You are driving a commercial vehicle", "You are in the left lane", "Your speed is unsafe for current road conditions", "You are a new driver"], correct: 2, explanation: "Florida\'s Basic Speed Law requires driving at a speed safe for conditions. You can be cited for driving at the posted limit if conditions (rain, fog, traffic) make that speed unsafe." }
    ],
    relatedLinks: [{ href: "/dmv-guide/school-zone-speed-limit", label: "School Zone Speed Limit Rules" }, { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }]
  },
  {
    slug: "railroad-crossing-rules",
    title: "Railroad Crossing Rules — What Every Driver Must Do",
    metaTitle: "Railroad Crossing Rules — Complete Driver\'s Guide",
    metaDesc: "Learn exactly what to do at railroad crossings, when you must stop, and what the warning signs mean. Includes DMV test questions.",
    intro: "Railroad crossing accidents are among the most deadly traffic incidents — and almost all are preventable. Every driver must know the rules and warning signs at railroad crossings, as these are frequently tested on the DMV exam.",
    sections: [
      { heading: "Railroad Crossing Signs", content: "The advance warning sign is a yellow diamond with an X and the letters RR — this is usually the first sign you see when approaching a crossing. The crossbuck sign is a white X-shaped sign at the crossing itself. It is a yield sign — you must yield to trains. If there is more than one track, a sign below the crossbuck will indicate how many tracks are present." },
      { heading: "When You Must Stop", content: "You are required by law to stop at a railroad crossing when: warning lights are flashing, the crossing gate is lowered or being lowered, a human flagger is warning of an approaching train, or an approaching train is clearly visible and close. Stop at least 15 feet from the nearest rail. Never drive around or under a lowered gate — it is illegal and extremely dangerous." },
      { heading: "What to Do After Stopping", content: "After the train passes, before crossing, make sure the crossing is completely clear. If there is more than one track, wait until you are certain all tracks are clear — a second train may be coming from the opposite direction. Never race a train to the crossing. Trains travel much faster than they appear and cannot stop quickly." },
      { heading: "Vehicles That Must Always Stop", content: "Certain vehicles must always stop at railroad crossings, even when no warning devices are active: school buses, passenger buses carrying passengers, and vehicles carrying hazardous materials. As a driver behind these vehicles, be prepared for them to stop at every crossing." }
    ],
    keyFacts: ["Stop at least 15 feet from the nearest rail", "Never drive around or under a lowered crossing gate", "Stop when lights flash, gate lowers, or train is visible", "Wait until ALL tracks are clear before crossing", "School buses and hazmat vehicles must always stop", "Trains cannot stop quickly — never try to beat a train"],
    questions: [
      { question: "When approaching a railroad crossing with flashing red lights, you must:", options: ["Slow to 15 mph and proceed if no train is visible", "Stop at least 15 feet from the nearest rail", "Stop only if the gate is lowered", "Yield but proceed if it seems safe"], correct: 1, explanation: "When railroad crossing lights are flashing, you must stop at least 15 feet from the nearest rail and wait until it is completely safe to cross." },
      { question: "A railroad crossing gate is down and the lights are flashing, but no train is visible. You should:", options: ["Drive around the gate carefully", "Wait until the gate rises and lights stop flashing", "Proceed slowly since no train is visible", "Honk and proceed"], correct: 1, explanation: "It is illegal to drive around or under a crossing gate. You must wait until the gate fully rises and lights stop flashing before proceeding." },
      { question: "Which vehicle must always stop at railroad crossings, even when no warning signals are active?", options: ["Pickup trucks", "Motorcycles", "School buses", "SUVs"], correct: 2, explanation: "School buses, passenger buses with passengers, and hazardous materials vehicles are required by law to stop at all railroad crossings, regardless of whether warning signals are active." }
    ],
    relatedLinks: [{ href: "/dmv-guide/what-does-stop-sign-mean", label: "Stop Sign Rules" }, { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "school-zone-speed-limit",
    title: "School Zone Speed Limit Rules — Complete Guide",
    metaTitle: "School Zone Speed Limit — Rules, Fines, and What to Know",
    metaDesc: "Learn school zone speed limit rules, when they apply, fines for violations, and school bus stop laws. Essential for the DMV test.",
    intro: "School zones have special rules that apply even when school is not in session. Violations carry doubled fines and can result in serious penalties. Here is everything you need to know about school zones for your DMV test.",
    sections: [
      { heading: "School Zone Speed Limits", content: "In Florida, the posted speed limit in school zones is 20 mph. This limit is enforced when the school zone flashing lights are active or when children are present near the roadway. Some school zones have speed limit signs that say \'When Flashing,\' meaning the reduced speed applies only during the times indicated and when the yellow lights are flashing." },
      { heading: "School Zone Signs", content: "School zone signs use a distinctive fluorescent yellow-green color to make them highly visible. The school crossing sign is a pentagon (5-sided) shape with a depiction of children walking, and warns that a school crossing is ahead. The Begin School Zone sign marks the start of the reduced speed area. The End School Zone sign marks where normal speed limits resume." },
      { heading: "Doubled Fines", content: "Fines for all moving violations are doubled in active school zones. This applies to speeding, running red lights, and other violations. A speeding ticket that would normally cost $100 becomes $200 in a school zone. The Speeding Fines Doubled sign is posted at school zone entrances to remind drivers of this increased penalty." },
      { heading: "School Bus Laws", content: "When a school bus stops and displays its flashing red lights with the stop sign arm extended, all traffic in both directions must stop — even on roads without a median divider. You must remain stopped until the red lights stop flashing, the stop arm is withdrawn, and children have cleared the road. Violations carry heavy fines and can result in license suspension." }
    ],
    keyFacts: ["School zone speed limit: 20 mph when active", "Applies when lights are flashing OR children are present", "All fines doubled for violations in active school zones", "School bus stop arm: all traffic must stop in both directions", "School zone signs are fluorescent yellow-green", "School crossing signs are pentagon-shaped"],
    questions: [
      { question: "A school bus ahead has its red lights flashing and stop arm extended. You must:", options: ["Stop only if you are behind the bus", "Stop if you are approaching the bus from either direction", "Proceed slowly and carefully past the bus", "Stop only on a two-lane road"], correct: 1, explanation: "When a school bus displays flashing red lights and the stop arm is extended, all traffic in both directions must stop, regardless of which direction they are traveling." },
      { question: "What color are school zone warning signs in Florida?", options: ["Yellow", "Orange", "Fluorescent yellow-green", "White with red border"], correct: 2, explanation: "School zone and school crossing signs use a distinctive fluorescent yellow-green color to maximize visibility and distinguish them from standard yellow warning signs." },
      { question: "You receive a speeding ticket in an active school zone. Compared to the same violation elsewhere, the fine is:", options: ["The same amount", "50% higher", "Doubled", "Tripled"], correct: 2, explanation: "All fines for moving violations are doubled in active school zones and work zones. This is a state law designed to protect children and workers." }
    ],
    relatedLinks: [{ href: "/dmv-guide/speed-limit-sign-rules", label: "Speed Limit Sign Rules" }, { href: "/dmv-guide/what-does-stop-sign-mean", label: "Stop Sign Rules" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "no-passing-zone-meaning",
    title: "No Passing Zone — What It Means and Where It Applies",
    metaTitle: "No Passing Zone Meaning — Rules and Where Passing Is Illegal",
    metaDesc: "Learn what a no passing zone means, where passing is illegal, and the rules for safe passing. Includes DMV practice questions.",
    intro: "Passing another vehicle is one of the most dangerous maneuvers in driving — and one of the most regulated. Understanding where and when passing is prohibited is essential for your DMV test and your safety.",
    sections: [
      { heading: "The No Passing Zone Sign", content: "The No Passing Zone sign is a yellow pennant (elongated triangle pointing right) posted on the left side of the road. It marks the beginning of a zone where passing is prohibited. These signs are used on two-lane roads where sight distance or road conditions make passing unsafe. The sign is always yellow and always faces drivers who would be passing." },
      { heading: "Where Passing Is Always Prohibited", content: "Even without a No Passing Zone sign, passing is illegal in several situations: when there is a solid yellow line on your side of the center line, within 100 feet of an intersection, bridge, railroad crossing, or tunnel, on hills or curves where you cannot see at least 500 feet ahead, when a school bus is stopped with flashing lights and stop arm extended, and at crosswalks where a vehicle has stopped for a pedestrian." },
      { heading: "How to Pass Safely and Legally", content: "When passing is permitted, follow these steps: signal your intent to pass, check your mirrors and blind spots, make sure you have enough room, accelerate to pass quickly and decisively, return to your lane only when you can see both headlights of the passed vehicle in your mirror, and cancel your signal after returning to your lane." },
      { heading: "Double Yellow Lines", content: "Double solid yellow center lines mean no passing in either direction. A single solid yellow line on your side means no passing from your direction. A broken yellow line on your side means passing is allowed from your direction when safe. Always check the line on your side — not the other side — to determine if you may pass." }
    ],
    keyFacts: ["No Passing Zone sign is a yellow pennant on left side of road", "No passing within 100 feet of intersections, bridges, tunnels", "No passing on hills or curves with less than 500 feet visibility", "Solid yellow line on your side = no passing from your direction", "Double solid yellow = no passing in either direction", "Never pass a stopped school bus with lights flashing"],
    questions: [
      { question: "The No Passing Zone sign is shaped like:", options: ["A red octagon", "A yellow diamond", "A yellow pennant (elongated triangle)", "A white rectangle"], correct: 2, explanation: "The No Passing Zone sign is a distinctive yellow pennant shape — an elongated triangle pointing right — always posted on the left side of the road." },
      { question: "You may not pass another vehicle within how many feet of a railroad crossing?", options: ["50 feet", "100 feet", "200 feet", "500 feet"], correct: 1, explanation: "Passing is prohibited within 100 feet of a railroad crossing, intersection, bridge, viaduct, or tunnel." },
      { question: "There is a solid yellow line on your side of the road and a dashed yellow line on the other side. This means:", options: ["Passing is allowed in both directions", "Passing is allowed only from the other direction", "Passing is not allowed in either direction", "Passing is allowed only from your direction"], correct: 1, explanation: "Always check the line on your side. A solid line on your side means you may not pass. The dashed line on the other side means the driver coming toward you may pass when safe." }
    ],
    relatedLinks: [{ href: "/dmv-guide/lane-markings-explained", label: "Lane Markings Explained" }, { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }]
  },
  {
    slug: "what-does-yield-mean-driving",
    title: "What Does Yield Mean While Driving?",
    metaTitle: "What Does Yield Mean While Driving? — DMV Guide",
    metaDesc: "Understand what yield means in driving, where you must yield, and common yield situations tested on the DMV exam.",
    intro: "Yield is one of the most important words in traffic law — and one of the most misunderstood. Many drivers treat yield as optional or confuse it with a full stop requirement. This guide explains every situation where you must yield.",
    sections: [
      { heading: "The Legal Meaning of Yield", content: "To yield means to give the right-of-way to other traffic or pedestrians. When you yield, you must slow down and be prepared to stop if necessary to allow other vehicles or pedestrians to proceed safely. You may continue without stopping only if it is completely safe to do so. Failing to yield when required is a moving violation and a common cause of accidents." },
      { heading: "Yield at Merging and On-Ramps", content: "When entering a highway from an on-ramp, you must yield to traffic already on the highway. It is your responsibility to find a safe gap and merge smoothly — highway traffic does not have to slow down or move over for you (though they may do so as a courtesy). Accelerate on the ramp to match highway speed before merging." },
      { heading: "Yield to Emergency Vehicles", content: "When you see or hear an emergency vehicle approaching with sirens and/or flashing lights, you must immediately pull to the right side of the road and stop until it passes. This applies on highways, city streets, and multi-lane roads. Never block an intersection when an emergency vehicle approaches. Resume driving only after the vehicle has passed." },
      { heading: "Yield to Pedestrians", content: "You must always yield to pedestrians in marked crosswalks and at intersections, even if there is no crosswalk marking. When turning at an intersection, you must yield to pedestrians crossing the road you are turning onto. Always check for pedestrians before completing any turn." },
      { heading: "Florida\'s Move Over Law", content: "Florida law requires drivers to move over a lane — or slow to 20 mph below the posted speed limit if moving over is not possible — when passing law enforcement, emergency, tow truck, or utility vehicles stopped on the roadside with lights flashing. This extends the concept of yielding to protect workers on the roadside." }
    ],
    keyFacts: ["Yield = slow down and give right-of-way; stop only if needed", "At on-ramps, yield to highway traffic before merging", "Pull right and stop for emergency vehicles with lights/sirens", "Always yield to pedestrians in or approaching crosswalks", "Move Over Law: change lanes or slow 20 mph for stopped emergency vehicles", "Failure to yield is a moving violation"],
    questions: [
      { question: "When merging onto a highway from an on-ramp, you must:", options: ["Maintain your current speed and force a gap", "Stop at the end of the ramp and wait for a clear road", "Yield to highway traffic and find a safe gap to merge", "Flash your lights to signal your intent"], correct: 2, explanation: "When entering a highway, you must yield to traffic already on the highway and find a safe gap to merge. Highway traffic has the right-of-way." },
      { question: "An emergency vehicle with sirens is approaching from behind. You should:", options: ["Speed up to clear the road ahead", "Pull to the right and stop until it passes", "Maintain your speed and stay in your lane", "Pull left to give it more room"], correct: 1, explanation: "When an emergency vehicle approaches with lights and/or sirens, pull to the right edge of the road and stop until the vehicle has passed." },
      { question: "Florida\'s Move Over Law requires you to move over or slow down when passing:", options: ["Only police vehicles", "Any vehicle with hazard lights on", "Emergency, law enforcement, tow, and utility vehicles stopped with lights flashing", "School buses"], correct: 2, explanation: "Florida\'s Move Over Law covers law enforcement, emergency vehicles, tow trucks, utility vehicles, and road maintenance vehicles stopped on the roadside with warning lights flashing." }
    ],
    relatedLinks: [{ href: "/dmv-guide/yield-sign-meaning", label: "Yield Sign Meaning" }, { href: "/dmv-guide/right-of-way-rules", label: "Right-of-Way Rules" }, { href: "/state/florida/dmv-practice-test", label: "DMV Practice Test" }, { href: "/state/florida/road-sign-practice-test", label: "Road Sign Practice Test" }]
  },

  {
    "slug": "how-to-drive-in-rain",
    "title": "How to Drive Safely in Rain",
    "metaTitle": "How to Drive Safely in Rain — DMV Guide",
    "metaDesc": "Learn the essential rules for driving in rain, including speed, following distance, headlights, and hydroplaning prevention.",
    "intro": "Rain is one of the most common causes of traffic accidents. Wet roads reduce traction, increase stopping distance, and reduce visibility. This guide covers everything you need to know to drive safely in rainy conditions.",
    "sections": [
      {
        "heading": "Reduce Your Speed",
        "content": "When it rains, slow down below the posted speed limit. Roads are most slippery in the first 10-15 minutes of rain, when oil and water mix on the surface. Even light rain requires you to reduce speed. The basic speed law requires you to drive safely for conditions regardless of posted limits."
      },
      {
        "heading": "Increase Following Distance",
        "content": "In dry conditions, maintain a 3-second following distance. In rain, increase this to at least 4-6 seconds. Wet roads can double or triple your stopping distance. If visibility is very poor, increase the gap even more."
      },
      {
        "heading": "Turn On Your Headlights",
        "content": "In most states, you are required to turn on headlights whenever windshield wipers are in use. Even during the day, headlights make your vehicle more visible to other drivers. Never use high beams in rain as they reflect off water droplets and reduce visibility."
      },
      {
        "heading": "Avoid Hydroplaning",
        "content": "Hydroplaning occurs when your tires ride on a layer of water instead of the road, causing loss of steering control. To avoid it: slow down, maintain proper tire pressure, replace worn tires, and avoid standing water. If you hydroplane, ease off the gas gently and steer straight."
      }
    ],
    "keyFacts": [
      "Slow down below the speed limit in rain",
      "Increase following distance to 4-6 seconds",
      "Turn on headlights when wipers are running",
      "Avoid sudden braking or sharp turns",
      "Roads are most slippery when rain first starts",
      "Pull over safely if visibility drops to near zero"
    ],
    "questions": [
      {
        "question": "How should you adjust your following distance in rain?",
        "options": [
          "Keep the same 3-second distance",
          "Increase to at least 4-6 seconds",
          "Reduce distance since roads are wet",
          "Follow at 1 car length per 10 mph"
        ],
        "correct": 1,
        "explanation": "Rain increases stopping distance significantly. Increase your following distance to at least 4-6 seconds to give yourself more time to stop safely."
      },
      {
        "question": "What causes hydroplaning?",
        "options": [
          "Driving too slowly on wet roads",
          "Tires riding on a layer of water instead of the road",
          "Using windshield wipers at high speed",
          "Braking too gently in rain"
        ],
        "correct": 1,
        "explanation": "Hydroplaning occurs when your tires ride on a thin layer of water, losing contact with the road surface and causing loss of steering control."
      },
      {
        "question": "When must you turn on headlights in rain?",
        "options": [
          "Only at night",
          "Only in heavy rain",
          "Whenever windshield wipers are in use",
          "Only when visibility is under 500 feet"
        ],
        "correct": 2,
        "explanation": "In most states, headlights are required whenever windshield wipers are running. This makes your vehicle more visible to others even in light rain."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-hydroplaning",
        "label": "What is Hydroplaning?"
      },
      {
        "href": "/questions/what-speed-should-you-drive-in-rain",
        "label": "What Speed Should You Drive in Rain?"
      },
      {
        "href": "/dmv-guide/how-to-pass-dmv-test",
        "label": "How to Pass Your DMV Test"
      }
    ]
  },
  {
    "slug": "right-of-way-at-intersections",
    "title": "Right-of-Way Rules at Intersections",
    "metaTitle": "Right-of-Way Rules at Intersections — Complete DMV Guide",
    "metaDesc": "Learn who has the right of way at 4-way stops, uncontrolled intersections, roundabouts, and when turning. Includes practice questions.",
    "intro": "Right-of-way rules are among the most tested topics on the DMV written exam. Understanding who goes first at intersections prevents accidents and helps you pass your permit test. This guide covers every intersection type.",
    "sections": [
      {
        "heading": "4-Way Stop Rules",
        "content": "At a 4-way stop, vehicles proceed in the order they arrive. The first vehicle to stop goes first. If two vehicles arrive at the same time, the vehicle on the left yields to the vehicle on the right. If vehicles are directly across from each other, the vehicle going straight has priority over the vehicle turning left."
      },
      {
        "heading": "Uncontrolled Intersections",
        "content": "At an intersection with no signs or signals, yield to any vehicle already in the intersection. If two vehicles arrive at the same time, the driver on the left yields to the driver on the right. Always slow down significantly when approaching an uncontrolled intersection."
      },
      {
        "heading": "Turning Left",
        "content": "When turning left at a green light, you must yield to all oncoming traffic going straight. Wait for a safe gap before turning. Even with a green light, left-turning vehicles do not have priority over oncoming traffic unless there is a protected green arrow signal."
      },
      {
        "heading": "Roundabouts",
        "content": "Vehicles already inside a roundabout have the right of way. Drivers entering must yield to circulating traffic. Look left before entering. Signal when you intend to exit. Drive counterclockwise at low speed."
      }
    ],
    "keyFacts": [
      "At 4-way stops, first to arrive goes first",
      "Tie goes to the driver on the right",
      "Left turns must yield to oncoming traffic",
      "Entering a roundabout must yield to circulating traffic",
      "Emergency vehicles always have the right of way",
      "Pedestrians in crosswalks always have the right of way"
    ],
    "questions": [
      {
        "question": "At a 4-way stop, two cars arrive at exactly the same time from different directions. Who goes first?",
        "options": [
          "The car going straight",
          "The car on the left",
          "The car on the right",
          "Either car may go"
        ],
        "correct": 2,
        "explanation": "When two vehicles arrive at a 4-way stop simultaneously, the driver on the left yields to the driver on the right."
      },
      {
        "question": "When turning left at a green light, you must:",
        "options": [
          "Proceed immediately since you have a green light",
          "Yield to oncoming traffic going straight",
          "Honk to signal your intention",
          "Wait for all pedestrians only"
        ],
        "correct": 1,
        "explanation": "A green light does not give left-turning vehicles the right of way over oncoming traffic. You must yield to all vehicles going straight before completing your left turn."
      },
      {
        "question": "Who has the right of way when entering a roundabout?",
        "options": [
          "Vehicles entering the roundabout",
          "Vehicles already circulating inside",
          "The vehicle on the right",
          "The largest vehicle"
        ],
        "correct": 1,
        "explanation": "Vehicles already inside a roundabout have the right of way. Entering drivers must yield and wait for a safe gap before entering."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/who-has-right-of-way-at-a-4-way-stop",
        "label": "Who Has Right of Way at a 4-Way Stop?"
      },
      {
        "href": "/questions/when-turning-left-who-has-right-of-way",
        "label": "When Turning Left, Who Has Right of Way?"
      },
      {
        "href": "/questions/who-must-yield-in-a-roundabout",
        "label": "Who Must Yield in a Roundabout?"
      }
    ]
  },
  {
    "slug": "driving-under-the-influence",
    "title": "DUI Laws and Blood Alcohol Limits",
    "metaTitle": "DUI Laws and Blood Alcohol Limits — DMV Guide",
    "metaDesc": "Understand DUI laws, BAC limits, zero tolerance for minors, and the consequences of drunk driving. Essential for your permit test.",
    "intro": "Driving under the influence of alcohol or drugs is one of the most dangerous and illegal things a driver can do. This guide explains the laws, BAC limits, and consequences you need to know for your DMV test.",
    "sections": [
      {
        "heading": "Blood Alcohol Content (BAC) Limits",
        "content": "The legal BAC limit for adult drivers (21 and over) is 0.08% in all US states. For commercial drivers, the limit is 0.04%. For drivers under 21, most states have zero tolerance laws — any BAC from 0.00% to 0.02% can result in a DUI charge."
      },
      {
        "heading": "How Alcohol Affects Driving",
        "content": "Even small amounts of alcohol impair driving ability. Alcohol slows reaction time, reduces coordination, impairs judgment, blurs vision, and creates a false sense of confidence. There is no safe amount of alcohol to consume before driving — the only safe choice is zero."
      },
      {
        "heading": "Implied Consent Law",
        "content": "By driving on public roads, you automatically consent to chemical testing if an officer suspects DUI. Refusing a breathalyzer results in automatic license suspension — typically 1 year for a first refusal. This applies even if you are not convicted of DUI."
      },
      {
        "heading": "Consequences of DUI",
        "content": "DUI consequences include: license suspension, heavy fines (often $1,000-$10,000+), possible jail time, mandatory alcohol education programs, ignition interlock device installation, and a permanent criminal record. A second DUI carries much harsher penalties."
      }
    ],
    "keyFacts": [
      "BAC limit is 0.08% for adults",
      "Commercial drivers limit is 0.04%",
      "Zero tolerance for drivers under 21",
      "Refusing a breathalyzer causes automatic suspension",
      "Coffee and food do NOT speed up sobering",
      "Only time reduces BAC"
    ],
    "questions": [
      {
        "question": "What is the legal BAC limit for adult drivers in the US?",
        "options": [
          "0.05%",
          "0.08%",
          "0.10%",
          "0.04%"
        ],
        "correct": 1,
        "explanation": "The legal BAC limit for adult drivers (21 and over) is 0.08% in all 50 states. Driving at or above this limit is illegal regardless of how you feel."
      },
      {
        "question": "What is the implied consent law?",
        "options": [
          "You consent to share the road with other drivers",
          "You consent to chemical testing when suspected of DUI",
          "You consent to follow all traffic laws",
          "You consent to pay fines if ticketed"
        ],
        "correct": 1,
        "explanation": "The implied consent law means that by driving on public roads, you automatically agree to chemical testing if an officer has reasonable suspicion of DUI."
      },
      {
        "question": "Can drinking coffee help you sober up faster?",
        "options": [
          "Yes, caffeine neutralizes alcohol",
          "Yes, if combined with food",
          "No, only time reduces BAC",
          "Yes, but only for beer"
        ],
        "correct": 2,
        "explanation": "Nothing speeds up the elimination of alcohol from your body. Only time reduces BAC. Coffee may make you feel more alert, but it does not reduce impairment."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-the-bac-limit-for-driving",
        "label": "What is the BAC Limit for Driving?"
      },
      {
        "href": "/questions/what-is-implied-consent-law",
        "label": "What is the Implied Consent Law?"
      },
      {
        "href": "/questions/what-is-dui",
        "label": "What is DUI?"
      }
    ]
  },
  {
    "slug": "how-to-change-lanes-safely",
    "title": "How to Change Lanes Safely",
    "metaTitle": "How to Change Lanes Safely — DMV Guide",
    "metaDesc": "Step-by-step guide to changing lanes safely, including mirror checks, blind spots, signaling, and when lane changes are prohibited.",
    "intro": "Lane changes are one of the most common causes of accidents on multi-lane roads. Many drivers fail to check blind spots or signal properly. This guide explains the correct procedure for changing lanes safely.",
    "sections": [
      {
        "heading": "Step-by-Step Lane Change",
        "content": "To change lanes safely: first check your mirrors to see what is behind and beside you. Signal your intention early — at least 100 feet before moving. Check your blind spot by turning your head to look over your shoulder. If clear, gradually move into the new lane while maintaining your speed. Cancel your signal after completing the change."
      },
      {
        "heading": "Checking Blind Spots",
        "content": "Blind spots are areas your mirrors cannot show you. They are located near the rear corners of your vehicle. Always turn your head to physically check blind spots before changing lanes. Relying only on mirrors is not enough — another vehicle, cyclist, or motorcyclist may be invisible in your mirrors but visible with a head check."
      },
      {
        "heading": "When Lane Changes Are Prohibited",
        "content": "You may not change lanes when there is a solid white line marking your lane boundary, in intersections, when it would force another vehicle to brake or swerve, within 100 feet of an intersection, railroad crossing, or bridge, and whenever a No Lane Change sign is posted."
      },
      {
        "heading": "Highway Lane Usage",
        "content": "On multi-lane highways, keep right except to pass. The left lane is for passing only. After passing, return to the right lane. Driving slowly in the left lane is illegal in many states. When merging onto a highway, the vehicles on the highway have the right of way."
      }
    ],
    "keyFacts": [
      "Always signal before changing lanes",
      "Check mirrors AND blind spots — not just mirrors",
      "Signal at least 100 feet before moving",
      "Never change lanes on solid white lines",
      "Return to the right lane after passing",
      "Never cut off another vehicle when merging"
    ],
    "questions": [
      {
        "question": "Before changing lanes, you should:",
        "options": [
          "Signal and immediately move over",
          "Check mirrors only",
          "Check mirrors, signal, then check blind spot",
          "Honk to alert other drivers"
        ],
        "correct": 2,
        "explanation": "The correct procedure is: check mirrors, signal your intention, check your blind spot by turning your head, and then change lanes when safe."
      },
      {
        "question": "What are blind spots?",
        "options": [
          "Areas where the sun is in your eyes",
          "Areas your mirrors cannot show you",
          "Areas behind your vehicle",
          "Areas in front of your vehicle"
        ],
        "correct": 1,
        "explanation": "Blind spots are areas around your vehicle that cannot be seen in your mirrors. They are located near the rear corners of your car. Always turn your head to check blind spots."
      },
      {
        "question": "On a multi-lane highway, the left lane is for:",
        "options": [
          "Driving at any speed",
          "Slow drivers",
          "Passing only",
          "Emergency vehicles only"
        ],
        "correct": 2,
        "explanation": "The left lane is designated for passing. After passing another vehicle, you should move back to the right lane. Staying in the left lane unnecessarily is illegal in many states."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-are-blind-spots",
        "label": "What Are Blind Spots?"
      },
      {
        "href": "/questions/what-is-the-correct-way-to-change-lanes",
        "label": "What is the Correct Way to Change Lanes?"
      },
      {
        "href": "/questions/what-are-the-rules-for-passing",
        "label": "What Are the Rules for Passing?"
      }
    ]
  },
  {
    "slug": "road-signs-by-color",
    "title": "Road Signs by Color — What Each Color Means",
    "metaTitle": "Road Signs by Color — What Each Color Means | DMV Guide",
    "metaDesc": "Learn what each road sign color means: red, yellow, green, blue, orange, brown, and white. Essential knowledge for your DMV test.",
    "intro": "Road sign colors are standardized across the US, so you can identify a sign's meaning even before reading it. Knowing what each color represents is essential for your DMV test and for safe driving.",
    "sections": [
      {
        "heading": "Red Signs",
        "content": "Red signs are regulatory signs that require a specific action. Examples include stop signs, yield signs, wrong way signs, and do not enter signs. Red always means stop, prohibition, or danger. You must obey red signs — they are legally enforceable."
      },
      {
        "heading": "Yellow Signs",
        "content": "Yellow signs are warning signs that alert drivers to potential hazards ahead. They are diamond-shaped and include curve warnings, school zones, pedestrian crossings, and railroad crossings. Yellow means caution — slow down and be prepared."
      },
      {
        "heading": "Green Signs",
        "content": "Green signs provide directional and guide information. Highway signs showing exits, distances, and route numbers are green. Green means go and provides information to help you navigate."
      },
      {
        "heading": "Blue Signs",
        "content": "Blue signs indicate services available to drivers — hospitals, rest areas, gas stations, food, and lodging. Blue signs also mark accessible parking for disabled persons. Blue provides guidance and information."
      },
      {
        "heading": "Orange Signs",
        "content": "Orange signs mark construction and work zones. They warn of temporary conditions due to road construction. Fines for traffic violations are typically doubled in active work zones."
      },
      {
        "heading": "Brown Signs",
        "content": "Brown signs direct drivers to parks, recreation areas, historical sites, and cultural landmarks. Brown signs are common near national parks, campgrounds, and tourist destinations."
      }
    ],
    "keyFacts": [
      "Red = stop, prohibition, or danger",
      "Yellow = warning, caution, potential hazard",
      "Green = direction and guidance",
      "Blue = services and information",
      "Orange = construction and work zones",
      "Brown = parks and recreation areas",
      "White = regulatory information"
    ],
    "questions": [
      {
        "question": "What does a yellow diamond-shaped sign indicate?",
        "options": [
          "A rule you must follow",
          "A warning of a potential hazard ahead",
          "A direction or guide",
          "A service nearby"
        ],
        "correct": 1,
        "explanation": "Yellow diamond signs are warning signs. They alert drivers to potential hazards or changes in road conditions ahead, such as curves, school zones, or railroad crossings."
      },
      {
        "question": "What color are service signs (gas, food, lodging)?",
        "options": [
          "Green",
          "Yellow",
          "Blue",
          "White"
        ],
        "correct": 2,
        "explanation": "Blue signs indicate services available to drivers, including gas stations, restaurants, lodging, hospitals, and rest areas."
      },
      {
        "question": "What does an orange sign indicate?",
        "options": [
          "A school zone",
          "A construction or work zone",
          "A recreational area",
          "A historical landmark"
        ],
        "correct": 1,
        "explanation": "Orange signs mark construction and maintenance work zones. They warn drivers of temporary conditions and unusual hazards near road work areas."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-color-are-warning-signs",
        "label": "What Color Are Warning Signs?"
      },
      {
        "href": "/questions/what-color-are-regulatory-signs",
        "label": "What Color Are Regulatory Signs?"
      },
      {
        "href": "/road-signs-practice-test",
        "label": "Road Signs Practice Test"
      }
    ]
  },
  {
    "slug": "how-to-drive-on-highway",
    "title": "How to Drive on a Highway — Complete Guide",
    "metaTitle": "How to Drive on a Highway — Complete DMV Guide",
    "metaDesc": "Learn how to merge, change lanes, maintain speed, and exit safely on a highway. Essential knowledge for new drivers.",
    "intro": "Driving on a highway for the first time can be intimidating. High speeds, merging traffic, and multiple lanes require specific skills. This guide explains everything new drivers need to know about highway driving.",
    "sections": [
      {
        "heading": "Merging onto the Highway",
        "content": "Use the full length of the on-ramp to accelerate to highway speed — typically 60-70 mph. Signal early, check mirrors and blind spots, and find a safe gap in traffic before merging. Never stop at the end of a ramp unless absolutely necessary. Highway traffic does not have to slow down for you."
      },
      {
        "heading": "Maintaining Speed and Lane Position",
        "content": "Drive with the flow of traffic. Keep right except to pass — the left lane is for passing only. Maintain a following distance of at least 3-4 seconds. Check mirrors every 5-8 seconds to stay aware of surrounding traffic."
      },
      {
        "heading": "Changing Lanes on the Highway",
        "content": "Signal at least 100 feet before changing lanes. Check mirrors and blind spots. Change lanes gradually, not abruptly. Never change multiple lanes at once. After passing, return to the right lane."
      },
      {
        "heading": "Exiting the Highway",
        "content": "Plan your exit in advance. Move into the right lane well before your exit. Signal before entering the exit ramp. Slow down on the ramp, not before it. Follow the posted speed on the ramp — it is much lower than highway speed."
      }
    ],
    "keyFacts": [
      "Accelerate to highway speed on the on-ramp before merging",
      "Keep right except to pass",
      "Maintain 3-4 second following distance",
      "Signal before every lane change",
      "Plan your exit in advance",
      "Slow down on the ramp, not the highway"
    ],
    "questions": [
      {
        "question": "When merging onto a highway, you should:",
        "options": [
          "Stop at the end of the ramp and wait for a gap",
          "Accelerate to match highway speed on the ramp",
          "Honk to signal your merge",
          "Merge immediately without checking mirrors"
        ],
        "correct": 1,
        "explanation": "Use the on-ramp to accelerate to highway speed before merging. This allows you to blend smoothly into traffic without forcing other drivers to brake."
      },
      {
        "question": "Which lane should you drive in on a multi-lane highway?",
        "options": [
          "The left lane for safety",
          "The center lane always",
          "The right lane except when passing",
          "Any lane at your preference"
        ],
        "correct": 2,
        "explanation": "Keep to the right lane on highways except when passing. The left lane is for passing only. Return to the right after you have passed."
      },
      {
        "question": "When should you slow down when exiting a highway?",
        "options": [
          "Before entering the exit ramp",
          "On the highway before the ramp",
          "After you have fully exited",
          "On the exit ramp itself"
        ],
        "correct": 0,
        "explanation": "Begin slowing down after you have moved onto the exit ramp, not on the highway. Braking on the highway disrupts traffic flow and can cause rear-end collisions."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-the-proper-way-to-merge",
        "label": "What is the Proper Way to Merge?"
      },
      {
        "href": "/questions/who-has-right-of-way-when-merging",
        "label": "Who Has Right of Way When Merging?"
      },
      {
        "href": "/questions/what-is-the-highway-speed-limit",
        "label": "What is the Highway Speed Limit?"
      }
    ]
  },
  {
    "slug": "seat-belt-laws",
    "title": "Seat Belt Laws — What You Need to Know",
    "metaTitle": "Seat Belt Laws — What You Need to Know | DMV Guide",
    "metaDesc": "Learn seat belt laws, when they are required, child safety seat rules, and why seat belts are the most important safety device in your car.",
    "intro": "Seat belts are the single most effective safety device in a vehicle. They reduce the risk of death in an accident by about 45%. This guide covers seat belt laws, requirements, and why they matter.",
    "sections": [
      {
        "heading": "When Seat Belts Are Required",
        "content": "Seat belts are required by law for all occupants in all US states except New Hampshire for adults. Primary enforcement states allow police to pull you over solely for not wearing a seat belt. Secondary enforcement states require another violation first. Regardless of the law, always wear a seat belt."
      },
      {
        "heading": "Driver Responsibility",
        "content": "The driver is responsible for ensuring all passengers under 18 are properly buckled. If a minor passenger is unbelted, the driver receives the ticket — not the passenger. This applies even if the passenger is an older teenager."
      },
      {
        "heading": "Child Safety Seats",
        "content": "Children must be secured in appropriate child safety seats based on their age, weight, and height. Infants use rear-facing seats. Toddlers use forward-facing seats. Older children use booster seats. Requirements vary by state. Always follow the manufacturer's instructions."
      },
      {
        "heading": "Why Seat Belts Save Lives",
        "content": "In a crash at 30 mph, an unbelted occupant continues moving at 30 mph and hits the interior of the vehicle with enormous force. Seat belts spread crash forces across the strongest parts of the body, prevent ejection, and keep occupants positioned for airbag protection."
      }
    ],
    "keyFacts": [
      "Seat belts reduce death risk by about 45%",
      "Required for all occupants in nearly all states",
      "Driver is responsible for passengers under 18",
      "Ejection from a vehicle is almost always fatal",
      "Airbags work best with seat belts",
      "Child safety seats are required for young children"
    ],
    "questions": [
      {
        "question": "Who is responsible if a minor passenger is not wearing a seat belt?",
        "options": [
          "The passenger",
          "The driver",
          "Both equally",
          "Neither, it is optional"
        ],
        "correct": 1,
        "explanation": "The driver is legally responsible for ensuring all passengers under 18 are properly buckled. The driver receives the citation if a minor is unbelted."
      },
      {
        "question": "Seat belts reduce the risk of death in a crash by approximately:",
        "options": [
          "10-15%",
          "25-30%",
          "45%",
          "70%"
        ],
        "correct": 2,
        "explanation": "According to the NHTSA, wearing a seat belt reduces the risk of death in a crash by about 45% for front-seat passengers and 60% for light truck occupants."
      },
      {
        "question": "In which state are adults not required by law to wear seat belts?",
        "options": [
          "Texas",
          "New Hampshire",
          "California",
          "Florida"
        ],
        "correct": 1,
        "explanation": "New Hampshire is the only US state that does not require adults to wear seat belts by law. All other states have mandatory seat belt laws for adults."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/when-must-you-wear-a-seat-belt",
        "label": "When Must You Wear a Seat Belt?"
      },
      {
        "href": "/questions/what-is-defensive-driving",
        "label": "What is Defensive Driving?"
      },
      {
        "href": "/dmv-guide/how-to-pass-dmv-test",
        "label": "How to Pass Your DMV Test"
      }
    ]
  },
  {
    "slug": "distracted-driving",
    "title": "Distracted Driving — Laws, Dangers, and Prevention",
    "metaTitle": "Distracted Driving — Laws, Dangers, and Prevention | DMV Guide",
    "metaDesc": "Learn about distracted driving, texting while driving laws, and how to stay focused on the road. Essential for new drivers.",
    "intro": "Distracted driving kills thousands of people every year. Texting while driving is one of the most dangerous things a driver can do. This guide explains the dangers, laws, and how to avoid distractions.",
    "sections": [
      {
        "heading": "Types of Distraction",
        "content": "There are three types of driving distraction: visual (taking your eyes off the road), manual (taking your hands off the wheel), and cognitive (taking your mind off driving). Texting while driving is the most dangerous because it involves all three simultaneously."
      },
      {
        "heading": "Texting and Phone Laws",
        "content": "Texting while driving is illegal in all 50 states. Most states also prohibit holding your phone while driving. Hands-free devices are permitted in most states for adults, but teen drivers face stricter restrictions — many states prohibit any phone use for drivers under 18."
      },
      {
        "heading": "The Danger of Texting",
        "content": "At 55 mph, sending a 5-second text means driving the length of a football field with your eyes closed. Texting while driving increases crash risk by 23 times compared to non-distracted driving. No text is worth a life."
      },
      {
        "heading": "Other Common Distractions",
        "content": "Common distractions include eating while driving, adjusting the radio or GPS, talking to passengers, personal grooming, and daydreaming. Any activity that takes your attention from the road is distracted driving and can be ticketed."
      }
    ],
    "keyFacts": [
      "Texting while driving is illegal in all 50 states",
      "A 5-second text at 55 mph covers a football field",
      "Three types: visual, manual, and cognitive distraction",
      "Hands-free devices are permitted for adults in most states",
      "Teen drivers often face stricter phone restrictions",
      "Distracted driving kills thousands annually"
    ],
    "questions": [
      {
        "question": "How many types of driving distraction are there?",
        "options": [
          "One",
          "Two",
          "Three",
          "Four"
        ],
        "correct": 2,
        "explanation": "There are three types of driving distraction: visual (eyes off road), manual (hands off wheel), and cognitive (mind off driving). Texting involves all three simultaneously."
      },
      {
        "question": "Is texting while driving legal in any US state?",
        "options": [
          "Yes, in a few rural states",
          "Yes, if stopped at a red light",
          "No, it is illegal in all 50 states",
          "Yes, for adults over 25"
        ],
        "correct": 2,
        "explanation": "Texting while driving is illegal in all 50 states. Many states also prohibit holding a phone while driving, requiring hands-free devices."
      },
      {
        "question": "At 55 mph, sending a 5-second text is like driving:",
        "options": [
          "Half a block with eyes closed",
          "The length of a football field with eyes closed",
          "One mile with eyes closed",
          "A full city block with eyes closed"
        ],
        "correct": 1,
        "explanation": "At 55 mph, you travel approximately 80 feet per second. A 5-second text means driving about 400 feet — roughly the length of a football field — without looking at the road."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/can-you-use-phone-while-driving",
        "label": "Can You Use a Phone While Driving?"
      },
      {
        "href": "/questions/what-is-the-danger-of-distracted-driving",
        "label": "What is the Danger of Distracted Driving?"
      },
      {
        "href": "/questions/what-is-defensive-driving",
        "label": "What is Defensive Driving?"
      }
    ]
  },
  {
    "slug": "how-to-park-safely",
    "title": "How to Park Safely — Parallel, Angle, and Hill Parking",
    "metaTitle": "How to Park Safely — Parallel, Angle, and Hill Parking | DMV Guide",
    "metaDesc": "Learn how to parallel park, angle park, and park on a hill. Includes rules on where you cannot park and distance requirements.",
    "intro": "Parking is one of the most practical skills a new driver must learn. From parallel parking to parking on hills, this guide covers all the techniques and rules you need to know for your DMV test and real life.",
    "sections": [
      {
        "heading": "Parallel Parking",
        "content": "Parallel parking requires practice. Pull up even with the front vehicle, leaving about 2-3 feet between your cars. Reverse slowly at a 45-degree angle until your rear bumper aligns with the rear bumper of the front car. Straighten the wheel, then turn sharply in the opposite direction to align with the curb. You should end up within 18 inches of the curb."
      },
      {
        "heading": "Parking on a Hill",
        "content": "When parking uphill with a curb, turn wheels away from the curb (left). If you roll back, the curb stops you. Uphill without a curb — turn wheels toward the shoulder. Downhill with or without a curb — turn wheels toward the curb (right). Always set the parking brake and leave the car in gear or Park."
      },
      {
        "heading": "Where You Cannot Park",
        "content": "Never park within 15 feet of a fire hydrant, 20 feet of a crosswalk, 50 feet of a railroad crossing, in front of a driveway, in a no-parking zone, on a sidewalk, in a crosswalk, or blocking traffic. Violations result in fines and possible towing."
      },
      {
        "heading": "Curb Colors",
        "content": "Curb colors indicate parking rules. Red means no stopping or parking. Yellow means loading zone or commercial vehicles only. White means passenger loading, usually for a limited time. Blue means accessible parking for disabled persons with proper permit. Green means limited time parking."
      }
    ],
    "keyFacts": [
      "Park within 18 inches of the curb when parallel parking",
      "Uphill with curb — turn wheels left (away from curb)",
      "Downhill — turn wheels right (toward curb)",
      "Stay 15 feet from fire hydrants",
      "Stay 20 feet from crosswalks",
      "Red curb = no parking ever"
    ],
    "questions": [
      {
        "question": "When parking uphill next to a curb, which way should you turn your wheels?",
        "options": [
          "Toward the curb (right)",
          "Away from the curb (left)",
          "Straight ahead",
          "It does not matter"
        ],
        "correct": 1,
        "explanation": "When parking uphill with a curb, turn your wheels away from the curb (left). If your brakes fail and you roll back, the curb will catch your front tire and stop the vehicle."
      },
      {
        "question": "How far must you park from a fire hydrant?",
        "options": [
          "10 feet",
          "15 feet",
          "20 feet",
          "25 feet"
        ],
        "correct": 1,
        "explanation": "You must park at least 15 feet from a fire hydrant in most states. This ensures fire trucks can access the hydrant in an emergency."
      },
      {
        "question": "What does a red curb mean?",
        "options": [
          "Limited time parking",
          "No stopping or parking at any time",
          "Loading zone only",
          "Accessible parking"
        ],
        "correct": 1,
        "explanation": "A red curb means no stopping or parking at any time. These are often found in front of fire stations, fire hydrants, or in areas that must remain clear for emergency access."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-parallel-parking",
        "label": "What is Parallel Parking?"
      },
      {
        "href": "/questions/how-do-you-park-on-a-hill-with-curb",
        "label": "How Do You Park on a Hill?"
      },
      {
        "href": "/questions/what-does-a-yellow-curb-mean",
        "label": "What Does a Yellow Curb Mean?"
      }
    ]
  },
  {
    "slug": "emergency-vehicle-rules",
    "title": "What to Do When Emergency Vehicles Approach",
    "metaTitle": "What to Do When Emergency Vehicles Approach | DMV Guide",
    "metaDesc": "Learn what to do when police, fire trucks, or ambulances approach with lights and sirens. Includes Move Over law requirements.",
    "intro": "Knowing how to respond to emergency vehicles is critical for safety and legally required. Failing to yield to emergency vehicles can result in serious accidents and heavy fines. This guide explains exactly what to do.",
    "sections": [
      {
        "heading": "When an Emergency Vehicle Approaches",
        "content": "When you see or hear an emergency vehicle with lights and sirens activated, you must immediately pull to the right side of the road and stop. This applies on all roads including multi-lane highways. Do not block intersections. Stay stopped until the vehicle has passed completely."
      },
      {
        "heading": "The Move Over Law",
        "content": "All 50 states have Move Over laws. When approaching a stationary emergency vehicle, tow truck, or road maintenance vehicle with flashing lights on the roadside, you must move over one lane away from the vehicle. If you cannot safely move over, slow down significantly below the speed limit."
      },
      {
        "heading": "At Intersections",
        "content": "Even if you have a green light, you must yield to emergency vehicles with lights and sirens. Never drive through an intersection if an emergency vehicle is approaching. Pull to the right and stop, then proceed only after the vehicle has cleared the intersection."
      },
      {
        "heading": "Funeral Processions",
        "content": "In most states, you must yield to a funeral procession. Vehicles in a procession have the right of way and may proceed through red lights as a group. Do not cut into or through a funeral procession."
      }
    ],
    "keyFacts": [
      "Pull to the right and stop for all emergency vehicles",
      "Move Over law applies to stopped emergency vehicles",
      "Even a green light does not override emergency vehicles",
      "Stay stopped until the vehicle has completely passed",
      "All 50 states have Move Over laws",
      "Violating Move Over laws carries heavy fines"
    ],
    "questions": [
      {
        "question": "When an emergency vehicle with lights and sirens approaches, you must:",
        "options": [
          "Speed up to get out of the way",
          "Slow down but keep driving",
          "Pull to the right and stop",
          "Stop in the center of the road"
        ],
        "correct": 2,
        "explanation": "You must immediately pull to the right side of the road and stop when an emergency vehicle with lights and sirens approaches. Stay stopped until it has completely passed."
      },
      {
        "question": "What does the Move Over law require?",
        "options": [
          "Move to the center lane when passing emergency vehicles",
          "Move over one lane from stopped emergency vehicles on the roadside",
          "Move your vehicle off the road completely",
          "Move to the left lane to give room"
        ],
        "correct": 1,
        "explanation": "The Move Over law requires drivers to move over one lane away from stationary emergency vehicles, tow trucks, or road maintenance vehicles with flashing lights on the roadside."
      },
      {
        "question": "You are at a green light and an emergency vehicle is approaching. What should you do?",
        "options": [
          "Proceed through the intersection quickly",
          "Pull to the right and stop before entering the intersection",
          "Slow down but continue through",
          "Flash your lights at the emergency vehicle"
        ],
        "correct": 1,
        "explanation": "Even with a green light, you must yield to emergency vehicles. Pull to the right and stop. Never enter an intersection in the path of an emergency vehicle."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/must-you-yield-to-emergency-vehicles",
        "label": "Must You Yield to Emergency Vehicles?"
      },
      {
        "href": "/questions/what-is-the-move-over-law",
        "label": "What is the Move Over Law?"
      },
      {
        "href": "/questions/must-you-yield-to-funeral-procession",
        "label": "Must You Yield to a Funeral Procession?"
      }
    ]
  },

  {
    "slug": "traffic-signs-complete-guide",
    "title": "Traffic Signs — Complete Guide for New Drivers",
    "metaTitle": "Traffic Signs Complete Guide — DMV Study Guide",
    "metaDesc": "Learn all traffic sign types, colors, and shapes. Regulatory, warning, and guide signs explained for your DMV permit test.",
    "intro": "Traffic signs communicate the rules of the road using colors, shapes, and symbols. Knowing what each sign means is essential for passing your DMV test and driving safely. This guide covers every major sign type.",
    "sections": [
      {
        "heading": "Regulatory Signs",
        "content": "Regulatory signs tell you what you must or must not do. They are legally enforceable. Examples include stop signs (red octagon), yield signs (red inverted triangle), speed limit signs (white rectangle), no U-turn signs, and one-way signs. Always obey regulatory signs."
      },
      {
        "heading": "Warning Signs",
        "content": "Warning signs alert you to potential hazards ahead. They are yellow diamonds with black symbols. Common examples include curve ahead, slippery road, pedestrian crossing, railroad crossing, and school zone signs. Slow down when you see warning signs."
      },
      {
        "heading": "Guide Signs",
        "content": "Guide signs provide directional information and navigation. Green signs show highway exits and distances. Blue signs show services like gas and food. Brown signs show parks and recreation areas. White signs show street names and local information."
      },
      {
        "heading": "Construction Signs",
        "content": "Orange signs mark construction and work zones. They are temporary and warn of unusual conditions. Fines for violations are typically doubled in active work zones. Always slow down and follow all instructions in construction zones."
      }
    ],
    "keyFacts": [
      "Red signs are regulatory and must be obeyed",
      "Yellow diamond signs are warnings",
      "Green signs provide directional guidance",
      "Orange signs mark construction zones",
      "Blue signs indicate services",
      "Brown signs indicate parks and recreation"
    ],
    "questions": [
      {
        "question": "What shape is used for warning signs?",
        "options": [
          "Rectangle",
          "Circle",
          "Diamond",
          "Pentagon"
        ],
        "correct": 2,
        "explanation": "Warning signs are diamond-shaped (a square rotated 45 degrees) and are yellow with black symbols or text. This shape is exclusive to warning signs."
      },
      {
        "question": "A white rectangular sign with black text usually indicates:",
        "options": [
          "A warning of hazard ahead",
          "A rule or regulation you must follow",
          "A direction to a destination",
          "A nearby service"
        ],
        "correct": 1,
        "explanation": "White rectangular signs are regulatory signs. They display rules that must be obeyed, such as speed limits, no passing, and one-way restrictions."
      },
      {
        "question": "What color are construction zone signs?",
        "options": [
          "Yellow",
          "Orange",
          "Red",
          "White"
        ],
        "correct": 1,
        "explanation": "Construction and work zone signs are orange. They warn drivers of temporary conditions due to road maintenance and construction. Fines are typically doubled in active work zones."
      }
    ],
    "relatedLinks": [
      {
        "href": "/road-signs-practice-test",
        "label": "Road Signs Practice Test"
      },
      {
        "href": "/questions/what-color-are-warning-signs",
        "label": "What Color Are Warning Signs?"
      },
      {
        "href": "/dmv-guide/road-signs-by-color",
        "label": "Road Signs by Color"
      }
    ]
  },
  {
    "slug": "speed-limits-explained",
    "title": "Speed Limits Explained — Everything You Need to Know",
    "metaTitle": "Speed Limits Explained — DMV Study Guide",
    "metaDesc": "Learn about posted speed limits, school zones, highway minimums, and the basic speed law. Essential for your DMV permit test.",
    "intro": "Speed limits are set to protect everyone on the road. Understanding when to obey posted limits and when conditions require driving slower is essential for safe driving and passing your DMV test.",
    "sections": [
      {
        "heading": "Posted Speed Limits",
        "content": "Posted speed limits show the maximum legal speed under ideal conditions. Common limits: residential areas 25-30 mph, school zones 15-25 mph, rural two-lane roads 55 mph, interstate highways 65-70 mph. Always follow posted signs as limits vary by location."
      },
      {
        "heading": "The Basic Speed Law",
        "content": "The basic speed law requires you to drive at a speed that is safe for current conditions — even if that is below the posted limit. You can be ticketed for driving at the speed limit if conditions (rain, fog, ice, heavy traffic) make that speed unsafe."
      },
      {
        "heading": "School and Work Zones",
        "content": "School zones require reduced speeds — typically 15-25 mph — when lights are flashing or children are present. Work zones also have reduced speed limits. Fines are doubled in both school zones and active work zones in most states."
      },
      {
        "heading": "Minimum Speed Laws",
        "content": "Most highways have minimum speed laws. Driving too slowly obstructs traffic and is dangerous. On a highway with a 70 mph limit, the minimum is often 50 mph. Slow vehicles must keep to the right lane."
      }
    ],
    "keyFacts": [
      "Always follow posted speed limits",
      "The basic speed law may require going below the limit",
      "School zone fines are doubled in most states",
      "Driving too slowly is also illegal on highways",
      "Texas has the highest speed limit at 85 mph",
      "Speed limits are set for ideal conditions"
    ],
    "questions": [
      {
        "question": "What is the basic speed law?",
        "options": [
          "Always drive at the posted speed limit",
          "Drive safely for current conditions even below the limit",
          "Drive 10 mph below the limit in cities",
          "Match the speed of surrounding traffic always"
        ],
        "correct": 1,
        "explanation": "The basic speed law requires you to drive at a speed that is safe for current conditions, regardless of the posted limit. Rain, fog, or ice may require you to drive well below the posted limit."
      },
      {
        "question": "When are speeding fines doubled?",
        "options": [
          "On all highways at night",
          "In school zones and active construction zones",
          "During rush hour only",
          "On weekends and holidays"
        ],
        "correct": 1,
        "explanation": "Speeding fines are doubled in active school zones and construction work zones in most states. Signs are posted at the entrance to these areas warning of the doubled fines."
      },
      {
        "question": "What is the typical default speed limit in a residential area?",
        "options": [
          "15 mph",
          "20 mph",
          "25-30 mph",
          "35 mph"
        ],
        "correct": 2,
        "explanation": "The default speed limit in residential areas is typically 25-30 mph depending on the state. Always check for posted signs as local ordinances may set different limits."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-the-basic-speed-law",
        "label": "What is the Basic Speed Law?"
      },
      {
        "href": "/questions/what-is-the-speed-limit-in-a-school-zone",
        "label": "Speed Limit in a School Zone"
      },
      {
        "href": "/questions/what-is-the-highway-speed-limit",
        "label": "Highway Speed Limit"
      }
    ]
  },
  {
    "slug": "sharing-road-with-cyclists",
    "title": "How to Share the Road with Cyclists",
    "metaTitle": "How to Share the Road with Cyclists — DMV Guide",
    "metaDesc": "Learn the rules for sharing the road with cyclists, bike lane laws, and how much space to give when passing a bicycle.",
    "intro": "Cyclists have the same rights on the road as motor vehicles in most states. Knowing how to share the road safely with cyclists is essential for preventing accidents and passing your DMV test.",
    "sections": [
      {
        "heading": "Cyclist Rights on the Road",
        "content": "Bicyclists are entitled to use the full traffic lane, especially when the lane is too narrow to share safely. You must not crowd, honk aggressively at, or force a cyclist off the road. Cyclists must follow the same traffic laws as cars — stop signs, signals, and lane markings."
      },
      {
        "heading": "Passing a Cyclist",
        "content": "When passing a cyclist, give at least 3 feet of clearance in most states. Move into the adjacent lane if possible. Pass only when it is safe, and do not cut back into the lane immediately after passing. Check your mirrors before returning to the lane."
      },
      {
        "heading": "Bike Lane Rules",
        "content": "You may not drive in a bike lane except when turning or entering/exiting a driveway. When turning right across a bike lane, yield to any cyclists in the lane before completing your turn. Watch for cyclists in your blind spot before turning."
      },
      {
        "heading": "Dooring Danger",
        "content": "Dooring occurs when a parked driver opens their car door into the path of a cyclist. Always check your mirrors and blind spots before opening your door. Many states hold drivers liable for dooring accidents."
      }
    ],
    "keyFacts": [
      "Give cyclists at least 3 feet when passing",
      "Cyclists are entitled to use the full lane",
      "Yield to cyclists in bike lanes when turning right",
      "Do not drive in bike lanes",
      "Check before opening your car door",
      "Cyclists must follow the same traffic laws as cars"
    ],
    "questions": [
      {
        "question": "When passing a cyclist, you must give at least:",
        "options": [
          "1 foot of clearance",
          "2 feet of clearance",
          "3 feet of clearance",
          "5 feet of clearance"
        ],
        "correct": 2,
        "explanation": "Most states require drivers to give cyclists at least 3 feet of clearance when passing. This space protects cyclists from the wind turbulence and the danger of a close pass."
      },
      {
        "question": "When turning right across a bike lane, you must:",
        "options": [
          "Proceed quickly to avoid blocking cyclists",
          "Yield to cyclists in the lane before turning",
          "Honk to warn cyclists of your turn",
          "Use the bike lane to position for the turn"
        ],
        "correct": 1,
        "explanation": "Before turning right across a bike lane, you must yield to any cyclists in the lane. Check your mirrors and blind spots for cyclists before making the turn."
      },
      {
        "question": "Can you drive in a bike lane?",
        "options": [
          "Yes, when traffic is heavy",
          "Yes, to pass slow vehicles",
          "No, except when turning or crossing",
          "Yes, motorcycles can always use bike lanes"
        ],
        "correct": 2,
        "explanation": "You may not drive in a bike lane except when you need to cross it to turn or enter a driveway. Even then, yield to cyclists before crossing the bike lane."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/when-must-you-yield-to-a-bicyclist",
        "label": "When Must You Yield to a Bicyclist?"
      },
      {
        "href": "/questions/what-is-a-bike-lane-marking",
        "label": "What is a Bike Lane Marking?"
      },
      {
        "href": "/questions/right-of-way-bicycle-in-lane",
        "label": "Right of Way — Bicycle in Lane"
      }
    ]
  },
  {
    "slug": "winter-driving-tips",
    "title": "Winter Driving Tips — Snow and Ice Safety",
    "metaTitle": "Winter Driving Tips — Snow and Ice Safety | DMV Guide",
    "metaDesc": "Learn how to drive safely in snow and ice, including braking techniques, following distance, and what to do if you skid.",
    "intro": "Winter driving conditions are responsible for thousands of accidents every year. Snow and ice dramatically reduce traction and increase stopping distance. This guide covers the essential techniques for safe winter driving.",
    "sections": [
      {
        "heading": "Prepare Your Vehicle",
        "content": "Before driving in winter: check tire tread and pressure, ensure wipers work and washer fluid is full, clear all snow and ice from windows, roof, hood, and lights, check brakes and battery, and keep an emergency kit in your car."
      },
      {
        "heading": "Adjust Your Driving",
        "content": "In snow and ice: reduce speed significantly, increase following distance to 8-10 seconds, accelerate and brake gently, avoid sudden steering movements, and use engine braking by releasing the gas pedal early. Drive in the tracks left by other vehicles."
      },
      {
        "heading": "Braking on Ice",
        "content": "With ABS brakes, apply firm steady pressure — do not pump. The system pulses automatically. Without ABS, pump the brakes gently. Never slam the brakes on ice as this causes skidding. Begin braking much earlier than normal."
      },
      {
        "heading": "If You Skid",
        "content": "If your rear wheels skid, steer in the direction you want the front to go. Do not brake suddenly. If your front wheels skid (understeer), ease off the gas and let the car slow down before gently steering. Stay calm and make small corrections."
      }
    ],
    "keyFacts": [
      "Increase following distance to 8-10 seconds on ice",
      "With ABS brakes, apply steady firm pressure",
      "Steer into the skid if rear wheels slide",
      "Clear all snow from your vehicle before driving",
      "Black ice is invisible and extremely dangerous",
      "Start braking much earlier than normal"
    ],
    "questions": [
      {
        "question": "How should you brake on icy roads with ABS?",
        "options": [
          "Pump the brakes rapidly",
          "Apply firm steady pressure and let ABS work",
          "Brake as hard as possible",
          "Avoid braking entirely"
        ],
        "correct": 1,
        "explanation": "With ABS (Anti-lock Braking System), apply firm steady pressure to the brake pedal. The system automatically pulses the brakes to prevent wheel lockup. Do not pump ABS brakes."
      },
      {
        "question": "What should you do if your rear wheels begin to skid?",
        "options": [
          "Brake immediately",
          "Steer away from the skid direction",
          "Steer in the direction you want the front to go",
          "Accelerate to regain traction"
        ],
        "correct": 2,
        "explanation": "If your rear wheels skid, steer in the direction you want the front of the car to go. This countersteering technique helps bring the car back in line. Do not brake suddenly."
      },
      {
        "question": "What following distance should you maintain on ice?",
        "options": [
          "3 seconds",
          "4-6 seconds",
          "8-10 seconds",
          "1-2 seconds"
        ],
        "correct": 2,
        "explanation": "On ice, increase your following distance to 8-10 seconds. Ice can increase stopping distance by up to 10 times compared to dry roads. Always give yourself much more space."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-black-ice",
        "label": "What is Black Ice?"
      },
      {
        "href": "/questions/how-to-drive-in-snow",
        "label": "How to Drive in Snow?"
      },
      {
        "href": "/questions/how-do-you-recover-from-a-skid",
        "label": "How Do You Recover from a Skid?"
      }
    ]
  },
  {
    "slug": "roundabout-guide",
    "title": "How to Drive Through a Roundabout",
    "metaTitle": "How to Drive Through a Roundabout — DMV Guide",
    "metaDesc": "Step-by-step guide to navigating roundabouts safely. Learn who yields, how to signal, and how to exit a roundabout correctly.",
    "intro": "Roundabouts are becoming more common across the US as a safer alternative to traditional intersections. Many new drivers find them confusing at first. This guide explains exactly how to navigate a roundabout safely.",
    "sections": [
      {
        "heading": "What is a Roundabout",
        "content": "A roundabout is a circular intersection where traffic flows counterclockwise around a central island. There are no traffic signals. Entering vehicles must yield to circulating traffic. Roundabouts reduce serious crashes by up to 90% compared to traditional intersections."
      },
      {
        "heading": "How to Enter a Roundabout",
        "content": "Slow down as you approach. Yield to vehicles already inside the roundabout. Look left — that is where circulating traffic comes from. When there is a safe gap, enter the roundabout and proceed counterclockwise. Do not stop inside the roundabout unless necessary."
      },
      {
        "heading": "How to Exit a Roundabout",
        "content": "Signal right before your exit. Exit into the lane that corresponds to your entry lane. Yield to pedestrians and cyclists at the exit. Do not change lanes inside the roundabout. If you miss your exit, continue around and try again."
      },
      {
        "heading": "Multi-Lane Roundabouts",
        "content": "In a multi-lane roundabout, choose your lane before entering based on your destination. Right lane for right turn or going straight. Left lane for going straight or turning left or making a U-turn. Follow lane markings and signs carefully."
      }
    ],
    "keyFacts": [
      "Yield to vehicles already inside the roundabout",
      "Traffic flows counterclockwise",
      "Signal right before your exit",
      "Do not stop inside the roundabout",
      "If you miss your exit, go around again",
      "Look left for circulating traffic when entering"
    ],
    "questions": [
      {
        "question": "Who has the right of way in a roundabout?",
        "options": [
          "Vehicles entering the roundabout",
          "Vehicles already circulating inside",
          "The vehicle on the right",
          "The first vehicle to signal"
        ],
        "correct": 1,
        "explanation": "Vehicles already circulating inside the roundabout have the right of way. Vehicles entering must yield and wait for a safe gap before entering."
      },
      {
        "question": "In which direction does traffic flow in a roundabout?",
        "options": [
          "Clockwise",
          "Counterclockwise",
          "Either direction depending on the roundabout",
          "Straight through"
        ],
        "correct": 1,
        "explanation": "Traffic always flows counterclockwise in US roundabouts. As you enter, keep the central island on your left and travel around it counterclockwise to your exit."
      },
      {
        "question": "What should you do if you miss your exit in a roundabout?",
        "options": [
          "Stop and reverse",
          "Make a sharp left turn",
          "Continue around and take your exit on the next pass",
          "Exit at the nearest available road"
        ],
        "correct": 2,
        "explanation": "If you miss your exit, continue around the roundabout and take your exit on the next pass. Never stop, reverse, or make sudden turns inside a roundabout."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/who-must-yield-in-a-roundabout",
        "label": "Who Must Yield in a Roundabout?"
      },
      {
        "href": "/questions/what-is-the-correct-way-to-enter-a-roundabout",
        "label": "How to Enter a Roundabout"
      },
      {
        "href": "/dmv-guide/right-of-way-at-intersections",
        "label": "Right-of-Way at Intersections"
      }
    ]
  },
  {
    "slug": "new-driver-tips",
    "title": "Tips for New Drivers — What to Know Before You Drive",
    "metaTitle": "Tips for New Drivers — What to Know Before You Drive | DMV Guide",
    "metaDesc": "Essential tips for new and teen drivers including vehicle checks, night driving, highway driving, and how to handle emergencies.",
    "intro": "Getting your driver's license is a major milestone. But passing the test is just the beginning. This guide covers the most important things new drivers need to know to stay safe on the road.",
    "sections": [
      {
        "heading": "Before You Drive",
        "content": "Before every trip: adjust your seat, mirrors, and steering wheel, fasten your seat belt, check that all passengers are buckled, glance at the dashboard for warning lights, and know your route. These habits take seconds but prevent accidents."
      },
      {
        "heading": "Managing Distractions",
        "content": "New drivers are especially vulnerable to distraction. Put your phone away completely before driving. Set your GPS before you start. Limit passengers in the car initially — conversation is distracting. Keep the radio at a low volume so you can hear traffic sounds."
      },
      {
        "heading": "Night Driving",
        "content": "Night driving is more dangerous than daytime driving. Use headlights from sunset to sunrise. Use high beams on dark roads when no other traffic is present. Watch for pedestrians and animals which are harder to see at night. Reduce speed as visibility is reduced."
      },
      {
        "heading": "What to Do in an Emergency",
        "content": "If your brakes fail, pump them repeatedly and use the parking brake gradually. If a tire blows out, grip the wheel firmly and steer straight, do not brake suddenly, let the car slow naturally. If you go off the road, steer gently back without overcorrecting."
      }
    ],
    "keyFacts": [
      "Always do a pre-drive check",
      "Put your phone away before driving",
      "New drivers should limit passengers initially",
      "Night driving requires extra caution",
      "Seat belts must be worn by everyone",
      "Know what to do before an emergency happens"
    ],
    "questions": [
      {
        "question": "What should you do before every drive?",
        "options": [
          "Check your phone messages",
          "Adjust seat and mirrors and buckle up",
          "Set the radio to your preferred station",
          "Check your appearance in the mirror"
        ],
        "correct": 1,
        "explanation": "Before every drive, adjust your seat, mirrors, and steering wheel, then fasten your seat belt. Ensure all passengers are buckled before starting the vehicle."
      },
      {
        "question": "What should you do if a tire blows out while driving?",
        "options": [
          "Brake hard immediately",
          "Grip the wheel firmly and do not brake suddenly",
          "Turn sharply to the shoulder",
          "Accelerate to maintain control"
        ],
        "correct": 1,
        "explanation": "If a tire blows out, grip the steering wheel firmly with both hands, do not brake suddenly, steer straight ahead, let the vehicle slow naturally, then gently guide it to the shoulder."
      },
      {
        "question": "When driving at night, you should:",
        "options": [
          "Drive at the same speed as daytime",
          "Reduce speed since visibility is reduced",
          "Use high beams at all times",
          "Follow other cars very closely for guidance"
        ],
        "correct": 1,
        "explanation": "Night driving reduces visibility significantly. Reduce your speed so you can stop within the distance your headlights illuminate. Be extra alert for pedestrians and animals."
      }
    ],
    "relatedLinks": [
      {
        "href": "/dmv-guide/distracted-driving",
        "label": "Distracted Driving Guide"
      },
      {
        "href": "/dmv-guide/seat-belt-laws",
        "label": "Seat Belt Laws"
      },
      {
        "href": "/dmv-guide/how-to-pass-dmv-test",
        "label": "How to Pass Your DMV Test"
      }
    ]
  },
  {
    "slug": "school-bus-safety",
    "title": "School Bus Safety Rules Every Driver Must Know",
    "metaTitle": "School Bus Safety Rules — DMV Guide",
    "metaDesc": "Learn when to stop for a school bus, school bus safety zones, and the penalties for passing a stopped school bus.",
    "intro": "School bus safety laws exist to protect children — the most vulnerable road users. Violating school bus laws carries severe penalties in every state. This guide explains exactly what you must do when you encounter a school bus.",
    "sections": [
      {
        "heading": "When to Stop for a School Bus",
        "content": "You must stop for a school bus when its red lights are flashing and the stop arm is extended. On undivided roads, all traffic in both directions must stop. On divided highways with a raised median, only traffic behind the bus must stop. Traffic on the other side of a divided highway may proceed."
      },
      {
        "heading": "The School Bus Safety Zone",
        "content": "The school bus safety zone extends 10 feet in front of and behind a stopped bus. Children are most at risk in this zone. Remain stopped until all children have completely cleared the safety zone, the stop arm is retracted, and the red lights stop flashing."
      },
      {
        "heading": "School Zone Speed Limits",
        "content": "School zones have reduced speed limits — typically 15-25 mph — when lights are flashing or children are present. The exact limit varies by state. Fines for speeding in school zones are doubled in most states. Always watch for children even outside official school hours."
      },
      {
        "heading": "Penalties for Violations",
        "content": "Passing a stopped school bus is a serious traffic violation. Penalties include heavy fines (often $500-$1,000+), license points, and possible license suspension. In some states it is a misdemeanor criminal offense. School buses may be equipped with cameras that automatically ticket violators."
      }
    ],
    "keyFacts": [
      "Stop for school buses with flashing red lights in both directions on undivided roads",
      "School bus safety zone extends 10 feet in front and behind",
      "Stay stopped until all children have cleared",
      "School zone speed limits are typically 15-25 mph",
      "Fines are doubled in school zones",
      "Passing a stopped bus can result in license suspension"
    ],
    "questions": [
      {
        "question": "On an undivided road, when a school bus stops with red lights flashing, traffic in which directions must stop?",
        "options": [
          "Only traffic behind the bus",
          "Only oncoming traffic",
          "Traffic in both directions",
          "No traffic needs to stop"
        ],
        "correct": 2,
        "explanation": "On an undivided road, all traffic in both directions must stop when a school bus activates its red flashing lights. Only on a divided highway with a raised median can opposite-direction traffic proceed."
      },
      {
        "question": "When can you proceed past a stopped school bus?",
        "options": [
          "After 30 seconds",
          "When the driver waves you through",
          "When the red lights stop and stop arm is retracted and all children have cleared",
          "When you can see no children nearby"
        ],
        "correct": 2,
        "explanation": "You must remain stopped until the school bus red lights stop flashing, the stop arm is retracted, and all children have completely cleared the school bus safety zone."
      },
      {
        "question": "How far does the school bus safety zone extend?",
        "options": [
          "5 feet in front and behind",
          "10 feet in front and behind",
          "20 feet in front and behind",
          "50 feet in front and behind"
        ],
        "correct": 1,
        "explanation": "The school bus safety zone extends 10 feet in front of and behind a stopped school bus. Children are most at risk in this area as they move to and from the bus."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/when-must-you-stop-for-a-school-bus",
        "label": "When Must You Stop for a School Bus?"
      },
      {
        "href": "/questions/what-is-a-school-bus-safety-zone",
        "label": "What is the School Bus Safety Zone?"
      },
      {
        "href": "/questions/what-is-the-speed-limit-in-a-school-zone",
        "label": "School Zone Speed Limit"
      }
    ]
  },
  {
    "slug": "dmv-test-day-guide",
    "title": "DMV Test Day — What to Expect and How to Prepare",
    "metaTitle": "DMV Test Day Guide — What to Expect | DMV Study Guide",
    "metaDesc": "Everything you need to know about DMV test day: what to bring, how the test works, what to expect, and tips to pass first time.",
    "intro": "Test day nerves are normal, but preparation is everything. Knowing what to expect at the DMV reduces anxiety and helps you perform your best. This guide walks you through everything that happens on DMV test day.",
    "sections": [
      {
        "heading": "What to Bring",
        "content": "Bring your proof of identity (birth certificate or passport), proof of Social Security number, proof of residency (utility bill or bank statement), payment for fees, and if under 18, a parent or guardian signature. Check your state DMV website for the exact requirements as they vary."
      },
      {
        "heading": "The Written Test Format",
        "content": "The written knowledge test is multiple choice. The number of questions varies by state — from 18 (Pennsylvania) to 50 (Florida and Michigan). You must score 70-83% to pass depending on your state. Most DMVs now offer the test on a computer or tablet."
      },
      {
        "heading": "Tips to Pass",
        "content": "Study the official driver handbook for your state. Take multiple practice tests until you consistently score above 90%. Pay special attention to road signs, right-of-way rules, and alcohol laws — these are heavily tested. Get a good night sleep before test day."
      },
      {
        "heading": "If You Fail",
        "content": "If you fail the written test, most states allow you to retake it after a waiting period — usually 1-7 days. Some states limit the number of attempts per day. Use the failure as a learning opportunity to study the areas where you made mistakes."
      }
    ],
    "keyFacts": [
      "Bring required documents — check your state DMV website",
      "Questions range from 18 to 50 depending on state",
      "Passing score is typically 70-83%",
      "Most tests are now computerized",
      "You can retake if you fail, usually after a waiting period",
      "Study road signs and right-of-way rules especially"
    ],
    "questions": [
      {
        "question": "What passing score is typically required on the DMV written test?",
        "options": [
          "50-60%",
          "70-83%",
          "90-95%",
          "100%"
        ],
        "correct": 1,
        "explanation": "Most states require a score of 70-83% to pass the written knowledge test. The exact percentage varies by state. For example, California requires 83% and Florida requires 80%."
      },
      {
        "question": "Which topics are most commonly tested on the DMV written exam?",
        "options": [
          "Vehicle maintenance and repairs",
          "Road signs, right-of-way, and alcohol laws",
          "Navigation and GPS use",
          "Insurance requirements"
        ],
        "correct": 1,
        "explanation": "The DMV written test heavily focuses on road signs, right-of-way rules, speed limits, and alcohol and drug laws. These topics appear on virtually every state's exam."
      },
      {
        "question": "How many questions are on the Florida DMV written test?",
        "options": [
          "20 questions",
          "30 questions",
          "46 questions",
          "50 questions"
        ],
        "correct": 3,
        "explanation": "Florida's DMV written knowledge test has 50 questions. You must answer at least 40 correctly (80%) to pass. Other states have different numbers — California has 46, New York has 20."
      }
    ],
    "relatedLinks": [
      {
        "href": "/dmv-guide/how-to-pass-the-permit-test",
        "label": "How to Pass the Permit Test"
      },
      {
        "href": "/questions/what-documents-do-you-need-for-dmv-test",
        "label": "Documents Needed for DMV Test"
      },
      {
        "href": "/states",
        "label": "Practice Tests by State"
      }
    ]
  },
  {
    "slug": "defensive-driving-guide",
    "title": "Defensive Driving — How to Stay Safe on the Road",
    "metaTitle": "Defensive Driving Guide — Stay Safe on the Road | DMV Guide",
    "metaDesc": "Learn defensive driving techniques including scanning ahead, managing space, and anticipating hazards. Essential for new drivers.",
    "intro": "Defensive driving means driving to prevent accidents regardless of other drivers' mistakes. It is a set of skills and habits that keep you safe even when other drivers behave unpredictably. This guide covers the core principles.",
    "sections": [
      {
        "heading": "Scan Ahead",
        "content": "Look 10-15 seconds ahead down the road — not just at the car directly in front. This gives you time to react to hazards. Identify brake lights, merging vehicles, pedestrians, and road conditions early. The farther ahead you look, the more time you have to respond safely."
      },
      {
        "heading": "Manage Your Space",
        "content": "Maintain a safety cushion around your vehicle. Keep at least 3-4 seconds of following distance. Leave extra space to the sides when possible. Never position yourself in another driver's blind spot for an extended time. Create escape routes — always have somewhere to go if something goes wrong."
      },
      {
        "heading": "Anticipate Hazards",
        "content": "Predict what other drivers might do. A car approaching a stop sign may not stop. A pedestrian near the road may step off the curb. A dog near traffic may run into the street. Expecting the unexpected allows you to react in time."
      },
      {
        "heading": "Avoid Distractions and Aggression",
        "content": "Defensive driving means keeping your focus entirely on driving. No phone, no eating, no adjusting controls while moving. If another driver acts aggressively, do not respond — let them pass and create distance. Getting involved in road rage is never worth it."
      }
    ],
    "keyFacts": [
      "Look 10-15 seconds ahead down the road",
      "Maintain 3-4 seconds following distance",
      "Never stay in another driver's blind spot",
      "Always have an escape route in mind",
      "Expect other drivers to make mistakes",
      "Avoid all distractions while driving"
    ],
    "questions": [
      {
        "question": "Defensive driving primarily means:",
        "options": [
          "Driving aggressively to get where you are going faster",
          "Anticipating hazards and driving to prevent accidents",
          "Following all traffic laws exactly",
          "Driving below the speed limit at all times"
        ],
        "correct": 1,
        "explanation": "Defensive driving means anticipating hazards and the mistakes of other drivers before they happen. It is a proactive approach to safety that goes beyond just following the rules."
      },
      {
        "question": "How far ahead should you scan the road while driving?",
        "options": [
          "Just beyond the car in front of you",
          "About 3-4 seconds ahead",
          "10-15 seconds ahead down the road",
          "As far as you can see"
        ],
        "correct": 2,
        "explanation": "Look 10-15 seconds ahead down the road. This gives you time to identify and react to hazards before they become emergencies. At 60 mph, 10 seconds is about 880 feet."
      },
      {
        "question": "What should you do if an aggressive driver is tailgating you?",
        "options": [
          "Brake suddenly to teach them a lesson",
          "Speed up to maintain distance",
          "Move over and let them pass when safe",
          "Make eye contact and gesture at them"
        ],
        "correct": 2,
        "explanation": "When being tailgated, move over safely and let the aggressive driver pass. Engaging with aggressive drivers escalates the situation and is dangerous. Create distance and disengage."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-defensive-driving",
        "label": "What is Defensive Driving?"
      },
      {
        "href": "/questions/what-is-road-rage",
        "label": "What is Road Rage?"
      },
      {
        "href": "/questions/what-is-the-safe-following-distance",
        "label": "What is the Safe Following Distance?"
      }
    ]
  },
  {
    "slug": "alcohol-and-driving",
    "title": "Alcohol and Driving — Laws, Limits, and Consequences",
    "metaTitle": "Alcohol and Driving — Laws, Limits, and Consequences | DMV Guide",
    "metaDesc": "Everything you need to know about drunk driving laws, BAC limits, zero tolerance for minors, and DUI consequences for your permit test.",
    "intro": "Alcohol is involved in about 30% of all traffic fatalities in the US. Understanding the laws and dangers of drunk driving is essential for your DMV test and for your safety. This guide covers everything you need to know.",
    "sections": [
      {
        "heading": "BAC Limits",
        "content": "Blood Alcohol Content (BAC) measures how much alcohol is in your blood. The legal limit for adult drivers is 0.08% in all US states. For commercial drivers it is 0.04%. For drivers under 21, most states have zero tolerance — any detectable BAC can result in a DUI charge."
      },
      {
        "heading": "How Alcohol Impairs Driving",
        "content": "Alcohol begins impairing driving ability at very low levels — even below the legal limit. Effects include: slowed reaction time, reduced coordination, impaired judgment, blurred or double vision, difficulty concentrating, and false confidence. There is no safe amount of alcohol to drink before driving."
      },
      {
        "heading": "Implied Consent and Breathalyzers",
        "content": "By driving on public roads, you consent to chemical testing if an officer suspects DUI. Refusing a breathalyzer causes automatic license suspension — typically 1 year for a first refusal. The suspension applies even if you are not convicted of DUI."
      },
      {
        "heading": "DUI Consequences",
        "content": "DUI consequences are severe: license suspension or revocation, fines of $1,000-$10,000+, possible jail time, mandatory alcohol education programs, ignition interlock device installation, increased insurance rates, and a permanent criminal record."
      }
    ],
    "keyFacts": [
      "Legal BAC limit is 0.08% for adults",
      "0.04% for commercial drivers",
      "Zero tolerance for drivers under 21",
      "Alcohol impairs driving even below the legal limit",
      "Coffee does not speed up sobering — only time does",
      "Refusing a breathalyzer causes automatic license suspension"
    ],
    "questions": [
      {
        "question": "At what BAC level does alcohol begin to impair driving ability?",
        "options": [
          "Only at 0.08% or above",
          "At any level above 0.00%",
          "At 0.05% or above",
          "Only when you feel drunk"
        ],
        "correct": 1,
        "explanation": "Alcohol begins to impair driving ability at very low BAC levels — even below the legal limit of 0.08%. Reaction time and judgment are affected from the first drink."
      },
      {
        "question": "What is the BAC limit for drivers under 21 in zero tolerance states?",
        "options": [
          "0.08%",
          "0.04%",
          "0.02% or 0.00%",
          "0.05%"
        ],
        "correct": 2,
        "explanation": "In zero tolerance states, drivers under 21 can be charged with DUI for any detectable BAC — typically 0.00% to 0.02%. This is much stricter than the 0.08% adult limit."
      },
      {
        "question": "What happens if you refuse a breathalyzer test?",
        "options": [
          "Nothing — you have the right to refuse",
          "You will be arrested immediately",
          "Your license will be automatically suspended",
          "You will be fined but keep your license"
        ],
        "correct": 2,
        "explanation": "Under implied consent laws, refusing a breathalyzer results in automatic license suspension — typically 1 year for a first refusal. This applies even if you are not convicted of DUI."
      }
    ],
    "relatedLinks": [
      {
        "href": "/questions/what-is-the-bac-limit-for-driving",
        "label": "What is the BAC Limit?"
      },
      {
        "href": "/questions/what-is-dui",
        "label": "What is DUI?"
      },
      {
        "href": "/dmv-guide/driving-under-the-influence",
        "label": "DUI Laws Guide"
      }
    ]
  },
];

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = TOPICS.find((t) => t.slug === params.topic);
  if (!topic) return {};
  return { title: topic.metaTitle, description: topic.metaDesc };
}

export default function DMVGuidePage({ params }: Props) {
  const topic = TOPICS.find((t) => t.slug === params.topic);
  if (!topic) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/dmv-guide" className="hover:text-blue-600">DMV Guide</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">{topic.title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{topic.title}</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">{topic.intro}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-blue-900 text-lg">Key Facts to Remember</h2>
            </div>
            <ul className="space-y-2">
              {topic.keyFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-800 text-sm">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          {topic.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </section>
          ))}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-yellow-700" />
              <h2 className="font-bold text-yellow-900 text-lg">Example DMV Test Questions</h2>
            </div>
            <div className="space-y-6">
              {topic.questions.map((q, qi) => (
                <div key={qi} className="bg-white rounded-lg p-4 border border-yellow-100">
                  <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.question}</p>
                  <ul className="space-y-1 mb-3">
                    {q.options.map((opt, oi) => (
                      <li key={oi} className={`text-sm px-3 py-1.5 rounded flex items-center gap-2 ${oi === q.correct ? "bg-green-100 text-green-800 font-medium" : "text-gray-600"}`}>
                        {oi === q.correct && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                        {oi !== q.correct && <span className="w-3.5 h-3.5 flex-shrink-0" />}
                        {String.fromCharCode(65 + oi)}. {opt}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 bg-green-50 rounded p-2">
                    <AlertTriangle className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800"><strong>Explanation:</strong> {q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-blue-600 text-white p-8 text-center mb-8">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-80" />
            <h2 className="text-xl font-bold mb-2">Ready to Practice More?</h2>
            <p className="mb-4 text-blue-100 text-sm">Take a full DMV practice test with real exam-style questions.</p>
            <Link href="/state/florida/dmv-practice-test" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.relatedLinks.map((link, i) => (
                <Link key={i} href={link.href} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
