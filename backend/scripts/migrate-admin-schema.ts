import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { pool } from "../db";

async function run() {
  console.log("⏳ Applying admin schema migrations to database...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Extend user table with strict roles ('user' | 'super_admin')
    await client.query(`
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'user';
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banReason" TEXT;
      ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banExpires" TIMESTAMP;
    `);

    // 2. Create admin audit log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "admin_audit_log" (
        "id" TEXT PRIMARY KEY,
        "adminId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "adminEmail" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "targetId" TEXT,
        "targetEmail" TEXT,
        "details" JSONB,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // 3. Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS "idx_user_role" ON "user"("role");
      CREATE INDEX IF NOT EXISTS "idx_admin_audit_log_adminId" ON "admin_audit_log"("adminId");
      CREATE INDEX IF NOT EXISTS "idx_admin_audit_log_createdAt" ON "admin_audit_log"("createdAt");
    `);

    await client.query("COMMIT");
    console.log("✅ Admin schema migration completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Admin schema migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
