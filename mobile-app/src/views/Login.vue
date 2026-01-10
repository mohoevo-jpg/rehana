<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-gray-50 rounded-b-[3rem] z-0"></div>

    <!-- Back Button -->
    <router-link to="/" class="absolute top-14 left-6 z-50 p-3 bg-white rounded-full text-gray-900 hover:bg-gray-50 transition-colors shadow-lg border border-gray-200">
      <ArrowLeft class="w-6 h-6" />
    </router-link>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center">
        <div class="bg-white rounded-2xl p-4 shadow-xl mb-6">
          <!-- Logo -->
          <img src="/logo.png" alt="Rehana" class="w-20 h-20 object-contain" />
        </div>
      </div>
      <h2 class="text-center text-3xl font-bold text-gray-900 mb-2">
        مرحباً بك في ريحانة
      </h2>
      <p class="text-center text-gray-500 mb-8">
        وجهتك الأولى للتسوق
      </p>
    </div>

    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
      <div class="bg-white py-8 px-6 shadow-2xl rounded-3xl">
        
        <!-- Tabs -->
        <div class="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button 
            @click="activeTab = 'login'" 
            :class="['flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200', activeTab === 'login' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >
            تسجيل دخول
          </button>
          <button 
            @click="activeTab = 'register'" 
            :class="['flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200', activeTab === 'register' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >
            حساب جديد
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف أو البريد الإلكتروني</label>
            <input id="identifier" v-model="loginForm.identifier" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input id="password" v-model="loginForm.password" type="password" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {{ authStore.error }}
          </div>

          <div>
            <button type="submit" :disabled="authStore.isLoading" class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-600/30 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all active:scale-95">
              <span v-if="authStore.isLoading">جاري التحميل...</span>
              <span v-else>تسجيل الدخول</span>
            </button>
          </div>
          
          <div class="relative flex py-2 items-center">
             <div class="flex-grow border-t border-gray-200"></div>
             <span class="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium">أو سجل باستخدام</span>
             <div class="flex-grow border-t border-gray-200"></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
             <button type="button" @click="handleSocialLogin('google')" class="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
                <span class="text-sm font-bold text-gray-700">Google</span>
             </button>
             <button type="button" @click="handleSocialLogin('apple')" class="flex items-center justify-center gap-2 py-3 bg-black text-white border border-black rounded-xl hover:bg-gray-900 transition-colors shadow-sm">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.54-.26-1.07-.48-1.58-.48-.54 0-1.12.24-1.75.52-1.05.46-2.07.46-2.93-.36-1.75-1.68-2.95-4.81-1.22-7.81 1.01-1.75 2.65-2.6 4.35-2.6 1.13 0 2.05.7 2.69.7.6 0 1.64-.78 3.03-.78 1.07 0 2.22.42 2.97 1.39-2.58 1.48-2.14 5.39.56 6.55-.48 1.41-1.18 2.76-2.14 3.73-.25.26-.52.51-.81.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                <span class="text-sm font-bold">Apple</span>
             </button>
          </div>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
            <input v-model="registerForm.name" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input v-model="registerForm.phone" type="tel" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input v-model="registerForm.email" type="email" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input v-model="registerForm.password" type="password" required class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm">
          </div>

          <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {{ authStore.error }}
          </div>

          <div>
            <button type="submit" :disabled="authStore.isLoading" class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-600/30 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all active:scale-95">
              <span v-if="authStore.isLoading">جاري التسجيل...</span>
              <span v-else>إنشاء حساب</span>
            </button>
          </div>
        </form>
      </div>
      
      <p class="mt-8 text-center text-sm text-gray-500">
        &copy; 2024 ريحانة. جميع الحقوق محفوظة
      </p>
    </div>

    <!-- Verification Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">تفعيل الحساب</h3>
          <p class="text-sm text-gray-500 mt-2">
            تم إرسال رمز التفعيل (باركود) إلى بريدك الإلكتروني. الرجاء إدخال الرمز أدناه.
          </p>
        </div>

        <form @submit.prevent="verifyCode" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">رمز التفعيل</label>
            <input 
              v-model="verificationCode" 
              type="text" 
              required 
              class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="123456"
            >
          </div>

          <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {{ authStore.error }}
          </div>

          <button 
            type="submit" 
            :disabled="authStore.isLoading" 
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="authStore.isLoading">جاري التحقق...</span>
            <span v-else>تفعيل الحساب</span>
          </button>
        </form>

        <div class="mt-6 border-t pt-4">
          <p class="text-xs text-center text-gray-500 mb-3">لم يصلك الرمز؟</p>
          <div class="flex gap-2">
            <button 
              @click="resendCode('email')" 
              type="button"
              class="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              إعادة إرسال للإيميل
            </button>
            <button 
              @click="resendCode('whatsapp')" 
              type="button"
              class="flex-1 py-2 px-3 border border-green-200 bg-green-50 rounded-lg text-xs font-medium text-green-700 hover:bg-green-100 focus:outline-none flex items-center justify-center gap-1"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              أرسل لي واتساب
            </button>
          </div>
          <button 
            @click="showVerificationModal = false" 
            type="button"
            class="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('login')
const loginForm = ref({ identifier: '', password: '' })
const registerForm = ref({ name: '', phone: '', email: '', password: '' })
const showVerificationModal = ref(false)
const verificationCode = ref('')
const tempRegistrationId = ref(null)

const handleLogin = async () => {
  const success = await authStore.login(loginForm.value)
  if (success) {
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }
}

const handleSocialLogin = async (provider) => {
  const result = await authStore.socialLogin(provider)
  if (result.success) {
    router.push('/')
  }
}

const handleRegister = async () => {
  const result = await authStore.registerInit(registerForm.value)
  if (result.success) {
    tempRegistrationId.value = result.tempId
    showVerificationModal.value = true
  } else {
    // Error is already handled in store/auth.js and set to authStore.error
    // But we can show alert if needed
  }
}

const verifyCode = async () => {
  if (!verificationCode.value) return
  
  if (!tempRegistrationId.value) {
    alert('حدث خطأ: جلسة التسجيل انتهت. يرجى المحاولة مرة أخرى.')
    showVerificationModal.value = false
    return
  }

  const result = await authStore.registerVerify(tempRegistrationId.value, verificationCode.value)
  if (result.success) {
    showVerificationModal.value = false
    alert('تم إنشاء الحساب وتفعيله بنجاح!\nحصلت على رصيد ترحيبي بقيمة 3,000 د.ع')
    router.push('/')
  }
}

const resendCode = async (method) => {
  if (!tempRegistrationId.value) {
    alert('جلسة التسجيل انتهت. يرجى إعادة تعبئة البيانات.')
    showVerificationModal.value = false
    return
  }
  const result = await authStore.registerResend(tempRegistrationId.value, method)
  if (result.success) {
    alert(result.message || 'تم إرسال الرمز بنجاح')
  } else {
    alert(result.error || 'حدث خطأ أثناء إرسال الرمز')
  }
}
</script>
