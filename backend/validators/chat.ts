import { z } from "zod";

export const sendChatMessageSchema = z.object({
  conversationId: z.string().uuid("Invalid Conversation ID").optional().nullable(),
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID").optional().nullable(),
  message: z.string().min(1, "Message cannot be empty").max(4000, "Message is too long"),
  useMaterials: z.boolean().default(true),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;

export const createConversationSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  studyBuddyId: z.string().uuid("Invalid StudyBuddy ID").optional().nullable(),
  useMaterials: z.boolean().default(true),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
