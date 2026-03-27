"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface Question {
  id: string;
  module: string;
  type: string;
  question: string;
  options: string[] | null;
  points: number;
  sortOrder: number;
}

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  level: string | null;
  modules: string[];
  timeLimit: number | null;
  questionCount: number;
  passingScore: number;
  questions: Question[];
}

export default function TakeQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`/api/quiz/${id}`);
        if (!res.ok) throw new Error("Failed to load quiz");
        const data: QuizData = await res.json();
        setQuiz(data);
        if (data.timeLimit) setTimeLeft(data.timeLimit);
      } catch {
        setError("load_error");
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    const payload = {
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        userAnswer: answers[q.id] ?? "",
      })),
      timeSpentSec: elapsed,
    };

    try {
      const res = await fetch(`/api/quiz/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit failed");
      const result = await res.json();
      router.push(`/quiz/${id}/result?attempt=${result.attemptId}`);
    } catch {
      setError("submit_error");
      setSubmitting(false);
    }
  }, [quiz, answers, id, router, submitting]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timeLeft === 0 && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      handleSubmit();
    }
  }, [timeLeft, handleSubmit]);

  function formatCountdown(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("common.error")}</h2>
        <p className="text-muted-foreground mb-4">
          {error === "submit_error" ? t("quiz.submitError") : t("quiz.loadError")}
        </p>
        <Button variant="outline" onClick={() => router.push("/quiz")}>
          {t("quiz.backToQuizzes")}
        </Button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentAnswer = answers[question.id] ?? "";
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("quiz.questionOf", { current: currentIndex + 1, total: totalQuestions })}
          </p>
        </div>
        {timeLeft !== null && (
          <Badge
            variant="outline"
            className={cn(
              "text-base px-3 py-1 font-mono tabular-nums",
              timeLeft <= 60
                ? "text-red-600 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950"
                : "text-muted-foreground"
            )}
          >
            <Clock className="w-4 h-4 mr-1.5" />
            {formatCountdown(timeLeft)}
          </Badge>
        )}
      </div>

      <Progress
        value={currentIndex + 1}
        max={totalQuestions}
        className="h-2"
      />

      <div className="flex flex-wrap gap-1.5">
        {quiz.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-8 h-8 rounded-full text-xs font-medium transition-colors",
              i === currentIndex
                ? "bg-primary text-primary-foreground"
                : answers[q.id]
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize">
              {question.module}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("quiz.pointCount", { count: question.points })}
            </span>
          </div>
          <CardTitle className="text-lg mt-2 leading-relaxed">
            {question.type === "fill-blank"
              ? question.question.replace(/___/g, " ______ ")
              : question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.type === "multiple-choice" && question.options && (
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option, i) => {
                const letter = String.fromCharCode(65 + i);
                const isSelected = currentAnswer === option;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswer(question.id, option)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {letter}
                    </span>
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "fill-blank" && (
            <Input
              placeholder={t("quiz.typeYourAnswer")}
              value={currentAnswer}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              className="text-base"
              autoFocus
            />
          )}

          {question.type === "true-false" && (
            <div className="grid grid-cols-2 gap-4">
              {["True", "False"].map((val) => {
                const isSelected = currentAnswer === val;
                return (
                  <button
                    key={val}
                    onClick={() => setAnswer(question.id, val)}
                    className={cn(
                      "p-6 rounded-lg border text-center text-lg font-semibold transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    {val === "True" ? t("quiz.true") : t("quiz.false")}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("common.previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {t("quiz.answeredCount", { answered: answeredCount, total: totalQuestions })}
        </span>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {t("common.submit")}
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))
            }
            disabled={!currentAnswer}
            className="gap-1"
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
