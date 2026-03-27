import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = getDefaultUserId();

  const article = await prisma.readingArticle.findUnique({
    where: { slug },
    include: {
      questions: { orderBy: { sortOrder: "asc" } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    summary: article.summary,
    level: article.level,
    category: article.category,
    wordCount: article.wordCount,
    estimatedTime: article.estimatedTime,
    imageUrl: article.imageUrl,
    source: article.source,
    keyVocabulary: article.keyVocabulary,
    questions: article.questions.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
    })),
    progress: article.userProgress[0]
      ? {
          status: article.userProgress[0].status,
          score: article.userProgress[0].score,
          readingTimeMs: article.userProgress[0].readingTimeMs,
        }
      : null,
  });
}
