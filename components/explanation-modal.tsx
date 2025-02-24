/* eslint-disable react-hooks/exhaustive-deps */
import { useChat } from "ai/react";
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

import {
  useGenerateNew,
  useOptions,
  useSaveQuestion,
  useSolve,
} from "@/app/hooks/api";
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

  const gen1 = useGenerateNew();
  const gen2 = useSolve();
  const gen3 = useOptions();
  const saveQ = useSaveQuestion();
  const qStore = useQuestionStore();

  const [submitDone, setSubmitDone] = React.useState(false);

  const { toast } = useToast();

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    buttonRef.current?.click();
    handleSubmit(undefined, {
      allowEmptySubmit: true,
    });
  }, [handleSubmit]);

  React.useEffect(() => {
    if (gen1.object?.question) {
      gen2.submit(gen1.object.question);
    }
  }, [gen1.object?.question]);

  React.useEffect(() => {
    if (gen2.object?.answer) {
      gen3.submit(gen2.object.answer);
      setSubmitDone(true);
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

  React.useEffect(() => {
    if (submitDone && finalQ.options) {
      saveQ.mutate(
        {
          type,
          answer: finalQ?.answer ?? "",
          question: finalQ?.question ?? "",
        },
        {
          onSuccess: () => {
            toast({
              title: "New Question added to the database",
            });
          },
        },
      );
      //@ts-expect-error don't wanna deal with this
      qStore.setPayload({ ...finalQ });
      setSubmitDone(false); // Reset state
    }
  }, [finalQ?.options]);

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
                gen1.submit(question);
              }}
              disabled={gen1.isLoading || gen2.isLoading || gen3.isLoading}
            >
              Generate
            </Button>
            {finalQ.options && (
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
