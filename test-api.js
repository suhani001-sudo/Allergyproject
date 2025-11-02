// Quick test to check if the API is working
const testAPI = async () => {
    try {
        console.log('Testing API endpoints...\n');
        
        // Test 1: Check if server is running
        console.log('1. Testing server root...');
        const rootResponse = await fetch('http://localhost:5000/');
        const rootData = await rootResponse.json();
        console.log('✅ Server is running:', rootData.message);
        console.log('Available endpoints:', rootData.endpoints);
        
        // Test 2: Try to access restaurant-profile endpoint (will fail without auth, but should not be "not found")
        console.log('\n2. Testing restaurant-profile endpoint (without auth)...');
        const profileResponse = await fetch('http://localhost:5000/api/restaurant-profile');
        console.log('Status:', profileResponse.status);
        const profileData = await profileResponse.json();
        console.log('Response:', profileData);
        
        if (profileResponse.status === 401) {
            console.log('✅ Endpoint exists (401 = needs authentication)');
        } else if (profileResponse.status === 404) {
            console.log('❌ Endpoint not found - route not registered!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testAPI();
