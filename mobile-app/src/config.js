import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
console.log('Platform Check:', { isNative, hostname: window.location.hostname });

// Server Configuration
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const SERVER_URL = isNative
  ? 'https://rehanaforflowers.com'
  : (isLocalhost ? 'http://localhost:3001' : '');
