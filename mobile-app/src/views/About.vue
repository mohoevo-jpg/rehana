<template>
  <div class="pb-20 pt-6 px-4 space-y-6 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-8">
      <button @click="$router.back()" class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700">
        <ArrowRight class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-black text-gray-900">عن التطبيق</h1>
    </div>

    <!-- Logo & Description -->
    <div class="bg-white rounded-3xl p-8 shadow-sm text-center">
      <div class="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <img src="/logo.png" class="w-16 h-16 object-contain" />
      </div>
      <h2 class="text-2xl font-black text-gray-900 mb-2">ريحانة</h2>
      <p class="text-primary-600 font-bold mb-6">وجهتك الأولى للتسوق</p>
      
      <div class="text-gray-600 leading-relaxed text-sm mb-6">
        محل ريحانة اول محل للورود في مدينة الموصل.
        نقدم لكم أجمل باقات الورود والهدايا المميزة لتشاركوا أحبابكم أجمل اللحظات.
      </div>
    </div>

    <!-- Social Media Links -->
    <div class="space-y-3">
      <h3 class="font-bold text-gray-900 px-2">تواصل معنا</h3>
      
      <a v-if="settings.facebookUrl" :href="settings.facebookUrl" target="_blank" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Facebook class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700">فيسبوك</span>
        <ChevronLeft class="w-5 h-5 text-gray-400 mr-auto" />
      </a>

      <a v-if="settings.instagramUrl" :href="settings.instagramUrl" target="_blank" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="w-10 h-10 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
          <Instagram class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700">انستغرام</span>
        <ChevronLeft class="w-5 h-5 text-gray-400 mr-auto" />
      </a>

      <a v-if="settings.tiktokUrl" :href="settings.tiktokUrl" target="_blank" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="w-10 h-10 bg-gray-50 text-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
          <Music2 class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700">تيك توك</span>
        <ChevronLeft class="w-5 h-5 text-gray-400 mr-auto" />
      </a>

      <a v-if="settings.email" :href="'mailto:' + settings.email" class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group">
        <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
          <Mail class="w-5 h-5" />
        </div>
        <span class="font-bold text-gray-700">البريد الإلكتروني</span>
        <ChevronLeft class="w-5 h-5 text-gray-400 mr-auto" />
      </a>
    </div>

    <!-- App Version -->
    <div class="text-center pt-8 pb-4 text-gray-400 text-xs">
      الإصدار 1.2.0
    </div>
  </div>
</template>

<script setup>
import { ArrowRight, Facebook, Instagram, Mail, ChevronLeft, Music2 } from 'lucide-vue-next'
import logo from '@/assets/logo.png'
import { useAppStore } from '../store/app'
import { computed } from 'vue'

const appStore = useAppStore()
const settings = computed(() => appStore.settings || {})
</script>
