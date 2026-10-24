import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";

export const summaries = pgTable("summaries", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // short, detailed, key_concepts, exam
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
