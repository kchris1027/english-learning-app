import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { VocabularyClient } from "./vocabulary-client";

export default async function VocabularyPage() {
  const userId = getDefaultUserId();

  const banks = await prisma.wordBank.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { words: true } },
      words: {
        include: {
          userProgress: { where: { userId } },
        },
      },
    },
  });

  const totalDueForReview = await prisma.userWordProgress.count({
    where: {
      userId,
      nextReviewAt: { lte: new Date() },
      status: { not: "new" },
    },
  });

  const bankStats = banks.map((bank) => {
    const totalWords = bank._count.words;
    const learned = bank.words.filter((w) =>
      w.userProgress.some(
        (p) => p.status === "learning" || p.status === "mastered"
      )
    ).length;
    const mastered = bank.words.filter((w) =>
      w.userProgress.some((p) => p.status === "mastered")
    ).length;
    const progressPct = totalWords > 0 ? (learned / totalWords) * 100 : 0;

    return {
      id: bank.id,
      name: bank.name,
      description: bank.description,
      level: bank.level,
      category: bank.category,
      totalWords,
      learned,
      mastered,
      progressPct,
    };
  });

  return (
    <VocabularyClient
      bankStats={bankStats}
      totalDueForReview={totalDueForReview}
    />
  );
}
