import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },

  // Role & Permissions
  role: {
    type: String,
    enum: ['seeker', 'agent', 'business', 'company'],
    required: [true, 'User role is required']
  },
  
  // Profile Information
  profilePhoto: {
    type: String, // Cloudinary URL
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'Nigeria' }
  },
  
  // Job Seeker Specific
  cvUrl: {
    type: String, // Cloudinary URL for PDF
    required: false // Make optional during registration, can be added later
  },
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
      default: 'entry'
    },
    years: {
      type: Number,
      min: 0,
      max: 50,
      default: 0
    }
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: Number
  }],
  
  // Business/Company Specific
  companyName: {
    type: String,
    required: function() { return ['business', 'company'].includes(this.role); }
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    required: function() { return ['business', 'company'].includes(this.role); }
  },
  industry: {
    type: String,
    required: function() { return ['business', 'company'].includes(this.role); }
  },
  
  // Verification Status
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    identity: { type: Boolean, default: false },
    business: { type: Boolean, default: false }
  },
  verificationDocuments: {
    identityDoc: String, // Cloudinary URL
    businessDoc: String, // Cloudinary URL (CAC for companies)
    cacNumber: String // For companies
  },
  
  // Social Features
  connections: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
    connectedAt: { type: Date, default: Date.now }
  }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  
  // Subscription & Premium
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'business'], default: 'free' },
    expiresAt: Date,
    features: [String]
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  lastLogin: Date,
  
  // Verification Codes
  emailVerificationCode: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.city': 1, 'location.state': 1 });
userSchema.index({ skills: 1 });
userSchema.index({ industry: 1 });

// Virtual for full location
userSchema.virtual('fullLocation').get(function() {
  const parts = [this.location?.city, this.location?.state, this.location?.country].filter(Boolean);
  return parts.join(', ');
});

// Virtual for connection count
userSchema.virtual('connectionCount').get(function() {
  return this.connections?.filter(conn => conn.status === 'accepted').length || 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification code
userSchema.methods.generateEmailVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.emailVerificationCode = code;
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  // Log OTP for development (remove in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔐 OTP CODE FOR ${this.email}: ${code}\n`);
  }
  
  return code;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 60 minutes
  
  // Log reset token for development (remove in production)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 PASSWORD RESET CODE FOR ${this.email}: ${resetToken}\n`);
  }
  
  return resetToken;
};

// Static method to find by email or phone
userSchema.statics.findByEmailOrPhone = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ]
  });
};

export default mongoose.model('User', userSchema);