import { pgTable, text, timestamp, uuid, jsonb, pgEnum, boolean } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";
import { users } from "./users";

export const roleEnum = pgEnum("role", ["user", "assistant"]);

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  studyBuddyId: uuid("study_buddy_id").references(() => studyBuddies.id, { onDelete: "set null" }),
  useMaterials: boolean("use_materials").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").references(() => chatConversations.id, { onDelete: "cascade" }),
  studyBuddyId: uuid("study_buddy_id").references(() => studyBuddies.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  sources: jsonb("sources"), // Array of chunk IDs / document references
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

