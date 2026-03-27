import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import QuizHubClient from "./quiz-hub-client";

export default async function QuizHubPage() {
  const userId = getDefaultUserId();

  const [quizzes, recentAttempts, placementAttempt] = await Promise.all([
    prisma.quiz.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        attempts: {
          where: { userId },
          orderBy: { percentage: "desc" },
          take: 1,
        },
      },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: {
        quiz: { select: { title: true, type: true, passingScore: true } },
      },
    }),
    prisma.quizAttempt.findFirst({
      where: {
        userId,
        quiz: { type: "placement" },
      },
      orderBy: { startedAt: "desc" },
    }),
  ]);

  const placementQuiz = quizzes.find((q) => q.type === "placement");
  const otherQuizzes = quizzes.filter((q) => q.type !== "placement");
  const hasTakenPlacement = !!placementAttempt;

  return (
    <QuizHubClient
      placementQuiz={
        placementQuiz
          ? {
              title: placementQuiz.title,
              description: placementQuiz.description,
              questionCount: placementQuiz.questionCount,
              timeLimit: placementQuiz.timeLimit,
            }
          : null
      }
      hasTakenPlacement={hasTakenPlacement}
      otherQuizzes={otherQuizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        type: quiz.type,
        level: quiz.level,
        questionCount: quiz.questionCount,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        bestPercentage: quiz.attempts[0]?.percentage ?? null,
      }))}
      recentAttempts={recentAttempts.map((attempt) => ({
        id: attempt.id,
        quizId: attempt.quizId,
        percentage: attempt.percentage,
        formattedDate: formatDate(attempt.startedAt),
        quizTitle: attempt.quiz.title,
        quizType: attempt.quiz.type,
        quizPassingScore: attempt.quiz.passingScore,
      }))}
      hasQuizzes={quizzes.length > 0}
    />
  );
}
