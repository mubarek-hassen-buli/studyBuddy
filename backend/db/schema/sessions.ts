import { pgTable, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { studyBuddies } from "./studybuddies";

export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  studyBuddyId: uuid("study_buddy_id")
    .notNull()
    .references(() => studyBuddies.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualDurationSeconds: integer("actual_duration_seconds").default(0).notNull(),
  status: sessionStatusEnum("status").default("scheduled").notNull(),
  targetResourceType: text("target_resource_type").default("general").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
