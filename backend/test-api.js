import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test API endpoints
const testAPI = async () => {
  console.log('🧪 Testing JOBFOLIO Africa API...\n');

  try {
    // 1. Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('📊 Environment:', healthData.environment);
    console.log('⏰ Server time:', healthData.timestamp);

    // 2. Test user registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+234123456789',
      password: 'password123',
      role: 'seeker'
    };

    const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const signupData = await signupResponse.json();
    
    if (signupResponse.ok) {
      console.log('✅ User registration successful');
      console.log('👤 User ID:', signupData.data.user.id);
      console.log('🔑 Token received:', signupData.data.token ? 'Yes' : 'No');
      console.log('📧 Email verification required:', signupData.data.verificationRequired);
    } else {
      console.log('⚠️ Registration response:', signupData.message);
    }

    // 3. Test job categories endpoint
    console.log('\n3. Testing job categories...');
    const categoriesResponse = await fetch(`${API_BASE}/jobs/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesResponse.ok) {
      console.log('✅ Job categories loaded');
      console.log('📊 Categories count:', categoriesData.data.categories.length);
    } else {
      console.log('❌ Categories failed:', categoriesData.message);
    }

    // 4. Test jobs listing
    console.log('\n4. Testing jobs listing...');
    const jobsResponse = await fetch(`${API_BASE}/jobs?limit=5`);
    const jobsData = await jobsResponse.json();
    
    if (jobsResponse.ok) {
      console.log('✅ Jobs listing works');
      console.log('💼 Jobs found:', jobsData.data.jobs.length);
      console.log('📄 Total jobs:', jobsData.data.pagination.total);
    } else {
      console.log('❌ Jobs listing failed:', jobsData.message);
    }

    // 5. Test posts feed
    console.log('\n5. Testing posts feed...');
    const postsResponse = await fetch(`${API_BASE}/posts?limit=5`);
    const postsData = await postsResponse.json();
    
    if (postsResponse.ok) {
      console.log('✅ Posts feed works');
      console.log('📝 Posts found:', postsData.data.posts.length);
      console.log('📄 Total posts:', postsData.data.pagination.total);
    } else {
      console.log('❌ Posts feed failed:', postsData.message);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your server is running on port 5000');
    console.log('   Run: cd backend && bun run dev');
  }
};

// Run tests
testAPI();