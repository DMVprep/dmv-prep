// src/app/api/admin/upload-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  let records: any[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return NextResponse.json({ error: "Invalid CSV format" }, { status: 400 });
  }

  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    try {
      const { state: stateCode, topic: topicSlug, question, choice_a, choice_b, choice_c, choice_d, correct_answer, explanation, } = row;

      if (!stateCode || !question || !choice_a) {
        errors.push(`Row ${i + 2}: Missing required fields`);
        continue;
      }

      const state = await prisma.state.findUnique({ where: { code: stateCode.toUpperCase() } });
      if (!state) { errors.push(`Row ${i + 2}: Unknown state '${stateCode}'`); continue; }

      let topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
      if (!topic) {
        topic = await prisma.topic.create({
          data: { name: topicSlug, slug: topicSlug },
        });
      }

      const correctIdx = ["A", "B", "C", "D"].indexOf(correct_answer?.toUpperCase());
      if (correctIdx === -1) { errors.push(`Row ${i + 2}: Invalid correct_answer (use A/B/C/D)`); continue; }

      const choices = [choice_a, choice_b, choice_c, choice_d].filter(Boolean);

      await prisma.question.create({
        data: {
          text: question,
          explanation: explanation || "",
          stateId: state.id,
          topicId: topic.id,
          choices: {
            create: choices.map((text, idx) => ({
              text,
              isCorrect: idx === correctIdx,
            })),
          },
        },
      });
      imported++;
    } catch (err) {
      errors.push(`Row ${i + 2}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({ imported, errors });
}
