import axios from 'axios';

async function testOrders() {
  try {
    console.log('Testing GET /api/orders...');
    const res = await axios.get('http://localhost:3001/api/orders');
    console.log('Status:', res.status);
    console.log('Data count:', res.data.length);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testOrders();
