# 🚀 JOBFOLIO Africa - How to Use Guide

## ✅ Issues Fixed

### 1. Email OTP Codes Now Visible ✅
- OTP codes are now **logged to backend console**
- Look for: `🔐 OTP CODE FOR [email]: 123456`
- Password reset codes also logged: `🔑 PASSWORD RESET CODE FOR [email]: 123456`

### 2. UI Input Fields Fixed ✅
- Input fields now have proper styling
- Visible in both light and dark modes
- Proper borders and focus states

## 📋 Complete Registration & Login Flow

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
bun run dev
```

### Step 2: Register a New User

1. Open http://localhost:8080 in your browser
2. Click "Sign Up"
3. Choose your role:
   - **Job Seeker** - Looking for jobs
   - **Agent** - Recruiting for clients
   - **Business** - Small business hiring
   - **Company** - Enterprise hiring

4. Fill in the registration form:
   ```
   Full Name: John Doe
   Email: john@example.com
   Phone: +234123456789
   Password: password123
   Confirm Password: password123
   ```

5. For **Business/Company** roles, also fill:
   ```
   Company Name: My Company
   Company Size: 11-50
   Industry: Technology
   ```

6. Click "Continue to Verification"

### Step 3: Get Your OTP Code

**Check Backend Terminal:**

You'll see output like this:
```
🔐 OTP CODE FOR john@example.com: 346781

Resend error: {
  statusCode: 403,
  name: 'validation_error',
  message: 'You can only send testing emails to your own email address...'
}
Verification email sent to john@example.com
```

**Copy the 6-digit code:** `346781`

### Step 4: Verify Your Email

1. You'll be automatically redirected to the verification page
2. Enter the 6-digit OTP code from backend console
3. The code will auto-submit when all 6 digits are entered
4. Or click "Verify & Continue"

### Step 5: Access Dashboard

After successful verification:
- You'll be redirected to the dashboard
- Your email is now verified ✅
- You can start using the platform

## 🔐 Login Flow

### For Existing Users

1. Go to http://localhost:8080/login
2. Enter your credentials:
   ```
   Email or Phone: john@example.com
   Password: password123
   ```
3. Click "Sign In"
4. You'll be redirected to dashboard

## 📧 Why Emails Don't Arrive

**Resend Free Tier Limitation:**
- Only sends to verified email: `jobfolioafrica@gmail.com`
- All other emails will fail (but OTP is logged)

**Solutions:**

### Option A: Use Backend Console (Current)
- ✅ OTP codes logged to console
- ✅ Works for any email address
- ✅ Perfect for development

### Option B: Use Verified Email
Register with `jobfolioafrica@gmail.com` to receive actual emails

### Option C: Verify Domain (Production)
1. Go to resend.com/domains
2. Add your domain (e.g., `jobfolio.africa`)
3. Add DNS records
4. Verify ownership
5. Update sender email in code

## 🎨 UI Features

### Input Fields
- ✅ Visible in light mode (white background, dark text)
- ✅ Visible in dark mode (dark background, light text)
- ✅ Proper borders and focus states
- ✅ Responsive design

### Theme Toggle
- Click the sun/moon icon in header
- Switches between light and dark modes
- Preference saved to localStorage

### OTP Input
- 6 individual input boxes
- Auto-focus next box on input
- Auto-submit when complete
- Backspace moves to previous box

## 🧪 Testing Different User Roles

### Job Seeker
```javascript
Role: seeker
Features:
- Browse jobs
- Apply for positions
- Upload CV
- Create profile
- Connect with others
```

### Agent/Recruiter
```javascript
Role: agent
Features:
- Post jobs for clients
- View applications
- Access talent pool
- Commission tracking
```

### Business/SME
```javascript
Role: business
Required Fields:
- Company Name
- Company Size
- Industry

Features:
- Post job openings
- Review applicants
- Quick hiring
```

### Company
```javascript
Role: company
Required Fields:
- Company Name
- Company Size
- Industry

Features:
- Unlimited job posts
- Applicant tracking
- Company profile
- Premium support
```

## 🔍 Troubleshooting

### Can't See OTP Code?
1. Check backend terminal is running
2. Look for `🔐 OTP CODE FOR` in logs
3. Scroll up if needed
4. Code is valid for 10 minutes

### Input Fields Not Visible?
1. Refresh the page
2. Try toggling dark/light mode
3. Clear browser cache
4. Check browser console for errors

### Backend Not Starting?
```bash
# Kill existing process
taskkill /F /IM node.exe

# Or find and kill specific port
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
cd backend
bun run dev
```

### Frontend Not Starting?
```bash
# Clear and reinstall
rm -rf node_modules
bun install

# Restart
bun run dev
```

## 📱 Mobile Testing

The UI is fully responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

Test on mobile:
1. Get your local IP: `ipconfig`
2. Access from phone: `http://192.168.x.x:8080`
3. Ensure phone is on same network

## 🎯 Quick Test Script

Want to test quickly? Use this:

```bash
# Terminal 1
cd backend && bun run dev

# Terminal 2
bun run dev

# Terminal 3 - Test registration
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+234123456789",
    "password": "password123",
    "role": "seeker"
  }'

# Check Terminal 1 for OTP code
```

## 📊 Current Status

### Backend ✅
- Server running on port 5000
- MongoDB connected
- OTP codes logging to console
- All routes functional

### Frontend ✅
- Development server running
- UI properly styled
- Authentication working
- Protected routes functional

### Integration ✅
- Frontend connects to backend
- Registration works
- OTP verification works
- Login works
- JWT tokens work

## 🎉 You're All Set!

Your JOBFOLIO Africa platform is **fully functional**:

1. ✅ Register users with any email
2. ✅ Get OTP codes from backend console
3. ✅ Verify emails
4. ✅ Login securely
5. ✅ Access protected dashboard

**Start building features and enjoy your platform!** 🚀

## 💡 Pro Tips

1. **Keep backend terminal visible** - You'll need to see OTP codes
2. **Use unique emails** - Each test needs a new email
3. **OTP expires in 10 minutes** - Register and verify quickly
4. **Password reset also logged** - Same process for password reset codes
5. **Check browser console** - For frontend errors and debugging

## 📞 Need Help?

Check these files:
- `EMAIL_OTP_GUIDE.md` - Detailed email setup
- `COMPLETE_INTEGRATION_GUIDE.md` - Full integration guide
- `README_FINAL.md` - Complete documentation
- `AUTH_SYSTEM.md` - Authentication details

Happy coding! 🎊
