import { Elysia } from "elysia";
import { db } from "../../db";
import { usage, resourceTypeEnum } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "../auth"; // Use auth to get user

// Quota limits
const QUOTAS = {
  chat: 100,
  flashcard: 20,
  quiz: 10,
  summary: 10,
  upload: 50, // Docs per buddy or total? Plan says 50 docs per buddy. 
              // Usage table tracks generic "upload" count.
              // Let's implement strict per-user daily limits for now.
} as const;

export const quotaChecker = (resourceType: keyof typeof QUOTAS) => {
  return new Elysia({ name: "quota-checker" })
    .derive(async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        return { user: session?.user };
    })
    .onBeforeHandle(async ({ user, set }) => {
      if (!user) {
        set.status = 401;
        return "Unauthorized";
      }

      const today = new Date().toISOString().split("T")[0];

      const usageRecord = await db.query.usage.findFirst({
        where: and(
            eq(usage.userId, user.id),
            eq(usage.resourceType, resourceType),
            eq(usage.date, today)
        )
      });

      const currentCount = usageRecord?.count || 0;

      if (currentCount >= QUOTAS[resourceType]) {
        set.status = 403;
        return `Daily quota exceeded for ${resourceType}. Limit: ${QUOTAS[resourceType]}`;
      }
    });
};

export const incrementQuota = async (userId: string, resourceType: keyof typeof QUOTAS, metadata?: any) => {
    const today = new Date().toISOString().split("T")[0];

    const existing = await db.query.usage.findFirst({
        where: and(
            eq(usage.userId, userId),
            eq(usage.resourceType, resourceType),
            eq(usage.date, today)
        )
    });

    if (existing) {
        await db.update(usage)
            .set({ 
                count: sql`${usage.count} + 1`, 
                updatedAt: new Date(),
                metadata: metadata ? (existing.metadata ? [...(existing.metadata as any[]), metadata] : [metadata]) : existing.metadata
            })
            .where(eq(usage.id, existing.id));
    } else {
        await db.insert(usage).values({
            userId,
            resourceType,
            count: 1,
            date: today,
            metadata: metadata ? [metadata] : null
        });
    }
};
