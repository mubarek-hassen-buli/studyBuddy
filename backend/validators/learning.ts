import { z } from "zod";

export const reviewFlashcardSchema = z.object({
  mastery: z.enum(["again", "hard", "good", "easy"]).optional(),
  masteryLevel: z.number().int().min(0).max(3).optional(),
});

export type ReviewFlashcardInput = z.infer<typeof reviewFlashcardSchema>;

export const submitQuizAttemptSchema = z.object({
  answers: z.record(z.string(), z.string()).optional().default({}),
  score: z.number().int().min(0, "Score cannot be negative"),
  totalQuestions: z.number().int().min(1, "Total questions must be at least 1"),
  percentage: z.number().int().min(0).max(100, "Percentage must be between 0 and 100"),
});

export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;

export const createQuizSchema = z.object({
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID").optional().nullable(),
  topic: z.string().min(1, "Topic is required").max(120),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  count: z.number().int().min(1).max(20).default(5),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const createFlashcardsSchema = z.object({
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID").optional().nullable(),
  topic: z.string().max(120).optional(),
  count: z.number().int().min(1).max(30).default(5),
});

export type CreateFlashcardsInput = z.infer<typeof createFlashcardsSchema>;
