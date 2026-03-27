import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { calculateSM2, swipeToQuality } from "@/lib/sm2";

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const body = await request.json();
  const { wordId, direction } = body as {
    wordId: string;
    direction: "left" | "right";
  };

  if (!wordId || !direction) {
    return NextResponse.json(
      { error: "Missing wordId or direction" },
      { status: 400 }
    );
  }

  const quality = swipeToQuality(direction);

  let progress = await prisma.userWordProgress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });

  if (!progress) {
    progress = await prisma.userWordProgress.create({
      data: {
        userId,
        wordId,
        status: "learning",
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
      },
    });
  }

  const sm2 = calculateSM2(
    quality,
    progress.easeFactor,
    progress.interval,
    progress.repetitions
  );

  const isCorrect = direction === "right";
  const newStatus = sm2.interval >= 21 ? "mastered" : "learning";

  const updated = await prisma.userWordProgress.update({
    where: { id: progress.id },
    data: {
      easeFactor: sm2.easeFactor,
      interval: sm2.interval,
      repetitions: sm2.repetitions,
      nextReviewAt: sm2.nextReviewAt,
      lastReviewedAt: new Date(),
      status: newStatus,
      correctCount: isCorrect ? { increment: 1 } : undefined,
      incorrectCount: !isCorrect ? { increment: 1 } : undefined,
    },
  });

  return NextResponse.json(updated);
}
