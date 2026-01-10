# ✅ Production Deployment Checklist

## Your URLs:
- 🎨 **Frontend**: https://jobfolio-africa.vercel.app
- 🔧 **Backend**: https://jobfolio-api.onrender.com

---

## 📋 Complete These Steps:

### 1. Render Backend Configuration

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Select **jobfolio-api** service
- [ ] Go to **Environment** tab
- [ ] Add all variables from `RENDER_SETUP.md`
- [ ] **Most Important**: Set `FRONTEND_URL=https://jobfolio-africa.vercel.app`
- [ ] Click **Save Changes**
- [ ] Wait for redeploy (~5 minutes)
- [ ] Test: https://jobfolio-api.onrender.com/api/health

### 2. Vercel Frontend Configuration

- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Select **jobfolio-africa** project
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add: `VITE_API_URL=https://jobfolio-api.onrender.com/api`
- [ ] Select: Production, Preview, Development
- [ ] Click **Save**
- [ ] Go to **Deployments** tab
- [ ] Redeploy latest deployment

### 3. MongoDB Atlas

- [ ] Go to [MongoDB Atlas](https://cloud.mongodb.com)
- [ ] Select **JobFolioAfrica** cluster
- [ ] Click **Network Access**
- [ ] Add IP: `0.0.0.0/0` (Allow from anywhere)
- [ ] Click **Confirm**

### 4. Test Production App

- [ ] Visit: https://jobfolio-africa.vercel.app
- [ ] Open browser console (F12)
- [ ] Check API URL: Should show `https://jobfolio-api.onrender.com/api`
- [ ] Test Sign Up
- [ ] Test Login
- [ ] Test Create Job
- [ ] Test Browse Jobs
- [ ] Test Apply to Job
- [ ] No CORS errors in console

---

## 🎯 Quick Test Commands:

```bash
# Test backend health
curl https://jobfolio-api.onrender.com/api/health

# Should return:
# {"status":"ok","message":"API is running"}
```

---

## 🐛 Common Issues:

### Issue: CORS Error
**Fix**: Make sure `FRONTEND_URL` in Render = `https://jobfolio-africa.vercel.app` (no trailing slash)

### Issue: API calls to localhost
**Fix**: 
1. Check Vercel environment variable is set
2. Redeploy from Vercel
3. Clear browser cache (Ctrl+Shift+R)

### Issue: Backend not responding
**Fix**:
1. Check Render logs for errors
2. Verify MongoDB IP whitelist
3. Wait 30 seconds (free tier spins down)

---

## 📊 Current Status:

### Development (Local):
```
✅ Frontend: http://localhost:8080
✅ Backend: http://localhost:5000
✅ Uses .env file
```

### Production (Deployed):
```
✅ Frontend: https://jobfolio-africa.vercel.app
✅ Backend: https://jobfolio-api.onrender.com
✅ Uses Vercel/Render environment variables
```

---

## 🎉 Once All Checkboxes Are Complete:

Your app is **LIVE** and ready for users!

Share your link: **https://jobfolio-africa.vercel.app**

---

## 📝 Next Steps:

1. **Custom Domain** (Optional):
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel: Settings → Domains
   - Example: `www.jobfolio.africa`

2. **Monitoring** (Recommended):
   - Set up [UptimeRobot](https://uptimerobot.com) to keep backend awake
   - Monitor uptime and get alerts

3. **Analytics** (Optional):
   - Add Google Analytics
   - Add Vercel Analytics

4. **Upgrade** (When ready):
   - Render: $7/month for always-on
   - Vercel Pro: $20/month for better performance

---

**Good luck with your launch! 🚀**
