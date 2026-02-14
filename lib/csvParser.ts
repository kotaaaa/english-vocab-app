import { Word } from "@/types"

export function parseCsv(text: string): Word[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  // 1行目はヘッダーとしてスキップ
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",").map((c) => c.trim())
    return {
      id: `csv-${i}`,
      english: cols[0] ?? "",
      japanese: cols[1] ?? "",
      example: cols[2] || undefined,
      category: cols[3] || undefined,
      createdAt: new Date(0).toISOString(), // ファイル由来は固定値
    }
  }).filter((w) => w.english && w.japanese)
}
