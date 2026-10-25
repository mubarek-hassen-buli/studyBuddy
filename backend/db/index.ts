import * as dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import * as dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Sanitize connection URL:
// 1. Remove 'channel_binding' (causes unexpected socket drops on PgBouncer proxying)
// 2. Convert 'sslmode=require' to 'sslmode=verify-full' to silence libpq deprecation warnings
let connectionString = process.env.DATABASE_URL;
try {
  const parsed = new URL(connectionString);
  parsed.searchParams.delete("channel_binding");
  if (parsed.searchParams.get("sslmode") === "require") {
    parsed.searchParams.set("sslmode", "verify-full");
  }
  connectionString = parsed.toString();
} catch {
  connectionString = connectionString
    .replace(/([?&])channel_binding=[^&]*(&|$)/g, "$1")
    .replace(/[?&]$/, "")
    .replace("sslmode=require", "sslmode=verify-full");
}


// Resilient PostgreSQL connection pool for Node.js over standard TCP port 5432
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 20000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Pool-level error handler to gracefully log and recover from server-side idle socket closures
pool.on("error", (err) => {
  console.warn("Notice: Idle PostgreSQL connection closed by remote server (pool will re-establish on next query):", err.message);
});

export const db = drizzle(pool, { schema });

