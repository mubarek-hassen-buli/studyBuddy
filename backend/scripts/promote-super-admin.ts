import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { pool, db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function promote() {
  const targetEmail = process.argv[2] || process.env.SUPER_ADMIN_EMAIL;
  if (!targetEmail) {
    console.log("Usage: npx tsx backend/scripts/promote-super-admin.ts <email>");
    console.log("Registered users in database:");
    const all = await db.query.users.findMany({ limit: 15 });
    for (const u of all) {
      console.log(` - ${u.email} (${u.name}) [role: ${u.role}, tier: ${u.tier}]`);
    }
    await pool.end();
    process.exit(0);
  }

  console.log(`⏳ Searching for user: ${targetEmail}...`);
  const user = await db.query.users.findFirst({
    where: eq(users.email, targetEmail),
  });

  if (!user) {
    console.error(`❌ User not found with email: ${targetEmail}`);
    await pool.end();
    process.exit(1);
  }

  await db
    .update(users)
    .set({
      role: "super_admin",
      tier: "pro",
    })
    .where(eq(users.id, user.id));

  console.log(`✅ Success! User ${user.name} (${user.email}) is now a super_admin!`);
  await pool.end();
}

promote().catch(async (e) => {
  console.error("Error:", e);
  await pool.end();
  process.exit(1);
});
