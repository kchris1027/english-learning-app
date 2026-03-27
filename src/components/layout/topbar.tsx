"use client";

import { Flame, Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  streak?: number;
  userName?: string;
  onMenuClick?: () => void;
}

export function Topbar({ streak = 0, userName = "Learner", onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-semibold">{streak}</span>
          </div>
          <ThemeToggle />
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
