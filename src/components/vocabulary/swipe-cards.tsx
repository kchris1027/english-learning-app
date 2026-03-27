"use client";

import { useState, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volume2, Check, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export interface WordData {
  id: string;
  word: string;
  phonetic?: string | null;
  partOfSpeech: string;
  definition: string;
  definitionZh?: string | null;
  exampleSentence?: string | null;
  exampleTranslation?: string | null;
}

interface SwipeCardsProps {
  words: WordData[];
  onSwipe: (wordId: string, direction: "left" | "right") => Promise<void>;
  onComplete?: (results: { known: number; unknown: number }) => void;
  emptyContent?: React.ReactNode;
}

export function SwipeCards({
  words,
  onSwipe,
  onComplete,
  emptyContent,
}: SwipeCardsProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [results, setResults] = useState({ known: 0, unknown: 0 });
  const [deltaX, setDeltaX] = useState(0);

  const currentWord = words[currentIndex];
  const isComplete = currentIndex >= words.length;

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (isAnimating || isComplete) return;

      setSwipeDirection(direction);
      setIsAnimating(true);

      const wordId = words[currentIndex].id;
      onSwipe(wordId, direction);

      const newResults = {
        known: results.known + (direction === "right" ? 1 : 0),
        unknown: results.unknown + (direction === "left" ? 1 : 0),
      };
      setResults(newResults);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setSwipeDirection(null);
        setIsAnimating(false);
        setFlipped(false);
        setDeltaX(0);

        if (nextIndex >= words.length && onComplete) {
          onComplete(newResults);
        }
      }, 300);
    },
    [currentIndex, isAnimating, isComplete, words, results, onSwipe, onComplete]
  );

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (isAnimating) return;
      setDeltaX(e.deltaX);
    },
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwiped: () => {
      if (!isAnimating) setDeltaX(0);
    },
    trackMouse: true,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  if (words.length === 0) {
    return (
      emptyContent ?? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">{t("vocab.noWordsAvailable")}</h2>
          <p className="text-muted-foreground">
            {t("vocab.checkBackLater")}
          </p>
        </div>
      )
    );
  }

  if (isComplete) {
    if (onComplete) return null;
    return (
      <DefaultCompletion known={results.known} unknown={results.unknown} />
    );
  }

  const rotation = deltaX * 0.1;
  const swipeOpacity = Math.min(Math.abs(deltaX) / 100, 1);

  const getTransform = () => {
    if (swipeDirection === "right") return "translateX(150%) rotate(30deg)";
    if (swipeDirection === "left") return "translateX(-150%) rotate(-30deg)";
    return `translateX(${deltaX}px) rotate(${rotation}deg)`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm mx-auto mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{t("vocab.progress")}</span>
          <span>
            {currentIndex + 1} / {words.length}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{
              width: `${((currentIndex + 1) / words.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-sm h-[420px] mx-auto mb-8">
        {currentIndex + 1 < words.length && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="w-full h-[400px] opacity-40 scale-[0.95] translate-y-2">
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-2xl font-bold text-muted-foreground/40">
                  {words[currentIndex + 1].word}
                </span>
              </CardContent>
            </Card>
          </div>
        )}

        <div
          {...handlers}
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style={{
            transform: getTransform(),
            transition: swipeDirection
              ? "transform 0.3s ease-out, opacity 0.3s ease-out"
              : "none",
            opacity: swipeDirection ? 0 : 1,
            zIndex: 10,
          }}
        >
          {deltaX > 0 && (
            <div
              className="absolute inset-0 rounded-lg border-4 border-green-500 bg-green-500/10 z-20 flex items-center justify-center pointer-events-none"
              style={{ opacity: swipeOpacity }}
            >
              <div className="bg-green-500 rounded-full p-3">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
          )}
          {deltaX < 0 && (
            <div
              className="absolute inset-0 rounded-lg border-4 border-red-500 bg-red-500/10 z-20 flex items-center justify-center pointer-events-none"
              style={{ opacity: swipeOpacity }}
            >
              <div className="bg-red-500 rounded-full p-3">
                <X className="w-10 h-10 text-white" />
              </div>
            </div>
          )}

          <Card
            className={cn(
              "w-full h-[400px] shadow-lg select-none transition-shadow",
              deltaX > 30 && "shadow-green-200 dark:shadow-green-900",
              deltaX < -30 && "shadow-red-200 dark:shadow-red-900"
            )}
            onClick={() => setFlipped(!flipped)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 relative overflow-hidden">
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden transition-all duration-500",
                  flipped
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentWord.word);
                  }}
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
                <span className="text-4xl font-bold mb-3 text-center">
                  {currentWord.word}
                </span>
                {currentWord.phonetic && (
                  <span className="text-lg text-muted-foreground mb-3">
                    {currentWord.phonetic}
                  </span>
                )}
                <Badge variant="secondary" className="text-sm">
                  {currentWord.partOfSpeech}
                </Badge>
                <p className="text-xs text-muted-foreground mt-8 animate-pulse">
                  {t("vocab.flipToSee")}
                </p>
              </div>

              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden transition-all duration-500",
                  flipped
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                )}
              >
                <span className="text-xl font-bold mb-1">
                  {currentWord.word}
                </span>
                {currentWord.phonetic && (
                  <span className="text-sm text-muted-foreground mb-3">
                    {currentWord.phonetic}
                  </span>
                )}
                <p className="text-center text-base mb-1">
                  {currentWord.definition}
                </p>
                {currentWord.definitionZh && (
                  <p className="text-center text-muted-foreground text-sm mb-3">
                    {currentWord.definitionZh}
                  </p>
                )}
                {currentWord.exampleSentence && (
                  <div className="mt-2 p-3 rounded-lg bg-muted/50 w-full">
                    <p className="text-sm italic text-center">
                      &ldquo;{currentWord.exampleSentence}&rdquo;
                    </p>
                    {currentWord.exampleTranslation && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {currentWord.exampleTranslation}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4 animate-pulse">
                  {t("vocab.tapToFlipBack")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="border-red-200 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:hover:bg-red-950 min-w-[140px]"
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
        >
          <X className="w-5 h-5 text-red-500 mr-2" />
          {t("vocab.dontKnow")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="border-green-200 hover:bg-green-50 hover:border-green-400 dark:border-green-800 dark:hover:bg-green-950 min-w-[140px]"
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
        >
          {t("vocab.know")}
          <Check className="w-5 h-5 text-green-500 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function DefaultCompletion({
  known,
  unknown,
}: {
  known: number;
  unknown: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold mb-2">{t("vocab.sessionComplete")}</h2>
      <p className="text-muted-foreground mb-6">
        {t("vocab.greatJob")}
      </p>
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-500">{known}</div>
          <div className="text-sm text-muted-foreground mt-1">{t("vocab.known")}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-red-500">{unknown}</div>
          <div className="text-sm text-muted-foreground mt-1">{t("vocab.toReview")}</div>
        </div>
      </div>
    </div>
  );
}
