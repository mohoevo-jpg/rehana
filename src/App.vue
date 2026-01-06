<template>
  <div class="min-h-screen relative">
    <!-- Offline/Sync Banner -->
    <div v-if="isOffline || salesStore.pendingSyncCount > 0" 
         class="bg-red-500 text-white px-4 py-2 text-center text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 z-50 relative"
         :class="{'bg-yellow-500': !isOffline && salesStore.pendingSyncCount > 0}">
      <span v-if="isOffline">🚫 وضع عدم الاتصال (Offline Mode) - يتم حفظ الطلبات محلياً</span>
      <span v-else>🔄 جاري مزامنة {{ salesStore.pendingSyncCount }} طلبات مع السيرفر الرئيسي...</span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, onUnmounted } from 'vue';
import { useSettingsStore } from './store/settings';
import { useOnlineOrdersStore } from './store/onlineOrders';
import { useSalesStore } from './store/sales';
import { useAuthStore } from './store/auth';
import { useI18n } from 'vue-i18n';

const settingsStore = useSettingsStore();
const onlineOrdersStore = useOnlineOrdersStore();
const salesStore = useSalesStore();
const authStore = useAuthStore();
const { locale } = useI18n();

const isOffline = ref(!navigator.onLine);

const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine;
  if (navigator.onLine) {
    salesStore.syncOfflineSales();
  }
};

// Apply theme on initial load
  onMounted(() => {
    settingsStore.applyPrimaryColor(settingsStore.primaryColor);
    locale.value = settingsStore.language;
    updateDirection(settingsStore.language);
    applyTheme(settingsStore.theme);
    
    // Initialize Socket.io
    onlineOrdersStore.initSocket();

    // Refresh user data (permissions)
    authStore.refreshUser();

    // Network Listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial Sync Check
    if (navigator.onLine) {
      salesStore.syncOfflineSales();
    }
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  });
  
  // Watch for external changes
  watch(() => settingsStore.theme, (newTheme) => {
    applyTheme(newTheme);
  });
  
  watch(() => settingsStore.primaryColor, (newColor) => {
    settingsStore.applyPrimaryColor(newColor);
  });
  
  watch(() => settingsStore.language, (newLang) => {
    locale.value = newLang;
    updateDirection(newLang);
  });
  
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const updateDirection = (lang) => {
  document.documentElement.dir = lang === 'ar' || lang === 'ku' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};
</script>

<style>
/* Global styles if needed */
</style>
