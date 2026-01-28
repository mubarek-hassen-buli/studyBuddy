import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db";
import { studyBuddies } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { learningModesService } from "../services/learning-modes";
import { rateLimiter } from "../middleware/rate-limiter";

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
        const summary = await learningModesService.summarize(buddy.qdrantCollectionName, type);
        return { summary };
    } catch (error) {
        console.error("Summarize error:", error);
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
        set.status = 500;
        return { message: "Failed to generate summary", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        type: t.String()
    })
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
        const flashcards = await learningModesService.generateFlashcards(buddy.qdrantCollectionName, count || 5);
        return { flashcards };
    } catch (error) {
        console.error("Flashcards error:", error);
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
        set.status = 500;
        return { message: "Failed to generate flashcards", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        count: t.Number()
    })
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
        const quiz = await learningModesService.generateQuiz(buddy.qdrantCollectionName, topic);
        return { quiz };
    } catch (error) {
        console.error("Quiz error:", error);
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
        set.status = 500;
        return { message: "Failed to generate quiz", error: error instanceof Error ? error.message : String(error) };
    }
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        topic: t.Optional(t.String())
    })
  });
