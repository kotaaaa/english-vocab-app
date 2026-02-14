"use client"

interface QuizCardProps {
  question: string
  choices: string[]
  correctIndex: number
  onAnswer: (correct: boolean) => void
}

export default function QuizCard({ question, choices, correctIndex, onAnswer }: QuizCardProps) {
  const handleChoice = (index: number) => {
    onAnswer(index === correctIndex)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg">
      <p className="text-xs text-indigo-400 uppercase tracking-widest mb-4">次の英単語の意味は？</p>
      <p className="text-4xl font-bold text-gray-800 mb-8 text-center">{question}</p>
      <div className="grid grid-cols-1 gap-3">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleChoice(i)}
            className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50 transition-colors font-medium text-gray-700"
          >
            <span className="inline-block w-6 text-indigo-500 font-bold">
              {String.fromCharCode(65 + i)}.
            </span>{" "}
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}
