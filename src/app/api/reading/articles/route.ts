import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const userId = getDefaultUserId();
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const category = searchParams.get("category");

  const where: Record<string, string> = {};
  if (level) where.level = level;
  if (category) where.category = category;

  const articles = await prisma.readingArticle.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  const result = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    level: a.level,
    category: a.category,
    wordCount: a.wordCount,
    estimatedTime: a.estimatedTime,
    imageUrl: a.imageUrl,
    questionCount: a._count.questions,
    progress: a.userProgress[0]
      ? {
          status: a.userProgress[0].status,
          score: a.userProgress[0].score,
        }
      : null,
  }));

  return NextResponse.json(result);
}
