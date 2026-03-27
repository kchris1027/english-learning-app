import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const word = await prisma.word.findFirst({
    where: {
      word: { equals: q, mode: "insensitive" },
    },
    select: {
      id: true,
      word: true,
      phonetic: true,
      partOfSpeech: true,
      definition: true,
      definitionZh: true,
      exampleSentence: true,
    },
  });

  if (!word) {
    return NextResponse.json({ found: false, query: q });
  }

  return NextResponse.json({
    found: true,
    ...word,
  });
}
