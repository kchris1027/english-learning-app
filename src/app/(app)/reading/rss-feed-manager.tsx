"use client";

import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Rss,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Star,
  StarOff,
  BookOpen,
  Clock,
  Eye,
  EyeOff,
  ChevronLeft,
  Loader2,
  X,
  Upload,
  FileUp,
  CheckCircle2,
  XCircle,
  SkipForward,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/rss";

interface RssFeed {
  id: string;
  title: string;
  url: string;
  siteUrl: string | null;
  description: string | null;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
  lastFetchedAt: string | null;
  _count: { articles: number };
  unreadCount: number;
}

interface RssArticle {
  id: string;
  feedId: string;
  title: string;
  link: string;
  content: string;
  summary: string | null;
  author: string | null;
  publishedAt: string | null;
  imageUrl: string | null;
  wordCount: number;
  estimatedTime: number;
  isRead: boolean;
  isStarred: boolean;
  feed?: { id: string; title: string };
}

const SUGGESTED_FEEDS = [
  {
    name: "BBC Learning English",
    url: "http://www.bbc.co.uk/learningenglish/english/rss",
    category: "learning",
  },
  {
    name: "VOA Learning English",
    url: "https://learningenglish.voanews.com/api/zq_orevmqt",
    category: "news",
  },
  {
    name: "The Guardian - World",
    url: "https://www.theguardian.com/world/rss",
    category: "news",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "technology",
  },
  {
    name: "Hacker News (Best)",
    url: "https://hnrss.org/best",
    category: "technology",
  },
  {
    name: "NPR News",
    url: "https://feeds.npr.org/1001/rss.xml",
    category: "news",
  },
];

type View = "feeds" | "articles" | "reader";

export function RssFeedManager() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("feeds");
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [articles, setArticles] = useState<RssArticle[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<RssFeed | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<RssArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingFeed, setAddingFeed] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedUrl, setFeedUrl] = useState("");
  const [feedCategory, setFeedCategory] = useState("rss");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesTotalPages, setArticlesTotalPages] = useState(1);
  const [showOpmlImport, setShowOpmlImport] = useState(false);
  const [opmlImporting, setOpmlImporting] = useState(false);
  const [opmlResults, setOpmlResults] = useState<{
    total: number;
    added: number;
    skipped: number;
    failed: number;
    results: { url: string; title: string; status: string; error?: string }[];
  } | null>(null);
  const [opmlDragging, setOpmlDragging] = useState(false);

  const fetchFeeds = useCallback(async () => {
    try {
      const res = await fetch("/api/rss/feeds");
      if (res.ok) {
        const data = await res.json();
        setFeeds(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const fetchArticles = useCallback(
    async (feedId?: string, page = 1) => {
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (feedId) params.set("feedId", feedId);
        if (filter === "unread") params.set("unread", "true");
        if (filter === "starred") params.set("starred", "true");

        const res = await fetch(`/api/rss/articles?${params}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles);
          setArticlesPage(data.pagination.page);
          setArticlesTotalPages(data.pagination.totalPages);
        }
      } catch {
        // ignore
      }
    },
    [filter]
  );

  const handleAddFeed = async () => {
    if (!feedUrl.trim()) return;
    setAddingFeed(true);
    setError("");

    try {
      const res = await fetch("/api/rss/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: feedUrl.trim(), category: feedCategory }),
      });

      if (res.ok) {
        setFeedUrl("");
        setFeedCategory("rss");
        setShowAddForm(false);
        await fetchFeeds();
      } else {
        const data = await res.json();
        setError(data.error || t("reading.feedError"));
      }
    } catch {
      setError(t("reading.feedError"));
    } finally {
      setAddingFeed(false);
    }
  };

  const handleOpmlImport = async (file: File) => {
    setOpmlImporting(true);
    setOpmlResults(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/rss/import-opml", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setOpmlResults(data);
        await fetchFeeds();
      } else {
        setOpmlResults({
          total: 0,
          added: 0,
          skipped: 0,
          failed: 0,
          results: [
            {
              url: "",
              title: data.error || "Import failed",
              status: "failed",
              error: data.error,
            },
          ],
        });
      }
    } catch {
      setOpmlResults({
        total: 0,
        added: 0,
        skipped: 0,
        failed: 0,
        results: [
          {
            url: "",
            title: "Import failed",
            status: "failed",
            error: "Network error",
          },
        ],
      });
    } finally {
      setOpmlImporting(false);
    }
  };

  const handleOpmlFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleOpmlImport(file);
  };

  const handleOpmlDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setOpmlDragging(false);
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.name.endsWith(".opml") ||
        file.name.endsWith(".xml") ||
        file.type.includes("xml"))
    ) {
      handleOpmlImport(file);
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm(t("reading.unsubscribeConfirm"))) return;

    try {
      const res = await fetch(`/api/rss/feeds/${feedId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFeeds((prev) => prev.filter((f) => f.id !== feedId));
        if (selectedFeed?.id === feedId) {
          setSelectedFeed(null);
          setView("feeds");
        }
      }
    } catch {
      // ignore
    }
  };

  const handleRefreshFeed = async (feedId: string) => {
    setRefreshingId(feedId);
    try {
      await fetch(`/api/rss/feeds/${feedId}/refresh`, { method: "POST" });
      await fetchFeeds();
      if (selectedFeed?.id === feedId) {
        await fetchArticles(feedId, 1);
      }
    } catch {
      // ignore
    } finally {
      setRefreshingId(null);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshingId("all");
    try {
      await Promise.all(
        feeds.map((f) =>
          fetch(`/api/rss/feeds/${f.id}/refresh`, { method: "POST" })
        )
      );
      await fetchFeeds();
    } catch {
      // ignore
    } finally {
      setRefreshingId(null);
    }
  };

  const handleToggleRead = async (article: RssArticle) => {
    try {
      const res = await fetch(`/api/rss/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !article.isRead }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, isRead: !a.isRead } : a
          )
        );
        if (selectedArticle?.id === article.id) {
          setSelectedArticle({ ...article, isRead: !article.isRead });
        }
      }
    } catch {
      // ignore
    }
  };

  const handleToggleStar = async (article: RssArticle) => {
    try {
      const res = await fetch(`/api/rss/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !article.isStarred }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, isStarred: !a.isStarred } : a
          )
        );
        if (selectedArticle?.id === article.id) {
          setSelectedArticle({ ...article, isStarred: !article.isStarred });
        }
      }
    } catch {
      // ignore
    }
  };

  const openFeed = async (feed: RssFeed) => {
    setSelectedFeed(feed);
    setView("articles");
    setArticlesPage(1);
    await fetchArticles(feed.id, 1);
  };

  const openAllArticles = async () => {
    setSelectedFeed(null);
    setView("articles");
    setArticlesPage(1);
    await fetchArticles(undefined, 1);
  };

  const openArticle = async (article: RssArticle) => {
    setSelectedArticle(article);
    setView("reader");
    if (!article.isRead) {
      await handleToggleRead(article);
    }
  };

  const addSuggestedFeed = (url: string, category: string) => {
    setFeedUrl(url);
    setFeedCategory(category);
    setShowAddForm(true);
  };

  useEffect(() => {
    if (view === "articles") {
      fetchArticles(selectedFeed?.id, articlesPage);
    }
  }, [filter, view, selectedFeed, articlesPage, fetchArticles]);

  if (view === "reader" && selectedArticle) {
    return (
      <RssArticleReader
        article={selectedArticle}
        onBack={() => setView("articles")}
        onToggleStar={() => handleToggleStar(selectedArticle)}
        onToggleRead={() => handleToggleRead(selectedArticle)}
        t={t}
      />
    );
  }

  if (view === "articles") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("feeds")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {selectedFeed?.title || t("reading.allRssArticles")}
            </h2>
            {selectedFeed?.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {selectedFeed.description}
              </p>
            )}
          </div>
          {selectedFeed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRefreshFeed(selectedFeed.id)}
              disabled={refreshingId === selectedFeed.id}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${
                  refreshingId === selectedFeed.id ? "animate-spin" : ""
                }`}
              />
              {t("reading.refreshFeed")}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {(["all", "unread", "starred"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter(f);
                setArticlesPage(1);
              }}
            >
              {f === "all"
                ? t("reading.allRssArticles")
                : f === "unread"
                  ? t("reading.unread")
                  : t("reading.starred")}
            </Button>
          ))}
        </div>

        {articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article) => (
              <Card
                key={article.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  article.isRead ? "opacity-70" : ""
                }`}
                onClick={() => openArticle(article)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!article.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <h3
                          className={`text-sm font-medium line-clamp-2 ${
                            article.isRead
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {article.title}
                        </h3>
                      </div>
                      {article.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {sanitizeHtml(article.summary)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {article.feed && (
                          <span className="font-medium">
                            {article.feed.title}
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                        <span>{article.wordCount} words</span>
                        <span>{article.estimatedTime} min</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(article);
                        }}
                      >
                        {article.isStarred ? (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {articlesTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articlesPage <= 1}
                  onClick={() => setArticlesPage((p) => p - 1)}
                >
                  {t("common.previous")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {articlesPage} / {articlesTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={articlesPage >= articlesTotalPages}
                  onClick={() => setArticlesPage((p) => p + 1)}
                >
                  {t("common.next")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Rss className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t("reading.rssNoArticles")}</p>
          </div>
        )}
      </div>
    );
  }

  // feeds list view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {t("reading.rssDescription")}
          </p>
        </div>
        <div className="flex gap-2">
          {feeds.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openAllArticles}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                {t("reading.allRssArticles")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAll}
                disabled={refreshingId === "all"}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${
                    refreshingId === "all" ? "animate-spin" : ""
                  }`}
                />
                {t("reading.refreshAll")}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowOpmlImport(!showOpmlImport);
              setOpmlResults(null);
            }}
          >
            <Upload className="w-4 h-4 mr-1" />
            {t("reading.importOpml")}
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-1" />
            {t("reading.addFeed")}
          </Button>
        </div>
      </div>

      {showOpmlImport && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileUp className="w-4 h-4" />
                {t("reading.importOpml")}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setShowOpmlImport(false);
                  setOpmlResults(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>{t("reading.importOpmlDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opmlImporting ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("reading.importing")}
                </p>
              </div>
            ) : opmlResults ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {t("reading.importComplete")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("reading.importResult", {
                    added: opmlResults.added,
                    skipped: opmlResults.skipped,
                    failed: opmlResults.failed,
                  })}
                </p>
                {opmlResults.results.length > 0 && (
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border rounded-md p-3">
                    {opmlResults.results.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs"
                      >
                        {r.status === "added" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : r.status === "skipped" ? (
                          <SkipForward className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                        )}
                        <span className="truncate flex-1" title={r.url}>
                          {r.title}
                        </span>
                        <Badge
                          variant={
                            r.status === "added"
                              ? "default"
                              : r.status === "skipped"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs shrink-0"
                        >
                          {r.status === "added"
                            ? t("reading.importAdded")
                            : r.status === "skipped"
                              ? t("reading.importSkipped")
                              : t("reading.importFailed")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpmlResults(null);
                  }}
                >
                  {t("reading.importOpmlFile")}
                </Button>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  opmlDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOpmlDragging(true);
                }}
                onDragLeave={() => setOpmlDragging(false)}
                onDrop={handleOpmlDrop}
              >
                <input
                  type="file"
                  accept=".opml,.xml,application/xml,text/xml"
                  onChange={handleOpmlFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">
                  {t("reading.importOpmlDragDrop")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("reading.importOpmlFormats")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {t("reading.addRssFeed")}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setShowAddForm(false);
                  setError("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">
                {t("reading.feedUrl")}
              </label>
              <Input
                placeholder={t("reading.feedUrlPlaceholder")}
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFeed()}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("reading.feedCategory")}
              </label>
              <Input
                placeholder="e.g. news, technology, learning"
                value={feedCategory}
                onChange={(e) => setFeedCategory(e.target.value)}
                className="mt-1"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              onClick={handleAddFeed}
              disabled={addingFeed || !feedUrl.trim()}
              className="w-full"
            >
              {addingFeed ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  {t("reading.subscribing")}
                </>
              ) : (
                <>
                  <Rss className="w-4 h-4 mr-1" />
                  {t("reading.subscribe")}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : feeds.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feeds.map((feed) => (
            <Card
              key={feed.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => openFeed(feed)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Rss className="w-4 h-4 text-orange-500 shrink-0" />
                    <CardTitle className="text-sm line-clamp-1">
                      {feed.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefreshFeed(feed.id);
                      }}
                      disabled={refreshingId === feed.id}
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          refreshingId === feed.id ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFeed(feed.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {feed.description && (
                  <CardDescription className="line-clamp-2 text-xs">
                    {feed.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {feed.category}
                  </Badge>
                  <span>
                    {t("reading.feedArticleCount", {
                      count: feed._count.articles,
                    })}
                  </span>
                  {feed.unreadCount > 0 && (
                    <Badge variant="default" className="text-xs">
                      {t("reading.unreadCount", {
                        count: feed.unreadCount,
                      })}
                    </Badge>
                  )}
                </div>
                {feed.lastFetchedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("reading.lastUpdated", {
                      time: new Date(feed.lastFetchedAt).toLocaleDateString(),
                    })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Rss className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("reading.rssEmpty")}</h2>
            <p className="text-muted-foreground max-w-md">
              {t("reading.rssEmptyDesc")}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("reading.suggestedFeeds")}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SUGGESTED_FEEDS.map((sf) => (
                <Card key={sf.url} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium">{sf.name}</h4>
                        <Badge
                          variant="secondary"
                          className="text-xs mt-1"
                        >
                          {sf.category}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestedFeed(sf.url, sf.category)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        {t("reading.subscribe")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RssArticleReader({
  article,
  onBack,
  onToggleStar,
  onToggleRead,
  t,
}: {
  article: RssArticle;
  onBack: () => void;
  onToggleStar: () => void;
  onToggleRead: () => void;
  t: (key: string, vars?: Record<string, unknown>) => string;
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight line-clamp-3">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {article.author && (
          <span className="text-sm text-muted-foreground">
            {article.author}
          </span>
        )}
        {article.publishedAt && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(article.publishedAt).toLocaleDateString()}
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {article.wordCount} words
        </span>
        <span className="text-sm text-muted-foreground">
          ~{article.estimatedTime} min
        </span>
        {article.feed && (
          <Badge variant="secondary">{article.feed.title}</Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onToggleStar}>
          {article.isStarred ? (
            <>
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
              {t("reading.unstarArticle")}
            </>
          ) : (
            <>
              <StarOff className="w-4 h-4 mr-1" />
              {t("reading.starArticle")}
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onToggleRead}>
          {article.isRead ? (
            <>
              <EyeOff className="w-4 h-4 mr-1" />
              {t("reading.markAsUnread")}
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              {t("reading.markAsRead")}
            </>
          )}
        </Button>
        {article.link && (
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              {t("reading.openOriginal")}
            </Button>
          </a>
        )}
      </div>

      <Separator />

      <article
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
