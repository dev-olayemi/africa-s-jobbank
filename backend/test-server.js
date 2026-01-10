import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('🔍 Testing server configuration...\n');

// Test environment variables
console.log('Environment Variables:');
console.log('- PORT:', process.env.PORT || '5000');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');

// Test MongoDB connection
console.log('\n🔗 Testing MongoDB connection...');
try {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  
  console.log('✅ MongoDB Connected:', conn.connection.host);
  console.log('📊 Database:', conn.connection.name);
  
  // Test a simple query
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('📁 Collections found:', collections.length);
  
  await mongoose.connection.close();
  console.log('🔒 MongoDB connection closed');
  
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
}

console.log('\n✅ Configuration test completed!');