import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import {
  studySessions,
  studyBuddies,
  usage,
  quizAttempts,
  flashcards,
  messages,
  chatConversations,
} from "../db/schema";
import { eq, and, desc, asc, gte, sql, count } from "drizzle-orm";
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
  // 0a. Real-time Daily Goals Progress
  .get("/daily-goals", async ({ user }) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString().split("T")[0];

    // 1. Study time today (sum of completed session durations in minutes)
    const todaySessions = await db
      .select({
        durationSeconds: studySessions.actualDurationSeconds,
      })
      .from(studySessions)
      .where(
        and(
          eq(studySessions.userId, user!.id),
          eq(studySessions.status, "completed"),
          gte(studySessions.updatedAt, todayStart)
        )
      );

    let sessionMinutes = 0;
    todaySessions.forEach((s) => {
      sessionMinutes += Math.round((s.durationSeconds || 0) / 60);
    });

    // Also check usage table for today
    const [todayUsage] = await db
      .select({ count: usage.count })
      .from(usage)
      .where(
        and(
          eq(usage.userId, user!.id),
          eq(usage.resourceType, "chat"),
          eq(usage.date, todayStr)
        )
      );
    const totalStudyMinutes = Math.max(sessionMinutes, Number(todayUsage?.count || 0));

    // 2. Quizzes completed today
    const [quizzesToday] = await db
      .select({ value: count() })
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.userId, user!.id),
          gte(quizAttempts.completedAt, todayStart)
        )
      );
    const quizzesCount = Number(quizzesToday?.value || 0);

    // 3. Flashcards reviewed today
    const [cardsToday] = await db
      .select({ value: count() })
      .from(flashcards)
      .innerJoin(studyBuddies, eq(flashcards.studyBuddyId, studyBuddies.id))
      .where(
        and(
          eq(studyBuddies.userId, user!.id),
          gte(flashcards.lastReviewedAt, todayStart)
        )
      );
    const flashcardsCount = Number(cardsToday?.value || 0);

    // 4. Questions asked today (chat messages)
    const [questionsToday] = await db
      .select({ value: count() })
      .from(messages)
      .innerJoin(chatConversations, eq(messages.conversationId, chatConversations.id))
      .where(
        and(
          eq(chatConversations.userId, user!.id),
          eq(messages.role, "user"),
          gte(messages.createdAt, todayStart)
        )
      );
    const questionsCount = Number(questionsToday?.value || 0);

    const goals = [
      {
        id: "study_time",
        title: "Daily Study Target",
        target: 30,
        current: totalStudyMinutes,
        unit: "mins",
        completed: totalStudyMinutes >= 30,
        percentage: Math.min(100, Math.round((totalStudyMinutes / 30) * 100)),
      },
      {
        id: "quizzes",
        title: "Daily Quiz Challenge",
        target: 1,
        current: quizzesCount,
        unit: "quiz",
        completed: quizzesCount >= 1,
        percentage: Math.min(100, Math.round((quizzesCount / 1) * 100)),
      },
      {
        id: "flashcards",
        title: "Flashcard Revision",
        target: 10,
        current: flashcardsCount,
        unit: "cards",
        completed: flashcardsCount >= 10,
        percentage: Math.min(100, Math.round((flashcardsCount / 10) * 100)),
      },
      {
        id: "chat_questions",
        title: "Curiosity Inquiries",
        target: 2,
        current: questionsCount,
        unit: "queries",
        completed: questionsCount >= 2,
        percentage: Math.min(100, Math.round((questionsCount / 2) * 100)),
      },
    ];

    const completedGoalsCount = goals.filter((g) => g.completed).length;

    return {
      date: todayStr,
      completedGoalsCount,
      totalGoalsCount: goals.length,
      allCompleted: completedGoalsCount === goals.length,
      goals,
    };
  })
  // 0b. Active Streak Calculation
  .get("/streak", async ({ user }) => {
    const usageDates = await db
      .select({ date: usage.date })
      .from(usage)
      .where(eq(usage.userId, user!.id));

    const sessionDates = await db
      .select({ date: sql<string>`TO_CHAR(${studySessions.updatedAt}, 'YYYY-MM-DD')` })
      .from(studySessions)
      .where(and(eq(studySessions.userId, user!.id), eq(studySessions.status, "completed")));

    const quizDates = await db
      .select({ date: sql<string>`TO_CHAR(${quizAttempts.completedAt}, 'YYYY-MM-DD')` })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, user!.id));

    const uniqueDates = Array.from(
      new Set([
        ...usageDates.map((u) => u.date),
        ...sessionDates.map((s) => s.date),
        ...quizDates.map((q) => q.date),
      ].filter(Boolean))
    ).sort().reverse();

    if (uniqueDates.length === 0) {
      return { streakDays: 0, longestStreak: 0, isActiveToday: false };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const isActiveToday = uniqueDates[0] === todayStr;
    const isLatestYesterday = uniqueDates[0] === yesterdayStr;

    let streak = 0;
    if (isActiveToday || isLatestYesterday) {
      let expectedDate = new Date(isActiveToday ? todayStr : yesterdayStr);
      for (const dStr of uniqueDates) {
        const currentDateStr = expectedDate.toISOString().split("T")[0];
        if (dStr === currentDateStr) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (new Date(dStr).getTime() < expectedDate.getTime()) {
          break;
        }
      }
    }

    return {
      streakDays: streak,
      longestStreak: Math.max(streak, 1),
      isActiveToday,
      lastActiveDate: uniqueDates[0],
    };
  })
  // 0c. 7-Day & 30-Day Progress Metrics
  .get("/metrics", async ({ user, query }) => {
    const days = query?.days === "30" ? 30 : 7;
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const completed = await db
      .select({
        durationSeconds: studySessions.actualDurationSeconds,
        date: sql<string>`TO_CHAR(${studySessions.updatedAt}, 'YYYY-MM-DD')`,
      })
      .from(studySessions)
      .where(
        and(
          eq(studySessions.userId, user!.id),
          eq(studySessions.status, "completed"),
          gte(studySessions.updatedAt, startDate)
        )
      );

    const minutesByDate: Record<string, { minutes: number; sessions: number }> = {};
    completed.forEach((c) => {
      if (!minutesByDate[c.date]) {
        minutesByDate[c.date] = { minutes: 0, sessions: 0 };
      }
      minutesByDate[c.date].minutes += Math.round((c.durationSeconds || 0) / 60);
      minutesByDate[c.date].sessions += 1;
    });

    const timeline = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = dayNames[d.getDay()];
      const entry = minutesByDate[dateStr] || { minutes: 0, sessions: 0 };

      timeline.push({
        day: dayName,
        date: dateStr,
        minutes: entry.minutes,
        sessions: entry.sessions,
      });
    }

    const totalMinutes = timeline.reduce((acc, t) => acc + t.minutes, 0);
    const avgDailyMinutes = Math.round(totalMinutes / days);

    return {
      period: `${days}d`,
      totalMinutes,
      avgDailyMinutes,
      timeline,
    };
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
