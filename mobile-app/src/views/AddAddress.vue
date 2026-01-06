<template>
  <div class="min-h-screen bg-gray-50 pb-24 animate-fade-in flex flex-col">
    <!-- Header -->
    <div class="bg-white p-4 shadow-sm border-b border-gray-100 flex items-center gap-3 shrink-0">
      <router-link to="/addresses" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
        <ArrowRight class="w-6 h-6" />
      </router-link>
      <h2 class="text-xl font-bold text-gray-900">إضافة عنوان جديد</h2>
    </div>

    <!-- Map Section -->
    <div class="h-[40vh] w-full relative bg-gray-200 shrink-0">
      <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false" @click="onMapClick">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker :lat-lng="markerLatLng"></l-marker>
      </l-map>
      
      <div class="absolute bottom-4 right-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-center text-xs font-medium text-gray-600 shadow-sm z-[1000]">
        اضغط على الخريطة لتحديد موقعك بدقة
      </div>
    </div>

    <!-- Form Section -->
    <div class="flex-1 p-4 bg-white rounded-t-3xl -mt-6 relative z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <form @submit.prevent="saveAddress" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">اسم العنوان (مثال: المنزل، العمل)</label>
          <input type="text" v-model="form.name" required class="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="المنزل">
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
          <input type="tel" v-model="form.phone" required class="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="077...">
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">تفاصيل العنوان (المنطقة، الشارع، رقم الدار)</label>
          <textarea v-model="form.address" required rows="3" class="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none" placeholder="بغداد، الكرادة، شارع 62..."></textarea>
        </div>

        <button type="submit" :disabled="isSubmitting" class="w-full bg-primary-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4">
          <Check class="w-5 h-5" />
          {{ isSubmitting ? 'جاري الحفظ...' : 'حفظ العنوان' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"

const router = useRouter()
const authStore = useAuthStore()

const zoom = ref(13)
// Baghdad Center
const center = ref([33.3128, 44.3615])
const markerLatLng = ref([33.3128, 44.3615])

const form = ref({
  name: '',
  phone: authStore.user?.phone || '',
  address: ''
})

const isSubmitting = ref(false)

const onMapClick = (e) => {
  markerLatLng.value = [e.latlng.lat, e.latlng.lng]
}

const saveAddress = async () => {
  isSubmitting.value = true
  const success = await authStore.addAddress({
    ...form.value,
    location: {
      lat: markerLatLng.value[0],
      lng: markerLatLng.value[1]
    }
  })
  
  isSubmitting.value = false
  if (success) {
    router.push('/addresses')
  } else {
    alert('حدث خطأ أثناء حفظ العنوان')
  }
}
</script>

<style>
/* Fix Leaflet Z-Index issues */
.leaflet-pane {
  z-index: 1 !important;
}
.leaflet-bottom {
  z-index: 2 !important;
}
</style>
