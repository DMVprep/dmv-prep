
const STATE_HANDBOOK_DATA: Record<string, {
  speedLimits: { rule: string; value: string }[];
  followingDistance: { rule: string; value: string }[];
  alcoholLaws: { rule: string; value: string }[];
  phoneLaws: { rule: string; value: string }[];
}> = {
  FL: {
    speedLimits: [
      { rule: "School zone (when children present)", value: "20 mph" },
      { rule: "Residential / municipal streets", value: "30 mph" },
      { rule: "Streets and highways", value: "55 mph" },
      { rule: "Limited access highways / freeways", value: "70 mph" },
      { rule: "Business districts", value: "30 mph" },
      { rule: "Alley", value: "15 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "4 seconds minimum" },
      { rule: "Rain or fog", value: "6+ seconds" },
      { rule: "At night", value: "4 seconds minimum" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "When being tailgated", value: "Slow down, give more space ahead" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
      { rule: "Zero tolerance (under 21)", value: "0.02% — any alcohol is illegal" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "DUI stays on record", value: "75 years" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
    phoneLaws: [
      { rule: "Hand-held phone while driving", value: "Illegal — primary offense" },
      { rule: "Texting while driving", value: "Illegal — primary offense" },
      { rule: "In school or work zones", value: "No phone use at all" },
      { rule: "Hands-free calling (adults)", value: "Allowed" },
      { rule: "Any phone use under 18", value: "Illegal" },
    ],
  },
  CA: {
    speedLimits: [
      { rule: "School zone (when children present)", value: "25 mph" },
      { rule: "Residential streets", value: "25 mph" },
      { rule: "Two-lane undivided highways", value: "55 mph" },
      { rule: "Most freeways", value: "65 mph" },
      { rule: "Business districts", value: "25 mph" },
      { rule: "Blind intersection", value: "15 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "3 seconds minimum" },
      { rule: "Rain, fog, or slippery roads", value: "4+ seconds" },
      { rule: "Following a motorcycle", value: "4 seconds" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "Towing a trailer", value: "4+ seconds" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
      { rule: "Zero tolerance (under 21)", value: "0.01% — any alcohol is illegal" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "Under 21 BAC 0.05%+", value: "Separate infraction (VC 23140)" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
    phoneLaws: [
      { rule: "Hand-held phone while driving", value: "Illegal for all drivers" },
      { rule: "Texting while driving", value: "Illegal — primary offense" },
      { rule: "Hands-free calling (21+)", value: "Allowed" },
      { rule: "Any phone use under 18", value: "Illegal — even hands-free" },
      { rule: "Earphones/headsets", value: "Only one ear allowed while driving" },
    ],
  },
  TX: {
    speedLimits: [
      { rule: "School zone (when children present)", value: "20 mph" },
      { rule: "Urban districts", value: "30 mph" },
      { rule: "Numbered highways outside urban", value: "70 mph" },
      { rule: "Unnumbered highways outside urban", value: "60 mph" },
      { rule: "Alley", value: "15 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "2-second rule" },
      { rule: "Rain or fog", value: "Double your following distance" },
      { rule: "At night", value: "Increase following distance" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "When being tailgated", value: "Slow down, give more space ahead" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
      { rule: "Zero tolerance (under 21)", value: "Any detectable amount is illegal" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "Implied consent", value: "You agreed to BAC testing when licensed" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
    phoneLaws: [
      { rule: "Texting while driving", value: "Illegal statewide" },
      { rule: "Hand-held phone in school zone", value: "Illegal" },
      { rule: "Hands-free calling", value: "Allowed for adults" },
      { rule: "Any phone use under 18", value: "Illegal" },
      { rule: "Phone use in active work zone", value: "Illegal" },
    ],
  },
  IL: {
    speedLimits: [
      { rule: "School zone (school days 6:30am-4pm, children present)", value: "20 mph" },
      { rule: "Residential areas", value: "30 mph" },
      { rule: "Other highways and rural areas", value: "55 mph" },
      { rule: "4-lane highways", value: "65 mph" },
      { rule: "Interstates and tollways", value: "70 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "3-second rule" },
      { rule: "Rain or fog", value: "Double your following distance" },
      { rule: "At night", value: "Increase following distance" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "When being tailgated", value: "Slow down, give more space ahead" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
      { rule: "Zero tolerance (under 21)", value: "Any detectable amount is illegal" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "Implied consent", value: "You agreed to BAC testing when licensed" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
    phoneLaws: [
      { rule: "Texting while driving", value: "Illegal for all drivers" },
      { rule: "Handheld phone use", value: "Illegal for all drivers" },
      { rule: "Hands-free calling", value: "Allowed for drivers age 19+" },
      { rule: "Any phone use under 19", value: "Illegal" },
      { rule: "Video/social media while driving", value: "Illegal (2024 law)" },
    ],
  },
  PA: {
    speedLimits: [
      { rule: "School zone (when children present)", value: "15 mph" },
      { rule: "Residential areas", value: "25 mph" },
      { rule: "Business districts", value: "35 mph" },
      { rule: "Rural highways / interstates", value: "70 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "3 to 4 seconds" },
      { rule: "Rain or fog", value: "Double your following distance" },
      { rule: "At night", value: "Increase following distance" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "When being tailgated", value: "Slow down, give more space ahead" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08% (general impairment)" },
      { rule: "High BAC tier", value: "0.10% to 0.159%" },
      { rule: "Highest BAC tier", value: "0.16% or higher" },
      { rule: "Drivers under 21", value: "0.02%" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
    phoneLaws: [
      { rule: "Texting while driving", value: "Illegal for all drivers" },
      { rule: "Hands-free calling", value: "Allowed for adults" },
      { rule: "Any phone use under 18", value: "Illegal" },
    ],
  },
  NY: {
    speedLimits: [
      { rule: "School zone (when children present)", value: "20 mph" },
      { rule: "New York City default", value: "25 mph" },
      { rule: "Urban/residential areas (outside NYC)", value: "30 mph" },
      { rule: "Suburban/rural highways", value: "55 mph" },
      { rule: "Most expressways/interstates", value: "55–65 mph" },
      { rule: "Alley", value: "15 mph" },
    ],
    followingDistance: [
      { rule: "Normal conditions", value: "3 seconds minimum" },
      { rule: "Rain or fog", value: "Double your distance" },
      { rule: "At night", value: "4+ seconds" },
      { rule: "Behind large trucks", value: "4+ seconds" },
      { rule: "Highway speeds", value: "Increase following distance" },
    ],
    alcoholLaws: [
      { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
      { rule: "Aggravated DWI (Agg-DWI)", value: "0.18% or higher" },
      { rule: "DWAI (impaired)", value: "0.05–0.07%" },
      { rule: "Zero tolerance (under 21)", value: "0.02%" },
      { rule: "Commercial drivers", value: "0.04%" },
      { rule: "Refusing a BAC test", value: "Automatic license revocation" },
    ],
    phoneLaws: [
      { rule: "Hand-held phone while driving", value: "Illegal — primary offense" },
      { rule: "Texting while driving", value: "Illegal — primary offense" },
      { rule: "Hands-free calling", value: "Allowed for adults" },
      { rule: "Any phone use under 18", value: "Illegal" },
      { rule: "Fine for first offense", value: "Up to $200" },
    ],
  },
};

// Default data for states not yet specifically mapped
const DEFAULT_HANDBOOK = {
  speedLimits: [
    { rule: "School zone (when children present)", value: "15–25 mph — check posted signs" },
    { rule: "Residential streets", value: "25–30 mph — check posted signs" },
    { rule: "Two-lane highways", value: "55 mph — check posted signs" },
    { rule: "Freeways / interstates", value: "65–70 mph — check posted signs" },
    { rule: "Business districts", value: "25–30 mph — check posted signs" },
    { rule: "Alley", value: "15 mph" },
  ],
  followingDistance: [
    { rule: "Normal conditions", value: "3 seconds minimum" },
    { rule: "Rain or fog", value: "Double your distance" },
    { rule: "At night", value: "4+ seconds" },
    { rule: "Behind large trucks", value: "4+ seconds" },
    { rule: "When being tailgated", value: "Slow down, give more space ahead" },
  ],
  alcoholLaws: [
    { rule: "Legal BAC limit (adults 21+)", value: "0.08%" },
    { rule: "Zero tolerance (under 21)", value: "0.00–0.02% — check your state" },
    { rule: "Commercial drivers", value: "0.04%" },
    { rule: "Implied consent", value: "You agreed to BAC testing when licensed" },
    { rule: "Refusing a BAC test", value: "Automatic license suspension" },
  ],
  phoneLaws: [
    { rule: "Hand-held phone while driving", value: "Illegal in most states" },
    { rule: "Texting while driving", value: "Illegal in all 50 states" },
    { rule: "Hands-free calling", value: "Allowed for adults in most states" },
    { rule: "Any phone use under 18", value: "Illegal in most states" },
    { rule: "Eating / grooming while driving", value: "Distracted driving — avoid it" },
  ],
};

const RIGHT_OF_WAY_RULES = [
  { rule: "4-way stop — who goes first?", value: "First to arrive, or rightmost if tied" },
  { rule: "Uncontrolled intersection", value: "Yield to vehicle on your right" },
  { rule: "Turning left", value: "Yield to oncoming traffic" },
  { rule: "Entering a roundabout", value: "Yield to vehicles already inside" },
  { rule: "Pedestrians at crosswalk", value: "Always yield — they have right of way" },
  { rule: "Emergency vehicles with siren", value: "Pull over right and stop" },
];

const PARKING_RULES = [
  { rule: "From a fire hydrant", value: "15 feet minimum" },
  { rule: "At a crosswalk or intersection", value: "20 feet minimum" },
  { rule: "In front of a driveway", value: "Never — always illegal" },
  { rule: "On a sidewalk", value: "Never — always illegal" },
  { rule: "Double parking", value: "Never — blocking traffic is illegal" },
  { rule: "Handicap spaces without placard", value: "Never — heavy fine" },
];

function getHandbookSections(stateCode: string) {
  const data = STATE_HANDBOOK_DATA[stateCode] || DEFAULT_HANDBOOK;
  return [
    { title: "Speed Limits You Must Know", icon: "🚗", rules: data.speedLimits },
    { title: "Right of Way Rules", icon: "🛑", rules: RIGHT_OF_WAY_RULES },
    { title: "Safe Following Distance", icon: "📏", rules: data.followingDistance },
    { title: "Alcohol & DUI Laws", icon: "⚠️", rules: data.alcoholLaws },
    { title: "Parking Rules", icon: "🅿️", rules: PARKING_RULES },
    { title: "Cell Phone & Distracted Driving", icon: "📵", rules: data.phoneLaws },
  ];
}

interface Props { params: { state: string } }
// src/app/state/[state]/dmv-handbook-summary/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { DMV_VOCABULARY } from "@/data/questions";
import { ArrowRight, BookOpen } from "lucide-react";

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `${state.name} DMV Handbook Summary 2026 — Key Rules Explained Simply`,
    description: `The most important rules from the ${state.name} DMV driver handbook — explained in plain English. No need to read the whole handbook.`,
  };
}

const PAGE_LINKS = [
  { href: "dmv-practice-test", label: "Practice Test" },
  { href: "road-sign-practice-test", label: "Road Sign Practice Test" },
  { href: "permit-test-questions", label: "Permit Test Questions" },
  { href: "dmv-handbook-summary", label: "DMV Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips & Guide" },
];

const HANDBOOK_SECTIONS = [
  {
    title: "Speed Limits You Must Know",
    icon: "🚗",
    rules: [
      { rule: "School zone (when children present)", value: "20 mph — Florida standard" },
      { rule: "Residential / municipal streets", value: "30 mph" },
      { rule: "Undivided highways", value: "55 mph" },
      { rule: "Limited access highways / freeways", value: "70 mph" },
      { rule: "Business districts", value: "25 mph" },
      { rule: "Alley", value: "15 mph" },
    ],
  },
  {
    title: "Right of Way Rules",
    icon: "🛑",
    rules: [
      { rule: "4-way stop — who goes first?", value: "First to arrive, or rightmost if tied" },
      { rule: "Uncontrolled intersection", value: "Yield to vehicle on your right" },
      { rule: "Turning left", value: "Yield to oncoming traffic" },
      { rule: "Entering a roundabout", value: "Yield to vehicles already inside" },
      { rule: "Pedestrians at crosswalk", value: "Always yield — they have right of way" },
      { rule: "Emergency vehicles with siren", value: "Pull over right and stop" },
    ],
  },
  {
    title: "Safe Following Distance",
    icon: "📏",
    rules: [
      { rule: "Normal conditions", value: "4 seconds minimum — Florida law" },
      { rule: "Rain or fog", value: "4–5 seconds — double your distance" },
      { rule: "At night", value: "4 seconds minimum" },
      { rule: "Behind large trucks", value: "4 seconds — they block your view" },
      { rule: "When being tailgated", value: "Slow down gradually, give more space ahead" },
    ],
  },
  {
    title: "Alcohol & DUI Laws",
    icon: "⚠️",
    rules: [
      { rule: "Legal BAC limit (adults 21+)", value: "Under 0.08%" },
      { rule: "Zero tolerance (under 21)", value: "0.02% maximum — any alcohol is illegal" },
      { rule: "Commercial drivers", value: "Under 0.04%" },
      { rule: "Implied consent", value: "You agreed to BAC testing when you got your license" },
      { rule: "Refusing a BAC test", value: "Automatic license suspension" },
    ],
  },
  {
    title: "Parking Rules",
    icon: "🅿️",
    rules: [
      { rule: "From a fire hydrant", value: "15 feet minimum" },
      { rule: "At a crosswalk or intersection", value: "20 feet minimum" },
      { rule: "In front of a driveway", value: "Never — always illegal" },
      { rule: "On a sidewalk", value: "Never — always illegal" },
      { rule: "Double parking", value: "Never — blocking traffic is illegal" },
      { rule: "Handicap spaces without placard", value: "Never — heavy fine" },
    ],
  },
  {
    title: "Cell Phone & Distracted Driving",
    icon: "📵",
    rules: [
      { rule: "Hand-held phone while driving", value: "Illegal in most states" },
      { rule: "Texting while driving", value: "Illegal in all states" },
      { rule: "Hands-free calling", value: "Allowed for adults 21+ in most states" },
      { rule: "Any phone use under 18", value: "Illegal in most states" },
      { rule: "Eating / grooming while driving", value: "Distracted driving — avoid it" },
    ],
  },
];

export default function HandbookSummaryPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-green-50 to-white py-14 px-4 border-b border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm text-green-600 font-medium mb-3 uppercase tracking-wide">
              {state.name} Driver Handbook
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {state.name} DMV Handbook Summary
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              The {state.name} driver handbook is long. We pulled out the most important rules — the ones most likely to appear on your test — and explained them in plain, simple English.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full inline-flex mb-8">
              <BookOpen className="w-4 h-4" />
              Covers the key rules from the official {state.name} DMV handbook
            </div>
            <br />
            <Link href={`/practice?state=${state.code}`} className="btn-primary inline-flex items-center gap-2 text-lg py-4 px-10">
              Practice These Rules Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        <section className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-4xl mx-auto flex gap-2 min-w-max">
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={`/state/${params.state}/${link.href}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${link.href === "dmv-handbook-summary" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          {getHandbookSections(state.code).map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>{section.icon}</span> {section.title}
              </h2>
              <div className="card overflow-hidden">
                {section.rules.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <span className="text-gray-700">{item.rule}</span>
                    <span className="font-bold text-gray-900 text-right ml-4">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key DMV Words to Know</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DMV_VOCABULARY.map((v) => (
                <div key={v.term} className="card p-4">
                  <div className="font-bold text-blue-600 mb-1">{v.term}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{v.definition}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card bg-blue-600 border-0 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Now put your knowledge to the test</h3>
            <p className="text-blue-100 mb-6">Take a practice test to see how well you know the {state.name} DMV rules.</p>
            <Link href={`/practice?state=${state.code}`} className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-8 rounded-xl hover:bg-blue-50">
              Start Practice Test <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
