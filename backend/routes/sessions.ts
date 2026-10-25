import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { studySessions, studyBuddies, usage } from "../db/schema";
import { eq, and, desc, asc, gte, sql } from "drizzle-orm";
import {
  createSessionSchema,
  completeSessionSchema,
  quickLogSessionSchema,
} from "../validators/sessions";
import { rateLimiter } from "../middleware/rate-limiter";

export const sessionsRoutes = new Elysia({ prefix: "/api/sessions" })
  .use(rateLimiter({ limit: 60, window: 60 }))
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    return { user: session?.user };
  })
  .onBeforeHandle(({ user, set }) => {
    if (!user) {
      set.status = 401;
      return "Unauthorized";
    }
  })
  // 1. Get next upcoming or active session
  .get("/upcoming", async ({ user }) => {
    // Check if there is an in-progress session first
    const inProgress = await db.query.studySessions.findFirst({
      where: and(
        eq(studySessions.userId, user!.id),
        eq(studySessions.status, "in_progress")
      ),
      with: {
        studyBuddy: true,
      },
      orderBy: [desc(studySessions.scheduledStart)],
    });

    if (inProgress) {
      return {
        session: inProgress,
        isActive: true,
      };
    }

    // Otherwise find the closest upcoming session from 2 hours ago onwards
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const upcoming = await db.query.studySessions.findFirst({
      where: and(
        eq(studySessions.userId, user!.id),
        eq(studySessions.status, "scheduled"),
        gte(studySessions.scheduledStart, twoHoursAgo)
      ),
      with: {
        studyBuddy: true,
      },
      orderBy: [asc(studySessions.scheduledStart)],
    });

    return {
      session: upcoming || null,
      isActive: false,
    };
  })
  // 2. List all sessions for user
  .get("/", async ({ user }) => {
    return await db.query.studySessions.findMany({
      where: eq(studySessions.userId, user!.id),
      with: {
        studyBuddy: true,
      },
      orderBy: [desc(studySessions.scheduledStart)],
    });
  })
  // 3. Schedule a new study session
  .post("/", async ({ body, user, set }) => {
    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { studyBuddyId, title, scheduledStart, scheduledEnd, targetResourceType, notes } =
      parsed.data;

    // Verify studyBuddy belongs to user
    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return { message: "StudyBuddy not found" };
    }

    const [created] = await db
      .insert(studySessions)
      .values({
        userId: user!.id,
        studyBuddyId,
        title,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: new Date(scheduledEnd),
        targetResourceType,
        notes: notes || null,
        status: "scheduled",
      })
      .returning();

    return created;
  })
  // 4. Mark session as in-progress
  .patch("/:id/start", async ({ params: { id }, user, set }) => {
    const existing = await db.query.studySessions.findFirst({
      where: and(eq(studySessions.id, id), eq(studySessions.userId, user!.id)),
    });

    if (!existing) {
      set.status = 404;
      return { message: "Session not found" };
    }

    const [updated] = await db
      .update(studySessions)
      .set({
        status: "in_progress",
        updatedAt: new Date(),
      })
      .where(eq(studySessions.id, id))
      .returning();

    return updated;
  })
  // 5. Complete a session with recorded duration
  .post("/:id/complete", async ({ params: { id }, body, user, set }) => {
    const parsed = completeSessionSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { actualDurationSeconds, notes } = parsed.data;

    const existing = await db.query.studySessions.findFirst({
      where: and(eq(studySessions.id, id), eq(studySessions.userId, user!.id)),
    });

    if (!existing) {
      set.status = 404;
      return { message: "Session not found" };
    }

    const [updated] = await db
      .update(studySessions)
      .set({
        status: "completed",
        actualDurationSeconds,
        notes: notes || existing.notes,
        updatedAt: new Date(),
      })
      .where(eq(studySessions.id, id))
      .returning();

    // Record study duration in daily usage
    const today = new Date().toISOString().split("T")[0];
    const minutesStudied = Math.max(1, Math.round(actualDurationSeconds / 60));

    const existingUsage = await db.query.usage.findFirst({
      where: and(
        eq(usage.userId, user!.id),
        eq(usage.resourceType, "chat"), // Leverage usage table tracking
        eq(usage.date, today)
      ),
    });

    if (existingUsage) {
      await db
        .update(usage)
        .set({
          count: sql`${usage.count} + ${minutesStudied}`,
          updatedAt: new Date(),
          metadata: [
            ...(Array.isArray(existingUsage.metadata) ? existingUsage.metadata : []),
            { type: "study_session", durationMinutes: minutesStudied, sessionId: id },
          ],
        })
        .where(eq(usage.id, existingUsage.id));
    } else {
      await db.insert(usage).values({
        userId: user!.id,
        resourceType: "chat",
        count: minutesStudied,
        date: today,
        metadata: [{ type: "study_session", durationMinutes: minutesStudied, sessionId: id }],
      });
    }

    return updated;
  })
  // 6. Quick log ad-hoc stopwatch session
  .post("/quick-log", async ({ body, user, set }) => {
    const parsed = quickLogSessionSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { studyBuddyId, title, durationSeconds, notes } = parsed.data;

    // If studyBuddyId provided, verify. If not, pick user's first buddy.
    let buddyId = studyBuddyId;
    if (!buddyId) {
      const firstBuddy = await db.query.studyBuddies.findFirst({
        where: eq(studyBuddies.userId, user!.id),
      });
      if (firstBuddy) {
        buddyId = firstBuddy.id;
      } else {
        // Create an initial default study companion if none exists yet
        const [defaultBuddy] = await db
          .insert(studyBuddies)
          .values({
            userId: user!.id,
            name: "General Studies",
            subject: "All Subjects",
            description: "Default focus companion",
          })
          .returning();
        buddyId = defaultBuddy.id;
      }
    }

    const startTime = new Date(Date.now() - durationSeconds * 1000);
    const endTime = new Date();

    const [created] = await db
      .insert(studySessions)
      .values({
        userId: user!.id,
        studyBuddyId: buddyId,
        title: title || "Focused Study Session",
        scheduledStart: startTime,
        scheduledEnd: endTime,
        actualDurationSeconds: durationSeconds,
        status: "completed",
        targetResourceType: "general",
        notes: notes || null,
      })
      .returning();

    // Record minutes in usage
    const today = new Date().toISOString().split("T")[0];
    const minutesStudied = Math.max(1, Math.round(durationSeconds / 60));

    const existingUsage = await db.query.usage.findFirst({
      where: and(
        eq(usage.userId, user!.id),
        eq(usage.resourceType, "chat"),
        eq(usage.date, today)
      ),
    });

    if (existingUsage) {
      await db
        .update(usage)
        .set({
          count: sql`${usage.count} + ${minutesStudied}`,
          updatedAt: new Date(),
          metadata: [
            ...(Array.isArray(existingUsage.metadata) ? existingUsage.metadata : []),
            { type: "quick_timer", durationMinutes: minutesStudied, sessionId: created.id },
          ],
        })
        .where(eq(usage.id, existingUsage.id));
    } else {
      await db.insert(usage).values({
        userId: user!.id,
        resourceType: "chat",
        count: minutesStudied,
        date: today,
        metadata: [{ type: "quick_timer", durationMinutes: minutesStudied, sessionId: created.id }],
      });
    }

    return created;
  })
  // 7. Delete / Cancel a session
  .delete("/:id", async ({ params: { id }, user, set }) => {
    const existing = await db.query.studySessions.findFirst({
      where: and(eq(studySessions.id, id), eq(studySessions.userId, user!.id)),
    });

    if (!existing) {
      set.status = 404;
      return { message: "Session not found" };
    }

    await db.delete(studySessions).where(eq(studySessions.id, id));

    return { success: true };
  });
