import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const dueProgress = await prisma.userWordProgress.findMany({
    where: {
      userId,
      nextReviewAt: { lte: new Date() },
      status: { not: "new" },
    },
    include: {
      word: {
        include: { bank: { select: { name: true } } },
      },
    },
    orderBy: { nextReviewAt: "asc" },
  });

  const words = dueProgress.map((p) => ({
    ...p.word,
    progressStatus: p.status,
    easeFactor: p.easeFactor,
    interval: p.interval,
    repetitions: p.repetitions,
  }));

  return NextResponse.json(words);
}
