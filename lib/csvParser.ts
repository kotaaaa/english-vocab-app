import { Word } from "@/types"

export function parseCsv(text: string): Word[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  // 1行目はヘッダーとしてスキップ
  // フォーマット: 単語,意味,例文(英語),例文(日本語)
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",").map((c) => c.trim())
    return {
      id: `csv-${i}`,
      english: cols[0] ?? "",
      japanese: cols[1] ?? "",
      exampleEn: cols[2] || undefined,
      exampleJa: cols[3] || undefined,
      createdAt: new Date(0).toISOString(),
    }
  }).filter((w) => w.english && w.japanese)
}
