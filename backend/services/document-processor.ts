import { db } from "../../db";
import { studyBuddies, documents, chunks, processingStatusEnum } from "../../db/schema";
import { eq } from "drizzle-orm";
import { parsePdf } from "../utils/parsers/pdf";
import { parseDocx } from "../utils/parsers/docx";
import { parseTxt } from "../utils/parsers/txt";
import { parsePpt } from "../utils/parsers/ppt";
import { chunkText } from "../utils/chunking";
import ImageKit from "imagekit";
import { embeddingService } from "./embedding";
import { qdrantService } from "./qdrant";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const processDocument = async (documentId: string, fileBuffer: Buffer, fileType: "pdf" | "docx" | "ppt" | "txt") => {
  try {
    // 1. Update status to processing
    await db.update(documents).set({ processingStatus: "processing" }).where(eq(documents.id, documentId));

    // Get StudyBuddy info for Qdrant collection
    const doc = await db.query.documents.findFirst({
        where: eq(documents.id, documentId),
        with: {
            studyBuddy: true
        }
    });

    if (!doc || !doc.studyBuddy) {
        throw new Error("Document or associated StudyBuddy not found");
    }

    const collectionName = doc.studyBuddy.qdrantCollectionName;
    if (!collectionName) {
        // Fallback or error if collection name missing
        // Should create it if missing, but ideally it exists
        throw new Error("StudyBuddy missing Qdrant collection name");
    }

    // 2. Parse content
    let text = "";
    if (fileType === "pdf") text = await parsePdf(fileBuffer);
    else if (fileType === "docx") text = await parseDocx(fileBuffer);
    else if (fileType === "txt") text = await parseTxt(fileBuffer);
    else if (fileType === "ppt") text = await parsePpt(fileBuffer);

    // 3. Chunk content
    const textChunks = chunkText(text);

    // 4. Update chunk count in DB
    await db.update(documents).set({ chunkCount: textChunks.length }).where(eq(documents.id, documentId));

    // 5. Generate embeddings & Store in Qdrant
    console.log(`Generating embeddings for ${textChunks.length} chunks...`);
    
    // Process in batches if necessary, but here we iterate
    const chunkRecords = [];
    const points = [];

    for (let i = 0; i < textChunks.length; i++) {
        const content = textChunks[i];
        const embedding = await embeddingService.embedText(content);
        const pointId = crypto.randomUUID();

        chunkRecords.push({
            documentId,
            content,
            chunkIndex: i,
            qdrantPointId: pointId,
            metadata: { page: 1 }, // TODO: Better metadata extraction
        });

        points.push({
            id: pointId,
            vector: embedding,
            payload: {
                documentId,
                content,
                chunkIndex: i,
                studyBuddyId: doc.studyBuddyId
            }
        });
    }
    
    // Upsert to Qdrant
    if (points.length > 0) {
        // Ensure collection exists (just in case)
        await qdrantService.createCollection(collectionName);
        await qdrantService.upsertPoints(collectionName, points);
    }
    
    // Batch insert chunks to DB
    if (chunkRecords.length > 0) {
        await db.insert(chunks).values(chunkRecords);
    }

    // 6. Update status to completed
    await db.update(documents).set({ processingStatus: "completed" }).where(eq(documents.id, documentId));

  } catch (error) {
    console.error("Error processing document:", error);
    await db.update(documents).set({ processingStatus: "failed" }).where(eq(documents.id, documentId));
  }
};

export const uploadToImageKit = async (fileName: string, fileBuffer: Buffer) => {
    return await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: "/studybuddy_docs"
    });
};
