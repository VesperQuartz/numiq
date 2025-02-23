import type { ChangeEvent } from "react"

interface AnswerInputProps {
  answer: string
  setAnswer: (value: string) => void
}

export function AnswerInput({ answer, setAnswer }: AnswerInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
  }

  return (
    <div>
      <label htmlFor="answer" className="block text-sm font-medium text-white">
        Your Answer
      </label>
      <input
        type="text"
        id="answer"
        className="mt-1 block w-full rounded-md border-transparent bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white placeholder-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        value={answer}
        onChange={handleChange}
        placeholder="Type your answer here"
      />
    </div>
  )
}

