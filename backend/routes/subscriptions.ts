import { Elysia } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { users, subscriptionRequests } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { uploadToImageKit } from "../services/document-processor";
import { createSubscriptionRequestSchema } from "../validators/subscriptions";

export const subscriptionsRoutes = new Elysia({ prefix: "/api/subscriptions" })
  // 1. Official payment accounts information
  .get("/payment-info", () => {
    return {
      plan: "The Master Scholar (Pro)",
      price: 500,
      currency: "ETB",
      interval: "month",
      cbe: {
        accountNumber: "1000528855354",
        accountName: "Mubarek Hassen",
        bank: "Commercial Bank of Ethiopia (CBE)",
      },
      telebirr: {
        phoneNumber: "0925036911",
        accountName: "Mubarek Hassen",
      },
    };
  })

  // 2. Upload payment receipt screenshot
  .post("/upload-receipt", async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      const formData = await request.formData();
      const file = formData.get("receipt") as File | null;

      if (!file) {
        set.status = 400;
        return { error: "BadRequest", message: "Receipt image file is required" };
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `receipt_${session.user.id}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      const uploadResult = await uploadToImageKit(safeName, buffer);

      return {
        url: uploadResult.url,
      };
    } catch (error) {
      console.error("[Subscriptions] Receipt upload failed:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to upload receipt screenshot",
      };
    }
  })

  // 3. User's active subscription and pending verification status
  .get("/my-status", async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      });

      if (!dbUser) {
        set.status = 404;
        return { error: "NotFound", message: "User not found" };
      }

      const latestRequest = await db.query.subscriptionRequests.findFirst({
        where: eq(subscriptionRequests.userId, dbUser.id),
        orderBy: [desc(subscriptionRequests.createdAt)],
      });

      return {
        tier: dbUser.tier,
        isPro: dbUser.tier === "pro",
        subscriptionExpiresAt: dbUser.subscriptionExpiresAt,
        buddiesCreatedCount: dbUser.buddiesCreatedCount,
        latestRequest: latestRequest || null,
      };
    } catch (error) {
      console.error("[Subscriptions] Error checking subscription status:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to check subscription status",
      };
    }
  })

  // 4. Submit payment proof
  .post("/submit", async ({ request, body, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user?.id) {
        set.status = 401;
        return { error: "Unauthorized", message: "Authentication required" };
      }

      const parsed = createSubscriptionRequestSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid payment proof submission",
        };
      }

      const { paymentMethod, transactionReference, senderPhone, senderName, receiptUrl } =
        parsed.data;

      // Check if user already has a pending review
      const existingPending = await db.query.subscriptionRequests.findFirst({
        where: and(
          eq(subscriptionRequests.userId, session.user.id),
          eq(subscriptionRequests.status, "pending")
        ),
      });

      if (existingPending) {
        set.status = 400;
        return {
          error: "BadRequest",
          message:
            "You already have a subscription payment proof pending verification. Please wait for administrator approval.",
        };
      }

      const [newRequest] = await db
        .insert(subscriptionRequests)
        .values({
          userId: session.user.id,
          plan: "pro",
          amount: 500,
          currency: "ETB",
          paymentMethod,
          transactionReference,
          senderPhone: senderPhone ?? null,
          senderName: senderName ?? null,
          receiptUrl: receiptUrl ?? null,
          status: "pending",
        })
        .returning();

      return {
        success: true,
        message:
          "Payment proof submitted successfully! The administrator will verify your transaction and activate your Master Scholar plan shortly.",
        request: newRequest,
      };
    } catch (error) {
      console.error("[Subscriptions] Error submitting payment proof:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to submit payment proof",
      };
    }
  });

