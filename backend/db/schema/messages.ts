import { pgTable, text, timestamp, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";

export const roleEnum = pgEnum("role", ["user", "assistant"]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  sources: jsonb("sources"), // Array of chunk IDs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
