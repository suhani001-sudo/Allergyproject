// Test script to verify feedback API endpoint
const testFeedback = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        message: 'This is a test feedback message'
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (data.success) {
      console.log('✅ Feedback submitted successfully!');
      console.log('Feedback ID:', data.data._id);
    } else {
      console.log('❌ Failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testFeedback();
