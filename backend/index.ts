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
  .use(studyBuddyRoutes)
  .use(documentRoutes)
  .use(chatRoutes)
  .use(learningRoutes)
  .use(sessionsRoutes)
  .get("/", () => "Hello from StudyBuddy API")
  .listen(process.env.PORT || 3001);

console.log(
  `🦊 Elysia is running at http://localhost:3001`
);

export default app;
  