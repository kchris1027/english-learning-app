"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { BookOpen, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ReadingClient } from "./reading-client";
import { RssFeedManager } from "./rss-feed-manager";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  level: string;
  category: string;
  wordCount: number;
  estimatedTime: number;
  questionCount: number;
  status: string;
  score: number | null;
}

interface ReadingPageClientProps {
  articles: ArticleItem[];
  categories: string[];
  totalArticles: number;
  initialTab: "library" | "rss";
  rssFeedCount: number;
}

export function ReadingPageClient({
  articles,
  categories,
  totalArticles,
  initialTab,
  rssFeedCount,
}: ReadingPageClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"library" | "rss">(initialTab);

  const switchTab = (tab: "library" | "rss") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "rss") {
      params.set("tab", "rss");
    } else {
      params.delete("tab");
    }
    router.push(`/reading?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("reading.title")}
          </h1>
          <p className="text-muted-foreground">{t("reading.description")}</p>
        </div>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => switchTab("library")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "library"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          )}
        >
          <BookOpen className="w-4 h-4" />
          {t("reading.tab.library")}
          <Badge variant="secondary" className="text-xs ml-1">
            {totalArticles}
          </Badge>
        </button>
        <button
          onClick={() => switchTab("rss")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "rss"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
          )}
        >
          <Rss className="w-4 h-4" />
          {t("reading.tab.rss")}
          {rssFeedCount > 0 && (
            <Badge variant="secondary" className="text-xs ml-1">
              {rssFeedCount}
            </Badge>
          )}
        </button>
      </div>

      {activeTab === "library" ? (
        <ReadingClient
          articles={articles}
          categories={categories}
          totalArticles={totalArticles}
        />
      ) : (
        <RssFeedManager />
      )}
    </div>
  );
}
