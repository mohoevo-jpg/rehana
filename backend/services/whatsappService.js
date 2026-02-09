const qrcode = require('qrcode');
const axios = require('axios');

class WhatsAppService {
  constructor(io) {
    this.io = io;
    this.client = null;
    this.qr = null;
    this.status = 'disconnected'; // disconnected, scanning, connected
    this.provider = process.env.WHATSAPP_PROVIDER || 'local'; // 'local', 'meta', 'ultramsg'
    
    // Meta API Config
    this.metaConfig = {
      token: process.env.META_WA_TOKEN,
      phoneId: process.env.META_PHONE_ID,
      version: 'v17.0'
    };
  }

  initialize() {
    if (this.provider === 'local') {
      this.initLocalClient();
    } else {
      console.log(`WhatsApp Service initialized with provider: ${this.provider}`);
      this.status = 'connected'; // Assume connected for API providers
    }
  }

  initLocalClient() {
    try {
      // Lazy load whatsapp-web.js to prevent crashes if it fails to load in some environments
      const { Client, LocalAuth } = require('whatsapp-web.js');
      
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.client.on('qr', (qr) => {
        console.log('WhatsApp QR Generated');
        qrcode.toDataURL(qr, (err, url) => {
          this.qr = url;
          this.status = 'scanning';
          this.broadcastStatus();
        });
      });

      this.client.on('ready', () => {
        console.log('WhatsApp Client is ready!');
        this.status = 'connected';
        this.qr = null;
        this.broadcastStatus();
      });

      this.client.on('authenticated', () => {
        console.log('WhatsApp Authenticated');
        this.status = 'connected';
        this.broadcastStatus();
      });

      this.client.on('auth_failure', (msg) => {
        console.error('WhatsApp Auth Failure', msg);
        this.status = 'disconnected';
        this.broadcastStatus();
      });

      this.client.on('disconnected', (reason) => {
        console.log('WhatsApp Disconnected', reason);
        this.status = 'disconnected';
        this.client.destroy();
        this.client.initialize();
        this.broadcastStatus();
      });

      this.client.initialize();
    } catch (err) {
      console.error('Failed to initialize WhatsApp client:', err);
    }
  }

  broadcastStatus() {
    if (this.io) {
      this.io.emit('whatsapp-status', { status: this.status, qr: this.qr });
    }
  }

  getStatus() {
    return { status: this.status, qr: this.qr };
  }

  async logout() {
    if (this.provider === 'local' && this.client) {
      await this.client.logout();
    }
    this.status = 'disconnected';
    this.broadcastStatus();
  }

  async send(phone, message) {
    if (this.provider === 'local') {
      return this.sendLocal(phone, message);
    } else if (this.provider === 'meta') {
      return this.sendMeta(phone, message);
    }
    return false;
  }

  async sendLocal(phone, message) {
    if (this.status !== 'connected') {
      console.log('WhatsApp not connected');
      return false;
    }
    try {
      let cleanPhone = this.formatPhone(phone);
      const chatId = cleanPhone + '@c.us';
      await this.client.sendMessage(chatId, message);
      console.log(`WhatsApp sent to ${cleanPhone} (Local)`);
      return true;
    } catch (e) {
      console.error('WhatsApp Local Send Error:', e);
      return false;
    }
  }

  async sendMeta(phone, message) {
    if (!this.metaConfig.token || !this.metaConfig.phoneId) {
      console.error('Meta API Credentials missing');
      return false;
    }
    
    try {
      let cleanPhone = this.formatPhone(phone);
      const url = `https://graph.facebook.com/${this.metaConfig.version}/${this.metaConfig.phoneId}/messages`;
      
      await axios.post(url, {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: message }
      }, {
        headers: {
          'Authorization': `Bearer ${this.metaConfig.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`WhatsApp sent to ${cleanPhone} (Meta API)`);
      return true;
    } catch (e) {
      console.error('Meta API Send Error:', e.response?.data || e.message);
      return false;
    }
  }

  formatPhone(phone) {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    if (!clean.startsWith('964')) clean = '964' + clean; // Default to Iraq
    return clean;
  }
}

module.exports = WhatsAppService;
