import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import {
  fetchAndParseRss,
  extractPlainText,
  estimateReadingTime,
} from "@/lib/rss";

export async function GET() {
  try {
    const userId = getDefaultUserId();

    const feeds = await prisma.rssFeed.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { articles: true } },
      },
    });

    const feedsWithUnread = await Promise.all(
      feeds.map(async (feed) => {
        const unreadCount = await prisma.rssArticle.count({
          where: { feedId: feed.id, isRead: false },
        });
        return {
          ...feed,
          unreadCount,
        };
      })
    );

    return NextResponse.json(feedsWithUnread);
  } catch (error) {
    console.error("Failed to fetch feeds:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getDefaultUserId();
    const body = await request.json();
    const { url, category } = body as { url: string; category?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL is required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const existing = await prisma.rssFeed.findUnique({
      where: { userId_url: { userId, url: parsedUrl.href } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already added this feed" },
        { status: 409 }
      );
    }

    const rssData = await fetchAndParseRss(parsedUrl.href);

    const feed = await prisma.rssFeed.create({
      data: {
        userId,
        title: rssData.title,
        url: parsedUrl.href,
        siteUrl: rssData.link || null,
        description: rssData.description || null,
        imageUrl: rssData.image || null,
        category: category || "rss",
        lastFetchedAt: new Date(),
      },
    });

    const recentItems = rssData.items.slice(0, 20);
    let articlesCreated = 0;

    if (recentItems.length > 0) {
      const articleData = recentItems.map((item) => {
        const plainText = extractPlainText(item.content);
        const { wordCount, estimatedTime } = estimateReadingTime(plainText);
        return {
          feedId: feed.id,
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
      articlesCreated = articleData.length;
    }

    return NextResponse.json(
      { ...feed, articleCount: articlesCreated },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add feed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to add feed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
