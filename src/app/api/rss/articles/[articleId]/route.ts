import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const userId = getDefaultUserId();
    const body = await request.json();
    const { isRead, isStarred } = body as {
      isRead?: boolean;
      isStarred?: boolean;
    };

    const article = await prisma.rssArticle.findUnique({
      where: { id: articleId },
      include: { feed: { select: { userId: true } } },
    });

    if (!article || article.feed.userId !== userId) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const data: Record<string, boolean> = {};
    if (isRead !== undefined) data.isRead = isRead;
    if (isStarred !== undefined) data.isStarred = isStarred;

    const updated = await prisma.rssArticle.update({
      where: { id: articleId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}
