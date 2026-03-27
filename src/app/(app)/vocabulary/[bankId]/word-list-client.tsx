"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectOption } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

interface WordItem {
  id: string;
  word: string;
  phonetic: string | null;
  partOfSpeech: string;
  definition: string;
  definitionZh: string | null;
  status: string;
}

interface BankInfo {
  id: string;
  name: string;
  description: string | null;
  level: string;
  category: string;
}

interface WordListClientProps {
  bank: BankInfo;
  words: WordItem[];
  levelLabel: string;
  levelColor: string;
}

const STATUS_DOT: Record<string, string> = {
  new: "bg-gray-400",
  learning: "bg-yellow-400",
  mastered: "bg-green-500",
};

type FilterStatus = "all" | "new" | "learning" | "mastered";

const STATUS_KEYS: Record<string, TranslationKey> = {
  new: "vocab.new",
  learning: "vocab.learning",
  mastered: "vocab.mastered",
};

export function WordListClient({
  bank,
  words,
  levelLabel,
  levelColor,
}: WordListClientProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all" ? words : words.filter((w) => w.status === filter);

  const counts = {
    all: words.length,
    new: words.filter((w) => w.status === "new").length,
    learning: words.filter((w) => w.status === "learning").length,
    mastered: words.filter((w) => w.status === "mastered").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vocabulary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{bank.name}</h1>
            <Badge className={levelColor} variant="outline">
              {levelLabel}
            </Badge>
          </div>
          {bank.description && (
            <p className="text-muted-foreground mt-1">{bank.description}</p>
          )}
        </div>
        <Link href={`/vocabulary/learn?bankId=${bank.id}`}>
          <Button className="gap-2">
            <BookOpen className="w-4 h-4" />
            {t("vocab.learn")}
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterStatus)}
          className="w-40"
        >
          <SelectOption value="all">{t("common.all")} ({counts.all})</SelectOption>
          <SelectOption value="new">{t("vocab.new")} ({counts.new})</SelectOption>
          <SelectOption value="learning">
            {t("vocab.learning")} ({counts.learning})
          </SelectOption>
          <SelectOption value="mastered">
            {t("vocab.mastered")} ({counts.mastered})
          </SelectOption>
        </Select>
        <span className="text-sm text-muted-foreground">
          {t("vocab.showing", { count: filtered.length })}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t("vocab.noFilterMatch")}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((word) => (
            <Card
              key={word.id}
              className="hover:shadow-md transition-shadow group"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2.5 h-2.5 rounded-full shrink-0",
                        STATUS_DOT[word.status] ?? STATUS_DOT.new
                      )}
                      title={STATUS_KEYS[word.status] ? t(STATUS_KEYS[word.status]) : t("vocab.new")}
                    />
                    <span className="font-semibold text-lg">{word.word}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {word.partOfSpeech}
                  </Badge>
                </div>
                {word.phonetic && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {word.phonetic}
                  </p>
                )}
                <p className="text-sm line-clamp-2">{word.definition}</p>
                {word.definitionZh && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {word.definitionZh}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
