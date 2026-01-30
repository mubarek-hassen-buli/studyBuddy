import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db";
import { studyBuddies } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { learningModesService } from "../services/learning-modes";
import { rateLimiter } from "../middleware/rate-limiter";

import { flashcards, quizzes, summaries as summariesTable } from "../../db/schema";
import { desc } from "drizzle-orm";

export const learningRoutes = new Elysia({ prefix: "/api/learning" })
  .use(rateLimiter({ limit: 20, window: 60 }))
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
  .get("/summarize/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    return await db.query.summaries.findMany({
        where: eq(summariesTable.studyBuddyId, studyBuddyId),
        orderBy: [desc(summariesTable.createdAt)]
    });
  })
  .post("/summarize", async ({ body, user, set }) => {
    const { studyBuddyId, type } = body as { studyBuddyId: string, type: "short" | "detailed" | "key_concepts" | "exam" };

    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
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
        const summaryText = await learningModesService.summarize(buddy.qdrantCollectionName, type);
        
        // Persist summary
        const [newSummary] = await db.insert(summariesTable).values({
            studyBuddyId,
            type,
            content: summaryText
        }).returning();

        return newSummary;
    } catch (error) {
        console.error("Summarize error:", error);
        set.status = 500;
        return { message: "Failed to generate summary", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        type: t.String()
    })
  })
  .get("/flashcards/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    return await db.query.flashcards.findMany({
        where: eq(flashcards.studyBuddyId, studyBuddyId),
        orderBy: [desc(flashcards.createdAt)]
    });
  })
  .post("/flashcards", async ({ body, user, set }) => {
    const { studyBuddyId, count } = body as { studyBuddyId: string, count: number };
    
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
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
        const cards = await learningModesService.generateFlashcards(buddy.qdrantCollectionName, count || 5);
        
        // Persist each flashcard
        if (cards && cards.length > 0) {
            const values = cards.map((c: any) => ({
                studyBuddyId,
                question: c.question,
                answer: c.answer,
                difficulty: "medium" as "medium"
            }));
            
            const newCards = await db.insert(flashcards).values(values).returning();
            return { flashcards: newCards };
        }

        return { flashcards: [] };
    } catch (error) {
        console.error("Flashcards error:", error);
        set.status = 500;
        return { message: "Failed to generate flashcards", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        count: t.Number()
    })
  })
  .get("/quiz/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    return await db.query.quizzes.findMany({
        where: eq(quizzes.studyBuddyId, studyBuddyId),
        orderBy: [desc(quizzes.createdAt)]
    });
  })
  .post("/quiz", async ({ body, user, set }) => {
    const { studyBuddyId, topic } = body as { studyBuddyId: string, topic?: string };

    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
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
        const quizData = await learningModesService.generateQuiz(buddy.qdrantCollectionName, topic);
        
        // Persist quiz
        if (quizData && quizData.length > 0) {
            const [newQuiz] = await db.insert(quizzes).values({
                studyBuddyId,
                questions: quizData,
                difficulty: "medium"
            }).returning();
            
            return { quiz: newQuiz.questions };
        }

        return { quiz: [] };
    } catch (error) {
        console.error("Quiz error:", error);
        set.status = 500;
        return { message: "Failed to generate quiz", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        topic: t.Optional(t.String())
    })
  });
