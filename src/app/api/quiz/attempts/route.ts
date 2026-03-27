import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: 10,
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          type: true,
          passingScore: true,
        },
      },
    },
  });

  const result = attempts.map((a) => ({
    id: a.id,
    quizId: a.quizId,
    quizTitle: a.quiz.title,
    quizType: a.quiz.type,
    score: a.score,
    totalPoints: a.totalPoints,
    percentage: a.percentage,
    passed: a.percentage >= a.quiz.passingScore,
    timeSpentSec: a.timeSpentSec,
    startedAt: a.startedAt,
    completedAt: a.completedAt,
  }));

  return NextResponse.json(result);
}
