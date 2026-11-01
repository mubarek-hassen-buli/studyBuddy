import { z } from "zod";

export const createSubscriptionRequestSchema = z.object({
  paymentMethod: z.enum(["cbe", "telebirr"], {
    message: "Payment method must be either 'cbe' or 'telebirr'",
  }),
  transactionReference: z
    .string()
    .trim()
    .min(3, "Transaction reference must be at least 3 characters")
    .max(100, "Transaction reference cannot exceed 100 characters"),
  senderPhone: z.string().trim().max(30).optional().nullable(),
  senderName: z.string().trim().max(100).optional().nullable(),
  receiptUrl: z.string().url("Invalid receipt URL").optional().nullable(),
});

export type CreateSubscriptionRequestInput = z.infer<typeof createSubscriptionRequestSchema>;

export const reviewSubscriptionRequestSchema = z.object({
  notes: z.string().trim().max(500).optional().nullable(),
});

export type ReviewSubscriptionRequestInput = z.infer<typeof reviewSubscriptionRequestSchema>;

export const listSubscriptionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["all", "pending", "approved", "rejected"]).default("all"),
  paymentMethod: z.enum(["all", "cbe", "telebirr"]).default("all"),
});

export type ListSubscriptionsQuery = z.infer<typeof listSubscriptionsQuerySchema>;

