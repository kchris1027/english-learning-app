import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { GrammarClient } from "./grammar-client";

export default async function GrammarPage() {
  const userId = getDefaultUserId();

  const topics = await prisma.grammarTopic.findMany({
    orderBy: [{ sortOrder: "asc" }],
    include: {
      _count: { select: { exercises: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  const totalTopics = topics.length;
  const completedTopics = topics.filter(
    (t) => t.userProgress[0]?.status === "completed"
  ).length;
  const overallProgress =
    totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const topicItems = topics.map((topic) => ({
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    level: topic.level,
    exerciseCount: topic._count.exercises,
    progressStatus: topic.userProgress[0]?.status ?? null,
    progressScore: topic.userProgress[0]?.score ?? null,
  }));

  return (
    <GrammarClient
      topics={topicItems}
      completedTopics={completedTopics}
      totalTopics={totalTopics}
      overallProgress={overallProgress}
    />
  );
}
