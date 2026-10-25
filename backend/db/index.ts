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
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Pool-level error handler to catch background socket closures gracefully
pool.on("error", (err) => {
  console.warn("Notice: Idle PostgreSQL socket closed by server (pool will re-establish on next query):", err.message);
});

// Transparent query retry wrapper:
// Automatically retries transient connection resets / cold start terminations seamlessly
const rawPoolQuery = pool.query.bind(pool);
(pool as any).query = async function (this: any, ...args: any[]) {
  try {
    return await (rawPoolQuery as any)(...args);
  } catch (err: any) {
    const isConnError =
      err?.message?.includes("Connection terminated") ||
      err?.cause?.message?.includes("Connection terminated") ||
      err?.code === "ECONNRESET" ||
      err?.code === "57P01";
    if (isConnError) {
      console.warn("Notice: Transient connection drop encountered. Re-establishing connection and retrying query...");
      await new Promise((resolve) => setTimeout(resolve, 350));
      return await (rawPoolQuery as any)(...args);
    }
    throw err;
  }
};

// Background keepalive heartbeat:
// Pings Neon every 2 minutes to prevent compute auto-suspend and keep TCP sockets hot
const KEEP_ALIVE_INTERVAL_MS = 2 * 60 * 1000;
const heartbeatTimer = setInterval(async () => {
  try {
    await rawPoolQuery("SELECT 1");
  } catch {
    // Ignore heartbeat errors; pool will reconnect on demand
  }
}, KEEP_ALIVE_INTERVAL_MS);

if (heartbeatTimer.unref) {
  heartbeatTimer.unref();
}

export const db = drizzle(pool, { schema });


