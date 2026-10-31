import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

import app from "../index";

async function runTests() {
  console.log("=== Testing Admin API Security Barrier ===");

  // 1. Unauthenticated Request to /api/admin/me
  console.log("\n[Test 1] Testing unauthenticated access to /api/admin/me...");
  const res1 = await app.handle(new Request("http://localhost:3001/api/admin/me"));
  console.log(`Status: ${res1.status}`);
  const body1 = await res1.json();
  console.log(`Response:`, body1);
  if (res1.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${res1.status}`);
  }
  console.log("✓ Test 1 Passed: Unauthenticated request rejected with 401.");

  // 2. Unauthenticated Request to /api/admin/analytics/overview
  console.log("\n[Test 2] Testing unauthenticated access to /api/admin/analytics/overview...");
  const res2 = await app.handle(new Request("http://localhost:3001/api/admin/analytics/overview"));
  console.log(`Status: ${res2.status}`);
  const body2 = await res2.json();
  console.log(`Response:`, body2);
  if (res2.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${res2.status}`);
  }
  console.log("✓ Test 2 Passed: Unauthenticated analytics rejected with 401.");

  // 3. Unauthenticated Request to /api/admin/users
  console.log("\n[Test 3] Testing unauthenticated access to /api/admin/users...");
  const res3 = await app.handle(new Request("http://localhost:3001/api/admin/users"));
  console.log(`Status: ${res3.status}`);
  const body3 = await res3.json();
  console.log(`Response:`, body3);
  if (res3.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${res3.status}`);
  }
  console.log("✓ Test 3 Passed: Unauthenticated users list rejected with 401.");

  // 4. Unauthenticated Request to /api/admin/materials
  console.log("\n[Test 4] Testing unauthenticated access to /api/admin/materials...");
  const res4 = await app.handle(new Request("http://localhost:3001/api/admin/materials"));
  console.log(`Status: ${res4.status}`);
  const body4 = await res4.json();
  console.log(`Response:`, body4);
  if (res4.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${res4.status}`);
  }
  console.log("✓ Test 4 Passed: Unauthenticated materials list rejected with 401.");

  // 5. Unauthenticated Request to /api/admin/audit-logs
  console.log("\n[Test 5] Testing unauthenticated access to /api/admin/audit-logs...");
  const res5 = await app.handle(new Request("http://localhost:3001/api/admin/audit-logs"));
  console.log(`Status: ${res5.status}`);
  const body5 = await res5.json();
  console.log(`Response:`, body5);
  if (res5.status !== 401) {
    throw new Error(`Expected 401 Unauthorized but got ${res5.status}`);
  }
  console.log("✓ Test 5 Passed: Unauthenticated audit logs list rejected with 401.");

  console.log("\nAll security barrier endpoints verified successfully!");
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
