import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/review/stats - get user memory stats for dashboard
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const now = new Date();

  const [totalProgress, dueCount, masteredCount, weakCount] = await Promise.all([
    // All progress records
    prisma.userProgress.findMany({
      where: { userId },
      include: { question: { include: { topic: true } } }
    }),
    // Due for review today
    prisma.userProgress.count({
      where: { userId, nextReviewAt: { lte: now } }
    }),
    // Mastered questions
    prisma.userProgress.count({
      where: { userId, mastered: true }
    }),
    // Weak questions
    prisma.userProgress.count({
      where: { userId, confidenceScore: { lt: 60 }, seenCount: { gt: 0 } }
    }),
  ]);

  // Calculate average confidence
  const avgConfidence = totalProgress.length > 0
    ? totalProgress.reduce((sum, p) => sum + p.confidenceScore, 0) / totalProgress.length
    : 0;

  // Group weak topics
  const weakTopics: Record<string, number> = {};
  totalProgress
    .filter(p => p.confidenceScore < 60 && p.seenCount > 0)
    .forEach(p => {
      const topic = p.question.topic?.name || 'General';
      weakTopics[topic] = (weakTopics[topic] || 0) + 1;
    });

  const weakTopicsList = Object.entries(weakTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  return NextResponse.json({
    totalSeen: totalProgress.length,
    dueForReview: dueCount,
    mastered: masteredCount,
    weak: weakCount,
    memoryStrength: Math.round(avgConfidence),
    weakTopics: weakTopicsList,
  });
}
