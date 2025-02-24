/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { TopicSelection } from "@/components/topic-selection";
import { QuestionDisplay } from "@/components/question-display";
import { OptionsList } from "@/components/options-list";
import { FeedbackSection } from "@/components/feedback-section";
import { ExplanationModal } from "@/components/explanation-modal";
import { useQueryState } from "nuqs";
import { MathJax } from "better-react-mathjax";
import {
  useAddPoints,
  useGenerate,
  useOptions,
  useSolve,
} from "@/app/hooks/api";
import { Question, useQuestionStore } from "@/app/store";
import React from "react";
import { useToast } from "@/hooks/use-toast";

const getLastItem = (arr: Question[]) => arr[arr.length - 1];
export default function PracticePage() {
  const [type] = useQueryState("type", {
    clearOnDefault: true,
    defaultValue: "",
  });
  const gen1 = useGenerate();
  const gen2 = useSolve();
  const gen3 = useOptions();
  const { toast } = useToast();
  const qStore = useQuestionStore();
  const [pocket, setPocket] = React.useState<Question[]>([]);
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
    gen1.submit(type);
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

    const isCorrect = selectedAnswer === lastQ?.answer;
    setFeedback(
      isCorrect ? "Correct!" : "Incorrect. Let's review the solution.",
    );

    if (isCorrect) {
      setPoints(points + 1); // Increment points for correct answer
      gen1.submit(type);
      setSelectedAnswer(null);
      givePoints.mutate();
      setFeedback(null);
    } else {
      setShowExplanation(true);
    }
  };

  const [generate, setGenerate] = React.useState(false);

  React.useEffect(() => {
    if (gen1.error || gen2.error || gen3.error) {
      setGenerate(true);
      toast({
        title: "An error has occured please generate a new question!",
      });
    }
  }, [gen1.error, gen2.error, gen3.error, toast]);

  React.useEffect(() => {
    if (gen1.object?.question) {
      gen2.submit(gen1.object.question);
    }
  }, [gen1.object?.question]);

  React.useEffect(() => {
    if (gen2.object?.answer) {
      gen3.submit(gen2.object.answer);
    }
  }, [gen2.object?.answer]);

  const finalQ = React.useMemo(
    () => ({
      ...gen1?.object,
      ...gen2.object,
      ...gen3.object,
    }),
    [gen3.object?.options],
  );
  const lastQ = React.useMemo(() => getLastItem(pocket), [pocket]);

  React.useEffect(() => {
    if (qStore.payload && !pocket.includes(qStore.payload)) {
      setPocket((prev) => [...prev, qStore.payload]);
    }
    // @ts-expect-error i don`t wanne deal with this
    if (finalQ && !pocket.includes(finalQ)) {
      // @ts-expect-error i don`t wanne deal with this
      setPocket((prev) => [...prev, finalQ]);
    }
  }, [qStore.payload, pocket, finalQ?.options]);

  return (
    <div className="flex pt-20 items-center justify-center p-4 min-h-[calc(100vh-7rem)]">
      <div className="max-w-4xl w-full space-y-8 bg-white bg-opacity-10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="bg-indigo-600 bg-opacity-75 p-6">
          <Button
            className="bg-black"
            onClick={() => {
              gen1.submit(type);
            }}
          >
            Click Me
          </Button>
          <h1 className="text-3xl font-bold text-center text-white">
            NumiQ Practice
          </h1>
          {generate && (
            <Button
              onClick={() => {
                gen1.submit(type);
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
              isLoading={gen1.isLoading || gen2.isLoading || gen3.isLoading}
              onSelectTopic={handleTopicSelection}
            />
          ) : (
            <MathJax dynamic inline hideUntilTypeset={"first"}>
              <div className="flex flex-col">
                <div className="space-y-6">
                  <QuestionDisplay
                    isLoading={
                      gen1.isLoading || gen2.isLoading || gen3.isLoading
                    }
                    question={lastQ?.question}
                  />
                  <OptionsList
                    options={lastQ?.options}
                    isLoading={
                      gen1.isLoading || gen2.isLoading || gen3.isLoading
                    }
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
            question={lastQ?.question}
            onClose={() => setShowExplanation(false)}
          />
        </MathJax>
      )}
    </div>
  );
}
