// Simple Node.js test to verify the auth endpoints
const { default: fetch } = require('node-fetch');

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function testAuth() {
  try {
    console.log('🔍 Testing authentication endpoints...\n');

    // Test 1: Login
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Login failed: ${loginResponse.status} - ${errorText}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('   Access token:', loginData.access ? '✓ Present' : '✗ Missing');
    console.log('   Refresh token:', loginData.refresh ? '✓ Present' : '✗ Missing');

    // Test 2: Get user details
    console.log('\n2. Testing user details...');
    const userResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.access}`,
        'Content-Type': 'application/json',
      }
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      throw new Error(`User details failed: ${userResponse.status} - ${errorText}`);
    }

    const userData = await userResponse.json();
    console.log('✅ User details retrieved');
    console.log('   Username:', userData.username);
    console.log('   Email:', userData.email);
    console.log('   Name:', userData.first_name, userData.last_name);

    // Test 3: Token refresh
    console.log('\n3. Testing token refresh...');
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: loginData.refresh
      })
    });

    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text();
      throw new Error(`Token refresh failed: ${refreshResponse.status} - ${errorText}`);
    }

    const refreshData = await refreshResponse.json();
    console.log('✅ Token refresh successful');
    console.log('   New access token:', refreshData.access ? '✓ Present' : '✗ Missing');

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📱 Your frontend can now use these endpoints:');
    console.log('   - Login: POST /api/auth/login/');
    console.log('   - User details: GET /api/auth/user/');
    console.log('   - Token refresh: POST /api/auth/token/refresh/');
    console.log('   - Registration: POST /api/auth/registration/');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAuth();
