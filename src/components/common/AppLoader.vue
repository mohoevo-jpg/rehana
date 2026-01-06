<template>
  <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean
});
</script>
