import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { users, sessions, accounts, verifications } from "./db/schema";

function resolveBaseUrl(): string {
  // If BETTER_AUTH_URL is erroneously set to a Render internal service ID (e.g. srv-xxx) or is malformed,
  // sanitize it or automatically fall back to Render's public URL (RENDER_EXTERNAL_URL).
  const envUrl = process.env.BETTER_AUTH_URL;
  const renderUrl = process.env.RENDER_EXTERNAL_URL;

  if (envUrl && !envUrl.startsWith("srv-")) {
    try {
      const withProto = envUrl.startsWith("http://") || envUrl.startsWith("https://") ? envUrl : `https://${envUrl}`;
      const parsed = new URL(withProto);
      return parsed.origin;
    } catch {
      // fallback
    }
  }

  if (renderUrl) {
    return renderUrl.replace(/\/$/, "");
  }

  return "http://localhost:3001";
}

const resolvedBaseUrl = resolveBaseUrl();
// Sync process.env.BETTER_AUTH_URL so internal BetterAuth env readers get the validated URL
process.env.BETTER_AUTH_URL = resolvedBaseUrl;

const rawFrontend = process.env.FRONTEND_URL;
const resolvedFrontendUrl = rawFrontend && !rawFrontend.startsWith("srv-")
  ? (rawFrontend.startsWith("http://") || rawFrontend.startsWith("https://") ? rawFrontend.replace(/\/$/, "") : `https://${rawFrontend.replace(/\/$/, "")}`)
  : undefined;

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
    "https://folio-s.vercel.app",
    ...(resolvedFrontendUrl ? [resolvedFrontendUrl] : []),
    resolvedBaseUrl,
  ],
  baseURL: resolvedBaseUrl,
  secret: process.env.BETTER_AUTH_SECRET!,
});

