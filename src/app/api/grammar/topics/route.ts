import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const topics = await prisma.grammarTopic.findMany({
    orderBy: [{ level: "asc" }, { sortOrder: "asc" }],
    include: {
      _count: { select: { exercises: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  const data = topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    level: topic.level,
    sortOrder: topic.sortOrder,
    exerciseCount: topic._count.exercises,
    progress: topic.userProgress[0] ?? null,
  }));

  return NextResponse.json(data);
}
