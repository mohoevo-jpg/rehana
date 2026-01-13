
const SERVER_URL = 'http://localhost:3001';

async function runTests() {
  console.log('🚀 Starting System Verification...');

  // 1. Health Check (Get Categories)
  try {
    const res = await fetch(`${SERVER_URL}/api/categories`);
    if (res.ok) {
      const cats = await res.json();
      console.log('✅ Backend Connection: OK');
      console.log(`   Found ${cats.length} categories.`);
      if (cats.length === 0) console.warn('   ⚠️ Categories list is empty! (Did persistence work?)');
    } else {
      console.error('❌ Backend Connection: Failed (Status ' + res.status + ')');
    }
  } catch (e) {
    console.error('❌ Backend Connection: Failed (Network Error)', e.message);
    process.exit(1);
  }

  // 2. Auth Flow: Register Init
  let tempId;
  const testUser = {
    name: 'Test User',
    email: 'test' + Date.now() + '@example.com',
    phone: '07' + Math.floor(100000000 + Math.random() * 900000000),
    password: 'password123'
  };

  try {
    const res = await fetch(`${SERVER_URL}/api/auth/register-init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await res.json();
    if (res.ok) {
      console.log('✅ Auth Register Init: OK');
      tempId = data.tempId;
      console.log('   Message:', data.message);
      // Try to extract code from message for testing (since it's dev mode)
      // "تم إرسال رمز التحقق (لأغراض الاختبار: 123456)"
      const match = data.message.match(/(\d{6})/);
      if (match) {
        const code = match[1];
        console.log('   Extracted Code:', code);
        
        // 3. Auth Flow: Verify
        const verifyRes = await fetch(`${SERVER_URL}/api/auth/register-verify`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ tempId, code })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
           console.log('✅ Auth Register Verify: OK');
           console.log('   User ID:', verifyData.user.id);
        } else {
           console.error('❌ Auth Register Verify: Failed', verifyData.error);
        }

      } else {
        console.warn('   ⚠️ Could not extract code from message. Check server logs.');
      }
    } else {
      console.error('❌ Auth Register Init: Failed', data.error);
    }
  } catch (e) {
    console.error('❌ Auth Flow: Error', e.message);
  }

  // 4. Products Sync/Fetch
  try {
    const res = await fetch(`${SERVER_URL}/api/products`);
    const products = await res.json();
    console.log(`✅ Products Fetch: OK (${products.length} items)`);
  } catch (e) {
    console.error('❌ Products Fetch: Error', e.message);
  }

  console.log('🏁 Verification Complete.');
}

runTests();
