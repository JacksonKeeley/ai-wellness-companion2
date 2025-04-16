import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMoodSuggestion(mood: string) {
  const suggestions: Record<string, string> = {
    bad: "Try a breathing exercise or talk to a friend.",
    sad: "Consider writing about things you're grateful for.",
    angry: "Pause and do a mindfulness exercise.",
    anxious: "Try deep breathing or journaling.",
    happy: "Write down why you feel good to remember it.",
  };
  return suggestions[mood.toLowerCase()] || "Reflect on what might improve your mood.";
}