
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log(`${path}: Status ${res.statusCode}`);
          const json = JSON.parse(data);
          console.log(`${path} Response:`, JSON.stringify(json).substring(0, 100) + '...');
          resolve();
        } catch (e) {
          console.error(`${path} Error parsing JSON:`, e);
          reject(e);
        }
      });
    }).on('error', err => {
      console.error(`${path} Connection Error:`, err.message);
      reject(err);
    });
  });
}

async function runTests() {
  try {
    await testEndpoint('/api/settings');
    await testEndpoint('/api/campaigns');
    await testEndpoint('/api/users');
    await testEndpoint('/api/orders');
  } catch (err) {
    console.error('Test failed');
  }
}

runTests();
