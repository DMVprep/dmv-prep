import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shuffle } from "@/lib/utils";

// GET /api/adaptive?state=CA&total=20
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const stateCode = searchParams.get("state") || "FL";
  const total = parseInt(searchParams.get("total") || "20");

  const isPremium = (session.user as any)?.plan === "PREMIUM";
  if (!isPremium) return NextResponse.json({ error: "Premium required" }, { status: 403 });

  const state = await prisma.state.findUnique({ where: { code: stateCode.toUpperCase() } });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  const now = new Date();

  // Calculate how many of each type we need
  const reviewCount = Math.floor(total * 0.5);   // 50% review
  const weakCount = Math.floor(total * 0.3);     // 30% weak
  const newCount = total - reviewCount - weakCount; // 20% new

  // 1. Get questions due for review
  const reviewProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      nextReviewAt: { lte: now },
      question: { stateId: state.id }
    },
    include: { question: { include: { choices: true, topic: true } } },
    orderBy: { nextReviewAt: "asc" },
    take: reviewCount,
  });

  const reviewQuestions = reviewProgress.map(p => ({
    ...p.question,
    _type: "review",
    _confidence: p.confidenceScore,
  }));

  // 2. Get weak questions (confidence < 60, not already in review list)
  const reviewIds = reviewQuestions.map(q => q.id);
  const weakProgress = await prisma.userProgress.findMany({
    where: {
      userId,
      confidenceScore: { lt: 60 },
      questionId: { notIn: reviewIds },
      question: { stateId: state.id }
    },
    include: { question: { include: { choices: true, topic: true } } },
    orderBy: { confidenceScore: "asc" },
    take: weakCount,
  });

  const weakQuestions = weakProgress.map(p => ({
    ...p.question,
    _type: "weak",
    _confidence: p.confidenceScore,
  }));

  // 3. Get new questions (never seen before)
  const seenIds = [...reviewIds, ...weakQuestions.map(q => q.id)];
  const newQuestions = await prisma.question.findMany({
    where: {
      stateId: state.id,
      id: { notIn: seenIds },
      progress: { none: { userId } }
    },
    include: { choices: true, topic: true },
    take: newCount * 3, // fetch more to shuffle
  });

  const newQuestionsShuffled = shuffle(newQuestions)
    .slice(0, newCount)
    .map(q => ({ ...q, _type: "new", _confidence: 0 }));

  // Combine and shuffle
  const allQuestions = shuffle([
    ...reviewQuestions,
    ...weakQuestions,
    ...newQuestionsShuffled,
  ]);

  return NextResponse.json({
    questions: allQuestions,
    meta: {
      total: allQuestions.length,
      review: reviewQuestions.length,
      weak: weakQuestions.length,
      new: newQuestionsShuffled.length,
    }
  });
}
