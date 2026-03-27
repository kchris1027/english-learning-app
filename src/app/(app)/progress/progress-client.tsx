"use client";

import {
  Flame,
  Trophy,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateLevel } from "@/lib/xp";
import { useLanguage } from "@/components/language-provider";

interface ProgressClientProps {
  weekData: Array<{ date: string; xp: number; wordsLearned: number; wordsReviewed: number }>;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  wordStats: Record<string, number>;
  grammarStats: Record<string, number>;
  todayXp: number;
  todayWordsLearned: number;
  todayWordsReviewed: number;
  todayGrammar: number;
}

export function ProgressClient({
  weekData,
  currentStreak,
  longestStreak,
  totalXp,
  wordStats,
  grammarStats,
  todayXp,
  todayWordsLearned,
  todayWordsReviewed,
  todayGrammar,
}: ProgressClientProps) {
  const { t } = useLanguage();
  const { level, progress, xpForNext } = calculateLevel(totalXp);
  const maxDailyXp = Math.max(...weekData.map((d) => d.xp), 1);
  const dailyGoal = 100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">{t("progress.title")}</h1>

      {/* Level & XP */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">Level {level}</span>
                <span className="text-sm text-muted-foreground">{totalXp} {t("progress.xpTotal")}</span>
              </div>
              <Progress value={progress} className="h-3 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{t("progress.xpToNext", { n: xpForNext })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">{t("progress.currentStreak")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("progress.best", { n: longestStreak })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{todayXp}</p>
            <p className="text-xs text-muted-foreground">{t("progress.xpToday")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{todayWordsLearned + todayWordsReviewed}</p>
            <p className="text-xs text-muted-foreground">{t("progress.wordsToday")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <GraduationCap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{todayGrammar}</p>
            <p className="text-xs text-muted-foreground">{t("progress.exercisesToday")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("progress.weeklyActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {weekData.map((day) => {
              const height = maxDailyXp > 0 ? (day.xp / maxDailyXp) * 100 : 0;
              const dayLabel = new Date(day.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" });
              const isToday = day.date === new Date().toISOString().split("T")[0];
              return (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs text-muted-foreground">{day.xp}</span>
                  <div className="w-full flex items-end" style={{ height: "120px" }}>
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isToday ? "bg-primary" : "bg-primary/40"
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary & Grammar Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("progress.vocabMastery")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatBar label={t("vocab.new")} count={wordStats["new"] || 0} color="bg-gray-400" />
              <StatBar label={t("vocab.learning")} count={wordStats["learning"] || 0} color="bg-yellow-500" />
              <StatBar label={t("vocab.mastered")} count={wordStats["mastered"] || 0} color="bg-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("progress.grammarProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatBar label={t("grammar.notStarted")} count={grammarStats["not_started"] || 0} color="bg-gray-400" />
              <StatBar label={t("grammar.inProgress")} count={grammarStats["in_progress"] || 0} color="bg-yellow-500" />
              <StatBar label={t("grammar.completed")} count={grammarStats["completed"] || 0} color="bg-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal */}
      <Card>
        <CardHeader>
            <CardTitle>{t("dashboard.dailyGoal")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{todayXp} / {dailyGoal} XP</span>
              <span className="text-muted-foreground">{Math.min(Math.round((todayXp / dailyGoal) * 100), 100)}%</span>
            </div>
            <Progress value={Math.min((todayXp / dailyGoal) * 100, 100)} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBar({ label, count, color }: { label: string; count: number; color: string }) {
  const maxWidth = 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-24 text-muted-foreground">{label}</span>
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: count > 0 ? `${Math.max((count / 60) * maxWidth, 8)}%` : "0%" }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">{count}</span>
    </div>
  );
}
