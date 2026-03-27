"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import { getLevelLabelI18n } from "@/lib/i18n";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react";
import { ReadingFilter } from "./reading-filter";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  level: string;
  category: string;
  wordCount: number;
  estimatedTime: number;
  questionCount: number;
  status: string;
  score: number | null;
}

interface ReadingClientProps {
  articles: ArticleItem[];
  categories: string[];
  totalArticles: number;
}

export function ReadingClient({ articles, categories, totalArticles }: ReadingClientProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <BookOpen className="w-4 h-4" />
        <span>{t("reading.articleCount", { count: totalArticles })}</span>
      </div>

      <ReadingFilter categories={categories} />

      {totalArticles > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/reading/${article.slug}`}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    {article.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  {article.summary && (
                    <CardDescription className="line-clamp-2">
                      {article.summary}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex-1 pt-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={getLevelColor(article.level)}
                      variant="outline"
                    >
                      {getLevelLabelI18n(article.level, locale)}
                    </Badge>
                    <Badge variant="secondary">{article.category}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {t("reading.wordCount", { count: article.wordCount })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {t("reading.minShort", { min: article.estimatedTime })}
                    </span>
                  </div>

                  {article.status === "completed" && article.score != null && (
                    <Badge
                      variant="outline"
                      className="text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                    >
                      {t("reading.scorePercent", { score: article.score })}
                    </Badge>
                  )}
                  {article.status === "reading" && (
                    <Badge
                      variant="outline"
                      className="text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                    >
                      {t("reading.reading")}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("reading.noArticles")}</h2>
          <p className="text-muted-foreground">
            {t("reading.noArticlesDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
