import { Elysia } from "elysia";
import { db } from "../../db";
import {
  users,
  sessions,
  studyBuddies,
  documents,
  flashcards,
  quizzes,
  quizAttempts,
  studySessions,
  adminAuditLogs,
} from "../../db/schema";
import { eq, and, or, ilike, count, sum, avg, desc, inArray } from "drizzle-orm";
import { logAdminAction } from "../../services/audit";
import { adminGuard } from "../../middleware/admin-guard";
import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserTierSchema,
  banUserSchema,
} from "../../validators/admin";

export const adminUsersRoutes = new Elysia({ prefix: "/users" })
  .use(adminGuard)

  // 1. List users with pagination and filtering
  .get("/", async ({ query, set }) => {
    try {
      const parsed = listUsersQuerySchema.safeParse(query);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid query parameters",
        };
      }

      const { page, limit, q, role, tier, status } = parsed.data;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (q) {
        const searchPattern = `%${q}%`;
        conditions.push(or(ilike(users.name, searchPattern), ilike(users.email, searchPattern)));
      }

      if (role !== "all") {
        conditions.push(eq(users.role, role));
      }

      if (tier !== "all") {
        conditions.push(eq(users.tier, tier));
      }

      if (status === "active") {
        conditions.push(eq(users.banned, false));
      } else if (status === "banned") {
        conditions.push(eq(users.banned, true));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [countResult, userList] = await Promise.all([
        db.select({ value: count() }).from(users).where(whereClause),
        db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            tier: users.tier,
            banned: users.banned,
            banReason: users.banReason,
            banExpires: users.banExpires,
            image: users.image,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where(whereClause)
          .orderBy(desc(users.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = countResult[0]?.value || 0;
      const totalPages = Math.ceil(total / limit);

      // Enrich user list with buddy and document counts
      const enrichedUsers = await Promise.all(
        userList.map(async (u) => {
          const buddies = await db
            .select({ id: studyBuddies.id })
            .from(studyBuddies)
            .where(eq(studyBuddies.userId, u.id));

          const buddyIds = buddies.map((b) => b.id);
          let documentCount = 0;
          if (buddyIds.length > 0) {
            const [docCountRow] = await db
              .select({ value: count() })
              .from(documents)
              .where(inArray(documents.studyBuddyId, buddyIds));
            documentCount = docCountRow?.value || 0;
          }

          return {
            ...u,
            stats: {
              studyBuddiesCount: buddies.length,
              documentsCount: documentCount,
            },
          };
        })
      );

      return {
        users: enrichedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("[AdminUsers] Error listing users:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to retrieve user directory",
      };
    }
  })

  // 2. Get single user details and aggregates
  .get("/:id", async ({ params: { id }, set }) => {
    try {
      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      const userBuddies = await db
        .select({ id: studyBuddies.id })
        .from(studyBuddies)
        .where(eq(studyBuddies.userId, id));

      const buddyIds = userBuddies.map((b) => b.id);

      let documentsCount = 0;
      let totalStorageBytes = 0;
      let flashcardsCount = 0;
      let quizzesCount = 0;

      if (buddyIds.length > 0) {
        const [[docStats], [flashcardStats], [quizStats]] = await Promise.all([
          db
            .select({ count: count(), totalBytes: sum(documents.fileSize) })
            .from(documents)
            .where(inArray(documents.studyBuddyId, buddyIds)),
          db
            .select({ count: count() })
            .from(flashcards)
            .where(inArray(flashcards.studyBuddyId, buddyIds)),
          db
            .select({ count: count() })
            .from(quizzes)
            .where(inArray(quizzes.studyBuddyId, buddyIds)),
        ]);

        documentsCount = docStats?.count || 0;
        totalStorageBytes = Number(docStats?.totalBytes || 0);
        flashcardsCount = flashcardStats?.count || 0;
        quizzesCount = quizStats?.count || 0;
      }

      const [[attemptStats], [sessionStats], recentAuditLogs] = await Promise.all([
        db
          .select({ count: count(), avgPercentage: avg(quizAttempts.percentage) })
          .from(quizAttempts)
          .where(eq(quizAttempts.userId, id)),
        db
          .select({
            count: count(),
            totalDurationSeconds: sum(studySessions.actualDurationSeconds),
          })
          .from(studySessions)
          .where(eq(studySessions.userId, id)),
        db
          .select()
          .from(adminAuditLogs)
          .where(eq(adminAuditLogs.targetId, id))
          .orderBy(desc(adminAuditLogs.createdAt))
          .limit(10),
      ]);

      return {
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          role: targetUser.role,
          tier: targetUser.tier,
          banned: targetUser.banned,
          banReason: targetUser.banReason,
          banExpires: targetUser.banExpires,
          image: targetUser.image,
          createdAt: targetUser.createdAt,
          updatedAt: targetUser.updatedAt,
        },
        stats: {
          studyBuddiesCount: userBuddies.length,
          documentsCount,
          storageBytes: totalStorageBytes,
          storageMegabytes: Math.round((totalStorageBytes / (1024 * 1024)) * 100) / 100,
          flashcardsCount,
          quizzesCount,
          quizAttemptsCount: attemptStats?.count || 0,
          averageQuizPercentage: Math.round(Number(attemptStats?.avgPercentage || 0)),
          studySessionsCount: sessionStats?.count || 0,
          totalStudyMinutes: Math.round(Number(sessionStats?.totalDurationSeconds || 0) / 60),
        },
        auditHistory: recentAuditLogs,
      };
    } catch (error) {
      console.error("[AdminUsers] Error retrieving user details:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to retrieve user details",
      };
    }
  })

  // 3. Update User Role (strictly "user" or "super_admin")
  .patch("/:id/role", async ({ params: { id }, body, adminUser, clientIp, userAgent, set }) => {
    try {
      const parsed = updateUserRoleSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid role specification",
        };
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      if (targetUser.role === parsed.data.role) {
        return {
          success: true,
          message: `User is already assigned the role '${targetUser.role}'`,
          user: targetUser,
        };
      }

      // Concurrency and system safety: Prevent demoting the last remaining super_admin
      if (targetUser.role === "super_admin" && parsed.data.role === "user") {
        const [superAdminCount] = await db
          .select({ value: count() })
          .from(users)
          .where(eq(users.role, "super_admin"));

        if ((superAdminCount?.value || 0) <= 1) {
          set.status = 400;
          return {
            error: "BadRequest",
            message: "Cannot demote the last remaining super administrator in the system.",
          };
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set({ role: parsed.data.role, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "USER_ROLE_UPDATE",
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        details: {
          previousRole: targetUser.role,
          newRole: parsed.data.role,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: `User role successfully updated to ${parsed.data.role}`,
        user: updatedUser,
      };
    } catch (error) {
      console.error("[AdminUsers] Error updating role:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to update user role",
      };
    }
  })

  // 4. Update User Subscription Tier ("free" | "pro")
  .patch("/:id/tier", async ({ params: { id }, body, adminUser, clientIp, userAgent, set }) => {
    try {
      const parsed = updateUserTierSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid tier specification",
        };
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      if (targetUser.tier === parsed.data.tier) {
        return {
          success: true,
          message: `User is already assigned tier '${targetUser.tier}'`,
          user: targetUser,
        };
      }

      const [updatedUser] = await db
        .update(users)
        .set({ tier: parsed.data.tier, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "USER_TIER_UPDATE",
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        details: {
          previousTier: targetUser.tier,
          newTier: parsed.data.tier,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: `User tier successfully updated to ${parsed.data.tier}`,
        user: updatedUser,
      };
    } catch (error) {
      console.error("[AdminUsers] Error updating tier:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to update user tier",
      };
    }
  })

  // 5. Suspend/Ban User
  .post("/:id/ban", async ({ params: { id }, body, adminUser, clientIp, userAgent, set }) => {
    try {
      const parsed = banUserSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid ban parameters",
        };
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      // Security safeguards
      if (targetUser.id === adminUser!.id) {
        set.status = 400;
        return {
          error: "BadRequest",
          message: "You cannot suspend your own super administrator account.",
        };
      }

      if (targetUser.role === "super_admin") {
        set.status = 400;
        return {
          error: "BadRequest",
          message: "Cannot suspend a super administrator. Demote the role to 'user' first if suspension is required.",
        };
      }

      const banExpiresDate = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null;

      // Wrap in atomic transaction: update user status and revoke all active sessions
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            banned: true,
            banReason: parsed.data.reason,
            banExpires: banExpiresDate,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));

        // Revoke active sessions immediately
        await tx.delete(sessions).where(eq(sessions.userId, id));
      });

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "USER_BANNED",
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        details: {
          reason: parsed.data.reason,
          expiresAt: parsed.data.expiresAt ?? null,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: "User suspended successfully and active sessions revoked.",
      };
    } catch (error) {
      console.error("[AdminUsers] Error suspending user:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to suspend user account",
      };
    }
  })

  // 6. Unban/Reinstate User
  .post("/:id/unban", async ({ params: { id }, adminUser, clientIp, userAgent, set }) => {
    try {
      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      if (!targetUser.banned) {
        return {
          success: true,
          message: "User is already active and not suspended.",
        };
      }

      await db
        .update(users)
        .set({
          banned: false,
          banReason: null,
          banExpires: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "USER_UNBANNED",
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        details: {
          previousReason: targetUser.banReason,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: "User suspended status cleared successfully.",
      };
    } catch (error) {
      console.error("[AdminUsers] Error reinstating user:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to reinstate user account",
      };
    }
  });
