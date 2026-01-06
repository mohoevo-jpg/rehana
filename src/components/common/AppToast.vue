<template>
  <div class="fixed bottom-4 right-4 z-50">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="[
          'mb-2 p-4 rounded-lg shadow-lg text-white min-w-[300px] flex items-center justify-between',
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        ]"
      >
        <span>{{ toast.message }}</span>
        <button @click="remove(toast.id)" class="mr-2 opacity-75 hover:opacity-100">x</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const add = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => remove(id), 3000);
};

const remove = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) toasts.value.splice(index, 1);
};

defineExpose({ add });
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
