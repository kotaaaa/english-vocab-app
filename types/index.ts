export interface Word {
  id: string
  english: string
  japanese: string
  exampleEn?: string  // 例文（英語）
  exampleJa?: string  // 例文（日本語）
  createdAt: string
}

export interface Progress {
  wordId: string
  correctCount: number
  incorrectCount: number
  lastStudied: string
  masteryLevel: number // 0~5 (5=完全習得)
}
