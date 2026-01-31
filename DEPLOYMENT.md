# 🚀 StudyBuddy Vercel Deployment Guide

This guide will walk you through deploying StudyBuddy to Vercel with separate backend and frontend deployments.

## 📋 Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your code pushed
- All cloud services already configured (Neon DB, Qdrant, ImageKit, Gemini API)

## 🏗️ Architecture Overview

StudyBuddy requires **TWO separate Vercel deployments**:
1. **Backend** - Elysia API server (runs on port 3001 locally)
2. **Frontend** - Next.js application (runs on port 3000 locally)

---

## 📦 Part 1: Backend Deployment

### Step 1: Update Backend Entry Point

Make sure `backend/index.ts` exports the Elysia app for Vercel (you've already done this! ✅):

```typescript
// At the end of backend/index.ts
export default app;
```

### Step 2: Deploy Backend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Project Name**: `studybuddy-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Select the backend folder!**
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables** (click "Environment Variables"):
   ```
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
   ```

5. **IMPORTANT**: After deployment, note your backend URL (e.g., `https://studybuddy-backend.vercel.app`)

6. **Update Backend Environment Variables**:
   - Go to your backend project settings
   - Add/Update:
     ```
     BETTER_AUTH_URL=https://studybuddy-backend.vercel.app
     NEXT_PUBLIC_API_URL=https://studybuddy-backend.vercel.app
     ```
   - Redeploy the backend

---

## 🎨 Part 2: Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **same** GitHub repository
3. Configure the project:
   - **Project Name**: `studybuddy-frontend` (or just `studybuddy`)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (keep as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://studybuddy-backend.vercel.app
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
   BETTER_AUTH_URL=https://studybuddy-backend.vercel.app
   ```

   **⚠️ CRITICAL**: Replace `https://studybuddy-backend.vercel.app` with your actual backend URL from Part 1!

5. Click **Deploy**

---

## ✅ Part 3: Verification

### Test Your Deployment

1. **Backend Health Check**:
   - Visit: `https://your-backend-url.vercel.app/api/health` (if you have a health endpoint)
   - Or test any API endpoint

2. **Frontend Check**:
   - Visit: `https://your-frontend-url.vercel.app`
   - Try signing up/logging in
   - Create a StudyBuddy
   - Upload a document
   - Test chat functionality

### Common Issues & Solutions

#### Issue: CORS Errors
**Solution**: Make sure your backend CORS configuration allows your frontend domain:
```typescript
// In backend/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}))
```

#### Issue: Authentication Not Working
**Solution**: 
- Verify `BETTER_AUTH_URL` points to your backend URL
- Check that `BETTER_AUTH_SECRET` is the same in both deployments

#### Issue: Database Connection Fails
**Solution**: 
- Ensure Neon database allows connections from Vercel IPs
- Verify `DATABASE_URL` is correct in environment variables

#### Issue: File Uploads Fail
**Solution**: 
- Verify ImageKit credentials are correct
- Check that ImageKit allows requests from your Vercel domains

---

## 🔄 Continuous Deployment

Both deployments will automatically redeploy when you push to your GitHub repository's main branch.

To deploy manually:
1. Go to your Vercel dashboard
2. Select the project
3. Click "Deployments" → "Redeploy"

---

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments, logs, and analytics
- **Backend Logs**: Check function logs in Vercel for API errors
- **Frontend Logs**: Check browser console and Vercel function logs

---

## 🎯 Quick Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL noted
- [ ] Backend environment variables configured
- [ ] `BETTER_AUTH_URL` updated in backend
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured with correct backend URL
- [ ] CORS configured for frontend domain
- [ ] Sign up/login tested
- [ ] Document upload tested
- [ ] Chat functionality tested
- [ ] Learning modes tested

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set correctly
3. Test API endpoints directly using Postman or curl
4. Check browser console for frontend errors

**Your deployment URLs**:
- Backend: `https://studybuddy-backend.vercel.app` (replace with actual)
- Frontend: `https://studybuddy.vercel.app` (replace with actual)
