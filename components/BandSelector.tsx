"use client"

import { useState, useEffect, useCallback } from "react"

export type Band = "band75" | "band70"

const STORAGE_KEY = "selected_band"

const BAND_CONFIG: Record<Band, { label: string; csvPath: string }> = {
  band75: { label: "Band 7.5", csvPath: "/words.csv" },
  band70: { label: "Band 7.0", csvPath: "/words-2501-2999.csv" },
}

export function useBand() {
  const [band, setBandState] = useState<Band>("band75")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Band | null
    if (saved === "band75" || saved === "band70") {
      setBandState(saved)
    }
  }, [])

  const setBand = useCallback((b: Band) => {
    setBandState(b)
    localStorage.setItem(STORAGE_KEY, b)
  }, [])

  const csvPath = BAND_CONFIG[band].csvPath

  return { band, setBand, csvPath, idPrefix: band }
}

export default function BandSelector({
  band,
  onChange,
}: {
  band: Band
  onChange: (b: Band) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {(["band75", "band70"] as const).map((b) => (
        <button
          key={b}
          onClick={() => onChange(b)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            band === b
              ? "bg-indigo-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {BAND_CONFIG[b].label}
        </button>
      ))}
    </div>
  )
}
