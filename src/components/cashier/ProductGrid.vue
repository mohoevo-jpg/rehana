<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
    <!-- Search and Filter -->
    <div class="p-4 border-b space-y-3">
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="$t('cashier.search_product')"
          class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          @keyup.enter="handleBarcode"
        >
        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>
      
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            selectedCategory === cat 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Grid -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="filteredProducts.length === 0" class="h-full flex flex-col items-center justify-center text-gray-500">
        <PackageOpen class="w-12 h-12 mb-2 opacity-50" />
        <p>لا توجد منتجات</p>
      </div>
      
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <button 
          v-for="product in filteredProducts" 
          :key="product.id"
          @click="$emit('add-to-cart', product)"
          class="flex flex-col items-center p-3 border rounded-lg hover:border-primary-500 hover:shadow-md transition-all bg-white text-right"
        >
          <div class="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover">
            <Package v-else class="w-10 h-10 text-gray-300" />
          </div>
          <h3 class="font-medium text-sm text-gray-800 line-clamp-2 w-full">{{ product.name }}</h3>
          <span class="mt-1 text-primary-600 font-bold text-sm w-full">{{ formatCurrency(product.price) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Package, PackageOpen } from 'lucide-vue-next';
import { formatCurrency } from '../../utils/currency';

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);

const searchQuery = ref('');
const selectedCategory = ref('الكل');

const categories = computed(() => {
  const cats = new Set(props.products.map(p => p.category));
  return ['الكل', ...cats];
});

const filteredProducts = computed(() => {
  let res = props.products;
  
  if (selectedCategory.value !== 'الكل') {
    res = res.filter(p => p.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.barcode.includes(q)
    );
  }
  
  return res;
});

const handleBarcode = () => {
  // Logic to handle direct barcode scan if needed
  // Usually scanner acts as keyboard input
  const product = props.products.find(p => p.barcode === searchQuery.value);
  if (product) {
    emit('add-to-cart', product);
    searchQuery.value = '';
  }
};
</script>
