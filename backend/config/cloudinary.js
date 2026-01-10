import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Validate configuration
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.error('❌ Cloudinary configuration missing! Please check your .env file.');
  console.error('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
  console.log('✅ Cloudinary configured successfully');
}

cloudinary.config(cloudinaryConfig);

// Storage configuration for different file types
const createCloudinaryStorage = (folder, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `jobfolio/${folder}`,
      resource_type: resourceType,
      allowed_formats: ['jpeg', 'jpg', 'png', 'pdf', 'mp4', 'webm', 'mov'],
      transformation: resourceType === 'image' ? [
        { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
      ] : undefined,
    },
  });
};

// Different storage configurations
export const profilePhotoStorage = createCloudinaryStorage('profile-photos', 'image');
export const cvStorage = createCloudinaryStorage('cvs', 'raw');
export const jobMediaStorage = createCloudinaryStorage('job-media', 'auto');
export const postMediaStorage = createCloudinaryStorage('post-media', 'auto');

// Direct upload function for programmatic uploads
export const uploadToCloudinary = async (file, folder, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `jobfolio/${folder}`,
      resource_type: resourceType,
      allowed_formats: ['jpeg', 'jpg', 'png', 'pdf', 'mp4', 'webm', 'mov'],
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;