"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { getLevelLabelI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { getLevelColor, cn } from "@/lib/utils";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  Repeat,
  Clock,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpenCheck,
  PenLine,
  Send,
} from "lucide-react";

interface Exercise {
  id: string;
  type: string;
  question: string;
  answer: string;
  options: string | null;
  hint: string | null;
  startTimeSec: number | null;
  endTimeSec: number | null;
  sortOrder: number;
}

interface ContentData {
  id: string;
  title: string;
  slug: string;
  audioUrl: string;
  transcript: string;
  level: string;
  category: string;
  durationSec: number;
  speakerCount: number;
  exercises: Exercise[];
  progress: { status: string; score: number | null } | null;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ListeningDetailPage() {
  const { t, locale } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [audioFailed, setAudioFailed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);

  const [showTranscript, setShowTranscript] = useState(false);

  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [showExerciseAnswer, setShowExerciseAnswer] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/listening/content/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setDuration(d.durationSec);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (loopA !== null && loopB !== null && audio.currentTime >= loopB) {
        audio.currentTime = loopA;
      }
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setAudioFailed(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [loopA, loopB]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setAudioFailed(true));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = seekBarRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  const setPlaybackSpeed = useCallback((s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }, []);

  const handleSetLoopPoint = useCallback(() => {
    if (loopA === null) {
      setLoopA(currentTime);
    } else if (loopB === null) {
      setLoopB(currentTime);
    } else {
      setLoopA(null);
      setLoopB(null);
    }
  }, [loopA, loopB, currentTime]);

  const speakText = useCallback(
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

  const handleExerciseCheck = useCallback(
    (exercise: Exercise) => {
      const userAnswer = (exerciseAnswers[exercise.id] ?? "").trim().toLowerCase();
      const correct = exercise.answer.trim().toLowerCase();
      setExerciseResults((prev) => ({
        ...prev,
        [exercise.id]: userAnswer === correct,
      }));
      setShowExerciseAnswer((prev) => ({ ...prev, [exercise.id]: true }));
    },
    [exerciseAnswers]
  );

  const handleSubmitAll = useCallback(async () => {
    if (!data) return;
    const exercises = data.exercises.filter((e) => e.type !== "dictation");
    let correct = 0;
    exercises.forEach((ex) => {
      const userAnswer = (exerciseAnswers[ex.id] ?? "").trim().toLowerCase();
      if (userAnswer === ex.answer.trim().toLowerCase()) correct++;
    });

    await fetch(`/api/listening/content/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: correct, total: exercises.length }),
    });
    setSubmitted(true);
  }, [data, exerciseAnswers, slug]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground">{t("listening.notFound")}</p>
        <Link href="/listening">
          <Button variant="link">{t("listening.backToLibrary")}</Button>
        </Link>
      </div>
    );
  }

  const comprehensionExercises = data.exercises.filter(
    (e) => e.type === "comprehension" || e.type === "fill-blank"
  );
  const progress = (currentTime / (duration || 1)) * 100;

  const loopADisplay = loopA !== null ? formatTime(loopA) : null;
  const loopBDisplay = loopB !== null ? formatTime(loopB) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/listening">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{data.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge className={getLevelColor(data.level)} variant="outline">
          {getLevelLabelI18n(data.level, locale)}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {data.category}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(data.durationSec)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          {t("listening.speakerCount", { count: data.speakerCount })}
        </span>
      </div>

      {data.progress && data.progress.status === "completed" && data.progress.score != null && (
        <Badge
          variant="outline"
          className="text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          {t("listening.bestScore", { score: data.progress.score })}
        </Badge>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          {!audioFailed && <audio ref={audioRef} src={data.audioUrl} preload="metadata" />}

          <div className="flex items-center gap-3">
            {!audioFailed ? (
              <Button variant="outline" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => (isSpeaking ? stopSpeaking() : speakText(data.transcript))}
              >
                {isSpeaking ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            )}

            <div className="flex-1 space-y-1">
              <div
                ref={seekBarRef}
                className="relative h-2 bg-muted rounded-full cursor-pointer group"
                onClick={!audioFailed ? handleSeek : undefined}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
                {loopA !== null && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-amber-500"
                    style={{ left: `${(loopA / (duration || 1)) * 100}%` }}
                  />
                )}
                {loopB !== null && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-amber-500"
                    style={{ left: `${(loopB / (duration || 1)) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {audioFailed && (
            <p className="text-xs text-muted-foreground">
              {t("listening.audioFallback")}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">{t("listening.speed")}:</span>
            {SPEEDS.map((s) => (
              <Button
                key={s}
                variant={speed === s ? "default" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setPlaybackSpeed(s)}
              >
                {s}x
              </Button>
            ))}

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 text-xs",
                loopA !== null && loopB === null && "border-amber-500 text-amber-600",
                loopA !== null && loopB !== null && "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950"
              )}
              onClick={handleSetLoopPoint}
            >
              <Repeat className="w-3.5 h-3.5" />
              {loopA === null
                ? t("listening.setA")
                : loopB === null
                  ? t("listening.setATime", { time: loopADisplay ?? "" })
                  : t("listening.clearLoop", { a: loopADisplay ?? "", b: loopBDisplay ?? "" })}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <button
          className="w-full flex items-center justify-between px-6 py-4 text-left"
          onClick={() => setShowTranscript(!showTranscript)}
        >
          <span className="flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            {t("listening.transcript")}
          </span>
          {showTranscript ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showTranscript && (
          <CardContent className="pt-0">
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {data.transcript}
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="exercises">
        <TabsList>
          <TabsTrigger value="exercises" className="gap-1.5">
            <BookOpenCheck className="w-4 h-4" />
            {t("listening.exercises")}
          </TabsTrigger>
          <TabsTrigger value="dictation" className="gap-1.5">
            <PenLine className="w-4 h-4" />
            {t("listening.dictation")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-4 mt-4">
          {comprehensionExercises.length > 0 ? (
            <>
              {comprehensionExercises.map((ex, idx) => {
                const options: string[] = ex.options ? JSON.parse(ex.options) : [];
                const checked = showExerciseAnswer[ex.id];
                const isCorrect = exerciseResults[ex.id];

                return (
                  <Card key={ex.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {idx + 1}
                        </span>
                        {ex.question}
                      </CardTitle>
                      {ex.type === "fill-blank" && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {t("listening.fillBlank")}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {options.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {options.map((opt) => {
                            const selected = exerciseAnswers[ex.id] === opt;
                            let cls = "border";
                            if (checked && opt.toLowerCase() === ex.answer.trim().toLowerCase()) {
                              cls = "border-green-500 bg-green-50 dark:bg-green-950";
                            } else if (checked && selected && !isCorrect) {
                              cls = "border-red-500 bg-red-50 dark:bg-red-950";
                            } else if (selected) {
                              cls = "border-primary bg-primary/5";
                            }
                            return (
                              <button
                                key={opt}
                                className={cn(
                                  "text-left rounded-lg px-4 py-2.5 text-sm transition-colors",
                                  cls,
                                  !checked && "hover:bg-muted/50"
                                )}
                                onClick={() =>
                                  !checked &&
                                  setExerciseAnswers((p) => ({ ...p, [ex.id]: opt }))
                                }
                                disabled={!!checked}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <Input
                          placeholder={t("listening.typeAnswer")}
                          value={exerciseAnswers[ex.id] ?? ""}
                          onChange={(e) =>
                            setExerciseAnswers((p) => ({
                              ...p,
                              [ex.id]: e.target.value,
                            }))
                          }
                          disabled={!!checked}
                        />
                      )}

                      <div className="flex items-center gap-2">
                        {!checked && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExerciseCheck(ex)}
                            disabled={!exerciseAnswers[ex.id]}
                          >
                            {t("listening.check")}
                          </Button>
                        )}
                        {checked && (
                          <span
                            className={cn(
                              "flex items-center gap-1 text-sm font-medium",
                              isCorrect ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> {t("listening.correctResult")}
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" /> {t("listening.incorrectAnswer", { answer: ex.answer })}
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      {ex.hint && !checked && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" />
                          {ex.hint}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitAll}
                  disabled={submitted}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitted ? t("listening.submitted") : t("listening.submitResults")}
                </Button>
                {submitted && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t("listening.resultsSaved")}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpenCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t("listening.noExercises")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="dictation" className="mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4 text-center">
              <PenLine className="w-10 h-10 mx-auto text-muted-foreground" />
              <h3 className="font-semibold text-lg">{t("listening.dictationMode")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("listening.dictationDesc")}
              </p>
              <Link href={`/listening/${slug}/dictation`}>
                <Button className="gap-2">
                  <PenLine className="w-4 h-4" />
                  {t("listening.startDictation")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
