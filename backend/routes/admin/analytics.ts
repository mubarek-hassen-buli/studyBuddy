import { Elysia } from "elysia";
import { db } from "../../db";
import {
  users,
  studyBuddies,
  documents,
  flashcards,
  quizzes,
  quizAttempts,
  studySessions,
} from "../../db/schema";
import { count, sum, eq, gte } from "drizzle-orm";
import { adminGuard } from "../../middleware/admin-guard";

export const adminAnalyticsRoutes = new Elysia({ prefix: "/analytics" })
  .use(adminGuard)
  .get("/overview", async ({ set }) => {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [
        [totalUsersRow],
        [superAdminsRow],
        [standardUsersRow],
        [proTierRow],
        [freeTierRow],
        [bannedUsersRow],
        [new7dRow],
        [new30dRow],
        [buddiesRow],
        [docsStatsRow],
        [completedDocsRow],
        [processingDocsRow],
        [failedDocsRow],
        [pendingDocsRow],
        [flashcardsRow],
        [quizzesRow],
        [quizAttemptsRow],
        [sessionsStatsRow],
      ] = await Promise.all([
        db.select({ value: count() }).from(users),
        db.select({ value: count() }).from(users).where(eq(users.role, "super_admin")),
        db.select({ value: count() }).from(users).where(eq(users.role, "user")),
        db.select({ value: count() }).from(users).where(eq(users.tier, "pro")),
        db.select({ value: count() }).from(users).where(eq(users.tier, "free")),
        db.select({ value: count() }).from(users).where(eq(users.banned, true)),
        db.select({ value: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
        db.select({ value: count() }).from(users).where(gte(users.createdAt, thirtyDaysAgo)),
        db.select({ value: count() }).from(studyBuddies),
        db.select({ count: count(), totalBytes: sum(documents.fileSize) }).from(documents),
        db.select({ value: count() }).from(documents).where(eq(documents.processingStatus, "completed")),
        db.select({ value: count() }).from(documents).where(eq(documents.processingStatus, "processing")),
        db.select({ value: count() }).from(documents).where(eq(documents.processingStatus, "failed")),
        db.select({ value: count() }).from(documents).where(eq(documents.processingStatus, "pending")),
        db.select({ value: count() }).from(flashcards),
        db.select({ value: count() }).from(quizzes),
        db.select({ value: count() }).from(quizAttempts),
        db.select({
          count: count(),
          totalDurationSeconds: sum(studySessions.actualDurationSeconds),
        }).from(studySessions),
      ]);

      const totalStorageBytes = Number(docsStatsRow?.totalBytes || 0);
      const totalDurationSeconds = Number(sessionsStatsRow?.totalDurationSeconds || 0);

      return {
        users: {
          total: totalUsersRow?.value || 0,
          superAdmins: superAdminsRow?.value || 0,
          standardUsers: standardUsersRow?.value || 0,
          proTier: proTierRow?.value || 0,
          freeTier: freeTierRow?.value || 0,
          banned: bannedUsersRow?.value || 0,
          newLast7Days: new7dRow?.value || 0,
          newLast30Days: new30dRow?.value || 0,
        },
        content: {
          studyBuddies: buddiesRow?.value || 0,
          documents: docsStatsRow?.count || 0,
          storageBytes: totalStorageBytes,
          storageMegabytes: Math.round((totalStorageBytes / (1024 * 1024)) * 100) / 100,
          documentStatus: {
            completed: completedDocsRow?.value || 0,
            processing: processingDocsRow?.value || 0,
            failed: failedDocsRow?.value || 0,
            pending: pendingDocsRow?.value || 0,
          },
          flashcards: flashcardsRow?.value || 0,
          quizzes: quizzesRow?.value || 0,
          quizAttempts: quizAttemptsRow?.value || 0,
          studySessions: sessionsStatsRow?.count || 0,
          studyMinutes: Math.round(totalDurationSeconds / 60),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[AdminAnalytics] Failed to fetch overview metrics:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to generate system analytics overview",
      };
    }
  });
