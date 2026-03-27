"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getLevelColor } from "@/lib/utils";
import { getLevelLabelI18n, type TranslationKey } from "@/lib/i18n";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Headphones,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mic2,
  Users,
  Radio,
  Music,
  MessageSquare,
  GraduationCap,
} from "lucide-react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const categoryIcons: Record<string, React.ReactNode> = {
  conversation: <MessageSquare className="w-3.5 h-3.5" />,
  lecture: <GraduationCap className="w-3.5 h-3.5" />,
  news: <Radio className="w-3.5 h-3.5" />,
  song: <Music className="w-3.5 h-3.5" />,
};

const categoryKeys: Record<string, TranslationKey> = {
  conversation: "listening.categoryConversation",
  lecture: "listening.categoryLecture",
  news: "listening.categoryNews",
  song: "listening.categorySong",
};

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  level: string;
  category: string;
  durationSec: number;
  speakerCount: number;
  exerciseCount: number;
  status: string;
  score: number | null;
}

interface ListeningClientProps {
  contents: ContentItem[];
  totalCount: number;
}

export function ListeningClient({ contents, totalCount }: ListeningClientProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("listening.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("listening.description")}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Headphones className="w-4 h-4" />
          <span>{t("listening.itemCount", { count: totalCount })}</span>
        </div>
      </div>

      {totalCount > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => {
            const catIcon = categoryIcons[content.category] ?? <Headphones className="w-3.5 h-3.5" />;
            const catKey = categoryKeys[content.category];
            const catLabel = catKey ? t(catKey) : content.category;

            return (
              <Link key={content.id} href={`/listening/${content.slug}`}>
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {content.title}
                      </CardTitle>
                      {content.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      {catIcon}
                      {catLabel}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={getLevelColor(content.level)}
                        variant="outline"
                      >
                        {getLevelLabelI18n(content.level, locale)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(content.durationSec)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {t("listening.speakerCount", { count: content.speakerCount })}
                      </span>
                      {content.exerciseCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Mic2 className="w-3.5 h-3.5" />
                          {t("listening.exerciseCount", { count: content.exerciseCount })}
                        </span>
                      )}
                    </div>

                    {content.status === "completed" && content.score != null && (
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950"
                      >
                        {t("listening.scorePercent", { score: content.score })}
                      </Badge>
                    )}
                    {content.status === "in_progress" && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
                      >
                        {t("listening.inProgress")}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Headphones className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("listening.noContent")}</h2>
          <p className="text-muted-foreground">
            {t("listening.noContentDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
