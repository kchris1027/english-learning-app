import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { StatsClient } from "./stats-client";

export default async function VocabularyStatsPage() {
  const userId = getDefaultUserId();

  const [totalWords, totalLearning, totalMastered, recentReviews, dueForReview] =
    await Promise.all([
      prisma.word.count(),
      prisma.userWordProgress.count({ where: { userId, status: "learning" } }),
      prisma.userWordProgress.count({ where: { userId, status: "mastered" } }),
      prisma.userWordProgress.findMany({
        where: { userId, lastReviewedAt: { not: null } },
        orderBy: { lastReviewedAt: "desc" },
        take: 10,
        include: { word: true },
      }),
      prisma.userWordProgress.count({
        where: {
          userId,
          nextReviewAt: { lte: new Date() },
          status: { not: "new" },
        },
      }),
    ]);

  const totalStarted = totalLearning + totalMastered;
  const notStarted = totalWords - totalStarted;

  const masteryPct = totalWords > 0 ? (totalMastered / totalWords) * 100 : 0;
  const learningPct = totalWords > 0 ? (totalLearning / totalWords) * 100 : 0;
  const newPct = totalWords > 0 ? (notStarted / totalWords) * 100 : 0;

  const serializedReviews = recentReviews.map((r) => ({
    id: r.id,
    status: r.status,
    correctCount: r.correctCount,
    incorrectCount: r.incorrectCount,
    lastReviewedAt: r.lastReviewedAt?.toISOString() || null,
    word: { word: r.word.word },
  }));

  return (
    <StatsClient
      totalWords={totalWords}
      totalLearning={totalLearning}
      totalMastered={totalMastered}
      dueForReview={dueForReview}
      recentReviews={serializedReviews}
      masteryPct={masteryPct}
      learningPct={learningPct}
      newPct={newPct}
      notStarted={notStarted}
    />
  );
}
