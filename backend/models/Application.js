import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Core References
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant reference is required']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer reference is required']
  },
  
  // Application Details
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  customCv: {
    type: String, // Cloudinary URL - if different from profile CV
    default: null
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Timeline Tracking
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Interview Details
  interview: {
    scheduled: { type: Boolean, default: false },
    date: Date,
    time: String,
    location: String,
    type: { type: String, enum: ['in-person', 'phone', 'video', 'online'] },
    meetingLink: String,
    notes: String
  },
  
  // Employer Notes & Rating
  employerNotes: {
    type: String,
    maxlength: [1000, 'Employer notes cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Application Source
  source: {
    type: String,
    enum: ['platform', 'referral', 'direct', 'social'],
    default: 'platform'
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Flags
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  
  // Communication
  lastContactDate: Date,
  nextFollowUpDate: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better performance
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ employer: 1, status: 1 });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: -1 });

// Virtual for current status info
applicationSchema.virtual('currentStatusInfo').get(function() {
  const statusHistory = this.statusHistory || [];
  const latest = statusHistory[statusHistory.length - 1];
  
  return {
    status: this.status,
    changedAt: latest?.changedAt || this.createdAt,
    changedBy: latest?.changedBy,
    notes: latest?.notes
  };
});

// Virtual for time since application
applicationSchema.virtual('timeAgo').get(function() {
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

// Pre-save middleware to track status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      // changedBy will be set by the controller
    });
  }
  next();
});

// Static method to get application statistics
applicationSchema.statics.getStats = function(employerId) {
  return this.aggregate([
    { $match: { employer: employerId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to find applications by job
applicationSchema.statics.findByJob = function(jobId, options = {}) {
  const query = this.find({ job: jobId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.populate) {
    query.populate('applicant', 'fullName email phone profilePhoto skills experience location');
  }
  
  return query.sort({ createdAt: -1 });
};

// Static method to find applications by applicant
applicationSchema.statics.findByApplicant = function(applicantId, options = {}) {
  const query = this.find({ applicant: applicantId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.populate) {
    query.populate('job', 'title companyName location salary type status')
         .populate('employer', 'fullName companyName');
  }
  
  return query.sort({ createdAt: -1 });
};

// Method to update status with history
applicationSchema.methods.updateStatus = function(newStatus, changedBy, notes) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    changedAt: new Date(),
    notes: notes
  });
  
  // Mark as read when status changes
  if (!this.isRead) {
    this.isRead = true;
  }
  
  return this.save();
};

// Method to schedule interview
applicationSchema.methods.scheduleInterview = function(interviewDetails) {
  this.interview = {
    ...this.interview,
    ...interviewDetails,
    scheduled: true
  };
  
  // Update status to interviewed if not already
  if (this.status === 'pending' || this.status === 'reviewed') {
    this.status = 'shortlisted';
  }
  
  return this.save();
};

export default mongoose.model('Application', applicationSchema);