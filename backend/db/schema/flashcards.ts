import { pgTable, text, timestamp, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: difficultyEnum("difficulty").default("medium").notNull(),
  sourceChunkIds: jsonb("source_chunk_ids"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
