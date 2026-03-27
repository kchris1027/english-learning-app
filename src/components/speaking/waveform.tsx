"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  isActive: boolean;
}

const BAR_COUNT = 24;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 32;

export function Waveform({ isActive }: WaveformProps) {
  const [heights, setHeights] = useState<number[]>(
    () => Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT)
  );
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) {
      setHeights(Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT));
      return;
    }

    let running = true;

    const animate = () => {
      if (!running) return;
      setHeights(
        Array.from({ length: BAR_COUNT }, () =>
          MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT)
        )
      );
      frameRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          if (running) animate();
        }, 80);
      });
    };

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [isActive]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {heights.map((h, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-100",
            isActive
              ? "bg-green-500 dark:bg-green-400"
              : "bg-muted-foreground/30"
          )}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}
