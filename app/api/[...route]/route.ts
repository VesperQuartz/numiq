import { Hono } from "hono";
import { match } from "ts-pattern";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { leaderBoardTable, questionTable, userTable } from "@/app/schema";
import { db } from "@/lib/database";
import { eq, sql } from "drizzle-orm";
import { to } from "await-to-ts";
import argon2 from "argon2";

// const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  setSessionTokenCookie,
} from "@/lib/lucia";
import {
  GEN1,
  GEN2,
  GEN3,
  MathQuestionGenSchema,
  MathQuestionOptionSchema,
  MathQuestionSchema,
  MathQuestionSolveSchema,
  SimilarQuestionSchema,
  SYSTEM,
  SYSTEM2,
} from "@/app/schema/index";

export const maxDuration = 30;

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

app.post(
  "/auth/register",
  zValidator(
    "json",
    z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    }),
  ),
  async (c) => {
    const { username, password } = c.req.valid("json");
    const [checkError, user] = await to(
      db.select().from(userTable).where(eq(userTable.username, username)),
    );

    if (checkError) {
      console.error(checkError, "EXIST::ERROR");
      return c.json({ message: "Something went wrong" }, 500);
    }

    if (user[0]) {
      return c.json({ message: "User already exists" }, 400);
    }
    const [hashError, hash] = await to(argon2.hash(password));
    if (hashError) {
      console.error(hashError, "HASH::ERROR");
      return c.json({ message: "Something went wrong" }, 500);
    }

    const [createError, data] = await to(
      db
        .insert(userTable)
        .values({
          username,
          password: hash,
        })
        .returning(),
    );

    if (createError) {
      console.error(createError, "CREATE::ERROR");
      return c.json({ message: "Something went wrong" }, 500);
    }

    const token = generateSessionToken();
    const session = await createSession(token, data[0].id);
    await setSessionTokenCookie(token, session.expiresAt);

    return c.json({
      message: "Account created successfully",
      ...session,
    });
  },
);

app.post(
  "/auth/login",
  zValidator(
    "json",
    z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    }),
  ),
  async (c) => {
    const { username, password } = c.req.valid("json");
    const [checkError, user] = await to(
      db.select().from(userTable).where(eq(userTable.username, username)),
    );

    if (checkError) {
      console.error(checkError);
      return c.json({ message: "Something went wrong" }, 500);
    }

    if (!user[0]) {
      console.error("User not found");
      return c.json({ message: "Username or password incorrect" }, 400);
    }

    const [verifyError, verified] = await to(
      argon2.verify(user[0].password, password),
    );

    if (verifyError) {
      console.error(verifyError);
      return c.json({ message: "Something went wrong" }, 500);
    }

    if (!verified) {
      return c.json({ message: "Username or password incorrect" }, 400);
    }

    const token = generateSessionToken();
    const session = await createSession(token, user[0].id);
    await setSessionTokenCookie(token, session.expiresAt);

    return c.json({
      message: "Login was a success",
      ...session,
    });
  },
);

app.post("/questions", zValidator("json", z.string()), async (c) => {
  const messages = await c.req.json();
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const type = match(messages)
    .with("algebraic-equations", () => "algebraic equations problems")
    .with("geometry-problems", () => "geometry  equations problems")
    .with("word-problems", () => "word problems")
    .otherwise(() => "");

  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    prompt: `Generate a unique and challenging mathematics question on ${type}.`,
    schemaName: "Maths",
    temperature: 0.7, // Lower temperature for more reliable outputs
    schema: MathQuestionSchema,
    system: SYSTEM(type),
  });
  return c.json(object);
});

app.post("/generate-question", zValidator("json", z.string()), async (c) => {
  const messages = await c.req.json();
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const type = match(messages)
    .with("algebraic-equations", () => "algebraic equations problems")
    .with("geometry-problems", () => "geometry  equations problems")
    .with("word-problems", () => "word problems")
    .otherwise(() => "");

  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    prompt: `Generate a unique and challenging mathematics question on ${type}.`,
    schemaName: "Maths",
    temperature: 0.7, // Lower temperature for more reliable outputs
    schema: MathQuestionGenSchema,
    system: GEN1(type),
  });
  return c.json(object);
});

app.post("/solve-questions", zValidator("json", z.string()), async (c) => {
  const messages = await c.req.json();
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    prompt: `Solve this math question ${messages}`,
    schemaName: "Maths",
    schema: MathQuestionSolveSchema,
    system: GEN2(),
  });
  return c.json(object);
});

app.post("/generate-options", zValidator("json", z.string()), async (c) => {
  const messages = await c.req.json();
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    prompt: `The answer to a math question is ${messages}. generate more answer similar to it`,
    schemaName: "Maths",
    temperature: 0.8, // Lower temperature for more reliable outputs
    schema: MathQuestionOptionSchema,
    system: GEN3(),
  });
  console.log("option-gen", object);
  return c.json(object);
});

app.post("/explain", async (c) => {
  const { question, answer } = await c.req.json();
  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    prompt: `A user was asked the question
      Question: ${question}
      and their answer was
      Answer: ${answer}
      The answer is wrong, please solve it by explaining to them how to solve this question correctly and what the right answer is
    `,
    system: `
      You're an exprienced math teacher explaining a math concept to a student. The student is struggling to understand the concept and you need to explain it in a way that they can understand. 
      latex symbols used should be correct and compatable with better-react-mathjax library.
    `,
  });
  return result.toDataStreamResponse();
});

app.post("/new", async (c) => {
  const question = await c.req.json();
  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    schemaName: "Maths",
    temperature: 0.9,
    schema: SimilarQuestionSchema,
    prompt: `Analyze the following question and generate a new one that tests the same concept but with different numbers, context, or approach:
    Original question: ${JSON.stringify(question)}`,
    system: SYSTEM2(),
  });
  return c.json(object);
});

app.post("/generate-new", async (c) => {
  const question = await c.req.json();
  const { object } = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    schemaName: "Maths",
    temperature: 0.9,
    schema: MathQuestionGenSchema,
    prompt: `Analyze the following question and generate a new one that tests the same mathematical concept but with different numbers, context, or approach:
    Original question: ${question}`,
    system: `You are an expert mathematics teacher specializing in adaptive learning. Your goal is to help students deeply understand mathematical concepts by generating practice questions that maintain the core learning objective while varying the presentation and numbers.
CORE PRINCIPLES:
- Focus on understanding over memorization
- Maintain consistent difficulty level with the original question
- Preserve the fundamental concept being tested
- Vary superficial elements to ensure genuine understanding`,
  });
  return c.json(object);
});

app.patch("/points", async (c) => {
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const [error] = await to(
    db
      .insert(leaderBoardTable)
      .values({ points: 1, userId: session.user.id })
      .onConflictDoUpdate({
        target: leaderBoardTable.userId,
        set: {
          points: sql`${leaderBoardTable.points} + 1`,
        },
      })
      .returning(),
  );
  if (error) {
    console.error(error.message);
    return c.json({ message: "Something went wrong" }, 500);
  }
  return c.json({ message: "Points updated successfully" });
});

app.post("/save", async (c) => {
  const { question, answer, type } = await c.req.json();
  const session = await getCurrentSession();
  if (!session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const [error] = await to(
    db.insert(questionTable).values({
      answer: answer,
      text: question,
      explanation: "",
      type,
      userId: session.user.id,
    }),
  );
  if (error) {
    console.error(error.message);
    return c.json({ message: "Something went wrong" }, 500);
  }
  return c.json({ message: "New Question generated" });
});

app.get("/leaderboard", async (c) => {
  const [error, leaderboard] = await to(
    db
      .select({
        user: userTable,
        leaderboard: leaderBoardTable,
      })
      .from(leaderBoardTable)
      .leftJoin(userTable, eq(leaderBoardTable.userId, userTable.id))
      .orderBy(leaderBoardTable.points),
  );
  if (error) {
    console.error(error.message);
    return c.json({ message: "Something went wrong" }, 500);
  }
  return c.json(leaderboard);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
