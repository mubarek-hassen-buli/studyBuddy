import { pgTable, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { studyBuddies } from "./studybuddies";

export const fileTypeEnum = pgEnum("file_type", ["pdf", "docx", "ppt", "txt"]);
export const processingStatusEnum = pgEnum("processing_status", ["pending", "processing", "completed", "failed"]);

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  studyBuddyId: uuid("study_buddy_id").notNull().references(() => studyBuddies.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileType: fileTypeEnum("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  processingStatus: processingStatusEnum("processing_status").default("pending").notNull(),
  chunkCount: integer("chunk_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
