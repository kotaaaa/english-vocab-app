import { Progress } from "@/types"

const PROGRESS_KEY = "vocab_progress"

export function getProgress(): Progress[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(PROGRESS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveProgress(progress: Progress[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}
