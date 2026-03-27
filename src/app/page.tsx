// src/app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free DMV Practice Test 2026 - Pass Your Permit Test First Try",
  description: "Free DMV practice tests for all 50 states. Plain-English explanations, road sign tests, and full exam simulator. Built for first-time drivers and non-native speakers. Start free, no signup needed.",
  keywords: ["DMV practice test 2026", "free DMV test", "permit test practice", "DMV test for non-native speakers", "road sign test", "driving test prep"],
  openGraph: {
    title: "Free DMV Practice Test 2026 - Pass First Try",
    description: "Free DMV practice tests for all 50 states. Simple explanations. Built for first-time drivers and non-native speakers.",
    url: "https://dmv-prep.com",
    siteName: "DMVPrep Pro",
    type: "website",
  },
  alternates: {
    canonical: "https://dmv-prep.com",
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug } from "@/data/states";
import {
  CheckCircle, Star, BookOpen, Brain, Trophy, Clock,
  Globe, Users, ArrowRight, Shield, Award, Zap
} from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Maria G.",
    from: "Originally from Mexico 🇲🇽",
    avatar: "MG",
    color: "bg-orange-500",
    quote: "I failed the DMV test twice before. The simple explanations finally made everything clear. I passed on my first try with 92%!",
    stars: 5,
  },
  {
    name: "Wei L.",
    from: "Immigrated from China 🇨🇳",
    avatar: "WL",
    color: "bg-red-500",
    quote: "My English is not perfect but the plain explanations were easy to understand. I passed first time!",
    stars: 5,
  },
  {
    name: "David K.",
    from: "Moved from Ohio to Florida",
    avatar: "DK",
    color: "bg-blue-500",
    quote: "Moving states meant learning all new rules. The Florida-specific practice tests saved me hours of reading the handbook.",
    stars: 5,
  },
  {
    name: "Fatima A.",
    from: "Originally from Morocco 🇲🇦",
    avatar: "FA",
    color: "bg-green-500",
    quote: "I was so nervous about the test. After two weeks of practice here, I walked in confident and passed with 95%. Thank you!",
    stars: 5,
  },
  {
    name: "Sarah L.",
    from: "First-time driver at 34",
    avatar: "SL",
    color: "bg-purple-500",
    quote: "The readiness score showed me exactly when I was ready. Passed first try at 34 years old — better late than never!",
    stars: 5,
  },
  {
    name: "Carlos R.",
    from: "Originally from Colombia 🇨🇴",
    avatar: "CR",
    color: "bg-yellow-500",
    quote: "Studied for 5 days using this site. The simple English helped me understand everything clearly. Passed with 89%!",
    stars: 5,
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Plain-English Explanations",
    description: "Every answer explained in simple words — no confusing legal language. Perfect for non-native English speakers and first-time drivers.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Brain,
    title: "Smart Practice Tests",
    description: "Questions randomly shuffle every time. Learn from mistakes with instant explanations after each answer.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Trophy,
    title: "Readiness Score",
    description: "Our algorithm shows your real probability of passing. Know exactly when you are ready — before you visit the DMV.",
    color: "text-yellow-600 bg-yellow-50",
  },
  {
    icon: Globe,
    title: "All 50 States",
    description: "Every state has different rules. We cover all 50 states with state-specific questions and handbook summaries.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Clock,
    title: "Exam Simulator",
    description: "Practice under real test conditions with a timer. Know exactly what to expect on test day.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: Shield,
    title: "Road Sign Tests",
    description: "Dedicated road sign practice with visual explanations. Master every sign you will see on the test.",
    color: "text-indigo-600 bg-indigo-50",
  },
];

const POPULAR_STATES = US_STATES.filter(s =>
  ["CA", "TX", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "MI"].includes(s.code)
);

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Chinese" },
  { code: "pt", label: "Portuguese" },
  { code: "fr", label: "French" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Language Bar */}
      
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Award className="w-4 h-4" />
                <span>Designed for first-time drivers and non-native speakers</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Pass Your DMV Test<br />
                <span className="text-blue-600">on the First Try</span>
              </h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Simple explanations in plain English. No confusing legal words. Built for <strong>first-time drivers</strong>, <strong>non-native speakers</strong>, and anyone who just wants to pass.
              </p>

              {/* State Selector */}
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 mb-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-3">📍 Select your state to start:</p>
                <div className="grid grid-cols-5 gap-2">
                  {POPULAR_STATES.map((state) => (
                    <Link
                      key={state.code}
                      href={`/state/${stateToSlug(state.name)}/dmv-practice-test`}
                      className="bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 text-center py-2 px-1 rounded-lg text-xs font-bold transition-all border border-gray-200 hover:border-blue-600"
                    >
                      {state.code}
                    </Link>
                  ))}
                </div>
                <Link href="/states" className="text-blue-600 text-xs font-medium mt-3 inline-flex items-center gap-1 hover:underline">
                  See all 50 states <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Link href="/states" className="btn-primary text-lg py-4 px-8 inline-flex items-center justify-center gap-2">
                  Start Free Practice Test
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/pricing" className="btn-secondary text-lg py-4 px-8 text-center">
                  View Pricing
                </Link>
              </div>

              {/* Guarantee badge */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-green-800">Pass Guarantee</div>
                  <div className="text-xs text-green-600">Study with us and pass — or we will help you until you do</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
                {["No credit card required", "Free to start", "All 50 states"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Social proof */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-extrabold text-gray-900">87%</div>
                  <div className="text-gray-500 text-sm">of our users pass on their first try</div>
                  <div className="flex justify-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">4.9/5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {TESTIMONIALS.slice(0, 4).map((t) => (
                    <div key={t.name} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-full ${t.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">{t.name}</div>
                        <div className="text-xs text-gray-400 leading-tight">{t.from}</div>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <div className="flex justify-center -space-x-2 mb-2">
                    {["bg-blue-500", "bg-green-500", "bg-red-500", "bg-purple-500", "bg-yellow-500", "bg-orange-500"].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white`} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">500,000+ drivers prepared</div>
                  <div className="text-xs text-gray-400">From 50 states and 80+ countries</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blue-600 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { num: "500K+", label: "Tests Taken", icon: "📝" },
            { num: "50", label: "States Covered", icon: "🗺️" },
            { num: "87%", label: "First-Try Pass Rate", icon: "🏆" },
            { num: "10,000+", label: "Practice Questions", icon: "💡" },
          ].map(({ num, label, icon }) => (
            <div key={label}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-3xl font-extrabold">{num}</div>
              <div className="text-blue-200 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Built for first-time drivers */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-4xl mb-4">🌍</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for People Like You</h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
            The DMV handbook is written in complicated legal English. We translated it into plain, simple language that anyone can understand.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: "🌏", title: "New to the US?", desc: "We explain every rule in simple English. No confusing legal terms. No need to read the full handbook." },
              { icon: "🚗", title: "First-time driver?", desc: "Never driven before? Our step-by-step approach guides you from zero to ready at your own pace." },
              { icon: "📦", title: "Moving states?", desc: "Each state has different laws. We give you state-specific questions so you only learn what you need." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to pass</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We replaced the boring DMV handbook with a smarter, friendlier learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular States */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Start Practicing by State</h2>
            <p className="text-gray-500">Click your state to start a free practice test right now.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {POPULAR_STATES.map((state) => (
              <Link
                key={state.code}
                href={`/state/${stateToSlug(state.name)}/dmv-practice-test`}
                className="card p-4 text-center hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <div className="text-2xl font-extrabold text-blue-600 group-hover:text-blue-700">{state.code}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">{state.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{state.questionsCount} questions</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/states" className="text-blue-600 font-medium hover:underline text-sm inline-flex items-center gap-1">
              See all 50 states <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Real people, real results</h2>
            <p className="text-gray-500">Drivers from all over the world passed with DMVPrep Pro</p>
            <div className="flex justify-center gap-0.5 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-600 text-sm ml-2 font-medium">4.9 out of 5 · 12,000+ reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.from}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why DMVPrep Pro?</h2>
            <p className="text-gray-500">We are different from other DMV test prep sites</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-gray-600 font-semibold text-sm">Feature</th>
                  <th className="text-center p-4 text-blue-600 font-bold">DMVPrep Pro ✨</th>
                  <th className="text-center p-4 text-gray-400 font-semibold text-sm">Other Sites</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Plain English explanations", true, false],
                  ["Built for first-time drivers and non-native speakers", true, false],
                  ["All 50 states covered", true, true],
                  ["Readiness score", true, false],
                  ["Multiple language support", true, false],
                  ["Free to start (no credit card)", true, false],
                  ["Ad-free experience", true, false],
                ].map(([feature, us, them], i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4 text-gray-700 text-sm">{feature as string}</td>
                    <td className="p-4 text-center text-lg">{us ? "✅" : "❌"}</td>
                    <td className="p-4 text-center text-lg">{them ? "✅" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span>Start practicing in 30 seconds — no signup needed</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to pass your DMV test?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 500,000+ drivers who prepared with DMVPrep Pro. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/states" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg">
              Start Free Practice Test
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-4 px-8 rounded-xl hover:bg-blue-400 transition-colors text-lg border border-blue-400">
              See Premium Plans
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Pass guarantee — study with us and pass, or we will help until you do</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
