"use client"

import { useState, useEffect } from "react"
import { Word } from "@/types"
import { parseCsv } from "@/lib/csvParser"

export function useWords(csvPath: string = "/words.csv", idPrefix: string = "csv") {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(csvPath)
      .then((res) => res.text())
      .then((text) => {
        setWords(parseCsv(text, idPrefix))
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false))
  }, [csvPath, idPrefix])

  return { words, loading }
}
