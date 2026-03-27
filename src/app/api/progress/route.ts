// src/app/api/progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch user progress summary
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const stateCode = searchParams.get("state") || "FL";

  const state = await prisma.state.findUnique({ where: { code: stateCode } });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  // Get all test sessions for this user and state
  const sessions = await prisma.testSession.findMany({
    where: { userId, stateId: state.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { state: true },
  });

  // Get topic breakdown from answers
  const topics = await prisma.topic.findMany();
  const topicStats = await Promise.all(topics.map(async (topic) => {
    const answers = await prisma.answer.findMany({
      where: {
        session: { userId, stateId: state.id },
        question: { topicId: topic.id },
      },
      orderBy: { session: { createdAt: "desc" } },
    });
    const total = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : null;
    return { topic: topic.name, slug: topic.slug, total, correct, pct };
  }));

  // Get mastered questions count
  const mastered = await prisma.userProgress.count({
    where: { userId, mastered: true },
  });

  // Get total unique questions seen
  const seen = await prisma.userProgress.count({ where: { userId } });

  // Get total questions in DB for this state
  const totalAvailable = await prisma.question.count({ where: { stateId: state.id } });

  return NextResponse.json({
    sessions: sessions.map(s => ({
      id: s.id,
      mode: s.mode,
      score: s.score,
      totalQ: s.totalQ,
      pct: s.score && s.totalQ ? Math.round((s.score / s.totalQ) * 100) : null,
      completedAt: s.completedAt,
      createdAt: s.createdAt,
      state: s.state.code,
    })),
    topicStats,
    mastered,
    seen,
    totalAvailable,
  });
}

// POST — save a completed test session
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { stateCode, mode, answers } = body;
  // answers: [{ questionId, choiceId, isCorrect }]

  const state = await prisma.state.findUnique({ where: { code: stateCode } });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  const score = answers.filter((a: any) => a.isCorrect).length;

  const testSession = await prisma.testSession.create({
    data: {
      mode,
      userId,
      stateId: state.id,
      score,
      totalQ: answers.length,
      completedAt: new Date(),
      answers: {
        create: answers.map((a: any) => ({
          questionId: a.questionId,
          choiceId: a.choiceId,
          isCorrect: a.isCorrect,
        })),
      },
    },
  });

  // Update UserProgress for each question
  for (const a of answers) {
    await prisma.userProgress.upsert({
      where: { userId_questionId: { userId, questionId: a.questionId } },
      update: {
        seenCount: { increment: 1 },
        correctCount: a.isCorrect ? { increment: 1 } : undefined,
        lastSeen: new Date(),
        mastered: a.isCorrect ? true : false,
      },
      create: {
        userId,
        questionId: a.questionId,
        seenCount: 1,
        correctCount: a.isCorrect ? 1 : 0,
        mastered: a.isCorrect,
        lastSeen: new Date(),
      },
    });
  }

  return NextResponse.json({ sessionId: testSession.id, score, total: answers.length });
}
