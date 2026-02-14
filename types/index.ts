export interface Word {
  id: string
  english: string
  japanese: string
  example?: string
  category?: string
  createdAt: string
}

export interface Progress {
  wordId: string
  correctCount: number
  incorrectCount: number
  lastStudied: string
  masteryLevel: number // 0~5 (5=完全習得)
}
