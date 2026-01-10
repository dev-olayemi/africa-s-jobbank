import express from 'express';
import { body, validationResult } from 'express-validator';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/applications
// @desc    Get applications (for job seekers: their applications, for employers: applications to their jobs)
// @access  Private
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { status, jobId, page = 1, limit = 20 } = req.query;
  let query = {};

  if (req.user.role === 'jobseeker') {
    // Job seekers see their own applications
    query.applicant = req.user._id;
  } else {
    // Employers see applications to their jobs
    const userJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = userJobs.map(job => job._id);
    query.job = { $in: jobIds };
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by specific job (for employers)
  if (jobId && req.user.role !== 'jobseeker') {
    query.job = jobId;
  }

  const applications = await Application.find(query)
    .populate('job', 'title companyName location type salary')
    .populate('applicant', 'fullName email profilePhoto location skills')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Application.countDocuments(query);

  // Get application statistics
  const stats = await Application.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats
    }
  });
}));

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private (applicant or job owner)
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job', 'title companyName location type salary postedBy')
    .populate('applicant', 'fullName email phone profilePhoto location skills experience education');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Check authorization
  const isApplicant = application.applicant._id.toString() === req.user._id.toString();
  const isJobOwner = application.job.postedBy.toString() === req.user._id.toString();

  if (!isApplicant && !isJobOwner) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this application'
    });
  }

  res.json({
    success: true,
    data: { application }
  });
}));

// @route   POST /api/applications
// @desc    Submit job application
// @access  Private (job seekers only)
router.post('/', authenticate, authorize('jobseeker'), [
  body('job').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').optional().isLength({ max: 1000 }).withMessage('Cover letter cannot exceed 1000 characters'),
  body('expectedSalary').optional().isNumeric().withMessage('Expected salary must be a number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { job: jobId, coverLetter, expectedSalary, resume } = req.body;

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  if (job.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'This job is no longer accepting applications'
    });
  }

  if (job.expiresAt && job.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Application deadline has passed'
    });
  }

  // Check if user already applied
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: req.user._id
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already applied for this job'
    });
  }

  // Create application
  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
    expectedSalary,
    resume: resume || req.user.resume
  });

  // Update job application count
  await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

  await application.populate([
    { path: 'job', select: 'title companyName' },
    { path: 'applicant', select: 'fullName email' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application }
  });
}));

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (job owner only)
router.put('/:id/status', authenticate, [
  body('status').isIn(['pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'])
    .withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const application = await Application.findById(req.params.id).populate('job');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Check if user owns the job
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this application'
    });
  }

  const { status, notes } = req.body;

  // Add status history entry
  application.statusHistory.push({
    status: application.status,
    changedAt: new Date(),
    changedBy: req.user._id,
    notes: `Status changed from ${application.status} to ${status}`
  });

  application.status = status;
  if (notes) {
    application.employerNotes = notes;
  }

  await application.save();

  await application.populate('applicant', 'fullName email');

  res.json({
    success: true,
    message: 'Application status updated successfully',
    data: { application }
  });
}));

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (applicant only)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Check if user owns the application
  if (application.applicant.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to withdraw this application'
    });
  }

  // Don't allow withdrawal if application is in advanced stages
  if (['interviewed', 'offered', 'hired'].includes(application.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot withdraw application at this stage. Please contact the employer directly.'
    });
  }

  // Update job application count
  await Job.findByIdAndUpdate(application.job, { $inc: { applications: -1 } });

  await Application.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Application withdrawn successfully'
  });
}));

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a specific job
// @access  Private (job owner only)
router.get('/job/:jobId', authenticate, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  // Check if user owns the job
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view applications for this job'
    });
  }

  const query = { job: req.params.jobId };
  if (status) {
    query.status = status;
  }

  const applications = await Application.find(query)
    .populate('applicant', 'fullName email profilePhoto location skills experience')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Application.countDocuments(query);

  // Get application statistics for this job
  const stats = await Application.aggregate([
    { $match: { job: job._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      job: {
        _id: job._id,
        title: job.title,
        companyName: job.companyName
      },
      applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats
    }
  });
}));

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Private
router.get('/stats', authenticate, asyncHandler(async (req, res) => {
  let matchQuery = {};

  if (req.user.role === 'jobseeker') {
    matchQuery.applicant = req.user._id;
  } else {
    // Get jobs posted by this user
    const userJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = userJobs.map(job => job._id);
    matchQuery.job = { $in: jobIds };
  }

  const stats = await Application.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        reviewing: { $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } },
        shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
        interviewed: { $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] } },
        offered: { $sum: { $cond: [{ $eq: ['$status', 'offered'] }, 1, 0] } },
        hired: { $sum: { $cond: [{ $eq: ['$status', 'hired'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
      }
    }
  ]);

  const result = stats[0] || {
    total: 0, pending: 0, reviewing: 0, shortlisted: 0,
    interviewed: 0, offered: 0, hired: 0, rejected: 0
  };

  res.json({
    success: true,
    data: { stats: result }
  });
}));

export default router;