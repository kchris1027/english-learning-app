import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = getDefaultUserId();
    const { searchParams } = new URL(request.url);

    const feedId = searchParams.get("feedId");
    const starred = searchParams.get("starred");
    const unread = searchParams.get("unread");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = 20;

    const userFeedIds = (
      await prisma.rssFeed.findMany({
        where: { userId },
        select: { id: true },
      })
    ).map((f) => f.id);

    const where: Record<string, unknown> = {
      feedId: { in: feedId ? [feedId] : userFeedIds },
    };

    if (starred === "true") where.isStarred = true;
    if (unread === "true") where.isRead = false;
    if (search) where.title = { contains: search };

    const [articles, total] = await Promise.all([
      prisma.rssArticle.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          feed: { select: { id: true, title: true } },
        },
      }),
      prisma.rssArticle.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
