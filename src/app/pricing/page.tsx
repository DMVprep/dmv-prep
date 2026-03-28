// src/app/pricing/page.tsx
"use client";
import { useState } from "react";
import { CheckCircle, Zap, Star } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FREE_FEATURES = [
  "1 state, 10 questions per test",
  "Basic answer explanations",
  "Road sign previews",
];
const PASS_FEATURES = [
  "1 state, fully unlocked — 400+ questions",
  "Unlimited practice tests",
  "All test modes (Quick, Signs, Full Exam)",
  "Full plain-English explanations",
  "One-time payment, yours forever",
];
const PREMIUM_FEATURES = [
  "All 50 states — 400+ questions per state",
  "Unlimited practice tests",
  "All test modes (Quick, Signs, Full Exam)",
  "Full plain-English explanations",
  "Memory Engine with spaced repetition",
  "SmartRecall micro-lessons with practice questions",
  "Readiness Score and progress tracking",
  "Weak areas identifier",
  "Multilingual translations (Spanish, Chinese, and more)",
  "Priority support",
];
const FAQ = [
  {
    q: "What is the difference between Pass and Premium?",
    a: "Pass is a one-time payment that fully unlocks one state (400+ questions) forever. Premium is a subscription that unlocks all 50 states, the Memory Engine with spaced repetition, SmartRecall lessons, Readiness Score, and multilingual translations. If you only need to pass the test in one state, Pass is the best value.",
  },
  {
    q: "Can I upgrade from Pass to Premium later?",
    a: "Yes. If you already purchased Pass and decide you want all 50 states, you can upgrade to Premium at any time.",
  },
  {
    q: "Will I be charged automatically?",
    a: "Only for Premium subscriptions. Pass is a one-time charge with no recurring billing. Premium renews monthly or annually until you cancel.",
  },
  {
    q: "Can I cancel my Premium subscription?",
    a: "Yes, anytime. No questions asked. You keep access until the end of your billing period.",
  },
  {
    q: "Is DMVPrep Pro affiliated with the official DMV?",
    a: "No. We are an independent study tool. Our questions are based on official handbooks but we are not affiliated with any government agency.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState<boolean>(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Start free. Pay once to pass. Or go all-in with Premium.
          </p>
        </div>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium whitespace-nowrap ${!annual ? "text-gray-900" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors flex-shrink-0 ${annual ? "bg-blue-600" : "bg-gray-300"}`}
          >
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform transform ${annual ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className={`text-sm font-medium whitespace-nowrap ${annual ? "text-gray-900" : "text-gray-400"}`}>
            Annual
            <span className="ml-1.5 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save 54%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Free */}
          <div className="card p-7 border-2 border-gray-200 flex flex-col">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Free</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-gray-400 mb-1 text-sm">forever</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">No credit card required</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-secondary w-full text-center block">
              Get Started Free
            </Link>
          </div>

          {/* Pass */}
          <div className="card p-7 border-2 border-yellow-400 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                BEST FOR MOST
              </span>
            </div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Pass</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">$9.99</span>
                <span className="text-gray-400 mb-1 text-sm">one-time</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Pay once, yours forever</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PASS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PASS_PRICE_ID || "", "pass")}
              disabled={loading === "pass"}
              className="w-full text-center block bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading === "pass" ? "Loading..." : "Buy Pass — $9.99"}
            </button>
          </div>

          {/* Premium */}
          <div className="card p-7 border-2 border-blue-500 flex flex-col relative shadow-xl shadow-blue-100">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                ALL STATES
              </span>
            </div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Premium</h2>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-gray-900">
                  {annual ? "$3.25" : "$7"}
                </span>
                <span className="text-gray-400 mb-1 text-sm">/month</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {annual ? "Billed as $39/year" : "Billed monthly, cancel anytime"}
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(
                annual
                  ? (process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID || "")
                  : (process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || ""),
                annual ? "premium_annual" : "premium_monthly"
              )}
              disabled={loading === "premium_annual" || loading === "premium_monthly"}
              className="btn-primary w-full text-center block disabled:opacity-60"
            >
              {loading === "premium_annual" || loading === "premium_monthly"
                ? "Loading..."
                : annual ? "Start Premium — $39/yr" : "Start Premium — $7/mo"}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Compare plans</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-6 text-gray-500 font-medium w-1/2">Feature</th>
                <th className="text-center py-3 px-4 text-gray-700 font-bold">Free</th>
                <th className="text-center py-3 px-4 text-yellow-600 font-bold">Pass</th>
                <th className="text-center py-3 px-4 text-blue-600 font-bold">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["States", "1", "1", "All 50"],
                ["Questions per test", "10", "Unlimited", "Unlimited"],
                ["Test modes", "Quick only", "All modes", "All modes"],
                ["Answer explanations", "Basic", "Full", "Full"],
                ["Progress tracking", "No", "No", "Yes"],
                ["Multilingual translation", "No", "No", "Yes"],
                ["Payment type", "Free", "One-time", "Subscription"],
              ].map(([feature, free, pass, premium]) => (
                <tr key={feature}>
                  <td className="py-3 pr-6 text-gray-600">{feature}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{free}</td>
                  <td className="py-3 px-4 text-center text-yellow-700 font-medium">{pass}</td>
                  <td className="py-3 px-4 text-center text-blue-700 font-medium">{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently asked questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {FAQ.map((item) => (
              <div key={item.q} className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>Trusted by 500,000+ drivers. No credit card required for free plan. Cancel premium anytime.</p>
          <p className="mt-1">Questions? <a href="mailto:support@dmvpreppro.com" className="text-blue-600 hover:underline">support@dmvpreppro.com</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}