import { pgTable, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";
import { difficultyEnum } from "./flashcards"; // Reuse difficulty enum if possible, or redefine

// Re-defining enum to avoid circular dependencies or import issues if in separate files without proper exports
// Actually, let's just use the string values or import if strictly typed. 
// For simplicity in schema definition file separation, I'll redefine or just use text with check constraint if Drizzle supports it easily, 
// but PostgreSQL enums are global types. So if I defined 'difficulty' in flashcards.ts, it exists in the DB.
// Drizzle requires importing the enum object to use it in another table definition.
// So I will import it.

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  questions: jsonb("questions").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
