"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AddWordDialog } from "@/components/vocabulary/add-word-dialog";
import {
  BookMarked,
  ArrowLeft,
  Search,
  Trash2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface WordbookItem {
  id: string;
  word: string;
  phonetic: string | null;
  definition: string;
  definitionZh: string | null;
  partOfSpeech: string | null;
  source: string;
  sourceId: string | null;
  wordId: string | null;
  createdAt: string;
}

const SOURCE_COLORS: Record<string, string> = {
  reading: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  listening: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  chat: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  manual: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const SOURCE_LABEL_KEYS: Record<string, string> = {
  reading: "nav.reading",
  listening: "nav.listening",
  chat: "nav.aiChat",
  manual: "wordbook.addCustomWord",
};

export default function WordbookPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<WordbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/wordbook");
      const data = await res.json();
      setEntries(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await fetch(`/api/wordbook?id=${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // ignore
    } finally {
      setRemoving(null);
    }
  };

  const filtered = entries.filter((entry) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      entry.word.toLowerCase().includes(q) ||
      entry.definition.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vocabulary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6" />
            {t("wordbook.myWordbook")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {entries.length === 1
              ? t("wordbook.wordSaved")
              : t("wordbook.wordsSaved", { count: entries.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <Link href="/vocabulary/review?source=wordbook">
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t("wordbook.reviewWordbook")}
              </Button>
            </Link>
          )}
          <AddWordDialog onWordAdded={fetchEntries} />
        </div>
      </div>

      {entries.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("wordbook.searchWordbook")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {entries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookMarked className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("wordbook.empty")}</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t("wordbook.emptyDesc")}
          </p>
          <AddWordDialog onWordAdded={fetchEntries} />
        </div>
      )}

      {entries.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("wordbook.noMatch", { query: search })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <Card
              key={entry.id}
              className="hover:shadow-md transition-shadow group relative"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-lg">{entry.word}</span>
                    {entry.phonetic && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {entry.phonetic}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {entry.partOfSpeech && (
                      <Badge variant="secondary" className="text-xs">
                        {entry.partOfSpeech}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm line-clamp-2 mb-1">{entry.definition}</p>
                {entry.definitionZh && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {entry.definitionZh}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${SOURCE_COLORS[entry.source] ?? ""}`}
                    >
                      {SOURCE_LABEL_KEYS[entry.source]
                        ? t(SOURCE_LABEL_KEYS[entry.source] as Parameters<typeof t>[0])
                        : entry.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(entry.id)}
                    disabled={removing === entry.id}
                  >
                    {removing === entry.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
