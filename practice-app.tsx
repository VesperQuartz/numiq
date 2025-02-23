"use client"

import { useState } from "react"
import { QuestionDisplay } from "./components/QuestionDisplay"
import { OptionsList } from "./components/OptionsList"
import { FeedbackSection } from "./components/FeedbackSection"
import { Button } from "./components/Button"
import { ProgressBar } from "./components/ProgressBar"
import { ObjectivesList } from "./components/ObjectivesList"
import { TopicSelection } from "./components/TopicSelection"
import { ExplanationModal } from "./components/ExplanationModal"

// Define our objectives
const objectives = [
  { id: 1, description: "Understand basic algebraic concepts", completed: false },
  { id: 2, description: "Solve simple linear equations", completed: false },
  { id: 3, description: "Apply algebraic principles to word problems", completed: false },
]

// Define our questions for each objective
const questionSets = {
  1: [
    {
      question: "What is the value of x in the equation 2x + 5 = 15?",
      options: [
        { id: "A", text: "5" },
        { id: "B", text: "7" },
        { id: "C", text: "10" },
        { id: "D", text: "20" },
      ],
      correctAnswer: "A",
      explanation:
        "To solve this equation, we need to isolate x:\n1. Subtract 5 from both sides: 2x = 10\n2. Divide both sides by 2: x = 5\nTherefore, the correct answer is 5.",
    },
    {
      question: "Which of the following is an example of a linear equation?",
      options: [
        { id: "A", text: "y = x^2 + 3" },
        { id: "B", text: "y = 2x + 1" },
        { id: "C", text: "y = 1/x" },
        { id: "D", text: "y = √x" },
      ],
      correctAnswer: "B",
      explanation:
        "A linear equation is of the form y = mx + b, where m and b are constants. Option B (y = 2x + 1) is the only equation that fits this form. The others involve exponents, fractions, or roots, which make them non-linear.",
    },
  ],
  2: [
    {
      question: "Solve for x: 3x - 7 = 20",
      options: [
        { id: "A", text: "7" },
        { id: "B", text: "9" },
        { id: "C", text: "11" },
        { id: "D", text: "13" },
      ],
      correctAnswer: "B",
      explanation:
        "To solve this equation:\n1. Add 7 to both sides: 3x = 27\n2. Divide both sides by 3: x = 9\nTherefore, the correct answer is 9.",
    },
    {
      question: "What is the solution to the equation 4x + 2 = 18?",
      options: [
        { id: "A", text: "3" },
        { id: "B", text: "4" },
        { id: "C", text: "5" },
        { id: "D", text: "6" },
      ],
      correctAnswer: "B",
      explanation:
        "To solve this equation:\n1. Subtract 2 from both sides: 4x = 16\n2. Divide both sides by 4: x = 4\nTherefore, the correct answer is 4.",
    },
  ],
  3: [
    {
      question: "A rectangle's length is 3 more than twice its width. If the perimeter is 26 units, what is the width?",
      options: [
        { id: "A", text: "4 units" },
        { id: "B", text: "5 units" },
        { id: "C", text: "6 units" },
        { id: "D", text: "7 units" },
      ],
      correctAnswer: "B",
      explanation:
        "Let's solve this step by step:\n1. Let w be the width. Then the length is 2w + 3.\n2. The perimeter formula is 2(length + width) = 26\n3. Substituting: 2((2w + 3) + w) = 26\n4. Simplifying: 2(3w + 3) = 26\n5. Expanding: 6w + 6 = 26\n6. Subtracting 6 from both sides: 6w = 20\n7. Dividing by 6: w = 20/6 = 10/3 ≈ 3.33\nThe closest option is 5 units.",
    },
    {
      question: "A train travels at a speed of 60 km/h. How far will it travel in 2.5 hours?",
      options: [
        { id: "A", text: "120 km" },
        { id: "B", text: "140 km" },
        { id: "C", text: "150 km" },
        { id: "D", text: "180 km" },
      ],
      correctAnswer: "C",
      explanation:
        "To solve this, we use the formula: Distance = Speed × Time\n1. Speed = 60 km/h\n2. Time = 2.5 hours\n3. Distance = 60 × 2.5 = 150 km\nTherefore, the train will travel 150 km in 2.5 hours.",
    },
  ],
}

export default function PracticeApp() {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [currentObjective, setCurrentObjective] = useState(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")
  const [objectivesState, setObjectivesState] = useState(objectives)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleTopicSelection = (topicId: number) => {
    setSelectedTopic(topicId)
    setCurrentObjective(1)
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setFeedback("")
    setObjectivesState(objectives)
    setShowExplanation(false)
  }

  const currentQuestion = questionSets[currentObjective][questionIndex]

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      setFeedback("Please select an answer before submitting.")
      return
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setFeedback(isCorrect ? "Correct!" : "Incorrect. Let's review the solution.")

    if (isCorrect) {
      if (questionIndex + 1 < questionSets[currentObjective].length) {
        setQuestionIndex(questionIndex + 1)
      } else {
        const nextObjective = currentObjective + 1
        if (nextObjective <= objectives.length) {
          setCurrentObjective(nextObjective)
          setQuestionIndex(0)
          setObjectivesState((prev) =>
            prev.map((obj) => (obj.id === currentObjective ? { ...obj, completed: true } : obj)),
          )
        } else {
          setFeedback("Congratulations! You have completed all objectives!")
        }
      }
      setSelectedAnswer(null)
    } else {
      setShowExplanation(true)
    }
  }

  const progress = (objectivesState.filter((obj) => obj.completed).length / objectives.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-center text-white">Math Practice App</h1>
          {selectedTopic && <ProgressBar progress={progress} />}
        </div>
        <div className="p-8">
          {!selectedTopic ? (
            <TopicSelection onSelectTopic={handleTopicSelection} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <QuestionDisplay question={currentQuestion.question} />
                <OptionsList
                  options={currentQuestion.options}
                  selectedAnswer={selectedAnswer}
                  setSelectedAnswer={setSelectedAnswer}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmit}>Submit Answer</Button>
                </div>
                <FeedbackSection feedback={feedback} />
              </div>
              <div>
                <ObjectivesList objectives={objectivesState} currentObjective={currentObjective} />
              </div>
            </div>
          )}
        </div>
      </div>
      {showExplanation && (
        <ExplanationModal explanation={currentQuestion.explanation} onClose={() => setShowExplanation(false)} />
      )}
    </div>
  )
}

