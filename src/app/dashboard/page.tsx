// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  BookOpen, Trophy, Clock, TrendingUp, Star, ArrowRight, BarChart2, Zap, Brain, RefreshCw, AlertTriangle
} from "lucide-react";
import { US_STATES, stateToSlug } from "@/data/states";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      testSessions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { state: true },
      },
    },
  });

  const sessions = user?.testSessions ?? [];

  // Spaced repetition stats
  const now = new Date();
  const [dueCount, masteredCount, weakCount, allProgress] = await Promise.all([
    prisma.userProgress.count({
      where: { userId: (session.user as any).id, nextReviewAt: { lte: now } }
    }),
    prisma.userProgress.count({
      where: { userId: (session.user as any).id, mastered: true }
    }),
    prisma.userProgress.count({
      where: { userId: (session.user as any).id, confidenceScore: { lt: 60 }, seenCount: { gt: 0 } }
    }),
    prisma.userProgress.findMany({
      where: { userId: (session.user as any).id },
    }),
  ]);

  const memoryStrength = allProgress.length > 0
    ? Math.round(allProgress.reduce((sum, p) => sum + p.confidenceScore, 0) / allProgress.length)
    : 0;
  const totalTests = sessions.length;
  const avgScore = totalTests
    ? Math.round(sessions.reduce((s, ts) => s + (ts.score ?? 0) / ts.totalQ * 100, 0) / totalTests)
    : 0;
  const isPremium = user?.plan === "PREMIUM";

  const popularStates = US_STATES.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Welcome back, {session.user?.name?.split(" ")[0] ?? "there"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Ready to practice? Let's keep your streak going.</p>
        </div>

        {/* Pass System Section */}
        {isPremium && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-gray-900 text-lg">Your Pass System</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">Tracks what you know and schedules reviews so you pass</p>
              </div>
              {dueCount > 0 && (
                <div className="flex flex-col items-end gap-1">
                  <a href="/review" className="flex items-center gap-2 bg-purple-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Start Review · ~{Math.max(1, Math.round(dueCount * 0.35))} min
                  </a>
                  <p className="text-xs text-purple-500 font-medium">Fastest way to improve your score</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-purple-700">{dueCount}</p>
                <p className="text-xs text-purple-600 font-medium mt-1">Due for Review</p>
                {dueCount > 0 && <p className="text-[10px] text-purple-500 mt-1.5">Review now to lock in what you've learned</p>}
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-blue-700">{memoryStrength}%</p>
                <p className="text-xs text-blue-600 font-medium mt-1">Memory Strength</p>
                <p className="text-[10px] mt-1.5 font-medium">{memoryStrength >= 80 ? <span className="text-green-600">Strong — you're retaining well</span> : memoryStrength >= 60 ? <span className="text-yellow-600">Getting there — keep reviewing</span> : <span className="text-red-500">⚠️ Not test-ready yet</span>}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-green-700">{masteredCount}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Mastered</p>
                {masteredCount > 0 && <p className="text-[10px] text-green-500 mt-1.5">These are locked in your memory</p>}
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-red-700">{weakCount}</p>
                <p className="text-xs text-red-600 font-medium mt-1">Need Practice</p>
                {weakCount > 0 && <p className="text-[10px] text-red-500 mt-1.5 font-medium">Fix these first to pass</p>}
              </div>
            </div>
            {dueCount === 0 && allProgress.length > 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                ✅ You are all caught up! Come back later for your next review session.
              </p>
            )}
            {allProgress.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Start practicing to activate your pass system. It tracks what you know and schedules reviews so you're ready on test day.
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Tests Taken", value: totalTests, color: "text-blue-600 bg-blue-50" },
            { icon: Trophy, label: "Avg. Score", value: `${avgScore}%`, color: "text-yellow-600 bg-yellow-50" },
            { icon: TrendingUp, label: "Readiness", value: avgScore >= 80 ? "Ready!" : `${avgScore}%`, color: "text-green-600 bg-green-50" },
            { icon: Star, label: "Plan", value: isPremium ? "Premium" : "Free", color: "text-purple-600 bg-purple-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Readiness bar */}
        {totalTests > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">Readiness Score</h3>
                <p className="text-sm text-gray-500">Based on your last {Math.min(totalTests, 5)} tests</p>
              </div>
              <span className={`text-2xl font-extrabold ${avgScore >= 80 ? "text-green-600" : avgScore >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                {avgScore}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full">
              <div
                className={`h-3 rounded-full transition-all ${avgScore >= 80 ? "bg-green-500" : avgScore >= 60 ? "bg-yellow-500" : "bg-red-400"}`}
                style={{ width: `${avgScore}%` }}
              />
            </div>
            <p className="text-xs mt-2 font-medium">
              {avgScore >= 80
                ? <span className="text-green-600">🎉 You're ready for the real test!</span>
                : avgScore >= 60
                ? <span className="text-yellow-600">Almost there — most users pass at 80%+. Don't stop now.</span>
                : <span className="text-red-500">⚠️ You're not ready for the DMV test yet. Keep practicing to reach 80%.</span>}
            </p>
            {avgScore < 80 && totalTests > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                At your current pace: ~{Math.min(14, Math.max(2, Math.ceil((80 - avgScore) / 10)))} more days of practice to be test-ready
              </p>
            )}
          </div>
        )}

        {/* Quick practice */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Practice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/practice?mode=quick", label: "Quick Practice", desc: "10 random questions", icon: Clock, color: "border-blue-200 hover:bg-blue-50" },
              { href: "/practice?mode=signs", label: "Road Signs", desc: "Signs only test", icon: BookOpen, color: "border-purple-200 hover:bg-purple-50" },
              { href: "/practice?mode=full", label: "Full Exam", desc: "Complete simulation", icon: BarChart2, color: "border-green-200 hover:bg-green-50" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`card p-5 border-2 transition-all group flex items-center gap-4 ${item.color}`}
              >
                <item.icon className="w-6 h-6 text-gray-500" />
                <div>
                  <div className="font-semibold text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* States */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Practice by State</h2>
            <Link href="/states" className="text-sm text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularStates.map((state) => (
              <Link
                key={state.code}
                href={`/practice?state=${state.code}`}
                className="card p-4 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-3"
              >
                <span className="font-extrabold text-blue-600 text-lg w-8">{state.code}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{state.name}</div>
                  <div className="text-xs text-gray-400">{state.questionsCount}q</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Tests</h2>
            <div className="card divide-y divide-gray-50">
              {sessions.slice(0, 5).map((ts) => {
                const pct = Math.round((ts.score ?? 0) / ts.totalQ * 100);
                return (
                  <div key={ts.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{ts.state.name} — {ts.mode.replace("_", " ")}</div>
                      <div className="text-xs text-gray-400">{new Date(ts.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`font-bold text-sm ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        {!isPremium && (
          <div className="card bg-blue-600 border-0 p-6 text-white flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-1">
                <Zap className="w-5 h-5 text-yellow-300" />
                Pass your DMV test on the first try
              </div>
              <p className="text-blue-100 text-sm">
                Unlock the full pass system — readiness tracking, weak area targeting, spaced repetition, and all 50 states.
              </p>
            </div>
            <Link
              href="/pricing"
              className="bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap"
            >
              See Plans →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
