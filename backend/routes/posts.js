import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Post Schema (inline for now, can be moved to models later)
const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] },
    caption: String
  }],
  hashtags: [String],
  mentions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  }],
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likedAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  shares: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtuals
postSchema.virtual('likesCount').get(function() {
  return this.likes?.length || 0;
});

postSchema.virtual('commentsCount').get(function() {
  return this.comments?.length || 0;
});

postSchema.virtual('sharesCount').get(function() {
  return this.shares?.length || 0;
});

postSchema.virtual('timeAgo').get(function() {
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

const Post = mongoose.model('Post', postSchema);

// @route   GET /api/posts
// @desc    Get posts feed with smart algorithm
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, hashtag, author, type = 'feed' } = req.query;

  let query = { isPublic: true };
  let sortOption = {};

  // Filter by hashtag
  if (hashtag) {
    query.hashtags = { $in: [hashtag] };
  }

  // Filter by author
  if (author) {
    query.author = author;
  }

  // Smart Feed Algorithm
  if (type === 'feed' && req.user) {
    // Get user's connections (extract user IDs from connection objects)
    const currentUser = await mongoose.model('User').findById(req.user._id)
      .select('connections following skills location');
    
    const connectionIds = currentUser.connections
      .map(conn => conn.user)
      .filter(Boolean);
    const followingIds = currentUser.following || [];
    
    // Priority scoring system
    const posts = await Post.aggregate([
      { $match: query },
      {
        $addFields: {
          score: {
            $add: [
              // Posts from connections (highest priority)
              { $cond: [{ $in: ['$author', connectionIds] }, 50, 0] },
              // Posts from people you follow
              { $cond: [{ $in: ['$author', followingIds] }, 30, 0] },
              // Recent posts (within 24 hours)
              { 
                $cond: [
                  { $gte: ['$createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
                  20,
                  0
                ]
              },
              // Posts with high engagement
              { $multiply: [{ $size: { $ifNull: ['$likes', []] } }, 2] },
              { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 3] },
              // Posts with media
              { $cond: [{ $gt: [{ $size: { $ifNull: ['$media', []] } }, 0] }, 10, 0] },
            ]
          }
        }
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    // Populate author and engagement data
    await Post.populate(posts, [
      { path: 'author', select: 'fullName profilePhoto role companyName verification' },
      { path: 'comments.user', select: 'fullName profilePhoto' },
      { path: 'likes.user', select: 'fullName' }
    ]);

    // Add user interaction status
    posts.forEach(post => {
      post.isLiked = post.likes?.some(like => like.user._id.toString() === req.user._id.toString());
    });

    const total = await Post.countDocuments(query);

    return res.json({
      success: true,
      data: {
        posts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        },
        algorithm: 'smart_feed'
      }
    });
  }

  // Default feed (no personalization)
  const posts = await Post.find(query)
    .populate('author', 'fullName profilePhoto role companyName verification')
    .populate('comments.user', 'fullName profilePhoto')
    .populate('likes.user', 'fullName')
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Post.countDocuments(query);

  // Add user interaction status if authenticated
  if (req.user) {
    posts.forEach(post => {
      post.isLiked = post.likes.some(like => like.user._id.toString() === req.user._id.toString());
    });
  }

  res.json({
    success: true,
    data: {
      posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'fullName profilePhoto role companyName verification')
    .populate('comments.user', 'fullName profilePhoto')
    .populate('likes.user', 'fullName profilePhoto');

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Add user interaction status if authenticated
  if (req.user) {
    post.isLiked = post.likes.some(like => like.user._id.toString() === req.user._id.toString());
  }

  res.json({
    success: true,
    data: { post }
  });
}));

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', authenticate, [
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Post content must be 1-2000 characters'),
  body('hashtags').optional().isArray().withMessage('Hashtags must be an array'),
  body('media').optional().isArray().withMessage('Media must be an array')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { content, media, hashtags, isPublic = true } = req.body;

  // Extract hashtags from content if not provided
  let finalHashtags = hashtags || [];
  const hashtagMatches = content.match(/#[\w]+/g);
  if (hashtagMatches) {
    const extractedHashtags = hashtagMatches.map(tag => tag.substring(1).toLowerCase());
    finalHashtags = [...new Set([...finalHashtags, ...extractedHashtags])];
  }

  // Extract mentions from content
  const mentions = [];
  const mentionMatches = content.match(/@[\w]+/g);
  if (mentionMatches) {
    // TODO: Resolve mentions to actual users
    mentions.push(...mentionMatches.map(mention => ({ username: mention.substring(1) })));
  }

  const post = await Post.create({
    author: req.user._id,
    content,
    media: media || [],
    hashtags: finalHashtags,
    mentions,
    isPublic
  });

  await post.populate('author', 'fullName profilePhoto role companyName verification');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: { post }
  });
}));

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (post owner only)
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }

  const allowedFields = ['content', 'media', 'hashtags', 'isPublic'];
  const updates = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('author', 'fullName profilePhoto role companyName verification');

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: { post: updatedPost }
  });
}));

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (post owner only)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
}));

// @route   POST /api/posts/:id/like
// @desc    Like/unlike post
// @access  Private
router.post('/:id/like', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const userId = req.user._id;
  const likeIndex = post.likes.findIndex(like => like.user.toString() === userId.toString());

  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
    await post.save();
    
    res.json({
      success: true,
      message: 'Post unliked',
      data: { 
        liked: false,
        likesCount: post.likes.length
      }
    });
  } else {
    // Like
    post.likes.push({ user: userId });
    await post.save();
    
    res.json({
      success: true,
      message: 'Post liked',
      data: { 
        liked: true,
        likesCount: post.likes.length
      }
    });
  }
}));

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', authenticate, [
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be 1-500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const comment = {
    user: req.user._id,
    content: req.body.content
  };

  post.comments.push(comment);
  await post.save();

  await post.populate('comments.user', 'fullName profilePhoto');

  const newComment = post.comments[post.comments.length - 1];

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: { 
      comment: newComment,
      commentsCount: post.comments.length
    }
  });
}));

// @route   DELETE /api/posts/:id/comment/:commentId
// @desc    Delete comment
// @access  Private (comment owner or post owner)
router.delete('/:id/comment/:commentId', authenticate, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user owns the comment or the post
  const isCommentOwner = comment.user.toString() === req.user._id.toString();
  const isPostOwner = post.author.toString() === req.user._id.toString();

  if (!isCommentOwner && !isPostOwner) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  comment.remove();
  await post.save();

  res.json({
    success: true,
    message: 'Comment deleted successfully',
    data: {
      commentsCount: post.comments.length
    }
  });
}));

// @route   GET /api/posts/hashtags/trending
// @desc    Get trending hashtags
// @access  Public
router.get('/hashtags/trending', asyncHandler(async (req, res) => {
  const trending = await Post.aggregate([
    { $unwind: '$hashtags' },
    { 
      $match: { 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }
    },
    {
      $group: {
        _id: '$hashtags',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ]);

  const hashtags = trending.map(item => ({
    hashtag: item._id,
    count: item.count
  }));

  res.json({
    success: true,
    data: { hashtags }
  });
}));

export default router;