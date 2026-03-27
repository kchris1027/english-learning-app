import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feedId: string }> }
) {
  try {
    const { feedId } = await params;
    const userId = getDefaultUserId();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = 20;

    const feed = await prisma.rssFeed.findFirst({
      where: { id: feedId, userId },
    });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const [articles, totalArticles] = await Promise.all([
      prisma.rssArticle.findMany({
        where: { feedId },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.rssArticle.count({ where: { feedId } }),
    ]);

    return NextResponse.json({
      ...feed,
      articles,
      pagination: {
        page,
        pageSize,
        totalArticles,
        totalPages: Math.ceil(totalArticles / pageSize),
      },
    });
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ feedId: string }> }
) {
  try {
    const { feedId } = await params;
    const userId = getDefaultUserId();
    const body = await request.json();
    const { category, isActive } = body as {
      category?: string;
      isActive?: boolean;
    };

    const feed = await prisma.rssFeed.findFirst({
      where: { id: feedId, userId },
    });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (category !== undefined) data.category = category;
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.rssFeed.update({
      where: { id: feedId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update feed:", error);
    return NextResponse.json(
      { error: "Failed to update feed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ feedId: string }> }
) {
  try {
    const { feedId } = await params;
    const userId = getDefaultUserId();

    const feed = await prisma.rssFeed.findFirst({
      where: { id: feedId, userId },
    });

    if (!feed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    await prisma.rssArticle.deleteMany({ where: { feedId } });
    await prisma.rssFeed.delete({ where: { id: feedId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete feed:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}
