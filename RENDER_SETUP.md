# 🔧 Render Backend Setup

## Your Backend URL: https://jobfolio-api.onrender.com

---

## Environment Variables to Add in Render

Go to your Render dashboard → **jobfolio-api** → **Environment** tab

Add these variables:

### Required Variables:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://jobfolioafrica_db_user:dyJg2TdJbDXrIcf8@jobfolioafrica.xgpze6g.mongodb.net/jobfolioDB?retryWrites=true&w=majority&appName=JobFolioAfrica

# JWT
JWT_SECRET=40fcded1d6369e7e6a42322450df6ad1090b8983ad96158dac9b4e57b872f32f2bd3101726e6802accee2482f99df595ab55d992e693eca90182758b40a14e3a

# Cloudinary
CLOUDINARY_CLOUD_NAME=davgcuawd
CLOUDINARY_API_KEY=474875112468516
CLOUDINARY_API_SECRET=-POfHOLVsaPpg9kZKpn2MgCvYXk

# Email (if using Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server Config
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://jobfolio-africa.vercel.app

# Resend API (if using)
RESEND_API_KEY=re_jBVwdvfB_99DmG1fSzb2RKZ61ZnfmQqkA
```

---

## Important Notes:

1. **FRONTEND_URL**: Must match your Vercel URL exactly (no trailing slash)
2. **NODE_ENV**: Must be `production` for production environment
3. **EMAIL_USER/PASS**: Update with your actual email credentials
4. **MONGODB_URI**: Already correct from your .env file

---

## After Adding Variables:

1. Click **Save Changes**
2. Service will automatically redeploy (takes ~5 minutes)
3. Check logs to verify successful deployment
4. Test health endpoint: https://jobfolio-api.onrender.com/api/health

---

## MongoDB Atlas IP Whitelist:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster: **JobFolioAfrica**
3. Click **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Click **Allow Access from Anywhere** (0.0.0.0/0)
6. Click **Confirm**

⚠️ **Note**: For better security, you should whitelist only Render's IP ranges instead of allowing all IPs.

---

## Test Your Backend:

```bash
# Health check
curl https://jobfolio-api.onrender.com/api/health

# Should return:
# {"status":"ok","message":"API is running"}
```

---

## Render Free Tier Notes:

- ⏰ **Spins down after 15 minutes of inactivity**
- 🐌 **First request after sleep takes ~30 seconds**
- 💰 **Upgrade to $7/month for always-on service**

To keep it awake, you can:
1. Use a service like [UptimeRobot](https://uptimerobot.com) to ping it every 5 minutes
2. Upgrade to paid tier ($7/month)

---

**Your backend is now configured for production! 🚀**
