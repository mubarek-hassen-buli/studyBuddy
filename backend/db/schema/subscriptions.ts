import { pgTable, text, timestamp, uuid, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const subscriptionStatusEnum = pgEnum("subscription_status", ["pending", "approved", "rejected"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cbe", "telebirr"]);

export const subscriptionRequests = pgTable("subscription_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").default("pro").notNull(),
  amount: integer("amount").default(500).notNull(), // 500 ETB
  currency: text("currency").default("ETB").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  transactionReference: text("transaction_reference").notNull(),
  senderPhone: text("sender_phone"),
  senderName: text("sender_name"),
  receiptUrl: text("receipt_url"),
  status: subscriptionStatusEnum("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  reviewedBy: text("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SubscriptionRequest = typeof subscriptionRequests.$inferSelect;
export type NewSubscriptionRequest = typeof subscriptionRequests.$inferInsert;

