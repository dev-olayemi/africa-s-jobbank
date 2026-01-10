import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot exceed 5000 characters']
  },
  
  // Job Details
  category: {
    type: String,
    required: [true, 'Job category is required'],
    enum: [
      'retail-sales', 'hospitality-food', 'logistics-transport', 'security-cleaning',
      'healthcare-beauty', 'education-training', 'construction-trades', 'admin-office',
      'technology-digital', 'finance-accounting', 'marketing-media', 'agriculture-farming',
      'manufacturing-production', 'customer-service', 'other'
    ]
  },
  
  // Location
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'Nigeria' },
    isRemote: { type: Boolean, default: false },
    address: String
  },
  
  // Employment Details
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
  },
  salary: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'NGN' },
    period: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'], default: 'monthly' },
    negotiable: { type: Boolean, default: false }
  },
  
  // Requirements
  requirements: {
    education: {
      type: String,
      enum: ['none', 'primary', 'secondary', 'diploma', 'degree', 'masters', 'phd'],
      default: 'secondary'
    },
    experience: {
      min: { type: Number, min: 0, default: 0 },
      max: { type: Number, min: 0 },
      required: { type: Boolean, default: false }
    },
    skills: [String],
    languages: [String],
    certifications: [String]
  },
  
  // Company Information
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyLogo: String, // Cloudinary URL
  
  // Media & Attachments
  media: [{
    url: String, // Cloudinary URL
    type: { type: String, enum: ['image', 'video'] },
    caption: String
  }],
  
  // Application Settings
  applicationMethod: {
    type: String,
    enum: ['platform', 'email', 'phone', 'website'],
    default: 'platform'
  },
  applicationEmail: String,
  applicationPhone: String,
  applicationWebsite: String,
  applicationDeadline: Date,
  
  // Job Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'expired'],
    default: 'active'
  },
  isUrgent: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  
  // Verification & Quality
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  qualityScore: { type: Number, min: 0, max: 100, default: 50 },
  
  // Analytics
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  
  // SEO & Search
  tags: [String],
  searchKeywords: [String],
  
  // Expiry
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1, expiresAt: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ searchKeywords: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isVerified: 1, isFeatured: 1 });

// Text search index
jobSchema.index({
  title: 'text',
  description: 'text',
  companyName: 'text',
  tags: 'text',
  searchKeywords: 'text'
});

// Virtual for full location
jobSchema.virtual('fullLocation').get(function() {
  const parts = [this.location?.city, this.location?.state];
  if (this.location?.isRemote) parts.push('(Remote)');
  return parts.filter(Boolean).join(', ');
});

// Virtual for salary range
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary?.min && !this.salary?.max) return 'Salary not specified';
  
  const currency = this.salary?.currency === 'NGN' ? '₦' : this.salary?.currency;
  const period = this.salary?.period || 'monthly';
  
  if (this.salary?.negotiable) return `${currency} Negotiable`;
  if (this.salary?.min && this.salary?.max) {
    return `${currency}${this.salary.min.toLocaleString()} - ${currency}${this.salary.max.toLocaleString()} ${period}`;
  }
  if (this.salary?.min) return `From ${currency}${this.salary.min.toLocaleString()} ${period}`;
  if (this.salary?.max) return `Up to ${currency}${this.salary.max.toLocaleString()} ${period}`;
  
  return 'Salary not specified';
});

// Virtual for time since posted
jobSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
});

// Pre-save middleware to auto-expire jobs
jobSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

// Static method to find active jobs
jobSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

// Static method to search jobs
jobSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    status: 'active',
    expiresAt: { $gt: new Date() },
    ...filters
  };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  return this.find(searchQuery).sort({ score: { $meta: 'textScore' }, createdAt: -1 });
};

// Method to increment view count
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to check if job is expired
jobSchema.methods.isExpired = function() {
  return this.expiresAt < new Date();
};

export default mongoose.model('Job', jobSchema);