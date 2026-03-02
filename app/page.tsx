"use client"

import { useWords } from "@/hooks/useWords"
import { useProgress } from "@/hooks/useProgress"
import BandSelector, { useBand } from "@/components/BandSelector"
import Link from "next/link"

export default function DashboardPage() {
  const { band, setBand, csvPath, idPrefix } = useBand()
  const { words } = useWords(csvPath, idPrefix)
  const { progressList } = useProgress()

  // 選択バンドの単語IDに該当する進捗のみフィルタ
  const wordIds = new Set(words.map((w) => w.id))
  const bandProgress = progressList.filter((p) => wordIds.has(p.wordId))

  const totalWords = words.length
  const studiedWords = bandProgress.filter((p) => p.correctCount + p.incorrectCount > 0).length
  const masteredWords = bandProgress.filter((p) => p.masteryLevel >= 5).length
  const totalCorrect = bandProgress.reduce((s, p) => s + p.correctCount, 0)
  const totalAnswers = bandProgress.reduce((s, p) => s + p.correctCount + p.incorrectCount, 0)
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0

  const stats = [
    { label: "登録単語数", value: totalWords, icon: "📚", color: "bg-blue-50 text-blue-600" },
    { label: "学習済み", value: studiedWords, icon: "✏️", color: "bg-yellow-50 text-yellow-600" },
    { label: "習得済み", value: masteredWords, icon: "🏆", color: "bg-green-50 text-green-600" },
    { label: "正答率", value: `${accuracy}%`, icon: "🎯", color: "bg-purple-50 text-purple-600" },
  ]

  const recentProgress = bandProgress
    .slice()
    .sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ダッシュボード</h2>
          <p className="text-gray-500 mt-1">学習の全体進捗を確認できます</p>
        </div>
        <BandSelector band={band} onChange={setBand} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color} bg-opacity-50`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/flashcard"
          className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <span className="text-3xl">🃏</span>
          <div>
            <p className="font-semibold text-gray-800">フラッシュカード</p>
            <p className="text-sm text-gray-500">カードをめくって学習</p>
          </div>
        </Link>
        <Link
          href="/quiz"
          className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <span className="text-3xl">❓</span>
          <div>
            <p className="font-semibold text-gray-800">クイズ</p>
            <p className="text-sm text-gray-500">4択で腕試し</p>
          </div>
        </Link>
        <Link
          href="/words"
          className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-semibold text-gray-800">単語帳を見る</p>
            <p className="text-sm text-gray-500">登録単語の一覧</p>
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      {recentProgress.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">最近の学習履歴</h3>
          <div className="space-y-3">
            {recentProgress.map((p) => {
              const word = words.find((w) => w.id === p.wordId)
              if (!word) return null
              const total = p.correctCount + p.incorrectCount
              const acc = total > 0 ? Math.round((p.correctCount / total) * 100) : 0
              return (
                <div key={p.wordId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{word.english}</span>
                    <span className="text-gray-400 text-sm ml-2">{word.japanese}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{acc}% ({p.correctCount}/{total})</span>
                    <p className="text-xs text-gray-400">Lv.{p.masteryLevel}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {totalWords === 0 && (
        <div className="bg-indigo-50 rounded-xl p-8 text-center">
          <p className="text-indigo-600 text-lg font-medium mb-2">単語が読み込まれていません</p>
          <p className="text-indigo-400 mb-4">
            <code className="bg-indigo-100 px-1.5 py-0.5 rounded font-mono text-sm">public/words.csv</code> に単語を追加してください。
          </p>
        </div>
      )}
    </div>
  )
}
