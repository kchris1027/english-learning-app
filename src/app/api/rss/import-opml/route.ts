import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDefaultUserId } from "@/lib/auth";
import {
  parseOpml,
  fetchAndParseRss,
  extractPlainText,
  estimateReadingTime,
} from "@/lib/rss";

export async function POST(request: NextRequest) {
  try {
    const userId = getDefaultUserId();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const opmlText = formData.get("opml") as string | null;

    let xml: string;
    if (file) {
      xml = await file.text();
    } else if (opmlText) {
      xml = opmlText;
    } else {
      return NextResponse.json(
        { error: "No OPML file or text provided" },
        { status: 400 }
      );
    }

    const feeds = parseOpml(xml);
    if (feeds.length === 0) {
      return NextResponse.json(
        { error: "No valid feeds found in OPML file" },
        { status: 400 }
      );
    }

    const existingFeeds = await prisma.rssFeed.findMany({
      where: { userId },
      select: { url: true },
    });
    const existingUrls = new Set(existingFeeds.map((f) => f.url));

    const newFeeds = feeds.filter((f) => !existingUrls.has(f.xmlUrl));

    const results: {
      url: string;
      title: string;
      status: "added" | "skipped" | "failed";
      articleCount?: number;
      error?: string;
    }[] = [];

    for (const entry of feeds) {
      if (existingUrls.has(entry.xmlUrl)) {
        results.push({
          url: entry.xmlUrl,
          title: entry.title,
          status: "skipped",
        });
        continue;
      }

      try {
        const rssData = await fetchAndParseRss(entry.xmlUrl);

        const feed = await prisma.rssFeed.create({
          data: {
            userId,
            title: rssData.title || entry.title,
            url: entry.xmlUrl,
            siteUrl: rssData.link || entry.htmlUrl || null,
            description: rssData.description || null,
            imageUrl: rssData.image || null,
            category: entry.category || "rss",
            lastFetchedAt: new Date(),
          },
        });

        const recentItems = rssData.items.slice(0, 20);
        let articlesCreated = 0;

        if (recentItems.length > 0) {
          const articleData = recentItems.map((item) => {
            const plainText = extractPlainText(item.content);
            const { wordCount, estimatedTime } =
              estimateReadingTime(plainText);
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

        existingUrls.add(entry.xmlUrl);
        results.push({
          url: entry.xmlUrl,
          title: rssData.title || entry.title,
          status: "added",
          articleCount: articlesCreated,
        });
      } catch (err) {
        results.push({
          url: entry.xmlUrl,
          title: entry.title,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const added = results.filter((r) => r.status === "added").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({
      total: feeds.length,
      added,
      skipped,
      failed,
      results,
    });
  } catch (error) {
    console.error("Failed to import OPML:", error);
    const message =
      error instanceof Error ? error.message : "Failed to import OPML";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
