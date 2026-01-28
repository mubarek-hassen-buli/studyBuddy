import { relations } from "drizzle-orm";
import { users } from "./users";
import { studyBuddies } from "./studybuddies";
import { documents } from "./documents";
import { chunks } from "./chunks";
import { usage } from "./usage";

// Users -> StudyBuddies (One to Many)
export const usersRelations = relations(users, ({ many }) => ({
  studyBuddies: many(studyBuddies),
  usage: many(usage),
}));

// StudyBuddies -> User (Many to One), StudyBuddies -> Documents (One to Many)
export const studyBuddiesRelations = relations(studyBuddies, ({ one, many }) => ({
  user: one(users, {
    fields: [studyBuddies.userId],
    references: [users.id],
  }),
  documents: many(documents),
}));

// Documents -> StudyBuddy (Many to One), Documents -> Chunks (One to Many)
export const documentsRelations = relations(documents, ({ one, many }) => ({
  studyBuddy: one(studyBuddies, {
    fields: [documents.studyBuddyId],
    references: [studyBuddies.id],
  }),
  chunks: many(chunks),
}));

// Chunks -> Document (Many to One)
export const chunksRelations = relations(chunks, ({ one }) => ({
  document: one(documents, {
    fields: [chunks.documentId],
    references: [documents.id],
  }),
}));

// Usage -> User (Many to One)
export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id],
  }),
}));
