"use client"

import { useState, useCallback } from "react"
import { useWords } from "@/hooks/useWords"
import { useProgress } from "@/hooks/useProgress"
import BandSelector, { useBand } from "@/components/BandSelector"
import QuizCard from "@/components/QuizCard"
import Link from "next/link"
import { Word } from "@/types"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface QuizQuestion {
  word: Word
  choices: string[]
  correctIndex: number
}

function buildQuestions(targetWords: Word[], allWords: Word[]): QuizQuestion[] {
  const shuffled = shuffle(targetWords)
  return shuffled.map((word) => {
    const others = allWords.filter((w) => w.id !== word.id)
    const wrongChoices = shuffle(others).slice(0, 3).map((w) => w.japanese)
    const allChoices = shuffle([word.japanese, ...wrongChoices])
    const correctIndex = allChoices.indexOf(word.japanese)
    return { word, choices: allChoices, correctIndex }
  })
}

type Mode = "all" | "weak"

export default function QuizPage() {
  const { band, setBand, csvPath, idPrefix } = useBand()
  const { words } = useWords(csvPath, idPrefix)
  const { progressList, recordResult } = useProgress()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastResult, setLastResult] = useState<boolean | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionIncorrect, setSessionIncorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [mode, setMode] = useState<Mode>("all")

  const weakWords = words
    .map((w) => {
      const p = progressList.find((p) => p.wordId === w.id)
      return { word: w, incorrectCount: p?.incorrectCount ?? 0 }
    })
    .filter((x) => x.incorrectCount > 0)
    .sort((a, b) => b.incorrectCount - a.incorrectCount)
    .map((x) => x.word)

  const current = questions[currentIndex]

  const handleStart = useCallback((selectedMode: Mode) => {
    const target = selectedMode === "weak" ? weakWords : words
    const qs = buildQuestions(target, words)
    setMode(selectedMode)
    setQuestions(qs)
    setCurrentIndex(0)
    setLastResult(null)
    setSessionCorrect(0)
    setSessionIncorrect(0)
    setFinished(false)
    setStarted(true)
  }, [words, weakWords])

  const handleAnswer = (correct: boolean) => {
    if (!current) return
    recordResult(current.word.id, correct)
    setLastResult(correct)
    if (correct) setSessionCorrect((c) => c + 1)
    else setSessionIncorrect((c) => c + 1)

    setTimeout(() => {
      setLastResult(null)
      if (currentIndex + 1 >= questions.length) {
        setFinished(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 1000)
  }

  if (words.length < 4) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-2xl mb-4">❓</p>
        <p className="text-gray-600 mb-2">クイズには最低4つの単語が必要です。</p>
        <p className="text-gray-500 mb-4">現在: {words.length} 単語</p>
        <Link href="/words" className="text-indigo-600 hover:underline">
          単語帳で単語を追加する →
        </Link>
      </div>
    )
  }

  if (!started) {
    const weakAvailable = weakWords.length >= 4
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">クイズ</h2>
        <p className="text-gray-500 mb-4">モードを選んでスタート</p>
        <div className="mb-8">
          <BandSelector band={band} onChange={setBand} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleStart("all")}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <p>全単語モード</p>
            <p className="text-sm font-normal opacity-80 mt-1">{words.length} 問</p>
          </button>
          <button
            onClick={() => handleStart("weak")}
            disabled={!weakAvailable}
            className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <p>🔥 苦手単語モード</p>
            <p className="text-sm font-normal opacity-80 mt-1">
              {weakAvailable
                ? `${weakWords.length} 問（間違い回数順）`
                : weakWords.length > 0
                  ? `4単語以上必要（現在 ${weakWords.length} 語）`
                  : "まだ間違えた単語がありません"}
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (finished) {
    const total = sessionCorrect + sessionIncorrect
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-4xl mb-4">
          {acc >= 80 ? "🎉" : acc >= 50 ? "👍" : "💪"}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">クイズ完了！</h2>
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
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleStart(mode)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => setStarted(false)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            モード選択へ
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">クイズ</h2>
          {mode === "weak" && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              🔥 苦手モード
            </span>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${(currentIndex / questions.length) * 100}%` }}
        />
      </div>

      {lastResult !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`text-8xl animate-bounce ${lastResult ? "text-green-500" : "text-red-400"}`}>
            {lastResult ? "✓" : "✗"}
          </div>
        </div>
      )}

      {current && (
        <div className="flex justify-center">
          <QuizCard
            key={current.word.id}
            question={current.word.english}
            choices={current.choices}
            correctIndex={current.correctIndex}
            onAnswer={handleAnswer}
          />
        </div>
      )}
    </div>
  )
}
