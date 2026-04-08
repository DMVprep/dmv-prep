import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { VocabularySearch } from "./VocabularySearch";

export const metadata: Metadata = {
  title: "DMV Vocabulary — 120+ Driving Terms Explained in Plain English",
  description: "Learn the key DMV vocabulary words you need to pass your permit test. Every driving term explained in simple, plain English — perfect for ESL learners and first-time drivers.",
  keywords: ["DMV vocabulary", "driving terms", "permit test words", "ESL driving", "DMV glossary", "driving dictionary"],
  alternates: { canonical: "https://dmv-prep.com/vocabulary" },
};

interface Term {
  word: string;
  definition: string;
  category: string;
  example?: string;
}

const VOCAB_TERMS: Term[] = [
  // Road & Infrastructure
  { word: "Intersection", definition: "Where two or more roads meet or cross each other.", category: "Road", example: "Stop and look both ways before entering an intersection." },
  { word: "Lane", definition: "A marked section of a road for one line of traffic.", category: "Road", example: "Stay in your lane and check mirrors before changing." },
  { word: "Shoulder", definition: "The paved or unpaved edge of the road, not meant for regular driving.", category: "Road", example: "Pull onto the shoulder if your car breaks down." },
  { word: "Median", definition: "The divider between lanes of traffic going in opposite directions.", category: "Road", example: "Do not cross a raised median to make a U-turn." },
  { word: "Crosswalk", definition: "A marked area where people on foot cross the road.", category: "Road", example: "Always stop for pedestrians in a crosswalk." },
  { word: "Curb", definition: "The raised edge where the road meets the sidewalk.", category: "Road", example: "Park with your wheels within 18 inches of the curb." },
  { word: "Roundabout", definition: "A circular intersection where traffic flows in one direction around a center island.", category: "Road", example: "Yield to traffic already in the roundabout before entering." },
  { word: "Overpass", definition: "A bridge that carries one road over another road or railroad.", category: "Road" },
  { word: "On-ramp", definition: "The short road you use to enter a highway or freeway.", category: "Road", example: "Speed up on the on-ramp to match highway traffic speed." },
  { word: "Off-ramp", definition: "The short road you use to exit a highway or freeway.", category: "Road" },
  { word: "Deceleration lane", definition: "A lane on the side of a highway where you slow down before exiting.", category: "Road" },
  { word: "Acceleration lane", definition: "A lane where you speed up to merge onto a highway.", category: "Road" },
  { word: "Turnout", definition: "A wide spot on a narrow road where slower vehicles can pull over to let others pass.", category: "Road" },
  { word: "Grade", definition: "The steepness of a hill or slope on a road.", category: "Road", example: "Use a lower gear when driving down a steep grade." },
  { word: "Pavement", definition: "The hard surface of a road, usually made of asphalt or concrete.", category: "Road" },

  // Signs & Signals
  { word: "Yield", definition: "Slow down and let other traffic go first. Stop if you need to.", category: "Signs", example: "Yield to traffic on the left when entering a roundabout." },
  { word: "Regulatory sign", definition: "A sign that tells you about a law or rule you must follow, like speed limits or stop signs.", category: "Signs" },
  { word: "Warning sign", definition: "A sign that alerts you to a danger or change ahead, usually yellow and diamond-shaped.", category: "Signs" },
  { word: "Guide sign", definition: "A sign that gives directions, distances, or information. Usually green or blue.", category: "Signs" },
  { word: "Crossbuck", definition: "The X-shaped sign at a railroad crossing. It means yield to trains.", category: "Signs" },
  { word: "Flashing red light", definition: "Treat it like a stop sign — come to a complete stop, then go when safe.", category: "Signs" },
  { word: "Flashing yellow light", definition: "Slow down and proceed with caution. You do not need to stop.", category: "Signs" },
  { word: "Pennant sign", definition: "A triangle-shaped sign on the left side of the road that means no passing zone.", category: "Signs" },
  { word: "Advisory speed sign", definition: "A yellow sign that suggests a safe speed for a curve or ramp. It is not a law, but a recommendation.", category: "Signs" },
  { word: "Shared lane marking", definition: "A road marking (called a sharrow) showing that bikes and cars share the same lane.", category: "Signs" },

  // Driving Actions
  { word: "Merge", definition: "Move smoothly into a lane of traffic that is already moving.", category: "Actions", example: "Check your mirrors and blind spot before you merge." },
  { word: "Right-of-way", definition: "The right to go first. The law says who must yield to whom.", category: "Actions", example: "Pedestrians in a crosswalk always have the right-of-way." },
  { word: "Blind spot", definition: "An area around your vehicle that you cannot see in your mirrors. You must turn your head to check.", category: "Actions", example: "Always check your blind spot before changing lanes." },
  { word: "Tailgating", definition: "Following the car ahead of you too closely.", category: "Actions", example: "Tailgating is dangerous because you cannot stop in time." },
  { word: "Following distance", definition: "The space you keep between your car and the car in front of you.", category: "Actions", example: "Keep at least a 3-second following distance." },
  { word: "U-turn", definition: "Turning your vehicle around to go in the opposite direction.", category: "Actions", example: "U-turns are not allowed at intersections with a no U-turn sign." },
  { word: "Three-point turn", definition: "A way to turn your car around on a narrow road using forward, reverse, and forward movements.", category: "Actions" },
  { word: "Parallel parking", definition: "Parking your car in line with other parked cars, between two vehicles, along the curb.", category: "Actions" },
  { word: "Passing", definition: "Moving around a slower vehicle by using the lane next to it.", category: "Actions", example: "Do not pass on hills, curves, or near intersections." },
  { word: "Overtake", definition: "Another word for passing — driving past a slower vehicle.", category: "Actions" },
  { word: "Hydroplaning", definition: "When your tires lose grip on wet roads and ride on top of the water. You lose control of steering.", category: "Actions", example: "Slow down in rain to avoid hydroplaning." },
  { word: "Skid", definition: "When your tires slide and you lose control. Usually caused by braking too hard or wet/icy roads.", category: "Actions", example: "If you skid, ease off the gas and steer where you want to go." },
  { word: "Fishtailing", definition: "When the back end of your car slides from side to side.", category: "Actions" },
  { word: "Steer", definition: "To control the direction of your car using the steering wheel.", category: "Actions" },
  { word: "Brake", definition: "To slow down or stop your vehicle by pressing the brake pedal.", category: "Actions" },
  { word: "Accelerate", definition: "To speed up by pressing the gas pedal.", category: "Actions" },
  { word: "Signal", definition: "To use your turn signals (blinkers) to tell other drivers you are turning or changing lanes.", category: "Actions", example: "Signal at least 100 feet before turning." },

  // Vehicle Parts
  { word: "Turn signal (blinker)", definition: "The flashing light on your car that shows which direction you plan to turn.", category: "Vehicle" },
  { word: "Headlights", definition: "The front lights on your car. Use them at night and in bad weather.", category: "Vehicle" },
  { word: "High beams", definition: "Extra-bright headlights for dark roads. Dim them within 500 feet of other cars.", category: "Vehicle" },
  { word: "Tail lights", definition: "The red lights at the back of your car that turn on with your headlights.", category: "Vehicle" },
  { word: "Hazard lights", definition: "Flashing lights (all four blinkers) that warn other drivers your car is stopped or there is a problem.", category: "Vehicle" },
  { word: "Windshield", definition: "The large front window of your car.", category: "Vehicle" },
  { word: "Dashboard", definition: "The panel in front of the driver that shows speed, fuel, and warning lights.", category: "Vehicle" },
  { word: "Odometer", definition: "The gauge that shows the total miles your car has driven.", category: "Vehicle" },
  { word: "Speedometer", definition: "The gauge that shows how fast you are driving right now.", category: "Vehicle" },
  { word: "Rearview mirror", definition: "The mirror inside your car that lets you see behind you through the rear window.", category: "Vehicle" },
  { word: "Side mirror", definition: "The mirrors on the outside of your car doors that help you see traffic beside and behind you.", category: "Vehicle" },
  { word: "Steering wheel", definition: "The wheel you hold and turn to control the direction of your car.", category: "Vehicle" },
  { word: "Ignition", definition: "The system that starts your car engine, usually with a key or button.", category: "Vehicle" },
  { word: "Parking brake", definition: "A separate brake (hand brake or foot pedal) that keeps your parked car from rolling.", category: "Vehicle" },
  { word: "ABS (Anti-lock Braking System)", definition: "A safety system that stops your wheels from locking up when you brake hard. Pump action happens automatically.", category: "Vehicle" },

  // Laws & Rules
  { word: "Implied consent", definition: "By driving, you automatically agree to take a breath or blood test if an officer suspects you are drunk.", category: "Laws" },
  { word: "BAC (Blood Alcohol Concentration)", definition: "The amount of alcohol in your blood. The legal limit is 0.08% for adults.", category: "Laws", example: "For drivers under 21, any BAC above 0.00-0.02% is illegal." },
  { word: "DUI / DWI", definition: "Driving Under the Influence / Driving While Intoxicated. Driving after drinking alcohol or using drugs.", category: "Laws" },
  { word: "Zero tolerance", definition: "A law that means any amount of alcohol is illegal for drivers under 21.", category: "Laws" },
  { word: "GDL (Graduated Driver Licensing)", definition: "A system that gives new drivers more privileges in stages — permit, then restricted license, then full license.", category: "Laws" },
  { word: "Learner's permit", definition: "The first license for a new driver. You must drive with a licensed adult in the car.", category: "Laws" },
  { word: "Provisional license", definition: "A restricted license for new drivers, usually with rules about nighttime driving and passengers.", category: "Laws" },
  { word: "Points system", definition: "A way states track traffic violations. Too many points can result in a suspended license.", category: "Laws" },
  { word: "Suspended license", definition: "Your license is temporarily taken away. You are not allowed to drive.", category: "Laws" },
  { word: "Revoked license", definition: "Your license is permanently cancelled. You must reapply to get a new one.", category: "Laws" },
  { word: "Registration", definition: "The official document that proves your car is legally allowed to be on the road.", category: "Laws" },
  { word: "Liability insurance", definition: "Insurance that pays for damage you cause to other people or their property in a crash.", category: "Laws" },
  { word: "Financial responsibility", definition: "The legal requirement to be able to pay for damages if you cause a crash — usually met by having insurance.", category: "Laws" },
  { word: "Move over law", definition: "A law requiring you to change lanes or slow down when passing stopped emergency vehicles with flashing lights.", category: "Laws" },
  { word: "Right turn on red", definition: "Turning right at a red light after making a full stop and yielding — allowed unless a sign says otherwise.", category: "Laws" },
  { word: "Open container law", definition: "A law that makes it illegal to have an open bottle or can of alcohol in the passenger area of a car.", category: "Laws" },
  { word: "School zone", definition: "The area near a school with a lower speed limit when children are present.", category: "Laws", example: "Slow down to 15-25 mph in a school zone when lights are flashing." },

  // Safety
  { word: "Defensive driving", definition: "A way of driving that focuses on watching for danger and being prepared to react safely.", category: "Safety" },
  { word: "Cushion of safety", definition: "The space you keep around your car on all sides to give yourself room to react.", category: "Safety" },
  { word: "Scanning", definition: "Looking ahead, to the sides, and in mirrors to stay aware of traffic and hazards.", category: "Safety", example: "Scan intersections before entering, even if the light is green." },
  { word: "Stopping distance", definition: "The total distance your car travels from when you see a hazard to when you fully stop. Includes reaction time and braking.", category: "Safety" },
  { word: "Reaction time", definition: "The time between seeing a hazard and actually pressing the brake. Usually about 1.5 seconds.", category: "Safety" },
  { word: "Braking distance", definition: "The distance your car travels from when you press the brake until it fully stops.", category: "Safety" },
  { word: "Traction", definition: "The grip your tires have on the road surface. Wet, icy, or gravel roads reduce traction.", category: "Safety" },
  { word: "Visibility", definition: "How far and how clearly you can see the road, other vehicles, and hazards.", category: "Safety", example: "Turn on headlights when visibility is low." },
  { word: "Child restraint", definition: "A car seat or booster seat designed to keep a child safe in a vehicle.", category: "Safety" },
  { word: "Airbag", definition: "A safety device inside the car that inflates quickly during a crash to protect you.", category: "Safety" },
  { word: "Seat belt", definition: "The strap across your lap and chest that holds you in your seat during a crash.", category: "Safety" },
  { word: "Work zone", definition: "A section of road where construction is happening. Lower speeds and special signs apply.", category: "Safety", example: "Fines are doubled in work zones in most states." },

  // Types of Vehicles & Road Users
  { word: "Pedestrian", definition: "A person walking, jogging, or using a wheelchair on or near the road.", category: "Users", example: "Pedestrians always have the right-of-way in a crosswalk." },
  { word: "Cyclist", definition: "A person riding a bicycle. Cyclists have the same rights and duties as drivers.", category: "Users" },
  { word: "Motorcyclist", definition: "A person riding a motorcycle. They are harder to see than cars.", category: "Users" },
  { word: "Commercial vehicle", definition: "A large vehicle used for business, like a truck or bus.", category: "Users" },
  { word: "Emergency vehicle", definition: "A police car, fire truck, or ambulance with flashing lights and/or sirens.", category: "Users", example: "Pull over and stop when an emergency vehicle is behind you with lights on." },
  { word: "Slow-moving vehicle", definition: "A vehicle that cannot go faster than 25 mph, marked with an orange triangle on the back.", category: "Users" },

  // Conditions & Situations
  { word: "Inclement weather", definition: "Bad weather — rain, snow, ice, fog, or strong wind that makes driving dangerous.", category: "Conditions" },
  { word: "Black ice", definition: "A thin, nearly invisible layer of ice on the road. Extremely dangerous because you cannot see it.", category: "Conditions" },
  { word: "Fog", definition: "A thick cloud near the ground that makes it very hard to see. Use low beams, not high beams.", category: "Conditions" },
  { word: "Glare", definition: "Bright light from the sun or oncoming headlights that makes it hard to see.", category: "Conditions" },
  { word: "Road rage", definition: "Extreme anger or aggressive behavior by a driver, such as honking, yelling, or dangerous driving.", category: "Conditions", example: "If another driver shows road rage, do not engage. Stay calm and move away." },
  { word: "Rubbernecking", definition: "Slowing down to stare at a crash or incident on the road. This causes more traffic and accidents.", category: "Conditions" },
  { word: "Gridlock", definition: "When traffic is so jammed that vehicles cannot move in any direction.", category: "Conditions" },
  { word: "Fender bender", definition: "A minor car crash with little damage and no serious injuries.", category: "Conditions" },
  { word: "Hit and run", definition: "Leaving the scene of a crash without stopping to help or give your information. This is a crime.", category: "Conditions" },
  { word: "Right-of-way violation", definition: "Failing to yield when you are supposed to, such as running a stop sign or cutting off another driver.", category: "Conditions" },

  // Parking
  { word: "Fire hydrant", definition: "A water supply point for firefighters. Never park within 15 feet of one.", category: "Parking" },
  { word: "Handicap parking", definition: "Reserved parking spots for people with disabilities. You need a special permit or plate to use them.", category: "Parking" },
  { word: "Double parking", definition: "Parking next to another parked car, blocking them in. This is illegal.", category: "Parking" },
  { word: "Angle parking", definition: "Parking at an angle to the curb, common in parking lots.", category: "Parking" },
  { word: "Uphill parking", definition: "When parked on a hill facing uphill, turn your wheels away from the curb.", category: "Parking", example: "If your brakes fail, the car will roll into the curb instead of into traffic." },
  { word: "Downhill parking", definition: "When parked on a hill facing downhill, turn your wheels toward the curb.", category: "Parking" },
];

const CATEGORIES = [
  { key: "all", label: "All Terms" },
  { key: "Road", label: "Road & Infrastructure" },
  { key: "Signs", label: "Signs & Signals" },
  { key: "Actions", label: "Driving Actions" },
  { key: "Vehicle", label: "Vehicle Parts" },
  { key: "Laws", label: "Laws & Rules" },
  { key: "Safety", label: "Safety" },
  { key: "Users", label: "Road Users" },
  { key: "Conditions", label: "Conditions & Situations" },
  { key: "Parking", label: "Parking" },
];

export default function VocabularyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DMV Vocabulary</h1>
              <p className="text-sm text-gray-500">{VOCAB_TERMS.length} driving terms explained in plain English</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Every word you need to know for the DMV written test — defined in simple language anyone can understand.
            Perfect if English is your second language or you are studying for the first time.
          </p>
        </div>

        <VocabularySearch terms={VOCAB_TERMS} categories={CATEGORIES} />

        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ready to practice?</h2>
          <p className="text-sm text-gray-600 mb-4">Now that you know the terms, test yourself with real DMV questions.</p>
          <div className="flex justify-center gap-3">
            <Link href="/lessons" className="px-5 py-2.5 bg-white text-blue-600 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
              Read Lessons
            </Link>
            <Link href="/state/florida/dmv-practice-test" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              Start Practice Test →
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "DMV Vocabulary — Driving Terms for the Permit Test",
        description: "120+ driving terms explained in plain English for the DMV written test.",
        url: "https://dmv-prep.com/vocabulary",
        hasDefinedTerm: VOCAB_TERMS.slice(0, 20).map(t => ({
          "@type": "DefinedTerm",
          name: t.word,
          description: t.definition,
        })),
      })}} />
    </div>
  );
}
