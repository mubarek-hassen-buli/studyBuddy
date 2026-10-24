import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

// Use ws to ensure rock-solid WebSocket connectivity in Node.js
neonConfig.webSocketConstructor = ws;

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("⏳ Running migrations...");

  const start = Date.now();

  try {
    const migrationsFolder = path.resolve(__dirname, "migrations");
    await migrate(db, { migrationsFolder });
    const end = Date.now();
    console.log(`✅ Migrations completed in ${end - start}ms`);
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed");
    console.error(err);
    await pool.end();
    process.exit(1);
  }
};

runMigrate();
