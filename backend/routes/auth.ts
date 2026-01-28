import { Elysia } from "elysia";
import { auth } from "../auth";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .all("/*", async ({ request }) => {
    return await auth.handler(request);
  });
