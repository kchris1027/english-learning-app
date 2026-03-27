import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { markdownToHtml } from "@/lib/markdown";
import { ArticleReaderClient } from "./article-reader-client";

export default async function ArticleReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = getDefaultUserId();

  const article = await prisma.readingArticle.findUnique({
    where: { slug },
    include: {
      _count: { select: { questions: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!article) notFound();

  const contentHtml = markdownToHtml(article.content);
  const progress = article.userProgress[0] ?? null;
  const hasQuiz = article._count.questions > 0;

  let keyVocabList: string[] = [];
  if (article.keyVocabulary) {
    try {
      keyVocabList = JSON.parse(article.keyVocabulary);
    } catch {
      keyVocabList = article.keyVocabulary
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
    }
  }

  const wordbookEntries = await prisma.wordbookEntry.findMany({
    where: { userId },
    select: {
      word: { select: { word: true } },
      customWord: true,
    },
  });
  const wordbookWords = wordbookEntries
    .map((e) => (e.word?.word ?? e.customWord ?? "").toLowerCase())
    .filter(Boolean);

  return (
    <ArticleReaderClient
      article={{
        id: article.id,
        title: article.title,
        level: article.level,
        category: article.category,
        wordCount: article.wordCount,
        estimatedTime: article.estimatedTime,
        source: article.source,
      }}
      slug={slug}
      contentHtml={contentHtml}
      keyVocabList={keyVocabList}
      hasQuiz={hasQuiz}
      wordbookWords={wordbookWords}
      progress={
        progress
          ? {
              status: progress.status,
              score: progress.score,
              readingTimeMs: progress.readingTimeMs,
            }
          : null
      }
    />
  );
}
