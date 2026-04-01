// src/app/api/streak/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function isYesterday(d1: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d1, yesterday);
}

// GET — fetch current streak and daily goal progress
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
      dailyGoalQuestions: true,
      todayQuestions: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date();

  // Check if streak is still active (last active was today or yesterday)
  let activeStreak = user.currentStreak;
  if (user.lastActiveDate) {
    if (!isSameDay(user.lastActiveDate, today) && !isYesterday(user.lastActiveDate, today)) {
      // Streak broken — reset
      activeStreak = 0;
    }
  }

  // Reset todayQuestions if lastActiveDate is not today
  let todayCount = user.todayQuestions;
  if (!user.lastActiveDate || !isSameDay(user.lastActiveDate, today)) {
    todayCount = 0;
  }

  return NextResponse.json({
    currentStreak: activeStreak,
    longestStreak: user.longestStreak,
    dailyGoal: user.dailyGoalQuestions,
    todayQuestions: todayCount,
    goalComplete: todayCount >= user.dailyGoalQuestions,
  });
}

// POST — record activity (called after completing a practice session)
// body: { questionsCompleted: number }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const questionsCompleted = body.questionsCompleted || 0;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
      dailyGoalQuestions: true,
      todayQuestions: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date();
  let newStreak = user.currentStreak;
  let newTodayQuestions = user.todayQuestions;

  if (user.lastActiveDate && isSameDay(user.lastActiveDate, today)) {
    // Already active today — just add questions
    newTodayQuestions += questionsCompleted;
  } else if (user.lastActiveDate && isYesterday(user.lastActiveDate, today)) {
    // Active yesterday — streak continues
    newStreak += 1;
    newTodayQuestions = questionsCompleted;
  } else {
    // First activity or streak broken — start new streak
    newStreak = 1;
    newTodayQuestions = questionsCompleted;
  }

  const newLongestStreak = Math.max(user.longestStreak, newStreak);

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
      todayQuestions: newTodayQuestions,
    },
  });

  return NextResponse.json({
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    todayQuestions: newTodayQuestions,
    dailyGoal: user.dailyGoalQuestions,
    goalComplete: newTodayQuestions >= user.dailyGoalQuestions,
    streakIncreased: newStreak > user.currentStreak,
  });
}
