import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with filters and search
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    q, category, location, type, salaryMin, salaryMax, 
    experience, remote, verified, page = 1, limit = 20, sort = 'newest'
  } = req.query;

  const query = { 
    status: 'active',
    expiresAt: { $gt: new Date() }
  };

  // Text search
  if (q) {
    query.$text = { $search: q };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Location filter
  if (location) {
    query.$or = [
      { 'location.city': { $regex: location, $options: 'i' } },
      { 'location.state': { $regex: location, $options: 'i' } }
    ];
  }

  // Job type filter
  if (type) {
    query.type = type;
  }

  // Salary range filter
  if (salaryMin || salaryMax) {
    query['salary.min'] = {};
    if (salaryMin) query['salary.min'].$gte = parseInt(salaryMin);
    if (salaryMax) query['salary.max'] = { $lte: parseInt(salaryMax) };
  }

  // Experience filter
  if (experience) {
    query['requirements.experience.min'] = { $lte: parseInt(experience) };
  }

  // Remote filter
  if (remote === 'true') {
    query['location.isRemote'] = true;
  }

  // Verified filter
  if (verified === 'true') {
    query.isVerified = true;
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'salary-high') sortOption = { 'salary.max': -1 };
  if (sort === 'salary-low') sortOption = { 'salary.min': 1 };
  if (sort === 'views') sortOption = { views: -1 };
  if (q) sortOption = { score: { $meta: 'textScore' }, ...sortOption };

  const jobs = await Job.find(query)
    .populate('postedBy', 'fullName companyName profilePhoto verification')
    .select('-searchKeywords')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort(sortOption);

  const total = await Job.countDocuments(query);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      filters: {
        q, category, location, type, salaryMin, salaryMax, 
        experience, remote, verified, sort
      }
    }
  });
}));

// @route   GET /api/jobs/saved
// @desc    Get user's saved jobs
// @access  Private
router.get('/saved', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const user = await mongoose.model('User').findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const jobs = await Job.find({
    _id: { $in: user.savedJobs },
    status: 'active'
  })
    .populate('postedBy', 'fullName companyName profilePhoto verification')
    .select('-searchKeywords')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = user.savedJobs.length;

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   POST /api/jobs/:id/save
// @desc    Save a job
// @access  Private
router.post('/:id/save', authenticate, asyncHandler(async (req, res) => {
  const user = await mongoose.model('User').findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if job exists
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check if already saved
  if (user.savedJobs.includes(req.params.id)) {
    return res.status(200).json({
      success: true,
      message: 'Job already saved'
    });
  }

  user.savedJobs.push(req.params.id);
  await user.save();

  // Increment saves count on job
  await Job.findByIdAndUpdate(req.params.id, { $inc: { saves: 1 } });

  res.json({
    success: true,
    message: 'Job saved successfully'
  });
}));

// @route   DELETE /api/jobs/:id/save
// @desc    Unsave a job
// @access  Private
router.delete('/:id/save', authenticate, asyncHandler(async (req, res) => {
  const user = await mongoose.model('User').findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.savedJobs = user.savedJobs.filter(jobId => jobId.toString() !== req.params.id);
  await user.save();

  // Decrement saves count on job
  await Job.findByIdAndUpdate(req.params.id, { $inc: { saves: -1 } });

  res.json({
    success: true,
    message: 'Job removed from saved'
  });
}));

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public (with optional auth for view tracking)
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('postedBy', 'fullName companyName profilePhoto verification location')
    .populate('verifiedBy', 'fullName');

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Increment view count (but not for job owner)
  if (!req.user || job.postedBy._id.toString() !== req.user._id.toString()) {
    job.views += 1;
    await job.save();
  }

  res.json({
    success: true,
    data: { job }
  });
}));

// @route   POST /api/jobs
// @desc    Create new job posting
// @access  Private (employers only)
router.post('/', authenticate, authorize('agent', 'business', 'company'), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Job title must be 5-100 characters'),
  body('description').isLength({ min: 50, max: 5000 }).withMessage('Job description must be 50-5000 characters'),
  body('category').isIn([
    'retail-sales', 'hospitality-food', 'logistics-transport', 'security-cleaning',
    'healthcare-beauty', 'education-training', 'construction-trades', 'admin-office',
    'technology-digital', 'finance-accounting', 'marketing-media', 'agriculture-farming',
    'manufacturing-production', 'customer-service', 'other'
  ]).withMessage('Invalid job category'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('type').isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance']).withMessage('Invalid job type')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const jobData = {
    ...req.body,
    postedBy: req.user._id,
    // Use provided companyName or fall back to user's company name
    companyName: req.body.companyName || req.user.companyName || req.user.fullName
  };

  // Generate search keywords
  const keywords = [
    req.body.title,
    req.body.category,
    req.body.location.city,
    req.body.location.state,
    ...(req.body.requirements?.skills || []),
    ...(req.body.tags || [])
  ].filter(Boolean);

  jobData.searchKeywords = keywords;

  const job = await Job.create(jobData);
  await job.populate('postedBy', 'fullName companyName profilePhoto verification');

  res.status(201).json({
    success: true,
    message: 'Job posted successfully',
    data: { job }
  });
}));

// @route   PUT /api/jobs/:id
// @desc    Update job posting
// @access  Private (job owner only)
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this job'
    });
  }

  // Don't allow updating if job has applications (except status)
  if (job.applications > 0 && Object.keys(req.body).some(key => key !== 'status')) {
    return res.status(400).json({
      success: false,
      message: 'Cannot modify job details after receiving applications. You can only change the status.'
    });
  }

  const allowedFields = [
    'title', 'description', 'category', 'location', 'type', 'salary',
    'requirements', 'media', 'applicationMethod', 'applicationEmail',
    'applicationPhone', 'applicationWebsite', 'applicationDeadline',
    'status', 'isUrgent', 'tags'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('postedBy', 'fullName companyName profilePhoto verification');

  res.json({
    success: true,
    message: 'Job updated successfully',
    data: { job: updatedJob }
  });
}));

// @route   DELETE /api/jobs/:id
// @desc    Delete job posting
// @access  Private (job owner only)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  // Check ownership
  if (job.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this job'
    });
  }

  // Don't allow deletion if job has applications
  if (job.applications > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete job with existing applications. Set status to closed instead.'
    });
  }

  await Job.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
}));

// @route   GET /api/jobs/my/posted
// @desc    Get jobs posted by current user
// @access  Private (employers only)
router.get('/my/posted', authenticate, authorize('agent', 'business', 'company'), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = { postedBy: req.user._id };
  if (status) {
    query.status = status;
  }

  const jobs = await Job.find(query)
    .select('-searchKeywords')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments(query);

  // Get job statistics
  const stats = await Job.aggregate([
    { $match: { postedBy: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalApplications: { $sum: '$applications' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      stats
    }
  });
}));

// @route   GET /api/jobs/categories
// @desc    Get job categories with counts
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Job.aggregate([
    { 
      $match: { 
        status: 'active',
        expiresAt: { $gt: new Date() }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const categoryMap = {
    'retail-sales': 'Retail & Sales',
    'hospitality-food': 'Hospitality & Food',
    'logistics-transport': 'Logistics & Transport',
    'security-cleaning': 'Security & Cleaning',
    'healthcare-beauty': 'Healthcare & Beauty',
    'education-training': 'Education & Training',
    'construction-trades': 'Construction & Trades',
    'admin-office': 'Admin & Office',
    'technology-digital': 'Technology & Digital',
    'finance-accounting': 'Finance & Accounting',
    'marketing-media': 'Marketing & Media',
    'agriculture-farming': 'Agriculture & Farming',
    'manufacturing-production': 'Manufacturing & Production',
    'customer-service': 'Customer Service',
    'other': 'Other'
  };

  const formattedCategories = categories.map(cat => ({
    id: cat._id,
    name: categoryMap[cat._id] || cat._id,
    count: cat.count
  }));

  res.json({
    success: true,
    data: { categories: formattedCategories }
  });
}));

// @route   GET /api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    status: 'active',
    expiresAt: { $gt: new Date() },
    isFeatured: true
  })
    .populate('postedBy', 'fullName companyName profilePhoto verification')
    .select('-searchKeywords')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: { jobs }
  });
}));

// @route   GET /api/jobs/recommendations
// @desc    Get personalized job recommendations
// @access  Private
router.get('/recommendations', authenticate, asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const user = await mongoose.model('User').findById(req.user._id)
    .select('skills location experience connections');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Build smart recommendation query
  const matchCriteria = {
    status: 'active',
    expiresAt: { $gt: new Date() }
  };

  // Get connection IDs for network-based recommendations
  const connectionIds = user.connections
    .map(conn => conn.user)
    .filter(Boolean);

  // Smart scoring algorithm with requirements as tags
  const jobs = await Job.aggregate([
    { $match: matchCriteria },
    {
      $addFields: {
        score: {
          $add: [
            // Skills match (highest priority) - includes requirements
            {
              $multiply: [
                {
                  $size: {
                    $ifNull: [
                      {
                        $setIntersection: [
                          {
                            $concatArrays: [
                              { $ifNull: ['$requirements.skills', []] },
                              { $ifNull: ['$searchKeywords', []] }
                            ]
                          },
                          user.skills || []
                        ]
                      },
                      []
                    ]
                  }
                },
                20 // 20 points per matching skill/requirement
              ]
            },
            // Location match
            {
              $cond: [
                {
                  $or: [
                    { $eq: ['$location.city', user.location?.city] },
                    { $eq: ['$location.state', user.location?.state] },
                    { $eq: ['$location.isRemote', true] }
                  ]
                },
                30,
                0
              ]
            },
            // Experience level match
            {
              $cond: [
                {
                  $and: [
                    { $lte: ['$requirements.experience.min', user.experience?.years || 0] },
                    { $gte: ['$requirements.experience.max', user.experience?.years || 0] }
                  ]
                },
                25,
                0
              ]
            },
            // Posted by connections
            { $cond: [{ $in: ['$postedBy', connectionIds] }, 40, 0] },
            // Recent posts (within 7 days)
            {
              $cond: [
                { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                15,
                0
              ]
            },
            // Verified jobs
            { $cond: ['$isVerified', 10, 0] },
            // High view count (popular jobs)
            { $multiply: [{ $divide: ['$views', 100] }, 5] }
          ]
        }
      }
    },
    { $match: { score: { $gt: 0 } } }, // Only show jobs with some relevance
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: parseInt(limit) }
  ]);

  // Populate job details
  await Job.populate(jobs, {
    path: 'postedBy',
    select: 'fullName companyName profilePhoto verification'
  });

  res.json({
    success: true,
    data: {
      jobs,
      count: jobs.length,
      algorithm: 'smart_recommendations'
    },
    message: jobs.length === 0 ? 'No recommendations found. Try updating your profile with more skills.' : undefined
  });
}));

export default router;