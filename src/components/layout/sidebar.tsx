"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  MessageSquare,
  Mic,
  NotebookPen,
  Trophy,
  BookMarked,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

const navItems: { href: string; icon: typeof LayoutDashboard; labelKey: TranslationKey }[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { href: "/vocabulary", icon: BookOpen, labelKey: "nav.vocabulary" },
  { href: "/vocabulary/wordbook", icon: BookMarked, labelKey: "nav.wordbook" },
  { href: "/grammar", icon: GraduationCap, labelKey: "nav.grammar" },
  { href: "/reading", icon: NotebookPen, labelKey: "nav.reading" },
  { href: "/listening", icon: Headphones, labelKey: "nav.listening" },
  { href: "/speaking", icon: Mic, labelKey: "nav.speaking" },
  { href: "/chat", icon: MessageSquare, labelKey: "nav.aiChat" },
  { href: "/quiz", icon: Trophy, labelKey: "nav.quiz" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
      <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border overflow-y-auto">
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">
              EnglishPro
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-sidebar-border pt-3">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {t("nav.settings")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
