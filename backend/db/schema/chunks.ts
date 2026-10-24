import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { documents } from "./documents";

export const chunks = pgTable("chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  qdrantPointId: text("qdrant_point_id").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
