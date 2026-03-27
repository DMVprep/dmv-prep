// src/app/api/tests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { stateCode, mode, score, totalQ, answers } = body;

  const state = await prisma.state.findUnique({ where: { code: stateCode } });
  if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });

  const testSession = await prisma.testSession.create({
    data: {
      userId: (session.user as any).id,
      stateId: state.id,
      mode,
      score,
      totalQ,
      completedAt: new Date(),
      answers: {
        createMany: {
          data: answers.map((a: any) => ({
            questionId: a.questionId,
            choiceId: a.choiceId,
            isCorrect: a.isCorrect,
          })),
        },
      },
    },
  });

  return NextResponse.json({ id: testSession.id });
}
