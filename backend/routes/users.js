import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's full profile
// @access  Private
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('connections.user', 'fullName profilePhoto role companyName')
    .populate('followers', 'fullName profilePhoto role')
    .populate('following', 'fullName profilePhoto role');

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().isLength({ max: 500 }),
  body('phone').optional().matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/),
  body('location.city').optional().trim(),
  body('location.state').optional().trim(),
  body('skills').optional().isArray(),
  body('experience.level').optional().isIn(['entry', 'mid', 'senior', 'executive']),
  body('experience.years').optional().isInt({ min: 0, max: 50 })
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const allowedFields = [
    'fullName', 'bio', 'phone', 'location', 'skills', 'experience', 
    'education', 'profilePhoto', 'cvUrl', 'companyName', 'companySize', 'industry'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
}));

// @route   POST /api/users/upload-profile-photo
// @desc    Update profile photo URL after upload
// @access  Private
router.post('/upload-profile-photo', authenticate, [
  body('profilePhoto').isURL().withMessage('Valid profile photo URL is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePhoto: req.body.profilePhoto },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Profile photo updated successfully',
    data: { 
      profilePhoto: user.profilePhoto 
    }
  });
}));

// @route   POST /api/users/upload-cv
// @desc    Update CV URL after upload (job seekers only)
// @access  Private
router.post('/upload-cv', authenticate, authorize('seeker'), [
  body('cvUrl').isURL().withMessage('Valid CV URL is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { cvUrl: req.body.cvUrl },
    { new: true }
  );

  res.json({
    success: true,
    message: 'CV updated successfully',
    data: { 
      cvUrl: user.cvUrl 
    }
  });
}));

// @route   GET /api/users/search
// @desc    Search users by name, skills, location
// @access  Private
router.get('/search', authenticate, asyncHandler(async (req, res) => {
  const { q, role, location, skills, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };

  // Text search
  if (q) {
    query.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } },
      { companyName: { $regex: q, $options: 'i' } }
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by location
  if (location) {
    query.$or = [
      { 'location.city': { $regex: location, $options: 'i' } },
      { 'location.state': { $regex: location, $options: 'i' } }
    ];
  }

  // Filter by skills
  if (skills) {
    const skillsArray = skills.split(',').map(skill => skill.trim());
    query.skills = { $in: skillsArray };
  }

  const users = await User.find(query)
    .select('fullName profilePhoto role companyName location bio skills verification')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -emailVerificationCode -passwordResetToken')
    .populate('connections.user', 'fullName profilePhoto role')
    .populate('followers', 'fullName profilePhoto role')
    .populate('following', 'fullName profilePhoto role');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (!user.isActive) {
    return res.status(404).json({
      success: false,
      message: 'User account is deactivated'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   POST /api/users/:id/connect
// @desc    Send connection request
// @access  Private
router.post('/:id/connect', authenticate, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot connect to yourself'
    });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const currentUser = await User.findById(currentUserId);

  // Check if connection already exists
  const existingConnection = currentUser.connections.find(
    conn => conn.user.toString() === targetUserId
  );

  if (existingConnection) {
    return res.status(400).json({
      success: false,
      message: 'Connection request already sent or users are already connected'
    });
  }

  // Add connection to current user
  currentUser.connections.push({
    user: targetUserId,
    status: 'pending'
  });

  // Add connection to target user
  targetUser.connections.push({
    user: currentUserId,
    status: 'pending'
  });

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    message: 'Connection request sent successfully'
  });
}));

// @route   PUT /api/users/connections/:id/accept
// @desc    Accept connection request
// @access  Private
router.put('/connections/:id/accept', authenticate, asyncHandler(async (req, res) => {
  const requesterId = req.params.id;
  const currentUserId = req.user._id;

  const currentUser = await User.findById(currentUserId);
  const requesterUser = await User.findById(requesterId);

  if (!requesterUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Find the connection request
  const connectionIndex = currentUser.connections.findIndex(
    conn => conn.user.toString() === requesterId && conn.status === 'pending'
  );

  if (connectionIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Connection request not found'
    });
  }

  // Update connection status for both users
  currentUser.connections[connectionIndex].status = 'accepted';
  
  const requesterConnectionIndex = requesterUser.connections.findIndex(
    conn => conn.user.toString() === currentUserId.toString()
  );
  
  if (requesterConnectionIndex !== -1) {
    requesterUser.connections[requesterConnectionIndex].status = 'accepted';
  }

  await currentUser.save();
  await requesterUser.save();

  res.json({
    success: true,
    message: 'Connection request accepted'
  });
}));

// @route   DELETE /api/users/connections/:id
// @desc    Remove connection or reject request
// @access  Private
router.delete('/connections/:id', authenticate, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove connection from current user
  currentUser.connections = currentUser.connections.filter(
    conn => conn.user.toString() !== targetUserId
  );

  // Remove connection from target user
  targetUser.connections = targetUser.connections.filter(
    conn => conn.user.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    message: 'Connection removed successfully'
  });
}));

// @route   GET /api/users/connections/requests
// @desc    Get pending connection requests
// @access  Private
router.get('/connections/requests', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'connections.user',
      select: 'fullName profilePhoto role companyName location',
      match: { isActive: true }
    });

  const pendingRequests = user.connections
    .filter(conn => conn.status === 'pending')
    .map(conn => ({
      id: conn._id,
      user: conn.user,
      connectedAt: conn.connectedAt
    }));

  res.json({
    success: true,
    data: {
      requests: pendingRequests,
      count: pendingRequests.length
    }
  });
}));

// @route   POST /api/users/:id/connect
// @desc    Send connection request or follow user
// @access  Private
router.post('/:id/connect', authenticate, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot connect with yourself'
    });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const currentUser = await User.findById(currentUserId);

  // Check if already connected
  const isAlreadyConnected = currentUser.connections.some(
    conn => conn.user && conn.user.toString() === targetUserId
  );

  if (isAlreadyConnected) {
    return res.status(200).json({
      success: true,
      message: 'You are already connected with this user',
      data: {
        connected: true,
        connectionsCount: currentUser.connections.length
      }
    });
  }

  // Add to connections (mutual) with proper structure
  currentUser.connections.push({
    user: targetUserId,
    status: 'accepted',
    connectedAt: new Date()
  });
  targetUser.connections.push({
    user: currentUserId,
    status: 'accepted',
    connectedAt: new Date()
  });

  // Add to following/followers
  if (!currentUser.following.includes(targetUserId)) {
    currentUser.following.push(targetUserId);
  }
  if (!targetUser.followers.includes(currentUserId)) {
    targetUser.followers.push(currentUserId);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    message: 'Connected successfully',
    data: {
      connected: true,
      connectionsCount: currentUser.connections.length
    }
  });
}));

// @route   DELETE /api/users/:id/connect
// @desc    Remove connection
// @access  Private
router.delete('/:id/connect', authenticate, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove from connections
  currentUser.connections = currentUser.connections.filter(
    conn => conn.user && conn.user.toString() !== targetUserId
  );
  targetUser.connections = targetUser.connections.filter(
    conn => conn.user && conn.user.toString() !== currentUserId.toString()
  );

  // Remove from following/followers
  currentUser.following = currentUser.following.filter(
    id => id.toString() !== targetUserId
  );
  targetUser.followers = targetUser.followers.filter(
    id => id.toString() !== currentUserId.toString()
  );

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    message: 'Connection removed',
    data: {
      connected: false,
      connectionsCount: currentUser.connections.length
    }
  });
}));

// @route   POST /api/users/:id/follow
// @desc    Follow user
// @access  Private
router.post('/:id/follow', authenticate, asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot follow yourself'
    });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const currentUser = await User.findById(currentUserId);

  // Check if already following
  const isAlreadyFollowing = currentUser.following.some(
    id => id.toString() === targetUserId
  );

  if (isAlreadyFollowing) {
    // Unfollow
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await targetUser.save();

    return res.json({
      success: true,
      message: 'Unfollowed successfully',
      data: {
        following: false,
        followingCount: currentUser.following.length
      }
    });
  }

  // Follow
  currentUser.following.push(targetUserId);
  targetUser.followers.push(currentUserId);

  await currentUser.save();
  await targetUser.save();

  res.json({
    success: true,
    message: 'Following successfully',
    data: {
      following: true,
      followingCount: currentUser.following.length
    }
  });
}));

// @route   GET /api/users/:id/connections
// @desc    Get user's connections
// @access  Public
router.get('/:id/connections', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('connections.user', 'fullName profilePhoto role location verification bio')
    .select('connections');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Extract just the user objects from connections
  const connections = user.connections
    .filter(conn => conn.user) // Filter out any null/undefined users
    .map(conn => ({
      ...conn.user.toObject(),
      connectedAt: conn.connectedAt
    }));

  res.json({
    success: true,
    data: {
      connections,
      count: connections.length
    }
  });
}));

// @route   GET /api/users/suggestions
// @desc    Get smart network suggestions
// @access  Private
router.get('/suggestions', authenticate, asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const currentUser = await User.findById(req.user._id)
    .select('connections following skills location role industry');
  
  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get IDs to exclude (self, connections, following)
  const connectionIds = currentUser.connections
    .map(conn => conn.user)
    .filter(Boolean);
  const excludeIds = [
    req.user._id,
    ...connectionIds,
    ...(currentUser.following || [])
  ];

  // Get connections' connections (2nd degree)
  const secondDegreeConnections = await User.find({
    'connections.user': { $in: connectionIds }
  }).select('_id');

  const secondDegreeIds = secondDegreeConnections
    .map(u => u._id.toString())
    .filter(id => !excludeIds.map(e => e.toString()).includes(id));

  // Smart suggestion algorithm
  const suggestions = await User.aggregate([
    {
      $match: {
        _id: { $nin: excludeIds },
        isActive: true
      }
    },
    {
      $addFields: {
        score: {
          $add: [
            // 2nd degree connections (friends of friends)
            {
              $cond: [
                { $in: ['$_id', secondDegreeIds.map(id => mongoose.Types.ObjectId(id))] },
                50,
                0
              ]
            },
            // Same location
            {
              $cond: [
                {
                  $or: [
                    { $eq: ['$location.city', currentUser.location?.city] },
                    { $eq: ['$location.state', currentUser.location?.state] }
                  ]
                },
                30,
                0
              ]
            },
            // Similar skills
            {
              $multiply: [
                {
                  $size: {
                    $ifNull: [
                      {
                        $setIntersection: [
                          { $ifNull: ['$skills', []] },
                          currentUser.skills || []
                        ]
                      },
                      []
                    ]
                  }
                },
                15 // 15 points per matching skill
              ]
            },
            // Same industry (for business users)
            {
              $cond: [
                { $eq: ['$industry', currentUser.industry] },
                25,
                0
              ]
            },
            // Complementary roles (seekers with agents/companies)
            {
              $cond: [
                {
                  $or: [
                    {
                      $and: [
                        { $eq: [currentUser.role, 'seeker'] },
                        { $in: ['$role', ['agent', 'business', 'company']] }
                      ]
                    },
                    {
                      $and: [
                        { $in: [currentUser.role, ['agent', 'business', 'company']] },
                        { $eq: ['$role', 'seeker'] }
                      ]
                    }
                  ]
                },
                20,
                0
              ]
            },
            // Verified users
            { $cond: ['$verification.identity', 10, 0] },
            // Active users (recent login)
            {
              $cond: [
                { $gte: ['$lastLogin', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                5,
                0
              ]
            }
          ]
        }
      }
    },
    { $match: { score: { $gt: 0 } } },
    { $sort: { score: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        password: 0,
        emailVerificationCode: 0,
        passwordResetToken: 0
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      suggestions,
      count: suggestions.length,
      algorithm: 'smart_network_suggestions'
    }
  });
}));

export default router;