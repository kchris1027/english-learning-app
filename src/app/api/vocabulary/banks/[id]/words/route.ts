import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getDefaultUserId();

  const words = await prisma.word.findMany({
    where: { bankId: id },
    include: {
      userProgress: {
        where: { userId },
      },
    },
  });

  const result = words.map((word) => ({
    id: word.id,
    word: word.word,
    phonetic: word.phonetic,
    partOfSpeech: word.partOfSpeech,
    definition: word.definition,
    definitionZh: word.definitionZh,
    exampleSentence: word.exampleSentence,
    exampleTranslation: word.exampleTranslation,
    difficulty: word.difficulty,
    tags: word.tags,
    status: word.userProgress[0]?.status || "new",
  }));

  return NextResponse.json(result);
}
