"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { type TranslationKey, getLevelLabelI18n } from "@/lib/i18n";
import { cn, getLevelColor } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Mic,
  ArrowLeft,
  Calendar,
  BookOpen,
  MessageCircle,
  Image,
  Users,
  RotateCcw,
} from "lucide-react";

export interface RecordItem {
  id: string;
  transcription: string;
  pronunciationScore: number | null;
  fluencyScore: number | null;
  accuracyScore: number | null;
  feedback: string | null;
  createdAt: string;
  prompt: {
    id: string;
    title: string;
    type: string;
    level: string;
  } | null;
}

interface SpeakingHistoryClientProps {
  records: RecordItem[];
}

const typeIcons: Record<string, React.ReactNode> = {
  "read-aloud": <BookOpen className="w-3.5 h-3.5" />,
  "picture-describe": <Image className="w-3.5 h-3.5" />,
  "free-talk": <MessageCircle className="w-3.5 h-3.5" />,
  "role-play": <Users className="w-3.5 h-3.5" />,
};

const typeTranslationKeys: Record<string, TranslationKey> = {
  "read-aloud": "speaking.readAloud",
  "picture-describe": "speaking.pictureDescribe",
  "free-talk": "speaking.freeTalk",
  "role-play": "speaking.rolePlay",
};

function ScoreIndicator({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  if (value === null || value === undefined) return null;
  return (
    <div className="space-y-1 min-w-0 flex-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-medium",
            value >= 80
              ? "text-green-600 dark:text-green-400"
              : value >= 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
          )}
        >
          {Math.round(value)}%
        </span>
      </div>
      <Progress
        value={value}
        className={cn(
          "h-1.5",
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

export function SpeakingHistoryClient({ records }: SpeakingHistoryClientProps) {
  const { locale, t } = useLanguage();

  const getTypeLabel = (type: string) => {
    const key = typeTranslationKeys[type];
    return key ? t(key) : type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/speaking">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("speaking.historyTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("speaking.historyDescription")}
          </p>
        </div>
      </div>

      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => {
            const promptType = record.prompt?.type;
            const hasScores =
              record.pronunciationScore !== null ||
              record.fluencyScore !== null ||
              record.accuracyScore !== null;

            return (
              <Card key={record.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {record.prompt?.title ?? t("speaking.freePractice")}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(record.createdAt)}
                        {promptType && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="flex items-center gap-1">
                              {typeIcons[promptType]}
                              {getTypeLabel(promptType)}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    {record.prompt && (
                      <Badge
                        className={getLevelColor(record.prompt.level)}
                        variant="outline"
                      >
                        {getLevelLabelI18n(record.prompt.level, locale)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {record.transcription}
                  </p>

                  {hasScores && (
                    <>
                      <Separator />
                      <div className="flex gap-4">
                        <ScoreIndicator
                          label={t("speaking.pronunciation")}
                          value={record.pronunciationScore}
                        />
                        <ScoreIndicator
                          label={t("speaking.fluency")}
                          value={record.fluencyScore}
                        />
                        <ScoreIndicator
                          label={t("speaking.accuracy")}
                          value={record.accuracyScore}
                        />
                      </div>
                    </>
                  )}

                  {record.feedback && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {t("speaking.feedback")}
                        </p>
                        <p className="text-sm">{record.feedback}</p>
                      </div>
                    </>
                  )}

                  {record.prompt && (
                    <div className="pt-1">
                      <Link
                        href={`/speaking/practice?promptId=${record.prompt.id}`}
                      >
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5" />
                          {t("speaking.practiceAgain")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mic className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("speaking.noRecordings")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("speaking.noRecordingsDesc")}
          </p>
          <Link href="/speaking">
            <Button>{t("speaking.startPractice")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
