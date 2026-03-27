"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import { getLevelLabelI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  FileText,
  PlayCircle,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { WordPopupProvider } from "./word-popup";
import { ReadingTimer } from "./reading-timer";

interface ProgressData {
  status: string;
  score: number | null;
  readingTimeMs: number | null;
}

interface ArticleReaderClientProps {
  article: {
    id: string;
    title: string;
    level: string;
    category: string;
    wordCount: number;
    estimatedTime: number;
    source: string | null;
  };
  slug: string;
  contentHtml: string;
  keyVocabList: string[];
  hasQuiz: boolean;
  wordbookWords: string[];
  progress: ProgressData | null;
}

export function ArticleReaderClient({
  article,
  slug,
  contentHtml,
  keyVocabList,
  hasQuiz,
  wordbookWords,
  progress,
}: ArticleReaderClientProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-8 max-w-3xl">
      <ReadingTimer articleId={article.id} />

      <div className="flex items-center gap-3">
        <Link href="/reading">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge className={getLevelColor(article.level)} variant="outline">
          {getLevelLabelI18n(article.level, locale)}
        </Badge>
        <Badge variant="secondary">{article.category}</Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          {t("reading.wordCount", { count: article.wordCount })}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {t("reading.minRead", { min: article.estimatedTime })}
        </span>
      </div>

      {progress && progress.status === "completed" && progress.score != null && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t("reading.yourProgress")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">{t("reading.quizScore")}</span>
                <p className="text-lg font-semibold">{progress.score}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t("reading.status")}</span>
                <p className="text-lg font-semibold capitalize">
                  {progress.status.replace("_", " ")}
                </p>
              </div>
              {progress.readingTimeMs != null && progress.readingTimeMs > 0 && (
                <div>
                  <span className="text-muted-foreground">{t("reading.readingTime")}</span>
                  <p className="text-lg font-semibold">
                    {t("reading.readingTimeMin", { min: Math.round(progress.readingTimeMs / 60000) })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <WordPopupProvider
        articleId={article.id}
        wordbookWords={wordbookWords}
        contentHtml={contentHtml}
      />

      <p className="text-xs text-muted-foreground">
        {t("reading.clickWordHintFull")}
      </p>

      {keyVocabList.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {t("reading.keyVocabulary")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {keyVocabList.map((word) => (
                <Badge key={word} variant="outline" className="text-sm">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {article.source && (
        <p className="text-xs text-muted-foreground">
          {t("reading.source", { source: article.source })}
        </p>
      )}

      {hasQuiz && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <Link href={`/reading/${slug}/quiz`}>
              <Button className="gap-2" size="lg">
                <PlayCircle className="w-5 h-5" />
                {progress?.status === "completed"
                  ? t("reading.retakeQuiz")
                  : t("reading.takeQuiz")}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
