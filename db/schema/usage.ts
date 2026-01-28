import { pgTable, text, timestamp, uuid, integer, pgEnum, date, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const resourceTypeEnum = pgEnum("resource_type", ["chat", "flashcard", "quiz", "summary", "upload"]);

export const usage = pgTable("usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  count: integer("count").notNull().default(1),
  date: date("date").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
