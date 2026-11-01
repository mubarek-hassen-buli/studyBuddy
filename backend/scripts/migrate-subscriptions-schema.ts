import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

import { pool } from "../db";

async function migrate() {
  console.log("⏳ Starting subscriptions and quota schema migration on Neon database...");

  // 1. Add buddiesCreatedCount and subscriptionExpiresAt to user table
  await pool.query(`
    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "buddiesCreatedCount" integer DEFAULT 0 NOT NULL;
    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" timestamp;
  `);
  console.log("✓ Added 'buddiesCreatedCount' and 'subscriptionExpiresAt' columns to 'user' table.");

  // 2. Initialize existing users' buddiesCreatedCount based on current active study buddies
  await pool.query(`
    UPDATE "user" u 
    SET "buddiesCreatedCount" = (
      SELECT COUNT(*) FROM study_buddies sb WHERE sb.user_id = u.id
    )
    WHERE "buddiesCreatedCount" = 0;
  `);
  console.log("✓ Backfilled initial 'buddiesCreatedCount' for existing users.");

  // 3. Create enums
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE subscription_status AS ENUM ('pending', 'approved', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE payment_method AS ENUM ('cbe', 'telebirr');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);
  console.log("✓ Verified 'subscription_status' and 'payment_method' enums.");

  // 4. Create subscription_requests table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscription_requests (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      plan text DEFAULT 'pro' NOT NULL,
      amount integer DEFAULT 500 NOT NULL,
      currency text DEFAULT 'ETB' NOT NULL,
      payment_method payment_method NOT NULL,
      transaction_reference text NOT NULL,
      sender_phone text,
      sender_name text,
      receipt_url text,
      status subscription_status DEFAULT 'pending' NOT NULL,
      admin_notes text,
      reviewed_by text REFERENCES "user"(id),
      reviewed_at timestamp,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("✓ Created 'subscription_requests' table.");

  // 5. Create indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_sub_requests_user ON subscription_requests(user_id);
    CREATE INDEX IF NOT EXISTS idx_sub_requests_status ON subscription_requests(status);
    CREATE INDEX IF NOT EXISTS idx_sub_requests_created ON subscription_requests(created_at DESC);
  `);
  console.log("✓ Created indexes for 'subscription_requests'.");

  console.log("🎉 Database schema migration completed successfully!");
  await pool.end();
  process.exit(0);
}

migrate().catch(async (e) => {
  console.error("Migration failed:", e);
  await pool.end();
  process.exit(1);
});

