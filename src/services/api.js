// Mock API Service
import axios from 'axios';

const isElectron = !!(window.process && window.process.versions && window.process.versions.electron);
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const explicitBaseUrl = import.meta?.env?.VITE_API_BASE_URL || window.API_BASE_URL || null;

const resolvedBaseUrl = (() => {
  if (explicitBaseUrl) return explicitBaseUrl;
  if (isElectron || isLocalhost) return 'http://localhost:3001/api';
  return '/api';
})();

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const whatsappApi = {
  getStatus: () => api.get('/whatsapp/status'),
  logout: () => api.post('/whatsapp/logout')
};

export default api;
