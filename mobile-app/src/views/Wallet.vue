<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
        <Wallet class="w-6 h-6" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">محفظتي</h1>
        <p class="text-gray-500 text-sm">إدارة رصيدك ومدفوعاتك</p>
      </div>
    </div>

    <!-- Balance Card -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-600/30 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      <div class="relative z-10">
        <p class="text-primary-100 font-medium mb-1">الرصيد الحالي</p>
        <h2 class="text-4xl font-bold tracking-tight">{{ (authStore.user?.walletBalance || 0).toLocaleString() }} <span class="text-lg opacity-80">د.ع</span></h2>
      </div>
    </div>

    <!-- Actions -->
    <div class="grid grid-cols-2 gap-4">
      <button class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors group">
        <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
          <ArrowDownLeft class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700 text-sm">شحن الرصيد</span>
      </button>
      <button class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors group">
        <div class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
          <History class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700 text-sm">السجل</span>
      </button>
    </div>

    <!-- Transactions History (Placeholder) -->
    <div>
      <h3 class="font-bold text-gray-900 mb-4">آخر العمليات</h3>
      <div class="bg-white rounded-2xl p-8 text-center border border-gray-100">
         <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
           <FileText class="w-8 h-8" />
         </div>
         <p class="text-gray-500 font-medium">لا توجد عمليات سابقة</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { Wallet, ArrowDownLeft, History, FileText } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>
