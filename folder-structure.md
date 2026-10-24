# 🗂️ StudyBuddy — Proposed Decoupled Folder Structure

This document outlines the proposed target folder structure separating the monolithic codebase into two clean, self-contained applications: **`frontend/`** (Next.js 16) and **`backend/`** (Elysia.js).

---

## 1. High-Level Target Architecture

```
Study-buddy/
├── .git/
├── .gitignore
├── README.md
├── DEPLOYMENT.md
├── folder-structure.md         <-- This architecture blueprint
├── env.md                      <-- Environment variable specifications
├── package.json                <-- Root workspace runner (runs frontend & backend)
│
├── frontend/                   <-- Standalone Next.js 16 Client App
│   ├── app/                    <-- App Router pages & layouts
│   ├── components/             <-- UI, Dashboard, Layout, & Visual components
│   ├── hooks/                  <-- TanStack Query hooks & client hooks
│   ├── store/                  <-- Zustand stores (auth, studybuddy, app)
│   ├── lib/                    <-- API client, auth client, client utils, validators
│   ├── public/                 <-- Static assets, icons, videos
│   ├── .env.local              <-- Frontend environment variables
│   ├── .env.example
│   ├── components.json         <-- shadcn/ui configuration
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── package.json            <-- Frontend-only dependencies (React 19, Next 16, Tailwind, etc.)
│
└── backend/                    <-- Standalone Elysia.js API Server
    ├── db/                     <-- Neon Serverless PostgreSQL connection & Drizzle schema
    │   ├── schema/             <-- Drizzle table definitions & relations
    │   ├── migrations/         <-- Drizzle SQL migrations
    │   ├── index.ts            <-- DB connection pool initialization
    │   └── migrate.ts          <-- Migration runner script
    ├── routes/                 <-- Elysia API route controllers
    ├── services/               <-- Business logic (RAG, Gemini, Qdrant, Parsers)
    ├── middleware/             <-- Rate limiters, quota checkers
    ├── utils/                  <-- Text parsers (PDF, DOCX, PPTX), chunking logic
    ├── auth.ts                 <-- Better-Auth server configuration
    ├── index.ts                <-- Elysia app entry point & server bootstrap
    ├── drizzle.config.ts       <-- Drizzle Kit configuration
    ├── railway.json            <-- Railway deployment configuration
    ├── .env                    <-- Backend secrets & cloud service credentials
    ├── .env.example
    ├── tsconfig.json
    └── package.json            <-- Backend-only dependencies (Elysia, Drizzle, Qdrant, Gemini, etc.)
```

---

## 2. Granular File-by-File Migration Matrix

| Current Location in Root | Target Location | Rationale & Responsibility |
|---|---|---|
| **Malicious File** | | |
| `preinstall.js` | **DELETED** | Obfuscated crypto-stealer payload. Must be completely removed. |
| **Backend & Database** | | |
| `backend/index.ts` | `backend/index.ts` | Elysia server entry point. |
| `backend/auth.ts` | `backend/auth.ts` | Better-Auth server configuration with Drizzle adapter. |
| `backend/routes/*` | `backend/routes/*` | API routes (`studybuddy`, `documents`, `chat`, `learning`, `auth`). |
| `backend/services/*` | `backend/services/*` | Services (`rag`, `qdrant`, `embedding`, `document-processor`, `learning-modes`). |
| `backend/middleware/*` | `backend/middleware/*` | Quota checker and rate limiter middlewares. |
| `backend/utils/*` | `backend/utils/*` | Document parsers (`pdf`, `docx`, `ppt`, `txt`) and chunking algorithms. |
| `db/*` | `backend/db/*` | Database connection, Drizzle schemas, relations, and migrations. |
| `drizzle.config.ts` | `backend/drizzle.config.ts` | Drizzle ORM migration configuration (co-located with backend). |
| `railway.json` | `backend/railway.json` | Railway service build and deployment configuration. |
| **Frontend & UI** | | |
| `app/*` | `frontend/app/*` | Next.js App Router (`(auth)`, `dashboard`, `page.tsx`, `layout.tsx`). |
| `components/*` | `frontend/components/*` | UI components (`dashboard/`, `ui/`, `auth/`, `layout/`, `landing-page.tsx`). |
| `hooks/*` | `frontend/hooks/*` | Client hooks (`use-buddies`, `use-documents`, `use-learning-content`, etc.). |
| `store/*` | `frontend/store/*` | Zustand stores (`auth-store.ts`, `studybuddy-store.ts`, `app-store.ts`). |
| `public/*` | `frontend/public/*` | Static images, icons, and video assets. |
| `components.json` | `frontend/components.json` | shadcn/ui component generator settings. |
| `next.config.ts` | `frontend/next.config.ts` | Next.js runtime & compiler configuration. |
| `postcss.config.mjs` | `frontend/postcss.config.mjs` | Tailwind CSS PostCSS configuration. |
| `middleware.ts` | `frontend/middleware.ts` | Next.js edge route middleware. |
| **Shared / Utility Code** | | |
| `lib/api/client.ts` | `frontend/lib/api/client.ts` | TanStack Query fetcher and REST client targeting backend. |
| `lib/auth-client.ts` | `frontend/lib/auth-client.ts` | Better-Auth client instance. |
| `lib/utils.ts` | `frontend/lib/utils.ts` | Tailwind class merging (`cn`). |
| `lib/validators/studybuddy.ts` | `frontend/lib/validators/` & `backend/validators/` | Zod validation schemas (kept in sync or imported). |

---

## 3. Dependency Separation Matrix

### `frontend/package.json` Dependencies
```json
{
  "name": "studybuddy-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.1.0",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@react-three/fiber": "^9.5.0",
    "@tabler/icons-react": "^3.36.1",
    "@tanstack/react-query": "^5.90.20",
    "better-auth": "^1.4.17",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "motion": "^12.29.2",
    "next": "16.1.5",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.71.1",
    "shadcn": "^3.7.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "three": "^0.167.1",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.3.6",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.182.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### `backend/package.json` Dependencies
```json
{
  "name": "studybuddy-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch index.ts",
    "start": "tsx index.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx db/migrate.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@elysiajs/cors": "^1.4.1",
    "@elysiajs/node": "^1.4.3",
    "@elysiajs/stream": "^1.1.0",
    "@google/generative-ai": "^0.24.1",
    "@neondatabase/serverless": "^1.0.2",
    "@qdrant/js-client-rest": "^1.16.2",
    "better-auth": "^1.4.17",
    "busboy": "^1.6.0",
    "dotenv": "^17.2.3",
    "drizzle-orm": "^0.45.1",
    "elysia": "^1.4.22",
    "imagekit": "^6.0.0",
    "mammoth": "^1.11.0",
    "officegen": "^0.6.5",
    "pdf-parse": "^2.4.5",
    "pptx-text-parser": "^1.1.1",
    "ws": "^8.19.0",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/ws": "^8.18.1",
    "drizzle-kit": "^0.31.8",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

### Root `package.json` Orchestrator
```json
{
  "name": "studybuddy-workspace",
  "private": true,
  "scripts": {
    "dev": "concurrently -n \"frontend,backend\" -c \"blue,green\" \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"",
    "dev:frontend": "npm run dev --prefix frontend",
    "dev:backend": "npm run dev --prefix backend",
    "build:frontend": "npm run build --prefix frontend",
    "start:backend": "npm run start --prefix backend"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
```

---

## 4. Architectural Benefits

1. **Independent Deployability**:
   - Vercel deploys only `frontend/` with root directory set to `frontend/`. No bulky backend modules (`pdf-parse`, `pptx-text-parser`, `@qdrant/js-client-rest`, `@neondatabase/serverless`) are bundled or compiled by Vercel.
   - Railway deploys only `backend/` with root directory set to `backend/`. Build command skips Next.js entirely, cutting build time from minutes to seconds.
2. **Elimination of Dependency Conflicts**:
   - Next.js 16/React 19 build pipeline no longer conflicts with Node-specific binary parser dependencies or Elysia decorators.
3. **Isolated TypeScript Configurations**:
   - Frontend enforces Next.js JSX/TSX resolution rules and React types.
   - Backend enforces strict Node/ESNext module resolution and Drizzle schema typing without frontend DOM type interference.
