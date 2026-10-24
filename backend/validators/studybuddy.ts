import { z } from "zod";

export const createStudyBuddySchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().optional(),
  description: z.string().optional(),
});

export const updateStudyBuddySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
});

export type CreateStudyBuddyInput = z.infer<typeof createStudyBuddySchema>;
export type UpdateStudyBuddyInput = z.infer<typeof updateStudyBuddySchema>;
