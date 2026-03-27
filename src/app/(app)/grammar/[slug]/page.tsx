import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { markdownToHtml } from "@/lib/markdown";
import { TopicClient } from "./topic-client";

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userId = getDefaultUserId();

  const topic = await prisma.grammarTopic.findUnique({
    where: { slug },
    include: {
      _count: { select: { exercises: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!topic) notFound();

  const progress = topic.userProgress[0] ?? null;
  const lessonHtml = markdownToHtml(topic.content);
  const tipsHtml = topic.tips ? markdownToHtml(topic.tips) : null;

  return (
    <TopicClient
      slug={slug}
      title={topic.title}
      description={topic.description}
      level={topic.level}
      exerciseCount={topic._count.exercises}
      lessonHtml={lessonHtml}
      tipsHtml={tipsHtml}
      progress={
        progress
          ? {
              score: progress.score,
              attempts: progress.attempts,
              status: progress.status,
            }
          : null
      }
    />
  );
}
