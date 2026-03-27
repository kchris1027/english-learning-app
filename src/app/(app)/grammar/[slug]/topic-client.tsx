"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  PlayCircle,
  Lightbulb,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

interface TopicClientProps {
  slug: string;
  title: string;
  description: string | null;
  level: string;
  exerciseCount: number;
  lessonHtml: string;
  tipsHtml: string | null;
  progress: {
    score: number | null;
    attempts: number;
    status: string;
  } | null;
}

export function TopicClient({
  slug,
  title,
  description,
  level,
  exerciseCount,
  lessonHtml,
  tipsHtml,
  progress,
}: TopicClientProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/grammar">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge className={getLevelColor(level)} variant="outline">
          {t(`common.${level}` as TranslationKey)}
        </Badge>
        <Badge variant="secondary">
          {t("grammar.exerciseCount", { count: exerciseCount })}
        </Badge>
      </div>

      {progress && progress.attempts > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t("grammar.yourProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm">
              {progress.score != null && (
                <div>
                  <span className="text-muted-foreground">{t("grammar.bestScore")}</span>
                  <p className="text-lg font-semibold">{progress.score}%</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">{t("grammar.attempts")}</span>
                <p className="text-lg font-semibold">{progress.attempts}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("grammar.status")}</span>
                <p className="text-lg font-semibold capitalize">
                  {progress.status === "completed"
                    ? t("grammar.completed")
                    : progress.status === "in_progress"
                      ? t("grammar.inProgress")
                      : t("grammar.notStarted")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: lessonHtml }}
      />

      {tipsHtml && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {t("grammar.tips")}
            </h2>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: tipsHtml }}
            />
          </div>
        </>
      )}

      <Separator />

      <div className="flex flex-wrap gap-3">
        <Link href={`/grammar/${slug}/practice`}>
          <Button className="gap-2" size="lg">
            <PlayCircle className="w-5 h-5" />
            {progress && progress.attempts > 0
              ? t("grammar.practiceAgain")
              : t("grammar.startPractice")}
          </Button>
        </Link>
        {progress && progress.attempts > 0 && (
          <Link href={`/grammar/${slug}/practice`}>
            <Button variant="outline" className="gap-2" size="lg">
              <RotateCcw className="w-5 h-5" />
              {t("grammar.retryBetter")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
