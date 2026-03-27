"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  GraduationCap,
  BookOpen,
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
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-xl">
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-foreground">EnglishPro</span>
          </div>
          <button onClick={onClose} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
      </div>
    </div>
  );
}
