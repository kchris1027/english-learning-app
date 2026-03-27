"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Exercise {
  id: string;
  type: string;
  question: string;
  options: string | null;
  answer: string;
  explanation: string | null;
  difficulty: number;
}

interface TopicData {
  id: string;
  title: string;
  slug: string;
  level: string;
  exercises: Exercise[];
}

type AnswerState = {
  selected: string;
  isCorrect: boolean;
  submitted: boolean;
};

function normalizeAnswer(s: string): string {
  return s.toLowerCase().trim().replace(/['']/g, "'").replace(/\s+/g, " ");
}

function fuzzyMatch(userAnswer: string, correctAnswer: string): boolean {
  const a = normalizeAnswer(userAnswer);
  const b = normalizeAnswer(correctAnswer);
  if (a === b) return true;
  const stripTrailingPunctuation = (s: string) => s.replace(/[.!?]+$/, "").trim();
  return stripTrailingPunctuation(a) === stripTrailingPunctuation(b);
}

export default function PracticePage() {
  const { t } = useLanguage();
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [topic, setTopic] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, AnswerState>>(new Map());
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [sessionComplete, setSessionComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grammar/topics/${params.slug}`);
      if (!res.ok) {
        router.push("/grammar");
        return;
      }
      const data = await res.json();
      setTopic(data);
    } finally {
      setLoading(false);
    }
  }, [params.slug, router]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const exercises = topic?.exercises ?? [];
  const totalExercises = exercises.length;
  const currentExercise = exercises[currentIndex];
  const currentAnswer = answers.get(currentIndex);
  const correctCount = Array.from(answers.values()).filter(
    (a) => a.isCorrect
  ).length;

  function handleSubmitAnswer() {
    if (!currentExercise) return;

    let userAnswer = "";
    if (currentExercise.type === "multiple-choice") {
      userAnswer = selectedOption;
    } else {
      userAnswer = inputValue;
    }

    if (!userAnswer.trim()) return;

    let isCorrect = false;
    if (currentExercise.type === "rewrite") {
      isCorrect = fuzzyMatch(userAnswer, currentExercise.answer);
    } else if (currentExercise.type === "multiple-choice") {
      isCorrect =
        normalizeAnswer(userAnswer) ===
        normalizeAnswer(currentExercise.answer);
    } else {
      isCorrect =
        normalizeAnswer(userAnswer) ===
        normalizeAnswer(currentExercise.answer);
    }

    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(currentIndex, {
        selected: userAnswer,
        isCorrect,
        submitted: true,
      });
      return next;
    });
  }

  async function handleNext() {
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex((i) => i + 1);
      setInputValue("");
      setSelectedOption("");
    } else {
      setSubmitting(true);
      const finalCorrect = Array.from(answers.values()).filter(
        (a) => a.isCorrect
      ).length;
      try {
        await fetch("/api/grammar/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId: topic!.id,
            score: finalCorrect,
            total: totalExercises,
          }),
        });
      } catch {
        // Best effort
      }
      setSubmitting(false);
      setSessionComplete(true);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers(new Map());
    setInputValue("");
    setSelectedOption("");
    setSessionComplete(false);
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  if (!topic || totalExercises === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("grammar.noExercises")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("grammar.noExercisesDesc")}
        </p>
        <Link href={`/grammar/${params.slug}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("grammar.backToLesson")}
          </Button>
        </Link>
      </div>
    );
  }

  if (sessionComplete) {
    const scorePercent = Math.round((correctCount / totalExercises) * 100);
    const passed = scorePercent >= 60;

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
        <div className="text-6xl mb-4">{passed ? "🎉" : "💪"}</div>
        <h2 className="text-2xl font-bold mb-2">
          {passed ? t("grammar.greatJob") : t("grammar.keepPracticing")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {passed
            ? t("grammar.passedMessage")
            : t("grammar.failedMessage")}
        </p>

        <Card className="w-full mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-around">
              <div className="text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <div className="text-3xl font-bold">{scorePercent}%</div>
                <div className="text-sm text-muted-foreground">{t("common.score")}</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-3xl font-bold text-green-600">
                  {correctCount}
                </div>
                <div className="text-sm text-muted-foreground">{t("common.correct")}</div>
              </div>
              <div className="text-center">
                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <div className="text-3xl font-bold text-red-600">
                  {totalExercises - correctCount}
                </div>
                <div className="text-sm text-muted-foreground">{t("common.incorrect")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={handleRetry} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("common.tryAgain")}
          </Button>
          <Link href={`/grammar/${params.slug}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("grammar.backToLesson")}
            </Button>
          </Link>
          <Link href="/grammar">
            <Button variant="ghost">{t("grammar.backToGrammar")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / totalExercises) * 100;
  const parsedOptions: string[] = currentExercise.options
    ? (() => {
        try {
          return JSON.parse(currentExercise.options);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href={`/grammar/${params.slug}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{topic.title}</h1>
          <p className="text-sm text-muted-foreground">{t("grammar.practiceExercises")}</p>
        </div>
        <Badge variant="secondary">
          {currentIndex + 1} / {totalExercises}
        </Badge>
      </div>

      <Progress value={progressPercent} className="h-2" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="capitalize">
              {currentExercise.type.replace("-", " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("grammar.difficulty")}: {"★".repeat(currentExercise.difficulty)}
              {"☆".repeat(3 - currentExercise.difficulty)}
            </span>
          </div>
          <CardTitle className="text-lg mt-3 leading-relaxed">
            {currentExercise.type === "fill-blank"
              ? currentExercise.question.replace(/___/g, " _______ ")
              : currentExercise.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentExercise.type === "fill-blank" && (
            <Input
              placeholder={t("grammar.typeAnswer")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={currentAnswer?.submitted}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !currentAnswer?.submitted) {
                  handleSubmitAnswer();
                }
              }}
              autoFocus
            />
          )}

          {currentExercise.type === "multiple-choice" && (
            <div className="space-y-2">
              {parsedOptions.map((option, i) => {
                const isSelected = selectedOption === option;
                const isSubmitted = currentAnswer?.submitted;
                const isCorrectOption =
                  normalizeAnswer(option) ===
                  normalizeAnswer(currentExercise.answer);

                let optionClasses =
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors";

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionClasses +=
                      " border-green-500 bg-green-50 dark:bg-green-950/30";
                  } else if (isSelected && !currentAnswer.isCorrect) {
                    optionClasses +=
                      " border-red-500 bg-red-50 dark:bg-red-950/30";
                  } else {
                    optionClasses += " opacity-50";
                  }
                } else if (isSelected) {
                  optionClasses +=
                    " border-primary bg-primary/5";
                } else {
                  optionClasses +=
                    " hover:border-primary/50 hover:bg-muted/50";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    className={optionClasses}
                    onClick={() => !isSubmitted && setSelectedOption(option)}
                    disabled={isSubmitted}
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full border text-sm font-medium shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-left">{option}</span>
                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto shrink-0" />
                    )}
                    {isSubmitted && isSelected && !currentAnswer.isCorrect && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentExercise.type === "rewrite" && (
            <Textarea
              placeholder={t("grammar.rewriteSentence")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={currentAnswer?.submitted}
              rows={3}
            />
          )}

          {currentAnswer?.submitted && (
            <div
              className={`rounded-lg p-4 ${
                currentAnswer.isCorrect
                  ? "bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800"
                  : "bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {currentAnswer.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {t("common.correct")}!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      {t("common.incorrect")}
                    </span>
                  </>
                )}
              </div>
              {!currentAnswer.isCorrect && (
                <p className="text-sm mb-1">
                  <span className="text-muted-foreground">{t("grammar.correctAnswer")} </span>
                  <span className="font-medium">
                    {currentExercise.answer}
                  </span>
                </p>
              )}
              {currentExercise.explanation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentExercise.explanation}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end gap-2">
          {!currentAnswer?.submitted ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={
                currentExercise.type === "multiple-choice"
                  ? !selectedOption
                  : !inputValue.trim()
              }
            >
              {t("grammar.checkAnswer")}
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2" disabled={submitting}>
              {currentIndex < totalExercises - 1 ? (
                <>
                  {t("common.next")}
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                t("grammar.seeResults")
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
