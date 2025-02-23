import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addPoints,
  leaderboard,
  login,
  register,
  saveQuestion,
} from "../services/api";
import { InsertUser } from "../schema";

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
