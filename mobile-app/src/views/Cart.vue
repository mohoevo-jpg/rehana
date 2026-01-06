<template>
  <div class="min-h-screen bg-gray-50 pb-32 animate-fade-in">
    <!-- Header -->
    <div class="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center gap-3">
       <div class="bg-primary-50 p-2 rounded-xl">
         <ShoppingCart class="w-6 h-6 text-primary-600" />
       </div>
       <div>
         <h2 class="text-lg font-bold text-gray-900">سلة المشتريات</h2>
         <p class="text-xs text-gray-500">{{ appStore.cart.length }} منتجات</p>
       </div>
    </div>

    <div v-if="appStore.cart.length === 0" class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart class="w-12 h-12 text-gray-300" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">سلتك فارغة</h3>
      <p class="text-gray-500 mb-8 max-w-xs">تصفح المنتجات وأضف ما يعجبك إلى السلة</p>
      <router-link to="/" class="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-transform active:scale-95">
        تسوق الآن
      </router-link>
    </div>

    <div v-else class="p-4 space-y-4">
      <!-- Cart Items -->
      <div v-for="item in appStore.cart" :key="item.id" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md">
        <div class="bg-gray-50 rounded-xl w-24 h-24 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img v-if="item.images && item.images.length > 0" :src="item.images[0]" class="w-full h-full object-cover" crossorigin="anonymous" referrerpolicy="no-referrer">
          <Package v-else class="w-10 h-10 text-gray-300" />
        </div>
        
        <div class="flex-1 flex flex-col justify-between py-1">
          <div>
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-gray-900 line-clamp-2 text-sm mb-1">{{ item.name }}</h3>
              <button @click="appStore.removeFromCart(item.id)" class="text-gray-400 hover:text-red-500 p-1 -mt-1 -ml-1">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <p class="text-primary-700 font-bold text-lg">{{ item.price * item.quantity }} <span class="text-xs font-normal text-gray-500">د.ع</span></p>
          </div>
          
          <div class="flex items-center gap-4 bg-gray-50 w-max rounded-lg p-1">
            <button 
              @click="appStore.updateQuantity(item.id, item.quantity - 1)" 
              class="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary-600 active:scale-90 transition-transform"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="font-bold text-gray-900 w-4 text-center text-sm">{{ item.quantity }}</span>
            <button 
              @click="appStore.updateQuantity(item.id, item.quantity + 1)" 
              class="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary-600 active:scale-90 transition-transform"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Checkout Form (Only for Logged In Users) -->
      <div v-if="authStore.isAuthenticated">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 mt-6">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <User class="w-5 h-5 text-primary-600" />
            معلومات التوصيل
          </h3>
          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-500 mb-1 block">الاسم الكامل</label>
              <input type="text" v-model="appStore.customerName" class="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm font-medium" placeholder="أدخل اسمك">
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 mb-1 block">رقم الهاتف</label>
              <input type="tel" v-model="appStore.customerPhone" class="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm font-medium" placeholder="07xxxxxxxxx">
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 mt-4">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <CreditCard class="w-5 h-5 text-primary-600" />
            طريقة الدفع
          </h3>
          
          <!-- Wallet Usage -->
          <div v-if="authStore.user" class="border rounded-xl p-3" :class="canUseWallet ? 'border-primary-200 bg-primary-50/50' : 'border-gray-100 bg-gray-50 opacity-75'">
            <div class="flex items-center justify-between mb-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="useWallet" :disabled="!canUseWallet" class="rounded text-primary-600 focus:ring-primary-500 w-5 h-5">
                <span class="font-bold text-gray-700">استخدام رصيد المحفظة</span>
              </label>
              <span class="text-sm font-bold text-primary-700">{{ (authStore.user.walletBalance || 0).toLocaleString() }} د.ع</span>
            </div>
            <p class="text-xs text-gray-500 mr-7" v-if="!canUseWallet">
              متاح فقط للطلبات التي تزيد عن 3,000 د.ع
            </p>
            <p class="text-xs text-primary-600 mr-7" v-else-if="useWallet">
              سيتم خصم {{ walletDiscount.toLocaleString() }} د.ع من المجموع
            </p>
          </div>
          
          <div class="flex gap-3 mt-3">
             <div class="flex-1 p-3 border-2 border-primary-100 bg-primary-50/30 rounded-xl flex items-center gap-3 cursor-pointer">
               <div class="w-5 h-5 rounded-full border-4 border-primary-600"></div>
               <span class="font-bold text-sm text-gray-700">دفع عند الاستلام</span>
             </div>
          </div>
        </div>
      </div>

      <!-- Login Prompt (For Guest Users) -->
      <div v-else class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6 text-center">
        <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User class="w-8 h-8 text-primary-600" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">تسجيل الدخول مطلوب</h3>
        <p class="text-gray-500 mb-6 text-sm">يجب عليك تسجيل الدخول أو إنشاء حساب لإكمال الطلب</p>
        <router-link :to="{ name: 'Login', query: { redirect: '/cart' } }" class="block w-full py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-transform active:scale-95">
          تسجيل الدخول / إنشاء حساب
        </router-link>
      </div>
    </div>

    <!-- Sticky Bottom Summary -->
    <div v-if="appStore.cart.length > 0" class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.1)] p-3 rounded-t-2xl z-40 pb-safe">
      <div class="space-y-1 mb-3 px-1">
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>المجموع</span>
          <span>{{ appStore.cartTotal.toLocaleString() }} د.ع</span>
        </div>
        <div v-if="useWallet && walletDiscount > 0" class="flex justify-between items-center text-sm text-primary-600 font-bold">
          <span>خصم المحفظة</span>
          <span>-{{ walletDiscount.toLocaleString() }} د.ع</span>
        </div>
        <div class="flex justify-between items-center border-t pt-2 mt-2">
          <span class="text-gray-900 font-bold">المطلوب دفعه</span>
          <span class="text-xl font-black text-gray-900">{{ netTotal.toLocaleString() }} <span class="text-sm font-normal text-gray-500">د.ع</span></span>
        </div>
      </div>
      
      <!-- Submit Button (Disabled if not logged in) -->
      <button 
        @click="submitOrder"
        :disabled="isSubmitting || !authStore.isAuthenticated"
        class="w-full bg-primary-600 text-white py-3 rounded-xl font-bold text-base hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
      >
        <span v-if="isSubmitting">جاري الإرسال...</span>
        <span v-else-if="!authStore.isAuthenticated">يرجى تسجيل الدخول</span>
        <span v-else>تأكيد الطلب</span>
        <ArrowLeft class="w-5 h-5" v-if="!isSubmitting && authStore.isAuthenticated" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Package, Plus, Minus, Trash2, User, ArrowLeft, CreditCard } from 'lucide-vue-next'
import { useAppStore } from '../store/app'
import { useAuthStore } from '../store/auth'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()
const isSubmitting = ref(false)
const useWallet = ref(false)

onMounted(() => {
  if (authStore.user) {
    if (!appStore.customerName && authStore.user.name) {
      appStore.customerName = authStore.user.name
    }
    if (!appStore.customerPhone && authStore.user.phone) {
      appStore.customerPhone = authStore.user.phone
    }
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    if (!appStore.customerName && newUser.name) appStore.customerName = newUser.name
    if (!appStore.customerPhone && newUser.phone) appStore.customerPhone = newUser.phone
  }
})

const isValid = computed(() => {
  return appStore.cart.length > 0 && appStore.customerName && appStore.customerPhone
})

const canUseWallet = computed(() => {
  return authStore.user && authStore.user.walletBalance > 0 && appStore.cartTotal >= 3000
})

const walletDiscount = computed(() => {
  if (!useWallet.value || !canUseWallet.value) return 0
  return Math.min(authStore.user.walletBalance, appStore.cartTotal)
})

const netTotal = computed(() => {
  return Math.max(0, appStore.cartTotal - walletDiscount.value)
})

const submitOrder = async () => {
  if (!isValid.value) {
    alert('يرجى إدخال جميع البيانات المطلوبة')
    return
  }

  isSubmitting.value = true
  try {
    const orderData = {
      items: appStore.cart,
      customerName: appStore.customerName,
      customerPhone: appStore.customerPhone,
      total: appStore.cartTotal,
      netTotal: netTotal.value,
      walletDiscount: walletDiscount.value,
      useWallet: useWallet.value
    }

    const success = await appStore.submitOrder(orderData)
    if (success) {
      // Clear cart and redirect
      appStore.clearCart()
      router.push('/orders')
    } else {
      alert('حدث خطأ أثناء إرسال الطلب')
    }
  } catch (error) {
    console.error(error)
    alert('حدث خطأ غير متوقع')
  } finally {
    isSubmitting.value = false
  }
}
</script>