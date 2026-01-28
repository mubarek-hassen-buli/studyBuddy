import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db";
import { studyBuddies } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { createStudyBuddySchema, updateStudyBuddySchema } from "../../lib/validators/studybuddy";
import { rateLimiter } from "../middleware/rate-limiter";
import { qdrantService } from "../services/qdrant";

export const studyBuddyRoutes = new Elysia({ prefix: "/api/studybuddy" })
  .use(rateLimiter({ limit: 60, window: 60 })) // 60 req/min
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
  .get("/", async ({ user }) => {
    return await db.query.studyBuddies.findMany({
      where: eq(studyBuddies.userId, user!.id),
      orderBy: [desc(studyBuddies.createdAt)],
    });
  })
  .get("", async ({ user }) => {
    return await db.query.studyBuddies.findMany({
      where: eq(studyBuddies.userId, user!.id),
      orderBy: [desc(studyBuddies.createdAt)],
    });
  })
  .get("/:id", async ({ params: { id }, user, set }) => {
    const buddy = await db.query.studyBuddies.findFirst({
      where: and(eq(studyBuddies.id, id), eq(studyBuddies.userId, user!.id)),
    });

    if (!buddy) {
      set.status = 404;
      return "StudyBuddy not found";
    }

    return buddy;
  })
  .post("/", async ({ body, user, set }) => {
    try {
      // Validate body
      const parsed = createStudyBuddySchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { message: "Validation failed", errors: parsed.error.issues };
      }

      const { name, subject, description } = parsed.data;
      
      // Generate isolated Qdrant collection name
      const qdrantCollectionName = `sb_${user!.id}_${Date.now()}`;

      const [newBuddy] = await db.insert(studyBuddies).values({
        userId: user!.id,
        name,
        subject,
        description,
        qdrantCollectionName,
      }).returning();

      // Create Qdrant collection
      await qdrantService.createCollection(qdrantCollectionName);

      return newBuddy;
    } catch (error) {
      console.error("Error creating StudyBuddy:", error);
      set.status = 500;
      return { message: error instanceof Error ? error.message : "Failed to create StudyBuddy" };
    }
  })
  .post("", async ({ body, user, set }) => {
    try {
      // Validate body
      const parsed = createStudyBuddySchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { message: "Validation failed", errors: parsed.error.issues };
      }

      const { name, subject, description } = parsed.data;
      
      // Generate isolated Qdrant collection name
      const qdrantCollectionName = `sb_${user!.id}_${Date.now()}`;

      const [newBuddy] = await db.insert(studyBuddies).values({
        userId: user!.id,
        name,
        subject,
        description,
        qdrantCollectionName,
      }).returning();

      // Create Qdrant collection
      await qdrantService.createCollection(qdrantCollectionName);

      return newBuddy;
    } catch (error) {
      console.error("Error creating StudyBuddy:", error);
      set.status = 500;
      return { message: error instanceof Error ? error.message : "Failed to create StudyBuddy" };
    }
  })
  .put("/:id", async ({ params: { id }, body, user, set }) => {
    const parsed = updateStudyBuddySchema.safeParse(body);
    if (!parsed.success) {
        set.status = 400;
        return parsed.error.issues;
    }

    const [updatedBuddy] = await db.update(studyBuddies)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(and(eq(studyBuddies.id, id), eq(studyBuddies.userId, user!.id)))
        .returning();
    
    if (!updatedBuddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    return updatedBuddy;
  })
  .delete("/:id", async ({ params: { id }, user, set }) => {
     const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, id), eq(studyBuddies.userId, user!.id)),
     });

     if (!buddy) {
         set.status = 404;
         return "StudyBuddy not found";
     }

     // Delete from DB
     await db.delete(studyBuddies).where(eq(studyBuddies.id, id));

     // Delete Qdrant collection
     if (buddy.qdrantCollectionName) {
         await qdrantService.deleteCollection(buddy.qdrantCollectionName);
     }
     // TODO: Delete files from ImageKit

     return { success: true };
  });
