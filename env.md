# 🔐 StudyBuddy — Environment Variables Reference (`env.md`)

This guide specifies every environment variable required to run **StudyBuddy** across both the **Frontend** (Next.js) and **Backend** (Elysia.js) environments, in both local development and production.

---

## 1. Quick Summary Table

| Scope | Variable Name | Required? | Purpose | Example (Local Dev) |
|---|---|:---:|---|---|
| **Frontend** | `NEXT_PUBLIC_API_URL` | **Yes** | Base URL pointing to the backend API | `http://localhost:3001` |
| **Frontend** | `NEXT_PUBLIC_APP_URL` | Optional | Base URL of the client app | `http://localhost:3000` |
| **Backend** | `PORT` | Optional | Local port for Elysia server (default: 3001) | `3001` |
| **Backend** | `NODE_ENV` | **Yes** | App environment (`development` / `production`) | `development` |
| **Backend** | `FRONTEND_URL` | **Yes** | Client URL for CORS whitelist | `http://localhost:3000` |
| **Backend** | `DATABASE_URL` | **Yes** | Neon Postgres pooled connection string | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| **Backend** | `BETTER_AUTH_SECRET` | **Yes** | 32+ char secret for JWT/session encryption | `generated-32-byte-hex-string` |
| **Backend** | `BETTER_AUTH_URL` | **Yes** | Base URL of the backend auth endpoints | `http://localhost:3001` |
| **Backend** | `GEMINI_API_KEY` | **Yes** | Google AI Studio API key | `AIzaSy...` |
| **Backend** | `GEMINI_MODEL` | Optional | Gemini model name (default: `gemini-2.5-flash`) | `gemini-2.5-flash` |
| **Backend** | `QDRANT_URL` | **Yes** | Qdrant Cloud cluster endpoint | `https://xyz-example.eu-central.aws.cloud.qdrant.io:6333` |
| **Backend** | `QDRANT_API_KEY` | **Yes** | Qdrant Cloud cluster API key | `thISiSA-qdrant-api-key...` |
| **Backend** | `IMAGEKIT_PUBLIC_KEY` | **Yes** | ImageKit public key | `public_...` |
| **Backend** | `IMAGEKIT_PRIVATE_KEY`| **Yes** | ImageKit private key for server uploads | `private_...` |
| **Backend** | `IMAGEKIT_URL_ENDPOINT`| **Yes** | ImageKit media CDN endpoint | `https://ik.imagekit.io/your_id` |

---

## 2. Frontend Configuration (`frontend/.env.local`)

File location: `frontend/.env.local`

```bash
# ==============================================================================
# STUDYBUDDY FRONTEND ENVIRONMENT VARIABLES
# ==============================================================================

# 1. Backend API Endpoint
# In local development: http://localhost:3001
# In production (Railway): https://studybuddy-production-4127.up.railway.app
NEXT_PUBLIC_API_URL=http://localhost:3001

# 2. Frontend Application URL
# In local development: http://localhost:3000
# In production (Vercel): https://study-buddy-self-ten.vercel.app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Explanation of Frontend Variables
- **`NEXT_PUBLIC_API_URL`**:
  - Consumed by `frontend/lib/api/client.ts` to make REST requests (`/api/studybuddy`, `/api/documents`, `/api/learning`).
  - Consumed by `frontend/lib/auth-client.ts` (`createAuthClient({ baseURL: ... })`) to authenticate via Better-Auth.
  - Consumed by `frontend/components/dashboard/chat-interface.tsx` to open the SSE chat stream.
- **`NEXT_PUBLIC_APP_URL`**:
  - Used for canonical URLs, social metadata, and redirect callbacks.

---

## 3. Backend Configuration (`backend/.env`)

File location: `backend/.env`

```bash
# ==============================================================================
# STUDYBUDDY BACKEND ENVIRONMENT VARIABLES
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Server & Networking
# ------------------------------------------------------------------------------
PORT=3001
NODE_ENV=development

# URL of your frontend application (Used by Elysia CORS plugin & Better-Auth trusted origins)
# For local dev: http://localhost:3000
# For production: https://study-buddy-self-ten.vercel.app
FRONTEND_URL=http://localhost:3000

# ------------------------------------------------------------------------------
# 2. Primary Database (Neon Serverless PostgreSQL)
# ------------------------------------------------------------------------------
# Get from Neon Console -> Project Dashboard -> Connection Details (Pooled connection recommended)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-solitary-voice-a5xyz.us-east-2.aws.neon.tech/neondb?sslmode=require

# ------------------------------------------------------------------------------
# 3. Authentication (Better-Auth)
# ------------------------------------------------------------------------------
# Generate with: openssl rand -hex 32
BETTER_AUTH_SECRET=9f83a48e7b1c3d5f2a4e6b8c0d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e

# Backend URL where Better-Auth is hosted
# For local dev: http://localhost:3001
# For production: https://studybuddy-production-4127.up.railway.app
BETTER_AUTH_URL=http://localhost:3001

# ------------------------------------------------------------------------------
# 4. Google Gemini AI (LLM & Embeddings)
# ------------------------------------------------------------------------------
# Obtain from Google AI Studio: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyD_EXAMPLE_KEY_HERE_1234567890

# Optional model override (defaults to gemini-2.5-flash)
GEMINI_MODEL=gemini-2.5-flash

# ------------------------------------------------------------------------------
# 5. Vector Database (Qdrant Cloud)
# ------------------------------------------------------------------------------
# Create cluster at: https://cloud.qdrant.io/
QDRANT_URL=https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.eu-central.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=your_qdrant_api_key_here

# ------------------------------------------------------------------------------
# 6. File Storage (ImageKit)
# ------------------------------------------------------------------------------
# Obtain from ImageKit Dashboard: https://imagekit.io/dashboard/developer/api-keys
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

---

## 4. How to Generate Required Secrets & Obtain Credentials

### 1. `BETTER_AUTH_SECRET`
Generate a cryptographically secure 256-bit secret using PowerShell or Bash:
```bash
# Linux/macOS or Git Bash
openssl rand -hex 32

# Or in Node.js REPL:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. `DATABASE_URL` (Neon PostgreSQL)
1. Log into [Neon Console](https://console.neon.tech).
2. Select your project -> **Dashboard**.
3. Under **Connection Details**, ensure **Pooled connection** is selected.
4. Copy the connection string containing `?sslmode=require`.

### 3. `GEMINI_API_KEY` (Google AI Studio)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Enable Gemini 2.5 Flash and text-embedding models on your Google Cloud project.

### 4. `QDRANT_URL` and `QDRANT_API_KEY` (Qdrant Cloud)
1. Go to [Qdrant Cloud Console](https://cloud.qdrant.io).
2. Open your Cluster -> **Overview**.
3. Copy the Cluster URL (format: `https://[cluster-id].[region].qdrant.io:6333`).
4. Generate an API Key under **Data Access Control** / **API Keys**.

### 5. ImageKit Credentials
1. Log in to [ImageKit](https://imagekit.io/dashboard).
2. Go to **Developer options** -> **API keys**.
3. Copy **Public Key**, **Private Key**, and **URL-endpoint**.

---

## 5. Production Environment Mapping (Vercel & Railway)

### Vercel Deployment Settings (Frontend)
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` = `https://your-backend.up.railway.app`
  - `NEXT_PUBLIC_APP_URL` = `https://your-frontend.vercel.app`

### Railway Deployment Settings (Backend)
- **Root Directory**: `backend`
- **Build Command**: (Nixpacks default or `npm run build`)
- **Start Command**: `npm run start`
- **Environment Variables**: Add all variables listed in Section 3, ensuring:
  - `FRONTEND_URL` = `https://your-frontend.vercel.app`
  - `BETTER_AUTH_URL` = `https://your-backend.up.railway.app`
  - `NODE_ENV` = `production`
