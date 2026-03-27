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

  const article = await prisma.readingArticle.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

  const existing = await prisma.userReadingProgress.findUnique({
    where: { userId_articleId: { userId, articleId: article.id } },
  });

  const bestScore =
    existing?.score != null ? Math.max(existing.score, scorePercent) : scorePercent;

  const progress = await prisma.userReadingProgress.upsert({
    where: { userId_articleId: { userId, articleId: article.id } },
    update: {
      status: "completed",
      score: bestScore,
      completedAt: new Date(),
    },
    create: {
      userId,
      articleId: article.id,
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
