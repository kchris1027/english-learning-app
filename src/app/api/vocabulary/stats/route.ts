import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const [totalNew, totalLearning, totalMastered, recentReviews, totalWords] =
    await Promise.all([
      prisma.userWordProgress.count({ where: { userId, status: "new" } }),
      prisma.userWordProgress.count({ where: { userId, status: "learning" } }),
      prisma.userWordProgress.count({ where: { userId, status: "mastered" } }),
      prisma.userWordProgress.findMany({
        where: { userId, lastReviewedAt: { not: null } },
        orderBy: { lastReviewedAt: "desc" },
        take: 10,
        include: { word: true },
      }),
      prisma.word.count(),
    ]);

  const dueForReview = await prisma.userWordProgress.count({
    where: {
      userId,
      nextReviewAt: { lte: new Date() },
      status: { not: "new" },
    },
  });

  return NextResponse.json({
    totalWords,
    totalNew,
    totalLearning,
    totalMastered,
    totalStarted: totalLearning + totalMastered,
    dueForReview,
    recentReviews: recentReviews.map((r) => ({
      word: r.word.word,
      definition: r.word.definition,
      status: r.status,
      lastReviewedAt: r.lastReviewedAt,
      correctCount: r.correctCount,
      incorrectCount: r.incorrectCount,
    })),
  });
}
