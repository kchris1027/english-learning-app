import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const [weeklyProgress, streak, totalXp, wordStats, grammarStats] =
    await Promise.all([
      prisma.dailyProgress.findMany({
        where: { userId, date: { in: last7Days } },
        orderBy: { date: "asc" },
      }),
      prisma.userStreak.findUnique({ where: { userId } }),
      prisma.dailyProgress.aggregate({
        where: { userId },
        _sum: { totalXp: true },
      }),
      prisma.userWordProgress.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
      prisma.userGrammarProgress.groupBy({
        by: ["status"],
        where: { userId },
        _count: true,
      }),
    ]);

  const weekMap = new Map(weeklyProgress.map((p) => [p.date, p]));
  const weekData = last7Days.map((date) => ({
    date,
    xp: weekMap.get(date)?.totalXp || 0,
    wordsLearned: weekMap.get(date)?.wordsLearned || 0,
    wordsReviewed: weekMap.get(date)?.wordsReviewed || 0,
    grammarCompleted: weekMap.get(date)?.grammarCompleted || 0,
  }));

  return NextResponse.json({
    weekData,
    streak: streak || { currentStreak: 0, longestStreak: 0 },
    totalXp: totalXp._sum.totalXp || 0,
    wordStats: Object.fromEntries(
      wordStats.map((s) => [s.status, s._count])
    ),
    grammarStats: Object.fromEntries(
      grammarStats.map((s) => [s.status, s._count])
    ),
  });
}
