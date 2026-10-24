import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { users, sessions, accounts, verifications } from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  // 1. ADD COOKIE CONFIGURATION
  advanced: {
    crossDomain: true,
    useSecureCookies: true, // Force secure cookies in production (must be HTTPS)
    defaultCookieAttributes: {
      sameSite: "none", // Allows cookie to be sent across different domains
      secure: true,     // Required when sameSite is "none" (must use HTTPS)
      httpOnly: true,
      partitioned: true, // Support CHIPS for cross-domain auth
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://study-buddy-self-ten.vercel.app",
    "https://studybuddy-production-4127.up.railway.app",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET!,
});

