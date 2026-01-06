<template>
  <div class="flex items-start gap-3 p-3 mb-2 bg-white rounded-lg shadow-sm">
    <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
      {{ message.senderName.charAt(0) }}
    </div>
    <div>
      <div class="flex items-baseline gap-2">
        <span class="font-medium text-sm text-gray-900">{{ message.senderName }}</span>
        <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
      </div>
      <p class="text-sm text-gray-700 mt-1">{{ message.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '../../utils/date';

defineProps({
  message: {
    type: Object,
    required: true
  }
});
</script>
