<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-colors duration-300">
      <router-link to="/profile" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <ArrowRight class="w-6 h-6" />
      </router-link>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">الإعدادات</h2>
    </div>

    <div class="p-4 space-y-6">
      <!-- Profile Picture -->
      <div class="flex flex-col items-center gap-4 py-4">
        <div class="relative group">
          <div class="w-28 h-28 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-4xl font-bold text-primary-600 dark:text-primary-400 overflow-hidden shadow-md border-4 border-white dark:border-gray-700">
             <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" class="w-full h-full object-cover" alt="Profile" />
             <span v-else>{{ userInitials }}</span>
          </div>
          <button @click="triggerFileInput" class="absolute bottom-1 right-1 bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-transform hover:scale-110 active:scale-95">
            <Camera class="w-5 h-5" />
          </button>
          <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" accept="image/*" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">اضغط على الكاميرا لتغيير الصورة</p>
      </div>

      <!-- General Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-2">المعلومات الشخصية</h3>
        
        <!-- Name -->
        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-500 dark:text-gray-400">الاسم الكامل</label>
          <div class="relative">
            <User class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" v-model="name" class="w-full bg-gray-50 dark:bg-gray-700 dark:text-white pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" placeholder="الاسم الكامل">
          </div>
        </div>

        <!-- Update Button -->
        <button @click="updateName" :disabled="isLoading" class="w-full bg-primary-600 text-white p-3 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>

      <!-- Security Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-2">الأمان وكلمة المرور</h3>
        
        <div class="space-y-2">
           <label class="text-xs font-bold text-gray-500 dark:text-gray-400">كلمة المرور الجديدة</label>
           <div class="relative">
             <Lock class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input type="password" v-model="newPassword" class="w-full bg-gray-50 dark:bg-gray-700 dark:text-white pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" placeholder="اتركها فارغة إذا لم ترد التغيير">
           </div>
        </div>

        <button @click="updatePassword" :disabled="isLoading || !newPassword" class="w-full bg-gray-900 dark:bg-gray-700 text-white p-3 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          تحديث كلمة المرور
        </button>
      </div>

      <!-- App Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors duration-300">
        <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-2">إعدادات التطبيق</h3>
        
        <!-- Dark Mode Toggle -->
        <div class="flex items-center justify-between p-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Moon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white text-sm">الوضع الداكن</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">تغيير مظهر التطبيق لللون الأسود</p>
            </div>
          </div>
          
          <button @click="toggleDarkMode" class="w-12 h-6 rounded-full transition-colors relative" :class="isDarkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'">
            <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm" :class="isDarkMode ? 'left-1' : 'right-1'"></span>
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-100 dark:border-red-900/30 space-y-4">
        <h3 class="font-bold text-red-700 dark:text-red-400 text-sm mb-2">منطقة الخطر</h3>
        
        <button @click="deleteAccount" class="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2">
          <Trash2 class="w-5 h-5" />
          حذف الحساب نهائياً
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowRight, User, Lock, Camera, Trash2, Moon } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const name = ref(authStore.user?.name || '')
const newPassword = ref('')
const isLoading = ref(false)
const fileInput = ref(null)
const isDarkMode = ref(false) // In real app, check localStorage or store

const userInitials = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U'
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // For MVP, we save base64 directly. In prod, upload to server and get URL.
      updateAvatar(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const updateAvatar = async (base64Image) => {
  isLoading.value = true
  const success = await authStore.updateProfile({ avatar: base64Image })
  isLoading.value = false
  if (success) alert('تم تحديث الصورة الشخصية بنجاح')
  else alert('حدث خطأ أثناء تحديث الصورة')
}

const updateName = async () => {
  if (!name.value) return
  isLoading.value = true
  const success = await authStore.updateProfile({ name: name.value })
  isLoading.value = false
  if (success) alert('تم تحديث الاسم بنجاح')
  else alert('حدث خطأ أثناء تحديث الاسم')
}

const updatePassword = async () => {
  if (!newPassword.value) return
  isLoading.value = true
  const success = await authStore.updateProfile({ password: newPassword.value })
  isLoading.value = false
  newPassword.value = ''
  if (success) alert('تم تحديث كلمة المرور بنجاح')
  else alert('حدث خطأ أثناء تحديث كلمة المرور')
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const deleteAccount = async () => {
  if (confirm('هل أنت متأكد تماماً؟ سيتم حذف حسابك وجميع بياناتك نهائياً ولا يمكن التراجع عن هذا الإجراء.')) {
    const success = await authStore.deleteAccount()
    if (success) {
      router.push('/login')
    } else {
      alert('حدث خطأ أثناء حذف الحساب')
    }
  }
}

onMounted(() => {
  // Check theme
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>
