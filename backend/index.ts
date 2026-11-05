import * as dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";
import { studyBuddyRoutes } from "./routes/studybuddy";
import { documentRoutes } from "./routes/documents";
import { chatRoutes } from "./routes/chat";
import { learningRoutes } from "./routes/learning";
import { sessionsRoutes } from "./routes/sessions";
import { subscriptionsRoutes } from "./routes/subscriptions";
import { userRoutes } from "./routes/user";
import { adminRoutes } from "./routes/admin";

const port = Number(process.env.PORT) || 3001;

const app = new Elysia({ adapter: node() })
  .use(cors({
    origin: [
      "http://localhost:3000",
      "https://study-buddy-self-ten.vercel.app",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposeHeaders: ["Set-Cookie"]
  }))
  .use(authRoutes)
  .use(userRoutes)
  .use(studyBuddyRoutes)
  .use(documentRoutes)
  .use(chatRoutes)
  .use(learningRoutes)
  .use(sessionsRoutes)
  .use(subscriptionsRoutes)
  .use(adminRoutes)
  .get("/", () => "Hello from StudyBuddy API")
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen({
    port,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running on port ${port} at 0.0.0.0 (StudyBuddy API)`
);

export default app;
