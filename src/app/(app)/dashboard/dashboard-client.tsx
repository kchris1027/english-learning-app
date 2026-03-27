"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  MessageSquare,
  Mic,
  NotebookPen,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLevelColor } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

interface DashboardProps {
  userName: string;
  level: string;
  streak: number;
  longestStreak: number;
  todayXp: number;
  wordsLearned: number;
  wordsReviewed: number;
  totalMastered: number;
  totalGrammarCompleted: number;
  wordsDueForReview: number;
  recentWords: Array<{
    word: string;
    status: string;
    lastReviewed: string | null;
  }>;
}

const modules: { href: string; icon: typeof BookOpen; labelKey: TranslationKey; color: string; bg: string }[] = [
  { href: "/vocabulary", icon: BookOpen, labelKey: "nav.vocabulary", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  { href: "/grammar", icon: GraduationCap, labelKey: "nav.grammar", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  { href: "/reading", icon: NotebookPen, labelKey: "nav.reading", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
  { href: "/listening", icon: Headphones, labelKey: "nav.listening", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950" },
  { href: "/speaking", icon: Mic, labelKey: "nav.speaking", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950" },
  { href: "/chat", icon: MessageSquare, labelKey: "nav.aiChat", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950" },
  { href: "/quiz", icon: Trophy, labelKey: "nav.quiz", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
];

export function DashboardClient({
  userName,
  level,
  streak,
  longestStreak,
  todayXp,
  wordsLearned,
  wordsReviewed,
  totalMastered,
  totalGrammarCompleted,
  wordsDueForReview,
  recentWords,
}: DashboardProps) {
  const { t } = useLanguage();
  const dailyGoalXp = 100;
  const goalProgress = Math.min((todayXp / dailyGoalXp) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          {t("dashboard.welcome", { name: userName })}
        </h1>
        <div className="flex items-center gap-2">
          <Badge className={getLevelColor(level)}>{t(`common.${level}` as TranslationKey)}</Badge>
          <span className="text-sm text-muted-foreground">
            {t("dashboard.keepUp")}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.dayStreak")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayXp}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.xpToday")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalMastered}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.wordsMastered")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wordsDueForReview}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.dueReview")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("dashboard.dailyGoal")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{todayXp} / {dailyGoalXp} XP</span>
              <span className="text-muted-foreground">{Math.round(goalProgress)}%</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <div className="flex gap-4 text-xs text-muted-foreground pt-1">
              <span>{t("dashboard.wordsLearned")}: {wordsLearned}</span>
              <span>{t("dashboard.wordsReviewed")}: {wordsReviewed}</span>
              <span>{t("dashboard.longestStreak", { days: String(longestStreak) })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Modules */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t("dashboard.startLearning")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-xl ${mod.bg} group-hover:scale-110 transition-transform`}>
                    <mod.icon className={`h-6 w-6 ${mod.color}`} />
                  </div>
                  <span className="text-sm font-medium">{t(mod.labelKey)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("dashboard.recentWords")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentWords.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0 border-border"
                >
                  <span className="font-medium">{w.word}</span>
                  <Badge variant={w.status === "mastered" ? "default" : "secondary"}>
                    {w.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {wordsDueForReview > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{t("dashboard.reviewTime")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("dashboard.wordsForReview", { count: wordsDueForReview })}
                </p>
              </div>
              <Link href="/vocabulary/review">
                <Button>{t("dashboard.startReview")}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
