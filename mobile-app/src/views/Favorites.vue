<template>
  <div class="pb-24 space-y-6 animate-fade-in p-4">
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Heart class="w-6 h-6 text-red-500 fill-red-500" />
        المفضلة
      </h1>
      <span class="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-bold">{{ favoriteProducts.length }} منتج</span>
    </div>

    <div v-if="favoriteProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Heart class="w-10 h-10 text-gray-300" />
      </div>
      <h3 class="font-bold text-gray-900 text-lg mb-2">قائمة المفضلة فارغة</h3>
      <p class="text-gray-500 text-sm max-w-xs mx-auto">اضغط على رمز القلب ❤️ بجانب المنتجات لإضافتها هنا والوصول إليها بسرعة</p>
      <router-link to="/" class="mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors">
        تصفح المنتجات
      </router-link>
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="product in favoriteProducts" :key="product.id" @click="openProductModal(product)" class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col group relative overflow-hidden transition-all hover:shadow-md cursor-pointer">
        <!-- Out of Stock Overlay -->
        <div v-if="product.isAvailable === false" class="absolute inset-0 bg-white/40 z-10 pointer-events-none"></div>

        <div class="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
            <img 
              v-if="product.images && product.images.length > 0" 
              :src="product.images[0]" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              :class="{'opacity-50': product.isAvailable === false}"
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            />
            <Package 
              v-else
              class="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-300" 
              :class="{'opacity-50': product.isAvailable === false}" 
            />
            
            <button @click.stop="toggleFavorite(product)" class="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors z-20">
              <Heart class="w-4 h-4 fill-current" />
            </button>

            <div v-if="product.isAvailable === false" class="absolute inset-0 flex items-center justify-center bg-gray-100/50 backdrop-blur-[1px]">
              <span class="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-lg shadow-sm">غير متوفر</span>
            </div>
        </div>

        <h3 class="font-bold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]" :class="{'text-gray-400': product.isAvailable === false}">{{ product.name }}</h3>
        
        <!-- Previous Orders Badge -->
        <div v-if="getOrderCount(product.id) > 0" class="mb-2 flex items-center gap-1">
          <span class="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold flex items-center gap-1">
            <ShoppingBag class="w-3 h-3" />
            طلبته {{ getOrderCount(product.id) }} مرة
          </span>
        </div>

        <div class="mt-auto pt-2 flex items-center justify-between relative z-20">
          <p class="text-gray-900 font-black" :class="{'text-gray-400': product.isAvailable === false}">{{ product.price }} <span class="text-[10px] font-normal text-gray-500">د.ع</span></p>
          <button 
            @click.stop="addToCart(product)"
            :disabled="product.isAvailable === false"
            :class="[product.isAvailable === false ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-90']"
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          >
            <Plus class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Heart, Package, Plus, ShoppingBag } from 'lucide-vue-next'
import { useAppStore } from '../store/app'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const favoriteProducts = computed(() => {
  const favIds = authStore.user?.favorites || []
  return appStore.products.filter(p => favIds.includes(p.id))
})

const toggleFavorite = (product) => {
  authStore.toggleFavorite(product.id)
}

const addToCart = (product) => {
  appStore.addToCart(product)
}

const openProductModal = (product) => {
  // In a real app, this might emit an event or use a global modal store
  // For now, let's just navigate to home with query or something, but Home handles modal internally.
  // Ideally, ProductModal should be a global component.
  // For MVP, we'll just redirect to Home for now or leave it non-clickable for details.
  // Or, we can duplicate the modal logic here, but let's keep it simple.
}

const getOrderCount = (productId) => {
  return appStore.getProductOrderCount(productId)
}
</script>
