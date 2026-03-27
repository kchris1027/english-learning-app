import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const body = await request.json();
  const { articleId, readingTimeMs } = body as {
    articleId: string;
    readingTimeMs: number;
  };

  if (!articleId) {
    return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
  }

  const existing = await prisma.userReadingProgress.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });

  const totalTime = (existing?.readingTimeMs ?? 0) + (readingTimeMs ?? 0);

  const progress = await prisma.userReadingProgress.upsert({
    where: { userId_articleId: { userId, articleId } },
    update: {
      status: existing?.status === "completed" ? "completed" : "reading",
      readingTimeMs: totalTime,
    },
    create: {
      userId,
      articleId,
      status: "reading",
      readingTimeMs: readingTimeMs ?? 0,
    },
  });

  return NextResponse.json({
    status: progress.status,
    readingTimeMs: progress.readingTimeMs,
  });
}
