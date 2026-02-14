"use client"

import { useState } from "react"
import { Word } from "@/types"

interface FlashCardProps {
  word: Word
  onCorrect: () => void
  onIncorrect: () => void
}

export default function FlashCard({ word, onCorrect, onIncorrect }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => setFlipped((f) => !f)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card */}
      <div
        className="perspective-1000 w-full max-w-lg h-64 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 border-2 border-indigo-100"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs text-indigo-400 mb-4 uppercase tracking-widest">English</p>
            <p className="text-4xl font-bold text-gray-800">{word.english}</p>
            <p className="mt-6 text-sm text-gray-400">クリックして答えを見る</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xs text-indigo-300 mb-4 uppercase tracking-widest">Japanese</p>
            <p className="text-3xl font-bold text-white text-center">{word.japanese}</p>
            {word.exampleEn && (
              <p className="mt-4 text-sm text-indigo-200 text-center italic">
                &quot;{word.exampleEn}&quot;
              </p>
            )}
            {word.exampleJa && (
              <p className="mt-1 text-sm text-indigo-300 text-center">
                {word.exampleJa}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons - only shown when flipped */}
      {flipped && (
        <div className="flex gap-4">
          <button
            onClick={() => { setFlipped(false); onIncorrect() }}
            className="px-8 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
          >
            ✗ 不正解
          </button>
          <button
            onClick={() => { setFlipped(false); onCorrect() }}
            className="px-8 py-3 bg-green-100 text-green-600 rounded-xl font-medium hover:bg-green-200 transition-colors"
          >
            ✓ 正解
          </button>
        </div>
      )}
      {!flipped && (
        <div className="h-12" />
      )}
    </div>
  )
}
