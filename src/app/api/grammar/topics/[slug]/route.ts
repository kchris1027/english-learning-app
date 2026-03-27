import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = getDefaultUserId();

  const topic = await prisma.grammarTopic.findUnique({
    where: { slug },
    include: {
      exercises: { orderBy: { sortOrder: "asc" } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...topic,
    progress: topic.userProgress[0] ?? null,
    userProgress: undefined,
  });
}
