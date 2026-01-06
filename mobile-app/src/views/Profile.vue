<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-colors duration-300">
      <router-link to="/" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <ArrowRight class="w-6 h-6" />
      </router-link>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">حسابي</h2>
    </div>

    <div class="p-4 space-y-6">
      <!-- Guest Info Card -->
      <div v-if="!authStore.isAuthenticated" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
          <User class="w-8 h-8" />
        </div>
        <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2">أهلاً بك يا ضيف</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">سجل دخولك الآن للاستفادة من كافة المميزات</p>
        <router-link to="/login" class="block w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors">
          تسجيل الدخول / إنشاء حساب
        </router-link>
      </div>

      <!-- User Info Card -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">
        <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
          {{ userInitials }}
        </div>
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white text-lg">{{ authStore.user?.name || 'مستخدم' }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ authStore.user?.phone || authStore.user?.email || 'لا يوجد رقم هاتف' }}</p>
        </div>
      </div>

      <!-- Membership Barcode -->
      <div v-if="authStore.isAuthenticated" class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center space-y-2 transition-colors duration-300">
        <p class="text-sm font-bold text-gray-500 dark:text-gray-400">بطاقة العضوية</p>
        <svg id="membership-barcode" class="w-full max-w-[200px] dark:invert"></svg>
      </div>

      <!-- Settings Sections -->
      <div class="space-y-4">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm px-2">الإعدادات العامة</h3>
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700 transition-colors duration-300">
          
          <router-link v-if="authStore.isAuthenticated" to="/addresses" class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <MapPin class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">عناويني (اضغط للدخول)</span>
            </div>
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </router-link>

          <router-link v-if="authStore.isAuthenticated" to="/settings" class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">
                <Settings class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">تعديل الملف الشخصي</span>
            </div>
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </router-link>

          <button v-if="authStore.isAuthenticated" class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                <Bell class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">الإشعارات</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <ChevronLeft class="w-4 h-4 text-gray-400" />
            </div>
          </button>

          <button class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Globe class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">اللغة</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span>العربية</span>
              <ChevronLeft class="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      <!-- Support Sections -->
      <div class="space-y-4">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm px-2">مركز المساعدة</h3>
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700 transition-colors duration-300">
          <router-link to="/complaints" class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Headphones class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">الشكاوي والمقترحات</span>
            </div>
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </router-link>

          <button class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Info class="w-4 h-4" />
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">عن التطبيق</span>
            </div>
            <ChevronLeft class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Logout Button -->
      <button v-if="authStore.isAuthenticated" @click="handleLogout" class="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors active:scale-95">
        <LogOut class="w-5 h-5" />
        تسجيل الخروج
      </button>

      <div class="text-center text-xs text-gray-400 mt-8">
        الإصدار 1.0.0
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, MapPin, Bell, Globe, Headphones, Info, LogOut, ChevronLeft, Settings, User } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'
import JsBarcode from 'jsbarcode'

const router = useRouter()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'مستخدم'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    try {
      const barcodeValue = authStore.user?.phone || authStore.user?.id || 'GUEST'
      JsBarcode('#membership-barcode', barcodeValue, {
        format: 'CODE128',
        lineColor: '#4b5563',
        width: 2,
        height: 50,
        displayValue: true,
        font: 'Tajawal',
        fontSize: 14,
        background: 'transparent'
      })
    } catch (e) {
      console.error('Barcode generation failed', e)
    }
  }
})

const handleLogout = () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>