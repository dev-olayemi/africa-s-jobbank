# JOBFOLIO Africa Authentication System

## Overview
Complete authentication system with OTP verification, session management, and role-based access control.

## Features Implemented

### 1. User Registration
- **Endpoint**: `POST /api/auth/signup`
- **Roles**: `seeker`, `agent`, `business`, `company`
- **Features**:
  - Email and phone validation
  - Password hashing with bcrypt
  - Automatic OTP generation and email sending
  - JWT token generation
  - Role-specific field validation

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+234123456789",
  "password": "securepass123",
  "role": "seeker"
}
```

**For Business/Company roles, also include**:
```json
{
  "companyName": "My Company",
  "companySize": "11-50",
  "industry": "Technology"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "verification": {
        "email": false,
        "phone": false
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "verificationRequired": true
  }
}
```

### 2. Email Verification
- **Endpoint**: `POST /api/auth/verify-email`
- **Authentication**: Required (Bearer token)
- **Features**:
  - 6-digit OTP code
  - 10-minute expiration
  - Welcome email sent after verification

**Request Body**:
```json
{
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "verification": {
      "email": true,
      "phone": false
    }
  }
}
```

### 3. Resend Verification Code
- **Endpoint**: `POST /api/auth/resend-verification`
- **Authentication**: Required
- **Features**:
  - Generates new OTP
  - Sends email with new code
  - Resets expiration timer

### 4. User Login
- **Endpoint**: `POST /api/auth/login`
- **Features**:
  - Login with email or phone
  - Password verification
  - Account status checks (active, blocked)
  - Last login tracking
  - JWT token generation

**Request Body**:
```json
{
  "identifier": "john@example.com",
  "password": "securepass123",
  "remember": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "verification": {
        "email": true,
        "phone": false
      },
      "lastLogin": "2026-01-07T15:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 5. Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Authentication**: Required
- **Features**:
  - Returns full user profile
  - Includes verification status
  - Shows connections and followers

### 6. Password Reset
- **Endpoint**: `POST /api/auth/forgot-password`
- **Features**:
  - Generates reset token
  - Sends email with OTP
  - 1-hour expiration

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Reset Password**:
- **Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "token": "123456",
  "password": "newpassword123"
}
```

### 7. Logout
- **Endpoint**: `POST /api/auth/logout`
- **Authentication**: Required
- **Note**: JWT is stateless, so logout is handled client-side by removing the token

## Session Management

### JWT Token Structure
```javascript
{
  userId: "695e7a5f4453c6cbda2258a3",
  iat: 1767799614,
  exp: 1770391614  // 30 days from issue
}
```

### Token Usage
Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware
- `authenticate`: Verifies JWT token and attaches user to request
- `authorize(roles)`: Checks if user has required role
- `optionalAuth`: Allows both authenticated and unauthenticated requests

## User Roles & Permissions

### Job Seeker (`seeker`)
- Can apply for jobs
- Can upload CV
- Can create posts
- Can connect with others
- Can search for jobs

### Agent (`agent`)
- Can post jobs
- Can view applications
- Can connect with job seekers
- Can create posts

### Business (`business`)
- Can post jobs
- Can view applications
- Can verify business account
- Requires: companyName, companySize, industry

### Company (`company`)
- Can post jobs
- Can view applications
- Can verify company account
- Can add CAC number
- Requires: companyName, companySize, industry

## Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique, indexed),
  phone: String (unique, indexed),
  password: String (hashed),
  role: String (enum),
  profilePhoto: String,
  bio: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  cvUrl: String,
  skills: [String],
  experience: {
    level: String,
    years: Number
  },
  education: [Object],
  companyName: String,
  companySize: String,
  industry: String,
  verification: {
    email: Boolean,
    phone: Boolean,
    identity: Boolean,
    business: Boolean
  },
  connections: [Object],
  followers: [ObjectId],
  following: [ObjectId],
  isActive: Boolean,
  isBlocked: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Email Templates

### 1. OTP Verification Email
- Subject: "Your JOBFOLIO Verification Code"
- Contains: 6-digit code
- Expiration: 10 minutes

### 2. Welcome Email
- Subject: "Welcome to JOBFOLIO Africa! 🚀"
- Sent after: Email verification
- Contains: Getting started guide

### 3. Password Reset Email
- Subject: "Reset Your JOBFOLIO Password"
- Contains: Reset code
- Expiration: 1 hour

### 4. Job Alert Email
- Subject: "New Jobs for You!"
- Contains: Matching job listings
- Frequency: Configurable

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed with secret key
3. **Rate Limiting**: 100 requests per 15 minutes
4. **CORS**: Configured for frontend domain
5. **Helmet**: Security headers
6. **Input Validation**: express-validator
7. **Email Verification**: Required for full access
8. **Account Status**: Active/blocked checks

## Testing

Run the test suite:
```bash
# Test server configuration
node test-server.js

# Test API endpoints
node test-api.js

# Test authentication flow
node test-fresh-auth.js
```

## Environment Variables Required

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5000
FRONTEND_URL=http://localhost:8080
```

## Next Steps

1. ✅ User registration with all roles
2. ✅ Email OTP verification
3. ✅ Login with JWT tokens
4. ✅ Password reset flow
5. ✅ Session management
6. ⏳ Phone OTP verification (SMS)
7. ⏳ Identity verification (document upload)
8. ⏳ Business verification (CAC documents)
9. ⏳ Refresh token implementation
10. ⏳ Social login (Google, LinkedIn)

## API Status

✅ **Fully Functional**:
- User registration (all roles)
- Email verification
- Login/Logout
- Password reset
- Profile management
- JWT authentication
- Role-based access control

🔄 **In Progress**:
- Phone verification
- Document verification
- Social login

## Support

For issues or questions, check:
- Server logs: `backend/server.js`
- Test results: Run test scripts
- API documentation: This file
