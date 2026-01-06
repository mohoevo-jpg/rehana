
import axios from 'axios';

async function testAddProduct() {
  try {
    console.log('Testing POST /api/products...');
    const newProduct = {
      name: 'Test Product',
      price: 1000,
      category: 'Test',
      barcode: '999999',
      quantity: 10,
      images: [],
      isAvailable: true
    };
    
    const res = await axios.post('http://127.0.0.1:3001/api/products', newProduct);
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAddProduct();
