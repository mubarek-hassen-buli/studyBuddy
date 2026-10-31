import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "super_admin"], {
    message: "Role must be strictly either 'user' or 'super_admin'",
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const updateUserTierSchema = z.object({
  tier: z.enum(["free", "pro"], {
    message: "Tier must be either 'free' or 'pro'",
  }),
});

export type UpdateUserTierInput = z.infer<typeof updateUserTierSchema>;

export const banUserSchema = z.object({
  reason: z.string().trim().min(1, "Ban reason is required").max(500, "Reason cannot exceed 500 characters"),
  expiresAt: z.string().datetime({ message: "Invalid ISO datetime format for expiresAt" }).optional().nullable(),
});

export type BanUserInput = z.infer<typeof banUserSchema>;

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  role: z.enum(["all", "user", "super_admin"]).default("all"),
  tier: z.enum(["all", "free", "pro"]).default("all"),
  status: z.enum(["all", "active", "banned"]).default("all"),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const listMaterialsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  status: z.enum(["all", "pending", "processing", "completed", "failed"]).default("all"),
  fileType: z.enum(["all", "pdf", "docx", "ppt", "txt"]).default("all"),
});

export type ListMaterialsQuery = z.infer<typeof listMaterialsQuerySchema>;

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  action: z.string().trim().optional(),
  adminId: z.string().trim().optional(),
  targetId: z.string().trim().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuerySchema>;
