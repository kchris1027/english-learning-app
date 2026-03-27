import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const userId = getDefaultUserId();

  const content = await prisma.listeningContent.findUnique({
    where: { slug },
    include: {
      exercises: { orderBy: { sortOrder: "asc" } },
      userProgress: {
        where: { userId },
        take: 1,
      },
    },
  });

  if (!content) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: content.id,
    title: content.title,
    slug: content.slug,
    audioUrl: content.audioUrl,
    transcript: content.transcript,
    level: content.level,
    category: content.category,
    durationSec: content.durationSec,
    speakerCount: content.speakerCount,
    exercises: content.exercises.map((e) => ({
      id: e.id,
      type: e.type,
      question: e.question,
      answer: e.answer,
      options: e.options,
      hint: e.hint,
      startTimeSec: e.startTimeSec,
      endTimeSec: e.endTimeSec,
      sortOrder: e.sortOrder,
    })),
    progress: content.userProgress[0]
      ? {
          status: content.userProgress[0].status,
          score: content.userProgress[0].score,
        }
      : null,
  });
}
