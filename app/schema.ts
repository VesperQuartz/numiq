import { InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("name").notNull(),
  password: text("email").unique().notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const questionTable = sqliteTable("question", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  answer: text("answer").notNull(),
  explanation: text("explanation").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  type: text("type").notNull(),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const leaderBoardTable = sqliteTable("leaderboard", {
  id: integer("id").primaryKey(),
  points: integer("points").default(0).notNull(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
    }),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;

export type InsertPost = typeof questionTable.$inferInsert;
export type SelectPost = typeof questionTable.$inferSelect;

export type InsertLeaderboard = typeof leaderBoardTable.$inferInsert;
export type SelectLeaderboard = typeof leaderBoardTable.$inferSelect;

export type Leaderboard = Array<{
  user: SelectUser;
  leaderboard: SelectLeaderboard;
}>;

export type Session = InferSelectModel<typeof sessionTable>;
