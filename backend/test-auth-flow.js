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

// Test complete authentication flow
const testAuthFlow = async () => {
  console.log('🔐 Testing Complete Authentication Flow\n');

  try {
    // 1. Test user registration
    console.log('1. Testing User Registration...');
    const testUser = {
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+234987654321',
      password: 'securepass123',
      role: 'seeker'
    };

    const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const signupData = await signupResponse.json();
    
    if (signupResponse.ok) {
      console.log('✅ Registration successful');
      console.log('👤 User ID:', signupData.data.user.id);
      console.log('📧 Email verification required:', signupData.data.verificationRequired);
      
      const token = signupData.data.token;
      const userId = signupData.data.user.id;
      
      // 2. Test getting current user profile
      console.log('\n2. Testing Get Current User...');
      const profileResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const profileData = await profileResponse.json();
      if (profileResponse.ok) {
        console.log('✅ Profile retrieved successfully');
        console.log('👤 User:', profileData.data.user.fullName);
        console.log('📧 Email verified:', profileData.data.user.verification.email);
      } else {
        console.log('❌ Profile retrieval failed:', profileData.message);
      }

      // 3. Test email verification (simulate)
      console.log('\n3. Testing Email Verification...');
      // In real scenario, user would get OTP via email
      // For testing, we'll generate a mock OTP
      const mockOTP = '123456';
      
      const verifyResponse = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: mockOTP })
      });
      
      const verifyData = await verifyResponse.json();
      if (verifyResponse.ok) {
        console.log('✅ Email verification successful');
      } else {
        console.log('⚠️ Email verification failed (expected):', verifyData.message);
      }

      // 4. Test login with registered user
      console.log('\n4. Testing User Login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      if (loginResponse.ok) {
        console.log('✅ Login successful');
        console.log('🔑 New token received');
        console.log('⏰ Last login:', loginData.data.user.lastLogin);
      } else {
        console.log('❌ Login failed:', loginData.message);
      }

      // 5. Test different user roles
      console.log('\n5. Testing Different User Roles...');
      
      const roles = [
        { role: 'agent', name: 'Agent User', email: 'agent@example.com' },
        { 
          role: 'business', 
          name: 'Business User', 
          email: 'business@example.com', 
          companyName: 'Test Business',
          companySize: '11-50',
          industry: 'Retail'
        },
        { 
          role: 'company', 
          name: 'Company User', 
          email: 'company@example.com', 
          companyName: 'Test Company',
          companySize: '201-500',
          industry: 'Technology'
        }
      ];

      for (const roleTest of roles) {
        const roleUser = {
          fullName: roleTest.name,
          email: roleTest.email,
          phone: `+234${Math.floor(Math.random() * 1000000000)}`,
          password: 'password123',
          role: roleTest.role,
          ...(roleTest.companyName && { companyName: roleTest.companyName }),
          ...(roleTest.companySize && { companySize: roleTest.companySize }),
          ...(roleTest.industry && { industry: roleTest.industry })
        };

        const roleSignupResponse = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roleUser)
        });

        const roleSignupData = await roleSignupResponse.json();
        if (roleSignupResponse.ok) {
          console.log(`✅ ${roleTest.role.toUpperCase()} registration successful`);
        } else {
          console.log(`❌ ${roleTest.role.toUpperCase()} registration failed:`, roleSignupData.message);
        }
      }

      // 6. Test password reset flow
      console.log('\n6. Testing Password Reset...');
      const resetResponse = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email })
      });
      
      const resetData = await resetResponse.json();
      if (resetResponse.ok) {
        console.log('✅ Password reset email sent');
      } else {
        console.log('❌ Password reset failed:', resetData.message);
      }

    } else {
      console.log('❌ Registration failed:', signupData.message);
      if (signupData.errors) {
        signupData.errors.forEach(error => {
          console.log('  -', error.msg);
        });
      }
    }

    console.log('\n🎉 Authentication flow testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testAuthFlow();