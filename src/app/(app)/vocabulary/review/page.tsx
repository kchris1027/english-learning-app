"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SwipeCards, type WordData } from "@/components/vocabulary/swipe-cards";
import { ArrowLeft, RotateCcw, Clock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function ReviewPage() {
  const { t } = useLanguage();
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setSessionDone(false);
    const res = await fetch("/api/vocabulary/review");
    const data = await res.json();
    setWords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleSwipe = useCallback(
    async (wordId: string, direction: "left" | "right") => {
      await fetch("/api/vocabulary/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, direction }),
      });
    },
    []
  );

  const handleComplete = useCallback(
    (r: { known: number; unknown: number }) => {
      setResults(r);
      setSessionDone(true);
    },
    []
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex justify-center">
          <Skeleton className="h-[400px] w-full max-w-sm rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vocabulary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6" />
            {t("vocab.reviewWords")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("vocab.wordsDueForReview", { count: words.length })}
          </p>
        </div>
      </div>

      {sessionDone ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">{t("vocab.reviewComplete")}</h2>
          <p className="text-muted-foreground mb-2">
            {t("vocab.reviewGreatJob")}
          </p>
          <div className="flex gap-8 my-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">
                {results.known}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("vocab.remembered")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">
                {results.unknown}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("vocab.needPractice")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {t("vocab.comeBackReview")}
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/vocabulary/learn">
              <Button className="gap-2">{t("vocab.learnNew")}</Button>
            </Link>
            <Link href="/vocabulary">
              <Button variant="outline">{t("vocab.backToBanks")}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <SwipeCards
          words={words}
          onSwipe={handleSwipe}
          onComplete={handleComplete}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">{t("vocab.noReviewsDue")}</h2>
              <p className="text-muted-foreground mb-6">
                {t("vocab.noReviewsDueDesc")}
              </p>
              <div className="flex gap-3">
                <Link href="/vocabulary/learn">
                  <Button className="gap-2">{t("vocab.learnNew")}</Button>
                </Link>
                <Link href="/vocabulary">
                  <Button variant="outline">{t("vocab.browseBanks")}</Button>
                </Link>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
