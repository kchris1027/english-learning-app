import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import { getLevelLabel, getLevelColor } from "@/lib/utils";
import { WordListClient } from "./word-list-client";

export default async function BankDetailPage({
  params,
}: {
  params: Promise<{ bankId: string }>;
}) {
  const { bankId } = await params;
  const userId = getDefaultUserId();

  const bank = await prisma.wordBank.findUnique({
    where: { id: bankId },
  });

  if (!bank) notFound();

  const words = await prisma.word.findMany({
    where: { bankId },
    include: {
      userProgress: { where: { userId } },
    },
  });

  const wordItems = words.map((w) => ({
    id: w.id,
    word: w.word,
    phonetic: w.phonetic,
    partOfSpeech: w.partOfSpeech,
    definition: w.definition,
    definitionZh: w.definitionZh,
    status: w.userProgress[0]?.status || "new",
  }));

  return (
    <WordListClient
      bank={{
        id: bank.id,
        name: bank.name,
        description: bank.description,
        level: bank.level,
        category: bank.category,
      }}
      words={wordItems}
      levelLabel={getLevelLabel(bank.level)}
      levelColor={getLevelColor(bank.level)}
    />
  );
}
