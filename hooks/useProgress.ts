"use client"

import { useState, useEffect, useCallback } from "react"
import { Progress } from "@/types"
import { getProgress, saveProgress } from "@/lib/storage"

function calcMasteryLevel(correct: number, incorrect: number): number {
  const total = correct + incorrect
  if (total === 0) return 0
  const rate = correct / total
  if (rate >= 0.95 && correct >= 10) return 5
  if (rate >= 0.85 && correct >= 6) return 4
  if (rate >= 0.7 && correct >= 4) return 3
  if (rate >= 0.5 && correct >= 2) return 2
  if (correct >= 1) return 1
  return 0
}

export function useProgress() {
  const [progressList, setProgressList] = useState<Progress[]>([])

  useEffect(() => {
    setProgressList(getProgress())
  }, [])

  const recordResult = useCallback((wordId: string, correct: boolean) => {
    setProgressList((prev) => {
      const existing = prev.find((p) => p.wordId === wordId)
      let updated: Progress[]
      if (existing) {
        updated = prev.map((p) => {
          if (p.wordId !== wordId) return p
          const newCorrect = correct ? p.correctCount + 1 : p.correctCount
          const newIncorrect = correct ? p.incorrectCount : p.incorrectCount + 1
          return {
            ...p,
            correctCount: newCorrect,
            incorrectCount: newIncorrect,
            lastStudied: new Date().toISOString(),
            masteryLevel: calcMasteryLevel(newCorrect, newIncorrect),
          }
        })
      } else {
        const newProgress: Progress = {
          wordId,
          correctCount: correct ? 1 : 0,
          incorrectCount: correct ? 0 : 1,
          lastStudied: new Date().toISOString(),
          masteryLevel: correct ? 1 : 0,
        }
        updated = [...prev, newProgress]
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const resetWeakWords = useCallback(() => {
    setProgressList((prev) => {
      const updated = prev.filter((p) => p.incorrectCount === 0)
      saveProgress(updated)
      return updated
    })
  }, [])

  const getWordProgress = useCallback(
    (wordId: string): Progress | undefined => {
      return progressList.find((p) => p.wordId === wordId)
    },
    [progressList]
  )

  return { progressList, recordResult, getWordProgress, resetWeakWords }
}
