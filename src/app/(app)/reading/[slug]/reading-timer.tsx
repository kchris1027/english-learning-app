"use client";

import { useEffect, useRef, useCallback } from "react";

export function ReadingTimer({ articleId }: { articleId: string }) {
  const startRef = useRef(Date.now());
  const accumulatedRef = useRef(0);
  const activeRef = useRef(true);

  const flush = useCallback(() => {
    if (activeRef.current) {
      accumulatedRef.current += Date.now() - startRef.current;
    }
    const ms = accumulatedRef.current;
    if (ms < 3000) return;

    navigator.sendBeacon?.(
      "/api/reading/progress",
      new Blob(
        [JSON.stringify({ articleId, readingTimeMs: ms })],
        { type: "application/json" }
      )
    );
    accumulatedRef.current = 0;
    startRef.current = Date.now();
  }, [articleId]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) {
        accumulatedRef.current += Date.now() - startRef.current;
        activeRef.current = false;
      } else {
        startRef.current = Date.now();
        activeRef.current = true;
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(flush, 30000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
      flush();
    };
  }, [flush]);

  return null;
}
