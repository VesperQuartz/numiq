export function FeedbackSection({ feedback }: { feedback: string }) {
  if (!feedback) return null

  const isCorrect = feedback.startsWith("Correct")
  const bgColor = isCorrect ? "bg-green-100" : "bg-yellow-100"
  const textColor = isCorrect ? "text-green-800" : "text-yellow-800"
  const borderColor = isCorrect ? "border-green-500" : "border-yellow-500"

  return (
    <div className={`p-4 rounded-lg ${bgColor} ${textColor} border-l-4 ${borderColor}`}>
      <p className="text-sm font-medium">{feedback}</p>
    </div>
  )
}

