"use client"

import { useState, useEffect } from "react"
import { Word } from "@/types"
import { parseCsv } from "@/lib/csvParser"

export function useWords() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/words.csv")
      .then((res) => res.text())
      .then((text) => {
        setWords(parseCsv(text))
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false))
  }, [])

  return { words, loading }
}
