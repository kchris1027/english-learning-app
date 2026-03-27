import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const quizzes = await prisma.quiz.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      attempts: {
        where: { userId },
        orderBy: { percentage: "desc" },
        take: 1,
      },
    },
  });

  const result = quizzes.map((q) => {
    const bestAttempt = q.attempts[0] ?? null;
    return {
      id: q.id,
      title: q.title,
      description: q.description,
      type: q.type,
      level: q.level,
      modules: JSON.parse(q.modules) as string[],
      timeLimit: q.timeLimit,
      questionCount: q.questionCount,
      passingScore: q.passingScore,
      bestAttempt: bestAttempt
        ? {
            score: bestAttempt.score,
            totalPoints: bestAttempt.totalPoints,
            percentage: bestAttempt.percentage,
            completedAt: bestAttempt.completedAt,
          }
        : null,
    };
  });

  return NextResponse.json(result);
}
