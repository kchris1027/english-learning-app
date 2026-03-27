"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DiffResult } from "@/lib/dictation-diff";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Trophy,
} from "lucide-react";

interface ContentData {
  id: string;
  title: string;
  slug: string;
  transcript: string;
  durationSec: number;
  audioUrl: string;
  exercises: Array<{
    type: string;
    startTimeSec: number | null;
    endTimeSec: number | null;
  }>;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function DictationPage() {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  const [sentences, setSentences] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState<(DiffResult | null)[]>([]);
  const [checking, setChecking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/listening/content/${slug}`)
      .then((r) => r.json())
      .then((d: ContentData) => {
        setData(d);
        const sents = splitIntoSentences(d.transcript);
        setSentences(sents);
        setResults(new Array(sents.length).fill(null));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const speakSentence = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.lang = "en-US";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [speed]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const handlePlayCurrent = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (sentences[currentIdx]) {
      speakSentence(sentences[currentIdx]);
    }
  }, [isSpeaking, sentences, currentIdx, speakSentence, stopSpeaking]);

  const handleCheck = useCallback(async () => {
    if (!sentences[currentIdx]) return;
    setChecking(true);

    try {
      const res = await fetch("/api/listening/dictation/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput,
          reference: sentences[currentIdx],
        }),
      });
      const diff: DiffResult = await res.json();
      setResults((prev) => {
        const next = [...prev];
        next[currentIdx] = diff;
        return next;
      });
    } finally {
      setChecking(false);
    }
  }, [currentIdx, sentences, userInput]);

  const handleNext = useCallback(() => {
    if (currentIdx < sentences.length - 1) {
      setCurrentIdx((i) => i + 1);
      setUserInput("");
      textareaRef.current?.focus();
    } else {
      setFinished(true);
      if (data) {
        const scored = results.filter((r) => r !== null);
        const avg =
          scored.length > 0
            ? Math.round(scored.reduce((s, r) => s + r.score, 0) / scored.length)
            : 0;
        fetch(`/api/listening/content/${slug}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: avg, total: 100 }),
        });
      }
    }
  }, [currentIdx, sentences.length, data, results, slug]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setUserInput("");
    }
  }, [currentIdx]);

  const handleRetry = useCallback(() => {
    setUserInput("");
    setResults((prev) => {
      const next = [...prev];
      next[currentIdx] = null;
      return next;
    });
    textareaRef.current?.focus();
  }, [currentIdx]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data || sentences.length === 0) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground">{t("listening.noDictationContent")}</p>
        <Link href={`/listening/${slug}`}>
          <Button variant="link">{t("listening.backToContent")}</Button>
        </Link>
      </div>
    );
  }

  const currentResult = results[currentIdx];
  const completedCount = results.filter((r) => r !== null).length;
  const overallProgress = (completedCount / sentences.length) * 100;

  if (finished) {
    const scored = results.filter((r): r is DiffResult => r !== null);
    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + r.score, 0) / scored.length)
        : 0;

    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Link href={`/listening/${slug}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t("listening.dictationComplete")}</h1>
        </div>

        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <Trophy
              className={cn(
                "w-16 h-16 mx-auto",
                avgScore >= 80
                  ? "text-yellow-500"
                  : avgScore >= 50
                    ? "text-blue-500"
                    : "text-muted-foreground"
              )}
            />
            <h2 className="text-3xl font-bold">{avgScore}%</h2>
            <p className="text-muted-foreground">
              {t("listening.completedSentences", { completed: scored.length, total: sentences.length })}
            </p>
            <Progress value={avgScore} className="h-3" />
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg">{t("listening.sentenceBreakdown")}</h3>
        <div className="space-y-3">
          {sentences.map((sent, i) => {
            const r = results[i];
            return (
              <Card key={i}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("listening.sentenceN", { n: i + 1 })}</span>
                    {r ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          r.score >= 80
                            ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                            : r.score >= 50
                              ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                              : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                        )}
                      >
                        {r.score}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{t("listening.skipped")}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{sent}</p>
                  {r && (
                    <div className="flex flex-wrap gap-1">
                      {r.words.map((w, j) => (
                        <span
                          key={j}
                          className={cn(
                            "text-sm px-1 rounded",
                            w.type === "correct" && "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900",
                            w.type === "incorrect" && "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900 line-through",
                            w.type === "missing" && "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900 underline",
                            w.type === "extra" && "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950 line-through opacity-60"
                          )}
                        >
                          {w.text}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Link href={`/listening/${slug}`}>
            <Button variant="outline">{t("listening.backToContent")}</Button>
          </Link>
          <Button
            onClick={() => {
              setFinished(false);
              setCurrentIdx(0);
              setUserInput("");
              setResults(new Array(sentences.length).fill(null));
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("common.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href={`/listening/${slug}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{t("listening.dictation")}</h1>
          <p className="text-sm text-muted-foreground">{data.title}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {t("listening.sentenceProgress", { current: currentIdx + 1, total: sentences.length })}
          </span>
          <span>{t("listening.completedCount", { count: completedCount })}</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              className="gap-2 px-6"
              onClick={handlePlayCurrent}
            >
              {isSpeaking ? (
                <>
                  <Pause className="w-5 h-5" /> {t("listening.stop")}
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" /> {t("listening.listen")}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (sentences[currentIdx]) speakSentence(sentences[currentIdx]);
              }}
            >
              <Play className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIdx === sentences.length - 1 && !currentResult}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-3">
            {[0.5, 0.75, 1].map((s) => (
              <Button
                key={s}
                variant={speed === s ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("listening.typeWhatYouHearTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            ref={textareaRef}
            placeholder={t("listening.typeSentence")}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={!!currentResult}
            rows={3}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !currentResult) {
                e.preventDefault();
                handleCheck();
              }
            }}
          />

          {!currentResult ? (
            <div className="flex gap-2">
              <Button
                onClick={handleCheck}
                disabled={!userInput.trim() || checking}
              >
                {checking ? t("listening.checking") : t("listening.check")}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext}>
                {t("listening.skip")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/50">
                {currentResult.words.map((w, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-sm px-1 rounded",
                      w.type === "correct" && "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900",
                      w.type === "incorrect" && "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900 line-through",
                      w.type === "missing" && "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900 underline",
                      w.type === "extra" && "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950 line-through opacity-60"
                    )}
                  >
                    {w.text}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-base px-3 py-1",
                    currentResult.score >= 80
                      ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                      : currentResult.score >= 50
                        ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                        : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                  )}
                >
                  {currentResult.score}%
                </Badge>

                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {t("listening.diffCorrect")}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {t("listening.diffWrong")}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {t("listening.diffMissing")}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{t("listening.reference")}</span>{" "}
                {sentences[currentIdx]}
              </p>

              <div className="flex gap-2">
                <Button onClick={handleNext}>
                  {currentIdx < sentences.length - 1 ? (
                    <>
                      {t("common.next")} <SkipForward className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      {t("common.finish")} <CheckCircle2 className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleRetry}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  {t("listening.retry")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
