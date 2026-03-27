import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getDefaultUserId();

  const attempt = await prisma.quizAttempt.findFirst({
    where: { id, userId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  const gradedAnswers = JSON.parse(attempt.answers) as {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];

  const answerMap = new Map(gradedAnswers.map((a) => [a.questionId, a]));

  const questionsWithReview = attempt.quiz.questions.map((q) => {
    const userAnswer = answerMap.get(q.id);
    return {
      id: q.id,
      module: q.module,
      type: q.type,
      question: q.question,
      options: q.options ? JSON.parse(q.options) : null,
      correctAnswer: q.answer,
      explanation: q.explanation,
      points: q.points,
      userAnswer: userAnswer?.userAnswer ?? null,
      isCorrect: userAnswer?.isCorrect ?? false,
    };
  });

  return NextResponse.json({
    id: attempt.id,
    quizId: attempt.quizId,
    quizTitle: attempt.quiz.title,
    quizType: attempt.quiz.type,
    quizPassingScore: attempt.quiz.passingScore,
    score: attempt.score,
    totalPoints: attempt.totalPoints,
    percentage: attempt.percentage,
    passed: attempt.percentage >= attempt.quiz.passingScore,
    timeSpentSec: attempt.timeSpentSec,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    questions: questionsWithReview,
  });
}
