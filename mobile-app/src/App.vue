<template>
  <div class="h-screen w-full bg-gray-100 dark:bg-gray-900 flex justify-center overflow-hidden font-sans text-gray-900 dark:text-gray-100 selection:bg-primary-100 transition-colors duration-300">
    <div id="app-container" class="w-full max-w-md h-full bg-gray-50 dark:bg-gray-900 relative shadow-2xl flex flex-col overflow-hidden transition-colors duration-300">
      <!-- Offline Mode Indicator -->
      <div v-if="!appStore.isConnected" class="absolute top-0 left-0 w-full z-50 bg-red-500 text-white text-xs py-1 text-center font-bold shadow-md">
        المحل الان مغلق سننفذ طلبك عند الساعة العاشرة من صباح الغد
      </div>

      <!-- Update Popup Modal -->
      <div v-if="showUpdatePopup" class="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
          <div class="p-6 text-center flex flex-col items-center">
            <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <RefreshCw class="w-8 h-8 animate-spin-slow" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">تحديث جديد متوفر</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              {{ appStore.settings.updateMessage || 'يرجى تحديث التطبيق للاستمرار في استخدامه والحصول على أحدث المميزات.' }}
            </p>
            
            <button @click="handleUpdate" class="w-full btn-primary py-3 text-base mb-3">
              تحديث الآن
            </button>
            
            <button v-if="!isForceUpdate" @click="showUpdatePopup = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium py-2">
              تجاهل (ليس الآن)
            </button>
          </div>
        </div>
      </div>

      <!-- Announcement Popup Modal -->
      <div v-if="showAnnouncementPopup && !showUpdatePopup" class="absolute inset-0 z-[55] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in relative">
          <button @click="closeAnnouncement" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X class="w-6 h-6" />
          </button>
          
          <div class="p-6 text-center flex flex-col items-center">
            <div class="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-4">
              <AlertTriangle class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ appStore.settings.announcement.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {{ appStore.settings.announcement.message }}
            </p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50">
             <button @click="closeAnnouncement" class="w-full btn-primary py-3">
               حسناً
             </button>
          </div>
        </div>
      </div>

      <!-- Reward Popup Modal -->
      <div v-if="appStore.rewardNotification" class="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in relative">
          <button @click="closeReward" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X class="w-6 h-6" />
          </button>
          
          <div class="p-6 text-center flex flex-col items-center">
            <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 relative overflow-hidden">
              <div class="absolute inset-0 bg-blue-400/20 animate-ping rounded-full"></div>
              <Gift class="w-10 h-10 relative z-10" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">مبروك! 🎉</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {{ appStore.rewardNotification.message }}
            </p>
            <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
              <span class="text-blue-700 dark:text-blue-300 font-bold text-lg">+ {{ (appStore.rewardNotification.amount || 0).toLocaleString() }} د.ع</span>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50">
             <button @click="closeReward" class="w-full btn-primary py-3">
               استلام المكافأة
             </button>
          </div>
        </div>
      </div>

      <!-- Order Status Notification Modal -->
      <div v-if="appStore.statusNotification" class="absolute inset-0 z-[65] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in relative">
          <button @click="closeStatusNotification" class="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X class="w-6 h-6" />
          </button>
          
          <div class="p-6 text-center flex flex-col items-center">
            <!-- Icon Dynamic based on status -->
            <div v-if="appStore.statusNotification.status === 'pending'" class="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 mb-4">
              <Clock class="w-10 h-10" />
            </div>
            <div v-else-if="appStore.statusNotification.status === 'accepted'" class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
              <CheckCircle class="w-10 h-10" />
            </div>
            <div v-else-if="appStore.statusNotification.status === 'delivering' || appStore.statusNotification.status === 'on_way'" class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
              <Truck class="w-10 h-10" />
            </div>
            <div v-else-if="appStore.statusNotification.status === 'completed'" class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <Gift class="w-10 h-10" />
            </div>
            <div v-else-if="appStore.statusNotification.status === 'rejected'" class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <XCircle class="w-10 h-10" />
            </div>
            <div v-else class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 mb-4">
              <Bell class="w-10 h-10" />
            </div>

            <!-- Title & Message -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ 
                appStore.statusNotification.status === 'pending' ? 'طلب قيد المراجعة' :
                appStore.statusNotification.status === 'accepted' ? 'تمت الموافقة' :
                (appStore.statusNotification.status === 'delivering' || appStore.statusNotification.status === 'on_way') ? 'الطلب في الطريق' :
                appStore.statusNotification.status === 'completed' ? 'تم التسليم' :
                appStore.statusNotification.status === 'rejected' ? 'تم الرفض' :
                'تحديث حالة الطلب'
              }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2">
              {{ 
                appStore.statusNotification.status === 'pending' ? 'تم استلام طلبك وهو الآن قيد المراجعة من قبل الإدارة.' :
                appStore.statusNotification.status === 'accepted' ? 'تم قبول طلبك ويجري تحضيره الآن.' :
                (appStore.statusNotification.status === 'delivering' || appStore.statusNotification.status === 'on_way') ? 'طلبك خرج للتوصيل وهو في طريقه إليك.' :
                appStore.statusNotification.status === 'completed' ? 'تم تسليم الطلب بنجاح. شكراً لتسوقك معنا!' :
                appStore.statusNotification.status === 'rejected' ? 'نعتذر، تم رفض طلبك.' :
                'تغيرت حالة طلبك.'
              }}
            </p>
            <p class="text-xs text-gray-400">رقم الطلب: #{{ appStore.statusNotification.id.slice(-6) }}</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700/50">
             <button @click="closeStatusNotification" class="w-full btn-primary py-3">
               حسناً
             </button>
          </div>
        </div>
      </div>

      <!-- Sidebar / Drawer (Absolute over the entire device) -->
      <div v-if="showSidebar" class="absolute inset-0 z-50 flex pointer-events-none h-full">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto" @click="showSidebar = false"></div>
        
        <!-- Drawer Content -->
        <div class="w-[80%] max-w-[300px] bg-white dark:bg-gray-800 h-full relative z-10 shadow-2xl flex flex-col pointer-events-auto animate-slide-right transition-colors duration-300">
          <!-- Sidebar Header -->
          <div class="p-6 bg-primary-600 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div class="relative z-10 flex flex-col items-center text-center">
              <div class="w-20 h-20 bg-white p-1 rounded-full mb-3 shadow-lg">
                 <div class="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                   {{ userInitials }}
                 </div>
              </div>
              <h3 class="font-bold text-lg">{{ authStore.user?.name || 'مستخدم' }}</h3>
              <p class="text-primary-100 text-sm">{{ authStore.user?.phone || 'ضيف' }}</p>
            </div>
          </div>

          <!-- Sidebar Menu -->
          <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <router-link to="/" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Home class="w-5 h-5" />
              <span class="font-medium">الرئيسية</span>
            </router-link>

            <router-link to="/orders" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ListOrdered class="w-5 h-5" />
              <span class="font-medium">طلباتي</span>
            </router-link>

            <router-link to="/profile" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <User class="w-5 h-5" />
              <span class="font-medium">حسابي</span>
            </router-link>

            <div class="my-2 border-t border-gray-100 dark:border-gray-700"></div>

            <router-link to="/wallet" @click="showSidebar = false" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Wallet class="w-5 h-5 text-gray-400" />
              <span class="font-medium">المحفظة ({{ (authStore.user?.walletBalance || 0).toLocaleString() }} د.ع)</span>
            </router-link>

            <router-link to="/favorites" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Heart class="w-5 h-5 text-gray-400" />
              <span class="font-medium">المفضلة</span>
            </router-link>

            <router-link to="/addresses" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <MapPin class="w-5 h-5 text-gray-400" />
              <span class="font-medium">العناوين المحفوظة</span>
            </router-link>

            <div class="my-2 border-t border-gray-100 dark:border-gray-700"></div>

            <router-link to="/settings" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Settings class="w-5 h-5 text-gray-400" />
              <span class="font-medium">الإعدادات</span>
            </router-link>

            <router-link to="/complaints" @click="showSidebar = false" active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400" class="flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Headphones class="w-5 h-5 text-gray-400" />
              <span class="font-medium">الشكاوي والمقترحات</span>
            </router-link>
          </div>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-gray-100 dark:border-gray-700">
            <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <LogOut class="w-5 h-5" />
              تسجيل الخروج
            </button>
            <p class="text-center text-xs text-gray-400 mt-3">الإصدار 1.2.0</p>
          </div>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto relative scroll-smooth no-scrollbar">
        <!-- Header -->
        <header v-if="showNav" class="bg-white dark:bg-gray-800 sticky top-0 z-30 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] shadow-sm transition-colors duration-300">
          <div class="flex justify-between items-center">
            <!-- Menu & Location -->
            <div class="flex items-center gap-3">
               <button @click="showSidebar = true" class="p-2 -mr-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors">
                 <Menu class="w-6 h-6" />
               </button>
               
               <div class="flex flex-col">
                  <span class="text-xs text-gray-400 font-medium mb-0.5">التوصيل إلى</span>
                  <div class="flex items-center gap-1 text-primary-700 dark:text-primary-400 font-bold cursor-pointer">
                    <span>حي الزهور، الموصل</span>
                    <ChevronDown class="w-3 h-3 text-gray-400" />
                  </div>
               </div>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-3">
              <!-- Connection Status (Dot only) -->
              <div :title="appStore.isConnected ? 'متصل' : 'غير متصل'" :class="['w-2 h-2 rounded-full', appStore.isConnected ? 'bg-green-500' : 'bg-red-500']"></div>
  
              <button @click="router.push('/notifications')" class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 relative transition-colors">
                 <Bell class="w-5 h-5" />
                 <span v-if="appStore.statusNotification" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
              </button>
            </div>
          </div>
        </header>
  
        <!-- Main Content -->
        <main class="min-h-full pb-24">
          <router-view></router-view>
        </main>
      </div>

      <!-- Bottom Navigation (Absolute bottom of device) -->
      <nav v-if="showNav && !isAdmin" class="absolute bottom-6 left-0 right-0 mx-auto w-full px-4 z-30 pointer-events-none">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-gray-700/50 flex justify-around items-center h-16 px-2 pointer-events-auto transition-colors duration-300">
          
          <router-link to="/" custom v-slot="{ isActive, href, navigate }">
            <a :href="href" @click="navigate" class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300" :class="isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
              <Home class="w-6 h-6" :class="{ 'fill-current': isActive }" />
            </a>
          </router-link>
          
          <router-link to="/orders" custom v-slot="{ isActive, href, navigate }">
            <a :href="href" @click="navigate" class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300" :class="isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
              <ListOrdered class="w-6 h-6" :class="{ 'fill-current': isActive }" />
            </a>
          </router-link>

          <!-- Cart (Floating Center) -->
          <router-link to="/cart" custom v-slot="{ isActive, href, navigate }">
            <a :href="href" @click="navigate" class="relative -top-8 group cursor-pointer">
               <div class="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-600/40 ring-4 ring-gray-50 dark:ring-gray-900 transition-transform duration-300 hover:scale-105 active:scale-95" :class="{ 'scale-110': isActive }">
                 <ShoppingCart class="w-6 h-6" />
                 <span v-if="appStore.cartCount > 0" class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
                   {{ appStore.cartCount }}
                 </span>
               </div>
            </a>
          </router-link>
          
          <router-link to="/favorites" custom v-slot="{ isActive, href, navigate }">
            <a :href="href" @click="navigate" class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300" :class="isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
              <Heart class="w-6 h-6" :class="{ 'fill-current': isActive }" />
            </a>
          </router-link>

          <router-link to="/profile" custom v-slot="{ isActive, href, navigate }">
            <a :href="href" @click="navigate" class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300" :class="isActive ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'">
              <User class="w-6 h-6" :class="{ 'fill-current': isActive }" />
            </a>
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, ShoppingCart, ListOrdered, MapPin, ChevronDown, Bell, User, Heart, Menu, Wallet, Settings, Headphones, LogOut, RefreshCw, X, AlertTriangle, Gift, Clock, CheckCircle, Truck } from 'lucide-vue-next'
import { useAppStore } from './store/app'
import { useAuthStore } from './store/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const showSidebar = ref(false)

// Splash Logic
const showSplash = ref(true)
const startSplashFadeOut = ref(false)

const showNav = computed(() => {
  return route.name !== 'Login' && !route.path.startsWith('/admin')
})
const isAdmin = computed(() => authStore.isAdmin)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.charAt(0).toUpperCase()
})

const goToAddresses = () => {
  console.log('DEBUG: Manually navigating to addresses')
  showSidebar.value = false
  router.push('/addresses').catch(err => {
    console.error('DEBUG: Navigation error:', err)
    alert('Navigation Error: ' + err.message)
  })
}

const handleLogout = () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    authStore.logout()
    showSidebar.value = false
    router.push('/login')
  }
}

// App Version Logic
const CURRENT_VERSION = '1.1.0'; // Hardcoded current app version

// Update Popup Logic
const showUpdatePopup = ref(false);
const isForceUpdate = ref(false);
const showAnnouncementPopup = ref(false);

const checkVersion = () => {
  const settings = appStore.settings;
  if (!settings) return;

  const minVersion = settings.minAppVersion || '1.0.0';
  const latestVersion = settings.latestAppVersion || '1.0.0';

  // Simple version comparison (assumes x.y.z format)
  const isOutdated = (current, target) => {
    const c = current.split('.').map(Number);
    const t = target.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if (c[i] < t[i]) return true;
      if (c[i] > t[i]) return false;
    }
    return false;
  };

  if (isOutdated(CURRENT_VERSION, minVersion)) {
    isForceUpdate.value = true;
    showUpdatePopup.value = true;
  } else if (isOutdated(CURRENT_VERSION, latestVersion)) {
    isForceUpdate.value = false;
    showUpdatePopup.value = true; // Optional update
  } else {
    showUpdatePopup.value = false;
  }

  // Announcement Logic
  if (settings.announcement?.active) {
    // Ideally check if already seen in localStorage, but for now show every session or simplified
    const seenAnnouncement = sessionStorage.getItem('seenAnnouncement_' + settings.announcement.title);
    if (!seenAnnouncement) {
      showAnnouncementPopup.value = true;
    }
  }
};

const handleUpdate = () => {
  if (appStore.settings.updateUrl) {
    window.location.href = appStore.settings.updateUrl;
  } else {
    alert('رابط التحديث غير متوفر حالياً');
  }
};

const closeAnnouncement = () => {
  showAnnouncementPopup.value = false;
  if (appStore.settings.announcement?.title) {
    sessionStorage.setItem('seenAnnouncement_' + appStore.settings.announcement.title, 'true');
  }
};

const closeReward = () => {
  appStore.rewardNotification = null;
};

onMounted(async () => {
  appStore.initSocket()
  await appStore.fetchSettings();
  checkVersion();
  
  // Watch for settings changes (real-time updates)
  watch(() => appStore.settings, () => {
    checkVersion();
  }, { deep: true });
})
</script>

<style>
/* Global Styles */
body {
  background-color: #f9fafb;
  font-family: 'Tajawal', sans-serif;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
