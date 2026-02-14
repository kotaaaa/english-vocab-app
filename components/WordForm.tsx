"use client"

import { useState } from "react"
import { Word } from "@/types"

interface WordFormProps {
  initial?: Partial<Word>
  onSubmit: (data: Omit<Word, "id" | "createdAt">) => void
  onCancel: () => void
}

export default function WordForm({ initial, onSubmit, onCancel }: WordFormProps) {
  const [english, setEnglish] = useState(initial?.english ?? "")
  const [japanese, setJapanese] = useState(initial?.japanese ?? "")
  const [example, setExample] = useState(initial?.example ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!english.trim() || !japanese.trim()) return
    onSubmit({
      english: english.trim(),
      japanese: japanese.trim(),
      example: example.trim() || undefined,
      category: category.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          英語 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="英単語を入力"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          日本語訳 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={japanese}
          onChange={(e) => setJapanese(e.target.value)}
          placeholder="日本語訳を入力"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          例文（任意）
        </label>
        <textarea
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="例文を入力"
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ（任意）
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例: 名詞, 動詞, ビジネス"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {initial?.id ? "更新" : "追加"}
        </button>
      </div>
    </form>
  )
}
