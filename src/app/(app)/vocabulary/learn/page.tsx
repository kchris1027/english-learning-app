"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SwipeCards, type WordData } from "@/components/vocabulary/swipe-cards";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

function LearnContent() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bankId");
  const { t } = useLanguage();

  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionDone, setSessionDone] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setSessionDone(false);
    const url = bankId
      ? `/api/vocabulary/learn?bankId=${bankId}&limit=10`
      : `/api/vocabulary/learn?limit=10`;
    const res = await fetch(url);
    const data = await res.json();
    setWords(data);
    setLoading(false);
  }, [bankId]);

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
            <BookOpen className="w-6 h-6" />
            {t("vocab.learnNew")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("vocab.swipeInstructions")}
          </p>
        </div>
      </div>

      {sessionDone ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">{t("vocab.sessionComplete")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("vocab.greatJob")}
          </p>
          <div className="flex gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">
                {results.known}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{t("vocab.known")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">
                {results.unknown}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t("vocab.toReview")}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchWords} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              {t("vocab.learnMore")}
            </Button>
            <Link href="/vocabulary/review">
              <Button variant="outline" className="gap-2">
                {t("vocab.reviewWords")}
              </Button>
            </Link>
            <Link href="/vocabulary">
              <Button variant="ghost">{t("vocab.backToBanks")}</Button>
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
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold mb-2">{t("vocab.allCaughtUp")}</h2>
              <p className="text-muted-foreground mb-6">
                {t("vocab.allWordsLearned")}
              </p>
              <div className="flex gap-3">
                <Link href="/vocabulary/review">
                  <Button className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    {t("vocab.reviewWords")}
                  </Button>
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

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex justify-center">
            <Skeleton className="h-[400px] w-full max-w-sm rounded-lg" />
          </div>
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
