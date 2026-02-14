"use client"

import { useWords } from "@/hooks/useWords"
import { useProgress } from "@/hooks/useProgress"
import ProgressBar from "@/components/ProgressBar"

const LEVEL_LABELS = ["未学習", "入門", "初級", "中級", "上級", "習得済"]
const LEVEL_COLORS = [
  "text-gray-400",
  "text-red-400",
  "text-orange-400",
  "text-yellow-500",
  "text-blue-500",
  "text-green-500",
]

export default function ProgressPage() {
  const { words } = useWords()
  const { progressList } = useProgress()

  const wordProgress = words.map((word) => {
    const progress = progressList.find((p) => p.wordId === word.id)
    return { word, progress }
  })

  const byLevel = [0, 1, 2, 3, 4, 5].map((level) => ({
    level,
    count: wordProgress.filter((wp) => (wp.progress?.masteryLevel ?? 0) === level).length,
  }))

  const sorted = [...wordProgress].sort((a, b) => {
    const la = a.progress?.masteryLevel ?? 0
    const lb = b.progress?.masteryLevel ?? 0
    return la - lb
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">進捗管理</h2>
        <p className="text-gray-500 mt-1">各単語の習熟度を確認できます</p>
      </div>

      {/* Level distribution */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {byLevel.map(({ level, count }) => (
          <div key={level} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${LEVEL_COLORS[level]}`}>{count}</p>
            <p className="text-xs text-gray-500 mt-1">{LEVEL_LABELS[level]}</p>
            <p className="text-xs text-gray-400">Lv.{level}</p>
          </div>
        ))}
      </div>

      {/* Word list */}
      {words.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          単語が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(({ word, progress }) => {
            const level = progress?.masteryLevel ?? 0
            const total = (progress?.correctCount ?? 0) + (progress?.incorrectCount ?? 0)
            const acc = total > 0 ? Math.round(((progress?.correctCount ?? 0) / total) * 100) : null
            const lastStudied = progress?.lastStudied
              ? new Date(progress.lastStudied).toLocaleDateString("ja-JP")
              : null

            return (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{word.english}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{word.japanese}</p>
                    <ProgressBar level={level} />
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-bold text-lg ${LEVEL_COLORS[level]}`}>
                      {LEVEL_LABELS[level]}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {total > 0 ? (
                        <>
                          <p>正答率: {acc}%</p>
                          <p className="text-green-500">✓ {progress?.correctCount}回</p>
                          <p className={`${(progress?.incorrectCount ?? 0) > 0 ? "text-red-400 font-medium" : ""}`}>
                            ✗ {progress?.incorrectCount}回
                          </p>
                        </>
                      ) : (
                        <p>未学習</p>
                      )}
                      {lastStudied && <p className="mt-1">最終: {lastStudied}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
