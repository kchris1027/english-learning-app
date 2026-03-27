"use client";

import { useTheme } from "next-themes";
import { Globe, Moon, Sun, Monitor, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

const languages: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
];

const themes = [
  { value: "light", icon: Sun, labelKey: "settings.light" as const },
  { value: "dark", icon: Moon, labelKey: "settings.dark" as const },
  { value: "system", icon: Monitor, labelKey: "settings.system" as const },
];

export default function SettingsPage() {
  const { locale, setLocale, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">{t("settings.title")}</h1>

      {/* Language Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
          <CardDescription>{t("settings.languageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLocale(lang.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                  locale === lang.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <p className="font-medium">{lang.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {lang.value === "en" ? "English interface" : "中文界面"}
                  </p>
                </div>
                {locale === lang.value && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            {t("settings.appearance")}
          </CardTitle>
          <CardDescription>{t("settings.themeDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((item) => (
              <button
                key={item.value}
                onClick={() => setTheme(item.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                  theme === item.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
                {theme === item.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("settings.about")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">{t("settings.aboutDesc")}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("settings.version")}:</span>
            <span className="font-mono">1.0.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
