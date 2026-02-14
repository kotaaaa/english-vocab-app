"use client"

import { useState } from "react"
import { useWords } from "@/hooks/useWords"
import { useProgress } from "@/hooks/useProgress"
import ProgressBar from "@/components/ProgressBar"

export default function WordsPage() {
  const { words, loading } = useWords()
  const { getWordProgress } = useProgress()
  const [search, setSearch] = useState("")

  const filtered = words.filter(
    (w) =>
      w.english.toLowerCase().includes(search.toLowerCase()) ||
      w.japanese.includes(search)
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">単語帳</h2>
          <p className="text-gray-500 mt-1">
            {loading ? "読み込み中..." : `全 ${words.length} 単語`}
          </p>
        </div>
        <a
          href="/words.csv"
          download
          className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          ↓ CSVダウンロード
        </a>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6 text-sm text-indigo-700">
        単語の追加・編集は <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono">public/words.csv</code> を編集して再デプロイしてください。
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="単語・訳・カテゴリで検索..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {search ? "検索結果がありません" : "単語が見つかりません"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((word) => {
            const progress = getWordProgress(word.id)
            const level = progress?.masteryLevel ?? 0
            return (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-lg">{word.english}</span>
                    </div>
                    <p className="text-gray-500">{word.japanese}</p>
                    {word.exampleEn && (
                      <p className="text-gray-400 text-sm mt-1 italic">{word.exampleEn}</p>
                    )}
                    {word.exampleJa && (
                      <p className="text-gray-400 text-sm mt-0.5">{word.exampleJa}</p>
                    )}
                    <div className="mt-2 max-w-xs">
                      <ProgressBar level={level} />
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
