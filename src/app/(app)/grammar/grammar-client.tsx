"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

interface TopicItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  exerciseCount: number;
  progressStatus: string | null;
  progressScore: number | null;
}

interface GrammarClientProps {
  topics: TopicItem[];
  completedTopics: number;
  totalTopics: number;
  overallProgress: number;
}

const LEVEL_ICONS: Record<string, string> = {
  beginner: "🟢",
  intermediate: "🔵",
  advanced: "🟣",
};

const LEVEL_KEYS: Record<string, TranslationKey> = {
  beginner: "common.beginner",
  intermediate: "common.intermediate",
  advanced: "common.advanced",
};

export function GrammarClient({
  topics,
  completedTopics,
  totalTopics,
  overallProgress,
}: GrammarClientProps) {
  const { t } = useLanguage();

  const grouped = {
    beginner: topics.filter((tp) => tp.level === "beginner"),
    intermediate: topics.filter((tp) => tp.level === "intermediate"),
    advanced: topics.filter((tp) => tp.level === "advanced"),
  };

  const levels = ["beginner", "intermediate", "advanced"] as const;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("grammar.title")}</h1>
          <p className="text-muted-foreground">
            {t("grammar.description")}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>
            {t("grammar.completedCount", { completed: completedTopics, total: totalTopics })}
          </span>
        </div>
      </div>

      {totalTopics > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("grammar.overallProgress")}</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      )}

      {levels.map((key) => {
        const levelTopics = grouped[key];
        if (levelTopics.length === 0) return null;

        return (
          <section key={key} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span>{LEVEL_ICONS[key]}</span>
              {t(LEVEL_KEYS[key])}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {levelTopics.map((topic) => {
                const isCompleted = topic.progressStatus === "completed";
                const isInProgress = topic.progressStatus === "in_progress";

                return (
                  <Link key={topic.id} href={`/grammar/${topic.slug}`}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {topic.title}
                          </CardTitle>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        {topic.description && (
                          <CardDescription className="line-clamp-2">
                            {topic.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="flex-1 pt-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={getLevelColor(topic.level)}
                            variant="outline"
                          >
                            {t(`common.${topic.level}` as TranslationKey)}
                          </Badge>
                          <Badge variant="secondary">
                            {t("grammar.exerciseCount", { count: topic.exerciseCount })}
                          </Badge>
                          {isCompleted && topic.progressScore != null && (
                            <Badge
                              variant="outline"
                              className="text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                            >
                              {t("grammar.scorePercent", { score: topic.progressScore })}
                            </Badge>
                          )}
                          {isInProgress && (
                            <Badge
                              variant="outline"
                              className="text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                            >
                              {t("grammar.inProgress")}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {totalTopics === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("grammar.noTopics")}</h2>
          <p className="text-muted-foreground">
            {t("grammar.noTopicsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
