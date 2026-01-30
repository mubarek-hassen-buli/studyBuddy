import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db";
import { studyBuddies, documents } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { rateLimiter } from "../middleware/rate-limiter";
import { quotaChecker, incrementQuota } from "../middleware/quota-checker";
import { Stream } from "@elysiajs/stream";
import { ragService } from "../services/rag";

export const chatRoutes = new Elysia({ prefix: "/api/chat" })
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
  .post("/", async ({ body, user, set }) => {
    const { studyBuddyId, message, mode } = body as { studyBuddyId: string, message: string, mode?: string };

    // Verify StudyBuddy ownership
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    // Check quota (TODO: Implement properly)
    
    // Get collection name
    const collectionName = buddy.qdrantCollectionName;
    if (!collectionName) {
        return new Stream(async (stream) => {
            stream.send("Error: StudyBuddy has no knowledge base initialized.\n");
            stream.close();
        });
    }

    // Retrieve context
    const context = await ragService.retrieveContext(collectionName, message);

    // Metadata Fallback: Populate missing fileNames from DB
    for (const item of context) {
        if (!item.metadata.fileName && item.metadata.documentId) {
            const doc = await db.query.documents.findFirst({
                where: eq(documents.id, item.metadata.documentId)
            });
            if (doc) item.metadata.fileName = doc.fileName;
        }
    }

    // Stream response
    return new Stream(async (stream) => {
        // Stream chunks from Gemini
        for await (const chunk of ragService.streamResponse(message, context)) {
            stream.send(chunk);
        }
        
        stream.close();
    });
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        message: t.String(),
        mode: t.Optional(t.String())
    })
  })
  .post("", async ({ body, user, set }) => {
    const { studyBuddyId, message, mode } = body as { studyBuddyId: string, message: string, mode?: string };

    // Verify StudyBuddy ownership
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    // Check quota (TODO: Implement properly)
    
    // Get collection name
    const collectionName = buddy.qdrantCollectionName;
    if (!collectionName) {
        return new Stream(async (stream) => {
            stream.send("Error: StudyBuddy has no knowledge base initialized.\n");
            stream.close();
        });
    }

    // Retrieve context
    const context = await ragService.retrieveContext(collectionName, message);

    // Stream response
    return new Stream(async (stream) => {
        // Stream chunks from Gemini
        for await (const chunk of ragService.streamResponse(message, context)) {
            stream.send(chunk);
        }
        
        stream.close();
    });
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        message: t.String(),
        mode: t.Optional(t.String())
    })
  });
