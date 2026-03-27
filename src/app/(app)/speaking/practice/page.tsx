"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { getLevelLabelI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getLevelColor } from "@/lib/utils";
import { compareSentences } from "@/lib/dictation-diff";
import type { DiffResult } from "@/lib/dictation-diff";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Waveform } from "@/components/speaking/waveform";
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface PromptData {
  id: string;
  type: string;
  title: string;
  content: string;
  referenceText: string | null;
  level: string;
  category: string | null;
}

type PracticeState = "ready" | "recording" | "done";

function calculateLocalScores(
  transcription: string,
  referenceText: string
): { accuracy: number; fluency: number; pronunciation: number } {
  const normalize = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^\w\s']/g, "")
      .split(/\s+/)
      .filter(Boolean);

  const userWords = normalize(transcription);
  const refWords = normalize(referenceText);

  if (refWords.length === 0) {
    return { accuracy: 0, fluency: 0, pronunciation: 0 };
  }

  const refSet = new Set(refWords);
  const matchCount = userWords.filter((w) => refSet.has(w)).length;
  const accuracy = Math.min(
    100,
    Math.round((matchCount / refWords.length) * 100)
  );

  const lengthRatio = userWords.length / refWords.length;
  const fluency = Math.round(Math.max(0, Math.min(100, 100 - Math.abs(1 - lengthRatio) * 100)));

  const pronunciation = Math.round((accuracy + fluency) / 2);

  return { accuracy, fluency, pronunciation };
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SpeakingPracticePage() {
  const searchParams = useSearchParams();
  const promptId = searchParams.get("promptId");
  const { locale, t } = useLanguage();

  const [prompt, setPrompt] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(!!promptId);
  const [state, setState] = useState<PracticeState>("ready");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showAiFeedback, setShowAiFeedback] = useState(false);

  const [scores, setScores] = useState<{
    accuracy: number;
    fluency: number;
    pronunciation: number;
  } | null>(null);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speech = useSpeechRecognition();
  const recorder = useAudioRecorder();

  useEffect(() => {
    if (!promptId) {
      setLoading(false);
      return;
    }
    fetch(`/api/speaking/prompts?type=`)
      .then((r) => r.json())
      .then((prompts: PromptData[]) => {
        const found = prompts.find((p) => p.id === promptId);
        if (found) setPrompt(found);
      })
      .finally(() => setLoading(false));
  }, [promptId]);

  const startRecording = useCallback(async () => {
    speech.reset();
    recorder.reset();
    setElapsedSeconds(0);
    setScores(null);
    setDiffResult(null);
    setSaved(false);
    setShowAiFeedback(false);

    setState("recording");
    speech.start();
    await recorder.start();

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }, [speech, recorder]);

  const stopRecording = useCallback(() => {
    speech.stop();
    recorder.stop();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState("done");

    const ref = prompt?.referenceText;
    const transcript = speech.transcript;
    if (ref && transcript) {
      setScores(calculateLocalScores(transcript, ref));
      setDiffResult(compareSentences(transcript, ref));
    }
  }, [speech, recorder, prompt]);

  const handleTryAgain = useCallback(() => {
    speech.reset();
    recorder.reset();
    setElapsedSeconds(0);
    setScores(null);
    setDiffResult(null);
    setSaved(false);
    setShowAiFeedback(false);
    setState("ready");
  }, [speech, recorder]);

  const handleSave = useCallback(async () => {
    if (saved) return;
    const body = {
      promptId: prompt?.id ?? null,
      transcription: speech.transcript,
      pronunciationScore: scores?.pronunciation ?? null,
      fluencyScore: scores?.fluency ?? null,
      accuracyScore: scores?.accuracy ?? null,
    };

    const res = await fetch("/api/speaking/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) setSaved(true);
  }, [prompt, speech.transcript, scores, saved]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const isReadAloud = prompt?.type === "read-aloud";
  const browserSupported = speech.isSupported;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/speaking">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            {prompt?.title ?? t("speaking.freePractice")}
          </h1>
          {prompt && (
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getLevelColor(prompt.level)} variant="outline">
                {getLevelLabelI18n(prompt.level, locale)}
              </Badge>
              {prompt.category && (
                <Badge variant="secondary">{prompt.category}</Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {!browserSupported && (
        <Card className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {t("speaking.notSupportedTitle")}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {t("speaking.notSupportedDesc")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {prompt && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {t("speaking.promptLabel")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-base leading-relaxed">{prompt.content}</p>
            {isReadAloud && prompt.referenceText && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {t("speaking.readAloudLabel")}
                  </p>
                  <p className="text-lg leading-relaxed font-medium bg-muted/50 rounded-lg p-4">
                    {prompt.referenceText}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {state === "ready" && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-10 h-10 text-primary" />
            </div>
            <p className="text-center text-muted-foreground max-w-md">
              {isReadAloud
                ? t("speaking.readAloudInstruction")
                : t("speaking.freeInstruction")}
            </p>
            <Button
              size="lg"
              className="gap-2 px-8"
              onClick={startRecording}
              disabled={!browserSupported && !recorder.isSupported}
            >
              <Mic className="w-5 h-5" />
              {t("speaking.startRecording")}
            </Button>
          </CardContent>
        </Card>
      )}

      {state === "recording" && (
        <Card className="border-green-300 dark:border-green-700">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 animate-ping" />
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    {t("speaking.recording")}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimer(elapsedSeconds)}
                  </p>
                </div>
              </div>

              <Button
                variant="destructive"
                size="lg"
                className="gap-2"
                onClick={stopRecording}
              >
                <Square className="w-4 h-4" />
                {t("speaking.stop")}
              </Button>
            </div>

            <Waveform isActive={true} />

            {speech.transcript && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  {t("speaking.liveTranscription")}
                </p>
                <p className="text-base leading-relaxed">
                  {speech.transcript}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {state === "done" && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t("speaking.yourTranscription")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {speech.transcript ? (
                <p className="text-base leading-relaxed bg-muted/50 rounded-lg p-4">
                  {speech.transcript}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  {t("speaking.noSpeechDetected")}
                </p>
              )}
            </CardContent>
          </Card>

          {isReadAloud && diffResult && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("speaking.wordComparison")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/50">
                  {diffResult.words.map((w, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-sm px-1.5 py-0.5 rounded",
                        w.type === "correct" &&
                          "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900",
                        w.type === "incorrect" &&
                          "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900 line-through",
                        w.type === "missing" &&
                          "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900 underline",
                        w.type === "extra" &&
                          "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950 line-through opacity-60"
                      )}
                    >
                      {w.text}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {t("speaking.correct")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    {t("speaking.wrong")}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {t("speaking.missing")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {scores && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t("speaking.scores")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar label={t("speaking.pronunciation")} value={scores.pronunciation} />
                <ScoreBar label={t("speaking.fluency")} value={scores.fluency} />
                <ScoreBar label={t("speaking.accuracy")} value={scores.accuracy} />
                <p className="text-xs text-muted-foreground">
                  {t("speaking.scoresEstimated")}
                </p>
              </CardContent>
            </Card>
          )}

          {recorder.audioUrl && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("speaking.playback")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <audio
                  controls
                  src={recorder.audioUrl}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              {!showAiFeedback ? (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowAiFeedback(true)}
                >
                  <Sparkles className="w-4 h-4" />
                  {t("speaking.getAiFeedback")}
                </Button>
              ) : (
                <div className="text-center space-y-2 py-2">
                  <Sparkles className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="font-medium">{t("speaking.aiComingSoon")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("speaking.aiComingSoonDesc")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            {!saved && speech.transcript && (
              <Button onClick={handleSave} className="gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {t("speaking.saveResult")}
              </Button>
            )}
            {saved && (
              <Badge
                variant="outline"
                className="text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950 px-3 py-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {t("speaking.saved")}
              </Badge>
            )}
            <Button variant="outline" onClick={handleTryAgain} className="gap-1.5">
              <RotateCcw className="w-4 h-4" />
              {t("common.tryAgain")}
            </Button>
            <Link href="/speaking">
              <Button variant="ghost" className="gap-1.5">
                <Play className="w-4 h-4" />
                {t("speaking.newPrompt")}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span
          className={cn(
            "font-semibold",
            value >= 80
              ? "text-green-600 dark:text-green-400"
              : value >= 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
          )}
        >
          {value}%
        </span>
      </div>
      <Progress
        value={value}
        className={cn(
          "h-2",
          value >= 80
            ? "[&>div]:bg-green-500"
            : value >= 50
              ? "[&>div]:bg-amber-500"
              : "[&>div]:bg-red-500"
        )}
      />
    </div>
  );
}
