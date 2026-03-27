"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getLevelLabelI18n } from "@/lib/i18n";
import { getLevelColor } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Clock,
  Target,
  Star,
  ChevronRight,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface QuizItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  level: string | null;
  questionCount: number;
  timeLimit: number | null;
  passingScore: number;
  bestPercentage: number | null;
}

interface AttemptItem {
  id: string;
  quizId: string;
  percentage: number;
  formattedDate: string;
  quizTitle: string;
  quizType: string;
  quizPassingScore: number;
}

interface QuizHubClientProps {
  placementQuiz: {
    title: string;
    description: string | null;
    questionCount: number;
    timeLimit: number | null;
  } | null;
  hasTakenPlacement: boolean;
  otherQuizzes: QuizItem[];
  recentAttempts: AttemptItem[];
  hasQuizzes: boolean;
}

const typeColors: Record<string, string> = {
  placement: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950",
  unit: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  review: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  "mock-exam": "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950",
};

function formatTimeLimit(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${Math.floor(seconds / 60)}m`;
}

export default function QuizHubClient({
  placementQuiz,
  hasTakenPlacement,
  otherQuizzes,
  recentAttempts,
  hasQuizzes,
}: QuizHubClientProps) {
  const { locale, t } = useLanguage();

  const typeLabels: Record<string, string> = {
    placement: t("quiz.typePlacement"),
    unit: t("quiz.typeUnit"),
    review: t("quiz.typeReview"),
    "mock-exam": t("quiz.typeMockExam"),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("quiz.title")}</h1>
        <p className="text-muted-foreground">{t("quiz.description")}</p>
      </div>

      {placementQuiz && !hasTakenPlacement && (
        <Link href="/quiz/placement">
          <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Badge className={typeColors.placement} variant="outline">
                    {t("quiz.recommended")}
                  </Badge>
                  <CardTitle className="text-xl">
                    {placementQuiz.title}
                  </CardTitle>
                  <CardDescription>
                    {placementQuiz.description || t("quiz.placementDefaultDesc")}
                  </CardDescription>
                </div>
                <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-900">
                  <Star className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Button className="gap-2 group-hover:gap-3 transition-all">
                {t("quiz.startPlacementTest")}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="ml-4 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  {t("quiz.questionCount", { count: placementQuiz.questionCount })}
                </span>
                {placementQuiz.timeLimit && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimeLimit(placementQuiz.timeLimit)}
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      )}

      {otherQuizzes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("quiz.availableQuizzes")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherQuizzes.map((quiz) => {
              const color = typeColors[quiz.type] ?? "";
              const label = typeLabels[quiz.type] ?? quiz.type;

              return (
                <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {quiz.title}
                        </CardTitle>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {quiz.description && (
                        <CardDescription className="line-clamp-2">
                          {quiz.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 pt-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={color} variant="outline">
                          {label}
                        </Badge>
                        {quiz.level && (
                          <Badge
                            className={getLevelColor(quiz.level)}
                            variant="outline"
                          >
                            {getLevelLabelI18n(quiz.level, locale)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          {t("quiz.questionCount", { count: quiz.questionCount })}
                        </span>
                        {quiz.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTimeLimit(quiz.timeLimit)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          {t("quiz.passScorePercent", { score: quiz.passingScore })}
                        </span>
                      </div>
                      {quiz.bestPercentage !== null && (
                        <Badge
                          variant="outline"
                          className={
                            quiz.bestPercentage >= quiz.passingScore
                              ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                              : "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                          }
                        >
                          <Trophy className="w-3 h-3 mr-1" />
                          {t("quiz.bestScorePercent", { score: quiz.bestPercentage })}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {!hasQuizzes && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardCheck className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("quiz.noQuizzes")}</h2>
          <p className="text-muted-foreground">{t("quiz.noQuizzesDesc")}</p>
        </div>
      )}

      {recentAttempts.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h2 className="text-xl font-semibold">{t("quiz.recentAttempts")}</h2>
          <div className="space-y-2">
            {recentAttempts.map((attempt) => {
              const passed = attempt.percentage >= attempt.quizPassingScore;
              const color = typeColors[attempt.quizType] ?? "";
              const label = typeLabels[attempt.quizType] ?? attempt.quizType;

              return (
                <Link key={attempt.id} href={`/quiz/${attempt.quizId}/result?attempt=${attempt.id}`}>
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {passed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {attempt.quizTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attempt.formattedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={color} variant="outline">
                          {label}
                        </Badge>
                        <span
                          className={`text-sm font-semibold ${
                            passed ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {attempt.percentage}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
