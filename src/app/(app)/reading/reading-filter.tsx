"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

const LEVELS: { value: string; labelKey: TranslationKey }[] = [
  { value: "", labelKey: "reading.allLevels" },
  { value: "beginner", labelKey: "common.beginner" },
  { value: "intermediate", labelKey: "common.intermediate" },
  { value: "advanced", labelKey: "common.advanced" },
];

export function ReadingFilter({ categories }: { categories: string[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLevel = searchParams.get("level") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  function apply(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/reading?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <Button
            key={l.value}
            variant={activeLevel === l.value ? "default" : "outline"}
            size="sm"
            onClick={() => apply("level", l.value)}
            className={cn("text-xs")}
          >
            {t(l.labelKey)}
          </Button>
        ))}
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => apply("category", "")}
            className="text-xs"
          >
            {t("reading.allCategories")}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => apply("category", cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
