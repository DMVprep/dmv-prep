// src/app/progress/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { US_STATES } from "@/data/states";
import {
  Trophy, Target, BookOpen, TrendingUp, Clock, CheckCircle,
  XCircle, BarChart2, Zap, Lock, ArrowRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STATES_WITH_QUESTIONS = ["FL", "TX", "CA", "NY", "IL"];

interface TopicStat {
  topic: string;
  slug: string;
  total: number;
  correct: number;
  pct: number | null;
}

interface SessionRecord {
  id: string;
  mode: string;
  score: number;
  totalQ: number;
  pct: number | null;
  completedAt: string;
  createdAt: string;
  state: string;
}

interface ProgressData {
  sessions: SessionRecord[];
  topicStats: TopicStat[];
  mastered: number;
  seen: number;
  totalAvailable: number;
}

const MODE_LABELS: Record<string, string> = {
  PRACTICE: "Practice",
  EXAM_SIMULATION: "Exam Simulation",
  WEAK_AREAS: "Weak Areas",
};

const MODE_COLORS: Record<string, string> = {
  PRACTICE: "bg-green-100 text-green-700",
  EXAM_SIMULATION: "bg-blue-100 text-blue-700",
  WEAK_AREAS: "bg-orange-100 text-orange-700",
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const IS_PREMIUM = (session?.user as any)?.plan === "PREMIUM";
  const [stateCode, setStateCode] = useState("FL");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    setLoading(true);
    fetch(`/api/progress?state=${stateCode}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, stateCode]);

  if (status === "loading") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </main>
      </>
    );
  }

  if (!session?.user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to track your progress</h2>
            <p className="text-gray-500 mb-6">Create a free account to see your history, scores, and weak areas.</p>
            <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Create Free Account
            </Link>
          </div>
        </main>
      </>
    );
  }

  const avgScore = data?.sessions?.length
    ? Math.round(data.sessions.filter(s => s.pct !== null).reduce((sum, s) => sum + (s.pct || 0), 0) / data.sessions.filter(s => s.pct !== null).length)
    : null;

  const bestScore = data?.sessions?.length
    ? Math.max(...data.sessions.filter(s => s.pct !== null).map(s => s.pct || 0))
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
              <p className="text-gray-500 text-sm mt-1">Track your DMV test preparation</p>
            </div>
            {/* State selector */}
            <select
              value={stateCode}
              onChange={e => setStateCode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
            >
              {STATES_WITH_QUESTIONS.map(code => (
                <option key={code} value={code}>
                  {US_STATES.find(s => s.code === code)?.name || code}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : !data || data.sessions.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">No practice sessions yet</h2>
              <p className="text-gray-500 mb-6">Complete your first practice test to see your progress here.</p>
              <Link href={`/practice?state=${stateCode}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{bestScore ?? "—"}%</p>
                  <p className="text-xs text-gray-500">Best Score</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{avgScore ?? "—"}%</p>
                  <p className="text-xs text-gray-500">Avg Score</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{data.seen}</p>
                  <p className="text-xs text-gray-500">Questions Seen</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900">{data.mastered}</p>
                  <p className="text-xs text-gray-500">Mastered</p>
                </div>
              </div>

              {/* Topic mastery */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" /> Topic Mastery
                </h2>
                <div className="space-y-4">
                  {data.topicStats.filter(t => t.total > 0).map(t => (
                    <div key={t.slug}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700 font-medium">{t.topic}</span>
                        <span className="text-sm font-bold text-gray-900">
                          {t.pct !== null ? `${t.pct}%` : "—"}
                          <span className="text-xs text-gray-400 font-normal ml-1">({t.correct}/{t.total})</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={cn("h-2.5 rounded-full transition-all", t.pct !== null && t.pct >= 80 ? "bg-green-500" : t.pct !== null && t.pct >= 60 ? "bg-yellow-500" : "bg-red-500")}
                          style={{ width: `${t.pct ?? 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>{t.pct !== null && t.pct >= 80 ? "✓ Strong" : t.pct !== null && t.pct >= 60 ? "Improving" : "Needs work"}</span>
                        <span>{data.totalAvailable > 0 ? `${Math.round((t.total / data.totalAvailable) * 100)}% coverage` : ""}</span>
                      </div>
                    </div>
                  ))}
                  {data.topicStats.filter(t => t.total > 0).length === 0 && (
                    <p className="text-sm text-gray-400">Complete a practice session to see topic breakdown.</p>
                  )}
                </div>
              </div>

              {/* Weak areas CTA */}
              {IS_PREMIUM && data.topicStats.some(t => t.pct !== null && t.pct < 70) && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-orange-900">You have weak areas to improve</p>
                    <p className="text-sm text-orange-700 mt-0.5">
                      {data.topicStats.filter(t => t.pct !== null && t.pct < 70).map(t => t.topic).join(", ")}
                    </p>
                  </div>
                  <Link href={`/practice?state=${stateCode}&mode=WEAK_AREAS`} className="flex-shrink-0 ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                    Study Now
                  </Link>
                </div>
              )}

              {/* Session history */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" /> Recent Sessions
                </h2>
                <div className="space-y-3">
                  {data.sessions.slice(0, 10).map(s => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", MODE_COLORS[s.mode] || "bg-gray-100 text-gray-600")}>
                          {MODE_LABELS[s.mode] || s.mode}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{s.score}/{s.totalQ}</span>
                        <span className={cn("text-sm font-bold", s.pct !== null && s.pct >= 80 ? "text-green-600" : s.pct !== null && s.pct >= 60 ? "text-yellow-600" : "text-red-500")}>
                          {s.pct !== null ? `${s.pct}%` : "—"}
                        </span>
                        {s.pct !== null && s.pct >= 80
                          ? <CheckCircle className="w-4 h-4 text-green-500" />
                          : <XCircle className="w-4 h-4 text-red-400" />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 flex gap-3">
                <Link href={`/practice?state=${stateCode}`} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-700 transition-colors">
                  Continue Practicing
                </Link>
                {!IS_PREMIUM && (
                  <Link href="/pricing" className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-semibold text-sm text-center hover:bg-yellow-600 transition-colors">
                    Unlock Exam Simulation
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
