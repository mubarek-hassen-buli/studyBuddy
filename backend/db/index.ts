import * as dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import * as dotenv from "dotenv";
dotenv.config();

import { Pool, Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Sanitize connection URL:
// 1. Remove '-pooler.' to connect directly to PostgreSQL compute
// 2. Remove 'channel_binding' (causes unexpected socket drops on proxies)
// 3. Convert 'sslmode=require' to 'sslmode=verify-full' to silence deprecation warnings
let connectionString = process.env.DATABASE_URL.replace("-pooler.", ".");
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

// -----------------------------------------------------------------------------
// Resilient Neon DNS & Compute Routing Shield
// -----------------------------------------------------------------------------
// When machines are connected via local mobile hotspots (e.g. mshome.net / ICS),
// the local DNS proxy frequently contaminates CNAME lookups for AWS domains with
// Route 53 Name Server IPs (205.251.*.*). Attempting to connect to these NS IPs
// causes connection timeouts and unexpected socket resets.
//
// ResilientClient dynamically inspects the resolved addresses, filters out non-compute
// Route 53 NS IPs, and connects directly to the valid AWS compute endpoint while
// preserving SNI servername routing for Neon multi-tenant TLS.
// -----------------------------------------------------------------------------
let cachedComputeIp: string | null = null;
let lastResolveTime = 0;

async function getValidComputeIp(hostname: string): Promise<string> {
  const now = Date.now();
  if (cachedComputeIp && now - lastResolveTime < 60000) {
    return cachedComputeIp;
  }

  try {
    const raw = await dns.promises.lookup(hostname, { all: true });
    const valid = raw.filter(
      (a) =>
        a.family === 4 &&
        !a.address.startsWith("205.251.") &&
        !a.address.startsWith("2600:")
    );
    if (valid.length > 0) {
      cachedComputeIp = valid[0].address;
      lastResolveTime = now;
      return cachedComputeIp;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[DNS Shield] Lookup failed, falling back to cached IP:", message);
  }

  return cachedComputeIp || "3.141.122.14";
}

class ResilientClient extends Client {
  override async connect(callback?: any): Promise<void | any> {
    const rawHost = this.host;
    if (rawHost && rawHost.includes("neon.tech")) {
      const cleanIp = await getValidComputeIp(rawHost);
      this.host = cleanIp;
      if (typeof this.ssl === "object" && this.ssl !== null) {
        (this.ssl as any).servername = rawHost;
      } else {
        this.ssl = { rejectUnauthorized: false, servername: rawHost } as any;
      }
    }
    return super.connect(callback);
  }
}

// Resilient PostgreSQL connection pool for Node.js
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  Client: ResilientClient as any,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Pool-level error handler to catch background socket closures gracefully
pool.on("error", (err) => {
  console.warn("Notice: Idle PostgreSQL socket closed by server (pool will re-establish on next query):", err.message);
});

// Transparent query retry wrapper:
// Automatically retries transient connection resets / timeouts / cold starts seamlessly
const rawPoolQuery = pool.query.bind(pool);
(pool as any).query = async function (this: any, ...args: any[]) {
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await (rawPoolQuery as any)(...args);
    } catch (err: any) {
      const isTransient =
        err?.message?.includes("Connection terminated") ||
        err?.cause?.message?.includes("Connection terminated") ||
        err?.code === "ECONNRESET" ||
        err?.code === "ETIMEDOUT" ||
        err?.cause?.code === "ETIMEDOUT" ||
        err?.name === "AggregateError" ||
        err?.cause?.name === "AggregateError" ||
        err?.code === "57P01";

      if (isTransient && attempt < maxRetries) {
        console.warn(`Notice: Transient database connection delay (attempt ${attempt + 1}/${maxRetries}). Retrying query...`);
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        continue;
      }
      throw err;
    }
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
