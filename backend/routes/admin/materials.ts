import { Elysia } from "elysia";
import { db } from "../../db";
import { documents, studyBuddies, users, chunks } from "../../db/schema";
import { eq, and, ilike, count, desc } from "drizzle-orm";
import { logAdminAction } from "../../services/audit";
import { adminGuard } from "../../middleware/admin-guard";
import { listMaterialsQuerySchema } from "../../validators/admin";

export const adminMaterialsRoutes = new Elysia({ prefix: "/materials" })
  .use(adminGuard)

  // 1. Paginated global documents listing with owner enrichment
  .get("/", async ({ query, set }) => {
    try {
      const parsed = listMaterialsQuerySchema.safeParse(query);
      if (!parsed.success) {
        set.status = 400;
        return {
          error: "ValidationError",
          message: parsed.error.issues[0]?.message || "Invalid query parameters",
        };
      }

      const { page, limit, q, status, fileType } = parsed.data;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (q) {
        conditions.push(ilike(documents.fileName, `%${q}%`));
      }

      if (status !== "all") {
        conditions.push(eq(documents.processingStatus, status));
      }

      if (fileType !== "all") {
        conditions.push(eq(documents.fileType, fileType));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [countResult, docList] = await Promise.all([
        db
          .select({ value: count() })
          .from(documents)
          .innerJoin(studyBuddies, eq(documents.studyBuddyId, studyBuddies.id))
          .innerJoin(users, eq(studyBuddies.userId, users.id))
          .where(whereClause),
        db
          .select({
            id: documents.id,
            fileName: documents.fileName,
            fileType: documents.fileType,
            fileUrl: documents.fileUrl,
            fileSize: documents.fileSize,
            processingStatus: documents.processingStatus,
            chunkCount: documents.chunkCount,
            createdAt: documents.createdAt,
            studyBuddyId: documents.studyBuddyId,
            studyBuddyName: studyBuddies.name,
            studyBuddySubject: studyBuddies.subject,
            ownerId: users.id,
            ownerName: users.name,
            ownerEmail: users.email,
          })
          .from(documents)
          .innerJoin(studyBuddies, eq(documents.studyBuddyId, studyBuddies.id))
          .innerJoin(users, eq(studyBuddies.userId, users.id))
          .where(whereClause)
          .orderBy(desc(documents.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = countResult[0]?.value || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        documents: docList,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("[AdminMaterials] Error listing materials:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to retrieve documents catalog",
      };
    }
  })

  // 2. Administrative document purge
  .delete("/:id", async ({ params: { id }, adminUser, clientIp, userAgent, set }) => {
    try {
      const docWithDetails = await db
        .select({
          id: documents.id,
          fileName: documents.fileName,
          fileSize: documents.fileSize,
          studyBuddyId: documents.studyBuddyId,
          ownerId: users.id,
          ownerEmail: users.email,
        })
        .from(documents)
        .innerJoin(studyBuddies, eq(documents.studyBuddyId, studyBuddies.id))
        .innerJoin(users, eq(studyBuddies.userId, users.id))
        .where(eq(documents.id, id))
        .limit(1);

      const targetDoc = docWithDetails[0];
      if (!targetDoc) {
        set.status = 404;
        return { error: "NotFound", message: "Document not found" };
      }

      // Purge document and related text chunks atomically in transaction
      await db.transaction(async (tx) => {
        await tx.delete(chunks).where(eq(chunks.documentId, id));
        await tx.delete(documents).where(eq(documents.id, id));
      });

      await logAdminAction({
        adminId: adminUser!.id,
        adminEmail: adminUser!.email,
        action: "DOCUMENT_DELETED",
        targetId: targetDoc.id,
        targetEmail: targetDoc.ownerEmail,
        details: {
          fileName: targetDoc.fileName,
          fileSize: targetDoc.fileSize,
          ownerId: targetDoc.ownerId,
        },
        ipAddress: clientIp,
        userAgent,
      });

      return {
        success: true,
        message: `Document '${targetDoc.fileName}' and associated chunks deleted successfully.`,
      };
    } catch (error) {
      console.error("[AdminMaterials] Error purging document:", error);
      set.status = 500;
      return {
        error: "InternalServerError",
        message: "Failed to purge document",
      };
    }
  });
