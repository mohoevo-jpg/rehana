
import axios from 'axios';

async function testApi() {
  try {
    console.log('Testing GET /api/products...');
    const res = await axios.get('http://127.0.0.1:3001/api/products');
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testApi();
