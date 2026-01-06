// Mock API Service
import axios from 'axios';

// Detect if running in Electron (user agent check or file protocol)
const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
const isProduction = import.meta.env.PROD;

const api = axios.create({
  // In Electron Prod, backend runs on 3001 (localhost). In Dev, Vite proxies /api.
  baseURL: (isElectron && isProduction) ? 'http://localhost:3001/api' : '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// WhatsApp API
export const whatsappApi = {
  getStatus: () => api.get('/whatsapp/status'),
  logout: () => api.post('/whatsapp/logout')
};

export default api;
