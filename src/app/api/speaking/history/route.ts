import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET() {
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
          referenceText: true,
        },
      },
    },
  });

  return NextResponse.json(records);
}
