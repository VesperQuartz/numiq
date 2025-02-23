import { useChat } from "ai/react";
import { experimental_useObject as useObject } from "ai/react";
import { MathJax } from "better-react-mathjax";
import { Button } from "./ui/button";

import React from "react";
import { LoaderPinwheel } from "lucide-react";
import { match } from "ts-pattern";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { useSaveQuestion } from "@/app/hooks/api";
import { useQueryState } from "nuqs";
import { useToast } from "@/hooks/use-toast";
import { useQuestionStore } from "@/app/store";

interface ExplanationModalProps {
  question: string | undefined;
  selectedAnswer: string | null;
  onClose: () => void;
  open: boolean;
}

export function ExplanationModal({
  onClose,
  question,
  selectedAnswer,
  open,
}: ExplanationModalProps) {
  const [type] = useQueryState("type", {
    clearOnDefault: true,
    defaultValue: "",
  });
  const { isLoading, messages, handleSubmit } = useChat({
    api: "/api/explain",
    body: {
      question,
      answer: selectedAnswer,
    },
  });

  const saveQ = useSaveQuestion();
  const qStore = useQuestionStore();

  const {
    object,
    submit,
    isLoading: newQuestionLoading,
  } = useObject({
    api: "/api/new",
    schema: z.object({
      question: z
        .string()
        .describe(`A well formed maths question similar to ${question}`),
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
  const [submitDone, setSubmitDone] = React.useState(false);

  const submitWithCallback = (question: string) => {
    submit(question);
    setSubmitDone(true); // Set state when submit is done
  };
  const { toast } = useToast();

  React.useEffect(() => {
    if (submitDone && object) {
      saveQ.mutate(
        {
          type,
          answer: object?.answer ?? "",
          question: object?.question ?? "",
        },
        {
          onSuccess: () => {
            toast({
              title: "New Question added to the database",
            });
          },
        },
      );
      qStore.setPayload({ ...object });
      setSubmitDone(false); // Reset state
    }
  }, [
    qStore,
    submitDone,
    object?.answer,
    object?.question,
    saveQ,
    type,
    object,
    toast,
  ]);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    buttonRef.current?.click();
    console.log("I was clicked!");
    handleSubmit(undefined, {
      allowEmptySubmit: true,
    });
  }, [handleSubmit]);

  console.log("LOAD", isLoading);
  console.log("NRW-LOAD", newQuestionLoading);
  console.log("OBJ", object);

  return (
    <Dialog open={open}>
      <DialogContent className="overflow-y-scroll max-h-[650px] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Explanation</DialogTitle>
        </DialogHeader>
        <div>
          {match(isLoading)
            .with(true, () => (
              <div className="flex gap-3">
                Wait while i think of a solution...{" "}
                <LoaderPinwheel className="animate-spin" />
              </div>
            ))
            .with(false, () =>
              messages.map((ans) => {
                return (
                  <p className="text-gray-600 whitespace-pre-line" key={ans.id}>
                    <MathJax dynamic inline hideUntilTypeset={"first"}>
                      {ans.content}
                    </MathJax>
                  </p>
                );
              }),
            )
            .otherwise(() => null)}
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                submitWithCallback(question!);
              }}
              disabled={isLoading || newQuestionLoading || saveQ.isPending}
            >
              Generate
            </Button>
            {object && (
              <Button
                onClick={() => {
                  onClose();
                }}
              >
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
