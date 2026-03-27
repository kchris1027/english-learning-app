import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import QuizResultClient from "./result-client";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}

export default async function QuizResultPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { attempt: attemptId } = await searchParams;
  const userId = getDefaultUserId();

  const whereClause = attemptId
    ? { id: attemptId, userId, quizId: id }
    : { userId, quizId: id };

  const attempt = await prisma.quizAttempt.findFirst({
    where: whereClause,
    orderBy: { startedAt: "desc" },
    include: {
      quiz: {
        include: {
          questions: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!attempt) redirect(`/quiz/${id}`);

  const gradedAnswers = JSON.parse(attempt.answers) as {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];

  const passed = attempt.percentage >= attempt.quiz.passingScore;
  const isPlacement = attempt.quiz.type === "placement";

  let determinedLevel: string | null = null;
  if (isPlacement) {
    if (attempt.percentage <= 30) determinedLevel = "beginner";
    else if (attempt.percentage <= 65) determinedLevel = "intermediate";
    else determinedLevel = "advanced";
  }

  return (
    <QuizResultClient
      quizId={id}
      quizTitle={attempt.quiz.title}
      passingScore={attempt.quiz.passingScore}
      percentage={attempt.percentage}
      score={attempt.score}
      totalPoints={attempt.totalPoints}
      timeSpentSec={attempt.timeSpentSec}
      passed={passed}
      isPlacement={isPlacement}
      determinedLevel={determinedLevel}
      questions={attempt.quiz.questions.map((q) => ({
        id: q.id,
        module: q.module,
        type: q.type,
        question: q.question,
        options: q.options ? (JSON.parse(q.options) as string[]) : null,
        answer: q.answer,
        explanation: q.explanation,
      }))}
      gradedAnswers={gradedAnswers}
    />
  );
}
