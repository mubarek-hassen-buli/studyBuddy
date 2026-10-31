import { Elysia } from "elysia";
import { auth } from "../auth";
import { db } from "../db";
import { users, sessions } from "../db/schema/users";
import { eq } from "drizzle-orm";

export const verifyAdminSession = async (headers: Headers) => {
  // 1. Try Better Auth session cookie verification
  let session = await auth.api.getSession({ headers });

  // 2. Fallback: Check Bearer token in Authorization header for API / mobile clients
  if (!session?.user?.id) {
    const authHeader = headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token) {
        const dbSession = await db.query.sessions.findFirst({
          where: eq(sessions.token, token),
        });

        if (dbSession && new Date(dbSession.expiresAt) > new Date()) {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, dbSession.userId),
          });

          if (dbUser) {
            session = {
              session: {
                id: dbSession.id,
                userId: dbSession.userId,
                token: dbSession.token,
                expiresAt: dbSession.expiresAt,
                createdAt: dbSession.createdAt,
                updatedAt: dbSession.updatedAt,
                ipAddress: dbSession.ipAddress,
                userAgent: dbSession.userAgent,
              },
              user: dbUser,
            };
          }
        }
      }
    }
  }

  if (!session?.user?.id) {
    return {
      adminUser: null,
      authError: {
        status: 401,
        error: "Unauthorized",
        message: "Authentication required to access admin portal",
      },
    };
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!dbUser) {
    return {
      adminUser: null,
      authError: {
        status: 401,
        error: "Unauthorized",
        message: "User account associated with this session was not found",
      },
    };
  }

  // Check if user is suspended/banned
  if (dbUser.banned) {
    if (dbUser.banExpires && new Date(dbUser.banExpires) <= new Date()) {
      // Auto-remedy expired ban
      await db
        .update(users)
        .set({ banned: false, banReason: null, banExpires: null, updatedAt: new Date() })
        .where(eq(users.id, dbUser.id));
    } else {
      return {
        adminUser: null,
        authError: {
          status: 403,
          error: "Forbidden",
          message: dbUser.banReason
            ? `Account suspended: ${dbUser.banReason}`
            : "Account suspended",
        },
      };
    }
  }

  // Strictly verify role is 'super_admin'
  if (dbUser.role !== "super_admin") {
    return {
      adminUser: null,
      authError: {
        status: 403,
        error: "Forbidden",
        message: "Access restricted: super administrator privileges required",
      },
    };
  }

  return {
    adminUser: dbUser,
    authError: null,
  };
};

export const adminGuard = new Elysia({ name: "admin-guard" })
  .derive({ as: "scoped" }, async ({ request }) => {
    const rawIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const { adminUser, authError } = await verifyAdminSession(request.headers);

    return {
      adminUser,
      authError,
      clientIp: rawIp,
      userAgent,
    };
  })
  .onBeforeHandle({ as: "scoped" }, ({ adminUser, authError, set }) => {
    if (authError || !adminUser) {
      set.status = authError?.status || 401;
      return {
        error: authError?.error || "Unauthorized",
        message: authError?.message || "Authentication required to access admin portal",
      };
    }
  });
