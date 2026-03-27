import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shuffle } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stateCode = searchParams.get("state") || "FL";
  const mode = searchParams.get("mode") || "PRACTICE";
  const topic = searchParams.get("topic");
  const userId = searchParams.get("userId");

  const session = await getServerSession(authOptions);
  const isPremium = (session?.user as any)?.plan === "PREMIUM";

  const state = await prisma.state.findUnique({ where: { code: stateCode.toUpperCase() } });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  const where: any = { stateId: state.id };
  if (topic) {
    const topicRecord = await prisma.topic.findUnique({ where: { slug: topic } });
    if (topicRecord) where.topicId = topicRecord.id;
  }

  if (mode === "WEAK_AREAS" && userId) {
    // Return questions the user has answered incorrectly
    const wrongAnswers = await prisma.answer.findMany({
      where: { session: { userId }, isCorrect: false },
      include: { question: { include: { choices: true, topic: true } } },
      orderBy: { session: { createdAt: "desc" } },
      take: isPremium ? 100 : 10,
    });
    const questions = wrongAnswers.map(a => a.question);
    const unique = Array.from(new Map(questions.map(q => [q.id, q])).values());
    return NextResponse.json({ questions: shuffle(unique).slice(0, 15), mode, state: state.code });
  }

  const questions = await prisma.question.findMany({
    where,
    include: { choices: true, topic: true, translations: true },
  });

  const shuffled = shuffle(questions);

  let limit: number;
  if (mode === "EXAM_SIMULATION") {
    limit = state.examQuestionCount;
  } else if (mode === "QUICK") {
    limit = 10;
  } else if (mode === "PRACTICE") {
    limit = 20;
  } else if (mode === "WEAK_AREAS") {
    limit = 15;
  } else {
    limit = 20;
  }

  const sliced = shuffled.slice(0, limit);

  return NextResponse.json({
    questions: sliced,
    mode,
    state: state.code,
    examConfig: mode === "EXAM_SIMULATION" ? {
      totalQuestions: state.examQuestionCount,
      passingScore: state.examPassScore,
      timeLimit: 30,
      maxWrong: state.maxWrong,
      autoFail: state.autoFail,
      autoPass: state.autoPass,
      skipAllowed: state.skipAllowed,
      maxSkips: state.maxSkips,
    } : null,
  });
}
