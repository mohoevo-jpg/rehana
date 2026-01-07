<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Icon -->
    <button 
      @click="toggleDropdown" 
      class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
    >
      <Bell class="w-6 h-6" />
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      <div class="p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 class="font-semibold text-gray-800">الإشعارات</h3>
        <button 
          v-if="unreadCount > 0" 
          @click="markAllAsRead" 
          class="text-xs text-primary-600 hover:text-primary-800 font-medium"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
          <BellOff class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">لا توجد إشعارات جديدة</p>
        </div>

        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer', { 'bg-blue-50/50': !notification.read }]"
          @click="viewDetails(notification)"
        >
          <div class="flex gap-3">
            <div :class="getIconClass(notification.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              <component :is="getIcon(notification.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ notification.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2 border-t border-gray-100 bg-gray-50 text-center">
        <button 
          @click="goToLogs" 
          class="text-sm text-primary-600 hover:text-primary-800 font-medium w-full py-1"
        >
          عرض كل النشاطات
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, BellOff, ShoppingCart, User, Package, Megaphone, Settings, Activity } from 'lucide-vue-next';
import { io } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const router = useRouter();
const isOpen = ref(false);
const notifications = ref([]);
const dropdownRef = ref(null);
const isElectron = !!(window.process && window.process.versions && window.process.versions.electron);
const socketUrl = isElectron ? 'http://localhost:3001' : '';
const socket = io(socketUrl, { path: '/socket.io' });

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

const viewDetails = (notification) => {
  notification.read = true;
  // Navigate based on type if needed, for now just go to logs
  router.push('/activity-logs');
  isOpen.value = false;
};

const goToLogs = () => {
  router.push('/activity-logs');
  isOpen.value = false;
};

const formatTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar });
};

const getIcon = (type) => {
  const icons = {
    order: ShoppingCart,
    user: User,
    product: Package,
    campaign: Megaphone,
    settings: Settings,
    system: Activity
  };
  return icons[type] || Activity;
};

const getIconClass = (type) => {
  const classes = {
    order: 'bg-blue-100 text-blue-600',
    user: 'bg-green-100 text-green-600',
    product: 'bg-purple-100 text-purple-600',
    campaign: 'bg-orange-100 text-orange-600',
    settings: 'bg-gray-200 text-gray-600',
    system: 'bg-red-100 text-red-600'
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  
  socket.on('new-activity', (log) => {
    // Add new notification
    notifications.value.unshift({
      ...log,
      read: false
    });
    
    // Play sound for high priority events (optional)
    if (['order', 'system'].includes(log.type)) {
      // const audio = new Audio('/notification.mp3');
      // audio.play().catch(e => console.log('Audio play failed', e));
    }

    // Keep only last 20 notifications
    if (notifications.value.length > 20) {
      notifications.value = notifications.value.slice(0, 20);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  socket.disconnect();
});
</script>
