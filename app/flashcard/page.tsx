"use client"

import { useState, useCallback } from "react"
import { useWords } from "@/hooks/useWords"
import { useProgress } from "@/hooks/useProgress"
import FlashCard from "@/components/FlashCard"
import Link from "next/link"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashCardPage() {
  const { words } = useWords()
  const { recordResult } = useProgress()
  const [order, setOrder] = useState<string[]>(() =>
    words.map((w) => w.id)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionIncorrect, setSessionIncorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)

  const currentWordId = order[currentIndex]
  const currentWord = words.find((w) => w.id === currentWordId)

  const handleStart = useCallback(() => {
    const shuffled = shuffle(words.map((w) => w.id))
    setOrder(shuffled)
    setCurrentIndex(0)
    setSessionCorrect(0)
    setSessionIncorrect(0)
    setFinished(false)
    setStarted(true)
  }, [words])

  const next = (correct: boolean) => {
    if (currentWord) {
      recordResult(currentWord.id, correct)
      if (correct) setSessionCorrect((c) => c + 1)
      else setSessionIncorrect((c) => c + 1)
    }
    if (currentIndex + 1 >= order.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-2xl mb-4">📚</p>
        <p className="text-gray-600 mb-4">単語が登録されていません。</p>
        <Link href="/words" className="text-indigo-600 hover:underline">
          単語帳で単語を追加する →
        </Link>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">フラッシュカード</h2>
        <p className="text-gray-500 mb-8">全 {words.length} 単語をランダム順で学習します</p>
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          スタート
        </button>
      </div>
    )
  }

  if (finished) {
    const total = sessionCorrect + sessionIncorrect
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">セッション完了！</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 inline-block min-w-64">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-green-500">{sessionCorrect}</p>
              <p className="text-sm text-gray-500 mt-1">正解</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-400">{sessionIncorrect}</p>
              <p className="text-sm text-gray-500 mt-1">不正解</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">{acc}%</p>
              <p className="text-sm text-gray-500 mt-1">正答率</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            もう一度
          </button>
          <Link
            href="/progress"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            進捗を確認
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">フラッシュカード</h2>
        <span className="text-gray-500 text-sm">
          {currentIndex + 1} / {order.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex) / order.length) * 100}%` }}
        />
      </div>

      {currentWord && (
        <FlashCard
          key={currentWord.id}
          word={currentWord}
          onCorrect={() => next(true)}
          onIncorrect={() => next(false)}
        />
      )}
    </div>
  )
}
