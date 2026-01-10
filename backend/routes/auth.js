import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendOTP, sendWelcomeEmail } from '../utils/sendEmail.js';

const router = express.Router();

// Validation middleware
const validateSignup = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['seeker', 'agent', 'business', 'company'])
    .withMessage('Invalid role selected'),
];

const validateLogin = [
  body('identifier')
    .notEmpty()
    .withMessage('Email or phone is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { fullName, email, phone, password, role, companyName, industry, companySize } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmailOrPhone(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or phone already exists'
    });
  }

  // Create user data
  const userData = {
    fullName,
    email,
    phone,
    password,
    role
  };

  // Add role-specific fields
  if (['business', 'company'].includes(role)) {
    userData.companyName = companyName;
    userData.industry = industry;
    userData.companySize = companySize;
  }

  // Create user
  const user = await User.create(userData);

  // Generate email verification code
  const verificationCode = user.generateEmailVerificationCode();
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id);

  // Send verification email
  try {
    await sendOTP(email, verificationCode, 'verification');
    console.log(`Verification email sent to ${email}`);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail registration if email fails
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verification: user.verification,
        profilePhoto: user.profilePhoto,
        companyName: user.companyName
      },
      token,
      verificationRequired: true
    }
  });
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { identifier, password, remember } = req.body;

  // Find user by email or phone
  const user = await User.findByEmailOrPhone(identifier).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  if (user.isBlocked) {
    return res.status(401).json({
      success: false,
      message: 'Account is blocked'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verification: user.verification,
        profilePhoto: user.profilePhoto,
        companyName: user.companyName,
        lastLogin: user.lastLogin
      },
      token
    }
  });
}));

// @route   POST /api/auth/verify-email
// @desc    Verify email with code
// @access  Private
router.post('/verify-email', authenticate, asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Verification code is required'
    });
  }

  const user = req.user;

  // Check if email is already verified
  if (user.verification.email) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Check verification code
  if (user.emailVerificationCode !== code) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code'
    });
  }

  // Check if code is expired
  if (user.emailVerificationExpires < Date.now()) {
    return res.status(400).json({
      success: false,
      message: 'Verification code has expired'
    });
  }

  // Verify email
  user.verification.email = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Send welcome email after verification
  try {
    await sendWelcomeEmail(user.email, user.fullName);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      verification: user.verification
    }
  });
}));

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification code
// @access  Private
router.post('/resend-verification', authenticate, asyncHandler(async (req, res) => {
  const user = req.user;

  // Check if email is already verified
  if (user.verification.email) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Generate new verification code
  const verificationCode = user.generateEmailVerificationCode();
  await user.save();

  // Send verification email
  try {
    await sendOTP(user.email, verificationCode, 'verification');
    console.log(`Verification email resent to ${user.email}`);
  } catch (emailError) {
    console.error('Failed to resend verification email:', emailError);
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email'
    });
  }

  res.json({
    success: true,
    message: 'Verification code sent successfully'
  });
}));

// @route   POST /api/auth/forgot-password
// @desc    Send password reset token
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this email'
    });
  }

  // Generate password reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // Send password reset email
  try {
    await sendOTP(email, resetToken, 'reset');
    console.log(`Password reset email sent to ${email}`);
  } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);
    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset email'
    });
  }

  res.json({
    success: true,
    message: 'Password reset instructions sent to your email'
  });
}));

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: 'Token and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Reset password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // But we can track it for analytics
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export default router;