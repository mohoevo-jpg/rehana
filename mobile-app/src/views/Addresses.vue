<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Header -->
    <div class="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <router-link to="/profile" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
          <ArrowRight class="w-6 h-6" />
        </router-link>
        <h2 class="text-xl font-bold text-gray-900">عناويني</h2>
      </div>
      
      <router-link to="/addresses/add" class="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
        <Plus class="w-5 h-5" />
      </router-link>
    </div>

    <div class="p-4 space-y-4">
      <!-- Empty State -->
      <div v-if="!addresses || addresses.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <MapPin class="w-10 h-10 text-blue-300" />
        </div>
        <h3 class="font-bold text-gray-900 text-lg mb-2">لا توجد عناوين محفوظة</h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">أضف عناوينك لتسهيل عملية الطلب والتوصيل</p>
      </div>

      <!-- Address List -->
      <div v-else class="space-y-4">
        <div v-for="address in addresses" :key="address.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
              <MapPin class="w-5 h-5 text-gray-500" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-bold text-gray-900">{{ address.name }}</h3>
                <button @click.prevent="deleteAddress(address.id)" class="text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <p class="text-sm text-gray-600 leading-relaxed mb-2">{{ address.address }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <Phone class="w-3 h-3" />
                <span>{{ address.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Button (Floating Pill - Only when addresses exist) -->
    <div class="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-20" v-if="addresses && addresses.length > 0">
      <router-link to="/addresses/add" class="pointer-events-auto bg-primary-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-transform active:scale-95">
        <Plus class="w-5 h-5" />
        <span>إضافة عنوان</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onErrorCaptured } from 'vue'
import { ArrowRight, MapPin, Plus, Trash2, Phone } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'

console.log('Addresses component script setup executing')

const authStore = useAuthStore()
const error = ref(null)

onErrorCaptured((err) => {
  console.error('Addresses Error Captured:', err)
  error.value = err.message
  return false
})

const addresses = computed(() => {
  try {
    return authStore.user?.addresses || []
  } catch (e) {
    console.error('Error in addresses computed:', e)
    return []
  }
})

const deleteAddress = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
    await authStore.deleteAddress(id)
  }
}

onMounted(() => {
  console.log('Addresses view mounted')
})
</script>
