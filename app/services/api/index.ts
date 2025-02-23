import { InsertUser, Leaderboard } from "@/app/schema";
import to from "await-to-ts";
import { Session } from "inspector/promises";
import ky, { HTTPError } from "ky";

export const register = async ({ username, password }: InsertUser) => {
  const [resError, response] = await to(
    ky
      .post("/api/auth/register", {
        json: { username, password },
      })
      .json<Session & { message: string }>(),
  );
  if (resError instanceof HTTPError) {
    console.log(resError);
    throw await resError.response.json();
  }
  return response;
};

export const login = async ({ username, password }: InsertUser) => {
  const [resError, response] = await to(
    ky
      .post("/api/auth/login", {
        json: { username, password },
      })
      .json<Session & { message: string }>(),
  );
  if (resError instanceof HTTPError) {
    console.log(resError);
    throw await resError.response.json();
  }
  return response;
};

export const addPoints = async () => {
  const [error, response] = await to(
    ky
      .patch("/api/points", {
        json: {},
      })
      .json<{ message: string }>(),
  );
  if (error instanceof HTTPError) {
    console.log(error);
    throw await error.response.json();
  }
  return response;
};

export const leaderboard = async () => {
  const [error, response] = await to(
    ky.get("/api/leaderboard").json<Leaderboard>(),
  );
  if (error instanceof HTTPError) {
    console.log(error);
    throw await error.response.json();
  }
  return response;
};

export const saveQuestion = async ({
  question,
  answer,
  type,
}: {
  question: string;
  answer: string;
  type: string;
}) => {
  const [error, response] = await to(
    ky
      .post("/api/save", {
        json: { question, type, answer },
      })
      .json<Leaderboard>(),
  );
  if (error instanceof HTTPError) {
    console.log(error);
    throw await error.response.json();
  }
  return response;
};
