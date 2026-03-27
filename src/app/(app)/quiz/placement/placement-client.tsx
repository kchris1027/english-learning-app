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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Clock,
  ClipboardCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Target,
  BookOpen,
  Brain,
} from "lucide-react";

interface PlacementClientProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    questionCount: number;
    timeLimit: number | null;
    passingScore: number;
  } | null;
  previousAttempt: {
    percentage: number;
    formattedDate: string;
    level: string;
  } | null;
}

export default function PlacementClient({ quiz, previousAttempt }: PlacementClientProps) {
  const { locale, t } = useLanguage();

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <GraduationCap className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("quiz.placementUnavailable")}</h2>
        <p className="text-muted-foreground mb-4">
          {t("quiz.placementUnavailableDesc")}
        </p>
        <Link href="/quiz">
          <Button variant="outline">{t("quiz.backToQuizzes")}</Button>
        </Link>
      </div>
    );
  }

  const features = [
    {
      icon: <Brain className="w-5 h-5 text-violet-500" />,
      title: t("quiz.adaptiveQuestions"),
      desc: t("quiz.adaptiveQuestionsDesc"),
    },
    {
      icon: <Target className="w-5 h-5 text-violet-500" />,
      title: t("quiz.accurateAssessment"),
      desc: t("quiz.accurateAssessmentDesc"),
    },
    {
      icon: <BookOpen className="w-5 h-5 text-violet-500" />,
      title: t("quiz.personalizedLearning"),
      desc: t("quiz.personalizedLearningDesc"),
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-violet-100 dark:bg-violet-900">
            <GraduationCap className="w-10 h-10 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("quiz.placementTitle")}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t("quiz.placementSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <Card key={i} className="text-center">
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-center">{f.icon}</div>
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-violet-200 dark:border-violet-800">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.description && (
            <CardDescription>{quiz.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4" />
              {t("quiz.questionCount", { count: quiz.questionCount })}
            </span>
            {quiz.timeLimit && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {t("quiz.minuteCount", { count: Math.floor(quiz.timeLimit / 60) })}
              </span>
            )}
          </div>

          {previousAttempt && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{t("quiz.previousResult")}</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-1",
                      previousAttempt.percentage >= quiz.passingScore
                        ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                        : "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                    )}
                  >
                    {t("quiz.scorePercent", { score: previousAttempt.percentage })}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-sm px-3 py-1",
                      getLevelColor(previousAttempt.level)
                    )}
                  >
                    {getLevelLabelI18n(previousAttempt.level, locale)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t("quiz.takenDate", { date: previousAttempt.formattedDate })}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="gap-3">
          <Link href={`/quiz/${quiz.id}`}>
            <Button className="gap-2" size="lg">
              {previousAttempt ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  {t("quiz.retake")}
                </>
              ) : (
                <>
                  {t("quiz.startTest")}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="ghost" size="lg">
              {t("quiz.backToQuizzes")}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
