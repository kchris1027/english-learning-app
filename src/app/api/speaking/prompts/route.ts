import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const level = searchParams.get("level");

  const where: Record<string, string> = {};
  if (type) where.type = type;
  if (level) where.level = level;

  const prompts = await prisma.speakingPrompt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { records: true } },
    },
  });

  return NextResponse.json(prompts);
}
