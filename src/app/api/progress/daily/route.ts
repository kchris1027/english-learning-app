import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { getToday } from "@/lib/utils";

export async function GET() {
  const userId = getDefaultUserId();
  const today = getToday();

  const progress = await prisma.dailyProgress.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const streak = await prisma.userStreak.findUnique({
    where: { userId },
  });

  return NextResponse.json({
    progress: progress || {
      wordsLearned: 0,
      wordsReviewed: 0,
      grammarCompleted: 0,
      articlesRead: 0,
      listeningMinutes: 0,
      speakingMinutes: 0,
      chatMessages: 0,
      quizzesTaken: 0,
      totalXp: 0,
      studyTimeMin: 0,
    },
    streak: streak || { currentStreak: 0, longestStreak: 0 },
  });
}

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const today = getToday();
  const body = await request.json();

  const { field, increment = 1, xp = 0 } = body as {
    field: string;
    increment?: number;
    xp?: number;
  };

  const validFields = [
    "wordsLearned",
    "wordsReviewed",
    "grammarCompleted",
    "articlesRead",
    "listeningMinutes",
    "speakingMinutes",
    "chatMessages",
    "quizzesTaken",
    "studyTimeMin",
  ];

  if (!validFields.includes(field)) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  const progress = await prisma.dailyProgress.upsert({
    where: { userId_date: { userId, date: today } },
    create: {
      userId,
      date: today,
      [field]: increment,
      totalXp: xp,
    },
    update: {
      [field]: { increment },
      totalXp: { increment: xp },
    },
  });

  // Update streak
  const streak = await prisma.userStreak.findUnique({ where: { userId } });
  if (streak) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = streak.currentStreak;
    if (streak.lastActiveDate !== today) {
      newStreak =
        streak.lastActiveDate === yesterdayStr
          ? streak.currentStreak + 1
          : 1;

      await prisma.userStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActiveDate: today,
        },
      });
    }
  }

  return NextResponse.json({ progress });
}
