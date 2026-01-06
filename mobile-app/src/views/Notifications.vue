<template>
  <div class="pt-24 px-4 pb-32">
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-600 hover:text-primary-600">
        <ArrowRight class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-black text-gray-900">الإشعارات</h1>
    </div>

    <div class="space-y-4">
      <div v-if="notifications.length === 0" class="text-center py-10 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BellOff class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="font-bold text-gray-900 mb-2">لا توجد إشعارات</h3>
        <p class="text-gray-500 text-sm">لم تتلق أي إشعارات حتى الآن</p>
      </div>

      <div v-for="notification in notifications" :key="notification.id" class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" :class="notification.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'">
          <component :is="notification.icon" class="w-6 h-6" />
        </div>
        <div>
          <h4 class="font-bold text-gray-900 mb-1">{{ notification.title }}</h4>
          <p class="text-gray-500 text-sm leading-relaxed">{{ notification.message }}</p>
          <span class="text-xs text-gray-400 mt-2 block">{{ notification.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowRight, Bell, BellOff, CheckCircle, Info } from 'lucide-vue-next'

const notifications = ref([
  // Example data
  // { id: 1, title: 'تم استلام طلبك', message: 'شكراً لك، تم استلام طلبك بنجاح وهو قيد المراجعة.', time: 'منذ ساعة', type: 'success', icon: CheckCircle },
  // { id: 2, title: 'عرض خاص', message: 'خصم 20% على جميع العطور لفترة محدودة!', time: 'منذ يوم', type: 'info', icon: Info },
])
</script>