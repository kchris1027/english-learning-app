"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  GraduationCap,
  RotateCcw,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

interface ReviewItem {
  id: string;
  status: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: string | null;
  word: { word: string };
}

interface StatsClientProps {
  totalWords: number;
  totalLearning: number;
  totalMastered: number;
  dueForReview: number;
  recentReviews: ReviewItem[];
  masteryPct: number;
  learningPct: number;
  newPct: number;
  notStarted: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_KEYS: Record<string, TranslationKey> = {
  new: "vocab.new",
  learning: "vocab.learning",
  mastered: "vocab.mastered",
};

export function StatsClient({
  totalWords,
  totalLearning,
  totalMastered,
  dueForReview,
  recentReviews,
  masteryPct,
  learningPct,
  newPct,
  notStarted,
}: StatsClientProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/vocabulary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("vocab.statsTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("vocab.statsDescription")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vocab.totalWords")}</p>
                <p className="text-2xl font-bold">{totalWords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-950">
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vocab.learning")}</p>
                <p className="text-2xl font-bold">{totalLearning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vocab.mastered")}</p>
                <p className="text-2xl font-bold">{totalMastered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <RotateCcw className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("vocab.dueForReview")}</p>
                <p className="text-2xl font-bold">{dueForReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("vocab.masteryDistribution")}</CardTitle>
          <CardDescription>
            {t("vocab.masteryDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 w-full rounded-full overflow-hidden bg-secondary flex">
            {masteryPct > 0 && (
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${masteryPct}%` }}
              />
            )}
            {learningPct > 0 && (
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${learningPct}%` }}
              />
            )}
            {newPct > 0 && (
              <div
                className="h-full bg-gray-300 dark:bg-gray-600 transition-all duration-500"
                style={{ width: `${newPct}%` }}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span>
                {t("vocab.mastered")} ({totalMastered} &middot;{" "}
                {Math.round(masteryPct)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>
                {t("vocab.learning")} ({totalLearning} &middot;{" "}
                {Math.round(learningPct)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span>
                {t("vocab.notStarted")} ({notStarted} &middot;{" "}
                {Math.round(newPct)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("vocab.recentReviewActivity")}</CardTitle>
          <CardDescription>{t("vocab.latestReviews")}</CardDescription>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("vocab.noReviewsYet")}
            </p>
          ) : (
            <div className="space-y-1">
              {recentReviews.map((review, i) => (
                <div key={review.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{review.word.word}</span>
                      <Badge
                        variant={
                          review.status === "mastered"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {STATUS_KEYS[review.status] ? t(STATUS_KEYS[review.status]) : review.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {review.correctCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        {review.incorrectCount}
                      </span>
                      {review.lastReviewedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(review.lastReviewedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {i < recentReviews.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
