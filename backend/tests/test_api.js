const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  const baseUrl = {
    hostname: 'localhost',
    port: 3001,
    headers: { 'Content-Type': 'application/json' }
  };

  console.log('--- Testing Settings ---');
  // 1. Fetch Settings
  let res = await request({ ...baseUrl, path: '/api/settings', method: 'GET' });
  console.log('Fetch Settings:', res.body);

  // 2. Update Settings
  const newSettings = { ...res.body, isStoreOpen: !res.body.isStoreOpen };
  res = await request({ ...baseUrl, path: '/api/settings', method: 'POST' }, newSettings);
  console.log('Update Settings:', res.body);

  // 3. Verify Update
  res = await request({ ...baseUrl, path: '/api/settings', method: 'GET' });
  if (res.body.isStoreOpen === newSettings.isStoreOpen) {
      console.log('✅ Settings updated successfully');
  } else {
      console.error('❌ Settings update failed');
  }

  console.log('\n--- Testing Products ---');
  // 4. Add Product
  const product = { name: 'Test Product', price: 1000, barcode: '123456', isAvailable: true };
  res = await request({ ...baseUrl, path: '/api/products', method: 'POST' }, product);
  const createdProduct = res.body.product;
  console.log('Add Product:', createdProduct);

  // 5. Toggle Availability (Update Product)
  const toggledProduct = { ...createdProduct, isAvailable: false };
  res = await request({ ...baseUrl, path: '/api/products', method: 'POST' }, toggledProduct);
  console.log('Toggle Availability:', res.body.product);

  // 6. Verify Availability
  if (res.body.product.isAvailable === false) {
      console.log('✅ Availability toggled successfully');
  } else {
      console.error('❌ Availability toggle failed');
  }

  // 7. Delete Product
  res = await request({ ...baseUrl, path: `/api/products/${createdProduct.id}`, method: 'DELETE' });
  console.log('Delete Product Status:', res.statusCode);
  
  // Verify Deletion
  res = await request({ ...baseUrl, path: '/api/products', method: 'GET' });
  const exists = res.body.find(p => p.id === createdProduct.id);
  if (!exists) {
      console.log('✅ Product deleted successfully');
  } else {
      console.error('❌ Product deletion failed');
  }
}

runTests().catch(console.error);
