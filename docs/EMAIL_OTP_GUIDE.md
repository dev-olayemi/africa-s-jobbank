# 📧 Email & OTP Verification Guide

## Why You're Not Receiving Emails

Resend's **free tier** only allows sending emails to your **verified email address**: `jobfolioafrica@gmail.com`

This means:
- ✅ Emails TO `jobfolioafrica@gmail.com` will be delivered
- ❌ Emails TO any other address (like `test@example.com`) will fail

## Solution: Check Backend Console for OTP Codes

During development, OTP codes are **logged to the backend console**. Here's how to find them:

### Method 1: Check Running Backend Terminal

1. Look at the terminal where you ran `bun run dev` in the `backend` folder
2. After registering a user, you'll see output like:
   ```
   Verification email sent to test1767800214694@example.com
   ```
3. The OTP code is generated but not shown in logs (for security)

### Method 2: Temporarily Log OTP Codes

Let me update the backend to log OTP codes during development:

**File: `backend/models/User.js`**

Find the `generateEmailVerificationCode` method and add console.log:

```javascript
userSchema.methods.generateEmailVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationCode = code;
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  // LOG OTP FOR DEVELOPMENT
  console.log(`🔐 OTP Code for ${this.email}: ${code}`);
  
  return code;
};
```

### Method 3: Use Test Email Address

Register with `jobfolioafrica@gmail.com` to receive actual emails:

```javascript
// When signing up, use:
Email: jobfolioafrica@gmail.com
Phone: +234123456789
Password: password123
```

## Quick Fix: Update Backend to Log OTP

I'll update the User model to log OTP codes in development mode.

## Production Solution

For production, you need to:

1. **Verify a Domain** at resend.com/domains
   - Add your domain (e.g., `jobfolio.africa`)
   - Add DNS records
   - Verify ownership

2. **Update Email Sender**
   ```javascript
   from: 'JOBFOLIO Africa <noreply@jobfolio.africa>'
   ```

3. **Send to Any Email**
   - Once domain is verified, you can send to any email address
   - No restrictions on recipients

## Current Workaround

For now, use one of these methods:

### Option A: Check Backend Logs
```bash
cd backend
bun run dev
# Watch for OTP codes in console
```

### Option B: Use Verified Email
- Register with: `jobfolioafrica@gmail.com`
- Check that inbox for OTP

### Option C: Use Test Dashboard
- Open `auth-test-dashboard.html`
- Register a user
- Check backend console for OTP
- Enter OTP in dashboard

## Testing the Complete Flow

1. **Start Backend**
   ```bash
   cd backend
   bun run dev
   ```

2. **Start Frontend**
   ```bash
   bun run dev
   ```

3. **Register a User**
   - Go to http://localhost:8080/signup
   - Fill in the form
   - Click "Continue to Verification"

4. **Get OTP Code**
   - Check backend terminal
   - Look for: `🔐 OTP Code for [email]: 123456`

5. **Enter OTP**
   - Go to verification page
   - Enter the 6-digit code
   - Click "Verify & Continue"

6. **Success!**
   - You'll be redirected to dashboard
   - Email is verified ✅

## UI Fix Applied

The input fields are now visible with proper styling:
- ✅ White background with dark text in light mode
- ✅ Dark background with light text in dark mode
- ✅ Proper border colors
- ✅ Focus states working

## Next Steps

1. I'll update the User model to log OTP codes
2. You can then see OTP codes in backend console
3. For production, verify a domain with Resend
