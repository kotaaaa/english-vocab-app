"use client"

import { useState } from "react"
import { Word } from "@/types"

interface ParsedRow {
  english: string
  japanese: string
  example?: string
  category?: string
  error?: string
}

function parseText(text: string): ParsedRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => {
      // タブ区切り・カンマ区切り・コロン区切りに対応
      // フィールド順: 英語, 日本語[, 例文][, カテゴリ]
      const sep = line.includes("\t") ? "\t" : line.includes(",") ? "," : ":"
      const parts = line.split(sep).map((p) => p.trim())
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        return { english: "", japanese: "", error: `パース失敗: "${line}"` }
      }
      return {
        english: parts[0],
        japanese: parts[1],
        example: parts[2] || undefined,
        category: parts[3] || undefined,
      }
    })
}

interface BulkImportFormProps {
  onImport: (words: Omit<Word, "id" | "createdAt">[]) => void
  onCancel: () => void
}

export default function BulkImportForm({ onImport, onCancel }: BulkImportFormProps) {
  const [text, setText] = useState("")
  const [preview, setPreview] = useState<ParsedRow[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handlePreview = () => {
    const rows = parseText(text)
    setPreview(rows)
    setShowPreview(true)
  }

  const validRows = preview.filter((r) => !r.error)
  const errorRows = preview.filter((r) => r.error)

  const handleImport = () => {
    onImport(validRows as Omit<Word, "id" | "createdAt">[])
  }

  return (
    <div className="space-y-4">
      {!showPreview ? (
        <>
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">入力形式（1行1単語）</p>
            <p>英語,日本語</p>
            <p>英語,日本語,例文,カテゴリ</p>
            <p className="text-gray-400">区切り文字はカンマ・タブ・コロンに対応。<code className="bg-gray-200 px-1 rounded">#</code> で始まる行はスキップ。</p>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"abundant,豊富な\nmeticulous,細心の注意を払う,She is meticulous.,形容詞\nperseverance,忍耐"}
            rows={10}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handlePreview}
              disabled={!text.trim()}
              className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              プレビュー →
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="text-green-600 font-medium">{validRows.length} 件</span> 登録可能
              {errorRows.length > 0 && (
                <span className="text-red-400 ml-2">/ {errorRows.length} 件エラー</span>
              )}
            </p>
            <button
              onClick={() => setShowPreview(false)}
              className="text-sm text-indigo-500 hover:underline"
            >
              ← 修正する
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
            {preview.map((row, i) =>
              row.error ? (
                <div key={i} className="px-4 py-2 bg-red-50 text-xs text-red-500">
                  {row.error}
                </div>
              ) : (
                <div key={i} className="px-4 py-2 flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-800 w-32 truncate">{row.english}</span>
                  <span className="text-gray-500 flex-1 truncate">{row.japanese}</span>
                  {row.category && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full shrink-0">
                      {row.category}
                    </span>
                  )}
                </div>
              )
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={validRows.length === 0}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {validRows.length} 件を登録
            </button>
          </div>
        </>
      )}
    </div>
  )
}
