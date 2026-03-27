import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id, isActive: true },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const sanitizedQuestions = quiz.questions.map((q) => ({
    id: q.id,
    module: q.module,
    type: q.type,
    question: q.question,
    options: q.options ? JSON.parse(q.options) : null,
    points: q.points,
    sortOrder: q.sortOrder,
  }));

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    type: quiz.type,
    level: quiz.level,
    modules: JSON.parse(quiz.modules),
    timeLimit: quiz.timeLimit,
    questionCount: quiz.questionCount,
    passingScore: quiz.passingScore,
    questions: sanitizedQuestions,
  });
}
