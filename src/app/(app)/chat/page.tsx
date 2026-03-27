"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScenarioPicker } from "@/components/chat/scenario-picker";
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  MessageCircle,
  UtensilsCrossed,
  Briefcase,
  Plane,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string | null;
  scenario: string | null;
  level: string;
  lastMessage: string | null;
  lastMessageRole: string | null;
  messageCount: number;
  updatedAt: string;
  createdAt: string;
}

const scenarioIcons: Record<string, React.ReactNode> = {
  "free-chat": <MessageCircle className="w-4 h-4" />,
  restaurant: <UtensilsCrossed className="w-4 h-4" />,
  "job-interview": <Briefcase className="w-4 h-4" />,
  airport: <Plane className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  "doctor-visit": <Heart className="w-4 h-4" />,
};

const scenarioColors: Record<string, string> = {
  "free-chat": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  restaurant: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "job-interview": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  airport: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  shopping: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "doctor-visit": "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function ChatPage() {
  const router = useRouter();
  const { locale, t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatRelativeTime = useCallback((dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("chat.justNow");
    if (diffMins < 60) return t("chat.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("chat.hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("chat.daysAgo", { count: diffDays });
    return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric" });
  }, [locale, t]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleCreateConversation = async (scenario: string) => {
    setCreating(true);
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, level: "intermediate" }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/${data.id}`);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("chat.deleteConfirmMsg"))) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/chat/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("chat.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("chat.description")}
          </p>
        </div>
        <Button
          onClick={() => handleCreateConversation("free-chat")}
          disabled={creating}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {t("chat.newChat")}
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">{t("chat.chooseScenario")}</h2>
        <ScenarioPicker onSelect={handleCreateConversation} disabled={creating} />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          {t("chat.recentChats")}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("chat.noChatsTitle")}</h3>
            <p className="text-muted-foreground max-w-sm">
              {t("chat.noChatsDesc")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className="cursor-pointer hover:shadow-md transition-all group"
                onClick={() => router.push(`/chat/${conv.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                      conv.scenario && scenarioColors[conv.scenario]
                        ? scenarioColors[conv.scenario]!.split(" ").slice(0, 2).join(" ")
                        : "bg-muted"
                    )}
                  >
                    {conv.scenario && scenarioIcons[conv.scenario]
                      ? scenarioIcons[conv.scenario]
                      : <MessageSquare className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-sm truncate">
                        {conv.title ?? t("chat.untitledChat")}
                      </h3>
                      {conv.scenario && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-5 flex-shrink-0",
                            scenarioColors[conv.scenario]
                          )}
                        >
                          {conv.scenario}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage
                        ? `${conv.lastMessageRole === "user" ? t("chat.youPrefix") : t("chat.aiPrefix")}${conv.lastMessage}`
                        : t("chat.noMessages")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(conv.updatedAt)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {conv.messageCount === 1
                          ? t("chat.messageSingle")
                          : t("chat.messageCount", { count: conv.messageCount })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDelete(conv.id, e)}
                      disabled={deletingId === conv.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
