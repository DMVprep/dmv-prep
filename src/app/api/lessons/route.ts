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
        ['instruction permit', 'permit'],
        ['provisional', 'license'],
        ['bac', 'bac'],
        ['bac', '0.08'],
        ['zero tolerance', 'under 21'],
        ['zero tolerance', 'alcohol'],
        ['implied consent', 'implied consent'],
        ['dui', 'dui'],
        ['phone', 'phone'],
        ['handheld', 'phone'],
        ['headphone', 'earbud'],
        ['texting', 'phone'],
        ['freeway speed', 'speed limit'],
        ['speed limit', 'speed limit'],
        ['move over', 'move over'],
        ['move over', 'emergency vehicle'],
        ['emergency vehicle', 'pull over'],
        ['seat belt', 'seat belt'],
        ['child restraint', 'child safety'],
        ['child restraint', 'car seat'],
        ['parking rule', 'parking'],
        ['colored curb', 'curb'],
        ['railroad', 'railroad'],
        ['school bus', 'school bus'],
        ['headlight', 'headlight'],
        ['right turn on red', 'right turn'],
        ['u-turn', 'u-turn'],
        ['point system', 'point'],
        ['insurance', 'insurance'],
        ['crash report', 'crash'],
        ['hit and run', 'hit and run'],
        ['curfew', 'curfew'],
        ['blind spot', 'blind spot'],
        ['hydroplaning', 'hydroplaning'],
        ['blowout', 'blowout'],
        ['skid', 'skid'],
        ['fog', 'fog'],
        ['passing', 'passing'],
        ['merging', 'merging'],
        ['expressway', 'freeway'],
        ['signal', 'turn signal'],
        ['bicycle', 'cyclist'],
        ['green sign', 'green sign'],
        ['green sign', 'direction'],
        ['lane signal', 'lane signal'],
        ['carpool', 'hov'],
        ['center turn', 'center turn'],
        ['turnout', 'turnout'],
        ['abs', 'abs'],
        ['vehicle equipment', 'equipment'],
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
