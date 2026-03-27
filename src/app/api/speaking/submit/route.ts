import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const userId = getDefaultUserId();
  const body = await req.json();
  const {
    promptId,
    transcription,
    pronunciationScore,
    fluencyScore,
    accuracyScore,
    feedback,
  } = body;

  if (!transcription || typeof transcription !== "string") {
    return NextResponse.json(
      { error: "transcription is required" },
      { status: 400 }
    );
  }

  const record = await prisma.speakingRecord.create({
    data: {
      userId,
      promptId: promptId || null,
      transcription,
      pronunciationScore: pronunciationScore ?? null,
      fluencyScore: fluencyScore ?? null,
      accuracyScore: accuracyScore ?? null,
      feedback: feedback ?? null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
