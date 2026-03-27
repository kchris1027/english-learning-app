"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/chat/message-bubble";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  Loader2,
  MessageCircle,
  UtensilsCrossed,
  Briefcase,
  Plane,
  ShoppingBag,
  Heart,
  Bot,
} from "lucide-react";

interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  correctedContent?: string | null;
  corrections?: string | null;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string | null;
  scenario: string | null;
  level: string;
  messages: ChatMessage[];
}

const scenarioIcons: Record<string, React.ReactNode> = {
  "free-chat": <MessageCircle className="w-3.5 h-3.5" />,
  restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
  "job-interview": <Briefcase className="w-3.5 h-3.5" />,
  airport: <Plane className="w-3.5 h-3.5" />,
  shopping: <ShoppingBag className="w-3.5 h-3.5" />,
  "doctor-visit": <Heart className="w-3.5 h-3.5" />,
};

const scenarioColors: Record<string, string> = {
  "free-chat": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  restaurant: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  "job-interview": "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  airport: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  shopping: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  "doctor-visit": "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useLanguage();
  const id = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streamingContent, setStreamingContent] = useState("");
  const [level, setLevel] = useState("intermediate");

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const levels = [
    { value: "beginner", label: t("common.beginner") },
    { value: "intermediate", label: t("common.intermediate") },
    { value: "advanced", label: t("common.advanced") },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/chat/conversations/${id}`);
        if (!res.ok) {
          router.push("/chat");
          return;
        }
        const data: Conversation = await res.json();
        setConversation(data);
        setMessages(data.messages.filter((m) => m.role !== "system"));
        setLevel(data.level);
      } catch {
        router.push("/chat");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const handleLevelChange = async (newLevel: string) => {
    setLevel(newLevel);
    try {
      await fetch(`/api/chat/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: newLevel }),
      });
    } catch (err) {
      console.error("Failed to update level:", err);
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setInput("");
    setSending(true);
    setStreamingContent("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const tempUserMsg: ChatMessage = {
      id: "temp-user-" + Date.now(),
      conversationId: id,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, content }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const json = trimmed.slice(6);

          try {
            const data = JSON.parse(json);

            if (data.type === "delta") {
              accumulated += data.content;
              setStreamingContent(accumulated);
            } else if (data.type === "done") {
              setStreamingContent("");

              setMessages((prev) => {
                const filtered = prev.filter(
                  (m) => m.id !== tempUserMsg.id
                );
                const finalUserMsg: ChatMessage = data.userMessage;
                const assistantMsg: ChatMessage = data.assistantMessage;
                return [...filtered, finalUserMsg, assistantMsg];
              });
            }
          } catch {
            // ignore parse errors from partial data
          }
        }
      }
    } catch (err) {
      console.error("Send failed:", err);
      setMessages((prev) =>
        prev.filter((m) => m.id !== tempUserMsg.id)
      );
      setInput(content);
    } finally {
      setSending(false);
      setStreamingContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2 ml-auto" />
          <Skeleton className="h-12 w-2/3" />
        </div>
      </div>
    );
  }

  if (!conversation) return null;

  const scenarioBadgeColor =
    conversation.scenario && scenarioColors[conversation.scenario]
      ? scenarioColors[conversation.scenario]
      : "";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-semibold text-lg truncate">
              {conversation.title ?? t("chat.chat")}
            </h1>
          </div>
          {conversation.scenario && (
            <Badge
              variant="outline"
              className={cn("flex-shrink-0 gap-1", scenarioBadgeColor)}
            >
              {scenarioIcons[conversation.scenario]}
              {conversation.scenario}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="text-xs h-8 px-2 rounded-md border border-input bg-background cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {levels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ScrollArea className="flex-1 py-4" ref={scrollRef}>
        <div className="space-y-4 px-1">
          {messages.length === 0 && !streamingContent && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bot className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{t("chat.startConversation")}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {t("chat.startConversationDesc")}
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              corrections={msg.corrections}
              correctedContent={msg.correctedContent}
            />
          ))}

          {streamingContent && (
            <MessageBubble
              role="assistant"
              content={streamingContent}
              isStreaming
            />
          )}

          {sending && !streamingContent && (
            <div className="flex gap-2.5 mr-auto max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t pt-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.typeMessageEn")}
            disabled={sending}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[42px] max-h-[150px]"
            )}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            size="icon"
            className="h-[42px] w-[42px] flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
          {t("chat.inputHint")}
        </p>
      </div>
    </div>
  );
}
