# 🌿 StudyBuddy (Folio Academy)

> **A tranquil, sunlit study sanctuary for your mind.**  
> Transform messy lecture slides, dense PDFs, and notes into lifelong academic mastery with zero hallucinations.

---

## 📖 Overview

**StudyBuddy (Folio Academy)** is an AI-powered academic learning platform built with a Studio Ghibli–inspired aesthetic. Designed to end late-night exam panic and replace it with calm, steady craft, StudyBuddy ingests course materials and turns them into grounded conversational partners, spaced-repetition flashcard decks, and active-recall quizzes.

Unlike generic chatbots that guess formulas or hallucinate facts, StudyBuddy's AI responses are strictly grounded in your uploaded documents with precise page citations.

---

## ✨ Core Features

### 1. 📚 StudyBuddies & Course Repositories
- Create dedicated companions for every subject or class (e.g., *Biochemistry*, *Contract Law*, *Machine Learning*).
- Upload lecture slides, syllabi, and note exports (**PDF**, **DOCX**, **PPTX**, **TXT**).
- Automatic text extraction, semantic chunking, and vector indexing into Qdrant Cloud.

### 2. 💬 Grounded Academic Chat (RAG)
- Multi-turn conversational AI grounded strictly in your course materials.
- Exact document citations and page references with every answer.
- Zero-hallucination guardrails ensuring exam-safe accuracy.

### 3. 🗂️ Spaced Repetition Flashcards
- Generate high-yield flashcard decks for any topic or document (choose **5, 10, 15, or 20 cards**).
- **Interactive Practice Runner**: 3D card flips, recall grading (*Again <10m*, *Hard 1d*, *Good 3d*, *Easy 7d*), and SM-2-inspired spaced repetition schedules.
- **Full Navigation Freedom**: Next and Previous controls with a quick-jump card pill bar (`1`, `2`, `3` ... `20`).
- **All Cards View**: Browse every generated flashcard in a clean, scrollable deck list with answer-reveal toggles.

### 4. 📝 Active Recall Quizzes
- Generate customizable multiple-choice quizzes from your materials or custom topics.
- Instant feedback, step-by-step rationales, score tracking, and review summaries.

### 5. 📑 Multi-Level Summaries
- Generate tailored summaries from your materials:
  - **Concise**: 1-paragraph high-level overview.
  - **Detailed**: Comprehensive breakdown covering every section.
  - **Key Concepts**: Top 10 terms and definitions.
  - **Exam Prep**: Testable, high-yield takeaways.

### 6. 🎨 Folio Ghibli Aesthetic
- Botanical forest green accents (`#0D382B`), warm parchment paper surfaces (`#FAFBF7`), delicate cream borders (`#E5EAE7`), and classical editorial serif typography (*Newsreader* & *Caveat*).
- Fair student pricing in **Ethiopian Birr (ETB)**: *The Apprentice (0 ETB)* and *The Master Scholar (500 ETB/mo)*.

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────┐           ┌────────────────────────────────┐
│   Frontend (Next.js 16 App)     │           │   Backend (ElysiaJS / Node)    │
│   • React 19 + TypeScript       │  HTTP     │   • ElysiaJS REST API          │
│   • Tailwind CSS + Lucide       │──────────▶│   • Better-Auth Authentication │
│   • TanStack Query + Sonner     │   CORS    │   • Drizzle ORM + Pg Pool      │
│   • Newsreader / Caveat Fonts   │           │   • DNS Routing Shield         │
└─────────────────────────────────┘           └────────────────────────────────┘
                                                              │
                                    ┌─────────────────────────┴────────────────────────┐
                                    ▼                         ▼                        ▼
                        ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
                        │   Neon PostgreSQL    │  │  Google Gemini 2.5   │  │     Qdrant Cloud     │
                        │  Serverless Database │  │ Flash LLM + Batched  │  │   Vector Database    │
                        │   Drizzle Schema     │  │ Embeddings (3072 dim)│  │    RAG Retrieval     │
                        └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

- **Frontend**: Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS, TanStack React Query, Lucide Icons, Sonner.
- **Backend**: ElysiaJS running on Node.js 24 with `@elysiajs/node` and `@elysiajs/cors`.
- **Database & ORM**: PostgreSQL on Neon Serverless, managed via Drizzle ORM with connection pooling and DNS routing resilience.
- **Authentication**: Better-Auth with secure session tokens and middleware barriers.
- **AI & Embeddings**: Google Gemini 2.5 Flash for reasoning and native `batchEmbedContents` for high-throughput, socket-safe embeddings (`gemini-embedding-001`, 3072 dimensions).
- **Vector Search**: Qdrant Cloud for cosine-distance RAG semantic search.
- **Asset Storage**: ImageKit for file uploads and document assets.

---

## 📁 Repository Structure

```
Study-buddy/
├── frontend/                     # Next.js 16 Frontend Application
│   ├── app/                      # App router pages
│   │   ├── dashboard/            # Protected dashboard routes
│   │   │   ├── buddies/          # Companion repository & study modes
│   │   │   ├── documents/        # File & note manager
│   │   │   ├── flashcards/       # Flashcards hub & practice
│   │   │   ├── quizzes/          # Quizzes hub & testing
│   │   │   ├── pricing/          # Folio membership (in ETB)
│   │   │   └── settings/         # Profile & preferences
│   │   ├── sign-in/ & sign-up/   # Authentication flows
│   │   ├── layout.tsx            # Root layout & editorial typography
│   │   └── page.tsx              # Landing page
│   ├── components/               # UI components
│   │   ├── dashboard/            # Dashboard widgets & modals
│   │   │   ├── flashcards/       # Study modal, deck grid, hero
│   │   │   └── quizzes/          # Quiz session modal & creators
│   │   └── landing-page.tsx      # Studio Ghibli-themed Folio showcase
│   ├── hooks/                    # TanStack Query custom hooks
│   └── lib/                      # Better-Auth client & API fetcher
│
├── backend/                      # ElysiaJS REST API Server
│   ├── db/                       # Database layer
│   │   ├── schema/               # Drizzle table definitions
│   │   └── index.ts              # Resilient PostgreSQL pool & DNS shield
│   ├── routes/                   # API Route controllers
│   │   ├── auth.ts               # Better-Auth handler
│   │   ├── studybuddy.ts         # StudyBuddy CRUD & stats
│   │   ├── documents.ts          # Document upload & ingestion
│   │   ├── learning.ts           # Flashcards, quizzes, summaries
│   │   └── chat.ts               # RAG conversational chat
│   ├── services/                 # Core business services
│   │   ├── document-processor.ts # Extraction, chunking & indexing
│   │   ├── embedding.ts          # Resilient batched Gemini embeddings
│   │   ├── qdrant.ts             # Vector search client
│   │   └── rag.ts                # Context retrieval pipeline
│   ├── middleware/               # Rate limiters & quota checkers
│   └── index.ts                  # Server entry point
│
├── DEPLOYMENT.md                 # Production deployment guide
└── package.json                  # Workspace root orchestration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher (Node 24 supported)
- **npm** or **pnpm**
- **Accounts & API Keys**:
  - [Google AI Studio](https://aistudio.google.com/) (`GEMINI_API_KEY`)
  - [Neon Console](https://neon.tech/) (`DATABASE_URL`)
  - [Qdrant Cloud](https://cloud.qdrant.io/) (`QDRANT_URL`, `QDRANT_API_KEY`)
  - [ImageKit](https://imagekit.io/) (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`)

---

### 2. Environment Configuration

#### Backend Configuration (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Neon PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-YOUR-PROJECT.c-7.us-east-2.aws.neon.tech/neondb?sslmode=verify-full

# Better-Auth
BETTER_AUTH_SECRET=your_generated_32_byte_hex_secret
BETTER_AUTH_URL=http://localhost:3001

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Qdrant Vector Cloud
QDRANT_URL=https://your-cluster-id.eu-central-1-0.aws.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# ImageKit Storage
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

#### Frontend Configuration (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001
```

---

### 3. Installation & Database Setup

Install dependencies across the monorepo:
```bash
npm run install:all
```

Push the database schema to Neon:
```bash
npm run db:migrate
```

---

### 4. Running Locally

Start both the frontend and backend concurrently:
```bash
npm run dev:all
```

Or run each service individually:
```bash
# Terminal 1: Frontend (Next.js at http://localhost:3000)
npm run dev:frontend

# Terminal 2: Backend (Elysia at http://localhost:3001)
npm run dev:backend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run strict TypeScript typechecking across both frontend and backend:
```bash
npm run typecheck
```

---

## 🛡️ Key Architectural Reliability Features

1. **DNS & Compute Routing Shield**:
   - Workstations connecting through mobile hotspots (e.g. Windows ICS / `mshome.net`) often contaminate AWS Route 53 CNAME lookups with Nameserver IPs (`205.251.*`), which drop port 5432 connections.
   - The custom `ResilientClient` in `backend/db/index.ts` filters out non-compute IPs and resolves directly to valid AWS compute nodes while preserving SNI TLS routing.
2. **Batched Native Embeddings**:
   - `backend/services/embedding.ts` leverages Gemini's native `batchEmbedContents` in safe batches of up to 30 chunks with exponential backoff.
   - Prevents network socket starvation and eliminates `TypeError: fetch failed` during large document processing.
3. **Dedicated Topic Decks**:
   - Generating flashcards with a custom topic automatically creates an organized deck rather than merging into legacy collections.
   - Every generated card (5, 10, 15, or 20) is fully accessible via both the interactive runner and the deck list view.

---

## 🚢 Deployment

For complete instructions on deploying the frontend to **Vercel** and the backend to **Railway**, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📜 License

This project is licensed under the MIT License.
