// src/app/states/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES, stateToSlug } from "@/data/states";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "DMV Practice Tests — All 50 States",
  description: "Free DMV practice tests for all 50 US states. Select your state and start practicing right now.",
};

export default function StatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-medium text-sm mb-3">
            <MapPin className="w-4 h-4" />
            All 50 States
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Choose Your State
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Each state has different DMV rules and questions. Select your state to get
            state-specific practice tests and tips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {US_STATES.map((state) => (
            <Link
              key={state.code}
              href={`/state/${stateToSlug(state.name)}/dmv-practice-test`}
              className="card p-5 flex items-center justify-between group hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-blue-600 text-lg">{state.code}</span>
                  <span className="font-semibold text-gray-800 text-sm">{state.name}</span>
                </div>
                <div className="text-xs text-gray-400">
                  400+ practice Qs · {state.questionsCount} on real test · {state.passingScore}% to pass
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
