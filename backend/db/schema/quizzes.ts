import { pgTable, text, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";
import { users } from "./users";
import { difficultyEnum } from "./flashcards";

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  title: text("title"),
  topic: text("topic"),
  questions: jsonb("questions").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  percentage: integer("percentage").notNull(),
  answers: jsonb("answers"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

