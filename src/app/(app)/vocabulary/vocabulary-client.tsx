"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, RotateCcw, BarChart3, GraduationCap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

interface BankStat {
  id: string;
  name: string;
  description: string | null;
  level: string;
  category: string;
  totalWords: number;
  learned: number;
  mastered: number;
  progressPct: number;
}

interface VocabularyClientProps {
  bankStats: BankStat[];
  totalDueForReview: number;
}

export function VocabularyClient({ bankStats, totalDueForReview }: VocabularyClientProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("nav.vocabulary")}</h1>
          <p className="text-muted-foreground">
            {t("vocab.description")}
          </p>
        </div>
        <div className="flex gap-2">
          {totalDueForReview > 0 && (
            <Link href="/vocabulary/review">
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {t("vocab.reviewCount", { count: totalDueForReview })}
              </Button>
            </Link>
          )}
          <Link href="/vocabulary/stats">
            <Button variant="ghost" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {t("vocab.stats")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bankStats.map((bank) => (
          <Card
            key={bank.id}
            className="flex flex-col hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{bank.name}</CardTitle>
                <GraduationCap className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
              </div>
              {bank.description && (
                <CardDescription className="line-clamp-2">
                  {bank.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getLevelColor(bank.level)} variant="outline">
                  {t(`common.${bank.level}` as TranslationKey)}
                </Badge>
                <Badge variant="secondary">{bank.category}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("vocab.progress")}</span>
                  <span className="font-medium">
                    {bank.learned} / {bank.totalWords}
                  </span>
                </div>
                <Progress value={bank.progressPct} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("vocab.masteredCount", { count: bank.mastered })}</span>
                  <span>{t("vocab.remaining", { count: bank.totalWords - bank.learned })}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="gap-2 pt-2">
              <Link href={`/vocabulary/learn?bankId=${bank.id}`} className="flex-1">
                <Button className="w-full gap-2" size="sm">
                  <BookOpen className="w-4 h-4" />
                  {t("vocab.startLearning")}
                </Button>
              </Link>
              <Link href={`/vocabulary/${bank.id}`}>
                <Button variant="outline" size="sm">
                  {t("vocab.browse")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
