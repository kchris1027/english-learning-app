import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
  const userId = getDefaultUserId();

  const banks = await prisma.wordBank.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { words: true } },
      words: {
        include: {
          userProgress: {
            where: { userId },
          },
        },
      },
    },
  });

  const result = banks.map((bank) => {
    const totalWords = bank._count.words;
    const learned = bank.words.filter((w) =>
      w.userProgress.some(
        (p) => p.status === "learning" || p.status === "mastered"
      )
    ).length;
    const mastered = bank.words.filter((w) =>
      w.userProgress.some((p) => p.status === "mastered")
    ).length;

    return {
      id: bank.id,
      name: bank.name,
      description: bank.description,
      level: bank.level,
      category: bank.category,
      sortOrder: bank.sortOrder,
      totalWords,
      learned,
      mastered,
    };
  });

  return NextResponse.json(result);
}
