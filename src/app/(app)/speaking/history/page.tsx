import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import {
  SpeakingHistoryClient,
  type RecordItem,
} from "@/components/speaking/speaking-history-client";

export default async function SpeakingHistoryPage() {
  const userId = getDefaultUserId();

  const records = await prisma.speakingRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      prompt: {
        select: {
          id: true,
          title: true,
          type: true,
          level: true,
        },
      },
    },
  });

  const serialized: RecordItem[] = records.map((r) => ({
    id: r.id,
    transcription: r.transcription,
    pronunciationScore: r.pronunciationScore,
    fluencyScore: r.fluencyScore,
    accuracyScore: r.accuracyScore,
    feedback: r.feedback,
    createdAt: r.createdAt.toISOString(),
    prompt: r.prompt
      ? {
          id: r.prompt.id,
          title: r.prompt.title,
          type: r.prompt.type,
          level: r.prompt.level,
        }
      : null,
  }));

  return <SpeakingHistoryClient records={serialized} />;
}
