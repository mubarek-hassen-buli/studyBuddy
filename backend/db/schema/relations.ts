import { relations } from "drizzle-orm";
import { users } from "./users";
import { studyBuddies } from "./studybuddies";
import { documents } from "./documents";
import { chunks } from "./chunks";
import { flashcards } from "./flashcards";
import { quizzes, quizAttempts } from "./quizzes";
import { summaries } from "./summaries";
import { usage } from "./usage";
import { studySessions } from "./sessions";
import { messages, chatConversations } from "./messages";

// Users -> StudyBuddies, Usage, StudySessions, QuizAttempts, ChatConversations
export const usersRelations = relations(users, ({ many }) => ({
  studyBuddies: many(studyBuddies),
  usage: many(usage),
  studySessions: many(studySessions),
  quizAttempts: many(quizAttempts),
  chatConversations: many(chatConversations),
}));

// StudyBuddies -> User, Documents, Flashcards, Quizzes, Summaries, StudySessions, Messages, ChatConversations
export const studyBuddiesRelations = relations(studyBuddies, ({ one, many }) => ({
  user: one(users, {
    fields: [studyBuddies.userId],
    references: [users.id],
  }),
  documents: many(documents),
  flashcards: many(flashcards),
  quizzes: many(quizzes),
  summaries: many(summaries),
  studySessions: many(studySessions),
  messages: many(messages),
  chatConversations: many(chatConversations),
}));

// Documents -> StudyBuddy, Documents -> Chunks
export const documentsRelations = relations(documents, ({ one, many }) => ({
  studyBuddy: one(studyBuddies, {
    fields: [documents.studyBuddyId],
    references: [studyBuddies.id],
  }),
  chunks: many(chunks),
}));

// Chunks -> Document
export const chunksRelations = relations(chunks, ({ one }) => ({
  document: one(documents, {
    fields: [chunks.documentId],
    references: [documents.id],
  }),
}));

// Flashcards -> StudyBuddy
export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  studyBuddy: one(studyBuddies, {
    fields: [flashcards.studyBuddyId],
    references: [studyBuddies.id],
  }),
}));

// Quizzes -> StudyBuddy, Quizzes -> QuizAttempts
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  studyBuddy: one(studyBuddies, {
    fields: [quizzes.studyBuddyId],
    references: [studyBuddies.id],
  }),
  attempts: many(quizAttempts),
}));

// QuizAttempts -> Quiz, QuizAttempts -> User
export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
}));

// ChatConversations -> User, ChatConversations -> StudyBuddy, ChatConversations -> Messages
export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.id],
  }),
  studyBuddy: one(studyBuddies, {
    fields: [chatConversations.studyBuddyId],
    references: [studyBuddies.id],
  }),
  messages: many(messages),
}));

// Messages -> ChatConversation, Messages -> StudyBuddy
export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [messages.conversationId],
    references: [chatConversations.id],
  }),
  studyBuddy: one(studyBuddies, {
    fields: [messages.studyBuddyId],
    references: [studyBuddies.id],
  }),
}));

// Summaries -> StudyBuddy
export const summariesRelations = relations(summaries, ({ one }) => ({
  studyBuddy: one(studyBuddies, {
    fields: [summaries.studyBuddyId],
    references: [studyBuddies.id],
  }),
}));

// Usage -> User
export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id],
  }),
}));

// StudySessions -> User, StudySessions -> StudyBuddy
export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  studyBuddy: one(studyBuddies, {
    fields: [studySessions.studyBuddyId],
    references: [studyBuddies.id],
  }),
}));

