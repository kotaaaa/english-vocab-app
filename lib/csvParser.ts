import { Word } from "@/types"

function splitCsvLine(line: string): string[] {
  // 4列固定: 先頭3つのカンマでsplitし、残りを最終列にまとめる
  const parts: string[] = []
  let commaCount = 0
  let lastIndex = 0
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "," && commaCount < 3) {
      parts.push(line.slice(lastIndex, i).trim())
      lastIndex = i + 1
      commaCount++
    }
  }
  parts.push(line.slice(lastIndex).trim())
  return parts
}

export function parseCsv(text: string, idPrefix: string = "csv"): Word[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  // 1行目はヘッダーとしてスキップ（英語/日本語ヘッダー両対応）
  return lines.slice(1).map((line, i) => {
    const cols = splitCsvLine(line)
    return {
      id: `${idPrefix}-${i}`,
      english: cols[0] ?? "",
      japanese: cols[1] ?? "",
      exampleEn: cols[2] || undefined,
      exampleJa: cols[3] || undefined,
      createdAt: new Date(0).toISOString(),
    }
  }).filter((w) => w.english && w.japanese)
}
