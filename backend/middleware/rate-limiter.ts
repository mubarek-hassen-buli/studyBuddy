import { Elysia } from "elysia";
import { db } from "../../db";
import { usage } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

// Simple in-memory rate limiter for MVP
// In production, use Redis
const rateLimits = new Map<string, number[]>();

export const rateLimiter = (options: { limit: number; window: number }) => {
  return new Elysia({ name: "rate-limiter" }).derive(({ request, set }) => {
    // Identify user by IP or specific header if auth not present yet
    // ideally use user ID from auth, but this runs before auth sometimes
    const ip = request.headers.get("x-forwarded-for") || "unknown"; 
    
    const now = Date.now();
    const windowStart = now - options.window * 1000;
    
    let timestamps = rateLimits.get(ip) || [];
    timestamps = timestamps.filter((t) => t > windowStart);
    
    if (timestamps.length >= options.limit) {
      set.status = 429;
      return {
        error: "Too many requests",
      }
    }
    
    timestamps.push(now);
    rateLimits.set(ip, timestamps);
    
    return {};
  });
};
