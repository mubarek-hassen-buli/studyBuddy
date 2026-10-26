import { pgTable, text, timestamp, uuid, jsonb, pgEnum, integer } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: difficultyEnum("difficulty").default("medium").notNull(),
  masteryLevel: integer("mastery_level").default(0).notNull(), // 0: new, 1: learning, 2: reviewed, 3: mastered
  lastReviewedAt: timestamp("last_reviewed_at"),
  nextReviewAt: timestamp("next_review_at"),
  sourceChunkIds: jsonb("source_chunk_ids"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

