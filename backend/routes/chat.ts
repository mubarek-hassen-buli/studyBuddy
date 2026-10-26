import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import {
  studyBuddies,
  documents,
  chatConversations,
  messages,
} from "../db/schema";
import { eq, and, desc, asc, count } from "drizzle-orm";
import { rateLimiter } from "../middleware/rate-limiter";
import { incrementQuota } from "../middleware/quota-checker";
import { Stream } from "@elysiajs/stream";
import { ragService, RetrievalResult } from "../services/rag";
import {
  sendChatMessageSchema,
  createConversationSchema,
} from "../validators/chat";

export const chatRoutes = new Elysia({ prefix: "/api/chat" })
  .use(rateLimiter({ limit: 40, window: 60 }))
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

  // 1. Get All Conversations for User
  .get("/conversations", async ({ user }) => {
    const convos = await db.query.chatConversations.findMany({
      where: eq(chatConversations.userId, user!.id),
      with: {
        studyBuddy: true,
        messages: {
          orderBy: [desc(messages.createdAt)],
          limit: 1,
        },
      },
      orderBy: [desc(chatConversations.updatedAt)],
    });

    return convos.map((c) => {
      const lastMsg = c.messages[0];
      return {
        id: c.id,
        title: c.title,
        studyBuddyId: c.studyBuddyId,
        studyBuddyName: c.studyBuddy?.name,
        useMaterials: c.useMaterials,
        lastMessage: lastMsg?.content ? lastMsg.content.slice(0, 80) : null,
        lastMessageRole: lastMsg?.role || null,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      };
    });
  })

  // 2. Create a New Conversation Thread
  .post("/conversations", async ({ body, user, set }) => {
    const parsed = createConversationSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { title, studyBuddyId, useMaterials = true } = parsed.data;

    if (studyBuddyId) {
      const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id)),
      });
      if (!buddy) {
        set.status = 404;
        return { message: "StudyBuddy not found" };
      }
    }

    const [created] = await db
      .insert(chatConversations)
      .values({
        userId: user!.id,
        title,
        studyBuddyId: studyBuddyId || null,
        useMaterials,
      })
      .returning();

    return created;
  })

  // 3. Get Messages for a Specific Conversation
  .get("/conversations/:id/messages", async ({ params: { id }, user, set }) => {
    const conversation = await db.query.chatConversations.findFirst({
      where: and(eq(chatConversations.id, id), eq(chatConversations.userId, user!.id)),
    });

    if (!conversation) {
      set.status = 404;
      return "Conversation not found";
    }

    const msgs = await db.query.messages.findMany({
      where: eq(messages.conversationId, id),
      orderBy: [asc(messages.createdAt)],
    });

    return {
      conversation,
      messages: msgs.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        role: m.role,
        content: m.content,
        sources: m.sources,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  })

  // 4. Delete Conversation
  .delete("/conversations/:id", async ({ params: { id }, user, set }) => {
    const conversation = await db.query.chatConversations.findFirst({
      where: and(eq(chatConversations.id, id), eq(chatConversations.userId, user!.id)),
    });

    if (!conversation) {
      set.status = 404;
      return "Conversation not found";
    }

    await db.delete(chatConversations).where(eq(chatConversations.id, id));

    return { success: true };
  })

  // 5. Stream AI Response and Persist Conversation
  .post("/", async ({ body, user, set }) => {
    const parsed = sendChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      set.status = 400;
      return { message: "Validation failed", errors: parsed.error.issues };
    }

    const { message, studyBuddyId, useMaterials = true } = parsed.data;
    let conversationId = parsed.data.conversationId;

    let targetBuddyId = studyBuddyId || null;

    // Resolve or verify conversation
    if (conversationId) {
      const conv = await db.query.chatConversations.findFirst({
        where: and(
          eq(chatConversations.id, conversationId),
          eq(chatConversations.userId, user!.id)
        ),
      });
      if (!conv) {
        set.status = 404;
        return { message: "Conversation not found" };
      }
      if (!targetBuddyId && conv.studyBuddyId) {
        targetBuddyId = conv.studyBuddyId;
      }
    } else {
      // Auto-create new conversation thread
      const snippet = message.trim().slice(0, 36);
      const title = snippet.length < message.trim().length ? `${snippet}...` : snippet;
      const [newConvo] = await db
        .insert(chatConversations)
        .values({
          userId: user!.id,
          title: title || "Study Discussion",
          studyBuddyId: targetBuddyId,
          useMaterials,
        })
        .returning();
      conversationId = newConvo.id;
    }

    // Set conversation ID header on response for client state sync
    if (conversationId && set.headers) {
      set.headers["x-conversation-id"] = conversationId;
    }

    // Fetch conversation history for context
    const previousMessages = conversationId
      ? await db.query.messages.findMany({
          where: eq(messages.conversationId, conversationId),
          orderBy: [asc(messages.createdAt)],
          limit: 10,
        })
      : [];

    const historyForAi = previousMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Persist user's message immediately
    await db.insert(messages).values({
      conversationId: conversationId!,
      studyBuddyId: targetBuddyId,
      role: "user",
      content: message,
    });

    // Check if RAG should be executed
    let collectionName: string | null = null;
    if (useMaterials) {
      if (targetBuddyId) {
        const buddy = await db.query.studyBuddies.findFirst({
          where: and(eq(studyBuddies.id, targetBuddyId), eq(studyBuddies.userId, user!.id)),
        });
        if (buddy?.qdrantCollectionName) {
          collectionName = buddy.qdrantCollectionName;
        }
      } else {
        // Find user's first buddy with an active collection
        const firstBuddy = await db.query.studyBuddies.findFirst({
          where: eq(studyBuddies.userId, user!.id),
        });
        if (firstBuddy?.qdrantCollectionName) {
          collectionName = firstBuddy.qdrantCollectionName;
        }
      }
    }

    let contextChunks: RetrievalResult[] = [];
    if (useMaterials && collectionName) {
      try {
        contextChunks = await ragService.retrieveContext(collectionName, message);
        for (const item of contextChunks) {
          if (!item.metadata?.fileName && item.metadata?.documentId) {
            const doc = await db.query.documents.findFirst({
              where: eq(documents.id, String(item.metadata.documentId)),
            });
            if (doc) item.metadata.fileName = doc.fileName;
          }
        }
      } catch (err) {
        console.warn("RAG retrieval skipped or failed:", err);
      }
    }

    return new Stream(async (stream) => {
      let fullAssistantText = "";

      try {
        if (useMaterials && contextChunks.length > 0) {
          for await (const chunk of ragService.streamResponse(message, contextChunks)) {
            fullAssistantText += chunk;
            stream.send(chunk);
          }
        } else {
          for await (const chunk of ragService.streamGeneralResponse(message, historyForAi)) {
            fullAssistantText += chunk;
            stream.send(chunk);
          }
        }
      } catch (streamError) {
        console.error("Gemini stream error:", streamError);
        const fallback =
          "\n\n*Folio encountered an issue generating a complete response. Please check your query and try again.*";
        fullAssistantText += fallback;
        stream.send(fallback);
      } finally {
        stream.close();

        // Persist assistant message in background
        if (fullAssistantText.trim() && conversationId) {
          try {
            const sourcesData = contextChunks.map((c) => ({
              fileName: c.metadata?.fileName || "Study Material",
              score: c.score,
            }));

            await db.insert(messages).values({
              conversationId,
              studyBuddyId: targetBuddyId,
              role: "assistant",
              content: fullAssistantText,
              sources: sourcesData.length > 0 ? sourcesData : null,
            });

            await db
              .update(chatConversations)
              .set({ updatedAt: new Date() })
              .where(eq(chatConversations.id, conversationId));

            await incrementQuota(user!.id, "chat", { conversationId });
          } catch (persistErr) {
            console.error("Failed to persist assistant message:", persistErr);
          }
        }
      }
    });
  });
