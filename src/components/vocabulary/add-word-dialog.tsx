"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface SearchResult {
  id: string;
  word: string;
  phonetic: string | null;
  partOfSpeech: string;
  definition: string;
  definitionZh: string | null;
  bank: { name: string };
}

interface AddWordDialogProps {
  onWordAdded: () => void;
}

export function AddWordDialog({ onWordAdded }: AddWordDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customWord, setCustomWord] = useState("");
  const [customDefinition, setCustomDefinition] = useState("");
  const [customPhonetic, setCustomPhonetic] = useState("");
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const searchWords = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 1) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/wordbook/search?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setError("");
    setShowCustom(false);
    searchWords(value);
  };

  const addExistingWord = async (wordId: string) => {
    setAdding(wordId);
    setError("");
    try {
      const res = await fetch("/api/wordbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, source: "manual" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("wordbook.failedToAdd"));
        return;
      }
      onWordAdded();
      resetAndClose();
    } catch {
      setError(t("wordbook.failedToAdd"));
    } finally {
      setAdding(null);
    }
  };

  const addCustomWord = async () => {
    if (!customWord.trim() || !customDefinition.trim()) {
      setError(t("wordbook.wordDefRequired"));
      return;
    }
    setAdding("custom");
    setError("");
    try {
      const res = await fetch("/api/wordbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customWord: customWord.trim(),
          customDefinition: customDefinition.trim(),
          customPhonetic: customPhonetic.trim() || undefined,
          source: "manual",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("wordbook.failedToAdd"));
        return;
      }
      onWordAdded();
      resetAndClose();
    } catch {
      setError(t("wordbook.failedToAdd"));
    } finally {
      setAdding(null);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setShowCustom(false);
    setCustomWord("");
    setCustomDefinition("");
    setCustomPhonetic("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : resetAndClose())}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <Plus className="w-4 h-4" />
        {t("wordbook.addWord")}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("wordbook.addToWordbook")}</DialogTitle>
          <DialogDescription>
            {t("wordbook.searchOrAdd")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("wordbook.searchWords")}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {searching && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              {t("wordbook.searching")}
            </div>
          )}

          {!searching && results.length > 0 && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {results.map((word) => (
                <button
                  key={word.id}
                  onClick={() => addExistingWord(word.id)}
                  disabled={adding !== null}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold truncate">{word.word}</span>
                      {word.partOfSpeech && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {word.partOfSpeech}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {word.bank.name}
                      </Badge>
                      {adding === word.id && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                    </div>
                  </div>
                  {word.phonetic && (
                    <p className="text-xs text-muted-foreground mt-0.5">{word.phonetic}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {word.definition}
                  </p>
                </button>
              ))}
            </div>
          )}

          {!searching && query.trim().length > 0 && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">
              {t("wordbook.noWordsFound", { query })}
            </p>
          )}

          {query.trim().length > 0 && (
            <>
              <Separator />
              <div>
                {!showCustom ? (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      setShowCustom(true);
                      setCustomWord(query.trim());
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    {t("wordbook.addCustomWord")}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">{t("wordbook.customWordTitle")}</h4>
                    <Input
                      placeholder={t("wordbook.word")}
                      value={customWord}
                      onChange={(e) => setCustomWord(e.target.value)}
                    />
                    <Input
                      placeholder={t("wordbook.definition")}
                      value={customDefinition}
                      onChange={(e) => setCustomDefinition(e.target.value)}
                    />
                    <Input
                      placeholder={t("wordbook.phonetic")}
                      value={customPhonetic}
                      onChange={(e) => setCustomPhonetic(e.target.value)}
                    />
                    <Button
                      className="w-full gap-2"
                      onClick={addCustomWord}
                      disabled={adding === "custom"}
                    >
                      {adding === "custom" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {t("wordbook.addToWordbook")}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
