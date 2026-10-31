import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

export const adminAuditLogs = pgTable("admin_audit_log", {
  id: text("id").primaryKey(),
  adminId: text("adminId").notNull().references(() => users.id, { onDelete: "cascade" }),
  adminEmail: text("adminEmail").notNull(),
  action: text("action").notNull(),
  targetId: text("targetId"),
  targetEmail: text("targetEmail"),
  details: jsonb("details"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type NewAdminAuditLog = typeof adminAuditLogs.$inferInsert;

