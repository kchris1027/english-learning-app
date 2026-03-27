"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getLevelLabelI18n } from "@/lib/i18n";
import { cn, getLevelColor } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

interface QuestionData {
  id: string;
  module: string;
  type: string;
  question: string;
  options: string[] | null;
  answer: string;
  explanation: string | null;
}

interface GradedAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizResultClientProps {
  quizId: string;
  quizTitle: string;
  passingScore: number;
  percentage: number;
  score: number;
  totalPoints: number;
  timeSpentSec: number | null;
  passed: boolean;
  isPlacement: boolean;
  determinedLevel: string | null;
  questions: QuestionData[];
  gradedAnswers: GradedAnswer[];
}

export default function QuizResultClient({
  quizId,
  quizTitle,
  passingScore,
  percentage,
  score,
  totalPoints,
  timeSpentSec,
  passed,
  isPlacement,
  determinedLevel,
  questions,
  gradedAnswers,
}: QuizResultClientProps) {
  const { locale, t } = useLanguage();

  const answerMap = new Map(gradedAnswers.map((a) => [a.questionId, a]));

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card
        className={cn(
          "border-2",
          passed
            ? "border-green-200 dark:border-green-800"
            : "border-red-200 dark:border-red-800"
        )}
      >
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            {passed ? (
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
                <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">{quizTitle}</CardTitle>
          <CardDescription>
            {passed ? t("quiz.congratsPassed") : t("quiz.keepPracticing")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{percentage}%</p>
              <p className="text-xs text-muted-foreground">{t("quiz.scoreLabel")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {score}/{totalPoints}
              </p>
              <p className="text-xs text-muted-foreground">{t("quiz.pointsLabel")}</p>
            </div>
            <div>
              <Badge
                variant="outline"
                className={cn(
                  "text-base px-3 py-1",
                  passed
                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                )}
              >
                {passed ? t("quiz.passLabel") : t("quiz.failLabel")}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {t("quiz.passScorePercent", { score: passingScore })}
              </p>
            </div>
            {timeSpentSec && (
              <div>
                <p className="text-xl font-bold flex items-center justify-center gap-1">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeSpentSec)}
                </p>
                <p className="text-xs text-muted-foreground">{t("quiz.timeSpentLabel")}</p>
              </div>
            )}
          </div>

          {isPlacement && determinedLevel && (
            <>
              <Separator />
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("quiz.determinedLevel")}
                </p>
                <Badge
                  className={cn("text-lg px-4 py-1", getLevelColor(determinedLevel))}
                  variant="outline"
                >
                  {getLevelLabelI18n(determinedLevel, locale)}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {t("quiz.profileUpdated")}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center gap-3">
        <Link href={`/quiz/${quizId}`}>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("common.tryAgain")}
          </Button>
        </Link>
        <Link href="/quiz">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("quiz.allQuizzes")}
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("quiz.questionReview")}</h2>
        {questions.map((q, i) => {
          const ua = answerMap.get(q.id);
          const isCorrect = ua?.isCorrect ?? false;
          const userAnswer = ua?.userAnswer ?? "";

          return (
            <Card
              key={q.id}
              className={cn(
                "border-l-4",
                isCorrect ? "border-l-green-500" : "border-l-red-500"
              )}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Q{i + 1}.
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {q.module}
                      </Badge>
                    </div>
                    <p className="font-medium">
                      {q.type === "fill-blank"
                        ? q.question.replace(/___/g, " ______ ")
                        : q.question}
                    </p>

                    {q.options && (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {q.options.map((opt, j) => {
                          const letter = String.fromCharCode(65 + j);
                          const isUserChoice = opt === userAnswer;
                          const isCorrectOpt = opt === q.answer;
                          return (
                            <div
                              key={j}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                                isCorrectOpt
                                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                  : isUserChoice && !isCorrect
                                  ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                  : "bg-muted/50"
                              )}
                            >
                              <span className="font-semibold">{letter}.</span>
                              {opt}
                              {isCorrectOpt && (
                                <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-green-500" />
                              )}
                              {isUserChoice && !isCorrect && (
                                <XCircle className="w-3.5 h-3.5 ml-auto text-red-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!q.options && (
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">{t("quiz.yourAnswer")}: </span>
                          <span
                            className={cn(
                              "font-medium",
                              isCorrect ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {userAnswer || t("quiz.noAnswer")}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-muted-foreground">{t("quiz.correctAnswer")}: </span>
                            <span className="font-medium text-green-600">
                              {q.answer}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {q.explanation && (
                      <div className="mt-2 p-3 rounded-md bg-blue-50 dark:bg-blue-950 text-sm text-blue-700 dark:text-blue-300">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
