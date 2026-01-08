require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const WhatsAppService = require('./services/whatsappService');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'service@rehanaforflowers.com',
    pass: process.env.EMAIL_PASS || 'your-password'
  }
});

const path = require('path');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const SHOP_DIST_PATH = process.env.SHOP_DIST_PATH || path.join(__dirname, '../mobile-app/dist');

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://static.cloudflareinsights.com", "https://cloudflareinsights.com"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com", "https://cloudflareinsights.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "ws:", "wss:", "https://static.cloudflareinsights.com", "https://cloudflareinsights.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));
app.use(compression());

// Enable CORS for all origins (Cashier App + Mobile App)
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());

// 1. Serve Landing Page Assets (if any) and Root
app.use(express.static(path.join(__dirname, '../landing')));

// 2. Serve Mobile App (Customer Store) at /shop
app.use('/shop', (req, res, next) => {
  console.log(`[DEBUG] Request to /shop: ${req.method} ${req.url} | Accept: ${req.headers.accept}`);
  next();
});
app.use('/shop', express.static(SHOP_DIST_PATH));

app.get('/shop', (req, res) => {
  console.log('[DEBUG] Serving /shop/index.html explicitly');
  res.sendFile(path.join(SHOP_DIST_PATH, 'index.html'));
});

app.get('/shop/', (req, res) => {
  console.log('[DEBUG] Serving /shop/index.html explicitly (trailing slash)');
  res.sendFile(path.join(SHOP_DIST_PATH, 'index.html'));
});

// 3. Serve Cashier App (Admin) at /admin-panel
app.use('/admin-panel', express.static(path.join(__dirname, '../dist')));

app.get('/admin-panel', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/admin-panel/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 4. Serve Update Files
app.use('/updates', express.static(path.join(__dirname, '../public/updates')));
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads')));

// --- Routes ---

// Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../landing/index.html'));
});

// Handle Mobile App client-side routing
// Removed duplicate regex handler as it is covered by app.get('/shop/*', ...)


// Handle Cashier App client-side routing (if needed, though it uses HashHistory)
// But we should ensure /admin-panel returns the index
app.get(/\/admin-panel\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});



// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// --- WhatsApp Client Setup ---
const whatsappService = new WhatsAppService(io);
whatsappService.initialize();

const fs = require('fs');

// --- Helper Functions ---

// Logging System
const LOGS_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}
const LOG_FILE = path.join(LOGS_DIR, 'activity_logs.json');

// Initialize logs from file or empty array
let activityLogs = [];
if (fs.existsSync(LOG_FILE)) {
  try {
    activityLogs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch (err) {
    console.error('Failed to load logs:', err);
    activityLogs = [];
  }
}

function logActivity(type, message, details = {}) {
  const logEntry = {
    id: Date.now().toString(),
    type, // 'order', 'user', 'system', 'campaign', 'product', 'settings'
    message,
    details,
    timestamp: new Date().toISOString()
  };

  activityLogs.unshift(logEntry);
  
  // Keep only last 1000 logs in memory/file to prevent bloat
  if (activityLogs.length > 1000) {
    activityLogs = activityLogs.slice(0, 1000);
  }

  // Persist to file (asynchronously)
  fs.writeFile(LOG_FILE, JSON.stringify(activityLogs, null, 2), (err) => {
    if (err) console.error('Failed to save logs:', err);
  });

  // Notify admins via Socket.io
  io.to('cashiers').emit('new-activity', logEntry);
  console.log(`[ACTIVITY] ${type}: ${message}`);
}

// Temporary storage for pending registrations: { tempId: { userData, code, expiry } }
const pendingRegistrations = new Map();

function generateCode() {
  return 'R-' + Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendWhatsApp(phone, message) {
  return await whatsappService.send(phone, message);
}

async function sendEmail(email, subject, text) {
  // Log the email content for development/debugging
  console.log('---------------------------------------------------');
  console.log(`[EMAIL] To: ${email}`);
  console.log(`[EMAIL] Subject: ${subject}`);
  console.log(`[EMAIL] Body: ${text}`);
  console.log('---------------------------------------------------');

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'service@rehanaforflowers.com',
      to: email,
      subject: subject,
      text: text
    });
    console.log('[EMAIL] Sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error);
    // In development, we might want to return true even if email fails, 
    // but in production we should return false. 
    // For now, let's return false to indicate failure.
    return false;
  }
}

// --- Data Storage ---
let orders = [];
let products = [
  { id: '1', name: 'شاي أحمد', price: 5000, category: 'مشروبات', barcode: '1001', quantity: 50, images: [], isAvailable: true },
  { id: '2', name: 'قهوة مختصة', price: 15000, category: 'مشروبات', barcode: '1002', quantity: 20, images: [], isAvailable: true },
  { id: '3', name: 'سكر 1كغ', price: 1500, category: 'بقالة', barcode: '1003', quantity: 100, images: [], isAvailable: true },
  { id: '4', name: 'أرز بسمتي', price: 2500, category: 'بقالة', barcode: '1004', quantity: 40, images: [], isAvailable: true },
  { id: '5', name: 'زيت طبخ', price: 3000, category: 'بقالة', barcode: '1005', quantity: 30, images: [], isAvailable: true },
]; 
let users = [];
let settings = {
  minAppVersion: '1.0.0',
  latestAppVersion: '1.2.0',
  updateUrl: 'https://play.google.com/store/apps/details?id=com.rehana.app',
  announcement: {
    active: false,
    title: '',
    message: ''
  },
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  email: 'info@rehana.com'
};

let settings = {
  deliveryFee: 5000,
  minOrderAmount: 0,
  isStoreOpen: true,
  allowOrders: true,
  currencySymbol: 'د.ع',
  minAppVersion: '1.0.0',
  latestAppVersion: '1.0.0',
  updateUrl: '',
  updateMessage: 'تحديث جديد متوفر، يرجى التحديث للحصول على آخر المميزات',
  welcomeMessage: 'تم إنشاء الحساب بنجاح!\nحصلت على رصيد ترحيبي بقيمة {amount} د.ع هدية مقدمة من تطبيق ريحانة.\nنتمنى لك تجربة تسوق ممتعة.',
  welcomeBonus: 3000,
  announcement: {
    active: false,
    title: 'تنبيه هام',
    message: ''
  },
  rewardSystem: {
    active: true,
    threshold: 35000,
    amount: 1000,
    message: 'لانك زبون مميز لدينا هاي 1000 دينار رصيد استخدمه في طلبك القادم'
  }
};

let complaints = [];
let campaigns = [];

// --- Socket.io ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register-cashier', () => {
    socket.join('cashiers');
    console.log('Cashier registered');
    // Send current WhatsApp status
    const status = whatsappService.getStatus();
    socket.emit('whatsapp-status', { status: status.status, qr: status.qr });
  });

  socket.on('register-customer', () => {
    console.log('Customer connected');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- API Routes ---

// WhatsApp Routes
app.get('/api/whatsapp/status', (req, res) => {
  res.json(whatsappService.getStatus());
});

app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    await whatsappService.logout();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Settings Routes
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  // Add auth check here if needed (e.g. require admin)
  const newSettings = req.body;
  settings = { ...settings, ...newSettings };
  res.json({ success: true, settings });
});

// Auth Routes

// Step 1: Register Init (Send Code)
app.post('/api/auth/register-init', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // 1. Check Duplicates
  if (users.find(u => u.email === email || u.phone === phone)) {
    return res.status(400).json({ error: 'المستخدم موجود بالفعل (الهاتف أو البريد الإلكتروني)' });
  }

  // 2. Generate Code & Temp ID
  const code = generateCode();
  const tempId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  
  // 3. Store Temporarily (Expires in 10 mins)
  pendingRegistrations.set(tempId, {
    userData: { name, email, phone, password },
    code,
    expiry: Date.now() + 10 * 60 * 1000
  });

  // 4. Send Code (Default: Email)
  const securityNumber = Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
  await sendEmail(email, 'رمز التحقق - ريحانة', `رمز التحقق الخاص بك هو: ${code}\nرقم الأمان: ${securityNumber}`);

  res.json({ 
    success: true, 
    requiresVerification: true, 
    tempId,
    message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
  });
});

// Step 2: Verify Code & Create User
app.post('/api/auth/register-verify', (req, res) => {
  const { tempId, code } = req.body;

  const pending = pendingRegistrations.get(tempId);
  if (!pending) {
    return res.status(400).json({ error: 'جلسة التسجيل انتهت أو غير صحيحة' });
  }

  if (Date.now() > pending.expiry) {
    pendingRegistrations.delete(tempId);
    return res.status(400).json({ error: 'انتهت صلاحية الرمز' });
  }

  if (pending.code !== code) {
    return res.status(400).json({ error: 'رمز التحقق غير صحيح' });
  }

  // Success: Create User
  const { userData } = pending;
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: 'customer',
    walletBalance: settings.welcomeBonus || 0,
    favorites: [],
    addresses: []
  };

  users.push(newUser);
  pendingRegistrations.delete(tempId);
  
  logActivity('user', `تسجيل مستخدم جديد: ${newUser.name}`, { userId: newUser.id, email: newUser.email });

  res.json({ 
    success: true, 
    user: { ...newUser, password: undefined },
    message: settings.welcomeMessage.replace('{amount}', (settings.welcomeBonus || 0).toLocaleString())
  });
});

// Resend Code (Switch Channel)
app.post('/api/auth/register-resend', async (req, res) => {
  const { tempId, method } = req.body; // method: 'email' or 'whatsapp'
  
  const pending = pendingRegistrations.get(tempId);
  if (!pending) {
    return res.status(400).json({ error: 'جلسة التسجيل غير موجودة' });
  }

  // Keep same code
  const code = pending.code;

  if (method === 'whatsapp') {
    const sent = await sendWhatsApp(pending.userData.phone, `رمز التحقق لتطبيق ريحانة: ${code}`);
    if (sent) {
        res.json({ success: true, message: 'تم إرسال الرمز عبر واتساب' });
    } else {
        res.status(500).json({ error: 'فشل الإرسال عبر واتساب. تأكد من ربط السيرفر بالواتساب.' });
    }
  } else {
    const securityNumber = Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
    await sendEmail(pending.userData.email, 'رمز التحقق - ريحانة', `رمز التحقق الخاص بك هو: ${code}\nرقم الأمان: ${securityNumber}`);
    res.json({ success: true, message: 'تم إعادة إرسال الرمز إلى البريد الإلكتروني' });
  }
});

// Ensure Admin User Exists
const ensureAdmin = () => {
  if (!users.find(u => u.email === 'admin@rehana.com')) {
    users.push({
      id: 'admin-1',
      name: 'مدير النظام',
      email: 'admin@rehana.com',
      password: 'admin',
      role: 'admin',
      phone: '07700000000',
      walletBalance: 0,
      favorites: [],
      addresses: []
    });
    console.log('Default admin user created: admin@rehana.com / admin');
  }
};
ensureAdmin();

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);
  if (user) {
    res.json({ success: true, user: { ...user, password: undefined } });
  } else {
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products/sync', (req, res) => {
  const newProducts = req.body.products;
  if (newProducts) {
    products = newProducts;
    console.log(`Synced ${products.length} products`);
    io.emit('products-updated', products);
    logActivity('product', `مزامنة ${products.length} منتج`);
    res.json({ success: true, count: products.length });
  } else {
    res.status(400).json({ error: 'No products provided' });
  }
});

app.post('/api/products', (req, res) => {
  const product = req.body;
  if (!product.id) product.id = Date.now().toString();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx !== -1) {
    products[idx] = product;
    logActivity('product', `تحديث منتج: ${product.name}`, { productId: product.id });
  } else {
    products.push(product);
    logActivity('product', `إضافة منتج جديد: ${product.name}`, { productId: product.id });
  }
  io.emit('products-updated', products);
  res.json({ success: true, product });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  io.emit('products-updated', products);
  logActivity('product', `حذف منتج ID: ${id}`);
  res.json({ success: true });
});

app.post('/api/orders', (req, res) => {
  const { customerId, total, paymentMethod, useWallet } = req.body;
  let walletPaid = 0;
  let remainingTotal = total;

  if ((useWallet || paymentMethod === 'wallet') && customerId) {
    const userIndex = users.findIndex(u => u.id === customerId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (total > 3000 || paymentMethod === 'wallet') {
         const maxDeduction = Math.min(user.walletBalance, total);
         if (maxDeduction > 0) {
           user.walletBalance -= maxDeduction;
           walletPaid = maxDeduction;
           remainingTotal = total - maxDeduction;
         } else if (paymentMethod === 'wallet') {
            return res.status(400).json({ error: 'رصيد المحفظة غير كافٍ' });
         }
      }
    }
  }

  const newOrder = {
    id: Date.now().toString(),
    customerName: req.body.customerName || 'Customer',
    customerPhone: req.body.customerPhone || '',
    customerId: req.body.customerId || null,
    items: req.body.items || [],
    total: req.body.total || 0,
    walletPaid: walletPaid,
    netTotal: remainingTotal,
    status: 'pending',
    date: req.body.createdAt || req.body.date || new Date().toISOString(),
    paymentMethod: remainingTotal === 0 ? 'wallet' : 'cash'
  };

  orders.unshift(newOrder);
  
  if (req.body.items && Array.isArray(req.body.items)) {
    req.body.items.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.id);
      if (productIndex !== -1) {
        products[productIndex].quantity = (products[productIndex].quantity || 0) - (item.quantity || 1);
      }
    });
    io.emit('products-updated', products);
  }
  
  io.to('cashiers').emit('new-order', newOrder);
  console.log('New order received:', newOrder.id);
  logActivity('order', `طلب جديد بقيمة ${newOrder.total} د.ع`, { orderId: newOrder.id, customerName: newOrder.customerName });
  
  const updatedUser = customerId ? users.find(u => u.id === customerId) : null;
  res.json({ success: true, order: newOrder, user: updatedUser ? { ...updatedUser, password: undefined } : undefined });
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    io.emit('order-status-updated', { id, status });
    logActivity('order', `تحديث حالة الطلب #${id} إلى ${status}`);
    res.json({ success: true, order });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.post('/api/users/:id/wallet', (req, res) => {
  const { id } = req.params;
  const { amount, type } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const val = parseFloat(amount);
    if (isNaN(val)) return res.status(400).json({ error: 'Invalid amount' });
    if (type === 'credit') {
      users[userIndex].walletBalance = (users[userIndex].walletBalance || 0) + val;
    } else if (type === 'debit') {
      users[userIndex].walletBalance = (users[userIndex].walletBalance || 0) - val;
    }
    res.json({ success: true, user: { ...users[userIndex], password: undefined } });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/favorites', (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (!user.favorites) user.favorites = [];
    const favIndex = user.favorites.indexOf(productId);
    if (favIndex === -1) {
      user.favorites.push(productId);
    } else {
      user.favorites.splice(favIndex, 1);
    }
    res.json({ success: true, user: { ...user, password: undefined } });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, password, avatar, phone, email, role, walletBalance } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    if (name) users[userIndex].name = name;
    if (password) users[userIndex].password = password;
    if (avatar) users[userIndex].avatar = avatar;
    if (phone) users[userIndex].phone = phone;
    if (email) users[userIndex].email = email;
    if (role) users[userIndex].role = role;
    if (walletBalance !== undefined) users[userIndex].walletBalance = parseFloat(walletBalance);
    res.json({ success: true, user: { ...users[userIndex], password: undefined } });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users', (req, res) => {
  const { name, email, phone, password, role, walletBalance } = req.body;
  if (users.find(u => (email && u.email === email) || (phone && u.phone === phone))) {
    return res.status(400).json({ error: 'المستخدم موجود بالفعل (الهاتف أو البريد الإلكتروني)' });
  }
  const newUser = {
    id: Date.now().toString(),
    name: name || 'New User',
    email: email || '',
    phone: phone || '',
    password: password || '123456',
    role: role || 'customer',
    walletBalance: walletBalance || 0,
    favorites: [],
    addresses: []
  };
  users.push(newUser);
  res.json({ success: true, user: { ...newUser, password: undefined } });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/users/:id/addresses', (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (user) {
    res.json({ success: true, addresses: user.addresses || [] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/api/users/:id/addresses', (req, res) => {
  const { id } = req.params;
  const { name, phone, address, location } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (!user.addresses) user.addresses = [];
    const newAddress = {
      id: Date.now().toString(),
      name,
      phone,
      address,
      location,
      isDefault: user.addresses.length === 0
    };
    user.addresses.push(newAddress);
    res.json({ success: true, user: { ...user, password: undefined }, address: newAddress });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/api/users/:id/addresses/:addressId', (req, res) => {
  const { id, addressId } = req.params;
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (user.addresses) {
      user.addresses = user.addresses.filter(a => a.id !== addressId);
    }
    res.json({ success: true, user: { ...user, password: undefined } });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  settings = { ...settings, ...newSettings };
  io.emit('settings-updated', settings);
  logActivity('settings', 'تم تحديث الإعدادات');
  res.json({ success: true, settings });
});

app.post('/api/complaints', (req, res) => {
  const { userId, name, phone, email, subject, message, type } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'الرسالة مطلوبة' });
  }
  const newComplaint = {
    id: Date.now().toString(),
    userId: userId || 'guest',
    name: name || 'Guest',
    phone: phone || '',
    email: email || '',
    subject: subject || 'General',
    type: type || 'complaint', // complaint or suggestion
    message,
    status: 'pending',
    replies: [],
    createdAt: new Date().toISOString()
  };
  complaints.push(newComplaint);
  console.log('New complaint received:', newComplaint);
  logActivity('system', `${type === 'suggestion' ? 'اقتراح' : 'شكوى'} جديدة من ${newComplaint.name}`, { complaintId: newComplaint.id });
  res.json({ success: true, complaint: newComplaint });
});

app.get('/api/complaints', (req, res) => {
    res.json(complaints);
});

app.post('/api/complaints/:id/reply', (req, res) => {
    const { id } = req.params;
    const { message, by } = req.body;
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
        complaint.status = 'replied';
        complaint.replies.push({
            id: Date.now().toString(),
            message,
            by: by || 'Admin',
            createdAt: new Date().toISOString()
        });
        
        // If user is registered, maybe notify them via socket?
        // Simple implementation: just save it, client pulls it.
        
        res.json({ success: true, complaint });
    } else {
        res.status(404).json({ error: 'Complaint not found' });
    }
});

app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

app.post('/api/campaigns', (req, res) => {
  const { title, message, amount, type, targetType, targetConfig } = req.body;
  const newCampaign = {
    id: Date.now().toString(),
    title: title || 'New Reward',
    message: message || '',
    amount: parseFloat(amount) || 0,
    type: type || (parseFloat(amount) > 0 ? 'reward' : 'message'),
    targetType: targetType || 'all',
    targetConfig: targetConfig || {},
    status: 'draft',
    sentAt: null,
    beneficiariesCount: 0,
    createdAt: new Date().toISOString()
  };
  campaigns.unshift(newCampaign);
  logActivity('campaign', `إنشاء حملة جديدة: ${newCampaign.title}`, { campaignId: newCampaign.id });
  res.json({ success: true, campaign: newCampaign });
});

app.put('/api/campaigns/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const idx = campaigns.findIndex(c => c.id === id);
  if (idx !== -1) {
    campaigns[idx] = { ...campaigns[idx], ...updates };
    res.json({ success: true, campaign: campaigns[idx] });
  } else {
    res.status(404).json({ error: 'Campaign not found' });
  }
});

app.delete('/api/campaigns/:id', (req, res) => {
  const { id } = req.params;
  campaigns = campaigns.filter(c => c.id !== id);
  res.json({ success: true });
});

app.post('/api/campaigns/:id/send', async (req, res) => {
  const { id } = req.params;
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  let targetUsers = [];
  const allCustomers = users.filter(u => u.role === 'customer');

  if (campaign.targetType === 'all') {
    targetUsers = allCustomers;
  } else if (campaign.targetType === 'specific') {
    const ids = campaign.targetConfig.userIds || [];
    targetUsers = allCustomers.filter(u => ids.includes(u.id));
  } else if (campaign.targetType === 'most_active' || campaign.targetType === 'least_active') {
    const userOrderCounts = {};
    orders.forEach(o => {
      if (o.customerId) {
        userOrderCounts[o.customerId] = (userOrderCounts[o.customerId] || 0) + 1;
      }
    });
    const usersWithCounts = allCustomers.map(u => ({
      ...u,
      orderCount: userOrderCounts[u.id] || 0
    }));
    if (campaign.targetType === 'most_active') {
      usersWithCounts.sort((a, b) => b.orderCount - a.orderCount);
    } else {
      usersWithCounts.sort((a, b) => a.orderCount - b.orderCount);
    }
    const limit = campaign.targetConfig.limit || 10;
    targetUsers = usersWithCounts.slice(0, limit);
  }

  let count = 0;
  for (const user of targetUsers) {
    // Update wallet only if amount > 0
    if (campaign.amount > 0) {
      user.walletBalance = (user.walletBalance || 0) + campaign.amount;
    }
    
    // Send WhatsApp if enabled and connected
    if (whatsappService.status === 'connected' && user.phone) {
       let msg = `${campaign.title}\n${campaign.message}`;
       if (campaign.amount > 0) {
           msg += `\n\nتم إضافة ${campaign.amount} د.ع إلى محفظتك!`;
       }
       await sendWhatsApp(user.phone, msg);
    }
    count++;
  }

  campaign.status = 'sent';
  campaign.sentAt = new Date().toISOString();
  campaign.beneficiariesCount = count;

  logActivity('campaign', `تنفيذ حملة: ${campaign.title} (المستفيدين: ${count})`, { campaignId: campaign.id });

  res.json({ success: true, campaign, count });
});

app.get('/api/logs', (req, res) => {
  res.json(activityLogs);
});

// Catch-all route to serve Frontend
app.get(/^(?!\/api).+/, (req, res) => {
  // Serve index.html only for HTML requests (SPA navigation)
  // Return 404 for missing assets (images, js, css)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).send('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
