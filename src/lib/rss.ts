import Parser from "rss-parser";

export interface RssFeedResult {
  title: string;
  description?: string;
  link?: string;
  image?: string;
  items: RssItem[];
}

export interface RssItem {
  title: string;
  link: string;
  content: string;
  summary?: string;
  author?: string;
  publishedAt?: Date;
  imageUrl?: string;
}

export function sanitizeHtml(html: string): string {
  // strip HTML tags
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function extractPlainText(html: string): string {
  return sanitizeHtml(html);
}

export function estimateReadingTime(text: string): {
  wordCount: number;
  estimatedTime: number;
} {
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    wordCount: words,
    estimatedTime: Math.max(1, Math.ceil(words / 200)),
  };
}

export interface OpmlFeed {
  title: string;
  xmlUrl: string;
  htmlUrl?: string;
  category?: string;
}

export function parseOpml(xml: string): OpmlFeed[] {
  const feeds: OpmlFeed[] = [];
  const outlineRegex = /<outline\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = outlineRegex.exec(xml)) !== null) {
    const tag = match[0];
    const xmlUrl = extractAttr(tag, "xmlUrl") || extractAttr(tag, "xmlurl");
    if (!xmlUrl) continue;

    const title =
      extractAttr(tag, "title") ||
      extractAttr(tag, "text") ||
      "Untitled";
    const htmlUrl = extractAttr(tag, "htmlUrl") || extractAttr(tag, "htmlurl");

    let category = "rss";
    const parentMatch = xml.slice(0, match.index).match(/<outline[^>]*text="([^"]*)"[^>]*>\s*$/i);
    if (parentMatch) {
      category = parentMatch[1] || "rss";
    }

    feeds.push({ title, xmlUrl, htmlUrl, category });
  }

  return feeds;
}

function extractAttr(tag: string, attr: string): string | undefined {
  const regex = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, "i");
  const m = tag.match(regex);
  return m ? decodeXmlEntities(m[1]) : undefined;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

export async function fetchAndParseRss(url: string): Promise<RssFeedResult> {
  const parser = new Parser({
    headers: {
      "User-Agent": "EnglishLearningApp/1.0",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    timeout: 10000,
  });

  try {
    const feed = await parser.parseURL(url);

    return {
      title: feed.title || "Untitled Feed",
      description: feed.description,
      link: feed.link,
      image: feed.image?.url,
      items: (feed.items || []).map((item) => {
        const rawContent =
          (item as Record<string, string | undefined>)["content:encoded"] ||
          item.content ||
          item.contentSnippet ||
          item.summary ||
          "";
        const plainText = extractPlainText(
          typeof rawContent === "string" ? rawContent : String(rawContent),
        );
        const summary =
          plainText.slice(0, 300) + (plainText.length > 300 ? "..." : "");

        return {
          title: item.title || "Untitled",
          link: item.link || "",
          content: rawContent || plainText,
          summary,
          author: item.creator || (item as { author?: string }).author,
          publishedAt: item.isoDate
            ? new Date(item.isoDate)
            : item.pubDate
              ? new Date(item.pubDate)
              : undefined,
          imageUrl: item.enclosure?.url,
        };
      }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch or parse RSS from "${url}": ${message}`);
  }
}
