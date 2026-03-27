import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/review - get questions due for review today
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const now = new Date();

  // Get questions due for review
  const dueForReview = await prisma.userProgress.findMany({
    where: {
      userId,
      nextReviewAt: { lte: now },
    },
    include: {
      question: { include: { choices: true, topic: true } }
    },
    orderBy: { nextReviewAt: "asc" },
    take: 20,
  });

  // Get weak questions (confidence < 60) not yet due
  const weakQuestions = await prisma.userProgress.findMany({
    where: {
      userId,
      confidenceScore: { lt: 60 },
      OR: [
        { nextReviewAt: null },
        { nextReviewAt: { gt: now } }
      ]
    },
    include: {
      question: { include: { choices: true, topic: true } }
    },
    orderBy: { confidenceScore: "asc" },
    take: 10,
  });

  return NextResponse.json({
    dueForReview: dueForReview.map(p => ({
      ...p.question,
      progress: {
        confidenceScore: p.confidenceScore,
        seenCount: p.seenCount,
        correctCount: p.correctCount,
        wrongCount: p.wrongCount,
      }
    })),
    weakQuestions: weakQuestions.map(p => ({
      ...p.question,
      progress: {
        confidenceScore: p.confidenceScore,
        seenCount: p.seenCount,
        correctCount: p.correctCount,
        wrongCount: p.wrongCount,
      }
    })),
    totalDue: dueForReview.length,
  });
}

// POST /api/review - update progress after answering a question
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { questionId, isCorrect } = await req.json();

  if (!questionId) return NextResponse.json({ error: "Missing questionId" }, { status: 400 });

  // Get or create progress record
  const existing = await prisma.userProgress.findUnique({
    where: { userId_questionId: { userId, questionId } }
  });

  const seenCount = (existing?.seenCount || 0) + 1;
  const correctCount = (existing?.correctCount || 0) + (isCorrect ? 1 : 0);
  const wrongCount = (existing?.wrongCount || 0) + (isCorrect ? 0 : 1);
  const confidenceScore = (correctCount / seenCount) * 100;

  // Calculate next review time based on confidence
  const now = new Date();
  let nextReviewAt: Date;

  if (!isCorrect) {
    // Wrong answer — review in 10 minutes
    nextReviewAt = new Date(now.getTime() + 10 * 60 * 1000);
  } else if (confidenceScore < 50) {
    // Low confidence — review in 1 day
    nextReviewAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  } else if (confidenceScore < 80) {
    // Medium confidence — review in 3 days
    nextReviewAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  } else {
    // High confidence — review in 7 days
    nextReviewAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const progress = await prisma.userProgress.upsert({
    where: { userId_questionId: { userId, questionId } },
    update: {
      seenCount,
      correctCount,
      wrongCount,
      confidenceScore,
      lastSeen: now,
      nextReviewAt,
      mastered: confidenceScore >= 90 && seenCount >= 3,
    },
    create: {
      userId,
      questionId,
      seenCount,
      correctCount,
      wrongCount,
      confidenceScore,
      lastSeen: now,
      nextReviewAt,
      mastered: false,
    }
  });

  return NextResponse.json({ progress, nextReviewAt });
}
