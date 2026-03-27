import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const body = await request.json();
  const { contentId, status, score } = body as {
    contentId: string;
    status?: string;
    score?: number;
  };

  if (!contentId) {
    return NextResponse.json(
      { error: "Missing contentId" },
      { status: 400 }
    );
  }

  const existing = await prisma.userListeningProgress.findUnique({
    where: { userId_contentId: { userId, contentId } },
  });

  const newStatus = status ?? (existing?.status === "completed" ? "completed" : "in_progress");
  const bestScore =
    score != null && existing?.score != null
      ? Math.max(existing.score, score)
      : score ?? existing?.score ?? undefined;

  const progress = await prisma.userListeningProgress.upsert({
    where: { userId_contentId: { userId, contentId } },
    update: {
      status: newStatus,
      score: bestScore,
      completedAt: newStatus === "completed" ? new Date() : undefined,
    },
    create: {
      userId,
      contentId,
      status: newStatus,
      score: bestScore,
    },
  });

  return NextResponse.json({
    status: progress.status,
    score: progress.score,
  });
}
