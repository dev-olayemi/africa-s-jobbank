import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Testing Cloudinary Configuration...\n');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING');

// Test connection
async function testCloudinary() {
  try {
    console.log('\n✅ Testing Cloudinary connection...');
    
    // Try to get account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Response:', result);
    
    // Try to list resources
    const resources = await cloudinary.api.resources({ max_results: 1 });
    console.log('✅ Can access resources');
    console.log('Total resources:', resources.total_count);
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:');
    console.error('Error:', error.message);
    console.error('Error details:', error.error);
  }
}

testCloudinary();
