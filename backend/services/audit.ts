import { db } from "../db";
import { adminAuditLogs } from "../db/schema/audit-logs";
import crypto from "crypto";

export interface LogAdminActionParams {
  adminId: string;
  adminEmail: string;
  action: string;
  targetId?: string | null;
  targetEmail?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Persists an administrative action to the immutable audit log table.
 * Designed to fail gracefully without crashing primary mutation flow,
 * while ensuring system-level logging for audit trace.
 */
export async function logAdminAction(params: LogAdminActionParams): Promise<void> {
  try {
    await db.insert(adminAuditLogs).values({
      id: crypto.randomUUID(),
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.action,
      targetId: params.targetId ?? null,
      targetEmail: params.targetEmail ?? null,
      details: params.details ?? null,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("[AuditService] Failed to record admin audit log:", error);
  }
}

