import { z } from "zod";

export const createSessionSchema = z.object({
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID"),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  scheduledStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid scheduled start datetime",
  }),
  scheduledEnd: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid scheduled end datetime",
  }),
  targetResourceType: z.enum(["general", "quiz", "flashcard", "chat"]).default("general"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const completeSessionSchema = z.object({
  actualDurationSeconds: z.number().int().min(1, "Duration must be at least 1 second"),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;

export const quickLogSessionSchema = z.object({
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID").optional().nullable(),
  title: z.string().min(1, "Title is required").max(100).default("Focused Study Session"),
  durationSeconds: z.number().int().min(1, "Duration must be at least 1 second"),
  notes: z.string().max(500).optional(),
});

export type QuickLogSessionInput = z.infer<typeof quickLogSessionSchema>;
