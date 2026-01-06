<template>
  <div class="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full mx-4">
    <div class="p-4 border-b bg-primary-50 flex justify-between items-center">
      <h3 class="text-xl font-bold text-gray-800">{{ $t('cashier.payment_method') }}</h3>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="p-6">
      <div class="text-center mb-8">
        <p class="text-gray-500 mb-1">{{ $t('cashier.total') }}</p>
        <p class="text-4xl font-bold text-primary-600">{{ formatCurrency(total) }}</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <button 
          @click="method = 'cash'"
          :class="[
            'p-4 border rounded-xl flex flex-col items-center justify-center transition-all',
            method === 'cash' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:bg-gray-50'
          ]"
        >
          <Banknote class="w-8 h-8 mb-2" />
          <span class="font-medium">نقدي</span>
        </button>
        <button 
          @click="method = 'card'"
          :class="[
            'p-4 border rounded-xl flex flex-col items-center justify-center transition-all',
            method === 'card' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:bg-gray-50'
          ]"
        >
          <CreditCard class="w-8 h-8 mb-2" />
          <span class="font-medium">ماستر كارد</span>
        </button>
        <button 
          v-if="hasCustomer"
          @click="method = 'credit'"
          :class="[
            'p-4 border rounded-xl flex flex-col items-center justify-center transition-all',
            method === 'credit' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:bg-gray-50'
          ]"
        >
          <FileText class="w-8 h-8 mb-2" />
          <span class="font-medium">آجل (دين)</span>
        </button>
      </div>

      <div v-if="method === 'cash'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">المبلغ المدفوع</label>
          <div class="relative">
            <input 
              v-model.number="receivedAmount"
              type="number" 
              class="w-full text-2xl p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 text-center"
              placeholder="0"
            >
          </div>
        </div>
        
        <div class="grid grid-cols-4 gap-2">
          <button v-for="amt in [1000, 5000, 10000, 25000]" :key="amt" 
            @click="receivedAmount = amt"
            class="py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"
          >
            {{ formatCurrency(amt) }}
          </button>
        </div>

        <div v-if="receivedAmount >= total" class="bg-green-50 p-4 rounded-lg flex justify-between items-center">
          <span class="text-green-800 font-medium">المتبقي</span>
          <span class="text-xl font-bold text-green-700">{{ formatCurrency(receivedAmount - total) }}</span>
        </div>
      </div>
    </div>

    <div class="p-4 bg-gray-50 border-t flex gap-3">
      <button 
        @click="processPayment(false)"
        :disabled="method === 'cash' && receivedAmount < total"
        class="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        حفظ فقط
      </button>
      <button 
        @click="processPayment(true)"
        :disabled="method === 'cash' && receivedAmount < total"
        class="flex-1 bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        حفظ وطباعة
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X, Banknote, CreditCard, FileText } from 'lucide-vue-next';
import { formatCurrency } from '../../utils/currency';

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  hasCustomer: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'confirm']);

const method = ref('cash');
const receivedAmount = ref(0);

const processPayment = (shouldPrint = true) => {
  emit('confirm', {
    method: method.value,
    received: method.value === 'cash' ? receivedAmount.value : props.total,
    shouldPrint,
    change: method.value === 'cash' ? Math.max(0, receivedAmount.value - props.total) : 0
  });
};
</script>
