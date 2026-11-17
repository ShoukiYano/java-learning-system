import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}分${secs}秒` : `${mins}分`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}時間${remMins}分`;
}

export function difficultyLabel(difficulty: "easy" | "medium" | "hard"): {
  label: string;
  color: string;
} {
  switch (difficulty) {
    case "easy":
      return {
        label: "初級",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "medium":
      return {
        label: "中級",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      };
    case "hard":
      return {
        label: "上級",
        color: "bg-rose-100 text-rose-800 border-rose-200",
      };
  }
}
