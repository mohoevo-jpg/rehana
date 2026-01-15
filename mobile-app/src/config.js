import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
console.log('Platform Check:', { isNative, hostname: window.location.hostname });

export const SERVER_URL = isNative
  ? 'https://rehanaforflowers.com'
  : '';
