# Deployment Guide - Kata

## Overview
- **Frontend**: Netlify (free)
- **Backend**: Render (free)
- **Database**: MongoDB Atlas (free)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (choose FREE tier - M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sweetshop?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials

---

## Step 2: Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `sweet-shop-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = (paste your MongoDB Atlas connection string)
   - `JWT_SECRET` = (generate a random string - e.g., use `openssl rand -hex 32`)
   - `FRONTEND_URL` = (add after deploying frontend, e.g., `https://your-app.netlify.app`)
7. Click "Create Web Service"
8. Wait for deployment (takes 2-5 minutes)
9. Copy your backend URL (e.g., `https://sweet-shop-api.onrender.com`)

---

## Step 3: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://sweet-shop-api.onrender.com` (your Render URL)
6. Click "Deploy site"
7. Wait for deployment

---

## Step 4: Update Backend CORS (Optional)

After getting your Netlify URL, update the `FRONTEND_URL` environment variable in Render:

1. Go to Render Dashboard → Your service → Environment
2. Add/Update: `FRONTEND_URL` = `https://your-app.netlify.app`
3. Redeploy

---

## Step 5: Update netlify.toml

Update the backend URL in `frontend/netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR-BACKEND-URL.onrender.com/api/:splat"
  status = 200
  force = true
```

Replace `YOUR-BACKEND-URL` with your actual Render URL.

---

## Troubleshooting

### Backend not starting?
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### CORS errors?
- Add your Netlify URL to `FRONTEND_URL` in Render
- Redeploy backend

### API calls failing?
- Verify `VITE_API_URL` is set correctly in Netlify
- Check browser console for errors
- Test backend directly: `https://your-backend.onrender.com/api/health`

### Cold starts (slow first request)?
- Render free tier spins down after 15 min of inactivity
- First request after sleep takes ~30 seconds
- This is normal for free tier

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.netlify.app` |
| Backend | `https://sweet-shop-api.onrender.com` |
| Database | MongoDB Atlas (internal) |

---

## Quick Commands

### Test Backend Locally
```bash
cd backend
npm install
npm run dev
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```
