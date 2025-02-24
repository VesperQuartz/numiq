import { create } from "zustand";

export type Question =
  | Partial<{
      question: string;
      options: string[];
      answer: string;
      explanation: string;
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
