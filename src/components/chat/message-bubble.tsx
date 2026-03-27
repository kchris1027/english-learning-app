"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Bot, User, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  corrections?: string | null;
  correctedContent?: string | null;
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  corrections,
  correctedContent,
  isStreaming,
}: MessageBubbleProps) {
  const [showCorrections, setShowCorrections] = useState(false);
  const { t } = useLanguage();

  if (role === "system") return null;

  const isUser = role === "user";

  let parsedCorrections: Correction[] = [];
  if (corrections) {
    try {
      parsedCorrections = JSON.parse(corrections);
    } catch {
      parsedCorrections = [];
    }
  }

  const hasCorrections = parsedCorrections.length > 0;

  const correctionLabel =
    parsedCorrections.length === 1
      ? t("chat.correctionSingle")
      : t("chat.correctionCount", { count: parsedCorrections.length });

  return (
    <div
      className={cn("flex gap-2.5 max-w-[85%]", isUser ? "ml-auto" : "mr-auto")}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
          <Bot className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col gap-1 min-w-0">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse rounded-sm align-text-bottom" />
          )}
        </div>

        {isUser && hasCorrections && (
          <div className={cn("flex flex-col items-end gap-1")}>
            <button
              onClick={() => setShowCorrections(!showCorrections)}
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-5 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 cursor-pointer"
              >
                {correctionLabel}
                {showCorrections ? (
                  <ChevronUp className="w-3 h-3 ml-0.5" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                )}
              </Badge>
            </button>

            {showCorrections && (
              <div className="w-full rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50 p-3 space-y-2.5 text-xs">
                {correctedContent && (
                  <div className="flex items-start gap-1.5 text-green-700 dark:text-green-400 pb-2 border-b border-amber-200 dark:border-amber-800">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{correctedContent}</span>
                  </div>
                )}
                {parsedCorrections.map((c, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="line-through text-red-500 dark:text-red-400">
                        {c.original}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {c.corrected}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{c.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}
