import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const words = await prisma.word.findMany({
    where: {
      word: { contains: q },
    },
    select: {
      id: true,
      word: true,
      phonetic: true,
      partOfSpeech: true,
      definition: true,
      definitionZh: true,
      bank: { select: { name: true } },
    },
    take: 20,
    orderBy: { word: "asc" },
  });

  return NextResponse.json(words);
}
