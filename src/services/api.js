// Mock API Service
import axios from 'axios';

const isElectron = !!(window.process && window.process.versions && window.process.versions.electron);
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const api = axios.create({
  baseURL: (isElectron || isLocalhost) ? 'http://localhost:3001/api' : '/api',
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
