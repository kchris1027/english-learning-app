import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const entries = await prisma.wordbookEntry.findMany({
    where: { userId },
    include: {
      word: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const result = entries.map((entry) => ({
    id: entry.id,
    word: entry.word?.word ?? entry.customWord ?? "",
    phonetic: entry.word?.phonetic ?? entry.customPhonetic ?? null,
    definition: entry.word?.definition ?? entry.customDefinition ?? "",
    definitionZh: entry.word?.definitionZh ?? null,
    partOfSpeech: entry.word?.partOfSpeech ?? null,
    source: entry.source,
    sourceId: entry.sourceId,
    wordId: entry.wordId,
    createdAt: entry.createdAt.toISOString(),
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const userId = getDefaultUserId();
  const body = await request.json();
  const { wordId, customWord, customDefinition, customPhonetic, source, sourceId } = body as {
    wordId?: string;
    customWord?: string;
    customDefinition?: string;
    customPhonetic?: string;
    source: string;
    sourceId?: string;
  };

  if (!wordId && !customWord) {
    return NextResponse.json(
      { error: "Either wordId or customWord is required" },
      { status: 400 }
    );
  }

  if (wordId) {
    const existing = await prisma.wordbookEntry.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Word already in wordbook" },
        { status: 409 }
      );
    }
  }

  const entry = await prisma.wordbookEntry.create({
    data: {
      userId,
      wordId: wordId ?? null,
      customWord: customWord ?? null,
      customDefinition: customDefinition ?? null,
      customPhonetic: customPhonetic ?? null,
      source: source || "manual",
      sourceId: sourceId ?? null,
    },
    include: { word: true },
  });

  if (wordId) {
    const existingProgress = await prisma.userWordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    if (!existingProgress) {
      await prisma.userWordProgress.create({
        data: {
          userId,
          wordId,
          status: "new",
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
        },
      });
    }
  }

  return NextResponse.json({
    id: entry.id,
    word: entry.word?.word ?? entry.customWord ?? "",
    phonetic: entry.word?.phonetic ?? entry.customPhonetic ?? null,
    definition: entry.word?.definition ?? entry.customDefinition ?? "",
    definitionZh: entry.word?.definitionZh ?? null,
    partOfSpeech: entry.word?.partOfSpeech ?? null,
    source: entry.source,
    sourceId: entry.sourceId,
    wordId: entry.wordId,
    createdAt: entry.createdAt.toISOString(),
  });
}

export async function DELETE(request: Request) {
  const userId = getDefaultUserId();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const entry = await prisma.wordbookEntry.findFirst({
    where: { id, userId },
  });

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  if (entry.wordId) {
    await prisma.userWordProgress.deleteMany({
      where: { userId, wordId: entry.wordId },
    });
  }

  await prisma.wordbookEntry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
