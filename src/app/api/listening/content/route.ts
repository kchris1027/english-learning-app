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

  const contents = await prisma.listeningContent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { exercises: true } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  const result = contents.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    level: c.level,
    category: c.category,
    durationSec: c.durationSec,
    speakerCount: c.speakerCount,
    exerciseCount: c._count.exercises,
    progress: c.userProgress[0]
      ? {
          status: c.userProgress[0].status,
          score: c.userProgress[0].score,
        }
      : null,
  }));

  return NextResponse.json(result);
}
