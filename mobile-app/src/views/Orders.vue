<template>
  <div class="min-h-screen bg-gray-50 pb-24 animate-fade-in">
    <!-- Header -->
    <div class="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center gap-3">
      <h2 class="text-xl font-bold text-gray-900">طلباتي</h2>
    </div>

    <div v-if="appStore.orders.length === 0" class="flex flex-col items-center justify-center py-20 text-center px-4">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ListOrdered class="w-12 h-12 text-gray-300" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات</h3>
      <p class="text-gray-500 mb-8 max-w-xs">لم تقم بأي طلبات مسبقاً</p>
      <router-link to="/" class="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-transform active:scale-95">
        تسوق الآن
      </router-link>
    </div>

    <div v-else class="p-4 space-y-4">
      <div v-for="order in appStore.orders" :key="order.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <!-- Header -->
        <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
           <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-600">
               <Package class="w-5 h-5" />
             </div>
             <div>
               <h3 class="font-bold text-gray-900 text-sm">طلب #{{ order.id.slice(-6) }}</h3>
               <p class="text-xs text-gray-500">{{ new Date(order.date).toLocaleString('ar-IQ') }}</p>
             </div>
           </div>
           <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <!-- Items -->
        <div class="p-4">
          <div class="space-y-3 mb-4">
            <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between items-center text-sm">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-600">{{ item.quantity }}x</span>
                <span class="text-gray-700 font-medium">{{ item.name }}</span>
              </div>
              <span class="font-bold text-gray-900">{{ item.price * item.quantity }} د.ع</span>
            </div>
          </div>
          
          <div class="border-t border-gray-50 pt-3 flex justify-between items-center">
            <span class="text-gray-500 font-medium">المجموع الكلي</span>
            <span class="text-primary-700 font-black text-lg">{{ order.total }} <span class="text-xs font-normal text-gray-500">د.ع</span></span>
          </div>
        </div>
        
        <!-- Status Steps -->
        <div class="px-4 pb-6 pt-2">
          <div class="relative flex items-center justify-between px-2">
            <!-- Line -->
            <div class="absolute left-2 right-2 top-3 h-1 bg-gray-100 -z-10 rounded-full">
              <div class="h-full bg-primary-600 rounded-full transition-all duration-500" :style="{ width: getProgressWidth(order.status) }"></div>
            </div>
            
            <!-- Steps -->
            <div class="flex flex-col items-center gap-2">
              <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10', ['pending', 'accepted', 'completed'].includes(order.status) ? 'border-primary-600 text-primary-600' : 'border-gray-300 text-gray-300']">
                <Check class="w-3 h-3" v-if="['pending', 'accepted', 'completed'].includes(order.status)" />
              </div>
              <span class="text-[10px] font-bold text-gray-600">تم الاستلام</span>
            </div>
            
            <div class="flex flex-col items-center gap-2">
              <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10', ['accepted', 'completed'].includes(order.status) ? 'border-primary-600 text-primary-600' : 'border-gray-300 text-gray-300']">
                <Check class="w-3 h-3" v-if="['accepted', 'completed'].includes(order.status)" />
              </div>
              <span class="text-[10px] font-bold text-gray-600">قيد التجهيز</span>
            </div>
            
            <div class="flex flex-col items-center gap-2">
              <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10', order.status === 'completed' ? 'border-green-600 text-green-600' : 'border-gray-300 text-gray-300']">
                <Check class="w-3 h-3" v-if="order.status === 'completed'" />
              </div>
              <span class="text-[10px] font-bold text-gray-600">مكتمل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ListOrdered, Package, Check } from 'lucide-vue-next'
import { useAppStore } from '../store/app'

const appStore = useAppStore()

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'بانتظار الموافقة',
    'accepted': 'قيد التجهيز',
    'rejected': 'مرفوض',
    'completed': 'مكتمل'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'accepted': 'bg-blue-100 text-blue-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgressWidth = (status) => {
  if (status === 'completed') return '100%'
  if (status === 'accepted') return '50%'
  return '0%'
}
</script>
