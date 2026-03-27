import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { ListeningClient } from "./listening-client";

export default async function ListeningPage() {
  const userId = getDefaultUserId();

  const contents = await prisma.listeningContent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { exercises: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  const serializedContents = contents.map((content) => {
    const progress = content.userProgress[0];
    return {
      id: content.id,
      title: content.title,
      slug: content.slug,
      level: content.level,
      category: content.category,
      durationSec: content.durationSec,
      speakerCount: content.speakerCount,
      exerciseCount: content._count.exercises,
      status: progress?.status ?? "not_started",
      score: progress?.score ?? null,
    };
  });

  return (
    <ListeningClient
      contents={serializedContents}
      totalCount={serializedContents.length}
    />
  );
}
