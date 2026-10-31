import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import app from "../index";

async function runRoleTests() {
  console.log("=== Testing Admin RBAC (Super Admin vs User) ===");

  // Find a standard user (role: "user") and super admin (role: "super_admin")
  const superAdmin = await db.query.users.findFirst({
    where: eq(users.role, "super_admin"),
  });
  console.log("Found Super Admin:", superAdmin?.email, "Role:", superAdmin?.role);

  const standardUser = await db.query.users.findFirst({
    where: eq(users.role, "user"),
  });
  console.log("Found Standard User:", standardUser?.email, "Role:", standardUser?.role);

  if (!superAdmin) {
    throw new Error("No super admin found in database!");
  }

  // Create real test sessions for both in Better Auth session table
  const superAdminToken = "test-super-admin-token-" + Date.now();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.insert(sessions).values({
    id: "session-" + Date.now() + "-admin",
    userId: superAdmin.id,
    token: superAdminToken,
    expiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  let standardUserToken = "";
  if (standardUser) {
    standardUserToken = "test-standard-user-token-" + Date.now();
    await db.insert(sessions).values({
      id: "session-" + Date.now() + "-user",
      userId: standardUser.id,
      token: standardUserToken,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  try {
    // 1. Standard User Request -> Must receive 403 Forbidden
    if (standardUser) {
      console.log("\n[Test 1] Testing standard user (role: 'user') accessing /api/admin/me...");
      const userRes = await app.handle(
        new Request("http://localhost:3001/api/admin/me", {
          headers: {
            authorization: `Bearer ${standardUserToken}`,
          },
        })
      );
      console.log(`Status: ${userRes.status}`);
      const userBody = await userRes.json();
      console.log(`Response:`, userBody);
      if (userRes.status !== 403) {
        throw new Error(`Expected 403 Forbidden for standard user, got ${userRes.status}`);
      }
      console.log("✓ Test 1 Passed: Standard user correctly blocked with 403 Forbidden.");
    }

    // 2. Super Admin Request -> Must receive 200 OK
    console.log("\n[Test 2] Testing super admin accessing /api/admin/me...");
    const adminRes = await app.handle(
      new Request("http://localhost:3001/api/admin/me", {
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      })
    );
    console.log(`Status: ${adminRes.status}`);
    const adminBody = await adminRes.json();
    console.log(`Response:`, adminBody);
    if (adminRes.status !== 200) {
      throw new Error(`Expected 200 OK for super admin, got ${adminRes.status}`);
    }
    if (adminBody.user?.role !== "super_admin") {
      throw new Error(`Expected role 'super_admin', got ${adminBody.user?.role}`);
    }
    console.log("✓ Test 2 Passed: Super admin successfully authenticated.");

    // 3. Super Admin reading analytics overview
    console.log("\n[Test 3] Testing super admin accessing /api/admin/analytics/overview...");
    const analyticsRes = await app.handle(
      new Request("http://localhost:3001/api/admin/analytics/overview", {
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      })
    );
    console.log(`Status: ${analyticsRes.status}`);
    const analyticsBody = await analyticsRes.json();
    console.log(`Analytics Output:`, JSON.stringify(analyticsBody, null, 2));
    if (analyticsRes.status !== 200) {
      throw new Error(`Expected 200 OK for analytics overview, got ${analyticsRes.status}`);
    }
    console.log("✓ Test 3 Passed: Analytics overview fetched successfully.");

    // 4. Super Admin listing users
    console.log("\n[Test 4] Testing super admin accessing /api/admin/users...");
    const usersRes = await app.handle(
      new Request("http://localhost:3001/api/admin/users?limit=5", {
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      })
    );
    console.log(`Status: ${usersRes.status}`);
    const usersBody = await usersRes.json();
    console.log(`Users Total:`, usersBody.pagination?.total, `Found:`, usersBody.users?.length);
    if (usersRes.status !== 200) {
      throw new Error(`Expected 200 OK for user list, got ${usersRes.status}`);
    }
    console.log("✓ Test 4 Passed: Users directory listed successfully.");

    // 5. Super Admin listing materials
    console.log("\n[Test 5] Testing super admin accessing /api/admin/materials...");
    const materialsRes = await app.handle(
      new Request("http://localhost:3001/api/admin/materials?limit=5", {
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      })
    );
    console.log(`Status: ${materialsRes.status}`);
    const materialsBody = await materialsRes.json();
    console.log(`Materials Total:`, materialsBody.pagination?.total, `Found:`, materialsBody.documents?.length);
    if (materialsRes.status !== 200) {
      throw new Error(`Expected 200 OK for materials list, got ${materialsRes.status}`);
    }
    console.log("✓ Test 5 Passed: Materials listed successfully.");

    // 6. Super Admin reading audit logs
    console.log("\n[Test 6] Testing super admin accessing /api/admin/audit-logs...");
    const auditRes = await app.handle(
      new Request("http://localhost:3001/api/admin/audit-logs?limit=5", {
        headers: {
          authorization: `Bearer ${superAdminToken}`,
        },
      })
    );
    console.log(`Status: ${auditRes.status}`);
    const auditBody = await auditRes.json();
    console.log(`Audit Logs Total:`, auditBody.pagination?.total, `Found:`, auditBody.logs?.length);
    if (auditRes.status !== 200) {
      throw new Error(`Expected 200 OK for audit logs, got ${auditRes.status}`);
    }
    console.log("✓ Test 6 Passed: Audit logs retrieved successfully.");

    console.log("\n========================================================");
    console.log("ALL RBAC AND ADMIN ENDPOINT TESTS PASSED WITH 100% SUCCESS!");
    console.log("========================================================");
  } finally {
    // Cleanup test sessions
    await db.delete(sessions).where(eq(sessions.token, superAdminToken));
    if (standardUserToken) {
      await db.delete(sessions).where(eq(sessions.token, standardUserToken));
    }
    console.log("Cleaned up temporary test sessions.");
  }

  process.exit(0);
}

runRoleTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
