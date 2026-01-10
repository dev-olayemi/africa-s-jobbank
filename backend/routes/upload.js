import express from 'express';
import multer from 'multer';
import { 
  profilePhotoStorage, 
  cvStorage, 
  jobMediaStorage, 
  postMediaStorage 
} from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Configure multer for different upload types
const profilePhotoUpload = multer({ 
  storage: profilePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile photos'), false);
    }
  }
});

const cvUpload = multer({ 
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for CV uploads'), false);
    }
  }
});

const mediaUpload = multer({ 
  storage: jobMediaStorage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB for videos
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png',
      'video/mp4', 'video/webm', 'video/mov'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG) and videos (MP4, WebM, MOV) are allowed'), false);
    }
  }
});

// @route   POST /api/upload/profile-photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile-photo', authenticate, (req, res, next) => {
  console.log('📸 Profile photo upload request received');
  console.log('User:', req.user?.email);
  console.log('Content-Type:', req.headers['content-type']);
  
  profilePhotoUpload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('❌ Profile photo upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload profile photo'
      });
    }
    
    console.log('✅ File received:', req.file ? 'Yes' : 'No');
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }
    
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.file) {
    console.error('❌ No file in request');
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  console.log('✅ Upload successful to Cloudinary');
  console.log('Cloudinary URL:', req.file.path);

  res.json({
    success: true,
    message: 'Profile photo uploaded successfully',
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
}));

// @route   POST /api/upload/cv
// @desc    Upload CV (PDF only)
// @access  Private
router.post('/cv', authenticate, (req, res, next) => {
  cvUpload.single('cv')(req, res, (err) => {
    if (err) {
      console.error('CV upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload CV'
      });
    }
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No CV file uploaded'
    });
  }

  // Only job seekers can upload CVs
  if (req.user.role !== 'seeker') {
    return res.status(403).json({
      success: false,
      message: 'Only job seekers can upload CVs'
    });
  }

  res.json({
    success: true,
    message: 'CV uploaded successfully',
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
}));

// @route   POST /api/upload/media
// @desc    Upload multiple media files (for jobs/posts)
// @access  Private
router.post('/media', authenticate, mediaUpload.array('media', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }

  const uploadedFiles = req.files.map(file => ({
    url: file.path,
    publicId: file.filename,
    originalName: file.originalname,
    size: file.size,
    type: file.mimetype.startsWith('image/') ? 'image' : 'video'
  }));

  res.json({
    success: true,
    message: `${uploadedFiles.length} file(s) uploaded successfully`,
    data: {
      files: uploadedFiles,
      count: uploadedFiles.length
    }
  });
}));

// @route   POST /api/upload/job-image
// @desc    Upload single job image
// @access  Private
router.post('/job-image', authenticate, mediaUpload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image uploaded'
    });
  }

  res.json({
    success: true,
    message: 'Job image uploaded successfully',
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: 'image'
    }
  });
}));

// @route   POST /api/upload/single-media
// @desc    Upload single media file
// @access  Private
router.post('/single-media', authenticate, mediaUpload.single('media'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  res.json({
    success: true,
    message: 'Media file uploaded successfully',
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'video'
    }
  });
}));

// @route   POST /api/upload/verification-document
// @desc    Upload verification documents (ID, Business registration, etc.)
// @access  Private
router.post('/verification-document', authenticate, asyncHandler(async (req, res) => {
  // Use CV storage for verification documents (supports PDF and images)
  const upload = multer({ 
    storage: cvStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only PDF and image files are allowed for verification documents'), false);
      }
    }
  }).single('document');

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No document uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Verification document uploaded successfully',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  });
}));

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Please upload a smaller file.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 10 files allowed.'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

export default router;