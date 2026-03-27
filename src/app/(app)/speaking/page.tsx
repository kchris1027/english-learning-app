import { prisma } from "@/lib/db";
import {
  SpeakingPageClient,
  type PromptItem,
} from "@/components/speaking/speaking-page-client";

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function SpeakingPage({ searchParams }: Props) {
  const params = await searchParams;
  const typeFilter = params.type;

  const where: Record<string, string> = {};
  if (typeFilter) where.type = typeFilter;

  const prompts = await prisma.speakingPrompt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { records: true } },
    },
  });

  const serialized: PromptItem[] = prompts.map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    level: p.level,
    category: p.category,
    recordCount: p._count.records,
  }));

  return <SpeakingPageClient prompts={serialized} typeFilter={typeFilter} />;
}
