// src/app/state/[state]/road-sign-practice-test/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `${state.name} Road Sign Practice Test 2026 — Free DMV Signs Quiz`,
    description: `Learn all ${state.name} road signs with our free practice test. Covers warning signs, regulatory signs, and guide signs tested on the ${state.name} DMV exam.`,
  };
}

const PAGE_LINKS = [
  { href: "dmv-practice-test", label: "Practice Test" },
  { href: "road-sign-practice-test", label: "Road Sign Practice Test" },
  { href: "permit-test-questions", label: "Permit Test Questions" },
  { href: "dmv-handbook-summary", label: "DMV Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips & Guide" }
];

interface SignEntry { name: string; img: string; desc: string; }
interface SignCat { name: string; color: string; titleColor: string; description: string; signs: SignEntry[]; }

const SIGN_CATEGORIES: SignCat[] = [
  {
    name: "Regulatory Signs",
    color: "bg-red-50 border-red-200",
    titleColor: "text-red-800",
    description: "Regulatory signs control traffic. They set limits or instruct drivers what they should or should not do and are enforceable by law.",
    signs: [
      { name: "Stop Sign", img: "/signs/stop.png", desc: "Bring your vehicle to a complete halt at the stop line. Check all directions and proceed only when safe." },
      { name: "All Way Stop", img: "/signs/all-way-stop.png", desc: "Traffic in all directions must stop. Vehicles proceed in the order they arrived. Ties yield to the driver on the right." },
      { name: "Yield", img: "/signs/yield.png", desc: "Slow down and give vehicles crossing your path the right-of-way. Stop only if necessary." },
      { name: "Do Not Enter", img: "/signs/do-not-enter.png", desc: "Do not enter this road — you would be driving into oncoming traffic on a one-way road." },
      { name: "Wrong Way", img: "/signs/wrong-way.png", desc: "You are going the wrong direction. Turn around immediately and exit the road safely." },
      { name: "NO Symbol", img: "/signs/no-symbol.png", desc: "Red circle with red slash. The sign shows what you are not allowed to do — the prohibited action is shown inside." },
      { name: "Speed Limit", img: "/signs/speed-limit.png", desc: "Your speed must not exceed the posted speed in this area." },
      { name: "Exit Speed", img: "/signs/exit-speed.png", desc: "Lists the maximum safe speed for an exit ramp on an expressway. Slow down to the posted speed." },
      { name: "Speeding Fines Doubled", img: "/signs/fines-doubled.png", desc: "Posted in active school and work zones. Fines will be doubled if you are cited for speeding in this area." },
      { name: "Turn Lanes", img: "/signs/turn-lanes.png", desc: "At the intersection ahead, traffic in the left lane must turn left and traffic in the adjoining lane may turn left or continue straight." },
      { name: "Center Turn Lane", img: "/signs/center-turn-lane.png", desc: "The center lane is shared, allowing left turns in both directions of travel." },
      { name: "Left Lane Must Turn", img: "/signs/left-lane-must-turn.png", desc: "Traffic in the left lane must turn left at the intersection ahead. Also used for Right Lane Must Turn." },
      { name: "Begin Right Turn Lane", img: "/signs/begin-right-turn-lane.png", desc: "When entering a right turn lane you may encounter bicyclists traveling straight; you must yield to the bicyclists." },
      { name: "No U-Turn", img: "/signs/no-u-turn.png", desc: "You must not make a complete turn to go in the opposite direction at this location." },
      { name: "No Right Turn", img: "/signs/no-right-turn.png", desc: "You must not make a right turn at this intersection." },
      { name: "No Turn on Red", img: "/signs/no-turn-on-red.png", desc: "You must not turn right or left during the red light. You must wait for the green signal." },
      { name: "No Turns", img: "/signs/no-turns.png", desc: "You must not turn either to the right or to the left at this intersection." },
      { name: "Must Turn", img: "/signs/must-turn.png", desc: "You cannot go straight ahead. You must turn either to the right or left." },
      { name: "One Way", img: "/signs/one-way.png", desc: "You must travel only in the direction of the arrow." },
      { name: "Keep Right", img: "/signs/keep-right.png", desc: "Stay to the right of the divider, median, or obstruction ahead." },
      { name: "Slower Traffic Keep Right", img: "/signs/slower-traffic.png", desc: "Slower traffic must stay in the right lane unless passing. Move out of the left lane when being overtaken by a faster vehicle." },
      { name: "No Passing Zone", img: "/signs/no-passing.png", desc: "You may not pass another vehicle in this section of road." },
      { name: "Pass With Care", img: "/signs/pass-with-care.png", desc: "You are allowed to pass, but do so with caution." },
      { name: "Restricted Lane Ahead", img: "/signs/restricted-lane.png", desc: "A lane is reserved for certain purposes or vehicles, such as buses or carpool vehicles during rush hour traffic. Also used in bike lanes." },
      { name: "Emergency Stopping Only", img: "/signs/emergency-stop.png", desc: "You must only stop for emergencies in this area." },
      { name: "No Parking on Pavement", img: "/signs/no-parking.png", desc: "If you stop, you must always park off the pavement of the roadway." },
      { name: "Parking by Disabled Permit Only", img: "/signs/disabled-parking.png", desc: "Parking in this space is only for vehicles displaying an official disabled parking permit and transporting a person with a disability." }
    ],
  },
  {
    name: "Warning Signs",
    color: "bg-yellow-50 border-yellow-200",
    titleColor: "text-yellow-800",
    description: "Warning signs are normally yellow and diamond-shaped. They alert drivers to conditions ahead and what to look out for.",
    signs: [
      { name: "Traffic Signal Ahead", img: "/signs/traffic-signal-ahead.png", desc: "A traffic signal is at the intersection ahead. Slow down; poor visibility is likely." },
      { name: "Stop Sign Ahead", img: "/signs/stop-sign-ahead.png", desc: "Slow down and be ready to stop at the stop sign ahead." },
      { name: "Yield Ahead", img: "/signs/yield-ahead.png", desc: "Yield sign ahead. Slow down and be prepared to stop or adjust speed to traffic." },
      { name: "Speed Reduction Sign", img: "/signs/speed-reduction.png", desc: "Advance notice to upcoming speed limit change. Begin slowing down." },
      { name: "Advisory Speed Sign", img: "/signs/advisory-speed.png", desc: "The fastest safe speed you should travel around the curve ahead. May be used with any warning sign." },
      { name: "Two-Way Traffic Ahead", img: "/signs/two-way-traffic.png", desc: "The roadway is about to change to two-way traffic; there will be oncoming traffic." },
      { name: "Merging Traffic", img: "/signs/merging-traffic.png", desc: "Ahead another traffic lane joins the one you are on. Watch for other traffic and yield the right-of-way when necessary." },
      { name: "Reduction of Lanes", img: "/signs/lane-reduction.png", desc: "The right lane ends and traffic must merge left. Drivers in the left lane should allow others to merge smoothly." },
      { name: "Roundabout Circle", img: "/signs/roundabout-ahead.png", desc: "Provides advance notice of a roundabout. Prepare to slow down and possibly yield to traffic in the roundabout." },
      { name: "Divided Highway Ahead", img: "/signs/divided-hwy-ahead.png", desc: "The highway ahead is divided by a median or physical barrier. Keep right." },
      { name: "Divided Highway Ends", img: "/signs/divided-hwy-ends.png", desc: "The divided highway ends 350 to 500 feet ahead. You will then be on a roadway with two-way traffic. Keep to the right." },
      { name: "Right Curve", img: "/signs/right-curve.png", desc: "The road will curve to the right. Slow your speed and do not pass other vehicles." },
      { name: "Sharp Right Turn", img: "/signs/sharp-right-turn.png", desc: "The road will make a sharp turn to the right. Slow your speed and do not pass other vehicles." },
      { name: "Reverse Curve", img: "/signs/reverse-curve.png", desc: "The road will curve right, then to the left. Slow your speed and do not pass other vehicles." },
      { name: "Winding Road", img: "/signs/winding-road.png", desc: "There are several curves ahead. Drive slowly and carefully and do not pass other vehicles." },
      { name: "Cross Road", img: "/signs/cross-road.png", desc: "A road crosses the main highway ahead. Look to the left and right for other traffic." },
      { name: "Side Road", img: "/signs/side-road.png", desc: "Another road enters the highway from the direction shown. Watch for traffic from that direction." },
      { name: "Bicycle Crossing", img: "/signs/bicycle-crossing.png", desc: "A bikeway crosses the roadway ahead. Watch for bicyclists." },
      { name: "Emergency Vehicle Crossing", img: "/signs/emergency-vehicle.png", desc: "Watch for emergency vehicles entering or crossing the roadway." },
      { name: "Truck Crossing", img: "/signs/truck-crossing.png", desc: "Watch for trucks entering or crossing the roadway." },
      { name: "Pedestrian Crossing", img: "/signs/pedestrian-crossing.png", desc: "Watch for people crossing the street. Slow down or stop to yield for pedestrians." },
      { name: "Animal Crossing", img: "/signs/animal-crossing.png", desc: "The animal pictured on the sign is common in the area. Watch for animals crossing the road, particularly during twilight and nighttime." },
      { name: "Low Clearance", img: "/signs/low-clearance.png", desc: "Do not enter if your vehicle is taller than the height listed on the sign." },
      { name: "Pavement Ends", img: "/signs/pavement-ends.png", desc: "The paved surface ahead changes to a gravel or earth road." },
      { name: "Soft Shoulder", img: "/signs/soft-shoulder.png", desc: "The ground on the side of the road is soft. Don't leave the pavement except in an emergency." },
      { name: "Slippery Surface", img: "/signs/slippery-surface.png", desc: "In wet weather, drive slowly. Don't speed up or brake quickly. Make turns at slow speeds." },
      { name: "Dip", img: "/signs/dip.png", desc: "There is a low place in the road. Go slowly and be ready to stop and turn around if the dip is filled with water." },
      { name: "Narrow Bridge", img: "/signs/narrow-bridge.png", desc: "The bridge is wide enough to accommodate two lanes of traffic, but with very little clearance. Stay in your lane." },
      { name: "One Lane Bridge", img: "/signs/one-lane-bridge.png", desc: "The bridge is wide enough for only one vehicle at a time. Make sure the bridge is clear of oncoming traffic before you cross." },
      { name: "Hill / Downgrade", img: "/signs/hill-downgrade.png", desc: "The road goes downhill ahead. Slow down and be ready to shift to lower gear to control speed." },
      { name: "Railroad Crossing", img: "/signs/railroad-crossing.png", desc: "A railroad crossing is ahead. Slow down, look and listen for trains. Stop if a train is coming." },
      { name: "Draw Bridge", img: "/signs/draw-bridge.png", desc: "A draw bridge is ahead. Be prepared to stop if the bridge is raised." },
      { name: "Railroad Crossbuck", img: "/signs/railroadcrossing.png", desc: "A yield sign at railroad crossings. You must yield the right-of-way to trains. A sign below shows the number of tracks if more than one." }
    ],
  },
  {
    name: "School Zone Signs",
    color: "bg-yellow-50 border-yellow-300",
    titleColor: "text-yellow-900",
    description: "School zone signs are bright yellow-green and warn drivers they are near a school. Extra caution and reduced speeds are required.",
    signs: [
      { name: "School Zone", img: "/signs/school-zone.png", desc: "You are entering a school zone. Watch for children crossing the road and be prepared to stop." },
      { name: "School Zone with Arrow", img: "/signs/school-zone-arrow.png", desc: "Indicates the direction of a school crossing. Watch for children in the direction of the arrow." },
      { name: "School Speed Limit", img: "/signs/school-speed-limit.png", desc: "When lights are flashing, you must slow to 20 mph in the school zone. This applies during school hours." },
      { name: "End School Zone", img: "/signs/end-school-zone.png", desc: "You are leaving the school zone. Normal speed limits resume after this sign." },
      { name: "School Bus Stop Ahead", img: "/signs/school-bus-stop.png", desc: "A school bus stop is ahead. Be prepared to stop when a school bus is loading or unloading children." }
    ],
  },
  {
    name: "Work Zone Signs",
    color: "bg-orange-50 border-orange-300",
    titleColor: "text-orange-900",
    description: "Work zone signs are orange and warn drivers of construction or maintenance ahead. Fines are doubled for violations in active work zones.",
    signs: [
      { name: "Work Zone", img: "/signs/work-zone.png", desc: "Construction or road work is ahead. Slow down, watch for workers and equipment, and be prepared to stop or change lanes." },
      { name: "Flashing Arrow Panel", img: "/signs/flashingarrow.png", desc: "Used day and night to give advance warning and directional information when you must move to another lane in a work zone." }
    ],
  },
  {
    name: "Guide Signs",
    color: "bg-green-50 border-green-300",
    titleColor: "text-green-900",
    description: "Guide signs give information about directions, distances, and services. Color indicates the type of information provided.",
    signs: [
      { name: "Green Guide Sign", img: "/signs/greenguidesign.png", desc: "Gives information about directions and distances. East-West routes have even numbers, North-South have odd numbers. In Florida, mile markers match exit numbers." },
      { name: "Blue Service Sign", img: "/signs/blueguidesign.png", desc: "Directs you to services such as gas, food, motels, and hospitals along the road ahead." },
      { name: "Brown Recreation Sign", img: "/signs/brownguidesign.png", desc: "Directs you to scenic areas, parks, and areas of cultural or historical significance." }
    ]
  }
];

export default function RoadSignPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {state.name} Road Sign Practice Test 2026
          </h1>
          <p className="text-gray-600 mb-6">
            Study every road sign tested on the {state.name} DMV exam. Click any sign to read what it means.
          </p>

          {/* Page nav */}
          <nav className="flex flex-wrap gap-2 mb-10">
            {PAGE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={`/state/${params.state}/${l.href}`}
                className="px-3 py-1.5 rounded-full text-sm border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {SIGN_CATEGORIES.map((cat) => (
            <section key={cat.name} className="mb-12">
              <div className={`rounded-xl border p-6 ${cat.color}`}>
                <h2 className={`text-2xl font-bold mb-1 ${cat.titleColor}`}>{cat.name}</h2>
                <p className="text-gray-600 mb-6 text-sm">{cat.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cat.signs.map((sign) => (
                    <div
                      key={sign.name}
                      className="bg-white rounded-lg p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-default"
                      title={sign.desc}
                    >
                      <img
                        src={sign.img}
                        alt={sign.name}
                        className="w-16 h-16 object-contain mb-2"
                      />
                      <span className="text-xs font-semibold text-gray-700 leading-tight">{sign.name}</span>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{sign.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Guide Links */}
          <div className="mt-10 mb-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Learn More About These Signs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { href: "/dmv-guide/what-does-stop-sign-mean", label: "What does a stop sign mean?" },
                { href: "/dmv-guide/yield-sign-meaning", label: "What does a yield sign mean?" },
                { href: "/dmv-guide/no-passing-zone-meaning", label: "What is a no passing zone?" },
                { href: "/dmv-guide/school-zone-speed-limit", label: "School zone speed limit rules" },
                { href: "/dmv-guide/railroad-crossing-rules", label: "Railroad crossing rules" },
                { href: "/dmv-guide/speed-limit-sign-rules", label: "Speed limit sign rules" },
                { href: "/dmv-guide/lane-markings-explained", label: "Lane markings explained" },
                { href: "/dmv-guide/right-of-way-rules", label: "Right-of-way rules" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-xl bg-blue-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to test your knowledge?</h2>
            <p className="mb-4 text-blue-100">Take a full {state.name} DMV practice test with real exam questions.</p>
            <Link
              href={`/state/${params.state}/dmv-practice-test`}
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
