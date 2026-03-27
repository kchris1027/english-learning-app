import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(request: Request) {
  const userId = getDefaultUserId();
  const { searchParams } = new URL(request.url);
  const bankId = searchParams.get("bankId");
  const limit = parseInt(searchParams.get("limit") || "10");

  const words = await prisma.word.findMany({
    where: {
      ...(bankId ? { bankId } : {}),
      NOT: {
        userProgress: {
          some: { userId },
        },
      },
    },
    take: limit,
    include: {
      bank: { select: { name: true } },
    },
  });

  return NextResponse.json(words);
}
