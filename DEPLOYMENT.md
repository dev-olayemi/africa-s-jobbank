# 🚀 Deployment Guide - JOBFOLIO Africa

This guide will help you deploy your full-stack application to production.

## 📋 Prerequisites

- GitHub account
- Render account (for backend) - [render.com](https://render.com)
- Vercel account (for frontend) - [vercel.com](https://vercel.com)
- MongoDB Atlas account (already set up)
- Cloudinary account (already set up)

---

## 🎯 Deployment Strategy

**Frontend (React/Vite)** → Vercel  
**Backend (Node.js/Express)** → Render

---

## 📦 Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Create Environment Files

Copy the example files and fill in your actual values:

```bash
# Frontend
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create New Web Service

1. Go to [render.com](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repo: `africa-s-jobbank`

### 2.2 Configure Service

Fill in these settings:

- **Name**: `jobfolio-api` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Instance Type**: `Free` (or paid for better performance)

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/jobfolioDB
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
CLOUDINARY_CLOUD_NAME=davgcuawd
CLOUDINARY_API_KEY=474875112468516
CLOUDINARY_API_SECRET=your-cloudinary-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=production
PORT=5000
```

**Important**: For `FRONTEND_URL`, you'll add this AFTER deploying frontend (Step 3)

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://jobfolio-api.onrender.com`)

### 2.5 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see: `{"status":"ok","message":"API is running"}`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select `africa-s-jobbank`

### 3.2 Configure Project

Vercel will auto-detect Vite. Verify these settings:

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variable

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render URL from Step 2.4

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your frontend URL (e.g., `https://jobfolio-africa.vercel.app`)

---

## 🔗 Step 4: Connect Frontend & Backend

### 4.1 Update Backend CORS

1. Go back to Render dashboard
2. Open your `jobfolio-api` service
3. Go to **"Environment"**
4. Add/Update this variable:

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Replace with your actual Vercel URL from Step 3.4

5. Click **"Save Changes"**
6. Service will automatically redeploy

### 4.2 Update MongoDB IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

⚠️ **Security Note**: For production, you should whitelist only Render's IP ranges instead of allowing all IPs.

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Frontend

Visit your Vercel URL: `https://your-app.vercel.app`

### 5.2 Test Full Flow

1. **Sign Up** - Create a new account
2. **Verify Email** - Check your email for verification code
3. **Login** - Sign in with your credentials
4. **Create Job** - Post a test job
5. **Browse Jobs** - View job listings
6. **Apply** - Test job application

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set
- Check MongoDB connection string

**Problem**: CORS errors
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- No trailing slash in URLs

### Frontend Issues

**Problem**: API calls failing
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Test backend health endpoint directly

**Problem**: Build failing
- Check Vercel build logs
- Run `npm run build` locally to test
- Verify all dependencies are in `package.json`

### Database Issues

**Problem**: MongoDB connection timeout
- Check IP whitelist in MongoDB Atlas
- Verify connection string is correct
- Check MongoDB Atlas cluster is running

---

## 🔄 Updating Your App

### Update Frontend

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will automatically redeploy.

### Update Backend

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will automatically redeploy.

---

## 💰 Cost Breakdown

### Free Tier (Good for testing)

- **Vercel**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month, sleeps after 15min inactivity)
- **MongoDB Atlas**: Free (512MB storage)
- **Cloudinary**: Free (25GB storage, 25GB bandwidth)

**Total**: $0/month

### Paid Tier (Recommended for production)

- **Vercel Pro**: $20/month (better performance, analytics)
- **Render Starter**: $7/month (always on, no sleep)
- **MongoDB Atlas M10**: $57/month (dedicated cluster)
- **Cloudinary Plus**: $89/month (more storage)

**Total**: ~$173/month

---

## 📝 Environment Variables Checklist

### Backend (.env)
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL
- [ ] PORT=5000

### Frontend (.env)
- [ ] VITE_API_URL

---

## 🎉 Success!

Your app is now live! Share your URLs:

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the logs (Render/Vercel dashboards)
2. Verify all environment variables
3. Test each service independently
4. Check this guide's troubleshooting section

Good luck with your deployment! 🚀
