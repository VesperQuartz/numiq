import { create } from "zustand";

export type Question =
  | Partial<{
      question: string;
      options: string[];
      answer: "A" | "B" | "C" | "D";
    }>
  | undefined;
type QuestionStore = {
  payload: Question;
  setPayload: (payload: Question) => void;
};

export const useQuestionStore = create<QuestionStore>()((set) => ({
  payload: undefined,
  setPayload: (payload) => set({ payload }),
}));
