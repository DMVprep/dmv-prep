import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const slug = searchParams.get("slug");
  const stateCode = searchParams.get("state");

  if (slug) {
    const lesson = await prisma.microLesson.findUnique({ where: { slug } });
    if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lesson });
  }

  // Build where clause: universal lessons + state-specific lessons if state provided
  const where: any = topic ? { topic } : {};

  if (stateCode) {
    where.OR = [
      { stateCode: null },
      { stateCode: stateCode.toUpperCase() },
    ];
  }

  const lessons = await prisma.microLesson.findMany({
    where,
    orderBy: [{ topic: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ lessons });
}
