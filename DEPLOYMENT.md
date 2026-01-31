# 🚀 StudyBuddy Deployment Guide
## Railway (Backend) + Vercel (Frontend)

This guide walks you through deploying StudyBuddy using the optimal setup: Railway for your Elysia backend and Vercel for your Next.js frontend.

---

## 📋 Prerequisites

- ✅ Railway account ([railway.app](https://railway.app))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ GitHub repository with your code pushed
- ✅ All cloud services configured (Neon DB, Qdrant, ImageKit, Gemini API)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│  Vercel         │         │  Railway         │
│  (Frontend)     │────────▶│  (Backend)       │
│  Next.js App    │  API    │  Elysia Server   │
└─────────────────┘         └──────────────────┘
        │                           │
        │                           │
        ▼                           ▼
   [Users Access]           [Database, AI APIs]
```

---

# 🚂 Part 1: Deploy Backend to Railway

## Step 1: Prepare Backend for Railway

### 1.1 Create Railway Configuration

Create `railway.json` in your **backend** folder:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node --loader tsx backend/index.ts",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.2 Verify Backend Entry Point

Your `backend/index.ts` should already have this at the end:

```typescript
export default app;
```

✅ You already have this!

### 1.3 Add Start Script to package.json

Add this to your root `package.json` scripts:

```json
{
  "scripts": {
    "start:backend": "tsx backend/index.ts"
  }
}
```

## Step 2: Deploy to Railway

### 2.1 Create New Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub repo"**
3. Select your `studybuddy` repository
4. Click **"Deploy Now"**

### 2.2 Configure Service

1. Railway will create a service automatically
2. Click on the service card
3. Go to **Settings** tab

### 2.3 Set Build & Deploy Settings

In Settings:
- **Root Directory**: `./` (or `backend`)
- **Build Command**: `echo skipping` ⚠️ **This skips the frontend build causing the error!**
- **Start Command**: `npm run start:backend`

### 2.4 Add Environment Variables

Click **Variables** tab and add:

```env
DATABASE_URL=postgresql://neondb_owner:npg_YhfP0UHb2ulB@ep-muddy-boat-ag4s2hoa-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

GEMINI_API_KEY=AIzaSyB-t4xfO0c8Ro3vDUQkXf_Tt4Oxex2d14w
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

QDRANT_URL=https://95aa686a-bcfd-4958-a44d-e41950ff96e8.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.90sE1KxUXB5FzsVYU3b7m3_i-mfr0BhPPw3zSAbtr4w

IMAGEKIT_PRIVATE_KEY=private_L7RQ6Nec/RNP2Fj6DUO6WOf/95w=
IMAGEKIT_PUBLIC_KEY=public_cQhJjyY8tnCkoCWOBbnQA4qYRpE=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/emavm8hbl/

BETTER_AUTH_SECRET=8c895590f0547d4e1b103fa448997cc020162ce3fa9347826407b0601b9be130f3f8f4010c877c731582d7d4864f9d4c5f350cef8c0b180baae01b99bc150234

PORT=3001
```

### 2.5 Generate Public Domain

1. Go to **Settings** tab
2. Scroll to **Networking** section
3. Click **Generate Domain**
4. **📝 IMPORTANT**: Copy your Railway URL (e.g., `https://studybuddy-backend-production.up.railway.app`)

### 2.6 Update Backend Environment Variables

Add these to your Railway environment variables:

```env
BETTER_AUTH_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

Replace `your-railway-url.up.railway.app` with your actual Railway domain!

### 2.7 Deploy

Click **Deploy** or push to GitHub (Railway auto-deploys on push)

---

# ☁️ Part 2: Deploy Frontend to Vercel

## Step 1: Deploy to Vercel

### 1.1 Create New Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `studybuddy` (or `studybuddy-frontend`)
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./` (keep as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 1.2 Add Environment Variables

Click **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_APP_NAME=StudyBuddy

DATABASE_URL=postgresql://neondb_owner:npg_YhfP0UHb2ulB@ep-muddy-boat-ag4s2hoa-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

GEMINI_API_KEY=AIzaSyB-t4xfO0c8Ro3vDUQkXf_Tt4Oxex2d14w
GEMINI_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

QDRANT_URL=https://95aa686a-bcfd-4958-a44d-e41950ff96e8.europe-west3-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.90sE1KxUXB5FzsVYU3b7m3_i-mfr0BhPPw3zSAbtr4w

IMAGEKIT_PRIVATE_KEY=private_L7RQ6Nec/RNP2Fj6DUO6WOf/95w=
IMAGEKIT_PUBLIC_KEY=public_cQhJjyY8tnCkoCWOBbnQA4qYRpE=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/emavm8hbl/

BETTER_AUTH_SECRET=8c895590f0547d4e1b103fa448997cc020162ce3fa9347826407b0601b9be130f3f8f4010c877c731582d7d4864f9d4c5f350cef8c0b180baae01b99bc150234
BETTER_AUTH_URL=https://your-railway-url.up.railway.app
```

**⚠️ CRITICAL**: Replace `https://your-railway-url.up.railway.app` with your actual Railway backend URL!

### 1.3 Deploy

Click **Deploy** and wait for the build to complete.

---

# 🔧 Part 3: Configure CORS

After both deployments are live, you need to update your backend CORS settings.

## Update backend/index.ts

Find the CORS configuration and add your Vercel domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'  // Add your Vercel URL here
  ],
  credentials: true
}));
```

Push this change to GitHub - Railway will auto-deploy!

---

# ✅ Part 4: Verification

## 4.1 Test Backend

Visit your Railway URL:
```
https://your-railway-url.up.railway.app/api/studybuddy
```

You should see a response (might be "Unauthorized" - that's OK, it means the server is running!)

## 4.2 Test Frontend

1. Visit your Vercel URL
2. Try to sign up / log in
3. Create a StudyBuddy
4. Upload a document
5. Test chat functionality
6. Try learning modes

---

# 🐛 Troubleshooting

## Issue: Backend Not Starting on Railway

**Check Railway Logs**:
1. Go to Railway dashboard
2. Click your service
3. Click **Deployments** → **View Logs**

**Common fixes**:
- Verify `PORT` environment variable is set to `3001`
- Check that `start:backend` script exists in package.json
- Ensure all dependencies are in `package.json`

## Issue: CORS Errors

**Solution**: 
1. Add your Vercel domain to CORS origins in `backend/index.ts`
2. Make sure `credentials: true` is set
3. Redeploy backend

## Issue: Authentication Not Working

**Check**:
- `BETTER_AUTH_URL` points to Railway backend URL (not localhost!)
- `BETTER_AUTH_SECRET` is identical in both Railway and Vercel
- Both deployments have the same secret

## Issue: Database Connection Fails

**Solution**:
- Verify `DATABASE_URL` is correct in Railway variables
- Check Neon dashboard - ensure database is active
- Test connection from Railway logs

## Issue: File Uploads Fail

**Check**:
- ImageKit credentials are correct in Railway
- ImageKit allows requests from Railway domain
- Check Railway logs for specific errors

---

# 📊 Monitoring & Logs

## Railway Logs
- Dashboard → Service → Deployments → View Logs
- Real-time server logs
- Error tracking

## Vercel Logs
- Dashboard → Project → Deployments → Function Logs
- Build logs
- Runtime logs

---

# 🔄 Continuous Deployment

Both platforms auto-deploy when you push to GitHub:

- **Railway**: Watches `main` branch → Redeploys backend
- **Vercel**: Watches `main` branch → Redeploys frontend

To disable auto-deploy:
- **Railway**: Settings → Disable "Auto Deploy"
- **Vercel**: Settings → Git → Disable "Production Branch"

---

# 💰 Pricing (Free Tiers)

## Railway Free Tier
- ✅ $5 free credit per month
- ✅ Enough for small-medium apps
- ✅ 512MB RAM, 1GB storage
- ⚠️ Sleeps after 30 min inactivity (Hobby plan)

## Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

---

# 🎯 Deployment Checklist

- [ ] Railway backend deployed
- [ ] Railway domain generated and noted
- [ ] Railway environment variables configured
- [ ] `BETTER_AUTH_URL` set to Railway URL
- [ ] Vercel frontend deployed
- [ ] Vercel environment variables configured with Railway URL
- [ ] CORS updated with Vercel domain
- [ ] Backend API tested (Railway URL)
- [ ] Frontend tested (Vercel URL)
- [ ] Sign up/login works
- [ ] Document upload works
- [ ] Chat functionality works
- [ ] Learning modes work

---

# 🆘 Need Help?

**Railway Support**:
- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

**Vercel Support**:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)

---

# 📝 Your Deployment URLs

After deployment, update these:

- **Backend (Railway)**: `https://_____.up.railway.app`
- **Frontend (Vercel)**: `https://_____.vercel.app`

**Congratulations! Your app is now live! 🎉**
