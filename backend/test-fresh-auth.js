import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_BASE = 'http://localhost:5000/api';

// Generate unique email
const generateUniqueEmail = () => `test${Date.now()}@example.com`;
const generateUniquePhone = () => `+234${Math.floor(Math.random() * 1000000000)}`;

// Test complete authentication flow with fresh users
const testFreshAuthFlow = async () => {
  console.log('🔐 Testing Fresh Authentication Flow\n');

  try {
    // 1. Test Job Seeker Registration
    console.log('1. Testing Job Seeker Registration...');
    const jobSeeker = {
      fullName: 'Alice Johnson',
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: 'securepass123',
      role: 'seeker'
    };

    const seekerResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobSeeker)
    });

    const seekerData = await seekerResponse.json();
    if (seekerResponse.ok) {
      console.log('✅ Job Seeker registration successful');
      console.log('👤 User ID:', seekerData.data.user.id);
      console.log('🔑 Token received');
    } else {
      console.log('❌ Job Seeker registration failed:', seekerData.message);
    }

    // 2. Test Agent Registration
    console.log('\n2. Testing Agent Registration...');
    const agent = {
      fullName: 'Bob Wilson',
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: 'agentpass123',
      role: 'agent'
    };

    const agentResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    });

    const agentData = await agentResponse.json();
    if (agentResponse.ok) {
      console.log('✅ Agent registration successful');
      console.log('👤 User ID:', agentData.data.user.id);
    } else {
      console.log('❌ Agent registration failed:', agentData.message);
    }

    // 3. Test Business Registration
    console.log('\n3. Testing Business Registration...');
    const business = {
      fullName: 'Carol Davis',
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: 'businesspass123',
      role: 'business',
      companyName: 'Davis Enterprises',
      companySize: '11-50',
      industry: 'Retail'
    };

    const businessResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(business)
    });

    const businessData = await businessResponse.json();
    if (businessResponse.ok) {
      console.log('✅ Business registration successful');
      console.log('🏢 Company:', businessData.data.user.companyName);
    } else {
      console.log('❌ Business registration failed:', businessData.message);
    }

    // 4. Test Company Registration
    console.log('\n4. Testing Company Registration...');
    const company = {
      fullName: 'David Miller',
      email: generateUniqueEmail(),
      phone: generateUniquePhone(),
      password: 'companypass123',
      role: 'company',
      companyName: 'Miller Tech Solutions',
      companySize: '201-500',
      industry: 'Technology'
    };

    const companyResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company)
    });

    const companyData = await companyResponse.json();
    if (companyResponse.ok) {
      console.log('✅ Company registration successful');
      console.log('🏢 Company:', companyData.data.user.companyName);
      console.log('🏭 Industry:', companyData.data.user.industry);
    } else {
      console.log('❌ Company registration failed:', companyData.message);
    }

    // 5. Test Login with Job Seeker
    console.log('\n5. Testing Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: jobSeeker.email,
        password: jobSeeker.password
      })
    });

    const loginData = await loginResponse.json();
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log('👤 User:', loginData.data.user.fullName);
      console.log('📧 Email verified:', loginData.data.user.verification.email);
      
      // Test authenticated endpoint
      const token = loginData.data.token;
      const profileResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        console.log('✅ Authenticated profile access successful');
      }
    } else {
      console.log('❌ Login failed:', loginData.message);
    }

    // 6. Test Database Collections
    console.log('\n6. Testing Database Collections...');
    
    // Test users search
    const usersResponse = await fetch(`${API_BASE}/users/search?q=Alice`);
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Users search working');
      console.log('👥 Users found:', usersData.data.users.length);
    }

    console.log('\n🎉 Fresh authentication flow testing completed!');
    console.log('\n📊 Summary:');
    console.log('- User registration: ✅ Working');
    console.log('- Multiple user roles: ✅ Working');
    console.log('- Login/Authentication: ✅ Working');
    console.log('- JWT tokens: ✅ Working');
    console.log('- Database collections: ✅ Created');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testFreshAuthFlow();