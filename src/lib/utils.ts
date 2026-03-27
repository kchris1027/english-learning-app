import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return labels[level] || level;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    beginner: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
    intermediate: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    advanced: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
  };
  return colors[level] || "";
}
