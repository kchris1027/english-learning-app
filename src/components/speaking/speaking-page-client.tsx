"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { type TranslationKey, getLevelLabelI18n } from "@/lib/i18n";
import { getLevelColor } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mic,
  BookOpen,
  Image,
  MessageCircle,
  Users,
  ChevronRight,
  History,
} from "lucide-react";

export interface PromptItem {
  id: string;
  type: string;
  title: string;
  content: string;
  level: string;
  category: string | null;
  recordCount: number;
}

interface SpeakingPageClientProps {
  prompts: PromptItem[];
  typeFilter?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  "read-aloud": <BookOpen className="w-3.5 h-3.5" />,
  "picture-describe": <Image className="w-3.5 h-3.5" />,
  "free-talk": <MessageCircle className="w-3.5 h-3.5" />,
  "role-play": <Users className="w-3.5 h-3.5" />,
};

const typeColors: Record<string, string> = {
  "read-aloud":
    "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  "picture-describe":
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
  "free-talk":
    "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  "role-play":
    "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950 border-violet-200 dark:border-violet-800",
};

const typeTranslationKeys: Record<string, TranslationKey> = {
  "read-aloud": "speaking.readAloud",
  "picture-describe": "speaking.pictureDescribe",
  "free-talk": "speaking.freeTalk",
  "role-play": "speaking.rolePlay",
};

export function SpeakingPageClient({ prompts, typeFilter }: SpeakingPageClientProps) {
  const { locale, t } = useLanguage();
  const allTypes = ["read-aloud", "picture-describe", "free-talk", "role-play"];

  const getTypeLabel = (type: string) => {
    const key = typeTranslationKeys[type];
    return key ? t(key) : type;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("speaking.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("speaking.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/speaking/history">
            <Button variant="outline" size="sm" className="gap-1.5">
              <History className="w-4 h-4" />
              {t("speaking.history")}
            </Button>
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mic className="w-4 h-4" />
            <span>
              {prompts.length} {t("speaking.prompts")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/speaking">
          <Button variant={!typeFilter ? "default" : "outline"} size="sm">
            {t("common.all")}
          </Button>
        </Link>
        {allTypes.map((type) => (
          <Link key={type} href={`/speaking?type=${type}`}>
            <Button
              variant={typeFilter === type ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
            >
              {typeIcons[type]}
              {getTypeLabel(type)}
            </Button>
          </Link>
        ))}
      </div>

      {prompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => {
            const typeLabel = getTypeLabel(prompt.type);
            const typeIcon = typeIcons[prompt.type] ?? <Mic className="w-3.5 h-3.5" />;
            const typeColor = typeColors[prompt.type] ?? "";

            return (
              <Link key={prompt.id} href={`/speaking/practice?promptId=${prompt.id}`}>
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {prompt.title}
                      </CardTitle>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardDescription className="flex items-center gap-1.5">
                      {typeIcon}
                      {typeLabel}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {prompt.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={typeColor} variant="outline">
                        {typeLabel}
                      </Badge>
                      <Badge
                        className={getLevelColor(prompt.level)}
                        variant="outline"
                      >
                        {getLevelLabelI18n(prompt.level, locale)}
                      </Badge>
                      {prompt.category && (
                        <Badge variant="secondary">{prompt.category}</Badge>
                      )}
                    </div>

                    {prompt.recordCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {prompt.recordCount} {t("speaking.recordings")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mic className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("speaking.noPrompts")}
          </h2>
          <p className="text-muted-foreground">
            {typeFilter
              ? t("speaking.noPromptsFiltered", { type: getTypeLabel(typeFilter) })
              : t("speaking.noPromptsDesc")}
          </p>
          {typeFilter && (
            <Link href="/speaking" className="mt-4">
              <Button variant="outline">{t("speaking.clearFilter")}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
