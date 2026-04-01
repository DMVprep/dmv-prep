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

  // Deduplicate: if a state-specific lesson exists, hide the universal version on the same subject
  if (stateCode) {
    const stateSpecificTitles = lessons
      .filter((l: any) => l.stateCode === stateCode.toUpperCase())
      .map((l: any) => l.title.toLowerCase());

    const stateKeywords = stateSpecificTitles.map((t: string) => {
      const lower = t.replace(/^[a-z]+\s/, '');
      return lower;
    });

    const filtered = lessons.filter((lesson: any) => {
      if (lesson.stateCode) return true;

      const uniTitle = lesson.title.toLowerCase();
      const uniSimple = lesson.simpleLine.toLowerCase();

      const subjects = [
        ['school zone', 'school zone'],
        ['roundabout', 'roundabout'],
        ['following distance', 'following distance'],
        ['learner', 'permit'],
        ['bac', 'bac'],
        ['bac', '0.08'],
        ['phone', 'phone'],
        ['freeway speed', 'speed limit'],
      ];

      const hasDupe = stateKeywords.some((sk: string) => {
        return subjects.some(([a, b]) =>
          (sk.includes(a) || sk.includes(b)) && (uniTitle.includes(a) || uniTitle.includes(b) || uniSimple.includes(a) || uniSimple.includes(b))
        );
      });

      return !hasDupe;
    });

    return NextResponse.json({ lessons: filtered });
  }

  return NextResponse.json({ lessons });
}
