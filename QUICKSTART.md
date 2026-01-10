# 🚀 Quick Start Guide

## For Local Development

### 1. Start Both Servers (Easy Way - Windows)

Double-click `start-dev.bat` or run:
```bash
start-dev.bat
```

This will open two terminal windows:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:8080

### 2. Start Manually (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## For Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

**Summary:**
1. Deploy backend to Render.com (free)
2. Deploy frontend to Vercel.com (free)
3. Connect them with environment variables

**Total time:** ~15 minutes  
**Cost:** $0 (free tier)

---

## Need Help?

- **Deployment issues?** → Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Local dev issues?** → Make sure both servers are running
- **Database issues?** → Check MongoDB Atlas IP whitelist

---

**That's it! You're ready to go! 🎉**
