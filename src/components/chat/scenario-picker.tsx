"use client";

import {
  MessageCircle,
  UtensilsCrossed,
  Briefcase,
  Plane,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

const SCENARIO_ITEMS = [
  {
    key: "free-chat",
    nameKey: "chat.scenario.freeChat" as TranslationKey,
    descKey: "chat.scenario.freeChatDesc" as TranslationKey,
    icon: MessageCircle,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  {
    key: "restaurant",
    nameKey: "chat.scenario.restaurant" as TranslationKey,
    descKey: "chat.scenario.restaurantDesc" as TranslationKey,
    icon: UtensilsCrossed,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950",
    border: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  {
    key: "job-interview",
    nameKey: "chat.scenario.jobInterview" as TranslationKey,
    descKey: "chat.scenario.jobInterviewDesc" as TranslationKey,
    icon: Briefcase,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950",
    border: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  {
    key: "airport",
    nameKey: "chat.scenario.airport" as TranslationKey,
    descKey: "chat.scenario.airportDesc" as TranslationKey,
    icon: Plane,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950",
    border: "hover:border-sky-300 dark:hover:border-sky-700",
  },
  {
    key: "shopping",
    nameKey: "chat.scenario.shopping" as TranslationKey,
    descKey: "chat.scenario.shoppingDesc" as TranslationKey,
    icon: ShoppingBag,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950",
    border: "hover:border-pink-300 dark:hover:border-pink-700",
  },
  {
    key: "doctor-visit",
    nameKey: "chat.scenario.doctor" as TranslationKey,
    descKey: "chat.scenario.doctorDesc" as TranslationKey,
    icon: Heart,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950",
    border: "hover:border-red-300 dark:hover:border-red-700",
  },
] as const;

interface ScenarioPickerProps {
  onSelect: (scenario: string) => void;
  disabled?: boolean;
}

export function ScenarioPicker({ onSelect, disabled }: ScenarioPickerProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {SCENARIO_ITEMS.map((scenario) => (
        <Card
          key={scenario.key}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            scenario.border,
            disabled && "opacity-50 pointer-events-none"
          )}
          onClick={() => onSelect(scenario.key)}
        >
          <CardContent className="p-4 flex items-start gap-3">
            <div
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                scenario.bg
              )}
            >
              <scenario.icon className={cn("w-5 h-5", scenario.color)} />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-sm">{t(scenario.nameKey)}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {t(scenario.descKey)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
