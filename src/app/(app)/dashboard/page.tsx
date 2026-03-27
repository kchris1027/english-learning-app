import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getToday } from "@/lib/utils";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const today = getToday();

  const [dailyProgress, totalWords, totalGrammar, streak] = await Promise.all([
    prisma.dailyProgress.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    }),
    prisma.userWordProgress.count({
      where: { userId: user.id, status: "mastered" },
    }),
    prisma.userGrammarProgress.count({
      where: { userId: user.id, status: "completed" },
    }),
    prisma.userStreak.findUnique({ where: { userId: user.id } }),
  ]);

  const recentWordProgress = await prisma.userWordProgress.findMany({
    where: { userId: user.id },
    orderBy: { lastReviewedAt: "desc" },
    take: 5,
    include: { word: true },
  });

  const wordsDueForReview = await prisma.userWordProgress.count({
    where: {
      userId: user.id,
      nextReviewAt: { lte: new Date() },
      status: { not: "new" },
    },
  });

  return (
    <DashboardClient
      userName={user.name || "Learner"}
      level={user.level}
      streak={streak?.currentStreak || 0}
      longestStreak={streak?.longestStreak || 0}
      todayXp={dailyProgress?.totalXp || 0}
      wordsLearned={dailyProgress?.wordsLearned || 0}
      wordsReviewed={dailyProgress?.wordsReviewed || 0}
      totalMastered={totalWords}
      totalGrammarCompleted={totalGrammar}
      wordsDueForReview={wordsDueForReview}
      recentWords={recentWordProgress.map((wp) => ({
        word: wp.word.word,
        status: wp.status,
        lastReviewed: wp.lastReviewedAt?.toISOString() || null,
      }))}
    />
  );
}
