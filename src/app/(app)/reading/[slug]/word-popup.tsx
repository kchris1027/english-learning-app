"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BookPlus, X, Loader2 } from "lucide-react";

interface WordData {
  found: boolean;
  id?: string;
  word?: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition?: string;
  definitionZh?: string;
  exampleSentence?: string;
  query?: string;
}

interface PopupState {
  word: string;
  x: number;
  y: number;
}

function highlightWordbookWords(
  html: string,
  wordSet: Set<string>
): string {
  if (wordSet.size === 0) return html;

  const words = Array.from(wordSet).sort((a, b) => b.length - a.length);
  const escaped = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const parts: string[] = [];
  let i = 0;

  while (i < html.length) {
    if (html[i] === "<") {
      const tagEnd = html.indexOf(">", i);
      if (tagEnd !== -1) {
        parts.push(html.slice(i, tagEnd + 1));
        i = tagEnd + 1;
        continue;
      }
    }
    const nextTag = html.indexOf("<", i);
    const textEnd = nextTag === -1 ? html.length : nextTag;
    const textChunk = html.slice(i, textEnd);

    parts.push(
      textChunk.replace(pattern, (match) => {
        return `<mark class="wordbook-highlight">${match}</mark>`;
      })
    );
    i = textEnd;
  }

  return parts.join("");
}

export function WordPopupProvider({
  articleId,
  wordbookWords,
  contentHtml,
}: {
  articleId: string;
  wordbookWords: string[];
  contentHtml: string;
}) {
  const { t } = useLanguage();
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allWordbookWords = useMemo(() => {
    const set = new Set(wordbookWords.map((w) => w.toLowerCase()));
    added.forEach((w) => set.add(w.toLowerCase()));
    return set;
  }, [wordbookWords, added]);

  const cleanWord = useCallback((raw: string) => {
    return raw.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
  }, []);

  const lookupWord = useCallback(async (word: string) => {
    setLoading(true);
    setWordData(null);
    try {
      const res = await fetch(
        `/api/reading/lookup?q=${encodeURIComponent(word)}`
      );
      const data: WordData = await res.json();
      setWordData(data);
    } catch {
      setWordData({ found: false, query: word });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-word-popup]") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        return;
      }

      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      let word = "";

      if (selectedText && selectedText.length > 0 && !selectedText.includes(" ")) {
        word = cleanWord(selectedText);
      } else {
        const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
        if (range) {
          const node = range.startContainer;
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent ?? "";
            const offset = range.startOffset;
            let start = offset;
            let end = offset;
            while (start > 0 && /[a-zA-Z'-]/.test(text[start - 1])) start--;
            while (end < text.length && /[a-zA-Z'-]/.test(text[end])) end++;
            word = cleanWord(text.slice(start, end));
          }
        }
      }

      if (!word || word.length < 2) {
        setPopup(null);
        return;
      }

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      setPopup({ word, x, y });
      lookupWord(word);
    },
    [cleanWord, lookupWord]
  );

  const handleAddToWordbook = useCallback(async () => {
    if (!wordData) return;
    setAdding(true);
    try {
      const body: Record<string, string | undefined> = {
        source: "reading",
        sourceId: articleId,
      };
      if (wordData.found && wordData.id) {
        body.wordId = wordData.id;
      } else {
        body.customWord = wordData.query ?? popup?.word ?? "";
        body.customDefinition = t("reading.addedFromReading");
      }

      const res = await fetch("/api/wordbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setAdded((prev) => new Set(prev).add(popup?.word ?? ""));
        toast({
          title: t("wordbook.addedToWordbook"),
          description: t("reading.wordSavedToWordbook", { word: popup?.word ?? "" }),
        });
      } else if (res.status === 409) {
        toast({
          title: t("wordbook.alreadyInWordbook"),
          description: t("reading.wordAlreadyInWordbook", { word: popup?.word ?? "" }),
        });
        setAdded((prev) => new Set(prev).add(popup?.word ?? ""));
      } else {
        toast({
          title: t("common.error"),
          description: t("reading.failedToAddWord"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("common.error"),
        description: t("reading.failedToAddWord"),
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  }, [wordData, articleId, popup, t]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setPopup(null);
      }
    }
    if (popup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [popup]);

  useEffect(() => {
    function handleScroll() {
      setPopup(null);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdded = popup ? added.has(popup.word) : false;

  const highlightedHtml = useMemo(
    () => highlightWordbookWords(contentHtml, allWordbookWords),
    [contentHtml, allWordbookWords]
  );

  return (
    <div ref={containerRef} className="relative" onClick={handleClick}>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none select-text cursor-text"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {popup && (
        <div
          ref={popupRef}
          data-word-popup
          className="absolute z-50 w-72 rounded-lg border bg-popover text-popover-foreground shadow-lg"
          style={{
            left: Math.min(popup.x, (containerRef.current?.offsetWidth ?? 400) - 300),
            top: popup.y + 24,
          }}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-lg font-semibold">{popup.word}</span>
                {wordData?.phonetic && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {wordData.phonetic}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopup(null);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("reading.lookingUp")}
              </div>
            )}

            {!loading && wordData?.found && (
              <div className="space-y-2">
                {wordData.partOfSpeech && (
                  <span className="text-xs text-muted-foreground italic">
                    {wordData.partOfSpeech}
                  </span>
                )}
                <p className="text-sm">{wordData.definition}</p>
                {wordData.definitionZh && (
                  <p className="text-sm text-muted-foreground">
                    {wordData.definitionZh}
                  </p>
                )}
                {wordData.exampleSentence && (
                  <p className="text-xs text-muted-foreground italic border-l-2 pl-2">
                    {wordData.exampleSentence}
                  </p>
                )}
              </div>
            )}

            {!loading && wordData && !wordData.found && (
              <p className="text-sm text-muted-foreground">
                {t("reading.wordNotFoundDict")}
              </p>
            )}

            {!loading && wordData && (
              <Button
                size="sm"
                variant={isAdded ? "secondary" : "default"}
                className="w-full gap-2"
                disabled={adding || isAdded}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWordbook();
                }}
              >
                {adding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BookPlus className="w-4 h-4" />
                )}
                {isAdded
                  ? t("wordbook.addedToWordbook")
                  : wordData.found
                    ? t("wordbook.addToWordbook")
                    : t("wordbook.addCustomWord")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
