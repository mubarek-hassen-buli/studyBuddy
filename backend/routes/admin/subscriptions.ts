import { Elysia } from "elysia";
import { db } from "../../db";
import { users, subscriptionRequests } from "../../db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { adminGuard } from "../../middleware/admin-guard";
import { logAdminAction } from "../../services/audit";
import {
  listSubscriptionsQuerySchema,
  reviewSubscriptionRequestSchema,
} from "../../validators/subscriptions";

export const adminSubscriptionsRoutes = new Elysia({ prefix: "/subscriptions" })
  .use(adminGuard)

  // 1. List subscription requests with user profile details
  .get("/", async ({ query, set }) => {
    try {
      const parsed = listSubscriptionsQuerySchema.safeParse(query);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid query parameters",
        };
      }

      const { page, limit, status, paymentMethod } = parsed.data;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (status !== "all") {
        conditions.push(eq(subscriptionRequests.status, status));
      }

      if (paymentMethod !== "all") {
        conditions.push(eq(subscriptionRequests.paymentMethod, paymentMethod));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [countResult, requestsList] = await Promise.all([
        db
          .select({ value: count() })
          .from(subscriptionRequests)
          .where(whereClause),
        db
          .select({
            id: subscriptionRequests.id,
            userId: subscriptionRequests.userId,
            userName: users.name,
            userEmail: users.email,
            userCurrentTier: users.tier,
            plan: subscriptionRequests.plan,
            amount: subscriptionRequests.amount,
            currency: subscriptionRequests.currency,
            paymentMethod: subscriptionRequests.paymentMethod,
            transactionReference: subscriptionRequests.transactionReference,
            senderPhone: subscriptionRequests.senderPhone,
            senderName: subscriptionRequests.senderName,
            receiptUrl: subscriptionRequests.receiptUrl,
            status: subscriptionRequests.status,
            adminNotes: subscriptionRequests.adminNotes,
            reviewedBy: subscriptionRequests.reviewedBy,
            reviewedAt: subscriptionRequests.reviewedAt,
            createdAt: subscriptionRequests.createdAt,
            updatedAt: subscriptionRequests.updatedAt,
          })
          .from(subscriptionRequests)
          .innerJoin(users, eq(subscriptionRequests.userId, users.id))
          .where(whereClause)
          .orderBy(desc(subscriptionRequests.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = countResult[0]?.value || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        requests: requestsList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("[AdminSubscriptions] Error listing subscription requests:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to retrieve subscription requests",
      };
    }
  })

  // 2. Approve Subscription & Activate Pro
  .post("/:id/approve", async ({ params: { id }, body, adminUser, clientIp, userAgent, set }) => {
    try {
      const parsed = reviewSubscriptionRequestSchema.safeParse(body || {});
      const notes = parsed.success ? parsed.data.notes : null;

      const subRequest = await db.query.subscriptionRequests.findFirst({
        where: eq(subscriptionRequests.id, id),
      });

      if (!subRequest) {
        set.status = 404;
        return { error: "NotFound", message: "Subscription request not found" };
      }

      if (subRequest.status === "approved") {
        return {
          success: true,
          message: "This subscription request has already been approved.",
        };
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, subRequest.userId),
      });

      if (!targetUser) {
        set.status = 404;
        return { error: "NotFound", message: "User account associated with this request not found" };
      }

      // 30 days subscription duration
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Execute approval and user tier update in database transaction
      await db.transaction(async (tx) => {
        await tx
          .update(subscriptionRequests)
          .set({
            status: "approved",
            adminNotes: notes || "Payment verified and approved by Super Admin",
            reviewedBy: adminUser!.id,
            reviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptionRequests.id, id));

        await tx
          .update(users)
          .set({
            tier: "pro",
            subscriptionExpiresAt: expiresAt,
            updatedAt: new Date(),
          })
          .where(eq(users.id, targetUser.id));
      });

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "SUBSCRIPTION_APPROVED",
        targetId: targetUser.id,
        targetEmail: targetUser.email,
        details: {
          requestId: id,
          paymentMethod: subRequest.paymentMethod,
          transactionReference: subRequest.transactionReference,
          amount: subRequest.amount,
          expiresAt: expiresAt.toISOString(),
          notes,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: `Subscription approved successfully. Pro tier activated for ${targetUser.name} until ${expiresAt.toLocaleDateString()}.`,
      };
    } catch (error) {
      console.error("[AdminSubscriptions] Error approving subscription:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to approve subscription",
      };
    }
  })

  // 3. Reject Subscription
  .post("/:id/reject", async ({ params: { id }, body, adminUser, clientIp, userAgent, set }) => {
    try {
      const parsed = reviewSubscriptionRequestSchema.safeParse(body || {});
      const notes = parsed.success ? parsed.data.notes : null;

      const subRequest = await db.query.subscriptionRequests.findFirst({
        where: eq(subscriptionRequests.id, id),
      });

      if (!subRequest) {
        set.status = 404;
        return { error: "NotFound", message: "Subscription request not found" };
      }

      const targetUser = await db.query.users.findFirst({
        where: eq(users.id, subRequest.userId),
      });

      await db
        .update(subscriptionRequests)
        .set({
          status: "rejected",
          adminNotes: notes || "Payment proof could not be verified.",
          reviewedBy: adminUser!.id,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptionRequests.id, id));

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "SUBSCRIPTION_REJECTED",
        targetId: targetUser?.id,
        targetEmail: targetUser?.email,
        details: {
          requestId: id,
          paymentMethod: subRequest.paymentMethod,
          transactionReference: subRequest.transactionReference,
          notes,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: "Subscription request rejected.",
      };
    } catch (error) {
      console.error("[AdminSubscriptions] Error rejecting subscription:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to reject subscription",
      };
    }
  });

