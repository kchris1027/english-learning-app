import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import PlacementClient from "./placement-client";

function determinePlacementLevel(percentage: number): string {
  if (percentage <= 30) return "beginner";
  if (percentage <= 65) return "intermediate";
  return "advanced";
}

export default async function PlacementTestPage() {
  const userId = getDefaultUserId();

  const placementQuiz = await prisma.quiz.findFirst({
    where: { type: "placement", isActive: true },
  });

  if (!placementQuiz) {
    return <PlacementClient quiz={null} previousAttempt={null} />;
  }

  const previousAttempt = await prisma.quizAttempt.findFirst({
    where: { userId, quizId: placementQuiz.id },
    orderBy: { startedAt: "desc" },
  });

  return (
    <PlacementClient
      quiz={{
        id: placementQuiz.id,
        title: placementQuiz.title,
        description: placementQuiz.description,
        questionCount: placementQuiz.questionCount,
        timeLimit: placementQuiz.timeLimit,
        passingScore: placementQuiz.passingScore,
      }}
      previousAttempt={
        previousAttempt
          ? {
              percentage: previousAttempt.percentage,
              formattedDate: formatDate(previousAttempt.startedAt),
              level: determinePlacementLevel(previousAttempt.percentage),
            }
          : null
      }
    />
  );
}
