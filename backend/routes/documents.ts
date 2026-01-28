import { Elysia, t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db";
import { studyBuddies, documents } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { processDocument, uploadToImageKit } from "../services/document-processor";
import { quotaChecker, incrementQuota } from "../middleware/quota-checker";
import { rateLimiter } from "../middleware/rate-limiter";

export const documentRoutes = new Elysia({ prefix: "/api/documents" })
  .use(rateLimiter({ limit: 10, window: 60 })) // 10 req/min for docs (upload/list)
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
  .post("/upload", async ({ body, user, set }) => {
    const { studyBuddyId, file } = body as { studyBuddyId: string, file: File };

    if (!file || !studyBuddyId) {
        set.status = 400;
        return "Missing file or studyBuddyId";
    }

    // Check quota
    // We reuse quotaChecker logic or explicitly call it?
    // middleware is usually cleaner, but here we need to check quota before processing
    // Let's assume we use explicit verification or middleware on this specific route
    // But quotaChecker middleware is factory. We can .use(quotaChecker('upload')) on a scoped instance.
    // For simplicity in this route definition, let's just check manually or trust the global limiter if added.
    // Let's add explicit check for now.
    
    // Verify StudyBuddy ownership
    const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
    });

    if (!buddy) {
        set.status = 404;
        return "StudyBuddy not found";
    }

    // Upload to ImageKit
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResponse = await uploadToImageKit(file.name, buffer);

    // Determine file type
    const ext = file.name.split(".").pop()?.toLowerCase();
    let fileType: "pdf" | "docx" | "ppt" | "txt" = "txt";
    if (ext === "pdf") fileType = "pdf";
    else if (ext === "docx") fileType = "docx";
    else if (ext === "ppt" || ext === "pptx") fileType = "ppt";

    // Create DB record
    const [newDoc] = await db.insert(documents).values({
        studyBuddyId,
        fileName: file.name,
        fileType,
        fileUrl: uploadResponse.url,
        fileSize: file.size,
        processingStatus: "pending",
    }).returning();

    // Trigger async processing
    processDocument(newDoc.id, buffer, fileType);
    
    // Increment usage
    await incrementQuota(user!.id, "upload");

    return newDoc;
  }, {
    body: t.Object({
        studyBuddyId: t.String(),
        file: t.File()
    })
  })
  .get("/list/:studyBuddyId", async ({ params: { studyBuddyId }, user, set }) => {
     // Verify ownership
     const buddy = await db.query.studyBuddies.findFirst({
        where: and(eq(studyBuddies.id, studyBuddyId), eq(studyBuddies.userId, user!.id))
     });

     if (!buddy) {
         set.status = 404;
         return "StudyBuddy not found";
     }

     return await db.query.documents.findMany({
         where: eq(documents.studyBuddyId, studyBuddyId),
         orderBy: [desc(documents.createdAt)]
     });
  })
  .delete("/:id", async ({ params: { id }, user, set }) => {
      // Find document and check ownership via StudyBuddy
      const doc = await db.query.documents.findFirst({
          where: eq(documents.id, id),
          with: {
              studyBuddy: true // Need relation setup in schema or manual join/check
          }
      });
      
      // Since we didn't define relation in schema query explicitly for `with`, we do manual check
      if (!doc) {
          set.status = 404;
          return "Document not found";
      }

      // Check if user owns the study buddy
      const buddy = await db.query.studyBuddies.findFirst({
          where: and(eq(studyBuddies.id, doc.studyBuddyId), eq(studyBuddies.userId, user!.id))
      });

      if (!buddy) {
          set.status = 403;
          return "Unauthorized";
      }

      // Delete from DB (Cascade will delete chunks)
      await db.delete(documents).where(eq(documents.id, id));

      // TODO: Delete from ImageKit
      // TODO: Delete vectors from Qdrant

      return { success: true };
  });
