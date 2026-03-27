import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import {
  fetchAndParseRss,
  extractPlainText,
  estimateReadingTime,
} from "@/lib/rss";

export async function POST(
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

    const rssData = await fetchAndParseRss(feed.url);

    const existingLinks = new Set(
      (
        await prisma.rssArticle.findMany({
          where: { feedId },
          select: { link: true },
        })
      ).map((a) => a.link)
    );

    const newItems = rssData.items.filter(
      (item) => item.link && !existingLinks.has(item.link)
    );

    if (newItems.length > 0) {
      const articleData = newItems.map((item) => {
        const plainText = extractPlainText(item.content);
        const { wordCount, estimatedTime } = estimateReadingTime(plainText);
        return {
          feedId,
          title: item.title,
          link: item.link,
          content: item.content,
          summary: item.summary || null,
          author: item.author || null,
          publishedAt: item.publishedAt || null,
          imageUrl: item.imageUrl || null,
          wordCount,
          estimatedTime,
        };
      });

      await prisma.rssArticle.createMany({ data: articleData });
    }

    await prisma.rssFeed.update({
      where: { id: feedId },
      data: {
        lastFetchedAt: new Date(),
        title: rssData.title,
        description: rssData.description || undefined,
        siteUrl: rssData.link || undefined,
        imageUrl: rssData.image || undefined,
      },
    });

    return NextResponse.json({ newArticles: newItems.length });
  } catch (error) {
    console.error("Failed to refresh feed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to refresh feed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
