
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    // Hit port 3002 (Vite server) which should proxy to 3001
    http.get(`http://localhost:3002${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log(`${path}: Status ${res.statusCode}`);
          if (res.statusCode >= 200 && res.statusCode < 300) {
             const json = JSON.parse(data);
             console.log(`${path} Response:`, JSON.stringify(json).substring(0, 100) + '...');
             resolve();
          } else {
             console.error(`${path} Failed with status ${res.statusCode}`);
             console.error(`Body: ${data}`);
             reject(new Error(`Status ${res.statusCode}`));
          }
        } catch (e) {
          console.error(`${path} Error parsing JSON:`, e);
          console.error(`Raw data: ${data}`);
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
    console.log('Testing proxy connection to backend via Vite (port 3002)...');
    await testEndpoint('/api/settings');
    await testEndpoint('/api/campaigns');
    console.log('Proxy tests passed!');
  } catch (err) {
    console.error('Proxy tests failed');
    process.exit(1);
  }
}

runTests();
