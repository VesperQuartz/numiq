import { useMutation, useQuery } from "@tanstack/react-query";
import { experimental_useObject as useObject } from "ai/react";
import {
  addPoints,
  leaderboard,
  login,
  register,
  saveQuestion,
} from "../services/api";
import { InsertUser } from "../schema";
import {
  MathQuestionGenSchema,
  MathQuestionOptionSchema,
  MathQuestionSolveSchema,
} from "../schema/index";

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: ({ username, password }: InsertUser) =>
      register({ username, password }),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: ({ username, password }: InsertUser) =>
      login({ username, password }),
  });
};

export const useAddPoints = () => {
  return useMutation({
    mutationKey: ["add-points"],
    mutationFn: () => addPoints(),
  });
};

export const useGetLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => leaderboard(),
  });
};

export const useSaveQuestion = () => {
  return useMutation({
    mutationKey: ["save-question"],
    mutationFn: ({
      question,
      answer,
      type,
    }: {
      question: string;
      answer: string;
      type: string;
    }) =>
      saveQuestion({
        question,
        answer,
        type,
      }),
  });
};

export const useGenerate = () => {
  return useObject({
    api: "/api/generate-question",
    schema: MathQuestionGenSchema,
  });
};

export const useGenerateNew = () => {
  return useObject({
    api: "/api/generate-new",
    schema: MathQuestionGenSchema,
  });
};

export const useSolve = () => {
  return useObject({
    api: "/api/solve-questions",
    schema: MathQuestionSolveSchema,
  });
};

export const useOptions = () => {
  return useObject({
    api: "/api/generate-options",
    schema: MathQuestionOptionSchema,
  });
};
