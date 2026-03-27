import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingClient } from "./reading-client";

interface Props {
  searchParams: Promise<{ level?: string; category?: string }>;
}

export default async function ReadingPage({ searchParams }: Props) {
  const { level, category } = await searchParams;
  const userId = getDefaultUserId();

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

  const allCategories = await prisma.readingArticle
    .findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    })
    .then((rows) => rows.map((r) => r.category));

  const serializedArticles = articles.map((article) => {
    const progress = article.userProgress[0];
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      level: article.level,
      category: article.category,
      wordCount: article.wordCount,
      estimatedTime: article.estimatedTime,
      questionCount: article._count.questions,
      status: progress?.status ?? "not_started",
      score: progress?.score ?? null,
    };
  });

  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <ReadingClient
        articles={serializedArticles}
        categories={allCategories}
        totalArticles={serializedArticles.length}
      />
    </Suspense>
  );
}
