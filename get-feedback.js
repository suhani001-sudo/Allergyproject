// Test script to fetch all feedback from API
const getFeedback = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Total feedback count:', data.count);
    console.log('\nAll feedback:');
    console.log(JSON.stringify(data.data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

getFeedback();
