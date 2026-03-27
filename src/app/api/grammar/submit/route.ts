import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const body = await request.json();
  const { topicId, score, total } = body as {
    topicId: string;
    score: number;
    total: number;
  };

  if (!topicId || score == null || !total) {
    return NextResponse.json(
      { error: "Missing topicId, score, or total" },
      { status: 400 }
    );
  }

  const percentage = Math.round((score / total) * 100);
  const status = percentage >= 60 ? "completed" : "in_progress";

  const existing = await prisma.userGrammarProgress.findUnique({
    where: { userId_topicId: { userId, topicId } },
  });

  const bestScore = existing?.score != null
    ? Math.max(existing.score, percentage)
    : percentage;

  const progress = await prisma.userGrammarProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: {
      userId,
      topicId,
      score: percentage,
      status,
      attempts: 1,
      lastAttemptAt: new Date(),
      completedAt: status === "completed" ? new Date() : null,
    },
    update: {
      score: bestScore,
      status: existing?.status === "completed" ? "completed" : status,
      attempts: { increment: 1 },
      lastAttemptAt: new Date(),
      completedAt:
        status === "completed" && !existing?.completedAt
          ? new Date()
          : undefined,
    },
  });

  return NextResponse.json(progress);
}
