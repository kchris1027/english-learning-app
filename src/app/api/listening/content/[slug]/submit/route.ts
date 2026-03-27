import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = getDefaultUserId();
  const body = await request.json();
  const { score, total } = body as { score: number; total: number };

  const content = await prisma.listeningContent.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  const existing = await prisma.userListeningProgress.findUnique({
    where: { userId_contentId: { userId, contentId: content.id } },
  });

  const bestScore =
    existing?.score != null
      ? Math.max(existing.score, scorePercent)
      : scorePercent;

  const progress = await prisma.userListeningProgress.upsert({
    where: { userId_contentId: { userId, contentId: content.id } },
    update: {
      status: "completed",
      score: bestScore,
      completedAt: new Date(),
    },
    create: {
      userId,
      contentId: content.id,
      status: "completed",
      score: scorePercent,
      completedAt: new Date(),
    },
  });

  return NextResponse.json({
    status: progress.status,
    score: progress.score,
  });
}
