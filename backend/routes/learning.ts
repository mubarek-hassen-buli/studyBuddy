import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import {
  studyBuddies,
  flashcards,
  quizzes,
  quizAttempts,
  summaries as summariesTable,
  users,
  usage,
} from "../db/schema";
import { eq, and, desc, count as sqlCount } from "drizzle-orm";
import { learningModesService } from "../services/learning-modes";
import { rateLimiter } from "../middleware/rate-limiter";
import { incrementQuota } from "../middleware/quota-checker";
import {
  reviewFlashcardSchema,
  submitQuizAttemptSchema,
  createQuizSchema,
  createFlashcardsSchema,
} from "../validators/learning";

export const learningRoutes = new Elysia({ prefix: "/api/learning" })
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

  // ==========================================
  // FLASHCARDS ENDPOINTS (Static routes first)
  // ==========================================

  // 1. Flashcards Overview Metrics
  .get("/flashcards/overview", async ({ user }) => {
    const userCards = await db
      .select({
        id: flashcards.id,
        studyBuddyId: flashcards.studyBuddyId,
        masteryLevel: flashcards.masteryLevel,
        lastReviewedAt: flashcards.lastReviewedAt,
        nextReviewAt: flashcards.nextReviewAt,
      })
      .from(flashcards)
      .innerJoin(studyBuddies, eq(flashcards.studyBuddyId, studyBuddies.id))
      .where(eq(studyBuddies.userId, user!.id));

    const totalCards = userCards.length;
    const uniqueDecks = new Set(userCards.map((c) => c.studyBuddyId)).size;
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const dueToday = userCards.filter(
      (c) => (c.nextReviewAt && new Date(c.nextReviewAt) <= now) || !c.lastReviewedAt
    ).length;

    const masteredCount = userCards.filter((c) => (c.masteryLevel || 0) >= 3).length;
    const learningCount = userCards.filter(
      (c) => (c.masteryLevel || 0) > 0 && (c.masteryLevel || 0) < 3
    ).length;
    const newCount = userCards.filter(
      (c) => (c.masteryLevel || 0) === 0 && !c.lastReviewedAt
    ).length;

    const reviewedToday = userCards.filter(
      (c) => c.lastReviewedAt && new Date(c.lastReviewedAt) >= todayStart
    ).length;

    const retentionRate =
      totalCards > 0 ? Math.round(((masteredCount + learningCount) / totalCards) * 100) : 0;

    return {
      totalCards,
      totalDecks: uniqueDecks,
      dueToday,
      masteredCount,
      learningCount,
      newCount,
      reviewedToday,
      retentionRate,
    };
  })

  // 2. All Flashcard Decks with Mastery Percentage
  .get("/flashcards/decks", async ({ user }) => {
    const buddies = await db.query.studyBuddies.findMany({
      where: eq(studyBuddies.userId, user!.id),
      with: {
        flashcards: true,
      },
      orderBy: [desc(studyBuddies.createdAt)],
    });

    const now = new Date();

    return buddies.map((b) => {
      const cards = b.flashcards || [];
      const totalCards = cards.length;
      const mastered = cards.filter((c) => (c.masteryLevel || 0) >= 3).length;
      const dueCount = cards.filter(
        (c) => (c.nextReviewAt && new Date(c.nextReviewAt) <= now) || !c.lastReviewedAt
      ).length;
      const masteryPercentage = totalCards > 0 ? Math.round((mastered / totalCards) * 100) : 0;

      const reviewedDates = cards
        .map((c) => c.lastReviewedAt)
        .filter((d): d is Date => d !== null);
      const lastReviewedAt =
        reviewedDates.length > 0
          ? new Date(Math.max(...reviewedDates.map((d) => new Date(d).getTime()))).toISOString()
          : null;

      return {
        id: b.id,
        studyBuddyId: b.id,
        title: b.name,
        subject: b.subject,
        description: b.description,
        totalCards,
        masteredCount: mastered,
        dueCount,
        masteryPercentage,
        lastReviewedAt,
        createdAt: b.createdAt.toISOString(),
      };
    });
  })

  // 3. Mark Card Reviewed / Update Mastery Level
  .post("/flashcards/review/:cardId", async ({ params: { cardId }, body, user, set }) => {
    const parsed = reviewFlashcardSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const [cardWithBuddy] = await db
      .select({
        id: flashcards.id,
        masteryLevel: flashcards.masteryLevel,
        studyBuddyId: flashcards.studyBuddyId,
      })
      .from(flashcards)
      .innerJoin(studyBuddies, eq(flashcards.studyBuddyId, studyBuddies.id))
      .where(and(eq(flashcards.id, cardId), eq(studyBuddies.userId, user!.id)));

    if (!cardWithBuddy) {
      set.status = 404;
      return { message: "Flashcard not found" };
    }

    const currentLevel = cardWithBuddy.masteryLevel || 0;
    let newLevel = currentLevel;
    const nextReview = new Date();

    const mastery = parsed.data.mastery;
    if (parsed.data.masteryLevel !== undefined) {
      newLevel = parsed.data.masteryLevel;
      nextReview.setDate(nextReview.getDate() + (newLevel + 1) * 2);
    } else if (mastery === "again") {
      newLevel = 0;
      nextReview.setTime(Date.now() + 10 * 60 * 1000); // 10 minutes
    } else if (mastery === "hard") {
      newLevel = Math.max(0, currentLevel - 1);
      nextReview.setDate(nextReview.getDate() + 1); // 1 day
    } else if (mastery === "good") {
      newLevel = Math.min(3, currentLevel + 1);
      nextReview.setDate(nextReview.getDate() + 3); // 3 days
    } else if (mastery === "easy") {
      newLevel = 3;
      nextReview.setDate(nextReview.getDate() + 7); // 7 days
    }

    const [updated] = await db
      .update(flashcards)
      .set({
        masteryLevel: newLevel,
        lastReviewedAt: new Date(),
        nextReviewAt: nextReview,
      })
      .where(eq(flashcards.id, cardId))
      .returning();

    await incrementQuota(user!.id, "flashcard", { cardId, masteryLevel: newLevel });

    return updated;
  })

  // 4. Create / Generate Flashcards with AI
  .post("/flashcards/create", async ({ body, user, set }) => {
    const parsed = createFlashcardsSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { studyBuddyId, topic, count = 5 } = parsed.data;

    let buddyId = studyBuddyId;
    let collectionName: string | null = null;

    if (buddyId) {
      const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, buddyId), eq(studyBuddies.userId, user!.id)),
      });
      if (buddy) {
        collectionName = buddy.qdrantCollectionName;
      }
    }

    if (!buddyId) {
      // Create a dedicated deck / study companion for this specific topic
      const [newBuddy] = await db
        .insert(studyBuddies)
        .values({
          userId: user!.id,
          name: topic || "General Studies",
          subject: topic || "Academics",
          description: `Study deck for ${topic || "General Studies"}`,
        })
        .returning();
      buddyId = newBuddy.id;
    }

    try {
      const generated = await learningModesService.generateFlashcards(
        collectionName,
        topic,
        count,
        "medium"
      );

      if (!generated || generated.length === 0) {
        set.status = 422;
        return { message: "Unable to generate flashcards from the provided input." };
      }

      const values = generated.map((c) => ({
        studyBuddyId: buddyId!,
        question: c.question,
        answer: c.answer,
        difficulty: "medium" as const,
      }));

      const inserted = await db.insert(flashcards).values(values).returning();
      return { flashcards: inserted, deckId: buddyId, count: inserted.length };
    } catch (error) {
      console.error("Flashcards create error:", error);
      set.status = 500;
      return { message: "Failed to generate flashcards", error: String(error) };
    }
  })

  // 5. Get Flashcards for a Specific StudyBuddy
  .get("/flashcards/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    return await db.query.flashcards.findMany({
      where: eq(flashcards.studyBuddyId, studyBuddyId),
      orderBy: [desc(flashcards.createdAt)],
    });
  })

  // 6. Legacy Flashcard Generation for Specific StudyBuddy
  .post("/flashcards", async ({ body, user, set }) => {
    const { studyBuddyId, count = 5 } = body as { studyBuddyId: string; count?: number };

    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    try {
      const cards = await learningModesService.generateFlashcards(
        buddy.qdrantCollectionName,
        buddy.subject,
        count
      );

      if (cards && cards.length > 0) {
        const values = cards.map((c) => ({
          studyBuddyId,
          question: c.question,
          answer: c.answer,
          difficulty: "medium" as const,
        }));

        const newCards = await db.insert(flashcards).values(values).returning();
        return { flashcards: newCards };
      }

      return { flashcards: [] };
    } catch (error) {
      console.error("Flashcards error:", error);
      set.status = 500;
      return { message: "Failed to generate flashcards", error: String(error) };
    }
  })

  // ==========================================
  // QUIZZES ENDPOINTS (Static routes first)
  // ==========================================

  // 7. Quizzes Overview Metrics & Recent Attempts
  .get("/quizzes/overview", async ({ user }) => {
    const attempts = await db
      .select({
        id: quizAttempts.id,
        quizId: quizAttempts.quizId,
        score: quizAttempts.score,
        totalQuestions: quizAttempts.totalQuestions,
        percentage: quizAttempts.percentage,
        completedAt: quizAttempts.completedAt,
        quizTitle: quizzes.title,
        quizTopic: quizzes.topic,
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(eq(quizAttempts.userId, user!.id))
      .orderBy(desc(quizAttempts.completedAt));

    const quizzesTaken = attempts.length;
    const totalScore = attempts.reduce((acc, a) => acc + a.percentage, 0);
    const averageScore = quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;
    const bestScore = quizzesTaken > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
    const totalQuestions = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);

    return {
      quizzesTaken,
      averageScore,
      bestScore,
      totalQuestions,
      recentAttempts: attempts.slice(0, 5).map((a) => ({
        id: a.id,
        quizId: a.quizId,
        title: a.quizTitle || a.quizTopic || "Subject Quiz",
        score: a.score,
        totalQuestions: a.totalQuestions,
        percentage: a.percentage,
        completedAt: a.completedAt.toISOString(),
      })),
    };
  })

  // 8. All User Quizzes with Last Attempt & Best Score
  .get("/quizzes/all", async ({ user }) => {
    const userQuizzes = await db
      .select({
        id: quizzes.id,
        studyBuddyId: quizzes.studyBuddyId,
        title: quizzes.title,
        topic: quizzes.topic,
        difficulty: quizzes.difficulty,
        questions: quizzes.questions,
        createdAt: quizzes.createdAt,
        studyBuddyName: studyBuddies.name,
        studyBuddySubject: studyBuddies.subject,
      })
      .from(quizzes)
      .innerJoin(studyBuddies, eq(quizzes.studyBuddyId, studyBuddies.id))
      .where(eq(studyBuddies.userId, user!.id))
      .orderBy(desc(quizzes.createdAt));

    const attempts = await db
      .select({
        quizId: quizAttempts.quizId,
        score: quizAttempts.score,
        totalQuestions: quizAttempts.totalQuestions,
        percentage: quizAttempts.percentage,
        completedAt: quizAttempts.completedAt,
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, user!.id))
      .orderBy(desc(quizAttempts.completedAt));

    const attemptsByQuiz: Record<string, typeof attempts> = {};
    attempts.forEach((a) => {
      if (!attemptsByQuiz[a.quizId]) {
        attemptsByQuiz[a.quizId] = [];
      }
      attemptsByQuiz[a.quizId].push(a);
    });

    return userQuizzes.map((q) => {
      const quizAttemptsList = attemptsByQuiz[q.id] || [];
      const lastAttempt = quizAttemptsList[0] || null;
      const bestScore =
        quizAttemptsList.length > 0
          ? Math.max(...quizAttemptsList.map((a) => a.percentage))
          : null;
      const questionArray = Array.isArray(q.questions) ? q.questions : [];

      return {
        id: q.id,
        studyBuddyId: q.studyBuddyId,
        studyBuddyName: q.studyBuddyName,
        title: q.title || q.topic || `${q.studyBuddyName} Quiz`,
        topic: q.topic || q.studyBuddySubject || "General Knowledge",
        difficulty: q.difficulty,
        questionCount: questionArray.length,
        questions: questionArray,
        createdAt: q.createdAt.toISOString(),
        lastAttempt: lastAttempt
          ? {
              score: lastAttempt.score,
              totalQuestions: lastAttempt.totalQuestions,
              percentage: lastAttempt.percentage,
              completedAt: lastAttempt.completedAt.toISOString(),
            }
          : null,
        bestScore,
      };
    });
  })

  // 9. Create a New Quiz with AI Generation
  .post("/quizzes/create", async ({ body, user, set }) => {
    const parsed = createQuizSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { studyBuddyId, topic, difficulty = "medium", count = 5 } = parsed.data;

    let buddyId = studyBuddyId;
    let collectionName: string | null = null;

    if (buddyId) {
      const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, buddyId), eq(studyBuddies.userId, user!.id)),
      });
      if (buddy) {
        collectionName = buddy.qdrantCollectionName;
      }
    }

    if (!buddyId) {
      const firstBuddy = await db.query.studyBuddies.findFirst({
        where: eq(studyBuddies.userId, user!.id),
      });
      if (firstBuddy) {
        buddyId = firstBuddy.id;
        collectionName = firstBuddy.qdrantCollectionName;
      } else {
        const [newBuddy] = await db
          .insert(studyBuddies)
          .values({
            userId: user!.id,
            name: topic,
            subject: topic,
            description: "Quiz subject companion",
          })
          .returning();
        buddyId = newBuddy.id;
      }
    }

    try {
      const questions = await learningModesService.generateQuiz(
        collectionName,
        topic,
        count,
        difficulty
      );

      if (!questions || questions.length === 0) {
        set.status = 422;
        return { message: "Unable to generate quiz questions for this topic." };
      }

      const [newQuiz] = await db
        .insert(quizzes)
        .values({
          studyBuddyId: buddyId!,
          title: topic,
          topic,
          difficulty,
          questions,
        })
        .returning();

      return {
        quiz: newQuiz,
      };
    } catch (error) {
      console.error("Quiz creation error:", error);
      set.status = 500;
      return { message: "Failed to generate quiz", error: String(error) };
    }
  })

  // 10. Record Quiz Attempt & Answers
  .post("/quizzes/:id/attempt", async ({ params: { id }, body, user, set }) => {
    const parsed = submitQuizAttemptSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const [quiz] = await db
      .select({
        id: quizzes.id,
        studyBuddyId: quizzes.studyBuddyId,
      })
      .from(quizzes)
      .innerJoin(studyBuddies, eq(quizzes.studyBuddyId, studyBuddies.id))
      .where(and(eq(quizzes.id, id), eq(studyBuddies.userId, user!.id)));

    if (!quiz) {
      set.status = 404;
      return { message: "Quiz not found" };
    }

    const { answers, score, totalQuestions, percentage } = parsed.data;

    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        quizId: id,
        userId: user!.id,
        score,
        totalQuestions,
        percentage,
        answers,
      })
      .returning();

    await incrementQuota(user!.id, "quiz", {
      quizId: id,
      score,
      total: totalQuestions,
      percentage,
    });

    return attempt;
  })

  // 11. Get Quizzes for Specific StudyBuddy
  .get("/quiz/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    return await db.query.quizzes.findMany({
      where: eq(quizzes.studyBuddyId, studyBuddyId),
      orderBy: [desc(quizzes.createdAt)],
    });
  })

  // 12. Legacy Quiz Generation
  .post("/quiz", async ({ body, user, set }) => {
    const { studyBuddyId, topic } = body as { studyBuddyId: string; topic?: string };

    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    try {
      const quizData = await learningModesService.generateQuiz(
        buddy.qdrantCollectionName,
        topic,
        10
      );

      if (quizData && quizData.length > 0) {
        const [newQuiz] = await db
          .insert(quizzes)
          .values({
            studyBuddyId,
            title: topic || "Generated Quiz",
            topic: topic || buddy.subject,
            questions: quizData,
            difficulty: "medium",
          })
          .returning();

        return { quiz: newQuiz.questions };
      }

      return { quiz: [] };
    } catch (error) {
      console.error("Quiz error:", error);
      set.status = 500;
      return { message: "Failed to generate quiz", error: String(error) };
    }
  })

  // 13. Legacy Quiz Score Counter
  .post("/quiz-score", async ({ body, user }) => {
    const { score, total } = body as { score: number; total: number };
    await incrementQuota(user!.id, "quiz", { score, total });
    return { success: true };
  })

  // ==========================================
  // SUMMARIZATION ENDPOINTS
  // ==========================================

  .get("/summarize/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    return await db.query.summaries.findMany({
      where: eq(summariesTable.studyBuddyId, studyBuddyId),
      orderBy: [desc(summariesTable.createdAt)],
    });
  })

  .post("/summarize", async ({ body, user, set }) => {
    const { studyBuddyId, type } = body as {
      studyBuddyId: string;
      type: "short" | "detailed" | "key_concepts" | "exam";
    };

    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    if (!buddy.qdrantCollectionName) {
      set.status = 400;
      return "StudyBuddy has no knowledge base";
    }

    try {
      const summaryText = await learningModesService.summarize(
        buddy.qdrantCollectionName,
        type
      );

      const [newSummary] = await db
        .insert(summariesTable)
        .values({
          studyBuddyId,
          type,
          content: summaryText,
        })
        .returning();

      return newSummary;
    } catch (error) {
      console.error("Summarize error:", error);
      set.status = 500;
      return { message: "Failed to generate summary", error: String(error) };
    }
  });
