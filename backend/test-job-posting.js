import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000/api';

// Test job posting
async function testJobPosting() {
  console.log('🧪 Testing Job Posting...\n');

  try {
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com', // Replace with your test account
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Login successful\n');

    // Create a test job
    console.log('2. Creating job posting...');
    const jobData = {
      title: 'Test Sales Representative',
      category: 'retail-sales',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        isRemote: false
      },
      type: 'full-time',
      description: 'This is a test job description that meets the minimum 50 character requirement for validation purposes.',
      requirements: {
        skills: ['Communication', 'Sales Experience'],
        experience: {
          min: 0,
          max: 5
        }
      },
      salary: {
        min: 50000,
        max: 100000,
        currency: 'NGN'
      },
      tags: ['sales', 'retail']
    };

    console.log('Job data:', JSON.stringify(jobData, null, 2));

    const jobResponse = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    const jobResult = await jobResponse.json();

    if (jobResult.success) {
      console.log('✅ Job posted successfully!');
      console.log('Job ID:', jobResult.data.job._id);
      console.log('Job Title:', jobResult.data.job.title);
    } else {
      console.error('❌ Job posting failed:', jobResult.message);
      if (jobResult.errors) {
        console.error('Validation errors:', jobResult.errors);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testJobPosting();
