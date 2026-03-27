// src/app/state/[state]/dmv-cheat-sheet/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug, getStateBySlug } from "@/data/states";
import { ArrowRight } from "lucide-react";

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return US_STATES.map((s) => ({ state: stateToSlug(s.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const state = getStateBySlug(params.state);
  if (!state) return {};
  return {
    title: `${state.name} DMV Cheat Sheet 2026 — Key Rules at a Glance`,
    description: `Free ${state.name} DMV cheat sheet. Speed limits, right of way, alcohol laws, road signs, and parking rules — all on one page. Pass your permit test first try.`,
  };
}

const STATE_DATA: Record<string, {
  speedLimits: { zone: string; limit: string }[];
  alcoholLaws: { rule: string; value: string }[];
  phoneLaws: { rule: string; value: string }[];
  followingDistance: string;
  passingScore: string;
  totalQuestions: number;
}> = {
  FL: {
    speedLimits: [
      { zone: "School zone", limit: "20 mph" },
      { zone: "Residential streets", limit: "30 mph" },
      { zone: "Business districts", limit: "30 mph" },
      { zone: "Highways", limit: "55 mph" },
      { zone: "Freeways", limit: "70 mph" },
      { zone: "Alley", limit: "15 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "0.02% — zero tolerance" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
      { rule: "Refuse BAC test", value: "Automatic suspension" },
      { rule: "DUI on record", value: "75 years" },
    ],
    phoneLaws: [
      { rule: "Handheld phone", value: "Illegal — primary offense" },
      { rule: "Texting", value: "Illegal — primary offense" },
      { rule: "School/work zones", value: "No phone use at all" },
      { rule: "Under 18", value: "No phone use" },
      { rule: "Hands-free (adults)", value: "Allowed" },
    ],
    followingDistance: "4 seconds minimum (6+ in rain/fog)",
    passingScore: "80%",
    totalQuestions: 50,
  },
  CA: {
    speedLimits: [
      { zone: "School zone", limit: "25 mph" },
      { zone: "Residential streets", limit: "25 mph" },
      { zone: "Business districts", limit: "25 mph" },
      { zone: "Two-lane highways", limit: "55 mph" },
      { zone: "Most freeways", limit: "65 mph" },
      { zone: "Blind intersection", limit: "15 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "0.01% — zero tolerance" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
      { rule: "Refuse BAC test", value: "Automatic suspension" },
      { rule: "Under 21 at 0.05%+", value: "Separate infraction" },
    ],
    phoneLaws: [
      { rule: "Handheld phone", value: "Illegal for all drivers" },
      { rule: "Texting", value: "Illegal — primary offense" },
      { rule: "Under 18", value: "No phone — even hands-free" },
      { rule: "Hands-free (21+)", value: "Allowed" },
      { rule: "Earphones", value: "One ear only" },
    ],
    followingDistance: "3 seconds minimum (4+ in rain/fog)",
    passingScore: "83%",
    totalQuestions: 46,
  },
  TX: {
    speedLimits: [
      { zone: "School zone", limit: "20 mph" },
      { zone: "Urban districts", limit: "30 mph" },
      { zone: "Numbered highways", limit: "70 mph" },
      { zone: "Unnumbered highways", limit: "60 mph" },
      { zone: "Alley", limit: "15 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "Any detectable amount" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
      { rule: "Refuse BAC test", value: "Automatic suspension" },
      { rule: "Implied consent", value: "Agreed when licensed" },
    ],
    phoneLaws: [
      { rule: "Texting", value: "Illegal statewide" },
      { rule: "Phone in school zone", value: "Illegal" },
      { rule: "Phone in work zone", value: "Illegal" },
      { rule: "Under 18", value: "No phone use" },
      { rule: "Hands-free (adults)", value: "Allowed" },
    ],
    followingDistance: "2-second rule (double in rain/fog)",
    passingScore: "70%",
    totalQuestions: 40,
  },
  NY: {
    speedLimits: [
      { zone: "School zone", limit: "20 mph" },
      { zone: "New York City", limit: "25 mph" },
      { zone: "Residential (outside NYC)", limit: "30 mph" },
      { zone: "Rural highways", limit: "55 mph" },
      { zone: "Expressways", limit: "55-65 mph" },
      { zone: "Alley", limit: "15 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "0.02% — zero tolerance" },
      { rule: "Agg-DWI", value: "0.18% or higher" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
      { rule: "Refuse BAC test", value: "Automatic revocation" },
    ],
    phoneLaws: [
      { rule: "Handheld phone", value: "Illegal — primary offense" },
      { rule: "Texting", value: "Illegal — primary offense" },
      { rule: "Under 18", value: "No phone use" },
      { rule: "Hands-free (adults)", value: "Allowed" },
      { rule: "First offense fine", value: "Up to $200" },
    ],
    followingDistance: "3 seconds minimum (4+ at night/rain)",
    passingScore: "70%",
    totalQuestions: 20,
  },
  PA: {
    speedLimits: [
      { zone: "School zone", limit: "15 mph" },
      { zone: "Residential areas", limit: "25 mph" },
      { zone: "Business districts", limit: "35 mph" },
      { zone: "Rural highways", limit: "55 mph" },
      { zone: "Interstates", limit: "70 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "0.02% BAC" },
      { rule: "High BAC", value: "0.10%-0.159%" },
      { rule: "Highest BAC", value: "0.16% or higher" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
    ],
    phoneLaws: [
      { rule: "Texting", value: "Illegal for all drivers" },
      { rule: "Under 18", value: "No phone use" },
      { rule: "Hands-free (adults)", value: "Allowed" },
    ],
    followingDistance: "3-4 seconds minimum",
    passingScore: "83%",
    totalQuestions: 18,
  },
  IL: {
    speedLimits: [
      { zone: "School zone", limit: "20 mph" },
      { zone: "Residential areas", limit: "30 mph" },
      { zone: "Other highways", limit: "55 mph" },
      { zone: "4-lane highways", limit: "65 mph" },
      { zone: "Interstates", limit: "70 mph" },
    ],
    alcoholLaws: [
      { rule: "Adults 21+", value: "0.08% BAC" },
      { rule: "Under 21", value: "Any detectable amount" },
      { rule: "Commercial drivers", value: "0.04% BAC" },
      { rule: "Refuse BAC test", value: "Automatic suspension" },
      { rule: "Implied consent", value: "Agreed when licensed" },
    ],
    phoneLaws: [
      { rule: "Handheld phone", value: "Illegal for all drivers" },
      { rule: "Texting", value: "Illegal for all drivers" },
      { rule: "Under 19", value: "No phone use" },
      { rule: "Hands-free (19+)", value: "Allowed" },
      { rule: "Video/social media", value: "Illegal (2024 law)" },
    ],
    followingDistance: "3-second rule (double in rain/fog)",
    passingScore: "80%",
    totalQuestions: 35,
  },
};

const DEFAULT_DATA = {
  speedLimits: [
    { zone: "School zone", limit: "15-25 mph — check posted signs" },
    { zone: "Residential streets", limit: "25-30 mph" },
    { zone: "Two-lane highways", limit: "55 mph" },
    { zone: "Freeways / interstates", limit: "65-70 mph" },
    { zone: "Alley", limit: "15 mph" },
  ],
  alcoholLaws: [
    { rule: "Adults 21+", value: "0.08% BAC" },
    { rule: "Under 21", value: "0.00-0.02% — check your state" },
    { rule: "Commercial drivers", value: "0.04% BAC" },
    { rule: "Refuse BAC test", value: "Automatic suspension" },
    { rule: "Implied consent", value: "Agreed when licensed" },
  ],
  phoneLaws: [
    { rule: "Handheld phone", value: "Illegal in most states" },
    { rule: "Texting", value: "Illegal in all 50 states" },
    { rule: "Under 18", value: "Illegal in most states" },
    { rule: "Hands-free (adults)", value: "Allowed in most states" },
  ],
  followingDistance: "3 seconds minimum (more in bad conditions)",
  passingScore: "80%",
  totalQuestions: 40,
};

const RIGHT_OF_WAY = [
  { rule: "4-way stop", value: "First to stop goes first. Tie = rightmost goes first" },
  { rule: "Uncontrolled intersection", value: "Yield to vehicle on your right" },
  { rule: "Turning left", value: "Always yield to oncoming traffic" },
  { rule: "Roundabout", value: "Yield to vehicles already inside" },
  { rule: "Pedestrians", value: "Always yield at crosswalks" },
  { rule: "Emergency vehicles", value: "Pull over right and stop" },
  { rule: "School bus — red lights flashing", value: "Stop — do not pass in either direction" },
];

const ROAD_SIGNS = [
  { shape: "Red octagon", meaning: "STOP — full stop required" },
  { shape: "Red and white triangle", meaning: "YIELD — slow down, give way" },
  { shape: "Yellow diamond", meaning: "WARNING — hazard ahead" },
  { shape: "White rectangle", meaning: "REGULATION — rules you must follow" },
  { shape: "Orange diamond/rectangle", meaning: "CONSTRUCTION zone ahead" },
  { shape: "Green rectangle", meaning: "GUIDE — directions and distances" },
  { shape: "Blue rectangle", meaning: "SERVICES — gas, food, lodging" },
  { shape: "Pentagon (school)", meaning: "SCHOOL zone ahead — slow down" },
  { shape: "Pennant shape", meaning: "NO PASSING zone" },
];

const PARKING_RULES = [
  { rule: "Fire hydrant", value: "15 ft minimum" },
  { rule: "Crosswalk / intersection", value: "20 ft minimum" },
  { rule: "In front of driveway", value: "Never — always illegal" },
  { rule: "On a sidewalk", value: "Never — always illegal" },
  { rule: "Double parking", value: "Never — illegal" },
  { rule: "Handicap space (no placard)", value: "Never — heavy fine" },
];

const LICENSING = [
  { rule: "Learner's permit age", value: "15-16 years in most states" },
  { rule: "Licensed adult required", value: "Must be in car at all times with permit" },
  { rule: "GDL passenger restriction", value: "Limited passengers for new drivers" },
  { rule: "GDL nighttime restriction", value: "No driving after midnight in many states" },
  { rule: "License renewal", value: "Every 4-8 years depending on state" },
  { rule: "Point system", value: "Violations add points — too many = suspension" },
  { rule: "Vision requirement", value: "20/40 minimum in at least one eye" },
];

const PAGE_LINKS = [
  { href: "dmv-practice-test", label: "Practice Test" },
  { href: "road-sign-practice-test", label: "Road Signs" },
  { href: "permit-test-questions", label: "Permit Questions" },
  { href: "dmv-cheat-sheet", label: "Cheat Sheet" },
  { href: "dmv-handbook-summary", label: "Handbook Summary" },
  { href: "dmv-test-tips", label: "Test Tips" },
];

function Row({ label, value, alt }: { label: string; value: string; alt: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 text-sm ${alt ? "bg-gray-50" : "bg-white"}`}>
      <span className="text-gray-700">{label}</span>
      <span className="font-bold text-gray-900 text-right ml-4">{value}</span>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      <div className="card overflow-hidden">{children}</div>
    </section>
  );
}

export default function CheatSheetPage({ params }: Props) {
  const state = getStateBySlug(params.state);
  if (!state) notFound();
  const data = STATE_DATA[state.code] || DEFAULT_DATA;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="bg-gradient-to-b from-yellow-50 to-white py-10 px-4 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-sm text-yellow-600 font-medium mb-2 uppercase tracking-wide">{state.name} DMV</div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{state.name} DMV Cheat Sheet 2026</h1>
            <p className="text-gray-600 mb-4">Every rule you need to pass the {state.name} DMV written test — all on one page. {data.totalQuestions} questions, {data.passingScore} to pass.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/practice?state=${state.code}`} className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                Practice Test <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/state/${params.state}/dmv-handbook-summary`} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Full Handbook Summary
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
          <div className="max-w-3xl mx-auto flex gap-2 min-w-max">
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={`/state/${params.state}/${link.href}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${link.href === "dmv-cheat-sheet" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-600"}`}>
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-6 text-sm font-medium">
            <span>{data.totalQuestions} questions</span>
            <span>{data.passingScore} to pass</span>
            <span>~30 minutes</span>
            <span>Following distance: {data.followingDistance}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <Section title="Speed Limits" icon="🚗">
            {data.speedLimits.map((item, i) => <Row key={i} label={item.zone} value={item.limit} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Road Sign Shapes and Meanings" icon="🛑">
            {ROAD_SIGNS.map((item, i) => <Row key={i} label={item.shape} value={item.meaning} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Right of Way Rules" icon="🚦">
            {RIGHT_OF_WAY.map((item, i) => <Row key={i} label={item.rule} value={item.value} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Alcohol and DUI Laws" icon="⚠️">
            {data.alcoholLaws.map((item, i) => <Row key={i} label={item.rule} value={item.value} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Parking Rules" icon="🅿️">
            {PARKING_RULES.map((item, i) => <Row key={i} label={item.rule} value={item.value} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Cell Phone and Distracted Driving" icon="📵">
            {data.phoneLaws.map((item, i) => <Row key={i} label={item.rule} value={item.value} alt={i % 2 !== 0} />)}
          </Section>
          <Section title="Licensing and Permits" icon="🪪">
            {LICENSING.map((item, i) => <Row key={i} label={item.rule} value={item.value} alt={i % 2 !== 0} />)}
          </Section>

          <section className="card bg-blue-600 border-0 p-6 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Ready to test your knowledge?</h3>
            <p className="text-blue-100 text-sm mb-4">Take a free {state.name} DMV practice test — {data.totalQuestions} questions, instant explanations.</p>
            <Link href={`/practice?state=${state.code}`} className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-2.5 px-6 rounded-xl hover:bg-blue-50 transition-colors">
              Start Practice Test <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Also Study</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href={`/state/${params.state}/dmv-practice-test`} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">{state.name} DMV Practice Test</div>
                <div className="text-xs text-gray-500 mt-0.5">Full test with explanations</div>
              </Link>
              <Link href={`/state/${params.state}/road-sign-practice-test`} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Road Signs Practice Test</div>
                <div className="text-xs text-gray-500 mt-0.5">Every sign on the exam</div>
              </Link>
              <Link href={`/state/${params.state}/permit-test-questions`} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Permit Test Questions</div>
                <div className="text-xs text-gray-500 mt-0.5">Most common questions</div>
              </Link>
              <Link href={`/state/${params.state}/dmv-handbook-summary`} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Handbook Summary</div>
                <div className="text-xs text-gray-500 mt-0.5">Full rules in plain English</div>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
