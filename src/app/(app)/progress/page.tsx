import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getToday } from "@/lib/utils";
import { ProgressClient } from "./progress-client";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  const today = getToday();

  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const [weeklyProgress, streak, totalXpResult, wordStats, grammarStats, todayProgress] =
    await Promise.all([
      prisma.dailyProgress.findMany({
        where: { userId: user.id, date: { in: last7Days } },
        orderBy: { date: "asc" },
      }),
      prisma.userStreak.findUnique({ where: { userId: user.id } }),
      prisma.dailyProgress.aggregate({
        where: { userId: user.id },
        _sum: { totalXp: true },
      }),
      prisma.userWordProgress.groupBy({
        by: ["status"],
        where: { userId: user.id },
        _count: true,
      }),
      prisma.userGrammarProgress.groupBy({
        by: ["status"],
        where: { userId: user.id },
        _count: true,
      }),
      prisma.dailyProgress.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      }),
    ]);

  const weekMap = new Map(weeklyProgress.map((p) => [p.date, p]));
  const weekData = last7Days.map((date) => ({
    date,
    xp: weekMap.get(date)?.totalXp || 0,
    wordsLearned: weekMap.get(date)?.wordsLearned || 0,
    wordsReviewed: weekMap.get(date)?.wordsReviewed || 0,
  }));

  return (
    <ProgressClient
      weekData={weekData}
      currentStreak={streak?.currentStreak || 0}
      longestStreak={streak?.longestStreak || 0}
      totalXp={totalXpResult._sum.totalXp || 0}
      wordStats={Object.fromEntries(wordStats.map((s) => [s.status, s._count]))}
      grammarStats={Object.fromEntries(grammarStats.map((s) => [s.status, s._count]))}
      todayXp={todayProgress?.totalXp || 0}
      todayWordsLearned={todayProgress?.wordsLearned || 0}
      todayWordsReviewed={todayProgress?.wordsReviewed || 0}
      todayGrammar={todayProgress?.grammarCompleted || 0}
    />
  );
}
