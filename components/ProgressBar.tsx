interface ProgressBarProps {
  level: number // 0~5
  showLabel?: boolean
}

const LEVEL_COLORS = [
  "bg-gray-300",
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-green-500",
]

const LEVEL_LABELS = ["未学習", "入門", "初級", "中級", "上級", "習得済"]

export default function ProgressBar({ level, showLabel = true }: ProgressBarProps) {
  const percentage = (level / 5) * 100
  const color = LEVEL_COLORS[level] ?? "bg-gray-300"
  const label = LEVEL_LABELS[level] ?? "未学習"

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label}</span>
          <span>Lv.{level}/5</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
