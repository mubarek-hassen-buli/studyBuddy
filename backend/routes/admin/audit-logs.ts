import { Elysia } from "elysia";
import { db } from "../../db";
import { adminAuditLogs } from "../../db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { adminGuard } from "../../middleware/admin-guard";
import { listAuditLogsQuerySchema } from "../../validators/admin";

export const adminAuditLogsRoutes = new Elysia({ prefix: "/audit-logs" })
  .use(adminGuard)
  .get("/", async ({ query, set }) => {
    try {
      const parsed = listAuditLogsQuerySchema.safeParse(query);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid query parameters",
        };
      }

      const { page, limit, action, adminId, targetId } = parsed.data;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (action) {
        conditions.push(eq(adminAuditLogs.action, action));
      }

      if (adminId) {
        conditions.push(eq(adminAuditLogs.adminId, adminId));
      }

      if (targetId) {
        conditions.push(eq(adminAuditLogs.targetId, targetId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [countResult, logs] = await Promise.all([
        db.select({ value: count() }).from(adminAuditLogs).where(whereClause),
        db
          .select()
          .from(adminAuditLogs)
          .where(whereClause)
          .orderBy(desc(adminAuditLogs.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = countResult[0]?.value || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("[AdminAuditLogs] Error listing audit logs:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to retrieve audit log trail",
      };
    }
  });
