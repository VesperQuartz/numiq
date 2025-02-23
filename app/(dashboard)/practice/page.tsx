"use client";

import { experimental_useObject as useObject } from "ai/react";
import { Button } from "@/components/ui/button";
import { TopicSelection } from "@/components/topic-selection";
import { QuestionDisplay } from "@/components/question-display";
import { OptionsList } from "@/components/options-list";
import { FeedbackSection } from "@/components/feedback-section";
import { ExplanationModal } from "@/components/explanation-modal";
import { useQueryState } from "nuqs";
import { z } from "zod";
import { match } from "ts-pattern";
import { MathJax } from "better-react-mathjax";
import { useAddPoints } from "@/app/hooks/api";
import { Question, useQuestionStore } from "@/app/store";
import React from "react";
import { useToast } from "@/hooks/use-toast";

const getLastItem = (arr: Question[]) => arr[arr.length - 1];
export default function PracticePage() {
  const [type] = useQueryState("type", {
    clearOnDefault: true,
    defaultValue: "",
  });
  const { toast } = useToast();
  const qStore = useQuestionStore();
  const [pocket, setPocket] = React.useState<Question[]>([]);
  const { object, submit, isLoading, error } = useObject({
    api: "/api/questions",
    schema: z.object({
      question: z.string().describe("A well-formed mathematics question"),
      options: z
        .array(z.string())
        .length(4)
        .describe(
          "Four options for the question. The correct answer must be included among them.",
        ),
      answer: z
        .enum(["A", "B", "C", "D"])
        .describe(
          "The correct answer's letter (A, B, C, or D), matching one of the provided options.",
        ),
    }),
  });

  const [selectedTopic, setSelectedTopic] = React.useState<number | null>(null);
  const [_questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(
    null,
  );
  const [feedback, setFeedback] = React.useState<string | null>("");
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const givePoints = useAddPoints();

  const handleTopicSelection = (topicId: number) => {
    submit(type);
    setSelectedTopic(topicId);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      setFeedback("Please select an answer before submitting.");
      return;
    }

    const isCorrect =
      selectedAnswer ===
      match(object?.answer)
        .with("A", () => object?.options?.[0])
        .with("B", () => object?.options?.[1])
        .with("C", () => object?.options?.[2])
        .with("D", () => object?.options?.[3])
        .otherwise(() => null);
    setFeedback(
      isCorrect ? "Correct!" : "Incorrect. Let's review the solution.",
    );

    if (isCorrect) {
      setPoints(points + 1); // Increment points for correct answer
      submit(type);
      setSelectedAnswer(null);
      givePoints.mutate();
      setFeedback(null);
    } else {
      setShowExplanation(true);
    }
  };

  React.useEffect(() => {
    if (qStore.payload && !pocket.includes(qStore.payload)) {
      setPocket((prev) => [...prev, qStore.payload]);
    }
    // @ts-expect-error i don;t wanne deal with this
    if (object && !pocket.includes(object)) {
      // @ts-expect-error i don;t wanne deal with this
      setPocket((prev) => [...prev, object]);
    }
  }, [qStore.payload, object, pocket]);

  const [generate, setGenerate] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setGenerate(true);
      toast({
        title: "An error has occured please generate a new question!",
      });
    }
  }, [error, toast]);

  const lastQ = React.useMemo(() => getLastItem(pocket), [pocket]);

  return (
    <div className="flex pt-20 items-center justify-center p-4 min-h-[calc(100vh-7rem)]">
      <div className="max-w-4xl w-full space-y-8 bg-white bg-opacity-10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="bg-indigo-600 bg-opacity-75 p-6">
          <h1 className="text-3xl font-bold text-center text-white">
            NumiQ Practice
          </h1>
          {generate && (
            <Button
              onClick={() => {
                submit(type);
                setGenerate(false);
              }}
            >
              Generate
            </Button>
          )}
        </div>
        <div className="p-8">
          {!selectedTopic ? (
            <TopicSelection
              isLoading={isLoading}
              onSelectTopic={handleTopicSelection}
            />
          ) : (
            <MathJax dynamic inline hideUntilTypeset={"first"}>
              <div className="flex flex-col">
                <div className="space-y-6">
                  <QuestionDisplay
                    isLoading={isLoading}
                    question={lastQ?.question}
                  />
                  <OptionsList
                    options={lastQ?.options}
                    isLoading={isLoading}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-indigo-300">
                      Points: {points}
                    </div>
                    <Button onClick={handleSubmit}>Submit Answer</Button>
                  </div>
                  <FeedbackSection feedback={feedback!} />
                </div>
              </div>
            </MathJax>
          )}
        </div>
      </div>
      {showExplanation && (
        <MathJax>
          <ExplanationModal
            open={showExplanation}
            selectedAnswer={selectedAnswer}
            question={object?.question}
            onClose={() => setShowExplanation(false)}
          />
        </MathJax>
      )}
    </div>
  );
}
