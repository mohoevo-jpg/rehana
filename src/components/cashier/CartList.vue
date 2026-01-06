<template>
  <div class="flex flex-col h-full bg-white shadow-lg border-r border-gray-200">
    <!-- Header -->
    <div class="p-4 border-b bg-gray-50">
      <h2 class="font-bold text-lg text-gray-800 flex items-center">
        <ShoppingCart class="w-5 h-5 ml-2" />
        السلة الحالية
      </h2>
    </div>

    <!-- Items -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <div v-if="items.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400">
        <ShoppingCart class="w-12 h-12 mb-2 opacity-50" />
        <p>{{ $t('cashier.cart_empty') }}</p>
      </div>

      <div 
        v-for="item in items" 
        :key="item.id"
        class="bg-white border rounded-lg p-3 flex justify-between items-center shadow-sm"
      >
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
          <div class="text-sm text-gray-500">
            {{ formatCurrency(item.price) }} × {{ item.quantity }}
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center border rounded-md">
            <button 
              @click="updateQty(item.id, item.quantity + 1)"
              class="px-2 py-1 hover:bg-gray-100 text-green-600"
            >
              <Plus class="w-4 h-4" />
            </button>
            <span class="px-2 font-medium">{{ item.quantity }}</span>
            <button 
              @click="updateQty(item.id, item.quantity - 1)"
              class="px-2 py-1 hover:bg-gray-100 text-red-600"
            >
              <Minus class="w-4 h-4" />
            </button>
          </div>
          
          <div class="font-bold text-gray-800 w-20 text-left">
            {{ formatCurrency(item.price * item.quantity) }}
          </div>
          
          <button 
            @click="removeItem(item.id)"
            class="text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="p-4 bg-gray-50 border-t space-y-2">
      <!-- Customer Selection -->
      <div class="mb-4 pb-4 border-b">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-600 font-medium flex items-center gap-2">
            <User class="w-4 h-4" />
            العميل
          </span>
          <router-link to="/customers" class="text-xs text-primary-600 hover:text-primary-800">
            + إضافة جديد
          </router-link>
        </div>
        <select 
          :value="cartStore.customer?.id || ''" 
          @change="e => selectCustomer(e.target.value)"
          class="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="">عميل نقدي (غير مسجل)</option>
          <option v-for="c in customersStore.customers" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="flex justify-between text-gray-600">
        <span>المجموع الفرعي</span>
        <span>{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="flex justify-between items-center text-gray-600">
        <span class="flex items-center gap-1">
          {{ $t('cashier.discount') }}
          <Tag class="w-4 h-4" />
        </span>
        <div class="relative w-32">
          <input 
            type="number" 
            :value="discount" 
            @input="e => setDiscount(Number(e.target.value))"
            min="0"
            :disabled="isSpecialDiscount"
            class="w-full text-left border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
            placeholder="0"
          />
        </div>
      </div>

      <!-- Special Discount Checkbox -->
      <div class="flex items-center justify-end gap-2 mt-2">
        <label for="specialDiscount" class="text-sm text-gray-700 cursor-pointer select-none">خصم خاص (41.66%)</label>
        <input 
          type="checkbox" 
          id="specialDiscount" 
          v-model="isSpecialDiscount" 
          class="rounded text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
        >
      </div>

      <div class="border-t pt-2 flex justify-between items-center">
        <span class="font-bold text-lg">{{ $t('cashier.total') }}</span>
        <span class="font-bold text-2xl text-primary-600">{{ formatCurrency(total) }}</span>
      </div>

      <div class="flex gap-2 mt-4">
        <button 
          @click="$emit('print')"
          :disabled="items.length === 0"
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer class="w-5 h-5 ml-2" />
          طباعة
        </button>
        <button 
          @click="$emit('checkout')"
          :disabled="items.length === 0"
          class="flex-[2] bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard class="w-5 h-5 ml-2" />
          {{ $t('cashier.pay') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Printer, Tag, User } from 'lucide-vue-next';
import { formatCurrency } from '../../utils/currency';
import { useCartStore } from '../../store/cart';
import { useCustomersStore } from '../../store/customers';

const cartStore = useCartStore();
const customersStore = useCustomersStore();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const total = computed(() => cartStore.total);
const discount = computed(() => cartStore.discount);
const isSpecialDiscount = ref(false);

const applySpecialDiscount = () => {
  const discountAmount = subtotal.value * 0.4166;
  cartStore.setDiscount(Math.floor(discountAmount)); 
};

watch(isSpecialDiscount, (newVal) => {
  if (newVal) {
    applySpecialDiscount();
  } else {
    cartStore.setDiscount(0);
  }
});

watch(subtotal, () => {
  if (isSpecialDiscount.value) {
    applySpecialDiscount();
  }
});

const updateQty = (id, qty) => {
  cartStore.updateQuantity(id, qty);
};

const removeItem = (id) => {
  cartStore.removeFromCart(id);
};

const setDiscount = (amount) => {
  if (amount < 0) amount = 0;
  cartStore.setDiscount(amount);
};

const selectCustomer = (id) => {
  if (!id) {
    cartStore.setCustomer(null);
    return;
  }
  const customer = customersStore.getCustomerById(Number(id));
  cartStore.setCustomer(customer);
};

defineEmits(['checkout']);
</script>
