# 🎨 Vercel Production Setup

## Your URLs:
- **Frontend**: https://jobfolio-africa.vercel.app
- **Backend**: https://jobfolio-api.onrender.com

---

## Step 1: Add Environment Variable to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **jobfolio-africa**
3. Go to **Settings** → **Environment Variables**
4. Add this variable:

```
Name: VITE_API_URL
Value: https://jobfolio-api.onrender.com/api
Environment: Production, Preview, Development
```

5. Click **Save**

---

## Step 2: Redeploy Your Frontend

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

OR just push a new commit:
```bash
git add .
git commit -m "Configure production API URL"
git push origin main
```

---

## Step 3: Update Render Backend CORS

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service: **jobfolio-api**
3. Go to **Environment** tab
4. Add/Update this variable:

```
Name: FRONTEND_URL
Value: https://jobfolio-africa.vercel.app
```

5. Click **Save Changes** (service will auto-redeploy)

---

## Step 4: Test Your Production App

1. Visit: https://jobfolio-africa.vercel.app
2. Open browser console (F12)
3. Check the API URL being used:
   - Should see: `API Base URL: https://jobfolio-api.onrender.com/api`
4. Try signing up/logging in
5. Test creating a job

---

## Troubleshooting

### Issue: API calls failing with CORS error

**Solution**: Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly:
- ✅ Correct: `https://jobfolio-africa.vercel.app`
- ❌ Wrong: `https://jobfolio-africa.vercel.app/`
- ❌ Wrong: `http://jobfolio-africa.vercel.app`

### Issue: Still using localhost API

**Solution**: 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check Vercel environment variables are set
4. Redeploy from Vercel

### Issue: Backend not responding

**Solution**:
1. Check Render logs for errors
2. Verify MongoDB IP whitelist includes `0.0.0.0/0`
3. Test backend directly: `https://jobfolio-api.onrender.com/api/health`

---

## How It Works

### Development (Local)
```
Frontend (.env) → VITE_API_URL=http://localhost:5000/api
Backend running locally on port 5000
```

### Production (Deployed)
```
Frontend (Vercel env) → VITE_API_URL=https://jobfolio-api.onrender.com/api
Backend running on Render
```

The code automatically uses the right URL based on the environment!

---

## ✅ Verification Checklist

- [ ] Vercel environment variable `VITE_API_URL` is set
- [ ] Render environment variable `FRONTEND_URL` is set
- [ ] Both services redeployed after adding variables
- [ ] MongoDB IP whitelist allows Render's IPs
- [ ] Backend health check works: https://jobfolio-api.onrender.com/api/health
- [ ] Frontend loads: https://jobfolio-africa.vercel.app
- [ ] Can sign up/login on production
- [ ] No CORS errors in browser console

---

**Once all checkboxes are complete, your app is fully deployed! 🎉**
