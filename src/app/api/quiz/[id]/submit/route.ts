import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

function determinePlacementLevel(percentage: number): string {
  if (percentage <= 30) return "beginner";
  if (percentage <= 65) return "intermediate";
  return "advanced";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getDefaultUserId();
  const body = await request.json();
  const { answers, timeSpentSec } = body as {
    answers: { questionId: string; userAnswer: string }[];
    timeSpentSec?: number;
  };

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

  let score = 0;
  let totalPoints = 0;
  const gradedAnswers = answers.map((a) => {
    const question = questionMap.get(a.questionId);
    if (!question) {
      return { questionId: a.questionId, userAnswer: a.userAnswer, isCorrect: false, points: 0 };
    }
    totalPoints += question.points;
    const isCorrect =
      a.userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    if (isCorrect) score += question.points;
    return {
      questionId: a.questionId,
      userAnswer: a.userAnswer,
      isCorrect,
      points: isCorrect ? question.points : 0,
    };
  });

  for (const q of quiz.questions) {
    if (!answers.find((a) => a.questionId === q.id)) {
      totalPoints += q.points;
    }
  }

  const percentage =
    totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId: id,
      answers: JSON.stringify(gradedAnswers),
      score,
      totalPoints,
      percentage,
      timeSpentSec: timeSpentSec ?? null,
      completedAt: new Date(),
    },
  });

  if (quiz.type === "placement") {
    const level = determinePlacementLevel(percentage);
    await prisma.user.update({
      where: { id: userId },
      data: { level },
    });
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    totalPoints,
    percentage,
    passed: percentage >= quiz.passingScore,
    quizType: quiz.type,
    ...(quiz.type === "placement" && {
      determinedLevel: determinePlacementLevel(percentage),
    }),
  });
}
